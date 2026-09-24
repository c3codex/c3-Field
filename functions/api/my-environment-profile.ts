import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

const PROFILE_HOST="my.c3field.online"
const ALLOWED_VISIBILITY=new Set(["private","environment","relational","public"])

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}
function onProfileHost(request:Request){
  return new URL(request.url).hostname.toLowerCase()===PROFILE_HOST
}
async function rpc(env:PassageEnv,name:string,args:Record<string,unknown>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  if(!["c3_pac_intake_contract","resolve_profile_pac_v1_internal","form_profile_pac_v1_internal"].includes(name))
    throw new Error("unregistered_call")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/"+name,{
    method:"POST",
    redirect:"manual",
    signal:AbortSignal.timeout(12000),
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
      "content-type":"application/json"
    },
    body:JSON.stringify(args)
  })
  if(!response.ok) throw new Error("rpc_failed")
  return response.json() as Promise<Record<string,any>>
}
async function session(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("session_required")
  return resolveEnvironmentSession(raw,env)
}
function boundedQuestions(contract:Record<string,any>){
  const fields=Array.isArray(contract?.intake_schema?.fields)?contract.intake_schema.fields:[]
  return fields.flatMap((field:Record<string,any>)=>{
    if(field?.key==="profile.display_label"&&field?.input==="text"){
      return [{
        key:"profile.display_label",
        label:typeof field.label==="string"?field.label:"Display label",
        input:"text",
        required:field.required===true,
        max_length:Number.isInteger(field.max_length)?field.max_length:160,
        placeholder:typeof field.placeholder==="string"?field.placeholder:""
      }]
    }
    if(field?.key==="profile.visibility_scope"&&field?.input==="select"){
      const options=Array.isArray(field.options)?field.options.flatMap((option:Record<string,any>)=>
        typeof option?.value==="string"&&typeof option?.label==="string"&&ALLOWED_VISIBILITY.has(option.value)
          ? [{value:option.value,label:option.label}]
          : []
      ):[]
      return [{
        key:"profile.visibility_scope",
        label:typeof field.label==="string"?field.label:"Visibility",
        input:"select",
        required:field.required===true,
        default:typeof field.default==="string"&&ALLOWED_VISIBILITY.has(field.default)?field.default:"private",
        options
      }]
    }
    return []
  })
}
function boundedContract(contract:Record<string,any>){
  return {
    pac_type:contract.pac_type,
    contract_version:contract.contract_version,
    questions:boundedQuestions(contract),
    authority_effect:contract.authority_effect||"none"
  }
}

export const onRequestGet:PagesFunction<PassageEnv>=async ({request,env})=>{
  if(!onProfileHost(request)) return json({standing:"not_found"},404)
  try{
    const owner=await session(request,env)
    const [contract,existing]=await Promise.all([
      rpc(env,"c3_pac_intake_contract",{p_pac_type:"ProfilePAC"}),
      rpc(env,"resolve_profile_pac_v1_internal",{
        p_envpac_key:owner.envpacKey,
        p_subject_type:owner.subjectType,
        p_subject_key:owner.subjectKey
      })
    ])
    if(!contract||contract.pac_type!=="ProfilePAC")
      return json({standing:"profile_contract_unavailable"},503)
    return json({
      standing:"profile_intake_ready",
      formed:existing?.standing!=="profile_not_formed",
      contract:boundedContract(contract),
      resolved_profile_class:owner.subjectType==="individual"?"individual":null,
      authority_effect:"none"
    })
  }catch{
    return json({standing:"environment_session_invalid"},401)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async ({request,env})=>{
  if(!onProfileHost(request)) return json({standing:"not_found"},404)
  try{
    const owner=await session(request,env)
    const body=await request.json().catch(()=>null) as Record<string,unknown>|null
    const displayLabel=typeof body?.display_label==="string"?body.display_label.trim():""
    const visibility=typeof body?.visibility_scope==="string"?body.visibility_scope.trim():"private"
    const profileClass=owner.subjectType==="individual"?"individual":null

    if(!profileClass) return json({standing:"profile_class_unresolved"},409)
    if(!displayLabel||displayLabel.length>160||!ALLOWED_VISIBILITY.has(visibility))
      return json({standing:"profile_input_invalid"},400)

    const result=await rpc(env,"form_profile_pac_v1_internal",{
      p_envpac_key:owner.envpacKey,
      p_subject_type:owner.subjectType,
      p_subject_key:owner.subjectKey,
      p_profile_class:profileClass,
      p_display_label:displayLabel,
      p_visibility_scope:visibility
    })
    if(result?.ok!==true) return json({standing:"profile_formation_held"},409)
    return json({
      standing:result.created===false?"profile_pac_existing":"profile_pac_formed",
      created:result.created===true,
      authority_effect:"none",
      next_read:"/api/free-profile-pac"
    },result.created===false?200:201)
  }catch{
    return json({standing:"profile_formation_held"},409)
  }
}

export const onRequest:PagesFunction=async ()=>json({error:"method not allowed"},405)
