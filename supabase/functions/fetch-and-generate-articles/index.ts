
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { stripHtml } from "https://esm.sh/string-strip-html@13.4.3";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Top-level try-catch to handle any unexpected errors
try {
  serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      console.log('=== ARTICLE GENERATION START ===');
      
      // Get environment variables
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://uagckghgdqmioejsopzv.supabase.co';
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY') || '90e92cf05deecdbbb043dcc040b97c5e';
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyDfPJvFdqt8nQvPnCXHqvQ4wyMynV4FkfM';
      
      if (!SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
      }
      
      // Initialize Supabase client
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Parse input parameters
      const input = await req.json();
      const { 
        manualRun = false, 
        debug = false, 
        query = 'tech startups', 
        articlesNeeded = 5,
        targetCategory = null,
        useAI = true,
        clientTimestamp = null
      } = input;
      
      console.log('Function parameters:', { manualRun, debug, query, articlesNeeded, targetCategory, useAI, clientTimestamp });
      
      // Log function execution to our tracking table
      try {
        const { error: logError } = await supabase
          .from('source_fetches')
          .insert({
            source: 'gnews',
            query: query,
            status: 'started',
            params: { query, articlesNeeded, targetCategory }
          });
        
        if (logError) {
          console.warn('Could not log execution start to source_fetches table:', logError);
          // Continue execution even if logging fails
        }
      } catch (logErr) {
        console.warn('Error logging execution start:', logErr);
        // Continue execution even if logging fails
      }
      
      let fetchId: string | null = null;
      
      // utility function to delay execution
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Enhanced content generation with Gemini
      async function enhanceWithGemini(title: string, description: string, category: string) {
        if (!useAI || !GEMINI_API_KEY) {
          return {
            enhancedContent: description || 'No content available.',
            enhancedSummary: title || 'No summary available.'
          };
        }
        
        try {
          const contentPrompt = `
Write a professional, original, and engaging article about the following topic in the ${category} industry:
Title: "${title}"
Base information: "${description}"

The article should:
1. Be detailed and informative (at least 800 words)
2. Include relevant industry insights
3. Be structured with clear sections
4. Be engaging and reader-friendly
5. Be completely plagiarism-free
6. End with a thoughtful conclusion

Format the article with proper HTML paragraphs using <p> tags and headings using <h2> and <h3> tags.
          `;
          
          console.log(`Sending Gemini prompt for "${title}" in category "${category}"`);
          
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, 
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
                  maxOutputTokens: 2048
                }
              })
            }
          );
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Gemini API Error for "${title}": ${response.status} - ${errorText}`);
            
            // Log error to database
            try {
              await supabase.from('generation_errors').insert({
                category: category,
                message: `Gemini API Error: ${response.status}`,
                stack: errorText
              });
            } catch (e) {
              console.error('Failed to log error to generation_errors table:', e);
            }
            
            if (response.status === 429) {
              // Rate limit hit - wait and retry once with simpler prompt
              await delay(2000);
              
              const fallbackPrompt = `Write a brief article about: ${title}. Keep it concise but informative.`;
              
              console.log(`Retrying with simplified prompt for "${title}"`);
              
              const retryResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, 
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: fallbackPrompt }] }],
                    generationConfig: {
                      temperature: 0.5,
                      maxOutputTokens: 1024
                    }
                  })
                }
              );
              
              if (retryResponse.ok) {
                const fallbackResult = await retryResponse.json();
                const fallbackContent = fallbackResult?.candidates?.[0]?.content?.parts?.[0]?.text || description;
                
                return {
                  enhancedContent: fallbackContent,
                  enhancedSummary: title
                };
              }
            }
            
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
          }
          
          const result = await response.json();
          const generatedContent = result?.candidates?.[0]?.content?.parts?.[0]?.text || description;
          
          // Generate a more engaging summary
          const summaryPrompt = `Write an engaging summary (maximum 2 sentences) for this article title: "${title}"`;
          
          const summaryResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: summaryPrompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 256
                }
              })
            }
          );
          
          let enhancedSummary = title;
          
          if (summaryResponse.ok) {
            const summaryResult = await summaryResponse.json();
            enhancedSummary = summaryResult?.candidates?.[0]?.content?.parts?.[0]?.text || title;
          }
          
          return {
            enhancedContent: generatedContent,
            enhancedSummary: enhancedSummary
          };
        } catch (error) {
          console.error(`Error enhancing content with Gemini for "${title}":`, error);
          
          // Log error to database
          try {
            await supabase.from('generation_errors').insert({
              category: category,
              message: `Content enhancement error: ${error.message}`,
              stack: error.stack
            });
          } catch (e) {
            console.error('Failed to log error to generation_errors table:', e);
          }
          
          // Fallback to original content
          return {
            enhancedContent: `<p>${description || 'No content available.'}</p>`,
            enhancedSummary: title || 'No summary available.'
          };
        }
      }
      
      // Self-healing retry function for fetching articles
      async function fetchWithRetry(url: string, retries = 1) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`GNews API error: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          if (retries <= 0) throw error;
          
          console.warn(`Retrying GNews API fetch after failure: ${error.message}`);
          await delay(5000); // Wait 5 seconds before retry
          return fetchWithRetry(url, retries - 1);
        }
      }
      
      // Fetch articles from GNews with retry capability
      console.log(`Fetching articles from GNews with query: ${query}`);
      const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${articlesNeeded}&token=${GNEWS_API_KEY}`;
      
      let articlesData;
      try {
        articlesData = await fetchWithRetry(gnewsUrl, 1);
        console.log(`Received ${articlesData.articles?.length || 0} articles from GNews`);
      } catch (error) {
        // Update source_fetches with error
        try {
          await supabase
            .from('source_fetches')
            .update({
              status: 'error',
              response_data: { error: error.message },
              completed_at: new Date().toISOString()
            })
            .eq('id', fetchId);
        } catch (e) {
          console.error('Failed to update source_fetches with error:', e);
        }
        
        // Log detailed error for debugging
        try {
          await supabase
            .from('logs')
            .insert({
              level: 'error',
              category: 'gnews_fetch',
              message: `GNews API fetch failed: ${error.message}`,
              details: { error: error.stack, query }
            });
        } catch (logError) {
          console.error('Failed to log error to logs table:', logError);
        }
        
        throw new Error(`GNews API error: ${error.message}`);
      }
      
      // Update source_fetches with success
      try {
        const { data: fetchLog } = await supabase
          .from('source_fetches')
          .update({
            status: 'fetched',
            response_data: { count: articlesData.articles?.length || 0 },
            completed_at: new Date().toISOString()
          })
          .eq('source', 'gnews')
          .order('created_at', { ascending: false })
          .limit(1)
          .select()
          .single();
        
        if (fetchLog) {
          fetchId = fetchLog.id;
        }
      } catch (e) {
        console.error('Failed to update source_fetches with success:', e);
      }
      
      // Process and enhance articles
      const processedArticles = [];
      for (const article of articlesData.articles) {
        // Generate slug from title
        const slug = article.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-')
          .substring(0, 60) + '-' + Math.floor(Math.random() * 1000);
        
        // Extract tags from content
        const extractTags = (title, description, category) => {
          const combinedText = `${title} ${description}`.toLowerCase();
          const categoryTags = {
            'startups': ['startup', 'innovation', 'entrepreneur', 'venture', 'business'],
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network'],
            'funding': ['funding', 'investment', 'vc', 'venture capital', 'series'],
            'fintech': ['fintech', 'financial', 'banking', 'payment', 'blockchain'],
            'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3'],
            'climate-tech': ['climate', 'sustainability', 'green', 'renewable', 'clean energy'],
            'case-studies': ['case study', 'success story', 'business case', 'analysis']
          };
          
          // Start with category-specific tags
          const possibleTags = categoryTags[category] || categoryTags['startups'];
          const tags = [];
          
          // Add tags that actually appear in the text
          possibleTags.forEach(tag => {
            if (combinedText.includes(tag)) {
              tags.push(tag);
            }
          });
          
          // Add the category as a tag if it's not already included
          if (!tags.includes(category)) {
            tags.push(category);
          }
          
          // Add 'tech' as a general tag if we have fewer than 3 tags
          if (tags.length < 3 && !tags.includes('tech')) {
            tags.push('tech');
          }
          
          return tags;
        };
        
        try {
          const { enhancedContent, enhancedSummary } = await enhanceWithGemini(
            article.title, 
            article.description,
            targetCategory || 'general'
          );
          
          const tags = extractTags(article.title, article.description, targetCategory);
          
          // Calculate estimated reading time (rough estimate: 200 words per minute)
          const wordCount = enhancedContent?.split(/\s+/)?.length || 0;
          const readingTime = Math.max(1, Math.ceil(wordCount / 200));
          
          const articleRecord = {
            title: article.title,
            summary: enhancedSummary,
            content: enhancedContent,
            cover_image_url: article.image || 'https://placehold.co/800x400?text=MoveSmart',
            source_url: article.url,
            category: targetCategory || 'general',
            visible: true,
            tags: tags,
            reading_time: readingTime,
            author: 'MoveSmart AI'
          };
          
          processedArticles.push(articleRecord);
        } catch (processingError) {
          console.error(`Error processing article "${article.title}":`, processingError);
          
          // Log detailed error
          try {
            await supabase
              .from('logs')
              .insert({
                level: 'error',
                category: 'article_processing',
                message: `Article processing failed: ${processingError.message}`,
                details: { 
                  articleTitle: article.title,
                  error: processingError.stack, 
                  category: targetCategory 
                }
              });
          } catch (logError) {
            console.error('Failed to log error:', logError);
          }
        }
      }
      
      if (processedArticles.length === 0) {
        const errorMsg = 'No articles were processed successfully';
        console.error(errorMsg);
        
        // Update source_fetches with error
        try {
          await supabase
            .from('source_fetches')
            .update({
              status: 'error',
              response_data: { error: errorMsg },
              completed_at: new Date().toISOString()
            })
            .eq('id', fetchId);
        } catch (e) {
          console.error('Failed to update source_fetches with error:', e);
        }
        
        throw new Error(errorMsg);
      }
      
      // Insert articles into Supabase
      const { data, error } = await supabase
        .from('articles')
        .insert(processedArticles)
        .select();
      
      if (error) {
        console.error('Error inserting articles:', error);
        
        // Update source_fetches with error
        try {
          await supabase
            .from('source_fetches')
            .update({
              status: 'error',
              response_data: { error: error.message },
              completed_at: new Date().toISOString()
            })
            .eq('id', fetchId);
        } catch (e) {
          console.error('Failed to update source_fetches with error:', e);
        }
        
        throw error;
      }
      
      console.log(`Successfully inserted ${data.length} articles`);
      
      // Update source_fetches with completion
      try {
        await supabase
          .from('source_fetches')
          .update({
            status: 'completed',
            articles_generated: data.length,
            completed_at: new Date().toISOString()
          })
          .eq('id', fetchId);
      } catch (e) {
        console.error('Failed to update source_fetches with completion:', e);
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully fetched and inserted ${data.length} articles`,
          articles: data
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('=== ARTICLE GENERATION FAILED ===');
      console.error('Error:', error);
      
      // Create a logs entry for the error
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') || 'https://uagckghgdqmioejsopzv.supabase.co',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        );
        
        await supabase
          .from('logs')
          .insert({
            level: 'error',
            category: 'article_generation',
            message: error.message,
            details: {
              stack: error.stack,
              timestamp: new Date().toISOString()
            }
          });
      } catch (logError) {
        console.error('Failed to log error to database:', logError);
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          details: error.stack
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  });
} catch (topLevelError) {
  console.error('Critical edge function error:', topLevelError);
  
  serve((_req) => {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Edge function initialization failed',
        details: topLevelError.message
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 500,
      }
    );
  });
}
