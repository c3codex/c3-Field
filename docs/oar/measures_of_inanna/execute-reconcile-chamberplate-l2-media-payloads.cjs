require("dotenv").config({ path: ".env.inanna" })
require("dotenv").config({ path: ".env.local", override: false })

const { readFileSync, writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const manifestPath = "docs/_source/working/exhibition_bridge/l2_chamberplate_media_manifest.txt"
const evidencePath =
  "docs/oar/measures_of_inanna/reconcile_chamberplate_missing_media_payloads_from_l2_manifest_v1.json"
const source = "reconcile_chamberplate_missing_media_payloads_from_l2_manifest_v1"
const bucket = process.env.L2_CHAMBERPLATE_BUCKET || "l2_chamberplate"
const publicBaseUrl = process.env.L2_CHAMBERPLATE_PUBLIC_BASE_URL || null

const targets = [
  {
    surface_key: "chamber_epithets_01_primus_artus",
    material_key: "primus_artus",
    material_family: "obsidian",
    title: "Primus Artus",
    match: /primus/i,
  },
  {
    surface_key: "chamber_epithets_02_gemynd_corpus",
    material_key: "gemynd_corpus",
    material_family: "lapis",
    title: "Gemynd Corpus",
    match: /gemynd/i,
  },
  {
    surface_key: "chamber_epithets_03_percipari",
    material_key: "percipari",
    material_family: "crystal",
    title: "Percipari",
    match: /percipari/i,
  },
]

function parseManifest(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const rows = []

  for (let index = 0; index < lines.length;) {
    const object_path = lines[index]
    const media_type = lines[index + 1]
    if (!object_path || !media_type?.includes("/")) {
      index += 1
      continue
    }

    const storage_class = lines[index + 2] ?? null
    const size = lines[index + 3] ?? null
    const date = lines[index + 4] ?? null
    const timezone = /^[A-Z]{2,5}$/.test(lines[index + 5] ?? "") ? lines[index + 5] : null
    const updated_at = [date, timezone].filter(Boolean).join(" ")

    rows.push({ object_path, media_type, storage_class, size, updated_at })
    index += timezone ? 6 : 5
  }

  return rows
}

function runtimeMediaType(mediaType, objectPath) {
  if (mediaType.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(objectPath)) return "video"
  if (mediaType.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg)$/i.test(objectPath)) return "audio"
  if (mediaType.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(objectPath)) return "image"
  return null
}

function publicUrlFor(path) {
  return publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, "")}/${encodeURI(path)}` : null
}

function safeKey(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function titleCase(value) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function assetPayload(target, role, row, metadata = {}) {
  const media_type = runtimeMediaType(row.media_type, row.object_path)
  if (!media_type) throw new Error(`unsupported media type: ${row.object_path}`)

  return {
    media_key: `${target.surface_key}_${role}_${safeKey(row.object_path)}_v1`,
    title: `${target.title} ${titleCase(role)}`,
    media_type,
    storage_provider: "cloudflare_r2",
    bucket,
    storage_path: row.object_path,
    public_url: publicUrlFor(row.object_path),
    poster_url: null,
    material_key: target.material_key,
    legacy_key: target.surface_key,
    status: "active",
    metadata: {
      source,
      manifest_path: manifestPath,
      manifest_media_type: row.media_type,
      manifest_size: row.size,
      manifest_updated_at: row.updated_at,
      manifest_storage_class: row.storage_class,
      l2_manifest_authority: true,
      role,
      ...metadata,
    },
  }
}

function mappingPayload(target, role, asset, sequence_index, metadata = {}) {
  return {
    surface_key: target.surface_key,
    media_key: asset.media_key,
    role,
    sequence_index,
    status: "active",
    metadata: {
      source,
      manifest_path: manifestPath,
      frontend_hardcode_allowed: false,
      ...metadata,
    },
  }
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  const manifestRows = parseManifest(readFileSync(manifestPath, "utf8"))
  const byPath = new Map(manifestRows.map((row) => [row.object_path, row]))
  const missing = []
  const held = targets.map((target) => ({
    surface_key: target.surface_key,
    role: "epithet_description",
    reason: "description text payload intentionally held by OAR2",
  }))
  const assets = []
  const mappings = []

  for (const target of targets) {
    const featuredVideo = manifestRows.find(
      (row) =>
        runtimeMediaType(row.media_type, row.object_path) === "video" &&
        target.match.test(row.object_path) &&
        /tone|featured|chamberplate/i.test(row.object_path),
    )

    if (featuredVideo) {
      const asset = assetPayload(target, "featured_video", featuredVideo, {
        contains_song: true,
        contains_material_tone: true,
      })
      assets.push(asset)
      mappings.push(mappingPayload(target, "featured_video", asset, 10, {
        render_behavior: "autoplay_after_passage",
        featured: true,
        audio_embedded: true,
        contains_song: true,
        contains_material_tone: true,
        show_text_overlay: false,
        skip_enabled: true,
        on_complete: "reveal_chamberplate_aspects",
        on_skip: "reveal_chamberplate_aspects",
      }))
    } else {
      missing.push({
        surface_key: target.surface_key,
        role: "featured_video",
        reason: "no target-specific featured/chamberplate/tone video found in L2 manifest",
      })
    }
  }

  const toneByMaterial = {
    lapis: byPath.get("lapis_tone_rise_return_5min.wav"),
    crystal: byPath.get("crystal_tone_rise_return_5min.wav"),
    marble: byPath.get("marble_tone_rise_return_5min.wav"),
  }

  for (const target of targets) {
    const tone = toneByMaterial[target.material_family]
    if (!tone) {
      missing.push({
        surface_key: target.surface_key,
        role: "material_tone",
        material_family: target.material_family,
        reason: "no material tone audio found in L2 manifest for target material",
      })
      continue
    }

    const role = target.material_family === "lapis" ? "lapis_tone" : "material_tone"
    const asset = assetPayload(target, role, tone, {
      audio_role: role,
      material_family: target.material_family,
    })
    assets.push(asset)
    mappings.push(mappingPayload(target, role, asset, 60, {
      aspect_type: "audio",
      render_behavior: "audio_play",
      audio_role: role,
      default_volume: 0.22,
      mix_behavior: "underlay",
      aspect_support: true,
      show_over_video: false,
      available_after: "featured_video_complete_or_skip",
      material_family: target.material_family,
    }))
  }

  const rolesToSeat = [...new Set(mappings.map((mapping) => mapping.role))]
  const existingMaps = await assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("id,surface_key,media_key,role,sequence_index,status")
      .in("surface_key", targets.map((target) => target.surface_key)),
    "existing mapping lookup failed",
  )

  const intended = new Set(
    mappings.map((mapping) => `${mapping.surface_key}:${mapping.role}:${mapping.media_key}`),
  )
  const supersededIds = existingMaps
    .filter(
      (row) =>
        row.status === "active" &&
        rolesToSeat.includes(row.role) &&
        !intended.has(`${row.surface_key}:${row.role}:${row.media_key}`),
    )
    .map((row) => row.id)

  if (supersededIds.length > 0) {
    await assertOk(
      await supabase.from("measures_surface_media_map").update({ status: "inactive" }).in("id", supersededIds),
      "superseded mapping deactivation failed",
    )
  }

  if (assets.length > 0) {
    await assertOk(
      await supabase.from("codex_media_asset").upsert(assets, { onConflict: "media_key" }),
      "codex media asset upsert failed",
    )
    await assertOk(
      await supabase.from("measures_surface_media_map").upsert(mappings, {
        onConflict: "surface_key,media_key,role",
      }),
      "surface media map upsert failed",
    )
  }

  const validationRows = await assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, public_url, poster_url, status, metadata)")
      .in("surface_key", targets.map((target) => target.surface_key))
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true })
      .order("role", { ascending: true })
      .order("media_key", { ascending: true }),
    "validation query failed",
  )

  const activeRows = validationRows.filter((row) => row.status === "active")
  const countRole = (roles) => activeRows.filter((row) => roles.includes(row.role)).length

  const evidence = {
    l2ManifestFound: true,
    manifestPath,
    manifestObjectCount: manifestRows.length,
    bucket,
    publicBaseUrlConfigured: Boolean(publicBaseUrl),
    insertedOrUpsertedMediaAssetCount: assets.length,
    insertedOrUpsertedMappingCount: mappings.length,
    deactivatedSupersededMappingCount: supersededIds.length,
    activeFeaturedVideoMappingCount: countRole(["featured_video"]),
    activeToneMappingCount: countRole(["lapis_tone", "material_tone"]),
    heldEpithetDescriptionCount: held.length,
    heldEpithetDescriptions: held,
    missingMediaPayloads: missing,
    seatedManifestPaths: mappings.map((mapping) => ({
      surface_key: mapping.surface_key,
      role: mapping.role,
      media_key: mapping.media_key,
    })),
    validationQueryOutput: validationRows.map((row) => {
      const asset = Array.isArray(row.codex_media_asset)
        ? row.codex_media_asset[0]
        : row.codex_media_asset
      return {
        surface_key: row.surface_key,
        sequence_index: row.sequence_index,
        role: row.role,
        status: row.status,
        media_key: asset.media_key,
        title: asset.title,
        media_type: asset.media_type,
        bucket: asset.bucket,
        storage_path: asset.storage_path,
        public_url: asset.public_url,
        poster_url: asset.poster_url,
        asset_status: asset.status,
        map_metadata: row.metadata,
        asset_metadata: asset.metadata,
      }
    }),
    frontendMutationPerformed: false,
    tempExhibitionMediaMutationPerformed: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
