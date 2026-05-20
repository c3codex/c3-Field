import { useEffect, useState, type KeyboardEvent } from "react"
import {
  canEnterOarQueue,
  heldStates,
  queueBlockReason,
  validateImmutableTransitionLog,
  validateQueueIntegrity,
  validationStates,
  type OarProcessInstance,
  type OarTransitionLogEntry,
  type SpineValidationCheck,
} from "./operationsSpine"
import { loadOarSpineRegistry, type OarSpineRegistryState } from "./oarSpineRegistry"
import { opticsSurfaceRegistry, surfaceClasses } from "./opticsSurfaceRegistry"
import { RuntimeCoherenceOptics } from "./RuntimeCoherenceOptics"
import {
  deriveRuntimeTransitionGovernance,
  validateRuntimeTransitionGovernance,
} from "./transitionGovernanceEngine"

type EmphasisMode = "all" | "blocked" | "correction" | "evidence" | "closed"

const emphasisModes: EmphasisMode[] = ["all", "blocked", "correction", "evidence", "closed"]

function statusLabel(value: string | null) {
  return value ? value.replaceAll("_", " ") : "not recorded"
}

function StatusPill({ value }: { value: string | null }) {
  const normalized = value ?? "not_recorded"
  return <span className={`c3-status-pill c3-status-${normalized}`}>{statusLabel(value)}</span>
}

function processMatchesEmphasis(instance: OarProcessInstance, emphasisMode: EmphasisMode) {
  if (emphasisMode === "all") return true

  if (emphasisMode === "blocked") {
    return (
      instance.execution_standing === "blocked" ||
      instance.validation_standing === "correction_required" ||
      instance.seeded_reference_standing === "unseeded_blocked"
    )
  }

  if (emphasisMode === "correction") {
    return (
      instance.lifecycle_type === "correction" ||
      Boolean(instance.correction_oar2_path) ||
      instance.validation_standing === "correction_required"
    )
  }

  if (emphasisMode === "evidence") {
    return Boolean(instance.evidence_path) || Boolean(instance.actual_oar1_path)
  }

  return instance.execution_standing === "completed" && Boolean(instance.actual_oar1_path) && Boolean(instance.evidence_path)
}

function transitionTouchesProcess(entry: OarTransitionLogEntry, selectedProcessKey: string | null) {
  return selectedProcessKey ? entry.process_instance_key === selectedProcessKey : true
}

function toggleKey(event: KeyboardEvent<HTMLElement>) {
  return event.key === "Enter" || event.key === " "
}

export default function OarOperationsConsole() {
  const [registryState, setRegistryState] = useState<OarSpineRegistryState | null>(null)
  const [registryError, setRegistryError] = useState<string | null>(null)
  const [selectedProcessKey, setSelectedProcessKey] = useState<string | null>(null)
  const [emphasisMode, setEmphasisMode] = useState<EmphasisMode>("all")

  useEffect(() => {
    let active = true

    loadOarSpineRegistry()
      .then((state) => {
        if (!active) return
        setRegistryState(state)
        setRegistryError(null)
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : "Persistent registry standing unavailable"
        setRegistryError(message)
        setRegistryState(null)
      })

    return () => {
      active = false
    }
  }, [])

  const processInstances: OarProcessInstance[] = registryState?.processInstances ?? []
  const transitionLog: OarTransitionLogEntry[] = registryState?.transitionLog ?? []
  const executableCount = processInstances.filter(canEnterOarQueue).length
  const blockedCount = processInstances.length - executableCount
  const queueChecks: SpineValidationCheck[] = registryState ? validateQueueIntegrity(processInstances) : []
  const logChecks: SpineValidationCheck[] = registryState ? validateImmutableTransitionLog(transitionLog) : []
  const seededChecks = registryState?.seededReferenceChecks ?? []
  const transitionGovernance = deriveRuntimeTransitionGovernance(processInstances, transitionLog)
  const governanceChecks: SpineValidationCheck[] = registryState
    ? validateRuntimeTransitionGovernance(transitionGovernance)
    : []
  const persistenceStanding = registryState?.persistenceStanding ?? "held_pending_persistence"
  const persistenceMessage =
    registryState?.persistenceMessage ??
    `Persistent registry state is not available: ${registryError ?? "loading registry standing"}`
  const selectedProcess = processInstances.find((instance) => instance.process_instance_key === selectedProcessKey) ?? null
  const selectedTransitions = selectedProcess
    ? transitionLog.filter((entry) => transitionTouchesProcess(entry, selectedProcess.process_instance_key))
    : []
  const selectedChecks = selectedProcess
    ? [...queueChecks, ...logChecks, ...seededChecks, ...governanceChecks].filter((check) => {
        const evidence = check.evidence.toLowerCase()
        return evidence.includes(selectedProcess.process_instance_key.toLowerCase()) || check.standing !== "passed"
      })
    : []

  return (
    <main
      className="c3-ops-shell c3-runtime-lens-convergence c3-optics-speak-refinement"
      data-runtime-lens="runtime_lens_convergence_v1"
      data-optics-refinement="let_optics_speak_v1"
      data-optics-surface-registry={opticsSurfaceRegistry.registryKey}
      data-transition-governance={transitionGovernance.engine_key}
      data-transition-governance-read-only={transitionGovernance.read_only}
    >
      <section className={`c3-ops-hero ${surfaceClasses(["center_authority_core", "continuity_stream"])}`}>
        <div>
          <p className="c3-ops-kicker">c3 Field Convergence</p>
          <h1>OAR Operations Spine</h1>
          <p>
            Phase 1 process continuity surface for OAR2 queueing, Cody execution proof,
            Chazz validation routing, held-state governance, and immutable transition trace.
          </p>
          <div className="c3-persistence-banner">
            <StatusPill value={persistenceStanding} />
            <span>{persistenceMessage}</span>
          </div>
        </div>
        <dl className={`c3-ops-summary ${surfaceClasses(["memory_sediment", "validation_wave"])}`}>
          <div>
            <dt>Executable</dt>
            <dd>{executableCount}</dd>
          </div>
          <div>
            <dt>Blocked</dt>
            <dd>{blockedCount}</dd>
          </div>
          <div>
            <dt>Deploy</dt>
            <dd>Distinct</dd>
          </div>
        </dl>
      </section>

      {!registryState && (
        <section className="c3-ops-section" aria-labelledby="persistence-held">
          <div className="c3-persistence-held">
            <p className="c3-ops-kicker">Persistence</p>
            <h2 id="persistence-held">Registry Standing Held</h2>
            <p>
              The console is waiting for Supabase persistence tables to be available. It will not
              substitute modeled runtime state for missing registry-backed standing.
            </p>
          </div>
        </section>
      )}

      <RuntimeCoherenceOptics
        processInstances={processInstances}
        transitionLog={transitionLog}
        validationChecks={[...queueChecks, ...logChecks, ...seededChecks, ...governanceChecks]}
        persistenceStanding={persistenceStanding}
      />

      <section className="c3-unified-runtime-console c3-runtime-field-overlays" aria-label="Unified runtime data console">
      <section
        className={`c3-ops-section c3-transition-governance-engine ${surfaceClasses(["threshold_boundary", "relation_orbit", "validation_wave"])}`}
        aria-labelledby="transition-governance-engine"
      >
        <div className="c3-section-heading">
          <p className="c3-ops-kicker">Passage Engine</p>
          <h2 id="transition-governance-engine">Runtime Transition Governance</h2>
        </div>
        <dl className="c3-transition-governance-summary">
          <div>
            <dt>Encounterable</dt>
            <dd>{transitionGovernance.summary.encounterable}</dd>
          </div>
          <div>
            <dt>Held</dt>
            <dd>{transitionGovernance.summary.held}</dd>
          </div>
          <div>
            <dt>Blocked</dt>
            <dd>{transitionGovernance.summary.blocked}</dd>
          </div>
          <div>
            <dt>Pressure</dt>
            <dd>{transitionGovernance.summary.pressure}</dd>
          </div>
          <div>
            <dt>Correction</dt>
            <dd>{transitionGovernance.summary.correction}</dd>
          </div>
        </dl>
        <div className="c3-transition-branch-grid">
          {transitionGovernance.branches.map((branch) => (
            <article
              className="c3-transition-branch"
              data-passage-standing={branch.passage_engine}
              data-transition-authority={branch.transition_authority}
              key={branch.branch_key}
            >
              <div>
                <h3>{branch.branch_key}</h3>
                <StatusPill value={branch.passage_engine} />
              </div>
              <dl>
                <div><dt>Authority</dt><dd>{statusLabel(branch.transition_authority)}</dd></div>
                <div><dt>Continuity</dt><dd>{statusLabel(branch.continuity_pressure)}</dd></div>
                <div><dt>Correction</dt><dd>{statusLabel(branch.correction_propagation)}</dd></div>
                <div><dt>Release</dt><dd>{statusLabel(branch.release_cadence)}</dd></div>
              </dl>
              <small>{branch.evidence_references.length} evidence references</small>
              <p>{branch.reasons[0]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`c3-ops-section ${surfaceClasses(["relation_orbit", "glyph_cluster"])}`} aria-labelledby="process-instances">
        <div className="c3-section-heading">
          <p className="c3-ops-kicker">Queue</p>
          <h2 id="process-instances">Process Instances</h2>
        </div>
        <div className="c3-lens-emphasis-controls" aria-label="Runtime lens emphasis modes">
          {emphasisModes.map((mode) => (
            <button
              aria-pressed={emphasisMode === mode}
              className="c3-lens-emphasis-button"
              key={mode}
              onClick={() => setEmphasisMode(mode)}
              type="button"
            >
              {statusLabel(mode)}
            </button>
          ))}
        </div>
        {selectedProcess ? (
          <aside className="c3-lens-inspection-overlay" aria-label="Selected runtime relation inspection">
            <div>
              <p className="c3-ops-kicker">Inspection</p>
              <h3>{selectedProcess.process_instance_key}</h3>
              <button
                aria-label="Close selected runtime relation inspection"
                className="c3-lens-inspection-close"
                onClick={() => setSelectedProcessKey(null)}
                type="button"
              >
                X
              </button>
            </div>
            <dl className="c3-lens-inspection-standing">
              <div><dt>Execution</dt><dd><StatusPill value={selectedProcess.execution_standing} /></dd></div>
              <div><dt>Validation</dt><dd><StatusPill value={selectedProcess.validation_standing} /></dd></div>
              <div><dt>Deploy</dt><dd><StatusPill value={selectedProcess.deploy_standing} /></dd></div>
              <div><dt>Held</dt><dd><StatusPill value={selectedProcess.held_standing} /></dd></div>
            </dl>
            <ol className="c3-lens-lineage-trace" aria-label="Selected OAR lineage trace">
              <li><span>Process</span>{selectedProcess.process_instance_key}</li>
              <li><span>Source OAR2</span>{selectedProcess.source_oar2_path}</li>
              <li><span>Expected OAR1</span>{selectedProcess.expected_oar1_path}</li>
              <li><span>Actual OAR1</span>{selectedProcess.actual_oar1_path ?? "required before validation"}</li>
              <li><span>Evidence</span>{selectedProcess.evidence_path ?? "not recorded"}</li>
              <li><span>Transitions</span>{selectedTransitions.length} recorded</li>
            </ol>
            {(selectedProcess.correction_oar2_path || selectedProcess.validation_finding) ? (
              <div className="c3-lens-correction-trace">
                <span>Correction</span>
                <p>{selectedProcess.correction_oar2_path ?? selectedProcess.validation_finding}</p>
              </div>
            ) : null}
          </aside>
        ) : null}
        <div className="c3-process-grid">
          {processInstances.map((instance) => {
            const blockReason = queueBlockReason(instance)
            const matchesEmphasis = processMatchesEmphasis(instance, emphasisMode)
            const isSelected = selectedProcess?.process_instance_key === instance.process_instance_key

            return (
              <article
                className={`c3-process-card c3-process-node ${surfaceClasses([blockReason ? "fracture_field" : "relation_orbit", "glyph_cluster"])}`}
                data-execution-standing={instance.execution_standing}
                data-emphasis-match={matchesEmphasis}
                data-selected={isSelected}
                data-validation-standing={instance.validation_standing}
                key={instance.process_instance_key}
                onClick={() =>
                  setSelectedProcessKey((currentKey) =>
                    currentKey === instance.process_instance_key ? null : instance.process_instance_key,
                  )
                }
                onKeyDown={(event) => {
                  if (!toggleKey(event)) return
                  event.preventDefault()
                  setSelectedProcessKey((currentKey) =>
                    currentKey === instance.process_instance_key ? null : instance.process_instance_key,
                  )
                }}
                tabIndex={0}
              >
                <div className="c3-process-card-header">
                  <div>
                    <h3>{instance.process_instance_key}</h3>
                    <span className="c3-cycle-type">{statusLabel(instance.lifecycle_type)} lifecycle</span>
                  </div>
                  <StatusPill value={instance.source_oar2_standing} />
                </div>
                <dl className="c3-process-details">
                  <div>
                    <dt>Execution</dt>
                    <dd><StatusPill value={instance.execution_standing} /></dd>
                  </div>
                  <div>
                    <dt>Validation</dt>
                    <dd><StatusPill value={instance.validation_standing} /></dd>
                  </div>
                  <div>
                    <dt>Deploy</dt>
                    <dd><StatusPill value={instance.deploy_standing} /></dd>
                  </div>
                  <div>
                    <dt>Held</dt>
                    <dd><StatusPill value={instance.held_standing} /></dd>
                  </div>
                  <div>
                    <dt>Seeded</dt>
                    <dd><StatusPill value={instance.seeded_reference_standing} /></dd>
                  </div>
                </dl>
                <div className="c3-path-list">
                  <p><span>OAR2</span>{instance.source_oar2_path}</p>
                  <p><span>Expected OAR1</span>{instance.expected_oar1_path}</p>
                  <p><span>Actual OAR1</span>{instance.actual_oar1_path ?? "required before validation"}</p>
                  <p><span>Evidence</span>{instance.evidence_path ?? "not recorded"}</p>
                </div>
                {(instance.correction_source_oar2_path || instance.correction_oar2_path || instance.validation_finding) && (
                  <div className="c3-lineage-panel">
                    <p><span>Finding</span>{instance.validation_finding ?? "not recorded"}</p>
                    <p><span>Source OAR2</span>{instance.correction_source_oar2_path ?? "not correction lineage"}</p>
                    <p><span>Correction OAR2</span>{instance.correction_oar2_path ?? "not routed"}</p>
                    <p><span>Partial OAR1</span>{instance.partial_oar1_reference ?? "not recorded"}</p>
                    <p><span>Correction Scope</span>{instance.correction_scope ?? "not recorded"}</p>
                  </div>
                )}
                <p className="c3-process-result">{blockReason ?? instance.execution_result}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className={`c3-ops-section c3-validation-spine-section ${surfaceClasses(["validation_wave", "continuity_stream"])}`} aria-labelledby="validation-checks">
        <div className="c3-section-heading">
          <p className="c3-ops-kicker">Refinement</p>
          <h2 id="validation-checks">Validation Checks</h2>
        </div>
        <div className="c3-check-grid">
          {[...queueChecks, ...logChecks, ...seededChecks, ...governanceChecks].map((check) => (
            <article
              className="c3-check-card"
              data-check-standing={check.standing}
              data-selected-relevant={selectedChecks.some((selectedCheck) => selectedCheck.check_key === check.check_key)}
              key={check.check_key}
            >
              <div>
                <h3>{statusLabel(check.check_key)}</h3>
                <StatusPill value={check.standing} />
              </div>
              <p>{check.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`c3-ops-section c3-ops-two-column c3-governance-spine ${surfaceClasses(["threshold_boundary", "validation_wave"])}`} aria-labelledby="governance">
        <div>
          <div className="c3-section-heading">
            <p className="c3-ops-kicker">Validation</p>
            <h2 id="governance">Chazz Queue States</h2>
          </div>
          <ul className="c3-state-list">
            {validationStates.map((state) => (
              <li key={state}><StatusPill value={state} /></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="c3-section-heading">
            <p className="c3-ops-kicker">Held</p>
            <h2>Held-State Governance</h2>
          </div>
          <ul className="c3-state-list">
            {heldStates.map((state) => (
              <li key={state}><StatusPill value={state} /></li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`c3-ops-section c3-inscription-log-section ${surfaceClasses(["inscription_band", "memory_sediment"])}`} aria-labelledby="transition-log">
        <div className="c3-section-heading">
          <p className="c3-ops-kicker">Append Only</p>
          <h2 id="transition-log">Immutable Transition Log</h2>
        </div>
        <div className="c3-transition-log">
          {transitionLog.map((entry) => (
            <article className="c3-log-entry" key={`${entry.process_instance_key}-${entry.timestamp}`}>
              <div>
                <strong>{entry.actor}</strong>
                <span>{entry.transition_type} / {entry.timestamp}</span>
              </div>
              <p>{statusLabel(entry.from_status)} {"->"} {statusLabel(entry.to_status)}</p>
              <small>{entry.notes}</small>
              <code>{entry.transition_event_key}</code>
              <code>{entry.evidence_reference ?? "no evidence reference"}</code>
            </article>
          ))}
        </div>
      </section>
      </section>
    </main>
  )
}
