
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { stripHtml } from 'https://esm.sh/string-strip-html@13.4.3'
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    console.log("Edge function invoked: fetch-and-generate-articles");
    
    // Parse request
    let input = {};
    try {
      input = await req.json();
    } catch (e) {
      console.error("Error parsing JSON input:", e);
      input = {};
    }
    
    const { 
      manualRun = false, 
      debug = false, 
      query = 'tech startups', 
      articlesNeeded = 5,
      targetCategory = null, // Category parameter
      useAI = true // Flag to use AI for content enhancement
    } = input;
    
    console.log(`Function parameters: manualRun=${manualRun}, debug=${debug}, query=${query}, articlesNeeded=${articlesNeeded}, targetCategory=${targetCategory}, useAI=${useAI}`);
    
    // Creating a Supabase client
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://uagckghgdqmioejsopzv.supabase.co';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY') || '90e92cf05deecdbbb043dcc040b97c5e';
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyDfPJvFdqt8nQvPnCXHqvQ4wyMynV4FkfM';
    
    // Check for presence of required env variables
    if (!SUPABASE_URL) {
      throw new Error('SUPABASE_URL is not set');
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }

    if (!GNEWS_API_KEY) {
      throw new Error('GNEWS_API_KEY is not set');
    }

    // Initialize Supabase client with proper error handling
    console.log(`Initializing Supabase client with URL: ${SUPABASE_URL}`);
    let supabase;
    
    try {
      supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      if (!supabase) throw new Error('Failed to create Supabase client');
      console.log("Supabase client initialized successfully");
    } catch (supabaseError) {
      console.error("Error initializing Supabase client:", supabaseError);
      throw new Error(`Failed to initialize Supabase client: ${supabaseError.message}`);
    }
    
    // Special handling for /health path
    const url = new URL(req.url);
    if (url.pathname.endsWith('/health')) {
      console.log("Health check requested");
      
      try {
        // Verify Supabase connectivity by making a simple query
        const { data: tablesList, error: tablesError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
          .limit(5);
        
        // Check article table count
        const { count: articleCount, error: countError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });
          
        // Check source_fetches table
        const { data: sourceFetchesData, error: sourceFetchesError } = await supabase
          .from('source_fetches')
          .select('count(*)', { count: 'exact', head: true });
        
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: {
              has_supabase_url: !!SUPABASE_URL,
              has_service_role_key: !!SUPABASE_SERVICE_ROLE_KEY,
              has_gnews_api_key: !!GNEWS_API_KEY,
              has_gemini_api_key: !!GEMINI_API_KEY,
            },
            supabase_connection: !tablesError ? 'working' : 'error',
            tables: tablesList || [],
            database_status: {
              articles: {
                count: articleCount,
                error: countError ? countError.message : null
              },
              source_fetches: {
                exists: !sourceFetchesError,
                error: sourceFetchesError ? sourceFetchesError.message : null
              }
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (healthError) {
        console.error("Error in health check:", healthError);
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Health check failed',
            error: healthError.message
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }
    
    // Log the source fetch
    try {
      // Create source_fetches entry for this run
      const { data: sourceFetch, error: sourceFetchError } = await supabase
        .from('source_fetches')
        .insert({
          source: 'gnews',
          query: query,
          country: 'us',
          status: 'pending'
        })
        .select('id')
        .single();
      
      if (sourceFetchError) {
        console.error("Error logging source fetch:", sourceFetchError);
      } else {
        console.log("Source fetch logged with ID:", sourceFetch.id);
      }
    } catch (e) {
      console.error("Error handling source fetch logging:", e);
      // Continue with the function even if logging fails
    }
    
    // Fetch articles from GNews API with better error handling
    console.log(`Fetching articles from GNews API with query: ${query}`);
    const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=${articlesNeeded}&apikey=${GNEWS_API_KEY}`;
    console.log(`GNews API URL: ${gnewsUrl.replace(GNEWS_API_KEY, 'API_KEY_HIDDEN')}`);
    
    let response;
    try {
      response = await fetch(gnewsUrl);
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`GNews API Error (${response.status}): ${errorBody}`);
        throw new Error(`GNews API error: ${response.status} ${response.statusText} - ${errorBody}`);
      }
    } catch (fetchError) {
      console.error("Network error fetching from GNews:", fetchError);
      throw new Error(`Network error fetching from GNews: ${fetchError.message}`);
    }
    
    // Parse the GNews response
    let articlesData;
    try {
      articlesData = await response.json();
      console.log(`Received ${articlesData.articles?.length || 0} articles from GNews`);
      
      // Log the raw data structure for debugging
      if (debug) {
        console.log("Example article structure:", articlesData.articles?.[0] ? 
          JSON.stringify(articlesData.articles[0]) : "No articles received");
      }
    } catch (parseError) {
      console.error("Error parsing GNews response:", parseError);
      throw new Error(`Error parsing GNews response: ${parseError.message}`);
    }
    
    // Validate the response
    if (!articlesData.articles || articlesData.articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No articles returned from GNews API',
          query: query
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Save the raw fetched data for backup/debugging
    try {
      await supabase
        .from('source_fetches')
        .update({ 
          articles_fetched: articlesData.articles.length,
          raw_data: articlesData,
          status: 'fetched'
        })
        .eq('source', 'gnews')
        .eq('query', query)
        .order('created_at', { ascending: false })
        .limit(1);
    } catch (updateError) {
      console.error("Error saving raw data to source_fetches:", updateError);
      // Continue processing anyway
    }
    
    // Define available categories
    const categories = ['startups', 'funding', 'ai', 'fintech', 'case-studies', 'blockchain', 'climate-tech'];
    
    // If no target category is provided, use the first one as default
    const category = targetCategory || categories[Math.floor(Math.random() * categories.length)];
    
    // Function to enhance content with Gemini AI
    async function enhanceWithGemini(title, description, content, category) {
      if (!useAI || !GEMINI_API_KEY) {
        console.log("AI enhancement skipped: useAI=", useAI, "has Gemini key=", !!GEMINI_API_KEY);
        return { 
          enhancedContent: content ? `<p>${description || ''}</p><p>${content || ''}</p>` : `<p>${description || 'No content available.'}</p>`,
          enhancedSummary: description || 'No summary available.' 
        };
      }
      
      try {
        console.log("Enhancing content with Gemini for:", title.substring(0, 30) + "...");
        
        // Create prompts for content and summary
        const contentPrompt = `
        You are a professional tech journalist writing for MoveSmart, a tech startup news platform.
        
        Here's a news article about "${title}" with this description: "${description}".
        
        Please rewrite and expand this into a well-structured, original article about ${category}-related tech news.
        
        Add details, insights, and industry context where appropriate.
        Structure the article with paragraphs, subheadings if needed.
        Include a strong introduction and conclusion.
        Write in a professional, journalistic style.
        Format the output as HTML with proper paragraph tags.
        DO NOT mention or cite sources or indicate that this is based on another article.
        DO NOT include comments about AI generating the content.
        DO NOT use phrases like "according to reports" or similar.
        
        Original content: "${content || description}"
        `;
        
        const summaryPrompt = `
        Create a concise 1-2 sentence summary of the following article title: "${title}"
        
        The summary should be compelling, highlight the key point, and entice readers to read more.
        DO NOT use phrases like "this article discusses" or similar meta-references.
        Keep it under 200 characters if possible.
        
        Article description: "${description}"
        `;
        
        // Call Gemini API for content generation
        let contentResponse;
        try {
          contentResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: contentPrompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  topP: 0.8,
                  topK: 40
                }
              })
            }
          );
          
          if (!contentResponse.ok) {
            const contentErrorText = await contentResponse.text();
            console.error("Gemini API Error for content:", contentErrorText);
            throw new Error(`Gemini API error for content: ${contentResponse.status} - ${contentErrorText}`);
          }
        } catch (contentFetchError) {
          console.error("Network error calling Gemini API for content:", contentFetchError);
          throw new Error(`Network error calling Gemini API for content: ${contentFetchError.message}`);
        }
        
        // Parse content response
        let contentResult;
        try {
          contentResult = await contentResponse.json();
        } catch (contentParseError) {
          console.error("Error parsing Gemini content response:", contentParseError);
          throw new Error(`Error parsing Gemini content response: ${contentParseError.message}`);
        }
        
        const enhancedContent = contentResult?.candidates?.[0]?.content?.parts?.[0]?.text || 
                              "No content was generated. Please try again later.";
        
        // Call Gemini API for summary generation
        let summaryResponse;
        try {
          summaryResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: summaryPrompt }] }],
                generationConfig: {
                  temperature: 0.4,
                  topP: 0.95,
                  maxOutputTokens: 100
                }
              })
            }
          );
          
          if (!summaryResponse.ok) {
            const summaryErrorText = await summaryResponse.text();
            console.error("Gemini API Error for summary:", summaryErrorText);
            throw new Error(`Gemini API error for summary: ${summaryResponse.status} - ${summaryErrorText}`);
          }
        } catch (summaryFetchError) {
          console.error("Network error calling Gemini API for summary:", summaryFetchError);
          throw new Error(`Network error calling Gemini API for summary: ${summaryFetchError.message}`);
        }
        
        // Parse summary response
        let summaryResult;
        try {
          summaryResult = await summaryResponse.json();
        } catch (summaryParseError) {
          console.error("Error parsing Gemini summary response:", summaryParseError);
          throw new Error(`Error parsing Gemini summary response: ${summaryParseError.message}`);
        }
        
        const enhancedSummary = summaryResult?.candidates?.[0]?.content?.parts?.[0]?.text || 
                               "No summary was generated. Please try again later.";
        
        console.log("AI enhancement successful with Gemini");
        
        // Format the content as HTML if it's not already
        const formattedContent = enhancedContent.includes('<p>') 
          ? enhancedContent 
          : enhancedContent.split('\n\n').map(para => `<p>${para}</p>`).join('');
        
        return {
          enhancedContent: formattedContent,
          enhancedSummary: enhancedSummary.replace(/"/g, '')
        };
      } catch (error) {
        console.error("Error enhancing content with Gemini:", error);
        // Return basic content as fallback
        return { 
          enhancedContent: content ? `<p>${description || ''}</p><p>${content || ''}</p>` : `<p>${description || 'No content available.'}</p>`,
          enhancedSummary: description || 'No summary available.'
        };
      }
    }
    
    // Transform and process articles with better error handling
    const processedArticles = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const article of articlesData.articles) {
      try {
        console.log(`Processing article: "${article.title.substring(0, 30)}..."`);
        
        // Generate a slug from the title with a unique identifier
        const slug = article.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50) + '-' + uuidv4().substring(0, 8);
        
        // Clean content if present
        const cleanContent = article.content 
          ? stripHtml(article.content).result 
          : article.description || 'No content available for this article.';
        
        // Add AI enhancement with Gemini
        const { enhancedContent, enhancedSummary } = await enhanceWithGemini(
          article.title,
          article.description,
          cleanContent,
          category
        );
        
        // Generate tags based on title, content, and category
        const keywordSets = {
          'startups': ['startup', 'entrepreneurship', 'business', 'founder', 'innovation'],
          'funding': ['venture capital', 'investment', 'funding', 'series a', 'investor'],
          'ai': ['artificial intelligence', 'machine learning', 'ai', 'automation', 'neural network'],
          'fintech': ['financial technology', 'banking', 'payment', 'finance', 'digital payment'],
          'case-studies': ['case study', 'business strategy', 'growth', 'market analysis', 'success story'],
          'blockchain': ['blockchain', 'cryptocurrency', 'web3', 'token', 'decentralized'],
          'climate-tech': ['climate', 'sustainability', 'clean energy', 'green tech', 'carbon']
        };
        
        // Generate relevant tags based on category and content
        const baseKeywords = keywordSets[category] || ['technology', 'innovation', 'business'];
        const titleWords = article.title.toLowerCase();
        const descWords = article.description?.toLowerCase() || '';
        
        // Check which keywords are relevant based on title and description
        const relevantTags = baseKeywords.filter(tag => 
          titleWords.includes(tag) || descWords.includes(tag)
        );
        
        // Always include at least 2 tags
        const tags = relevantTags.length >= 2 ? relevantTags : [
          baseKeywords[0], 
          baseKeywords[1]
        ];
        
        // Ensure unique tags
        const uniqueTags = [...new Set(tags)];
        
        // Calculate estimated reading time
        const wordCount = enhancedContent.split(/\s+/).length;
        const readingTime = Math.max(1, Math.round(wordCount / 200)); // Avg reading speed 200wpm
        
        // Generate random author names for diversity
        const authorNames = [
          "Emma Johnson", "Michael Chen", "Sarah Patel", "David Okonkwo", 
          "Aisha Rahman", "Tomas Rodriguez", "Zoe Williams", "Ryan Kim", 
          "Maya Gupta", "James Wilson", "Leila Martinez", "Noah Taylor"
        ];
        const author = authorNames[Math.floor(Math.random() * authorNames.length)];
        
        // Prepare the article for insertion
        const articleRecord = {
          title: article.title,
          slug,
          summary: enhancedSummary,
          content: enhancedContent,
          cover_image_url: article.image || 'https://placehold.co/800x400?text=MoveSmart',
          tags: uniqueTags.slice(0, 5),
          category,
          visible: true,
          source_url: article.url,
          author,
          reading_time: readingTime
        };
        
        processedArticles.push(articleRecord);
        successCount++;
        
        console.log(`Processed article: "${article.title.substring(0, 30)}..." with category ${category}`);
      } catch (articleError) {
        console.error(`Error processing article: ${articleError}`);
        errorCount++;
      }
    }
    
    console.log(`Processed ${processedArticles.length} articles for insertion (${successCount} success, ${errorCount} errors)`);
    
    if (processedArticles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No articles could be processed',
          query: query
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Insert articles into database
    let insertedData;
    try {
      const { data, error: insertError } = await supabase
        .from('articles')
        .insert(processedArticles)
        .select();
      
      if (insertError) {
        console.error("Error inserting articles:", insertError);
        throw insertError;
      }
      
      insertedData = data;
      console.log(`Successfully inserted ${insertedData.length} articles`);
    } catch (dbError) {
      console.error("Database error inserting articles:", dbError);
      // Try inserting one by one to find problematic records
      insertedData = [];
      for (const article of processedArticles) {
        try {
          const { data, error } = await supabase
            .from('articles')
            .insert(article)
            .select('id, title')
            .single();
          
          if (error) {
            console.error(`Error inserting article "${article.title}":`, error);
          } else {
            insertedData.push(data);
            console.log(`Successfully inserted article: ${data.title} (${data.id})`);
          }
        } catch (singleInsertError) {
          console.error(`Exception inserting article "${article.title}":`, singleInsertError);
        }
      }
    }
    
    // Update the source fetch record with results
    try {
      const { error: updateError } = await supabase
        .from('source_fetches')
        .update({
          articles_processed: insertedData.length,
          status: 'success'
        })
        .eq('source', 'gnews')
        .eq('query', query)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (updateError) {
        console.error("Error updating source fetch:", updateError);
      }
    } catch (e) {
      console.error("Error updating source fetch record:", e);
      // Continue anyway
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully fetched, enhanced, and inserted ${insertedData?.length || 0} articles`,
        articles: insertedData?.map((a: any) => ({ id: a.id, title: a.title, category: a.category })) || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error("Fatal error in edge function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
});
