import type { CSSProperties } from "react"
import {
  coherenceOpticsGrammarRegistry,
  compositionPresetGrammar,
  relationGrammar,
  type OpticsRelationKey,
} from "./coherenceOpticsGrammarRegistry"
import type { OarProcessInstance, OarTransitionLogEntry, SpineValidationCheck } from "./operationsSpine"

type LapisRelationMappingSurfaceProps = {
  processInstances: OarProcessInstance[]
  transitionLog: OarTransitionLogEntry[]
  validationChecks: SpineValidationCheck[]
  persistenceStanding: "registry_backed" | "held_pending_persistence"
}

type RelationNodeKind = "process" | "queue" | "transition" | "correction" | "closure" | "blocked" | "evidence"
type RelationVectorKind = OpticsRelationKey

type RelationNode = {
  key: string
  label: string
  kind: RelationNodeKind
  standing: string
  detail: string
  fractured: boolean
}

type RelationVector = {
  key: string
  kind: RelationVectorKind
  from: string
  to: string
  evidence: string
  interrupted: boolean
}

type FieldPoint = {
  x: number
  y: number
}

type FieldNode = RelationNode & {
  point: FieldPoint
}

type FieldVector = RelationVector & {
  start: FieldPoint
  end: FieldPoint
}

const fieldRayIndexes = [
  0, 1, 2, 3, 4, 5, 6, 7,
  8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31,
]

const fieldLensPreset = compositionPresetGrammar("field_lens")
const materialCallouts = coherenceOpticsGrammarRegistry.materials
  .filter((material) => material.key !== "crystal")
  .sort((a, b) => a.revealPriority - b.revealPriority)
const crystalGrammar = coherenceOpticsGrammarRegistry.materials.find((material) => material.key === "crystal")
const marbleGrammar = coherenceOpticsGrammarRegistry.materials.find((material) => material.key === "marble")

function readable(value: string | null) {
  return value ? value.replaceAll("_", " ") : "not recorded"
}

function processNodeKind(instance: OarProcessInstance): RelationNodeKind {
  if (instance.execution_standing === "blocked" || instance.seeded_reference_standing === "unseeded_blocked") {
    return "blocked"
  }

  if (instance.validation_standing === "correction_required" || instance.correction_oar2_path) {
    return "correction"
  }

  if (instance.execution_standing === "completed" && instance.actual_oar1_path && instance.evidence_path) {
    return "closure"
  }

  if (instance.execution_standing === "queued" || instance.execution_standing === "executing") {
    return "queue"
  }

  return instance.evidence_path ? "evidence" : "process"
}

function isFracturedProcess(instance: OarProcessInstance) {
  return (
    instance.execution_standing === "blocked" ||
    instance.validation_standing === "correction_required" ||
    instance.seeded_reference_standing === "unseeded_blocked" ||
    (instance.execution_standing === "completed" && (!instance.actual_oar1_path || !instance.evidence_path))
  )
}

function transitionVectorKind(entry: OarTransitionLogEntry): RelationVectorKind {
  if (entry.transition_type === "correction") return "corrective"
  if (entry.transition_type === "held") return "blocked-return"
  if (entry.transition_type === "validation") return "convergent"
  if (entry.transition_type === "deployment") return "downstream"
  if (entry.transition_type === "seeded_reference") return "dependency"
  return entry.from_status === "not_queued" ? "upstream" : "downstream"
}

function deriveRelationNodes(processInstances: OarProcessInstance[], transitionLog: OarTransitionLogEntry[]): RelationNode[] {
  const transitionNodes = transitionLog.map((entry) => ({
    key: `transition:${entry.transition_event_key}`,
    label: readable(entry.transition_type),
    kind: "transition" as const,
    standing: `${readable(entry.from_status)} -> ${readable(entry.to_status)}`,
    detail: entry.evidence_reference ?? "missing evidence reference",
    fractured: !entry.evidence_reference,
  }))

  const processNodes = processInstances.map((instance) => ({
    key: `process:${instance.process_instance_key}`,
    label: instance.process_instance_key,
    kind: processNodeKind(instance),
    standing: readable(instance.execution_standing),
    detail: instance.validation_finding ?? instance.execution_result,
    fractured: isFracturedProcess(instance),
  }))

  return [...processNodes, ...transitionNodes]
}

function deriveRelationVectors(processInstances: OarProcessInstance[], transitionLog: OarTransitionLogEntry[]): RelationVector[] {
  const byProcess = new Map(processInstances.map((instance) => [instance.process_instance_key, instance]))

  const transitionVectors = transitionLog.map((entry) => {
    const process = byProcess.get(entry.process_instance_key)

    return {
      key: `vector:${entry.transition_event_key}`,
      kind: transitionVectorKind(entry),
      from: readable(entry.from_status),
      to: process?.process_instance_key ?? entry.process_instance_key,
      evidence: entry.evidence_reference ?? "missing evidence reference",
      interrupted: !entry.evidence_reference || !process,
    }
  })

  const evidenceVectors = processInstances.flatMap((instance) => {
    const vectors: RelationVector[] = []

    if (instance.source_oar2_path) {
      vectors.push({
        key: `dependency:${instance.process_instance_key}`,
        kind: "dependency",
        from: "source OAR2",
        to: instance.process_instance_key,
        evidence: instance.source_oar2_path,
        interrupted: instance.source_oar2_standing !== "confirmed",
      })
    }

    if (instance.actual_oar1_path || instance.expected_oar1_path) {
      vectors.push({
        key: `closure:${instance.process_instance_key}`,
        kind: instance.actual_oar1_path ? "convergent" : "divergent",
        from: instance.process_instance_key,
        to: instance.actual_oar1_path ? "actual OAR1" : "expected OAR1 unresolved",
        evidence: instance.actual_oar1_path ?? instance.expected_oar1_path,
        interrupted: !instance.actual_oar1_path,
      })
    }

    if (instance.correction_oar2_path) {
      vectors.push({
        key: `correction:${instance.process_instance_key}`,
        kind: "corrective",
        from: instance.partial_oar1_reference ?? instance.process_instance_key,
        to: instance.correction_oar2_path,
        evidence: instance.validation_finding ?? "correction path recorded",
        interrupted: false,
      })
    }

    if (instance.execution_standing === "blocked" || instance.seeded_reference_standing === "unseeded_blocked") {
      vectors.push({
        key: `blocked:${instance.process_instance_key}`,
        kind: "blocked-return",
        from: instance.process_instance_key,
        to: readable(instance.held_standing),
        evidence: instance.validation_finding ?? instance.execution_result,
        interrupted: true,
      })
    }

    return vectors
  })

  return [...transitionVectors, ...evidenceVectors]
}

function fieldPoint(index: number, total: number, node: RelationNode): FieldPoint {
  if (total <= 0) return { x: 50, y: 50 }

  const angle = -90 + (index / total) * 360
  const radius =
    node.kind === "transition"
      ? 27
      : node.kind === "blocked" || node.kind === "correction"
        ? 43
        : node.kind === "closure" || node.kind === "evidence"
          ? 35
          : 39
  const radians = (angle * Math.PI) / 180

  return {
    x: 50 + Math.cos(radians) * radius,
    y: 50 + Math.sin(radians) * radius,
  }
}

function distance(pointA: FieldPoint, pointB: FieldPoint) {
  return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y)
}

function fieldPath(vector: FieldVector) {
  const center = { x: 50, y: 50 }
  const pull = vector.kind === "corrective" ? 0.42 : vector.kind === "blocked-return" ? -0.22 : 0.2
  const controlX = center.x + (vector.start.x + vector.end.x - 100) * pull
  const controlY = center.y + (vector.start.y + vector.end.y - 100) * pull

  return `M ${vector.start.x.toFixed(2)} ${vector.start.y.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${vector.end.x.toFixed(2)} ${vector.end.y.toFixed(2)}`
}

function placeFieldNodes(nodes: RelationNode[]): FieldNode[] {
  return nodes.map((node, index) => ({
    ...node,
    point: fieldPoint(index, nodes.length, node),
  }))
}

function placeFieldVectors(vectors: RelationVector[], nodes: FieldNode[]): FieldVector[] {
  const processNodes = nodes.filter((node) => node.key.startsWith("process:"))
  const transitionNodes = nodes.filter((node) => node.key.startsWith("transition:"))
  const byLabel = new Map(processNodes.map((node) => [node.label, node]))

  return vectors.map((vector, index) => {
    const endNode = byLabel.get(vector.to) ?? processNodes[index % Math.max(processNodes.length, 1)] ?? nodes[0]
    const startNode =
      vector.kind === "dependency"
        ? { point: { x: 50, y: 8 } }
        : vector.kind === "convergent"
          ? endNode
          : vector.kind === "corrective"
            ? processNodes.find((node) => node.kind === "correction") ?? endNode
            : transitionNodes[index % Math.max(transitionNodes.length, 1)] ?? endNode

    return {
      ...vector,
      start: startNode.point,
      end: endNode.point,
    }
  })
}

function countWhere<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length
}

export function LapisRelationMappingSurface({
  processInstances,
  transitionLog,
  validationChecks,
  persistenceStanding,
}: LapisRelationMappingSurfaceProps) {
  const nodes = deriveRelationNodes(processInstances, transitionLog)
  const vectors = deriveRelationVectors(processInstances, transitionLog)
  const fieldNodes = placeFieldNodes(nodes)
  const fieldVectors = placeFieldVectors(vectors, fieldNodes)
  const fracturedNodes = nodes.filter((node) => node.fractured)
  const interruptedVectors = vectors.filter((vector) => vector.interrupted)
  const correctionVectors = vectors.filter((vector) => vector.kind === "corrective")
  const failedChecks = validationChecks.filter((check) => check.standing !== "passed")
  const openCount = countWhere(processInstances, (instance) =>
    ["queued", "executing", "held"].includes(instance.execution_standing),
  )
  const blockedCount = countWhere(
    processInstances,
    (instance) =>
      instance.execution_standing === "blocked" ||
      instance.validation_standing === "correction_required" ||
      instance.seeded_reference_standing === "unseeded_blocked",
  )
  const correctionCount = countWhere(
    processInstances,
    (instance) => instance.lifecycle_type === "correction" || Boolean(instance.correction_oar2_path),
  )
  const completedCount = countWhere(processInstances, (instance) => instance.execution_standing === "completed")
  const unverifiedCount = failedChecks.length
  const orphanedCount = countWhere(processInstances, (instance) => !instance.evidence_path)
  const marbleCount = countWhere(processInstances, (instance) => Boolean(instance.actual_oar1_path) && Boolean(instance.evidence_path))
  const evidenceTotal =
    transitionLog.filter((entry) => entry.evidence_reference).length +
    processInstances.filter((instance) => instance.evidence_path).length
  const coherencePercent =
    processInstances.length === 0
      ? 0
      : Math.round(
          ((completedCount / processInstances.length) * 42) +
            ((marbleCount / processInstances.length) * 28) +
            ((1 - blockedCount / processInstances.length) * 30),
        )
  const relationStanding =
    persistenceStanding !== "registry_backed"
      ? "held pending registry relation"
      : fracturedNodes.length > 0 || interruptedVectors.length > 0 || failedChecks.length > 0
        ? "fracture visible"
        : "relation continuous"

  return (
    <div
      className={`c3-lapis-relation-surface ${fieldLensPreset?.rendererClass ?? ""}`}
      aria-labelledby="lapis-relation-mapping"
      data-optics-grammar={coherenceOpticsGrammarRegistry.grammarKey}
    >
      <div className="c3-lapis-heading">
        <div>
          <p className="c3-ops-kicker">Lapis</p>
          <h3 id="lapis-relation-mapping">c3 Field Lens Optics</h3>
          <p>Relation, motion, thresholds, and coherence across the seated runtime field.</p>
        </div>
        <span>{relationStanding}</span>
      </div>

      <div className="c3-lapis-lens-shell">
        <aside className="c3-lapis-callouts" aria-label="Lens material callouts">
          {materialCallouts.map((material) => (
            <section className={material.rendererClass} key={material.key}>
              <h4>{material.label}</h4>
              {material.statements.map((statement) => (
                <p key={statement}>{statement}</p>
              ))}
            </section>
          ))}
          <section>
            <h4>Coherence Wave</h4>
            <p>{crystalGrammar?.spatialRule ?? "Crystal merged with field"}</p>
            {(crystalGrammar?.statements ?? []).slice(0, 2).map((statement) => (
              <p key={statement}>{statement}</p>
            ))}
          </section>
        </aside>

        <div className="c3-lapis-field" aria-label="Runtime relation field geometry">
          <svg className="c3-lapis-geometry" viewBox="0 0 100 100" role="img" aria-label="Runtime vectors and continuity arcs">
            <circle className="c3-lapis-field-orbit c3-lapis-field-orbit-boundary" cx="50" cy="50" r="48" />
            <circle className="c3-lapis-field-orbit c3-lapis-field-orbit-outer" cx="50" cy="50" r="43" />
            <circle className="c3-lapis-field-orbit c3-lapis-field-orbit-middle" cx="50" cy="50" r="35" />
            <circle className="c3-lapis-field-orbit c3-lapis-field-orbit-inner" cx="50" cy="50" r="27" />
            <circle className="c3-lapis-field-orbit c3-lapis-field-orbit-core" cx="50" cy="50" r="18" />
            <line className="c3-lapis-field-axis" x1="50" y1="4" x2="50" y2="96" />
            <line className="c3-lapis-field-axis" x1="4" y1="50" x2="96" y2="50" />
            <line className="c3-lapis-field-axis c3-lapis-field-axis-diagonal" x1="18" y1="18" x2="82" y2="82" />
            <line className="c3-lapis-field-axis c3-lapis-field-axis-diagonal" x1="82" y1="18" x2="18" y2="82" />
            {fieldVectors.map((vector) => (
              <path
                className={`c3-lapis-arc ${relationGrammar(vector.kind)?.rendererClass ?? `c3-lapis-arc-${vector.kind}`}`}
                d={fieldPath(vector)}
                data-interrupted={vector.interrupted}
                key={vector.key}
                pathLength={Math.max(16, distance(vector.start, vector.end))}
              />
            ))}
            {fieldRayIndexes.map((index) => {
              const angle = (index / 32) * 360
              const radians = (angle * Math.PI) / 180
              const inner = 20
              const outer = index % 2 === 0 ? 24 : 22
              return (
                <line
                  className="c3-lapis-field-ray"
                  key={`ray:${index}`}
                  x1={(50 + Math.cos(radians) * inner).toFixed(2)}
                  y1={(50 + Math.sin(radians) * inner).toFixed(2)}
                  x2={(50 + Math.cos(radians) * outer).toFixed(2)}
                  y2={(50 + Math.sin(radians) * outer).toFixed(2)}
                />
              )
            })}
          </svg>
          <div className="c3-lapis-cardinal c3-lapis-cardinal-up">
            <span>Upstream</span>
            <small>received</small>
          </div>
          <div className="c3-lapis-cardinal c3-lapis-cardinal-down">
            <span>Downstream</span>
            <small>delivered</small>
          </div>
          <div className="c3-lapis-lens-action c3-lapis-lens-action-observe">Observe</div>
          <div className="c3-lapis-lens-action c3-lapis-lens-action-orient">Orient</div>
          <div className="c3-lapis-lens-action c3-lapis-lens-action-respond">Respond</div>
          <div className="c3-lapis-lens-action c3-lapis-lens-action-reflect">Reflect</div>
          <div className="c3-lapis-authority-core">
            <span>Codex</span>
            <strong>Field</strong>
            <small>{crystalGrammar?.geometryRole ?? "crystal held within"}</small>
          </div>
          {fieldNodes.map((node) => (
            <article
              className={`c3-lapis-node c3-lapis-node-${node.kind}`}
              data-fractured={node.fractured}
              key={node.key}
              style={
                {
                  "--c3-node-x": `${node.point.x}%`,
                  "--c3-node-y": `${node.point.y}%`,
                } as CSSProperties
              }
            >
              <span>{readable(node.kind)}</span>
              <strong>{node.label}</strong>
              <small>{node.standing}</small>
            </article>
          ))}
          <div className="c3-lapis-inscription-rail" aria-label="Distributed Marble inscription continuity">
            {(marbleGrammar?.statements ?? ["Evidence continuity", "Closure sediment", "Preserved lineage"]).map((statement) => (
              <span key={statement}>{statement}</span>
            ))}
            <span>Passage Witnessed</span>
          </div>
        </div>

        <aside className="c3-lapis-readout" aria-label="State legend">
          <h4>State Legend</h4>
          <dl className="c3-lapis-state-readout">
            <div><dt>Open</dt><dd>{openCount}</dd></div>
            <div><dt>Blocked</dt><dd>{blockedCount}</dd></div>
            <div><dt>In Correction</dt><dd>{correctionCount}</dd></div>
            <div><dt>Completed</dt><dd>{completedCount}</dd></div>
            <div><dt>Orphaned</dt><dd>{orphanedCount}</dd></div>
            <div><dt>Unverified</dt><dd>{unverifiedCount}</dd></div>
            <div><dt>Evidence Total</dt><dd>{evidenceTotal}</dd></div>
          </dl>
        </aside>
      </div>

      <div className="c3-lapis-bottom-row">
        <div className="c3-lapis-field-readout" aria-label="Field lens readout">
          <div>
            <span>Field Lens Readout</span>
            <strong>{coherencePercent}%</strong>
            <small>coherence</small>
          </div>
          <div className="c3-lapis-readout-dial" aria-hidden="true">
            <span />
          </div>
          <div>
            <strong>{blockedCount}</strong>
            <small>blocked standing</small>
          </div>
          <div>
            <strong>{transitionLog.length}</strong>
            <small>live relations</small>
          </div>
          <div>
            <strong>{marbleCount}</strong>
            <small>marble inscriptions</small>
          </div>
          <div className="c3-lapis-continuity-wave">
            <span>Continuity</span>
            <small>{correctionVectors.length > 0 ? "stable with correction" : "stable"}</small>
          </div>
        </div>

        <aside className="c3-lapis-principles" aria-label="Lens principles">
          <h4>Lens Principles</h4>
          {coherenceOpticsGrammarRegistry.spatialHierarchy.map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </aside>
      </div>
    </div>
  )
}
