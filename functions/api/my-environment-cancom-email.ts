import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"
import {createFreeNugServerRuntime,type NugRequest} from "../_lib/free-nugs"

type Row=Record<string,any>
type EmailEnv=PassageEnv&{C3_CANCOM_REPLY_TO?:string}
const NUG_KEY="myenv_cancom_email_op044_v1"
type Decision={standing:string;disposition:string;reason_code:string;request_identity:Row;provider_preflight:Row;external_effects:number|"unverified";missing_predicates?:unknown;registry_error?:unknown}

function decision(standing:string,reason:string,identity:Row={},provider:Row={standing:"not_checked",dispatch_attempted:false},effects:number|"unverified"=0):Decision{
  return {standing,disposition:effects===1?"provider_accepted_receipt_held":effects==="unverified"?"dispatch_unverified":"held_before_provider_dispatch",reason_code:reason,request_identity:identity,provider_preflight:provider,external_effects:effects}
}

class EmailError extends Error{
  status:number
  standing:string
  evidence?:Decision
  constructor(message:string,status=409,standing="cancom_email_held",evidence?:Decision){super(message);this.status=status;this.standing=standing;this.evidence=evidence}
}
function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name)return decodeURIComponent(rest.join("="))
  }
  return null
}
function base(env:EmailEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new EmailError("Email is unavailable.",503,"server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rest(env:EmailEnv,path:string,init:RequestInit={}){
  const response=await fetch(base(env)+"/rest/v1/"+path,{
    ...init,redirect:"manual",signal:AbortSignal.timeout(15000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...(init.headers||{})}
  })
  if(!response.ok)throw new EmailError("Email is temporarily unavailable.",response.status>=500?503:409)
  return response
}
async function requireSession(request:Request,env:EmailEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new EmailError("Open your environment again to continue.",401,"environment_session_required")
  try{return await resolveEnvironmentSession(raw,env)}
  catch{throw new EmailError("Your environment session is no longer available.",401,"environment_session_invalid")}
}
function clean(value:unknown,max:number,label:string){
  if(typeof value!=="string")throw new EmailError(label+" is required.",400,"invalid_email_request")
  const v=value.trim()
  if(!v||v.length>max)throw new EmailError(label+" is outside the allowed boundary.",400,"invalid_email_request")
  return v
}
function optional(value:unknown,max:number){
  return typeof value==="string"?value.trim().slice(0,max):""
}
function email(value:unknown){
  const v=clean(value,320,"Recipient")
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||v.includes(",")||v.includes(";"))throw new EmailError("Use one valid recipient email address.",400,"invalid_email_recipient")
  return v.toLowerCase()
}
function requestKey(value:unknown){
  if(typeof value!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
    throw new EmailError("The email request key is invalid.",400,"invalid_email_request")
  return value.toLowerCase()
}
function threadKey(value:unknown){
  if(typeof value==="string"&&/^cancom_email_[a-z0-9-]{8,80}$/i.test(value))return value
  return "cancom_email_"+crypto.randomUUID()
}
async function binding(env:EmailEnv,session:EnvironmentSession){
  const q=new URLSearchParams({select:"nug_key,standing,spec",nug_key:"eq."+NUG_KEY,limit:"1"})
  const rows=await (await rest(env,"c3ops_nug_binding?"+q)).json() as Row[]
  const row=rows[0]
  if(!row||row.standing!=="active"||!row.spec)throw new EmailError("CanCom email is not active in this environment.",409,"nug_binding_held")
  const spec=row.spec as Row
  if(spec.envpac_key!==session.envpacKey||spec.env_key!==session.envKey||spec.current_state_key!=="current_env_person_eea672f5a7676dad4316755b_v1")
    throw new EmailError("CanCom email is not authorized for this environment.",403,"nug_environment_mismatch")
  return spec
}
function nugRequest(spec:Row):NugRequest{
  const fields=["origin_env_key","env_key","envpac_key","current_state_key","executor_ref","execution_instance","capability_ref","authority_oar_key","context_binding_key"]
  const out:Row={nug_key:NUG_KEY}
  for(const field of fields){
    if(typeof spec[field]!=="string"||!spec[field].trim())throw new EmailError("CanCom email authority is incomplete.",409,"nug_authority_incomplete")
    out[field]=spec[field]
  }
  return out as NugRequest
}
async function sha256(value:string){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,"0")).join("")
}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]!))}
function htmlLines(value:string){return value.split(/\n/).map(line=>line?escapeHtml(line):"&nbsp;").join("<br>")}
async function signature(env:EmailEnv){
  const q=new URLSearchParams({select:"metadata",source_key:"eq.c3field_public_identity_authority_v1_0",limit:"1"})
  const rows=await (await rest(env,"codex_source_reference?"+q)).json() as Row[]
  const metadata=rows[0]?.metadata&&typeof rows[0].metadata==="object"?rows[0].metadata as Row:{}
  return {
    display_name:"Stephanie Joanne Gaffney",
    brand:String(metadata.brand||"c3 Community Partners"),
    legal_entity:String(metadata.legal_entity||"c3 Community Partners DAO, LLC"),
    model_path:String(metadata.model_path||"Connect · Contribute · Create"),
    email:String(metadata.contact_email||"connect@c3field.online"),
    website:"c3field.online"
  }
}
function signatureText(sig:Row){
  return [
    "Stephanie Joanne Gaffney",
    String(sig.legal_entity||"c3 Community Partners DAO, LLC"),
    String(sig.model_path||"Connect · Contribute · Create"),
    String(sig.email||"connect@c3field.online")+" | "+String(sig.website||"c3field.online")
  ].join("\n")
}
async function upsertDirectory(env:EmailEnv,session:EnvironmentSession,input:{email:string;displayName:string;organization:string;sourceClass:string;metadata:Row}){
  const response=await rest(env,"rpc/resolve_c3_env_directory_v1",{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({p_request:{
      action:"upsert",env_key:session.envKey,envpac_key:session.envpacKey,email:input.email,
      display_name:input.displayName||null,organization:input.organization||null,
      preferred_channel:"email",source_class:input.sourceClass,metadata:input.metadata
    }})
  })
  const result=await response.json() as Row
  if(result.standing!=="resolved"||!result.contact)throw new EmailError("The email was accepted, but its Directory contact could not be resolved.",409,"directory_return_held")
  return result.contact as Row
}
async function sentProviderEmail(env:EmailEnv,providerId:string){
  if(!env.C3_RESEND_API_KEY)return null
  const response=await fetch("https://api.resend.com/emails/"+encodeURIComponent(providerId),{
    headers:{authorization:"Bearer "+env.C3_RESEND_API_KEY},
    redirect:"manual",signal:AbortSignal.timeout(12000)
  })
  if(!response.ok)return null
  return await response.json().catch(()=>null) as Row|null
}
async function upsertThreadAndMessage(env:EmailEnv,input:{
  session:EnvironmentSession;contact:Row;threadKey:string;providerId:string;internetMessageId:string|null;
  to:string;subject:string;fullText:string;workContextType:string;workContextKey:string;displayName:string;organization:string
}){
  const now=new Date().toISOString()
  const thread={
    thread_key:input.threadKey,env_key:input.session.envKey,envpac_key:input.session.envpacKey,
    contact_key:input.contact.contact_key||null,channel:"email",thread_subject:input.subject,
    work_context_type:input.workContextType||null,work_context_key:input.workContextKey||null,
    root_internet_message_id:input.internetMessageId||null,latest_internet_message_id:input.internetMessageId||null,
    latest_provider_email_id:input.providerId,last_direction:"outbound",unread_count:0,standing:"active",
    metadata:{recipient_email:input.to,display_name:input.displayName||null,organization:input.organization||null,authority_created:false,relationship_created:false},
    last_activity_at:now,updated_at:now
  }
  await rest(env,"c3_cancom_thread_ref?on_conflict=thread_key",{
    method:"POST",headers:{"content-type":"application/json","prefer":"resolution=merge-duplicates,return=minimal"},
    body:JSON.stringify(thread)
  })
  const payloadHash=await sha256(input.fullText)
  await rest(env,"c3_cancom_message_ref?on_conflict=provider,provider_email_id",{
    method:"POST",headers:{"content-type":"application/json","prefer":"resolution=merge-duplicates,return=minimal"},
    body:JSON.stringify({
      thread_key:input.threadKey,direction:"outbound",transport:"email",provider:"resend",
      provider_email_id:input.providerId,internet_message_id:input.internetMessageId||null,
      subject:input.subject,sender_ref:"connect@c3field.online",recipient_ref:input.to,
      payload_sha256:payloadHash,payload_custody_ref:"resend:sent:"+input.providerId,
      delivery_standing:"provider_accepted",work_context_type:input.workContextType||null,
      work_context_key:input.workContextKey||null,
      metadata:{signature_source:"c3field_public_identity_authority_v1_0",authority_created:false,relationship_created:false},
      occurred_at:now
    })
  })
}
async function recordReceipt(env:EmailEnv,spec:Row,occurrenceKey:string,providerId:string,to:string,subject:string,threadKey:string,internetMessageId:string|null){
  const receiptMaterial=JSON.stringify({provider:"resend",provider_id:providerId,occurrence_key:occurrenceKey,to,subject,thread_key:threadKey,message_id:internetMessageId})
  const hash=await sha256(receiptMaterial)
  const eventKey="nug_effect_receipt:"+occurrenceKey
  const evidenceKey="nug_effect_receipt:"+occurrenceKey
  const metadata={
    occurrence_key:occurrenceKey,nug_key:NUG_KEY,effect_class:spec.effect_class,
    native_function_ref:spec.native_function_ref,authority_oar_key:spec.authority_oar_key,executor_ref:spec.executor_ref,
    provider:"resend",provider_message_id:providerId,thread_key:threadKey,internet_message_id:internetMessageId
  }
  await rest(env,"c3ops_oar_custody_resolution_event",{
    method:"POST",headers:{"content-type":"application/json","prefer":"return=minimal"},
    body:JSON.stringify({
      resolution_event_key:eventKey,process_key:"oar_evidence_asset_custody_resolution_v1",
      object_identifier:providerId,object_type:"evidence",related_system:"c3ops",
      intended_function:"nug_effect_receipt",standing:"observed",integrity_hash:hash,
      custody_type:"registry_receipt_manifest",custody_reference:"resend:"+providerId,
      retrieval_access_rule:"resolve_by:occurrence:"+occurrenceKey,
      related_execution_instance:spec.execution_instance,related_oar2:spec.authority_oar_key,
      resolution_status:"resolved",metadata
    })
  })
  await rest(env,"c3_current_evidence_ref",{
    method:"POST",headers:{"content-type":"application/json","prefer":"return=minimal"},
    body:JSON.stringify({
      current_evidence_ref_key:evidenceKey,current_state_key:spec.current_state_key,
      evidence_key:providerId,evidence_class:"nug_effect_receipt",content_hash:hash,hash_algorithm:"sha256",
      authoritative_custody_type:"registry",authoritative_custody_provider:"supabase",
      authoritative_custody_identifier:eventKey,
      authoritative_custody_location:"registry://c3ops_oar_custody_resolution_event/"+eventKey,
      evidence_standing:"observed",source_execution_instance_id:spec.execution_instance,
      metadata,attested_by:spec.executor_ref
    })
  })
  return evidenceKey
}
function errorResponse(error:unknown,evidence?:Decision){
  if(error instanceof EmailError&&evidence?.reason_code==="request_not_resolved")evidence={...evidence,reason_code:error.standing}
  if(error instanceof EmailError)return json({...error.evidence||evidence||decision(error.standing,error.standing),standing:error.standing,message:error.message},error.status)
  return json({...evidence||decision("cancom_email_unavailable","cancom_email_unavailable"),standing:"cancom_email_unavailable",message:"Email is temporarily unavailable."},503)
}
export const onRequestGet:PagesFunction<EmailEnv>=async({request,env})=>{
  try{
    const session=await requireSession(request,env)
    const spec=await binding(env,session)
    const runtime=createFreeNugServerRuntime(base(env),env.SUPABASE_SERVICE_ROLE_KEY!)
    const resolution=await runtime.resolve(nugRequest(spec))
    return json({
      authenticated:true,
      standing:resolution.standing==="resolved_for_nug"?"cancom_email_ready":"cancom_email_held",
      signature:await signature(env),
      from:env.C1_VERIFICATION_FROM||"c3 Community Partners <connect@c3field.online>",
      reply_to:env.C3_CANCOM_REPLY_TO||"connect@c3field.online",
      disposition:resolution.standing==="resolved_for_nug"?"ready_for_effect_preflight":"held_before_provider_dispatch",
      reason_code:resolution.standing==="resolved_for_nug"?"nug_resolved":String(resolution.reason||"nug_preflight_held"),
      request_identity:nugRequest(spec),
      provider_preflight:{standing:env.C3_RESEND_API_KEY&&env.C1_VERIFICATION_FROM?"configured":"configuration_missing",dispatch_attempted:false},
      external_effects:0,missing_predicates:resolution.missing_predicates
    })
  }catch(error){return errorResponse(error)}
}
export const onRequestPost:PagesFunction<EmailEnv>=async({request,env})=>{
  let evidence=decision("cancom_email_held","request_not_resolved")
  try{
    const session=await requireSession(request,env)
    if(!env.C3_RESEND_API_KEY||!env.C1_VERIFICATION_FROM)throw new EmailError("Email provider configuration is unavailable.",503,"provider_configuration")
    const body=await request.json().catch(()=>null) as Row|null
    if(!body||typeof body!=="object"||Array.isArray(body)||body.action!=="send")throw new EmailError("That email request is invalid.",400,"invalid_email_request")
    const to=email(body.to)
    const subject=clean(body.subject,240,"Subject")
    const message=clean(body.text,12000,"Message")
    const key=requestKey(body.request_key)
    evidence.request_identity={request_key:key,occurrence_key:"myenv-email-"+key}
    evidence.provider_preflight={standing:"configured",dispatch_attempted:false,sender:env.C1_VERIFICATION_FROM}
    const resolvedThreadKey=threadKey(body.thread_key)
    const displayName=optional(body.display_name,180)
    const organization=optional(body.organization,240)
    const workContextType=optional(body.work_context_type,120)
    const workContextKey=optional(body.work_context_key,240)
    const sig=await signature(env)
    const fullText=message+"\n\n"+signatureText(sig)
    const fullHtml='<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#111827">'+
      '<div style="white-space:normal">'+htmlLines(message)+'</div>'+
      '<div style="margin-top:28px;padding-top:18px;border-top:1px solid #d1d5db">'+
      '<strong style="font-size:16px">Stephanie Joanne Gaffney</strong><br>'+
      '<span>'+escapeHtml(String(sig.legal_entity))+'</span><br>'+
      '<span style="letter-spacing:.04em">'+escapeHtml(String(sig.model_path))+'</span><br>'+
      '<a href="mailto:'+escapeHtml(String(sig.email))+'">'+escapeHtml(String(sig.email))+'</a> · '+
      '<a href="https://c3field.online">c3field.online</a></div></div>'

    const spec=await binding(env,session)
    const runtime=createFreeNugServerRuntime(base(env),env.SUPABASE_SERVICE_ROLE_KEY!)
    const nug=nugRequest(spec)
    const occurrenceKey="myenv-email-"+key
    evidence.request_identity={...evidence.request_identity,...nug}
    const prepared=await runtime.prepareEffect(nug,occurrenceKey)
    if(prepared.standing!=="awaiting_effect_receipt"){
      const reason=typeof prepared.reason==="string"?prepared.reason:"nug_preflight_held"
      evidence={...evidence,standing:String(prepared.standing||"HLD"),reason_code:reason,missing_predicates:prepared.missing_predicates,registry_error:prepared.registry_error}
      throw new EmailError("CanCom held this email before provider dispatch: "+reason+".",409,evidence.standing,evidence)
    }

    const replyTo=env.C3_CANCOM_REPLY_TO||"connect@c3field.online"
    evidence={...evidence,reason_code:"provider_dispatch_unverified",disposition:"dispatch_unverified",provider_preflight:{...evidence.provider_preflight,standing:"dispatch_attempted",dispatch_attempted:true},external_effects:"unverified"}
    const provider=await fetch("https://api.resend.com/emails",{
      method:"POST",redirect:"manual",signal:AbortSignal.timeout(15000),
      headers:{"content-type":"application/json",authorization:"Bearer "+env.C3_RESEND_API_KEY,"idempotency-key":occurrenceKey},
      body:JSON.stringify({
        from:env.C1_VERIFICATION_FROM,to:[to],reply_to:replyTo,subject,text:fullText,html:fullHtml,
        tags:[{name:"cancom_thread",value:resolvedThreadKey.slice(0,256)}]
      })
    })
    const providerBody=await provider.json().catch(()=>({})) as Row
    if(!provider.ok||typeof providerBody.id!=="string"||!providerBody.id)throw new EmailError("The email provider did not confirm delivery acceptance.",502,"provider_dispatch_unconfirmed")
    evidence={...evidence,reason_code:"receipt_return_pending",disposition:"provider_accepted_receipt_held",provider_preflight:{...evidence.provider_preflight,standing:"provider_accepted",provider_email_id:providerBody.id},external_effects:1}

    const providerRecord=await sentProviderEmail(env,providerBody.id)
    const internetMessageId=typeof providerRecord?.message_id==="string"?providerRecord.message_id:null
    const contact=await upsertDirectory(env,session,{
      email:to,displayName,organization,sourceClass:"cancom_sent",
      metadata:{last_cancom_thread:resolvedThreadKey,last_provider_email_id:providerBody.id,work_context_type:workContextType||null,work_context_key:workContextKey||null}
    })
    await upsertThreadAndMessage(env,{
      session,contact,threadKey:resolvedThreadKey,providerId:providerBody.id,internetMessageId,to,subject,fullText,
      workContextType,workContextKey,displayName,organization
    })
    const receiptRef=await recordReceipt(env,spec,occurrenceKey,providerBody.id,to,subject,resolvedThreadKey,internetMessageId)
    const returned=await runtime.returnEffect(occurrenceKey,spec.executor_ref,receiptRef)
    if(returned.standing!=="receipt_returned"){
      evidence={...evidence,reason_code:String(returned.reason||"effect_receipt_return_unverified")}
      throw new EmailError("The email was accepted by the provider, but the Registry receipt is held.",502,"receipt_return_held",evidence)
    }
    return json({
      ...evidence,disposition:"effect_returned",reason_code:"provider_accepted_receipt_returned",
      ok:true,standing:"email_effect_returned",provider:"resend",receipt_ref:receiptRef,
      thread_key:resolvedThreadKey,provider_email_id:providerBody.id,internet_message_id:internetMessageId,
      directory_contact:contact
    })
  }catch(error){return errorResponse(error,evidence)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
