import type {InitiativeSurfaceRuntime} from "./initiativeSurfaceHost"

type Envelope={status?:unknown;presentation?:unknown}

function record(value:unknown):Record<string,unknown>|null{
  return value&&typeof value==="object"&&!Array.isArray(value)
    ? value as Record<string,unknown>
    : null
}

function str(value:unknown){
  return typeof value==="string"&&value.trim()?value.trim():null
}

function normalizeHost(value:string){
  return value.trim().toLowerCase().replace(/\.+$/g,"")
}

export const REGISTERED_C3_NATIVE_INITIATIVE_PROJECTION="registered_c3_native_initiative_projection"

export function resolveRegisteredInitiativeProjection(
  body:unknown,
  hostname:string
):InitiativeSurfaceRuntime|null{
  const envelope=record(body) as Envelope|null
  if(!envelope||envelope.status!=="available")return null
  const p=record(envelope.presentation)
  if(!p)return null

  if(p.projection_type!==REGISTERED_C3_NATIVE_INITIATIVE_PROJECTION)return null
  if(str(p.release_state)!=="public")return null
  if(str(p.authority_effect)!=="none")return null
  if(p.frontend_invention!==false)return null
  if(p.creates_standing!==false)return null
  if(str(p.canonical_environment)!=="env_c3_community_connect")return null

  const host=str(p.canonical_host)
  const canonicalPath=str(p.canonical_path)
  const initiativeKey=str(p.initiative_key)
  const initiativeProcessKey=str(p.initiative_process_key)
  const surfaceKey=str(p.surface_key)
  const webpacKey=str(p.webpac_key)
  const canonicalUrl=str(p.canonical_url)
  const route=str(p.route)
  const connectRoute=str(p.connect_route)

  if(!host||normalizeHost(host)!==normalizeHost(hostname))return null
  if(canonicalPath!=="/")return null
  if(!initiativeKey||!initiativeProcessKey||!surfaceKey||!webpacKey||!canonicalUrl||!route||!connectRoute)return null

  try{
    const url=new URL(canonicalUrl)
    if(url.protocol!=="https:"||normalizeHost(url.hostname)!==normalizeHost(host)||url.pathname!==canonicalPath||url.search||url.hash||url.username||url.password||url.port)return null
  }catch{return null}

  if(route!=="/"||connectRoute!=="/connect")return null
  const publicPresentation=record(p.public_presentation)
  const publicFooter=record(p.public_footer)
  const openGraphContract=record(p.open_graph_contract)

  return {
    standing:"resolved",
    host,
    surfaceKey,
    initiativeKey,
    webpacKey,
    canonicalEnvironment:"env_c3_community_connect",
    canonicalUrl,
    route,
    connectRoute,
    ...(publicPresentation?{publicPresentation:publicPresentation as InitiativeSurfaceRuntime["publicPresentation"]}:{}),
    ...(publicFooter?{publicFooter:publicFooter as InitiativeSurfaceRuntime["publicFooter"]}:{}),
    ...(openGraphContract?{openGraphContract:openGraphContract as InitiativeSurfaceRuntime["openGraphContract"]}:{}),
    createsStanding:false
  }
}
