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
  console.log("=== eval_passage media roles and metadata ===\n")

  // All media roles for the campaign
  const { data: allMedia, error: mediaError } = await reader
    .from("measures_media_map")
    .select("media_role, storage_bucket, storage_path, mime_type, is_active")
    .eq("campaign_key", "agents_of_chaos_integrity_governance")
    .order("media_role")

  if (mediaError) throw mediaError

  console.log("--- All media roles in campaign ---")
  for (const row of allMedia) {
    console.log(`  ${row.is_active ? "[active]" : "[held] "} ${row.media_role} | ${row.mime_type ?? "?"} | ${row.storage_path}`)
  }

  console.log("\n--- eval_passage encounter metadata ---")
  const { data: rows, error: encError } = await reader
    .from("measures_encounter_def")
    .select("encounter_key, display_title, metadata")
    .eq("encounter_key", "eval_passage")

  if (encError) throw encError
  const row = rows[0]
  if (!row) {
    console.log("MISSING: eval_passage row not found")
    return
  }

  const meta = row.metadata ?? {}
  console.log(`display_title: ${row.display_title}`)
  console.log(`renderer: ${meta.renderer ?? "(null)"}`)
  console.log(`media_contract: ${JSON.stringify(meta.media_contract ?? null, null, 2)}`)
  console.log(`media_roles: ${JSON.stringify(meta.media_roles ?? null, null, 2)}`)
  console.log(`all metadata keys: ${Object.keys(meta).join(", ")}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
