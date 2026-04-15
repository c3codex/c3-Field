export type MeasuresRouteTarget = {
  pathname: string
  state?: Record<string, unknown>
}

export type ContinuanceResolution = {
  is_terminal?: boolean | null
  next_registry_key?: string | null
  next_encounter_key?: string | null
  next_surface_type?: string | null
  next_material_family?: string | null
  next_chamber_key?: string | null

  current_chamber_key?: string | null
  requires_kumurrah?: boolean | null

  return_registry_key?: string | null
  return_encounter_key?: string | null
  return_surface_type?: string | null
  return_material_family?: string | null
  return_chamber_key?: string | null

  passage_registry_key?: string | null
  passage_encounter_key?: string | null
  passage_surface_type?: string | null
  passage_material_family?: string | null

  reason?: string | null
  metadata?: Record<string, unknown> | null
}

function normalizeSurfaceType(value?: string | null) {
  return (value ?? "").trim().toLowerCase()
}

function normalizeMaterial(value?: string | null) {
  return (value ?? "").trim().toLowerCase()
}

function materialBasePath(materialFamily?: string | null) {
  switch (normalizeMaterial(materialFamily)) {
    case "obsidian":
      return "/obsidian"
    case "crystal":
      return "/crystal"
    case "marble":
      return "/marble"
    case "lapis":
      return "/lapis"
    default:
      return "/encounter"
  }
}

export function resolveMeasuresRouteTarget(input: {
  encounterKey?: string | null
  surfaceType?: string | null
  materialFamily?: string | null
  registryKey?: string | null
  state?: Record<string, unknown>
}): MeasuresRouteTarget {
  const encounterKey = input.encounterKey ?? ""
  const surfaceType = normalizeSurfaceType(input.surfaceType)
  const materialFamily = normalizeMaterial(input.materialFamily)

  if (surfaceType === "phase_map") {
    return {
      pathname: "/phase-map",
      state: input.state,
    }
  }

  if (surfaceType === "passage") {
    return {
      pathname: `/passage/${encounterKey}`,
      state: input.state,
    }
  }

  if (surfaceType === "chamberplate") {
    return {
      pathname: `${materialBasePath(materialFamily)}/${encounterKey}`,
      state: input.state,
    }
  }

  if (surfaceType === "threshold") {
    return {
      pathname: `/threshold/${encounterKey}`,
      state: input.state,
    }
  }

  return {
    pathname: `/encounter/${encounterKey || input.registryKey || ""}`,
    state: input.state,
  }
}

export function resolveContinuanceTarget(
  result: ContinuanceResolution,
  context: {
    sessionKey: string
    fromRegistryKey: string
    fromEncounterKey: string
  }
): MeasuresRouteTarget | null {
  if (result.is_terminal) {
    return null
  }

  const requiresKumurrah =
    Boolean(result.requires_kumurrah) ||
    Boolean(
      result.current_chamber_key &&
        result.next_chamber_key &&
        result.current_chamber_key !== result.next_chamber_key
    )

  if (requiresKumurrah) {
    return resolveMeasuresRouteTarget({
      encounterKey: result.passage_encounter_key ?? "kumurrah_passage",
      surfaceType: result.passage_surface_type ?? "passage",
      materialFamily: result.passage_material_family ?? "lapis",
      registryKey: result.passage_registry_key ?? "kumurrah_passage",
      state: {
        sessionKey: context.sessionKey,
        continuance: {
          fromRegistryKey: context.fromRegistryKey,
          fromEncounterKey: context.fromEncounterKey,
          toRegistryKey: result.next_registry_key ?? null,
          toEncounterKey: result.next_encounter_key ?? null,
          toSurfaceType: result.next_surface_type ?? null,
          toMaterialFamily: result.next_material_family ?? null,
          toChamberKey: result.next_chamber_key ?? null,
        },
      },
    })
  }

  if (result.return_encounter_key) {
    return resolveMeasuresRouteTarget({
      encounterKey: result.return_encounter_key,
      surfaceType: result.return_surface_type ?? "passage",
      materialFamily: result.return_material_family ?? "lapis",
      registryKey: result.return_registry_key ?? undefined,
      state: {
        sessionKey: context.sessionKey,
        returnReason: result.reason ?? null,
      },
    })
  }

  if (!result.next_encounter_key) {
    return null
  }

  return resolveMeasuresRouteTarget({
    encounterKey: result.next_encounter_key,
    surfaceType: result.next_surface_type ?? "chamberplate",
    materialFamily: result.next_material_family,
    registryKey: result.next_registry_key ?? undefined,
    state: {
      sessionKey: context.sessionKey,
      arrivedFrom: {
        registryKey: context.fromRegistryKey,
        encounterKey: context.fromEncounterKey,
      },
    },
  })
}
