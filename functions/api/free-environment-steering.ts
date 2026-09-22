import {type PassageEnv} from "../_lib/c1-passage"

// FREE calls Registry persistence before choosing an environmental projection.
// This is steering, not an encounter, an identity assertion or a CURRENT writer.
const HEADERS={"content-type":"application/json; charset=utf-8",
  "cache-control":"no-store","x-content-type-options":"nosniff"}
export function boundedSteeringProjection(value:unknown):Response{
  const result=value&&typeof value==="object"&&!Array.isArray(value)
    ? value as Record<string,unknown> : {}
  // Never expose a foreign/private Registry identity from a held response.
  if(result.steering!=="environment_resolved" || result.render_permitted!==true)
    return new Response(JSON.stringify({steering:"held",reason_code:
      typeof result.reason_code==="string" && [
        "route_not_registered","public_environment_unresolved",
        "steering_source_not_registered","current_unresolved",
        "current_environment_mismatch","current_evidence_unresolved",
        "public_projection_not_released",
        "public_relations_not_registered"
      ].includes(result.reason_code)?result.reason_code:"public_projection_unavailable",
      render_permitted:false,encounter_created:false}),{status:409,headers:HEADERS})
  // Only explicitly registered public material could be projected here; no
  // arbitrary backend payload, private relations or target redirect passes.
  if(typeof result.environment_key!=="string" ||
     typeof result.current_key!=="string" ||
     result.relation_projection!=="registered_public" ||
     !Array.isArray(result.public_relations))
    return boundedSteeringProjection({steering:"held",reason_code:"public_relations_not_registered"})
  return new Response(JSON.stringify({
    steering:"environment_resolved",environment_key:result.environment_key,
    current_key:result.current_key,public_relations:result.public_relations,
    render_permitted:true,encounter_created:false
  }),{status:200,headers:HEADERS})
}
export const onRequestGet:PagesFunction<PassageEnv>=async ({request,env})=>{
  const route=new URL(request.url).searchParams.get("route")||"/"
  if(!["/","/connect"].includes(route))
    return boundedSteeringProjection({steering:"held",reason_code:"route_not_registered"})
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)
    return boundedSteeringProjection({steering:"held",reason_code:"configuration_unavailable"})
  try{
    const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+
      "/rest/v1/rpc/free_resolve_public_environment_steering",{
      method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
      headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,
        authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
        "content-type":"application/json"},
      body:JSON.stringify({p_route:route})
    })
    if(!response.ok) throw new Error("registry_unavailable")
    return boundedSteeringProjection(await response.json())
  }catch{
    return boundedSteeringProjection({steering:"held",reason_code:"registry_unavailable"})
  }
}
export const onRequest:PagesFunction=async()=>
  new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:HEADERS})
