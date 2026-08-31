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

  const body = proof.status === "satisfied" || proof.status === "held" ? proof.body : null
  const publication = body?.persistence_state_used?.publication_object
  const recoveredFrom = body?.persistence_state_used?.recovered_from ?? []
  const admitted = proof.status === "satisfied"

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
