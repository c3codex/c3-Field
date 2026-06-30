import EncounterBoundary from "./boundary/EncounterBoundary"
import type { AssessmentCapturePayload } from "./chambers/ObsidianChamberRenderer"
import type { SubscriptionCapturePayload } from "./chambers/LapisChamberRenderer"
import type { ConnectCapturePayload } from "./chambers/CrystalSeatRenderer"
import type { MapPaymentParams } from "./chambers/MarbleChamberRenderer"
import { loadEncounterProfile } from "./resolver/encounterProfileLoader"
import type { EncounterRendererProps } from "./types/encounterRendererTypes"

// Entry component for the encounter renderer pipeline.
// Runs: resolverData + activeSurface → loadEncounterProfile → EncounterBoundary.
// Does not render encounter surfaces directly. Does not bypass EncounterBoundary.
// Does not expose internal gate reasons. Loading and resolver errors surface as
// public-safe unavailable states only.

export type EncounterEntryProps = EncounterRendererProps & {
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
  onCaptureConnect?: (payload: ConnectCapturePayload) => Promise<{ error: string | null }>
  onInitiateMapPayment?: (params: MapPaymentParams) => Promise<{ error: string | null }>
}

export default function EncounterEntry({
  activeSurface,
  resolverData,
  registryTokenStyle,
  onNavigate,
  onCaptureAssessment,
  onCaptureSubscription,
  onCaptureConnect,
  onInitiateMapPayment,
  renderHeader,
  renderSystemFooter,
}: EncounterEntryProps) {
  if (resolverData.loading) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface={activeSurface}
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

  if (resolverData.error) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface={activeSurface}
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

  const result = loadEncounterProfile(activeSurface, resolverData)

  return (
    <EncounterBoundary
      result={result}
      registryTokenStyle={registryTokenStyle}
      onNavigate={onNavigate}
      onCaptureAssessment={onCaptureAssessment}
      onCaptureSubscription={onCaptureSubscription}
      onCaptureConnect={onCaptureConnect}
      onInitiateMapPayment={onInitiateMapPayment}
      renderHeader={renderHeader}
      renderSystemFooter={renderSystemFooter}
    />
  )
}
