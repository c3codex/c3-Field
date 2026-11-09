export function isC3OpsHost(hostname: string) { return hostname === "c3ops.c3field.online" }
export const portals = [
  {path:"/systems-access",label:"Operations",subtitle:"Organize the work and its authority.", available:"Environment and authority readbacks", planned:"OAR2 / worksets · Authorizations · AI roles / skills · Participant signups and follow-ups", future:"Financials"},
  {path:"/c3optics",label:"Optics",subtitle:"See the evidence. Understand the holds.", available:"Current and returned evidence", planned:"PAC DNRs · Drift watch · Governance health", future:null},
  {path:"/relational-operations",label:"Interops",subtitle:"Follow connections through to outcomes.", available:"Registered environment relationships", planned:"NUGs · Usage · Lapzuli publications / campaigns · HLD / DNR reports", future:null},
] as const
export function c3OpsRoute(path: string) {
  const value = path.replace(/\/+$/,"") || "/"
  return ["/",...portals.map(p=>p.path),"/relational-operations/lapzuli","/systems-access/current","/systems-access/build","/systems-access/work","/systems-access/registry"].includes(value) ? value : null
}
