import { lazy, Suspense } from "react"
import type { CSSProperties, ReactNode } from "react"
import type { AssessmentCapturePayload } from "../chambers/ObsidianChamberRenderer"
import type { SubscriptionCapturePayload } from "../chambers/LapisChamberRenderer"
import type { MapPaymentParams } from "../chambers/MarbleChamberRenderer"
import type { ConnectCapturePayload } from "../chambers/CrystalSeatRenderer"
import type { EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"
import { shouldUseUnDriftedMgsRenderer } from "../publications/UnDriftedMgsRenderer"

const ObsidianChamberRenderer = lazy(() => import("../chambers/ObsidianChamberRenderer"))
const LapisChamberRenderer = lazy(() => import("../chambers/LapisChamberRenderer"))
const UnDriftedMgsRenderer = lazy(() => import("../publications/UnDriftedMgsRenderer"))
const MarbleChamberRenderer = lazy(() => import("../chambers/MarbleChamberRenderer"))
const CrystalSeatRenderer = lazy(() => import("../chambers/CrystalSeatRenderer"))

export type ChamberRouterProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
  onCaptureConnect?: (payload: ConnectCapturePayload) => Promise<{ error: string | null }>
  onInitiateMapPayment?: (params: MapPaymentParams) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

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

  if ((chamberAssignment === "lapis" || chamberAssignment === "public_relational_encounter") && shouldUseUnDriftedMgsRenderer(encounter)) {
    return <Suspense fallback={fallback}><UnDriftedMgsRenderer {...props} /></Suspense>
  }

  if (chamberAssignment === "lapis" || chamberAssignment === "public_relational_encounter") {
    return <Suspense fallback={fallback}><LapisChamberRenderer {...props} /></Suspense>
  }

  if (chamberAssignment === "marble") {
    return <Suspense fallback={fallback}><MarbleChamberRenderer {...props} /></Suspense>
  }

  if (chamberAssignment === "crystal_seat") {
    return <Suspense fallback={fallback}><CrystalSeatRenderer {...props} /></Suspense>
  }

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
