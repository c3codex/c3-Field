import type { CSSProperties, ReactNode } from "react"
import ChamberRouter from "../router/ChamberRouter"
import type { AssessmentCapturePayload } from "../chambers/ObsidianChamberRenderer"
import type { SubscriptionCapturePayload } from "../chambers/LapisChamberRenderer"
import type { ConnectCapturePayload } from "../chambers/CrystalSeatRenderer"
import type { EncounterSurface, RenderableEncounterResult } from "../types/encounterRendererTypes"

// Encounter Boundary — the constitutional threshold between determination and manifestation.
// Receives the output of the determination pipeline (RenderableEncounterResult).
// If held: surfaces a public-safe unavailable state — no internals exposed.
// If renderable: passes RenderableEncounter to ChamberRouter with all capture callbacks.
//
// Nothing above determines standing. Nothing below presents without a released encounter.
// Authority and presentation are permanently separated at this boundary.

export type EncounterBoundaryProps = {
  result: RenderableEncounterResult
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  // All callbacks optional — Encounter Boundary wires them; omitting disables that capture path.
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
  onCaptureConnect?: (payload: ConnectCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

export default function EncounterBoundary({
  result,
  registryTokenStyle,
  onNavigate,
  onCaptureAssessment,
  onCaptureSubscription,
  onCaptureConnect,
  renderHeader,
  renderSystemFooter,
}: EncounterBoundaryProps) {
  if (!result.renderable) {
    return (
      <main
        className="measures-registry-runtime"
        data-layout-contract="unavailable"
        data-release-standing="unavailable"
        style={registryTokenStyle}
      >
        {renderHeader({ title: "Measures Registry" })}
        <section className="registry-held-state" role="status">
          <span>Registry</span>
          <p>This encounter is not available.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  return (
    <ChamberRouter
      encounter={result.encounter}
      registryTokenStyle={registryTokenStyle}
      onNavigate={onNavigate}
      onCaptureAssessment={onCaptureAssessment}
      onCaptureSubscription={onCaptureSubscription}
      onCaptureConnect={onCaptureConnect}
      renderHeader={renderHeader}
      renderSystemFooter={renderSystemFooter}
    />
  )
}
