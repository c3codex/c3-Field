import { resolveLapzuliFreeRoute, type Read } from "../../_lib/lapzuli-free-runtime"

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

const BLUESKY_CHANNELS = new Set(["bluesky_measures_registry","bluesky_undrifted","bluesky_c3_field","bluesky_c3_partners"])

const C3_BUFFER_CHANNELS = new Set([
  "c3_facebook_page",
  "c3_facebook_group",
  "c3_instagram",
])

const DEFAULT_WORKER_URL = "https://lapzuli-distribution-worker.c3field.workers.dev"
const C3OPS_HOST = "c3ops.c3field.online"
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
  const headers=new Headers(init.headers)
  headers.set("apikey",key)
  headers.set("authorization",`Bearer ${key}`)
  headers.set("content-type","application/json")
  const response = await fetch(`${base.replace(/\/$/,"")}/rest/v1/${path}`,{
    ...init,
    headers,redirect:"manual",signal:AbortSignal.timeout(15000),
  })
  const body = await response.text()
  if (!response.ok) throw new Error(body || `Supabase request failed: ${response.status}`)
  return (body ? JSON.parse(body) : undefined) as T
}

function adapterFor(channelKey: string | null, executorKey: string | null) {
  if (!channelKey) return null
  if (executorKey === "bluesky_api" && BLUESKY_CHANNELS.has(channelKey)) return "/bluesky/posts"
  if (executorKey === "paragraph_api" && channelKey === "paragraph_undrifted") return "/paragraph/posts"
  if (executorKey !== "buffer") return null
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
    if (adapter === "/bluesky/posts") return ["measuresregistry.com","c3field.online","mdm.c3field.online","47pct.c3field.online"].includes(url.hostname)
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
  const activeAssetKeys = Array.isArray(campaignMetadata.lapzuli_active_asset_keys)
    ? new Set(campaignMetadata.lapzuli_active_asset_keys.map(str).filter((key): key is string=>Boolean(key)))
    : null

  const eligible: Array<{asset:Row; derivative:Row; channel:Row; executor:Row; derivativeKey:string; channelKey:string; executorKey:string; adapter:string; canonicalUrl:string; imageUrl:string|null; text:string}> = []
  const held: Array<Record<string,unknown>> = []

  for (const asset of assets) {
    const assetKey = str(asset.distribution_asset_key) ?? "unresolved_asset"
    if (activeAssetKeys?.size && !activeAssetKeys.has(assetKey)) {
      held.push({distribution_asset_key:assetKey,blockers:["outside_active_distribution_scope"]})
      continue
    }
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
    const imageUrl = str(payload.image_url) ?? str(record(payload.media).runtime_uri) ?? publicMediaUrl(env,payload)
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
        desk_key:"campaign_distribution",
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
        desk_key:"campaign_distribution",
        outlet_key:item.adapter === "/bluesky/posts" ? "bluesky" : item.channelKey,
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

async function workerRequest(env: Env, path: string, method: "GET"|"POST" = "POST", payload?: Row) {
  const token = env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN
  if (!token) return {response:null,body:{ok:false,standing:"held_lapzuli_control_token_missing",external_publication_effects:0}}
  const base=(env.LAPZULI_DISTRIBUTION_WORKER_URL ?? DEFAULT_WORKER_URL).replace(/\/$/,"")
  const response=await fetch(base+path,{
    method,redirect:"manual",signal:AbortSignal.timeout(20000),
    headers:{authorization:`Bearer ${token}`,...(method==="POST"?{"content-type":"application/json"}:{})},
    ...(method==="POST"?{body:JSON.stringify(payload ?? {})}:{}),
  })
  if(response.status>=300&&response.status<400) return {response:null,body:{ok:false,standing:"held_worker_redirect",external_publication_effects:0}}
  return {response,body:record(await response.json().catch(()=>({})))}
}

export async function preflightLapzuliRoute(env:Env,routeKey:string) {
  const read:Read=async(table,select,filters={})=>{
    const query=new URLSearchParams({select,...filters,limit:"501"})
    const rows=await supabaseFetch<Row[]>(env,table+"?"+query)
    if(!Array.isArray(rows)||rows.length>500)throw new Error("route_evidence_incomplete")
    return rows
  }
  return resolveLapzuliFreeRoute(read,routeKey,async(path,method="GET",payload)=>{
    try{
      const called=await workerRequest(env,path,method,payload)
      return {ok:called.response?.ok===true&&called.body.ok===true,body:called.body}
    }catch{return {ok:false,body:{standing:"held_current_provider_probe_unavailable",external_publication_effects:0}}}
  })
}

async function verifyBlueskyIdentities(env: Env) {
  const identities = [
    ["measures_registry","/verify/bluesky/measures"],
    ["undrifted","/verify/bluesky/undrifted"],
    ["c3_field","/verify/bluesky/c3-field"],
    ["c3_community_partners","/verify/bluesky/c3-partners"],
  ] as const
  const results=[]
  for (const [identity,path] of identities) {
    const called=await workerRequest(env,path,"GET")
    const body=called.body
    results.push({identity,ok:called.response?.ok===true && body.ok===true,handle:str(body.handle),did:str(body.did),worker_http_status:called.response?.status ?? null,external_publication_effects:0})
  }
  const allVerified=results.every(result=>result.ok)
  return {status:allVerified?200:409,body:{standing:allVerified?"ACT":"HLD",action:"verify_bluesky_identities",verified_count:results.filter(result=>result.ok).length,total_count:results.length,identities:results,external_publication_effects:0}}
}

async function workerCall(env: Env, path: string, payload: Row) {
  return workerRequest(env,path,"POST",payload)
}

async function dispatchAsset(env: Env, distributionAssetKey: string, dryRun: boolean) {
  const bindingAssets=await supabaseFetch<Row[]>(env,`measures_publication_distribution_asset?distribution_asset_key=eq.${encodeURIComponent(distributionAssetKey)}&select=metadata&limit=1`)
  const bindingRouteKey=str(record(bindingAssets[0]?.metadata).route_key)
  if(!bindingRouteKey)return {status:409,body:{standing:"HLD",reason:"registered_asset_route_binding_missing",external_publication_effects:0}}
  const binding=await preflightLapzuliRoute(env,bindingRouteKey)
  if(binding.standing!=="EXECUTABLE")return {status:409,body:{...binding,action:dryRun?"preflight_asset":"dispatch_asset"}}
  const callableRows=await supabaseFetch<Row[]>(env,
    `lapzuli_derivative_execution_view_v1?distribution_asset_key=eq.${encodeURIComponent(distributionAssetKey)}&select=*&limit=1`)
  const callable:Row|undefined=callableRows[0] ?? (binding.executor_key === "paragraph_api" ? {lapzuli_callable:true,channel_key:binding.channel_key,executor_key:binding.executor_key,channel_identifier:binding.channel_identifier,registered_operator:binding.registered_operator,registered_standing_key:bindingRouteKey,registered_standing:"registered"} : undefined)
  if (!callable || callable.lapzuli_callable !== true) {
    return {status:409,body:{standing:"HLD",reason:"registered_derivative_binding_unresolved",distribution_asset_key:distributionAssetKey,external_publication_effects:0}}
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
    row.execution_status === "queued" ||
    row.execution_status === "publication_uncertain" ||
    row.platform_url ||
    row.platform_post_id ||
    record(row.evidence).external_publication_effects === 1
  )
  if (priorEffect && !dryRun) {
    return {status:409,body:{standing:"HLD",reason:"distribution_asset_already_has_or_may_have_external_effect",distribution_asset_key:distributionAssetKey,execution_id:priorEffect.execution_id,platform_url:priorEffect.platform_url,external_publication_effects:0}}
  }

  const channelKey=str(callable.channel_key)
  const executorKey=str(callable.executor_key)
  const operatorKey=str(callable.registered_operator)
  const adapter=adapterFor(channelKey,executorKey)
  if (!adapter) {
    return {status:409,body:{standing:"HLD",reason:"worker_adapter_not_callable",channel_key:channelKey,executor_key:executorKey,external_publication_effects:0}}
  }
  if (!channelKey || !executorKey || !operatorKey) {
    return {status:409,body:{standing:"HLD",reason:"execution_identity_unresolved",channel_key:channelKey,executor_key:executorKey,operator_key:operatorKey,external_publication_effects:0}}
  }

  const canonicalUrl=str(callable.canonical_url) ?? str(payload.canonical_url) ?? str(route.canonical_url)
  const textValue=str(payload.text) ?? str(payload.caption)
  const imageUrl=str(payload.image_url) ?? str(record(payload.media).runtime_uri) ?? publicMediaUrl(env,payload)
  if (!canonicalUrl || (executorKey === "paragraph_api" ? !str(payload.title)||!str(payload.body_markdown)||!str(payload.slug) : !textValue)) {
    return {status:409,body:{standing:"HLD",reason:"resolved_payload_incomplete",external_publication_effects:0}}
  }
  const outboundText=textValue?.includes(canonicalUrl) ? textValue : `${textValue}\n\n${canonicalUrl}`
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
    authority_reference:route.authority_reference,
    route_key:route.route_key,
    operator_confirmed:true,
    lapzuli_callable:true,
    idempotency_key:`${distributionAssetKey}:${callable.registered_standing_key}`,
    text:outboundText,
    canonical_url:canonicalUrl,
    image_url:imageUrl,
    buffer_mode:"shareNow",
    ...(executorKey === "paragraph_api" ? {title:payload.title,body_markdown:payload.body_markdown,slug:payload.slug,sendNewsletter:false} : {}),
  }

  let executionId:string|null=null
  let attemptNumber:number|null=null
  if (!dryRun) {
    const claims=await supabaseFetch<Row[]>(env,"rpc/claim_lapzuli_distribution_execution_v1",{
      method:"POST",
      body:JSON.stringify({
        p_distribution_asset_id:distributionAssetKey,
        p_executor_key:executorKey,
        p_channel_key:channelKey,
        p_route_key:str(route.route_key),
        p_operator:operatorKey,
      }),
    })
    const claim=claims[0]
    if (!claim || claim.claimed !== true) {
      return {status:409,body:{
        standing:"HLD",
        reason:str(claim?.reason) ?? "dispatch_claim_not_acquired",
        distribution_asset_key:distributionAssetKey,
        execution_id:claim?.execution_id ?? null,
        external_publication_effects:0,
      }}
    }
    executionId=str(claim.execution_id)
    attemptNumber=typeof claim.attempt_number === "number" ? claim.attempt_number : null
    if (!executionId) {
      return {status:500,body:{standing:"HLD",reason:"dispatch_claim_execution_id_unresolved",distribution_asset_key:distributionAssetKey,external_publication_effects:0}}
    }
  }

  let called:{response:Response|null;body:Row}
  try {
    called=await workerCall(env,adapter,{...requestBody,atomic_execution_id:executionId})
  } catch(error) {
    if (executionId) {
      await supabaseFetch(env,`measures_distribution_execution?execution_id=eq.${encodeURIComponent(executionId)}`,{
        method:"PATCH",
        headers:{Prefer:"return=minimal"},
        body:JSON.stringify({
          execution_status:"publication_uncertain",
          error:"lapzuli_worker_transport_outcome_uncertain",
          evidence:{
            route_key:route.route_key,
            adapter_path:adapter,
            effect_state:"unknown",
            external_publication_effects:null,
          },
          metadata:{
            worker_identity:"dizzy_lapzuli_distribution_worker_v1",
            operator_surface:"/relational-operations/lapzuli",
            registered_standing_key:callable.registered_standing_key,
            requires_operator_resolution:true,
            automatic_retry_allowed:false,
          },
          updated_at:new Date().toISOString(),
        }),
      })
    }
    return {status:502,body:{
      standing:"HLD",
      reason:"worker_transport_outcome_uncertain",
      distribution_asset_key:distributionAssetKey,
      execution_id:executionId,
      error:error instanceof Error?error.message:"unknown worker transport error",
      external_publication_effects:null,
    }}
  }

  const body=called.body
  const ok=called.response?.ok === true && body.ok === true
  const effects=typeof body.external_publication_effects === "number" ? body.external_publication_effects : null

  if (!dryRun && executionId) {
    const platformUrl=str(body.platform_url)
    const platformPostId=str(body.platform_post_id)
    const providerPostId=str(body.buffer_post_id) ?? str(body.buffer_update_id)
    const executionStatus=effects === 1
      ? (platformUrl ? "published" : "queued")
      : effects === 0 ? "failed" : "publication_uncertain"
    await supabaseFetch(env,`measures_distribution_execution?execution_id=eq.${encodeURIComponent(executionId)}`,{
      method:"PATCH",
      headers:{Prefer:"return=minimal"},
      body:JSON.stringify({
        execution_status:executionStatus,
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
          effect_state:effects === 1 ? "provider_effect_confirmed" : effects === 0 ? "no_external_effect_confirmed" : "unknown",
        },
        error:ok ? null : str(body.error) ?? str(body.standing) ?? "lapzuli_worker_execution_failed",
        metadata:{
          worker_identity:"dizzy_lapzuli_distribution_worker_v1",
          operator_surface:"/relational-operations/lapzuli",
          registered_standing_key:callable.registered_standing_key,
          dispatch_claim:"atomic_v1",
          automatic_retry_allowed:effects === 0,
        },
        updated_at:new Date().toISOString(),
      }),
    })
  }

  const workerReason =
    str(body.reason) ??
    str(body.error) ??
    (!ok ? str(body.standing) : null) ??
    (!ok ? `worker_http_${called.response?.status ?? 502}` : null)

  return {status:ok ? (dryRun?200:201) : (called.response?.status ?? 502),body:{
    standing:ok ? (dryRun ? "ACT_PREFLIGHT" : "ACT") : "HLD",
    reason:workerReason,
    action:dryRun ? "preflight_asset" : "dispatch_asset",
    distribution_asset_key:distributionAssetKey,
    execution_id:executionId,
    attempt_number:attemptNumber,
    adapter,
    worker_http_status:called.response?.status ?? null,
    worker_standing:str(body.standing),
    worker_result:body,
    external_publication_effects:dryRun ? 0 : effects,
  }}
}

export const onRequestGet: PagesFunction<Env> = async ({request}) => {
  if (new URL(request.url).hostname !== C3OPS_HOST) return json({error:"not_found"},404)
  return json({contract:"lapzuli_distribution_actions_v1",actions:["verify_bluesky_identities","resolve_campaign","preflight_route","preflight_asset","dispatch_asset"],external_publication_effects:0})
}

export async function handleLapzuliAction(request: Request, env: Env) {
  if (new URL(request.url).hostname !== C3OPS_HOST) return json({error:"not_found"},404)
  try {
    const body=record(await request.json().catch(()=>({})))
    const action=str(body.action)
    if(action === "preflight_route"){
      const routeKey=str(body.route_key)
      if(!routeKey || !/^[a-zA-Z0-9_-]{1,200}$/.test(routeKey))return json({standing:"HLD",reason:"exact_route_key_required",external_publication_effects:0},400)
      const binding=await preflightLapzuliRoute(env,routeKey)
      return json(binding,binding.standing==="EXECUTABLE"?200:409)
    }
    if (action === "verify_bluesky_identities") {
      const result=await verifyBlueskyIdentities(env)
      return json(result.body,result.status)
    }
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

export const onRequestPost: PagesFunction<Env> = ({request,env}) => handleLapzuliAction(request,env)

export const onRequest = async () => json({error:"method not allowed"},405)
