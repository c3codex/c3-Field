require("dotenv").config({ path: ".env.local" })

const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
)

const passageRenderer = {
  layout: "passage_only",
  media_fit: "contain",
  show_header: false,
  media_max_width: "82vw",
  media_max_height: "68svh",
  show_action_rail: false,
}

const passagePlayback = {
  mode: "video_passage",
  fade_ms: 1200,
  settle_ms: 2200,
  advance_delay_ms: 3000,
  auto_advance_on_video_end: true,
}

function action(id, label, target) {
  return {
    id,
    label,
    kind: "progression",
    emphasis: "primary",
    target_registry_key: target,
  }
}

async function patchEncounter(registryKey, mutate) {
  const { data, error } = await supabase
    .from("measures_encounter_def")
    .select("id, metadata, measures_registry!inner(registry_key)")
    .eq("measures_registry.registry_key", registryKey)
    .single()

  if (error) throw error

  const metadata = mutate(data.metadata ?? {})
  const { error: updateError } = await supabase
    .from("measures_encounter_def")
    .update({ metadata })
    .eq("id", data.id)

  if (updateError) throw updateError
}

async function upsertPassageMedia(surfaceKey, label, storagePath, mediaType) {
  const row = {
    display_context: "measures_of_inanna",
    surface_type: "passage",
    surface_key: surfaceKey,
    label,
    media_type: mediaType,
    bucket_name: "pre-codex-exhibition",
    storage_path: storagePath,
    render_order: 10,
    is_active: true,
    notes: "temporary _01 family passage media reuse",
  }

  const { data: existing, error: selectError } = await supabase
    .from("temp_exhibition_media")
    .select("id")
    .eq("surface_key", surfaceKey)
    .eq("media_type", mediaType)
    .maybeSingle()

  if (selectError) throw selectError

  if (existing) {
    const { error } = await supabase
      .from("temp_exhibition_media")
      .update(row)
      .eq("id", existing.id)
    if (error) throw error
    return
  }

  const { error } = await supabase.from("temp_exhibition_media").insert(row)
  if (error) throw error
}

async function main() {
  const changed = []

  await patchEncounter("gate_1_crown_removed", (metadata) => ({
    ...metadata,
    actions: [action("continue_descent", "Continue Descent", "gates_passage_01")],
    chamberplate: {
      ...(metadata.chamberplate ?? {}),
      route_targets: ["gates_passage_01"],
    },
  }))
  changed.push("gate_1_crown_removed -> gates_passage_01")

  await patchEncounter("chamber_epithets_01_primus_artus", (metadata) => ({
    ...metadata,
    actions: [action("continue", "Continue", "epithets_passage_01")],
    chamberplate: {
      ...(metadata.chamberplate ?? {}),
      route_targets: ["epithets_passage_01"],
    },
  }))
  changed.push("epithet 01 -> epithets_passage_01")

  await patchEncounter("chamber_epithets_02_gemynd_corpus", (metadata) => ({
    ...metadata,
    actions: [action("continue", "Continue", "epithets_passage_02")],
    chamberplate: {
      ...(metadata.chamberplate ?? {}),
      route_targets: ["epithets_passage_02"],
    },
  }))
  changed.push("epithet 02 -> epithets_passage_02")

  for (let index = 1; index <= 7; index += 1) {
    const current = "me_" + String(index).padStart(2, "0")
    const passage = "me_passage_" + String(index).padStart(2, "0")

    await patchEncounter(current, (metadata) => ({
      ...metadata,
      actions: [action("continue_marble_sequence", "Continue", passage)],
      chamberplate: {
        ...(metadata.chamberplate ?? {}),
        route_targets: [passage],
      },
    }))
    changed.push(`${current} -> ${passage}`)
  }

  const passages = [
    {
      key: "gates_passage_01",
      label: "Gates Passage 01",
      mediaType: "image",
      storagePath: "gates_passage_01.png",
      target: "gate_2_lapis_beads",
    },
    {
      key: "epithets_passage_01",
      label: "Epithets Passage 01",
      mediaType: "video",
      storagePath: "epithet_passage_01.mp4",
      target: "chamber_epithets_02_gemynd_corpus",
    },
    {
      key: "epithets_passage_02",
      label: "Epithets Passage 02",
      mediaType: "video",
      storagePath: "epithet_passage_01.mp4",
      target: "chamber_epithets_03_percipari",
    },
  ]

  for (let index = 1; index <= 7; index += 1) {
    const padded = String(index).padStart(2, "0")
    passages.push({
      key: "me_passage_" + padded,
      label: "ME Passage " + padded,
      mediaType: "video",
      storagePath: "me_passage_01.mp4",
      target: "me_" + String(index + 1).padStart(2, "0"),
    })
  }

  for (const passage of passages) {
    await patchEncounter(passage.key, (metadata) => ({
      ...metadata,
      renderer: {
        ...(metadata.renderer ?? {}),
        ...passageRenderer,
      },
      playback: {
        ...(metadata.playback ?? {}),
        ...passagePlayback,
      },
      auto_advance_to: passage.target,
    }))

    await upsertPassageMedia(
      passage.key,
      passage.label,
      passage.storagePath,
      passage.mediaType,
    )

    changed.push(`${passage.key} uses ${passage.storagePath}`)
  }

  console.log(JSON.stringify({ count: changed.length, changed }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
