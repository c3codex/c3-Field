import {beginExistingInitiative322,json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"
import {resolveInitiativeSurfaceHost} from "../_lib/initiative-surface-host"

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name){try{return decodeURIComponent(rest.join("="))}catch{return null}}
  }
  return null
}
function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function activeVisibility(env:PassageEnv,relationshipKey:string,initiativeKey:string){
  const url=new URL(base(env)+"/rest/v1/c3_env_initiative_visibility")
  url.searchParams.set("select","visibility_key,initiative_key,standing")
  url.searchParams.set("relationship_key","eq."+relationshipKey)
  url.searchParams.set("initiative_key","eq."+initiativeKey)
  url.searchParams.set("standing","eq.active")
  url.searchParams.set("revoked_at","is.null")
  url.searchParams.set("limit","1")
  const response=await fetch(url.toString(),{
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!},
    redirect:"manual",signal:AbortSignal.timeout(12000)
  })
  if(!response.ok)throw new Error("visibility_read_failed")
  const rows=await response.json() as Array<Record<string,unknown>>
  return rows[0]||null
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const origin=request.headers.get("origin")
    if(origin&&origin!==new URL(request.url).origin)
      return json({ok:false,standing:"initiative_connection_origin_held"},403)
    if((request.headers.get("content-type")||"").split(";")[0].trim()!=="application/json")
      return json({ok:false,standing:"initiative_connection_json_required"},415)
    const raw=cookie(request,"c3_env_session")
    if(!raw)return json({ok:false,standing:"environment_claim_required"},401)
    const session=await resolveEnvironmentSession(raw,env)
    const body=await request.json().catch(()=>null) as Record<string,unknown>|null
    if(!body||Object.keys(body).some(key=>key!=="initiative_key")||body.initiative_key!=="47pct")
      return json({ok:false,standing:"initiative_connection_not_supported"},400)

    const existing=await activeVisibility(env,session.subjectKey,"47pct")
    if(existing)
      return json({ok:true,standing:"initiative_connection_active",initiative_key:"47pct"})

    const surface=await resolveInitiativeSurfaceHost(env,"47pct.c3field.online")
    if(surface.initiativeKey!=="47pct")
      return json({ok:false,standing:"initiative_surface_mismatch"},409)

    const result=await beginExistingInitiative322({
      relationshipKey:session.subjectKey,
      initiativeKey:"47pct",
      sourceHost:surface.host,
      metadata:{
        surface_key:surface.surfaceKey,
        webpac_key:surface.webpacKey,
        source_env_key:session.envKey,
        source_envpac_key:session.envpacKey,
        initiated_from:"my_environment_connections"
      }
    },env)
    return json({ok:true,...result},202)
  }catch(error){
    const reason=error instanceof Error?error.message:"initiative_connection_unavailable"
    const status=reason==="session_expired"||reason==="environment_claim_required"?401:409
    return json({ok:false,standing:"initiative_connection_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
