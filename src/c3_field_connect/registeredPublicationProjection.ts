export const UND_FIELD_PROJECTION_HOST = "undrifted.measuresregistry.com"

export type RegisteredPublicationProjection = {
  release_state: string
  canonical_host: string
  canonical_path: string
  projection_type: string
  publication_key: string
  authority_effect: string
  renderer_identity: string
  source_pubpac_key: string
  frontend_invention: boolean
  native_publication_route: string
  presentation_manifest_key: string
  native_publication_environment: string
}

export function normalizeProjectionHost(hostname:string){
  return hostname.trim().toLowerCase().replace(/\.+$/g,"")
}

export function isRegisteredPublicationProjectionHost(hostname:string){
  return normalizeProjectionHost(hostname)===UND_FIELD_PROJECTION_HOST
}

function record(value:unknown):Record<string,unknown>|null{
  return value && typeof value==="object" && !Array.isArray(value)
    ? value as Record<string,unknown>
    : null
}

export function resolveRegisteredUndriftedProjection(body:unknown,hostname:string):RegisteredPublicationProjection|null{
  const envelope=record(body)
  if(!envelope||envelope.status!=="available")return null
  const p=record(envelope.presentation)
  if(!p)return null
  if(p.projection_type!=="registered_publication_projection")return null
  if(p.publication_key!=="undrifted")return null
  if(normalizeProjectionHost(String(p.canonical_host||""))!==normalizeProjectionHost(hostname))return null
  if(p.canonical_path!=="/")return null
  if(p.renderer_identity!=="c2me.publication_encounter")return null
  if(typeof p.source_pubpac_key!=="string"||!p.source_pubpac_key)return null
  if(typeof p.presentation_manifest_key!=="string"||!p.presentation_manifest_key)return null
  if(p.native_publication_route!=="/undrifted")return null
  if(p.native_publication_environment!=="env_undrifted_publication")return null
  if(p.frontend_invention!==false)return null
  if(p.authority_effect!=="none")return null
  if(p.release_state!=="public")return null
  return p as RegisteredPublicationProjection
}
