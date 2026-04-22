import { supabase } from "@/lib/supabase"

export type PhaseMapNode = {
  registryKey: string
  displayTitle: string
  releaseState: string
  accessState: string
  angleDeg: number
  band: number
  isReleased: boolean
  isInteractive: boolean
}

export type PhaseMapLegend = {
  enabled?: boolean
  items?: Array<{
    tone: string
    label: string
  }>
} | null

export type PhaseMapResolution = {
  nodes: PhaseMapNode[]
  legend?: PhaseMapLegend
}

function isReleasedValue(releaseState: string | null | undefined): boolean {
  return releaseState === "released" || releaseState === "open"
}

function isInteractiveValue(accessState: string | null | undefined): boolean {
  return accessState === "visible" || accessState === "encounterable" || accessState === "callable"
}

export async function resolvePhaseMap(): Promise<PhaseMapResolution> {
  const { data: nodeRows, error: nodeError } = await supabase
    .from("v_phase_map_nodes")
    .select("*")
    .order("band", { ascending: true })
    .order("angle_deg", { ascending: true })

  if (nodeError) throw nodeError

  const { data: presentationRow, error: presentationError } = await supabase
    .from("v_phase_map_presentation")
    .select("*")
    .single()

  if (presentationError) throw presentationError

  const nodes: PhaseMapNode[] = (nodeRows ?? []).map((row: any) => ({
    registryKey: row.registry_key,
    displayTitle: row.display_title,
    releaseState: row.release_state,
    accessState: row.access_state,
    angleDeg: Number(row.angle_deg ?? 0),
    band: Number(row.band ?? 1),
    isReleased: isReleasedValue(row.release_state),
    isInteractive: isInteractiveValue(row.access_state),
  }))

  const legend = (presentationRow?.legend ?? null) as PhaseMapLegend

  return {
    nodes,
    legend,
  }
}
