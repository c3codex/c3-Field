import {json,type PassageEnv} from "../_lib/c1-passage"

type Row=Record<string,any>
type InboundEnv=PassageEnv&{C3_RESEND_WEBHOOK_SECRET?:string}
const TARGET_ENV="env_person_eea672f5a7676dad4316755b"
const TARGET_ENVPAC="c3envpac_person_eea672f5a7676dad4316755b_v0_1"
const TARGET_CURRENT="current_env_person_eea672f5a7676dad4316755b_v1"

class InboundError extends Error{
  status:number
  constructor(message:string,status=400){super(message);this.status=status}
}
function base(env:InboundEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new InboundError("server configuration",503)
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rest(env:InboundEnv,path:string,init:RequestInit={}){
  const response=await fetch(base(env)+"/rest/v1/"+path,{
    ...init,redirect:"manual",signal:AbortSignal.timeout(15000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...(init.headers||{})}
  })
  if(!response.ok)throw new InboundError("registry unavailable",response.status>=500?503:409)
  return response
}
function bytesEqual(a:Uint8Array,b:Uint8Array){
  if(a.length!==b.length)return false
  let mismatch=0
  for(let i=0;i<a.length;i++)mismatch|=a[i]^b[i]
  return mismatch===0
}
function decodeBase64(value:string){
  const raw=atob(value)
  return Uint8Array.from(raw,ch=>ch.charCodeAt(0))
}
async function verifySvix(payload:string,request:Request,secret:string){
  const id=request.headers.get("svix-id")||""
  const timestamp=request.headers.get("svix-timestamp")||""
  const signature=request.headers.get("svix-signature")||""
  if(!id||!timestamp||!signature||!/^\d+$/.test(timestamp))return false
  const age=Math.abs(Date.now()/1000-Number(timestamp))
  if(!Number.isFinite(age)||age>300)return false
  const encodedSecret=secret.startsWith("whsec_")?secret.slice(6):secret
  let keyBytes:Uint8Array
  try{keyBytes=decodeBase64(encodedSecret)}catch{return false}
  const key=await crypto.subtle.importKey("raw",keyBytes,{name:"HMAC",hash:"SHA-256"},false,["sign"])
  const signed=new TextEncoder().encode(id+"."+timestamp+"."+payload)
  const digest=new Uint8Array(await crypto.subtle.sign("HMAC",key,signed))
  const candidates=signature.split(/\s+/).map(part=>part.split(",")).filter(parts=>parts[0]==="v1"&&parts[1])
  return candidates.some(parts=>{
    try{return bytesEqual(digest,decodeBase64(parts[1]))}catch{return false}
  })
}
function emailAddress(value:string){
  const match=value.match(/<([^<>\s]+@[^<>\s]+)>/)
  const raw=(match?.[1]||value).trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)?raw:""
}
function displayName(value:string){
  const index=value.lastIndexOf("<")
  return index>0?value.slice(0,index).trim().replace(/^"|"$/g,""):""
}
function headerMap(value:unknown){
  const source=value&&typeof value==="object"&&!Array.isArray(value)?value as Row:{}
  const out:Record<string,string>={}
  for(const [key,item] of Object.entries(source))if(typeof item==="string")out[key.toLowerCase()]=item
  return out
}
function messageIds(value:string){
  const matches=value.match(/<[^<>]+>/g)||[]
  return matches.slice(-20).reverse()
}
async function sha256(value:string){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,"0")).join("")
}
async function providerReceived(env:InboundEnv,emailId:string){
  if(!env.C3_RESEND_API_KEY)throw new InboundError("provider configuration",503)
  const response=await fetch("https://api.resend.com/emails/receiving/"+encodeURIComponent(emailId),{
    headers:{authorization:"Bearer "+env.C3_RESEND_API_KEY},
    redirect:"manual",signal:AbortSignal.timeout(15000)
  })
  if(!response.ok)throw new InboundError("provider email unavailable",502)
  return await response.json() as Row
}
async function findThreadByMessageId(env:InboundEnv,messageId:string){
  if(!messageId)return null
  const q=new URLSearchParams({select:"thread_key",internet_message_id:"eq."+messageId,limit:"1"})
  const rows=await (await rest(env,"c3_cancom_message_ref?"+q)).json() as Row[]
  return typeof rows[0]?.thread_key==="string"?rows[0].thread_key:null
}
async function threadByContact(env:InboundEnv,contactKey:string){
  const q=new URLSearchParams({
    select:"thread_key,work_context_type,work_context_key",
    env_key:"eq."+TARGET_ENV,envpac_key:"eq."+TARGET_ENVPAC,
    contact_key:"eq."+contactKey,standing:"eq.active",order:"last_activity_at.desc",limit:"1"
  })
  const rows=await (await rest(env,"c3_cancom_thread_ref?"+q)).json() as Row[]
  return rows[0]||null
}
async function threadContext(env:InboundEnv,threadKey:string){
  const q=new URLSearchParams({
    select:"thread_key,work_context_type,work_context_key",
    thread_key:"eq."+threadKey,env_key:"eq."+TARGET_ENV,envpac_key:"eq."+TARGET_ENVPAC,limit:"1"
  })
  const rows=await (await rest(env,"c3_cancom_thread_ref?"+q)).json() as Row[]
  return rows[0]||null
}
async function upsertContact(env:InboundEnv,input:{email:string;displayName:string;providerId:string}){
  const response=await rest(env,"rpc/resolve_c3_env_directory_v1",{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({p_request:{
      action:"upsert",env_key:TARGET_ENV,envpac_key:TARGET_ENVPAC,email:input.email,
      display_name:input.displayName||null,preferred_channel:"email",source_class:"cancom_received",
      metadata:{last_inbound_provider_email_id:input.providerId,authority_created:false,relationship_created:false}
    }})
  })
  const body=await response.json() as Row
  if(body.standing!=="resolved"||!body.contact?.contact_key)throw new InboundError("directory return held",502)
  return body.contact as Row
}
async function registerInbound(env:InboundEnv,input:Row){
  const response=await rest(env,"rpc/register_c3_cancom_inbound_ref_v1",{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({p_input:input})
  })
  return await response.json() as Row
}
async function recordCurrentEvidence(env:InboundEnv,input:{
  providerId:string;threadKey:string;hash:string;messageId:string|null;inReplyTo:string|null;sender:string;subject:string
}){
  const key="cancom_inbound_email:"+input.providerId
  await rest(env,"c3_current_evidence_ref?on_conflict=current_evidence_ref_key",{
    method:"POST",
    headers:{"content-type":"application/json","prefer":"resolution=merge-duplicates,return=minimal"},
    body:JSON.stringify({
      current_evidence_ref_key:key,current_state_key:TARGET_CURRENT,evidence_key:input.providerId,
      evidence_class:"cancom_inbound_email",content_hash:input.hash,hash_algorithm:"sha256",
      authoritative_custody_type:"provider",authoritative_custody_provider:"resend",
      authoritative_custody_identifier:input.providerId,
      authoritative_custody_location:"resend:received:"+input.providerId,
      evidence_standing:"observed",source_execution_instance_id:"myenv_cancom_email_runtime_chazz_004",
      metadata:{
        thread_key:input.threadKey,internet_message_id:input.messageId,in_reply_to:input.inReplyTo,
        sender_ref:input.sender,subject:input.subject,authority_created:false,relationship_created:false
      },
      attested_by:"c3ops"
    })
  })
}
export const onRequestPost:PagesFunction<InboundEnv>=async({request,env})=>{
  try{
    if(!env.C3_RESEND_WEBHOOK_SECRET)throw new InboundError("webhook configuration held",503)
    const raw=await request.text()
    if(!await verifySvix(raw,request,env.C3_RESEND_WEBHOOK_SECRET))throw new InboundError("invalid webhook signature",400)
    const event=JSON.parse(raw) as Row
    if(event.type!=="email.received")return json({ok:true,standing:"ignored_event"})
    const eventData=event.data&&typeof event.data==="object"?event.data as Row:{}
    const providerId=typeof eventData.email_id==="string"?eventData.email_id:""
    if(!providerId)throw new InboundError("received email id missing",400)
    const received=await providerReceived(env,providerId)
    const from=typeof received.from==="string"?received.from:""
    const sender=emailAddress(from)
    if(!sender)throw new InboundError("sender email unresolved",400)
    const name=displayName(from)
    const subject=typeof received.subject==="string"?received.subject.trim().slice(0,240):""
    const headers=headerMap(received.headers)
    const inReplyTo=(headers["in-reply-to"]||"").trim()||null
    const references=(headers["references"]||"").trim()
    const messageId=typeof received.message_id==="string"?received.message_id.trim()||null:null
    const candidates=[...(inReplyTo?[inReplyTo]:[]),...messageIds(references)]
    let resolvedThread:string|null=null
    for(const candidate of candidates){
      resolvedThread=await findThreadByMessageId(env,candidate)
      if(resolvedThread)break
    }
    const contact=await upsertContact(env,{email:sender,displayName:name,providerId})
    let context:Row|null=null
    if(resolvedThread)context=await threadContext(env,resolvedThread)
    if(!resolvedThread){
      context=await threadByContact(env,String(contact.contact_key))
      resolvedThread=typeof context?.thread_key==="string"?context.thread_key:null
    }
    if(!resolvedThread)resolvedThread="cancom_email_"+crypto.randomUUID()
    const content=typeof received.text==="string"&&received.text.trim()?received.text:
      typeof received.html==="string"?received.html:""
    const contentHash=await sha256(content)
    const recipient=Array.isArray(received.to)&&typeof received.to[0]==="string"?received.to[0]:"connect@c3field.online"
    const registered=await registerInbound(env,{
      thread_key:resolvedThread,env_key:TARGET_ENV,envpac_key:TARGET_ENVPAC,
      contact_key:String(contact.contact_key),provider_email_id:providerId,
      internet_message_id:messageId,in_reply_to:inReplyTo,subject,sender_ref:sender,recipient_ref:recipient,
      payload_sha256:contentHash,work_context_type:context?.work_context_type||null,
      work_context_key:context?.work_context_key||null,
      occurred_at:received.created_at||event.created_at||new Date().toISOString(),
      thread_metadata:{last_inbound_sender:sender},
      message_metadata:{webhook_event_type:"email.received",verified_signature:true,provider_payload_custody:true}
    })
    if(registered.standing==="registered"){
      await recordCurrentEvidence(env,{providerId,threadKey:resolvedThread,hash:contentHash,messageId,inReplyTo,sender,subject})
    }
    return json({ok:true,standing:registered.standing||"registered",thread_key:resolvedThread})
  }catch(error){
    const status=error instanceof InboundError?error.status:500
    return json({ok:false,standing:"inbound_held",message:error instanceof Error?error.message:"inbound held"},status)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
