import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name){
      try{return decodeURIComponent(rest.join("="))}catch{return null}
    }
  }
  return null
}
function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}
async function rpc(env:PassageEnv,name:string,body:Record<string,unknown>){
  const response=await fetch(base(env)+"/rest/v1/rpc/"+name,{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,"content-type":"application/json"},
    body:JSON.stringify(body)
  })
  if(!response.ok) throw new Error(name+"_failed")
  return response.json() as Promise<Record<string,unknown>>
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("environment_claim_required")
  const session=await resolveEnvironmentSession(raw,env)
  if(session.subjectType!=="individual") throw new Error("profile_subject_not_supported")
  return session
}
function fieldsFromBody(body:Record<string,unknown>){
  if(body.fields&&typeof body.fields==="object"&&!Array.isArray(body.fields)) return body.fields as Record<string,unknown>
  return {display_label:body.display_label,visibility_scope:body.visibility_scope}
}
function validFields(fields:Record<string,unknown>){
  const allowed=new Set(["display_label","visibility_scope","about","interests","open_to","location_region"])
  if(Object.keys(fields).some(key=>!allowed.has(key))) return false
  if(typeof fields.display_label!=="string"||typeof fields.visibility_scope!=="string") return false
  const display=fields.display_label.trim()
  if(display.length<1||display.length>160) return false
  if(!["private","environment","relational","public"].includes(fields.visibility_scope)) return false
  for(const [key,max] of [["about",600],["interests",400],["location_region",120]] as const){
    const value=fields[key]
    if(value!==undefined&&value!==null&&(typeof value!=="string"||value.trim().length>max)) return false
  }
  if(fields.open_to!==undefined){
    if(!Array.isArray(fields.open_to)||fields.open_to.some(value=>typeof value!=="string"||!["connect","collaborate","contribute","create","support","learn"].includes(value))) return false
  }
  return true
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const contract=await rpc(env,"c3_pac_intake_contract",{p_pac_type:"ProfilePAC"})
    const intake=contract&&typeof contract.intake_schema==="object"&&contract.intake_schema
      ? contract.intake_schema as Record<string,unknown>:{}
    return json({
      authenticated:true,standing:"profile_pac_intake_ready",
      contract:{
        pac_type:"ProfilePAC",
        contract_version:typeof contract.contract_version==="string"?contract.contract_version:"v1",
        questions:Array.isArray(intake.fields)?intake.fields:[],
        authority_effect:"none"
      },
      resolved_profile_class:session.subjectType==="individual"?"individual":null
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"profile_pac_intake_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:503
    return json({authenticated:false,standing:"profile_pac_intake_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const origin=request.headers.get("origin")
    if(origin&&origin!==new URL(request.url).origin) return json({ok:false,standing:"profile_pac_origin_held"},403)
    const session=await sessionFor(request,env)
    const body=await request.json().catch(()=>null) as Record<string,unknown>|null
    if(!body) return json({ok:false,standing:"profile_pac_intake_invalid"},400)
    const fields=fieldsFromBody(body)
    if(!validFields(fields)) return json({ok:false,standing:"profile_pac_intake_invalid"},400)

    const displayLabel=(fields.display_label as string).trim()
    const visibility=fields.visibility_scope as string
    const formed=await rpc(env,"form_profile_pac_v1_internal",{
      p_envpac_key:session.envpacKey,p_subject_type:session.subjectType,p_subject_key:session.subjectKey,
      p_profile_class:"individual",p_display_label:displayLabel,p_visibility_scope:visibility
    })
    const created=formed.created===true
    const result=await rpc(env,"update_profile_pac_personalization_internal",{
      p_envpac_key:session.envpacKey,p_subject_type:session.subjectType,p_subject_key:session.subjectKey,
      p_fields:{
        display_label:displayLabel,
        visibility_scope:visibility,
        about:typeof fields.about==="string"?fields.about.trim():"",
        interests:typeof fields.interests==="string"?fields.interests.trim():"",
        open_to:Array.isArray(fields.open_to)?fields.open_to:[],
        location_region:typeof fields.location_region==="string"?fields.location_region.trim():""
      }
    })
    return json({
      ok:true,standing:created?"profile_pac_formed":"profile_pac_updated",created,
      updated:result.updated===true,next_read:"/api/my-environment",authority_effect:"none"
    },created?201:200)
  }catch(error){
    const reason=error instanceof Error?error.message:"profile_pac_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:409
    return json({ok:false,standing:"profile_pac_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
