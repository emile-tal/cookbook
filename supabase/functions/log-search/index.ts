import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req: Request) => {
  const { search_term, user_id } = await req.json()

  if (!search_term || typeof search_term !== 'string') {
    return new Response('Invalid search term', { status: 400 })
  }

  if (!user_id || typeof user_id !== 'string') {
    return new Response('Invalid user ID', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase.from('searchlogs').insert({
    user_id,
    search_term,
  })

  if (error) {
    console.error(error)
    return new Response('Failed to log search', { status: 500 })
  }

  return new Response('Search logged successfully', { status: 200 })
})
