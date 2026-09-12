export type C3FieldRouteKind = "connect" | "operations" | "held_unknown"

export type C3FieldRouteDecision = {
  kind: C3FieldRouteKind
  pathname: string
  component: "C3CommunityConnect" | "OarOperationsConsole" | "HeldUnknownC3FieldRoute"
  exposesOperationsSpine: boolean
  createsStanding: false
}

export function normalizeC3Pathname(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : "/"
}

export function resolveC3FieldRoute(pathname: string): C3FieldRouteDecision {
  const normalized = normalizeC3Pathname(pathname)
  if (normalized === "/") {
    return {
      kind: "connect",
      pathname: normalized,
      component: "C3CommunityConnect",
      exposesOperationsSpine: false,
      createsStanding: false,
    }
  }
  if (normalized === "/c3ops") {
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
