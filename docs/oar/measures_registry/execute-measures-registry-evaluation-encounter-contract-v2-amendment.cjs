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

if (!supabaseUrl || !writeKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, writeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const reader = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const campaignKey = "agents_of_chaos_integrity_governance"
const sourceOar2 = "docs/oar/measures_registry/oar2_measures_registry_evaluation_encounter_contract_v2.meta.md"
const evidencePath = path.join("docs", "oar", "measures_registry", "measures_registry_evaluation_encounter_contract_v2_evidence.json")
const encounterKeys = ["measures_ai_operational_evaluation", "iis_eval_gate1"]
const themeKey = "evaluation_chamber_lapis_marble_v1"

const marbleAccentRoles = [
  "marble_surface_panel",
  "marble_section_frame",
  "marble_divider",
  "marble_icon_backplate",
  "marble_corner_accent",
  "marble_base_molding",
  "marble_accent_reference",
]

const marbleAccentContract = {
  version: "v1",
  source_oar2: sourceOar2,
  roles: marbleAccentRoles,
  required_media_role: "marble_accent_reference",
  allowed_usage: [
    "assessment framing",
    "section plaques",
    "progression threshold framing",
    "icon backplates",
    "separator structures",
    "lower chamber architectural accents",
  ],
  behavior: ["softly illuminated", "lightly engraved", "calm", "dimensional", "architectural"],
  disallowed_behavior: ["glossy", "luxury retail", "bright white", "ornamental", "heavy decorative"],
  styling_direction: {
    material: "soft ivory marble",
    veining: "restrained_gold_allowed",
    contrast: "low",
    texture: "subtle",
    frame: "thin_gold_or_silver",
    disallowed: ["saturated_colors", "black_marble", "high_polish_reflections"],
  },
  ui_constraints: {
    role: "support_chamber_structure",
    disallowed: ["dominant_page_atmosphere", "replace_lapis_atmosphere", "card_heavy_ui", "luxury_ecommerce_feel"],
  },
}

const stylingContract = {
  version: "v3",
  source_oar2: sourceOar2,
  theme_key: themeKey,
  material_family: "obsidian",
  foundation_material: "obsidian",
  atmospheric_material: "lapis",
  structural_material: "marble",
  geometry_tone: "silver",
  accent_tone: "restrained_gold",
  spacing_style: "architectural_negative_space",
  pacing_style: "measured_threshold_progression",
  heading_style: "institutional_serif",
  body_style: "operational_sans",
  heading_tone: "measured_authoritative",
  body_tone: "operational_clarity",
  transition_style: "dissolve",
  atmospheric_motion: "restrained",
  interaction_motion: "minimal",
  lapis_contract: {
    must_feel: ["mineral", "dimensional", "architectural", "coherent"],
    may_not_feel: ["neon", "sci-fi", "startup gradient", "synthetic UI blue"],
  },
  marble_contract: {
    must_feel: ["institutional", "engraved", "calm", "structural", "lightly illuminated"],
    may_not_resemble: ["ecommerce cards", "glossy panels", "bright containers"],
  },
  watermark_contract: {
    scale: "giant",
    opacity: "low",
    layer: "behind_content_only",
    blend: "softly_blended_into_atmosphere",
    cropping: "partially_cropped_acceptable",
    foreground_branding: false,
  },
  findings_contract: {
    render_as: ["separated operational rows", "softly divided", "lightly engraved", "calm but serious"],
    disallowed: ["markdown bullets", "dashboard alerts", "aggressive warnings"],
  },
  disallowed_patterns: [
    "dashboard_cards",
    "startup_saas_ui",
    "neon_glow",
    "stacked_form_layouts",
    "floating_widgets",
    "progress_gamification",
    "playful_iconography",
    "ecommerce_funnel",
    "analytics_platform",
    "chatbot_ui",
    "quiz_interface",
  ],
}

const returnedAssessmentContract = {
  version: "v2",
  source_oar2: sourceOar2,
  returned_assessment_title: "Structural Drift Detected",
  returned_assessment_body:
    "Observed findings indicate the current operational environment is fragmented across systems, responsibilities, review pathways, and runtime dependencies.\n\nCurrent standing suggests AI optimization efforts are occurring within an unstable operational environment.",
  operational_risk_standing:
    "Without structured operational coherence:\n- ambiguity compounds over time\n- implementation reliability degrades\n- undocumented automation expands\n- acceleration increasingly outpaces governance capacity",
  clarification_title: "The issue is not AI itself.",
  clarification_body:
    "AI systems inherit the operational conditions of the environments they operate within.\n\nMost currently available solutions focus on accelerating deployment, automation, or output generation without first resolving the operational fragmentation limiting stable performance.\n\nAs a result, organizations often increase AI activity without realizing proportional operational benefit.",
  measures_registry_standing_title: "Measures Registry Standing",
  measures_registry_standing_body:
    "Measures Registry was established specifically to address this operational gap.\n\nStable AI optimization requires an environment capable of supporting it.\n\nWe know what will.",
  progression_threshold_label: "Next Step",
  progression_threshold_title: "Review Recommended Progression Pathway",
  progression_threshold_body:
    "Explore the structured pathway designed to help organizations move toward operational stability and implementation readiness.",
  progression_threshold_cta: "Review Recommended Progression Pathway",
  assessment_completion_label: "Assessment Complete",
  findings: [
    "Fragmented Operational Procedures",
    "System Environment Inconsistency",
    "Unbounded Automation Exposure",
    "Undefined Role Assignments",
  ],
  positioning_contract: {
    communicates: [
      "the organization has a real operational problem",
      "the issue is not AI itself",
      "current market solutions do not resolve the operational environment",
      "operational coherence determines AI optimization potential",
      "Measures Registry understands the operational gap",
      "a progression pathway exists",
    ],
    tone: ["calm", "measured", "institutional", "confident", "operationally authoritative"],
    not: ["fear-selling", "startup hype", "doom signaling", "AI panic messaging"],
  },
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

async function resolveStorageObject() {
  const candidates = [
    "measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp",
    "marble_chamber_codexstone.webp",
  ]

  for (const storagePath of candidates) {
    const publicUrl = writer.storage.from("measures-registry").getPublicUrl(storagePath).data.publicUrl
    const response = await fetch(publicUrl, { method: "HEAD" })
    if (!response.ok) continue

    return {
      role: "marble_accent_reference",
      storage_bucket: "measures-registry",
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: response.headers.get("content-type") ?? "image/webp",
      content_length: response.headers.get("content-length"),
      head_status: response.status,
    }
  }

  throw new Error(`No marble accent asset resolved from candidates: ${candidates.join(", ")}`)
}

async function upsertMarbleMedia(verified) {
  const payload = {
    registry_key: "measures_registry_landing",
    encounter_key: "measures_ai_operational_evaluation",
    campaign_key: campaignKey,
    media_role: "marble_accent_reference",
    storage_bucket: verified.storage_bucket,
    storage_path: verified.storage_path,
    mime_type: verified.mime_type,
    is_active: true,
    metadata: {
      source_oar2: sourceOar2,
      storage_provider: "supabase",
      runtime_use: "evaluation_chamber_marble_accent_reference",
      theme_key: themeKey,
      frontend_hardcode_allowed: false,
    },
  }

  const existing = assertOk(
    await writer
      .from("measures_media_map")
      .select("id")
      .eq("campaign_key", campaignKey)
      .eq("media_role", "marble_accent_reference")
      .limit(1),
    "marble media lookup",
  )

  if (existing.length > 0) {
    return assertOk(
      await writer
        .from("measures_media_map")
        .update(payload)
        .eq("id", existing[0].id)
        .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
        .single(),
      "marble media update",
    )
  }

  return assertOk(
    await writer
      .from("measures_media_map")
      .insert(payload)
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .single(),
    "marble media insert",
  )
}

function mergeAssessmentInterpretation(metadata) {
  const interpretation = clone(metadata.assessment_interpretation)
  const reportTemplates = clone(interpretation.report_templates)
  const structural = clone(reportTemplates.structural_drift_detected)

  return {
    ...interpretation,
    source_oar2: sourceOar2,
    report_templates: {
      ...reportTemplates,
      structural_drift_detected: {
        ...structural,
        assessment_result: returnedAssessmentContract.returned_assessment_title,
        operational_exposure_summary: returnedAssessmentContract.returned_assessment_body,
        recommended_structured_action: returnedAssessmentContract.operational_risk_standing,
        continuation_pathway: returnedAssessmentContract.progression_threshold_cta,
        important_clarification: returnedAssessmentContract.clarification_body,
      },
    },
  }
}

function nextMetadata(metadata) {
  const base = clone(metadata)
  const mediaRoles = Array.isArray(base.media_roles) ? base.media_roles : []
  const encounterContract = clone(base.encounter_contract)

  return {
    ...base,
    source_oar2: sourceOar2,
    theme_key: themeKey,
    media_roles: [...new Set([...mediaRoles, "marble_accent_reference"])],
    styling_contract: stylingContract,
    marble_accent_contract: marbleAccentContract,
    returned_assessment_contract: returnedAssessmentContract,
    assessment_interpretation: mergeAssessmentInterpretation(base),
    assessment_completion: {
      ...(base.assessment_completion && typeof base.assessment_completion === "object" ? base.assessment_completion : {}),
      ...returnedAssessmentContract,
      title: "Operational Risk Standing",
      assessment_result: returnedAssessmentContract.returned_assessment_title,
      content_authority: "measures_encounter_def.metadata",
      frontend_hardcode_allowed: false,
    },
    encounter_contract: {
      ...encounterContract,
      theme_key: themeKey,
      media_roles: [...new Set([...(Array.isArray(encounterContract.media_roles) ? encounterContract.media_roles : []), "marble_accent_reference"])],
      styling_contract: stylingContract,
      marble_accent_contract: marbleAccentContract,
      returned_assessment_contract: returnedAssessmentContract,
    },
  }
}

async function updateEncounter(encounterKey) {
  const row = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("*")
      .eq("encounter_key", encounterKey)
      .single(),
    `${encounterKey} encounter lookup`,
  )
  const metadata = nextMetadata(row.metadata)
  return assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata })
      .eq("id", row.id)
      .select("encounter_key, display_title, material_family, metadata")
      .single(),
    `${encounterKey} encounter update`,
  )
}

async function updateRegistry(encounterKey) {
  const row = assertOk(
    await writer
      .from("measures_registry")
      .select("*")
      .eq("registry_key", encounterKey)
      .maybeSingle(),
    `${encounterKey} registry lookup`,
  )
  if (!row) return null
  const metadata = clone(row.metadata)

  return assertOk(
    await writer
      .from("measures_registry")
      .update({
        metadata: {
          ...metadata,
          source_oar2: sourceOar2,
          theme_key: themeKey,
          styling_contract: stylingContract,
          marble_accent_contract: marbleAccentContract,
          returned_assessment_contract: returnedAssessmentContract,
        },
      })
      .eq("id", row.id)
      .select("registry_key, display_title, material_family, release_state, access_state, metadata")
      .single(),
    `${encounterKey} registry update`,
  )
}

async function main() {
  assertOk(await writer.from("measures_encounter_def").select("id").limit(1), "DB connection")

  const verifiedMarble = await resolveStorageObject()
  const marbleMediaRow = await upsertMarbleMedia(verifiedMarble)
  const registryRows = []
  const encounterRows = []

  for (const encounterKey of encounterKeys) {
    registryRows.push(await updateRegistry(encounterKey))
    encounterRows.push(await updateEncounter(encounterKey))
  }

  const runtimeEncounterRows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", encounterKeys)
      .order("encounter_key", { ascending: true }),
    "encounter runtime readback",
  )
  const runtimeMedia = assertOk(
    await reader
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .eq("campaign_key", campaignKey)
      .eq("media_role", "marble_accent_reference")
      .single(),
    "marble media runtime readback",
  )

  const previousEvidence = fs.existsSync(evidencePath)
    ? JSON.parse(fs.readFileSync(evidencePath, "utf8"))
    : {}
  const evidence = {
    ...previousEvidence,
    generatedAt: new Date().toISOString(),
    source_oar2: sourceOar2,
    amendment: "marble_accent_and_returned_assessment_contract",
    mutationPerformed: true,
    marbleAccent: {
      contract: marbleAccentContract,
      mediaRole: marbleMediaRow,
      storageReadback: verifiedMarble,
    },
    returnedAssessmentContract,
    stylingContract,
    registryRows: registryRows.filter(Boolean).map((row) => ({
      registry_key: row.registry_key,
      release_state: row.release_state,
      access_state: row.access_state,
      theme_key: row.metadata?.theme_key,
      structural_material: row.metadata?.styling_contract?.structural_material,
    })),
    runtimeReadback: runtimeEncounterRows.map((row) => ({
      encounter_key: row.encounter_key,
      theme_key: row.metadata?.theme_key,
      media_roles: row.metadata?.media_roles,
      styling_contract: row.metadata?.styling_contract,
      marble_accent_contract: row.metadata?.marble_accent_contract,
      returned_assessment_contract: row.metadata?.returned_assessment_contract,
      assessment_completion: {
        returned_assessment_title: row.metadata?.assessment_completion?.returned_assessment_title,
        clarification_title: row.metadata?.assessment_completion?.clarification_title,
        measures_registry_standing_title: row.metadata?.assessment_completion?.measures_registry_standing_title,
        progression_threshold_cta: row.metadata?.assessment_completion?.progression_threshold_cta,
      },
      question_count: row.metadata?.assessment_mechanics?.questions?.length ?? 0,
      option_counts: (row.metadata?.assessment_mechanics?.questions ?? []).map((question) => question.options?.length ?? 0),
    })),
    runtimeMedia,
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
