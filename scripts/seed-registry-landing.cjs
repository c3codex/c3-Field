require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const landingRows = [
  {
    key: "landing_intro_video",
    title: "Integrity Governance for AI Systems",
    sequence: 1010,
    metadata: {
      renderer: "measures_registry_intro_video",
      title: "Integrity Governance for AI Systems",
      subtitle: "Behavior that is not registered cannot be governed.",
      completion_target: "landing_path_choice",
      playback: {
        mode: "fullscreen_intro",
        media_role: "hero_video",
        muted_autoplay: true,
        next_encounter_key: "landing_path_choice",
        skip_enabled: true,
      },
    },
  },
  {
    key: "landing_path_choice",
    title: "Choose Your Path",
    sequence: 1020,
    metadata: {
      renderer: "measures_registry_path_choice",
      eyebrow: "Measures Registry",
      title: "Choose Your Path",
      subtitle: "More acceleration or coherent alignment. Choose the route you are entering through.",
      background_media_role: "path_choice_background",
      more: {
        label: "MORE",
        body: "More nodes. More connections. Still no resolution.",
        action_label: "Explore System",
        action_key: "explore_system",
      },
      coherence: {
        label: "COHERENCE",
        body: "Fewer elements. Precise alignment. Complete resolution.",
        action_label: "Reserve Your Seat",
        action_key: "reserve_seat",
      },
      actions: [
        {
          action_key: "explore_system",
          label: "Explore System",
          behavior: "route_surface",
          target_encounter_key: "orientation_placeholder",
        },
        {
          action_key: "reserve_seat",
          label: "Reserve Your Seat",
          behavior: "open_src_intake",
          rpc: "submit_src_intake_request",
        },
      ],
    },
  },
]

async function assertOk(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
  return result.data
}

async function run() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  const registryPayload = landingRows.map((row) => ({
    registry_key: row.key,
    display_title: row.title,
    registry_family: "spine",
    encounter_type: "view",
    material_family: "lapis",
    sequence_order: row.sequence,
    release_state: "released",
    access_state: "callable",
    is_active: true,
    metadata: {
      role: "measures_registry_landing",
      source: "db_seed",
    },
  }))

  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(registryPayload, { onConflict: "registry_key" }),
    "Registry landing row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id, registry_key")
      .in(
        "registry_key",
        landingRows.map((row) => row.key),
      ),
    "Registry landing row read failed",
  )

  const registryIdByKey = new Map(
    registryRows.map((row) => [row.registry_key, row.id]),
  )

  const encounterPayload = landingRows.map((row) => ({
    registry_id: registryIdByKey.get(row.key),
    encounter_key: row.key,
    display_title: row.title,
    encounter_type: "view",
    material_family: "lapis",
    surface_type: "threshold",
    sequence_order: row.sequence,
    pause_allowed: false,
    is_entry_surface: row.key === "landing_intro_video",
    is_active: true,
    metadata: row.metadata,
  }))

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .upsert(encounterPayload, { onConflict: "registry_id" }),
    "Landing encounter upsert failed",
  )

  const mediaPayload = [
    {
      registry_key: "landing_intro_video",
      encounter_key: "landing_intro_video",
      campaign_key: "agents_of_chaos_integrity_governance",
      media_role: "hero_video",
      storage_bucket: "measures-registry",
      storage_path: "integrity_governance_intro.mp4",
      mime_type: "video/mp4",
      sort_order: 1,
      is_active: true,
      metadata: {
        surface: "landing_intro_video",
        usage: "fullscreen_intro",
      },
    },
    {
      registry_key: "landing_path_choice",
      encounter_key: "landing_path_choice",
      campaign_key: "agents_of_chaos_integrity_governance",
      media_role: "path_choice_background",
      storage_bucket: "measures-registry",
      storage_path: "more_vs_coherence_path.webp",
      mime_type: "image/webp",
      sort_order: 2,
      is_active: true,
      metadata: {
        surface: "landing_path_choice",
        usage: "path_choice_background",
      },
    },
    {
      registry_key: "landing_intro_video",
      encounter_key: "landing_intro_video",
      campaign_key: "agents_of_chaos_integrity_governance",
      media_role: "hero_poster",
      storage_bucket: "measures-registry",
      storage_path: "measures_registry_poster.webp",
      mime_type: "image/webp",
      sort_order: 2,
      is_active: true,
      metadata: {
        surface: "landing_intro_video",
        usage: "hero_poster",
      },
    },
  ]

  for (const mediaRow of mediaPayload) {
    const existingRows = await assertOk(
      await supabase
        .from("measures_media_map")
        .select("id")
        .eq("campaign_key", mediaRow.campaign_key)
        .eq("media_role", mediaRow.media_role),
      `Landing media lookup failed: ${mediaRow.media_role}`,
    )

    if (existingRows.length > 0) {
      await assertOk(
        await supabase
          .from("measures_media_map")
          .update(mediaRow)
          .eq("id", existingRows[0].id),
        `Landing media update failed: ${mediaRow.media_role}`,
      )
    } else {
      await assertOk(
        await supabase.from("measures_media_map").insert(mediaRow),
        `Landing media insert failed: ${mediaRow.media_role}`,
      )
    }
  }

  const seated = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key")
      .in(
        "encounter_key",
        landingRows.map((row) => row.key),
      ),
    "Landing encounter verification failed",
  )

  const media = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, is_active")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .in("media_role", ["hero_video", "hero_poster", "path_choice_background"])
      .eq("is_active", true),
    "Landing media verification failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        landingEncounterCount: seated.length,
        introVideoFromMeasuresMediaMap: media.some(
          (row) => row.media_role === "hero_video" && row.storage_path,
        ),
        heroPosterFromMeasuresMediaMap: media.some(
          (row) => row.media_role === "hero_poster" && row.storage_path,
        ),
        pathChoiceBackgroundFromMeasuresMediaMap: media.some(
          (row) =>
            row.media_role === "path_choice_background" &&
            row.storage_path === "more_vs_coherence_path.webp",
        ),
      },
      null,
      2,
    ),
  )
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
