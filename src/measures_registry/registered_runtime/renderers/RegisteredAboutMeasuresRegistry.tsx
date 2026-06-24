import { useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { asRecord, asString, asStringArray } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  aboutCopy: SectionCopy
  encounterCopy: SectionCopy
  videoUrl: string | null
  passageMuted: boolean
  onToggleMuted: () => void
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
}

export default function RegisteredAboutMeasuresRegistry({
  registryTokenStyle,
  aboutCopy,
  encounterCopy,
  videoUrl,
  passageMuted,
  onToggleMuted,
  renderHeader,
  renderSystemFooter,
}: Props) {
  const [view, setView] = useState<"encounter" | "supporting">("encounter")

  // Encounter state — right-path copy from structure_passage encounter
  const structureContracts = encounterCopy.crystalContentContracts
  const understandPassage = asRecord(structureContracts?.understand_environment_passage)
  const structurePassageContract = asRecord(structureContracts?.structure_passage_contract_v1)
  const publicCopyContract = asRecord(understandPassage?.crystal_passage_public_copy_contract)

  const eyebrow =
    asString(structurePassageContract?.public_eyebrow) ??
    asString(understandPassage?.public_label) ??
    encounterCopy.eyebrow
  const encounterTitle =
    asString(structurePassageContract?.public_title) ??
    asString(publicCopyContract?.title) ??
    encounterCopy.title
  const positionParagraph =
    asString(structurePassageContract?.position_paragraph) ??
    asString(understandPassage?.position_paragraph) ??
    asString(publicCopyContract?.context_body) ??
    encounterCopy.subtitle

  // Supporting state — about encounter approved content
  const approved = aboutCopy.approvedContentContract
  const primaryStatement = asString(approved?.primary_statement)
  const supportPoints = asStringArray(approved?.support_points)
  const supportingTitle = asString(approved?.title) ?? aboutCopy.title

  if (view === "encounter") {
    if (!eyebrow || !encounterTitle) {
      return (
        <main
          className="measures-registry-runtime"
          data-surface="about_measures_registry"
          data-public-path="about_encounter"
          data-release-standing="held_missing_registry_content"
          style={registryTokenStyle}
        >
          {renderHeader()}
          <section className="registry-held-state" role="status">
            <p>About Measures Registry encounter content is not seated in the registry.</p>
          </section>
          {renderSystemFooter()}
        </main>
      )
    }

    return (
      <main
        className="measures-registry-runtime"
        data-surface="about_measures_registry"
        data-public-path="about_encounter"
        data-release-standing="public"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-public-understand registry-structure-passage" aria-label={encounterTitle}>
          <div className="registry-structure-passage-layout">
            <div className="registry-structure-passage-copy">
              <span>{eyebrow}</span>
              <h1>{encounterTitle}</h1>
              {positionParagraph ? <p>{positionParagraph}</p> : null}
            </div>
            <div className="registry-public-understand-video">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay
                  muted={passageMuted}
                  playsInline
                  preload="auto"
                  aria-label={encounterTitle}
                />
              ) : (
                <p className="registry-media-absence">About encounter media is not seated in the runtime registry.</p>
              )}
              <div className="registry-public-understand-video-controls">
                <button type="button" onClick={onToggleMuted}>
                  {passageMuted ? "Audio" : "Mute"}
                </button>
                <button type="button" onClick={() => setView("supporting")}>Continue</button>
              </div>
            </div>
          </div>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  // Supporting state
  return (
    <main
      className="measures-registry-runtime"
      data-surface="about_measures_registry"
      data-public-path="about_supporting"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-about-supporting" aria-label={supportingTitle ?? "About Measures Registry"}>
        {supportingTitle ? <h1 className="registry-about-supporting-title">{supportingTitle}</h1> : null}
        {primaryStatement ? <p className="registry-about-primary-statement">{primaryStatement}</p> : null}
        {supportPoints.length > 0 ? (
          <ul className="registry-about-support-points">
            {supportPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
        <div className="registry-about-cards">
          <div className="registry-about-card">
            <span>Publication</span>
            <h2>Read unDrifted</h2>
            <p>Dispatches from Measures Registry on structural drift, AI operations, and governed environments.</p>
            <a href="/undrifted" className="registry-about-card-cta">Open unDrifted</a>
          </div>
          <div className="registry-about-card">
            <span>Connect</span>
            <h2>Connect with Measures Registry</h2>
            <p>connect@measuresregistry.com</p>
            <a href="mailto:connect@measuresregistry.com" className="registry-about-card-cta">Email Measures Registry</a>
          </div>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
