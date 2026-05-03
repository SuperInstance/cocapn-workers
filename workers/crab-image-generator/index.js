/**
 * Crab Image Generator — Cloudflare Worker
 * Generates purple pincher hermit crab images with steampunk lighthouse radar vibes
 * Uses Cloudflare Workers AI StabilityAI XL
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Get prompt from query param or use default
    const prompt = url.searchParams.get('prompt') 
      || url.searchParams.get('p')
      || 'purple pincher hermit crab steampunk shell lighthouse radar rings keeper';
    
    // Get style options
    const steps = parseInt(url.searchParams.get('steps') || '20');
    const width = parseInt(url.searchParams.get('width') || '1024');
    const height = parseInt(url.searchParams.get('height') || '1024');
    
    // CORS headers for cross-domain access
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'GET' && request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    try {
      // Get account ID from environment
      const accountId = env.ACCOUNT_ID || '049ff5e84ecf636b53b162cbb580aae6';
      
      // Call Cloudflare Workers AI StabilityAI
      const aiResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1-0`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.CF_API_TOKEN}`
          },
          body: JSON.stringify({
            prompt: prompt,
            num_steps: Math.min(steps, 30),
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
          })
        }
      );

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        return new Response(JSON.stringify({ 
          error: 'Image generation failed',
          status: aiResponse.status,
          detail: errText
        }), {
          status: aiResponse.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const result = await aiResponse.json();
      
      if (result.errors) {
        return new Response(JSON.stringify({ 
          error: 'Cloudflare AI error',
          details: result.errors
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Return the image data
      return new Response(JSON.stringify({
        success: true,
        prompt: prompt,
        model: '@cf/stabilityai/stable-diffusion-xl-base-1-0',
        steps: steps,
        image: result.result?.image || result.image || result.images?.[0],
        revised_prompt: result.result?.revised_prompt || null,
        timing: {
          generated_at: new Date().toISOString(),
          worker: 'crab-image-generator v0.1.0',
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (e) {
      return new Response(JSON.stringify({ 
        error: 'Worker error',
        message: e.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};
