import type { CSSProperties, FormEvent, ReactNode } from "react"
import { useState } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type { EncounterMediaRow, EncounterSurface, RenderableEncounter, TransitionNode } from "../types/encounterRendererTypes"
import {
  asRecord,
  asRecordArray,
  asString,
  asStringArray,
} from "../../registered_runtime/registeredRuntimeUtils"

// Payload for Encounter Boundary connect capture write.
// Encounter Boundary provides onCaptureConnect. Omitting disables capture persistence.
export type ConnectCapturePayload = {
  fields: Record<string, string>
}

export type CrystalSeatProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onCaptureConnect?: (payload: ConnectCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

// --- Helpers ----------------------------------------------------------------

function mediaUrl(row: EncounterMediaRow | undefined): string | null {
  if (!row) return null
  const meta = asRecord(row.metadata)
  return resolveRuntimeMediaUrl({
    publicUrl: asString(meta?.public_url) ?? asString(meta?.exact_url_seated),
    bucketName: row.storage_bucket,
    storagePath: row.storage_path,
  })
}

function resolveNextSurface(encounter: RenderableEncounter): string | null {
  return asString(encounter.transitionNodes[encounter.surface]?.next_surface)
}

function resolveBranchSurface(
  node: TransitionNode | null | undefined,
  branch: "left" | "right",
): string | null {
  return asString(node?.[branch]?.next_surface ?? node?.next_surface)
}

// --- Entry point ------------------------------------------------------------

// Crystal Seat is not a chamber. It establishes identity and entry.
// No assessment logic. No governance logic. No publication logic.
// No DB access. Dispatches by surface key (seated in DB via surface assignment).
export default function CrystalSeatRenderer(props: CrystalSeatProps) {
  const { surface } = props.encounter

  if (surface === "intro_hook" || surface === "intro") {
    return <IntroHookSeat {...props} />
  }
  if (surface === "path_choice") {
    return <PathChoiceSeat {...props} />
  }
  if (surface === "structure_passage") {
    return <StructurePassageSeat {...props} />
  }
  if (surface === "about_measures_registry") {
    return <AboutMeasuresRegistry {...props} />
  }
  if (surface === "measures_structured_environments") {
    // Held in DB — if release gate ever passes, honest data-model gap
    return (
      <main
        className="measures-registry-runtime"
        data-surface={surface}
        data-material-family="crystal"
        data-release-standing="renderer_gap"
        data-gap-reason="measures_structured_environments_not_in_encounter_model"
        style={props.registryTokenStyle}
      >
        {props.renderHeader({ title: props.encounter.encounterDef?.display_title ?? "Measures Registry" })}
        <section className="registry-held-state" role="status">
          <span>Crystal Seat</span>
          <p>Structured environments surface is not yet seated in the encounter data model.</p>
        </section>
        {props.renderSystemFooter()}
      </main>
    )
  }

  // Unknown crystal seat surface
  return (
    <main
      className="measures-registry-runtime"
      data-surface={surface}
      data-material-family="crystal"
      data-release-standing="renderer_gap"
      style={props.registryTokenStyle}
    >
      {props.renderHeader({ title: props.encounter.encounterDef?.display_title ?? "Measures Registry" })}
      <section className="registry-held-state" role="status">
        <span>Crystal Seat</span>
        <p>Presentation for crystal seat surface <code>{surface}</code> is not yet seated.</p>
      </section>
      {props.renderSystemFooter()}
    </main>
  )
}

// --- intro_hook / intro -----------------------------------------------------

function IntroHookSeat({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: CrystalSeatProps) {
  const [epigraphEntered, setEpigraphEntered] = useState(false)
  const [epigraphMuted, setEpigraphMuted] = useState(true)
  const [epigraphFailed, setEpigraphFailed] = useState(false)
  const [landingHeroReady, setLandingHeroReady] = useState(false)
  const [leftSettled, setLeftSettled] = useState(false)
  const [rightSettled, setRightSettled] = useState(false)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const introCopy = asRecord(meta?.intro_copy)
  const thresholdCopy = asRecord(meta?.threshold_copy)
  const plaques = asRecordArray(thresholdCopy?.plaques ?? meta?.plaques ?? meta?.hero_paths)
  const leftPlaque = plaques.find((p) => asString(p.side) === "left") ?? plaques[0]
  const rightPlaque = plaques.find((p) => asString(p.side) === "right") ?? plaques[1]

  const title = asString(introCopy?.title) ?? encounter.encounterDef?.display_title ?? "Measures Registry"

  const node = encounter.transitionNodes[encounter.surface] ?? null
  const leftSurface = resolveBranchSurface(node, "left")
  const rightSurface = resolveBranchSurface(node, "right")
  const nextSurface = resolveNextSurface(encounter)

  const epigraphVideoUrl = mediaUrl(encounter.mediaByRole.get("intro_hook_video"))
  const leftStillUrl = mediaUrl(encounter.mediaByRole.get("left_hero_fracture"))
  const leftMotionUrl = mediaUrl(encounter.mediaByRole.get("left_hero_fracture_motion"))
  const rightStillUrl = mediaUrl(encounter.mediaByRole.get("right_measured_hero"))
  const rightMotionUrl = mediaUrl(encounter.mediaByRole.get("measured_hero_motion_graphic"))

  function handleEnter() {
    if (epigraphFailed || !epigraphVideoUrl) {
      setLandingHeroReady(true)
      return
    }
    setEpigraphEntered(true)
  }

  function handleSkip() {
    setLandingHeroReady(true)
  }

  function handleChoice(branch: "left" | "right") {
    const target = branch === "left" ? leftSurface : rightSurface
    const fallback = nextSurface
    const dest = target ?? fallback
    if (dest) onNavigate(dest as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="crystal"
      data-layout-contract="intro"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {!landingHeroReady ? (
        <section
          className="registry-intro-video"
          aria-label="Measures Registry epigraph"
          data-entered={epigraphEntered}
          data-failed={epigraphFailed}
        >
          {epigraphEntered && !epigraphFailed && epigraphVideoUrl ? (
            <video
              src={epigraphVideoUrl}
              preload="auto"
              autoPlay
              muted={epigraphMuted}
              playsInline
              onEnded={handleSkip}
              onError={() => setEpigraphFailed(true)}
              aria-label="Measures Registry epigraph"
            />
          ) : null}
          {!epigraphEntered || epigraphFailed || !epigraphVideoUrl ? (
            <button
              type="button"
              className="registry-epigraph-enter"
              aria-label={epigraphFailed ? "Continue" : "Enter"}
              onClick={handleEnter}
            >
              {epigraphFailed || !epigraphVideoUrl ? "Continue" : null}
            </button>
          ) : null}
          {epigraphEntered && !epigraphFailed && epigraphVideoUrl && epigraphMuted ? (
            <div className="registry-epigraph-context">
              {title ? <p>{title}</p> : null}
              {asString(introCopy?.subtitle) ? (
                <span>{asString(introCopy?.subtitle)}</span>
              ) : null}
            </div>
          ) : null}
          {epigraphEntered && !epigraphFailed && epigraphVideoUrl ? (
            <div className="registry-epigraph-controls">
              <button
                type="button"
                className="registry-epigraph-mute"
                aria-label={epigraphMuted ? "Enable sound" : "Mute"}
                onClick={() => setEpigraphMuted((m) => !m)}
              >
                {epigraphMuted ? "Audio" : "Mute"}
              </button>
              <button type="button" className="registry-epigraph-skip" onClick={handleSkip}>
                Continue
              </button>
            </div>
          ) : null}
        </section>
      ) : plaques.length >= 2 ? (
        <section
          className="registry-threshold-hero"
          aria-label={asString(thresholdCopy?.title) ?? "Measures Registry threshold"}
        >
          {/* Left threshold seat */}
          <button
            type="button"
            className="registry-threshold-seat"
            data-side="left"
            onClick={() => handleChoice("left")}
          >
            {leftStillUrl ? (
              <img className="registry-threshold-still" src={leftStillUrl} alt="" aria-hidden="true" />
            ) : null}
            {leftMotionUrl && !leftSettled ? (
              <video
                className="registry-threshold-motion"
                src={leftMotionUrl}
                autoPlay
                muted
                playsInline
                preload="auto"
                aria-label="Fractured environment"
                onEnded={() => setLeftSettled(true)}
                onError={() => setLeftSettled(true)}
              />
            ) : null}
            {asString(leftPlaque?.body) || asString(leftPlaque?.title) ? (
              <span className="registry-threshold-copy">
                {asString(leftPlaque?.body) ? (
                  <span>{asString(leftPlaque.body)}</span>
                ) : null}
                {asString(leftPlaque?.title) ?? asString(leftPlaque?.cta) ?? asString(leftPlaque?.label) ? (
                  <strong>
                    {asString(leftPlaque?.title) ?? asString(leftPlaque?.cta) ?? asString(leftPlaque?.label)}
                  </strong>
                ) : null}
              </span>
            ) : null}
          </button>

          <div className="registry-threshold-divide" aria-hidden="true" />

          {/* Right threshold seat */}
          <button
            type="button"
            className="registry-threshold-seat"
            data-side="right"
            onClick={() => handleChoice("right")}
          >
            {rightStillUrl ? (
              <img className="registry-threshold-still" src={rightStillUrl} alt="" aria-hidden="true" />
            ) : null}
            {rightMotionUrl && !rightSettled ? (
              <video
                className="registry-threshold-motion"
                src={rightMotionUrl}
                autoPlay
                muted
                playsInline
                preload="auto"
                aria-label="Measured environment"
                onEnded={() => setRightSettled(true)}
                onError={() => setRightSettled(true)}
              />
            ) : null}
            {asString(rightPlaque?.body) || asString(rightPlaque?.title) ? (
              <span className="registry-threshold-copy">
                {asString(rightPlaque?.body) ? (
                  <span>{asString(rightPlaque.body)}</span>
                ) : null}
                {asString(rightPlaque?.title) ?? asString(rightPlaque?.cta) ?? asString(rightPlaque?.label) ? (
                  <strong>
                    {asString(rightPlaque?.title) ?? asString(rightPlaque?.cta) ?? asString(rightPlaque?.label)}
                  </strong>
                ) : null}
              </span>
            ) : null}
          </button>
        </section>
      ) : (
        // Media available but no threshold copy seated — show media-only entry with continue
        leftStillUrl || leftMotionUrl ? (
          <section className="registry-threshold-hero" aria-label="Measures Registry threshold">
            <button type="button" className="registry-threshold-seat" data-side="left" onClick={() => handleChoice("left")}>
              {leftStillUrl ? <img className="registry-threshold-still" src={leftStillUrl} alt="" aria-hidden="true" /> : null}
            </button>
            <div className="registry-threshold-divide" aria-hidden="true" />
            <button type="button" className="registry-threshold-seat" data-side="right" onClick={() => handleChoice("right")}>
              {rightStillUrl ? <img className="registry-threshold-still" src={rightStillUrl} alt="" aria-hidden="true" /> : null}
            </button>
          </section>
        ) : (
          <section className="registry-held-state" role="status" data-release-standing="held_missing_registry_content">
            <p>Public threshold content is not seated in the registry.</p>
          </section>
        )
      )}
      {renderSystemFooter()}
    </main>
  )
}

// --- path_choice ------------------------------------------------------------

function PathChoiceSeat({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: CrystalSeatProps) {
  const [leftSettled, setLeftSettled] = useState(false)
  const [rightSettled, setRightSettled] = useState(false)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const rawPlaques =
    asRecordArray(meta?.plaques).length > 0
      ? asRecordArray(meta?.plaques)
      : asRecordArray(meta?.hero_paths)

  const node = encounter.transitionNodes[encounter.surface] ?? null
  const leftSurface = resolveBranchSurface(node, "left")
  const rightSurface = resolveBranchSurface(node, "right")
  const nextSurface = resolveNextSurface(encounter)

  const leftStillUrl = mediaUrl(encounter.mediaByRole.get("left_hero_fracture"))
  const leftMotionUrl = mediaUrl(encounter.mediaByRole.get("left_hero_fracture_motion"))
  const rightStillUrl = mediaUrl(encounter.mediaByRole.get("right_measured_hero"))
  const rightMotionUrl = mediaUrl(encounter.mediaByRole.get("measured_hero_motion_graphic"))

  function handleChoice(index: number, plaque: Record<string, unknown>) {
    const side = asString(plaque.side) ?? (index === 0 ? "left" : "right")
    const target = side === "left" ? leftSurface : rightSurface
    const dest = target ?? nextSurface
    if (dest) onNavigate(dest as EncounterSurface)
  }

  const plaques =
    rawPlaques.length >= 2
      ? rawPlaques
      : [{ side: "left" }, { side: "right" }]

  return (
    <main
      className="measures-registry-runtime"
      data-surface="path_choice"
      data-material-family="crystal"
      data-layout-contract="transition_choice"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader({ title: encounter.encounterDef?.display_title ?? "Measures Registry" })}
      <section className="registry-path-choice" aria-label="Choose a Measures Registry path">
        <div className="registry-path-choice-contrast">
          {plaques.map((plaque, index) => {
            const side = asString(plaque.side) ?? (index === 0 ? "left" : "right")
            const title = asString(plaque.title) ?? asString(plaque.cta) ?? asString(plaque.label)
            const body = asString(plaque.body)
            const heroUrl = side === "left" ? leftStillUrl : rightStillUrl
            const motionUrl = side === "left" ? leftMotionUrl : rightMotionUrl
            const settled = side === "left" ? leftSettled : rightSettled
            const onSettled = side === "left" ? () => setLeftSettled(true) : () => setRightSettled(true)

            return (
              <button
                key={side}
                type="button"
                className="registry-route-plate"
                data-choice={side}
                data-motion-settled={settled ? "true" : undefined}
                onClick={() => handleChoice(index, plaque)}
              >
                {motionUrl && !settled ? (
                  <video
                    className="registry-route-plate-image"
                    src={motionUrl}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    onEnded={onSettled}
                  />
                ) : heroUrl ? (
                  <img className="registry-route-plate-image" src={heroUrl} alt="" aria-hidden="true" />
                ) : null}
                {title ? <span>{title}</span> : null}
                {body ? <p>{body}</p> : null}
                <span className="registry-route-plate-cta" aria-hidden="true">→</span>
              </button>
            )
          })}
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- structure_passage ------------------------------------------------------

function StructurePassageSeat({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: CrystalSeatProps) {
  const [muted, setMuted] = useState(true)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const title =
    asString(meta?.title) ?? encounter.encounterDef?.display_title ?? "Measures Registry"
  const passageVideoUrl = mediaUrl(encounter.mediaByRole.get("structured_environment_passage_video"))
  const next = resolveNextSurface(encounter)

  function handleContinue() {
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="structure_passage"
      data-material-family="crystal"
      data-layout-contract="passage"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <section className="registry-diagnostic-passage" aria-label={title}>
        {passageVideoUrl ? (
          <video
            src={passageVideoUrl}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={handleContinue}
            aria-label={title}
          />
        ) : null}
        <div className="registry-diagnostic-passage-controls" aria-label="Passage controls">
          <button type="button" onClick={handleContinue}>
            Continue
          </button>
          {passageVideoUrl ? (
            <button type="button" onClick={() => setMuted((m) => !m)}>
              {muted ? "Audio" : "Mute"}
            </button>
          ) : null}
        </div>
        <div>
          <h1>{title}</h1>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- about_measures_registry ------------------------------------------------

function AboutMeasuresRegistry({
  encounter,
  registryTokenStyle,
  onCaptureConnect,
  renderHeader,
  renderSystemFooter,
}: CrystalSeatProps) {
  const [connectFields, setConnectFields] = useState<Record<string, string>>({})
  const [connectSubmitting, setConnectSubmitting] = useState(false)
  const [connectSubmitted, setConnectSubmitted] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const approved = asRecord(meta?.approved_content_contract)
  const title =
    asString(approved?.title) ??
    encounter.encounterDef?.display_title ??
    "About Measures Registry"

  if (!approved) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="about_measures_registry"
        data-material-family="crystal"
        data-release-standing="held_missing_registry_content"
        style={registryTokenStyle}
      >
        {renderHeader({ title })}
        <section className="registry-held-state" role="status">
          <span>Crystal Seat</span>
          <p>About Measures Registry content is not seated in the registry.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  const orientationSections = asRecordArray(approved.orientation_sections)
  const bridgeSection = asRecord(approved.undrifted_bridge_section)
  const connectSection = asRecord(approved.connect_section)
  const connectTitle = asString(connectSection?.title) ?? "Connect"
  const connectBody = asString(connectSection?.body)
  const connectSupportingCopy = asStringArray(connectSection?.supporting_copy)
  const connectFieldDefs = asRecordArray(connectSection?.fields)
  const connectCtaLabel = asString(connectSection?.cta_label) ?? "Request Conversation"
  const connectSuccessTitle = asString(connectSection?.success_title) ?? "Received."
  const connectSuccessCopy = asString(connectSection?.success_copy)

  const featuredArticle = asRecord(approved.featured_article)
  const articleUrl =
    asString(featuredArticle?.article_url) ?? asString(featuredArticle?.external_url) ?? null
  const videoUrl = mediaUrl(encounter.mediaByRole.get("about_measures_registry_video"))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (onCaptureConnect) {
      setConnectSubmitting(true)
      setConnectError(null)
      const { error } = await onCaptureConnect({ fields: connectFields })
      setConnectSubmitting(false)
      if (error) { setConnectError(error); return }
    }
    setConnectSubmitted(true)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="about_measures_registry"
      data-material-family="crystal"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader({ title })}

      <section className="registry-about-orientation" aria-label={title}>
        <div className="registry-about-orientation-copy">
          <h2 className="registry-about-orientation-title">{title}</h2>
          {orientationSections.length > 0 ? (
            <div className="registry-about-orientation-blocks">
              {orientationSections.map((block) => {
                const label = asString(block.label)
                const copy = asString(block.copy)
                if (!label || !copy) return null
                return (
                  <div key={label} className="registry-about-orientation-block">
                    <span className="registry-about-orientation-block-label">{label}</span>
                    <p className="registry-about-orientation-block-copy">{copy}</p>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
        {videoUrl ? (
          <div className="registry-about-orientation-video">
            <video src={videoUrl} controls autoPlay muted playsInline preload="auto" aria-label={title} />
          </div>
        ) : null}
      </section>

      {bridgeSection ? (
        <section className="registry-about-bridge" aria-label="unDrifted publication">
          <a
            className="registry-about-bridge-panel"
            href={articleUrl ?? asString(bridgeSection.cta_url) ?? "/undrifted"}
            rel="noreferrer"
          >
            <span className="registry-about-bridge-label">
              {asString(bridgeSection.label) ?? "unDrifted"}
            </span>
            {asString(bridgeSection.subtitle) ? (
              <p className="registry-about-bridge-subtitle">{asString(bridgeSection.subtitle)}</p>
            ) : null}
            {asString(bridgeSection.issue_label) ? (
              <span className="registry-about-bridge-issue">{asString(bridgeSection.issue_label)}</span>
            ) : null}
            {asString(bridgeSection.headline) ? (
              <h2 className="registry-about-bridge-headline">{asString(bridgeSection.headline)}</h2>
            ) : null}
            <span className="registry-about-bridge-cta">
              {asString(bridgeSection.cta_label) ?? "Read Issue →"}
            </span>
          </a>
        </section>
      ) : null}

      {connectSection ? (
        <section className="registry-about-connect" aria-label={connectTitle}>
          <div className="registry-about-connect-content">
            <div className="registry-about-connect-copy">
              <h2 className="registry-about-connect-title">{connectTitle}</h2>
              {connectBody ? <p className="registry-about-connect-body">{connectBody}</p> : null}
              {connectSupportingCopy.map((line) => (
                <p key={line} className="registry-about-connect-supporting">{line}</p>
              ))}
            </div>
            {connectSubmitted ? (
              <div className="registry-about-connect-success" role="status">
                <h3>{connectSuccessTitle}</h3>
                {connectSuccessCopy ? <p>{connectSuccessCopy}</p> : null}
              </div>
            ) : (
              <form className="registry-about-connect-form" onSubmit={handleSubmit} noValidate>
                {connectFieldDefs.length > 0 ? (
                  connectFieldDefs.map((field) => {
                    const fieldKey = asString(field.field_key)
                    const label = asString(field.label)
                    const type = asString(field.type) ?? "text"
                    const required = field.required === true
                    if (!fieldKey || !label) return null
                    return (
                      <div key={fieldKey} className="registry-about-connect-field">
                        <label htmlFor={`connect-${fieldKey}`}>
                          {label}{required ? "" : " (optional)"}
                        </label>
                        {type === "textarea" ? (
                          <textarea
                            id={`connect-${fieldKey}`}
                            name={fieldKey}
                            value={connectFields[fieldKey] ?? ""}
                            required={required}
                            rows={4}
                            onChange={(e) => setConnectFields((f) => ({ ...f, [fieldKey]: e.target.value }))}
                          />
                        ) : (
                          <input
                            id={`connect-${fieldKey}`}
                            type={type}
                            name={fieldKey}
                            value={connectFields[fieldKey] ?? ""}
                            required={required}
                            onChange={(e) => setConnectFields((f) => ({ ...f, [fieldKey]: e.target.value }))}
                          />
                        )}
                      </div>
                    )
                  })
                ) : (
                  <>
                    <div className="registry-about-connect-field">
                      <label htmlFor="connect-name">Name</label>
                      <input id="connect-name" type="text" value={connectFields.name ?? ""} required onChange={(e) => setConnectFields((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="registry-about-connect-field">
                      <label htmlFor="connect-organization">Organization</label>
                      <input id="connect-organization" type="text" value={connectFields.organization ?? ""} required onChange={(e) => setConnectFields((f) => ({ ...f, organization: e.target.value }))} />
                    </div>
                    <div className="registry-about-connect-field">
                      <label htmlFor="connect-email">Email</label>
                      <input id="connect-email" type="email" value={connectFields.email ?? ""} required onChange={(e) => setConnectFields((f) => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="registry-about-connect-field">
                      <label htmlFor="connect-message">Message (optional)</label>
                      <textarea id="connect-message" value={connectFields.message ?? ""} rows={4} onChange={(e) => setConnectFields((f) => ({ ...f, message: e.target.value }))} />
                    </div>
                  </>
                )}
                {connectError ? (
                  <p className="registry-about-connect-error" role="alert">{connectError}</p>
                ) : null}
                <button
                  type="submit"
                  className="registry-about-connect-submit"
                  disabled={connectSubmitting}
                >
                  {connectSubmitting ? "Submitting…" : connectCtaLabel}
                </button>
              </form>
            )}
          </div>
        </section>
      ) : null}

      {renderSystemFooter()}
    </main>
  )
}
