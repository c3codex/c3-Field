import { useEffect, useMemo, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type { EncounterMediaRow } from "../types/encounterRendererTypes"

type ProofState =
  | { status: "loading" }
  | { status: "satisfied"; body: ProofBody }
  | { status: "held"; body: ProofBody }
  | { status: "error"; message: string }

type ControlState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "satisfied"; body: ControlsBody }
  | { status: "held"; body: ControlsBody }
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
    publication_object?: PublicationObject
    recovered_from?: string[]
  }
  held_check?: string
}

type PublicationObject = {
  dispatch_key?: string
  title?: string
  internal_route?: string
  source_sha256?: string
  source_drive_id?: string
}

type ControlsBody = {
  final_standing?: string
  held_check?: string | null
  controls?: {
    select_object?: PublicationObject[]
    recover?: string
    preflight?: string
    open_passage?: string
    dispatch_now?: string
    schedule?: string
  }
  passage?: {
    publication_object?: PublicationObject
    object_key?: string | null
    recovery_path?: string
    preflight?: Array<{ key: string; standing: string }>
  }
  lapzuli_distribution?: {
    route_standing?: string
    controls_enabled?: boolean
    routes?: unknown[]
    executions?: unknown[]
  }
  destinations?: unknown[]
  dizzy?: {
    standing?: string
    worker_identity?: string | null
    role_identity?: string | null
    external_publication_effects?: number
    autonomous_distribution_authority?: string
  }
  action_result?: {
    action?: string
    standing?: string
    mutation_count?: number
    external_publication_effects?: number
  }
}

type Station = {
  key: string
  label: string
  x: number
  y: number
  status: (body: ControlsBody | null, proof: ProofState) => string
}

type Props = {
  registryTokenStyle: CSSProperties
  mediaRows: EncounterMediaRow[]
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

const STATIONS: Station[] = [
  {
    key: "desks",
    label: "DESKS",
    x: 17,
    y: 73,
    status: (body) => `${body?.controls?.select_object?.length ?? 0} eligible`,
  },
  {
    key: "pubpac",
    label: "PUBPAC",
    x: 31,
    y: 73,
    status: (body) => body?.passage?.object_key ?? "pending",
  },
  {
    key: "publication",
    label: "PUBLICATION",
    x: 44,
    y: 73,
    status: (_body, proof) => proof.status === "satisfied" ? "passage ready" : proof.status,
  },
  {
    key: "social",
    label: "SOCIAL",
    x: 57,
    y: 73,
    status: (body) => body?.controls?.dispatch_now ?? "held",
  },
  {
    key: "audience",
    label: "AUDIENCE",
    x: 70,
    y: 73,
    status: (body) => `${body?.destinations?.length ?? 0} destinations`,
  },
  {
    key: "campaigns",
    label: "CAMPAIGNS",
    x: 83,
    y: 73,
    status: (body) => body?.lapzuli_distribution?.route_standing ?? "held",
  },
]

function mediaUrl(row: EncounterMediaRow | undefined): string | null {
  if (!row || row.is_active === false) return null
  const meta = row.metadata as Record<string, unknown> | null
  return resolveRuntimeMediaUrl({
    publicUrl: typeof meta?.exact_url_seated === "string" ? meta.exact_url_seated : null,
    bucketName: row.storage_bucket,
    storagePath: row.storage_path,
  })
}

function standingLabel(value: string | null | undefined) {
  return value?.replaceAll("_", " ") ?? "pending"
}

export default function PublishUndriftedPassage({
  registryTokenStyle,
  mediaRows,
  renderHeader,
  renderSystemFooter,
}: Props) {
  const [proof, setProof] = useState<ProofState>({ status: "loading" })
  const [controls, setControls] = useState<ControlState>({ status: "idle" })
  const [selectedStation, setSelectedStation] = useState("publication")

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

    async function runControls() {
      setControls({ status: "loading" })
      try {
        const response = await fetch("/api/publish-undrifted-lapzuli-controls")
        const body = (await response.json().catch(() => ({}))) as ControlsBody
        if (cancelled) return
        setControls(response.ok ? { status: "satisfied", body } : { status: "held", body })
      } catch (error) {
        if (cancelled) return
        setControls({ status: "error", message: error instanceof Error ? error.message : String(error) })
      }
    }

    void runProof()
    void runControls()
    return () => {
      cancelled = true
    }
  }, [])

  async function runAction(action: "dispatch_now" | "schedule") {
    setControls({ status: "loading" })
    try {
      const response = await fetch("/api/publish-undrifted-lapzuli-controls", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const body = (await response.json().catch(() => ({}))) as ControlsBody
      setControls(response.ok ? { status: "satisfied", body } : { status: "held", body })
    } catch (error) {
      setControls({ status: "error", message: error instanceof Error ? error.message : String(error) })
    }
  }

  const proofBody = proof.status === "satisfied" || proof.status === "held" ? proof.body : null
  const controlsBody = controls.status === "satisfied" || controls.status === "held" ? controls.body : null
  const publication =
    controlsBody?.passage?.publication_object ??
    proofBody?.persistence_state_used?.publication_object ??
    null
  const recoveredFrom = proofBody?.persistence_state_used?.recovered_from ?? []
  const chamberUrl = useMemo(
    () =>
      mediaUrl(mediaRows.find((row) => row.media_role === "lapis_publication_chamber_operator_environment")) ??
      mediaUrl(mediaRows.find((row) => row.media_role === "undrifted_publication_masthead")),
    [mediaRows],
  )
  const selected = STATIONS.find((station) => station.key === selectedStation) ?? STATIONS[2]
  const preflight = controlsBody?.passage?.preflight ?? []
  const actionStanding = controlsBody?.action_result?.standing ?? controlsBody?.held_check

  return (
    <main className="registry-encounter-shell" style={registryTokenStyle}>
      {renderHeader({ title: "unDrifted" })}
      <section
        className="registry-encounter registry-encounter-lapis publish-chamber"
        data-surface="publish_undrifted"
        data-passage-surface="/publish-undrifted"
        data-resulting-encounter="/undrifted"
      >
        <div className="publish-chamber-stage" aria-label="publish-undrifted operator chamber">
          {chamberUrl ? <img className="publish-chamber-image" src={chamberUrl} alt="" loading="eager" /> : null}
          <div className="publish-chamber-shade" />
          <div className="publish-chamber-heading">
            <p className="registry-kicker">/publish-undrifted</p>
            <h1>Human operator chamber</h1>
          </div>
          <div className="publish-chamber-stations" aria-label="Publication chamber stations">
            {STATIONS.map((station) => (
              <button
                key={station.key}
                className="publish-station-button"
                style={{ "--station-x": `${station.x}%`, "--station-y": `${station.y}%` } as CSSProperties}
                aria-pressed={selectedStation === station.key}
                onClick={() => setSelectedStation(station.key)}
              >
                <span>{station.label}</span>
                <small>{standingLabel(station.status(controlsBody, proof))}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="publish-chamber-console">
          <section className="publish-console-primary" aria-labelledby="publish-console-selected">
            <p className="registry-kicker">{selected.label}</p>
            <h2 id="publish-console-selected">{publication?.title ?? "Publication object pending"}</h2>
            <dl className="registry-proof-list publish-proof-list">
              <div>
                <dt>Dispatch</dt>
                <dd>{publication?.dispatch_key ?? "pending"}</dd>
              </div>
              <div>
                <dt>Route</dt>
                <dd>{publication?.internal_route ?? proofBody?.resulting_encounter ?? "/undrifted"}</dd>
              </div>
              <div>
                <dt>Source SHA-256</dt>
                <dd>{publication?.source_sha256 ?? "pending"}</dd>
              </div>
              <div>
                <dt>Source Drive ID</dt>
                <dd>{publication?.source_drive_id ?? "pending"}</dd>
              </div>
            </dl>
          </section>

          <section className="publish-console-rail" aria-labelledby="publish-control-sequence">
            <p className="registry-kicker">Human / Compute</p>
            <h2 id="publish-control-sequence">PULL REPORT / RECOVER STATE / PREFLIGHT / OPEN PASSAGE</h2>
            <div className="publish-control-grid">
              <span>{standingLabel(`${controlsBody?.controls?.select_object?.length ?? 0} eligible`)}</span>
              <span>{standingLabel(controlsBody?.controls?.recover ?? proof.status)}</span>
              <span>{standingLabel(controlsBody?.controls?.preflight ?? controls.status)}</span>
              <span>{standingLabel(controlsBody?.controls?.open_passage ?? proof.status)}</span>
            </div>
            <div className="publish-actions" aria-label="Distribution controls">
              <button type="button" onClick={() => void runAction("dispatch_now")}>
                Dispatch
              </button>
              <button type="button" onClick={() => void runAction("schedule")}>
                Schedule
              </button>
            </div>
            <p className="publish-action-standing">
              {standingLabel(actionStanding ?? controlsBody?.lapzuli_distribution?.route_standing ?? controls.status)}
            </p>
          </section>

          <section className="publish-console-rail" aria-labelledby="publish-evidence">
            <p className="registry-kicker">Evidence</p>
            <h2 id="publish-evidence">{proofBody?.event_identity ?? "Route evidence"}</h2>
            <ul className="registry-proof-sources publish-proof-sources">
              {preflight.slice(0, 8).map((item) => (
                <li key={item.key}>
                  <span>{standingLabel(item.key)}</span>
                  <strong>{standingLabel(item.standing)}</strong>
                </li>
              ))}
              {recoveredFrom.map((source) => (
                <li key={source}>
                  <span>{source}</span>
                  <strong>recovered</strong>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
