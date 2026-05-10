require("dotenv").config({ path: ".env" })

const { readFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)

const source = "register_r2_bucket_media_pre_codex_exhibition_v1"
const surfaceKey = "pre_codex_exhibition"
const bucket = "pre-codex-exhibition"
const manifestPath = "docs/_source/working/exhibition_bridge/pre_codex_exhibition_bucket_object_manifest.txt"
const publicBaseUrl = process.env.PRE_CODEX_EXHIBITION_PUBLIC_BASE_URL || null

const knownOrder = new Map([
  ["primus_artus", 1],
  ["gemynd_corpus", 2],
  ["percipari", 3],
])

const knownLegacyKeys = [
  { match: /primus_artus/i, legacy_key: "chamber_epithets_01_primus_artus", material_key: "primus_artus" },
  { match: /gemynd_corpus/i, legacy_key: "chamber_epithets_02_gemynd_corpus", material_key: "gemynd_corpus" },
  { match: /percipari/i, legacy_key: "chamber_epithets_03_percipari", material_key: "percipari" },
  { match: /obsidian_chamberplate_gate01/i, legacy_key: "gate_1_crown_removed", material_key: "gate_1_crown_removed" },
  { match: /obsidian_chamberplate_gate02/i, legacy_key: "gate_2_lapis_beads", material_key: "gate_2_lapis_beads" },
  { match: /obsidian_chamberplate_gate03/i, legacy_key: "gate_3_lapis_necklace", material_key: "gate_3_lapis_necklace" },
  { match: /harrumuk_passage/i, legacy_key: "temple_harrumuk_passage", material_key: "harrumuk_passage" },
  { match: /kumurrah_passage/i, legacy_key: "kumurrah_passage", material_key: "kumurrah_passage" },
  { match: /marble_chamber_codexstone/i, legacy_key: "me_codexstone", material_key: "me_codexstone" },
  { match: /crystal_temple/i, legacy_key: "crystal_temple_home", material_key: "crystal_temple_home" },
  { match: /inanna_temple_encounter_intro/i, legacy_key: "crystal_temple_home", material_key: "crystal_temple_home" },
]

const ddl = `
create extension if not exists pgcrypto;

create table if not exists public.codex_media_asset (
  id uuid primary key default gen_random_uuid(),
  media_key text not null unique,
  title text not null,
  media_type text not null,
  storage_provider text not null,
  bucket text not null,
  storage_path text not null,
  public_url text,
  poster_url text,
  material_key text,
  legacy_key text,
  status text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint codex_media_asset_media_type_check check (media_type in ('image','video','audio')),
  constraint codex_media_asset_storage_provider_check check (storage_provider in ('cloudflare_r2')),
  constraint codex_media_asset_status_check check (status in ('active','inactive','held','deprecated'))
);

create table if not exists public.measures_surface_media_map (
  id uuid primary key default gen_random_uuid(),
  surface_key text not null,
  media_key text not null references public.codex_media_asset(media_key) on update cascade on delete restrict,
  role text not null,
  sequence_index integer not null,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint measures_surface_media_map_role_check check (role in ('image','video','audio','poster','primary','background','tone')),
  constraint measures_surface_media_map_status_check check (status in ('active','inactive','held','deprecated')),
  constraint measures_surface_media_map_surface_media_role_unique unique (surface_key, media_key, role)
);

grant select on public.codex_media_asset to anon, authenticated;
grant select on public.measures_surface_media_map to anon, authenticated;

create index if not exists codex_media_asset_media_key_idx on public.codex_media_asset(media_key);
create index if not exists codex_media_asset_storage_idx on public.codex_media_asset(bucket, storage_path);
create index if not exists measures_surface_media_map_surface_idx on public.measures_surface_media_map(surface_key, sequence_index);
`

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withSchemaRetry(operation, label) {
  let lastError = null

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const result = await operation()
    if (!result.error) return result.data
    lastError = result.error
    if (!/schema cache|Could not find|does not exist/i.test(result.error.message)) break
    await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")
    await sleep(1000)
  }

  throw new Error(`${label}: ${lastError?.message ?? "unknown error"}`)
}

function parseManifest(text) {
  const blocks = text.split(/\n\s*\n/).filter((block) => block.includes("object_path:"))
  return blocks.map((block) => {
    const row = {}
    for (const line of block.split(/\r?\n/)) {
      const match = line.match(/^([a-z_]+):\s*(.+)$/)
      if (match) row[match[1]] = match[2].trim()
    }
    return row
  })
}

function mediaTypeFromMime(mime) {
  if (mime?.startsWith("image/")) return "image"
  if (mime?.startsWith("video/")) return "video"
  if (mime?.startsWith("audio/")) return "audio"
  return null
}

function titleFromPath(path) {
  const base = path.split("/").pop().replace(/\.[^.]+$/, "")
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function baseName(path) {
  return path
    .split("/")
    .pop()
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function mediaKey(path, mediaType) {
  return `pre_codex_exhibition_${baseName(path)}_${mediaType}_v1`
}

function relationFor(path) {
  return knownLegacyKeys.find((item) => item.match.test(path)) ?? { legacy_key: null, material_key: null }
}

function sequenceIndex(path, mediaType, fallbackIndex) {
  const base = [...knownOrder.entries()].find(([key]) => path.toLowerCase().includes(key))?.[1]
  const group = base ?? fallbackIndex + 10
  const typeOffset = mediaType === "image" ? 0 : mediaType === "video" ? 1 : 2
  return group * 10 + typeOffset
}

function publicUrlFor(path) {
  if (!publicBaseUrl) return null
  return `${publicBaseUrl.replace(/\/$/, "")}/${encodeURI(path)}`
}

async function readSchema() {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })
  if (!response.ok) throw new Error(`Supabase schema metadata failed: ${response.status}`)
  return response.json()
}

function columnsFor(schema, tableName) {
  const definition = schema.definitions?.[tableName] ?? schema.components?.schemas?.[tableName]
  return Object.keys(definition?.properties ?? {})
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  const beforeSchema = await readSchema()
  const existedBefore = {
    codex_media_asset: columnsFor(beforeSchema, "codex_media_asset").length > 0,
    measures_surface_media_map: columnsFor(beforeSchema, "measures_surface_media_map").length > 0,
  }

  await execSql(ddl, "media registration surfaces seating failed")
  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")

  const manifestRows = parseManifest(readFileSync(manifestPath, "utf8"))
  const skippedManifestRows = []
  const mediaRows = []

  manifestRows.forEach((row, index) => {
    const type = mediaTypeFromMime(row.media_type)
    if (!type) {
      skippedManifestRows.push({
        object_path: row.object_path,
        media_type: row.media_type,
        reason: "not_image_video_or_audio",
      })
      return
    }

    const relation = relationFor(row.object_path)
    mediaRows.push({
      media_key: mediaKey(row.object_path, type),
      title: titleFromPath(row.object_path),
      media_type: type,
      storage_provider: "cloudflare_r2",
      bucket,
      storage_path: row.object_path,
      public_url: publicUrlFor(row.object_path),
      poster_url: null,
      material_key: relation.material_key,
      legacy_key: relation.legacy_key,
      status: "active",
      metadata: {
        source,
        manifest_path: manifestPath,
        manifest_mime_type: row.media_type,
        manifest_size: Number(row.size),
        manifest_updated_at: row.updated_at,
        r2_presence_is_not_codex_seating: true,
      },
      sequence_index: sequenceIndex(row.object_path, type, index),
    })
  })

  const duplicateKeys = mediaRows
    .map((row) => row.media_key)
    .filter((key, index, keys) => keys.indexOf(key) !== index)

  if (duplicateKeys.length > 0) {
    throw new Error(`duplicate media keys generated: ${[...new Set(duplicateKeys)].join(", ")}`)
  }

  const assetPayload = mediaRows.map(({ sequence_index, ...row }) => row)
  await withSchemaRetry(
    () => supabase.from("codex_media_asset").upsert(assetPayload, { onConflict: "media_key" }),
    "codex media asset upsert failed",
  )

  const mapPayload = mediaRows.map((row) => ({
    surface_key: surfaceKey,
    media_key: row.media_key,
    role: row.media_type,
    sequence_index: row.sequence_index,
    status: "active",
    metadata: {
      source,
      storage_path: row.storage_path,
      same_base_name_distinguished_by_type_path_key: true,
    },
  }))

  await withSchemaRetry(
    () => supabase.from("measures_surface_media_map").upsert(mapPayload, {
      onConflict: "surface_key,media_key,role",
    }),
    "surface media map upsert failed",
  )

  const validationRows = await withSchemaRetry(
    () => supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, status)")
      .eq("surface_key", surfaceKey)
      .order("sequence_index", { ascending: true }),
    "validation query failed",
  )

  const flattenedValidationRows = validationRows.map((row) => ({
    surface_key: row.surface_key,
    sequence_index: row.sequence_index,
    role: row.role,
    media_key: row.codex_media_asset.media_key,
    title: row.codex_media_asset.title,
    media_type: row.codex_media_asset.media_type,
    bucket: row.codex_media_asset.bucket,
    storage_path: row.codex_media_asset.storage_path,
    status: row.codex_media_asset.status,
  }))

  const expectedExamplePaths = [
    "primus_artus.webp",
    "primus_artus.mp4",
    "primus_artus.mp3",
    "gemynd_corpus.webp",
    "gemynd_corpus.mp4",
    "gemynd_corpus.mp3",
    "percipari.webp",
    "percipari.mp4",
    "percipari.mp3",
  ]
  const manifestPathSet = new Set(mediaRows.map((row) => row.storage_path))
  const missingOarExamplePaths = expectedExamplePaths.filter((path) => !manifestPathSet.has(path))

  console.log(JSON.stringify({
    dbConnection: "active",
    createdOrReusedTables: {
      codex_media_asset: existedBefore.codex_media_asset ? "reused" : "created",
      measures_surface_media_map: existedBefore.measures_surface_media_map ? "reused" : "created",
    },
    manifestPath,
    bucket,
    insertedMediaCount: assetPayload.length,
    mappedMediaCount: mapPayload.length,
    skippedManifestRows,
    duplicateMediaKeys: [],
    missingOarExamplePaths,
    validationQueryOutput: flattenedValidationRows,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
