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
const manifestPath = "docs/_source/working/media/l2_bucket_manifest_v1.txt"
const evidencePath = "docs/oar/measures_registry/migrate_registry_media_references_to_l2_v1.json"
const migrationOar = "oar2_migrate_registry_media_references_to_l2_v1"
const l2Bucket = "measures-media"

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
    rows.push({
      object_path,
      media_type,
      storage_class,
      size,
      updated_at: [date, timezone].filter(Boolean).join(" "),
    })
    index += timezone ? 6 : 5
  }

  return rows
}

function extension(path) {
  const match = path.toLowerCase().match(/\.([a-z0-9]+)$/)
  return match ? match[1] : ""
}

function normalizeBase(path) {
  return path
    .split(/[\\/]/)
    .pop()
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function isHeavyPath(path = "") {
  return /\.(mp4|mov|mp3|wav)$/i.test(path)
}

function isHeavyMime(mime = "") {
  return /^(video|audio)\//i.test(mime) || /quicktime/i.test(mime)
}

function manifestFamily(row) {
  if (/^video\//i.test(row.media_type) || /\.(mp4|mov)$/i.test(row.object_path)) return "video"
  if (/^audio\//i.test(row.media_type) || /\.(mp3|wav)$/i.test(row.object_path)) return "audio"
  return "other"
}

function rowFamily(row) {
  if (/^video\//i.test(row.mime_type) || /\.(mp4|mov)$/i.test(row.storage_path)) return "video"
  if (/^audio\//i.test(row.mime_type) || /\.(mp3|wav)$/i.test(row.storage_path)) return "audio"
  return "other"
}

function buildManifestIndex(rows) {
  const heavyRows = rows.filter((row) => isHeavyPath(row.object_path) && isHeavyMime(row.media_type))
  return {
    exact: new Map(heavyRows.map((row) => [row.object_path.toLowerCase(), row])),
    normalized: new Map(heavyRows.map((row) => [`${normalizeBase(row.object_path)}:${extension(row.object_path)}`, row])),
    base: new Map(heavyRows.map((row) => [normalizeBase(row.object_path), row])),
  }
}

function matchMediaRow(row, manifestIndex) {
  const exact = manifestIndex.exact.get(row.storage_path.toLowerCase())
  if (exact && manifestFamily(exact) === rowFamily(row)) return { manifestRow: exact, strategy: "exact_filename_match" }

  const normalized = manifestIndex.normalized.get(`${normalizeBase(row.storage_path)}:${extension(row.storage_path)}`)
  if (normalized && manifestFamily(normalized) === rowFamily(row)) {
    return { manifestRow: normalized, strategy: "normalized_filename_match" }
  }

  const sameBase = manifestIndex.base.get(normalizeBase(row.storage_path))
  if (sameBase && manifestFamily(sameBase) === rowFamily(row)) return { manifestRow: sameBase, strategy: "extension_aware_match" }

  return { manifestRow: null, strategy: null }
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function inspectDispatchManifest(row, manifestIndex) {
  const mediaManifest = row.media_manifest ?? {}
  const findings = []

  function visit(value, path = []) {
    if (typeof value === "string") {
      if (isHeavyPath(value)) {
        const fake = { storage_path: value.split("/").pop(), mime_type: extension(value) === "mp3" || extension(value) === "wav" ? "audio/*" : "video/*" }
        const match = matchMediaRow(fake, manifestIndex)
        findings.push({
          path: path.join("."),
          value,
          matched: Boolean(match.manifestRow),
          reason: match.manifestRow ? "deterministic match available" : "no deterministic L2 manifest match",
        })
      }
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, [...path, String(index)]))
      return
    }
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) visit(child, [...path, key])
    }
  }

  visit(mediaManifest)
  return findings
}

async function main() {
  const storageRows = await assertOk(
    await supabase
      .from("media_storage_registry")
      .select("storage_key,bucket,status,provider,scope,metadata")
      .eq("storage_key", "l2_shared_media")
      .eq("bucket", l2Bucket)
      .eq("status", "active"),
    "L2 storage row lookup failed",
  )
  if (storageRows.length === 0) throw new Error("active l2_shared_media storage row missing")

  const manifestRows = parseManifest(readFileSync(manifestPath, "utf8"))
  const manifestIndex = buildManifestIndex(manifestRows)

  const mediaRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("*")
      .neq("storage_bucket", l2Bucket)
      .order("id", { ascending: true }),
    "measures media map lookup failed",
  )
  const dispatchRows = await assertOk(
    await supabase
      .from("measures_publication_dispatch")
      .select("id,publication_key,dispatch_key,media_manifest,status"),
    "publication dispatch lookup failed",
  )

  const migrated = []
  const unmatched = []
  const imagePreserved = []

  for (const row of mediaRows) {
    const heavy = isHeavyPath(row.storage_path) || isHeavyMime(row.mime_type)
    if (!heavy) {
      imagePreserved.push({
        table: "measures_media_map",
        id: row.id,
        storage_bucket: row.storage_bucket,
        storage_path: row.storage_path,
        mime_type: row.mime_type,
      })
      continue
    }

    const { manifestRow, strategy } = matchMediaRow(row, manifestIndex)
    if (!manifestRow) {
      unmatched.push({
        table: "measures_media_map",
        id: row.id,
        registry_key: row.registry_key,
        encounter_key: row.encounter_key,
        media_role: row.media_role,
        storage_bucket: row.storage_bucket,
        storage_path: row.storage_path,
        mime_type: row.mime_type,
        reason: "no deterministic L2 manifest match",
      })
      continue
    }

    await assertOk(
      await supabase
        .from("measures_media_map")
        .update({
          storage_bucket: l2Bucket,
          storage_path: manifestRow.object_path,
          metadata: {
            ...(row.metadata ?? {}),
            migrated_to_storage_key: "l2_shared_media",
            previous_bucket: row.storage_bucket,
            previous_storage_path: row.storage_path,
            migration_source_manifest: manifestPath,
            migration_oar: migrationOar,
            migration_match_strategy: strategy,
            heavy_media_only: true,
            legacy_reference_preserved: true,
          },
        })
        .eq("id", row.id),
      `measures media row migration failed for ${row.id}`,
    )

    migrated.push({
      id: row.id,
      registry_key: row.registry_key,
      encounter_key: row.encounter_key,
      media_role: row.media_role,
      previous_bucket: row.storage_bucket,
      previous_storage_path: row.storage_path,
      new_bucket: l2Bucket,
      new_storage_path: manifestRow.object_path,
      match_strategy: strategy,
    })
  }

  const dispatchFindings = dispatchRows.flatMap((row) =>
    inspectDispatchManifest(row, manifestIndex).map((finding) => ({
      publication_key: row.publication_key,
      dispatch_key: row.dispatch_key,
      ...finding,
    })),
  )
  const dispatchMigrated = []
  const dispatchHeld = dispatchFindings.map((finding) => ({
    ...finding,
    action: "held",
    reason: finding.reason === "deterministic match available"
      ? "publication manifest structure held for explicit follow-up"
      : finding.reason,
  }))

  const validationRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("*")
      .eq("storage_bucket", l2Bucket)
      .order("id", { ascending: true }),
    "migrated registry media validation failed",
  )

  const evidence = {
    l2StorageRowFound: true,
    l2ManifestFound: true,
    l2ManifestObjectCount: manifestRows.length,
    measuresRegistryHeavyMediaRowsMigratedCount: migrated.length,
    migratedRows: migrated,
    imageWebpRowsPreservedCount: imagePreserved.length,
    publicationDispatchReferencesMigratedCount: dispatchMigrated.length,
    publicationDispatchReferencesHeldCount: dispatchHeld.length,
    publicationDispatchReferencesHeld: dispatchHeld,
    unmatchedMediaRows: unmatched,
    validationQueryUsesStorageBucketColumn: true,
    validationQueryOutput: validationRows,
    frontendMutationPerformed: false,
    measuresOfInannaMutationPerformed: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
