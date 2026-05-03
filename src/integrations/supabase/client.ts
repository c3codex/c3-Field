import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigError = !supabaseUrl
  ? "VITE_SUPABASE_URL is required"
  : !supabaseAnonKey
    ? "VITE_SUPABASE_ANON_KEY is required"
    : null

export const supabase = createClient(
  supabaseUrl || "https://missing-supabase-config.invalid",
  supabaseAnonKey || "missing-supabase-anon-key",
)
