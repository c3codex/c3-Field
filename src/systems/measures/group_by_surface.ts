export type TempExhibitionRow = {
  id: number
  display_context: string
  surface_type: string
  surface_key: string
  label: string | null
  media_type: "image" | "video" | "audio" | "document"
  bucket_name: string
  storage_path: string
  render_order: number
  is_active: boolean
  notes?: string | null
}

export type SurfaceGroup = {
  surface_type: string
  surface_key: string
  items: TempExhibitionRow[]
}

export function groupBySurface(
  rows: TempExhibitionRow[]
): Record<string, SurfaceGroup> {
  return rows.reduce<Record<string, SurfaceGroup>>((acc, row) => {
    const groupKey = `${row.surface_type}::${row.surface_key}`

    if (!acc[groupKey]) {
      acc[groupKey] = {
        surface_type: row.surface_type,
        surface_key: row.surface_key,
        items: [],
      }
    }

    acc[groupKey].items.push(row)
    acc[groupKey].items.sort((a, b) => a.render_order - b.render_order)

    return acc
  }, {})
}

export function getSurfaceGroup(
  groups: Record<string, SurfaceGroup>,
  surface_type: string,
  surface_key: string
): SurfaceGroup | null {
  return groups[`${surface_type}::${surface_key}`] ?? null
}

export function getSurfaceItems(
  groups: Record<string, SurfaceGroup>,
  surface_type: string,
  surface_key: string
): TempExhibitionRow[] {
  return getSurfaceGroup(groups, surface_type, surface_key)?.items ?? []
}
