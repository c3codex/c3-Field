require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const fs = require("node:fs")
const path = require("node:path")
const { randomUUID } = require("node:crypto")
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

const campaignKey = "agents_of_chaos_integrity_governance"
const sourceOar2 = "docs/oar/measures_registry/oar2_evaluation_chamber_src_intake_media_role_mapping_completion_v1.meta.md"
const evidencePath = path.join(
  "docs",
  "oar",
  "measures_registry",
  "evaluation_chamber_src_intake_media_role_mapping_completion_v1_evidence.json",
)

const encounterKey = "measures_ai_operational_evaluation"
const rendererKey = "measures_registry_evaluation_chamber"
const themeKey = "evaluation_chamber_lapis_obsidian_v1"

const mediaContract = [
  {
    role: "background",
    storagePath: "lapis_background.webp",
    runtimeUse: "evaluation_chamber_background",
  },
  {
    role: "watermark",
    storagePath: "measures_registry_emblem_watermark_preview_lapis.webp",
    runtimeUse: "evaluation_chamber_watermark",
  },
  {
    role: "question_chamber_background",
    storagePath: "evaluation_chamber_reference.webp",
    runtimeUse: "evaluation_question_chamber_background",
  },
  {
    role: "assessment_background",
    storagePath: "obsidian_background.webp",
    runtimeUse: "evaluation_returned_assessment_background",
  },
  {
    role: "transition_or_pause",
    storagePath: "return_antechamber.webp",
    runtimeUse: "evaluation_transition_or_pause_surface",
  },
  {
    role: "lapis_background",
    storagePath: "lapis_background.webp",
    runtimeUse: "evaluation_chamber_lapis_background",
  },
  {
    role: "registry_watermark",
    storagePath: "measures_registry_emblem_watermark_preview_lapis.webp",
    runtimeUse: "evaluation_chamber_registry_watermark",
  },
  {
    role: "registry_mark",
    storagePath: "measures_registry_mark.webp",
    runtimeUse: "evaluation_chamber_registry_mark",
  },
  {
    role: "evaluation_reference_image",
    storagePath: "evaluation_chamber_reference.webp",
    runtimeUse: "evaluation_chamber_reference_image",
  },
]

const assessmentQuestions = [
  {
    question_key: "ai_output_review_pathway",
    question:
      "How frequently do operational decisions inside your organization involve AI-generated output without a documented review pathway?",
    context_label: "Additional institutional context (optional)",
    options: [
      {
        value: "isolated_experimentation",
        label: "Rarely, and only in isolated experimentation",
        condition_tags: ["fragmented_operational_procedures"],
      },
      {
        value: "variable_review_practices",
        label: "Regularly, but review practices vary by team or individual",
        condition_tags: ["fragmented_operational_procedures", "undefined_role_assignments"],
      },
      {
        value: "influences_operational_decisions",
        label: "Frequently, and AI-generated output already influences operational decisions",
        condition_tags: ["fragmented_operational_procedures", "unbounded_automation_exposure"],
      },
    ],
  },
  {
    question_key: "active_ai_system_visibility",
    question:
      "Can your organization currently identify every AI system, automation, and external runtime surface actively influencing operational output?",
    context_label: "Additional institutional context (optional)",
    options: [
      {
        value: "documented_active_systems",
        label: "Yes, active systems and dependencies are documented",
        condition_tags: ["system_environment_inconsistency"],
      },
      {
        value: "partial_informal_dependencies",
        label: "Partially, but some tools, automations, or dependencies are informal",
        condition_tags: ["system_environment_inconsistency", "unbounded_automation_exposure"],
      },
      {
        value: "fragmented_visibility",
        label: "No, visibility is fragmented across teams, tools, or vendors",
        condition_tags: ["system_environment_inconsistency", "undefined_role_assignments"],
      },
    ],
  },
  {
    question_key: "failure_traceability",
    question:
      "If an AI-generated action caused operational failure today, could your organization trace who approved it, what system produced it, and what runtime dependencies enabled it?",
    context_label: "Additional institutional context (optional)",
    options: [
      {
        value: "approval_source_dependencies_traceable",
        label: "Yes, approval, system source, and dependencies are traceable",
        condition_tags: ["undefined_role_assignments"],
      },
      {
        value: "traceability_depends_on_handler",
        label: "Partially, but traceability depends on who handled the action",
        condition_tags: ["undefined_role_assignments", "system_environment_inconsistency"],
      },
      {
        value: "approval_source_dependencies_unclear",
        label: "No, the approval path, system source, or dependencies would be unclear",
        condition_tags: ["undefined_role_assignments", "fragmented_operational_procedures"],
      },
    ],
  },
  {
    question_key: "persistent_review_standard",
    question:
      "Are AI-generated outputs reviewed through a persistent operational standard, or does review currently depend on individual judgment and availability?",
    context_label: "Additional institutional context (optional)",
    options: [
      {
        value: "persistent_standard_documented",
        label: "A persistent review standard is documented and used",
        condition_tags: ["fragmented_operational_procedures"],
      },
      {
        value: "review_depends_on_team_habits",
        label: "Review exists, but it depends on team habits or availability",
        condition_tags: ["fragmented_operational_procedures", "undefined_role_assignments"],
      },
      {
        value: "review_informal_or_unenforced",
        label: "Review is inconsistent, informal, or not operationally enforced",
        condition_tags: ["fragmented_operational_procedures", "unbounded_automation_exposure"],
      },
    ],
  },
  {
    question_key: "safe_ai_acceleration_capacity",
    question:
      "Do you believe your current operational environment could safely support increased AI acceleration without introducing additional instability?",
    context_label: "Additional institutional context (optional)",
    options: [
      {
        value: "current_structures_support_acceleration",
        label: "Yes, current structures can support acceleration safely",
        condition_tags: ["system_environment_inconsistency"],
      },
      {
        value: "structural_gaps_need_resolution",
        label: "Possibly, but structural gaps would need to be resolved first",
        condition_tags: ["system_environment_inconsistency", "fragmented_operational_procedures"],
      },
      {
        value: "acceleration_amplifies_instability",
        label: "No, increased acceleration would likely amplify instability",
        condition_tags: ["unbounded_automation_exposure", "system_environment_inconsistency"],
      },
    ],
  },
]

const assessmentInterpretation = {
  version: "v1",
  source_oar2: sourceOar2,
  deterministic: true,
  frontend_hardcode_allowed: false,
  standing_rules: [
    {
      rule_key: "structural_drift_detected_contract",
      standing_key: "structural_drift_detected",
      standing: "Structural Drift Detected",
      priority: 100,
      all_tags: [],
      any_tags: [
        "fragmented_operational_procedures",
        "undefined_role_assignments",
        "system_environment_inconsistency",
        "unbounded_automation_exposure",
      ],
    },
  ],
  report_labels: {
    process_title: "MEASURES AI OPERATIONAL EVALUATION",
    assessment_title: "Operational Risk Standing",
    assessment_result: "Structural Drift Detected",
    recommended_response_label: "Continue to Recommended Operating Protocol",
  },
  condition_labels: {
    fragmented_operational_procedures: "Fragmented Operational Procedures",
    undefined_role_assignments: "Undefined Role Assignments",
    system_environment_inconsistency: "System Environment Inconsistency",
    unbounded_automation_exposure: "Unbounded Automation Exposure",
  },
  finding_map: {
    fragmented_operational_procedures: "Fragmented Operational Procedures",
    undefined_role_assignments: "Undefined Role Assignments",
    system_environment_inconsistency: "System Environment Inconsistency",
    unbounded_automation_exposure: "Unbounded Automation Exposure",
  },
  report_templates: {
    structural_drift_detected: {
      assessment_result: "Structural Drift Detected",
      operational_exposure_summary:
        "Observed findings indicate the current operational environment is fragmented across systems, responsibilities, review pathways, and runtime dependencies.\n\nCurrent standing suggests AI optimization efforts are occurring within an unstable operational environment.",
      recommended_structured_action:
        "Without structured alignment:\n- ambiguity compounds over time\n- AI output reliability degrades\n- undocumented automation expands\n- review continuity weakens\n- fragmented authority increases execution instability\n- operational fracture risk rises as AI dependency grows",
      continuation_pathway: "Continue to Recommended Operating Protocol",
      important_clarification:
        "There is no immediate or overnight correction for structurally fragmented environments.",
    },
  },
  email_artifact_template: {
    subject: "Measures AI Operational Evaluation - {assessment_result}",
    preview: "{operational_exposure_summary}",
    body: [
      "Operational Risk Standing: {assessment_result}",
      "{operational_exposure_summary}",
      "Findings: {findings}",
      "Important Clarification: There is no immediate or overnight correction for structurally fragmented environments.",
      "{continuation_pathway}",
    ],
  },
}

const encounterContract = {
  version: "v2",
  encounter_key: encounterKey,
  renderer_key: rendererKey,
  theme_key: themeKey,
  content_authority: "measures_encounter_def.metadata",
  frontend_hardcode_allowed: false,
  content_blocks: {
    process_title: "MEASURES AI OPERATIONAL EVALUATION",
    support_line: "AI reflects the structure of the environment it operates within.",
    sub_support_line: "Structure enables acceleration. Ambiguity creates drift.",
  },
  media_roles: mediaContract.map((item) => item.role),
  missing_media_roles: [
    {
      role: "ambient_audio",
      expected_storage_bucket: "measures-registry",
      expected_storage_path: "ambient_audio.*",
      reason: "No audio object was present in the measures-registry bucket during OAR2 execution.",
    },
  ],
  src_intake_contract: {
    required_fields: [
      "institution_name",
      "institution_type",
      "institution_address",
      "institution_phone",
      "contact_name",
      "contact_position",
      "contact_email",
      "intent",
    ],
    optional_fields: ["capture_context"],
    institution_type_route: "metadata.institution_type",
    capture_table: "public.measures_iis_eval_gate1_capture",
    schema_change_required: false,
  },
  gate_1_completion_rule: {
    complete: {
      gate_1: "complete",
      assessment_returned: true,
      src_requirements_satisfied: true,
    },
    held: {
      gate_1: "held",
      src_requirements_satisfied: false,
    },
  },
  interaction_contract: {
    pacing: "one_question_at_a_time",
    selection_required_before_continue: true,
    selected_answer_state: "visually_sealed",
    transition: "restrained_dissolve_fade",
    disallowed: [
      "stacked_survey",
      "scrolling_form",
      "auto_advance",
      "multiple_visible_questions",
      "generic_radio_list_ui",
    ],
  },
  returned_assessment_contract: {
    standing: "Structural Drift Detected",
    returned_assessment_title: "Structural Drift Detected",
    returned_assessment_body:
      "Observed findings indicate the current operational environment is fragmented across systems, responsibilities, review pathways, and runtime dependencies.",
    operational_risk_standing:
      "Without structured alignment:\n- ambiguity compounds over time\n- AI output reliability degrades\n- undocumented automation expands\n- review continuity weakens\n- fragmented authority increases execution instability\n- operational fracture risk rises as AI dependency grows",
    important_clarification:
      "There is no immediate or overnight correction for structurally fragmented environments.",
    continue_prompt: "Continue to Recommended Operating Protocol",
  },
  styling_contract: {
    foundation_material: "obsidian",
    atmospheric_material: "lapis",
    geometry_tone: "silver",
    accent_tone: "restrained_gold",
    spacing_style: "architectural_negative_space",
    pacing_style: "chamber_progression",
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
      "neon_glow",
      "gamified_progress",
      "playful_iconography",
      "ecommerce_pricing_grid",
      "floating_widget_ui",
    ],
  },
  icon_contract: {
    assessment_icon: "clipboard_check",
    warning_icon: "triangle_alert",
    relation_icon: "network",
    governance_icon: "shield",
    continuation_icon: "arrow_right",
    visibility_icon: "scan_search",
  },
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

async function verifyStorageObject(storagePath) {
  const listed = assertOk(
    await writer.storage.from("measures-registry").list("", {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    }),
    `storage list for ${storagePath}`,
  )
  const object = listed.find((item) => item.name === storagePath)
  if (!object) throw new Error(`measures-registry storage object missing: ${storagePath}`)

  const publicUrl = writer.storage.from("measures-registry").getPublicUrl(storagePath).data.publicUrl
  const response = await fetch(publicUrl, { method: "HEAD" })
  if (!response.ok) throw new Error(`${storagePath} public read failed: ${response.status}`)

  return {
    storage_bucket: "measures-registry",
    storage_path: storagePath,
    public_url: publicUrl,
    mime_type: object.metadata?.mimetype ?? response.headers.get("content-type") ?? "image/webp",
    content_length: object.metadata?.contentLength ?? response.headers.get("content-length") ?? null,
    head_status: response.status,
  }
}

async function ensureRegistryRow() {
  const existing = assertOk(
    await writer
      .from("measures_registry")
      .select("*")
      .eq("registry_key", encounterKey)
      .maybeSingle(),
    "registry lookup",
  )

  const iisRow = assertOk(
    await writer
      .from("measures_registry")
      .select("*")
      .eq("registry_key", "iis_eval_gate1")
      .maybeSingle(),
    "iis registry lookup",
  )
  if (!iisRow && !existing) throw new Error("iis_eval_gate1 registry row missing; cannot derive continuity state")

  const payload = {
    registry_key: encounterKey,
    display_title: "Measures AI Operational Evaluation",
    registry_family: iisRow?.registry_family ?? "spine",
    encounter_type: iisRow?.encounter_type ?? "view",
    material_family: "lapis",
    sequence_order: iisRow?.sequence_order ? iisRow.sequence_order + 1 : 1016,
    release_state: iisRow?.release_state ?? "released",
    access_state: iisRow?.access_state ?? "callable",
    parent_registry_id: iisRow?.parent_registry_id ?? null,
    depends_on_registry_id: iisRow?.depends_on_registry_id ?? null,
    envelope_id: iisRow?.envelope_id ?? null,
    phase_label: iisRow?.phase_label ?? null,
    is_active: true,
    metadata: {
      ...(iisRow?.metadata && typeof iisRow.metadata === "object" ? iisRow.metadata : {}),
      source_oar2: sourceOar2,
      renderer_key: rendererKey,
      theme_key: themeKey,
      frontend_hardcode_allowed: false,
    },
  }

  if (existing) {
    return assertOk(
      await writer
        .from("measures_registry")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single(),
      "registry update",
    )
  }

  return assertOk(
    await writer
      .from("measures_registry")
      .insert({ id: randomUUID(), ...payload })
      .select("*")
      .single(),
    "registry insert",
  )
}

async function ensureEncounterRow(registryRow) {
  const existing = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("*")
      .eq("encounter_key", encounterKey)
      .maybeSingle(),
    "encounter lookup",
  )
  const iisEncounter = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("*")
      .eq("encounter_key", "iis_eval_gate1")
      .maybeSingle(),
    "iis encounter lookup",
  )
  if (!iisEncounter && !existing) throw new Error("iis_eval_gate1 encounter row missing; cannot derive runtime contract")

  const baseMetadata = clone(existing?.metadata ?? iisEncounter?.metadata)
  const nextMetadata = {
    ...baseMetadata,
    source: sourceOar2,
    source_oar2: sourceOar2,
    encounter_contract: encounterContract,
    renderer: rendererKey,
    renderer_key: rendererKey,
    theme_key: themeKey,
    title: encounterContract.content_blocks.process_title,
    subtitle: `${encounterContract.content_blocks.support_line} ${encounterContract.content_blocks.sub_support_line}`,
    assessment_chamber: {
      ...(baseMetadata.assessment_chamber && typeof baseMetadata.assessment_chamber === "object"
        ? baseMetadata.assessment_chamber
        : {}),
      title: encounterContract.content_blocks.process_title,
      body: `${encounterContract.content_blocks.support_line} ${encounterContract.content_blocks.sub_support_line}`,
      renderer_key: rendererKey,
      theme_key: themeKey,
      source_oar2: sourceOar2,
      content_authority: "measures_encounter_def.metadata",
      frontend_hardcode_allowed: false,
    },
    assessment_mechanics: {
      version: "v1",
      source_oar2: sourceOar2,
      content_authority: "measures_encounter_def.metadata",
      frontend_hardcode_allowed: false,
      deterministic_mapping_prepared: true,
      questions: assessmentQuestions,
    },
    assessment_interpretation: {
      ...assessmentInterpretation,
      content_authority: "measures_encounter_def.metadata",
    },
    assessment_completion: {
      returned_assessment_title: "Structural Drift Detected",
      returned_assessment_body:
        encounterContract.returned_assessment_contract.returned_assessment_body,
      operational_risk_standing:
        encounterContract.returned_assessment_contract.operational_risk_standing,
      important_clarification:
        encounterContract.returned_assessment_contract.important_clarification,
      continue_prompt: encounterContract.returned_assessment_contract.continue_prompt,
      title: "Operational Risk Standing",
      assessment_result: "Structural Drift Detected",
      source_oar2: sourceOar2,
      content_authority: "measures_encounter_def.metadata",
      frontend_hardcode_allowed: false,
    },
    styling_contract: encounterContract.styling_contract,
    icon_contract: encounterContract.icon_contract,
    media_roles: encounterContract.media_roles,
    missing_media_roles: encounterContract.missing_media_roles,
    src_intake_contract: encounterContract.src_intake_contract,
    gate_1_completion_rule: encounterContract.gate_1_completion_rule,
  }

  const payload = {
    registry_id: registryRow.id,
    encounter_key: encounterKey,
    display_title: encounterContract.content_blocks.process_title,
    encounter_type: iisEncounter?.encounter_type ?? "view",
    material_family: "lapis",
    surface_type: iisEncounter?.surface_type ?? "threshold",
    sequence_order: iisEncounter?.sequence_order ? iisEncounter.sequence_order + 1 : 1016,
    pause_allowed: iisEncounter?.pause_allowed ?? false,
    is_entry_surface: false,
    is_active: true,
    metadata: nextMetadata,
  }

  if (existing) {
    return assertOk(
      await writer
        .from("measures_encounter_def")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single(),
      "encounter update",
    )
  }

  return assertOk(
    await writer
      .from("measures_encounter_def")
      .insert({ id: randomUUID(), ...payload })
      .select("*")
      .single(),
    "encounter insert",
  )
}

async function upsertMediaRole(item, verified) {
  const payload = {
    registry_key: "measures_registry_landing",
    encounter_key: encounterKey,
    campaign_key: campaignKey,
    media_role: item.role,
    storage_bucket: verified.storage_bucket,
    storage_path: verified.storage_path,
    mime_type: verified.mime_type,
    is_active: true,
    metadata: {
      source_oar2: sourceOar2,
      storage_provider: "supabase",
      runtime_use: item.runtimeUse,
      renderer_key: rendererKey,
      theme_key: themeKey,
      frontend_hardcode_allowed: false,
    },
  }

  const existing = assertOk(
    await writer
      .from("measures_media_map")
      .select("id")
      .eq("campaign_key", campaignKey)
      .eq("media_role", item.role)
      .limit(1),
    `${item.role} lookup`,
  )

  if (existing.length > 0) {
    return assertOk(
      await writer
        .from("measures_media_map")
        .update(payload)
        .eq("id", existing[0].id)
        .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
        .single(),
      `${item.role} update`,
    )
  }

  return assertOk(
    await writer
      .from("measures_media_map")
      .insert(payload)
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .single(),
    `${item.role} insert`,
  )
}

async function main() {
  assertOk(await writer.from("measures_registry").select("id").limit(1), "DB connection")

  const verifiedStorage = []
  for (const item of mediaContract) {
    verifiedStorage.push({ role: item.role, ...(await verifyStorageObject(item.storagePath)) })
  }

  const registryRow = await ensureRegistryRow()
  const encounterRow = await ensureEncounterRow(registryRow)
  const mediaRows = []
  for (const item of mediaContract) {
    const verified = verifiedStorage.find((candidate) => candidate.role === item.role)
    mediaRows.push(await upsertMediaRole(item, verified))
  }

  const runtimeEncounter = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, metadata")
      .eq("encounter_key", encounterKey)
      .maybeSingle(),
    "runtime encounter readback",
  )
  if (!runtimeEncounter) throw new Error("Runtime readback missing measures_ai_operational_evaluation")

  const runtimeMediaRows = assertOk(
    await reader
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .eq("campaign_key", campaignKey)
      .in("media_role", mediaContract.map((item) => item.role))
      .order("media_role", { ascending: true }),
    "runtime media readback",
  )

  const seatedQuestions = runtimeEncounter.metadata?.assessment_mechanics?.questions ?? []
  const seatedOptionCount = seatedQuestions.reduce((count, question) => count + (question.options?.length ?? 0), 0)
  const missingMediaRoles = mediaContract
    .map((item) => item.role)
    .filter((role) => !runtimeMediaRows.some((row) => row.media_role === role && row.is_active !== false))

  if (seatedQuestions.length !== 5 || seatedOptionCount !== 15) {
    throw new Error(`Question contract mismatch: ${seatedQuestions.length} questions / ${seatedOptionCount} options`)
  }
  if (missingMediaRoles.length > 0) {
    throw new Error(`Runtime media roles missing: ${missingMediaRoles.join(", ")}`)
  }

  const evidence = {
    generatedAt: new Date().toISOString(),
    source_oar2: sourceOar2,
    mutationPerformed: true,
    registry: {
      registry_key: registryRow.registry_key,
      release_state: registryRow.release_state,
      access_state: registryRow.access_state,
      is_active: registryRow.is_active,
    },
    encounter: {
      encounter_key: encounterRow.encounter_key,
      display_title: encounterRow.display_title,
      renderer_key: runtimeEncounter.metadata?.renderer_key,
      theme_key: runtimeEncounter.metadata?.theme_key,
      contract_version: runtimeEncounter.metadata?.encounter_contract?.version,
      question_count: seatedQuestions.length,
      answer_count: seatedOptionCount,
      returned_standing:
        runtimeEncounter.metadata?.assessment_interpretation?.report_templates?.structural_drift_detected?.assessment_result,
      returned_assessment_title:
        runtimeEncounter.metadata?.assessment_completion?.returned_assessment_title,
      src_intake_contract: runtimeEncounter.metadata?.src_intake_contract,
      gate_1_completion_rule: runtimeEncounter.metadata?.gate_1_completion_rule,
      styling_contract: runtimeEncounter.metadata?.styling_contract,
      icon_contract: runtimeEncounter.metadata?.icon_contract,
      missing_media_roles: runtimeEncounter.metadata?.missing_media_roles ?? [],
    },
    mediaRoleMappings: runtimeMediaRows.map((row) => ({
      media_role: row.media_role,
      storage_bucket: row.storage_bucket,
      storage_path: row.storage_path,
      storage_provider: row.metadata?.storage_provider ?? null,
      runtime_use: row.metadata?.runtime_use ?? null,
      is_active: row.is_active,
    })),
    storageReadback: verifiedStorage,
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
