import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name){try{return decodeURIComponent(rest.join("="))}catch{return null}}
  }
  return null
}
async function resolveInitiatives(relationshipKey:string,env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_c1me_visible_initiatives_internal",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},
    body:JSON.stringify({p_relationship_key:relationshipKey})
  })
  if(!response.ok) throw new Error("initiative_resolver_unavailable")
  return response.json() as Promise<Record<string,unknown>>
}
export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const raw=cookie(request,"c3_env_session")
    if(!raw) return json({authenticated:false,standing:"environment_claim_required"},401)
    const session=await resolveEnvironmentSession(raw,env)
    const result=await resolveInitiatives(session.subjectKey,env)
    if(result.resolution!=="existing_c1"||
       result.relationship_ref!==session.subjectKey||
       result.env_key!==session.envKey||
       result.envpac_ref!==session.envpacKey||
       result.initiative_resolution!=="envpac_resolved"){
      return json({authenticated:true,standing:"initiative_projection_held",initiatives:[]},409)
    }
    return json({
      authenticated:true,
      standing:"initiative_projection_ready",
      free_resolution_source:result.free_resolution_source,
      initiatives:Array.isArray(result.initiatives)?result.initiatives:[]
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"initiative_projection_unavailable"
    const status=reason==="session_expired"||reason==="environment_claim_required"?401:503
    return json({authenticated:false,standing:"initiative_projection_held",reason,initiatives:[]},status)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
