import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

const PROFILE_HOST="my.c3field.online"

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}
function onProfileHost(request:Request){
  return new URL(request.url).hostname.toLowerCase()===PROFILE_HOST
}
async function rpc(env:PassageEnv,args:Record<string,unknown>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_profile_pac_v1_internal",{
    method:"POST",
    redirect:"manual",
    signal:AbortSignal.timeout(12000),
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
      "content-type":"application/json"
    },
    body:JSON.stringify(args)
  })
  if(!response.ok) throw new Error("profile_read_failed")
  return response.json() as Promise<Record<string,any>>
}

export const onRequestGet:PagesFunction<PassageEnv>=async ({request,env})=>{
  if(!onProfileHost(request)) return json({standing:"not_found"},404)
  try{
    const raw=cookie(request,"c3_env_session")
    if(!raw) return json({standing:"environment_session_required"},401)
    const owner=await resolveEnvironmentSession(raw,env)
    const truth=await rpc(env,{
      p_envpac_key:owner.envpacKey,
      p_subject_type:owner.subjectType,
      p_subject_key:owner.subjectKey
    })
    if(truth?.standing==="profile_not_formed"){
      return json({
        standing:"profile_not_formed",
        authorityCreated:false
      })
    }
    if(truth?.envpac_key!==owner.envpacKey||truth?.profile?.subject_key!==owner.subjectKey||
       truth?.profile?.subject_type!==owner.subjectType)
      return json({standing:"profile_pac_held",authorityCreated:false},409)

    const evaluation=truth.evaluation&&typeof truth.evaluation==="object"?truth.evaluation:{}
    if(evaluation.resolution_state!=="pass")
      return json({
        standing:"profile_pac_held",
        evaluation:{
          completeness_state:evaluation.completeness_state||"held",
          resolution_state:evaluation.resolution_state||"held",
          missing_required_fields:evaluation.missing_required_fields||[],
          missing_member_roles:evaluation.missing_member_roles||[],
          missing_relations:evaluation.missing_relations||[],
          release_blockers:evaluation.release_blockers||[]
        },
        authorityCreated:false
      },409)

    const members=Array.isArray(truth.members)?truth.members.map((member:Record<string,unknown>)=>({
      member_key:member.member_key,
      member_kind:member.member_kind,
      member_role:member.member_role,
      runtime_uri:member.runtime_uri||null,
      release_scope:member.release_scope||null,
      ordinal:member.ordinal||null
    })):[]
    return json({
      standing:"free_profile_pac_projection",
      profile:{
        profile_key:truth.profile.profile_key,
        profile_class:truth.profile.profile_class,
        display_label:truth.profile.display_label,
        visibility_scope:truth.profile.visibility_scope
      },
      pac:{
        pac_key:truth.pac_key,
        version:truth.version,
        standing:truth.standing,
        release_state:truth.release_state,
        architecture_version:truth.architecture_version,
        authority_effect:truth.authority_effect||"none"
      },
      members,
      evaluation:{
        completeness_state:evaluation.completeness_state,
        resolution_state:evaluation.resolution_state
      },
      authorityCreated:false
    })
  }catch{
    return json({standing:"environment_session_invalid",authorityCreated:false},401)
  }
}

export const onRequest:PagesFunction=async ()=>json({error:"method not allowed"},405)
