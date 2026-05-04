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

const landingRows = [
  {
    key: "landing_intro_video",
    title: "AI isn't broken. Systems are.",
    sequence: 1010,
    metadata: {
      renderer: "measures_registry_intro_video",
      title: "AI isn't broken. Systems are.",
      subtitle: "Most AI failures aren't intelligence problems.\nThey're system failures.",
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
    title: "AI isn't broken. Systems are.",
    sequence: 1020,
    metadata: {
      renderer: "measures_registry_path_choice",
      header: {
        title: "Measures Registry",
        mark_media_role: "registry_mark",
        actions: [
          {
            action_key: "about",
            label: "About",
            behavior: "route_surface",
            target_encounter_key: "orientation_placeholder",
          },
          {
            action_key: "contact",
            label: "Contact",
            behavior: "open_src_intake",
            rpc: "submit_src_intake_request",
          },
        ],
      },
      eyebrow: "Measures Registry",
      title: "AI isn't broken. Systems are.",
      subtitle: "Most AI failures aren't intelligence problems.\nThey're system failures.",
      background_media_role: "path_choice_background",
      plaques: [
        {
          side: "left",
          title: "UNDERSTAND FAILURE",
          body: "Why AI integrations break inside ungoverned systems.",
          action_label: "Explore System",
          action_key: "explore_system",
        },
        {
          side: "right",
          title: "BUILD COHERENCE",
          body: "How to structure systems that actually resolve.",
          action_label: "Reserve Your Seat",
          action_key: "reserve_seat",
        },
      ],
      more: {
        label: "UNDERSTAND FAILURE",
        body: "Why AI integrations break inside ungoverned systems.",
        action_label: "Explore System",
        action_key: "explore_system",
      },
      coherence: {
        label: "BUILD COHERENCE",
        body: "How to structure systems that actually resolve.",
        action_label: "Reserve Your Seat",
        action_key: "reserve_seat",
      },
      actions: [
        {
          action_key: "explore_system",
          label: "Explore System",
          behavior: "route_surface",
          target_encounter_key: "understand_failure",
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
  {
    key: "understand_failure",
    title: "UNDERSTAND FAILURE",
    sequence: 1030,
    metadata: {
      renderer: "generic_media_encounter",
      header: {
        title: "Measures Registry",
        mark_media_role: "registry_mark",
        actions: [
          {
            action_key: "back_to_path",
            label: "Back to Path",
            behavior: "route_surface",
            target_encounter_key: "landing_path_choice",
          },
        ],
      },
      entry_label: "UNDERSTAND FAILURE",
      entry_headline: "Your systems don't resolve.",
      entry_sub: "AI isn't failing.\nYour environment is.",
      breakdown_blocks: [
        "Outputs drift. Results change without cause.",
        "Decisions don't stabilize. Every pass produces a new answer.",
        "Systems don't align. Tools operate without shared structure.",
        "Scale increases noise. More input, less resolution.",
      ],
      resolution_shift: "This isn't an AI problem.\nIt's a system problem.",
      transition_statement: "You don't need better AI.\nYou need a system that resolves.",
      media_roles: [
        "unstable_network",
        "partial_geometry",
        "failed_alignment_sequences",
      ],
      actions: [
        {
          action_key: "build_coherence",
          label: "BUILD COHERENCE",
          behavior: "route_surface",
          target_encounter_key: "reserve_seat",
        },
        {
          action_key: "back_to_path",
          label: "Back to Path",
          behavior: "route_surface",
          target_encounter_key: "landing_path_choice",
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
    {
      registry_key: "landing_path_choice",
      encounter_key: "landing_path_choice",
      campaign_key: "agents_of_chaos_integrity_governance",
      media_role: "registry_mark",
      storage_bucket: "measures-registry",
      storage_path: "measures_registry_mark.webp",
      mime_type: "image/webp",
      sort_order: 3,
      is_active: true,
      metadata: {
        surface: "landing_path_choice",
        usage: "registry_header_mark",
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
      .in("media_role", ["hero_video", "hero_poster", "path_choice_background", "registry_mark"])
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
        registryMarkFromMeasuresMediaMap: media.some(
          (row) =>
            row.media_role === "registry_mark" &&
            row.storage_bucket === "measures-registry" &&
            row.storage_path === "measures_registry_mark.webp",
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
