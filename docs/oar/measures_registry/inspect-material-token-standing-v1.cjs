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

function pp(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

async function main() {
  // 1. All active design tokens for measures_registry
  console.log("=== measures_design_token: ALL ACTIVE (measures_registry) ===\n")
  const allTokens = assertOk(
    await reader
      .from("measures_design_token")
      .select("token_key, token_value, media_query, is_active")
      .eq("registry_key", "measures_registry")
      .eq("is_active", true)
      .order("token_key", { ascending: true }),
    "all active tokens",
  )
  console.log(`Total active tokens: ${allTokens.length}\n`)
  for (const t of allTokens) {
    const mq = t.media_query ? ` [${t.media_query}]` : ""
    console.log(`  ${t.token_key}${mq}: ${t.token_value}`)
  }

  // 2. Material-specific token filter
  const MATERIAL_PATTERNS = ["obsidian", "lapis", "marble", "crystal", "text_", "border_", "accent", "highlight", "field", "panel", "wash", "hover", "focus"]
  console.log("\n\n=== MATERIAL-RELEVANT TOKENS (filtered) ===\n")
  const materialTokens = allTokens.filter(t =>
    MATERIAL_PATTERNS.some(p => t.token_key.includes(p))
  )
  for (const t of materialTokens) {
    const mq = t.media_query ? ` [${t.media_query}]` : ""
    console.log(`  ${t.token_key}${mq}: ${t.token_value}`)
  }

  // 3. mrssc_v1_color_material_contract relation
  console.log("\n\n=== concordance_relation: mrssc_v1_color_material_contract ===\n")
  const materialContractRows = assertOk(
    await reader
      .from("concordance_relation")
      .select("*")
      .eq("relation_key", "mrssc_v1_color_material_contract"),
    "mrssc_v1_color_material_contract",
  )
  if (!materialContractRows.length) {
    console.log("MISSING: mrssc_v1_color_material_contract not found")
  } else {
    pp(materialContractRows[0])
  }

  // 4. All mrssc_v1* relations
  console.log("\n\n=== concordance_relation: all mrssc_v1* ===\n")
  const mrsscRows = assertOk(
    await reader
      .from("concordance_relation")
      .select("relation_key, relation_standing, relation_type, metadata")
      .like("relation_key", "mrssc_v1%")
      .order("relation_key", { ascending: true }),
    "all mrssc_v1 relations",
  )
  console.log(`Found ${mrsscRows.length} mrssc_v1* relations:\n`)
  for (const r of mrsscRows) {
    console.log(`  [${r.relation_key}] standing=${r.relation_standing} type=${r.relation_type}`)
    if (r.metadata) {
      const keys = Object.keys(r.metadata)
      if (keys.length) console.log(`    metadata keys: ${keys.join(", ")}`)
    }
  }

  console.log("\n--- INSPECTION COMPLETE (read-only, no DB writes) ---")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
