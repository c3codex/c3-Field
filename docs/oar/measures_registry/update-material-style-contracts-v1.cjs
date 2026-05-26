require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const db = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const REGISTRY_KEY = "measures_registry"
const SOURCE_OAR2 = "docs/oar/measures_registry/oar2_seat_measures_registry_material_style_contracts_v1.meta.md"

// color-mix() derived values (panel_wash, field_wash) are handled in CSS — only base values seated in DB.
const LAPIS_TOKENS = [
  { token_key: "lapis_field",          token_value: "#0B1238",               token_type: "color", intended_usage: "lapis material surface background field" },
  { token_key: "lapis_panel_surface",  token_value: "#101A4D",               token_type: "color", intended_usage: "lapis material panel/card surface (brand_lapis_night value)" },
  { token_key: "lapis_primary_text",   token_value: "#D7DBE3",               token_type: "color", intended_usage: "primary text on lapis surfaces (brand_silver_frame value)" },
  { token_key: "lapis_secondary_text", token_value: "rgba(215,219,227,0.72)", token_type: "color", intended_usage: "secondary text on lapis surfaces" },
  { token_key: "lapis_muted_text",     token_value: "rgba(215,219,227,0.52)", token_type: "color", intended_usage: "muted/label text on lapis surfaces" },
  { token_key: "lapis_border",         token_value: "rgba(215,219,227,0.14)", token_type: "color", intended_usage: "subtle borders on lapis surfaces" },
  { token_key: "lapis_accent",         token_value: "rgba(108,154,208,0.82)", token_type: "color", intended_usage: "accent/interactive on lapis surfaces (accent_cool value)" },
  { token_key: "lapis_highlight",      token_value: "#F2F4F8",               token_type: "color", intended_usage: "highlight/crystal on lapis surfaces (brand_crystal_star value)" },
]

const MARBLE_TOKENS = [
  { token_key: "marble_field",          token_value: "#f4efe4",               token_type: "color", intended_usage: "marble material surface background field" },
  { token_key: "marble_panel_surface",  token_value: "#eae4d9",               token_type: "color", intended_usage: "marble material panel/card surface" },
  { token_key: "marble_primary_text",   token_value: "#13110e",               token_type: "color", intended_usage: "primary text on marble surfaces" },
  { token_key: "marble_secondary_text", token_value: "#3d3830",               token_type: "color", intended_usage: "secondary text on marble surfaces" },
  { token_key: "marble_muted_text",     token_value: "#6b6357",               token_type: "color", intended_usage: "muted/label text on marble surfaces" },
  { token_key: "marble_border",         token_value: "rgba(19,17,14,0.14)",   token_type: "color", intended_usage: "subtle borders on marble surfaces" },
  { token_key: "marble_accent",         token_value: "#2b5ab8",               token_type: "color", intended_usage: "accent/interactive on marble surfaces" },
  { token_key: "marble_highlight",      token_value: "#2b5ab8",               token_type: "color", intended_usage: "highlight on marble surfaces" },
]

async function findExisting(tokenKey) {
  const { data, error } = await db
    .from("measures_design_token")
    .select("id, token_value, token_scope, metadata")
    .eq("registry_key", REGISTRY_KEY)
    .eq("token_key", tokenKey)
    .is("media_query", null)
    .limit(1)
  if (error) throw new Error(`Token lookup failed for ${tokenKey}: ${error.message}`)
  return data?.[0] ?? null
}

async function seatToken(token, materialFamily) {
  const existing = await findExisting(token.token_key)
  const now = new Date().toISOString()
  const payload = {
    registry_key: REGISTRY_KEY,
    token_scope: "material",
    token_key: token.token_key,
    token_value: token.token_value,
    token_type: token.token_type,
    media_query: null,
    is_active: true,
    metadata: {
      ...(existing?.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      source_oar2: SOURCE_OAR2,
      material_family: materialFamily,
      intended_usage: token.intended_usage,
    },
    updated_at: now,
  }

  const mutation = existing
    ? db.from("measures_design_token").update(payload).eq("id", existing.id)
    : db.from("measures_design_token").insert(payload)

  const { error } = await mutation
  if (error) throw new Error(`Token seating failed for ${token.token_key}: ${error.message}`)

  return {
    token_key: token.token_key,
    operation: existing ? "updated" : "inserted",
    previous_value: existing?.token_value ?? null,
    seated_value: token.token_value,
  }
}

async function main() {
  // Pre-flight: verify encounter styling_contract.material_family for About and PhaseReveal
  console.log("=== PRE-FLIGHT: encounter material_family check ===\n")
  const encounterRows = await db
    .from("measures_encounter_def")
    .select("encounter_key, metadata")
    .in("encounter_key", ["about_measures_registry", "measures_phases_reveal"])
  if (encounterRows.error) throw new Error(encounterRows.error.message)
  for (const row of encounterRows.data) {
    const mf = row.metadata?.styling_contract?.material_family ?? "(not set)"
    console.log(`  ${row.encounter_key}: styling_contract.material_family = ${mf}`)
  }

  // Seat lapis tokens
  console.log("\n\n=== SEATING: lapis material surface tokens ===\n")
  const lapisResults = []
  for (const token of LAPIS_TOKENS) {
    const result = await seatToken(token, "lapis")
    lapisResults.push(result)
    console.log(`  ${result.operation.toUpperCase().padEnd(8)} ${token.token_key}: ${token.token_value}`)
  }

  // Seat marble tokens
  console.log("\n\n=== SEATING: marble material surface tokens ===\n")
  const marbleResults = []
  for (const token of MARBLE_TOKENS) {
    const result = await seatToken(token, "marble")
    marbleResults.push(result)
    console.log(`  ${result.operation.toUpperCase().padEnd(8)} ${token.token_key}: ${token.token_value}`)
  }

  // Post-seed verification
  console.log("\n\n=== POST-SEED VERIFICATION ===\n")
  const { data: seated, error: seatedErr } = await db
    .from("measures_design_token")
    .select("token_key, token_value, token_scope")
    .eq("registry_key", REGISTRY_KEY)
    .eq("is_active", true)
    .or("token_key.like.lapis_%,token_key.like.marble_%")
    .order("token_key", { ascending: true })

  if (seatedErr) throw new Error(`Post-seed read failed: ${seatedErr.message}`)
  console.log(`Material tokens now seated: ${seated.length}\n`)
  for (const t of seated) {
    console.log(`  [${t.token_scope}] ${t.token_key}: ${t.token_value}`)
  }

  console.log("\n--- UPDATE COMPLETE ---")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
