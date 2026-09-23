import {json, MY_ENVIRONMENT_ORIGIN, readOwnerClaim, type PassageEnv} from "../_lib/c1-passage"
import {createEnvironmentSession,environmentSessionCookie} from "../_lib/env-session"

async function ensureCurrent(relationshipKey:string,env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/ensure_c1me_current_internal",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},
    body:JSON.stringify({p_relationship_key:relationshipKey})
  })
  if(!response.ok) throw new Error("current_unavailable")
  return response.json() as Promise<Record<string,unknown>>
}

export const onRequestPost: PagesFunction<PassageEnv> = async ({request,env}) => {
  try {
    const origin=new URL(request.url).origin
    const requestOrigin=request.headers.get("origin")
    if(requestOrigin!==origin || (origin!==MY_ENVIRONMENT_ORIGIN && origin!==env.C1_PUBLIC_ORIGIN))
      return json({accepted:false,message:"This environment link could not be verified."},403)
    if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
      return json({accepted:false,message:"This environment link could not be verified."},415)
    const body=await request.json().catch(()=>null) as {claim?:unknown}|null
    if(!body || typeof body.claim!=="string" || body.claim.length>4096)
      return json({accepted:false,message:"This environment link could not be verified."},400)
    const claim=await readOwnerClaim(body.claim,env)
    const current=await ensureCurrent(claim.relationshipKey,env)
    if(current.resolution!=="existing_c1" || current.env_key!==claim.envKey || current.envpac_ref!==claim.envpacKey) throw new Error("current_mismatch")
    const session=await createEnvironmentSession(claim,env)
    const response=json({accepted:true,next_url:"/my-environment"})
    response.headers.append("set-cookie",environmentSessionCookie(session.token))
    return response
  } catch {
    return json({accepted:false,message:"This environment link has expired or is unavailable."},409)
  }
}
export const onRequest: PagesFunction = async () => json({error:"method not allowed"},405)
