import React from "react"
import { useTempExhibitionMedia } from "@/systems/measures/use_temp_exhibition_media"

export default function TempExhibitionMediaInspector() {
  const { rows, groups, loading, error } = useTempExhibitionMedia()

  if (loading) {
    return <div>Loading exhibition media…</div>
  }

  if (error) {
    return <div>Exhibition media error: {error}</div>
  }

  const entries = Object.entries(groups)

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Temp Exhibition Media Inspector</h2>
      <p>Total rows: {rows.length}</p>
      <p>Total grouped surfaces: {entries.length}</p>

      {entries.length === 0 ? (
        <p>No active exhibition media rows found.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {entries.map(([groupKey, group]) => (
            <div
              key={groupKey}
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "0.75rem",
              }}
            >
              <h3 style={{ margin: 0 }}>{group.surface_type} / {group.surface_key}</h3>
              <p style={{ margin: "0.5rem 0" }}>
                Items: {group.items.length}
              </p>

              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                {group.items.map((item) => (
                  <li key={item.id}>
                    #{item.render_order} · {item.media_type} · {item.label ?? item.storage_path}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
