import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"
import {resolveInitiativeSurfaceHost} from "../_lib/initiative-surface-host"

type Row=Record<string,unknown>

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name){try{return decodeURIComponent(rest.join("="))}catch{return null}}
  }
  return null
}
function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
function headers(env:PassageEnv,extra:Record<string,string>={}){
  return {apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...extra}
}
async function read(env:PassageEnv,table:string,params:Record<string,string>){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v)
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("read_shape")
  return rows as Row[]
}
async function write(env:PassageEnv,table:string,body:unknown){
  const response=await fetch(base(env)+"/rest/v1/"+table,{
    method:"POST",headers:headers(env,{"content-type":"application/json",prefer:"return=representation"}),
    body:JSON.stringify(body),signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("write_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("write_shape")
  return rows as Row[]
}
function record(value:unknown):Row{
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Row:{}
}
async function initiativeConnectUrl(env:PassageEnv,initiativeKey:string){
  const rows=await read(env,"system_process_registry",{
    select:"process_key,status,process_status,metadata",
    process_family:"eq.c3_field",
    metadata:"cs."+JSON.stringify({initiative_key:initiativeKey,surface_type:"initiative_connect_surface"}),
    limit:"2"
  })
  if(rows.length!==1) throw new Error("initiative_surface_not_resolved")
  const metadata=record(rows[0].metadata)
  if(rows[0].status!=="active"||rows[0].process_status!=="active"||
     metadata.canonical!==true||metadata.binding_state!=="active"||
     metadata.release_state!=="released"||metadata.access_state!=="public")
    throw new Error("initiative_surface_not_resolved")
  const host=typeof metadata.canonical_host==="string"?metadata.canonical_host:""
  if(!host) throw new Error("initiative_surface_not_resolved")
  const resolved=await resolveInitiativeSurfaceHost(env,host)
  if(resolved.initiativeKey!==initiativeKey) throw new Error("initiative_surface_mismatch")
  return new URL(resolved.connectRoute,resolved.canonicalUrl)
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("environment_claim_required")
  const session=await resolveEnvironmentSession(raw,env)
  if(session.subjectType!=="individual") throw new Error("invite_subject_not_supported")
  return session
}
async function initiativeContext(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>,value:unknown){
  if(value===undefined||value===null||value==="") return null
  if(typeof value!=="string"||value.length>160) throw new Error("initiative_context_invalid")
  const response=await fetch(base(env)+"/rest/v1/rpc/resolve_c1me_visible_initiatives_internal",{
    method:"POST",headers:headers(env,{"content-type":"application/json"}),
    body:JSON.stringify({p_relationship_key:session.subjectKey}),signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("initiative_context_not_resolved")
  const result=await response.json() as Row
  if(result.resolution!=="existing_c1"||result.relationship_ref!==session.subjectKey||
     result.env_key!==session.envKey||result.envpac_ref!==session.envpacKey||
     result.initiative_resolution!=="envpac_resolved") throw new Error("initiative_context_not_resolved")
  const initiatives=Array.isArray(result.initiatives)?result.initiatives as Row[]:[]
  const row=initiatives.find(item=>item.initiative_key===value)
  if(!row) throw new Error("initiative_context_not_resolved")
  const contextClass=typeof row.context_class==="string"?row.context_class:"participant"
  if(contextClass==="operator"&&row.invite_context_allowed!==true) throw new Error("initiative_operator_invite_not_authorized")
  return {
    source_initiative_key:String(row.initiative_key),
    initiative_envpac_key:String(row.initiative_envpac_key),
    target_environment_key:typeof row.target_environment_key==="string"?row.target_environment_key:null,
    source_context_class:contextClass,
    source_visibility_class:String(row.visibility_source||contextClass),
    ...(typeof row.initiative_operator_binding_key==="string"
      ?{source_operator_binding_key:row.initiative_operator_binding_key}:{})
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const origin=request.headers.get("origin")
    if(origin&&origin!==new URL(request.url).origin) return json({ok:false,standing:"invite_origin_held"},403)
    const session=await sessionFor(request,env)
    const body=await request.json().catch(()=>null) as Record<string,unknown>|null
    if(!body) return json({ok:false,standing:"invite_intake_invalid"},400)
    const message=typeof body.message==="string"?body.message.trim():""
    if(message.length>1200) return json({ok:false,standing:"invite_message_too_long"},400)
    const initiative=await initiativeContext(env,session,body.source_initiative_key)
    const rows=await write(env,"c3_env_share_reference",{
      source_env_key:session.envKey,
      source_envpac_key:session.envpacKey,
      owner_subject_key:session.subjectKey,
      share_state:"active",
      metadata:{
        reference_class:"opaque_encounter_provenance",
        source_process:"c1me_relational_runtime_v1",
        relationship_created:false,
        standing_created:false,
        public_profile_created:false,
        personalized_invite:true,
        invite_message:message||null,
        ...(initiative||{})
      }
    })
    if(!rows[0]?.share_reference) throw new Error("invite_reference_unavailable")
    const shareReference=String(rows[0].share_reference)
    const publicUrl=initiative
      ?await initiativeConnectUrl(env,initiative.source_initiative_key)
      :new URL("/connect",env.C1_PUBLIC_ORIGIN||"https://c3field.online")
    publicUrl.searchParams.set("via",shareReference)
    const copyText=[message||null,"Connect here:\n"+publicUrl.toString()].filter(Boolean).join("\n\n")
    return json({
      ok:true,
      standing:"connection_invite_ready",
      public_url:publicUrl.toString(),
      copy_text:copyText,
      message:message||null,
      initiative_provenance:initiative,
      share_reference_class:"opaque_encounter_provenance",
      share_reference:shareReference,
      relationship_created:false,
      standing_created:false
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"invite_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:409
    return json({ok:false,standing:"connection_invite_held",reason},status)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
