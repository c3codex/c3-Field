import {json, readOwnerClaim, type PassageEnv} from "../_lib/c1-passage"
import {createEnvironmentSession,environmentSessionCookie} from "../_lib/env-session"

export const onRequestPost: PagesFunction<PassageEnv> = async ({request,env}) => {
  try {
    const origin=new URL(request.url).origin
    if(request.headers.get("origin")!==origin || request.headers.get("origin")!==env.C1_PUBLIC_ORIGIN)
      return json({accepted:false,message:"This environment link could not be verified."},403)
    if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
      return json({accepted:false,message:"This environment link could not be verified."},415)
    const body=await request.json().catch(()=>null) as {claim?:unknown}|null
    if(!body || typeof body.claim!=="string" || body.claim.length>4096)
      return json({accepted:false,message:"This environment link could not be verified."},400)
    const claim=await readOwnerClaim(body.claim,env)
    const session=await createEnvironmentSession(claim,env)
    const response=json({accepted:true,next_url:"/my-environment"})
    response.headers.append("set-cookie",environmentSessionCookie(session.token))
    return response
  } catch {
    return json({accepted:false,message:"This environment link has expired or is unavailable."},409)
  }
}
export const onRequest: PagesFunction = async () => json({error:"method not allowed"},405)
