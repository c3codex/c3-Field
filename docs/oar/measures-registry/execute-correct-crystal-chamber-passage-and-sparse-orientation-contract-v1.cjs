require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and a Supabase write key are required")
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures-registry/oar2_correct_crystal_chamber_passage_and_sparse_orientation_contract_v1.meta.md"

const STRUCTURE_PASSAGE = "structure_passage"
const CRYSTAL_CHAMBER = "crystal_chamber"
const EVAL_PASSAGE = "eval_passage"

const POSITION_PARAGRAPH =
  "Measures Registry provides integrity governance for AI-accelerated systems. AI drift is not only a model problem. It is amplified by ungoverned authority, unclear roles, exposed runtime surfaces, missing review pathways, and implementation conditions that have not been structured. Measures Registry helps institutions identify the conditions shaping AI behavior, recognize drift-amplifying factors, and move toward governed action where appropriate."
const TALKING_HEAD_PUBLIC_URL = "https://media.c3field.online/measures_structured_enviroments.mp4"

const STRUCTURE_PASSAGE_CONTRACT = {
  contract_key: "structure_passage_right_path_contract_v1",
  source_oar2: SOURCE_OAR2,
  surface_key: STRUCTURE_PASSAGE,
  renderer: "right_path_talking_head_passage",
  primary_media_role: "structured_environment_passage_video",
  public_title: "Understand the Environment",
  position_paragraph: POSITION_PARAGRAPH,
  controls_required: ["mute_unmute", "skip", "continue"],
  auto_advance_on_video_end: true,
  auto_advance_target_surface: CRYSTAL_CHAMBER,
  fallback_continue_target_surface: CRYSTAL_CHAMBER,
  questions_explainer_allowed: false,
  card_grid_hub_allowed: false,
  metadata_bleed_allowed: false,
}

const SPARSE_CHAMBER_CONTRACT = {
  contract_key: "crystal_chamber_sparse_orientation_contract_v1",
  source_oar2: SOURCE_OAR2,
  surface_key: CRYSTAL_CHAMBER,
  renderer: "crystal_chamber_sparse_orientation",
  public_title: "What the Questions Reveal",
  public_context:
    "The questions reveal implementation conditions, system authority, runtime exposure, review pathways, and structural drift.",
  render_order: [
    "questions_explainer_video",
    "structural_drift_section",
    "foundational_leadership_cta",
    "assess_environment_cta",
  ],
  questions_explainer_media_role: "questions_ungoverned_systems_cannot_answer_video",
  dense_content_hub_allowed: false,
  passage_media_allowed: false,
  assessment_cta_target_surface: EVAL_PASSAGE,
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function ensureRegistryRow(key, displayTitle, sequenceOrder, materialFamily = "crystal") {
  const [existing] = assertOk(
    await supabase
      .from("measures_registry")
      .select("id")
      .eq("registry_key", key)
      .limit(1),
    `${key} registry lookup`,
  )
  if (existing) return existing.id

  const [inserted] = assertOk(
    await supabase
      .from("measures_registry")
      .insert({
        registry_key: key,
        display_title: displayTitle,
        registry_family: "spine",
        encounter_type: "view",
        material_family: materialFamily,
        sequence_order: sequenceOrder,
        release_state: "held",
        access_state: "encounterable",
        is_active: true,
        metadata: { source_oar2: SOURCE_OAR2 },
      })
      .select("id"),
    `${key} registry insert`,
  )
  return inserted.id
}

async function ensureTransition(fromKey, toKey, actionId, label, sortOrder) {
  const rows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, registry_id, encounter_key")
      .in("encounter_key", [fromKey, toKey]),
    `${fromKey} to ${toKey} transition encounter lookup`,
  )
  const from = rows.find((row) => row.encounter_key === fromKey)
  const to = rows.find((row) => row.encounter_key === toKey)
  if (!from || !to) return "missing_endpoint"

  const [existing] = assertOk(
    await supabase
      .from("measures_transition_rule")
      .select("id")
      .eq("from_encounter_id", from.id)
      .eq("to_encounter_id", to.id)
      .limit(1),
    `${fromKey} to ${toKey} transition lookup`,
  )
  if (existing) return "already_exists"

  assertOk(
    await supabase.from("measures_transition_rule").insert({
      from_registry_id: from.registry_id,
      from_encounter_id: from.id,
      to_registry_id: to.registry_id,
      to_encounter_id: to.id,
      transition_kind: "progression",
      rule_state: "active",
      requires_release: false,
      requires_dependency_satisfied: false,
      requires_passage_ready: false,
      requires_connect_prompt: false,
      sort_order: sortOrder,
      metadata: {
        action: {
          id: actionId,
          kind: "navigate",
          label,
          emphasis: "primary",
        },
        source_oar2: SOURCE_OAR2,
        registered_runtime: "crystal_right_path_sparse_orientation_v1",
      },
    }),
    `${fromKey} to ${toKey} transition insert`,
  )
  return "inserted"
}

async function seatTalkingHeadPublicUrl() {
  const rows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("id, media_role, metadata")
      .in("media_role", ["structured_environment_passage_video", "measures_structured_enviroments"]),
    "talking-head media lookup",
  )

  for (const row of rows) {
    const metadata = {
      ...clone(row.metadata),
      public_url: TALKING_HEAD_PUBLIC_URL,
      exact_url_seated: TALKING_HEAD_PUBLIC_URL,
      source_oar2_public_url_correction: SOURCE_OAR2,
      frontend_hardcode_allowed: false,
    }
    assertOk(
      await supabase
        .from("measures_media_map")
        .update({ metadata })
        .eq("id", row.id),
      `${row.media_role} media public URL update`,
    )
  }

  return rows.map((row) => row.media_role)
}

function collectStrings(value) {
  if (value == null) return []
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (typeof value === "object") return Object.values(value).flatMap(collectStrings)
  return []
}

async function main() {
  assertOk(await supabase.from("measures_encounter_def").select("id").limit(1), "DB connection")

  const structureRow = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, registry_id, metadata, display_title, encounter_type, pause_allowed")
      .eq("encounter_key", STRUCTURE_PASSAGE)
      .single(),
    "fetch structure_passage",
  )

  const structureMetadata = clone(structureRow.metadata)
  const contracts = clone(structureMetadata.crystal_chamber_content_contracts)
  const understandPassage = clone(contracts.understand_environment_passage)

  const nextContracts = {
    ...contracts,
    structure_passage_contract_v1: STRUCTURE_PASSAGE_CONTRACT,
    crystal_chamber_sparse_orientation_contract_v1: SPARSE_CHAMBER_CONTRACT,
    understand_environment_passage: {
      ...understandPassage,
      public_label: "Understand the Environment",
      position_paragraph: POSITION_PARAGRAPH,
      video_control_contract: {
        ...clone(understandPassage.video_control_contract),
        audio_control_required: true,
        mute_control_required: true,
        skip_control_required: true,
        continue_control_required: true,
        auto_advance_allowed: true,
        auto_advance_target_surface: CRYSTAL_CHAMBER,
        cta_fallback_required: true,
        cta_label: "Continue",
        continue_label: "Continue",
        skip_label: "Skip",
        no_dead_end_surface: true,
      },
    },
  }

  const nextStructureMetadata = {
    ...structureMetadata,
    title: "Understand the Environment",
    informational_paragraph: POSITION_PARAGRAPH,
    renderer: "right_path_talking_head_passage",
    layout_contract: {
      ...clone(structureMetadata.layout_contract),
      layout_mode: "right_path_talking_head_passage",
      card_grid_hub_allowed: false,
      questions_explainer_allowed: false,
    },
    media_behavior_contract: {
      ...clone(structureMetadata.media_behavior_contract),
      auto_advance_on_end: true,
      auto_advance_target_surface: CRYSTAL_CHAMBER,
      fallback_continue_target_surface: CRYSTAL_CHAMBER,
    },
    crystal_chamber_content_contracts: nextContracts,
    crystal_right_path_rebinding_v1: {
      source_oar2: SOURCE_OAR2,
      structure_passage: "talking_head_passage",
      crystal_chamber: "sparse_orientation_chamber",
      card_grid_hub_deprecated_on_structure_passage: true,
    },
  }

  assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextStructureMetadata })
      .eq("id", structureRow.id),
    "update structure_passage metadata",
  )

  const talkingHeadMediaRolesUpdated = await seatTalkingHeadPublicUrl()

  const crystalRegistryId = await ensureRegistryRow(CRYSTAL_CHAMBER, "Crystal Chamber", 1011, "crystal")
  const [existingCrystal] = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", CRYSTAL_CHAMBER)
      .limit(1),
    "crystal_chamber lookup",
  )

  const crystalMetadata = {
    ...clone(existingCrystal?.metadata),
    function_layer: "orientation",
    state_expression: "public_crystal_chamber_sparse_orientation",
    renderer: "crystal_chamber_sparse_orientation",
    title: SPARSE_CHAMBER_CONTRACT.public_title,
    subtitle: SPARSE_CHAMBER_CONTRACT.public_context,
    header: structureMetadata.header ?? { title: "Measures Registry" },
    content_contract: SPARSE_CHAMBER_CONTRACT,
    crystal_chamber_content_contracts: nextContracts,
    crystal_right_path_rebinding_v1: {
      source_oar2: SOURCE_OAR2,
      surface_key: CRYSTAL_CHAMBER,
      questions_explainer_first: true,
      sparse_orientation: true,
      assessment_cta_target_surface: EVAL_PASSAGE,
    },
  }

  if (existingCrystal) {
    assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          registry_id: crystalRegistryId,
          display_title: "Crystal Chamber",
          material_family: "crystal",
          surface_type: "threshold",
          sequence_order: 1011,
          is_active: true,
          metadata: crystalMetadata,
        })
        .eq("id", existingCrystal.id),
      "update crystal_chamber",
    )
  } else {
    assertOk(
      await supabase.from("measures_encounter_def").insert({
        registry_id: crystalRegistryId,
        encounter_key: CRYSTAL_CHAMBER,
        display_title: "Crystal Chamber",
        encounter_type: structureRow.encounter_type ?? "view",
        material_family: "crystal",
        surface_type: "threshold",
        sequence_order: 1011,
        pause_allowed: structureRow.pause_allowed ?? false,
        is_entry_surface: false,
        is_active: true,
        metadata: crystalMetadata,
      }),
      "insert crystal_chamber",
    )
  }

  const transitionToCrystal = await ensureTransition(
    STRUCTURE_PASSAGE,
    CRYSTAL_CHAMBER,
    "route_crystal_chamber_from_structure_passage",
    "Continue",
    10,
  )
  const transitionToAssessment = await ensureTransition(
    CRYSTAL_CHAMBER,
    EVAL_PASSAGE,
    "route_eval_passage_from_crystal_chamber",
    "Assess the Environment",
    10,
  )

  const readback = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", [STRUCTURE_PASSAGE, CRYSTAL_CHAMBER])
      .order("sequence_order", { ascending: true }),
    "readback",
  )

  const structureReadback = readback.find((row) => row.encounter_key === STRUCTURE_PASSAGE)?.metadata ?? {}
  const crystalReadback = readback.find((row) => row.encounter_key === CRYSTAL_CHAMBER)?.metadata ?? {}
  const errors = []

  if (structureReadback.crystal_chamber_content_contracts?.structure_passage_contract_v1?.auto_advance_target_surface !== CRYSTAL_CHAMBER) {
    errors.push("structure_passage auto-advance target not seated")
  }
  if (structureReadback.crystal_chamber_content_contracts?.structure_passage_contract_v1?.questions_explainer_allowed !== false) {
    errors.push("structure_passage Questions exclusion not seated")
  }
  if (crystalReadback.content_contract?.render_order?.[0] !== "questions_explainer_video") {
    errors.push("crystal_chamber Questions-first order not seated")
  }
  if (crystalReadback.content_contract?.assessment_cta_target_surface !== EVAL_PASSAGE) {
    errors.push("crystal_chamber assessment CTA target not seated")
  }

  const visibleStrings = collectStrings([
    structureReadback.title,
    structureReadback.informational_paragraph,
    structureReadback.crystal_chamber_content_contracts?.structure_passage_contract_v1,
    crystalReadback.title,
    crystalReadback.subtitle,
    crystalReadback.content_contract,
  ])
  const forbidden = [
    "pricing",
    "payment",
    "c3 Key",
    "temp c3 Key",
    "commerce circuit",
    "permission standing",
    "conversion standing",
    "certification standing",
    "DAO standing",
    "distribution standing",
  ]
  for (const term of forbidden) {
    if (visibleStrings.some((value) => value.toLowerCase().includes(term.toLowerCase()))) {
      errors.push(`forbidden public term in seated copy: ${term}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        structure_passage: "talking_head_passage_bound",
        crystal_chamber: "sparse_orientation_chamber_bound",
        talking_head_media_roles_updated: talkingHeadMediaRolesUpdated,
        structure_to_crystal_transition: transitionToCrystal,
        crystal_to_assessment_transition: transitionToAssessment,
        auto_advance_target: CRYSTAL_CHAMBER,
        assessment_cta_target: EVAL_PASSAGE,
        validation: "PASS",
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
