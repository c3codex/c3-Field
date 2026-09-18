import {json, type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type Row=Record<string,unknown>

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
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
  return await resolveEnvironmentSession(raw,env)
}
function threadKey(envKey:string){return "connections:"+envKey}

async function ensureThread(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>){
  const key=threadKey(session.envKey)
  const rows=await read(env,"c1_environment_connection_thread",{select:"thread_key,env_key,envpac_key,owner_relationship_key,title,standing,visibility,metadata,created_at,updated_at",thread_key:"eq."+key,owner_relationship_key:"eq."+session.subjectKey,limit:"1"})
  if(rows.length) return rows[0]
  const created=await write(env,"c1_environment_connection_thread","POST",{
    thread_key:key,
    env_key:session.envKey,
    envpac_key:session.envpacKey,
    owner_relationship_key:session.subjectKey,
    title:"Connections",
    standing:"active",
    visibility:"owner_private",
    metadata:{source:"my_environment",thread_is_authority:false,thread_is_relationship_registry:false}
  },{},"return=representation")
  return created[0]
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const thread=await ensureThread(env,session)
    const entries=await read(env,"c1_environment_connection_thread_entry",{
      select:"entry_key,entry_type,title,body,related_type,related_key,related_route,standing,metadata,created_at,updated_at",
      thread_key:"eq."+String(thread.thread_key),
      owner_relationship_key:"eq."+session.subjectKey,
      order:"created_at.desc",
      limit:"200"
    })
    return json({authenticated:true,standing:"connections_thread_ready",thread,entries})
  }catch(error){
    const reason=error instanceof Error?error.message:"connections_thread_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:503
    return json({authenticated:false,standing:"connections_thread_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const thread=await ensureThread(env,session)
    const body=await request.json() as Record<string,unknown>
    const entryType=String(body.entry_type||"note")
    const allowed=new Set(["connection","note","introduction","opportunity","follow_up"])
    if(!allowed.has(entryType)) return json({ok:false,standing:"connection_entry_type_not_supported"},400)
    const text=String(body.body||"").trim()
    if(!text) return json({ok:false,standing:"connection_entry_body_required"},400)
    const rows=await write(env,"c1_environment_connection_thread_entry","POST",{
      thread_key:thread.thread_key,
      owner_relationship_key:session.subjectKey,
      entry_type:entryType,
      title:typeof body.title==="string"?body.title.slice(0,240):null,
      body:text.slice(0,5000),
      related_type:typeof body.related_type==="string"?body.related_type.slice(0,120):null,
      related_key:typeof body.related_key==="string"?body.related_key.slice(0,300):null,
      related_route:typeof body.related_route==="string"?body.related_route.slice(0,500):null,
      standing:"active",
      metadata:{source:"owner_entry",creates_relationship:false,creates_authority:false}
    },{},"return=representation")
    return json({ok:true,standing:"connection_thread_entry_recorded",entry:rows[0]})
  }catch(error){
    const reason=error instanceof Error?error.message:"connections_thread_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:503
    return json({ok:false,standing:"connections_thread_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
