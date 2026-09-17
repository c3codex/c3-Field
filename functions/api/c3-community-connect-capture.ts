import {captureCandidate, type PassageEnv} from "../_lib/c1-passage"
import {unable} from "../_lib/c1-abuse"
const headers = {"content-type": "application/json; charset=utf-8", "cache-control": "no-store"}
const allowed = new Set(["name", "email", "message", "consent", "participationIntention", "attestation", "connectAs", "initiativeKey", "shareReference"])
function held(standing: string, message: string, status: number, evidence?: unknown) {
  return unable(status)
}
const clean = (value: unknown) => typeof value === "string" ? value.trim() : ""
const shareShape = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function resolveShareReference(env:PassageEnv,value:unknown){
  if(value===undefined) return null
  if(typeof value!=="string" || !shareShape.test(value)) throw new Error("share_reference_shape")
  if(!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("share_reference_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/c3_env_share_reference")
  url.searchParams.set("select","share_reference,source_env_key,source_envpac_key,share_state")
  url.searchParams.set("share_reference","eq."+value)
  url.searchParams.set("share_state","eq.active")
  url.searchParams.set("limit","1")
  const response=await fetch(url.toString(),{
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
    redirect:"manual",signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("share_reference_read")
  const rows=await response.json() as Array<Record<string,unknown>>
  const row=rows[0]
  if(!row || row.share_reference!==value || typeof row.source_env_key!=="string" || typeof row.source_envpac_key!=="string") throw new Error("share_reference_unavailable")
  return {share_reference:value,source_env_key:row.source_env_key,source_envpac_key:row.source_envpac_key,provenance_only:true,relationship_created:false,standing_created:false}
}

export const onRequestPost: PagesFunction<PassageEnv> = async ({request, env}) => {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return held("held_content_type", "A JSON submission is required.", 415)
  const origin = request.headers.get("origin")
  if (origin && origin !== new URL(request.url).origin)
    return held("held_origin_mismatch", "The submission could not be verified.", 403)
  const reader = request.body?.getReader()
  if (!reader) return held("held_invalid_candidate_signal", "A submission is required.", 400)
  let length = 0
  const chunks: Uint8Array[] = []
  try {
    while (true) {
      const {value, done} = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > 16384) {
        await reader.cancel()
        return held("held_request_too_large", "The submission is too long.", 413)
      }
      chunks.push(value)
    }
  } catch { return held("held_invalid_candidate_signal", "The submission could not be read.", 400) }
  let body: Record<string, unknown>
  try {
    const buffer = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length }
    const parsed = JSON.parse(new TextDecoder().decode(buffer))
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("object required")
    body = parsed
  } catch { return held("held_invalid_candidate_signal", "The submission could not be read.", 400) }
  // Client Registry CAR, verified contact, Boundary, timestamp, persistence and Current are never authority.
  if (Object.keys(body).some(key => !allowed.has(key)))
    return held("held_unexpected_candidate_field", "The submission contains unsupported fields.", 400)
  const name = clean(body.name), email = clean(body.email), message = clean(body.message)
  if (name.length < 2 || name.length > 160 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      message.length > 4000 || (body.message !== undefined && typeof body.message !== "string"))
    return held("held_invalid_candidate_signal", "A name and valid email are required. Please check the length of your response.", 400)
  if (body.consent !== true || body.participationIntention !== true || body.attestation !== true)
    return held("held_required_evidence_missing", "Consent, an accuracy confirmation and participation intention are required.", 400)
  if (body.connectAs !== "individual" || body.initiativeKey !== undefined)
    return held("held_initiative_binding_missing", "This connection context is not available.", 409)
  if (env?.C1_PASSAGE_ENABLED === "true") {
    if (origin !== env.C1_PUBLIC_ORIGIN || origin !== new URL(request.url).origin)
      return held("held_origin_mismatch", "The submission could not be verified.", 403)
    let sourceEnvironmentShare:null|Record<string,unknown>=null
    try{sourceEnvironmentShare=await resolveShareReference(env,body.shareReference)}
    catch{return held("held_invite_reference_invalid","This connection invitation is not available.",409)}
    return captureCandidate({name,email,message,...(sourceEnvironmentShare?{sourceEnvironmentShare}: {})},env)
  }
  return unable()
}
export const onRequest: PagesFunction = async () =>
  new Response(JSON.stringify({error:"method not allowed"}), {status:405,headers:{...headers,allow:"POST"}})
