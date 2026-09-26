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
const SCOPED_SESSION_TTL_MS=12*60*60*1000
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
async function activeScopedGrant(env:PassageEnv,envpacKey:string,subjectKey:string,relationRole:string,initiativeKey:string,now=Date.now()){
  const q=new URLSearchParams({
    select:"grant_key,subject_type,subject_key,relation_role,scope,standing,expires_at,revoked_at,evidence_ref,metadata",
    envpac_key:"eq."+envpacKey,
    subject_key:"eq."+subjectKey,
    relation_role:"eq."+relationRole,
    standing:"eq.active",
    revoked_at:"is.null",
    limit:"1"
  })
  const rows=await (await rest(env,"c3_envpac_access_grant?"+q)).json() as Array<Record<string,unknown>>
  const grant=rows[0]
  if(!grant) throw new Error("scoped_grant_required")
  if(typeof grant.expires_at==="string" && Date.parse(grant.expires_at)<=now) throw new Error("scoped_grant_expired")
  const scope=grant.scope&&typeof grant.scope==="object"&&!Array.isArray(grant.scope)?grant.scope as Record<string,unknown>:{}
  if(scope.initiative_key!==initiativeKey) throw new Error("scoped_grant_initiative_mismatch")
  return grant
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
export function scopedEnvironmentSessionCookie(name:string,token:string,maxAgeSeconds=Math.floor(SCOPED_SESSION_TTL_MS/1000)){
  return name+"="+encodeURIComponent(token)+"; Path=/; Max-Age="+maxAgeSeconds+"; HttpOnly; Secure; SameSite=Lax"
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


export async function createScopedEnvironmentSession(input:{
  subjectType:string
  subjectKey:string
  targetEnvKey:string
  targetEnvpacKey:string
  relationRole:string
  initiativeKey:string
  sourceEnvKey:string
  sourceEnvpacKey:string
},env:PassageEnv):Promise<EnvironmentSession & {relationRole:string;initiativeKey:string;grantKey:string}>{
  const grant=await activeScopedGrant(env,input.targetEnvpacKey,input.subjectKey,input.relationRole,input.initiativeKey)
  const token=runtimeToken()
  const tokenHash=await sha256(token)
  const expiresAt=new Date(Date.now()+SCOPED_SESSION_TTL_MS).toISOString()
  await rest(env,"c3_env_runtime_session",{
    method:"POST",
    headers:{"content-type":"application/json","prefer":"return=minimal"},
    body:JSON.stringify({
      token_sha256:tokenHash,
      envpac_key:input.targetEnvpacKey,
      env_key:input.targetEnvKey,
      subject_type:input.subjectType||"individual",
      subject_key:input.subjectKey,
      standing:"active",
      expires_at:expiresAt,
      evidence_ref:grant.grant_key||null,
      metadata:{
        source:"scoped_environment_exchange",
        session_class:"initiative_c2_consumer",
        relation_role:input.relationRole,
        initiative_key:input.initiativeKey,
        source_env_key:input.sourceEnvKey,
        source_envpac_key:input.sourceEnvpacKey,
        authority_created:false,
        ownership_created:false,
        custody_transfer:false
      }
    })
  })
  return {
    token,envKey:input.targetEnvKey,envpacKey:input.targetEnvpacKey,
    subjectType:input.subjectType||"individual",subjectKey:input.subjectKey,expiresAt,
    relationRole:input.relationRole,initiativeKey:input.initiativeKey,grantKey:String(grant.grant_key)
  }
}

export async function resolveScopedEnvironmentSession(
  token:string,
  env:PassageEnv,
  expected:{envKey:string;envpacKey:string;relationRole:string;initiativeKey:string}
):Promise<EnvironmentSession & {relationRole:string;initiativeKey:string;grantKey:string}>{
  if(!/^[a-f0-9]{64}$/.test(token)) throw new Error("session_shape")
  const tokenHash=await sha256(token)
  const q=new URLSearchParams({
    select:"session_key,envpac_key,env_key,subject_type,subject_key,standing,expires_at,revoked_at,evidence_ref,metadata",
    token_sha256:"eq."+tokenHash,
    standing:"eq.active",
    revoked_at:"is.null",
    limit:"1"
  })
  const rows=await (await rest(env,"c3_env_runtime_session?"+q)).json() as Array<Record<string,unknown>>
  const row=rows[0]
  if(!row || typeof row.expires_at!=="string" || Date.parse(row.expires_at)<=Date.now()) throw new Error("session_expired")
  if(row.env_key!==expected.envKey||row.envpac_key!==expected.envpacKey) throw new Error("scoped_session_target_mismatch")
  const metadata=row.metadata&&typeof row.metadata==="object"&&!Array.isArray(row.metadata)?row.metadata as Record<string,unknown>:{}
  if(metadata.session_class!=="initiative_c2_consumer"||
     metadata.relation_role!==expected.relationRole||
     metadata.initiative_key!==expected.initiativeKey) throw new Error("scoped_session_contract_mismatch")
  const grant=await activeScopedGrant(env,expected.envpacKey,String(row.subject_key),expected.relationRole,expected.initiativeKey)
  if(row.evidence_ref!==grant.grant_key) throw new Error("scoped_session_grant_mismatch")
  if(typeof row.session_key==="string"){
    const p=new URLSearchParams({session_key:"eq."+row.session_key})
    await rest(env,"c3_env_runtime_session?"+p,{
      method:"PATCH",headers:{"content-type":"application/json","prefer":"return=minimal"},
      body:JSON.stringify({last_seen_at:new Date().toISOString()})
    })
  }
  return {
    token,envKey:String(row.env_key),envpacKey:String(row.envpac_key),
    subjectType:String(row.subject_type),subjectKey:String(row.subject_key),expiresAt:String(row.expires_at),
    relationRole:expected.relationRole,initiativeKey:expected.initiativeKey,grantKey:String(grant.grant_key)
  }
}
