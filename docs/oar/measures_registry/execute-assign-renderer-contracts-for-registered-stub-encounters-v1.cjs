require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const writeKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || writeKey

if (!supabaseUrl || !writeKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, writeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const reader = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_assign_renderer_contracts_for_registered_stub_encounters_v1.meta.md"

const SITEWIDE_BINDING = {
  document_key: "measures_registry_sitewide_style_contract",
  version_key: "measures_registry_sitewide_style_contract_v1",
  seating: "encounter_contract_v1",
  source_oar2: SOURCE_OAR2,
}

const TARGET_KEYS = [
  "structure_passage",
  "structured_eval",
  "measures_phases_reveal",
  "about_measures_registry",
  "measures_eval_email_contract",
]

const RENDERER_ASSIGNMENTS = {
  structure_passage: "diagnostic_explainer_passage",
  structured_eval: "measures_registry_evaluation_chamber",
  measures_phases_reveal: "measures_phases_reveal",
  about_measures_registry: "about_measures_registry",
  measures_eval_email_contract: "measures_eval_email_contract",
}

function buildMetadataPatch(encounterKey) {
  const base = {
    source_sitewide_contract: SITEWIDE_BINDING,
    renderer: RENDERER_ASSIGNMENTS[encounterKey],
    intended_renderer: RENDERER_ASSIGNMENTS[encounterKey],
    renderer_contract_status: "assigned",
  }

  if (encounterKey === "structure_passage") {
    return {
      ...base,
      media_roles: [
        {
          role: "passage_media",
          media_key: "measures_structured_enviroments",
          role_note:
            "structure-path passage media — mirrors eval_passage media role pattern",
          source_oar2: SOURCE_OAR2,
        },
      ],
      approved_copy_pending_contract: {
        version: "v1",
        source_oar2: SOURCE_OAR2,
        eyebrow: "STRUCTURE READINESS",
        title: "How does a structured environment optimize AI performance?",
        subtitle:
          "AI performance improves when the operating environment is structured enough to clarify authority, connect relevant systems, define review paths, and make decisions traceable. Structure reduces drift and gives AI output a governed place to act.",
        copy_authority: "measures_encounter_def.metadata",
        frontend_hardcode_allowed: false,
        implementation_note:
          "Approved copy — pending full contract seating. Do not hardcode in src.",
      },
    }
  }

  if (encounterKey === "structured_eval") {
    return {
      ...base,
      assessment_mechanics_note: {
        version: "v1",
        source_oar2: SOURCE_OAR2,
        mechanics_source: "shared_with_measures_assessment",
        fork_allowed: false,
        fork_condition: "explicit OAR2 required to seat distinct mechanic",
        renderer_reuse_note:
          "structured_eval reuses measures_registry_evaluation_chamber with structure-path framing — scoring logic not forked",
      },
    }
  }

  if (encounterKey === "measures_phases_reveal") {
    return {
      ...base,
      renderer_purpose: {
        version: "v1",
        source_oar2: SOURCE_OAR2,
        purpose: "post_assessment_phase_reveal",
        convergence_note:
          "convergence point for measures_assessment path and structured_eval path",
        presents: "next_governed_runtime_path",
        may_link_to: "about_measures_registry",
      },
    }
  }

  if (encounterKey === "about_measures_registry") {
    return {
      ...base,
      renderer_purpose: {
        version: "v1",
        source_oar2: SOURCE_OAR2,
        purpose: "institutional_authority_context_surface",
        presents: "measures_registry_as_registered_runtime",
        may_route_to: "structural_drift_publication",
      },
    }
  }

  if (encounterKey === "measures_eval_email_contract") {
    return {
      ...base,
      renderer_purpose: {
        version: "v1",
        source_oar2: SOURCE_OAR2,
        purpose: "assessment_delivery_email_contract",
        governs: [
          "what_gets_sent",
          "recipient_confirmation",
          "consent_acknowledgment_path",
        ],
        routes_toward: "reserve_seat",
      },
    }
  }

  return base
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

async function verifyPrerequisites() {
  const { count: swCount, error: swError } = await writer
    .from("concordance_document")
    .select("*", { count: "exact", head: true })
    .eq("document_key", "measures_registry_sitewide_style_contract")
    .eq("authority_standing", "active")
  if (swError) throw new Error(`sitewide contract check: ${swError.message}`)
  if (swCount !== 1) throw new Error(`sitewide contract not active: count=${swCount}`)
  console.log("prereq_sitewide_contract: ok")

  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("id, encounter_key, is_active, metadata")
      .in("encounter_key", TARGET_KEYS),
    "stub encounter presence check",
  )
  const found = rows.map((r) => r.encounter_key)
  const missing = TARGET_KEYS.filter((k) => !found.includes(k))
  if (missing.length > 0)
    throw new Error(`missing stub encounters: ${missing.join(", ")}`)
  console.log(`prereq_stub_encounters: ok (${found.length} of ${TARGET_KEYS.length} found)`)

  console.log("\ncurrent_stub_state:")
  for (const row of rows.sort((a, b) => a.encounter_key.localeCompare(b.encounter_key))) {
    console.log(
      `  ${row.encounter_key}: renderer=${row.metadata?.renderer ?? "null"}, is_active=${row.is_active}, contract_status=${row.metadata?.contract_status ?? "null"}, renderer_contract_status=${row.metadata?.renderer_contract_status ?? "null"}`,
    )
  }

  return rows
}

async function checkMediaMapping() {
  const { data, error } = await writer
    .from("measures_media")
    .select("media_key")
    .eq("media_key", "measures_structured_enviroments")
    .limit(1)

  if (error) {
    return {
      mediaFound: false,
      mediaNote: `measures_media table not accessible (${error.message}) — media_key measures_structured_enviroments approved for future seating in structure_passage media_roles metadata`,
    }
  }

  const found = data && data.length > 0
  return {
    mediaFound: found,
    mediaNote: found
      ? "measures_structured_enviroments found in measures_media"
      : "measures_structured_enviroments not yet in measures_media — media_key approved in structure_passage metadata pending dedicated media asset seating",
  }
}

async function assignRendererContract(row) {
  const encounterKey = row.encounter_key
  const patch = buildMetadataPatch(encounterKey)
  const mergedMetadata = { ...clone(row.metadata), ...patch }
  const assignedRenderer = RENDERER_ASSIGNMENTS[encounterKey]

  const updated = assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: mergedMetadata })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    `${encounterKey} renderer assignment`,
  )

  return {
    encounter_key: updated.encounter_key,
    renderer_assigned: updated.metadata?.renderer ?? null,
    renderer_contract_status: updated.metadata?.renderer_contract_status ?? null,
    sitewide_bound: updated.metadata?.source_sitewide_contract?.document_key ?? null,
  }
}

async function readBack() {
  // All 5 stubs are is_active: false — use writer (service role) to bypass RLS
  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", TARGET_KEYS)
      .order("encounter_key", { ascending: true }),
    "readback query",
  )

  return rows.map((row) => ({
    encounter_key: row.encounter_key,
    is_active: row.is_active,
    renderer: row.metadata?.renderer ?? null,
    intended_renderer: row.metadata?.intended_renderer ?? null,
    renderer_contract_status: row.metadata?.renderer_contract_status ?? null,
    source_sitewide_contract:
      row.metadata?.source_sitewide_contract?.document_key ?? null,
    contract_status: row.metadata?.contract_status ?? null,
    has_approved_copy: !!row.metadata?.approved_copy_pending_contract,
    has_media_roles: !!row.metadata?.media_roles,
  }))
}

async function main() {
  assertOk(
    await writer.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  const currentRows = await verifyPrerequisites()
  const rowMap = Object.fromEntries(currentRows.map((r) => [r.encounter_key, r]))

  const { mediaNote } = await checkMediaMapping()
  console.log(`\nmedia_mapping_check: ${mediaNote}`)

  console.log("\nphase_1: assigning renderer contracts...")
  const results = []
  for (const key of TARGET_KEYS) {
    const result = await assignRendererContract(rowMap[key])
    results.push(result)
    console.log(
      `  ${key}: renderer=${result.renderer_assigned}, status=${result.renderer_contract_status}`,
    )
  }

  console.log("\nreadback...")
  const readback = await readBack()

  const allAssigned = readback.every((r) => r.renderer_contract_status === "assigned")
  const allRendererSet = readback.every((r) => r.renderer !== null)
  const allSitewideBound = readback.every(
    (r) => r.source_sitewide_contract === "measures_registry_sitewide_style_contract",
  )

  const output = {
    db_connection: "ok",
    prereq_sitewide_contract: "ok",
    prereq_stub_encounters: `ok (${TARGET_KEYS.length} of ${TARGET_KEYS.length} found)`,
    media_mapping_check: mediaNote,
    assessment_mechanics_reuse: {
      structured_eval_renderer: "measures_registry_evaluation_chamber",
      reuse_safe: true,
      fork_required: false,
      note: "structured_eval reuses existing renderer — no immediate renderer code changes required",
    },
    encounters_assigned: TARGET_KEYS.length,
    all_assigned: allAssigned,
    all_renderer_set: allRendererSet,
    all_sitewide_bound: allSitewideBound,
    readback,
    assignment_results: results,
  }

  console.log(JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
