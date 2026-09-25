export type Row = Record<string, unknown>
export type ReadRows = (table: string, select: string, filters?: Record<string, string>) => Promise<Row[]>
const record = (x: unknown): Row => x && typeof x === "object" && !Array.isArray(x) ? x as Row : {}
const str = (x: unknown) => typeof x === "string" && x.length ? x : null
const fields = (row: Row, keys: string[]) => Object.fromEntries(keys.map(k => [k, row[k] ?? null]))
const relation = (source: string, rows: Row[], status = "unresolved_no_registered_relation") =>
  ({ source, status: rows.length ? "represented" : status, records: rows })

export async function resolveMEEnvironments(read: ReadRows, envKey?: string) {
  const environments = await read("c3_environment", "env_key,system_key,environment_name,environment_class,standing,is_active,is_canonical,source_authority_ref,metadata", envKey ? { env_key: "eq." + envKey } : { is_active: "eq.true" })
  const manifests = await Promise.all(environments.map(async e => {
    const m = record(e.metadata)
    const errors: string[] = []
    const safeRead = async (table: string, select: string, filters: Record<string,string>) => {
      try { return await read(table, select, filters) }
      catch { errors.push(table); return [] }
    }
    const [current, boundaries, canopies] = await Promise.all([
      safeRead("c3_current_state", "current_state_key,env_key,state_version,standing,effective_at,is_current,formation_authority_ref,advance_disposition_ref", {env_key:"eq."+e.env_key,is_current:"eq.true"}),
      safeRead("c3_ai_action_boundary", "boundary_key,system_key,boundary_state,boundary_scope,requires_oar,requires_operator_confirmation", {system_key:"eq."+e.system_key,is_active:"eq.true"}),
      safeRead("c3_canopy_law", "canopy_key,canopy_name,system_key,encounter_state,runtime_admission_state", {system_key:"eq."+e.system_key,is_active:"eq.true"}),
    ])
    const evidence = (await Promise.all(current.map(c => safeRead("c3_current_evidence_ref",
      "current_evidence_ref_key,current_state_key,evidence_key,evidence_class,evidence_standing,source_execution_instance_id,attested_at,content_hash",
      {current_state_key:"eq."+c.current_state_key})))).flat()
    const processRefs = [...new Set(["crs_process_key","mgs_process_key","distribution_reference_process","distribution_executor_process","reference_control_surface_process"].map(k=>str(m[k])).filter((x): x is string=>!!x))]
    const resources = (await Promise.all(processRefs.map(key => safeRead("system_process_registry","process_key,status,authority_state",{process_key:"eq."+key})))).flat()
    const parentKey = str(m.canonical_parent_environment)
    const parents = parentKey ? await safeRead("c3_environment","env_key,environment_class,standing",{env_key:"eq."+parentKey}) : []
    const c1 = e.environment_class === "c1_connect_environment"
      ? [fields(e,["env_key","environment_class","standing"])]
      : parents.filter(p=>p.environment_class === "c1_connect_environment")
    const c2 = e.environment_class === "c2_contribute_environment" ? [fields(e,["env_key","environment_class","standing"])] : []
    const unresolved = [
      ...(!c1.length ? ["c1: no explicit environment relation"] : []),
      ...(!c2.length ? ["c2: no explicit environment relation"] : []),
      ...(!boundaries.length ? ["Boundary: no rows in inspected system family"] : []),
      ...(!canopies.length ? ["Canopy: no rows in inspected system family"] : []),
      "Interoperability: callable interface binding not established",
      ...(!current.length ? ["Current: unresolved"] : []),
      ...(!evidence.length ? ["Current evidence: unresolved"] : []),
      ...processRefs.filter(k=>!resources.some(r=>r.process_key===k)).map(k=>"Registered resource unresolved: "+k),
      ...errors.map(t=>"Read unavailable: "+t),
    ]
    return {
      identity: fields(e,["env_key","environment_name","environment_class","system_key"]),
      standing:e.standing, active:e.is_active, canonical:e.is_canonical,
      formation: str(m.standing), source_authority:e.source_authority_ref,
      domain:str(m.domain),
      c1: {...relation("c3_environment / metadata.canonical_parent_environment",c1), semantics:e.environment_class==="c1_connect_environment"?"self_environment":"explicit_parent_environment"},
      c2: {...relation("c3_environment",c2), semantics:"self_environment_only; no participant or contribution relation inferred"},
      boundary:relation("c3_ai_action_boundary by system_key",boundaries),
      interoperability:relation("registered interface binding",[]),
      registered_resources:{...relation("metadata process keys -> system_process_registry",resources), invocation_authorized:false},
      canopy:relation("c3_canopy_law by system_key",canopies),
      evidence:relation("c3_current_evidence_ref by current_state_key",evidence),
      current:relation("c3_current_state (is_current=true)",current),
      holds:fields(m,["public_release_state","runtime_activation_state","participant_resolution_state","implementation_state"]),
      contribution:{result:null, independent_c2_determination:null, retained_value:null, status:"unresolved_not_proven_by_environment_formation"},
      unresolved, read_errors:errors, mutation_authority:false,
    }
  }))
  const expected = envKey ? [envKey] : ["env_c3_community_connect","env_c3_community_contribute","env_c3ops"]
  return {contract:"me_environment_manifest_v1", observed_at:new Date().toISOString(), environments:manifests,
    missing_environments:expected.filter(key=>!environments.some(e=>e.env_key===key)),
    mutation_authority:false, external_effects:0}
}
export type ManifestResponse = Awaited<ReturnType<typeof resolveMEEnvironments>>

export async function readLapzuli(read: ReadRows) {
  const [routes,evidence] = await Promise.all([
    read("lapzuli_route","route_key,publication_object_key,desk_key,outlet_key,route_status"),
    read("lapzuli_encounter_evidence","encounter_id,route_key,observed_outcome,observed_reason,external_id,external_url,observed_at"),
  ])
  return {source:"lapzuli_route -> lapzuli_encounter_evidence.route_key",routes,evidence,
    unresolved:["Lane-to-environment bindings for unDrifted, Measures Registry, and Registrar / c3 Community Partners are not established by this route/evidence projection."],
    current_status:"unresolved_without_explicit_current_relation", mutation_authority:false,external_effects:0}
}
export type LapzuliReadback = Awaited<ReturnType<typeof readLapzuli>>


export async function readC3OpsCurrentState(read: ReadRows) {
  const readProcess = (processKey: string) => read(
    "system_process_registry",
    "process_key,process_family,title,status,process_status,authority_state,authority_level,updated_at",
    {process_key:"eq."+processKey},
  )
  const [
    prism,
    lapzuli,
    opticsProcess,
    mgs,
    passage,
    chazzRoleCall,
    chazzCapability,
    current,
    opticsObservation,
  ] = await Promise.all([
    readProcess("prism_publication_operations_v1"),
    readProcess("lapzuli_distribution"),
    readProcess("c3_optics_operational_proof_output_v1"),
    readProcess("minimum_governed_standard_v1"),
    readProcess("governed_object_passage_process_v4"),
    readProcess("c3ops_role_call_computational_skills_v1"),
    readProcess("ai_execution_capability_profile_chazz_chatgpt_connected_v1"),
    read(
      "c3_current_state",
      "current_state_key,env_key,state_version,standing,effective_at,is_current,formation_authority_ref,advance_disposition_ref,source_grammar_key,created_by,created_at",
      {env_key:"eq.env_c3ops",is_current:"eq.true"},
    ),
    read(
      "c3_optics_observation",
      "observation_key,optics_key,source_registry_process_key,initiative_key,surface_key,standing,observed_at",
      {observation_key:"eq.optics432:operational_proof:c3_system_baseline_v1"},
    ),
  ])
  const component = (key: string, label: string, subtitle: string, source: string, records: Row[]) => ({
    key,label,subtitle,source,records,
    resolution: records.length ? "represented" : "DNR",
  })
  return {
    contract:"c3ops_current_state_v1",
    observed_at:new Date().toISOString(),
    components:[
      component("prism","Prism","Publication operations","system_process_registry:prism_publication_operations_v1",prism),
      component("lapzuli","Lapzuli","Distribution rail","system_process_registry:lapzuli_distribution",lapzuli),
      component("optics","Optics","Operational proof",[
        "system_process_registry:c3_optics_operational_proof_output_v1",
        "c3_optics_observation:optics432:operational_proof:c3_system_baseline_v1",
      ].join(" + "),[...opticsProcess,...opticsObservation]),
      component("c3_model","c3 Model","MGS + governed passage",[
        "system_process_registry:minimum_governed_standard_v1",
        "system_process_registry:governed_object_passage_process_v4",
      ].join(" + "),[...mgs,...passage]),
      component("current","CURRENT","c3Ops governed present state","c3_current_state:env_c3ops/is_current=true",current),
      component("chazz","Chazz","Capability + c3Ops role-call; capability is not authority",[
        "system_process_registry:c3ops_role_call_computational_skills_v1",
        "system_process_registry:ai_execution_capability_profile_chazz_chatgpt_connected_v1",
      ].join(" + "),[...chazzRoleCall,...chazzCapability]),
    ],
    standing_definitions:{
      ACT:"Accrued Current Trace",
      HLD:"Held Live Disposition",
      DNR:"Did Not Resolve",
    },
    mutation_authority:false,
    external_effects:0,
  }
}
export type C3OpsCurrentStateReadback = Awaited<ReturnType<typeof readC3OpsCurrentState>>
