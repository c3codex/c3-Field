import { useEffect, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

type ProofState =
  | { status: "loading" }
  | { status: "satisfied"; body: ProofBody }
  | { status: "held"; body: ProofBody }
  | { status: "error"; message: string }

type ProofBody = {
  final_standing?: string
  execution_instance_id?: string
  event_identity?: string
  passage_surface?: string
  resulting_encounter?: string
  role_called?: string
  target_implication?: string
  determination?: string
  next_permitted_transition?: string
  persistence_state_used?: {
    publication_object?: {
      dispatch_key?: string
      title?: string
      internal_route?: string
      source_sha256?: string
      source_drive_id?: string
    }
    recovered_from?: string[]
  }
  held_check?: string
}

type ControlsState =
  | { status: "loading" }
  | { status: "ready"; body: ControlsBody }
  | { status: "held"; body: ControlsBody }
  | { status: "error"; message: string }

type ControlsBody = {
  final_standing?: string
  held_check?: string | null
  external_publication_effects?: number
  passage?: {
    object_key?: string | null
    publication_object?: {
      dispatch_key?: string
      title?: string
      internal_route?: string | null
      external_url?: string | null
    } | null
    recovery_path?: string
  }
  lapzuli_distribution?: {
    route_standing?: string
    controls_enabled?: boolean
    dispatch_now?: string
    schedule?: string
    route_key?: string
    executions?: Array<{
      execution_status?: string | null
      platform_post_id?: string | null
      platform_url?: string | null
    }>
  }
  controls?: {
    select_object?: Array<{ dispatch_key?: string; title?: string; internal_route?: string | null }>
    recover?: string
    preflight?: string
    open_passage?: string
    dispatch_now?: string
    schedule?: string
  }
  destinations?: Array<{
    outlet_key: string
    display_name?: string | null
    domain?: string | null
    route_type?: string | null
    qualification_standing?: string | null
    account_state?: string | null
    fit_score?: number | null
  }>
  dizzy?: {
    standing?: string
    worker_identity?: string | null
    role_identity?: string | null
    external_publication_effects?: number
  }
  action_result?: {
    action?: string
    standing?: string
    mutation_count?: number
    external_publication_effects?: number
  }
}

type Props = {
  registryTokenStyle: CSSProperties
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

export default function PublishUndriftedPassage({
  registryTokenStyle,
  renderHeader,
  renderSystemFooter,
}: Props) {
  const [proof, setProof] = useState<ProofState>({ status: "loading" })
  const [controls, setControls] = useState<ControlsState>({ status: "loading" })
  const [actionResult, setActionResult] = useState<ControlsBody["action_result"] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function runProof() {
      try {
        const response = await fetch("/api/publish-undrifted-proof", { method: "POST" })
        const body = (await response.json().catch(() => ({}))) as ProofBody
        if (cancelled) return
        if (response.ok && body.final_standing === "implemented_and_passage_proven") {
          setProof({ status: "satisfied", body })
          return
        }
        setProof({ status: "held", body })
      } catch (error) {
        if (cancelled) return
        setProof({ status: "error", message: error instanceof Error ? error.message : String(error) })
      }
    }

    void runProof()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function runControls() {
      try {
        const response = await fetch("/api/publish-undrifted-lapzuli-controls")
        const body = (await response.json().catch(() => ({}))) as ControlsBody
        if (cancelled) return
        if (response.ok && body.final_standing === "implemented_publish_undrifted_lapzuli_human_compute_controls_proven") {
          setControls({ status: "ready", body })
          return
        }
        setControls({ status: "held", body })
      } catch (error) {
        if (cancelled) return
        setControls({ status: "error", message: error instanceof Error ? error.message : String(error) })
      }
    }

    void runControls()
    return () => {
      cancelled = true
    }
  }, [])

  async function submitControl(action: "dispatch_now" | "schedule") {
    setActionResult({ action, standing: "submitting", mutation_count: 0, external_publication_effects: 0 })
    try {
      const response = await fetch("/api/publish-undrifted-lapzuli-controls", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const body = (await response.json().catch(() => ({}))) as ControlsBody
      setActionResult(body.action_result ?? {
        action,
        standing: response.ok ? "accepted" : body.held_check ?? body.final_standing ?? "held",
        mutation_count: 0,
        external_publication_effects: 0,
      })
      setControls(response.ok ? { status: "ready", body } : { status: "held", body })
    } catch (error) {
      setActionResult({
        action,
        standing: error instanceof Error ? error.message : String(error),
        mutation_count: 0,
        external_publication_effects: 0,
      })
    }
  }

  const body = proof.status === "satisfied" || proof.status === "held" ? proof.body : null
  const publication = body?.persistence_state_used?.publication_object
  const recoveredFrom = body?.persistence_state_used?.recovered_from ?? []
  const admitted = proof.status === "satisfied"
  const controlsBody = controls.status === "ready" || controls.status === "held" ? controls.body : null
  const destinationRows = controlsBody?.destinations ?? []
  const controlsEnabled = controlsBody?.lapzuli_distribution?.controls_enabled === true

  return (
    <main className="registry-encounter-shell" style={registryTokenStyle}>
      {renderHeader({ title: "unDrifted" })}
      <section
        className="registry-encounter registry-encounter-lapis"
        data-surface="publish_undrifted"
        data-passage-surface="/publish-undrifted"
        data-resulting-encounter="/undrifted"
      >
        <div className="registry-encounter-inner">
          <p className="registry-kicker">/publish-undrifted</p>
          <h1>publish_undrifted</h1>
          <p className="registry-lede">
            Environment resolves env.role_call. env.role_call invokes Persistence. Persistence
            returns governed Drift Report state for deterministic passage.
          </p>

          <dl className="registry-fact-grid">
            <div>
              <dt>Passage</dt>
              <dd>{body?.passage_surface ?? "/publish-undrifted"}</dd>
            </div>
            <div>
              <dt>Encounter</dt>
              <dd>{body?.resulting_encounter ?? "/undrifted"}</dd>
            </div>
            <div>
              <dt>Standing</dt>
              <dd>{proof.status === "loading" ? "resolving" : body?.final_standing ?? proof.status}</dd>
            </div>
            <div>
              <dt>Determination</dt>
              <dd>{body?.determination ?? (proof.status === "error" ? proof.message : "pending")}</dd>
            </div>
          </dl>

          {publication ? (
            <section className="registry-proof-section" aria-labelledby="publish-proof-target">
              <p className="registry-kicker">Persisted DR State</p>
              <h2 id="publish-proof-target">{publication.title}</h2>
              <dl className="registry-proof-list">
                <div>
                  <dt>Dispatch</dt>
                  <dd>{publication.dispatch_key}</dd>
                </div>
                <div>
                  <dt>Route</dt>
                  <dd>{publication.internal_route}</dd>
                </div>
                <div>
                  <dt>Source SHA-256</dt>
                  <dd>{publication.source_sha256}</dd>
                </div>
                <div>
                  <dt>Source Drive ID</dt>
                  <dd>{publication.source_drive_id}</dd>
                </div>
              </dl>
            </section>
          ) : null}

          <section className="registry-proof-section" aria-labelledby="publish-proof-recovery">
            <p className="registry-kicker">Recovery</p>
            <h2 id="publish-proof-recovery">{body?.event_identity ?? "Awaiting event identity"}</h2>
            {recoveredFrom.length > 0 ? (
              <ul className="registry-proof-sources">
                {recoveredFrom.map((source) => <li key={source}>{source}</li>)}
              </ul>
            ) : (
              <p>{proof.status === "loading" ? "Recovering governed state." : body?.held_check ?? "No recovery proof returned."}</p>
            )}
          </section>

          <section className="registry-proof-section" aria-labelledby="lapzuli-controls">
            <p className="registry-kicker">Lapzuli Controls</p>
            <h2 id="lapzuli-controls">{controlsBody?.final_standing ?? (controls.status === "loading" ? "Recovering controls" : "Controls held")}</h2>
            <dl className="registry-proof-list">
              <div>
                <dt>Selected Object</dt>
                <dd>{controlsBody?.passage?.object_key ?? controlsBody?.passage?.publication_object?.dispatch_key ?? "pending"}</dd>
              </div>
              <div>
                <dt>RECOVER</dt>
                <dd>{controlsBody?.controls?.recover ?? (controls.status === "loading" ? "resolving" : controls.status)}</dd>
              </div>
              <div>
                <dt>PREFLIGHT</dt>
                <dd>{controlsBody?.controls?.preflight ?? controlsBody?.held_check ?? "pending"}</dd>
              </div>
              <div>
                <dt>OPEN PASSAGE</dt>
                <dd>{controlsBody?.controls?.open_passage ?? "pending"}</dd>
              </div>
              <div>
                <dt>Lapzuli Standing</dt>
                <dd>{controlsBody?.lapzuli_distribution?.route_standing ?? "pending"}</dd>
              </div>
              <div>
                <dt>Dizzy</dt>
                <dd>{controlsBody?.dizzy?.worker_identity ?? controlsBody?.dizzy?.standing ?? "pending"}</dd>
              </div>
            </dl>

            <div className="registry-control-actions" aria-label="Lapzuli distribution controls">
              <button type="button" disabled={!controlsEnabled} onClick={() => void submitControl("dispatch_now")}>
                Dispatch Now
              </button>
              <button type="button" disabled={!controlsEnabled} onClick={() => void submitControl("schedule")}>
                Schedule
              </button>
            </div>
            <p className="registry-control-standing">
              {actionResult
                ? `${actionResult.action}: ${actionResult.standing}; mutations ${actionResult.mutation_count ?? 0}; external effects ${actionResult.external_publication_effects ?? 0}`
                : `dispatch_now: ${controlsBody?.controls?.dispatch_now ?? "pending"}; schedule: ${controlsBody?.controls?.schedule ?? "pending"}`}
            </p>
          </section>

          <section className="registry-proof-section" aria-labelledby="destination-controls">
            <p className="registry-kicker">Qualified Destinations</p>
            <h2 id="destination-controls">{destinationRows.length} destinations returned from Lapzuli</h2>
            {destinationRows.length > 0 ? (
              <ul className="registry-destination-list">
                {destinationRows.slice(0, 6).map((destination) => (
                  <li className="registry-destination-row" key={destination.outlet_key}>
                    <span>{destination.display_name ?? destination.outlet_key}</span>
                    <span>{destination.route_type ?? "route pending"}</span>
                    <span>{destination.qualification_standing ?? "unverified"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{controls.status === "loading" ? "Recovering destination qualifications." : "No independently qualified destinations returned."}</p>
            )}
          </section>

          {admitted && body?.next_permitted_transition ? (
            <a className="registry-primary-link" href={body.next_permitted_transition}>
              Continue to /undrifted
            </a>
          ) : null}
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
