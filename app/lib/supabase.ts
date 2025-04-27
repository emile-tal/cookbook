import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '',
)

export default supabase
