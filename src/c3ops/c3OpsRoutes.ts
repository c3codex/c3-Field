export function isC3OpsHost(hostname: string) { return hostname === "c3ops.c3field.online" }
export const portals = [
  {path:"/relational-operations",label:"Relational Operations",subtitle:"Interoperability · Passage · Canopy"},
  {path:"/systems-access",label:"Systems Access",subtitle:"Governed Environments · Registry · Operations"},
  {path:"/c3optics",label:"c3Optics",subtitle:"Evidence · Proof · Current"},
] as const
export function c3OpsRoute(path: string) {
  const value = path.replace(/\/+$/,"") || "/"
  return ["/",...portals.map(p=>p.path),"/relational-operations/lapzuli","/systems-access/current","/systems-access/build","/systems-access/work","/systems-access/registry"].includes(value) ? value : null
}

