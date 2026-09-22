import {type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

// Diagnostic CURRENT-aware re-entry projection; does not mutate C1, CURRENT or EnvPac.
// The browser never provides a subject key. A live owner session is verified first.
const headers={"content-type":"application/json; charset=utf-8","cache-control":"no-store"}
function reply(body:Record<string,unknown>,status=200){
  return new Response(JSON.stringify(body),{status,headers})
}
function sessionCookie(request:Request){
  const part=(request.headers.get("cookie")||"").split(";").map(s=>s.trim())
    .find(s=>s.startsWith("c3_env_session="))
  if(!part) return null
  try{return decodeURIComponent(part.slice("c3_env_session=".length))}catch{return null}
}
// Pure decision boundary: a current resolved under another owner session is
// never permission to enter that environment. Client receives no owner IDs.
export function authorizeResolvedCurrent(
  session:{subjectKey:string;envKey:string;envpacKey:string},
  result:Record<string,unknown>
):Response{
  if(result.resolution!=="existing_c1")
    return reply({resolution:"reconciliation_hold",
      reason_code:typeof result.reason_code==="string"?result.reason_code:"current_unresolved",
      may_create_personal_environment:false},409)
  if(result.relationship_ref!==session.subjectKey ||
    result.envpac_ref!==session.envpacKey ||
    result.env_key!==session.envKey)
    return reply({resolution:"reconciliation_hold",reason_code:"session_environment_mismatch",
      may_create_personal_environment:false},409)
  if(typeof result.current_ref!=="string"||!result.current_ref)
    return reply({resolution:"reconciliation_hold",reason_code:"current_unresolved",
      may_create_personal_environment:false},409)
  return reply({resolution:"existing_c1",next_encounter:"enter_existing_environment",
    current_ref:result.current_ref,may_create_personal_environment:false})
}
export const onRequestGet:PagesFunction<PassageEnv>=async ({request,env})=>{
  try{
    const raw=sessionCookie(request)
    if(!raw) return reply({resolution:"auth_required",reason_code:"environment_session_required"},401)
    const session=await resolveEnvironmentSession(raw,env)
    if(session.subjectType!=="individual") return reply({resolution:"reconciliation_hold",reason_code:"subject_type_invalid"},409)
    if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("configuration")
    const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_c1me_current_internal",{
      method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
      headers:{"apikey":env.SUPABASE_SERVICE_ROLE_KEY,
        "authorization":"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
        "content-type":"application/json"},
      body:JSON.stringify({p_relationship_key:session.subjectKey})
    })
    if(!response.ok) throw new Error("resolver_unavailable")
    const result=await response.json() as Record<string,unknown>
    return authorizeResolvedCurrent(session,result)

  }catch{
    return reply({resolution:"auth_required",reason_code:"environment_session_or_current_unavailable"},401)
  }
}
export const onRequest:PagesFunction=async ()=>reply({error:"method_not_allowed"},405)
