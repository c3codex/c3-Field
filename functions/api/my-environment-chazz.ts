import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"
import {resolveC1MeOperatorContext} from "../_lib/c1me-operator-context"

type ChazzEnv=PassageEnv&{
  OPERATOR_DISPATCH_KEY?:string
}

type RuntimeContext={
  relationship_ref:string
  env_key:string
  envpac_ref:string
  current_ref:string
  operator_identifiers:string[]
  capability_scope:Record<string,unknown>
  rooted_system_key:string
  runtime_ref:string
}

const C3OPS_ORIGIN="https://c3ops.c3field.online"
const CONTRACT="c3ops_myenv_chazz_v1"

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name){
      try{return decodeURIComponent(rest.join("="))}catch{return null}
    }
  }
  return null
}

function serverConfig(env:ChazzEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}

async function dbFetch(env:ChazzEnv,path:string,init:RequestInit={}){
  const response=await fetch(serverConfig(env)+"/rest/v1/"+path,{
    ...init,
    redirect:"manual",
    signal:AbortSignal.timeout(15000),
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,
      ...(init.headers||{})
    }
  })
  if(!response.ok)throw new Error("registry_read_failed")
  return response
}

async function resolveCurrent(session:EnvironmentSession,env:ChazzEnv){
  const response=await dbFetch(env,"rpc/resolve_c1me_current_internal",{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({p_relationship_key:session.subjectKey})
  })
  const current=await response.json() as Record<string,unknown>
  if(current.resolution!=="existing_c1"||
     current.relationship_ref!==session.subjectKey||
     current.envpac_ref!==session.envpacKey||
     current.env_key!==session.envKey||
     typeof current.current_ref!=="string"||
     !current.current_ref)throw new Error("current_mismatch")
  return current
}

async function resolveCapability(session:EnvironmentSession,env:ChazzEnv){
  const q=new URLSearchParams({
    select:"capability_key,scope,standing",
    envpac_key:"eq."+session.envpacKey,
    system_key:"eq.c3ops",
    capability:"eq.chazz_conversation",
    standing:"eq.active",
    limit:"1"
  })
  const rows=await (await dbFetch(env,"c3_envpac_capability_grant?"+q)).json() as Array<Record<string,unknown>>
  const row=rows[0]
  if(!row||!row.scope||typeof row.scope!=="object"||Array.isArray(row.scope))throw new Error("capability_held")
  return row.scope as Record<string,unknown>
}

async function resolveRoot(session:EnvironmentSession,env:ChazzEnv){
  const q=new URLSearchParams({
    select:"rooted_system_key,runtime_ref,standing,metadata",
    envpac_key:"eq."+session.envpacKey,
    system_key:"eq.c3ops",
    relation_role:"eq.supporting_system",
    standing:"eq.active",
    limit:"1"
  })
  const rows=await (await dbFetch(env,"c3_envpac_rooted_system?"+q)).json() as Array<Record<string,unknown>>
  const row=rows[0]
  if(!row||typeof row.rooted_system_key!=="string"||typeof row.runtime_ref!=="string"||!row.runtime_ref)
    throw new Error("runtime_root_held")
  const runtime=new URL(row.runtime_ref)
  if(runtime.origin!==C3OPS_ORIGIN||runtime.pathname!=="/api/chazz")throw new Error("runtime_root_invalid")
  return{rootedSystemKey:row.rooted_system_key,runtimeRef:row.runtime_ref}
}

async function runtime(request:Request,env:ChazzEnv):Promise<RuntimeContext>{
  if(new URL(request.url).hostname!=="my.c3field.online")throw new Error("host_boundary")
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new Error("session_required")
  const session=await resolveEnvironmentSession(raw,env)
  if(session.subjectType!=="individual")throw new Error("subject_type_invalid")

  const [current,operatorContext,capability,root]=await Promise.all([
    resolveCurrent(session,env),
    resolveC1MeOperatorContext(session.subjectKey,env),
    resolveCapability(session,env),
    resolveRoot(session,env)
  ])

  if(operatorContext.resolution!=="operator_context_resolved"||
     operatorContext.relationship_ref!==session.subjectKey||
     operatorContext.env_key!==session.envKey||
     operatorContext.envpac_ref!==session.envpacKey||
     operatorContext.current_ref!==current.current_ref||
     !operatorContext.operator_count||
     !operatorContext.operators?.length)throw new Error("operator_context_held")

  const operatorIdentifiers=operatorContext.operators
    .map(row=>row.operator_identifier)
    .filter((value):value is string=>typeof value==="string"&&!!value)

  if(!operatorIdentifiers.length)throw new Error("operator_context_held")
  if(!env.OPERATOR_DISPATCH_KEY)throw new Error("c3ops_credential_missing")

  return{
    relationship_ref:session.subjectKey,
    env_key:session.envKey,
    envpac_ref:session.envpacKey,
    current_ref:String(current.current_ref),
    operator_identifiers:operatorIdentifiers,
    capability_scope:capability,
    rooted_system_key:root.rootedSystemKey,
    runtime_ref:root.runtimeRef
  }
}

function publicHold(error:unknown){
  const code=error instanceof Error?error.message:"runtime_unavailable"
  if(code==="session_required"||code==="session_expired"||code==="session_shape"||code==="owner_grant"||code==="owner_grant_expired")
    return{standing:"HLD",reason:"My Environment owner session is not active.",status:401}
  if(code==="current_mismatch")
    return{standing:"DNR",reason:"CURRENT did not resolve for this environment.",status:409}
  if(code==="operator_context_held"||code==="subject_type_invalid")
    return{standing:"HLD",reason:"c3Ops operator context is not active for this environment.",status:403}
  if(code==="capability_held"||code==="runtime_root_held"||code==="runtime_root_invalid")
    return{standing:"HLD",reason:"Chazz is not admitted to this EnvPAC.",status:409}
  if(code==="c3ops_credential_missing")
    return{standing:"HLD",reason:"c3Ops runtime authentication is not configured.",status:503}
  return{standing:"HLD",reason:"The c3Ops Chazz runtime did not resolve.",status:502}
}

async function callC3Ops(request:Request,env:ChazzEnv,ctx:RuntimeContext,message?:string){
  const upstream=new URL("/api/chazz",C3OPS_ORIGIN)
  const init:RequestInit={
    method:message===undefined?"GET":"POST",
    redirect:"manual",
    signal:AbortSignal.timeout(120000),
    headers:{
      accept:"application/json",
      "x-operator-dispatch-key":env.OPERATOR_DISPATCH_KEY!,
      "x-c3-contract":CONTRACT,
      "x-c3-current-ref":ctx.current_ref,
      "x-c3-envpac-ref":ctx.envpac_ref
    }
  }
  if(message!==undefined){
    ;(init.headers as Record<string,string>)["content-type"]="application/json"
    init.body=JSON.stringify({
      contract:CONTRACT,
      message,
      context:{
        relationship_ref:ctx.relationship_ref,
        env_key:ctx.env_key,
        envpac_ref:ctx.envpac_ref,
        current_ref:ctx.current_ref,
        operator_identifiers:ctx.operator_identifiers,
        capability_scope:ctx.capability_scope,
        rooted_system_key:ctx.rooted_system_key
      }
    })
  }

  const response=await fetch(upstream.toString(),init)
  const payload=await response.json().catch(()=>null) as Record<string,unknown>|null
  if(!payload||typeof payload!=="object")throw new Error("c3ops_runtime_held")
  const standing=String(payload.standing||"")
  if(!["ACT","HLD","DNR"].includes(standing))throw new Error("c3ops_contract_invalid")
  if(!response.ok&&standing==="ACT")throw new Error("c3ops_contract_invalid")
  return payload
}

export const onRequestGet:PagesFunction<ChazzEnv>=async({request,env})=>{
  try{
    const ctx=await runtime(request,env)
    const payload=await callC3Ops(request,env,ctx)
    return json({
      standing:payload.standing,
      runtime:payload.runtime||"chazz_runtime",
      reason:payload.reason,
      messages:Array.isArray(payload.messages)?payload.messages:[],
      current:"resolved",
      capability:"chazz_conversation",
      mutation_authority:false,
      external_effect_authority:false
    },String(payload.standing)==="ACT"?200:409)
  }catch(error){
    const out=publicHold(error)
    return json({standing:out.standing,runtime:"chazz_held",reason:out.reason,messages:[],mutation_authority:false,external_effect_authority:false},out.status)
  }
}

export const onRequestPost:PagesFunction<ChazzEnv>=async({request,env})=>{
  try{
    if((request.headers.get("content-type")||"").split(";")[0].trim()!=="application/json")
      return json({standing:"DNR",reason:"Expected JSON input."},415)
    const body=await request.json() as Record<string,unknown>
    if(Object.keys(body).some(key=>key!=="message")||typeof body.message!=="string"||!body.message.trim()||body.message.length>12000)
      return json({standing:"DNR",reason:"Message did not resolve to the bounded Chazz input contract."},400)

    const ctx=await runtime(request,env)
    const payload=await callC3Ops(request,env,ctx,body.message.trim())
    const standing=String(payload.standing)
    return json({
      standing,
      runtime:payload.runtime||"chazz_turn",
      reason:payload.reason,
      message:typeof payload.message==="string"?payload.message:undefined,
      current:"resolved",
      capability:"chazz_conversation",
      mutation_authority:false,
      external_effect_authority:false,
      evidence:payload.evidence&&typeof payload.evidence==="object"?payload.evidence:undefined
    },standing==="ACT"?200:409)
  }catch(error){
    const out=publicHold(error)
    return json({standing:out.standing,runtime:"chazz_turn_held",reason:out.reason,mutation_authority:false,external_effect_authority:false},out.status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
