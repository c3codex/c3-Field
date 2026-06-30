import type { CSSProperties, ReactNode } from "react"
import ObsidianChamberRenderer from "../chambers/ObsidianChamberRenderer"
import type { AssessmentCapturePayload } from "../chambers/ObsidianChamberRenderer"
import LapisChamberRenderer from "../chambers/LapisChamberRenderer"
import type { SubscriptionCapturePayload } from "../chambers/LapisChamberRenderer"
import MarbleChamberRenderer from "../chambers/MarbleChamberRenderer"
import type { MapPaymentParams } from "../chambers/MarbleChamberRenderer"
import CrystalSeatRenderer from "../chambers/CrystalSeatRenderer"
import type { ConnectCapturePayload } from "../chambers/CrystalSeatRenderer"
import type { EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"

export type ChamberRouterProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  // Encounter Boundary provides these. Omitting disables capture persistence.
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
  onCaptureConnect?: (payload: ConnectCapturePayload) => Promise<{ error: string | null }>
  onInitiateMapPayment?: (params: MapPaymentParams) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

// Routes a RenderableEncounter to the correct chamber renderer.
// Dispatches from encounter.chamberAssignment — value seated by DB surface assignment.
// No DB access. No authority logic. No release logic. No composition.
export default function ChamberRouter(props: ChamberRouterProps) {
  const { encounter } = props
  const { chamberAssignment } = encounter

  if (chamberAssignment === "obsidian") {
    return <ObsidianChamberRenderer {...props} />
  }

  if (chamberAssignment === "lapis") {
    return <LapisChamberRenderer {...props} />
  }

  if (chamberAssignment === "marble") {
    return <MarbleChamberRenderer {...props} />
  }

  if (chamberAssignment === "crystal_seat") {
    return <CrystalSeatRenderer {...props} />
  }

  // All 4 EncounterEnvironmentAssignment members handled above.
  // TypeScript narrows chamberAssignment to never here — exhaustiveness confirmed.
  // Unknown chamber assignment — public-safe unavailable state, no fallback to Obsidian
  const _exhaustive: never = chamberAssignment
  void _exhaustive

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-layout-contract="unavailable"
      data-release-standing="unavailable"
      style={props.registryTokenStyle}
    >
      {props.renderHeader({ title: "Measures Registry" })}
      <section className="registry-held-state" role="status">
        <span>Registry</span>
        <p>This surface is unavailable.</p>
      </section>
      {props.renderSystemFooter()}
    </main>
  )
}
