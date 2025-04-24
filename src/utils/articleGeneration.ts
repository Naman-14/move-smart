import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

// Function to generate content with Gemini
async function generateWithGemini(promptText: string) {
  const apiKey = 'AIzaSyDfPJvFdqt8nQvPnCXHqvQ4wyMynV4FkfM';
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating content.";
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    return "Failed to generate content. Please try again later.";
  }
}

export const triggerArticleGeneration = async () => {
  try {
    // Start with clear beginning marker for logs
    console.log('=== ARTICLE GENERATION START ===');
    console.log('triggerArticleGeneration called with manualRun: true');
    
    // Log the supabase client state (without sensitive info)
    console.log('Supabase client initialized:', !!supabase);
    
    // Add version information for debugging
    console.log('Client version info:', {
      timestamp: new Date().toISOString(),
      clientUrl: SUPABASE_URL,
      functionUrl: `${SUPABASE_URL}/functions/v1/fetch-and-generate-articles`
    });
    
    // Detailed pre-invocation logging
    console.log('About to invoke fetch-and-generate-articles edge function...');
    
    // Generate content for each category to ensure all sections are populated
    const categories = [
      'startups', 'funding', 'ai', 'fintech', 'case-studies', 'blockchain', 'climate-tech'
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each category with specific sources to generate diverse content
    for (const category of categories) {
      let query = '';
      
      // Select appropriate sources and queries based on category
      switch(category) {
        case 'startups':
          query = 'TechCrunch startup OR YCombinator startup';
          break;
        case 'funding':
          query = 'venture capital funding OR series funding';
          break;
        case 'ai':
          query = 'artificial intelligence startup OR AI innovation';
          break;
        case 'fintech':
          query = 'financial technology OR digital banking';
          break;
        case 'case-studies':
          query = 'startup case study OR business success story';
          break;
        case 'blockchain':
          query = 'blockchain startup OR web3 technology';
          break;
        case 'climate-tech':
          query = 'climate technology OR sustainable innovation';
          break;
        default:
          query = 'tech startup innovation';
      }
      
      console.log(`Generating content for category "${category}" with query: "${query}"`);
      
      try {
        // For each category, generate articles to ensure good content coverage
        const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
          body: { 
            manualRun: true,
            debug: true,
            clientTimestamp: new Date().toISOString(),
            query: query,
            targetCategory: category,
            articlesNeeded: 3, // Request 3 articles per category for good content volume
            useAI: true // Enable AI content enhancement
          },
        });
        
        if (error) {
          console.error(`Error generating ${category} articles:`, error);
          errorCount++;
        } else if (data) {
          console.log(`Successfully generated ${category} articles:`, 
            data.articles?.length || 'No articles data');
          successCount += (data.articles?.length || 0);
        }
        
        // Small delay between category requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (categoryError) {
        console.error(`Error processing category ${category}:`, categoryError);
        errorCount++;
      }
    }
    
    console.log(`=== ARTICLE GENERATION COMPLETE: Generated ${successCount} new articles, ${errorCount} errors ===`);
    return { 
      success: true, 
      articlesGenerated: successCount,
      errorsEncountered: errorCount
    };
  } catch (error) {
    // Enhanced error logging with stack trace
    console.error('=== ARTICLE GENERATION FAILED ===');
    console.error('Error in triggerArticleGeneration:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
};

// Function to generate a single article from a news headline
export async function generateArticleFromNews(newsTitle: string, category: string = 'general') {
  const GEMINI_API_KEY = 'AIzaSyDfPJvFdqt8nQvPnCXHqvQ4wyMynV4FkfM';
  
  try {
    const prompt = `Write a detailed, professional, original article based on this headline: "${newsTitle}". 
Focus on the ${category} industry. Ensure the article is engaging, informative, and plagiarism-free.
Structure it with a clear introduction, body, and conclusion.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            maxOutputTokens: 1024
          }
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?[0]?.text || null;
  } catch (err) {
    console.error("Gemini Error:", err);
    return null;
  }
}
