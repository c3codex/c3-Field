export type InitiativeSurfaceRuntime={
  standing:"resolved"
  host:string
  surfaceKey:string
  initiativeKey:string
  webpacKey:string
  canonicalEnvironment:"env_c3_community_connect"
  canonicalUrl:string
  route:string
  connectRoute:string
  publicPresentation?:{
    kicker?:string
    title?:string
    initiative_explanation?:string
    connect_copy?:string
    audience_copy?:string
    primary_cta?:string
    memorial_name?:string
    memorial_text?:string
    watermark_asset_key?:string
    watermark_runtime_url?:string
    watermark_opacity?:number
    public_surface_protected_primitive_labels_allowed?:boolean
  }
  createsStanding:false
}

export function normalizeC3Hostname(hostname:string){
  return hostname.trim().toLowerCase().replace(/\.+$/g,"")
}

export const C3_FIELD_PERSONAL_ENVIRONMENT_HOST="my.c3field.online"

export function isC3FieldParentHost(hostname:string){
  const host=normalizeC3Hostname(hostname)
  return host==="c3field.online"||host==="www.c3field.online"
}

export function isC3FieldPersonalEnvironmentHost(hostname:string){
  return normalizeC3Hostname(hostname)===C3_FIELD_PERSONAL_ENVIRONMENT_HOST
}

export function isC3FieldInitiativeHostCandidate(hostname:string){
  const host=normalizeC3Hostname(hostname)
  return host.endsWith(".c3field.online")&&!isC3FieldParentHost(host)&&host!=="c3ops.c3field.online"&&!isC3FieldPersonalEnvironmentHost(host)
}

export function isInitiativeSurfacePathAllowed(pathname:string){
  const normalized=pathname.length>1?pathname.replace(/\/$/,""):"/"
  return normalized==="/"||normalized==="/connect"
}

export async function loadInitiativeSurfaceHost(){
  const response=await fetch("/api/c3-initiative-surface",{headers:{accept:"application/json"},cache:"no-store"})
  const body=await response.json().catch(()=>null) as InitiativeSurfaceRuntime|{standing?:string;reason_code?:string}|null
  if(!response.ok||!body||body.standing!=="resolved")
    throw new Error(body&&"reason_code" in body&&typeof body.reason_code==="string"?body.reason_code:"initiative_surface_unavailable")
  return body as InitiativeSurfaceRuntime
}
