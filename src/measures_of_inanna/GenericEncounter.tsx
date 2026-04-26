import { useEffect, useMemo, useRef, useState } from "react"
import type {
  ChamberplateContract,
  EncounterResolution,
  PhaseMapContract,
  PhaseMapNode,
  PlaqueContract,
  ResolvedAction,
} from "./types"
import ConnectCaptureForm from "./ConnectCaptureForm"
import EncounterStageMedia from "./EncounterStageMedia"

type Props = {
  resolution: EncounterResolution
  onNavigate: (
    nextRegistryKey: string,
    options?: { targetAfterPassage?: string | null },
  ) => void
  activeRegistryKey?: string
  viewedRegistryKeys?: string[]
}

type PlaybackView = {
  videoMode: string | null
  audioMode: string | null
  settleToStill: boolean
  settleMs: number
  stillFirst: boolean
  motionAfterAction: boolean
  actionDelayMs: number
  autoAdvanceOnVideoEnd: boolean
  advanceDelayMs: number
}

function isVideo(item: EncounterResolution["media"][number]) {
  return item.mediaType === "video"
}

function isImage(item: EncounterResolution["media"][number]) {
  return item.mediaType === "image"
}

function isAudio(item: EncounterResolution["media"][number]) {
  return item.mediaType === "audio"
}

function isActionAvailable(action: ResolvedAction) {
  return action.blocked !== true && Boolean(action.targetRegistryKey)
}

function isAutoAction(action: ResolvedAction) {
  return (
    action.kind === "auto_advance" ||
    action.kind === "auto" ||
    action.id.startsWith("auto_") ||
    action.metadata?.auto_advance === true
  )
}

function actionTargetAfterPassage(action: ResolvedAction) {
  const metadataTarget = action.metadata?.target_after_passage
  const metadataCamelTarget = action.metadata?.targetAfterPassage

  return (
    action.targetAfterPassage ??
    (typeof metadataTarget === "string" ? metadataTarget : null) ??
    (typeof metadataCamelTarget === "string" ? metadataCamelTarget : null)
  )
}

function normalizePlayback(resolution: EncounterResolution): PlaybackView {
  const playback = resolution.playback ?? resolution.metadata.playback
  const presentationPlayback =
    resolution.metadata.presentation?.playback &&
    typeof resolution.metadata.presentation.playback === "object"
      ? (resolution.metadata.presentation.playback as Record<string, unknown>)
      : null
  const presentationChamberplate =
    resolution.metadata.presentation?.chamberplate &&
    typeof resolution.metadata.presentation.chamberplate === "object"
      ? (resolution.metadata.presentation.chamberplate as Record<string, unknown>)
      : null
  const renderer = resolution.renderer ?? resolution.metadata.renderer
  const stillFirst =
    typeof presentationChamberplate?.stillFirst === "boolean"
      ? presentationChamberplate.stillFirst
      : typeof presentationChamberplate?.still_first === "boolean"
        ? presentationChamberplate.still_first
        : false

  return {
    videoMode:
      playback?.videoMode ??
      playback?.video_mode ??
      (typeof presentationPlayback?.video_mode === "string"
        ? presentationPlayback.video_mode
        : null) ??
      playback?.mode ??
      renderer?.choice_surface_mode ??
      null,
    audioMode:
      playback?.audioMode ??
      playback?.audio_mode ??
      (typeof presentationPlayback?.audio_mode === "string"
        ? presentationPlayback.audio_mode
        : null) ??
      null,
    settleToStill:
      playback?.settleToStill ??
      playback?.settle_to_still ??
      (typeof presentationPlayback?.settle_to_still === "boolean"
        ? presentationPlayback.settle_to_still
        : false),
    settleMs:
      playback?.settle_ms ??
      (typeof presentationPlayback?.settle_ms === "number"
        ? presentationPlayback.settle_ms
        : 0),
    stillFirst,
    motionAfterAction:
      typeof presentationChamberplate?.motionAfterAction === "boolean"
        ? presentationChamberplate.motionAfterAction
        : typeof presentationChamberplate?.motion_after_action === "boolean"
          ? presentationChamberplate.motion_after_action
          : false,
    actionDelayMs:
      typeof presentationChamberplate?.actionDelayMs === "number"
        ? presentationChamberplate.actionDelayMs
        : typeof presentationChamberplate?.action_delay_ms === "number"
          ? presentationChamberplate.action_delay_ms
          : 0,
    autoAdvanceOnVideoEnd:
      playback?.autoAdvanceOnVideoEnd ??
      playback?.auto_advance_on_video_end ??
      (typeof presentationPlayback?.auto_advance_on_video_end === "boolean"
        ? presentationPlayback.auto_advance_on_video_end
        : null) ??
      false,
    advanceDelayMs:
      playback?.advanceDelayMs ??
      playback?.advance_delay_ms ??
      (typeof presentationPlayback?.advance_delay_ms === "number"
        ? presentationPlayback.advance_delay_ms
        : 0),
  }
}

function resolveNodeKey(node: PhaseMapNode) {
  return node.registryKey ?? node.registry_key ?? null
}

function resolveNodeLabel(node: PhaseMapNode) {
  return node.label ?? node.displayTitle ?? node.display_title ?? null
}

function resolveNodeState(node: PhaseMapNode, state?: PhaseMapNodeState | null) {
  return (
    node.node_state ??
    state?.access_state ??
    state?.release_state ??
    null
  )
}

function isChamberplateSurface(resolution: EncounterResolution) {
  return resolution.surfaceType === "chamberplate"
}

function mediaRank(item: EncounterResolution["media"][number], chamberplate?: ChamberplateContract | null) {
  const order = chamberplate?.render_order
  if (!Array.isArray(order) || order.length === 0) return item.renderOrder

  const index = order.indexOf(item.mediaType)
  return index === -1 ? order.length + item.renderOrder / 1000 : index + item.renderOrder / 1000
}

function chamberplateAllowsText(chamberplate: ChamberplateContract | null | undefined, body: string) {
  if (!chamberplate) return true
  return chamberplate.text_bodies?.includes(body) === true
}

function chamberplateAllowsCapture(chamberplate: ChamberplateContract | null | undefined) {
  if (!chamberplate) return true
  return chamberplate.capture_enabled === true && chamberplate.interaction_mode === "capture"
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function resolveTextDelayMs(
  chamberplate: ChamberplateContract | null | undefined,
  presentation: Record<string, unknown> | null,
  playback: PlaybackView,
) {
  const presentationChamberplate =
    presentation?.chamberplate && typeof presentation.chamberplate === "object"
      ? (presentation.chamberplate as Record<string, unknown>)
      : null

  return (
    numberValue(chamberplate?.text_delay_ms) ??
    numberValue(chamberplate?.plaque_delay_ms) ??
    numberValue(presentationChamberplate?.textDelayMs) ??
    numberValue(presentationChamberplate?.plaqueDelayMs) ??
    playback.settleMs ??
    0
  )
}

function normalizeTextBody(value: unknown): { title?: string; body: string[] } | null {
  if (typeof value === "string" && value.trim()) {
    return { body: [value] }
  }

 if (Array.isArray(value)) {
  const body = value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0
  )

  return body.length ? { body } : null
}

  if (!value || typeof value !== "object") return null

  const record = value as Record<string, unknown>
  const title = typeof record.title === "string" ? record.title : undefined
  const bodyValue = record.body
  const body =
    typeof bodyValue === "string"
      ? [bodyValue]
      : Array.isArray(bodyValue)
        ? bodyValue.filter((item): item is string => {
          return typeof item === "string" && item.trim().length > 0
        })
        : []

  if (!title && body.length === 0) return null
  return { title, body }
}

function ChamberplateTextBodies({
  chamberplate,
  presentation,
}: {
  chamberplate?: ChamberplateContract | null
  presentation?: Record<string, unknown> | null
}) {
  const bodies = chamberplate?.text_bodies ?? []
  const renderedBodies = bodies
    .filter((bodyName) => bodyName !== "plaque")
    .flatMap((bodyName) => {
      const body = normalizeTextBody(presentation?.[bodyName])
      return body ? [{ bodyName, ...body }] : []
    })

  if (!renderedBodies.length) return null

  return (
    <section className="chamberplate-text-bodies">
      {renderedBodies.map((body) => (
        <article key={body.bodyName} className="chamberplate-text-body" data-body={body.bodyName}>
          {body.title ? <h2>{body.title}</h2> : null}
          {body.body.map((paragraph, index) => (
            <p key={`${body.bodyName}-${index}`}>{paragraph}</p>
          ))}
        </article>
      ))}
    </section>
  )
}

function ChamberplateAbsence({
  media,
  chamberplate,
  presentation,
}: {
  media: EncounterResolution["media"]
  chamberplate?: ChamberplateContract | null
  presentation?: Record<string, unknown> | null
}) {
  if (!chamberplate) return null

  const missingMedia = media.length === 0
  const expectedTextBodies = (chamberplate.text_bodies ?? []).filter(
    (bodyName) => bodyName !== "plaque",
  )
  const missingText =
    expectedTextBodies.length > 0 &&
    expectedTextBodies.every((bodyName) => normalizeTextBody(presentation?.[bodyName]) === null)

  if (!missingMedia && !missingText) return null

  return (
    <section className="chamberplate-absence">
      {missingMedia ? <p>media contract unresolved</p> : null}
      {missingText ? <p>text body contract unresolved</p> : null}
    </section>
  )
}

function Plaque({ plaque }: { plaque: PlaqueContract }) {
  const [isCollapsed, setIsCollapsed] = useState(
    plaque.collapse?.default_collapsed === true,
  )
  const body = Array.isArray(plaque.body) ? plaque.body.filter(Boolean) : []
  const secondaryBody = Array.isArray(plaque.secondary_body)
    ? plaque.secondary_body.filter(Boolean)
    : []
  const canCollapse = plaque.collapse?.enabled === true
  const collapseLabel = plaque.collapse?.collapse_label ?? "Collapse text"
  const expandLabel = plaque.collapse?.expand_label ?? "Show text"

  if (body.length === 0 && secondaryBody.length === 0) return null

  return (
    <div className="plaque" data-collapsed={canCollapse && isCollapsed}>
      {plaque.title ? <h2>{plaque.title}</h2> : null}
      {canCollapse ? (
        <button
          type="button"
          className="plaque-collapse"
          onClick={() => setIsCollapsed((value) => !value)}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? expandLabel : collapseLabel}
        </button>
      ) : null}
      {!canCollapse || !isCollapsed ? (
        <div className="plaque-body">
          {body.map((paragraph, index) => (
            <p key={`plaque-body-${index}`}>{paragraph}</p>
          ))}

          {plaque.secondary_title ? <h2>{plaque.secondary_title}</h2> : null}
          {secondaryBody.map((paragraph, index) => (
            <p key={`plaque-secondary-${index}`}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ActionRail({
  actions,
  onAction,
  className = "",
}: {
  actions: ResolvedAction[]
  onAction: (action: ResolvedAction) => void
  className?: string
}) {
  const visibleActions = actions.filter((action) => action.label.trim())

  if (!visibleActions.length) return null

  return (
    <div className={`actions ${className}`}>
      {visibleActions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={`encounter-action ${action.emphasis ?? ""}`}
          onClick={() => onAction(action)}
          disabled={action.blocked === true || !action.targetRegistryKey}
          data-kind={action.kind}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

function PhaseMap({
  phaseMap,
  nodes,
  onNavigate,
  activeRegistryKey,
  viewedRegistryKeys = [],
}: {
  phaseMap?: PhaseMapContract
  nodes: PhaseMapNode[]
  onNavigate: (registryKey: string) => void
  activeRegistryKey?: string | null
  viewedRegistryKeys?: string[]
}) {
  const mapNodes: PhaseMapNode[] = phaseMap?.nodes ?? nodes ?? []
  const edges = phaseMap?.edges ?? []
  const legend = phaseMap?.legend ?? []
  const labels = phaseMap?.labels ?? {}
  const explanation = phaseMap?.explanation ?? null
  const layoutMode = phaseMap?.layout?.mode ?? null
  const className = phaseMap?.layout?.class_name ?? "phase-map-node-field"
  const rings = phaseMap?.layout?.rings ?? []
  const positions = phaseMap?.positions ?? {}
  const routing = phaseMap?.routing ?? {}
  const nodeRouting = routing.nodes ?? {}
  const centerNode = phaseMap?.center_node ?? null
  const phaseMapActiveRegistryKey = phaseMap?.active_registry_key ?? activeRegistryKey ?? null
  const phaseMapViewedKeys = new Set([
    ...(phaseMap?.viewed_registry_keys ?? []),
    ...viewedRegistryKeys,
  ])
  const nodeStates =
    phaseMap?.node_states && !("source" in phaseMap.node_states)
      ? phaseMap.node_states
      : {}
  const nodeStateOverrides = phaseMap?.node_state_overrides ?? {}

  function nodeKey(node: PhaseMapNode) {
    return node.registry_key ?? node.registryKey ?? null
  }

  function nodeLabel(node: PhaseMapNode) {
    return node.label ?? node.display_title ?? node.displayTitle ?? nodeKey(node)
  }

  function nodePosition(node: PhaseMapNode) {
    const key = nodeKey(node)
    if (!key) return null
    return positions[key] ?? node.position ?? null
  }


  function findNode(key: string) {
    return mapNodes.find((node) => nodeKey(node) === key)
  }

  function centerNodeKey() {
    return centerNode?.registry_key ?? centerNode?.registryKey ?? null
  }

  function centerNodeLabel() {
    return phaseMap?.cadence?.center_label ?? centerNode?.label ?? null
  }

  function isNodeOpenForCadence(key: string) {
    const node = findNode(key)
    const state = nodeStates[key]
    const stateOverride = nodeStateOverrides[key]
    const route = nodeRouting[key]
    const targetRegistryKey =
      route?.target_registry_key ??
      route?.targetRegistryKey ??
      (routing.on_open_node === "navigate" ? key : null)

    if (!targetRegistryKey || stateOverride === "sealed") return false
    if (node?.is_interactive === false || node?.isInteractive === false) return false
    if (state?.is_interactive === false) return false
    if (node?.access_state === "gated" || state?.access_state === "gated") return false
    if (node?.release_state === "held" || state?.release_state === "held") return false

    return true
  }

  function centerNodeTarget() {
    const cadenceSequence = phaseMap?.cadence?.sequence ?? []
    const nextCadenceKey = cadenceSequence.find(
      (key) => !phaseMapViewedKeys.has(key) && isNodeOpenForCadence(key),
    )

    return (
      nextCadenceKey ??
      phaseMap?.cadence?.complete_target_registry_key ??
      phaseMap?.cadence?.completeTargetRegistryKey ??
      centerNodeKey()
    )
  }

  function nodeTitle(node: PhaseMapNode, label: string | null, standing: string | null) {
    return [
      label,
      node.family,
      node.material,
      node.sequence_order ? `#${node.sequence_order}` : null,
      standing,
      node.phase_label,
    ]
      .filter(Boolean)
      .join(" / ")
  }

  if (mapNodes.length === 0) {
    return <div className="media-empty">phase map unavailable</div>
  }

  const hasSeatedPositions = mapNodes.some((node) => nodePosition(node))
  const nextRelease = phaseMap?.next_release ?? null
  const currentCadenceTarget = centerNodeTarget() ?? phaseMapActiveRegistryKey

  if (!hasSeatedPositions) {
    return <div className="media-empty">phase map positions unavailable</div>
  }

  return (
    <section className="phase-map-contract" data-layout-mode={layoutMode}>
      {labels.title && <h1 className="phase-map-title">{labels.title}</h1>}

      <div className={className}>
        {centerNode && centerNodeKey() ? (
          <button
            type="button"
            className="phase-map-center-node"
            data-current={currentCadenceTarget === centerNodeKey()}
            data-viewed={phaseMapViewedKeys.has(centerNodeKey() ?? "")}
            title={centerNodeLabel() ?? undefined}
            aria-label={centerNodeLabel() ?? undefined}
            onClick={() => {
              const key = centerNodeTarget()
              if (key) onNavigate(key)
            }}
          >
            <span className="phase-map-node-mark" />
            {centerNodeLabel() ? (
              <span className="phase-map-node-label">{centerNodeLabel()}</span>
            ) : null}
          </button>
        ) : null}

        {rings.map((ring) =>
          typeof ring.radius === "number" ? (
            <span
              key={`${ring.family ?? ring.label}-${ring.radius}`}
              className="phase-map-ring"
              data-family={ring.family}
              style={{
                width: `${ring.radius * 2}%`,
                height: `${ring.radius * 2}%`,
              }}
            >
              {ring.label ? <span>{ring.label}</span> : null}
            </span>
          ) : null,
        )}

        <svg className="phase-map-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map((edge, index) => {
            const fromNode = findNode(edge.from)
            const toNode = findNode(edge.to)
            if (!fromNode || !toNode) return null

            const from = nodePosition(fromNode)
            const to = nodePosition(toNode)
            if (!from || !to) return null

            return (
              <line
                key={`${edge.from}-${edge.to}-${index}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                data-kind={edge.kind}
                className="phase-map-edge"
              />
            )
          })}
        </svg>

        {mapNodes.map((node) => {
          const registryKey = nodeKey(node)
          const label = nodeLabel(node)
          const position = nodePosition(node)
          const state = registryKey ? nodeStates[registryKey] : null
          const stateOverride = registryKey ? nodeStateOverrides[registryKey] : null
          const nodeStanding = resolveNodeState(node, state)
          const isCurrent = registryKey === currentCadenceTarget
          const isViewed = registryKey ? phaseMapViewedKeys.has(registryKey) : false
          const route = registryKey ? nodeRouting[registryKey] : null
          const targetRegistryKey =
            route?.target_registry_key ??
            route?.targetRegistryKey ??
            (routing.on_open_node === "navigate" ? registryKey : null)
          const disabled =
            node.is_interactive === false ||
            node.isInteractive === false ||
            state?.is_interactive === false ||
            stateOverride === "sealed" ||
            !isViewed ||
            !targetRegistryKey
          const isSealed =
            stateOverride === "sealed" ||
            node.release_state === "held" ||
            state?.release_state === "held" ||
            node.access_state === "gated" ||
            state?.access_state === "gated"

          if (!registryKey || !position) return null

          return (
            <button
              key={registryKey}
              type="button"
              className="phase-map-node"
              data-family={node.family}
              data-material={node.material}
              data-release-state={node.release_state ?? state?.release_state}
              data-access-state={node.access_state ?? state?.access_state}
              data-node-state={stateOverride}
              data-standing={nodeStanding}
              data-current={isCurrent}
              data-viewed={isViewed}
              data-accessible={!disabled}
              data-sealed={isSealed}
              title={nodeTitle(node, label, nodeStanding)}
              disabled={disabled}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={() => {
                if (!disabled && targetRegistryKey) onNavigate(targetRegistryKey)
              }}
            >
              <span className="phase-map-node-mark" />
              <span className="phase-map-node-label">{label}</span>
              {(node.family || node.material) && (
                <span className="phase-map-node-meta">
                  {[node.family, node.material, node.sequence_order]
                    .filter(Boolean)
                    .join(" / ")}
                </span>
              )}
              {(state?.label || node.phase_label || nodeStanding) && (
                <span className="phase-map-node-state">
                  {state?.label ?? node.phase_label ?? nodeStanding}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {nextRelease && (nextRelease.label || nextRelease.title || nextRelease.body) ? (
        <aside className="phase-map-release-counter">
          {nextRelease.label ? <span>{nextRelease.label}</span> : null}
          {nextRelease.title ? <strong>{nextRelease.title}</strong> : null}
          {nextRelease.body ? <p>{nextRelease.body}</p> : null}
        </aside>
      ) : null}

      {legend.length > 0 && (
        <aside className="phase-map-legend">
          {legend.map((item) => (
            <div key={`${item.material ?? item.family}-${item.label}`} className="phase-map-legend-item">
              <span data-material={item.material} data-family={item.family} />
              <span>{item.label}</span>
            </div>
          ))}
        </aside>
      )}

      {explanation && (
        <section className="phase-map-explanation">
          {explanation.title && <h2>{explanation.title}</h2>}
          {Array.isArray(explanation.body) &&
            explanation.body.map((line: string, index: number) => <p key={index}>{line}</p>)}
        </section>
      )}
    </section>
  )
}

export default function GenericEncounter({
  resolution,
  onNavigate,
  activeRegistryKey,
  viewedRegistryKeys,
}: Props) {
  const { renderer, capture, actions, media, chamberplate } = resolution
  const playback = useMemo(() => normalizePlayback(resolution), [resolution])
  const autoAdvanceTimeoutRef = useRef<number | null>(null)
  const [showStill, setShowStill] = useState(false)
  const [videoVisible, setVideoVisible] = useState(true)
  const [textReady, setTextReady] = useState(false)
  const [videoAdvanceTarget, setVideoAdvanceTarget] = useState<string | null>(null)

  const orderedMedia = useMemo(
    () =>
      [...media].sort((left, right) => {
        const rankDelta = mediaRank(left, chamberplate) - mediaRank(right, chamberplate)
        return rankDelta || left.renderOrder - right.renderOrder
      }),
    [chamberplate, media],
  )

  const primaryVideo = useMemo(
    () => orderedMedia.find(isVideo) ?? null,
    [orderedMedia],
  )
  const primaryStill = useMemo(
    () => orderedMedia.find(isImage) ?? null,
    [orderedMedia],
  )
  const tonalAudio = useMemo(
    () => orderedMedia.find(isAudio) ?? null,
    [orderedMedia],
  )
  const extraMedia = useMemo(
    () =>
      orderedMedia.filter(
        (item) =>
          item !== primaryVideo && item !== primaryStill && item !== tonalAudio,
      ),
    [orderedMedia, primaryStill, primaryVideo, tonalAudio],
  )

  const plaque =
    resolution.metadata.plaque ??
    resolution.metadata.presentation?.plaque ??
    null

  const refractionMode =
    typeof resolution.metadata.presentation?.refraction_mode === "string"
      ? resolution.metadata.presentation.refraction_mode
      : null
  const presentation = resolution.metadata.presentation ?? null
  const textDelayMs = resolveTextDelayMs(chamberplate, presentation, playback)

  const showActionRail =
    renderer?.showActionRail ?? renderer?.show_action_rail ?? true
  const mediaStyle = {
    "--encounter-media-max-width": renderer?.media_max_width ?? "100vw",
    "--encounter-media-max-height": renderer?.media_max_height ?? "100svh",
  } as never
  const collapseTextForMotion =
    playback.stillFirst &&
    playback.motionAfterAction &&
    videoVisible &&
    !showStill

  const isIntroEncounter =
    resolution.encounterKey === "inanna_encounter" ||
    resolution.encounterKey === "temple_inanna_view" ||
    resolution.encounterKey === "epigraph_view" ||
    resolution.registryKey === "epigraph" ||
    resolution.registryKey === "inanna_encounter"

  const isPhaseMapEncounter =
    renderer?.layout === "phase_map" ||
    resolution.surfaceType === "phase_map" ||
    resolution.registryKey === "phase_map"

  const isCrystalTempleHome =
    resolution.registryKey === "crystal_temple_home" ||
    resolution.encounterKey === "crystal_temple_home_view"

  const isTempleAntechamber =
    resolution.registryKey === "temple_antechamber" ||
    resolution.encounterKey === "temple_antechamber_view"

  const isTempleHarrumukPassage =
    resolution.registryKey === "temple_harrumuk_passage" ||
    resolution.encounterKey === "temple_harrumuk_passage_view"

  const primaryImageAction = useMemo(
    () =>
      actions.find(
        (action) =>
          isActionAvailable(action) &&
          !isAutoAction(action) &&
          (!chamberplate?.route_targets ||
            chamberplate.route_targets.includes(action.targetRegistryKey ?? "")) &&
          (action.metadata?.interaction_mode === "single_surface" ||
            action.metadata?.interaction_target === "temple_image"),
      ) ??
      null,
    [actions, chamberplate?.route_targets],
  )

  const hasAutoAdvanceAction = useMemo(
    () =>
      Boolean(resolution.autoAdvanceTo) ||
      actions.some(
        (action) => isActionAvailable(action) && isAutoAction(action),
      ),
    [actions, resolution.autoAdvanceTo],
  )

  const choiceActions = useMemo(
    () =>
      actions.filter(
        (action) =>
          isActionAvailable(action) &&
          !isAutoAction(action) &&
          (!chamberplate?.route_targets ||
            chamberplate.route_targets.includes(action.targetRegistryKey ?? "")),
      ),
    [actions, chamberplate?.route_targets],
  )

  const railActions = useMemo(
    () =>
      actions.filter(
        (action) =>
          isActionAvailable(action) &&
          !isAutoAction(action) &&
          (!chamberplate?.route_targets ||
            chamberplate.route_targets.includes(action.targetRegistryKey ?? "")),
      ),
    [actions, chamberplate?.route_targets],
  )

  useEffect(() => {
    if (autoAdvanceTimeoutRef.current) {
      window.clearTimeout(autoAdvanceTimeoutRef.current)
      autoAdvanceTimeoutRef.current = null
    }

    const startsWithMotionThenStill =
      Boolean(primaryVideo) &&
      !playback.stillFirst &&
      (playback.videoMode === "motion_then_still" ||
        playback.videoMode === "muted_autoplay")

    const startsWithStill =
      !startsWithMotionThenStill &&
      (playback.stillFirst ||
        playback.videoMode === "still_first" ||
        playback.videoMode === "still_choice" ||
        (!primaryVideo && Boolean(primaryStill)))

    setShowStill(startsWithStill)
    setVideoVisible(!startsWithStill)
    setVideoAdvanceTarget(null)

    return () => {
      if (autoAdvanceTimeoutRef.current) {
        window.clearTimeout(autoAdvanceTimeoutRef.current)
      }
    }
  }, [playback.stillFirst, playback.videoMode, primaryStill, primaryVideo, resolution.registryKey])

  useEffect(() => {
    setTextReady(false)

    const hasTextSurface =
      Boolean(plaque && chamberplateAllowsText(chamberplate, "plaque")) ||
      Boolean(chamberplate?.text_bodies?.some((bodyName) => bodyName !== "plaque"))
    const shouldDelayText = media.length > 0 && hasTextSurface && textDelayMs > 0

    if (!shouldDelayText) {
      setTextReady(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setTextReady(true)
    }, textDelayMs)

    return () => window.clearTimeout(timeout)
  }, [chamberplate, media.length, plaque, resolution.registryKey, textDelayMs])

  useEffect(() => {
    if (primaryVideo || !hasAutoAdvanceAction) return
    if (!playback.autoAdvanceOnVideoEnd && !isIntroEncounter) return

    triggerAutoAdvance()

    return () => {
      if (autoAdvanceTimeoutRef.current) {
        window.clearTimeout(autoAdvanceTimeoutRef.current)
        autoAdvanceTimeoutRef.current = null
      }
    }
  }, [
    hasAutoAdvanceAction,
    isIntroEncounter,
    playback.autoAdvanceOnVideoEnd,
    primaryVideo,
    resolution.registryKey,
  ])

  function handleAction(action: ResolvedAction) {
    if (!isActionAvailable(action) || !action.targetRegistryKey) return
    const targetAfterPassage = actionTargetAfterPassage(action)

    if (playback.stillFirst && playback.motionAfterAction && showStill && primaryVideo) {
      setVideoAdvanceTarget(action.targetRegistryKey)
      setVideoVisible(true)
      setShowStill(false)
      return
    }

    onNavigate(action.targetRegistryKey, { targetAfterPassage })
  }

  function triggerAutoAdvance(overrideTarget?: string | null) {
    const targetRegistryKey =
      overrideTarget ??
      resolution.autoAdvanceTo ??
      actions.find((action) => isActionAvailable(action) && isAutoAction(action))
        ?.targetRegistryKey ??
      (playback.autoAdvanceOnVideoEnd || isIntroEncounter
        ? actions.find(isActionAvailable)?.targetRegistryKey
        : null)

    if (!targetRegistryKey) return

    autoAdvanceTimeoutRef.current = window.setTimeout(() => {
      onNavigate(targetRegistryKey)
    }, playback.advanceDelayMs)
  }

  function handlePrimaryVideoEnded() {
    if (videoAdvanceTarget) {
      triggerAutoAdvance(videoAdvanceTarget)
      setVideoAdvanceTarget(null)
      return
    }

    const shouldSettleToStill =
      Boolean(primaryStill) &&
      (playback.settleToStill ||
        playback.videoMode === "settle_to_still" ||
        playback.videoMode === "motion_then_still" ||
        playback.videoMode === "muted_autoplay")

    if (shouldSettleToStill) {
      setShowStill(true)
      window.setTimeout(() => {
        setVideoVisible(false)
      }, playback.settleMs || 220)
    }

    triggerAutoAdvance()
  }

  if (!renderer) return <main className="encounter-error">renderer contract missing</main>

  if (isChamberplateSurface(resolution) && !chamberplate) {
    return <main className="encounter-error">chamberplate contract missing</main>
  }

  if (isPhaseMapEncounter) {
    return (
      <>
        <PhaseMap
          phaseMap={resolution.phase_map}
          nodes={resolution.phase_map?.nodes ?? []}
          onNavigate={onNavigate}
          activeRegistryKey={activeRegistryKey}
          viewedRegistryKeys={viewedRegistryKeys}
        />

        {showActionRail ? (
          <ActionRail
            actions={railActions}
            onAction={handleAction}
            className="phase-map-actions"
          />
        ) : null}
      </>
    )
  }

  const showMutedAutoplayVideo =
    playback.videoMode === "muted_autoplay" ||
    playback.videoMode === "motion_then_still" ||
    playback.videoMode === "settle_to_still" ||
    playback.autoAdvanceOnVideoEnd ||
    hasAutoAdvanceAction ||
    isIntroEncounter

  return (
    <main
      className={`encounter ${renderer.layout ?? ""}`}
      data-registry-key={resolution.registryKey}
      data-surface-type={resolution.surfaceType}
      data-media-fit={renderer.media_fit ?? undefined}
      style={mediaStyle}
    >
      <div className="encounter-media-layer">
        <EncounterStageMedia
          primaryVideo={primaryVideo}
          primaryStill={primaryStill}
          tonalAudio={tonalAudio}
          showMutedAutoplayVideo={showMutedAutoplayVideo}
          playback={playback}
          isIntroEncounter={isIntroEncounter}
          isCrystalTempleHome={isCrystalTempleHome}
          isTempleAntechamber={isTempleAntechamber}
          isTempleHarrumukPassage={isTempleHarrumukPassage}
          showStill={showStill}
          videoVisible={videoVisible}
          onPrimaryVideoEnded={handlePrimaryVideoEnded}
          primaryImageAction={
            playback.stillFirst && playback.motionAfterAction
              ? null
              : primaryImageAction
          }
          onAction={handleAction}
        />

        {extraMedia.map((item) => (
          <EncounterStageMedia
            key={`${item.bucketName}/${item.storagePath}/${item.renderOrder}`}
            extraItem={item}
          />
        ))}
      </div>

      {(isCrystalTempleHome || isTempleAntechamber) &&
      refractionMode === "crystal_soft" ? (
        <>
          <div className="crystal-refraction radial" />
          <div className="crystal-refraction linear" />
        </>
      ) : null}

      {textReady &&
      !collapseTextForMotion &&
      plaque &&
      chamberplateAllowsText(chamberplate, "plaque") ? (
        <Plaque plaque={plaque} />
      ) : null}

      {textReady && !collapseTextForMotion && chamberplate ? (
        <ChamberplateTextBodies chamberplate={chamberplate} presentation={presentation} />
      ) : null}

      {chamberplate ? (
        <ChamberplateAbsence
          media={media}
          chamberplate={chamberplate}
          presentation={presentation}
        />
      ) : null}

      {capture?.enabled && chamberplateAllowsCapture(chamberplate) ? (
        <ConnectCaptureForm
          capture={{
            ...capture,
            trigger_label:
              capture.trigger_label ??
              (typeof presentation?.guest_registry === "object" &&
              presentation.guest_registry !== null
                ? (presentation.guest_registry as Record<string, unknown>).trigger_label as string | undefined
                : undefined),
          }}
          sourceRegistryKey={resolution.registryKey}
        />
      ) : null}

      {isCrystalTempleHome && showStill && choiceActions.length > 0 ? (
        <ActionRail
          actions={choiceActions}
          onAction={handleAction}
          className="choice-actions"
        />
      ) : null}

      {!isIntroEncounter &&
      !isCrystalTempleHome &&
      !isTempleHarrumukPassage &&
      showActionRail ? (
        <ActionRail actions={railActions} onAction={handleAction} />
      ) : null}
    </main>
  )
}
