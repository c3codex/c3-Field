require("dotenv").config({ path: ".env.local" })

const { createClient } = require("@supabase/supabase-js")

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(url, key)

function action(id, label, target, extra = {}) {
  return {
    id,
    label,
    kind: "progression",
    emphasis: "primary",
    target_registry_key: target,
    ...extra,
  }
}

const passageRenderer = {
  layout: "passage_only",
  media_fit: "contain",
  show_header: false,
  media_max_width: "82vw",
  media_max_height: "68svh",
  show_action_rail: false,
}

function passagePlayback(delay = 3000) {
  return {
    mode: "video_passage",
    fade_ms: 1200,
    settle_ms: 2200,
    advance_delay_ms: delay,
    auto_advance_on_video_end: true,
  }
}

const chamberRenderer = {
  layout: "encounter_focus",
  media_fit: "contain",
  show_header: false,
  media_max_width: "82vw",
  media_max_height: "68svh",
  show_action_rail: true,
}

const plaqueRenderer = {
  layout: "plaque_overlay",
  media_fit: "contain",
  show_header: false,
  media_max_width: "82vw",
  media_max_height: "68svh",
  show_action_rail: true,
}

const updates = {
  gate_1_crown_removed: {
    renderer: plaqueRenderer,
    playback: { advance_delay_ms: 3000, auto_advance_on_video_end: false },
    actions: [action("continue_descent", "Continue Descent", "gate_2_lapis_beads")],
    chamberplate: { route_targets: ["gate_2_lapis_beads"] },
  },
  gate_2_lapis_beads: {
    renderer: chamberRenderer,
    actions: [
      action("enter_kumurrah_to_epithets", "Enter Chamber of Epithets", "kumurrah_passage", {
        target_after_passage: "chamber_epithets_01_primus_artus",
      }),
    ],
    chamberplate: { route_targets: ["kumurrah_passage"] },
  },
  chamber_epithets_01_primus_artus: {
    renderer: chamberRenderer,
    actions: [action("continue", "Continue", "chamber_epithets_02_gemynd_corpus")],
    chamberplate: { route_targets: ["chamber_epithets_02_gemynd_corpus"] },
  },
  chamber_epithets_02_gemynd_corpus: {
    renderer: chamberRenderer,
    actions: [action("continue", "Continue", "chamber_epithets_03_percipari")],
    chamberplate: { route_targets: ["chamber_epithets_03_percipari"] },
  },
  chamber_epithets_03_percipari: {
    renderer: chamberRenderer,
    actions: [
      action("enter_kumurrah_to_codexstone", "Enter Kumurrah", "kumurrah_passage", {
        target_after_passage: "codexstone",
      }),
    ],
    chamberplate: { route_targets: ["kumurrah_passage"] },
  },
  codexstone: {
    renderer: plaqueRenderer,
    actions: [action("enter_marble_chamber", "Enter Marble Chamber", "me_01")],
    chamberplate: { route_targets: ["me_01"] },
  },
  gates_passage_01: {
    renderer: passageRenderer,
    playback: passagePlayback(),
    auto_advance_to: "gate_2_lapis_beads",
  },
  epithets_passage_01: {
    renderer: passageRenderer,
    playback: passagePlayback(),
    auto_advance_to: "chamber_epithets_02_gemynd_corpus",
  },
  epithets_passage_02: {
    renderer: passageRenderer,
    playback: passagePlayback(),
    auto_advance_to: "chamber_epithets_03_percipari",
  },
  epithets_passage_03: {
    renderer: passageRenderer,
    playback: passagePlayback(),
    auto_advance_to: "codexstone",
  },
  kumurrah_passage: {
    renderer: passageRenderer,
    playback: passagePlayback(900),
    auto_advance_to: "codexstone",
  },
  temple_harrumuk_passage: {
    renderer: passageRenderer,
    playback: passagePlayback(1800),
    auto_advance_to: "phase_map",
  },
}

for (let i = 1; i <= 8; i += 1) {
  const padded = String(i).padStart(2, "0")
  const keyName = "me_" + padded
  const next = i < 8 ? "me_" + String(i + 1).padStart(2, "0") : "temple_harrumuk_passage"
  const finalPassageTarget = i < 8 ? {} : { target_after_passage: "return_antechamber" }

  updates[keyName] = {
    renderer: chamberRenderer,
    actions: [
      action(
        i < 8 ? "continue_marble_sequence" : "return_via_harrumuk",
        i < 8 ? "Continue" : "Return Through Harrumuk",
        next,
        finalPassageTarget,
      ),
    ],
    chamberplate: { route_targets: [next] },
  }

  if (i < 8) {
    updates["me_passage_" + padded] = {
      renderer: passageRenderer,
      playback: passagePlayback(),
      auto_advance_to: "me_" + String(i + 1).padStart(2, "0"),
    }
  }
}

const phaseSequence = [
  "gate_1_crown_removed",
  "gate_2_lapis_beads",
  "chamber_epithets_01_primus_artus",
  "chamber_epithets_02_gemynd_corpus",
  "chamber_epithets_03_percipari",
  "codexstone",
  "me_01",
  "me_02",
  "me_03",
  "me_04",
  "me_05",
  "me_06",
  "me_07",
  "me_08",
]

async function main() {
  const keys = [...Object.keys(updates), "phase_map"]
  const { data, error } = await supabase
    .from("measures_encounter_def")
    .select("id, metadata, measures_registry!inner(registry_key)")
    .in("measures_registry.registry_key", keys)

  if (error) throw error

  const updated = []

  for (const row of data ?? []) {
    const registry = Array.isArray(row.measures_registry)
      ? row.measures_registry[0]
      : row.measures_registry
    const registryKey = registry.registry_key
    let metadata = row.metadata ?? {}

    if (registryKey === "phase_map") {
      const phaseMap = metadata.phase_map ?? {}
      metadata = {
        ...metadata,
        phase_map: {
          ...phaseMap,
          center_node: {
            ...(phaseMap.center_node ?? {}),
            registry_key: "gate_1_crown_removed",
            label: "Current Cadence",
          },
          cadence: {
            ...(phaseMap.cadence ?? {}),
            center_label: "Current Cadence",
            sequence: phaseSequence,
            complete_target_registry_key: "temple_harrumuk_passage",
          },
          next_release: {
            label: "Next release",
            title: "June Solstice",
            body: "Held chamberplates remain sealed until the next seated release window.",
          },
        },
      }
    } else {
      const patch = updates[registryKey]
      if (!patch) continue

      metadata = { ...metadata }
      if (patch.renderer) metadata.renderer = { ...(metadata.renderer ?? {}), ...patch.renderer }
      if (patch.playback) metadata.playback = { ...(metadata.playback ?? {}), ...patch.playback }
      if (patch.actions) metadata.actions = patch.actions
      if (patch.auto_advance_to) metadata.auto_advance_to = patch.auto_advance_to
      if (patch.chamberplate) {
        metadata.chamberplate = { ...(metadata.chamberplate ?? {}), ...patch.chamberplate }
      }
    }

    const { error: updateError } = await supabase
      .from("measures_encounter_def")
      .update({ metadata })
      .eq("id", row.id)

    if (updateError) throw updateError
    updated.push(registryKey)
  }

  console.log(JSON.stringify({ count: updated.length, updated: updated.sort() }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
