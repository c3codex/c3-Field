type Env={
  SUPABASE_URL?:string
  VITE_SUPABASE_URL?:string
  SUPABASE_SERVICE_ROLE_KEY?:string
  LAPZULI_DISTRIBUTION_WORKER_URL?:string
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN?:string
}

type Context={
  relationship_ref:string
  env_key:string
  envpac_ref:string
  current_ref:string
  operator_identifiers:string[]
}

const CONTRACT="c3ops_myenv_external_action_v1"
const headers={"content-type":"application/json; charset=utf-8","cache-control":"private, no-store"}

function reply(value:unknown,status=200){return new Response(JSON.stringify(value),{status,headers})}
function base(env:Env){const value=env.SUPABASE_URL??env.VITE_SUPABASE_URL;if(!value||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("registry_not_configured");return value.replace(/\/$/,"")}
function clean(value:unknown){return typeof value==="string"?value.trim():""}
function obj(value:unknown){return value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{}}

async function registry(env:Env,path:string,init:RequestInit={}){
  const key=env.SUPABASE_SERVICE_ROLE_KEY!
  const response=await fetch(base(env)+"/rest/v1/"+path,{
    ...init,redirect:"manual",signal:AbortSignal.timeout(15000),
    headers:{apikey:key,authorization:"Bearer "+key,...(init.headers||{})}
  })
  if(!response.ok)throw new Error("registry_read_failed")
  return response
}

async function resolveGate(env:Env,ctx:Context){
  const current=await (await registry(env,"rpc/resolve_c1me_current_internal",{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({p_relationship_key:ctx.relationship_ref})
  })).json() as Record<string,unknown>
  if(current.resolution!=="existing_c1"||current.env_key!==ctx.env_key||current.envpac_ref!==ctx.envpac_ref||current.current_ref!==ctx.current_ref)
    throw new Error("current_mismatch")

  const q=new URLSearchParams({
    select:"capability_key,scope,standing",
    envpac_key:"eq."+ctx.envpac_ref,
    system_key:"eq.c3ops",
    capability:"eq.external_action",
    standing:"eq.active",
    limit:"1"
  })
  const rows=await (await registry(env,"c3_envpac_capability_grant?"+q)).json() as Array<Record<string,unknown>>
  const capability=rows[0]
  if(!capability)throw new Error("capability_held")
  return obj(capability.scope)
}

async function readDistribution(env:Env,key:string){
  const q=new URLSearchParams({select:"*",distribution_asset_key:"eq."+key,limit:"1"})
  const rows=await (await registry(env,"measures_publication_distribution_asset?"+q)).json() as Array<Record<string,unknown>>
  const row=rows[0]
  if(!row)throw new Error("distribution_not_found")
  return row
}

async function duplicateExists(env:Env,key:string){
  const q=new URLSearchParams({
    select:"execution_id,execution_status,evidence,created_at",
    distribution_asset_id:"eq."+key,
    order:"created_at.desc",
    limit:"25"
  })
  const rows=await (await registry(env,"measures_distribution_execution?"+q)).json() as Array<Record<string,unknown>>
  return rows.some(row=>{
    const status=clean(row.execution_status)
    const evidence=obj(row.evidence)
    const effects=Number(evidence.external_effect_count??obj(evidence.provider_response).external_publication_effects??0)
    return effects>0||["queued","scheduled","published","released","publication_attempted","publication_uncertain"].includes(status)
  })
}

async function persistExecution(env:Env,row:Record<string,unknown>){
  const key=env.SUPABASE_SERVICE_ROLE_KEY!
  const response=await fetch(base(env)+"/rest/v1/measures_distribution_execution",{
    method:"POST",signal:AbortSignal.timeout(15000),
    headers:{apikey:key,authorization:"Bearer "+key,"content-type":"application/json",prefer:"return=minimal"},
    body:JSON.stringify(row)
  })
  if(!response.ok)throw new Error("execution_evidence_write_failed")
}

function workerUrl(env:Env){
  const raw=clean(env.LAPZULI_DISTRIBUTION_WORKER_URL)
  if(!raw)throw new Error("worker_runtime_missing")
  const url=new URL(raw)
  if(url.protocol!=="https:")throw new Error("worker_runtime_invalid")
  return url
}

async function dispatch(env:Env,payload:Record<string,unknown>){
  const token=clean(env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN)
  if(!token)throw new Error("worker_control_missing")
  const url=new URL("/bluesky/c3/posts",workerUrl(env))
  const response=await fetch(url.toString(),{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(45000),
    headers:{authorization:"Bearer "+token,"content-type":"application/json",accept:"application/json"},
    body:JSON.stringify(payload)
  })
  const body=await response.json().catch(()=>null) as Record<string,unknown>|null
  if(!body)throw new Error("worker_contract_invalid")
  return{response,body}
}

function readContext(body:Record<string,unknown>):Context|null{
  const context=obj(body.context)
  const operatorIdentifiers=Array.isArray(context.operator_identifiers)?context.operator_identifiers.filter(v=>typeof v==="string"&&v):[]
  if(!clean(context.relationship_ref)||!clean(context.env_key)||!clean(context.envpac_ref)||!clean(context.current_ref)||!operatorIdentifiers.length)return null
  return{
    relationship_ref:clean(context.relationship_ref),
    env_key:clean(context.env_key),
    envpac_ref:clean(context.envpac_ref),
    current_ref:clean(context.current_ref),
    operator_identifiers:operatorIdentifiers as string[]
  }
}

async function eligibleActions(env:Env,scope:Record<string,unknown>){
  const allowedTargets=Array.isArray(scope.allowed_targets)?scope.allowed_targets.filter(v=>typeof v==="string"):[]
  if(!allowedTargets.length)return[]
  const q=new URLSearchParams({select:"distribution_asset_key,campaign_asset_id,publication_asset_id,campaign_id,platform,status,review_status,payload,metadata",platform:"eq.bluesky",limit:"100"})
  const rows=await (await registry(env,"measures_publication_distribution_asset?"+q)).json() as Array<Record<string,unknown>>
  return rows.filter(row=>{
    const metadata=obj(row.metadata)
    return row.status==="ready_for_external_action"&&row.review_status==="approved"&&metadata.external_post_execution_authorized===true&&allowedTargets.includes(clean(metadata.destination_key))
  }).map(row=>{
    const metadata=obj(row.metadata)
    const payload=obj(row.payload)
    return{
      distribution_asset_id:row.distribution_asset_key,
      campaign_asset_key:row.campaign_asset_id,
      campaign_id:row.campaign_id,
      target_key:metadata.destination_key,
      destination_label:metadata.destination_label,
      canonical_url:payload.canonical_url,
      caption:payload.caption,
      state:"READY"
    }
  })
}

export const onRequest:PagesFunction<Env>=async({request,env})=>{
  try{
    if(new URL(request.url).hostname!=="c3ops.c3field.online")return reply({standing:"DNR",reason:"host_boundary",external_effects:0},404)
    const currentHeader=clean(request.headers.get("x-c3-current-ref"))
    const envpacHeader=clean(request.headers.get("x-c3-envpac-ref"))

    if(request.method==="GET"){
      const relationship=clean(request.headers.get("x-c3-relationship-ref"))
      const envKey=clean(request.headers.get("x-c3-env-key"))
      const operators=(request.headers.get("x-c3-operator-identifiers")||"").split(",").map(v=>v.trim()).filter(Boolean)
      const ctx={relationship_ref:relationship,env_key:envKey,envpac_ref:envpacHeader,current_ref:currentHeader,operator_identifiers:operators}
      if(!relationship||!envKey||!envpacHeader||!currentHeader||!operators.length)return reply({standing:"DNR",reason:"runtime_context_invalid",external_effects:0},400)
      const scope=await resolveGate(env,ctx)
      return reply({standing:"ACT",runtime:"c3ops_external_action_v1",actions:await eligibleActions(env,scope),external_effects:0})
    }

    if(request.method!=="POST")return reply({standing:"DNR",reason:"method_not_allowed",external_effects:0},405)
    if((request.headers.get("content-type")||"").split(";")[0].trim()!=="application/json")return reply({standing:"DNR",reason:"json_required",external_effects:0},415)

    const body=await request.json() as Record<string,unknown>
    if(body.contract!==CONTRACT)return reply({standing:"DNR",reason:"contract_mismatch",external_effects:0},400)
    const ctx=readContext(body)
    if(!ctx||ctx.current_ref!==currentHeader||ctx.envpac_ref!==envpacHeader)return reply({standing:"DNR",reason:"runtime_context_invalid",external_effects:0},400)

    const scope=await resolveGate(env,ctx)
    const action=obj(body.action)
    const distributionAssetId=clean(action.distribution_asset_id)
    const idempotencyKey=clean(action.idempotency_key)
    if(!distributionAssetId||!idempotencyKey||action.operator_confirmed!==true||action.execute!==true)
      return reply({standing:"DNR",reason:"action_contract_invalid",external_effects:0},400)

    const dist=await readDistribution(env,distributionAssetId)
    const metadata=obj(dist.metadata)
    const payload=obj(dist.payload)
    const allowedTargets=Array.isArray(scope.allowed_targets)?scope.allowed_targets.filter(v=>typeof v==="string"):[]
    const targetKey=clean(metadata.destination_key)

    if(dist.platform!=="bluesky"||dist.status!=="ready_for_external_action"||dist.review_status!=="approved"||metadata.external_post_execution_authorized!==true)
      return reply({standing:"HLD",reason:"distribution_not_released_for_external_action",external_effects:0},409)
    if(!allowedTargets.includes(targetKey))return reply({standing:"HLD",reason:"target_not_in_envpac_capability_scope",external_effects:0},403)
    if(await duplicateExists(env,distributionAssetId))return reply({standing:"HLD",reason:"duplicate_or_prior_external_effect",external_effects:0},409)

    const derivativeKey=clean(payload.caption_derivative_key)
    const caption=clean(payload.caption)
    const canonicalUrl=clean(payload.canonical_url)
    if(!derivativeKey||!caption||!canonicalUrl)return reply({standing:"HLD",reason:"distribution_payload_incomplete",external_effects:0},409)

    const requestPayload={
      target_key:targetKey,
      publication_object_key:clean(dist.publication_asset_id),
      campaign_asset_key:clean(dist.campaign_asset_id),
      derivative_key:derivativeKey,
      distribution_asset_id:distributionAssetId,
      authority_reference:clean(metadata.campaign_pac_key)||clean(dist.campaign_id),
      idempotency_key:idempotencyKey,
      text:caption,
      canonical_url:canonicalUrl,
      lapzuli_callable:true,
      operator_confirmed:true,
      dry_run:false,
      execute:true
    }

    const result=await dispatch(env,requestPayload)
    const success=result.response.ok&&result.body.standing==="ACT"&&Number(result.body.external_publication_effects)===1
    const now=new Date().toISOString()
    await persistExecution(env,{
      distribution_asset_id:distributionAssetId,
      executor_key:"bluesky_api",
      execution_mode:"external_action",
      execution_status:success?"published":"held",
      attempt_number:1,
      executed_at:now,
      published_at:success?now:null,
      platform_post_id:result.body.platform_post_id??null,
      platform_url:result.body.platform_url??null,
      source_oar2:clean(metadata.active_execution_oar2)||clean(metadata.campaign_pac_key)||"myenv_external_action",
      created_by_actor_class:"AI",
      created_by_actor_key:"c3ops_external_action_v1",
      approved_by_actor_class:"Human",
      approved_by_actor_key:ctx.operator_identifiers[0],
      evidence:{
        disposition:success?"ACT":"HLD",
        provider_response:result.body,
        current_ref:ctx.current_ref,
        envpac_ref:ctx.envpac_ref,
        external_effect_count:success?1:0
      },
      metadata:{idempotency_key:idempotencyKey,target_key:targetKey,execution_surface:"my_env"}
    })

    return reply({
      standing:success?"ACT":"HLD",
      runtime:"c3ops_external_action_v1",
      action_state:success?"ACT":"HLD",
      executor:"c3_bluesky_worker",
      distribution_asset_id:distributionAssetId,
      evidence:result.body,
      external_effects:success?1:0
    },success?200:409)
  }catch(error){
    const reason=error instanceof Error?error.message:"external_action_unavailable"
    const standing=reason==="current_mismatch"?"DNR":"HLD"
    return reply({standing,reason,external_effects:0},standing==="DNR"?409:503)
  }
}
