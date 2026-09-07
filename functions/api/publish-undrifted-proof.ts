type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
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
  title: string | null
  process_title: string | null
  status: string | null
  process_status: string | null
  authority_state: string | null
  authority_level: string | null
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

const EXECUTION_INSTANCE_ID = "env_role_call_persistence_publish_undrifted_implementation_codex_001"
const SOURCE_OAR2_PATH = "CanCom/codex/oar2_env_role_call_persistence_publish_undrifted_implementation_codex_001"
const OAR1_RETURN_PATH =
  "G:/My Drive/CanCom/cancom/oar1_env_role_call_persistence_publish_undrifted_implementation_codex_001_resume.meta.md"

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), { status, headers: jsonHeaders })
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function standingOf(row: ProcessRow | null) {
  return row?.status ?? row?.process_status ?? row?.authority_state ?? null
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
    `system_process_registry?process_key=eq.${encodeURIComponent(key)}&select=process_key,title,process_title,status,process_status,authority_state,authority_level,metadata&limit=1`,
  )
  return rows[0] ?? null
}

async function loadProofTarget(env: Env) {
  const rows = await supabaseFetch<DispatchRow[]>(
    env,
    "measures_publication_dispatch?publication_key=eq.undrifted&status=eq.published&select=dispatch_key,publication_key,title,internal_route,external_url,status,published_at,metadata&order=published_at.desc.nullslast&limit=20",
  )
  return rows.find((row) => {
    const metadata = row.metadata ?? {}
    return (
      asString(metadata.series_key) === "drift_report" &&
      Boolean(asString(metadata.source_sha256)) &&
      Boolean(asString(metadata.source_drive_id)) &&
      Boolean(row.internal_route?.startsWith("/undrifted/"))
    )
  }) ?? null
}

function check(condition: boolean, key: string, detail: Record<string, unknown>) {
  return { key, standing: condition ? "pass" : "hold", detail }
}

function invokePersistence(args: {
  persistence: RegistryRow
  target: DispatchRow
  envRoleCall: RegistryRow
  persistenceBinding: ProcessRow
}) {
  const targetMetadata = args.target.metadata ?? {}
  const persistenceMetadata = args.persistence.metadata ?? {}
  return {
    persistence_identity: args.persistence.registry_key,
    persistence_standing: args.persistence.metadata?.registration,
    persistence_physical_component: persistenceMetadata.physical_component ?? null,
    computational_custody: persistenceMetadata.computational_custody ?? null,
    role_called: args.envRoleCall.registry_key,
    binding_process: args.persistenceBinding.process_key,
    publication_object: {
      dispatch_key: args.target.dispatch_key,
      publication_key: args.target.publication_key,
      title: args.target.title,
      internal_route: args.target.internal_route,
      external_url: args.target.external_url,
      published_at: args.target.published_at,
      status: args.target.status,
      series_key: targetMetadata.series_key,
      series_label: targetMetadata.series_label,
      publication_label: targetMetadata.publication_label,
      source_drive_id: targetMetadata.source_drive_id,
      source_sha256: targetMetadata.source_sha256,
      canonical_measures_registry_url:
        targetMetadata.canonical_measures_registry_url ?? targetMetadata.measures_registry_url ?? null,
    },
    recovered_without_chat_history: true,
    recovered_from: [
      "public.measures_registry.persistence",
      "public.measures_registry.env.role_call",
      "public.system_process_registry.env_role_call_persistence_binding_v1",
      "public.system_process_registry.env_role_call_publish_undrifted_binding_v1",
      "public.measures_publication_dispatch",
    ],
  }
}

async function recordPassageEvent(env: Env, event: {
  eventKey: string
  target: DispatchRow
  evidenceReference: string
}) {
  await supabaseFetch(env, "c3_oar_process_instance?on_conflict=process_instance_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      process_instance_key: EXECUTION_INSTANCE_ID,
      source_oar2_path: SOURCE_OAR2_PATH,
      source_oar2_standing: "confirmed",
      expected_oar1_path: OAR1_RETURN_PATH,
      actual_oar1_path: OAR1_RETURN_PATH,
      evidence_path: "/api/publish-undrifted-proof",
      lifecycle_type: "valid",
      execution_standing: "completed",
      validation_standing: "chazz_review_required",
      deploy_standing: "configured",
      held_standing: null,
      seeded_reference_standing: "seeded",
      correction_source_oar2_path: null,
      correction_oar2_path: null,
      partial_oar1_reference:
        "G:/My Drive/CanCom/cancom/oar1_env_role_call_persistence_publish_undrifted_implementation_codex_001.meta.md",
      validation_finding: "env.role_call called registered Persistence and recovered governed DR state.",
      correction_scope: null,
      execution_result:
        "publish_undrifted passage satisfied through Environment -> env.role_call -> Persistence -> governed DR state -> /publish-undrifted -> /undrifted.",
    }),
  })

  await supabaseFetch(env, "c3_oar_transition_event", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      transition_event_key: event.eventKey,
      process_instance_key: EXECUTION_INSTANCE_ID,
      actor: "measures",
      from_status: "preflight_passed",
      to_status: "passage_satisfied",
      transition_type: "execution",
      timestamp: new Date().toISOString(),
      evidence_reference: event.evidenceReference,
      notes:
        `env.role_call invoked Persistence for ${event.target.dispatch_key}; ` +
        "governed state recovered from Registry/process/dispatch rows and admitted to /undrifted encounter.",
    }),
  })
}

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  try {
    const [
      envRoleCall,
      persistence,
      undrifted,
      publishBinding,
      persistenceBinding,
      mgsBinding,
      freeBinding,
      proofTarget,
    ] = await Promise.all([
      loadRegistry(env, "env.role_call"),
      loadRegistry(env, "persistence"),
      loadRegistry(env, "undrifted"),
      loadProcess(env, "env_role_call_publish_undrifted_binding_v1"),
      loadProcess(env, "env_role_call_persistence_binding_v1"),
      loadProcess(env, "undrifted_mgs_binding_v1"),
      loadProcess(env, "aop_006_free_binding"),
      loadProofTarget(env),
    ])

    const publishMetadata = publishBinding?.metadata ?? {}
    const persistenceBindingMetadata = persistenceBinding?.metadata ?? {}

    const preflight = [
      check(Boolean(envRoleCall?.is_active && envRoleCall.registry_key === "env.role_call"), "env_role_call_registered", {
        registry_key: envRoleCall?.registry_key ?? null,
        release_state: envRoleCall?.release_state ?? null,
        access_state: envRoleCall?.access_state ?? null,
        registration: envRoleCall?.metadata?.registration ?? null,
      }),
      check(standingOf(publishBinding) === "active", "publish_undrifted_binding_active", {
        process_key: publishBinding?.process_key ?? null,
        authority_state: publishBinding?.authority_state ?? null,
        metadata_standing: publishMetadata.standing ?? null,
      }),
      check(
        asString(publishMetadata.passage_surface) === "/publish-undrifted" &&
          asString(publishMetadata.resulting_encounter) === "/undrifted",
        "passage_surface_distinction",
        {
          passage_surface: publishMetadata.passage_surface ?? null,
          resulting_encounter: publishMetadata.resulting_encounter ?? null,
        },
      ),
      check(standingOf(mgsBinding) === "active", "undrifted_mgs_binding_active", {
        process_key: mgsBinding?.process_key ?? null,
        authority_state: mgsBinding?.authority_state ?? null,
      }),
      check(standingOf(freeBinding) === "active", "aop_006_free_binding_active", {
        process_key: freeBinding?.process_key ?? null,
        authority_state: freeBinding?.authority_state ?? null,
      }),
      check(Boolean(persistence?.is_active && persistence.registry_key === "persistence"), "persistence_registered", {
        registry_key: persistence?.registry_key ?? null,
        release_state: persistence?.release_state ?? null,
        access_state: persistence?.access_state ?? null,
        registration: persistence?.metadata?.registration ?? null,
        physical_component: persistence?.metadata?.physical_component ?? null,
        computational_custody: persistence?.metadata?.computational_custody ?? null,
      }),
      check(
        standingOf(persistenceBinding) === "active" &&
          asString(persistenceBindingMetadata.call_relation) === "Environment -> env.role_call -> Persistence",
        "persistence_binding_active",
        {
          process_key: persistenceBinding?.process_key ?? null,
          authority_state: persistenceBinding?.authority_state ?? null,
          call_relation: persistenceBindingMetadata.call_relation ?? null,
        },
      ),
      check(asString(publishMetadata.persistence_binding_process) === "env_role_call_persistence_binding_v1", "publish_binding_references_persistence", {
        persistence_binding_process: publishMetadata.persistence_binding_process ?? null,
      }),
      check(Boolean(undrifted?.is_active && undrifted.registry_key === "undrifted"), "undrifted_encounter_active", {
        registry_key: undrifted?.registry_key ?? null,
        release_state: undrifted?.release_state ?? null,
        access_state: undrifted?.access_state ?? null,
      }),
      check(Boolean(proofTarget), "existing_governed_drift_report_target", {
        dispatch_key: proofTarget?.dispatch_key ?? null,
        title: proofTarget?.title ?? null,
        internal_route: proofTarget?.internal_route ?? null,
        status: proofTarget?.status ?? null,
        published_at: proofTarget?.published_at ?? null,
        source_sha256: proofTarget?.metadata?.source_sha256 ?? null,
        source_drive_id: proofTarget?.metadata?.source_drive_id ?? null,
      }),
    ]

    const held = preflight.find((item) => item.standing === "hold")
    if (held || !envRoleCall || !persistence || !persistenceBinding || !proofTarget) {
      return jsonResponse({
        final_standing: "held_preflight_failed",
        held_check: held?.key ?? "preflight_material_missing",
        preflight,
      }, 409)
    }

    const persistedState = invokePersistence({
      persistence,
      target: proofTarget,
      envRoleCall,
      persistenceBinding,
    })
    const eventKey = `publish_undrifted_${proofTarget.dispatch_key}_${crypto.randomUUID()}`
    const evidenceReference = `/publish-undrifted?event=${encodeURIComponent(eventKey)}`

    await recordPassageEvent(env, { eventKey, target: proofTarget, evidenceReference })

    return jsonResponse({
      final_standing: "implemented_and_passage_proven",
      execution_instance_id: EXECUTION_INSTANCE_ID,
      event_identity: eventKey,
      passage_surface: "/publish-undrifted",
      resulting_encounter: "/undrifted",
      role_called: "env.role_call",
      target_implication: "publish_undrifted",
      determination: "passage_satisfied",
      preflight,
      persistence_state_used: persistedState,
      next_permitted_transition: proofTarget.internal_route ?? "/undrifted",
      return_path: OAR1_RETURN_PATH,
    })
  } catch (error) {
    return jsonResponse({
      final_standing: "held_runtime_error",
      error: error instanceof Error ? error.message : "publish-undrifted proof failed",
    }, 500)
  }
}

export const onRequest = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
