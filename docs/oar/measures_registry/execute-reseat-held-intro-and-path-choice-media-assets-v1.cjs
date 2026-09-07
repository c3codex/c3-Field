require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_reseat_held_intro_and_path_choice_media_assets_v1.meta.md"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"
const BUCKET = "measures-registry"

const HELD_ROLES = ["hero_image", "path_choice_background"]

const HOLD_METADATA_KEYS = ["hold_reason", "held_by_oar2", "retrieval_status_at_hold"]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function resolveSupabasePublicUrl(storagePath) {
  return writer.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

async function checkHttpStatus(url) {
  if (!url) return { ok: false, status: null, reason: "no url" }
  try {
    const response = await fetch(url, { method: "GET" })
    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    }
  } catch (error) {
    return { ok: false, status: null, error: error.message }
  }
}

async function listBucketRoot() {
  const { data, error } = await writer.storage.from(BUCKET).list("", {
    limit: 100,
    sortBy: { column: "name", order: "asc" },
  })
  if (error) return { error: error.message, files: [] }
  return { files: (data ?? []).map((f) => f.name) }
}

async function preCheck(rows) {
  const results = {}
  for (const row of rows) {
    const url = resolveSupabasePublicUrl(row.storage_path)
    const retrieval = await checkHttpStatus(url)
    results[row.media_role] = {
      storage_path: row.storage_path,
      public_url: url,
      ...retrieval,
    }
    console.log(
      `pre-check ${row.media_role}: ${row.storage_path} → HTTP ${retrieval.status ?? "error"} (${retrieval.ok ? "ok" : "fail"})`,
    )
  }
  return results
}

async function reactivateRows(rows) {
  const results = {}
  for (const row of rows) {
    const cleanMetadata = { ...(row.metadata ?? {}) }
    for (const key of HOLD_METADATA_KEYS) {
      delete cleanMetadata[key]
    }
    cleanMetadata.reactivated_by_oar2 = SOURCE_OAR2

    assertOk(
      await writer
        .from("measures_media_map")
        .update({ is_active: true, metadata: cleanMetadata })
        .eq("campaign_key", CAMPAIGN_KEY)
        .eq("media_role", row.media_role),
      `reactivate ${row.media_role}`,
    )

    results[row.media_role] = { is_active: true, hold_fields_cleared: HOLD_METADATA_KEYS }
    console.log(`reactivated: ${row.media_role}`)
  }
  return results
}

async function verifyAnonReadback() {
  if (!anonKey) {
    console.warn("anon key not available — skipping anon readback")
    return { skipped: true, rows: [] }
  }

  const anon = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: rows, error } = await anon
    .from("measures_media_map")
    .select("media_role, is_active, storage_path")
    .eq("campaign_key", CAMPAIGN_KEY)
    .in("media_role", HELD_ROLES)

  if (error) {
    console.warn("anon readback error:", error.message)
    return { error: error.message, rows: [] }
  }

  const found = (rows ?? []).map((r) => r.media_role)
  const missing = HELD_ROLES.filter((role) => !found.includes(role))
  return { rows: rows ?? [], found, missing, all_readable: missing.length === 0 }
}

async function main() {
  console.log("=== OAR2: Reseat Held Intro and Path Choice Media Assets ===")
  console.log(`source_oar2: ${SOURCE_OAR2}`)

  assertOk(
    await writer.from("measures_media_map").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  const rows = assertOk(
    await writer
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, is_active, metadata")
      .eq("campaign_key", CAMPAIGN_KEY)
      .in("media_role", HELD_ROLES),
    "read held rows",
  )

  console.log(`\nheld rows found: ${rows.length} of ${HELD_ROLES.length}`)
  for (const row of rows) {
    console.log(`  ${row.media_role}: is_active=${row.is_active}, path=${row.storage_path}`)
  }

  const missingFromDb = HELD_ROLES.filter((role) => !rows.find((r) => r.media_role === role))
  if (missingFromDb.length > 0) {
    console.error("ERROR: rows not found in DB:", missingFromDb)
    process.exit(1)
  }

  console.log("\nrunning pre-check (storage retrieval)...")
  const preCheckResults = await preCheck(rows)

  const failedRoles = Object.entries(preCheckResults)
    .filter(([, result]) => !result.ok)
    .map(([role]) => role)

  if (failedRoles.length > 0) {
    console.log(`\npre-check failed for: ${failedRoles.join(", ")}`)
    console.log("listing measures-registry bucket root for candidate paths...")
    const listing = await listBucketRoot()
    console.log("bucket root files:", JSON.stringify(listing.files, null, 2))

    const output = {
      source_oar2: SOURCE_OAR2,
      db_connection: "ok",
      pre_check: preCheckResults,
      failed_roles: failedRoles,
      bucket_listing: listing,
      reactivation_performed: false,
      halt_reason:
        "one or more files not present at recorded storage_path — operator upload or path correction required before reactivation",
      db_rows_updated: 0,
    }

    console.log("\n" + JSON.stringify(output, null, 2))
    process.exit(0)
  }

  console.log("\nall pre-checks passed — proceeding to reactivation")
  const reactivationResults = await reactivateRows(rows)

  console.log("\nverifying anon readback...")
  const anonReadback = await verifyAnonReadback()
  console.log(`anon readback: found=${anonReadback.found?.join(", ")}, missing=${anonReadback.missing?.join(", ") || "none"}`)

  console.log("\npost-reactivation storage check...")
  const postCheckResults = {}
  for (const row of rows) {
    const url = resolveSupabasePublicUrl(row.storage_path)
    const retrieval = await checkHttpStatus(url)
    postCheckResults[row.media_role] = { public_url: url, ...retrieval }
    console.log(`post-check ${row.media_role}: HTTP ${retrieval.status ?? "error"} (${retrieval.ok ? "ok" : "fail"})`)
  }

  const output = {
    source_oar2: SOURCE_OAR2,
    db_connection: "ok",
    pre_check: preCheckResults,
    reactivation: reactivationResults,
    post_check: postCheckResults,
    anon_readback: anonReadback,
    db_rows_updated: Object.keys(reactivationResults).length,
    reactivation_performed: true,
    all_anon_readable: anonReadback.all_readable ?? false,
    frontend_edits: false,
    r2_env_guidance: {
      variable: "VITE_R2_PUBLIC_BASE_URL",
      required_for_local_video: true,
      note: "Set in .env.local for local review of video assets (epigraph_video, hero_video, motion roles). Absence is expected in environments without R2 access — runtime shows fallback Continue button. Confirm variable is set in Cloudflare Pages environment variables for production.",
    },
  }

  console.log("\n" + JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
