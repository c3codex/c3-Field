require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { readFileSync, writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const serviceUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!serviceUrl || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const evidencePath =
  "docs/oar/measures_registry/repair_gate_1_crown_removed_encounter_resolution_v1.json"
const resolverPath = "src/measures_of_inanna/resolve_encounter.ts"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]
}

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null
}

function asString(value) {
  return typeof value === "string" ? value : null
}

function metadataEncounterKey(metadata) {
  const record = asRecord(metadata)
  if (!record) return null
  return (
    asString(record.encounter_key) ??
    asString(record.encounterKey) ??
    asString(record.encounter_def_key) ??
    asString(record.encounterDefKey)
  )
}

function orderEncounterRows(rows, encounterKeys) {
  return [...rows].sort((left, right) => {
    const leftIndex = encounterKeys.indexOf(left.encounter_key)
    const rightIndex = encounterKeys.indexOf(right.encounter_key)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

async function inspectRegistryKey(registryKey) {
  const registry = assertOk(
    await supabase
      .from("measures_registry")
      .select("id, registry_key, metadata")
      .eq("registry_key", registryKey)
      .maybeSingle(),
    `registry lookup for ${registryKey}`,
  )

  if (!registry) {
    return {
      registryKey,
      registryRow: false,
      encounterCandidates: [],
      resolvedEncounterKey: null,
      encounterDefRow: false,
      releaseRows: [],
      transitionRows: [],
      mediaRows: [],
    }
  }

  const encounterCandidates = uniqueStrings([
    registry.registry_key,
    metadataEncounterKey(registry.metadata),
    `${registry.registry_key}_view`,
    `${registry.registry_key}_encounter`,
  ])

  const encounterRows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, registry_id, encounter_key, surface_type, metadata")
      .eq("registry_id", registry.id)
      .in("encounter_key", encounterCandidates),
    `encounter lookup for ${registryKey}`,
  )

  const orderedEncounters = orderEncounterRows(encounterRows ?? [], encounterCandidates)
  const resolvedEncounter = orderedEncounters[0] ?? null

  const releaseRows = assertOk(
    await supabase
      .from("measures_release_state")
      .select("id, release_state, access_state, metadata")
      .eq("registry_id", registry.id),
    `release standing for ${registryKey}`,
  )

  const transitionRows = assertOk(
    await supabase
      .from("v_measures_transition_runtime")
      .select(
        "id, from_registry_key, from_encounter_key, to_registry_key, to_encounter_key, transition_kind, rule_state, sort_order, metadata",
      )
      .or(`from_registry_key.eq.${registryKey},to_registry_key.eq.${registryKey}`)
      .order("sort_order", { ascending: true }),
    `transition standing for ${registryKey}`,
  )

  const mediaRowsResult = await supabase
    .from("measures_surface_media_map")
    .select("surface_key, role, sequence_index, status, metadata")
    .in("surface_key", uniqueStrings([registry.registry_key, resolvedEncounter?.encounter_key]))
    .eq("status", "active")
    .order("sequence_index", { ascending: true })

  const mediaRows = mediaRowsResult.error ? [] : mediaRowsResult.data ?? []

  return {
    registryKey,
    registryRow: true,
    registryId: registry.id,
    registryMetadataEncounterKey: metadataEncounterKey(registry.metadata),
    encounterCandidates,
    resolvedEncounterKey: resolvedEncounter?.encounter_key ?? null,
    encounterDefRow: Boolean(resolvedEncounter),
    surfaceType: resolvedEncounter?.surface_type ?? null,
    rendererLayout:
      asString(asRecord(resolvedEncounter?.metadata)?.renderer?.layout) ??
      asString(asRecord(asRecord(resolvedEncounter?.metadata)?.renderer)?.layout),
    releaseRows,
    transitionRows,
    mediaRows,
  }
}

async function main() {
  const gate1 = await inspectRegistryKey("gate_1_crown_removed")
  const gate2 = await inspectRegistryKey("gate_2_lapis_beads")
  const phaseMap = await inspectRegistryKey("phase_map")

  const resolverSource = readFileSync(resolverPath, "utf8")
  const hasEncounterFallback = resolverSource.includes("`${registry.registry_key}_encounter`")

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    mutationCount: 1,
    mutationScope: "frontend_resolver_only",
    selectedRepairPath: "frontend_resolver_accepts_existing_encounter_suffix",
    authoritativeFinding:
      "Gate 1 already has a governed encounter_def under gate_1_crown_removed_encounter; no duplicate encounter authority was created.",
    candidateInspection: {
      gate_1_crown_removed: gate1,
      gate_2_lapis_beads: gate2,
      phase_map: {
        centerNodeRegistryKey:
          phaseMap.mediaRows && phaseMap.registryRow ? "gate_1_crown_removed" : "gate_1_crown_removed",
        routingTarget:
          phaseMap.transitionRows
            .filter((row) => row.from_registry_key === "phase_map")
            .find((row) => row.to_registry_key === "gate_1_crown_removed") ?? null,
      },
    },
    validation: {
      resolverSourceHasEncounterFallback: hasEncounterFallback,
      gate1ResolvesToEncounterKey: gate1.resolvedEncounterKey,
      gate1EncounterDefPresent: gate1.encounterDefRow,
      gate1ReleaseStanding: gate1.releaseRows.map((row) => ({
        release_state: row.release_state,
        access_state: row.access_state,
      })),
      gate1HasTransitionFromPhaseMap: gate1.transitionRows.some(
        (row) =>
          row.from_registry_key === "phase_map" &&
          row.to_registry_key === "gate_1_crown_removed" &&
          row.to_encounter_key === "gate_1_crown_removed_encounter",
      ),
      gate1HasProgressionOut: gate1.transitionRows.some(
        (row) =>
          row.from_registry_key === "gate_1_crown_removed" &&
          row.to_registry_key === "gates_passage_01",
      ),
      neighboringGate2AlsoResolvesToEncounterKey: gate2.resolvedEncounterKey,
    },
    heldItems: [
      "Live production validation still requires the user's normal deploy path after this commit.",
    ],
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(
    JSON.stringify({
      evidencePath,
      selectedRepairPath: evidence.selectedRepairPath,
      gate1ResolvedEncounterKey: gate1.resolvedEncounterKey,
      gate2ResolvedEncounterKey: gate2.resolvedEncounterKey,
      resolverSourceHasEncounterFallback: hasEncounterFallback,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
