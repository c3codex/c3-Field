import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type { EncounterMediaRow, EncounterSurface, RenderableEncounter, TransitionNode } from "../types/encounterRendererTypes"
import {
  asRecord,
  asRecordArray,
  asString,
  asStringArray,
} from "../shared/encounterRendererUtils"
import { encounterStyleDataAttributes } from "../styles/encounterStyleProfile"

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

function surfaceBgStyle(url: string | null): CSSProperties {
  if (!url) return {}
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }
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

// --- Persistent unDrifted mark -----------------------------------------------

// Renders a small publication-return mark on selected Crystal surfaces.
// Copy and route authority come from surface assignment metadata (persistent_mark).
// Do not add to assessment, contact capture, Marble, or payment surfaces.
function UnDriftedMark({ encounter }: { encounter: RenderableEncounter }) {
  const mark = asRecord(encounter.surfaceAssignmentMetadata?.persistent_mark)
  const label = asString(mark?.label)
  const issueLabel = asString(mark?.issue_label)
  const routePath = asString(mark?.route_path)
  if (!label || !routePath) return null
  return (
    <a className="undrifted-persistent-mark" href={routePath} aria-label={`${label} — return to publication`}>
      <span className="undrifted-persistent-mark-label">{label}</span>
      {issueLabel ? <span className="undrifted-persistent-mark-issue">{issueLabel}</span> : null}
    </a>
  )
}

// --- Entry point ------------------------------------------------------------

// Crystal Seat is not a chamber. It establishes identity and entry.
// No assessment logic. No governance logic. No publication logic.
// No DB access. Dispatches by surface key (seated in DB via surface assignment).
export default function CrystalSeatRenderer(props: CrystalSeatProps) {
  const { surface } = props.encounter

  if (surface === "crystal_seat_intro") {
    return <CrystalIntroSeat {...props} />
  }
  if (surface === "crystal_seat_threshold") {
    return <IntroHookSeat {...props} />
  }
  if (surface === "crystal_seat_orientation") {
    return <CrystalOrientationSeat {...props} />
  }
  if (surface === "crystal_seat_encounter") {
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

// --- crystal_seat_orientation ------------------------------------------------
// Crystal branded surface. Governed site copy + Codexstone seal + 9:16 measures_position video.
// Intro and threshold remain media-fill (IntroHookSeat). Orientation begins governed frame.

function CrystalOrientationSeat({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: CrystalSeatProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoAudioEnabled, setVideoAudioEnabled] = useState(false)

  const assignmentMeta = encounter.surfaceAssignmentMetadata ?? {}
  const governedParagraphs = asStringArray(assignmentMeta.governed_site_paragraphs)
  const codexstoneCaptions = asStringArray(assignmentMeta.codexstone_captions)
  const nextSurface = resolveNextSurface(encounter)

  const videoUrl = mediaUrl(encounter.mediaByRole.get("measures_position"))
  const sealUrl = mediaUrl(encounter.mediaByRole.get("official_codexstone_seal"))
  const bgUrl = mediaUrl(encounter.mediaByRole.get("crystal_orientation_surface"))

  function handleContinue() {
    if (nextSurface) onNavigate(nextSurface as EncounterSurface)
  }

  function handleVideoAudio() {
    const video = videoRef.current
    if (!video) return
    if (!videoAudioEnabled) {
      video.muted = false
      video.volume = 1
      void video.play().catch(() => {
        video.muted = true
        setVideoAudioEnabled(false)
      })
      setVideoAudioEnabled(true)
    } else {
      video.muted = true
      setVideoAudioEnabled(false)
    }
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="crystal_seat_orientation"
      data-material-family="crystal"
      data-layout-contract="crystal_orientation"
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      style={{ ...registryTokenStyle, ...surfaceBgStyle(bgUrl) }}
    >
      {renderHeader({ title: "Measures Registry" })}
      <section className="registry-crystal-orientation" aria-label="Crystal Orientation">
        <div className="registry-crystal-orientation-media-zone">
          {videoUrl ? (
            <div className="registry-crystal-orientation-media">
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                aria-label="Measures Position"
              />
            </div>
          ) : null}
          {videoUrl ? (
            <button
              type="button"
              className="registry-crystal-orientation-audio"
              onClick={handleVideoAudio}
            >
              {videoAudioEnabled ? "Video Audio On" : "Enable Video Audio"}
            </button>
          ) : null}
        </div>
        <div className="registry-crystal-orientation-content">
          {governedParagraphs.length > 0 ? (
            <div className="registry-crystal-orientation-copy">
              {governedParagraphs.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          ) : null}
          {sealUrl || codexstoneCaptions.length > 0 ? (
            <div className="registry-crystal-codexstone">
              {sealUrl ? (
                <img
                  src={sealUrl}
                  alt="Codexstone — Official Seal"
                  className="registry-crystal-codexstone-seal"
                  loading="eager"
                />
              ) : null}
              {codexstoneCaptions.map((caption, i) => (
                <p key={i} className="registry-crystal-codexstone-caption">{caption}</p>
              ))}
            </div>
          ) : null}
          <div className="registry-crystal-orientation-actions">
            <button
              type="button"
              className="registry-crystal-orientation-cta"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </section>
      <UnDriftedMark encounter={encounter} />
      {renderSystemFooter()}
    </main>
  )
}

// --- crystal_seat_intro -----------------------------------------------------
// Full-viewport video. Auto-play, NOT muted. Auto-advance on end.
// Headline "AI Isn't Broken... Systems Are" left-seated. No mute controls.

function CrystalIntroSeat({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderSystemFooter,
}: CrystalSeatProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [introAudioEnabled, setIntroAudioEnabled] = useState(false)
  const [videoActivated, setVideoActivated] = useState(false)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const introCopy = asRecord(meta?.intro_copy)
  const headline = asString(introCopy?.headline) ?? "AI Isn't Broken... Systems Are"
  const nextSurface = resolveNextSurface(encounter)

  const videoUrl = mediaUrl(encounter.mediaByRole.get("intro_hook_video"))
  const posterUrl = mediaUrl(encounter.mediaByRole.get("hero_poster"))

  // OAR2 "Replace Initial Hero Video Load With Poster-First Media Delivery" —
  // poster paints immediately; the 14MB video is not requested until the page
  // has settled (load event + idle), so it never competes with initial LCP.
  useEffect(() => {
    if (!videoUrl) return
    let idleId: number | undefined
    function scheduleActivate() {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => setVideoActivated(true), { timeout: 1500 })
      } else {
        idleId = window.setTimeout(() => setVideoActivated(true), 200)
      }
    }
    if (document.readyState === "complete") {
      scheduleActivate()
    } else {
      window.addEventListener("load", scheduleActivate, { once: true })
    }
    return () => {
      window.removeEventListener("load", scheduleActivate)
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId)
        else window.clearTimeout(idleId)
      }
    }
  }, [videoUrl])

  function handleAdvance() {
    onNavigate("measures_registry_home")
  }

  function handleIntroAudio(e: MouseEvent) {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    if (!introAudioEnabled) {
      video.muted = false
      video.volume = 1
      void video.play().catch(() => {
        video.muted = true
        setIntroAudioEnabled(false)
      })
      setIntroAudioEnabled(true)
    } else {
      video.muted = true
      setIntroAudioEnabled(false)
    }
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="crystal_seat_intro"
      data-material-family="crystal"
      data-layout-contract="crystal_intro"
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      style={registryTokenStyle}
    >
      <section className="registry-crystal-intro" aria-label="Introduction" onClick={handleAdvance}>
        {videoActivated && videoUrl ? (
          <video
            ref={videoRef}
            className="registry-crystal-intro-video"
            src={videoUrl}
            poster={posterUrl ?? undefined}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleAdvance}
            onError={handleAdvance}
            aria-label={headline}
          />
        ) : posterUrl ? (
          <img
            className="registry-crystal-intro-video"
            src={posterUrl}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
          />
        ) : null}
        <div className="registry-crystal-intro-headline">
          <h1>{headline}</h1>
        </div>
        {videoActivated && videoUrl ? (
          <button
            type="button"
            className="registry-crystal-intro-audio"
            onClick={handleIntroAudio}
          >
            {introAudioEnabled ? "Audio On" : "Enable Audio"}
          </button>
        ) : null}
        <div className="c3-visually-hidden">
          <nav aria-label="Measures Registry navigation">
            <a href="/" onClick={(e) => e.stopPropagation()}>Home</a>
            <a
              href="/about"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onNavigate("crystal_seat_encounter") }}
            >
              About
            </a>
            <a
              href="/ai-operations-assessment"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onNavigate("obsidian_chamber_encounter_surface") }}
            >
              Assess the Environment
            </a>
            <a
              href="/undrifted"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onNavigate("lapis_chamber_encounter") }}
            >
              Understand the Environment
            </a>
          </nav>
          <h2>AI isn&rsquo;t broken. Systems are.</h2>
          <p>
            Measures Registry is an institutional governance and education platform. AI systems do not
            fail in isolation — they fail inside institutions that have not defined authority, review
            pathways, or operating boundaries. Measures Registry treats AI outcomes as a product of the
            environment an AI system operates within, not solely a property of the model itself.
          </p>
          <h2>Institutional Accountability for AI Deployment</h2>
          <p>
            AI outcomes are shaped by the systems AI operates within. When responsibility, oversight, and
            escalation paths are undefined, deployments drift away from their original intent quietly,
            before anyone notices. Measures Registry supports institutions in designing governable
            environments — systems where AI use remains accountable to the people and processes
            responsible for it.
          </p>
          <h2>What is Structural Drift?</h2>
          <p>
            Structural drift is the measurable gap between how an AI system is intended to behave and how
            it actually behaves once deployed inside a real institution. Drift is not a defect in the
            model — it is a symptom of missing structure: undefined roles, absent review pathways, and
            ungoverned runtime surfaces. Structural drift can be observed, named, and addressed.
          </p>
          <h2>What is a Governable Environment?</h2>
          <p>
            A governable environment is an institutional system designed so that AI use remains
            reviewable, accountable, and less prone to drift, through defined authority and oversight —
            not through changes to the AI model itself. Governable environments can be designed and
            maintained; they are not an accident of good intentions.
          </p>
          <h2>Assess the Environment</h2>
          <p>
            The public{" "}
            <a
              href="/ai-operations-assessment"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onNavigate("obsidian_chamber_encounter_surface") }}
            >
              operations assessment
            </a>{" "}
            is a baseline awareness tool — a first read on where structural drift may already be present
            in an institution&rsquo;s AI deployment. It does not constitute certification, enrollment, or
            verified registry standing.
          </p>
          <h2>The Measures Alignment Protocol</h2>
          <p>
            The Measures Alignment Protocol (MAP) is a later, governed pathway for institutions that have
            completed the public assessment and are ready to move toward structured alignment. MAP
            standing and scope are established directly with Measures Registry — they are not
            self-service claims and are not detailed on this page.
          </p>
          <h2>Understand the Environment</h2>
          <p>
            <a
              href="/undrifted"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onNavigate("lapis_chamber_encounter") }}
            >
              unDrifted
            </a>{" "}
            is the public record of Measures Registry&rsquo;s structural drift findings and governed
            environment design work, publishing across institutional AI governance, system integrity, and
            operational outcomes.
          </p>
          <h2>Foundational Leadership</h2>
          <p>
            Measures Registry is founded by Stephanie Joanne Gaffney, an artist and Measures Registry
            Instructor, and founder of c3 Community Partners DAO, LLC, the governance framework under
            which Measures Registry operates.
          </p>
        </div>
      </section>
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
  const [epigraphEntered, setEpigraphEntered] = useState(true)
  const [epigraphMuted, setEpigraphMuted] = useState(false)
  const [epigraphFailed, setEpigraphFailed] = useState(false)
  // crystal_seat_threshold: video runs on crystal_seat_intro; threshold shows cards directly
  const [landingHeroReady, setLandingHeroReady] = useState(encounter.surface === "crystal_seat_threshold")
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

  const isOrientationSurface = encounter.surface === "crystal_seat_orientation"
  const orientationVideoUrl = mediaUrl(encounter.mediaByRole.get("measures_position"))
  const epigraphVideoUrl = isOrientationSurface && orientationVideoUrl
    ? orientationVideoUrl
    : mediaUrl(encounter.mediaByRole.get("intro_hook_video"))

  useEffect(() => {
    if (!epigraphVideoUrl && !epigraphFailed) setLandingHeroReady(true)
  }, [epigraphVideoUrl, epigraphFailed])

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
    if (isOrientationSurface && nextSurface) {
      onNavigate(nextSurface as EncounterSurface)
      return
    }
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
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
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
          {epigraphFailed ? (
            <button
              type="button"
              className="registry-epigraph-enter"
              aria-label="Continue"
              onClick={handleEnter}
            >
              Continue
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
              <img className="registry-threshold-still" src={leftStillUrl} alt="" aria-hidden="true" loading="eager" />
            ) : null}
            {leftMotionUrl && !leftSettled ? (
              <video
                className="registry-threshold-motion"
                src={leftMotionUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Fractured environment"
                onError={() => setLeftSettled(true)}
              />
            ) : null}
            {asString(leftPlaque?.body) || asString(leftPlaque?.title) ? (
              <span className="registry-threshold-copy">
                {asString(leftPlaque?.body) ? (
                  <span>{asString(leftPlaque.body)}</span>
                ) : null}
                {asString(leftPlaque?.context) ? (
                  <span className="registry-threshold-context">{asString(leftPlaque.context)}</span>
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
              <img className="registry-threshold-still" src={rightStillUrl} alt="" aria-hidden="true" loading="eager" />
            ) : null}
            {rightMotionUrl && !rightSettled ? (
              <video
                className="registry-threshold-motion"
                src={rightMotionUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Measured environment"
                onError={() => setRightSettled(true)}
              />
            ) : null}
            {asString(rightPlaque?.body) || asString(rightPlaque?.title) ? (
              <span className="registry-threshold-copy">
                {asString(rightPlaque?.body) ? (
                  <span>{asString(rightPlaque.body)}</span>
                ) : null}
                {asString(rightPlaque?.context) ? (
                  <span className="registry-threshold-context">{asString(rightPlaque.context)}</span>
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
              {leftStillUrl ? <img className="registry-threshold-still" src={leftStillUrl} alt="" aria-hidden="true" loading="eager" /> : null}
            </button>
            <div className="registry-threshold-divide" aria-hidden="true" />
            <button type="button" className="registry-threshold-seat" data-side="right" onClick={() => handleChoice("right")}>
              {rightStillUrl ? <img className="registry-threshold-still" src={rightStillUrl} alt="" aria-hidden="true" loading="eager" /> : null}
            </button>
          </section>
        ) : (
          <section className="registry-held-state" role="status" data-release-standing="held_missing_registry_content">
            <p>Public threshold content is not seated in the registry.</p>
          </section>
        )
      )}
      {encounter.surface === "crystal_seat_threshold" ? <UnDriftedMark encounter={encounter} /> : null}
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
      data-surface={encounter.surface}
      data-material-family="crystal"
      data-layout-contract="transition_choice"
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
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
                  <img className="registry-route-plate-image" src={heroUrl} alt="" aria-hidden="true" loading="eager" />
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

// --- about_measures_registry ------------------------------------------------

const FAQ_ITEMS = [
  {
    q: "What is Computational Systems Governance?",
    a: "Computational Systems Governance is the design, measurement, and maintenance of the institutional environments within which computation and automated agents operate. It focuses on establishing clear system conditions—such as authority, permissions, human review roles, and operational boundaries—to ensure all computational participation remains governable and accountable."
  },
  {
    q: "How is it different from AI governance?",
    a: "Traditional AI governance often focuses on model-level controls, algorithm behavior, and data inputs. Computational Systems Governance does not replace AI governance; rather, it establishes the fundamental institutional and system conditions that model-level AI governance depends upon to be effective."
  },
  {
    q: "What does Measures Registry measure?",
    a: "Measures Registry measures the governability of system environments. It records and evaluates the clarity of delegation, authority boundaries, logging, escalation paths, and review practices through which institutions maintain control over their automated operations."
  },
  {
    q: "What does standing mean?",
    a: "Standing represents an institution's verified state of alignment with governed system conditions. It is recorded in the Registry based on objective evidence rather than self-service claims, providing an authoritative ledger of an environment's governability."
  },
  {
    q: "What does the Assessment evaluate?",
    a: "The public assessment is a baseline awareness tool that evaluates where structural drift—the gap between intended and actual system behavior—may be quietly occurring within an institution's deployment processes and oversight structures."
  },
  {
    q: "Does Measures Registry certify systems?",
    a: "No. The Presentation Seal and Registry records represent documented standing based on verified environmental evidence. They are public-presentation proofs of system record and relational standing, not formal regulatory certifications."
  },
  {
    q: "What happens after assessment?",
    a: "Completion of the assessment provides a detailed evaluation report. For institutions ready to establish structured alignment, it opens the pathway toward the Measures Alignment Protocol (MAP) to design and record governable system boundaries."
  },
  {
    q: "How does Measures Registry relate to the c3 Field?",
    a: "Measures Registry is a Registered Branch of the c3 Field, operating under the decentralized governance and legal framework of c3 Community Partners DAO, LLC."
  },
  {
    q: "What is unDrifted?",
    a: "unDrifted is a distinct, public publication identity that records and presents Measures Registry's ongoing research, field findings, and case studies regarding structural drift and the design of governable environments."
  }
]

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
  const title = "Questions — Measures Registry"

  const connectSection = asRecord(approved?.connect_section)
  const connectTitle = asString(connectSection?.title) ?? "Connect"
  const connectBody = asString(connectSection?.body) ?? "Request conversation regarding registered standing, MAP paths, or institutional research."
  const connectSupportingCopy = asStringArray(connectSection?.supporting_copy)
  const connectFieldDefs = asRecordArray(connectSection?.fields)
  const connectCtaLabel = asString(connectSection?.cta_label) ?? "Request Conversation"
  const connectSuccessTitle = asString(connectSection?.success_title) ?? "Received."
  const connectSuccessCopy = asString(connectSection?.success_copy) ?? "Your request has been recorded."

  const bgUrl = mediaUrl(encounter.mediaByRole.get("crystal_longform_surface"))

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
      data-surface="crystal_seat_encounter"
      data-material-family="crystal"
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={{ ...registryTokenStyle, ...surfaceBgStyle(bgUrl) }}
    >
      {renderHeader({ title: "Measures Registry" })}

      <section className="registry-about-orientation" aria-label={title}>
        <div className="registry-about-orientation-copy" style={{ maxWidth: "100%", width: "100%" }}>
          <h2 className="registry-about-orientation-title" style={{ marginBottom: "2rem" }}>{title}</h2>
          <div className="registry-about-orientation-blocks" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="registry-about-orientation-block" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
                <span className="registry-about-orientation-block-label" style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "normal", textTransform: "none", color: "inherit" }}>
                  {item.q}
                </span>
                <p className="registry-about-orientation-block-copy" style={{ fontSize: "1rem", lineHeight: "1.6", color: "rgba(31, 50, 96, 0.72)", margin: 0 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <UnDriftedMark encounter={encounter} />
      {renderSystemFooter()}
    </main>
  )
}
