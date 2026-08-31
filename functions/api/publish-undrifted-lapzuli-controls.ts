type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN?: string
  LAPZULI_DISTRIBUTION_WORKER_URL?: string
}

type RegistryRow = {
  registry_key: string
  display_title: string | null
  release_state: string | null
  access_state: string | null
  is_active: boolean
  metadata: Record<string, unknown> | null
}

type ProcessRow = {
  process_key: string
  status: string | null
  process_status: string | null
  authority_state: string | null
  metadata: Record<string, unknown> | null
}

type DispatchRow = {
  dispatch_key: string
  publication_key: string
  title: string
  internal_route: string | null
  external_url: string | null
  status: string
  published_at: string | null
  metadata: Record<string, unknown> | null
}

type ObjectProfileRow = {
  publication_object_key: string
  desk_key: string | null
  researched_and_cited: boolean | null
  citations_verified: boolean | null
  standing: string | null
  provenance: Record<string, unknown> | null
}

type OutletRow = {
  outlet_key: string
  outlet_name: string | null
  outlet_class: string | null
  base_url: string | null
  qualification_state: string | null
  account_standing: string | null
  metadata: Record<string, unknown> | null
}

type QualificationRow = {
  outlet_key: string
  desk_key: string | null
  distribution_mode: string | null
  standing: string | null
  fit_score: number | null
  operator_disposition_required: boolean | null
  provenance_constraints: unknown
  evidence: unknown
}

type RouteRow = {
  route_key: string
  publication_object_key: string | null
  desk_key: string | null
  outlet_key: string | null
  distribution_mode: string | null
  route_status: string | null
  authority_reference: string | null
  operator_confirmed: boolean | null
  canonical_url: string | null
  payload_reference: string | null
  metadata: Record<string, unknown> | null
}

type ExecutionRow = {
  distribution_asset_id: string
  executor_key: string | null
  channel_key: string | null
  execution_status: string | null
  platform_post_id: string | null
  platform_url: string | null
  evidence: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
}

const STATION_SOURCE_MAP = [
  {
    station_key: "desks",
    station_label: "DESKS",
    authoritative_source: "measures_publication_dispatch + lapzuli_object_profile",
    mutation_authority: "none",
  },
  {
    station_key: "pubpac",
    station_label: "PUBPAC",
    authoritative_source: "published measures_publication_dispatch rows and object custody metadata",
    mutation_authority: "none",
  },
  {
    station_key: "publication",
    station_label: "PUBLICATION",
    authoritative_source: "env.role_call, persistence, and /api/publish-undrifted-proof",
    mutation_authority: "passage open only",
  },
  {
    station_key: "social",
    station_label: "SOCIAL",
    authoritative_source: "lapzuli_outlet_qualification, lapzuli_route, measures_distribution_execution",
    mutation_authority: "held until qualified route and operator confirmation",
  },
  {
    station_key: "audience",
    station_label: "AUDIENCE",
    authoritative_source: "existing outlet/account standing and registered capture surfaces",
    mutation_authority: "none",
  },
  {
    station_key: "campaigns",
    station_label: "CAMPAIGNS",
    authoritative_source: "registered process and route standing only",
    mutation_authority: "none",
  },
]

const SOURCE_OAR2_PATH =
  "CanCom/codex/oar2_implement_lapis_publication_chamber_operator_environment_codex_005"
const EXPECTED_OAR1_PATH =
  "G:/My Drive/CanCom/cancom/oar1_implement_lapis_publication_chamber_operator_environment_codex_005.meta.md"
const SOURCE_OAR2_005_PATH =
  "CanCom/codex/oar2_implement_lapis_publication_chamber_operator_environment_codex_005"
const SOURCE_CHAMBER_ASSET_SHA256 =
  "64EC28A4BA640D1181D85780C40D4BB9D8373868D21B82CDB2D037505E683FC2"
const CHAMBER_SOURCE_PATH = "lapis_antechamber_ops_surface.webp"
const CHAMBER_DERIVATIVE_PATH =
  "undrifted/publication-chamber/lapis_antechamber_ops_surface_web_v1.webp"
const DEFAULT_DIZZY_URL = "https://lapzuli-distribution-worker.c3field.workers.dev"

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), { status, headers: jsonHeaders })
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function standingOf(row: ProcessRow | null) {
  return row?.status ?? row?.process_status ?? row?.authority_state ?? null
}

function check(condition: boolean, key: string, detail: Record<string, unknown>) {
  return { key, standing: condition ? "satisfied" : "held", detail }
}

async function supabaseFetch<T>(env: Env, path: string, init: RequestInit = {}): Promise<T> {
  const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase server credentials are not configured")

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Supabase request failed: ${response.status}`)
  }

  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

async function loadRegistry(env: Env, key: string) {
  const rows = await supabaseFetch<RegistryRow[]>(
    env,
    `measures_registry?registry_key=eq.${encodeURIComponent(key)}&select=registry_key,display_title,release_state,access_state,is_active,metadata&limit=1`,
  )
  return rows[0] ?? null
}

async function loadProcess(env: Env, key: string) {
  const rows = await supabaseFetch<ProcessRow[]>(
    env,
    `system_process_registry?process_key=eq.${encodeURIComponent(key)}&select=process_key,status,process_status,authority_state,metadata&limit=1`,
  )
  return rows[0] ?? null
}

async function loadEligibleObjects(env: Env) {
  const rows = await supabaseFetch<DispatchRow[]>(
    env,
    "measures_publication_dispatch?publication_key=eq.undrifted&status=eq.published&select=dispatch_key,publication_key,title,internal_route,external_url,status,published_at,metadata&order=published_at.desc.nullslast&limit=20",
  )

  return rows.filter((row) => {
    const metadata = row.metadata ?? {}
    return (
      asString(metadata.series_key) === "drift_report" &&
      Boolean(asString(metadata.source_sha256)) &&
      Boolean(asString(metadata.source_drive_id)) &&
      Boolean(row.internal_route?.startsWith("/undrifted/"))
    )
  })
}

function objectKeyFromDispatch(dispatch: DispatchRow | null) {
  if (!dispatch) return null
  const metadataKey = asString(dispatch.metadata?.lapzuli_publication_object_key)
  if (metadataKey) return metadataKey
  const number = dispatch.dispatch_key.match(/(?:^|_)0*(\d{3})(?:_|$)/)?.[1]
  return number ? `undrifted_drift_report_${number}` : dispatch.dispatch_key
}

async function loadObjectProfile(env: Env, objectKey: string | null) {
  if (!objectKey) return null
  const rows = await supabaseFetch<ObjectProfileRow[]>(
    env,
    `lapzuli_object_profile?publication_object_key=eq.${encodeURIComponent(objectKey)}&select=publication_object_key,desk_key,researched_and_cited,citations_verified,standing,provenance&limit=1`,
  )
  return rows[0] ?? null
}

async function loadDestinations(env: Env, deskKey: string | null) {
  const [qualifications, outlets] = await Promise.all([
    supabaseFetch<QualificationRow[]>(
      env,
      "lapzuli_outlet_qualification?select=outlet_key,desk_key,distribution_mode,standing,fit_score,operator_disposition_required,provenance_constraints,evidence&order=fit_score.desc.nullslast&limit=50",
    ),
    supabaseFetch<OutletRow[]>(
      env,
      "lapzuli_outlet?select=outlet_key,outlet_name,outlet_class,base_url,qualification_state,account_standing,metadata&limit=100",
    ),
  ])
  const outletMap = new Map(outlets.map((outlet) => [outlet.outlet_key, outlet]))

  return qualifications
    .filter((row) => {
      return !deskKey || !row.desk_key || row.desk_key === deskKey
    })
    .map((row) => {
      const outlet = outletMap.get(row.outlet_key)
      return {
        qualification_key: `${row.outlet_key}_${row.desk_key ?? "desk"}`,
        outlet_key: row.outlet_key,
        display_name: outlet?.outlet_name ?? row.outlet_key,
        outlet_type: outlet?.outlet_class ?? null,
        domain: outlet?.base_url ?? null,
        outlet_standing: outlet?.qualification_state ?? null,
        account_state: outlet?.account_standing ?? null,
        object_type: row.desk_key,
        route_type: row.distribution_mode,
        qualification_standing: row.standing,
        authorization_state: row.operator_disposition_required ? "operator_disposition_required" : "qualification_only",
        fit_score: asNumber(row.fit_score),
        constraints: row.provenance_constraints,
        required_evidence: row.evidence,
      }
    })
}

async function loadRoutes(env: Env, objectKey: string | null) {
  if (!objectKey) return []
  return supabaseFetch<RouteRow[]>(
    env,
    `lapzuli_route?publication_object_key=eq.${encodeURIComponent(objectKey)}&select=route_key,publication_object_key,desk_key,outlet_key,distribution_mode,route_status,authority_reference,operator_confirmed,canonical_url,payload_reference,metadata&limit=50`,
  )
}

async function loadExecutions(env: Env, dispatchKey: string | null) {
  if (!dispatchKey) return []
  return supabaseFetch<ExecutionRow[]>(
    env,
    `measures_distribution_execution?distribution_asset_id=eq.${encodeURIComponent(dispatchKey)}&select=distribution_asset_id,executor_key,channel_key,execution_status,platform_post_id,platform_url,evidence,metadata&limit=50`,
  )
}

async function proveDizzy(env: Env) {
  const token = env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN
  if (!token) {
    return {
      ok: false,
      standing: "held_credentials",
      worker_identity: null,
      external_publication_effects: 0,
    }
  }

  const baseUrl = (env.LAPZULI_DISTRIBUTION_WORKER_URL ?? DEFAULT_DIZZY_URL).replace(/\/$/, "")
  const response = await fetch(`${baseUrl}/role-call/proof`, {
    headers: { authorization: `Bearer ${token}` },
  })
  const body = await response.json().catch(() => ({}))
  return {
    ok: response.ok && body?.ok === true,
    standing: response.ok ? body?.standing ?? "role_call_proven" : "held_dizzy_role_call",
    worker_identity: body?.worker_identity ?? null,
    role_identity: body?.role_identity ?? null,
    process: body?.process ?? null,
    relation: body?.relation ?? null,
    operator_confirmation_required: body?.operator_confirmation_required ?? true,
    autonomous_distribution_authority: body?.autonomous_distribution_authority ?? "none",
    external_publication_effects: body?.external_publication_effects ?? 0,
  }
}

function buildLapzuliStanding(args: {
  objectProfile: ObjectProfileRow | null
  destinations: Awaited<ReturnType<typeof loadDestinations>>
  routes: RouteRow[]
  executions: ExecutionRow[]
}) {
  const alreadyDistributed = args.executions.find((row) => row.platform_post_id || row.platform_url)
  if (alreadyDistributed) {
    return {
      route_standing: "already_distributed",
      controls_enabled: false,
      external_identity: alreadyDistributed.platform_post_id ?? null,
      external_url: alreadyDistributed.platform_url ?? null,
      dispatch_now: "already_distributed",
      schedule: "already_distributed",
    }
  }

  const activeRoute = args.routes.find((row) =>
    ["ready", "scheduled", "dispatching", "accepted"].includes(row.route_status ?? ""),
  )
  if (!args.objectProfile) {
    return {
      route_standing: "held_binding",
      controls_enabled: false,
      dispatch_now: "held_binding",
      schedule: "held_binding",
    }
  }
  if (!activeRoute) {
    return {
      route_standing: args.destinations.length > 0 ? "qualification_required" : "held_authority",
      controls_enabled: false,
      dispatch_now: "held_route_required",
      schedule: "held_route_required",
    }
  }
  if (activeRoute.metadata?.external_identity || activeRoute.canonical_url) {
    return {
      route_standing: "already_distributed",
      controls_enabled: false,
      external_identity: activeRoute.metadata?.external_identity,
      external_url: activeRoute.canonical_url,
      dispatch_now: "already_distributed",
      schedule: "already_distributed",
    }
  }
  if (activeRoute.operator_confirmed !== true || !activeRoute.authority_reference) {
    return {
      route_standing: "held_authority",
      controls_enabled: false,
      route_key: activeRoute.route_key,
      dispatch_now: "held_operator_confirmation_required",
      schedule: "held_operator_confirmation_required",
    }
  }
  return {
    route_standing: activeRoute.route_status ?? "ready",
    controls_enabled: true,
    route_key: activeRoute.route_key,
    outlet_key: activeRoute.outlet_key,
    dispatch_now: "ready",
    schedule: "ready",
  }
}

async function loadControls(env: Env) {
  const [
    envRoleCall,
    persistence,
    undrifted,
    publishBinding,
    persistenceBinding,
    lapzuliProcess,
    schedulerProcess,
    eligibleObjects,
    dizzyProof,
  ] = await Promise.all([
    loadRegistry(env, "env.role_call"),
    loadRegistry(env, "persistence"),
    loadRegistry(env, "undrifted"),
    loadProcess(env, "env_role_call_publish_undrifted_binding_v1"),
    loadProcess(env, "env_role_call_persistence_binding_v1"),
    loadProcess(env, "dizzy_lapzuli_distribution_worker_v1"),
    loadProcess(env, "dizzy_worker_scheduler_integration_v1"),
    loadEligibleObjects(env),
    proveDizzy(env),
  ])

  const selectedObject = eligibleObjects[0] ?? null
  const objectKey = objectKeyFromDispatch(selectedObject)
  const objectProfile = await loadObjectProfile(env, objectKey)
  const [destinations, routes, executions] = await Promise.all([
    loadDestinations(env, objectProfile?.desk_key ?? asString(selectedObject?.metadata?.series_key)),
    loadRoutes(env, objectKey),
    loadExecutions(env, selectedObject?.dispatch_key ?? null),
  ])
  const lapzuliStanding = buildLapzuliStanding({ objectProfile, destinations, routes, executions })

  const preflight = [
    check(Boolean(envRoleCall?.is_active), "env_role_call_registered", {
      registry_key: envRoleCall?.registry_key ?? null,
      release_state: envRoleCall?.release_state ?? null,
    }),
    check(Boolean(persistence?.is_active), "persistence_registered", {
      registry_key: persistence?.registry_key ?? null,
      release_state: persistence?.release_state ?? null,
    }),
    check(Boolean(undrifted?.is_active), "undrifted_registered", {
      registry_key: undrifted?.registry_key ?? null,
      release_state: undrifted?.release_state ?? null,
      access_state: undrifted?.access_state ?? null,
    }),
    check(standingOf(publishBinding) === "active", "publish_undrifted_binding_active", {
      process_key: publishBinding?.process_key ?? null,
      passage_surface: publishBinding?.metadata?.passage_surface ?? null,
      resulting_encounter: publishBinding?.metadata?.resulting_encounter ?? null,
    }),
    check(standingOf(persistenceBinding) === "active", "persistence_binding_active", {
      process_key: persistenceBinding?.process_key ?? null,
      call_relation: persistenceBinding?.metadata?.call_relation ?? null,
    }),
    check(Boolean(selectedObject), "eligible_governed_publication_object_recovered", {
      dispatch_key: selectedObject?.dispatch_key ?? null,
      title: selectedObject?.title ?? null,
      source_sha256: selectedObject?.metadata?.source_sha256 ?? null,
      source_drive_id: selectedObject?.metadata?.source_drive_id ?? null,
    }),
    check(Boolean(objectProfile), "lapzuli_object_profile_recovered", {
      object_key: objectProfile?.publication_object_key ?? objectKey,
      standing: objectProfile?.standing ?? null,
      citation_standing: objectProfile?.citations_verified === true ? "verified" : "unverified",
    }),
    check(standingOf(lapzuliProcess) === "active", "dizzy_worker_binding_active", {
      process_key: lapzuliProcess?.process_key ?? null,
      authority_state: lapzuliProcess?.authority_state ?? null,
    }),
    check(standingOf(schedulerProcess) === "active", "dizzy_scheduler_binding_active", {
      process_key: schedulerProcess?.process_key ?? null,
      authority_state: schedulerProcess?.authority_state ?? null,
    }),
    check(dizzyProof.ok === true, "dizzy_role_call_proven", {
      standing: dizzyProof.standing,
      worker_identity: dizzyProof.worker_identity,
      role_identity: dizzyProof.role_identity,
      external_publication_effects: dizzyProof.external_publication_effects,
    }),
  ]

  const held = preflight.find((item) => item.standing === "held")

  return {
    final_standing: held ? "held_preflight_failed" : "implemented_publish_undrifted_lapzuli_human_compute_controls_proven",
    held_check: held?.key ?? null,
    source_oar2_path: SOURCE_OAR2_PATH,
    expected_oar1_path: EXPECTED_OAR1_PATH,
    mutation_authority: "website_controls_and_registry_record_only",
    external_publication_effects: 0,
    chamber_environment: {
      source_oar2_path: SOURCE_OAR2_005_PATH,
      source_storage_bucket: "measures-registry",
      source_storage_path: CHAMBER_SOURCE_PATH,
      source_sha256: SOURCE_CHAMBER_ASSET_SHA256,
      derivative_storage_bucket: "measures-registry",
      derivative_storage_path: CHAMBER_DERIVATIVE_PATH,
      derivative_sha256: SOURCE_CHAMBER_ASSET_SHA256,
      custody_standing: "chamber_held_governed_source_with_registered_live_derivative",
      media_role: "lapis_publication_chamber_operator_environment",
    },
    stations: STATION_SOURCE_MAP,
    passage: {
      publication_object: selectedObject,
      object_key: objectKey,
      passage_surface: "/publish-undrifted",
      resulting_encounter: "/undrifted",
      recovery_path: "Environment -> env.role_call -> Persistence -> governed publication object",
      preflight,
    },
    lapzuli_distribution: {
      process_key: "lapzuli_distribution",
      worker_process_key: "dizzy_lapzuli_distribution_worker_v1",
      scheduler_process_key: "dizzy_worker_scheduler_integration_v1",
      ...lapzuliStanding,
      routes,
      executions,
    },
    controls: {
      select_object: eligibleObjects.map((row) => ({
        dispatch_key: row.dispatch_key,
        title: row.title,
        internal_route: row.internal_route,
        source_sha256: row.metadata?.source_sha256 ?? null,
        source_drive_id: row.metadata?.source_drive_id ?? null,
      })),
      recover: "satisfied",
      preflight: held ? "held" : "satisfied",
      open_passage: held ? "held" : "satisfied",
      dispatch_now: lapzuliStanding.dispatch_now,
      schedule: lapzuliStanding.schedule,
    },
    destinations,
    dizzy: dizzyProof,
  }
}

async function handleAction(request: Request, env: Env) {
  const body = await request.json().catch(() => ({})) as { action?: string }
  const state = await loadControls(env)
  const action = body.action === "schedule" ? "schedule" : "dispatch_now"

  if (state.final_standing !== "implemented_publish_undrifted_lapzuli_human_compute_controls_proven") {
    return jsonResponse({
      ...state,
      action_result: {
        action,
        standing: state.held_check ?? "held_preflight_failed",
        mutation_count: 0,
        external_publication_effects: 0,
      },
    }, 409)
  }

  if (!state.lapzuli_distribution.controls_enabled) {
    return jsonResponse({
      ...state,
      action_result: {
        action,
        standing: state.lapzuli_distribution[action],
        mutation_count: 0,
        external_publication_effects: 0,
      },
    }, 409)
  }

  return jsonResponse({
    ...state,
    action_result: {
      action,
      standing: "held_operator_confirmation_required",
      mutation_count: 0,
      external_publication_effects: 0,
      next_action: "Operator-confirmed route handoff to existing Lapzuli/Dizzy path required.",
    },
  }, 409)
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const state = await loadControls(env)
    return jsonResponse(state, state.final_standing === "held_preflight_failed" ? 409 : 200)
  } catch (error) {
    return jsonResponse({
      final_standing: "held_runtime_error",
      error: error instanceof Error ? error.message : "publish-undrifted Lapzuli controls failed",
      external_publication_effects: 0,
    }, 500)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    return await handleAction(request, env)
  } catch (error) {
    return jsonResponse({
      final_standing: "held_runtime_error",
      error: error instanceof Error ? error.message : "publish-undrifted Lapzuli action failed",
      action_result: {
        standing: "held_runtime_error",
        mutation_count: 0,
        external_publication_effects: 0,
      },
    }, 500)
  }
}

export const onRequest = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
