import type {ReadRows} from "./me-environment"

export const OAR_OPTICS_INTERFACE="c3ops_oar_lifecycle_optics_resolution_v1"
export const OAR_OPTICS_FIELDS=[
  "oar_key","execution_instance","executor_ref","queue_standing","preflight_standing",
  "requested_action","execution_summary","return_standing","model_resolution_standing",
  "validation_standing","deploy_standing","created_at","updated_at",
] as const

// Transport/projection only. Lifecycle meaning is resolved by the Registry view.
export async function readResolvedOarOptics(read:ReadRows){
  const rows=await read(OAR_OPTICS_INTERFACE,OAR_OPTICS_FIELDS.join(","),{order:"created_at.desc"})
  return rows.map(row=>Object.fromEntries(OAR_OPTICS_FIELDS.map(key=>[key,row[key]??null])))
}
