import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
} else {
  console.warn('[Supabase] Env vars not set — running in local-only mode.')
}

export const isSupabaseConfigured = supabase !== null
