require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2BaseUrl = (process.env.VITE_R2_PUBLIC_BASE_URL || "").replace(/\/+$/g, "")

if (!supabaseUrl || !supabaseKey || !r2BaseUrl) {
  throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and VITE_R2_PUBLIC_BASE_URL are required")
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const campaignKey = "agents_of_chaos_integrity_governance"
const sourceOar2 = "oar2_seat_measures_ai_assessment_content_structured_environment_media_v1"
const evidencePath =
  "docs/oar/measures_registry/seat_measures_ai_assessment_content_structured_environment_media_v1.json"

const assessmentContent = {
  chamber: {
    title: "MEASURES AI ASSESSMENT",
    body:
      "This chamber evaluates the structure surrounding your AI use.\n\nAuthority.\nValidation.\nOversight.\nImplementation.\nBehavioral registration.\n\nThe system is structured.\nThe assessment identifies whether your AI environment is.",
    primary_action: "Begin Assessment",
    soft_src_intro: "Before the diagnostic begins,\nidentify the environment being assessed.",
    soft_src_continuation: "Continue to Diagnostic",
  },
  completion: {
    title: "MEASURES AI ASSESSMENT COMPLETE",
    body: "Structural conditions have been recorded.\n\nContinue into the Structured Environment.",
    primary_action: "Enter Structured Environment",
  },
}

const structuredVideoCandidates = [
  "measures_structured_enviroments",
  "measures_structured_enviroments.mp4",
  "measures_structured_enviroments.MP4",
  "measures_structured_enviroments.mov",
  "measures_structured_enviroments.MOV",
  "measures_structured_environments.mp4",
]

const marbleToneCandidates = [
  "marble_tone_rise_return_5min.wav",
  "installation_tone_marble_rise_return_v1.wav",
  "marble_tone.wav",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "")
}

function encodeObjectKey(objectKey) {
  return trimSlashes(objectKey)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function r2Url(storagePath) {
  return `${r2BaseUrl}/${encodeObjectKey(storagePath)}`
}

async function retrievalStatus(storagePath) {
  const url = r2Url(storagePath)
  const response = await fetch(url, { method: "HEAD" })
  return {
    storagePath,
    url,
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
  }
}

async function firstRetrievable(candidates, label) {
  const checks = []
  for (const candidate of candidates) {
    const check = await retrievalStatus(candidate)
    checks.push(check)
    if (check.ok) return { selected: check, checks }
  }

  throw new Error(`${label} could not be verified in R2: ${checks.map((check) => `${check.storagePath}:${check.status}`).join(", ")}`)
}

function patchAssessmentMetadata(metadata) {
  const next = clone(metadata)
  next.title = assessmentContent.chamber.title
  next.subtitle = assessmentContent.chamber.body
  next.resolution_text = assessmentContent.completion.body
  next.assessment_chamber = {
    ...assessmentContent.chamber,
    source_oar2: sourceOar2,
    content_authority: "measures_encounter_def.metadata",
    frontend_hardcode_allowed: false,
  }
  next.assessment_completion = {
    ...assessmentContent.completion,
    source_oar2: sourceOar2,
    content_authority: "measures_encounter_def.metadata",
    frontend_hardcode_allowed: false,
  }
  next.media_roles = [
    ...new Set([
      ...(Array.isArray(next.media_roles) ? next.media_roles.filter((role) => typeof role === "string") : []),
      "structured_environment_passage_video",
      "measures_structured_enviroments",
      "marble_tone",
      "installation_tone_marble",
      "installation_tone_marble_rise_return_v1",
    ]),
  ]
  next.db_before_site_edit_rule = {
    active: true,
    source_oar2: sourceOar2,
    rule:
      "DB seating verification must complete before OAR2 site edits for text, media, route, CTA, or encounter content.",
  }
  next.source = sourceOar2
  return next
}

async function updateAssessmentEncounter() {
  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, display_title, metadata")
      .eq("encounter_key", "iis_eval_gate1")
      .maybeSingle(),
    "assessment encounter lookup",
  )

  if (!row) throw new Error("measures_encounter_def row missing for iis_eval_gate1")

  const metadata = patchAssessmentMetadata(row.metadata)
  const updated = assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        display_title: assessmentContent.chamber.title,
        metadata,
        is_active: true,
      })
      .eq("id", row.id)
      .select("encounter_key, display_title, metadata")
      .single(),
    "assessment encounter update",
  )

  return updated
}

async function confirmRegistryRelease() {
  const rows = assertOk(
    await supabase
      .from("measures_registry")
      .select("registry_key, release_state, access_state, is_active")
      .in("registry_key", ["iis_eval_gate1", "measures_registry", "systems_offering"])
      .order("registry_key", { ascending: true }),
    "registry release readback",
  )

  return rows
}

async function upsertMediaRole(role, storagePath, mimeType, sortOrder, runtimeUse) {
  const payload = {
    registry_key: "measures_registry_landing",
    encounter_key: "iis_eval_gate1",
    campaign_key: campaignKey,
    media_role: role,
    storage_bucket: "measures-media",
    storage_path: storagePath,
    mime_type: mimeType,
    sort_order: sortOrder,
    is_active: true,
    metadata: {
      source_oar2: sourceOar2,
      storage_provider: "cloudflare_r2",
      runtime_use: runtimeUse,
      frontend_hardcode_allowed: false,
      bucket_presence_only_authority: false,
    },
  }

  const existing = assertOk(
    await supabase
      .from("measures_media_map")
      .select("id")
      .eq("campaign_key", campaignKey)
      .eq("media_role", role)
      .limit(1),
    `${role} lookup`,
  )

  if (existing.length > 0) {
    return assertOk(
      await supabase
        .from("measures_media_map")
        .update(payload)
        .eq("id", existing[0].id)
        .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
        .single(),
      `${role} update`,
    )
  }

  return assertOk(
    await supabase
      .from("measures_media_map")
      .insert(payload)
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .single(),
    `${role} insert`,
  )
}

async function validateMediaRoles(roles) {
  return assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .eq("campaign_key", campaignKey)
      .in("media_role", roles)
      .order("media_role", { ascending: true }),
    "media role validation",
  )
}

async function main() {
  assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection")

  const structuredVideo = await firstRetrievable(structuredVideoCandidates, "Structured Environment passage video")
  const marbleTone = await firstRetrievable(marbleToneCandidates, "Marble tone")

  const assessmentEncounter = await updateAssessmentEncounter()
  const releaseRows = await confirmRegistryRelease()

  const mediaRows = []
  mediaRows.push(
    await upsertMediaRole(
      "structured_environment_passage_video",
      structuredVideo.selected.storagePath,
      structuredVideo.selected.contentType?.startsWith("video/") ? structuredVideo.selected.contentType : "video/mp4",
      140,
      "Structured Environment passage after Measures AI Assessment completion",
    ),
  )
  mediaRows.push(
    await upsertMediaRole(
      "measures_structured_enviroments",
      structuredVideo.selected.storagePath,
      structuredVideo.selected.contentType?.startsWith("video/") ? structuredVideo.selected.contentType : "video/mp4",
      141,
      "Runtime alias for uploaded Structured Environment talking-head passage",
    ),
  )

  const marbleMime = marbleTone.selected.contentType?.startsWith("audio/")
    ? marbleTone.selected.contentType
    : "audio/wav"

  for (const [index, role] of [
    "marble_tone",
    "installation_tone_marble",
    "installation_tone_marble_rise_return_v1",
  ].entries()) {
    mediaRows.push(
      await upsertMediaRole(
        role,
        marbleTone.selected.storagePath,
        marbleMime,
        150 + index,
        "Marble tone continuity for Measures Registry launch flow when Audio is enabled",
      ),
    )
  }

  const resolverRoles = [
    "structured_environment_passage_video",
    "measures_structured_enviroments",
    "marble_tone",
    "installation_tone_marble",
    "installation_tone_marble_rise_return_v1",
  ]
  const validationRows = await validateMediaRoles(resolverRoles)

  const evidence = {
    generatedAt: new Date().toISOString(),
    source_oar2: sourceOar2,
    mutationPerformed: true,
    assessmentContent,
    assessmentEncounter: {
      encounter_key: assessmentEncounter.encounter_key,
      display_title: assessmentEncounter.display_title,
      title: assessmentEncounter.metadata?.title ?? null,
      completionTitle: assessmentEncounter.metadata?.assessment_completion?.title ?? null,
      dbBeforeSiteEditRuleActive: assessmentEncounter.metadata?.db_before_site_edit_rule?.active === true,
    },
    structuredVideoChecks: structuredVideo.checks,
    selectedStructuredVideo: structuredVideo.selected,
    marbleToneChecks: marbleTone.checks,
    selectedMarbleTone: marbleTone.selected,
    mediaRows,
    releaseRows,
    validationRows,
    processRule:
      "DB seating verification must complete before any OAR2 site edits are made for text, media, route, CTA, or encounter content.",
    boundariesHeld: [
      "No frontend URL hardcode.",
      "No bucket-presence-only authority.",
      "No parallel content authority.",
      "No parallel assessment intake.",
    ],
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
