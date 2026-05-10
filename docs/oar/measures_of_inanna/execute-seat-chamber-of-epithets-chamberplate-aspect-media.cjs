require("dotenv").config({ path: ".env.inanna" })
require("dotenv").config({ path: ".env.local", override: false })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const bucket = "pre-codex-exhibition"
const source = "seat_chamber_of_epithets_chamberplate_aspect_media_v1"
const evidencePath =
  "docs/oar/measures_of_inanna/seat_chamber_of_epithets_chamberplate_aspect_media_v1.json"

const targets = [
  {
    surface_key: "chamber_epithets_01_primus_artus",
    material_key: "primus_artus",
    title: "Primus Artus",
    featured_video_path: "primus_artus.mp4",
    oracle_card_path: "primus_artus_epithet01_chamberplate.png",
    full_song_path: "primus_artus.mp3",
    original_artwork_path: "primus_artus_original_artwork.webp",
  },
  {
    surface_key: "chamber_epithets_02_gemynd_corpus",
    material_key: "gemynd_corpus",
    title: "Gemynd Corpus",
    featured_video_path: "gemynd_corpus.mp4",
    oracle_card_path: "gemynd_corpus.png",
    full_song_path: "gemynd_corpus.mp3",
    original_artwork_path: "gemynd_corpus_original_art.webp",
  },
  {
    surface_key: "chamber_epithets_03_percipari",
    material_key: "percipari",
    title: "Percipari",
    featured_video_path: "percipari.mp4",
    oracle_card_path: "percipari_epithet03_chamberplate.png",
    full_song_path: "percipari.mp3",
    original_artwork_path: "percipari_original_artwork.webp",
  },
]

const roleConstraintSql = `
alter table public.measures_surface_media_map
  drop constraint if exists measures_surface_media_map_role_check;

alter table public.measures_surface_media_map
  add constraint measures_surface_media_map_role_check
  check (
    role in (
      'image',
      'video',
      'audio',
      'poster',
      'primary',
      'background',
      'tone',
      'featured_video',
      'oracle_card',
      'epithet_description',
      'original_artwork',
      'full_song',
      'lapis_tone',
      'material_tone'
    )
  );
`

function mediaTypeForPath(path) {
  if (/\.(png|jpe?g|webp|gif)$/i.test(path)) return "image"
  if (/\.(mp4|mov|webm)$/i.test(path)) return "video"
  if (/\.(mp3|wav|m4a|aac|ogg)$/i.test(path)) return "audio"
  return null
}

function mediaKey(surfaceKey, role) {
  return `${surfaceKey}_${role}_v1`
}

function titleFor(target, role) {
  const labels = {
    featured_video: "Featured Video",
    oracle_card: "Oracle Card",
    original_artwork: "Original Artwork",
    full_song: "Full Song",
    lapis_tone: "Lapis Tone",
    epithet_description: "Epithet Description",
  }

  return `${target.title} ${labels[role] ?? role}`
}

function publicUrlFor(path) {
  const base = process.env.PRE_CODEX_EXHIBITION_PUBLIC_BASE_URL
  return base ? `${base.replace(/\/$/, "")}/${encodeURI(path)}` : null
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

async function bucketNames() {
  const { data, error } = await supabase.storage.from(bucket).list("", { limit: 1000 })
  if (error) return { names: new Set(), error: error.message }
  return { names: new Set((data ?? []).map((item) => item.name)), error: null }
}

function assetPayload(target, role, storagePath, metadata = {}) {
  const mediaType = mediaTypeForPath(storagePath)
  if (!mediaType) throw new Error(`unsupported media type for ${storagePath}`)

  return {
    media_key: mediaKey(target.surface_key, role),
    title: titleFor(target, role),
    media_type: mediaType,
    storage_provider: "cloudflare_r2",
    bucket,
    storage_path: storagePath,
    public_url: publicUrlFor(storagePath),
    poster_url: null,
    material_key: target.material_key,
    legacy_key: target.surface_key,
    status: "active",
    metadata: {
      source,
      role,
      ...metadata,
    },
  }
}

function mappingPayload(target, role, sequenceIndex, metadata = {}) {
  return {
    surface_key: target.surface_key,
    media_key: mediaKey(target.surface_key, role),
    role,
    sequence_index: sequenceIndex,
    status: "active",
    metadata: {
      source,
      frontend_hardcode_allowed: false,
      ...metadata,
    },
  }
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")
  await execSql(roleConstraintSql, "role constraint expansion failed")
  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")

  const bucket = await bucketNames()
  const missing = []
  const assets = []
  const mappings = []

  const tempRows = await assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("surface_key,label,media_type,bucket_name,storage_path,render_order,is_active")
      .in("surface_key", targets.map((target) => target.surface_key))
      .eq("is_active", true),
    "temp exhibition bridge lookup failed",
  )

  const tempBySurfacePath = new Map(
    tempRows.map((row) => [`${row.surface_key}:${row.storage_path}`, row]),
  )

  for (const target of targets) {
    if (bucket.names.has(target.featured_video_path)) {
      assets.push(assetPayload(target, "featured_video", target.featured_video_path, {
        contains_song: true,
        contains_material_tone: true,
      }))
      mappings.push(mappingPayload(target, "featured_video", 10, {
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
        expected_storage_path: target.featured_video_path,
        reason: "featured video object not supplied in bucket listing",
      })
    }

    if (tempBySurfacePath.has(`${target.surface_key}:${target.oracle_card_path}`)) {
      assets.push(assetPayload(target, "oracle_card", target.oracle_card_path, {
        preserved_from: "public.temp_exhibition_media",
      }))
      mappings.push(mappingPayload(target, "oracle_card", 20, {
        aspect_type: "image",
        render_behavior: "image_expand",
        preserved_from: "public.temp_exhibition_media",
      }))
    } else {
      missing.push({
        surface_key: target.surface_key,
        role: "oracle_card",
        expected_storage_path: target.oracle_card_path,
        reason: "oracle card temp bridge row missing",
      })
    }

    missing.push({
      surface_key: target.surface_key,
      role: "epithet_description",
      reason: "description text payload not supplied",
    })

    if (bucket.names.has(target.original_artwork_path)) {
      assets.push(assetPayload(target, "original_artwork", target.original_artwork_path))
      mappings.push(mappingPayload(target, "original_artwork", 40, {
        aspect_type: "image",
        render_behavior: "image_expand",
        show_over_video: false,
        available_after: "featured_video_complete_or_skip",
      }))
    } else {
      missing.push({
        surface_key: target.surface_key,
        role: "original_artwork",
        expected_storage_path: target.original_artwork_path,
        reason: "original artwork object not supplied in bucket listing",
      })
    }

    if (tempBySurfacePath.has(`${target.surface_key}:${target.full_song_path}`)) {
      assets.push(assetPayload(target, "full_song", target.full_song_path, {
        preserved_from: "public.temp_exhibition_media",
      }))
      mappings.push(mappingPayload(target, "full_song", 50, {
        aspect_type: "audio",
        render_behavior: "audio_play",
        audio_role: "full_song",
        show_over_video: false,
        available_after: "featured_video_complete_or_skip",
      }))
    } else {
      missing.push({
        surface_key: target.surface_key,
        role: "full_song",
        expected_storage_path: target.full_song_path,
        reason: "full song temp bridge row missing",
      })
    }

    missing.push({
      surface_key: target.surface_key,
      role: "lapis_tone",
      reason: "lapis/material tone support audio not supplied",
    })
  }

  const rolesToSeat = [...new Set(mappings.map((mapping) => mapping.role))]
  const existingMaps = await assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("id,surface_key,media_key,role,sequence_index,status")
      .in("surface_key", targets.map((target) => target.surface_key)),
    "existing mapping lookup failed",
  )

  const intendedKeys = new Set(
    mappings.map((mapping) => `${mapping.surface_key}:${mapping.role}:${mapping.media_key}`),
  )
  const supersededIds = existingMaps
    .filter(
      (row) =>
        row.status === "active" &&
        rolesToSeat.includes(row.role) &&
        !intendedKeys.has(`${row.surface_key}:${row.role}:${row.media_key}`),
    )
    .map((row) => row.id)

  if (supersededIds.length > 0) {
    await assertOk(
      await supabase
        .from("measures_surface_media_map")
        .update({ status: "inactive" })
        .in("id", supersededIds),
      "superseded mapping deactivation failed",
    )
  }

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

  const validationRows = await assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, public_url, poster_url, status, metadata)")
      .in("surface_key", targets.map((target) => target.surface_key))
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true })
      .order("role", { ascending: true }),
    "validation query failed",
  )

  const activeRows = validationRows.filter((row) => row.status === "active")
  const countRole = (role) => activeRows.filter((row) => row.role === role).length
  const evidence = {
    dbConnection: "active",
    roleConstraintExpanded: true,
    insertedOrUpsertedMediaAssetCount: assets.length,
    insertedOrUpsertedMappingCount: mappings.length,
    deactivatedSupersededMappingCount: supersededIds.length,
    activeFeaturedVideoMappingCount: countRole("featured_video"),
    activeOracleCardMappingCount: countRole("oracle_card"),
    activeEpithetDescriptionMappingCount: countRole("epithet_description"),
    activeOriginalArtworkMappingCount: countRole("original_artwork"),
    activeFullSongMappingCount: countRole("full_song"),
    activeLapisMaterialToneMappingCount:
      countRole("lapis_tone") + countRole("material_tone"),
    missingManifestAssetsOrTextPayloads: missing,
    bucketListError: bucket.error,
    validationQueryOutput: validationRows.map((row) => {
      const asset = Array.isArray(row.codex_media_asset)
        ? row.codex_media_asset[0]
        : row.codex_media_asset
      return {
        surface_key: row.surface_key,
        sequence_index: row.sequence_index,
        role: row.role,
        is_active: row.status === "active",
        media_key: asset.media_key,
        title: asset.title,
        media_type: asset.media_type,
        bucket: asset.bucket,
        storage_path: asset.storage_path,
        public_url: asset.public_url,
        poster_url: asset.poster_url,
        status: asset.status,
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
