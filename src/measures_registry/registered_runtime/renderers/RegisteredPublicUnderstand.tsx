import { useState } from "react"
import type { CSSProperties, FormEvent, ReactNode } from "react"
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

function publicSafeArray(values: string[]) {
  return values.filter((value) => publicSafeString(value) != null)
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
  const structuralDriftCta = publicSafeString(asString(structuralDriftBlock?.cta)) ?? "Read Structural Drift"
  const structuralDriftFallback =
    publicSafeString(asString(asRecord(structuralDriftContract?.cta_contract)?.fallback_copy)) ??
    "Structural Drift publication link coming soon."
  const publicCopyContract = asRecord(understandPassage?.crystal_passage_public_copy_contract)
  const videoControlContract = asRecord(understandPassage?.video_control_contract)
  const foundationalLeadershipContract = asRecord(
    foundationalLeadershipBlock?.foundational_leadership_contact_contract_v1 ??
      contracts?.foundational_leadership_contact_contract_v1,
  )
  const [leadershipSubmitted, setLeadershipSubmitted] = useState(false)

  const title =
    asString(publicCopyContract?.title) ??
    asString(understandPassage?.public_label) ??
    structurePassageCopy.title ??
    "Understand the Environment"
  const subtitle =
    asString(publicCopyContract?.context_body) ??
    structurePassageCopy.subtitle ??
    "AI systems do not operate in isolation. They interact with workflows, roles, approvals, data, outputs, and decisions. This passage explains why the operating environment matters before an institution evaluates, maps, or restructures AI-facing systems."
  const aboutTitle = publicSafeString(asString(about?.public_label)) ?? "About Measures Registry"
  const aboutContent = publicSafeArray(contentArray(about?.content))
  const mapTitle = publicSafeString(asString(mapEducation?.public_label)) ?? "MAP the Environment"
  const mapDefinition = publicSafeString(asString(mapEducation?.public_definition))
  const mapBoundary = publicSafeString(asString(mapEducation?.boundary))
  const conversionTitle = publicSafeString(asString(conversionEducation?.public_label)) ?? "Governed Continuity"
  const conversionContent = publicSafeString(asString(conversionEducation?.content))
  const conversionBoundary = publicSafeString(asString(conversionEducation?.boundary))
  const assessCopy =
    publicSafeString(asString(assessCta?.cta_copy)) ??
    "Begin by understanding the environment. Then assess what must be governed."
  const assessButton = publicSafeString(asString(assessCta?.button)) ?? "Assess the Environment"
  const beginUnderstandingLabel =
    asString(videoControlContract?.cta_label) ??
    asString(publicCopyContract?.cta_label) ??
    "Begin Understanding"
  const leadershipLabel =
    asString(foundationalLeadershipContract?.public_label) ??
    publicSafeString(asString(foundationalLeadershipBlock?.cta)) ??
    "Request a Foundational Leadership Conversation"
  const leadershipHelper =
    asString(foundationalLeadershipContract?.helper_copy) ??
    "Request a Foundational Leadership conversation with Measures Registry."
  const leadershipBoundary =
    asString(foundationalLeadershipContract?.boundary_note) ??
    publicSafeString(asString(foundationalLeadershipBlock?.boundary)) ??
    "This request begins a conversation only. It does not create approval, enrollment, implementation, or verified registry status."
  const structuralDriftLabel =
    publicSafeString(asString(structuralDriftBlock?.public_label)) ?? "Structural Drift"
  const structuralDriftContent = publicSafeString(asString(structuralDriftBlock?.content))
  const foundationalLeadershipLabel =
    publicSafeString(asString(foundationalLeadershipBlock?.public_label)) ?? "Foundational Leadership"
  const foundationalLeadershipContent = publicSafeString(asString(foundationalLeadershipBlock?.content))

  function beginUnderstanding() {
    document.getElementById("measures-understand-next")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function submitLeadershipRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLeadershipSubmitted(true)
  }

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
            <span>Public orientation</span>
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
              <div className="registry-public-understand-video-controls">
                <button type="button" onClick={onToggleMuted}>
                  {passageMuted ? "Audio" : "Mute"}
                </button>
                <button type="button" onClick={beginUnderstanding}>
                  {beginUnderstandingLabel}
                </button>
              </div>
            </div>
          ) : (
            <div className="registry-public-understand-video">
              <p className="registry-media-absence">Understand passage media is not seated in the runtime registry.</p>
              <button type="button" onClick={beginUnderstanding}>
                {beginUnderstandingLabel}
              </button>
            </div>
          )}
        </div>

        <div className="registry-public-understand-grid" id="measures-understand-next">
          <article className="registry-public-understand-panel registry-public-understand-panel--wide">
            <span>{aboutTitle}</span>
            {aboutContent.length > 0 ? (
              aboutContent.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>About Measures Registry public copy is not seated in the runtime registry.</p>
            )}
          </article>

          <article className="registry-public-understand-panel">
            <span>{structuralDriftLabel}</span>
            {structuralDriftContent ? <p>{structuralDriftContent}</p> : null}
            {structuralDriftAvailable ? (
              <button type="button" onClick={onStructuralDrift}>
                {structuralDriftCta}
              </button>
            ) : (
              <p>{structuralDriftFallback}</p>
            )}
          </article>

          <article className="registry-public-understand-panel">
            <span>{foundationalLeadershipLabel}</span>
            {foundationalLeadershipContent ? <p>{foundationalLeadershipContent}</p> : null}
            <p>{leadershipBoundary}</p>
            <form className="registry-public-understand-contact" onSubmit={submitLeadershipRequest}>
              <p>{leadershipHelper}</p>
              <label>
                <span>Institution / Organization Name</span>
                <input name="institution_name" type="text" required />
              </label>
              <label>
                <span>Contact Name</span>
                <input name="contact_name" type="text" required />
              </label>
              <label>
                <span>Email</span>
                <input name="contact_email" type="email" required />
              </label>
              <label>
                <span>Your Role / Title</span>
                <input name="role_title" type="text" required />
              </label>
              <label>
                <span>Website</span>
                <input name="website" type="url" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" required />
              </label>
              <label className="registry-public-understand-check">
                <input name="foundational_leadership_contact_consent" type="checkbox" required />
                <span>I agree to be contacted about a Foundational Leadership conversation.</span>
              </label>
              <label className="registry-public-understand-check">
                <input name="foundational_leadership_boundary_acknowledgment" type="checkbox" required />
                <span>I understand this request begins a conversation only. It does not create approval, enrollment, implementation, or verified registry status.</span>
              </label>
              <label className="registry-public-understand-check">
                <input name="measures_registry_updates_opt_in" type="checkbox" />
                <span>I would like to receive future Measures Registry updates.</span>
              </label>
              <button type="submit">{leadershipLabel}</button>
              {leadershipSubmitted ? (
                <p role="status">Conversation request held for Measures Registry review. No standing has been granted.</p>
              ) : null}
            </form>
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
