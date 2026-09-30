import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"

type Row=Record<string,unknown>

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
function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
function headers(env:PassageEnv,extra:Record<string,string>={}){
  return {
    apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
    authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,
    ...extra
  }
}
async function rest(env:PassageEnv,path:string,init:RequestInit={}){
  const response=await fetch(base(env)+"/rest/v1/"+path,{
    ...init,
    headers:headers(env,init.headers as Record<string,string>||{}),
    redirect:"manual",
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("my_pacs_registry_unavailable")
  return response
}
async function rpc(env:PassageEnv,name:string,body:Record<string,unknown>){
  const response=await rest(env,"rpc/"+name,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify(body)
  })
  return await response.json() as Record<string,unknown>
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("environment_claim_required")
  const session=await resolveEnvironmentSession(raw,env)
  if(session.subjectType!=="individual") throw new Error("personal_custody_required")
  return session
}
function record(value:unknown){
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{}
}
async function personalPacs(env:PassageEnv,session:EnvironmentSession){
  const query=new URLSearchParams({
    select:"pac_key,pac_type,version,standing,release_state,custody_uri,custodian_subject_type,custodian_subject_key,custody_provider,metadata,updated_at",
    envpac_key:"eq."+session.envpacKey,
    custodian_subject_type:"eq.individual",
    custodian_subject_key:"eq."+session.subjectKey,
    is_effective:"eq.true",
    order:"updated_at.desc"
  })
  const rows=await (await rest(env,"c3_pac?"+query)).json() as Row[]
  return rows
    .filter(row=>record(record(row.metadata).custody_model).custody_class==="personal_pac_custody")
    .map(row=>{
      const metadata=record(row.metadata)
      const presentation=record(metadata.public_presentation)
      const approval=record(metadata.custody_approval)
      return {
        pac_key:row.pac_key,
        pac_type:row.pac_type,
        version:row.version,
        standing:row.standing,
        release_state:row.release_state,
        custody_uri:row.custody_uri,
        custody_provider:row.custody_provider,
        title:typeof presentation.title==="string"?presentation.title:
          row.pac_type==="ProfilePAC"?"ProfilePAC":String(row.pac_key||"PAC"),
        subtitle:typeof presentation.subtitle==="string"?presentation.subtitle:null,
        approval:{
          standing:typeof approval.standing==="string"?approval.standing:"PENDING",
          resolved_at:typeof approval.resolved_at==="string"?approval.resolved_at:null,
          c2_projection_eligible:approval.c2_projection_eligible===true
        },
        custody_model:metadata.custody_model
      }
    })
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const pacs=await personalPacs(env,session)
    return json({
      authenticated:true,
      standing:"my_pacs_ready",
      custody_class:"personal_pac_custody",
      approval_surface:"my_pacs",
      c2_projection_rule:"approved_pacs_only",
      pacs
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"my_pacs_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:
      reason==="personal_custody_required"?403:503
    return json({authenticated:false,standing:"my_pacs_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const origin=request.headers.get("origin")
    if(origin&&origin!==new URL(request.url).origin)
      return json({standing:"DNR",reason:"origin_held"},403)

    const session=await sessionFor(request,env)
    const body=await request.json().catch(()=>null) as Record<string,unknown>|null
    if(!body) return json({standing:"DNR",reason:"invalid_request"},400)

    const pacKey=typeof body.pac_key==="string"?body.pac_key:""
    const disposition=typeof body.disposition==="string"?body.disposition:""
    const note=typeof body.note==="string"?body.note.slice(0,1000):null
    if(!pacKey||!["APPROVED","HLD"].includes(disposition))
      return json({standing:"DNR",reason:"invalid_disposition"},400)

    const result=await rpc(env,"c3_pac_set_personal_disposition_v1",{
      p_pac_key:pacKey,
      p_subject_key:session.subjectKey,
      p_disposition:disposition,
      p_note:note
    })
    return json(result,result.standing==="ACT"||result.standing==="HLD"?200:409)
  }catch(error){
    const reason=error instanceof Error?error.message:"my_pacs_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:
      reason==="personal_custody_required"?403:503
    return json({standing:"DNR",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({standing:"DNR",reason:"method_not_allowed"},405)
