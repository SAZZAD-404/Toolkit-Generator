// Supabase Edge Function to push code changes to GitHub
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filePath, content, commitMessage } = await req.json()

    // Get GitHub token from environment
    const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN')
    const GITHUB_USERNAME = Deno.env.get('GITHUB_USERNAME') || 'SAZZAD-404'
    const GITHUB_REPO = Deno.env.get('GITHUB_REPO') || 'Toolkit-Generator'

    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token not configured')
    }

    // Get current file SHA (required for updating)
    const getFileUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`
    
    const getResponse = await fetch(getFileUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Supabase-Edge-Function'
      }
    })

    let sha = null
    if (getResponse.ok) {
      const fileData = await getResponse.json()
      sha = fileData.sha
    }

    // Encode content to base64
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const base64Content = btoa(String.fromCharCode(...data))

    // Push to GitHub
    const pushResponse = await fetch(getFileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Edge-Function'
      },
      body: JSON.stringify({
        message: commitMessage || `Update ${filePath}`,
        content: base64Content,
        sha: sha, // Include SHA if file exists
        branch: 'main'
      })
    })

    if (!pushResponse.ok) {
      const error = await pushResponse.text()
      throw new Error(`GitHub API error: ${error}`)
    }

    const result = await pushResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully pushed to GitHub',
        commit: result.commit
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
