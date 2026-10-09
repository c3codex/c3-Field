import {resolveRegisteredInitiativeProjection} from "../../src/c3_field_connect/registeredInitiativeProjection"
import type {InitiativeSurfaceEnv} from "./initiative-surface-host"

export const record=(v:unknown):Record<string,unknown>=>v&&typeof v==="object"&&!Array.isArray(v)?v as Record<string,unknown>:{}
export const text=(v:unknown)=>typeof v==="string"&&v.trim()?v.trim():null
export class PublicSurfaceError extends Error {
  constructor(public status:number,public reasonCode:string){super(reasonCode)}
}
export async function registryRows(env:InitiativeSurfaceEnv,table:string,filters:Record<string,string>,select="*") {
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new PublicSurfaceError(503,"server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  url.searchParams.set("select",select)
  for(const [k,v] of Object.entries(filters))url.searchParams.set(k,v)
  const r=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},redirect:"manual",signal:AbortSignal.timeout(12000)})
  if(!r.ok)throw new PublicSurfaceError(503,"registry_read_failed")
  const rows=await r.json()
  if(!Array.isArray(rows))throw new PublicSurfaceError(503,"registry_read_failed")
  return rows as Record<string,unknown>[]
}
export async function readProjectionPac(env:InitiativeSurfaceEnv,key:string){
  if(!/^[a-z0-9_]+$/.test(key))throw new PublicSurfaceError(409,"projection_pac_key_invalid")
  const rows=await registryRows(env,"c3_pac",{pac_key:"eq."+key},"pac_key,pac_type,is_effective,metadata")
  if(rows.length!==1||rows[0].pac_key!==key||rows[0].pac_type!=="c3WebPac"||rows[0].is_effective!==true)
    throw new PublicSurfaceError(423,"projection_pac_unavailable")
  return rows[0]
}
export async function resolveRegisteredPublicSurface(env:InitiativeSurfaceEnv,hostname:string){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new PublicSurfaceError(503,"server_configuration")
  const host=hostname.toLowerCase().replace(/\.+$/,"")
  const r=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_public_surface_v1",{method:"POST",headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},body:JSON.stringify({p_host:host}),redirect:"manual",signal:AbortSignal.timeout(12000)})
  if(!r.ok)throw new PublicSurfaceError(503,"public_surface_unavailable")
  const body=record(await r.json()),p=record(body.presentation)
  if(body.status!=="available"||p.release_state!=="public"||p.canonical_host!==host||p.canonical_path!=="/"||p.authority_effect!=="none"||p.frontend_invention!==false)
    throw new PublicSurfaceError(423,"registered_public_surface_held")
  return {body,p,initiative:resolveRegisteredInitiativeProjection(body,host)}
}
export async function resolveRegisteredNativeInitiative(env:InitiativeSurfaceEnv,hostname:string){
  const {p,initiative}=await resolveRegisteredPublicSurface(env,hostname)
  if(!initiative)throw new PublicSurfaceError(423,"native_initiative_projection_held")
  const pac=await readProjectionPac(env,initiative.webpacKey),metadata=record(pac.metadata)
  if(metadata.canonical_host!==initiative.host||metadata.initiative_key!==initiative.initiativeKey||metadata.frontend_invention!==false||metadata.creates_standing!==false)
    throw new PublicSurfaceError(409,"native_initiative_projection_mismatch")
  const sourcePacKey=text(metadata.legacy_presentation_source_pac)
  if(!sourcePacKey)throw new PublicSurfaceError(409,"presentation_source_pac_missing")
  const source=await readProjectionPac(env,sourcePacKey),sourceMetadata=record(source.metadata)
  // This source supplies approved presentation/media lineage, never host authority.
  if(sourceMetadata.hardened_projection_pac_key!==initiative.webpacKey)
    throw new PublicSurfaceError(409,"presentation_source_projection_mismatch")
  return {...initiative,presentationSourceKey:text(metadata.presentation_authority)||text(sourceMetadata.presentation_authority),sourcePacKey,openGraphContract:initiative.openGraphContract||record(sourceMetadata.open_graph_contract),projection:p}
}
