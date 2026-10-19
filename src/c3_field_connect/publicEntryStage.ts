export type PublicEntryStage = "intro" | "landing" | "connect"
/** MDM uses its dedicated registered film, including referred arrivals. */
export function initialPublicEntryStage(pathname: string, initiativeKey: string | undefined, hasShareReference: boolean, introCompleted=false): PublicEntryStage {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
  if (initiativeKey === "million_dollar_mission") return path === "/connect" ? "connect" : "landing"
  if(!initiativeKey&&path==="/connect"&&hasShareReference&&introCompleted) return "connect"
  // Preserve other initiatives' existing share/intro semantics.
  if (hasShareReference && initiativeKey === "47pct") return "landing"
  if (hasShareReference) return "intro"
  return pathname === "/connect" ? "connect" : initiativeKey ? "landing" : "intro"
}

export function invitationFromSearch(search:string):{kind:"none"|"invalid"|"valid";via:string|null}{
  const values=new URLSearchParams(search).getAll("via")
  if(!values.length)return {kind:"none",via:null}
  if(values.length!==1||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(values[0]))
    return {kind:"invalid",via:null}
  return {kind:"valid",via:values[0]}
}
/** Presentation marker only: never a claim, session, verification or entitlement. */
export function invitationConnectUrl(via:string){
  if(invitationFromSearch("?via="+encodeURIComponent(via)).kind!=="valid")throw Error("invalid_invitation")
  return "/connect?"+new URLSearchParams({via,intro:"complete"}).toString()
}
export function afterPublicIntro(initiativeKey:string|undefined,hasShareReference:boolean):PublicEntryStage{
  return !initiativeKey&&hasShareReference?"connect":"landing"
}
