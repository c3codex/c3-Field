export type InitiativeSurfaceEnv={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}

type ProcessRow={
  process_key?:unknown
  process_family?:unknown
  status?:unknown
  process_status?:unknown
  authority_state?:unknown
  metadata?:unknown
}

type PacRow={
  pac_key?:unknown
  pac_type?:unknown
  standing?:unknown
  is_effective?:unknown
  release_state?:unknown
  execution_authority_state?:unknown
  formation_state?:unknown
  source_authority?:unknown
  metadata?:unknown
}

type EnvironmentRow={
  env_key?:unknown
  system_key?:unknown
  standing?:unknown
  is_canonical?:unknown
  is_active?:unknown
  metadata?:unknown
}

export type InitiativeSurfaceResolution={
  host:string
  surfaceKey:string
  initiativeKey:string
  initiativeProcessKey:string
  webpacKey:string
  canonicalEnvironment:string
  canonicalUrl:string
  route:string
  connectRoute:string
  accessState:"public"
  bindingState:"active"
  releaseState:"released"
  bindingProcessKey:string
  bindingMetadata:Record<string,unknown>
}

export class InitiativeSurfaceResolutionError extends Error{
  status:number
  reasonCode:string
  constructor(status:number,reasonCode:string){
    super(reasonCode)
    this.name="InitiativeSurfaceResolutionError"
    this.status=status
    this.reasonCode=reasonCode
  }
}

function record(value:unknown):Record<string,unknown>{
  return value && typeof value==="object" && !Array.isArray(value) ? value as Record<string,unknown> : {}
}
function str(value:unknown){return typeof value==="string"&&value.trim()?value.trim():null}

export const C3_FIELD_PERSONAL_ENVIRONMENT_HOST="my.c3field.online"

export function normalizeInitiativeSurfaceHostname(input:string){
  return input.trim().toLowerCase().replace(/\.+$/g,"")
}

export function isPersonalEnvironmentSurfaceHostname(input:string){
  return normalizeInitiativeSurfaceHostname(input)===C3_FIELD_PERSONAL_ENVIRONMENT_HOST
}

export function isInitiativeSurfaceHostname(input:string){
  const host=normalizeInitiativeSurfaceHostname(input)
  return host.endsWith(".c3field.online") && host!=="www.c3field.online" && host!=="c3ops.c3field.online" && !isPersonalEnvironmentSurfaceHostname(host)
}

async function readRows(env:InitiativeSurfaceEnv,table:string,select:string,filters:Record<string,string>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new InitiativeSurfaceResolutionError(503,"server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  url.searchParams.set("select",select)
  for(const [key,value] of Object.entries(filters)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
    redirect:"manual",
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new InitiativeSurfaceResolutionError(503,"registry_read_failed")
  const rows=await response.json() as unknown
  if(!Array.isArray(rows)) throw new InitiativeSurfaceResolutionError(503,"registry_read_failed")
  return rows as Record<string,unknown>[]
}

export function selectInitiativeSurfaceBinding(rows:ProcessRow[]){
  if(rows.length===0) throw new InitiativeSurfaceResolutionError(404,"initiative_surface_unregistered")
  if(rows.length!==1) throw new InitiativeSurfaceResolutionError(409,"initiative_surface_collision")
  const row=rows[0]
  const metadata=record(row.metadata)
  if(row.status!=="active"||row.process_status!=="active"||metadata.active===false||metadata.canonical!==true)
    throw new InitiativeSurfaceResolutionError(423,"initiative_surface_inactive")
  if(metadata.binding_state!=="active") throw new InitiativeSurfaceResolutionError(423,"initiative_surface_binding_held")
  if(metadata.release_state!=="released") throw new InitiativeSurfaceResolutionError(423,"initiative_surface_release_held")
  if(metadata.access_state!=="public") throw new InitiativeSurfaceResolutionError(423,"initiative_surface_not_public")
  if(metadata.system_key!=="c3_field"||metadata.env_key!=="env_c3_community_connect")
    throw new InitiativeSurfaceResolutionError(409,"initiative_surface_environment_mismatch")
  return {row,metadata}
}

function requireOne(rows:Record<string,unknown>[],reason:string,status=409){
  if(rows.length!==1) throw new InitiativeSurfaceResolutionError(status,reason)
  return rows[0]
}

export async function resolveInitiativeSurfaceHost(env:InitiativeSurfaceEnv,hostname:string):Promise<InitiativeSurfaceResolution>{
  const host=normalizeInitiativeSurfaceHostname(hostname)
  if(!isInitiativeSurfaceHostname(host)) throw new InitiativeSurfaceResolutionError(404,"initiative_surface_unregistered")

  const bindingRows=await readRows(env,"system_process_registry","process_key,process_family,status,process_status,authority_state,metadata",{
    process_family:"eq.c3_field",
    metadata:"cs."+JSON.stringify({canonical_host:host,surface_type:"initiative_connect_surface"})
  })
  const {row:binding,metadata}=selectInitiativeSurfaceBinding(bindingRows as ProcessRow[])

  const surfaceKey=str(metadata.surface_key)
  const initiativeKey=str(metadata.initiative_key)
  const initiativeProcessKey=str(metadata.initiative_process_key)
  const webpacKey=str(metadata.webpac_key)
  const webpacProcessKey=str(metadata.webpac_process_key)??webpacKey
  const canonicalUrl=str(metadata.canonical_url)
  const route=str(metadata.route)
  if(!surfaceKey||!initiativeKey||!initiativeProcessKey||!webpacKey||!canonicalUrl||!route)
    throw new InitiativeSurfaceResolutionError(409,"initiative_surface_binding_incomplete")

  let boundUrl:URL
  try{boundUrl=new URL(canonicalUrl)}catch{throw new InitiativeSurfaceResolutionError(409,"initiative_surface_url_invalid")}
  if(boundUrl.protocol!=="https:"||normalizeInitiativeSurfaceHostname(boundUrl.hostname)!==host)
    throw new InitiativeSurfaceResolutionError(409,"initiative_surface_url_mismatch")

  const initiative=requireOne(await readRows(env,"system_process_registry","process_key,status,process_status,metadata",{
    process_key:"eq."+initiativeProcessKey
  }),"initiative_identity_unavailable") as ProcessRow
  const initiativeMetadata=record(initiative.metadata)
  if(initiative.status!=="active"||initiative.process_status!=="active")
    throw new InitiativeSurfaceResolutionError(423,"initiative_identity_inactive")
  const registeredInitiative=str(initiativeMetadata.initiative)??str(initiativeMetadata.initiative_key)
  if(registeredInitiative!==initiativeKey) throw new InitiativeSurfaceResolutionError(409,"initiative_identity_mismatch")

  if(initiativeKey==="47pct"){
    const webpac=requireOne(await readRows(env,"c3_pac","pac_key,pac_type,standing,is_effective,release_state,execution_authority_state,formation_state,source_authority,metadata",{
      pac_key:"eq."+webpacKey,
      pac_type:"eq.c3WebPac"
    }),"webpac_identity_unavailable") as PacRow
    const webpacMetadata=record(webpac.metadata)
    if(webpac.pac_key!==webpacKey||webpac.pac_type!=="c3WebPac")
      throw new InitiativeSurfaceResolutionError(409,"webpac_identity_mismatch")
    if(webpac.is_effective!==true||webpac.formation_state!=="formed")
      throw new InitiativeSurfaceResolutionError(423,"webpac_inactive")
    if(webpac.source_authority!==initiativeProcessKey)
      throw new InitiativeSurfaceResolutionError(409,"webpac_authority_mismatch")
    if(webpacMetadata.parent_envpac!=="c3envpac_c1me_v0_1"||webpacMetadata.parent_environment!=="env_c3_community_connect")
      throw new InitiativeSurfaceResolutionError(409,"webpac_environment_mismatch")
    if(webpac.release_state!=="public"||webpac.execution_authority_state!=="bounded_renderer"||
       webpacMetadata.runtime_release_authorized!==true)
      throw new InitiativeSurfaceResolutionError(423,"webpac_runtime_release_held")
  }else{
    const webpac=requireOne(await readRows(env,"system_process_registry","process_key,status,process_status,metadata",{
      process_key:"eq."+webpacProcessKey
    }),"webpac_identity_unavailable") as ProcessRow
    const webpacMetadata=record(webpac.metadata)
    if(webpac.status!=="active"||webpac.process_status!=="active") throw new InitiativeSurfaceResolutionError(423,"webpac_inactive")
    const registeredWebpac=str(webpacMetadata.pac_key)??str(webpacMetadata.webpac_key)??str(webpac.process_key)
    if(registeredWebpac!==webpacKey) throw new InitiativeSurfaceResolutionError(409,"webpac_identity_mismatch")
    if(webpacMetadata.public_release_authorized!==true||webpacMetadata.runtime_release_authorized!==true)
      throw new InitiativeSurfaceResolutionError(423,"webpac_runtime_release_held")
  }

  const environment=requireOne(await readRows(env,"c3_environment","env_key,system_key,standing,is_canonical,is_active,metadata",{
    env_key:"eq.env_c3_community_connect",
    system_key:"eq.c3_field",
    standing:"eq.governed_environment",
    is_canonical:"eq.true",
    is_active:"eq.true"
  }),"canonical_c1me_unavailable",503) as EnvironmentRow
  const environmentMetadata=record(environment.metadata)
  const connectRoute=str(environmentMetadata.connect_encounter_route)
  if(environment.env_key!=="env_c3_community_connect"||!connectRoute)
    throw new InitiativeSurfaceResolutionError(503,"canonical_c1me_unavailable")

  return {
    host,
    surfaceKey,
    initiativeKey,
    initiativeProcessKey,
    webpacKey,
    canonicalEnvironment:"env_c3_community_connect",
    canonicalUrl,
    route,
    connectRoute,
    accessState:"public",
    bindingState:"active",
    releaseState:"released",
    bindingProcessKey:String(binding.process_key),
    bindingMetadata:metadata
  }
}
