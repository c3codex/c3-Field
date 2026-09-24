import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name)return decodeURIComponent(rest.join("="))
  }
  return null
}
async function sessionFor(request:Request,env:PassageEnv):Promise<EnvironmentSession>{
  const raw=cookie(request,"c3_env_session")
  if(!raw)throw new Error("environment_claim_required")
  return resolveEnvironmentSession(raw,env)
}
async function rows(env:PassageEnv,table:string,select:string,filters:Record<string,string>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  url.searchParams.set("select",select)
  for(const [key,value] of Object.entries(filters))url.searchParams.set(key,value)
  const response=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY}})
  if(!response.ok)throw new Error("read_failed")
  return await response.json() as Record<string,unknown>[]
}
export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const input=await request.json() as {opening_visual_asset_key?:unknown}
    const asset=typeof input.opening_visual_asset_key==="string"?input.opening_visual_asset_key.trim():""
    if(!asset||asset.length>240)return json({ok:false,standing:"invalid_presentation_asset"},400)
    const current=await rows(env,"c3_envpac_presentation","envpac_key,owner_changeable,selection_standing",{envpac_key:"eq."+session.envpacKey,selection_standing:"eq.active"})
    if(current.length!==1||current[0].envpac_key!==session.envpacKey||current[0].owner_changeable!==true)
      return json({ok:false,standing:"presentation_change_held"},409)
    const media=await rows(env,"c3ops_asset_record","asset_key,runtime_uri,standing",{asset_key:"eq."+asset})
    if(media.length!==1||media[0].asset_key!==asset||media[0].standing!=="active"||typeof media[0].runtime_uri!=="string")
      return json({ok:false,standing:"free_asset_unavailable"},409)
    const response=await fetch(env.SUPABASE_URL!.replace(/\/$/,"")+"/rest/v1/c3_envpac_presentation?envpac_key=eq."+encodeURIComponent(session.envpacKey)+"&selection_standing=eq.active",{
      method:"PATCH",
      headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,"content-type":"application/json",prefer:"return=representation"},
      body:JSON.stringify({opening_visual_asset_key:asset,opening_visual_url:media[0].runtime_uri,selected_by_type:session.subjectType,selected_by_key:session.subjectKey,selected_at:new Date().toISOString(),updated_at:new Date().toISOString()})
    })
    if(!response.ok)throw new Error("presentation_write_failed")
    const changed=await response.json() as Record<string,unknown>[]
    if(changed.length!==1)return json({ok:false,standing:"presentation_write_ambiguous"},409)
    return json({ok:true,standing:"presentation_updated",presentation:changed[0]})
  }catch{return json({ok:false,standing:"environment_session_invalid"},401)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
