import {json, type PassageEnv} from "./c1-passage"
export const unable = (status=409) => json({standing:"unable_to_process",saved:false,message:"We could not process this request. Please try again later."},status)
// These are platform bindings, never a per-isolate in-memory counter.
export async function permitRequest(request: Request, env: PassageEnv | undefined, route: string) {
  try {
    if (!env?.C1_REQUEST_LIMITER || !(request as Request & {cf?: unknown}).cf) return false
    const ip=request.headers.get("cf-connecting-ip")
    if (!ip || ip.length>64) return false
    const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(ip))
    const key=route+":"+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("")
    return (await env.C1_REQUEST_LIMITER.limit({key})).success === true
  } catch { return false }
}
export async function permitAttempt(env: PassageEnv | undefined, route: string, identity: string) {
  try {
    if (!env?.C1_ATTEMPT_LIMITER) return false
    const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(identity))
    const key=route+":"+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("")
    return (await env.C1_ATTEMPT_LIMITER.limit({key})).success === true
  } catch { return false }
}
