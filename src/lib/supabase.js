import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

// Warn in dev if env vars are missing
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
  console.warn('[Thrift Aura] Supabase env vars missing — running in offline/sample-data mode.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
