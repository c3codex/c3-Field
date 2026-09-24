import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"

type Row=Record<string,any>
class CanopyError extends Error{
  status:number
  standing:string
  constructor(message:string,status=409,standing="canopy_control_held"){super(message);this.status=status;this.standing=standing}
}
function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}
function projectUrl(env:PassageEnv){
  if(!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new CanopyError("Canopy controls are unavailable.",503,"server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rest(env:PassageEnv,path:string,init:RequestInit={}){
  const response=await fetch(projectUrl(env)+"/rest/v1/"+path,{
    ...init,redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...(init.headers||{})}
  })
  if(!response.ok) throw new CanopyError("Canopy controls are temporarily unavailable.",response.status>=500?503:409)
  return response
}
async function readRows(env:PassageEnv,table:string,select:string,filters:Record<string,string>){
  const q=new URLSearchParams({select,...filters})
  const rows=await (await rest(env,table+"?"+q)).json()
  if(!Array.isArray(rows)) throw new CanopyError("Canopy controls are unavailable.",503)
  return rows as Row[]
}
async function activeReferences(env:PassageEnv,session:EnvironmentSession){
  return readRows(env,"c3_envpac_canopy_reference","reference_key,surface_label,display_label,external_url,handle,sort_order,reference_state,created_at,updated_at",{envpac_key:"eq."+session.envpacKey,owner_subject_key:"eq."+session.subjectKey,reference_state:"eq.active",order:"sort_order.asc,created_at.asc"})
}
async function requireCanopyAuthority(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new CanopyError("Open your environment again to continue.",401,"environment_session_required")
  let session:EnvironmentSession
  try{session=await resolveEnvironmentSession(raw,env)}catch{throw new CanopyError("Your environment session is no longer available.",401,"environment_session_invalid")}
  const response=await rest(env,"rpc/resolve_c1me_envpac_primitives_internal",{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({p_relationship_key:session.subjectKey})
  })
  const resolution=await response.json() as Row
  const primitives=Array.isArray(resolution.primitives)?resolution.primitives as Row[]:[]
  const canopy=primitives.find(row=>row.primitive_key==="canopy")
  if(resolution.resolution!=="existing_c1"||
     resolution.relationship_ref!==session.subjectKey||
     resolution.env_key!==session.envKey||
     resolution.envpac_ref!==session.envpacKey||
     resolution.primitive_resolution!=="envpac_resolved"||
     !canopy)
    throw new CanopyError("My Canopy is held because the current EnvPAC does not expose the Canopy primitive.")
  return session
}
function assertKeys(body:Row,allowed:string[]){if(Object.keys(body).some(key=>!allowed.includes(key)))throw new CanopyError("That Canopy request contains unsupported fields.",400,"invalid_canopy_request")}
function boundedText(value:unknown,max:number,required=false){
  if(value===null||value===undefined||value===""){if(required)throw new CanopyError("A required Canopy field is missing.",400,"invalid_canopy_request");return null}
  if(typeof value!=="string")throw new CanopyError("A Canopy field has an invalid value.",400,"invalid_canopy_request")
  const text=value.trim();if((required&&!text)||text.length>max||/[\r\n]/.test(text))throw new CanopyError("A Canopy field is outside the allowed boundary.",400,"invalid_canopy_request");return text||null
}
function boundedUrl(value:unknown){
  const text=boundedText(value,2048,true)!;let url:URL
  try{url=new URL(text)}catch{throw new CanopyError("Use a complete http, https, or mailto destination.",400,"invalid_canopy_url")}
  if(!["https:","http:","mailto:"].includes(url.protocol)||url.username||url.password)throw new CanopyError("Use a complete http, https, or mailto destination.",400,"invalid_canopy_url")
  return url.toString()
}
function referenceKey(value:unknown){if(typeof value!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))throw new CanopyError("That Canopy reference is unavailable.",400,"invalid_canopy_request");return value}
function sortOrder(value:unknown){if(value===undefined||value===null||value==="")return 0;if(typeof value!=="number"||!Number.isInteger(value)||value<0||value>9999)throw new CanopyError("Canopy order must be a whole number from 0 to 9999.",400,"invalid_canopy_request");return value}
async function ownedReference(env:PassageEnv,session:EnvironmentSession,key:string){const rows=await readRows(env,"c3_envpac_canopy_reference","reference_key,surface_label,display_label,external_url,handle,sort_order,reference_state",{reference_key:"eq."+key,envpac_key:"eq."+session.envpacKey,owner_subject_key:"eq."+session.subjectKey,reference_state:"eq.active",limit:"1"});if(!rows[0])throw new CanopyError("That Canopy reference is unavailable.",404,"canopy_reference_unavailable");return rows[0]}
async function event(env:PassageEnv,session:EnvironmentSession,eventType:string,key:string|null,eventData:Row={}){await rest(env,"c3_envpac_canopy_event",{method:"POST",headers:{"content-type":"application/json","prefer":"return=minimal"},body:JSON.stringify({envpac_key:session.envpacKey,reference_key:key,owner_subject_key:session.subjectKey,event_type:eventType,event_data:eventData})})}
async function environmentShareReference(env:PassageEnv,session:EnvironmentSession){
  const response=await rest(env,"c3_env_share_reference",{
    method:"POST",headers:{"content-type":"application/json","prefer":"return=representation"},
    body:JSON.stringify({
      source_env_key:session.envKey,source_envpac_key:session.envpacKey,owner_subject_key:session.subjectKey,
      metadata:{reference_class:"opaque_encounter_provenance",source_process:"c1me_relational_runtime_v1",
        relationship_created:false,standing_created:false,public_profile_created:false,personalized_invite:false}
    })
  })
  const rows=await response.json() as Row[]
  if(!rows[0]?.share_reference)throw new CanopyError("Invite Connection is temporarily unavailable.",503,"invite_connection_unavailable")
  return String(rows[0].share_reference)
}
function errorResponse(error:unknown){if(error instanceof CanopyError)return json({standing:error.standing,message:error.message},error.status);return json({standing:"canopy_control_unavailable",message:"My Canopy is temporarily unavailable."},503)}
export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{try{const session=await requireCanopyAuthority(request,env);return json({standing:"canopy_ready",references:await activeReferences(env,session)})}catch(error){return errorResponse(error)}}
export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await requireCanopyAuthority(request,env)
    const body=await request.json().catch(()=>null) as Row|null
    if(!body||typeof body!=="object"||Array.isArray(body)||typeof body.action!=="string")throw new CanopyError("That Canopy request is invalid.",400,"invalid_canopy_request")
    const now=new Date().toISOString()
    if(body.action==="add"){
      assertKeys(body,["action","surface_label","display_label","external_url","handle","sort_order"])
      const payload={envpac_key:session.envpacKey,owner_subject_key:session.subjectKey,surface_label:boundedText(body.surface_label,80,true),display_label:boundedText(body.display_label,120),external_url:boundedUrl(body.external_url),handle:boundedText(body.handle,160),sort_order:sortOrder(body.sort_order),metadata:{selection_class:"canopy_reference",source_process:"c1me_canopy_reference_controls_v1",registry_standing_created:false,provider_access_created:false}}
      const response=await rest(env,"c3_envpac_canopy_reference",{method:"POST",headers:{"content-type":"application/json","prefer":"return=representation"},body:JSON.stringify(payload)});const rows=await response.json() as Row[];const created=rows[0];if(!created?.reference_key)throw new CanopyError("The Canopy reference could not be created.",503);await event(env,session,"reference_added",String(created.reference_key),{surface_label:payload.surface_label});return json({standing:"canopy_reference_added",reference:created},201)
    }
    if(body.action==="edit"){
      assertKeys(body,["action","reference_key","surface_label","display_label","external_url","handle","sort_order"]);const key=referenceKey(body.reference_key);await ownedReference(env,session,key)
      const patch={surface_label:boundedText(body.surface_label,80,true),display_label:boundedText(body.display_label,120),external_url:boundedUrl(body.external_url),handle:boundedText(body.handle,160),sort_order:sortOrder(body.sort_order),updated_at:now};const q=new URLSearchParams({reference_key:"eq."+key,envpac_key:"eq."+session.envpacKey,owner_subject_key:"eq."+session.subjectKey,reference_state:"eq.active"});const response=await rest(env,"c3_envpac_canopy_reference?"+q,{method:"PATCH",headers:{"content-type":"application/json","prefer":"return=representation"},body:JSON.stringify(patch)});const rows=await response.json() as Row[];await event(env,session,"reference_edited",key,{surface_label:patch.surface_label});return json({standing:"canopy_reference_edited",reference:rows[0]})
    }
    if(body.action==="remove"){
      assertKeys(body,["action","reference_key"]);const key=referenceKey(body.reference_key);await ownedReference(env,session,key);const q=new URLSearchParams({reference_key:"eq."+key,envpac_key:"eq."+session.envpacKey,owner_subject_key:"eq."+session.subjectKey,reference_state:"eq.active"});await rest(env,"c3_envpac_canopy_reference?"+q,{method:"PATCH",headers:{"content-type":"application/json","prefer":"return=minimal"},body:JSON.stringify({reference_state:"removed",removed_at:now,updated_at:now})});await event(env,session,"reference_removed",key);return json({standing:"canopy_reference_removed"})
    }
    if(body.action==="open"){
      assertKeys(body,["action","reference_key"]);const key=referenceKey(body.reference_key);const reference=await ownedReference(env,session,key);await event(env,session,"open_requested",key,{destination_class:"owner_supplied_external_url"});return json({standing:"canopy_open_ready",external_url:reference.external_url})
    }
    if(body.action==="invite_connection"){
      assertKeys(body,["action"])
      const shareReference=await environmentShareReference(env,session)
      const publicUrl=new URL("/",request.url)
      publicUrl.searchParams.set("via",shareReference)
      publicUrl.hash="connect"
      await event(env,session,"connection_invite_prepared",null,{share_reference:shareReference,reference_class:"opaque_encounter_provenance"})
      return json({standing:"connection_invite_ready",public_url:publicUrl.toString()})
    }
    throw new CanopyError("That Canopy action is not authorized.",400,"invalid_canopy_request")
  }catch(error){return errorResponse(error)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
