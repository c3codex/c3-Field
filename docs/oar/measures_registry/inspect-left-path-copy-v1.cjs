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

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  console.log("=== Left Path Copy Full Inspection ===\n")

  const keys = ["eval_passage", "connect_src", "measures_assessment", "measures_phases_reveal"]

  for (const key of keys) {
    const rows = assertOk(
      await reader
        .from("measures_encounter_def")
        .select("encounter_key, is_active, display_title, metadata")
        .eq("encounter_key", key),
      `read ${key}`,
    )
    const row = rows[0]
    if (!row) {
      console.log(`${key}: NOT FOUND`)
      continue
    }

    const meta = row.metadata ?? {}
    // Show all metadata keys to find what fields are populated
    const allKeys = Object.keys(meta)
    const copyFields = {
      eyebrow: meta.eyebrow ?? null,
      title: meta.title ?? row.display_title ?? null,
      subtitle: meta.subtitle ?? null,
      paragraphs: Array.isArray(meta.paragraphs) ? meta.paragraphs : [],
      cta_primary: meta.cta_primary ?? null,
      header: meta.header ?? null,
      function_layer: meta.function_layer ?? null,
      state_expression: meta.state_expression ?? null,
      renderer: meta.renderer ?? null,
    }

    console.log(`\n--- ${key} ---`)
    console.log(`is_active: ${row.is_active}`)
    console.log(`display_title: ${row.display_title ?? null}`)
    console.log(`metadata keys: [${allKeys.join(", ")}]`)
    console.log("copy fields:", JSON.stringify(copyFields, null, 2))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
