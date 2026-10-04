import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"

type Row=Record<string,any>
type LifecycleEnv=PassageEnv

class LifecycleError extends Error{
  status:number
  standing:string
  constructor(message:string,status=409,standing="owner_lifecycle_held"){super(message);this.status=status;this.standing=standing}
}
function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name)return decodeURIComponent(rest.join("="))
  }
  return null
}
function base(env:LifecycleEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new LifecycleError("Owner lifecycle is unavailable.",503,"server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rpc(env:LifecycleEnv,name:string,payload:Row){
  const response=await fetch(base(env)+"/rest/v1/rpc/"+name,{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(15000),
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,
      "content-type":"application/json"
    },
    body:JSON.stringify({p_request:payload})
  })
  const body=await response.json().catch(()=>null) as Row|null
  if(!response.ok||!body)throw new LifecycleError("Owner lifecycle is temporarily unavailable.",response.status>=500?503:409)
  return body
}
async function session(request:Request,env:LifecycleEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new LifecycleError("Open your environment again to continue.",401,"environment_session_required")
  try{return await resolveEnvironmentSession(raw,env)}
  catch{throw new LifecycleError("Your environment session is no longer available.",401,"environment_session_invalid")}
}
function exactOwnerRequest(s:EnvironmentSession,action:string,extra:Row={}){
  return {
    action,
    relationship_key:s.subjectKey,
    env_key:s.envKey,
    envpac_key:s.envpacKey,
    ...extra
  }
}
function failure(error:unknown){
  if(error instanceof LifecycleError)return json({standing:error.standing,message:error.message},error.status)
  return json({standing:"owner_lifecycle_unavailable",message:"Owner lifecycle is temporarily unavailable."},503)
}
function clearSession(body:Row,status=200){
  return new Response(JSON.stringify(body),{
    status,
    headers:{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store",
      "referrer-policy":"no-referrer",
      "set-cookie":"c3_env_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
    }
  })
}
export const onRequestGet:PagesFunction<LifecycleEnv>=async({request,env})=>{
  try{
    const s=await session(request,env)
    const result=await rpc(env,"resolve_my_env_owner_portability_v1",exactOwnerRequest(s,"preview"))
    if(result.standing!=="resolved")throw new LifecycleError("Your ownership state could not be resolved.",409,String(result.reason||"owner_portability_held"))
    return json({
      authenticated:true,
      standing:"resolved",
      owned_pac_count:Number(result.owned_pac_count||0),
      non_owned_reference_count:Number(result.non_owned_reference_count||0),
      transfer_blockers:Array.isArray(result.transfer_blockers)?result.transfer_blockers:[],
      active_initiative_count:Number(result.active_initiative_count||0),
      active_connection_count:Number(result.active_connection_count||0),
      manifest_sha256:result.manifest_sha256||null,
      disposition_options:Array.isArray(result.disposition_options)?result.disposition_options:[]
    })
  }catch(error){return failure(error)}
}
export const onRequestPost:PagesFunction<LifecycleEnv>=async({request,env})=>{
  try{
    const s=await session(request,env)
    const body=await request.json().catch(()=>null) as Row|null
    if(!body||typeof body.action!=="string")throw new LifecycleError("That owner action is not available.",400,"invalid_owner_action")

    if(body.action==="export"){
      const result=await rpc(env,"resolve_my_env_owner_portability_v1",exactOwnerRequest(s,"export"))
      if(result.standing!=="export_ready")throw new LifecycleError("Your portable PAC package could not be prepared.",409,String(result.reason||"owner_export_held"))
      return json({
        ok:true,
        standing:"export_ready",
        receipt_key:result.receipt_key,
        manifest_sha256:result.manifest_sha256,
        manifest:result.manifest,
        owned_pac_count:Number(result.owned_pac_count||0),
        non_owned_reference_count:Number(result.non_owned_reference_count||0)
      })
    }

    if(body.action==="terminate"){
      if(body.confirmation!=="TERMINATE MY ENVIRONMENT")
        throw new LifecycleError("Type TERMINATE MY ENVIRONMENT exactly to continue.",400,"termination_confirmation_required")
      if(body.understands_history_preserved!==true||body.understands_reentry_required!==true)
        throw new LifecycleError("Confirm the termination effects before continuing.",400,"termination_effect_acknowledgment_required")
      const disposition=String(body.disposition||"")
      if(!["retain_c3_field_custody","portable_export","custody_transferred"].includes(disposition))
        throw new LifecycleError("Choose what happens to your owned PACs before terminating.",400,"pac_disposition_required")

      const result=await rpc(env,"terminate_my_env_owner_v1",exactOwnerRequest(s,"terminate",{
        disposition,
        portability_receipt_key:typeof body.portability_receipt_key==="string"?body.portability_receipt_key:null
      }))
      if(result.standing!=="terminated")
        throw new LifecycleError("My Env termination was held.",409,String(result.reason||"owner_termination_held"))
      return clearSession({
        ok:true,
        standing:"terminated",
        termination_receipt_key:result.termination_receipt_key,
        event_key:result.event_key,
        pac_disposition:result.pac_disposition,
        portable_manifest_sha256:result.portable_manifest_sha256,
        terminal_manifest:result.terminal_manifest,
        ownership_preserved:true,
        lineage_preserved:true,
        explicit_reentry_required:true
      })
    }

    throw new LifecycleError("That owner action is not available.",400,"invalid_owner_action")
  }catch(error){return failure(error)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
