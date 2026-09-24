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
    const [owners,messages]=await Promise.all([
      read(env,"crs_relationship",{select:"relationship_key,display_name",relationship_key:"eq."+otherKey,is_active:"eq.true",limit:"1"}),
      read(env,"c3_env_connection_message",{
        select:"message_key,connection_key,sender_relationship_key,message_type,body,standing,created_at",
        connection_key:"eq."+String(row.connection_key),standing:"eq.active",order:"created_at.asc",limit:"100"
      })
    ])
    return {
      ...row,
      other:{relationship_key:otherKey,display_name:typeof owners[0]?.display_name==="string"?owners[0].display_name:null},
      messages
    }
  }))
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const thread=await ensureThread(env,session)
    const [entries,connections]=await Promise.all([
      read(env,"c1_environment_connection_thread_entry",{
        select:"entry_key,entry_type,title,body,related_type,related_key,related_route,standing,metadata,created_at,updated_at",
        thread_key:"eq."+String(thread.thread_key),owner_relationship_key:"eq."+session.subjectKey,
        order:"created_at.desc",limit:"200"
      }),
      nativeConnections(env,session.subjectKey)
    ])
    return json({authenticated:true,standing:"connections_ready",thread,entries,native_connections:connections})
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

    if(body.action==="send_message"){
      const connectionKey=typeof body.connection_key==="string"?body.connection_key.trim():""
      const messageType=typeof body.message_type==="string"?body.message_type:"note"
      const messageBody=typeof body.body==="string"?body.body.trim():""
      if(!connectionKey||messageBody.length<1||messageBody.length>5000||!["note","introduction","opportunity","follow_up"].includes(messageType))
        return json({ok:false,standing:"connection_message_invalid"},400)
      const rows=await read(env,"c3_env_native_connection",{
        select:"connection_key,source_relationship_key,target_relationship_key,standing",
        connection_key:"eq."+connectionKey,standing:"eq.active",revoked_at:"is.null",limit:"1"
      })
      const connection=rows[0]
      if(!connection||(connection.source_relationship_key!==session.subjectKey&&connection.target_relationship_key!==session.subjectKey))
        return json({ok:false,standing:"connection_message_not_authorized"},403)
      const messages=await write(env,"c3_env_connection_message","POST",{
        connection_key:connectionKey,sender_relationship_key:session.subjectKey,message_type:messageType,
        body:messageBody,standing:"active",
        metadata:{source:"my_environment_relational_ledger",registry_standing_created:false,authority_created:false}
      })
      await write(env,"c3_env_native_connection_event","POST",{
        connection_key:connectionKey,event_type:"message_sent",actor_relationship_key:session.subjectKey,
        share_reference:null,event_data:{message_key:messages[0]?.message_key||null,message_type:messageType}
      },{},"return=minimal")
      return json({ok:true,standing:"connection_message_recorded",message:messages[0]})
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
