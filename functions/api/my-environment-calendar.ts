import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"

type Row=Record<string,any>
class CalendarError extends Error{
  status:number
  standing:string
  constructor(message:string,status=409,standing="calendar_control_held"){super(message);this.status=status;this.standing=standing}
}
function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}
function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new CalendarError("Calendar is unavailable.",503,"server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rest(env:PassageEnv,path:string,init:RequestInit={}){
  const response=await fetch(base(env)+"/rest/v1/"+path,{
    ...init,redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...(init.headers||{})}
  })
  if(!response.ok)throw new CalendarError("Calendar is temporarily unavailable.",response.status>=500?503:409)
  return response
}
async function requireCalendar(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new CalendarError("Open your environment again to continue.",401,"environment_session_required")
  let session:EnvironmentSession
  try{session=await resolveEnvironmentSession(raw,env)}catch{throw new CalendarError("Your environment session is no longer available.",401,"environment_session_invalid")}
  const response=await rest(env,"rpc/resolve_c1me_envpac_primitives_internal",{
    method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({p_relationship_key:session.subjectKey})
  })
  const resolution=await response.json() as Row
  const primitives=Array.isArray(resolution.primitives)?resolution.primitives as Row[]:[]
  if(resolution.resolution!=="existing_c1"||
     resolution.relationship_ref!==session.subjectKey||
     resolution.env_key!==session.envKey||
     resolution.envpac_ref!==session.envpacKey||
     resolution.primitive_resolution!=="envpac_resolved"||
     !primitives.some(row=>row.primitive_key==="calendar"))
    throw new CalendarError("Calendar is held because this EnvPAC does not expose the Calendar primitive.")
  return session
}
function text(value:unknown,max:number,required=false){
  if(value===null||value===undefined||value===""){if(required)throw new CalendarError("A required calendar field is missing.",400,"invalid_calendar_request");return null}
  if(typeof value!=="string")throw new CalendarError("A calendar field is invalid.",400,"invalid_calendar_request")
  const v=value.trim()
  if((required&&!v)||v.length>max)throw new CalendarError("A calendar field is outside the allowed boundary.",400,"invalid_calendar_request")
  return v||null
}
function instant(value:unknown){
  const v=text(value,80,true)!
  const date=new Date(v)
  if(Number.isNaN(date.getTime()))throw new CalendarError("Use a valid date and time.",400,"invalid_calendar_time")
  return date.toISOString()
}
function eventKey(value:unknown){
  if(typeof value!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
    throw new CalendarError("That calendar event is unavailable.",400,"invalid_calendar_request")
  return value
}
async function eventRows(env:PassageEnv,session:EnvironmentSession){
  const q=new URLSearchParams({
    select:"event_key,title,event_type,start_at,end_at,timezone,event_state,related_relationship_key,related_context_type,related_context_key,location_text,notes,external_projection_state,google_event_url,meet_url,created_at,updated_at",
    envpac_key:"eq."+session.envpacKey,
    owner_subject_key:"eq."+session.subjectKey,
    event_state:"neq.cancelled",
    order:"start_at.asc",
    limit:"200"
  })
  const rows=await (await rest(env,"c3_env_calendar_event?"+q)).json()
  return Array.isArray(rows)?rows:[]
}
async function ownedEvent(env:PassageEnv,session:EnvironmentSession,key:string){
  const q=new URLSearchParams({select:"*",event_key:"eq."+key,envpac_key:"eq."+session.envpacKey,owner_subject_key:"eq."+session.subjectKey,limit:"1"})
  const rows=await (await rest(env,"c3_env_calendar_event?"+q)).json() as Row[]
  if(!rows[0])throw new CalendarError("That calendar event is unavailable.",404,"calendar_event_unavailable")
  return rows[0]
}
async function trace(env:PassageEnv,session:EnvironmentSession,key:string,type:string,data:Row={}){
  await rest(env,"c3_env_calendar_event_trace",{
    method:"POST",headers:{"content-type":"application/json","prefer":"return=minimal"},
    body:JSON.stringify({event_key:key,envpac_key:session.envpacKey,owner_subject_key:session.subjectKey,trace_type:type,trace_data:data})
  })
}
function googleTemplate(row:Row){
  const url=new URL("https://calendar.google.com/calendar/render")
  url.searchParams.set("action","TEMPLATE")
  url.searchParams.set("text",String(row.title||"c3 event"))
  const stamp=(v:string)=>new Date(v).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")
  url.searchParams.set("dates",stamp(row.start_at)+"/"+stamp(row.end_at))
  const detail=[
    row.notes?String(row.notes):"",
    "Projected from c3 My Environment. c3 remains the operational calendar authority."
  ].filter(Boolean).join("\n\n")
  url.searchParams.set("details",detail)
  if(row.location_text)url.searchParams.set("location",String(row.location_text))
  return url.toString()
}
function errorResponse(error:unknown){
  if(error instanceof CalendarError)return json({standing:error.standing,message:error.message},error.status)
  return json({standing:"calendar_control_unavailable",message:"Calendar is temporarily unavailable."},503)
}
export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await requireCalendar(request,env)
    return json({authenticated:true,standing:"calendar_ready",authority:"c3",external_projection:"explicit_event_only",events:await eventRows(env,session)})
  }catch(error){return errorResponse(error)}
}
export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await requireCalendar(request,env)
    const body=await request.json().catch(()=>null) as Row|null
    if(!body||typeof body!=="object"||Array.isArray(body)||typeof body.action!=="string")throw new CalendarError("That calendar request is invalid.",400,"invalid_calendar_request")
    if(body.action==="create"){
      const startAt=instant(body.start_at),endAt=instant(body.end_at)
      if(new Date(endAt)<=new Date(startAt))throw new CalendarError("End time must be after start time.",400,"invalid_calendar_time")
      const eventType=text(body.event_type,40)||"meeting"
      if(!["meeting","encounter","follow_up","deadline","task","other"].includes(eventType))throw new CalendarError("That event type is unavailable.",400,"invalid_calendar_request")
      const payload={
        envpac_key:session.envpacKey,owner_subject_key:session.subjectKey,
        title:text(body.title,240,true),event_type:eventType,start_at:startAt,end_at:endAt,
        timezone:text(body.timezone,80)||"America/Chicago",
        related_relationship_key:text(body.related_relationship_key,160),
        related_context_type:text(body.related_context_type,40),
        related_context_key:text(body.related_context_key,200),
        location_text:text(body.location_text,500),notes:text(body.notes,5000),
        metadata:{source_process:"c1me_native_calendar_v1",calendar_authority:"c3",external_projection:"explicit_event_only"}
      }
      const response=await rest(env,"c3_env_calendar_event",{method:"POST",headers:{"content-type":"application/json","prefer":"return=representation"},body:JSON.stringify(payload)})
      const rows=await response.json() as Row[]
      if(!rows[0]?.event_key)throw new CalendarError("The calendar event could not be created.",503)
      await trace(env,session,String(rows[0].event_key),"event_created",{calendar_authority:"c3"})
      return json({ok:true,standing:"calendar_event_created",event:rows[0]},201)
    }
    const key=eventKey(body.event_key)
    const row=await ownedEvent(env,session,key)
    if(body.action==="complete"||body.action==="cancel"){
      const state=body.action==="complete"?"completed":"cancelled"
      const q=new URLSearchParams({event_key:"eq."+key,envpac_key:"eq."+session.envpacKey,owner_subject_key:"eq."+session.subjectKey})
      await rest(env,"c3_env_calendar_event?"+q,{method:"PATCH",headers:{"content-type":"application/json","prefer":"return=minimal"},body:JSON.stringify({event_state:state,updated_at:new Date().toISOString()})})
      await trace(env,session,key,state==="completed"?"event_completed":"event_cancelled")
      return json({ok:true,standing:"calendar_event_"+state})
    }
    if(body.action==="prepare_google_projection"){
      const url=googleTemplate(row)
      const q=new URLSearchParams({event_key:"eq."+key,envpac_key:"eq."+session.envpacKey,owner_subject_key:"eq."+session.subjectKey})
      await rest(env,"c3_env_calendar_event?"+q,{method:"PATCH",headers:{"content-type":"application/json","prefer":"return=minimal"},body:JSON.stringify({external_projection_state:"prepared",google_event_url:url,updated_at:new Date().toISOString()})})
      await trace(env,session,key,"google_projection_prepared",{projection_class:"explicit_event_only",external_authority_created:false})
      return json({ok:true,standing:"google_projection_prepared",google_url:url,meet_state:"provider_executor_not_wired"})
    }
    throw new CalendarError("That calendar action is not authorized.",400,"invalid_calendar_request")
  }catch(error){return errorResponse(error)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
