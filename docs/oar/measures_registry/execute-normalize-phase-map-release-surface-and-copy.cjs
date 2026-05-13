require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const sourceOar2 = "oar2_normalize_phase_map_release_surface_and_copy_v1"
const evidencePath =
  "docs/oar/measures_registry/normalize_phase_map_release_surface_and_copy_v1.json"

const serviceUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/+$/g, "")
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!serviceUrl || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const ceremonialReleaseSequence = [
  "gate_1_crown_removed",
  "chamber_epithets_01_primus_artus",
  "chamber_epithets_02_gemynd_corpus",
  "gate_2_lapis_beads",
  "chamber_epithets_03_percipari",
  "me_01",
  "gate_3_lapis_necklace",
  "codexstone",
  "gate_4_breastplate",
  "chamber_epithets_04_lady_of_the_largest_heart",
  "chamber_epithets_05_spiritus_stellaris",
  "chamber_epithets_06_concursus_cubicali",
  "gate_5_measuring_rod",
  "gate_6_golden_bracelet",
  "gate_7_robe",
  "chamber_epithets_07_aphrodite",
  "chamber_epithets_08_the_last_oracle",
  "chamber_epithets_09_she_who_rises_with_the_dog_star",
  "me_02",
  "me_03",
  "me_04",
  "me_05",
  "me_06",
  "me_07",
  "me_08",
  "me_09",
  "me_10",
  "me_11",
  "me_12",
  "me_13",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function mergeRecord(existing, patch) {
  return {
    ...(existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {}),
    ...patch,
  }
}

function normalizePhaseMapMetadata(metadata) {
  const next = clone(metadata) ?? {}
  const phaseMap = mergeRecord(next.phase_map, {})
  const existingCadence = mergeRecord(phaseMap.cadence, {})
  const existingRouting = mergeRecord(phaseMap.routing, {})
  const existingLabels = mergeRecord(phaseMap.labels, {})

  phaseMap.semantic_role = "ritual_release_surface"
  phaseMap.primary_function = "phase_ritual_release_exact"
  phaseMap.secondary_function = "universal_cadence_sequence"
  phaseMap.labels = {
    ...existingLabels,
    title: "PHASE MAP",
    open_label: "Released",
    sealed_label: "Held",
    connect_prompt_label: "Held until exact release",
  }
  phaseMap.explanation = {
    title: null,
    body: [
      "The Phase Map reveals released encounter units in ceremonial relation.",
      "Held units remain visible until seated by exact release.",
    ],
  }
  phaseMap.legend = [
    { state: "released", label: "Released" },
    { state: "current", label: "Current Cadence" },
    { state: "held", label: "Held" },
    { state: "sealed", label: "Sealed" },
  ]
  phaseMap.cadence = {
    ...existingCadence,
    sequence: ceremonialReleaseSequence,
    semantic: "ceremonial_release_order",
    source_oar2: sourceOar2,
  }
  phaseMap.routing = {
    ...existingRouting,
    return_target: "kumurrah_passage",
    return_target_after_passage: "return_antechamber",
  }
  phaseMap.next_release = {
    ...(phaseMap.next_release ?? {}),
    label: "Held",
    title: "Exact Release",
    body: "Held units remain visible until seated by exact release.",
  }

  next.phase_map = phaseMap
  next.labels = phaseMap.labels
  next.presentation = mergeRecord(next.presentation, {
    description: phaseMap.explanation.body,
  })
  next.routing = mergeRecord(next.routing, {
    return_target: "kumurrah_passage",
    return_target_after_passage: "return_antechamber",
  })
  next.semantic_role = "ritual_release_surface"
  next.primary_function = "phase_ritual_release_exact"
  next.secondary_function = "universal_cadence_sequence"
  next.last_normalized_by = sourceOar2

  return next
}

function nodeStanding(node, phaseMap) {
  const override = phaseMap.node_state_overrides?.[node.registry_key]
  if (override === "sealed") return "sealed"
  if (node.access_state === "gated" || node.release_state === "held") return "held"
  if (node.is_interactive === false) return "sealed"
  return "released"
}

async function main() {
  const before = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, surface_type, metadata")
      .eq("encounter_key", "phase_map")
      .single(),
    "phase map lookup",
  )

  const nextMetadata = normalizePhaseMapMetadata(before.metadata)
  const after = assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("id", before.id)
      .select("encounter_key, surface_type, metadata")
      .single(),
    "phase map update",
  )

  const phaseMap = after.metadata.phase_map
  const nodes = phaseMap.nodes ?? []
  const routingNodes = phaseMap.routing?.nodes ?? {}
  const nodeSummary = nodes.map((node) => ({
    registry_key: node.registry_key,
    label: node.label,
    standing: nodeStanding(node, phaseMap),
    route_target: routingNodes[node.registry_key]?.target_registry_key ?? null,
    runtime_expected_interactable:
      nodeStanding(node, phaseMap) === "released" &&
      Boolean(routingNodes[node.registry_key]?.target_registry_key),
  }))

  const evidence = {
    source_oar2: sourceOar2,
    executed_at: new Date().toISOString(),
    mutation_count: 1,
    preserved_return: {
      target_registry_key: phaseMap.routing.return_target,
      target_after_passage: phaseMap.routing.return_target_after_passage,
    },
    labels: phaseMap.labels,
    explanation: phaseMap.explanation,
    legend: phaseMap.legend,
    cadence_sequence: phaseMap.cadence.sequence,
    node_summary: nodeSummary,
    shadowed_routing_note:
      "metadata.actions remain primary in current runtime; transition-view Phase Map rows are not surfaced while metadata actions exist.",
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
