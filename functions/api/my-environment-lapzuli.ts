import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"
import {resolveC1MeOperatorContext} from "../_lib/c1me-operator-context"
import {HISTORICAL_ASSET,HISTORICAL_INSTANCE,HISTORICAL_PASSAGE} from "../_lib/lapzuli-historical-claim"
type Env=PassageEnv&{OPERATOR_DISPATCH_KEY?:string}
const record=(v:unknown):Record<string,unknown>=>v&&typeof v==="object"&&!Array.isArray(v)?v as Record<string,unknown>:{}
const receiptReasons=new Set([
  "existing_individual_session_inactive","session_original_owner_grant_inactive_or_mismatched",
  "existing_op044_context_unresolved","existing_identity_or_personal_operator_relation_revoked",
  "existing_c3ops_operator_relation_unresolved","required_c3me_effect_standing_needs_native_qualification",
  "myenv_lapzuli_identity_passage_capability_inactive_or_unscoped",
  "independently_reviewed_native_installation_unresolved","native_installer_role_review_evidence_unresolved",
  "current_pac_source_derivative_route_or_release_mismatch","current_source_media_rights_or_custody_mismatch",
  "fresh_native_source_media_provider_evidence_unresolved","native_preflight_producer_authority_unresolved",
  "prepared_payload_differs_from_registry","historical_occurrence_already_recorded",
  "native_individual_source_effect_admission_uninstalled","historical_prior_attempt_requires_resolution",
  "stale_claim_requires_resolution","dispatch_claim_active","worker_transport_outcome_uncertain",
  "provider_outcome_evidence_persistence_held","historical_native_claim_unavailable_or_unverified",
  ...["operator","notchazz","registrar","executor"].flatMap(role=>[
    "separate_exact_effect_grant_unresolved:"+role,"historical_effect_capability_unresolved:"+role]),
])

// Reuses the My Env session and the existing server-to-c3Ops transport pattern.
// It creates no session, identity, participant, grant or public token exchange.
export const onRequestPost:PagesFunction<Env>=async({request,env})=>{
  if(new URL(request.url).origin!=="https://my.c3field.online")return json({standing:"HLD",reason:"host_boundary",external_publication_effects:0},404)
  if(request.headers.get("origin")!=="https://my.c3field.online"||
    request.headers.get("content-type")?.split(";")[0].trim()!=="application/json")
    return json({standing:"HLD",reason:"same_origin_json_required",external_publication_effects:0},403)
  let passageAttempted=false
  try{
    const parts=(request.headers.get("cookie")??"").split(";").map(x=>x.trim()).filter(x=>x.startsWith("c3_env_session="))
    if(parts.length!==1)throw Error("session_required")
    const raw=parts[0].slice("c3_env_session=".length)
    const session=await resolveEnvironmentSession(raw,env)
    const context=await resolveC1MeOperatorContext(session.subjectKey,env)
    const operators=context.operators?.filter(x=>x.operator_identifier==="op044")??[]
    if(session.subjectType!=="individual"||context.resolution!=="operator_context_resolved"||
      context.relationship_ref!==session.subjectKey||context.env_key!==session.envKey||
      context.envpac_ref!==session.envpacKey||operators.length!==1||!operators[0].named_individual_key)
      throw Error("operator_context_held")
    const body=record(await request.json())
    if(!body||body.action!=="dispatch_historical_asset"||body.distribution_asset_key!==HISTORICAL_ASSET||
      Object.keys(body).some(k=>!["action","distribution_asset_key","native_preflight_evidence_key"].includes(k))||
      (body.native_preflight_evidence_key!==undefined&&
        (typeof body.native_preflight_evidence_key!=="string"||!/^[-a-zA-Z0-9_:]{1,240}$/.test(body.native_preflight_evidence_key))))
      return json({standing:"HLD",reason:"exact_historical_action_required",external_publication_effects:0},409)
    if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw Error("transport_unavailable")
    const query=new URLSearchParams({select:"standing,scope",envpac_key:"eq."+session.envpacKey,
      system_key:"eq.c3ops",capability:"eq.lapzuli_distribution",limit:"2"})
    const grantResponse=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/c3_envpac_capability_grant?"+query,{
      headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
      redirect:"manual",signal:AbortSignal.timeout(12000),
    })
    const grants=grantResponse.ok?await grantResponse.json():null,grant=Array.isArray(grants)&&grants.length===1?grants[0]:null
    if(grant?.standing!=="active"||!Array.isArray(grant.scope?.allowed_actions)||
      !grant.scope.allowed_actions.includes("historical_identity_passage")||grant.scope.execution_instance!==HISTORICAL_INSTANCE||
      grant.scope.operator_ref!=="op044"||grant.scope.allowed_asset!==HISTORICAL_ASSET||
      !Number.isFinite(Date.parse(grant.scope.expires_at))||Date.parse(grant.scope.expires_at)<=Date.now())
      return json({standing:"HLD",reason:"myenv_lapzuli_identity_passage_capability_inactive_or_unscoped",external_publication_effects:0},409)
    if(!env.OPERATOR_DISPATCH_KEY)throw Error("transport_unavailable")
    // Fixed host, action, asset, instance and HTTPS audience; redirects disabled.
    // Never forward Cookie, Authorization or user-supplied identity headers.
    passageAttempted=true
    const response=await fetch("https://c3ops.c3field.online/api/c3ops/lapzuli",{
      method:"POST",redirect:"manual",signal:AbortSignal.timeout(60000),
      headers:{"content-type":"application/json","x-operator-dispatch-key":env.OPERATOR_DISPATCH_KEY,
        "x-c3-contract":HISTORICAL_PASSAGE,"x-c3-source-origin":"https://my.c3field.online",
        "x-c3-execution-instance":HISTORICAL_INSTANCE,"x-c3-private-owner-session":session.token},
      body:JSON.stringify(body),
    })
    if(response.status>=300&&response.status<400)throw Error("transport_unverified")
    const result=record(await response.json().catch(()=>null))
    const secrets=[session.token,env.SUPABASE_SERVICE_ROLE_KEY,env.OPERATOR_DISPATCH_KEY].filter((x):x is string=>!!x)
    const safeString=(v:unknown):v is string=>typeof v==="string"&&!secrets.some(secret=>v.includes(secret))
    // Return a strict receipt projection, never arbitrary upstream data/headers.
    if(typeof result.standing!=="string"||!["ACT","HLD"].includes(result.standing)||
      !(result.external_publication_effects===0||result.external_publication_effects===1||result.external_publication_effects===null))throw Error("transport_unverified")
    const safeReason=safeString(result.reason)&&receiptReasons.has(result.reason)?result.reason:result.standing==="HLD"?"historical_dispatch_held":null
    return json({standing:result.standing,reason:safeReason,
      execution_id:safeString(result.execution_id)&&/^[0-9a-f-]{36}$/.test(result.execution_id)?result.execution_id:null,
      historical_occurrence_key:safeString(result.historical_occurrence_key)&&/^historical_manual_distribution_v1:[0-9a-f]{64}$/.test(result.historical_occurrence_key)?result.historical_occurrence_key:null,
      external_publication_effects:result.external_publication_effects},response.ok?200:409)
  }catch{
    // Errors after passage may be outcome-uncertain. Never include exception
    // text, request headers, session, response body or credentials in evidence.
    return json({standing:"HLD",reason:"session_operator_or_passage_unverified",external_publication_effects:passageAttempted?null:0,automatic_retry_allowed:false},409)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
