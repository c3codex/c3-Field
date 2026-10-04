import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type Row=Record<string,any>
type WorkspaceEnv=PassageEnv

class WorkspaceError extends Error{
  status:number
  standing:string
  constructor(message:string,status=409,standing="cancom_workspace_held"){super(message);this.status=status;this.standing=standing}
}
function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name)return decodeURIComponent(rest.join("="))
  }
  return null
}
function base(env:WorkspaceEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new WorkspaceError("CanCom is unavailable.",503,"server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rest(env:WorkspaceEnv,path:string,init:RequestInit={}){
  const response=await fetch(base(env)+"/rest/v1/"+path,{
    ...init,redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...(init.headers||{})}
  })
  if(!response.ok)throw new WorkspaceError("CanCom is temporarily unavailable.",response.status>=500?503:409)
  return response
}
async function session(request:Request,env:WorkspaceEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new WorkspaceError("Open your environment again to continue.",401,"environment_session_required")
  try{return await resolveEnvironmentSession(raw,env)}
  catch{throw new WorkspaceError("Your environment session is no longer available.",401,"environment_session_invalid")}
}
function stripHtml(value:string){
  return value.replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim()
}
async function providerEmail(env:WorkspaceEnv,row:Row){
  if(!env.C3_RESEND_API_KEY)return {...row,content_standing:"provider_configuration_held",text:null}
  const inbound=row.direction==="inbound"
  const path=inbound?"emails/receiving/"+encodeURIComponent(row.provider_email_id):"emails/"+encodeURIComponent(row.provider_email_id)
  const response=await fetch("https://api.resend.com/"+path,{
    headers:{authorization:"Bearer "+env.C3_RESEND_API_KEY},
    redirect:"manual",signal:AbortSignal.timeout(12000)
  })
  if(!response.ok)return {...row,content_standing:"provider_content_unavailable",text:null}
  const body=await response.json().catch(()=>({})) as Row
  const content=typeof body.text==="string"&&body.text.trim()?body.text.trim():
    typeof body.html==="string"?stripHtml(body.html):""
  return {
    ...row,
    content_standing:"resolved",
    text:content,
    provider_from:body.from||row.sender_ref||null,
    provider_to:Array.isArray(body.to)?body.to:[],
    provider_reply_to:Array.isArray(body.reply_to)?body.reply_to:[],
    message_id:body.message_id||row.internet_message_id||null
  }
}
async function signature(env:WorkspaceEnv){
  const q=new URLSearchParams({
    select:"metadata",
    source_key:"eq.c3field_public_identity_authority_v1_0",
    limit:"1"
  })
  const rows=await (await rest(env,"codex_source_reference?"+q)).json() as Row[]
  const metadata=rows[0]?.metadata&&typeof rows[0].metadata==="object"?rows[0].metadata as Row:{}
  return {
    display_name:"Stephanie Joanne Gaffney",
    title:null,
    brand:String(metadata.brand||"c3 Community Partners"),
    legal_entity:String(metadata.legal_entity||"c3 Community Partners DAO, LLC"),
    model_path:String(metadata.model_path||"Connect · Contribute · Create"),
    email:String(metadata.contact_email||"connect@c3field.online"),
    website:"c3field.online"
  }
}
function failure(error:unknown){
  if(error instanceof WorkspaceError)return json({standing:error.standing,message:error.message},error.status)
  return json({standing:"cancom_workspace_unavailable",message:"CanCom is temporarily unavailable."},503)
}
export const onRequestGet:PagesFunction<WorkspaceEnv>=async({request,env})=>{
  try{
    const s=await session(request,env)
    const url=new URL(request.url)
    const threadKey=(url.searchParams.get("thread_key")||"").trim()
    const tq=new URLSearchParams({
      select:"thread_key,contact_key,channel,thread_subject,work_context_type,work_context_key,root_internet_message_id,latest_internet_message_id,latest_provider_email_id,last_direction,unread_count,standing,metadata,last_activity_at,created_at",
      env_key:"eq."+s.envKey,
      envpac_key:"eq."+s.envpacKey,
      standing:"eq.active",
      order:"last_activity_at.desc",
      limit:"100"
    })
    const threads=await (await rest(env,"c3_cancom_thread_ref?"+tq)).json() as Row[]
    const directoryResponse=await rest(env,"rpc/resolve_c3_env_directory_v2",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({p_request:{action:"list",env_key:s.envKey,envpac_key:s.envpacKey}})
    })
    const directory=await directoryResponse.json() as Row
    if(directory.standing!=="resolved")throw new WorkspaceError("Directory is held in this environment.",409,String(directory.reason||"directory_held"))
    const contacts=Array.isArray(directory.contacts)?directory.contacts as Row[]:[]
    const contactMap=new Map(contacts.map(contact=>[String(contact.contact_key),contact]))
    const enrichedThreads=threads.map(thread=>({...thread,contact:thread.contact_key?contactMap.get(String(thread.contact_key))||null:null}))
    let messages:Row[]=[]
    if(threadKey){
      const thread=enrichedThreads.find(item=>item.thread_key===threadKey)
      if(!thread)throw new WorkspaceError("That CanCom thread is not available in this environment.",404,"thread_not_found")
      const mq=new URLSearchParams({
        select:"message_ref_key,thread_key,direction,transport,provider,provider_email_id,internet_message_id,in_reply_to,subject,sender_ref,recipient_ref,payload_sha256,payload_custody_ref,delivery_standing,work_context_type,work_context_key,metadata,occurred_at",
        thread_key:"eq."+threadKey,
        order:"occurred_at.asc",
        limit:"100"
      })
      const refs=await (await rest(env,"c3_cancom_message_ref?"+mq)).json() as Row[]
      messages=await Promise.all(refs.map(row=>providerEmail(env,row)))
    }
    return json({
      authenticated:true,
      standing:"resolved",
      signature:await signature(env),
      threads:enrichedThreads,
      contacts,
      selected_thread:threadKey||null,
      messages
    })
  }catch(error){return failure(error)}
}
export const onRequestPost:PagesFunction<WorkspaceEnv>=async({request,env})=>{
  try{
    const s=await session(request,env)
    const body=await request.json().catch(()=>null) as Row|null
    if(!body||body.action!=="mark_read"||typeof body.thread_key!=="string")throw new WorkspaceError("That CanCom action is not available.",400,"invalid_cancom_action")
    const q=new URLSearchParams({thread_key:"eq."+body.thread_key,env_key:"eq."+s.envKey,envpac_key:"eq."+s.envpacKey})
    await rest(env,"c3_cancom_thread_ref?"+q,{
      method:"PATCH",headers:{"content-type":"application/json","prefer":"return=minimal"},
      body:JSON.stringify({unread_count:0,updated_at:new Date().toISOString()})
    })
    return json({ok:true,standing:"resolved"})
  }catch(error){return failure(error)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
