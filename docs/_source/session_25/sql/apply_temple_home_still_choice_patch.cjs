require("dotenv").config({ path: ".env.local" })

const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
)

async function main() {
  const { data, error } = await supabase
    .from("measures_encounter_def")
    .select("id, metadata, measures_registry!inner(registry_key)")
    .eq("measures_registry.registry_key", "crystal_temple_home")
    .single()

  if (error) throw error

  const metadata = data.metadata ?? {}
  const presentation = metadata.presentation ?? {}

  const patched = {
    ...metadata,
    renderer: {
      ...(metadata.renderer ?? {}),
      layout: "choice_surface",
      media_fit: "contain",
      show_header: false,
      media_max_width: "92vw",
      media_max_height: "78vh",
      show_action_rail: true,
      choice_surface_mode: "still_choice",
    },
    playback: {
      ...(metadata.playback ?? {}),
      mode: "still_choice",
      video_mode: "still_choice",
      settle_to_still: false,
      auto_advance_on_video_end: false,
      advance_delay_ms: null,
    },
    chamberplate: {
      ...(metadata.chamberplate ?? {}),
      mode: "choice_surface",
      render_order: ["image", "audio"],
      route_targets: ["temple_antechamber", "inanna_seat"],
      interaction_mode: "choice",
    },
    presentation: {
      ...presentation,
      action_mode: "left_right_choice",
      refraction_mode: "crystal_soft",
      playback: {
        ...(presentation.playback ?? {}),
        video_mode: "still_choice",
        settle_to_still: false,
        auto_advance_on_video_end: false,
        advance_delay_ms: null,
      },
      choice_behaviors: {
        left: {
          anchor: "antechamber_arch",
          label: "Enter Antechamber",
          target_registry_key: "temple_antechamber",
        },
        right: {
          anchor: "inanna_seat",
          label: "Enter Inanna's Seat",
          target_registry_key: "inanna_seat",
        },
      },
    },
    actions: [
      {
        id: "enter_antechamber",
        label: "Enter Antechamber",
        kind: "navigate",
        emphasis: "primary",
        target_registry_key: "temple_antechamber",
        sort_order: 10,
        behavior: {
          position: "left",
          anchor: "antechamber_arch",
        },
      },
      {
        id: "enter_inanna_seat",
        label: "Enter Inanna's Seat",
        kind: "navigate",
        emphasis: "secondary",
        target_registry_key: "inanna_seat",
        sort_order: 20,
        behavior: {
          position: "right",
          anchor: "inanna_seat",
        },
      },
    ],
  }

  const { error: updateError } = await supabase
    .from("measures_encounter_def")
    .update({ metadata: patched })
    .eq("id", data.id)

  if (updateError) throw updateError

  const { error: videoError } = await supabase
    .from("temp_exhibition_media")
    .update({
      is_active: false,
      notes: "disabled for still-choice temple home; DB behavior seats still surface",
    })
    .eq("surface_key", "crystal_temple_home")
    .eq("media_type", "video")

  if (videoError) throw videoError

  const { error: imageError } = await supabase
    .from("temp_exhibition_media")
    .update({ is_active: true, render_order: 10 })
    .eq("surface_key", "crystal_temple_home")
    .eq("media_type", "image")

  if (imageError) throw imageError

  console.log(
    JSON.stringify(
      {
        updated: "crystal_temple_home",
        playback: "still_choice",
        video_active: false,
        left: "temple_antechamber",
        right: "inanna_seat",
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
