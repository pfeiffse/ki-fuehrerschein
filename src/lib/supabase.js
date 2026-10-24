// ============================================================
// KI-Führerschein · Supabase Client
// ============================================================
// WICHTIG: Umgebungsvariablen in .env.local eintragen:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Umgebungsvariablen fehlen. ' +
    'Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in .env.local eintragen.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')