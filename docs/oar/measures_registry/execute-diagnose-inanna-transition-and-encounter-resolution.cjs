require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const serviceUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!serviceUrl || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const service = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const evidencePath =
  "docs/oar/measures_registry/diagnose_inanna_transition_and_encounter_resolution_v1.json"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null
}

function asString(value) {
  return typeof value === "string" ? value : null
}

function asBoolean(value) {
  return typeof value === "boolean" ? value : null
}

function asNumber(value) {
  return typeof value === "number" ? value : null
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]
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

async function livePublicClient() {
  const html = await fetch("https://www.measuresofinanna.com/").then((response) => response.text())
  const assetPath = (html.match(/assets\/[^"' ]+\.js/) || [])[0]
  if (!assetPath) throw new Error("live Inanna asset path not found")
  const js = await fetch(`https://www.measuresofinanna.com/${assetPath}`).then((response) =>
    response.text(),
  )
  const publicUrl = (js.match(/https:\/\/[a-z0-9]+\.supabase\.co/) || [])[0]
  const publicKey = (js.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0]
  if (!publicUrl || !publicKey) throw new Error("live public supabase config not found")

  return {
    assetPath,
    client: createClient(publicUrl, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { apikey: publicKey } },
    }),
  }
}

async function resolveEncounterRow(client, inputKey) {
  const registryResult = await client
    .from("measures_registry")
    .select("id, registry_key, metadata")
    .eq("registry_key", inputKey)
    .maybeSingle()

  if (registryResult.error) {
    return { requestKey: inputKey, failureClass: "missing registry row", error: registryResult.error.message }
  }

  if (registryResult.data) {
    const registry = registryResult.data
    const encounterKeys = uniqueStrings([
      registry.registry_key,
      metadataEncounterKey(registry.metadata),
      `${registry.registry_key}_view`,
    ])

    const encounterRows = await client
      .from("measures_encounter_def")
      .select(
        `
        id,
        registry_id,
        encounter_key,
        surface_type,
        metadata,
        measures_registry (
          registry_key
        )
      `,
      )
      .eq("registry_id", registry.id)
      .in("encounter_key", encounterKeys)

    if (encounterRows.error) {
      return {
        requestKey: inputKey,
        registry,
        failureClass: "missing encounter_def",
        error: encounterRows.error.message,
      }
    }

    const encounter = orderEncounterRows(encounterRows.data ?? [], encounterKeys)[0] ?? null
    if (!encounter) {
      return {
        requestKey: inputKey,
        registry,
        failureClass: "missing encounter_def",
        error: `No encounter_def for ${inputKey}`,
      }
    }

    return {
      requestKey: inputKey,
      registry,
      encounter,
      failureClass: null,
      error: null,
    }
  }

  const legacyResult = await client
    .from("measures_encounter_def")
    .select(
      `
      id,
      registry_id,
      encounter_key,
      surface_type,
      metadata,
      measures_registry (
        registry_key
      )
    `,
    )
    .eq("encounter_key", inputKey)
    .maybeSingle()

  if (legacyResult.error || !legacyResult.data) {
    return {
      requestKey: inputKey,
      failureClass: "wrong registry key requested",
      error: legacyResult.error?.message ?? `No registry row or encounter_def for ${inputKey}`,
    }
  }

  return {
    requestKey: inputKey,
    registry: null,
    encounter: legacyResult.data,
    failureClass: null,
    error: null,
  }
}

function resolveActions(metadata) {
  const record = asRecord(metadata) ?? {}
  const resolution = asRecord(record.resolution)
  const actions = [
    ...(Array.isArray(record.actions) ? record.actions : []),
    ...(Array.isArray(resolution?.actions) ? resolution.actions : []),
  ]

  const resolved = actions.flatMap((value, index) => {
    const action = asRecord(value)
    if (!action) return []
    return {
      id:
        asString(action.id) ??
        asString(action.target_registry_key) ??
        asString(action.targetRegistryKey) ??
        `action-${index}`,
      label: asString(action.label) ?? "",
      kind: asString(action.kind) ?? "navigate",
      targetRegistryKey:
        asString(action.targetRegistryKey) ??
        asString(action.target_registry_key) ??
        asString(action.to_registry) ??
        asString(action.to_encounter),
      targetEncounterKey:
        asString(action.targetEncounterKey) ?? asString(action.target_encounter_key),
      targetAfterPassage:
        asString(action.targetAfterPassage) ?? asString(action.target_after_passage),
      blocked: asBoolean(action.blocked) ?? false,
      sortOrder: asNumber(action.sortOrder) ?? asNumber(action.sort_order),
      metadata: action,
    }
  })

  const deduped = new Map()
  for (const action of resolved) {
    if (!deduped.has(action.id)) deduped.set(action.id, action)
  }

  return [...deduped.values()].sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
}

function resolveTransitionActions(rows) {
  return rows
    .filter((row) => row.rule_state === "active")
    .map((row) => {
      const metadata = asRecord(row.metadata) ?? {}
      const action = asRecord(metadata.action) ?? {}
      return {
        id: asString(action.id) ?? row.id,
        label: asString(action.label) ?? row.to_encounter_title ?? "",
        kind: asString(action.kind) ?? row.transition_kind,
        targetRegistryKey: row.to_registry_key,
        targetEncounterKey: row.to_encounter_key,
        targetAfterPassage:
          asString(metadata.targetAfterPassage) ??
          asString(metadata.target_after_passage) ??
          asString(action.targetAfterPassage) ??
          asString(action.target_after_passage),
        blocked: false,
        sortOrder: row.sort_order,
        metadata,
      }
    })
    .sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
}

async function releaseStandingFor(serviceClient, registryId) {
  const guesses = ["measures_release_state", "measures_access_state"]
  const output = {}
  for (const table of guesses) {
    const result = await serviceClient.from(table).select("*").eq("registry_id", registryId)
    output[table] = result.error ? { error: result.error.message } : { rows: result.data ?? [] }
  }
  return output
}

function summarizeRenderer(metadata) {
  const renderer = asRecord(asRecord(metadata)?.renderer)
  if (!renderer) return null
  return {
    layout: asString(renderer.layout),
    media_fit: asString(renderer.media_fit),
    show_action_rail: renderer.show_action_rail ?? renderer.showActionRail ?? null,
  }
}

function phaseMapCenterTarget(phaseMap, viewedRegistryKeys = []) {
  if (!phaseMap) {
    return {
      centerNodeKey: null,
      cadenceTarget: null,
      routeMode: null,
    }
  }

  const routing = asRecord(phaseMap.routing) ?? {}
  const nodeRouting = asRecord(routing.nodes) ?? {}
  const nodeStates = asRecord(phaseMap.node_states) ?? {}
  const nodeStateOverrides = asRecord(phaseMap.node_state_overrides) ?? {}
  const viewed = new Set([...(Array.isArray(phaseMap.viewed_registry_keys) ? phaseMap.viewed_registry_keys : []), ...viewedRegistryKeys])
  const nodes = Array.isArray(phaseMap.nodes) ? phaseMap.nodes : []
  const cadenceSequence = Array.isArray(asRecord(phaseMap.cadence)?.sequence)
    ? asRecord(phaseMap.cadence).sequence
    : []
  const centerNode = asRecord(phaseMap.center_node)
  const centerNodeKey = asString(centerNode?.registry_key) ?? asString(centerNode?.registryKey) ?? null
  const onOpenNode = asString(routing.on_open_node)

  function findNode(key) {
    return nodes.find((node) => {
      const record = asRecord(node) ?? {}
      return asString(record.registry_key) === key || asString(record.registryKey) === key
    }) ?? null
  }

  function isOpenForCadence(key) {
    const node = asRecord(findNode(key)) ?? {}
    const state = asRecord(nodeStates[key]) ?? {}
    const stateOverride = asString(nodeStateOverrides[key])
    const route = asRecord(nodeRouting[key]) ?? {}
    const targetRegistryKey =
      asString(route.target_registry_key) ??
      asString(route.targetRegistryKey) ??
      (onOpenNode === "navigate" ? key : null)

    if (!targetRegistryKey || stateOverride === "sealed") return false
    if (node.is_interactive === false || node.isInteractive === false) return false
    if (state.is_interactive === false) return false
    if (node.access_state === "gated" || state.access_state === "gated") return false
    if (node.release_state === "held" || state.release_state === "held") return false

    return true
  }

  const nextCadenceKey = cadenceSequence.find((key) => !viewed.has(key) && isOpenForCadence(key)) ?? null
  const cadence = asRecord(phaseMap.cadence) ?? {}
  const cadenceTarget =
    nextCadenceKey ??
    asString(cadence.complete_target_registry_key) ??
    asString(cadence.completeTargetRegistryKey) ??
    centerNodeKey

  return {
    centerNodeKey,
    cadenceTarget,
    routeMode: onOpenNode,
  }
}

async function traceKey(publicClient, serviceClient, requestedKey, viewedRegistryKeys = []) {
  const resolved = await resolveEncounterRow(publicClient, requestedKey)
  if (resolved.failureClass) {
    return {
      requestedKey,
      resolvedRegistryRow: false,
      failureClass: resolved.failureClass,
      error: resolved.error,
      finalRenderDecision: "unresolved",
    }
  }

  const registry = resolved.registry
  const encounter = resolved.encounter
  const registryKey =
    registry?.registry_key ??
    (Array.isArray(encounter.measures_registry)
      ? encounter.measures_registry[0]?.registry_key ?? requestedKey
      : encounter.measures_registry?.registry_key ?? requestedKey)

  const transitionRows = assertOk(
    await publicClient
      .from("v_measures_transition_runtime")
      .select(
        `
        id,
        transition_kind,
        rule_state,
        sort_order,
        metadata,
        to_registry_key,
        to_encounter_key,
        to_encounter_title
      `,
      )
      .eq("from_registry_id", encounter.registry_id)
      .eq("from_encounter_id", encounter.id)
      .eq("rule_state", "active")
      .order("sort_order", { ascending: true }),
    `transition runtime trace for ${requestedKey}`,
  )

  const metadataActions = resolveActions(encounter.metadata)
  const transitionActions = resolveTransitionActions(transitionRows)
  const actions = metadataActions.length > 0 ? metadataActions : transitionActions
  const phaseMap = asRecord(encounter.metadata)?.phase_map ?? null
  const center = phaseMapCenterTarget(phaseMap, viewedRegistryKeys)

  const releaseStanding = registry?.id ? await releaseStandingFor(serviceClient, registry.id) : {}

  return {
    requestedKey,
    resolvedRegistryRow: Boolean(registry),
    registryId: registry?.id ?? encounter.registry_id ?? null,
    registryKey,
    parentRelation: asString(asRecord(registry?.metadata)?.parent_registry_key) ?? null,
    family: asString(asRecord(registry?.metadata)?.family) ?? null,
    surfaceType: encounter.surface_type,
    encounterKey: encounter.encounter_key,
    encounterDefRow: true,
    renderer: summarizeRenderer(encounter.metadata),
    releaseAccessStanding: releaseStanding,
    transitionSourceTargetRules: transitionRows.map((row) => ({
      id: row.id,
      transition_kind: row.transition_kind,
      sort_order: row.sort_order,
      to_registry_key: row.to_registry_key,
      to_encounter_key: row.to_encounter_key,
      metadata: row.metadata,
    })),
    actions,
    phaseMapCenter: center,
    finalRenderDecision: summarizeRenderer(encounter.metadata)?.layout ?? encounter.surface_type,
    failureClass: null,
    error: null,
  }
}

async function main() {
  const live = await livePublicClient()
  const publicClient = live.client

  const traced = {}
  const pathKeys = [
    "epigraph",
    "crystal_temple_home",
    "temple_antechamber",
    "temple_harrumuk_passage",
    "phase_map",
  ]

  for (const key of pathKeys) {
    traced[key] = await traceKey(publicClient, service, key, ["epigraph", "crystal_temple_home", "temple_antechamber", "temple_harrumuk_passage", "phase_map"])
  }

  const actualFailingRequestedKeys = []

  const crystalTemplePrimaryAction =
    traced.crystal_temple_home.actions?.find((action) => action.targetRegistryKey) ?? null
  if (crystalTemplePrimaryAction?.targetRegistryKey) {
    actualFailingRequestedKeys.push({
      source: "crystal_temple_home primary action",
      requestedKey: crystalTemplePrimaryAction.targetRegistryKey,
      trace: await traceKey(publicClient, service, crystalTemplePrimaryAction.targetRegistryKey),
    })
  }

  const antechamberPrimaryAction =
    traced.temple_antechamber.actions?.find((action) => action.targetRegistryKey) ?? null
  if (antechamberPrimaryAction?.targetRegistryKey) {
    actualFailingRequestedKeys.push({
      source: "temple_antechamber primary action",
      requestedKey: antechamberPrimaryAction.targetRegistryKey,
      trace: await traceKey(publicClient, service, antechamberPrimaryAction.targetRegistryKey),
    })
  }

  const phaseMapCenterKey = traced.phase_map.phaseMapCenter?.cadenceTarget ?? null
  let phaseMapCenterTrace = null
  if (phaseMapCenterKey) {
    phaseMapCenterTrace = await traceKey(publicClient, service, phaseMapCenterKey, [
      "epigraph",
      "crystal_temple_home",
      "temple_antechamber",
      "temple_harrumuk_passage",
      "phase_map",
    ])
    actualFailingRequestedKeys.push({
      source: "phase_map center node target",
      requestedKey: phaseMapCenterKey,
      trace: phaseMapCenterTrace,
    })
  }

  const failureClasses = actualFailingRequestedKeys.map((item) => ({
    source: item.source,
    requestedKey: item.requestedKey,
    failureClass: item.trace.failureClass ?? "resolves",
    encounterDefRow: item.trace.encounterDefRow ?? false,
    renderer: item.trace.renderer ?? null,
    finalRenderDecision: item.trace.finalRenderDecision ?? "unresolved",
  }))

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationCount: 0,
    mutationPerformed: false,
    liveAssetPath: live.assetPath,
    tracedExpectedPath: traced,
    actualFailingRequestedKeys,
    phaseMapCenterNode: {
      nodeIdOrRole: traced.phase_map.phaseMapCenter?.centerNodeKey ?? null,
      intendedTargetKey: traced.phase_map.phaseMapCenter?.cadenceTarget ?? null,
      actualClickedTargetKey: phaseMapCenterKey,
      targetTrace: phaseMapCenterTrace,
    },
    failureClasses,
    recommendedNextOar2:
      "Seat a bounded transition/encounter repair OAR for the specific missing or mismatched registry/encounter targets revealed here, without reopening media policy or deployment binding work.",
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(
    JSON.stringify({
      evidencePath,
      crystalTempleTarget: crystalTemplePrimaryAction?.targetRegistryKey ?? null,
      antechamberTarget: antechamberPrimaryAction?.targetRegistryKey ?? null,
      phaseMapCenterTarget: phaseMapCenterKey,
      failureClasses,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
