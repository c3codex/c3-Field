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
  // 1. concordance_document for measures_registry_sitewide_style_contract
  console.log("=== concordance_document: measures_registry_sitewide_style_contract ===\n")
  const docRows = assertOk(
    await reader
      .from("concordance_document")
      .select("*")
      .eq("document_key", "measures_registry_sitewide_style_contract"),
    "concordance_document",
  )
  if (!docRows.length) {
    console.log("MISSING: document not found in concordance_document")
  } else {
    pp(docRows[0])
  }

  // 2. concordance_version for sitewide style contract
  console.log("\n\n=== concordance_version: measures_registry_sitewide_style_contract ===\n")
  const versionRows = assertOk(
    await reader
      .from("concordance_version")
      .select("*")
      .eq("document_key", "measures_registry_sitewide_style_contract"),
    "concordance_version",
  )
  if (!versionRows.length) {
    console.log("MISSING: no versions found")
  } else {
    for (const v of versionRows) {
      console.log(`version_key: ${v.version_key}`)
      console.log(`  authority_standing: ${v.authority_standing}`)
      console.log(`  visibility_standing: ${v.visibility_standing}`)
      console.log(`  implementation_order: ${v.implementation_order}`)
      console.log(`  status: ${v.metadata?.status}`)
      console.log(`  metadata keys: ${Object.keys(v.metadata || {}).join(", ")}`)
      if (v.metadata?.implementation_scope) {
        console.log(`  implementation_scope: ${JSON.stringify(v.metadata.implementation_scope)}`)
      }
    }
  }

  // 3. concordance_relation for sitewide style contract (all active relations)
  console.log("\n\n=== concordance_relation: measures_registry_sitewide_style_contract (all relations) ===\n")
  const relRows = assertOk(
    await reader
      .from("concordance_relation")
      .select("*")
      .eq("version_key", "measures_registry_sitewide_style_contract_v1")
      .order("relation_key", { ascending: true }),
    "concordance_relation",
  )
  if (!relRows.length) {
    console.log("MISSING or empty: no relations found for sitewide style contract v1")
  } else {
    console.log(`Found ${relRows.length} relations.\n`)
    for (const r of relRows) {
      console.log(`[${r.relation_key}]`)
      const knownKeys = Object.keys(r).filter(k => k !== "metadata")
      for (const k of knownKeys) {
        if (r[k] !== null && r[k] !== undefined) console.log(`  ${k}: ${r[k]}`)
      }
      if (r.metadata) {
        console.log(`  metadata:`)
        pp(r.metadata)
      }
      console.log("")
    }
  }

  // 4. registered_13_public_runtime_contract — concordance_document
  console.log("\n\n=== concordance_document: registered_13_public_runtime_contract ===\n")
  const rtDocRows = assertOk(
    await reader
      .from("concordance_document")
      .select("*")
      .eq("document_key", "registered_13_public_runtime_contract"),
    "registered_13_public_runtime_contract doc",
  )
  if (!rtDocRows.length) {
    console.log("MISSING: registered_13_public_runtime_contract not found")
  } else {
    const doc = rtDocRows[0]
    console.log(`document_key: ${doc.document_key}`)
    console.log(`metadata keys: ${Object.keys(doc.metadata || {}).join(", ")}`)
    if (doc.metadata) pp(doc.metadata)
  }

  // 5. Design tokens from measures_design_token for measures_registry
  console.log("\n\n=== measures_design_token: registry_key=measures_registry (all active) ===\n")
  const tokenRows = assertOk(
    await reader
      .from("measures_design_token")
      .select("token_key, token_value, media_query, is_active")
      .eq("registry_key", "measures_registry")
      .eq("is_active", true)
      .order("token_key", { ascending: true }),
    "measures_design_token",
  )
  if (!tokenRows.length) {
    console.log("MISSING: no active design tokens found for measures_registry")
  } else {
    console.log(`Total active tokens: ${tokenRows.length}\n`)
    for (const t of tokenRows) {
      const mq = t.media_query ? ` [${t.media_query}]` : ""
      console.log(`  ${t.token_key}${mq}: ${t.token_value}`)
    }
  }

  // 6. Check for any mrssc_v1 relations specifically
  console.log("\n\n=== concordance_relation: mrssc_v1* pattern ===\n")
  const mrsscRows = assertOk(
    await reader
      .from("concordance_relation")
      .select("*")
      .like("relation_key", "mrssc_v1%")
      .order("relation_key", { ascending: true }),
    "mrssc_v1 relations",
  )
  if (!mrsscRows.length) {
    console.log("MISSING: no mrssc_v1* relations found")
  } else {
    console.log(`Found ${mrsscRows.length} mrssc_v1 relations:\n`)
    for (const r of mrsscRows) {
      console.log(`[${r.relation_key}]`)
      const knownKeys = Object.keys(r).filter(k => k !== "metadata")
      for (const k of knownKeys) {
        if (r[k] !== null && r[k] !== undefined) console.log(`  ${k}: ${r[k]}`)
      }
      if (r.metadata) {
        console.log(`  metadata:`)
        pp(r.metadata)
      }
      console.log("")
    }
  }

  console.log("\n--- INSPECTION COMPLETE (read-only, no DB writes) ---")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
