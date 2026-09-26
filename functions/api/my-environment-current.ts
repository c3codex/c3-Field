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
function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const raw=cookie(request,"c3_env_session")
    if(!raw)return json({authenticated:false,standing:"environment_claim_required"},401)
    const session=await resolveEnvironmentSession(raw,env)
    const response=await fetch(base(env)+"/rest/v1/rpc/resolve_c1me_current_tokens_internal",{
      method:"POST",
      headers:{
        apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
        authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,
        "content-type":"application/json"
      },
      body:JSON.stringify({p_relationship_key:session.subjectKey}),
      signal:AbortSignal.timeout(12000)
    })
    if(!response.ok)throw new Error("current_resolution_failed")
    const resolved=await response.json() as Record<string,unknown>
    const tokens=Array.isArray(resolved.tokens)?resolved.tokens:[]
    return json({
      authenticated:true,
      standing:resolved.CURRENT_resolution==="resolved"?"CURRENT_resolved":"CURRENT_held",
      semantics:"retained_relational_environment_token",
      current_state_ref:resolved.current_state_ref||resolved.current_ref||null,
      token_count:tokens.length,
      tokens,
      current_state_distinct:true,
      c1_projection:"relation_lights",
      c2_projection:"map_when_location_qualified",
      location_inference_allowed:false
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"current_unavailable"
    return json({authenticated:false,standing:"CURRENT_held",reason},reason==="session_expired"?401:503)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
