export type C3FieldRouteKind = "connect" | "c2_shell" | "operations" | "publication" | "held_unknown"

export type C3FieldRouteDecision = {
  kind: C3FieldRouteKind
  pathname: string
  component: "C3CommunityConnect" | "C2EnvironmentShell" | "OarOperationsConsole" | "PublicWhitePaperLanding" | "HeldUnknownC3FieldRoute"
  exposesOperationsSpine: boolean
  createsStanding: false
}

export function normalizeC3Pathname(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : "/"
}

export function resolveC3FieldRoute(pathname: string): C3FieldRouteDecision {
  const normalized = normalizeC3Pathname(pathname)
  if (normalized === "/c2") return {kind:"c2_shell", pathname:normalized, component:"C2EnvironmentShell", exposesOperationsSpine:false, createsStanding:false}
  if (normalized === "/") {
    return {
      kind: "connect",
      pathname: normalized,
      component: "C3CommunityConnect",
      exposesOperationsSpine: false,
      createsStanding: false,
    }
  }
  if (normalized === "/community-potential") {\n    return { kind: "publication", pathname: normalized, component: "PublicWhitePaperLanding", exposesOperationsSpine: false, createsStanding: false }\n  }\n  if (normalized === "/c3ops") {
    return {
      kind: "operations",
      pathname: normalized,
      component: "OarOperationsConsole",
      exposesOperationsSpine: true,
      createsStanding: false,
    }
  }
  return {
    kind: "held_unknown",
    pathname: normalized,
    component: "HeldUnknownC3FieldRoute",
    exposesOperationsSpine: false,
    createsStanding: false,
  }
}
