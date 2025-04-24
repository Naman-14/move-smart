
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { stripHtml } from "https://esm.sh/string-strip-html@13.4.3";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      useAI = true
    } = input;
    
    console.log('Function parameters:', { manualRun, debug, query, articlesNeeded, targetCategory, useAI });
    
    // Enhanced content generation with Gemini
    async function enhanceWithGemini(title: string, description: string) {
      if (!useAI || !GEMINI_API_KEY) {
        return {
          enhancedContent: description || 'No content available.',
          enhancedSummary: title || 'No summary available.'
        };
      }
      
      try {
        const contentPrompt = `Write a unique, professional article based on this news. Title: "${title}". Description: "${description}"`;
        
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, 
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
          console.error('Gemini API Error:', errorText);
          throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        const generatedContent = result?.candidates?.[0]?.content?.parts?.[0]?.text || description;
        
        return {
          enhancedContent: generatedContent,
          enhancedSummary: title
        };
      } catch (error) {
        console.error('Error enhancing content with Gemini:', error);
        return {
          enhancedContent: description || 'No content available.',
          enhancedSummary: title || 'No summary available.'
        };
      }
    }
    
    // Fetch articles from GNews
    console.log(`Fetching articles from GNews with query: ${query}`);
    const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${articlesNeeded}&token=${GNEWS_API_KEY}`;
    
    const response = await fetch(gnewsUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GNews API error: ${response.status} - ${errorText}`);
    }
    
    const articlesData = await response.json();
    console.log(`Received ${articlesData.articles?.length || 0} articles from GNews`);
    
    // Process and enhance articles
    const processedArticles = [];
    for (const article of articlesData.articles) {
      const { enhancedContent, enhancedSummary } = await enhanceWithGemini(
        article.title, 
        article.description
      );
      
      const articleRecord = {
        title: article.title,
        summary: enhancedSummary,
        content: enhancedContent,
        cover_image_url: article.image || 'https://placehold.co/800x400?text=MoveSmart',
        source_url: article.url,
        category: targetCategory || 'general',
        visible: true,
        tags: ['tech', 'startup']
      };
      
      processedArticles.push(articleRecord);
    }
    
    // Insert articles into Supabase
    const { data, error } = await supabase
      .from('articles')
      .insert(processedArticles)
      .select();
    
    if (error) {
      console.error('Error inserting articles:', error);
      throw error;
    }
    
    console.log(`Successfully inserted ${data.length} articles`);
    
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
