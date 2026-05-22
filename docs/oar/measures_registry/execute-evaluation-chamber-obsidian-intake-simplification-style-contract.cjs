require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const fs = require("node:fs")
const path = require("node:path")
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

const writer = createClient(supabaseUrl, writeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const reader = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const sourceOar2 =
  "docs/oar/measures_registry/oar2_evaluation_chamber_obsidian_intake_simplification_style_contract_v1.meta.md"
const expectedOar1 =
  "docs/oar/measures_registry/oar1_evaluation_chamber_obsidian_intake_simplification_style_contract_v1.meta.md"
const evidencePath = path.join(
  "docs",
  "oar",
  "measures_registry",
  "evaluation_chamber_obsidian_intake_simplification_style_contract_v1_evidence.json",
)
const encounterKeys = ["iis_eval_gate1", "measures_ai_operational_evaluation"]

const srcIntakeContract = {
  version: "v3",
  source_oar2: sourceOar2,
  capture_table: "public.measures_iis_eval_gate1_capture",
  schema_change_required: false,
  visible_fields: [
    "institution_name",
    "institution_type",
    "contact_name",
    "contact_email",
  ],
  entry_required_fields: [
    "institution_name",
    "institution_type",
    "contact_name",
    "contact_email",
  ],
  field_mapping: {
    "company_organization_name": "institution_name",
    "type_of_business_organization": "metadata.institution_type",
    "contact_name": "contact_name",
    "contact_email": "contact_email",
  },
  deferred_src_fields: {
    institution_address: null,
    institution_phone: null,
    contact_position: null,
    assessment_intent: null,
    capture_context: null,
  },
  deferred_fields_block_entry: false,
  institution_type_route: "metadata.institution_type",
}

const gate1CompletionRule = {
  complete: {
    gate_1: "complete",
    assessment_returned: true,
    minimum_identity_captured: true,
    eligibility_updated: true,
  },
  held: {
    gate_1: "held",
    minimum_identity_captured: false,
  },
  implementation_deferred: {
    deferred_src_fields_block_entry: false,
    implementation_src_requirements_satisfied: false,
  },
}

const stylingContract = {
  version: "v2",
  source_oar2: sourceOar2,
  material_family: "obsidian",
  foundation_material: "obsidian",
  atmospheric_material: "smoke_glass",
  geometry_tone: "cool_white_edge",
  accent_tone: "restrained_gold",
  field_style: "capsule_beveled_plaque",
  answer_style: "numbered_capsule_plaque",
  watermark_presence: "visible_restrained",
  blue_intensity: "reduced",
  disallowed_patterns: [
    "administrative_intake_wall",
    "plain_rectangular_inputs",
    "lapis_dominant_assessment_gate",
    "frontend_owned_truth",
    "suppressed_registry_warning",
  ],
}

const layoutContract = {
  version: "v2",
  source_oar2: sourceOar2,
  viewport_fit: "single_screen_initial_view",
  copy_density: "compact",
  initial_copy_rule: "title, brief framing, compact identity chamber, begin control, and audio control remain visible on default desktop viewport",
  src_capture_layout: "minimal_two_column_identity_grid",
  mobile_layout: "single_column_compact_scroll_allowed",
  heading_scale: "restrained_evaluation_heading",
  form_density: "minimal_obsidian_identity",
  scroll_policy: "avoid_initial_copy_scroll_desktop",
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function mergeEncounterContract(metadata) {
  const encounterContract = clone(metadata.encounter_contract)

  return {
    ...encounterContract,
    styling_contract: stylingContract,
    layout_contract: layoutContract,
    src_intake_contract: srcIntakeContract,
    gate_1_completion_rule: gate1CompletionRule,
  }
}

function hasThreeOptionMechanics(metadata) {
  const questions = metadata.assessment_mechanics?.questions
  return Array.isArray(questions) && questions.length === 5 && questions.every((question) => {
    return Array.isArray(question.options) && question.options.length === 3
  })
}

async function canonicalAssessmentMetadata() {
  const row = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("metadata")
      .eq("encounter_key", "measures_ai_operational_evaluation")
      .single(),
    "canonical evaluation mechanics lookup",
  )
  const metadata = clone(row.metadata)
  if (!hasThreeOptionMechanics(metadata)) {
    throw new Error("Canonical evaluation mechanics are not seated as 5 questions with 3 options each")
  }

  return {
    assessment_mechanics: metadata.assessment_mechanics,
    assessment_interpretation: metadata.assessment_interpretation,
    assessment_completion: metadata.assessment_completion,
  }
}

async function updateEncounter(encounterKey, canonicalAssessment) {
  const row = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("*")
      .eq("encounter_key", encounterKey)
      .single(),
    `${encounterKey} encounter lookup`,
  )
  const metadata = clone(row.metadata)
  const shouldSyncAssessmentMechanics = encounterKey === "iis_eval_gate1" && !hasThreeOptionMechanics(metadata)
  const nextMetadata = {
    ...metadata,
    ...(shouldSyncAssessmentMechanics ? canonicalAssessment : {}),
    source_oar2: sourceOar2,
    obsidian_intake_simplification_source_oar2: sourceOar2,
    styling_contract: stylingContract,
    layout_contract: layoutContract,
    src_intake_contract: srcIntakeContract,
    gate_1_completion_rule: gate1CompletionRule,
    encounter_contract: mergeEncounterContract(metadata),
    assessment_chamber: {
      ...(metadata.assessment_chamber && typeof metadata.assessment_chamber === "object"
        ? metadata.assessment_chamber
        : {}),
      material_family: "obsidian",
      style_contract_source_oar2: sourceOar2,
    },
    assessment_mechanics_contract_source_oar2: shouldSyncAssessmentMechanics
      ? "docs/oar/measures_registry/oar2_measures_registry_evaluation_encounter_contract_v2.meta.md"
      : metadata.assessment_mechanics_contract_source_oar2,
  }

  return assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ material_family: "obsidian", metadata: nextMetadata })
      .eq("id", row.id)
      .select("encounter_key, display_title, material_family, metadata")
      .single(),
    `${encounterKey} encounter update`,
  )
}

async function updateRegistry(encounterKey) {
  const existing = assertOk(
    await writer
      .from("measures_registry")
      .select("*")
      .eq("registry_key", encounterKey)
      .maybeSingle(),
    `${encounterKey} registry lookup`,
  )
  if (!existing) return null

  const metadata = clone(existing.metadata)
  return assertOk(
    await writer
      .from("measures_registry")
      .update({
        material_family: "obsidian",
        metadata: {
          ...metadata,
          source_oar2: sourceOar2,
          obsidian_intake_simplification_source_oar2: sourceOar2,
          styling_contract: stylingContract,
          layout_contract: layoutContract,
          src_intake_contract: srcIntakeContract,
        },
      })
      .eq("id", existing.id)
      .select("registry_key, display_title, material_family, release_state, access_state, metadata")
      .single(),
    `${encounterKey} registry update`,
  )
}

async function main() {
  assertOk(await writer.from("measures_encounter_def").select("id").limit(1), "DB connection")

  const registryRows = []
  const encounterRows = []
  const canonicalAssessment = await canonicalAssessmentMetadata()
  for (const encounterKey of encounterKeys) {
    registryRows.push(await updateRegistry(encounterKey))
    encounterRows.push(await updateEncounter(encounterKey, canonicalAssessment))
  }

  const readback = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, material_family, metadata")
      .in("encounter_key", encounterKeys)
      .order("encounter_key", { ascending: true }),
    "runtime readback",
  )

  const evidence = {
    generatedAt: new Date().toISOString(),
    source_oar2: sourceOar2,
    expected_oar1: expectedOar1,
    mutationPerformed: true,
    registryRows: registryRows.filter(Boolean).map((row) => ({
      registry_key: row.registry_key,
      display_title: row.display_title,
      material_family: row.material_family,
      release_state: row.release_state,
      access_state: row.access_state,
      styling_contract: row.metadata?.styling_contract,
      src_intake_contract: row.metadata?.src_intake_contract,
    })),
    encounterRows: encounterRows.map((row) => ({
      encounter_key: row.encounter_key,
      display_title: row.display_title,
      material_family: row.material_family,
    })),
    runtimeReadback: readback.map((row) => ({
      encounter_key: row.encounter_key,
      material_family: row.material_family,
      visible_fields: row.metadata?.src_intake_contract?.visible_fields,
      entry_required_fields: row.metadata?.src_intake_contract?.entry_required_fields,
      deferred_src_fields: row.metadata?.src_intake_contract?.deferred_src_fields,
      styling_material_family: row.metadata?.styling_contract?.material_family,
      layout_viewport_fit: row.metadata?.layout_contract?.viewport_fit,
      question_count: row.metadata?.assessment_mechanics?.questions?.length ?? 0,
      option_counts: (row.metadata?.assessment_mechanics?.questions ?? []).map((question) => question.options?.length ?? 0),
      frontend_hardcode_allowed: row.metadata?.frontend_hardcode_allowed ?? false,
    })),
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
