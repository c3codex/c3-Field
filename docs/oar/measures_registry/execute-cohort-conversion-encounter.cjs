require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const campaignKey = "agents_of_chaos_integrity_governance"
const encounterKey = "cohort_conversion_encounter"
const mediaRole = "hero_measured_image"
const expectedBucket = "measures-registry"
const expectedPath = "measures_registry/landing/images/measures_registry_measured_hero.webp"
const flatResolvedPath = "measured_hero_right.webp"
const source = "cohort_conversion_encounter_v1"

const metadataPatch = {
  function_layer: "institutional_conversion",
  state_expression: "public_cohort_conversion_encounter",
  renderer: "cohort_conversion_orientation",
  eyebrow: "Structured Foundational Cohort",
  title: "Measures Conversion",
  subtitle: "Structured Foundational Cohort",
  media_roles: [mediaRole],
  core_statement:
    "The Structured Foundational Cohort prepares institutions to recognize, evaluate, and orient their AI environments before governed conversion begins.\n\nThe cohort is preparatory.\n\nConversion requires an additional six-touchpoint governed implementation circuit prior to registry confirmation.",
  cohort_structure: [
    {
      title: "Phase 1 — Recognition",
      session: "Codexstone — Restoring Central Authority",
      failure_signature: "Contradictory truth surfaces",
      artifact: "codexstone_authority_map_v1.pdf",
    },
    {
      title: "Phase 2 — Constraint",
      session: "The Three Gates — Constraint Before Scale",
      failure_signature: "Unchecked propagation",
      artifact: "three_gates_constraint_review_v1.pdf",
      three_gates: [
        "No AI system operates without identified authority.",
        "No output proceeds without validation path.",
        "No environment scales beyond governance capacity.",
      ],
    },
    {
      title: "Phase 3 — Governance",
      session: "Governed Execution — Roles, Boundaries, and Implementation",
      failure_signature: "Role collapse",
      artifact: "governed_execution_review_v1.pdf",
      three_ai_role_contracts: [
        "Authority does not execute.",
        "Execution does not invent.",
        "Governance remains external to output.",
      ],
      three_governing_implementations: [
        "DB-first rendering.",
        "Traceable execution logging.",
        "Verification before deployment.",
      ],
    },
  ],
  live_structural_review: {
    title: "Live Structural Review",
    body:
      "After Session 3, the institution enters a live structural review.\n\nPurpose:\n\nApply recognition to the institution's environment, identify active drift zones, identify missing implementation layers, and determine whether governed conversion may proceed.",
  },
  structural_drift_index: [
    "authority",
    "validation",
    "governance",
    "execution",
    "traceability",
    "deployment oversight",
  ],
  readiness_conditions: [
    "identifiable authority surface",
    "defined validation ownership",
    "traceable execution path",
    "bounded AI role contracts",
    "governance capacity aligned to deployment scope",
    "measurable behavioral oversight",
  ],
  recognition_touchpoints: [
    "Epigraph encounter",
    "Split-path recognition",
    "Educate / evaluate encounter",
    "iis_eval_gate1",
    "Foundational cohort",
    "Live structural review",
  ],
  threshold: {
    title: "Structural Review",
    body: "This is not conversion, approval, or registry confirmation.\n\nIt determines whether governed conversion may proceed.",
  },
  governed_conversion_touchpoints: [
    "SRC Intake",
    "Codex Authority Seating",
    "Constraint Implementation",
    "AI Role Contract Assignment",
    "Governing Implementation Validation",
    "Registry Verification / Conversion Confirmation",
  ],
  actions: [
    {
      action_key: "request_cohort_consideration",
      label: "Request Cohort Consideration",
      behavior: "route_surface",
      target_encounter_key: "reserve_seat",
    },
    {
      action_key: "back_landing_root",
      label: "Back",
      behavior: "route_surface",
      target_encounter_key: "landing_root",
    },
  ],
  constraints: {
    no_scoring: true,
    no_immediate_conversion: true,
    no_registry_confirmation: true,
    no_src_intake: true,
    cohort_is_preparatory: true,
  },
  source_cohort_conversion: source,
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  const [encounter] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "cohort_conversion_encounter lookup failed",
  )

  if (!encounter) throw new Error("cohort_conversion_encounter missing")

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: { ...(encounter.metadata ?? {}), ...metadataPatch } })
      .eq("id", encounter.id),
    "cohort_conversion_encounter update failed",
  )

  const expectedLookup = await assertOk(
    await supabase.storage.from(expectedBucket).list("measures_registry/landing/images", { search: "measures_registry_measured_hero.webp", limit: 10 }),
    "expected measured image storage lookup failed",
  )
  const expectedFound = expectedLookup.some((file) => file.name === "measures_registry_measured_hero.webp")

  const rootLookup = await assertOk(
    await supabase.storage.from(expectedBucket).list("", { limit: 100 }),
    "root storage lookup failed",
  )
  const measuredCandidates = rootLookup
    .filter((file) => /measured|measure/.test(file.name) && file.name !== "hero_fracture_measure.webp")
    .map((file) => file.name)

    const flatResolvedFile = rootLookup.find((file) => file.name === flatResolvedPath)

  if (!expectedFound && flatResolvedFile) {
    const mediaPayload = {
      registry_key: "measures_registry_landing",
      encounter_key: encounterKey,
      campaign_key: campaignKey,
      media_role: mediaRole,
      storage_bucket: expectedBucket,
      storage_path: flatResolvedPath,
      mime_type: "image/webp",
      sort_order: 44,
      is_active: true,
      metadata: {
        source,
        expected_path_missing: expectedPath,
        flat_resolved_path: flatResolvedPath,
        storage_size: flatResolvedFile.metadata?.size ?? flatResolvedFile.metadata?.contentLength ?? null,
      },
    }

    const existingMedia = await assertOk(
      await supabase
        .from("measures_media_map")
        .select("id")
        .eq("campaign_key", campaignKey)
        .eq("media_role", mediaRole)
        .limit(1),
      "hero_measured_image media lookup failed",
    )

    if (existingMedia.length > 0) {
      await assertOk(
        await supabase.from("measures_media_map").update(mediaPayload).eq("id", existingMedia[0].id),
        "hero_measured_image media update failed",
      )
    } else {
      await assertOk(
        await supabase.from("measures_media_map").insert(mediaPayload),
        "hero_measured_image media insert failed",
      )
    }
  }

  const mediaRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .eq("campaign_key", campaignKey)
      .eq("media_role", mediaRole)
      .eq("is_active", true),
    "hero_measured_image media validation failed",
  )

  const [row] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "cohort_conversion_encounter validation failed",
  )

  const actions = row?.metadata?.actions ?? []
  const serialized = JSON.stringify(row)

  console.log(JSON.stringify({
    dbConnection: "active",
    cohortConversionEncounterExists: Boolean(row),
    requestCohortConsiderationActionExists: actions.some((action) => action.action_key === "request_cohort_consideration"),
    heroMeasuredImage: {
      mediaRole,
      expectedBucket,
      expectedPath,
      expectedStorageObjectFound: expectedFound,
      flatResolvedPathFound: Boolean(flatResolvedFile),
      activeMediaRows: mediaRows,
      measuredCandidates,
      note: expectedFound ? "resolved_expected_path" : flatResolvedFile ? "resolved_flat_bucket_path" : "missing_storage_path_not_seated",
    },
    phaseCount: row?.metadata?.cohort_structure?.length ?? 0,
    recognitionTouchpointCount: row?.metadata?.recognition_touchpoints?.length ?? 0,
    governedConversionTouchpointCount: row?.metadata?.governed_conversion_touchpoints?.length ?? 0,
    noScoringLogicIntroduced: !serialized.toLowerCase().includes("score"),
    metadata: row?.metadata ?? null,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
