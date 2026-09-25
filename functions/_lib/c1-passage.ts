// Server-only orchestration. Governance and dispositions remain in the registered RPCs.
export const ENV_KEY = "env_c3_community_connect"
export const MY_ENVIRONMENT_ORIGIN = "https://my.c3field.online"
const PROJECT_URL = "https://zfihrspxvennjzazxcbj.supabase.co"
const FOUNDATIONAL_SET_BUCKET = "measures-seed"
const FOUNDATIONAL_SET_OBJECT = "c3_foundational_papers_watermarked_20260917_v1.zip"
const FOUNDATIONAL_SET_TTL_SECONDS = 7 * 24 * 60 * 60
export interface PassageEnv {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  C3_RESEND_API_KEY?: string
  C1_VERIFICATION_FROM?: string
  C1_PUBLIC_ORIGIN?: string
  C1_VERIFICATION_SIGNING_KEY?: string
  C1_PASSAGE_ENABLED?: string
}
type RecordValue = Record<string, any>
export type Rpc = (name: string, args: RecordValue) => Promise<RecordValue>
export interface Dependencies { fetch: typeof fetch; now: () => number }
const defaults: Dependencies = {fetch: (input, init) => fetch(input, init), now: () => Date.now()}
export const PCT47_322_CONTRACT={
  contractKey:"47pct_pre_my_env_322_v1",
  initiativeKey:"47pct",
  constraints:[
    "Physical presence is not required for standing or support.",
    "Physical presence demonstrates only physical presence.",
    "My Environment must not claim more than your CURRENT state supports."
  ],
  agreements:[
    "I may participate from my environment at the level presently available to me.",
    "I understand the peaceful gathering as a resolution path, not a participation requirement."
  ],
  resolutions:[
    "Support and attendance resolve separately.",
    "The record remains bounded to what actually occurred."
  ],
  acknowledgmentText:"I acknowledge the 3 Constraints, 2 Agreements, and 2 Resolutions above. I understand that My Environment preserves my CURRENT relational state, that peaceful on-ground presence is voluntary, and that support, contribution, connection, and physical attendance are evidenced separately.",
  actionLabel:"ACKNOWLEDGE & ENTER MY ENVIRONMENT"
} as const
export const json = (body: RecordValue, status = 200) => new Response(JSON.stringify(body), {
  status, headers: {"content-type":"application/json; charset=utf-8","cache-control":"no-store","referrer-policy":"no-referrer"},
})
export function hold(stage: string, candidate: boolean | null = null) {
  // Arguments remain internal diagnostics only; no stage or record existence is projected.
  return json({standing:"invalid_or_expired_verification",saved:false,
    message:"We could not confirm your connection. Please request a new link or return later."},409)
}
const verificationRequired = () => json({standing:"verification_required",saved:false,
  message:"If your request can be processed, check your email to confirm your connection."},202)
const continuationRequired = () => json({standing:"continuation_sent",saved:false,
  message:"If your existing connection can be resumed, check your email to continue to your environment."},202)
const unavailable = () => json({standing:"unable_to_process",saved:false,
  message:"We could not process this request. Please try again later."},409)
function configuration(env: PassageEnv) {
  if (env.C1_PASSAGE_ENABLED !== "true" || env.SUPABASE_URL?.replace(/\/$/,"") !== PROJECT_URL ||
      !env.SUPABASE_SERVICE_ROLE_KEY || !env.C1_VERIFICATION_SIGNING_KEY ||
      env.C1_VERIFICATION_SIGNING_KEY.length < 32) throw new Error("server_configuration")
  const origin = new URL(env.C1_PUBLIC_ORIGIN || "")
  if (origin.protocol !== "https:" || origin.origin !== env.C1_PUBLIC_ORIGIN ||
      origin.username || origin.password) throw new Error("server_configuration")
  return origin.origin
}
function rpcClient(env: PassageEnv, deps: Dependencies = defaults): Rpc {
  return async (name, args) => {
    if (!["capture_relational_candidate","issue_relational_verification","verify_relational_contact",
      "evaluate_relational_car","evaluate_c1_relational_boundary","register_and_persist_c1_relationship","form_c1_owner_environment","resolve_c1_owner_reentry",
      "resolve_c1_existing_relationship_for_initiative","record_c1_initiative_connect_requested","resolve_pending_c1_initiative_connect","acknowledge_c1_322_and_open_environment"].includes(name))
      throw new Error("unregistered_call")
    const response = await deps.fetch(PROJECT_URL + "/rest/v1/rpc/" + name, {
      method:"POST", redirect:"manual", signal:AbortSignal.timeout(12000),
      headers:{"content-type":"application/json",apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
        authorization:"Bearer " + env.SUPABASE_SERVICE_ROLE_KEY!},
      body:JSON.stringify(args),
    })
    if (!response.ok) throw new Error("rpc_failed")
    const result = await response.json()
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("rpc_shape")
    return result
  }
}
const encoder = new TextEncoder()
const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,"0")).join("")
async function signingKey(secret: string) {
  return crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"])
}
async function signedReceipt(key: string, expiry: string, env: PassageEnv) {
  const payload = btoa(JSON.stringify({key,env:ENV_KEY,expires:Date.parse(expiry)}))
  const signature = hex(await crypto.subtle.sign("HMAC",await signingKey(env.C1_VERIFICATION_SIGNING_KEY!),encoder.encode(payload)))
  return payload + "." + signature
}
async function readReceipt(receipt: string, env: PassageEnv, now: number): Promise<string> {
  const [payload,signature,...extra] = receipt.split(".")
  if (extra.length || !payload || !/^[a-f0-9]{64}$/.test(signature || "")) throw new Error("receipt")
  const bytes = Uint8Array.from(signature.match(/../g)!, value => parseInt(value,16))
  if (!await crypto.subtle.verify("HMAC",await signingKey(env.C1_VERIFICATION_SIGNING_KEY!),bytes,encoder.encode(payload))) throw new Error("receipt")
  const value = JSON.parse(atob(payload))
  if (value.env !== ENV_KEY || !/^crs_[a-f0-9]{32}$/.test(value.key) ||
      !Number.isFinite(value.expires) || value.expires <= now) throw new Error("receipt")
  return value.key
}
async function signed322Ticket(relationshipKey:string,requestEventKey:string,env:PassageEnv,now=Date.now()){
  const payload=btoa(JSON.stringify({
    purpose:"322_ack",
    relationshipKey,
    requestEventKey,
    contractKey:PCT47_322_CONTRACT.contractKey,
    expires:now+8*60*60*1000
  }))
  const signature=hex(await crypto.subtle.sign("HMAC",await signingKey(env.C1_VERIFICATION_SIGNING_KEY!),encoder.encode(payload)))
  return payload+"."+signature
}
async function read322Ticket(ticket:string,env:PassageEnv,now=Date.now()){
  const [payload,signature,...extra]=ticket.split(".")
  if(extra.length||!payload||!/^[a-f0-9]{64}$/.test(signature||""))throw new Error("322_ticket")
  const bytes=Uint8Array.from(signature.match(/../g)!,value=>parseInt(value,16))
  if(!await crypto.subtle.verify("HMAC",await signingKey(env.C1_VERIFICATION_SIGNING_KEY!),bytes,encoder.encode(payload)))throw new Error("322_ticket")
  const value=JSON.parse(atob(payload))
  if(!value||typeof value!=="object"||value.purpose!=="322_ack"||
     !/^crs_[a-f0-9]{32}$/.test(value.relationshipKey||"")||
     !/^event_[a-f0-9]{32}$/.test(value.requestEventKey||"")||
     value.contractKey!==PCT47_322_CONTRACT.contractKey||
     !Number.isFinite(value.expires)||value.expires<=now)throw new Error("322_ticket")
  return value as {relationshipKey:string;requestEventKey:string;contractKey:string;expires:number}
}
export async function signedOwnerClaim(relationshipKey: string, envKey: string, envpacKey: string, env: PassageEnv, now = Date.now()) {
  const payload = btoa(JSON.stringify({relationshipKey,envKey,envpacKey,expires:now + 8 * 60 * 60 * 1000}))
  const signature = hex(await crypto.subtle.sign("HMAC",await signingKey(env.C1_VERIFICATION_SIGNING_KEY!),encoder.encode(payload)))
  return payload + "." + signature
}
export async function readOwnerClaim(claim: string, env: PassageEnv, now = Date.now()) {
  const [payload,signature,...extra] = claim.split(".")
  if (extra.length || !payload || !/^[a-f0-9]{64}$/.test(signature || "")) throw new Error("claim")
  const bytes = Uint8Array.from(signature.match(/../g)!, value => parseInt(value,16))
  if (!await crypto.subtle.verify("HMAC",await signingKey(env.C1_VERIFICATION_SIGNING_KEY!),bytes,encoder.encode(payload))) throw new Error("claim")
  const value = JSON.parse(atob(payload))
  if (!value || typeof value !== "object" || !/^crs_[a-f0-9]{32}$/.test(value.relationshipKey || "") ||
      !/^env_person_[a-f0-9]{24}$/.test(value.envKey || "") ||
      !/^c3envpac_person_[a-f0-9]{24}_v0_1$/.test(value.envpacKey || "") ||
      !Number.isFinite(value.expires) || value.expires <= now) throw new Error("claim")
  return value as {relationshipKey:string;envKey:string;envpacKey:string;expires:number}
}
function friendlyFrom(env:PassageEnv){
  const value=env.C1_VERIFICATION_FROM||""
  return value.includes("<")?value:"c3 Community Partners <"+value+">"
}
const htmlEntities:Record<string,string>={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}
const esc=(value:string)=>value.replace(/[&<>"']/g,ch=>htmlEntities[ch]||ch)
async function sendResend(env:PassageEnv,deps:Dependencies,args:{to:string;subject:string;text:string;html:string;idempotencyKey:string}){
  if(!env.C3_RESEND_API_KEY||!env.C1_VERIFICATION_FROM) return false
  const response=await deps.fetch("https://api.resend.com/emails",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{"content-type":"application/json",authorization:"Bearer "+env.C3_RESEND_API_KEY,"idempotency-key":args.idempotencyKey},
    body:JSON.stringify({from:friendlyFrom(env),to:[args.to],subject:args.subject,text:args.text,html:args.html})
  })
  const body=await response.json().catch(()=>null)
  return response.ok&&!!body&&typeof body==="object"&&"id" in body&&typeof body.id==="string"&&!!body.id
}
async function signedFoundationalSetUrl(env: PassageEnv, deps: Dependencies) {
  const objectPath = FOUNDATIONAL_SET_OBJECT.split("/").map(encodeURIComponent).join("/")
  const response = await deps.fetch(PROJECT_URL + "/storage/v1/object/sign/" + FOUNDATIONAL_SET_BUCKET + "/" + objectPath, {
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{"content-type":"application/json",apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization:"Bearer " + env.SUPABASE_SERVICE_ROLE_KEY!},
    body:JSON.stringify({expiresIn:FOUNDATIONAL_SET_TTL_SECONDS}),
  })
  if (!response.ok) throw new Error("foundational_set_sign_failed")
  const result = await response.json().catch(() => null)
  if (!result || typeof result !== "object") throw new Error("foundational_set_sign_shape")
  const signed = typeof result.signedURL === "string" ? result.signedURL :
    typeof result.signedUrl === "string" ? result.signedUrl : null
  if (!signed) throw new Error("foundational_set_sign_shape")
  return signed.startsWith("http://") || signed.startsWith("https://") ? signed : PROJECT_URL + signed
}
export function myEnvironmentClaimUrl(claim:string){
  return MY_ENVIRONMENT_ORIGIN + "/my-environment#claim=" + encodeURIComponent(claim)
}
async function sendEnvironmentHandoff(owner: RecordValue, claim: string, origin: string, env: PassageEnv, deps: Dependencies, mode:"welcome"|"reentry"="welcome") {
  if (!env.C3_RESEND_API_KEY || !env.C1_VERIFICATION_FROM || typeof owner.owner_email !== "string") return false
  const link = myEnvironmentClaimUrl(claim)
  const foundationalSetLink = await signedFoundationalSetUrl(env,deps)
  const name=typeof owner.owner_display_name==="string"&&owner.owner_display_name.trim()?owner.owner_display_name.trim():"there"
  const subject=mode==="welcome"?"Own Your Environment | Welcome to c3Field":"Your c3Field environment link"
  const intro=mode==="welcome"
    ?"Your c3 Community Partners connection is confirmed. Welcome to c3Field."
    :"Your existing c3Field environment is ready to reopen."
  const text=mode==="welcome"
    ? `Hi ${name},

${intro}

OWN YOUR ENVIRONMENT
${link}

The Million Dollar Mission is a live test of what becomes possible when a community can connect the people, places, resources, and possibilities it already has.

WHAT TO DO NEXT
1. Open My Environment and enter your c1ME.env.
2. Explore the Million Dollar Mission: ${origin}/
3. Return to My Environment as new connections and participation paths become available.

Community Potential: ${origin}/community-potential

Your private foundational set:
${foundationalSetLink}

The environment link expires in 8 hours. The foundational-set link expires in 7 days.

Connect · Contribute · Create`
    : `Hi ${name},

${intro}

Open My Environment:
${link}

This secure link expires in 8 hours. You do not need to Connect again.

Connect · Contribute · Create`
  const html=mode==="welcome"
    ? `<!doctype html><html><body style="margin:0;background:#111416;color:#f3efe7;font-family:Arial,sans-serif"><div style="max-width:640px;margin:auto;padding:36px 28px"><p style="letter-spacing:.16em;font-size:12px">c3 COMMUNITY PARTNERS</p><h1 style="font-family:Georgia,serif;font-size:42px;font-weight:400">Own Your Environment.</h1><p>Hi ${esc(name)},</p><p>${esc(intro)}</p><p><a href="${esc(link)}" style="display:inline-block;padding:14px 20px;background:#f1eee5;color:#111;text-decoration:none;font-weight:700">OPEN MY ENVIRONMENT →</a></p><hr style="border:0;border-top:1px solid #394047;margin:34px 0"><h2 style="font-family:Georgia,serif;font-weight:400">The Million Dollar Mission</h2><p>A live test of what becomes possible when a community can connect the people, places, resources, and possibilities it already has.</p><p><a href="${esc(origin)}/" style="color:#f3efe7">Explore the mission →</a></p><h2 style="font-family:Georgia,serif;font-weight:400">What to do next</h2><ol style="line-height:1.7"><li>Open My Environment and enter your c1ME.env.</li><li>Explore the Million Dollar Mission and <a href="${esc(origin)}/community-potential" style="color:#f3efe7">Community Potential</a>.</li><li>Return to My Environment as new connections and participation paths become available.</li></ol><p style="font-size:13px;color:#aeb7bd">Your private foundational set is available for 7 days: <a href="${esc(foundationalSetLink)}" style="color:#d7dde1">open the set</a>.</p><p style="font-size:12px;color:#88939b">Your environment link expires in 8 hours.</p><p style="margin-top:38px">Connect · Contribute · Create</p></div></body></html>`
    : `<!doctype html><html><body style="margin:0;background:#111416;color:#f3efe7;font-family:Arial,sans-serif"><div style="max-width:640px;margin:auto;padding:36px 28px"><p style="letter-spacing:.16em;font-size:12px">c3 COMMUNITY PARTNERS</p><h1 style="font-family:Georgia,serif;font-size:38px;font-weight:400">Your environment is ready.</h1><p>Hi ${esc(name)},</p><p>${esc(intro)}</p><p><a href="${esc(link)}" style="display:inline-block;padding:14px 20px;background:#f1eee5;color:#111;text-decoration:none;font-weight:700">OPEN MY ENVIRONMENT →</a></p><p style="font-size:12px;color:#88939b">This secure link expires in 8 hours. You do not need to Connect again.</p></div></body></html>`
  return sendResend(env,deps,{to:owner.owner_email,subject,text,html,idempotencyKey:(mode==="welcome"?"c1-welcome-":"c1-reentry-")+owner.envpac_key+"-"+Math.floor(deps.now()/3600000)})
}
async function send47pctAcknowledgmentHandoff(owner:RecordValue,ticket:string,requestEventKey:string,origin:string,env:PassageEnv,deps:Dependencies){
  if(!env.C3_RESEND_API_KEY||!env.C1_VERIFICATION_FROM||typeof owner.owner_email!=="string")return false
  const link=origin+"/api/c3-community-connect-acknowledge#ticket="+encodeURIComponent(ticket)
  const name=typeof owner.owner_display_name==="string"&&owner.owner_display_name.trim()?owner.owner_display_name.trim():"there"
  const subject="4.7% | Acknowledge to continue"
  const text=`Hi ${name},

Your existing c3Field relationship is recognized.

Before 4.7% can appear in My Environment, acknowledge the bounded 3-2-2:

${link}

Eternal Flame
For those who died waiting.

This link expires in 8 hours.

Connect · Contribute · Create`
  const html=`<!doctype html><html><body style="margin:0;background:#111416;color:#f3efe7;font-family:Arial,sans-serif"><div style="max-width:640px;margin:auto;padding:36px 28px"><p style="letter-spacing:.16em;font-size:12px">c3 COMMUNITY PARTNERS · 4.7%</p><h1 style="font-family:Georgia,serif;font-weight:400">Acknowledge to continue.</h1><p>Hi ${esc(name)},</p><p>Your existing c3Field relationship is recognized. The 4.7% relation remains held until the 3-2-2 acknowledgment is recorded.</p><p><a href="${esc(link)}" style="display:inline-block;padding:14px 20px;background:#f1eee5;color:#111;text-decoration:none;font-weight:700">REVIEW 3-2-2 →</a></p><hr style="border:0;border-top:1px solid #394047;margin:34px 0"><p><strong>Eternal Flame</strong><br>For those who died waiting.</p><p style="font-size:12px;color:#88939b">This link expires in 8 hours.</p></div></body></html>`
  return sendResend(env,deps,{to:owner.owner_email,subject,text,html,idempotencyKey:"47pct-322-"+requestEventKey})
}
async function send47pctEnvironmentHandoff(owner:RecordValue,claim:string,env:PassageEnv,deps:Dependencies){
  if(!env.C3_RESEND_API_KEY||!env.C1_VERIFICATION_FROM||typeof owner.owner_email!=="string")return false
  const link=myEnvironmentClaimUrl(claim)
  const name=typeof owner.owner_display_name==="string"&&owner.owner_display_name.trim()?owner.owner_display_name.trim():"there"
  const subject="4.7% | Open My Environment"
  const text=`Hi ${name},

Your 4.7% Connect relationship and 3-2-2 acknowledgment are recorded.

OPEN MY ENVIRONMENT
${link}

Eternal Flame
For those who died waiting.

This secure link expires in 8 hours.

Connect · Contribute · Create`
  const html=`<!doctype html><html><body style="margin:0;background:#111416;color:#f3efe7;font-family:Arial,sans-serif"><div style="max-width:640px;margin:auto;padding:36px 28px"><p style="letter-spacing:.16em;font-size:12px">c3 COMMUNITY PARTNERS · 4.7%</p><h1 style="font-family:Georgia,serif;font-weight:400">Open My Environment.</h1><p>Hi ${esc(name)},</p><p>Your 4.7% Connect relationship and 3-2-2 acknowledgment are recorded.</p><p><a href="${esc(link)}" style="display:inline-block;padding:14px 20px;background:#f1eee5;color:#111;text-decoration:none;font-weight:700">OPEN MY ENVIRONMENT →</a></p><hr style="border:0;border-top:1px solid #394047;margin:34px 0"><p><strong>Eternal Flame</strong><br>For those who died waiting.</p><p style="font-size:12px;color:#88939b">This secure link expires in 8 hours.</p></div></body></html>`
  return sendResend(env,deps,{to:owner.owner_email,subject,text,html,idempotencyKey:"47pct-env-"+owner.envpac_key+"-"+Math.floor(deps.now()/3600000)})
}

async function markChallengeDeliveryFailed(env:PassageEnv,deps:Dependencies,challengeKey:string){
  const q=new URLSearchParams({challenge_key:"eq."+challengeKey})
  await deps.fetch(PROJECT_URL+"/rest/v1/crs_verification_challenge?"+q,{
    method:"PATCH",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{"content-type":"application/json",apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,"prefer":"return=minimal"},
    body:JSON.stringify({challenge_state:"delivery_failed",updated_at:new Date(deps.now()).toISOString()})
  }).catch(()=>null)
}
async function recordVerificationReminder(env:PassageEnv,deps:Dependencies,relationshipKey:string,challengeKey:string,reminderNumber:number){
  const eventKey="event_"+crypto.randomUUID().replace(/-/g,"")
  const response=await deps.fetch(PROJECT_URL+"/rest/v1/crs_relationship_event",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{"content-type":"application/json",apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,"prefer":"return=minimal"},
    body:JSON.stringify({event_key:eventKey,relationship_key:relationshipKey,event_type:"verification_reminder_sent",source_system:"c3_field",source_record_type:"crs_verification_challenge",source_record_ref:challengeKey,event_standing:"candidate_evidence_only",next_permitted_encounter:"contact_verification",metadata:{reminder_number:reminderNumber,standing_effect:"none",current_effect:"none",persistence_effect:"none"}})
  })
  if(!response.ok) throw new Error("reminder_event")
}
async function issueAndSendVerification(relationshipKey:string,email:string,displayName:string|null,reminderNumber:number,env:PassageEnv,deps:Dependencies){
  const origin=configuration(env)
  const rpc=rpcClient(env,deps)
  const issue=await rpc("issue_relational_verification",{p_relationship_key:relationshipKey,p_env_key:ENV_KEY,p_ttl_minutes:30,p_metadata:{transport:"resend",source_route:reminderNumber?"/api/c1-email-lifecycle-sweep":"/api/c3-community-connect-capture",reminder_number:reminderNumber||null}})
  if(issue.accepted!==true||typeof issue.challenge_key!=="string"||!/^[a-f0-9]{48}$/.test(issue.challenge_token||"")||!Number.isFinite(Date.parse(issue.expires_at))) throw new Error("verification_issue")
  const receipt=await signedReceipt(relationshipKey,issue.expires_at,env)
  const link=origin+"/api/c3-community-connect-verify#"+new URLSearchParams({receipt,token:issue.challenge_token})
  const name=displayName?.trim()||"there"
  const subject=reminderNumber===0?"Confirm your c3Field connection":reminderNumber===1?"Your c3Field connection is waiting":"Last reminder: confirm your c3Field connection"
  const lead=reminderNumber===0?"Confirm your email to continue your connection.":reminderNumber===1?"Your first confirmation link expired. If you still want to Connect, use this fresh link.":"Your second confirmation window is open. Confirm now if you still want to enter c3Field."
  const text=`Hi ${name},

${lead}

Confirm connection:
${link}

This link expires in 30 minutes. If you did not request this connection, ignore this email.

Connect · Contribute · Create`
  const html=`<!doctype html><html><body style="margin:0;background:#111416;color:#f3efe7;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:36px 28px"><p style="letter-spacing:.16em;font-size:12px">c3 COMMUNITY PARTNERS</p><h1 style="font-family:Georgia,serif;font-weight:400">Confirm your connection.</h1><p>Hi ${esc(name)},</p><p>${esc(lead)}</p><p><a href="${esc(link)}" style="display:inline-block;padding:14px 20px;background:#f1eee5;color:#111;text-decoration:none;font-weight:700">CONFIRM CONNECTION →</a></p><p style="font-size:12px;color:#88939b">This link expires in 30 minutes. If you did not request this connection, ignore this email.</p></div></body></html>`
  const sent=await sendResend(env,deps,{to:email,subject,text,html,idempotencyKey:issue.challenge_key})
  if(!sent){await markChallengeDeliveryFailed(env,deps,issue.challenge_key);throw new Error("verification_delivery")}
  if(reminderNumber>0) await recordVerificationReminder(env,deps,relationshipKey,issue.challenge_key,reminderNumber)
  return issue
}

export async function sendDueVerificationReminders(env:PassageEnv,deps:Dependencies=defaults){
  configuration(env)
  if(!env.C3_RESEND_API_KEY||!env.C1_VERIFICATION_FROM) throw new Error("email_configuration")
  const response=await deps.fetch(PROJECT_URL+"/rest/v1/rpc/list_due_c1_verification_reminders",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{"content-type":"application/json",apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!},
    body:JSON.stringify({p_limit:25})
  })
  if(!response.ok) throw new Error("reminder_list")
  const rows=await response.json() as Array<{relationship_key:string;primary_email:string;display_name:string|null;reminder_number:number}>
  const results=[]
  for(const row of rows){
    try{
      await issueAndSendVerification(row.relationship_key,row.primary_email,row.display_name,row.reminder_number,env,deps)
      results.push({relationship_key:row.relationship_key,reminder_number:row.reminder_number,sent:true})
    }catch{
      results.push({relationship_key:row.relationship_key,reminder_number:row.reminder_number,sent:false})
    }
  }
  return results
}

export async function captureCandidate(body: RecordValue, env: PassageEnv, deps: Dependencies = defaults) {
  let candidate: boolean | null = false
  let stage = "server_configuration"
  try {
    const origin = configuration(env)
    // Transport must be configured before collecting candidate evidence.
    if (!env.C3_RESEND_API_KEY || !env.C1_VERIFICATION_FROM || /[\r\n]/.test(env.C1_VERIFICATION_FROM))
      return unavailable()
    const rpc = rpcClient(env,deps)
    if(body.sourceInitiative?.initiativeKey){
      stage="initiative_reentry_lookup"
      const existing=await rpc("resolve_c1_existing_relationship_for_initiative",{p_primary_email:body.email})
      if(existing.accepted===true){
        stage="initiative_ack_request"
        const requested=await rpc("record_c1_initiative_connect_requested",{
          p_relationship_key:existing.relationship_key,
          p_initiative_key:body.sourceInitiative.initiativeKey,
          p_source_host:body.sourceInitiative.sourceHost,
          p_metadata:{surface_key:body.sourceInitiative.surfaceKey,webpac_key:body.sourceInitiative.webpacKey}
        })
        if(requested.accepted!==true||typeof requested.request_event_key!=="string")return unavailable()
        const ticket=await signed322Ticket(existing.relationship_key,requested.request_event_key,env,deps.now())
        await send47pctAcknowledgmentHandoff(existing,ticket,requested.request_event_key,origin,env,deps).catch(()=>false)
        return continuationRequired()
      }
    }
    stage = "owner_reentry"
    const reentry = await rpc("resolve_c1_owner_reentry", {p_primary_email:body.email})
    if (reentry.accepted === true) {
      if(body.sourceEnvironmentShare?.share_reference){
        await rpc("record_c1me_invite_acceptance_pending",{
          p_share_reference:body.sourceEnvironmentShare.share_reference,
          p_target_relationship_key:reentry.relationship_key
        }).catch(()=>null)
      }
      const claim = await signedOwnerClaim(reentry.relationship_key,reentry.env_key,reentry.envpac_key,env,deps.now())
      await sendEnvironmentHandoff(reentry,claim,origin,env,deps,"reentry").catch(()=>false)
      return continuationRequired()
    }
    stage = "capture_unconfirmed"
    candidate = null // A network timeout cannot prove that the transaction did not commit.
    const captured = await rpc("capture_relational_candidate", {
      p_env_key:ENV_KEY,p_encounter_key:"c3_community_connect",p_primary_email:body.email,
      p_display_name:body.name,p_organization:null,p_consent_scope:"c1_connect_relationship",
      p_consent_granted:true,p_accuracy_attested:true,p_participation_intended:true,
      p_evidence_ref:"c1_capture_" + crypto.randomUUID(),
      p_metadata:{
        source_oar2:"oar2_wire_c1ME_live_passage_server_adapter_codex_005",
        open_response:body.message,
        ...(body.sourceEnvironmentShare?{source_environment_share:body.sourceEnvironmentShare}:{}),
        ...(body.sourceInitiative?{source_initiative:body.sourceInitiative}:{})
      },
    })
    if (captured.accepted !== true || captured.relationship_standing !== "candidate_unverified" ||
        !/^crs_[a-f0-9]{32}$/.test(captured.relationship_key) ||
        captured.standing_created !== false || captured.current_created !== false || captured.persistence_created !== false)
      return verificationRequired()
    candidate = true
    if(body.sourceInitiative?.initiativeKey){
      stage="initiative_ack_request"
      const requested=await rpc("record_c1_initiative_connect_requested",{
        p_relationship_key:captured.relationship_key,
        p_initiative_key:body.sourceInitiative.initiativeKey,
        p_source_host:body.sourceInitiative.sourceHost,
        p_metadata:{surface_key:body.sourceInitiative.surfaceKey,webpac_key:body.sourceInitiative.webpacKey}
      })
      if(requested.accepted!==true||typeof requested.request_event_key!=="string")return verificationRequired()
    }
    if(body.sourceEnvironmentShare?.share_reference){
      await rpc("record_c1me_invite_acceptance_pending",{
        p_share_reference:body.sourceEnvironmentShare.share_reference,
        p_target_relationship_key:captured.relationship_key
      }).catch(()=>null)
    }
    stage = "verification_issue"
    await issueAndSendVerification(captured.relationship_key,body.email,body.name,0,env,deps)
    return verificationRequired()
  } catch { return stage === "server_configuration" ? unavailable() : verificationRequired() }
}
export async function verifyCandidate(body: RecordValue, env: PassageEnv, deps: Dependencies = defaults) {
  let stage = "verification"
  try {
    configuration(env)
    if (Object.keys(body).some(key => !["receipt","token"].includes(key)) ||
        typeof body.receipt !== "string" || body.receipt.length > 2048 ||
        typeof body.token !== "string" || !/^[a-f0-9]{48}$/.test(body.token)) return hold("verification_input")
    const key = await readReceipt(body.receipt,env,deps.now())
    const rpc = rpcClient(env,deps)
    const verified = await rpc("verify_relational_contact", {
      p_relationship_key:key,p_challenge_token:body.token,
      p_metadata:{source_route:"/api/c3-community-connect-verify"},
    })
    if (verified.verified !== true || verified.relationship_key !== key ||
        verified.relationship_standing !== "candidate_contact_verified") return hold("contact_verification",true)
    stage = "car"
    const args = {p_relationship_key:key,p_env_key:ENV_KEY,p_metadata:{source_oar2:"oar2_wire_c1ME_live_passage_server_adapter_codex_005"}}
    const car = await rpc("evaluate_relational_car",args)
    if (car.accepted !== true || car.relationship_key !== key || car.env_key !== ENV_KEY ||
        car.car_state !== "pass" || car.relationship_state !== "car_passed_candidate" ||
        car.next_permitted_encounter !== "boundary") return hold("car",true)
    stage = "boundary"
    const boundary = await rpc("evaluate_c1_relational_boundary",args)
    if (boundary.accepted !== true || boundary.relationship_key !== key || boundary.env_key !== ENV_KEY ||
        boundary.boundary_result?.boundary_state !== "pass" ||
        boundary.boundary_result?.relationship_state !== "boundary_passed_candidate" ||
        boundary.boundary_result?.next_permitted_encounter !== "registration" ||
        boundary.notchazz_evaluation?.final_disposition_authority !== false ||
        boundary.notchazz_evaluation?.flag_count !== 0) return hold("boundary",true)
    stage = "persistence_unconfirmed"
    const persisted = await rpc("register_and_persist_c1_relationship",args)
    if (persisted.accepted !== true || persisted.relationship_key !== key ||
        persisted.rrt_provenance_key !== key || persisted.relationship_standing !== "c1_C1_persisted" ||
        persisted.current_resolution !== "C1" || persisted.next_permitted_encounter !== "c2_eligibility_review" ||
        persisted.current_created_as_separate_record !== false || persisted.c2_created !== false ||
        persisted.public_release_created !== false ||
        typeof persisted.registration_event_key !== "string" || !persisted.registration_event_key ||
        persisted.persistence?.result !== "recoverable_governed_state" ||
        typeof persisted.persistence?.persistence_key !== "string" || !persisted.persistence.persistence_key) return hold(stage,true)
    stage="initiative_ack_resolution"
    const pending=await rpc("resolve_pending_c1_initiative_connect",{p_relationship_key:key})
    if(pending.pending===true){
      if(pending.initiative_key!==PCT47_322_CONTRACT.initiativeKey||
         pending.ack_contract_key!==PCT47_322_CONTRACT.contractKey||
         typeof pending.request_event_key!=="string")return hold(stage,true)
      const ticket=await signed322Ticket(key,pending.request_event_key,env,deps.now())
      return json({
        standing:"322_acknowledgment_required",
        saved:true,
        environment_ready:false,
        acknowledgment_required:true,
        ack_ticket:ticket,
        ack_contract:PCT47_322_CONTRACT
      })
    }
    stage = "owner_environment"
    const owner = await rpc("form_c1_owner_environment", {p_relationship_key:key,p_env_key:ENV_KEY})
    if (owner.accepted !== true || owner.relationship_key !== key ||
        !/^env_person_[a-f0-9]{24}$/.test(owner.env_key || "") ||
        !/^c3envpac_person_[a-f0-9]{24}_v0_1$/.test(owner.envpac_key || "") ||
        owner.standing !== "c1_connected" || owner.c1_standing !== "c1_C1_persisted")
      return hold(stage,true)
    const origin = configuration(env)
    const claim = await signedOwnerClaim(key,owner.env_key,owner.envpac_key,env,deps.now())
    const handoffEmailSent = await sendEnvironmentHandoff(owner,claim,origin,env,deps,"welcome").catch(()=>false)
    const nextUrl = myEnvironmentClaimUrl(claim)
    // Protected backend provenance stays in RPC event/persistence records; only bounded copy reaches the participant.
    return json({standing:"connection_recorded",saved:true,environment_ready:true,
      message:"Your Connect relationship is confirmed and recorded. Your environment is ready.",
      next_url:nextUrl,handoff_email_sent:handoffEmailSent})
  } catch { return hold(stage,true) }
}

export async function acknowledgeInitiative322(body:RecordValue,env:PassageEnv,deps:Dependencies=defaults){
  let stage="322_ticket"
  try{
    configuration(env)
    if(Object.keys(body).some(key=>!["ticket","acknowledged"].includes(key))||
       typeof body.ticket!=="string"||body.ticket.length>4096||body.acknowledged!==true)
      return hold("322_input")
    const ticket=await read322Ticket(body.ticket,env,deps.now())
    const rpc=rpcClient(env,deps)
    stage="322_persistence"
    const owner=await rpc("acknowledge_c1_322_and_open_environment",{
      p_relationship_key:ticket.relationshipKey,
      p_request_event_key:ticket.requestEventKey,
      p_contract_key:ticket.contractKey,
      p_acknowledged:true,
      p_metadata:{source_route:"/api/c3-community-connect-acknowledge"}
    })
    if(owner.accepted!==true||owner["322_acknowledged"]!==true||
       owner.initiative_key!==PCT47_322_CONTRACT.initiativeKey||
       owner.visibility_standing!=="active"||
       !/^env_person_[a-f0-9]{24}$/.test(owner.env_key||"")||
       !/^c3envpac_person_[a-f0-9]{24}_v0_1$/.test(owner.envpac_key||""))
      return hold(stage,true)
    const claim=await signedOwnerClaim(ticket.relationshipKey,owner.env_key,owner.envpac_key,env,deps.now())
    const handoffEmailSent=await send47pctEnvironmentHandoff(owner,claim,env,deps).catch(()=>false)
    return json({
      standing:"connection_recorded",
      saved:true,
      environment_ready:true,
      acknowledgment_recorded:true,
      initiative_key:PCT47_322_CONTRACT.initiativeKey,
      visibility_standing:"active",
      message:"Your 4.7% relationship is acknowledged. Opening My Environment.",
      next_url:myEnvironmentClaimUrl(claim),
      handoff_email_sent:handoffEmailSent
    })
  }catch{return hold(stage,true)}
}
