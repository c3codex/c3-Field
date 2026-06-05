import type { CSSProperties, ReactNode } from "react"
import { asRecord, asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  structurePassageCopy: SectionCopy
  talkingHeadVideoUrl: string | null
  passageMuted: boolean
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onContinueToCrystal: () => void
  onToggleMuted: () => void
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

export default function RegisteredPublicUnderstand({
  registryTokenStyle,
  structurePassageCopy,
  talkingHeadVideoUrl,
  passageMuted,
  renderHeader,
  renderSystemFooter,
  onContinueToCrystal,
  onToggleMuted,
}: Props) {
  const contracts = structurePassageCopy.crystalContentContracts
  const understandPassage = asRecord(contracts?.understand_environment_passage)
  const structurePassageContract = asRecord(contracts?.structure_passage_contract_v1)
  const publicCopyContract = asRecord(understandPassage?.crystal_passage_public_copy_contract)
  const videoControlContract = asRecord(understandPassage?.video_control_contract)

  const eyebrow =
    publicSafeString(asString(structurePassageContract?.public_eyebrow)) ??
    publicSafeString(structurePassageCopy.eyebrow) ??
    "OUR APPROACH"
  const title =
    publicSafeString(asString(structurePassageContract?.public_title)) ??
    publicSafeString(asString(publicCopyContract?.title)) ??
    asString(understandPassage?.public_label) ??
    structurePassageCopy.title ??
    "Understand the Environment"
  const positionParagraph =
    publicSafeString(asString(structurePassageContract?.position_paragraph)) ??
    publicSafeString(asString(understandPassage?.position_paragraph)) ??
    publicSafeString(asString(publicCopyContract?.context_body)) ??
    publicSafeString(structurePassageCopy.informationalParagraph) ??
    structurePassageCopy.subtitle ??
    "Measures Registry provides integrity governance for AI-accelerated systems. AI drift is not only a model problem. It is amplified by ungoverned authority, unclear roles, exposed operating surfaces, missing review pathways, and implementation conditions that have not been structured. Measures Registry helps institutions identify the conditions shaping AI behavior, recognize drift-amplifying factors, and move toward governed action where appropriate."
  const continueLabel =
    publicSafeString(asString(videoControlContract?.continue_label)) ??
    publicSafeString(asString(videoControlContract?.cta_label)) ??
    "Continue"
  const skipLabel = publicSafeString(asString(videoControlContract?.skip_label)) ?? "Skip"

  return (
    <main
      className="measures-registry-runtime"
      data-surface="structure_passage"
      data-public-path="understand_environment"
      data-material-family="crystal"
      data-layout-contract="passage"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-public-understand registry-structure-passage" aria-label={title}>
        <div className="registry-structure-passage-layout">
          <div className="registry-structure-passage-copy">
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            {positionParagraph ? <p>{positionParagraph}</p> : null}
          </div>
          {talkingHeadVideoUrl ? (
            <div className="registry-public-understand-video">
              <video
                src={talkingHeadVideoUrl}
                autoPlay
                muted={passageMuted}
                playsInline
                preload="auto"
                onEnded={onContinueToCrystal}
                aria-label="Understand the Environment passage"
              />
              <div className="registry-public-understand-video-controls">
                <button type="button" onClick={onToggleMuted}>
                  {passageMuted ? "Audio" : "Mute"}
                </button>
                <button type="button" onClick={onContinueToCrystal}>
                  {skipLabel}
                </button>
                <button type="button" onClick={onContinueToCrystal}>
                  {continueLabel}
                </button>
              </div>
            </div>
          ) : (
            <div className="registry-public-understand-video">
              <p className="registry-media-absence">Understand passage media is not seated in the runtime registry.</p>
              <button type="button" onClick={onContinueToCrystal}>
                {continueLabel}
              </button>
            </div>
          )}
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
