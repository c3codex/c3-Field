require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)
const campaignKey = "agents_of_chaos_integrity_governance"
const registryKey = "c3_field"
const source = "epigraph_landing_refinement_v1"
const c3FieldVideoRole = "c3_field_video"
const c3FieldVideoPath = "c3_field.mp4"

const fieldExpressions = [
  {
    name: "Measures of Inanna",
    description:
      "A registry-driven encounter system demonstrating structured progression and phase coherence.",
  },
  {
    name: "Priceless Gallery",
    description:
      "A living archive structured through presence, outside transactional framing.",
  },
  {
    name: "c3 DAO",
    description:
      "Institutional layer for governance, contribution routing, and coordinated evolution.",
  },
]

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  const files = await assertOk(
    await supabase.storage.from("measures-registry").list("", { search: c3FieldVideoPath, limit: 10 }),
    "c3_field.mp4 storage lookup failed",
  )

  const videoFile = files.find((file) => file.name === c3FieldVideoPath)
  if (!videoFile) throw new Error("c3_field.mp4 missing from measures-registry bucket")

  const mediaPayload = {
    registry_key: registryKey,
    encounter_key: registryKey,
    campaign_key: campaignKey,
    media_role: c3FieldVideoRole,
    storage_bucket: "measures-registry",
    storage_path: c3FieldVideoPath,
    mime_type: "video/mp4",
    sort_order: 30,
    is_active: true,
    metadata: {
      usage: "authority_field_expression",
      source,
    },
  }

  const existingMediaRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("id")
      .eq("campaign_key", campaignKey)
      .eq("media_role", c3FieldVideoRole)
      .limit(1),
    "c3 Field media map lookup failed",
  )

  if (existingMediaRows.length > 0) {
    await assertOk(
      await supabase
        .from("measures_media_map")
        .update(mediaPayload)
        .eq("id", existingMediaRows[0].id),
      "c3 Field media map update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_media_map").insert(mediaPayload),
      "c3 Field media map insert failed",
    )
  }

  const [fieldRow] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", registryKey)
      .limit(1),
    "c3 Field encounter lookup failed",
  )

  if (!fieldRow) throw new Error("c3_field encounter row missing")

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        metadata: {
          ...(fieldRow.metadata ?? {}),
          field_expressions: fieldExpressions,
          media_roles: [c3FieldVideoRole],
          source_epigraph_landing_refinement: source,
        },
      })
      .eq("id", fieldRow.id),
    "c3 Field metadata update failed",
  )

  const [validation] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", registryKey)
      .limit(1),
    "c3 Field validation failed",
  )

  const mediaRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .eq("campaign_key", campaignKey)
      .eq("media_role", c3FieldVideoRole)
      .eq("is_active", true),
    "c3 Field media validation failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        c3FieldVideoStorageObject: {
          name: videoFile.name,
          size: videoFile.metadata?.size ?? videoFile.metadata?.contentLength ?? null,
          mimetype: videoFile.metadata?.mimetype ?? null,
        },
        mediaRoleSeated: mediaRows.length === 1 ? mediaRows[0] : null,
        fieldExpressionCount: validation?.metadata?.field_expressions?.length ?? 0,
        fieldExpressionNames: (validation?.metadata?.field_expressions ?? []).map(
          (expression) => expression.name,
        ),
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
