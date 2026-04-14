import React from "react"
import ChamberplateSurface from "@/surfaces/chamberplate/ChamberplateSurface"

export default function CodexstoneResolveSurface() {
  return (
    <section
      data-surface-type="resolve"
      data-surface-key="codexstone"
      style={{
        display: "grid",
        gap: "1rem",
        width: "100%",
      }}
    >
      <h2>Codexstone</h2>

      {/* Resolve chamberplate */}
      <ChamberplateSurface
        surfaceType="me"
        surfaceKey="me_codexstone"
      />

      {/* Optional subtle marker */}
      <div
        style={{
          fontSize: "0.8rem",
          opacity: 0.6,
        }}
      >
        Resolution surface — Spring Equinox band
      </div>
    </section>
  )
}
