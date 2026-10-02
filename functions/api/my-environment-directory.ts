import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type Row=Record<string,unknown>
type DirectoryEnv=PassageEnv

class DirectoryError extends Error{
  status:number
  standing:string
  constructor(message:string,status=409,standing="directory_held"){super(message);this.status=status;this.standing=standing}
}
function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name)return decodeURIComponent(rest.join("="))
  }
  return null
}
function base(env:DirectoryEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new DirectoryError("Directory is unavailable.",503,"server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rpc(env:DirectoryEnv,payload:Row){
  const response=await fetch(base(env)+"/rest/v1/rpc/resolve_c3_env_directory_v1",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,
      "content-type":"application/json"
    },
    body:JSON.stringify({p_request:payload})
  })
  const body=await response.json().catch(()=>null) as Row|null
  if(!response.ok||!body)throw new DirectoryError("Directory is temporarily unavailable.",response.status>=500?503:409)
  return body
}
async function session(request:Request,env:DirectoryEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new DirectoryError("Open your environment again to continue.",401,"environment_session_required")
  try{return await resolveEnvironmentSession(raw,env)}
  catch{throw new DirectoryError("Your environment session is no longer available.",401,"environment_session_invalid")}
}
function clean(value:unknown,max:number){
  return typeof value==="string"?value.trim().slice(0,max):""
}
function email(value:unknown){
  const v=clean(value,320).toLowerCase()
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw new DirectoryError("Use a valid email address.",400,"invalid_contact_email")
  return v
}
function failure(error:unknown){
  if(error instanceof DirectoryError)return json({standing:error.standing,message:error.message},error.status)
  return json({standing:"directory_unavailable",message:"Directory is temporarily unavailable."},503)
}
export const onRequestGet:PagesFunction<DirectoryEnv>=async({request,env})=>{
  try{
    const s=await session(request,env)
    const result=await rpc(env,{action:"list",env_key:s.envKey,envpac_key:s.envpacKey})
    if(result.standing!=="resolved")throw new DirectoryError("Directory is held in this environment.",409,String(result.reason||"directory_held"))
    return json({authenticated:true,standing:"resolved",contacts:Array.isArray(result.contacts)?result.contacts:[]})
  }catch(error){return failure(error)}
}
export const onRequestPost:PagesFunction<DirectoryEnv>=async({request,env})=>{
  try{
    const s=await session(request,env)
    const body=await request.json().catch(()=>null) as Row|null
    if(!body||body.action!=="upsert")throw new DirectoryError("That Directory action is not available.",400,"invalid_directory_action")
    const result=await rpc(env,{
      action:"upsert",
      env_key:s.envKey,
      envpac_key:s.envpacKey,
      email:email(body.email),
      display_name:clean(body.display_name,180)||null,
      organization:clean(body.organization,240)||null,
      phone:clean(body.phone,80)||null,
      preferred_channel:"email",
      source_class:"manual",
      metadata:{source:"my_env_directory",authority_created:false,relationship_created:false}
    })
    if(result.standing!=="resolved"||!result.contact)throw new DirectoryError("The contact could not be saved.",409,String(result.reason||"directory_upsert_held"))
    return json({ok:true,standing:"resolved",contact:result.contact})
  }catch(error){return failure(error)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
