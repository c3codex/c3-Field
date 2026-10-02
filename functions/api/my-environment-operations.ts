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

    const rows=await read(env,"system_oar_queue",{
      select:"queue_key,oar_key,oar_type,queue_status,scope_key,requested_action,preflight_status,operator_confirmed_at,execution_started_at,execution_completed_at,execution_summary,automation_permissions,created_at,updated_at",
      operator_key:"eq.op044",
      order:"created_at.desc",
      limit:"50"
    })
    const keys=rows.map(row=>String(row.scope_key||"")).filter(key=>/^[A-Za-z0-9_]+$/.test(key))
    const queueKeys=rows.map(row=>String(row.queue_key||"")).filter(key=>/^[A-Za-z0-9_]+$/.test(key))
    const returns=keys.length?await read(env,"c3ops_oar_custody_resolution_event",{
      select:"related_execution_instance,standing,object_identifier",
      related_execution_instance:"in.("+keys.join(",")+")",
      intended_function:"eq.cancom_oar_return"
    }):[]
    const evidence=queueKeys.length?await read(env,"system_oar_execution_evidence",{
      select:"queue_key,validation_result",
      queue_key:"in.("+queueKeys.join(",")+")",
      evidence_type:"eq.runtime_validation"
    }):[]
    const returnByInstance=new Map(returns.map(row=>[String(row.related_execution_instance),row]))
    const modelByQueue=new Map(evidence.filter(row=>{
      const result=row.validation_result as Record<string,unknown>|null
      return result&&typeof result==="object"&&result.model_resolution_evidence
    }).map(row=>[String(row.queue_key),row]))

    return json({
      ok:true,
      standing:"resolved",
      optics_only:true,
      authority_created:false,
      payload_content_exposed:false,
      operations:rows.map(row=>({
        oar_key:row.oar_key,
        oar_type:row.oar_type,
        queue_status:row.queue_status,
        scope_key:row.scope_key,
        requested_action:row.requested_action,
        preflight_status:row.preflight_status,
        operator_confirmed_at:row.operator_confirmed_at,
        execution_started_at:row.execution_started_at,
        execution_completed_at:row.execution_completed_at,
        return_standing:returnByInstance.get(String(row.scope_key))?.standing||null,
        execution_summary:row.execution_summary,
        executor_ref:(row.automation_permissions as Record<string,unknown>|undefined)?.executor_ref||null,
        model_resolution_standing:modelByQueue.has(String(row.queue_key))?"returned":
          (row.automation_permissions as Record<string,unknown>|undefined)?.model_resolution_evidence_required===true?"required":"not_required",
        created_at:row.created_at,
        updated_at:row.updated_at
      }))
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"operations_resolution_failed"
    return json({ok:false,standing:"HLD",reason},reason==="environment_claim_required"?401:500)
  }
}
