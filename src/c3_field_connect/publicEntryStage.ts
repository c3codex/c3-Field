export type PublicEntryStage = "intro" | "landing" | "connect"
/** MDM uses its dedicated registered film, including referred arrivals. */
export function initialPublicEntryStage(pathname: string, initiativeKey: string | undefined, hasShareReference: boolean): PublicEntryStage {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
  if (initiativeKey === "million_dollar_mission") return path === "/connect" ? "connect" : "landing"
  // Preserve other initiatives' existing share/intro semantics.
  if (hasShareReference && initiativeKey === "47pct") return "landing"
  if (hasShareReference) return "intro"
  return pathname === "/connect" ? "connect" : initiativeKey ? "landing" : "intro"
}
