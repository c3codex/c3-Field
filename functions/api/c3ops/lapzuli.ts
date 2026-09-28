type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN?: string
  LAPZULI_DISTRIBUTION_WORKER_URL?: string
}

type Row = Record<string, unknown>

const LEGACY_BUFFER_CHANNELS = new Set([
  "facebook_undrifted",
  "facebook_measures_registry",
  "linkedin_measures_registry",
  "instagram_measures_registry",
  "x_measures_c3",
])

const C3_BUFFER_CHANNELS = new Set([
  "c3_facebook_page",
  "c3_facebook_group",
  "c3_instagram",
])

const DEFAULT_WORKER_URL = "https://lapzuli-distribution-worker.c3field.workers.dev"
const jsonHeaders = {"content-type":"application/json; charset=utf-8","cache-control":"private, no-store"}

const record = (value: unknown): Row =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Row : {}

const str = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null

function json(body: unknown, status=200) {
  return new Response(JSON.stringify(body,null,2),{status,headers:jsonHeaders})
}

async function supabaseFetch<T>(env: Env, path: string, init: RequestInit = {}): Promise<T> {
  const base = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) throw new Error("Supabase server credentials are not configured")
  const response = await fetch(`${base.replace(/\/$/,"")}/rest/v1/${path}`,{
    ...init,
    headers:{
      apikey:key,
      authorization:`Bearer ${key}`,
      "content-type":"application/json",
      ...(init.headers ?? {}),
    },
  })
  const body = await response.text()
  if (!response.ok) throw new Error(body || `Supabase request failed: ${response.status}`)
  return (body ? JSON.parse(body) : undefined) as T
}

function adapterFor(channelKey: string | null, executorKey: string | null) {
  if (executorKey !== "buffer" || !channelKey) return null
  if (LEGACY_BUFFER_CHANNELS.has(channelKey)) return "/buffer/posts"
  if (C3_BUFFER_CHANNELS.has(channelKey)) return "/buffer/c3/posts"
  return null
}

function publicMediaUrl(env: Env, payload: Row) {
  const media = record(payload.media)
  const bucket = str(media.bucket)
  const objectPath = str(media.object_path)
  const base = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  if (!base || !bucket || !objectPath) return null
  const safePath = objectPath.split("/").map(encodeURIComponent).join("/")
  return `${base.replace(/\/$/,"")}/storage/v1/object/public/${encodeURIComponent(bucket)}/${safePath}`
}

function canonicalAllowed(adapter: string, value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== "https:") return false
    if (adapter === "/buffer/posts") return url.hostname === "measuresregistry.com"
    return ["c3field.online","mdm.c3field.online","47pct.c3field.online"].includes(url.hostname)
  } catch {
    return false
  }
}

async function resolveCampaign(env: Env, campaignKey: string) {
  const campaigns = await supabaseFetch<Row[]>(env,
    `measures_publication_campaign?campaign_key=eq.${encodeURIComponent(campaignKey)}&select=*&limit=1`)
  const campaign = campaigns[0]
  if (!campaign) return {status:404,body:{standing:"DNR",reason:"campaign_not_found",external_publication_effects:0}}

  const campaignMetadata = record(campaign.metadata)
  const operator = str(campaignMetadata.activation_operator)
  const pacKey = str(campaignMetadata.campaign_pac_key) ?? str(campaignMetadata.pac_key)
  const reviewStatus = str(campaign.review_status)
  const releaseState = str(campaign.release_state)
  if (reviewStatus !== "operator_approved") {
    return {status:409,body:{standing:"HLD",reason:"campaign_not_operator_approved",campaign_key:campaignKey,external_publication_effects:0}}
  }
  if (campaignMetadata.external_distribution_authorized !== true) {
    return {status:409,body:{standing:"HLD",reason:"campaign_external_distribution_not_authorized",campaign_key:campaignKey,external_publication_effects:0}}
  }
  if (!releaseState || !(releaseState.startsWith("authorized_") || releaseState === "release_ready")) {
    return {status:409,body:{standing:"HLD",reason:"campaign_release_state_not_distribution_authorized",campaign_key:campaignKey,release_state:releaseState,external_publication_effects:0}}
  }
  if (!operator || !pacKey) {
    return {status:409,body:{standing:"HLD",reason:"campaign_operator_or_pac_unresolved",campaign_key:campaignKey,external_publication_effects:0}}
  }

  const [assets, derivatives, channels, executors] = await Promise.all([
    supabaseFetch<Row[]>(env,`measures_publication_distribution_asset?campaign_id=eq.${encodeURIComponent(campaignKey)}&select=*`),
    supabaseFetch<Row[]>(env,"measures_publication_derivative_asset?select=*"),
    supabaseFetch<Row[]>(env,"measures_distribution_channel?select=*"),
    supabaseFetch<Row[]>(env,"measures_distribution_executor?select=*"),
  ])
  const derivativeMap = new Map(derivatives.map(row=>[str(row.derivative_key) ?? "",row]))
  const channelMap = new Map(channels.map(row=>[str(row.channel_key) ?? "",row]))
  const executorMap = new Map(executors.map(row=>[str(row.executor_key) ?? "",row]))

  const eligible: Array<{asset:Row; derivative:Row; channel:Row; executor:Row; derivativeKey:string; channelKey:string; executorKey:string; adapter:string; canonicalUrl:string; imageUrl:string|null; text:string}> = []
  const held: Array<Record<string,unknown>> = []

  for (const asset of assets) {
    const assetKey = str(asset.distribution_asset_key) ?? "unresolved_asset"
    const metadata = record(asset.metadata)
    const payload = record(asset.payload)
    const derivativeKey = str(metadata.derivative_key) ?? str(metadata.caption_derivative_key) ?? str(payload.caption_derivative_key)
    const channelKey = str(metadata.channel_key)
    const executorKey = str(metadata.executor_key) ?? str(metadata.transport_executor)
    const derivative = derivativeKey ? derivativeMap.get(derivativeKey) : null
    const channel = channelKey ? channelMap.get(channelKey) : null
    const executor = executorKey ? executorMap.get(executorKey) : null
    const adapter = adapterFor(channelKey,executorKey)
    const canonicalUrl = str(payload.canonical_url) ?? str(metadata.canonical_url) ?? str(campaignMetadata.canonical_url)
    const imageUrl = str(payload.image_url) ?? publicMediaUrl(env,payload)
    const textValue = str(payload.text) ?? str(payload.caption) ?? (derivative ? str(record(derivative.metadata).caption_text) : null)
    const blockers: string[] = []
    if (metadata.operator_confirmed !== true) blockers.push("asset_operator_confirmation_missing")
    if (metadata.external_distribution_authorized !== true) blockers.push("asset_external_distribution_not_authorized")
    if (!derivative) blockers.push("derivative_unresolved")
    if (derivative && derivative.approval_status !== "operator_approved") blockers.push("derivative_not_operator_approved")
    if (derivative && !["approved","operator_approved"].includes(str(derivative.review_status) ?? "")) blockers.push("derivative_review_not_approved")
    if (!channel || channel.status !== "active") blockers.push("channel_not_active")
    if (!executor || executor.status !== "available" || executor.supports_publish !== true) blockers.push("executor_not_callable")
    if (!adapter) blockers.push("worker_adapter_not_callable")
    if (!canonicalUrl) blockers.push("canonical_url_unresolved")
    if (adapter && canonicalUrl && !canonicalAllowed(adapter,canonicalUrl)) blockers.push("canonical_url_outside_adapter_scope")
    if (!textValue) blockers.push("distribution_text_unresolved")
    if (str(asset.distribution_type)?.includes("visual") && !imageUrl) blockers.push("visual_asset_url_unresolved")

    if (blockers.length || !derivative || !channel || !executor || !adapter || !canonicalUrl || !textValue) {
      held.push({distribution_asset_key:assetKey,channel_key:channelKey,executor_key:executorKey,blockers})
      continue
    }
    eligible.push({asset,derivative,channel,executor,derivativeKey:derivativeKey!,channelKey:channelKey!,executorKey:executorKey!,adapter,canonicalUrl,imageUrl,text:textValue})
  }

  if (!eligible.length) {
    return {status:409,body:{standing:"HLD",reason:"no_callable_distribution_assets",campaign_key:campaignKey,held,external_publication_effects:0}}
  }

  const standingKey = `${campaignKey}_lapzuli_registered`
  const resolvedAt = new Date().toISOString()
  await supabaseFetch(env,"registered_process_log?on_conflict=process_key",{
    method:"POST",
    headers:{Prefer:"resolution=merge-duplicates,return=minimal"},
    body:JSON.stringify({
      process_key:standingKey,
      process_type:"lapzuli_distribution_registered_standing",
      standing:"governing_seeded",
      oar2_reference:str(campaignMetadata.active_execution_oar2),
      oar1_reference:null,
      execution_status:"executed",
      validation_status:"validated",
      deploy_status:"not_required",
      seeded_status:"governing_seeded",
      executor:"chazz",
      validator:"chazz",
      operator,
      validated_at:resolvedAt,
      deployed_at:null,
      closeout_state:"closed",
      pattern_steps:["campaign_pac","preflight","confirm","persistence","register"],
      metadata:{
        campaign_key:campaignKey,
        campaign_pac_key:pacKey,
        publication_key:campaign.publication_key,
        registered_for:"lapzuli",
        distribution_assets:eligible.map(item=>item.asset.distribution_asset_key),
        channels:eligible.map(item=>item.channelKey),
        authority_note:"CampaignPAC remains source authority; registered standing only resolves eligible transport passage.",
        operator_confirmation:`${operator} campaign activation`,
        external_publication_effects:0,
      },
    }),
  })

  const resolved: Array<Record<string,unknown>> = []
  for (const item of eligible) {
    const assetKey = str(item.asset.distribution_asset_key)!
    const derivativeMetadata = record(item.derivative.metadata)
    const assetMetadata = record(item.asset.metadata)
    const assetPayload = record(item.asset.payload)
    const routeKey = `lapzuli_route_${assetKey}`

    await supabaseFetch(env,`measures_publication_derivative_asset?derivative_key=eq.${encodeURIComponent(item.derivativeKey)}`,{
      method:"PATCH",
      headers:{Prefer:"return=minimal"},
      body:JSON.stringify({
        release_state:"released",
        metadata:{
          ...derivativeMetadata,
          external_distribution_authorized:true,
          release_authority:pacKey,
          lapzuli_resolution:standingKey,
          released_at:resolvedAt,
        },
      }),
    })

    await supabaseFetch(env,`measures_publication_distribution_asset?distribution_asset_key=eq.${encodeURIComponent(assetKey)}`,{
      method:"PATCH",
      headers:{Prefer:"return=minimal"},
      body:JSON.stringify({
        status:"ready_for_operator_execution",
        review_status:"operator_approved",
        payload:{
          ...assetPayload,
          text:item.text,
          canonical_url:item.canonicalUrl,
          ...(item.imageUrl ? {image_url:item.imageUrl} : {}),
        },
        metadata:{
          ...assetMetadata,
          derivative_key:item.derivativeKey,
          executor_key:item.executorKey,
          registered_for:"lapzuli",
          registered_standing_key:standingKey,
          route_key:routeKey,
          adapter_path:item.adapter,
          lapzuli_resolution_state:"ready_for_operator_execution",
          resolved_at:resolvedAt,
          external_publication_effects:0,
        },
      }),
    })

    await supabaseFetch(env,"lapzuli_route?on_conflict=route_key",{
      method:"POST",
      headers:{Prefer:"resolution=merge-duplicates,return=minimal"},
      body:JSON.stringify({
        route_key:routeKey,
        publication_object_key:str(item.asset.publication_asset_id) ?? str(item.asset.campaign_asset_id) ?? assetKey,
        desk_key:str(campaign.publication_key) ?? str(campaign.issue_id) ?? "campaign",
        outlet_key:item.channelKey,
        distribution_mode:str(item.asset.distribution_type) ?? "campaign_distribution",
        route_status:"authorized",
        qualification_snapshot:{
          campaign_key:campaignKey,
          campaign_pac_key:pacKey,
          derivative_key:item.derivativeKey,
          channel_status:item.channel.status,
          executor_status:item.executor.status,
          executor_supports_publish:item.executor.supports_publish,
        },
        authority_reference:`${pacKey}; ${operator} operator-approved campaign activation`,
        operator_confirmed:true,
        canonical_url:item.canonicalUrl,
        payload_reference:assetKey,
        return_required:true,
        metadata:{
          channel_key:item.channelKey,
          executor_key:item.executorKey,
          adapter_path:item.adapter,
          campaign_pac_key:pacKey,
          derivative_key:item.derivativeKey,
          distribution_asset_key:assetKey,
          callable_by_lapzuli:true,
          evidence_return_required:true,
          operator_confirmed_at:resolvedAt,
          external_publication_effects:0,
        },
      }),
    })
    resolved.push({distribution_asset_key:assetKey,channel_key:item.channelKey,route_key:routeKey,adapter:item.adapter})
  }

  return {status:200,body:{
    standing:"ACT",
    action:"resolve_campaign",
    campaign_key:campaignKey,
    registered_standing_key:standingKey,
    resolved,
    held,
    resolved_count:resolved.length,
    held_count:held.length,
    external_publication_effects:0,
  }}
}

async function workerCall(env: Env, path: string, payload: Row) {
  const token = env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN
  if (!token) return {response:null,body:{ok:false,standing:"held_lapzuli_control_token_missing",external_publication_effects:0}}
  const base=(env.LAPZULI_DISTRIBUTION_WORKER_URL ?? DEFAULT_WORKER_URL).replace(/\/$/,"")
  const response=await fetch(base+path,{
    method:"POST",
    headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},
    body:JSON.stringify(payload),
  })
  return {response,body:record(await response.json().catch(()=>({})))}
}

async function dispatchAsset(env: Env, distributionAssetKey: string, dryRun: boolean) {
  const callableRows=await supabaseFetch<Row[]>(env,
    `lapzuli_derivative_execution_view_v1?distribution_asset_key=eq.${encodeURIComponent(distributionAssetKey)}&select=*&limit=1`)
  const callable=callableRows[0]
  if (!callable || callable.lapzuli_callable !== true) {
    return {status:409,body:{standing:"HLD",reason:"lapzuli_callable_contract_not_satisfied",distribution_asset_key:distributionAssetKey,external_publication_effects:0}}
  }

  const assetRows=await supabaseFetch<Row[]>(env,
    `measures_publication_distribution_asset?distribution_asset_key=eq.${encodeURIComponent(distributionAssetKey)}&select=*&limit=1`)
  const asset=assetRows[0]
  const metadata=record(asset?.metadata)
  const payload=record(asset?.payload)
  const routeKey=str(metadata.route_key)
  const routes=routeKey ? await supabaseFetch<Row[]>(env,`lapzuli_route?route_key=eq.${encodeURIComponent(routeKey)}&select=*&limit=1`) : []
  const route=routes[0]
  if (!route || route.route_status !== "authorized" || route.operator_confirmed !== true) {
    return {status:409,body:{standing:"HLD",reason:"authorized_route_not_resolved",distribution_asset_key:distributionAssetKey,external_publication_effects:0}}
  }

  const prior=await supabaseFetch<Row[]>(env,
    `measures_distribution_execution?distribution_asset_id=eq.${encodeURIComponent(distributionAssetKey)}&select=*&order=created_at.desc&limit=20`)
  const priorEffect=prior.find(row =>
    row.execution_status === "published" ||
    row.platform_url ||
    record(row.evidence).external_publication_effects === 1
  )
  if (priorEffect && !dryRun) {
    return {status:409,body:{standing:"HLD",reason:"distribution_asset_already_has_external_effect",distribution_asset_key:distributionAssetKey,execution_id:priorEffect.execution_id,platform_url:priorEffect.platform_url,external_publication_effects:0}}
  }

  const channelKey=str(callable.channel_key)
  const executorKey=str(callable.executor_key)
  const adapter=adapterFor(channelKey,executorKey)
  if (!adapter) {
    return {status:409,body:{standing:"HLD",reason:"worker_adapter_not_callable",channel_key:channelKey,executor_key:executorKey,external_publication_effects:0}}
  }
  const canonicalUrl=str(callable.canonical_url) ?? str(payload.canonical_url) ?? str(route.canonical_url)
  const textValue=str(payload.text) ?? str(payload.caption)
  const imageUrl=str(payload.image_url) ?? publicMediaUrl(env,payload)
  if (!canonicalUrl || !textValue) {
    return {status:409,body:{standing:"HLD",reason:"resolved_payload_incomplete",external_publication_effects:0}}
  }
  const outboundText=textValue.includes(canonicalUrl) ? textValue : `${textValue}\n\n${canonicalUrl}`
  if (str(asset?.platform) === "x" && Array.from(outboundText).length > 280) {
    return {status:409,body:{standing:"HLD",reason:"x_payload_exceeds_280_characters",text_length:Array.from(outboundText).length,external_publication_effects:0}}
  }

  const requestBody: Row={
    dry_run:dryRun,
    execute:!dryRun,
    publication_object_key:route.publication_object_key,
    derivative_key:callable.derivative_key,
    distribution_asset_id:distributionAssetKey,
    channel_key:channelKey,
    channel_identifier:callable.channel_identifier,
    executor_key:executorKey,
    registered_standing_key:callable.registered_standing_key,
    registered_standing:adapter === "/buffer/c3/posts" ? "registered" : callable.registered_standing,
    lapzuli_callable:true,
    operator_confirmed:true,
    idempotency_key:`${distributionAssetKey}:${callable.registered_standing_key}`,
    text:outboundText,
    canonical_url:canonicalUrl,
    image_url:imageUrl,
    buffer_mode:"shareNow",
  }
  const called=await workerCall(env,adapter,requestBody)
  const body=called.body
  const ok=called.response?.ok === true && body.ok === true
  const effects=typeof body.external_publication_effects === "number" ? body.external_publication_effects : 0

  if (!dryRun) {
    const platformUrl=str(body.platform_url)
    const platformPostId=str(body.platform_post_id)
    const providerPostId=str(body.buffer_post_id) ?? str(body.buffer_update_id)
    const executionStatus=ok && effects === 1 ? (platformUrl ? "published" : "queued") : "failed"
    await supabaseFetch(env,"measures_distribution_execution",{
      method:"POST",
      headers:{Prefer:"return=minimal"},
      body:JSON.stringify({
        distribution_asset_id:distributionAssetKey,
        executor_key:executorKey,
        channel_key:channelKey,
        execution_status:executionStatus,
        execution_mode:"lapzuli_worker",
        attempt_number:prior.length+1,
        executed_at:new Date().toISOString(),
        published_at:executionStatus === "published" ? new Date().toISOString() : null,
        platform_post_id:platformPostId,
        platform_url:platformUrl,
        evidence:{
          route_key:route.route_key,
          adapter_path:adapter,
          adapter_standing:body.standing,
          request_identity:body.request_identity,
          provider_post_id:providerPostId,
          external_response_code:body.external_response_code,
          external_publication_effects:effects,
        },
        error:ok ? null : str(body.error) ?? str(body.standing) ?? "lapzuli_worker_execution_failed",
        created_by_actor_class:"AI",
        created_by_actor_key:"Chazz",
        approved_by_actor_class:"Human",
        approved_by_actor_key:"op044",
        metadata:{
          worker_identity:"dizzy_lapzuli_distribution_worker_v1",
          operator_surface:"/relational-operations/lapzuli",
          registered_standing_key:callable.registered_standing_key,
        },
        optics:{observes:"distribution_event",models_individuals_as_primary:false},
      }),
    })
  }

  return {status:ok ? (dryRun?200:201) : (called.response?.status ?? 502),body:{
    standing:ok ? (dryRun ? "ACT_PREFLIGHT" : "ACT") : "HLD",
    action:dryRun ? "preflight_asset" : "dispatch_asset",
    distribution_asset_key:distributionAssetKey,
    adapter,
    worker_result:body,
    external_publication_effects:dryRun ? 0 : effects,
  }}
}

export const onRequestGet: PagesFunction<Env> = async () =>
  json({contract:"lapzuli_distribution_actions_v1",actions:["resolve_campaign","preflight_asset","dispatch_asset"],external_publication_effects:0})

export const onRequestPost: PagesFunction<Env> = async ({request,env}) => {
  try {
    const body=record(await request.json().catch(()=>({})))
    const action=str(body.action)
    if (action === "resolve_campaign") {
      const campaignKey=str(body.campaign_key)
      if (!campaignKey) return json({standing:"HLD",reason:"campaign_key_required",external_publication_effects:0},400)
      const result=await resolveCampaign(env,campaignKey)
      return json(result.body,result.status)
    }
    if (action === "preflight_asset" || action === "dispatch_asset") {
      const assetKey=str(body.distribution_asset_key)
      if (!assetKey) return json({standing:"HLD",reason:"distribution_asset_key_required",external_publication_effects:0},400)
      const result=await dispatchAsset(env,assetKey,action === "preflight_asset")
      return json(result.body,result.status)
    }
    return json({standing:"HLD",reason:"unsupported_action",external_publication_effects:0},400)
  } catch(error) {
    return json({standing:"HLD",reason:"lapzuli_action_runtime_error",error:error instanceof Error?error.message:"unknown error",external_publication_effects:0},500)
  }
}

export const onRequest = async () => json({error:"method not allowed"},405)
