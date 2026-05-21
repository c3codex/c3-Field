require("dotenv").config({ path: ".env" })

const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const writeKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || writeKey

if (!supabaseUrl || !writeKey) {
  throw new Error("Supabase credentials missing")
}

const writer = createClient(supabaseUrl, writeKey)
const reader = createClient(supabaseUrl, anonKey)

const registryKey = "measures_registry"
const sourceOar2 = "docs/oar/measures_registry/oar2_seat_approved_lapis_v2_brand_tokens_v1.meta.md"
const evidencePath = path.join(
  "docs",
  "oar",
  "measures_registry",
  "seat_approved_lapis_v2_brand_tokens_v1.json",
)

const tokens = [
  {
    token_key: "brand_obsidian",
    token_value: "#0E0E17",
    intended_usage: "primary obsidian field and institutional dark surface",
    visual_authority_role: "threshold field",
  },
  {
    token_key: "brand_deep_lapis",
    token_value: "#1F2F8D",
    intended_usage: "primary lapis field behind the mark and governed public surfaces",
    visual_authority_role: "primary lapis authority",
  },
  {
    token_key: "brand_lapis_night",
    token_value: "#101A4D",
    intended_usage: "secondary lapis night depth and formal surface support",
    visual_authority_role: "supporting lapis depth",
  },
  {
    token_key: "brand_silver_frame",
    token_value: "#D7DBE3",
    intended_usage: "stable outer frame, borders, and formal authority lines",
    visual_authority_role: "silver frame",
  },
  {
    token_key: "brand_crystal_star",
    token_value: "#F2F4F8",
    intended_usage: "crystal star, high-value text, and restrained highlights",
    visual_authority_role: "crystal star",
  },
  {
    token_key: "brand_marble_accent",
    token_value: "#C7CBD2",
    intended_usage: "supporting text, document surfaces, and marble accenting",
    visual_authority_role: "marble accent",
  },
]

async function findExisting(tokenKey) {
  const { data, error } = await writer
    .from("measures_design_token")
    .select("id, token_value, metadata")
    .eq("registry_key", registryKey)
    .eq("token_scope", "brand")
    .eq("token_key", tokenKey)
    .is("media_query", null)
    .limit(1)

  if (error) throw new Error(`Token lookup failed for ${tokenKey}: ${error.message}`)
  return data?.[0] ?? null
}

async function seatToken(token) {
  const existing = await findExisting(token.token_key)
  const now = new Date().toISOString()
  const payload = {
    registry_key: registryKey,
    token_scope: "brand",
    token_key: token.token_key,
    token_value: token.token_value,
    token_type: "color",
    media_query: null,
    is_active: true,
    metadata: {
      ...(existing?.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      source_oar2: sourceOar2,
      token_family: "measures_registry_lapis_v2",
      brand_scope: "measures_registry_public_runtime",
      intended_usage: token.intended_usage,
      visual_authority_role: token.visual_authority_role,
      launch_status: "approved_for_alignment",
      frontend_replacement_authorized: false,
      preserves_inanna_material_systems: true,
    },
    updated_at: now,
  }

  const mutation = existing
    ? writer.from("measures_design_token").update(payload).eq("id", existing.id)
    : writer.from("measures_design_token").insert(payload)

  const { error } = await mutation
  if (error) throw new Error(`Token seating failed for ${token.token_key}: ${error.message}`)

  return {
    token_key: token.token_key,
    previous_value: existing?.token_value ?? null,
    seated_value: token.token_value,
    operation: existing ? "updated_existing_brand_token" : "inserted_brand_token",
  }
}

async function readBack(client, label) {
  const { data, error } = await client
    .from("measures_design_token")
    .select("registry_key, token_scope, token_key, token_value, token_type, media_query, is_active, metadata")
    .eq("registry_key", registryKey)
    .eq("token_scope", "brand")
    .in(
      "token_key",
      tokens.map((token) => token.token_key),
    )
    .is("media_query", null)
    .eq("is_active", true)
    .order("token_key")

  if (error) throw new Error(`${label} token read failed: ${error.message}`)
  return data ?? []
}

async function main() {
  const before = await readBack(writer, "Before")
  const mutations = []

  for (const token of tokens) {
    mutations.push(await seatToken(token))
  }

  const writerRead = await readBack(writer, "Writer")
  const runtimeRead = await readBack(reader, "Runtime")

  const expected = new Map(tokens.map((token) => [token.token_key, token.token_value]))
  const missing = tokens
    .map((token) => token.token_key)
    .filter((tokenKey) => !runtimeRead.some((row) => row.token_key === tokenKey && row.token_value === expected.get(tokenKey)))

  const evidence = {
    generatedAt: new Date().toISOString(),
    source_oar2: sourceOar2,
    mutationPerformed: true,
    registryKey,
    tokenScope: "brand",
    before,
    mutations,
    writerRead,
    runtimeRead,
    runtimeReadConfirmation: {
      expectedCount: tokens.length,
      actualCount: runtimeRead.length,
      missing,
      allExpectedTokensReadable: missing.length === 0,
    },
    boundariesHeld: [
      "No CSS rewrite performed.",
      "No existing historical, Inanna, phase-map, or material tokens removed.",
      "No frontend hardcoded colors introduced.",
      "No route, media, content, or storage mutation performed.",
    ],
    replacementAlignmentMap: [
      ["background_obsidian", "brand_obsidian"],
      ["panel_obsidian", "brand_lapis_night"],
      ["accent_cool", "brand_deep_lapis"],
      ["text_primary", "brand_silver_frame"],
      ["text_secondary", "brand_marble_accent"],
      ["text_muted", "brand_marble_accent"],
      ["border_subtle", "brand_silver_frame"],
      ["approved star/highlight surfaces", "brand_crystal_star"],
    ],
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence.runtimeReadConfirmation, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
