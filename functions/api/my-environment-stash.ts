import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"
import {createFreeNugServerRuntime} from "../_lib/free-nugs"
import {MY_STASH_NUG_KEY,myStashRequest} from "../_lib/my-stash"

function result(body:Record<string,unknown>,status=200){
  const response=json(body,status)
  response.headers.set("cache-control","private, no-store")
  response.headers.set("vary","Cookie")
  return response
}
export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  // All actions, including receipt-producing reads, require an explicit same-origin request.
  if(request.headers.get("origin")!==new URL(request.url).origin)
    return result({standing:"HLD",reason:"same_origin_required"},403)
  if(!request.headers.get("content-type")?.startsWith("application/json"))
    return result({standing:"HLD",reason:"json_request_required"},415)
  try{
    const source=request.headers.get("cookie")||""
    const raw=source.split(";").map(part=>part.trim()).find(part=>part.startsWith("c3_env_session="))
    if(!raw)return result({standing:"HLD",reason:"environment_session_required"},401)
    const session=await resolveEnvironmentSession(decodeURIComponent(raw.slice("c3_env_session=".length)),env)
    const body=await request.text()
    if(body.length>8192)return result({standing:"HLD",reason:"request_too_large"},413)
    const parsed:unknown=JSON.parse(body)
    if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))
      return result({standing:"HLD",reason:"participant_request_shape"},400)
    const input=parsed as Record<string,unknown>
    const requestKey=input.request_key
    if(typeof requestKey!=="string"||!/^[a-zA-Z0-9_-]{8,100}$/.test(requestKey))
      return result({standing:"HLD",reason:"request_key_required"},400)
    const {request_key:_,...participantInput}=input
    if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
    const query=new URLSearchParams({select:"nug_key,standing,spec",nug_key:"eq."+MY_STASH_NUG_KEY,limit:"2"})
    const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/c3ops_nug_binding?"+query,{
      redirect:"manual",signal:AbortSignal.timeout(12000),
      headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
    })
    if(!response.ok)throw new Error("binding_unavailable")
    const rows=await response.json() as Record<string,unknown>[]
    if(rows.length!==1)throw new Error("my_stash_binding_unresolved")
    const nug=myStashRequest(rows[0],session,participantInput)
    const runtime=createFreeNugServerRuntime(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY)
    const returned=await runtime.callNative(nug,"my_stash:"+session.envpacKey+":"+requestKey)
    return result(returned,returned.standing==="HLD"?409:200)
  }catch(error){
    const reason=error instanceof Error?error.message:"my_stash_unavailable"
    const allowed=["my_stash_session_binding_mismatch","my_stash_participant_request_boundary",
      "my_stash_authority_incomplete","my_stash_binding_unresolved"]
    return result({standing:"HLD",reason:allowed.includes(reason)?reason:"my_stash_unavailable"},409)
  }
}
export const onRequest:PagesFunction=async()=>result({standing:"HLD",reason:"method_not_allowed"},405)
