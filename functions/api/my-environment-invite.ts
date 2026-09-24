import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

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
  const rows=await read(env,"c3_env_initiative_visibility",{
    select:"initiative_key,initiative_envpac_key,target_environment_key,visibility_source",
    relationship_key:"eq."+session.subjectKey,
    env_key:"eq."+session.envKey,
    envpac_key:"eq."+session.envpacKey,
    initiative_key:"eq."+value,
    standing:"eq.active",
    revoked_at:"is.null",
    limit:"1"
  })
  const row=rows[0]
  if(!row) throw new Error("initiative_context_not_resolved")
  return {
    source_initiative_key:String(row.initiative_key),
    initiative_envpac_key:String(row.initiative_envpac_key),
    target_environment_key:typeof row.target_environment_key==="string"?row.target_environment_key:null,
    source_visibility_class:String(row.visibility_source||"encounter")
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
    const publicOrigin=env.C1_PUBLIC_ORIGIN||"https://c3field.online"
    const publicUrl=new URL("/connect",publicOrigin)
    publicUrl.searchParams.set("via",shareReference)
    return json({
      ok:true,
      standing:"connection_invite_ready",
      public_url:publicUrl.toString(),
      message:message||null,
      initiative_provenance:initiative,
      share_reference_class:"opaque_encounter_provenance",
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
