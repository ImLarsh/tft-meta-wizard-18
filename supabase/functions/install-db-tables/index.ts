
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      // Create client with Auth context of the function
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Create tables if they don't exist
    // tft_comps table
    const { error: compsError } = await supabaseClient.rpc('create_tft_comps_table_if_not_exists')
    if (compsError) {
      console.error('Error creating tft_comps table:', compsError)
      
      // Try direct SQL as a fallback
      const { error: directSqlError } = await supabaseClient.query(`
        CREATE TABLE IF NOT EXISTS public.tft_comps (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          comps jsonb NOT NULL DEFAULT '[]'::jsonb,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
        );
      `)
      
      if (directSqlError) {
        throw directSqlError
      }
    }

    // tft_trait_mappings table
    const { error: mappingsError } = await supabaseClient.rpc('create_tft_trait_mappings_table_if_not_exists')
    if (mappingsError) {
      console.error('Error creating tft_trait_mappings table:', mappingsError)
      
      // Try direct SQL as a fallback
      const { error: directSqlError } = await supabaseClient.query(`
        CREATE TABLE IF NOT EXISTS public.tft_trait_mappings (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          mappings jsonb NOT NULL DEFAULT '{}'::jsonb,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
        );
      `)
      
      if (directSqlError) {
        throw directSqlError
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'TFT tables created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating tables:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
