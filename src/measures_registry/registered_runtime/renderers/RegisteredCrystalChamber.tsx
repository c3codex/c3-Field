import { useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { asRecord, asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  crystalChamberCopy: SectionCopy
  chamberCarrierCopy: SectionCopy
  questionsVideoUrl: string | null
  structuralDriftCoverUrl: string | null
  registryMarkUrl: string | null
  structuralDriftAvailable: boolean
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onAssessEnvironment: () => void
  onStructuralDrift: () => void
}

function contentBlock(contract: Record<string, unknown> | null, key: string) {
  return asRecord(asRecord(contract?.content_blocks)?.[key])
}

const prohibitedPublicTerms = [
  "pricing",
  "payment",
  "c3 Key",
  "temp c3 Key",
  "wallet",
  "NFT",
  "C1",
  "C2",
  "C3",
  "commerce circuit",
  "SRC active",
  "permission standing",
  "conversion standing",
  "certification standing",
  "DAO standing",
  "distribution standing",
]

function publicSafeString(value: string | null) {
  if (!value) return null
  const normalized = value.toLowerCase()
  return prohibitedPublicTerms.some((term) => normalized.includes(term.toLowerCase())) ? null : value
}

export default function RegisteredCrystalChamber({
  registryTokenStyle,
  crystalChamberCopy,
  chamberCarrierCopy,
  questionsVideoUrl,
  structuralDriftCoverUrl,
  registryMarkUrl,
  structuralDriftAvailable,
  renderHeader,
  renderSystemFooter,
  onAssessEnvironment,
  onStructuralDrift,
}: Props) {
  const contracts = crystalChamberCopy.crystalContentContracts ?? chamberCarrierCopy.crystalContentContracts
  const sparseContract = asRecord(
    contracts?.crystal_chamber_sparse_orientation_contract_v1 ??
      crystalChamberCopy.contentContract,
  )
  const about = asRecord(contracts?.about_measures_registry_encounter)
  const assessCta = asRecord(contracts?.assess_environment_cta_encounter)
  const structuralDriftBlock = contentBlock(about, "structural_drift_publication_block")
  const foundationalLeadershipBlock = contentBlock(about, "foundational_leadership_block")
  const structuralDriftContract = asRecord(
    structuralDriftBlock?.publication_contract ?? contracts?.structural_drift_publication_contract,
  )
  const foundationalLeadershipContract = asRecord(
    foundationalLeadershipBlock?.foundational_leadership_contact_contract_v1 ??
      contracts?.foundational_leadership_contact_contract_v1,
  )
  const [leadershipHeld, setLeadershipHeld] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)

  const eyebrow =
    publicSafeString(asString(sparseContract?.public_eyebrow)) ??
    publicSafeString(crystalChamberCopy.eyebrow) ??
    "UNDERSTAND THE ENVIRONMENT"
  const title =
    publicSafeString(asString(sparseContract?.public_title)) ??
    crystalChamberCopy.title ??
    "What the Questions Reveal"
  const subtitle =
    publicSafeString(asString(sparseContract?.public_context)) ??
    crystalChamberCopy.subtitle ??
    "Questions before assessment."
  const structuralDriftLabel =
    publicSafeString(asString(structuralDriftBlock?.public_label)) ?? "Structural Drift"
  const structuralDriftContent =
    publicSafeString(asString(structuralDriftBlock?.content)) ??
    "Structural Drift names the operating conditions that amplify AI instability."
  const structuralDriftCta = publicSafeString(asString(structuralDriftBlock?.cta)) ?? "Read Structural Drift"
  const structuralDriftFallback =
    publicSafeString(asString(asRecord(structuralDriftContract?.cta_contract)?.fallback_copy)) ??
    "Structural Drift publication link coming soon."
  const structuralDriftSubtitle =
    publicSafeString(asString(structuralDriftBlock?.deck)) ??
    publicSafeString(asString(structuralDriftContract?.subtitle)) ??
    "AI instability is not only a model problem. It is often an environment problem."
  const structuralDriftAbstract =
    publicSafeString(asString(structuralDriftBlock?.abstract)) ??
    publicSafeString(asString(structuralDriftContract?.abstract)) ??
    structuralDriftContent
  const leadershipLabel =
    publicSafeString(asString(foundationalLeadershipContract?.public_label)) ??
    publicSafeString(asString(foundationalLeadershipBlock?.cta)) ??
    "Request a Foundational Leadership Conversation"
  const leadershipBody =
    publicSafeString(asString(foundationalLeadershipBlock?.content)) ??
    "Foundational Leadership begins as a conversation only."
  const leadershipBoundary =
    publicSafeString(asString(foundationalLeadershipContract?.boundary_note)) ??
    publicSafeString(asString(foundationalLeadershipBlock?.boundary)) ??
    "This request begins a conversation only. It does not create approval, enrollment, implementation, or verified registry status."
  const assessCopy =
    publicSafeString(asString(assessCta?.cta_copy)) ??
    "Assess the environment when the operating conditions are ready to be evaluated."
  const assessButton = publicSafeString(asString(assessCta?.button)) ?? "Assess the Environment"

  return (
    <main
      className="measures-registry-runtime"
      data-surface="crystal_chamber"
      data-public-path="crystal_chamber"
      data-material-family="crystal"
      data-layout-contract="sparse_chamber"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-crystal-chamber" aria-label={title}>
        <div className="registry-crystal-chamber-entry">
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        <div className="registry-crystal-chamber-video">
          {questionsVideoUrl ? (
            <>
              <video
                src={questionsVideoUrl}
                muted={videoMuted}
                playsInline
                preload="metadata"
                aria-label="Questions Explainer"
              />
              <div className="registry-crystal-chamber-video-controls">
                <button type="button" onClick={() => setVideoMuted((m) => !m)}>
                  {videoMuted ? "Audio" : "Mute"}
                </button>
              </div>
            </>
          ) : (
            <p className="registry-media-absence">Questions Explainer video is not seated in the runtime registry.</p>
          )}
        </div>

        <div className="registry-crystal-chamber-sections">
          <article className="registry-crystal-publication-encounter">
            <div className="registry-crystal-publication-copy">
              {registryMarkUrl ? <img className="registry-crystal-publication-seal" src={registryMarkUrl} alt="" /> : null}
              <span>{structuralDriftLabel}</span>
              <h2>{publicSafeString(asString(structuralDriftContract?.title)) ?? "Structural Drift"}</h2>
              <p>{structuralDriftSubtitle}</p>
              <p>{structuralDriftAbstract}</p>
            </div>
            {structuralDriftCoverUrl ? (
              <img className="registry-crystal-publication-cover" src={structuralDriftCoverUrl} alt="" />
            ) : null}
            {structuralDriftAvailable ? (
              <button type="button" onClick={onStructuralDrift}>
                {structuralDriftCta}
              </button>
            ) : (
              <p>{structuralDriftFallback}</p>
            )}
          </article>

          <article className="registry-crystal-chamber-section">
            <span>Foundational Leadership</span>
            <p>{leadershipBody}</p>
            <p>{leadershipBoundary}</p>
            <button type="button" onClick={() => setLeadershipHeld(true)}>
              {leadershipLabel}
            </button>
            {leadershipHeld ? (
              <p role="status">Conversation request route is held for Measures Registry review. No standing has been granted.</p>
            ) : null}
          </article>

          <article className="registry-crystal-chamber-section registry-crystal-chamber-section--primary">
            <span>Assess the Environment</span>
            <p>{assessCopy}</p>
            <button type="button" onClick={onAssessEnvironment}>
              {assessButton}
            </button>
          </article>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
