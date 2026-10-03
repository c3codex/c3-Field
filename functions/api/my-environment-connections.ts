import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type Row=Record<string,unknown>

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name){try{return decodeURIComponent(rest.join("="))}catch{return null}}
  }
  return null
}
function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
function headers(env:PassageEnv,extra:Record<string,string>={}){
  return {apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...extra}
}
async function read(env:PassageEnv,table:string,params:Record<string,string>){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v)
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("read_shape")
  return rows as Row[]
}
async function write(env:PassageEnv,table:string,method:"POST"|"PATCH",body:unknown,params:Record<string,string>={},prefer="return=representation"){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v)
  const response=await fetch(url.toString(),{
    method,headers:headers(env,{"content-type":"application/json",prefer}),body:JSON.stringify(body),signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("write_failed")
  if(prefer.includes("return=minimal")) return []
  const rows=await response.json()
  return Array.isArray(rows)?rows as Row[]:[]
}
async function rpc(env:PassageEnv,name:string,body:Record<string,unknown>){
  const response=await fetch(base(env)+"/rest/v1/rpc/"+name,{
    method:"POST",
    headers:headers(env,{"content-type":"application/json"}),
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("rpc_failed")
  const result=await response.json()
  return result as Row
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("environment_claim_required")
  return resolveEnvironmentSession(raw,env)
}
function threadKey(envKey:string){return "connections:"+envKey}
async function ensureThread(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>){
  const key=threadKey(session.envKey)
  const rows=await read(env,"c1_environment_connection_thread",{
    select:"thread_key,env_key,envpac_key,owner_relationship_key,title,standing,visibility,metadata,created_at,updated_at",
    thread_key:"eq."+key,owner_relationship_key:"eq."+session.subjectKey,limit:"1"
  })
  if(rows.length) return rows[0]
  const created=await write(env,"c1_environment_connection_thread","POST",{
    thread_key:key,env_key:session.envKey,envpac_key:session.envpacKey,owner_relationship_key:session.subjectKey,
    title:"Connections",standing:"active",visibility:"owner_private",
    metadata:{source:"my_environment",thread_is_authority:false,thread_is_relationship_registry:false}
  })
  return created[0]
}
async function nativeConnections(env:PassageEnv,subjectKey:string){
  const rows=await read(env,"c3_env_native_connection",{
    select:"connection_key,source_relationship_key,source_env_key,source_envpac_key,target_relationship_key,target_env_key,target_envpac_key,standing,formed_at,metadata",
    standing:"eq.active",
    revoked_at:"is.null",
    or:"(source_relationship_key.eq."+subjectKey+",target_relationship_key.eq."+subjectKey+")",
    order:"formed_at.desc"
  })
  return Promise.all(rows.map(async row=>{
    const source=String(row.source_relationship_key||"")
    const target=String(row.target_relationship_key||"")
    const otherKey=source===subjectKey?target:source
    const [owners,messageResolution]=await Promise.all([
      read(env,"crs_relationship",{select:"relationship_key,display_name",relationship_key:"eq."+otherKey,is_active:"eq.true",limit:"1"}),
      rpc(env,"resolve_c1me_connection_messages_internal",{
        p_connection_key:String(row.connection_key),
        p_requester_relationship_key:subjectKey
      })
    ])
    const messages=Array.isArray(messageResolution.messages)?messageResolution.messages:[]
    return {
      ...row,
      other:{relationship_key:otherKey,display_name:typeof owners[0]?.display_name==="string"?owners[0].display_name:null},
      messages
    }
  }))
}
async function publicationNotifications(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>){\n  return read(env,"c3_env_publication_notification",{\n    select:"notification_key,publication_event_key,initiative_key,source_envpac_key,source_component_binding,title,summary,target_context_key,standing,published_at,read_at,metadata",\n    recipient_env_key:"eq."+session.envKey,recipient_envpac_key:"eq."+session.envpacKey,\n    standing:"in.(unread,read)",order:"published_at.desc",limit:"100"\n  })\n}\nasync function initiativeConnections(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>){
  return read(env,"c3_env_initiative_visibility",{
    select:"visibility_key,initiative_key,initiative_envpac_key,target_environment_key,visibility_source,source_ref,standing,visible_at,metadata",
    relationship_key:"eq."+session.subjectKey,
    env_key:"eq."+session.envKey,
    envpac_key:"eq."+session.envpacKey,
    standing:"eq.active",
    revoked_at:"is.null",
    order:"visible_at.desc"
  })
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const thread=await ensureThread(env,session)
    const [entries,connections,initiativeConnectionsRows,publicationNotificationRows]=await Promise.all([
      read(env,"c1_environment_connection_thread_entry",{
        select:"entry_key,entry_type,title,body,related_type,related_key,related_route,standing,metadata,created_at,updated_at",
        thread_key:"eq."+String(thread.thread_key),owner_relationship_key:"eq."+session.subjectKey,
        order:"created_at.desc",limit:"200"
      }),
      nativeConnections(env,session.subjectKey),
      initiativeConnections(env,session)
    ])
    return json({
      authenticated:true,
      standing:"connections_ready",
      thread,
      entries,
      native_connections:connections,
      initiative_connections:initiativeConnectionsRows
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"connections_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:503
    return json({authenticated:false,standing:"connections_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const origin=request.headers.get("origin")
    if(origin&&origin!==new URL(request.url).origin) return json({ok:false,standing:"connection_origin_held"},403)
    const session=await sessionFor(request,env)
    const body=await request.json() as Record<string,unknown>

    if(body.action==="mark_publication_notification_read"){
      const notificationKey=typeof body.notification_key==="string"?body.notification_key.trim():""
      if(!notificationKey)return json({ok:false,standing:"notification_key_required"},400)
      const rows=await write(env,"c3_env_publication_notification","PATCH",{
        standing:"read",read_at:new Date().toISOString(),updated_at:new Date().toISOString()
      },{
        notification_key:"eq."+notificationKey,
        recipient_env_key:"eq."+session.envKey,
        recipient_envpac_key:"eq."+session.envpacKey,
        standing:"eq.unread"
      })
      if(!rows.length)return json({ok:false,standing:"notification_not_found_or_already_read"},404)
      return json({ok:true,standing:"publication_notification_read",notification:rows[0]})
    }

    if(body.action==="register_e2ee_device"){
      const deviceKey=typeof body.device_key==="string"?body.device_key.trim():""
      const encryptionPublicKey=typeof body.encryption_public_key==="string"?body.encryption_public_key.trim():""
      const signingPublicKey=typeof body.signing_public_key==="string"?body.signing_public_key.trim():""
      if(!deviceKey||!encryptionPublicKey||!signingPublicKey)
        return json({ok:false,standing:"device_registration_invalid"},400)
      const result=await rpc(env,"register_cancom_device_key_internal",{
        p_device_key:deviceKey,
        p_relationship_key:session.subjectKey,
        p_env_key:session.envKey,
        p_envpac_key:session.envpacKey,
        p_encryption_public_key:encryptionPublicKey,
        p_signing_public_key:signingPublicKey
      })
      const standing=typeof result.standing==="string"?result.standing:"HLD"
      if(standing!=="device_ready")
        return json({ok:false,standing,reason:typeof result.reason==="string"?result.reason:null},409)
      return json({ok:true,...result})
    }

    if(body.action==="resolve_e2ee_devices"){
      const connectionKey=typeof body.connection_key==="string"?body.connection_key.trim():""
      if(!connectionKey)return json({ok:false,standing:"connection_key_required"},400)
      const result=await rpc(env,"resolve_cancom_connection_devices_internal",{
        p_connection_key:connectionKey,
        p_requester_relationship_key:session.subjectKey
      })
      const standing=typeof result.standing==="string"?result.standing:"HLD"
      if(standing!=="resolved"){
        const status=standing==="connection_message_not_authorized"?403:409
        return json({ok:false,standing,reason:typeof result.reason==="string"?result.reason:null,devices:[]},status)
      }
      return json({ok:true,standing,devices:Array.isArray(result.devices)?result.devices:[]})
    }

    if(body.action==="send_e2ee_message"){
      const connectionKey=typeof body.connection_key==="string"?body.connection_key.trim():""
      const messageType=typeof body.message_type==="string"?body.message_type:"note"
      const messageKey=typeof body.message_key==="string"?body.message_key.trim():""
      const senderDeviceKey=typeof body.sender_device_key==="string"?body.sender_device_key.trim():""
      const ciphertext=typeof body.ciphertext==="string"?body.ciphertext.trim():""
      const contentIv=typeof body.content_iv==="string"?body.content_iv.trim():""
      const signature=typeof body.signature==="string"?body.signature.trim():""
      const additionalData=typeof body.additional_data==="string"?body.additional_data:""
      const ciphertextSha256=typeof body.ciphertext_sha256==="string"?body.ciphertext_sha256.trim():""
      const keyWraps=Array.isArray(body.key_wraps)?body.key_wraps:[]
      if(
        !connectionKey||!messageKey||!senderDeviceKey||!ciphertext||!contentIv||!signature||!additionalData||
        !/^[0-9a-f]{64}$/.test(ciphertextSha256)||
        !["note","introduction","opportunity","follow_up"].includes(messageType)||
        keyWraps.length<2
      )return json({ok:false,standing:"encrypted_payload_invalid"},400)

      const result=await rpc(env,"record_c1me_connection_ciphertext_internal",{
        p_message_key:messageKey,
        p_connection_key:connectionKey,
        p_sender_relationship_key:session.subjectKey,
        p_sender_device_key:senderDeviceKey,
        p_message_type:messageType,
        p_ciphertext:ciphertext,
        p_content_iv:contentIv,
        p_key_wraps:keyWraps,
        p_signature:signature,
        p_additional_data:additionalData,
        p_ciphertext_sha256:ciphertextSha256
      })
      const standing=typeof result.standing==="string"?result.standing:"HLD"
      if(standing!=="connection_message_recorded_e2ee"){
        const reason=typeof result.reason==="string"?result.reason:null
        const status=reason==="connection_message_not_authorized"?403:
          reason==="recipient_secure_device_unavailable"||reason==="encrypted_key_wrap_incomplete"||reason==="sender_device_unresolved"?409:400
        return json({ok:false,standing,reason},status)
      }
      return json({ok:true,standing,message:result.message||null})
    }

    if(body.action==="send_message"){
      return json({
        ok:false,
        standing:"HLD",
        reason:"cancom_e2ee_ciphertext_required"
      },409)
    }

    const thread=await ensureThread(env,session)
    const entryType=String(body.entry_type||"note")
    const allowed=new Set(["note","introduction","opportunity","follow_up"])
    if(!allowed.has(entryType)) return json({ok:false,standing:"ledger_entry_type_not_supported"},400)
    const text=String(body.body||"").trim()
    if(!text) return json({ok:false,standing:"ledger_entry_body_required"},400)
    const rows=await write(env,"c1_environment_connection_thread_entry","POST",{
      thread_key:thread.thread_key,owner_relationship_key:session.subjectKey,entry_type:entryType,
      title:typeof body.title==="string"?body.title.slice(0,240):null,body:text.slice(0,5000),
      related_type:typeof body.related_type==="string"?body.related_type.slice(0,120):null,
      related_key:typeof body.related_key==="string"?body.related_key.slice(0,300):null,
      related_route:typeof body.related_route==="string"?body.related_route.slice(0,500):null,
      standing:"active",metadata:{source:"owner_ledger_entry",creates_relationship:false,creates_authority:false}
    })
    return json({ok:true,standing:"ledger_entry_recorded",entry:rows[0]})
  }catch(error){
    const reason=error instanceof Error?error.message:"connections_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:503
    return json({ok:false,standing:"connections_held",reason},status)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
