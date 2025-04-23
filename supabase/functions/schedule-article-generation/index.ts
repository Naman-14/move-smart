
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!,
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log('=== SCHEDULED ARTICLE GENERATION START ===');
    console.log('Environment check:');
    console.log('- SUPABASE_URL present:', !!SUPABASE_URL);
    console.log('- SUPABASE_SERVICE_ROLE_KEY present:', !!SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify the supabase client is initialized properly
    console.log('- Supabase client initialized:', !!supabase);
    
    // URL construction check
    const functionUrl = `${SUPABASE_URL}/functions/v1/fetch-and-generate-articles`;
    console.log('Constructing URL for function call:', functionUrl);

    // Invoke the fetch-and-generate-articles function with scheduled flag and diagnostic info
    const requestBody = JSON.stringify({
      manualRun: false,
      scheduled: true,
      diagnostics: {
        timestamp: new Date().toISOString(),
        source: 'schedule-article-generation',
      }
    });
    
    console.log('Request body:', requestBody);
    
    console.log('About to fetch the fetch-and-generate-articles endpoint...');
    const response = await fetch(
      functionUrl,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      }
    );
    
    console.log('Fetch completed with status:', response.status);
    console.log('Response status text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to trigger article generation. Status:', response.status);
      console.error('Error response body:', errorText);
      throw new Error(`Failed to trigger article generation (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('Parsed JSON response:', result);

    console.log('=== SCHEDULED ARTICLE GENERATION COMPLETE ===');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully scheduled article generation',
        timestamp: new Date().toISOString(),
        result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('=== SCHEDULED ARTICLE GENERATION FAILED ===');
    console.error('Error in schedule-article-generation:', error);
    
    // Get detailed error information
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
    
    console.error('Error details:', errorDetails);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        errorDetails,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
