import type { GateResult, RegistryRow } from "../types/encounterRendererTypes"

export function checkReleaseGate(row: RegistryRow): GateResult {
  if (!row.is_active) {
    return { status: "held", reason: "inactive_registry_record" }
  }
  if (row.release_state !== "released") {
    return { status: "held", reason: `release_state:${row.release_state ?? "null"}` }
  }
  return { status: "released" }
}
