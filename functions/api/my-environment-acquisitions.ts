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
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
function headers(env:PassageEnv,extra:Record<string,string>={}){
  return {apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...extra}
}
async function read(env:PassageEnv,table:string,params:Record<string,string>){
  const url=new URL(base(env)+"/rest/v1/"+table)
  Object.entries(params).forEach(([key,value])=>url.searchParams.set(key,value))
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok)throw new Error("acquisition_read_failed")
  const rows=await response.json()
  return Array.isArray(rows)?rows as Row[]:[]
}
async function write(env:PassageEnv,table:string,body:unknown){
  const response=await fetch(base(env)+"/rest/v1/"+table,{
    method:"POST",headers:headers(env,{"content-type":"application/json",prefer:"return=representation"}),
    body:JSON.stringify(body),signal:AbortSignal.timeout(12000)
  })
  if(!response.ok)throw new Error("acquisition_write_failed")
  const rows=await response.json()
  return Array.isArray(rows)?rows as Row[]:[]
}
async function patch(env:PassageEnv,table:string,params:Record<string,string>,body:unknown){
  const url=new URL(base(env)+"/rest/v1/"+table)
  Object.entries(params).forEach(([key,value])=>url.searchParams.set(key,value))
  const response=await fetch(url.toString(),{
    method:"PATCH",headers:headers(env,{"content-type":"application/json",prefer:"return=representation"}),
    body:JSON.stringify(body),signal:AbortSignal.timeout(12000)
  })
  if(!response.ok)throw new Error("acquisition_update_failed")
  const rows=await response.json()
  return Array.isArray(rows)?rows as Row[]:[]
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new Error("environment_claim_required")
  const session=await resolveEnvironmentSession(raw,env)
  if(session.subjectKey!=="crs_93e901234ae044a396654ee80644b005")throw new Error("operator_required")
  return session
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const [properties,contacts,encounters,evidence,resolutions,directory]=await Promise.all([
      read(env,"c3_prop_pac_property",{select:"*",envpac_key:"eq."+session.envpacKey,prop_pac_key:"eq.prop_pac_acquisition_working_v0_1",order:"priority.asc,updated_at.desc"}),
      read(env,"c3_prop_pac_contact",{select:"*",order:"updated_at.desc"}),
      read(env,"c3_prop_pac_encounter",{select:"*",order:"occurred_at.desc",limit:"200"}),
      read(env,"c3_prop_pac_evidence",{select:"*",order:"observed_at.desc",limit:"300"}),
      read(env,"c3_prop_pac_resolution",{select:"*",order:"effective_at.desc",limit:"200"}),
      read(env,"crs_relationship",{select:"relationship_key,primary_email,display_name,organization,relationship_standing,source_encounter,metadata",is_active:"eq.true",order:"display_name.asc"})
    ])
    return json({authenticated:true,standing:"acquisitions_ready",authority:"prop_pac_acquisition_working_v0_1",
      custody_rule:"relations_do_not_transfer_property_or_project_custody",
      properties,contacts,encounters,evidence,resolutions,directory})
  }catch(error){
    const reason=error instanceof Error?error.message:"acquisitions_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:reason==="operator_required"?403:503
    return json({authenticated:false,standing:"acquisitions_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const origin=request.headers.get("origin")
    if(origin&&origin!==new URL(request.url).origin)return json({ok:false,standing:"origin_held"},403)
    await sessionFor(request,env)
    const body=await request.json().catch(()=>null) as Record<string,unknown>|null
    if(!body)return json({ok:false,standing:"invalid_request"},400)
    const action=String(body.action||"")
    const propertyKey=String(body.property_key||"").trim()
    if(!propertyKey)return json({ok:false,standing:"property_required"},400)

    if(action==="record_encounter"){
      const context=Array.isArray(body.context)?body.context.map(String):[]
      const discovery=Array.isArray(body.discovery)?body.discovery.map(String):[]
      const rows=await write(env,"c3_prop_pac_encounter",{
        property_key:propertyKey,
        contact_key:typeof body.contact_key==="string"&&body.contact_key?body.contact_key:null,
        encounter_type:typeof body.encounter_type==="string"?body.encounter_type:"acquisition_322",
        channel:typeof body.channel==="string"?body.channel:"cancom",
        context_1:context[0]||null,context_2:context[1]||null,context_3:context[2]||null,
        discovery_1:discovery[0]||null,discovery_2:discovery[1]||null,
        resolution_property:typeof body.resolution_property==="string"?body.resolution_property:null,
        resolution_next_action:typeof body.resolution_next_action==="string"?body.resolution_next_action:null,
        disposition:typeof body.disposition==="string"?body.disposition:"pending",
        notes:typeof body.notes==="string"?body.notes.slice(0,5000):null,
        metadata:{source_surface:"my_environment/acquisitions",authority_effect:"none"}
      })
      return json({ok:true,standing:"encounter_recorded",encounter:rows[0]||null})
    }

    if(action==="resolve"){
      const resolved=String(body.resolved_standing||"").trim()
      const allowed=new Set(["watch","contact","discovery","diligence","structure","offer","contract","closed","dnr","held"])
      if(!allowed.has(resolved))return json({ok:false,standing:"invalid_resolution"},400)
      const current=await read(env,"c3_prop_pac_property",{select:"property_key,acquisition_standing",property_key:"eq."+propertyKey,limit:"1"})
      if(!current.length)return json({ok:false,standing:"property_not_found"},404)
      const resolutionRows=await write(env,"c3_prop_pac_resolution",{
        property_key:propertyKey,
        encounter_key:typeof body.encounter_key==="string"&&body.encounter_key?body.encounter_key:null,
        prior_standing:String(current[0].acquisition_standing||"watch"),
        resolved_standing:resolved,
        resolution_reason:String(body.resolution_reason||"").slice(0,5000),
        next_action:typeof body.next_action==="string"?body.next_action.slice(0,3000):null,
        next_action_owner:typeof body.next_action_owner==="string"?body.next_action_owner.slice(0,240):"op044",
        evidence_reference:typeof body.evidence_reference==="string"?body.evidence_reference.slice(0,1000):null,
        metadata:{source_surface:"my_environment/acquisitions"}
      })
      const propertyRows=await patch(env,"c3_prop_pac_property",{property_key:"eq."+propertyKey},{acquisition_standing:resolved,updated_at:new Date().toISOString()})
      return json({ok:true,standing:"resolution_recorded",resolution:resolutionRows[0]||null,property:propertyRows[0]||null})
    }

    return json({ok:false,standing:"unsupported_action"},400)
  }catch(error){
    const reason=error instanceof Error?error.message:"acquisitions_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:reason==="operator_required"?403:503
    return json({ok:false,standing:"acquisitions_held",reason},status)
  }
}
export const onRequest:PagesFunction=async()=>json({standing:"DNR",reason:"method_not_allowed"},405)
