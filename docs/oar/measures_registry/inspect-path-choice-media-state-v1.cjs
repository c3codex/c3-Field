require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const reader = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  console.log("=== path-choice media role state ===\n")

  const { data, error } = await reader
    .from("measures_media_map")
    .select("media_role, storage_bucket, storage_path, is_active")
    .eq("campaign_key", "agents_of_chaos_integrity_governance")
    .in("media_role", ["left_hero_fracture", "right_measured_hero", "path_choice_background"])

  if (error) throw error
  console.log(JSON.stringify(data, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
