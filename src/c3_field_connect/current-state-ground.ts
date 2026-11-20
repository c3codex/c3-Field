// Source candidate: presentation only, not an authority resolver.
export const GROUND_KEY = "current_state_ground_designpac_v1"
export const GROUND_ASSET = "c3_field_current_state_ground_v1"
export const GROUND_SHA256 = "45217142b957b3e057294c9390c03e059fa9c6e3a7fe0e32447621cceb6dab14"
export const GROUND_MEDIA = "/api/free-media?asset=" + GROUND_ASSET
export type GroundPresentation = {
  designpac_key: string
  standing: string
  asset_key: string
  asset_sha256: string
  media_url: string
  width: number
  height: number
}
export type GroundPrimitive = {primitive_key:string; renderer_key:string}
export function matchesGround(p:GroundPresentation | null | undefined): boolean {
  return p?.designpac_key === GROUND_KEY && p.standing === "resolved" &&
    p.asset_key === GROUND_ASSET && p.asset_sha256 === GROUND_SHA256 &&
    p.media_url === GROUND_MEDIA && p.width === 1672 && p.height === 941
}
export const GROUND_REGIONS = [
  {id:"stash", label:"My Stash", x:36, y:30, w:29, h:19},
  {id:"pacs", label:"My PACs", key:"my_pacs", renderer:"c1me.my_pacs", x:34, y:49, w:34, h:18},
  {id:"canopy", label:"My Canopy", key:"canopy", renderer:"c1me.canopy", x:30, y:67, w:42, h:19},
  {id:"connections", label:"My Connections", key:"native_connections", renderer:"c1me.native_connections", x:76, y:46, w:21, h:16},
  {id:"invite", label:"Invite Connection", key:"invite_connection", renderer:"c1me.invite_connection", x:75, y:62, w:22, h:18},
  {id:"intelligence", label:"Intelligence entrance", x:7, y:30, w:23, h:44},
] as const
// Stash/BYOA deliberately have no executable mapping until their existing
// native admission + renderer worksets are integrated; do not map to Chazz.
export function groundDestination(region:typeof GROUND_REGIONS[number], admitted: readonly GroundPrimitive[]):string|null {
  if(!("key" in region)) return null
  const matches=admitted.filter(p=>p.primitive_key===region.key)
  return matches.length===1 && matches[0].renderer_key===region.renderer ? "primitive:"+region.key : null
}
