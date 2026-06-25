import type { CSSProperties, ReactNode } from "react"
import ObsidianChamberRenderer from "../chambers/ObsidianChamberRenderer"
import type { AssessmentCapturePayload } from "../chambers/ObsidianChamberRenderer"
import LapisChamberRenderer from "../chambers/LapisChamberRenderer"
import type { SubscriptionCapturePayload } from "../chambers/LapisChamberRenderer"
import MarbleChamberRenderer from "../chambers/MarbleChamberRenderer"
import type { EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"

export type ChamberRouterProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  // Shell provides these in Phase 4. Omitting disables capture persistence.
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
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

  // Known environment — renderer gap (Crystal Seat not yet implemented)
  if (chamberAssignment === "crystal_seat") {
    return (
      <main
        className="measures-registry-runtime"
        data-surface={encounter.surface}
        data-material-family={encounter.materialIdentity}
        data-layout-contract="renderer_gap"
        data-release-standing="renderer_gap"
        style={props.registryTokenStyle}
      >
        {props.renderHeader({ title: encounter.encounterDef?.display_title ?? "Measures Registry" })}
        <section className="registry-held-state" role="status">
          <span>Registry</span>
          <p>This surface is not yet available.</p>
        </section>
        {props.renderSystemFooter()}
      </main>
    )
  }

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
