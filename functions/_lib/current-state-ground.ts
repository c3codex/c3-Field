import {type PassageEnv} from "./c1-passage"
import {type EnvironmentSession} from "./env-session"
import {GROUND_KEY,GROUND_ASSET,GROUND_MEDIA,GROUND_SHA256,matchesGround,type GroundPresentation} from "../../src/c3_field_connect/current-state-ground"

// Candidate dedicated FREE selector. The call and snapshot must be registered
// through the native passage before either endpoint can return the new Ground.
export const GROUND_FREE_CALL="c3_current_state_ground_presentation_v1"
export const GROUND_SELECTOR="current_state_ground_default"
const GROUND_BYTES=2094840
type Row=Record<string,unknown>
const obj=(x:unknown):Row|null=>x!==null&&typeof x==="object"&&!Array.isArray(x)?x as Row:null

export function isDefaultGroundSelection(rows:readonly Row[]):boolean{
  if(rows.length===0)return true
  if(rows.length!==1)return false
  return rows[0].selection_standing==="active" &&
    rows[0].selected_by_type==="system" &&
    rows[0].opening_visual_asset_key==="c3_field_c1me_live_backdrop_v1"
}
async function registry(env:PassageEnv,path:string,init:RequestInit={}){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw Error("registry_unavailable")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+path,{
    ...init,redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,...init.headers}
  })
  if(!response.ok)throw Error("ground_registry_read")
  return await response.json() as unknown
}
async function rows(env:PassageEnv,table:string,query:Record<string,string>):Promise<Row[]>{
  const result=await registry(env,table+"?"+new URLSearchParams(query))
  if(!Array.isArray(result))throw Error("ground_registry_shape")
  return result as Row[]
}
export function verifiedGroundSnapshot(value:unknown):GroundPresentation|null{
  const result=obj(value), snapshot=obj(result?.snapshot)
  if(!result||!snapshot||result.standing!=="ACT"||result.pac_key!==GROUND_KEY||
    result.schema_key!=="pac_schema_designpac_v1_1"||result.free_call_key!==GROUND_FREE_CALL||
    result.encounter_key!==GROUND_SELECTOR||result.surface_type!=="c3_field"||
    !/^[a-f0-9]{64}$/.test(String(result.registration_sha256))||
    !/^[a-f0-9]{64}$/.test(String(result.projection_sha256))||
    !Array.isArray(result.ACT)||result.ACT.length===0||
    snapshot.presentation_scope!=="authenticated_my_env_default"||
    snapshot.authority_effect!=="none"||
    !matchesGround(snapshot as unknown as GroundPresentation))return null
  return {designpac_key:GROUND_KEY,standing:"resolved",asset_key:GROUND_ASSET,
    asset_sha256:GROUND_SHA256,media_url:GROUND_MEDIA,width:1672,height:941}
}
export function groundAssetMatches(a:Row):boolean{
  return a.asset_key===GROUND_ASSET && a.standing==="operator_approved_webpac_reference" &&
    a.owning_system_key==="c3_field" && a.authoritative_custody_provider==="supabase" &&
    a.authoritative_custody_identifier==="c3-field-media" &&
    a.authoritative_custody_location==="current_state_ground_v1.webp" &&
    a.hash_algorithm==="sha256" && a.content_hash===GROUND_SHA256 &&
    a.byte_size===GROUND_BYTES && a.mime_type==="image/webp" &&
    a.current_free_binding===GROUND_MEDIA && a.free_eligibility===true &&
    a.public_retrieval_standing==="held_for_bounded_runtime_binding"
}
export async function resolveGroundPresentation(env:PassageEnv,session:EnvironmentSession):Promise<GroundPresentation|null>{
  try{
    if(session.subjectType!=="individual")return null
    const [ep,environment,selection]=await Promise.all([
      rows(env,"c3_envpac",{select:"envpac_key",envpac_key:"eq."+session.envpacKey,env_key:"eq."+session.envKey,is_effective:"eq.true",owner_subject_type:"eq.individual",owner_subject_key:"eq."+session.subjectKey}),
      rows(env,"c3_environment",{select:"env_key",env_key:"eq."+session.envKey,environment_class:"eq.c3me_individual_environment",is_active:"eq.true"}),
      rows(env,"c3_envpac_presentation",{select:"selection_standing,selected_by_type,opening_visual_asset_key",envpac_key:"eq."+session.envpacKey,selection_standing:"eq.active"})
    ])
    if(ep.length!==1||environment.length!==1||!isDefaultGroundSelection(selection))return null
    const resolved=verifiedGroundSnapshot(await registry(env,"rpc/free_resolve_pac_encounter_v1",{
      method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({p_free_call_key:GROUND_FREE_CALL,p_selector_type:"encounter",p_selector_value:GROUND_SELECTOR})
    }))
    if(!resolved)return null
    const [pac,assets,bindings]=await Promise.all([
      rows(env,"c3_pac",{select:"pac_key",pac_key:"eq."+GROUND_KEY,envpac_key:"eq.c3envpac_c1me_v0_1",pac_type:"eq.DesignPac",registration_protocol:"eq.registrar_v1",is_effective:"eq.true",release_state:"eq.runtime_release_authorized"}),
      rows(env,"c3ops_asset_record",{select:"asset_key,standing,owning_system_key,authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,hash_algorithm,content_hash,byte_size,mime_type,current_free_binding,free_eligibility,public_retrieval_standing",asset_key:"eq."+GROUND_ASSET}),
      rows(env,"c3_pac_runtime_binding",{select:"metadata",pac_key:"eq."+GROUND_KEY,standing:"eq.active",provider:"eq.supabase",bucket_name:"eq.c3-field-media",object_path:"eq.current_state_ground_v1.webp",runtime_uri:"eq."+GROUND_MEDIA})
    ])
    if(pac.length!==1||assets.length!==1||!groundAssetMatches(assets[0])||
      bindings.length!==1||obj(bindings[0].metadata)?.source_asset_key!==GROUND_ASSET)return null
    return resolved
  }catch{return null}
}
export async function groundBytesVerified(bytes:ArrayBuffer):Promise<boolean>{
  if(bytes.byteLength!==GROUND_BYTES)return false
  const digest=await crypto.subtle.digest("SHA-256",bytes)
  const hex=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("")
  return hex===GROUND_SHA256
}
