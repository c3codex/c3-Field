require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"

const INSPECT_ROLES = [
  // intro renderer consumed roles
  "epigraph_video",
  "hero_video",
  "hero_image",
  "hero_poster",
  "left_hero_fracture",
  "left_hero_fracture_motion",
  "right_measured_hero",
  "measured_hero_motion_graphic",
  "hero_measured_image",
  // path choice renderer consumed role
  "path_choice_background",
  // operator-named motion assets
  "measures_structured_enviroments",
]

const STILL_PATHS_TO_CHECK = [
  "left_measures_hero.webp",
  "right_measures_hero.webp",
  "hero_fracture_measure.webp",
  "more_vs_coherence_path.webp",
]

const SUPABASE_BUCKET = "measures-registry"

function publicUrl(storagePath) {
  return supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(storagePath).data.publicUrl
}

async function httpStatus(url) {
  if (!url) return { ok: false, status: null, reason: "no url" }
  try {
    const res = await fetch(url, { method: "GET" })
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get("content-type"),
      contentLength: res.headers.get("content-length"),
    }
  } catch (err) {
    return { ok: false, status: null, error: err.message }
  }
}

async function listBucketRoot(bucket) {
  const { data, error } = await supabase.storage.from(bucket).list("", {
    limit: 200,
    sortBy: { column: "name", order: "asc" },
  })
  if (error) return { error: error.message, files: [] }
  return { files: (data ?? []).map((f) => ({ name: f.name, size: f.metadata?.size ?? null })) }
}

async function main() {
  console.log("=== Media state inspection: intro + path-choice ===\n")

  // 1. DB rows for relevant roles
  const { data: rows, error: rowsError } = await supabase
    .from("measures_media_map")
    .select("media_role, storage_bucket, storage_path, mime_type, is_active, sort_order, metadata")
    .eq("campaign_key", CAMPAIGN_KEY)
    .in("media_role", INSPECT_ROLES)
    .order("sort_order", { ascending: true })

  if (rowsError) throw new Error(`DB read error: ${rowsError.message}`)

  console.log("--- DB rows (measures_media_map) ---")
  for (const row of rows ?? []) {
    const holdReason = row.metadata?.hold_reason ?? null
    const heldBy = row.metadata?.held_by_oar2 ?? null
    console.log(JSON.stringify({
      media_role: row.media_role,
      storage_bucket: row.storage_bucket,
      storage_path: row.storage_path,
      mime_type: row.mime_type,
      is_active: row.is_active,
      hold_reason: holdReason,
      held_by_oar2: heldBy,
    }))
  }

  const missingRoles = INSPECT_ROLES.filter(
    (role) => !(rows ?? []).find((r) => r.media_role === role),
  )
  if (missingRoles.length > 0) {
    console.log("\nROLES NOT IN DB:", missingRoles.join(", "))
  }

  // 2. Check Supabase still asset paths
  console.log("\n--- Supabase still asset HTTP checks (measures-registry bucket) ---")
  for (const path of STILL_PATHS_TO_CHECK) {
    const url = publicUrl(path)
    const status = await httpStatus(url)
    console.log(JSON.stringify({ path, url, ...status }))
  }

  // 3. List measures-registry bucket root
  console.log("\n--- measures-registry bucket root listing ---")
  const listing = await listBucketRoot(SUPABASE_BUCKET)
  if (listing.error) {
    console.log("listing error:", listing.error)
  } else {
    console.log(`files (${listing.files.length}):`)
    for (const f of listing.files) {
      console.log(`  ${f.name}  [${f.size ?? "?"}]`)
    }
  }

  // 4. Encounter metadata check for both target encounters
  console.log("\n--- measures_encounter_def media contracts ---")
  const { data: encounters, error: encError } = await supabase
    .from("measures_encounter_def")
    .select("encounter_key, metadata")
    .in("encounter_key", ["ai_isnt_broken_intro", "evaluate_structure_path"])

  if (encError) {
    console.log("encounter read error:", encError.message)
  } else {
    for (const enc of encounters ?? []) {
      const mediaRoles = enc.metadata?.media_roles ?? enc.metadata?.media_contract ?? null
      console.log(JSON.stringify({
        encounter_key: enc.encounter_key,
        media_roles_in_metadata: mediaRoles,
      }))
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
