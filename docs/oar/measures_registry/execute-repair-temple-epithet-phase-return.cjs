require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const crypto = require("node:crypto")
const { createClient } = require("@supabase/supabase-js")

const evidencePath = "docs/oar/measures_registry/repair_temple_epithet_phase_return_v1.json"
const sourceOar = "repair_temple_epithet_phase_return_v1"

const serviceUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/+$/g, "")
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2BaseUrl = (process.env.VITE_R2_PUBLIC_BASE_URL || "").replace(/\/+$/g, "")

if (!serviceUrl || !serviceKey || !r2BaseUrl) {
  throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and VITE_R2_PUBLIC_BASE_URL are required")
}

const supabase = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const correctedInannaObjectKey = "inanna_encounter .MP4"

const epithetPlans = [
  {
    registryKey: "chamber_epithets_01_primus_artus",
    encounterKey: "chamber_epithets_01_primus_artus_encounter",
    epithetTitle: "Primus Artus",
    materialToneMediaKey: "installation_tone_obsidian_rise_return_v1",
    materialToneRole: "material_tone",
    materialToneFamily: "obsidian",
  },
  {
    registryKey: "chamber_epithets_02_gemynd_corpus",
    encounterKey: "chamber_epithets_02_gemynd_corpus_encounter",
    epithetTitle: "Gemynd Corpus",
  },
  {
    registryKey: "chamber_epithets_03_percipari",
    encounterKey: "chamber_epithets_03_percipari_encounter",
    epithetTitle: "Percipari",
  },
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function mergeMetadata(existing, patch) {
  return {
    ...(existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {}),
    ...patch,
  }
}

function encodeObjectKey(objectKey) {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function runtimeUrl(objectKey) {
  return `${r2BaseUrl}/${encodeObjectKey(objectKey.replace(/^\/+|\/+$/g, ""))}`
}

async function retrievalStatus(url) {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return {
      tested: true,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
      lastModified: response.headers.get("last-modified"),
    }
  } catch (error) {
    return { tested: true, ok: false, error: error.message }
  }
}

function signR2Request({ method, bucket, query = "", prefix = "" }) {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID
  const access = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secret = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  if (!account || !access || !secret) return null

  const region = "auto"
  const service = "s3"
  const host = `${account}.r2.cloudflarestorage.com`
  const path = `/${bucket}${prefix ? `/${prefix}` : ""}`
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "")
  const date = amzDate.slice(0, 8)
  const emptyHash = crypto.createHash("sha256").update("").digest("hex")
  const headers = {
    host,
    "x-amz-content-sha256": emptyHash,
    "x-amz-date": amzDate,
  }
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date"
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key}:${headers[key]}\n`)
    .join("")
  const canonicalRequest = [
    method,
    path,
    query,
    canonicalHeaders,
    signedHeaders,
    emptyHash,
  ].join("\n")
  const scope = `${date}/${region}/${service}/aws4_request`
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n")
  const hmac = (key, value, encoding) => crypto.createHmac("sha256", key).update(value).digest(encoding)
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secret}`, date), region), service), "aws4_request")
  const signature = hmac(signingKey, stringToSign, "hex")
  headers.authorization =
    `AWS4-HMAC-SHA256 Credential=${access}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    url: `https://${host}${path}${query ? `?${query}` : ""}`,
    headers,
  }
}

async function listR2Prefix(prefix) {
  const bucket = process.env.L2_SHARED_MEDIA_BUCKET || "measures-media"
  const query = `list-type=2&prefix=${encodeURIComponent(prefix)}`
  const signed = signR2Request({ method: "GET", bucket, query })
  if (!signed) return { available: false, reason: "R2 listing credentials unavailable" }
  const response = await fetch(signed.url, { headers: signed.headers })
  const body = await response.text()
  const objects = [...body.matchAll(/<Contents>[\s\S]*?<Key>(.*?)<\/Key>[\s\S]*?<LastModified>(.*?)<\/LastModified>[\s\S]*?<Size>(.*?)<\/Size>[\s\S]*?<\/Contents>/g)]
    .map((match) => ({
      key: match[1],
      lastModified: match[2],
      size: Number(match[3]),
    }))
  return {
    available: true,
    ok: response.ok,
    status: response.status,
    bucket,
    prefix,
    objects,
  }
}

function epithetAspectSlots(epithetTitle) {
  return [
    {
      role: "aspect_original_artwork",
      label: "Original Artwork",
      show_when_unseated: false,
    },
    {
      role: "aspect_knew_album",
      label: `${epithetTitle}-Knew Album`,
      show_when_unseated: false,
    },
    {
      role: "aspect_material_tone",
      label: "Material Tone",
      show_when_unseated: false,
    },
  ]
}

function patchEpithetMetadata(metadata, epithetTitle) {
  const next = clone(metadata) ?? {}
  const chamberplate = mergeMetadata(next.chamberplate, {
    aspect_slots: epithetAspectSlots(epithetTitle),
    aspect_absence_mode: "hide_absence",
  })

  next.chamberplate = chamberplate
  next.presentation = mergeMetadata(next.presentation, {
    chamberplate: mergeMetadata(next.presentation?.chamberplate, {
      aspect_slots: chamberplate.aspect_slots,
      aspect_absence_mode: "hide_absence",
    }),
  })
  next.source_oar2 = next.source_oar2 ?? sourceOar
  next.last_repaired_by = sourceOar
  return next
}

function phaseMapAction() {
  return {
    id: "return_to_antechamber_via_kumurrah",
    label: "Return to Antechamber",
    kind: "return",
    target_registry_key: "kumurrah_passage",
    target_after_passage: "return_antechamber",
    sort_order: 90,
    metadata: {
      passage_key: "kumurrah_passage",
      target_after_passage: "return_antechamber",
      source_oar2: sourceOar,
    },
  }
}

function patchPhaseMapMetadata(metadata) {
  const next = clone(metadata) ?? {}
  const actions = Array.isArray(next.actions) ? next.actions : []
  const filteredActions = actions.filter((action) => {
    if (!action || typeof action !== "object") return false
    const id = action.id
    return id !== "return_to_temple_via_harrumuk" && id !== "return_to_antechamber_via_kumurrah"
  })

  next.actions = [...filteredActions, phaseMapAction()]
  next.phase_map = mergeMetadata(next.phase_map, {
    routing: mergeMetadata(next.phase_map?.routing, {
      return_target: "kumurrah_passage",
      return_target_after_passage: "return_antechamber",
    }),
  })
  next.routing = mergeMetadata(next.routing, {
    return_target: "kumurrah_passage",
    return_target_after_passage: "return_antechamber",
  })
  next.last_repaired_by = sourceOar
  return next
}

function mediaAspectPatch(role, epithetTitle) {
  if (role === "original_artwork") {
    return {
      contract_role: "aspect_original_artwork",
      aspect_slot: "aspect_original_artwork",
      aspect_label: "Original Artwork",
    }
  }

  if (role === "full_song") {
    return {
      contract_role: "aspect_knew_album",
      aspect_slot: "aspect_knew_album",
      aspect_label: `${epithetTitle}-Knew Album`,
    }
  }

  if (role === "material_tone" || role === "lapis_tone") {
    return {
      contract_role: "aspect_material_tone",
      aspect_slot: "aspect_material_tone",
      aspect_label: "Material Tone",
    }
  }

  return null
}

async function patchEpithet(plan) {
  const encounter = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", plan.encounterKey)
      .single(),
    `${plan.encounterKey} lookup`,
  )

  const updatedEncounter = assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: patchEpithetMetadata(encounter.metadata, plan.epithetTitle) })
      .eq("id", encounter.id)
      .select("encounter_key, metadata")
      .single(),
    `${plan.encounterKey} update`,
  )

  const maps = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("id, surface_key, media_key, role, metadata")
      .in("surface_key", [plan.registryKey, plan.encounterKey])
      .in("role", ["original_artwork", "full_song", "material_tone", "lapis_tone"])
      .eq("status", "active"),
    `${plan.encounterKey} media map lookup`,
  )

  const updatedMaps = []
  if (plan.materialToneMediaKey) {
    updatedMaps.push(
      assertOk(
        await supabase
          .from("measures_surface_media_map")
          .upsert(
            {
              surface_key: plan.registryKey,
              media_key: plan.materialToneMediaKey,
              role: plan.materialToneRole ?? "material_tone",
              sequence_index: 75,
              status: "active",
              metadata: {
                audio_role: "material_tone",
                tone_family: plan.materialToneFamily,
                aspect_slot: "aspect_material_tone",
                aspect_type: "audio",
                aspect_label: "Material Tone",
                contract_role: "aspect_material_tone",
                available_after: "featured_video_complete_or_skip",
                render_behavior: "audio_play",
                default_volume: 0.16,
                show_over_video: false,
                source_oar2: sourceOar,
                frontend_hardcode_allowed: false,
              },
            },
            { onConflict: "surface_key,media_key,role" },
          )
          .select("surface_key, media_key, role, metadata")
          .single(),
        `${plan.encounterKey} material tone upsert`,
      ),
    )
  }

  for (const map of maps) {
    const patch = mediaAspectPatch(map.role, plan.epithetTitle)
    if (!patch) continue

    updatedMaps.push(
      assertOk(
        await supabase
          .from("measures_surface_media_map")
          .update({
            metadata: mergeMetadata(map.metadata, {
              ...patch,
              source_oar2: sourceOar,
            }),
          })
          .eq("id", map.id)
          .select("surface_key, media_key, role, metadata")
          .single(),
        `${plan.encounterKey} ${map.role} media map update`,
      ),
    )
  }

  return {
    encounter: updatedEncounter,
    mediaMaps: updatedMaps,
  }
}

async function patchInannaVideo() {
  const url = runtimeUrl(correctedInannaObjectKey)
  const retrieval = await retrievalStatus(url)
  if (!retrieval.ok) {
    return { updated: false, url, retrieval }
  }

  const asset = assertOk(
    await supabase
      .from("codex_media_asset")
      .update({
        storage_path: correctedInannaObjectKey,
        metadata: {
          source_oar2: sourceOar,
          runtime_use: "Inanna encounter corrected governed video",
          audio_embedded: true,
          embedded_audio_policy: "muted",
          frontend_hardcode_allowed: false,
          corrected_from_storage_path: "inanna_encounter_intro.mp4",
        },
      })
      .eq("media_key", "measures_of_inanna_inanna_encounter_video_v1")
      .select("media_key, title, storage_path, metadata")
      .single(),
    "Inanna corrected video asset update",
  )

  const maps = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .update({
        metadata: {
          source_oar2: sourceOar,
          runtime_use: "Inanna encounter corrected governed video",
          audio_embedded: true,
          embedded_audio_policy: "muted",
          render_behavior: "muted_autoplay",
          frontend_hardcode_allowed: false,
        },
      })
      .eq("surface_key", "inanna_encounter")
      .eq("media_key", "measures_of_inanna_inanna_encounter_video_v1")
      .eq("role", "featured_video")
      .select("surface_key, media_key, role, metadata"),
    "Inanna corrected video map update",
  )

  return { updated: true, url, retrieval, asset, maps }
}

async function patchPhaseMap() {
  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", "phase_map")
      .single(),
    "phase map lookup",
  )

  return assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: patchPhaseMapMetadata(row.metadata) })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    "phase map update",
  )
}

async function main() {
  const mediaChecks = {
    crystalTempleVideo: await retrievalStatus(runtimeUrl("crystal_temple_home.mp4")),
    inannaEncounterOldVideo: await retrievalStatus(runtimeUrl("inanna_encounter_intro.mp4")),
    inannaEncounterCorrectedVideo: await retrievalStatus(runtimeUrl(correctedInannaObjectKey)),
  }
  const r2Listings = {
    inanna: await listR2Prefix("inanna"),
    inannaEncounter: await listR2Prefix("inanna_encounter"),
  }

  const epithets = []
  for (const plan of epithetPlans) {
    epithets.push(await patchEpithet(plan))
  }

  const phaseMap = await patchPhaseMap()
  const inannaVideo = await patchInannaVideo()

  const evidence = {
    source_oar: sourceOar,
    executed_at: new Date().toISOString(),
    media_checks: mediaChecks,
    r2_listings: r2Listings,
    epithets,
    phase_map: phaseMap,
    inanna_video: inannaVideo,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
