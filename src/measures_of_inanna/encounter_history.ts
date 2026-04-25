import { supabase } from "@/integrations/supabase/client"
import type { EncounterResolution } from "./types"

const HISTORY_TABLE = "measures_encounter_view_history"
const VISITOR_ID_KEY = "measures_of_inanna_visitor_id"

let historyUnavailable = false

function warnOnce(error: unknown) {
  if (historyUnavailable) return
  historyUnavailable = true
  console.warn("Encounter history contract unavailable", error)
}

export function getEncounterVisitorId() {
  const existing = window.localStorage.getItem(VISITOR_ID_KEY)
  if (existing) return existing

  const generated =
    window.crypto?.randomUUID?.() ??
    `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`

  window.localStorage.setItem(VISITOR_ID_KEY, generated)
  return generated
}

export async function loadViewedRegistryKeys() {
  const visitorId = getEncounterVisitorId()
  const { data, error } = await supabase
    .from(HISTORY_TABLE)
    .select("registry_key")
    .eq("visitor_id", visitorId)
    .order("viewed_at", { ascending: true })

  if (error) {
    warnOnce(error)
    return []
  }

  return (data ?? [])
    .map((row) => row.registry_key)
    .filter((key): key is string => typeof key === "string" && key.length > 0)
}

export async function recordEncounterView(resolution: EncounterResolution) {
  const visitorId = getEncounterVisitorId()
  const viewedAt = new Date().toISOString()
  const { error } = await supabase.from(HISTORY_TABLE).upsert(
    {
      visitor_id: visitorId,
      registry_key: resolution.registryKey,
      encounter_key: resolution.encounterKey,
      surface_type: resolution.surfaceType,
      metadata: {
        source: "measures_of_inanna_renderer",
      },
      viewed_at: viewedAt,
      updated_at: viewedAt,
    },
    { onConflict: "visitor_id,registry_key" },
  )

  if (error) warnOnce(error)
}
