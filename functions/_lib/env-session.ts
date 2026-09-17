import {type PassageEnv} from "./c1-passage"

type OwnerClaim={relationshipKey:string;envKey:string;envpacKey:string;expires:number}
export type EnvironmentSession={
  token:string
  envKey:string
  envpacKey:string
  subjectType:string
  subjectKey:string
  expiresAt:string
  migratedFromClaim?:boolean
}

const SESSION_TTL_MS=30*24*60*60*1000
const encoder=new TextEncoder()
const hex=(bytes:ArrayBuffer|Uint8Array)=>Array.from(bytes instanceof Uint8Array?bytes:new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("")

async function sha256(value:string){
  return hex(await crypto.subtle.digest("SHA-256",encoder.encode(value)))
}
function projectUrl(env:PassageEnv){
  if(!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rest(env:PassageEnv,path:string,init:RequestInit={}){
  const response=await fetch(projectUrl(env)+"/rest/v1/"+path,{
    ...init,
    redirect:"manual",
    signal:AbortSignal.timeout(12000),
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,
      ...(init.headers||{})
    }
  })
  if(!response.ok) throw new Error("session_store")
  return response
}
async function activeOwnerGrant(env:PassageEnv,envpacKey:string,subjectKey:string,now=Date.now()){
  const q=new URLSearchParams({
    select:"grant_key,subject_type,subject_key,relation_role,standing,expires_at,revoked_at",
    envpac_key:"eq."+envpacKey,
    subject_key:"eq."+subjectKey,
    relation_role:"eq.owner",
    standing:"eq.active",
    revoked_at:"is.null",
    limit:"1"
  })
  const rows=await (await rest(env,"c3_envpac_access_grant?"+q)).json() as Array<Record<string,unknown>>
  const grant=rows[0]
  if(!grant) throw new Error("owner_grant")
  if(typeof grant.expires_at==="string" && Date.parse(grant.expires_at)<=now) throw new Error("owner_grant_expired")
  return grant
}
function runtimeToken(){
  const bytes=new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return hex(bytes)
}
export function environmentSessionCookie(token:string,maxAgeSeconds=Math.floor(SESSION_TTL_MS/1000)){
  return "c3_env_session="+encodeURIComponent(token)+"; Path=/; Max-Age="+maxAgeSeconds+"; HttpOnly; Secure; SameSite=Lax"
}
export async function createEnvironmentSession(claim:OwnerClaim,env:PassageEnv,source="owner_claim_exchange"):Promise<EnvironmentSession>{
  const grant=await activeOwnerGrant(env,claim.envpacKey,claim.relationshipKey)
  const token=runtimeToken()
  const tokenHash=await sha256(token)
  const expiresAt=new Date(Date.now()+SESSION_TTL_MS).toISOString()
  await rest(env,"c3_env_runtime_session",{
    method:"POST",
    headers:{"content-type":"application/json","prefer":"return=minimal"},
    body:JSON.stringify({
      token_sha256:tokenHash,
      envpac_key:claim.envpacKey,
      env_key:claim.envKey,
      subject_type:grant.subject_type||"individual",
      subject_key:claim.relationshipKey,
      standing:"active",
      expires_at:expiresAt,
      evidence_ref:grant.grant_key||null,
      metadata:{source,claim_used_as_bootstrap_only:true,authority_created:false,custody_transfer:false}
    })
  })
  return {token,envKey:claim.envKey,envpacKey:claim.envpacKey,subjectType:String(grant.subject_type||"individual"),subjectKey:claim.relationshipKey,expiresAt}
}
export async function resolveEnvironmentSession(token:string,env:PassageEnv):Promise<EnvironmentSession>{
  if(!/^[a-f0-9]{64}$/.test(token)) throw new Error("session_shape")
  const tokenHash=await sha256(token)
  const q=new URLSearchParams({
    select:"session_key,envpac_key,env_key,subject_type,subject_key,standing,expires_at,revoked_at",
    token_sha256:"eq."+tokenHash,
    standing:"eq.active",
    revoked_at:"is.null",
    limit:"1"
  })
  const rows=await (await rest(env,"c3_env_runtime_session?"+q)).json() as Array<Record<string,unknown>>
  const row=rows[0]
  if(!row || typeof row.expires_at!=="string" || Date.parse(row.expires_at)<=Date.now()) throw new Error("session_expired")
  await activeOwnerGrant(env,String(row.envpac_key),String(row.subject_key))
  if(typeof row.session_key==="string"){
    const p=new URLSearchParams({session_key:"eq."+row.session_key})
    await rest(env,"c3_env_runtime_session?"+p,{method:"PATCH",headers:{"content-type":"application/json","prefer":"return=minimal"},body:JSON.stringify({last_seen_at:new Date().toISOString()})})
  }
  return {token,envKey:String(row.env_key),envpacKey:String(row.envpac_key),subjectType:String(row.subject_type),subjectKey:String(row.subject_key),expiresAt:String(row.expires_at)}
}
