import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type Row=Record<string,unknown>
class ConnectionsHold extends Error{
  constructor(message:string,public status=409){super(message)}
}
const record=(value:unknown):Row=>value&&typeof value==="object"&&!Array.isArray(value)?value as Row:{}

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
  if(!Array.isArray(rows))throw new Error("write_shape")
  return rows as Row[]
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
type Session=Awaited<ReturnType<typeof sessionFor>>
async function ownerAuthority(env:PassageEnv,session:Session){
  if(session.subjectType!=="individual")throw new ConnectionsHold("personal_owner_required",403)
  const [current,envpacs]=await Promise.all([
    rpc(env,"resolve_c1me_current_internal",{p_relationship_key:session.subjectKey}),
    read(env,"c3_envpac",{select:"envpac_key,env_key",owner_subject_type:"eq.individual",owner_subject_key:"eq."+session.subjectKey,standing:"eq.effective",is_effective:"eq.true"})
  ])
  if(current.resolution!=="existing_c1"||current.relationship_ref!==session.subjectKey||current.env_key!==session.envKey||current.envpac_ref!==session.envpacKey||typeof current.current_ref!=="string"||!current.current_ref)
    throw new ConnectionsHold("connections_owner_current_held")
  if(envpacs.length!==1||envpacs[0].env_key!==session.envKey||envpacs[0].envpac_key!==session.envpacKey)
    throw new ConnectionsHold("connections_owner_envpac_held")
  return current
}
async function entranceAuthority(env:PassageEnv,session:Session){
  // Existing target-bound MGS/consent rails only. This reader never forms
  // an evaluation, binding, identity, grant or CURRENT.
  const [evaluations,environments,consents,processes,capabilities]=await Promise.all([
    read(env,"measures_persistence_state",{select:"persistence_key,governed_state,evidence",process_key:"eq.minimum_governed_standard_v1",environment_key:"eq."+session.envKey,object_type:"eq.minimum_governed_standard_evaluation",standing:"eq.minimum_governed_standard_satisfied"}),
    read(env,"c3_environment",{select:"environment_class,standing",env_key:"eq."+session.envKey,is_active:"eq.true"}),
    read(env,"crs_consent",{select:"consent_scope",relationship_key:"eq."+session.subjectKey,consent_scope:"eq.c1_connect_relationship",consent_state:"eq.granted",withdrawn_at:"is.null"}),
    read(env,"system_process_registry",{select:"process_key",process_key:"eq.minimum_governed_standard_v1",process_status:"eq.active",authority_level:"eq.registered"}),
    read(env,"c3_envpac_capability_grant",{select:"capability_key",envpac_key:"eq."+session.envpacKey,standing:"eq.active"})
  ])
  if(evaluations.length!==1||environments.length!==1||!consents.length||processes.length!==1)throw new ConnectionsHold("connections_entrance_evidence_held")
  const evaluation=record(evaluations[0].governed_state),evidence=record(evaluations[0].evidence)
  if(!Number.isInteger(evaluation.active_capability_count)||evaluation.active_capability_count!==capabilities.length)throw new ConnectionsHold("connections_mgs_capability_drift")
  if(evaluation.result!=="minimum_governed_standard_satisfied"||evaluation.target_env_key!==session.envKey||evaluation.target_envpac_key!==session.envpacKey||evaluation.subject_key!==session.subjectKey||evaluation.applicable_role!=="owner"||evaluation.mgs_target_class!=="c1ME.env"||evaluation.target_registry_environment_class!==environments[0].environment_class||evaluation.environment_standing!==environments[0].standing||evaluation.owner_grant_resolved!==true||evaluation.consent_resolved!==true||evaluation.formal_mgs_satisfaction_created!==true||typeof evidence.current_binding!=="string"||typeof evaluation.mgs_key!=="string"||typeof evaluation.mgs_version!=="string")
    throw new ConnectionsHold("connections_entrance_scope_held")
  const [bindings,standards]=await Promise.all([
    read(env,"measures_persistence_state",{select:"governed_state",persistence_key:"eq."+evidence.current_binding,process_key:"eq.minimum_governed_standard_v1",object_type:"eq.minimum_governed_standard_binding",standing:"eq.current",environment_key:"eq."+session.envKey}),
    read(env,"measures_registry",{select:"metadata",registry_key:"eq."+evaluation.mgs_key,is_active:"eq.true",release_state:"eq.released",access_state:"eq.callable"})
  ])
  const binding=record(bindings[0]?.governed_state),standard=record(standards[0]?.metadata)
  if(bindings.length!==1||standards.length!==1||binding.mgs_key!==evaluation.mgs_key||binding.mgs_version!==evaluation.mgs_version||binding.target_env_key!==session.envKey||binding.target_envpac_key!==session.envpacKey||binding.scope_match!==true||!Array.isArray(binding.unresolved_holds)||binding.unresolved_holds.length!==0||standard.record_class!=="target_bound_mgs"||standard.target_class!=="c1ME.env"||standard.standing!=="operative"||standard.registration_standing!=="registered"||standard.version!==evaluation.mgs_version)
    throw new ConnectionsHold("connections_mgs_binding_held")
  return String(evaluations[0].persistence_key)
}
async function ownedThread(env:PassageEnv,session:Session){
  const key=threadKey(session.envKey)
  const select="thread_key,env_key,envpac_key,owner_relationship_key,title,standing,visibility,metadata,created_at,updated_at"
  const [keys,owners]=await Promise.all([
    read(env,"c1_environment_connection_thread",{select,thread_key:"eq."+key}),
    read(env,"c1_environment_connection_thread",{select,env_key:"eq."+session.envKey,owner_relationship_key:"eq."+session.subjectKey})
  ])
  if(keys.length>1||owners.length>1)throw new ConnectionsHold("connections_thread_ambiguous")
  const row=keys[0]||owners[0]
  if(!row)return null
  const metadata=record(row.metadata)
  if((keys.length&&owners.length&&keys[0].thread_key!==owners[0].thread_key)||row.thread_key!==key||row.env_key!==session.envKey||row.envpac_key!==session.envpacKey||row.owner_relationship_key!==session.subjectKey||row.visibility!=="owner_private"||row.standing!=="active"||metadata.thread_is_authority!==false||metadata.thread_is_relationship_registry!==false)
    throw new ConnectionsHold("connections_thread_binding_held")
  return row
}
async function initializeThread(request:Request,env:PassageEnv,session:Session){
  if(request.headers.get("origin")!==new URL(request.url).origin||request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json"||["cross-site","same-site","none"].includes(request.headers.get("sec-fetch-site")||""))
    throw new ConnectionsHold("connections_initialization_origin_held",403)
  const current=await ownerAuthority(env,session),entrance=await entranceAuthority(env,session)
  const existing=await ownedThread(env,session)
  if(existing)return {thread:existing,inserted_row_count:0}
  const fresh=await sessionFor(request,env)
  if(fresh.subjectKey!==session.subjectKey||fresh.envKey!==session.envKey||fresh.envpacKey!==session.envpacKey)throw new ConnectionsHold("connections_session_changed")
  await ownerAuthority(env,fresh);await entranceAuthority(env,fresh)
  let created:Row[]=[]
  try{created=await write(env,"c1_environment_connection_thread","POST",{
    thread_key:threadKey(session.envKey),env_key:session.envKey,envpac_key:session.envpacKey,owner_relationship_key:session.subjectKey,
    title:"Connections",standing:"active",visibility:"owner_private",
    metadata:{source:"explicit_owner_connections_initialization",thread_is_authority:false,thread_is_relationship_registry:false,current_ref:current.current_ref,mgs_evaluation_ref:entrance,initiated_by:session.subjectKey}
  },{on_conflict:"thread_key"},"resolution=ignore-duplicates,return=representation")}catch(error){
    await ownedThread(env,session)
    // A lost response may follow a committed insert. Readback alone cannot
    // attribute a zero-effect retry to this attempt.
    throw new ConnectionsHold("connections_initialization_effect_unverified")
  }
  if(created.length>1)throw new ConnectionsHold("connections_thread_effect_ambiguous")
  const thread=await ownedThread(env,session)
  if(!thread)throw new ConnectionsHold("connections_thread_readback_held")
  return {thread,inserted_row_count:created.length}
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
async function publicationNotifications(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>){
  return read(env,"c3_env_publication_notification",{
    select:"notification_key,publication_event_key,initiative_key,source_envpac_key,source_component_binding,title,summary,target_context_key,standing,published_at,read_at,metadata",
    recipient_env_key:"eq."+session.envKey,recipient_envpac_key:"eq."+session.envpacKey,
    standing:"in.(unread,read)",order:"published_at.desc",limit:"100"
  })
}
async function initiativeConnections(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>){
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
    await ownerAuthority(env,session)
    const thread=await ownedThread(env,session)
    if(!thread)return json({authenticated:true,standing:"thread_not_initialized",thread:null,entries:[],native_connections:[],initiative_connections:[]})
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
    const status=error instanceof ConnectionsHold?error.status:reason==="environment_claim_required"||reason==="session_expired"?401:503
    return json({authenticated:false,standing:"connections_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const origin=request.headers.get("origin")
    if(origin&&origin!==new URL(request.url).origin) return json({ok:false,standing:"connection_origin_held"},403)
    const session=await sessionFor(request,env)
    const body=await request.json() as Record<string,unknown>

    if(body.action==="ensure_owner_private_connections_thread"){
      if(Object.keys(body).some(key=>key!=="action"))throw new ConnectionsHold("connections_initialization_claims_held",400)
      const result=await initializeThread(request,env,session)
      return json({ok:true,standing:"owner_private_connections_thread_ready",...result,authority_created:false,connection_created:false,message_sent:false},result.inserted_row_count?201:200)
    }

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

    await ownerAuthority(env,session)
    const thread=await ownedThread(env,session)
    if(!thread)throw new ConnectionsHold("thread_not_initialized")
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
    const status=error instanceof ConnectionsHold?error.status:reason==="environment_claim_required"||reason==="session_expired"?401:503
    return json({ok:false,standing:"connections_held",reason},status)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
