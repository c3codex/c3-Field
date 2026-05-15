import { useEffect, useState } from "react"
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

function statusLabel(value: string | null) {
  return value ? value.replaceAll("_", " ") : "not recorded"
}

function StatusPill({ value }: { value: string | null }) {
  const normalized = value ?? "not_recorded"
  return <span className={`c3-status-pill c3-status-${normalized}`}>{statusLabel(value)}</span>
}

export default function OarOperationsConsole() {
  const [registryState, setRegistryState] = useState<OarSpineRegistryState | null>(null)
  const [registryError, setRegistryError] = useState<string | null>(null)

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
  const persistenceStanding = registryState?.persistenceStanding ?? "held_pending_persistence"
  const persistenceMessage =
    registryState?.persistenceMessage ??
    `Persistent registry state is not available: ${registryError ?? "loading registry standing"}`

  return (
    <main className="c3-ops-shell">
      <section className="c3-ops-hero">
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
        <dl className="c3-ops-summary">
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

      <section className="c3-ops-section" aria-labelledby="process-instances">
        <div className="c3-section-heading">
          <p className="c3-ops-kicker">Queue</p>
          <h2 id="process-instances">Process Instances</h2>
        </div>
        <div className="c3-process-grid">
          {processInstances.map((instance) => {
            const blockReason = queueBlockReason(instance)

            return (
              <article className="c3-process-card" key={instance.process_instance_key}>
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

      <section className="c3-ops-section" aria-labelledby="validation-checks">
        <div className="c3-section-heading">
          <p className="c3-ops-kicker">Refinement</p>
          <h2 id="validation-checks">Validation Checks</h2>
        </div>
        <div className="c3-check-grid">
          {[...queueChecks, ...logChecks, ...seededChecks].map((check) => (
            <article className="c3-check-card" key={check.check_key}>
              <div>
                <h3>{statusLabel(check.check_key)}</h3>
                <StatusPill value={check.standing} />
              </div>
              <p>{check.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="c3-ops-section c3-ops-two-column" aria-labelledby="governance">
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

      <section className="c3-ops-section" aria-labelledby="transition-log">
        <div className="c3-section-heading">
          <p className="c3-ops-kicker">Append Only</p>
          <h2 id="transition-log">Immutable Transition Log</h2>
        </div>
        <div className="c3-transition-log">
          {transitionLog.map((entry) => (
            <article className="c3-log-entry" key={`${entry.process_instance_key}-${entry.timestamp}`}>
              <div>
                <strong>{entry.actor}</strong>
                <span>{entry.transition_type} · {entry.timestamp}</span>
              </div>
              <p>{statusLabel(entry.from_status)} {"->"} {statusLabel(entry.to_status)}</p>
              <small>{entry.notes}</small>
              <code>{entry.transition_event_key}</code>
              <code>{entry.evidence_reference ?? "no evidence reference"}</code>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
