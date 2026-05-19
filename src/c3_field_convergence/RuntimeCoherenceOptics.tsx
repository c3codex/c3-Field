import type { CSSProperties } from "react"
import { coherenceOpticsGrammarRegistry } from "./coherenceOpticsGrammarRegistry"
import { LapisRelationMappingSurface } from "./LapisRelationMappingSurface"
import type { OarProcessInstance, OarTransitionLogEntry, SpineValidationCheck } from "./operationsSpine"
import { opticsSurfaceRegistry, surfaceClasses } from "./opticsSurfaceRegistry"

type RuntimeCoherenceOpticsProps = {
  processInstances: OarProcessInstance[]
  transitionLog: OarTransitionLogEntry[]
  validationChecks: SpineValidationCheck[]
  persistenceStanding: "registry_backed" | "held_pending_persistence"
}

function countWhere<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function percent(value: number, total: number) {
  if (total <= 0) return 0
  return Math.round((value / total) * 100)
}

export function RuntimeCoherenceOptics({
  processInstances,
  transitionLog,
  validationChecks,
  persistenceStanding,
}: RuntimeCoherenceOpticsProps) {
  const total = processInstances.length
  const blocked = countWhere(
    processInstances,
    (instance) =>
      instance.execution_standing === "blocked" ||
      instance.validation_standing === "correction_required" ||
      instance.seeded_reference_standing === "unseeded_blocked",
  )
  const correction = countWhere(
    processInstances,
    (instance) =>
      instance.lifecycle_type === "correction" ||
      Boolean(instance.correction_oar2_path) ||
      instance.validation_standing === "correction_required",
  )
  const closed = countWhere(
    processInstances,
    (instance) =>
      instance.execution_standing === "completed" &&
      Boolean(instance.actual_oar1_path) &&
      Boolean(instance.evidence_path),
  )
  const evidenceComplete = countWhere(
    processInstances,
    (instance) => Boolean(instance.evidence_path) && Boolean(instance.actual_oar1_path),
  )
  const failedChecks = countWhere(validationChecks, (check) => check.standing !== "passed")
  const traceContinuity = transitionLog.length > 0 && transitionLog.every((entry) => Boolean(entry.evidence_reference))
  const registryBacked = persistenceStanding === "registry_backed"

  const closurePct = percent(closed, total)
  const evidencePct = percent(evidenceComplete, total)
  const blockPct = percent(blocked, total)
  const correctionPct = percent(correction, total)
  const coherenceScore = clamp(
    Math.round((closurePct + evidencePct + (100 - blockPct) + (traceContinuity ? 100 : 0) + (registryBacked ? 100 : 0)) / 5),
    0,
    100,
  )

  const opticsStyle = {
    "--c3-obsidian-signal": `${Math.max(18, blockPct)}%`,
    "--c3-lapis-signal": `${Math.max(22, percent(transitionLog.length, Math.max(total * 2, 1)))}%`,
    "--c3-marble-signal": `${Math.max(20, evidencePct)}%`,
    "--c3-crystal-signal": `${Math.max(24, coherenceScore)}%`,
  } as CSSProperties

  const standing =
    blocked > 0 || failedChecks > 0
      ? "blocked standing visible"
      : correction > 0
        ? "correction lineage visible"
        : "closure coherence visible"
  const [crystalGrammar, lapisGrammar, obsidianGrammar, marbleGrammar] = [
    coherenceOpticsGrammarRegistry.materials.find((material) => material.key === "crystal"),
    coherenceOpticsGrammarRegistry.materials.find((material) => material.key === "lapis"),
    coherenceOpticsGrammarRegistry.materials.find((material) => material.key === "obsidian"),
    coherenceOpticsGrammarRegistry.materials.find((material) => material.key === "marble"),
  ]

  return (
    <section
      className={`c3-ops-section c3-runtime-optics ${surfaceClasses(["center_authority_core", "runtime_relation_ring"])}`}
      data-coherence-score={coherenceScore}
      data-optics-surface-registry={opticsSurfaceRegistry.registryKey}
      aria-labelledby="runtime-coherence-optics"
      style={opticsStyle}
    >
      <div className="c3-section-heading">
        <p className="c3-ops-kicker">Crystal</p>
        <h2 id="runtime-coherence-optics">Runtime Coherence Optics</h2>
      </div>
      <div className="c3-optics-chamber" aria-label="Obsidian Runtime Chamber coherence optics">
        <div className={`c3-optics-mandala ${surfaceClasses(["relation_orbit", "threshold_boundary"])}`} aria-hidden="true">
          <span className={`c3-optics-ring c3-optics-obsidian ${obsidianGrammar?.rendererClass ?? ""}`} />
          <span className={`c3-optics-ring c3-optics-lapis ${lapisGrammar?.rendererClass ?? ""}`} />
          <span className={`c3-optics-ring c3-optics-marble ${marbleGrammar?.rendererClass ?? ""}`} />
          <span className={`c3-optics-ring c3-optics-crystal ${crystalGrammar?.rendererClass ?? ""}`} />
          <span className="c3-optics-axis c3-optics-axis-vertical" />
          <span className="c3-optics-axis c3-optics-axis-horizontal" />
        </div>
        <div className="c3-optics-readout">
          <dl>
            <div>
              <dt>{obsidianGrammar?.label ?? "Obsidian"}</dt>
              <dd>{blocked} blocked</dd>
            </div>
            <div>
              <dt>{lapisGrammar?.label ?? "Lapis"}</dt>
              <dd>{transitionLog.length} relations</dd>
            </div>
            <div>
              <dt>{marbleGrammar?.label ?? "Marble"}</dt>
              <dd>{evidenceComplete} traces</dd>
            </div>
            <div>
              <dt>{crystalGrammar?.label ?? "Crystal"}</dt>
              <dd>{coherenceScore}% coherence</dd>
            </div>
          </dl>
          <p>{standing}</p>
          <small>{coherenceOpticsGrammarRegistry.rendererContract.truthSource}.</small>
        </div>
      </div>
      <LapisRelationMappingSurface
        processInstances={processInstances}
        transitionLog={transitionLog}
        validationChecks={validationChecks}
        persistenceStanding={persistenceStanding}
      />
    </section>
  )
}
