import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"
import {createFreeNugServerRuntime,type NugRequest} from "../_lib/free-nugs"

type Row=Record<string,any>
type EmailEnv=PassageEnv
const NUG_KEY="myenv_cancom_email_op044_v1"

class EmailError extends Error{
  status:number
  standing:string
  constructor(message:string,status=409,standing="cancom_email_held"){super(message);this.status=status;this.standing=standing}
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
async function recordReceipt(env:EmailEnv,spec:Row,occurrenceKey:string,providerId:string,to:string,subject:string){
  const receiptMaterial=JSON.stringify({provider:"resend",provider_id:providerId,occurrence_key:occurrenceKey,to,subject})
  const hash=await sha256(receiptMaterial)
  const eventKey="nug_effect_receipt:"+occurrenceKey
  const evidenceKey="nug_effect_receipt:"+occurrenceKey
  const metadata={
    occurrence_key:occurrenceKey,nug_key:NUG_KEY,effect_class:spec.effect_class,
    native_function_ref:spec.native_function_ref,authority_oar_key:spec.authority_oar_key,
    provider:"resend",provider_message_id:providerId
  }
  await rest(env,"c3ops_oar_custody_resolution_event",{
    method:"POST",headers:{"content-type":"application/json","prefer":"return=minimal"},
    body:JSON.stringify({
      resolution_event_key:eventKey,process_key:"c3ops_nug_effect_receipt_v1",
      object_identifier:providerId,object_type:"provider_receipt",related_system:"c3ops",
      intended_function:"cancom_external_email_receipt",standing:"observed",integrity_hash:hash,
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
function errorResponse(error:unknown){
  if(error instanceof EmailError)return json({standing:error.standing,message:error.message},error.status)
  return json({standing:"cancom_email_unavailable",message:"Email is temporarily unavailable."},503)
}
export const onRequestGet:PagesFunction<EmailEnv>=async({request,env})=>{
  try{
    const session=await requireSession(request,env)
    const spec=await binding(env,session)
    const runtime=createFreeNugServerRuntime(base(env),env.SUPABASE_SERVICE_ROLE_KEY!)
    const resolution=await runtime.resolve(nugRequest(spec))
    return json({authenticated:true,standing:resolution.standing==="resolved_for_nug"?"cancom_email_ready":"cancom_email_held"})
  }catch(error){return errorResponse(error)}
}
export const onRequestPost:PagesFunction<EmailEnv>=async({request,env})=>{
  try{
    const session=await requireSession(request,env)
    if(!env.C3_RESEND_API_KEY||!env.C1_VERIFICATION_FROM)throw new EmailError("Email provider configuration is unavailable.",503,"provider_configuration")
    const body=await request.json().catch(()=>null) as Row|null
    if(!body||typeof body!=="object"||Array.isArray(body)||body.action!=="send")throw new EmailError("That email request is invalid.",400,"invalid_email_request")
    const to=email(body.to),subject=clean(body.subject,240,"Subject"),text=clean(body.text,12000,"Message"),key=requestKey(body.request_key)
    const spec=await binding(env,session)
    const runtime=createFreeNugServerRuntime(base(env),env.SUPABASE_SERVICE_ROLE_KEY!)
    const nug=nugRequest(spec)
    const occurrenceKey="myenv-email-"+key
    const prepared=await runtime.prepareEffect(nug,occurrenceKey)
    if(prepared.standing!=="awaiting_effect_receipt")throw new EmailError("CanCom held this email before provider dispatch.",409,String(prepared.standing||"effect_preflight_held"))
    const provider=await fetch("https://api.resend.com/emails",{
      method:"POST",redirect:"manual",signal:AbortSignal.timeout(15000),
      headers:{"content-type":"application/json",authorization:"Bearer "+env.C3_RESEND_API_KEY,"idempotency-key":occurrenceKey},
      body:JSON.stringify({from:env.C1_VERIFICATION_FROM,to:[to],subject,text,html:"<div style=\"white-space:pre-wrap\">"+escapeHtml(text)+"</div>"})
    })
    const providerBody=await provider.json().catch(()=>({})) as Row
    if(!provider.ok||typeof providerBody.id!=="string"||!providerBody.id)throw new EmailError("The email provider did not confirm delivery acceptance.",502,"provider_dispatch_unconfirmed")
    const receiptRef=await recordReceipt(env,spec,occurrenceKey,providerBody.id,to,subject)
    const returned=await runtime.returnEffect(occurrenceKey,spec.executor_ref,receiptRef)
    if(returned.standing!=="receipt_returned")throw new EmailError("The email was accepted by the provider, but the Registry receipt is held.",502,"receipt_return_held")
    return json({ok:true,standing:"email_effect_returned",provider:"resend",receipt_ref:receiptRef})
  }catch(error){return errorResponse(error)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
