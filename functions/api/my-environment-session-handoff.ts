import {MY_ENVIRONMENT_ORIGIN,signedOwnerClaim,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"
import {resolveC1MeOperatorContext} from "../_lib/c1me-operator-context"

const headers={
  "cache-control":"no-store",
  "referrer-policy":"no-referrer",
  "x-content-type-options":"nosniff",
}

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

async function resolveCurrent(session:EnvironmentSession,env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_c1me_current_internal",{
    method:"POST",
    redirect:"manual",
    signal:AbortSignal.timeout(12000),
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
      "content-type":"application/json"
    },
    body:JSON.stringify({p_relationship_key:session.subjectKey})
  })
  if(!response.ok) throw new Error("current_unavailable")
  const current=await response.json() as Record<string,unknown>
  if(current.resolution!=="existing_c1" ||
     current.relationship_ref!==session.subjectKey ||
     current.env_key!==session.envKey ||
     current.envpac_ref!==session.envpacKey ||
     typeof current.current_ref!=="string" ||
     !current.current_ref)
    throw new Error("current_mismatch")
  return current
}

function held(message:string,status=401){
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>My Environment</title><body style="font-family:system-ui;background:#111416;color:#f3efe7;margin:0"><main style="max-width:640px;margin:12vh auto;padding:32px"><p style="letter-spacing:.14em;font-size:12px">c3 COMMUNITY PARTNERS</p><h1 style="font-family:Georgia,serif;font-weight:400">My Environment</h1><p>${message}</p><p><a style="color:#f3efe7" href="https://my.c3field.online/api/my-environment-access-link">Email me a secure access link</a></p><p><a style="color:#f3efe7" href="https://my.c3field.online/">Return to My Environment</a></p></main></body></html>`,
    {status,headers:{...headers,"content-type":"text/html; charset=utf-8"}}
  )
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const url=new URL(request.url)
    if(url.hostname!=="c3field.online"&&url.hostname!=="www.c3field.online")
      return new Response("not found",{status:404,headers})
    const raw=cookie(request,"c3_env_session")
    if(!raw) return held("This browser does not have an active c3Field owner session to carry forward. No new Connect relationship was created.")
    const session=await resolveEnvironmentSession(raw,env)
    if(session.subjectType!=="individual") return held("This session cannot be used for an individual My Environment handoff.",409)
    const current=await resolveCurrent(session,env)
    const operatorContext=await resolveC1MeOperatorContext(session.subjectKey,env)
    if(operatorContext.resolution==="operator_context_held")
      return held("The existing environment resolved, but its governed operator boundary is currently held.",409)
    if(operatorContext.relationship_ref!==session.subjectKey ||
       operatorContext.env_key!==session.envKey ||
       operatorContext.envpac_ref!==session.envpacKey ||
       operatorContext.current_ref!==current.current_ref)
      return held("The existing environment could not be matched across the return boundary.",409)

    const claim=await signedOwnerClaim(session.subjectKey,session.envKey,session.envpacKey,env)
    const location=MY_ENVIRONMENT_ORIGIN+"/my-environment#claim="+encodeURIComponent(claim)
    return new Response(null,{status:302,headers:{...headers,location}})
  }catch{
    return held("Your existing c3Field session could not be carried forward. No new Connect relationship was created.",401)
  }
}

export const onRequest:PagesFunction=async()=>new Response("method not allowed",{status:405,headers:{...headers,allow:"GET"}})
