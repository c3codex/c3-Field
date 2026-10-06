import {readResolvedOarOptics,OAR_OPTICS_INTERFACE} from "./c3ops-oar-optics"
import {resolveCampaignPacSpeaker} from "./campaignpac-speaker"
import {consumeLapzuliProjectionResolution,resolveCurrentOutletQualification,deriveCurrentCampaignStanding} from "./lapzuli-projection-resolution"
import {routeAssetKey} from "./lapzuli-free-runtime"

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
  const [
    campaigns,
    distributionAssets,
    derivatives,
    callableRows,
    executions,
    routes,
    evidence,
    channels,
    executors,
    registrarRegistrations,
    registrarDesks,
    registrarPublications,
    campaignPacs,
    projectionAuthorities,
    outlets,
    qualifications,
  ] = await Promise.all([
    read("measures_publication_campaign","campaign_key,publication_key,issue_id,campaign_name,campaign_objective,status,release_state,review_status,metadata,created_at,updated_at"),
    read("measures_publication_distribution_asset","distribution_asset_key,campaign_asset_id,publication_asset_id,campaign_id,platform,distribution_type,status,review_status,payload,metadata,created_at,updated_at"),
    read("measures_publication_derivative_asset","derivative_key,publication_asset_id,derivative_type,title,format,source_reference,generation_status,approval_status,release_state,review_status,metadata,updated_at"),
    read("lapzuli_derivative_execution_view_v1","publication_asset_id,derivative_key,distribution_asset_key,platform,distribution_type,distribution_status,distribution_review_status,registered_standing_key,registered_standing,registered_validation_status,lapzuli_callable,channel_key,account_name,channel_identifier,channel_url,channel_status,executor_key,executor_name,executor_status,supports_publish,payload,canonical_url,purpose,operator_confirmed,preflight_result"),
    read("measures_distribution_execution","execution_id,distribution_asset_id,executor_key,channel_key,execution_status,execution_mode,attempt_number,executed_at,published_at,platform_post_id,platform_url,evidence,error,metadata,created_at"),
    read("lapzuli_route","route_key,publication_object_key,desk_key,outlet_key,distribution_mode,route_status,authority_reference,operator_confirmed,canonical_url,payload_reference,metadata,created_at,updated_at"),
    read("lapzuli_encounter_evidence","encounter_id,route_key,observed_outcome,observed_reason,external_id,external_url,observed_at"),
    read("measures_distribution_channel","channel_key,platform,account_name,channel_identifier,channel_url,status,metadata"),
    read("measures_distribution_executor","executor_key,executor_name,executor_type,platform,execution_mode,status,supports_publish,supports_scheduling,metadata"),
    read("c3_registrar_publication_registration","registration_key,publication_object_key,desk_key,native_context_class,native_context_key,editorial_voice_key,pubpac_key,publication_standing,distribution_standing,metadata,created_at,updated_at"),
    read("c3_registrar_publication_desk","desk_key,desk_label,native_context_class,native_context_key,publication_authority_key,standing,default_editorial_voice_key,metadata"),
    read("c3ops_publication_object","publication_object_key,publisher_key,publication_key,series_key,issue_key,title,description,publication_standing,editorial_standing,updated_at"),
    read("c3_pac","pac_key,pac_type,is_effective,standing,source_authority,metadata",{pac_type:"eq.CampaignPac"}),
    read("c3_registrar_publication_authority","authority_key,standing,metadata",{authority_key:"eq.c3_registrar"}),
    read("lapzuli_outlet","outlet_key,outlet_name,account_standing,submission_mode,qualification_state,metadata"),
    read("lapzuli_outlet_qualification","outlet_key,desk_key,distribution_mode,standing,operator_disposition_required,requires_ai_disclosure,requires_canonical,requires_original_contribution,provenance_constraints"),
  ])

  const projectionAuthority=consumeLapzuliProjectionResolution(projectionAuthorities)

  const derivativeByKey = new Map(derivatives.map(row => [str(row.derivative_key) ?? "", row]))
  const campaignByKey = new Map(campaigns.map(row => [str(row.campaign_key) ?? "", row]))
  const callableByAsset = new Map(callableRows.map(row => [str(row.distribution_asset_key) ?? "", row]))
  const channelByKey = new Map(channels.map(row => [str(row.channel_key) ?? "", row]))
  const executorByKey = new Map(executors.map(row => [str(row.executor_key) ?? "", row]))
  const executionsByAsset = new Map<string, Row[]>()
  for (const execution of executions) {
    const key = str(execution.distribution_asset_id)
    if (!key) continue
    const rows = executionsByAsset.get(key) ?? []
    rows.push(execution)
    executionsByAsset.set(key, rows)
  }

  const routesByAsset = new Map<string, Row[]>()
  for (const route of routes) {
    const key = routeAssetKey(route)
    if (key) routesByAsset.set(key,[...(routesByAsset.get(key) ?? []),route])
  }

  const normalizedAssets = distributionAssets.map(asset => {
    const assetKey = str(asset.distribution_asset_key) ?? "unresolved_asset"
    const metadata = record(asset.metadata)
    const payload = record(asset.payload)
    const derivativeKey =
      str(metadata.derivative_key) ??
      str(metadata.caption_derivative_key) ??
      str(payload.caption_derivative_key)
    const derivative = derivativeKey ? derivativeByKey.get(derivativeKey) ?? null : null
    const callable = callableByAsset.get(assetKey) ?? null
    const assetRoutes = routesByAsset.get(assetKey) ?? []
    const explicitRoute = str(metadata.route_key)
    const route = explicitRoute ? assetRoutes.find(row => row.route_key === explicitRoute) ?? null : assetRoutes.length === 1 ? assetRoutes[0] : null
    const channelKey = str(metadata.channel_key) ?? str(callable?.channel_key)
    const executorKey =
      str(metadata.executor_key) ??
      str(metadata.transport_executor) ??
      str(callable?.executor_key)
    const channel = channelKey ? channelByKey.get(channelKey) ?? null : null
    const executor = executorKey ? executorByKey.get(executorKey) ?? null : null
    const {predicates: speakerPredicates, ...speaker} = resolveCampaignPacSpeaker(route ?? {},asset,callable ?? undefined,campaignPacs,channelKey)
    const assetExecutions = [...(executionsByAsset.get(assetKey) ?? [])].sort((a,b) => {
      const aa = Date.parse(str(a.executed_at) ?? str(a.created_at) ?? "") || 0
      const bb = Date.parse(str(b.executed_at) ?? str(b.created_at) ?? "") || 0
      return bb-aa
    })
    const latestExecution = assetExecutions[0] ?? null
    const routeEvidence=evidence.filter(row=>assetRoutes.some(candidate=>candidate.route_key===row.route_key))
    const normalizedCurrent=campaignByKey.get(str(asset.campaign_id) ?? "")?.publication_key === "undrifted"
    const currentOwners=resolveCurrentOutletQualification(route,outlets,qualifications)
    const distributed = Boolean(
      normalizedCurrent
        ? assetExecutions.some(row=>row.execution_status === "published") || routeEvidence.some(row=>row.observed_outcome === "published" && str(row.external_url))
        : latestExecution && (latestExecution.execution_status === "published" || latestExecution.platform_url)
    )
    const accepted = Boolean(
      !distributed &&
      (normalizedCurrent ? latestExecution?.execution_status === "queued" : latestExecution &&
      (
        latestExecution.execution_status === "queued" ||
        latestExecution.platform_post_id ||
        record(latestExecution.evidence).external_publication_effects === 1
      ))
    )
    const isCallable = callable?.lapzuli_callable === true
    const preResolutionState = asset.status === "ready_for_lapzuli_resolution" || asset.status === "awaiting_lapzuli_resolution"
      ? asset.status : null
    const blockers: string[] = []
    if (!distributed && !accepted) {
      if(normalizedCurrent)blockers.push(...projectionAuthority.hold_reasons,...currentOwners.holds)
      if (!derivative) blockers.push("derivative_unresolved")
      if (derivative && derivative.approval_status !== "operator_approved") blockers.push("derivative_not_operator_approved")
      if (derivative && derivative.release_state !== "released") blockers.push("derivative_not_released")
      if (!preResolutionState && asset.status !== "ready_for_operator_execution") blockers.push("distribution_asset_not_ready")
      if (asset.review_status !== "operator_approved") blockers.push("distribution_asset_not_operator_approved")
      if(normalizedCurrent && asset.review_status === "chazz_review_required")blockers.push("chazz_review_required")
      // Registration and the callable view are outcomes of resolution, not entry predicates.
      // All common authority predicates still apply to the explicit pre-resolution source state.
      if (!preResolutionState && !str(metadata.registered_standing_key)) blockers.push("registered_standing_unresolved")
      if (!route || route.route_status !== "authorized" || route.operator_confirmed !== true) blockers.push("authorized_route_unresolved")
      if (!channel || channel.status !== "active") blockers.push("active_channel_unresolved")
      if (!executor || executor.status !== "available" || executor.supports_publish !== true) blockers.push("callable_executor_unresolved")
      if (!preResolutionState && !isCallable && blockers.length === 0) blockers.push("lapzuli_callable_contract_unresolved")
      blockers.push(...speakerPredicates.filter(predicate => !predicate.pass).map(predicate => predicate.predicate))
      if (preResolutionState) {
        const campaign = campaignByKey.get(str(asset.campaign_id) ?? "")
        const campaignMetadata = record(campaign?.metadata)
        const releaseState = str(campaign?.release_state)
        if (!campaign) blockers.push("campaign_unresolved")
        if (campaign?.review_status !== "operator_approved") blockers.push("campaign_not_operator_approved")
        if (campaignMetadata.external_distribution_authorized !== true) blockers.push("campaign_external_distribution_not_authorized")
        if (!normalizedCurrent && (!releaseState || !(releaseState.startsWith("authorized_") || releaseState === "release_ready"))) blockers.push("campaign_release_state_not_distribution_authorized")
        if (!str(campaignMetadata.activation_operator) || !(str(campaignMetadata.campaign_pac_key) ?? str(campaignMetadata.pac_key))) blockers.push("campaign_operator_or_pac_unresolved")
        if (metadata.operator_confirmed !== true) blockers.push("asset_operator_confirmation_missing")
        if (metadata.external_distribution_authorized !== true) blockers.push("asset_external_distribution_not_authorized")
        const activeKeys = Array.isArray(campaignMetadata.lapzuli_active_asset_keys) ? campaignMetadata.lapzuli_active_asset_keys : null
        if (activeKeys?.length && !activeKeys.includes(assetKey)) blockers.push("outside_active_distribution_scope")
      }
    }
    return {
      distribution_asset_key: assetKey,
      campaign_id: asset.campaign_id,
      campaign_asset_id: asset.campaign_asset_id,
      publication_asset_id: asset.publication_asset_id,
      platform: asset.platform,
      distribution_type: asset.distribution_type,
      distribution_status: asset.status,
      review_status: asset.review_status,
      derivative_key: derivativeKey,
      derivative: derivative ? fields(derivative,["derivative_key","derivative_type","title","format","source_reference","generation_status","approval_status","release_state","review_status"]) : null,
      channel_key: channelKey,
      ...speaker,
      destination_account_key: channelKey,
      destination_account_identifier: channel?.channel_identifier ?? null,
      channel: channel ? fields(channel,["channel_key","platform","account_name","channel_identifier","channel_url","status"]) : null,
      executor_key: executorKey,
      executor: executor ? fields(executor,["executor_key","executor_name","executor_type","execution_mode","status","supports_publish","supports_scheduling"]) : null,
      route: route ? fields(route,["route_key","publication_object_key","desk_key","outlet_key","distribution_mode","route_status","authority_reference","operator_confirmed","canonical_url"]) : null,
      outlet:normalizedCurrent ? currentOwners.outlet : null,
      qualification:normalizedCurrent ? currentOwners.qualification : null,
      current_owner_holds:normalizedCurrent ? currentOwners.holds : [],
      publication_evidence:routeEvidence,
      registered_standing_key: str(metadata.registered_standing_key),
      callable_contract: callable,
      lapzuli_callable: isCallable,
      payload,
      latest_execution: latestExecution,
      execution_count: assetExecutions.length,
      distribution_state: distributed ? "distributed" : accepted ? "accepted_pending_platform_proof" : preResolutionState && blockers.length === 0 ? preResolutionState : isCallable && blockers.length === 0 ? "ready_for_operator_execution" : "held",
      blockers,
    }
  })

  const campaignCards = campaigns
    .filter(campaign => !["archived","superseded"].includes(str(campaign.status) ?? ""))
    .map(campaign => {
      const campaignKey = str(campaign.campaign_key) ?? "unresolved_campaign"
      const assets = normalizedAssets.filter(asset => asset.campaign_id === campaignKey)
      const distributedCount = assets.filter(asset => asset.distribution_state === "distributed").length
      const acceptedCount = assets.filter(asset => asset.distribution_state === "accepted_pending_platform_proof").length
      const readyCount = assets.filter(asset => asset.distribution_state === "ready_for_operator_execution").length
      const heldCount = assets.filter(asset => asset.distribution_state === "held").length
      const metadata = record(campaign.metadata)
      const releaseState = str(campaign.release_state)
      const normalizedCurrent=campaign.publication_key === "undrifted"
      const campaignStanding = normalizedCurrent ? deriveCurrentCampaignStanding(assets)
        : distributedCount > 0 ? "active_trace" : acceptedCount > 0 ? "provider_accepted_pending_platform_proof"
        : readyCount > 0 ? "ready_for_operator_execution"
        : campaign.review_status === "operator_approved" && Boolean(releaseState?.startsWith("authorized_")) ? "awaiting_lapzuli_resolution" : "held"
      return {
        campaign_key: campaignKey,
        publication_key: campaign.publication_key,
        issue_id: campaign.issue_id,
        campaign_name: campaign.campaign_name,
        campaign_objective: campaign.campaign_objective,
        status: normalizedCurrent ? campaignStanding : campaign.status,
        release_state: normalizedCurrent ? campaignStanding : campaign.release_state,
        historical:normalizedCurrent ? {classification:"historical_evidence_provenance",status:campaign.status,release_state:campaign.release_state,metadata:campaign.metadata} : null,
        review_status: campaign.review_status,
        campaign_pac_key: str(metadata.campaign_pac_key) ?? str(metadata.pac_key),
        canonical_url: str(metadata.canonical_url),
        standing: campaignStanding,
        counts: {
          assets: assets.length,
          distributed: distributedCount,
          accepted: acceptedCount,
          ready: readyCount,
          held: heldCount,
        },
        assets,
      }
    })

  const registrarDeskByKey = new Map(registrarDesks.map(row => [str(row.desk_key) ?? "", row]))
  const registrarPublicationByKey = new Map(registrarPublications.map(row => [str(row.publication_object_key) ?? "", row]))
  const registrarCampaignCards = registrarRegistrations
    .filter(registration => registration.distribution_standing === "available_to_lapzuli")
    .map(registration => {
      const metadata = record(registration.metadata)
      const publicationObjectKey = str(registration.publication_object_key) ?? "unresolved_publication"
      const articleMemberKey = str(metadata.article_member_key)
      const deskKey = str(registration.desk_key)
      const desk = deskKey ? registrarDeskByKey.get(deskKey) ?? null : null
      const publication = registrarPublicationByKey.get(publicationObjectKey) ?? null
      const publicationRoutes = routes.filter(route => {
        const key = str(route.publication_object_key)
        return key === publicationObjectKey || (articleMemberKey && key === articleMemberKey)
      })
      const assets = publicationRoutes.map(route => {
        const routeMetadata = record(route.metadata)
        const channelKey = str(routeMetadata.channel_key)
        const executorKey = str(routeMetadata.executor_key)
        const channel = channelKey ? channelByKey.get(channelKey) ?? null : null
        const executor = executorKey ? executorByKey.get(executorKey) ?? null : null
        const asset = distributionAssets.find(row => row.distribution_asset_key === routeMetadata.distribution_asset_key)
        const callable = asset ? callableByAsset.get(String(asset.distribution_asset_key)) : undefined
        const {predicates: speakerPredicates, ...speaker} = resolveCampaignPacSpeaker(route,asset,callable,campaignPacs,channelKey)
        const blockers:string[] = []
        if (route.route_status !== "authorized" || route.operator_confirmed !== true) blockers.push("authorized_route_unresolved")
        if (!channel || channel.status !== "active") blockers.push("active_channel_unresolved")
        if (!executor || executor.status !== "available" || executor.supports_publish !== true) blockers.push("callable_executor_unresolved")
        blockers.push(...speakerPredicates.filter(predicate => !predicate.pass).map(predicate => predicate.predicate))
        return {
          distribution_asset_key: str(routeMetadata.distribution_asset_key) ?? str(route.route_key),
          campaign_id: str(registration.registration_key),
          campaign_asset_id: null,
          publication_asset_id: articleMemberKey ?? publicationObjectKey,
          platform: route.outlet_key,
          distribution_type: route.distribution_mode,
          distribution_status: "registrar_pubpac_resolved",
          review_status: str(routeMetadata.review_state) ?? "registrar_resolved",
          derivative_key: str(routeMetadata.derivative_key),
          derivative: null,
          channel_key: channelKey,
          ...speaker,
          destination_account_key: channelKey,
          destination_account_identifier: channel?.channel_identifier ?? null,
          channel: channel ? fields(channel,["channel_key","platform","account_name","channel_identifier","channel_url","status"]) : null,
          executor_key: executorKey,
          executor: executor ? fields(executor,["executor_key","executor_name","executor_type","execution_mode","status","supports_publish","supports_scheduling"]) : null,
          route: fields(route,["route_key","publication_object_key","desk_key","outlet_key","distribution_mode","route_status","authority_reference","operator_confirmed","canonical_url"]),
          outlet:null,
          qualification:null,
          current_owner_holds:[] as string[],
          publication_evidence:[] as Row[],
          registered_standing_key: str(registration.registration_key),
          callable_contract: {source:"FREE",authority:"c3_registrar",pubpac_key:registration.pubpac_key},
          lapzuli_callable: blockers.length === 0,
          payload: {},
          latest_execution: null,
          execution_count: 0,
          distribution_state: blockers.length === 0 ? "ready_for_operator_execution" : "held",
          blockers,
        }
      })
      const readyCount = assets.filter(asset => asset.distribution_state === "ready_for_operator_execution").length
      const heldCount = assets.filter(asset => asset.distribution_state === "held").length
      return {
        campaign_key: str(registration.registration_key),
        publication_key: publication?.publication_key ?? registration.native_context_key,
        issue_id: publication?.issue_key ?? publicationObjectKey,
        campaign_name: publication?.title ?? publicationObjectKey,
        campaign_objective: publication?.description ?? "Registrar PubPAC resolved through FREE for Lapzuli.",
        status: registration.publication_standing,
        release_state: registration.distribution_standing,
        historical:null,
        review_status: publication?.editorial_standing ?? "registrar_resolved",
        campaign_pac_key: str(metadata.campaign_pac_key),
        pubpac_key: registration.pubpac_key,
        canonical_url: str(metadata.canonical_url) ?? str(publicationRoutes[0]?.canonical_url),
        standing: readyCount > 0 ? "ready_for_operator_execution" : "held",
        publication_authority: desk?.publication_authority_key ?? "c3_registrar",
        publication_surface: str(record(desk?.metadata).publication_surface) ?? "c3 Registrar - Field Reporter",
        desk_key: deskKey,
        desk_label: desk?.desk_label,
        editorial_voice_key: registration.editorial_voice_key,
        free_resolution: "pubpac_resolved_to_lapzuli_surface",
        counts:{assets:assets.length,distributed:0,accepted:0,ready:readyCount,held:heldCount},
        assets,
      }
    })

  return {
    contract:"lapzuli_distribution_desk_v1",
    source:"CampaignPAC / publication campaign -> derivative -> distribution asset -> registered standing -> route/channel/executor -> execution evidence",
    observed_at:new Date().toISOString(),
    projection_authority:projectionAuthority,
    campaigns:[...registrarCampaignCards,...campaignCards],
    routes:routes.map(route=>{
      const metadata=record(route.metadata)
      const asset=distributionAssets.find(row=>row.distribution_asset_key === routeAssetKey(route))
      const channelKey=str(metadata.channel_key) ?? str(record(asset?.metadata).channel_key)
      const {predicates,...speaker}=resolveCampaignPacSpeaker(route,asset,asset?callableByAsset.get(String(asset.distribution_asset_key)):undefined,campaignPacs,channelKey)
      return {...route,...speaker,route_key:route.route_key,desk_key:route.desk_key,outlet_key:route.outlet_key,
        publication_object_key:route.publication_object_key,route_status:route.route_status,
        destination_account_key:channelKey,destination_account_identifier:channelKey?channelByKey.get(channelKey)?.channel_identifier ?? null:null,
        free_runtime_preflight_path:"/api/c3ops/manifest?view=lapzuli_free&route_key="+encodeURIComponent(String(route.route_key))}
    }),
    evidence,
    channels,
    executors,
    outlets,
    qualifications,
    unresolved:[...registrarCampaignCards,...campaignCards]
      .filter(campaign => campaign.standing === "awaiting_lapzuli_resolution" || campaign.standing === "held")
      .map(campaign => `${campaign.campaign_key}: ${campaign.standing}`),
    current_status:"registry_backed_distribution_readback",
    mutation_authority:"protected_c3ops_action_required",
    external_effects:0,
  }
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
    notchazzOpticsProcess,
    notchazzBoundaryReports,
    mgs,
    passage,
    chazzRoleCall,
    chazzCapability,
    current,
    opticsObservation,
    oarOptics,
  ] = await Promise.all([
    readProcess("prism_publication_operations_v1"),
    readProcess("lapzuli_distribution"),
    readProcess("c3_optics_operational_proof_output_v1"),
    readProcess("c3ops_notchazz_boundary_optics_projection_v1"),
    read(
      "c3ops_notchazz_oar_formation_evaluation",
      "evaluation_key,oar_key,execution_instance,oar_integrity_sha256,boundary_process_key,governed_process_key,result,result_reason,required_predicates,unresolved_predicates,evaluator,authority_created,standing,created_at",
      {standing:"eq.active",order:"created_at.desc",limit:"20"},
    ),
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
    readResolvedOarOptics(read),
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
      component("optics","Optics","Operational proof + NotChazz border health",[
        "system_process_registry:c3_optics_operational_proof_output_v1",
        "c3_optics_observation:optics432:operational_proof:c3_system_baseline_v1",
        "system_process_registry:c3ops_notchazz_boundary_optics_projection_v1",
        "c3ops_notchazz_oar_formation_evaluation:active",
      ].join(" + "),[...opticsProcess,...opticsObservation,...notchazzOpticsProcess,...notchazzBoundaryReports]),
      component("c3_model","c3 Model","MGS + governed passage",[
        "system_process_registry:minimum_governed_standard_v1",
        "system_process_registry:governed_object_passage_process_v4",
      ].join(" + "),[...mgs,...passage]),
      component("current","CURRENT","c3Ops governed present state","c3_current_state:env_c3ops/is_current=true",current),
      component("oar_lifecycle","OAR Operations","Resolved execution and return state",OAR_OPTICS_INTERFACE,oarOptics),
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
