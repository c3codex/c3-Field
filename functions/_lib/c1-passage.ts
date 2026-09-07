// Server-only orchestration. Governance and dispositions remain in the registered RPCs.
export const ENV_KEY = "env_c3_community_connect"
const PROJECT_URL = "https://zfihrspxvennjzazxcbj.supabase.co"
export interface PassageEnv {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  RESEND_API_KEY?: string
  C1_VERIFICATION_FROM?: string
  C1_PUBLIC_ORIGIN?: string
  C1_VERIFICATION_SIGNING_KEY?: string
  C1_PASSAGE_ENABLED?: string
}
type RecordValue = Record<string, any>
export type Rpc = (name: string, args: RecordValue) => Promise<RecordValue>
export interface Dependencies { fetch: typeof fetch; now: () => number }
const defaults: Dependencies = {fetch: (input, init) => fetch(input, init), now: () => Date.now()}
export const json = (body: RecordValue, status = 200) => new Response(JSON.stringify(body), {
  status, headers: {"content-type":"application/json; charset=utf-8","cache-control":"no-store","referrer-policy":"no-referrer"},
})
export function hold(stage: string, candidate: boolean | null = null) {
  return json({standing: "held_" + stage, candidate_saved: candidate, saved:false,
    persistence_created:stage === "persistence_unconfirmed" ? null : false,
    current_created:stage === "persistence_unconfirmed" ? null : false,
    message:"We could not confirm your connection. Please try again later."}, 409)
}
function configuration(env: PassageEnv) {
  if (env.C1_PASSAGE_ENABLED !== "true" || env.SUPABASE_URL?.replace(/\/$/,"") !== PROJECT_URL ||
      !env.SUPABASE_SERVICE_ROLE_KEY || !env.C1_VERIFICATION_SIGNING_KEY ||
      env.C1_VERIFICATION_SIGNING_KEY.length < 32) throw new Error("server_configuration")
  const origin = new URL(env.C1_PUBLIC_ORIGIN || "")
  if (origin.protocol !== "https:" || origin.origin !== env.C1_PUBLIC_ORIGIN ||
      origin.username || origin.password) throw new Error("server_configuration")
  return origin.origin
}
export function rpcClient(env: PassageEnv, deps: Dependencies = defaults): Rpc {
  return async (name, args) => {
    const response = await deps.fetch(PROJECT_URL + "/rest/v1/rpc/" + name, {
      method:"POST", redirect:"error", signal:AbortSignal.timeout(12000),
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
export async function captureCandidate(body: RecordValue, env: PassageEnv, deps: Dependencies = defaults) {
  let candidate: boolean | null = false
  let stage = "server_configuration"
  try {
    const origin = configuration(env)
    // Transport must be configured before collecting candidate evidence.
    if (!env.RESEND_API_KEY || !env.C1_VERIFICATION_FROM || /[\r\n]/.test(env.C1_VERIFICATION_FROM))
      return hold("verification_transport_unavailable", false)
    const rpc = rpcClient(env,deps)
    stage = "capture_unconfirmed"
    candidate = null // A network timeout cannot prove that the transaction did not commit.
    const captured = await rpc("capture_relational_candidate", {
      p_env_key:ENV_KEY,p_encounter_key:"c3_community_connect",p_primary_email:body.email,
      p_display_name:body.name,p_organization:null,p_consent_scope:"c1_connect_relationship",
      p_consent_granted:true,p_accuracy_attested:true,p_participation_intended:true,
      p_evidence_ref:"c1_capture_" + crypto.randomUUID(),
      p_metadata:{source_oar2:"oar2_wire_c1ME_live_passage_server_adapter_codex_005",open_response:body.message},
    })
    if (captured.accepted !== true || captured.relationship_standing !== "candidate_unverified" ||
        !/^crs_[a-f0-9]{32}$/.test(captured.relationship_key) ||
        captured.standing_created !== false || captured.current_created !== false || captured.persistence_created !== false)
      return hold("capture_contract",null)
    candidate = true
    stage = "verification_issue"
    const issue = await rpc("issue_relational_verification", {
      p_relationship_key:captured.relationship_key,p_env_key:ENV_KEY,p_ttl_minutes:30,
      p_metadata:{transport:"resend",source_route:"/api/c3-community-connect-capture"},
    })
    if (issue.accepted !== true || issue.relationship_key !== captured.relationship_key ||
        typeof issue.challenge_key !== "string" || !issue.challenge_key ||
        !/^[a-f0-9]{48}$/.test(issue.challenge_token) || !Number.isFinite(Date.parse(issue.expires_at)) ||
        Date.parse(issue.expires_at) <= deps.now() || issue.standing_created !== false ||
        issue.current_created !== false || issue.persistence_created !== false) return hold("verification_issue_contract",true)
    const receipt = await signedReceipt(captured.relationship_key,issue.expires_at,env)
    // Fragment never reaches GET access logs or Referer; explicit POST is the second encounter.
    const link = origin + "/api/c3-community-connect-verify#" + new URLSearchParams({receipt,token:issue.challenge_token})
    stage = "verification_transport_unconfirmed"
    const delivered = await deps.fetch("https://api.resend.com/emails", {
      method:"POST",redirect:"error",signal:AbortSignal.timeout(12000),
      headers:{"content-type":"application/json",authorization:"Bearer " + env.RESEND_API_KEY,
        "idempotency-key":issue.challenge_key},
      body:JSON.stringify({from:env.C1_VERIFICATION_FROM,to:[body.email],
        subject:"Confirm your c3 Community Partners connection",
        text:"Confirm your email to continue your connection:\n\n" + link + "\n\nThis link expires in 30 minutes. If you did not request it, ignore this email."}),
    })
    const delivery = await delivered.json().catch(() => null)
    if (!delivered.ok || !delivery || typeof delivery !== "object" || !("id" in delivery) ||
        typeof delivery.id !== "string" || !delivery.id) return hold(stage,true)
    return json({standing:"verification_required",candidate_saved:true,saved:false,
      persistence_created:false,current_created:false,message:"Check your email to confirm your connection."},202)
  } catch { return hold(stage,candidate) }
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
    // Protected backend provenance stays in RPC event/persistence records; only bounded copy reaches the participant.
    return json({standing:"connection_recorded",saved:true,message:"Your Connect relationship is confirmed and recorded."})
  } catch { return hold(stage,true) }
}
