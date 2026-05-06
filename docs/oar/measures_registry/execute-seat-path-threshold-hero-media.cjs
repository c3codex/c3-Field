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
const registryKey = "measures_registry_landing"
const encounterKey = "landing_root"
const bucket = "measures-registry"
const source = "seat_path_threshold_hero_media_v1"

const mediaContract = [
  {
    role: "left_hero_fracture",
    file: "left_hero_fracture.webp",
    mimeType: "image/webp",
    sortOrder: 50,
  },
  {
    role: "left_hero_fracture_motion",
    file: "left_hero_fracture_motion.mp4",
    mimeType: "video/mp4",
    sortOrder: 51,
  },
  {
    role: "right_measured_hero",
    file: "right_measured_hero.webp",
    mimeType: "image/webp",
    sortOrder: 52,
  },
  {
    role: "measured_hero_motion_graphic",
    file: "measured_hero_motion_graphic.mp4",
    aliases: ["right_measured_hero_motion_graphic.mp4"],
    mimeType: "video/mp4",
    sortOrder: 53,
  },
]

const searchPrefixes = [
  "",
  "measures_registry",
  "measures_registry/landing",
  "measures_registry/landing/images",
  "measures_registry/landing/video",
  "measures_registry/landing/videos",
  "landing",
  "landing/images",
  "landing/video",
  "landing/videos",
]

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function findStorageAsset(fileName, aliases = []) {
  const attempts = []
  const candidates = [fileName, ...aliases]

  for (const prefix of searchPrefixes) {
    for (const candidate of candidates) {
      const files = await assertOk(
        await supabase.storage.from(bucket).list(prefix, { search: candidate, limit: 100 }),
        `storage lookup failed for ${prefix || "/"}`,
      )
      attempts.push({ prefix, search: candidate, returned: files.map((file) => file.name) })

      const exact = files.find((file) => file.name === candidate)
      if (exact) {
        return {
          bucket,
          path: prefix ? `${prefix}/${candidate}` : candidate,
          size: exact.metadata?.size ?? exact.metadata?.contentLength ?? null,
          expectedFile: fileName,
          resolvedFile: candidate,
          attempts,
        }
      }
    }
  }

  return { bucket, path: null, size: null, expectedFile: fileName, resolvedFile: null, attempts }
}

async function seatMediaRow(item, resolved) {
  if (!resolved.path) throw new Error(`Storage asset missing: ${item.file}`)

  const payload = {
    registry_key: registryKey,
    encounter_key: encounterKey,
    campaign_key: campaignKey,
    media_role: item.role,
    storage_bucket: resolved.bucket,
    storage_path: resolved.path,
    mime_type: item.mimeType,
    sort_order: item.sortOrder,
    is_active: true,
    metadata: {
      source,
      expected_asset: item.file,
      accepted_aliases: item.aliases ?? [],
      resolved_asset: resolved.resolvedFile,
      resolved_path: resolved.path,
      storage_size: resolved.size,
      scope: "hero_media_seating_only",
    },
  }

  const existing = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("id")
      .eq("campaign_key", campaignKey)
      .eq("media_role", item.role)
      .limit(1),
    `${item.role} media lookup failed`,
  )

  if (existing.length > 0) {
    await assertOk(
      await supabase.from("measures_media_map").update(payload).eq("id", existing[0].id),
      `${item.role} media update failed`,
    )
    return "updated"
  }

  await assertOk(
    await supabase.from("measures_media_map").insert(payload),
    `${item.role} media insert failed`,
  )
  return "inserted"
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  const seated = []

  for (const item of mediaContract) {
    const resolved = await findStorageAsset(item.file, item.aliases)
    const operation = await seatMediaRow(item, resolved)
    seated.push({
      media_role: item.role,
      expected_asset: item.file,
      resolved_asset: resolved.resolvedFile,
      operation,
      storage_bucket: resolved.bucket,
      storage_path: resolved.path,
      storage_size: resolved.size,
    })
  }

  const rows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, campaign_key, encounter_key, sort_order")
      .eq("campaign_key", campaignKey)
      .in("media_role", mediaContract.map((item) => item.role))
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    "threshold media validation failed",
  )

  const publicUrls = rows.map((row) => ({
    media_role: row.media_role,
    public_url: supabase.storage.from(row.storage_bucket).getPublicUrl(row.storage_path).data.publicUrl,
  }))

  console.log(JSON.stringify({
    dbConnection: "active",
    source,
    expectedRoleCount: mediaContract.length,
    activeRoleCount: rows.length,
    allExpectedRolesActive: rows.length === mediaContract.length,
    seated,
    rows,
    publicUrls,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
