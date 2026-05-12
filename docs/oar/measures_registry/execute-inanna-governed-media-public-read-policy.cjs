require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, serviceKey)
const evidencePath =
  "docs/oar/measures_registry/inanna_governed_media_public_read_policy_v1.json"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function encodeObjectKey(objectKey) {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "")
}

function assetFromRow(row) {
  return Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
}

async function liveClient() {
  const html = await fetch("https://www.measuresofinanna.com/").then((response) => response.text())
  const assetPath = (html.match(/assets\/[^"' ]+\.js/) || [])[0]
  if (!assetPath) throw new Error("live Inanna asset path not found")
  const js = await fetch(`https://www.measuresofinanna.com/${assetPath}`).then((response) =>
    response.text(),
  )

  const publicUrl = (js.match(/https:\/\/[a-z0-9]+\.supabase\.co/) || [])[0]
  const publicKey = (js.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0]
  const r2BaseUrl = (js.match(/https:\/\/media\.c3field\.online/) || [])[0] || null

  if (!publicUrl || !publicKey) {
    throw new Error("live Inanna public Supabase config not found in bundle")
  }

  return {
    assetPath,
    r2BaseUrl,
    client: createClient(publicUrl, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { apikey: publicKey } },
    }),
  }
}

function resolveRuntimeMediaUrl(item, r2BaseUrl, publicClient) {
  if (item.publicUrl) return item.publicUrl
  if (!item.bucketName || !item.storagePath) return null

  if (
    item.storageProvider?.toLowerCase() === "cloudflare_r2" ||
    item.bucketName === "measures-media"
  ) {
    if (!r2BaseUrl) return null
    return `${r2BaseUrl}/${encodeObjectKey(trimSlashes(item.storagePath))}`
  }

  return publicClient.storage.from(item.bucketName).getPublicUrl(item.storagePath).data.publicUrl
}

async function retrievalStatus(url) {
  if (!url) return { tested: false, ok: false, reason: "no resolved url" }

  try {
    let response = await fetch(url, { method: "HEAD" })
    if (response.status === 405) response = await fetch(url)
    return {
      tested: true,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    }
  } catch (error) {
    return { tested: true, ok: false, error: error.message }
  }
}

async function validatePublicRead(publicClient, r2BaseUrl) {
  const surfaceKeys = ["epigraph", "epigraph_view", "temple_antechamber", "temple_antechamber_view"]

  const publicRows = assertOk(
    await publicClient
      .from("measures_surface_media_map")
      .select(
        "surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key,title,media_type,bucket,storage_path,storage_provider,public_url,poster_url,status,metadata)",
      )
      .in("surface_key", surfaceKeys)
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "public governed media validation",
  )

  const resolvedRows = []
  for (const row of publicRows) {
    const asset = assetFromRow(row)
    const runtime = {
      surfaceKey: row.surface_key,
      role: row.role,
      sequenceIndex: row.sequence_index,
      mediaKey: asset.media_key,
      mediaType: asset.media_type,
      bucketName: asset.bucket,
      storagePath: asset.storage_path,
      storageProvider: asset.storage_provider,
      publicUrl: asset.public_url,
    }
    const resolvedUrl = resolveRuntimeMediaUrl(runtime, r2BaseUrl, publicClient)
    resolvedRows.push({
      ...runtime,
      resolvedUrl,
      retrieval: await retrievalStatus(resolvedUrl),
    })
  }

  return {
    publicCount: publicRows.length,
    resolvedRows,
    epigraphRows: resolvedRows.filter((row) => row.surfaceKey === "epigraph"),
    templeAntechamberRows: resolvedRows.filter((row) => row.surfaceKey === "temple_antechamber"),
  }
}

async function main() {
  const serviceBefore = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select(
        "surface_key, sequence_index, role, status, codex_media_asset!inner(media_key,media_type,bucket,storage_path,storage_provider,status)",
      )
      .in("surface_key", ["epigraph", "temple_antechamber"])
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "service baseline validation",
  )

  const policySql = `
    alter table public.codex_media_asset enable row level security;
    alter table public.measures_surface_media_map enable row level security;

    drop policy if exists codex_media_asset_public_active_read on public.codex_media_asset;
    create policy codex_media_asset_public_active_read
    on public.codex_media_asset
    for select
    to anon, authenticated
    using (status = 'active');

    drop policy if exists measures_surface_media_map_public_active_read on public.measures_surface_media_map;
    create policy measures_surface_media_map_public_active_read
    on public.measures_surface_media_map
    for select
    to anon, authenticated
    using (status = 'active');

    grant select on public.codex_media_asset to anon, authenticated;
    grant select on public.measures_surface_media_map to anon, authenticated;

    notify pgrst, 'reload schema';
  `

  await execSql(policySql, "governed media public read policy correction failed")

  const live = await liveClient()
  const publicValidation = await validatePublicRead(live.client, live.r2BaseUrl)

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    dbMutationOnly: true,
    sourceObjectsDeleted: false,
    mediaRowsChanged: false,
    resolverMutationPerformed: false,
    frontendMutationPerformed: false,
    policiesApplied: [
      "codex_media_asset_public_active_read",
      "measures_surface_media_map_public_active_read",
    ],
    serviceBaseline: {
      serviceCount: serviceBefore.length,
      serviceRows: serviceBefore.map((row) => {
        const asset = assetFromRow(row)
        return {
          surface_key: row.surface_key,
          role: row.role,
          media_key: asset.media_key,
          storage_path: asset.storage_path,
          storage_provider: asset.storage_provider,
        }
      }),
    },
    liveBundle: {
      assetPath: live.assetPath,
      r2BasePresent: Boolean(live.r2BaseUrl),
    },
    publicValidation,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(
    JSON.stringify({
      evidencePath,
      serviceCount: evidence.serviceBaseline.serviceCount,
      publicCount: publicValidation.publicCount,
      epigraphRows: publicValidation.epigraphRows.length,
      templeAntechamberRows: publicValidation.templeAntechamberRows.length,
      epigraphPrimary: publicValidation.epigraphRows[0]?.mediaKey ?? null,
      templePrimary: publicValidation.templeAntechamberRows[0]?.mediaKey ?? null,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
