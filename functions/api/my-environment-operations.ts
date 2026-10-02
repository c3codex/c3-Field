import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"
import {readResolvedOarOptics,OAR_OPTICS_INTERFACE} from "../_lib/c3ops-oar-optics"

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
function headers(env:PassageEnv){
  return {apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!}
}
async function read(env:PassageEnv,table:string,params:Record<string,string>){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [k,v] of Object.entries(params))url.searchParams.set(k,v)
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok)throw new Error("read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows))throw new Error("read_shape")
  return rows as Row[]
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new Error("environment_claim_required")
  return resolveEnvironmentSession(raw,env)
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const primitives=await read(env,"c3_envpac_runtime_primitive",{
      select:"primitive_key,standing,config",
      envpac_key:"eq."+session.envpacKey,
      primitive_key:"eq.operations",
      standing:"eq.active",
      limit:"1"
    })
    const primitive=primitives[0]
    if(!primitive)return json({ok:false,standing:"HLD",reason:"operations_surface_not_bound"},403)
    const config=(primitive.config&&typeof primitive.config==="object"?primitive.config:{}) as Record<string,unknown>
    if(config.operator_bound!==true||config.operator_key!=="op044"||config.universal!==false)
      return json({ok:false,standing:"HLD",reason:"operations_surface_not_operator_bound"},403)

    const operations=await readResolvedOarOptics((table,select,filters={})=>
      read(env,table,{select,...filters,limit:"50"}))
    return json({
      ok:true,standing:"resolved",optics_only:true,authority_created:false,
      payload_content_exposed:false,interface:OAR_OPTICS_INTERFACE,operations,
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"operations_resolution_failed"
    return json({ok:false,standing:"HLD",reason},reason==="environment_claim_required"?401:500)
  }
}
