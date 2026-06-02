import type { CSSProperties, ReactNode } from "react"
import { asRecord, asString, asStringArray } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  structurePassageCopy: SectionCopy
  questionsVideoUrl: string | null
  talkingHeadVideoUrl: string | null
  passageMuted: boolean
  structuralDriftAvailable: boolean
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onAssessEnvironment: () => void
  onStructuralDrift: () => void
  onToggleMuted: () => void
}

function contentArray(value: unknown) {
  return asStringArray(value)
}

function contentBlock(contract: Record<string, unknown> | null, key: string) {
  return asRecord(asRecord(contract?.content_blocks)?.[key])
}

export default function RegisteredPublicUnderstand({
  registryTokenStyle,
  structurePassageCopy,
  questionsVideoUrl,
  talkingHeadVideoUrl,
  passageMuted,
  structuralDriftAvailable,
  renderHeader,
  renderSystemFooter,
  onAssessEnvironment,
  onStructuralDrift,
  onToggleMuted,
}: Props) {
  const contracts = structurePassageCopy.crystalContentContracts
  const understandPassage = asRecord(contracts?.understand_environment_passage)
  const about = asRecord(contracts?.about_measures_registry_encounter)
  const mapEducation = asRecord(contracts?.c3_map_education_encounter)
  const conversionEducation = asRecord(contracts?.measures_conversion_education_encounter)
  const assessCta = asRecord(contracts?.assess_environment_cta_encounter)
  const structuralDriftBlock = contentBlock(about, "structural_drift_publication_block")
  const foundationalLeadershipBlock = contentBlock(about, "foundational_leadership_block")
  const structuralDriftContract = asRecord(
    structuralDriftBlock?.publication_contract ?? contracts?.structural_drift_publication_contract,
  )
  const structuralDriftCta = asString(structuralDriftBlock?.cta) ?? "Read Structural Drift"
  const structuralDriftFallback =
    asString(asRecord(structuralDriftContract?.cta_contract)?.fallback_copy) ??
    "Structural Drift publication link coming soon."

  const title =
    asString(understandPassage?.public_label) ??
    structurePassageCopy.title ??
    "Understand the Environment"
  const subtitle =
    structurePassageCopy.subtitle ??
    asString(understandPassage?.role) ??
    "Public education for AI-accelerated system integrity."
  const aboutTitle = asString(about?.public_label) ?? "About Measures Registry"
  const aboutContent = contentArray(about?.content)
  const mapTitle = asString(mapEducation?.public_label) ?? "MAP the Environment"
  const mapDefinition = asString(mapEducation?.public_definition)
  const mapBoundary = asString(mapEducation?.boundary)
  const conversionTitle = asString(conversionEducation?.public_label) ?? "Measures Conversion"
  const conversionContent = asString(conversionEducation?.content)
  const conversionBoundary = asString(conversionEducation?.boundary)
  const assessCopy =
    asString(assessCta?.cta_copy) ??
    "Begin by understanding the environment. Then assess what must be governed."
  const assessButton = asString(assessCta?.button) ?? "Assess the Environment"

  return (
    <main
      className="measures-registry-runtime"
      data-surface="structure_passage"
      data-public-path="understand_environment"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-public-understand" aria-label={title}>
        <div className="registry-public-understand-hero">
          <div className="registry-encounter-entry">
            {structurePassageCopy.eyebrow ? <span>{structurePassageCopy.eyebrow}</span> : null}
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {talkingHeadVideoUrl ? (
            <div className="registry-public-understand-video">
              <video
                src={talkingHeadVideoUrl}
                autoPlay
                muted={passageMuted}
                controls
                playsInline
                preload="auto"
                aria-label="Understand the Environment passage"
              />
              <button type="button" onClick={onToggleMuted}>
                {passageMuted ? "Audio" : "Mute"}
              </button>
            </div>
          ) : (
            <p className="registry-media-absence">Understand passage media is not seated in the runtime registry.</p>
          )}
        </div>

        <div className="registry-public-understand-grid">
          <article className="registry-public-understand-panel registry-public-understand-panel--wide">
            <span>{aboutTitle}</span>
            {aboutContent.length > 0 ? (
              aboutContent.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>About Measures Registry public copy is not seated in the runtime registry.</p>
            )}
          </article>

          <article className="registry-public-understand-panel">
            <span>{asString(structuralDriftBlock?.public_label) ?? "Structural Drift"}</span>
            {asString(structuralDriftBlock?.content) ? <p>{asString(structuralDriftBlock?.content)}</p> : null}
            {structuralDriftAvailable ? (
              <button type="button" onClick={onStructuralDrift}>
                {structuralDriftCta}
              </button>
            ) : (
              <p>{structuralDriftFallback}</p>
            )}
          </article>

          <article className="registry-public-understand-panel">
            <span>{asString(foundationalLeadershipBlock?.public_label) ?? "Foundational Leadership"}</span>
            {asString(foundationalLeadershipBlock?.content) ? <p>{asString(foundationalLeadershipBlock?.content)}</p> : null}
            {asString(foundationalLeadershipBlock?.boundary) ? <p>{asString(foundationalLeadershipBlock?.boundary)}</p> : null}
          </article>

          <article className="registry-public-understand-panel registry-public-understand-panel--video">
            <span>{asString(understandPassage?.video_title) ?? "The Questions Ungoverned AI Systems Cannot Answer"}</span>
            {questionsVideoUrl ? (
              <video
                src={questionsVideoUrl}
                controls
                playsInline
                preload="metadata"
                aria-label="The Questions Ungoverned AI Systems Cannot Answer"
              />
            ) : (
              <p className="registry-media-absence">Questions video media is not seated in the runtime registry.</p>
            )}
          </article>

          <article className="registry-public-understand-panel">
            <span>{mapTitle}</span>
            {mapDefinition ? <p>{mapDefinition}</p> : null}
            {mapBoundary ? <p>{mapBoundary}</p> : null}
          </article>

          <article className="registry-public-understand-panel">
            <span>{conversionTitle}</span>
            {conversionContent ? <p>{conversionContent}</p> : null}
            {conversionBoundary ? <p>{conversionBoundary}</p> : null}
          </article>
        </div>

        <div className="registry-public-understand-assess">
          <p>{assessCopy}</p>
          <button type="button" onClick={onAssessEnvironment}>
            {assessButton}
          </button>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
