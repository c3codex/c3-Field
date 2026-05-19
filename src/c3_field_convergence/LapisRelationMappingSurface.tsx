import type { CSSProperties } from "react"
import type { OarProcessInstance, OarTransitionLogEntry, SpineValidationCheck } from "./operationsSpine"

type LapisRelationMappingSurfaceProps = {
  processInstances: OarProcessInstance[]
  transitionLog: OarTransitionLogEntry[]
  validationChecks: SpineValidationCheck[]
  persistenceStanding: "registry_backed" | "held_pending_persistence"
}

type RelationNodeKind = "process" | "queue" | "transition" | "correction" | "closure" | "blocked" | "evidence"
type RelationVectorKind = "upstream" | "downstream" | "corrective" | "convergent" | "divergent" | "dependency" | "blocked-return"

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
  const relationStanding =
    persistenceStanding !== "registry_backed"
      ? "held pending registry relation"
      : fracturedNodes.length > 0 || interruptedVectors.length > 0 || failedChecks.length > 0
        ? "fracture visible"
        : "relation continuous"

  return (
    <div className="c3-lapis-relation-surface" aria-labelledby="lapis-relation-mapping">
      <div className="c3-lapis-heading">
        <div>
          <p className="c3-ops-kicker">Lapis</p>
          <h3 id="lapis-relation-mapping">Relation Mapping Surface</h3>
        </div>
        <span>{relationStanding}</span>
      </div>

      <div className="c3-lapis-topology">
        <div className="c3-lapis-field" aria-label="Runtime relation field geometry">
          <svg className="c3-lapis-geometry" viewBox="0 0 100 100" role="img" aria-label="Runtime vectors and continuity arcs">
            <circle className="c3-lapis-field-orbit c3-lapis-field-orbit-outer" cx="50" cy="50" r="43" />
            <circle className="c3-lapis-field-orbit c3-lapis-field-orbit-inner" cx="50" cy="50" r="27" />
            <line className="c3-lapis-field-axis" x1="50" y1="4" x2="50" y2="96" />
            <line className="c3-lapis-field-axis" x1="4" y1="50" x2="96" y2="50" />
            {fieldVectors.map((vector) => (
              <path
                className={`c3-lapis-arc c3-lapis-arc-${vector.kind}`}
                d={fieldPath(vector)}
                data-interrupted={vector.interrupted}
                key={vector.key}
                pathLength={Math.max(16, distance(vector.start, vector.end))}
              />
            ))}
          </svg>
          <div className="c3-lapis-authority-core">
            <span>Codex</span>
            <strong>Field</strong>
            <small>{relationStanding}</small>
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
        </div>

        <div className="c3-lapis-vector-panel">
          <dl className="c3-lapis-counts">
            <div>
              <dt>Nodes</dt>
              <dd>{nodes.length}</dd>
            </div>
            <div>
              <dt>Vectors</dt>
              <dd>{vectors.length}</dd>
            </div>
            <div>
              <dt>Fractures</dt>
              <dd>{fracturedNodes.length + interruptedVectors.length + failedChecks.length}</dd>
            </div>
            <div>
              <dt>Corrections</dt>
              <dd>{correctionVectors.length}</dd>
            </div>
          </dl>

          <ol className="c3-lapis-vectors" aria-label="Runtime relation vectors">
            {vectors.map((vector) => (
              <li className={`c3-lapis-vector c3-lapis-vector-${vector.kind}`} data-interrupted={vector.interrupted} key={vector.key}>
                <span>{readable(vector.kind)}</span>
                <strong>
                  {`${vector.from} -> ${vector.to}`}
                </strong>
                <small>{vector.evidence}</small>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
