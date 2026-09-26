import {json,type PassageEnv} from "../_lib/c1-passage"
import {createScopedEnvironmentSession,resolveEnvironmentSession,scopedEnvironmentSessionCookie} from "../_lib/env-session"

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
function headers(env:PassageEnv){
  return {apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!}
}
async function read(env:PassageEnv,table:string,params:Record<string,string>){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [key,value] of Object.entries(params)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("read_shape")
  return rows as Row[]
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const url=new URL(request.url)
    const initiative=url.searchParams.get("initiative")
    if(initiative!=="47pct") return json({ok:false,standing:"initiative_c2_access_not_registered"},404)

    const raw=cookie(request,"c3_env_session")
    if(!raw) return json({ok:false,standing:"environment_claim_required"},401)
    const owner=await resolveEnvironmentSession(raw,env)

    const rows=await read(env,"c3_env_initiative_visibility",{
      select:"visibility_key,relationship_key,env_key,envpac_key,initiative_key,initiative_envpac_key,target_environment_key,visibility_source,standing,revoked_at",
      relationship_key:"eq."+owner.subjectKey,
      env_key:"eq."+owner.envKey,
      envpac_key:"eq."+owner.envpacKey,
      initiative_key:"eq.47pct",
      initiative_envpac_key:"eq.c3envpac_c2me_v0_1",
      target_environment_key:"eq.env_c3_community_contribute",
      standing:"eq.active",
      revoked_at:"is.null",
      limit:"1"
    })
    const visibility=rows[0]
    if(!visibility) return json({ok:false,standing:"c2_participant_relation_required"},403)

    const scoped=await createScopedEnvironmentSession({
      subjectType:owner.subjectType,
      subjectKey:owner.subjectKey,
      targetEnvKey:"env_c3_community_contribute",
      targetEnvpacKey:"c3envpac_c2me_v0_1",
      relationRole:"consumer",
      initiativeKey:"47pct",
      sourceEnvKey:owner.envKey,
      sourceEnvpacKey:owner.envpacKey
    },env)

    const destination=new URL("/c2?initiative=47pct",request.url)
    return new Response(null,{
      status:302,
      headers:{
        location:destination.toString(),
        "set-cookie":scopedEnvironmentSessionCookie("c3_c2_session",scoped.token),
        "cache-control":"no-store"
      }
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"c2_access_unavailable"
    const status=reason==="session_expired"||reason==="environment_claim_required"?401:
      reason.includes("grant")?403:503
    return json({ok:false,standing:"c2_access_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
