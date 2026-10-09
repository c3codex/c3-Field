import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

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

async function resolvePrimitives(relationshipKey:string,env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(
    env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_c1me_envpac_primitives_internal",
    {
      method:"POST",
      redirect:"manual",
      signal:AbortSignal.timeout(12000),
      headers:{
        apikey:env.SUPABASE_SERVICE_ROLE_KEY,
        authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
        "content-type":"application/json"
      },
      body:JSON.stringify({p_relationship_key:relationshipKey})
    }
  )
  if(!response.ok) throw new Error("primitive_resolver_unavailable")
  return response.json() as Promise<Record<string,unknown>>
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const raw=cookie(request,"c3_env_session")
    if(!raw) return json({authenticated:false,standing:"environment_claim_required"},401)
    const session=await resolveEnvironmentSession(raw,env)
    const result=await resolvePrimitives(session.subjectKey,env)
    if(result.resolution!=="existing_c1" ||
       result.relationship_ref!==session.subjectKey ||
       result.env_key!==session.envKey ||
       result.envpac_ref!==session.envpacKey ||
       result.component_resolution!=="envpac_resolved"){
      return json({authenticated:true,standing:"envpac_component_resolution_held"},409)
    }
    return json({
      authenticated:true,
      standing:"envpac_components_ready",
      env_key:result.env_key,
      envpac_key:result.envpac_ref,
      current_ref:result.current_ref,
      runtime_component_contract:result.runtime_component_contract,
      runtime_component_count:result.runtime_component_count,
      relational_condition_contract:result.relational_condition_contract,
      relational_condition_count:result.relational_condition_count,
      contextual_component_count:result.contextual_component_count,
      free_resolution_source:result.free_resolution_source,
      initiative_projection_rule:result.initiative_projection_rule,
      components:result.components,
      contextual_components:result.contextual_components,
      primitive_contract:result.primitive_contract,
      primitive_count:result.primitive_count,
      primitives:result.primitives,
      primitive_compatibility_deprecated:result.primitive_compatibility_deprecated
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"envpac_component_resolution_unavailable"
    const status=reason==="session_expired"||reason==="environment_claim_required"?401:503
    return json({authenticated:false,standing:"envpac_component_resolution_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
