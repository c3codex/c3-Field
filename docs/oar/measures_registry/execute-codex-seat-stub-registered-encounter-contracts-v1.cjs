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

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_codex_seat_stub_registered_encounter_contracts_v1.meta.md"

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

// ── Shared contract factories ─────────────────────────────────────────────────

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

// ── Per-encounter contract patches ────────────────────────────────────────────
// Existing metadata keys not in the patch are preserved via spread merge.

const ENCOUNTER_PATCHES = {
  // Mirrors eval_passage (same renderer) with structure-path framing.
  structure_passage: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_mode: "structure_threshold",
      passage_mode: "structure_orientation",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "operational_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "saas_dashboard",
        "native_ceremonial_language",
        "progress_gamification",
        "ecommerce_funnel",
        "startup_hero_banner",
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
      surface_role: "structure_passage_media",
      media_key_reference: "measures_structured_enviroments",
      autoplay: "deferred_to_renderer",
      conditional_note:
        "media_behavior_active_only_if_passage_media_is_seated for measures_structured_enviroments",
    }),
    transition_contract: makeTransitionContract({
      route_expectation: "structure_passage -> connect_src",
    }),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "structure_passage",
      "diagnostic_explainer_passage",
    ),
  },

  // Reuses measures_registry_evaluation_chamber with structure-path framing.
  // Shares assessment mechanics with measures_assessment — no fork.
  structured_eval: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_mode: "evaluation_chamber",
      path_framing: "structure_path",
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
      layout_mode: "evaluation_chamber",
      viewport_fit: "single_screen",
      copy_density: "chamber",
      mobile_layout: "single_column",
      heading_scale: "chamber_heading",
    },
    media_behavior_contract: makeMediaBehaviorContract({
      surface_role: "evaluation_chamber_media",
      media_roles_governed: [
        "background",
        "watermark",
        "question_chamber_background",
        "assessment_background",
        "transition_or_pause",
      ],
    }),
    branding_contract: makeBrandingContract({
      placement: "watermark_behind_content",
      opacity_rule: "low_opacity_watermark",
      surface_note: "registry mark appears as low-opacity watermark behind chamber content",
    }),
    transition_contract: makeTransitionContract({
      surface_note:
        "chamber internal transitions governed by shared assessment mechanics; encounter-level dissolve governs entry/exit",
      route_expectation: "structured_eval -> measures_phases_reveal",
    }),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "structured_eval",
      "measures_registry_evaluation_chamber",
    ),
    shared_assessment_mechanics_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      mechanics_source: "measures_assessment",
      mechanics_authority: "measures_encounter_def.metadata",
      fork_status: "not_forked",
      fork_authorization: "explicit_oar2_required",
      structure_path_framing: "active",
      renderer_reuse: "measures_registry_evaluation_chamber",
      note: "structured_eval uses shared assessment mechanics with measures_assessment — structure-path framing via renderer, no separate scoring logic",
    },
  },

  // New renderer. Post-assessment convergence point for measures_assessment and structured_eval.
  measures_phases_reveal: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "marble",
      foundation_material: "marble",
      accent_material: "lapis",
      surface_mode: "convergence_reveal",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "operational_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "assessment_result_display",
        "email_package_surface",
        "progress_gamification",
        "ecommerce_funnel",
        "startup_hero_banner",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "reveal",
      viewport_fit: "single_screen",
      copy_density: "measured",
      cta_placement: "below_reveal_content",
      mobile_layout: "single_column",
      heading_scale: "reveal_heading",
      convergence_note: "convergence point — receives from both measures_assessment and structured_eval",
    },
    media_behavior_contract: makeMediaBehaviorContract({
      surface_role: "reveal_surface_media",
      autoplay: "deferred_to_renderer",
      conditional_note: "media_behavior_active_only_if_reveal_media_is_seated",
    }),
    transition_contract: makeTransitionContract({
      route_expectation: "measures_phases_reveal -> about_measures_registry",
    }),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "measures_phases_reveal",
      "measures_phases_reveal",
    ),
  },

  // New renderer. Institutional authority/context surface.
  // Marble with lapis support. Operator-approved content seated in approved_content_contract.
  about_measures_registry: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "marble",
      foundation_material: "marble",
      accent_material: "lapis",
      surface_mode: "institutional_authority",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "authoritative",
      body_tone: "institutional_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "sales_hero",
        "mystical_or_native_language",
        "technical_documentation",
        "progress_gamification",
        "ecommerce_funnel",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "authority_surface",
      viewport_fit: "single_screen_or_short_scroll",
      copy_density: "measured",
      cta_placement: "below_support_points",
      mobile_layout: "single_column_scroll_allowed",
      heading_scale: "authority_heading",
    },
    branding_contract: makeBrandingContract({
      placement: "restrained_registry_mark",
      surface_note: "institutional authority surface — mark visible but restrained",
    }),
    footer_contract: makeFooterContract(),
    transition_contract: makeTransitionContract({
      route_expectation: "about_measures_registry -> structural_drift_publication",
    }),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "about_measures_registry",
      "about_measures_registry",
    ),
    approved_content_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      eyebrow: "ABOUT MEASURES REGISTRY",
      title: "A registered environment for governing AI behavior.",
      subtitle:
        "Measures Registry helps institutions identify, structure, and govern the operational environments where AI systems produce influence, decisions, and risk.",
      primary_statement:
        "AI governance cannot depend on model choice alone. It requires a registered environment where authority, review, system behavior, and operational accountability can be seen, traced, and maintained.",
      support_points: [
        "Behavior that is not registered cannot be governed.",
        "AI output is shaped by the environment around it.",
        "Structure makes review, responsibility, and correction possible.",
        "Registered systems reduce drift by making operational behavior visible.",
        "Measures Registry provides a pathway from assessment to structured response.",
      ],
      cta_label: "Read Structural Drift",
      cta_target: "structural_drift_publication",
      copy_authority: "measures_encounter_def.metadata",
      frontend_hardcode_allowed: false,
      implementation_note:
        "Operator-approved content — do not invent or alter copy. Serve from metadata.",
    },
  },

  // New renderer. Assessment package delivery contract.
  // Email dispatch is not implemented — contract marker and structure only.
  measures_eval_email_contract: {
    source_sitewide_contract: SITEWIDE_BINDING,
    contract_status: "contracted",
    styling_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_mode: "delivery_confirmation",
      heading_style: "institutional_serif",
      body_style: "operational_sans",
      heading_tone: "measured_authoritative",
      body_tone: "governed_clarity",
      transition_style: "dissolve",
      atmospheric_motion: "restrained",
      interaction_motion: "minimal",
      disallowed_patterns: [
        "ecommerce_checkout",
        "sales_confirmation",
        "progress_gamification",
        "marketing_copy",
      ],
    },
    layout_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      layout_mode: "delivery_contract",
      viewport_fit: "single_screen",
      copy_density: "compact",
      cta_placement: "below_confirmation_content",
      mobile_layout: "single_column",
      heading_scale: "confirmation_heading",
    },
    email_delivery_contract: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      contract_type: "assessment_package_delivery",
      requires: [
        "completed_assessment",
        "recipient_email",
        "recommended_structural_response_generated",
        "reserve_seat_route_available",
      ],
      stores: [
        "delivery_timestamp",
        "recipient_email",
        "assessment_reference",
        "recommended_response_reference",
        "reserve_seat_route",
        "delivery_status",
      ],
      email_structure: {
        subject: "Your Measures Registry Assessment Package",
        preheader:
          "Your assessment result and recommended structural response are enclosed.",
        body_sections: [
          "measures_registry_assessment_package",
          "assessment_result",
          "primary_finding",
          "recommended_structural_response",
          "reserve_seat",
          "record_recall_reference",
          "footer_copyright",
        ],
      },
      excludes: ["phase_reveal"],
      includes: ["recommended_structural_response"],
      tone: ["institutional", "clear", "short", "non_sales", "governed", "traceable"],
      dispatch_implementation: "deferred",
      frontend_hardcode_allowed: false,
      implementation_note:
        "Email dispatch is not implemented — contract marker and structure only. Do not implement sending.",
    },
    transition_contract: makeTransitionContract({
      route_expectation: "measures_eval_email_contract -> reserve_seat",
    }),
    encounter_isolation_contract: makeEncounterIsolationContract(
      "measures_eval_email_contract",
      "measures_eval_email_contract",
    ),
  },
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

// ── Phases ────────────────────────────────────────────────────────────────────

async function verifyPrerequisites() {
  // Sitewide contract active
  const { count: swCount, error: swError } = await writer
    .from("concordance_document")
    .select("*", { count: "exact", head: true })
    .eq("document_key", "measures_registry_sitewide_style_contract")
    .eq("authority_standing", "active")
  if (swError) throw new Error(`sitewide contract check: ${swError.message}`)
  if (swCount !== 1) throw new Error(`sitewide contract not active: count=${swCount}`)
  console.log("prereq_sitewide_contract: ok")

  // All 5 stubs present with renderer_contract_status: assigned
  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("id, encounter_key, is_active, metadata")
      .in("encounter_key", TARGET_KEYS),
    "stub encounter presence check",
  )
  const found = rows.map((r) => r.encounter_key)
  const missing = TARGET_KEYS.filter((k) => !found.includes(k))
  if (missing.length > 0) throw new Error(`missing stub encounters: ${missing.join(", ")}`)
  console.log(`prereq_stub_encounters: ok (${found.length} of ${TARGET_KEYS.length} found)`)

  const notAssigned = rows.filter((r) => r.metadata?.renderer_contract_status !== "assigned")
  if (notAssigned.length > 0) {
    throw new Error(
      `renderer_contract_status not assigned for: ${notAssigned.map((r) => r.encounter_key).join(", ")}`,
    )
  }
  console.log("prereq_renderer_contract_status: ok (all 5 assigned)")

  const notBound = rows.filter(
    (r) =>
      r.metadata?.source_sitewide_contract?.document_key !==
      "measures_registry_sitewide_style_contract",
  )
  if (notBound.length > 0) {
    throw new Error(
      `source_sitewide_contract not bound for: ${notBound.map((r) => r.encounter_key).join(", ")}`,
    )
  }
  console.log("prereq_sitewide_binding: ok (all 5 bound)")

  // Transition rule count (informational — not a blocker)
  const { count: ruleCount } = await writer
    .from("measures_transition_rule")
    .select("*", { count: "exact", head: true })
    .eq("rule_state", "active")
  console.log(`prereq_transition_rules: ${ruleCount ?? "unknown"} active rules (informational)`)

  return rows
}

async function seatContract(row) {
  const encounterKey = row.encounter_key
  const patch = ENCOUNTER_PATCHES[encounterKey]
  const mergedMetadata = { ...clone(row.metadata), ...patch }

  const updated = assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: mergedMetadata })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    `${encounterKey} contract seating`,
  )

  const clauses = Object.keys(patch).filter(
    (k) => k !== "source_sitewide_contract" && k !== "contract_status",
  )

  return {
    encounter_key: updated.encounter_key,
    contract_status: updated.metadata?.contract_status,
    sitewide_bound: updated.metadata?.source_sitewide_contract?.document_key ?? null,
    renderer: updated.metadata?.renderer ?? null,
    clauses_seated: clauses,
  }
}

async function readBack() {
  // All 5 stubs are is_active: false — use writer to bypass RLS
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
    contract_status: row.metadata?.contract_status ?? null,
    source_sitewide_contract:
      row.metadata?.source_sitewide_contract?.document_key ?? null,
    renderer: row.metadata?.renderer ?? null,
    styling_contract_version: row.metadata?.styling_contract?.version ?? null,
    layout_contract_version: row.metadata?.layout_contract?.version ?? null,
    has_transition_contract: !!row.metadata?.transition_contract,
    has_encounter_isolation: !!row.metadata?.encounter_isolation_contract,
    has_media_behavior: !!row.metadata?.media_behavior_contract,
    has_branding: !!row.metadata?.branding_contract,
    has_footer: !!row.metadata?.footer_contract,
    has_email_delivery: !!row.metadata?.email_delivery_contract,
    has_approved_content: !!row.metadata?.approved_content_contract,
    has_shared_assessment_mechanics: !!row.metadata?.shared_assessment_mechanics_contract,
    assessment_fork_status:
      row.metadata?.shared_assessment_mechanics_contract?.fork_status ?? null,
  }))
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  assertOk(
    await writer.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  const currentRows = await verifyPrerequisites()
  const rowMap = Object.fromEntries(currentRows.map((r) => [r.encounter_key, r]))

  console.log("\nphase_1: seating encounter contracts...")
  const results = []
  for (const key of TARGET_KEYS) {
    const result = await seatContract(rowMap[key])
    results.push(result)
    console.log(`  ${key}: ok (clauses: ${result.clauses_seated.join(", ")})`)
  }

  console.log("\nreadback...")
  const readback = await readBack()

  const allContracted = readback.every((r) => r.contract_status === "contracted")
  const allSitewideBound = readback.every(
    (r) => r.source_sitewide_contract === "measures_registry_sitewide_style_contract",
  )
  const noAssessmentFork = readback.every(
    (r) => r.assessment_fork_status === null || r.assessment_fork_status === "not_forked",
  )
  const emailExcludesPhaseReveal =
    readback.find((r) => r.encounter_key === "measures_eval_email_contract")
      ?.has_email_delivery ?? false
  const aboutContentSeated =
    readback.find((r) => r.encounter_key === "about_measures_registry")
      ?.has_approved_content ?? false

  const output = {
    db_connection: "ok",
    prereq_sitewide_contract: "ok",
    prereq_stub_encounters: "ok",
    prereq_renderer_contract_status: "ok",
    prereq_sitewide_binding: "ok",
    encounters_contracted: TARGET_KEYS.length,
    all_contracted: allContracted,
    all_sitewide_bound: allSitewideBound,
    no_assessment_fork: noAssessmentFork,
    email_delivery_contract_seated: emailExcludesPhaseReveal,
    about_approved_content_seated: aboutContentSeated,
    renderer_files_modified: false,
    css_files_modified: false,
    readback,
    contract_seating_results: results,
  }

  console.log(JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
