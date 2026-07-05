import { lazy, Suspense } from "react"
import type { CSSProperties, ReactNode } from "react"
import type { AssessmentCapturePayload } from "../chambers/ObsidianChamberRenderer"
import type { SubscriptionCapturePayload } from "../chambers/LapisChamberRenderer"
import type { MapPaymentParams } from "../chambers/MarbleChamberRenderer"
import type { ConnectCapturePayload } from "../chambers/CrystalSeatRenderer"
import type { EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"

// Lazy-loaded per chamber — only the chamber assignment actually active on a given
// surface is fetched. Reduces initial bundle weight (previously all four chamber
// renderers were statically bundled together regardless of which one a visitor needed).
const ObsidianChamberRenderer = lazy(() => import("../chambers/ObsidianChamberRenderer"))
const LapisChamberRenderer = lazy(() => import("../chambers/LapisChamberRenderer"))
const MarbleChamberRenderer = lazy(() => import("../chambers/MarbleChamberRenderer"))
const CrystalSeatRenderer = lazy(() => import("../chambers/CrystalSeatRenderer"))

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
// Loading fallback while a chamber's code chunk is fetched — mirrors the resolver's own
// loading state in EncounterEntry.tsx so a slow chunk fetch reads the same as a slow
// resolver fetch, not as a distinct/broken state.
function ChamberLoadingFallback({ encounter, registryTokenStyle, renderHeader, renderSystemFooter }: ChamberRouterProps) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-layout-contract="loading"
      data-release-standing="pending"
      style={registryTokenStyle}
    >
      {renderHeader({ title: "Measures Registry" })}
      <section className="registry-held-state" role="status" aria-live="polite">
        <span>Registry</span>
      </section>
      {renderSystemFooter()}
    </main>
  )
}

export default function ChamberRouter(props: ChamberRouterProps) {
  const { encounter } = props
  const { chamberAssignment } = encounter
  const fallback = <ChamberLoadingFallback {...props} />

  if (chamberAssignment === "obsidian") {
    return <Suspense fallback={fallback}><ObsidianChamberRenderer {...props} /></Suspense>
  }

  if (chamberAssignment === "lapis") {
    return <Suspense fallback={fallback}><LapisChamberRenderer {...props} /></Suspense>
  }

  if (chamberAssignment === "marble") {
    return <Suspense fallback={fallback}><MarbleChamberRenderer {...props} /></Suspense>
  }

  if (chamberAssignment === "crystal_seat") {
    return <Suspense fallback={fallback}><CrystalSeatRenderer {...props} /></Suspense>
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
