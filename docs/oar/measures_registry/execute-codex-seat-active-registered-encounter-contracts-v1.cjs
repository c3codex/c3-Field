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
  "docs/oar/measures_registry/oar2_codex_seat_active_registered_encounter_contracts_v1.meta.md"

const SITEWIDE_BINDING = {
  document_key: "measures_registry_sitewide_style_contract",
  version_key: "measures_registry_sitewide_style_contract_v1",
  seating: "encounter_contract_v1",
  source_oar2: SOURCE_OAR2,
}

function makeTransitionContract(overrides = {}) {
  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    inherits_from: "mrssc_v1_transition_contract",
    transition_style: "dissolve",
    state_isolation: "encounter_boundary",
    entry_transition: "fade_in",
    exit_transition: "dissolve_out",
    ...overrides,
  }
}

function makeEncounterIsolationContract(encounterKey, renderer) {
  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    encounter_key: encounterKey,
    renderer,
    boundary: "encounter_isolated",
    content_authority: "measures_encounter_def.metadata",
    frontend_hardcode_allowed: false,
    isolation_rules: [
      "no_cross_encounter_state_bleed",
      "media_scoped_to_encounter",
      "contract_authority_from_codex",
    ],
  }
}

function makeMediaBehaviorContract(overrides = {}) {
  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    inherits_from: "mrssc_v1_media_behavior_contract",
    autoplay: "allowed_muted",
    mute_state: "muted_on_entry",
    interaction_unlock: "user_initiated_unmute",
    encounter_scoped: true,
    persistence_boundary: "encounter",
    ...overrides,
  }
}

function makeBrandingContract(overrides = {}) {
  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    inherits_from: "mrssc_v1_branding_contract",
    registry_mark: "present",
    placement: "restrained",
    opacity_rule: "restrained",
    institutional_identity: "measures_registry",
    frontend_hardcode_allowed: false,
    ...overrides,
  }
}

function makeFooterContract(overrides = {}) {
  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    inherits_from: "mrssc_v1_footer_contract",
    footer_visibility: "present",
    copyright_authority: "measures_registry",
    copy_authority: "codex_governed",
    frontend_hardcode_allowed: false,
    ...overrides,
  }
}

// Per-encounter metadata patches. Existing metadata keys not in the patch are preserved.
// measures_assessment: ADD only missing sitewide clauses — existing v3 styling, v2 layout, assessment mechanics untouched.
const ENCOUNTER_PATCHES = {
  ai_isnt_broken_intro: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      atmospheric_material: "epigraph",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "authoritative",
      body_tone: "declarative",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "startup_hero_banner",
        "marketing_carousel",
        "progress_gamification",
        "ecommerce_funnel",
        "chatbot_ui",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "split_hero",
      media_panel: "left",
      text_panel: "right",
      viewport_fit: "single_screen",
      mobile_layout: "stacked_media_above_text",
      heading_scale: "entry_hero_heading",
      cta_placement: "below_body_copy",
      mobile_cta_placement: "below_stacked_text",
    },
    media_behavior_contract: makeMediaBehaviorContract({
      surface_role: "entry_hero_media",
    }),
    branding_contract: makeBrandingContract({
      placement: "top_left_mark_or_watermark",
    }),
    footer_contract: makeFooterContract(),
    transition_contract: makeTransitionContract(),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "ai_isnt_broken_intro",
      "epigraph_split_hero",
    ),
  },

  evaluate_structure_path: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "operational_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "playful_iconography",
        "progress_gamification",
        "ecommerce_funnel",
        "stacked_form_layouts",
        "dashboard_cards",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "path_choice",
      choice_presentation: "binary_stacked_or_paired",
      viewport_fit: "single_screen",
      cta_placement: "centered_or_paired_below_copy",
      mobile_layout: "stacked_choices_single_column",
      heading_scale: "measured_section_heading",
    },
    path_action_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      inherits_from: "mrssc_v1_button_icon_contract",
      primary_path: {
        action_id: "route_eval_passage",
        label: "Evaluate Structure",
        target: "eval_passage",
        emphasis: "primary",
      },
      secondary_path: {
        action_id: "route_structure_passage",
        label: "Orient to Structure",
        target: "structure_passage",
        emphasis: "secondary",
      },
      action_authority: "measures_encounter_def.metadata",
      frontend_hardcode_allowed: false,
    },
    transition_contract: makeTransitionContract(),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "evaluate_structure_path",
      "measures_registry_path_choice",
    ),
  },

  eval_passage: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      passage_mode: "educational_diagnostic",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "operational_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "dashboard_cards",
        "startup_saas_ui",
        "progress_gamification",
        "ecommerce_funnel",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "passage_explainer",
      viewport_fit: "single_screen",
      copy_density: "measured",
      cta_placement: "below_passage_copy",
      mobile_layout: "single_column_scroll_allowed",
      heading_scale: "passage_heading",
    },
    media_behavior_contract: makeMediaBehaviorContract({
      autoplay: "deferred_to_renderer",
      surface_role: "educational_passage_media",
      conditional_note: "media_behavior_active_only_if_passage_media_is_seated",
    }),
    transition_contract: makeTransitionContract(),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "eval_passage",
      "diagnostic_explainer_passage",
    ),
  },

  connect_src: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_type: "static_authority",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "operational_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "dashboard_cards",
        "marketing_hero",
        "ecommerce_funnel",
        "progress_gamification",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "authority_surface",
      viewport_fit: "single_screen",
      copy_density: "restrained",
      cta_placement: "centered_or_below_authority_copy",
      mobile_layout: "single_column",
      heading_scale: "authority_heading",
    },
    branding_contract: makeBrandingContract({
      placement: "authority_surface_mark",
      surface_note:
        "registry authority surface — mark reinforces institutional identity",
    }),
    src_intake_marker: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      surface_type: "soft_src_junction",
      src_capture_mode: "passive_path_context",
      intake_stored: true,
      recallable: true,
      hard_gate: false,
      junction_note:
        "connect_src serves both eval_passage path and structure_passage path — path context resolved by renderer based on incoming route",
    },
    transition_contract: makeTransitionContract(),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "connect_src",
      "static_authority_surface",
    ),
  },

  // measures_assessment: ADD ONLY missing sitewide clauses.
  // Existing: styling_contract v3, layout_contract v2, marble_accent_contract,
  // returned_assessment_contract, assessment_interpretation, assessment_completion,
  // assessment_mechanics, encounter_contract, media_roles — ALL PRESERVED via merge.
  measures_assessment: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    media_behavior_contract: makeMediaBehaviorContract({
      surface_role: "evaluation_chamber_media",
      media_roles_governed: [
        "background",
        "watermark",
        "question_chamber_background",
        "assessment_background",
        "transition_or_pause",
        "marble_accent_reference",
      ],
    }),
    branding_contract: makeBrandingContract({
      placement: "watermark_behind_content",
      opacity_rule: "low_opacity_watermark",
      surface_note:
        "registry mark appears as low-opacity watermark behind chamber content",
    }),
    footer_contract: makeFooterContract({
      footer_visibility: "deferred",
      footer_note:
        "evaluation chamber — footer visibility governed by assessment phase state",
    }),
    transition_contract: makeTransitionContract({
      surface_note:
        "chamber internal transitions (question-to-question) governed by assessment mechanics; encounter-level dissolve governs entry/exit",
    }),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "measures_assessment",
      "measures_registry_evaluation_chamber",
    ),
  },

  structural_drift_publication: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_type: "publication",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "publication_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "dashboard_cards",
        "startup_saas_ui",
        "ecommerce_funnel",
        "progress_gamification",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "publication",
      viewport_fit: "scrollable",
      copy_density: "document",
      cta_placement: "end_of_publication",
      mobile_layout: "single_column_scroll",
      heading_scale: "publication_heading",
    },
    footer_contract: makeFooterContract(),
    transition_contract: makeTransitionContract(),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "structural_drift_publication",
      "structural_drift_dispatches",
    ),
  },

  reserve_seat: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_type: "intake_commitment",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "commitment_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "ecommerce_funnel",
        "progress_gamification",
        "startup_cta_stack",
        "urgency_tactics",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "selector",
      viewport_fit: "single_screen",
      copy_density: "compact",
      cta_placement: "centered_below_copy",
      mobile_layout: "single_column",
      heading_scale: "commitment_heading",
    },
    action_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      inherits_from: "mrssc_v1_button_icon_contract",
      primary_action: {
        action_id: "route_reserve_seat",
        label: "Reserve Seat",
        emphasis: "primary",
      },
      action_authority: "measures_encounter_def.metadata",
      frontend_hardcode_allowed: false,
    },
    transition_contract: makeTransitionContract(),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "reserve_seat",
      "reserve_seat_selector",
    ),
  },

  phase_payment: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_type: "commitment_surface",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "commitment_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "ecommerce_checkout_funnel",
        "payment_urgency_tactics",
        "startup_pricing_grid",
        "progress_gamification",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "hold_surface",
      viewport_fit: "single_screen",
      copy_density: "compact",
      cta_placement: "centered",
      mobile_layout: "single_column",
      heading_scale: "commitment_heading",
    },
    footer_contract: makeFooterContract(),
    transition_contract: makeTransitionContract(),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "phase_payment",
      "hold_surface",
    ),
    payment_commitment_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      commitment_type: "phase_payment",
      payment_logic_implementation: "deferred",
      payment_authority: "pending_implementation",
      commitment_marker: "phase_payment_intake",
      frontend_hardcode_allowed: false,
      implementation_note:
        "payment logic is not implemented — contract marker only; renderer must not implement payment processing",
    },
  },
}

const TARGET_KEYS = Object.keys(ENCOUNTER_PATCHES)

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
  if (swCount !== 1)
    throw new Error(`sitewide contract not active: count=${swCount}`)
  console.log("prereq_sitewide_contract: ok")

  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key")
      .in("encounter_key", TARGET_KEYS),
    "target encounter presence check",
  )
  const found = rows.map((r) => r.encounter_key)
  const missing = TARGET_KEYS.filter((k) => !found.includes(k))
  if (missing.length > 0)
    throw new Error(`missing target encounters: ${missing.join(", ")}`)
  console.log(`prereq_target_encounters: ok (${found.length} of ${TARGET_KEYS.length} found)`)
}

async function seatContract(encounterKey) {
  const row = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .single(),
    `${encounterKey} fetch`,
  )

  const patch = ENCOUNTER_PATCHES[encounterKey]
  const mergedMetadata = {
    ...clone(row.metadata),
    ...patch,
  }

  const updated = assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: mergedMetadata })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    `${encounterKey} update`,
  )

  const clauses = Object.keys(patch).filter(
    (k) => k !== "source_sitewide_contract" && k !== "contract_status",
  )

  return {
    encounter_key: updated.encounter_key,
    contract_status: updated.metadata?.contract_status,
    sitewide_bound: updated.metadata?.source_sitewide_contract?.document_key ?? null,
    clauses_seated: clauses,
  }
}

async function readBack() {
  const rows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", TARGET_KEYS)
      .order("encounter_key", { ascending: true }),
    "readback query",
  )

  return rows.map((row) => ({
    encounter_key: row.encounter_key,
    is_active: row.is_active,
    contract_status: row.metadata?.contract_status ?? null,
    source_sitewide_contract:
      row.metadata?.source_sitewide_contract?.document_key ?? null,
    styling_contract_version: row.metadata?.styling_contract?.version ?? null,
    layout_contract_version: row.metadata?.layout_contract?.version ?? null,
    has_transition_contract: !!row.metadata?.transition_contract,
    has_encounter_isolation: !!row.metadata?.encounter_isolation_contract,
    has_media_behavior: !!row.metadata?.media_behavior_contract,
    has_branding: !!row.metadata?.branding_contract,
    has_footer: !!row.metadata?.footer_contract,
  }))
}

async function main() {
  assertOk(
    await writer.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  await verifyPrerequisites()

  console.log("\nphase_1: seating encounter contracts...")
  const results = []
  for (const key of TARGET_KEYS) {
    const result = await seatContract(key)
    results.push(result)
    console.log(`  ${key}: ok (clauses: ${result.clauses_seated.join(", ")})`)
  }

  console.log("\nreadback...")
  const readback = await readBack()

  const allContracted = readback.every((r) => r.contract_status === "contracted")
  const allBound = readback.every(
    (r) =>
      r.source_sitewide_contract === "measures_registry_sitewide_style_contract",
  )

  const output = {
    db_connection: "ok",
    prereq_sitewide_contract: "ok",
    prereq_target_encounters: "ok",
    encounters_contracted: TARGET_KEYS.length,
    all_contracted: allContracted,
    all_sitewide_bound: allBound,
    readback,
    contract_seating_results: results,
  }

  console.log(JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
