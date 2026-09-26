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


async function finalizeInviteAcceptance(relationshipKey:string,envKey:string,envpacKey:string,env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/finalize_c1me_invite_connections_internal",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},
    body:JSON.stringify({p_target_relationship_key:relationshipKey,p_target_env_key:envKey,p_target_envpac_key:envpacKey})
  })
  if(!response.ok) throw new Error("invite_acceptance_unavailable")
  return response.json() as Promise<Record<string,unknown>>
}

type ConfirmationRow={
  dispatch_key:string
  connection_key:string
  recipient_email:string
  recipient_display_name:string|null
  counterpart_display_name:string|null
  dispatch_state:string
  attempt_count:number
}

function esc(value:string){
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char))
}

async function pendingConfirmations(connectionKeys:string[],env:PassageEnv){
  if(!connectionKeys.length||!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return [] as ConfirmationRow[]
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/c3_env_connection_confirmation_outbox")
  url.searchParams.set("select","dispatch_key,connection_key,recipient_email,recipient_display_name,counterpart_display_name,dispatch_state,attempt_count")
  url.searchParams.set("connection_key","in.("+connectionKeys.map(key=>'"'+key.replace(/"/g,"")+'"').join(",")+")")
  url.searchParams.set("dispatch_state","in.(pending,failed)")
  const response=await fetch(url.toString(),{
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
    redirect:"manual",signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) return []
  const rows=await response.json()
  return Array.isArray(rows)?rows as ConfirmationRow[]:[]
}

async function markConfirmation(row:ConfirmationRow,state:"sent"|"failed",env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/c3_env_connection_confirmation_outbox")
  url.searchParams.set("dispatch_key","eq."+row.dispatch_key)
  await fetch(url.toString(),{
    method:"PATCH",headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
      "content-type":"application/json","prefer":"return=minimal"
    },
    body:JSON.stringify({
      dispatch_state:state,
      attempt_count:(row.attempt_count||0)+1,
      last_attempt_at:new Date().toISOString(),
      ...(state==="sent"?{sent_at:new Date().toISOString()}: {})
    }),
    redirect:"manual",signal:AbortSignal.timeout(12000)
  }).catch(()=>null)
}

async function dispatchConnectionConfirmations(inviteAcceptance:Record<string,unknown>,env:PassageEnv){
  if(!env.C3_RESEND_API_KEY||!env.C1_VERIFICATION_FROM)return
  const connections=Array.isArray(inviteAcceptance.connections)?inviteAcceptance.connections as Array<Record<string,unknown>>:[]
  const connectionKeys=connections.map(item=>typeof item.connection_key==="string"?item.connection_key:"").filter(Boolean)
  const rows=await pendingConfirmations(connectionKeys,env)
  for(const row of rows){
    const recipient=row.recipient_display_name?.trim()||"there"
    const counterpart=row.counterpart_display_name?.trim()||"another c3Field environment"
    const link=MY_ENVIRONMENT_ORIGIN+"/"
    const subject="c3Field | Connection confirmed"
    const text=`Hi ${recipient},

Your connection with ${counterpart} is now active in c3Field.

Open My Environment:
${link}

This confirmation reflects an existing persisted connection. It does not create additional standing or authority.

Connect · Contribute · Create`
    const html=`<!doctype html><html><body style="margin:0;background:#111416;color:#f3efe7;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:36px 28px"><p style="letter-spacing:.16em;font-size:12px">c3 COMMUNITY PARTNERS</p><h1 style="font-family:Georgia,serif;font-weight:400">Connection confirmed.</h1><p>Hi ${esc(recipient)},</p><p>Your connection with <strong>${esc(counterpart)}</strong> is now active in c3Field.</p><p><a href="${esc(link)}" style="display:inline-block;padding:14px 20px;background:#f1eee5;color:#111;text-decoration:none;font-weight:700">OPEN MY ENVIRONMENT →</a></p><p style="font-size:12px;color:#88939b">This confirmation reflects an existing persisted connection. It does not create additional standing or authority.</p><p>Connect · Contribute · Create</p></div></body></html>`
    try{
      const response=await fetch("https://api.resend.com/emails",{
        method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
        headers:{"content-type":"application/json",authorization:"Bearer "+env.C3_RESEND_API_KEY,"idempotency-key":"c3-connection-confirmation-"+row.dispatch_key},
        body:JSON.stringify({from:env.C1_VERIFICATION_FROM,to:[row.recipient_email],subject,text,html})
      })
      const body=await response.json().catch(()=>null)
      await markConfirmation(row,response.ok&&body&&typeof body==="object"&&typeof (body as Record<string,unknown>).id==="string"?"sent":"failed",env)
    }catch{
      await markConfirmation(row,"failed",env)
    }
  }
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
    const inviteAcceptance=await finalizeInviteAcceptance(claim.relationshipKey,claim.envKey,claim.envpacKey,env).catch(()=>({finalized:false,reason_code:"invite_acceptance_unavailable"}))
    await dispatchConnectionConfirmations(inviteAcceptance,env).catch(()=>null)
    const response=json({accepted:true,next_url:"/my-environment",invite_acceptance:inviteAcceptance})
    response.headers.append("set-cookie",environmentSessionCookie(session.token))
    return response
  } catch {
    return json({accepted:false,message:"This environment link has expired or is unavailable."},409)
  }
}
export const onRequest: PagesFunction = async () => json({error:"method not allowed"},405)
