import { useMemo, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type { EncounterMediaRow } from "../types/encounterRendererTypes"

type ProofState =
  | { status: "idle" }
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

type ReportState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "satisfied"; body: DistributionReportBody }
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
  publication_object_key?: string
  desk_key?: string
  source_distribution_hold?: boolean
  object_profile_standing?: string | null
  distribution_state?: string
}

type DistributionArticle = {
  dispatch_key: string
  issue_key: string
  desk_key: string
  title: string
  internal_route: string | null
  external_url: string | null
  publication_status: string
  published_at: string | null
  publication_object_key: string
  source_sha256: string | null
  source_drive_id: string | null
  source_distribution_hold: boolean
  object_profile_standing: string | null
  distribution_state: string
  allowed_channels: Array<{
    outlet_key?: string
    outlet_name?: string
    distribution_mode?: string
    standing?: string
    fit_score?: number
    account_standing?: string
  }>
}

type DistributionReportBody = {
  issue_key: string | null
  article_count: number
  desks: Record<string, DistributionArticle[]>
  articles: DistributionArticle[]
  action_summary: {
    ready_for_route_resolution: number
    profile_required: number
    source_hold: number
    distributed: number
  }
}

type ControlsBody = {
  final_standing?: string
  held_check?: string | null
  controls?: {
    select_object?: PublicationObject[]
    selected_channel?: DistributionArticle["allowed_channels"][number] | null
    selected_route?: unknown | null
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
  shortLabel: string
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
    shortLabel: "DESK",
    x: 17,
    y: 73,
    status: (body) => body ? `${body.controls?.select_object?.length ?? 0} eligible` : "awaiting pull",
  },
  {
    key: "pubpac",
    label: "PUBPAC",
    shortLabel: "PUB",
    x: 31,
    y: 73,
    status: (body) => body?.passage?.object_key ?? "awaiting pull",
  },
  {
    key: "publication",
    label: "PUBLICATION",
    shortLabel: "PUBN",
    x: 44,
    y: 73,
    status: (body, proof) => body ? (proof.status === "satisfied" ? "passage ready" : proof.status) : "awaiting pull",
  },
  {
    key: "social",
    label: "SOCIAL",
    shortLabel: "SOC",
    x: 57,
    y: 73,
    status: (body) => body?.controls?.dispatch_now ?? "awaiting pull",
  },
  {
    key: "audience",
    label: "AUDIENCE",
    shortLabel: "AUD",
    x: 70,
    y: 73,
    status: (body) => body ? `${body.destinations?.length ?? 0} destinations` : "awaiting pull",
  },
  {
    key: "campaigns",
    label: "CAMPAIGNS",
    shortLabel: "CAMP",
    x: 83,
    y: 73,
    status: (body) => body?.lapzuli_distribution?.route_standing ?? "awaiting pull",
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
  const [proof, setProof] = useState<ProofState>({ status: "idle" })
  const [controls, setControls] = useState<ControlState>({ status: "idle" })
  const [report, setReport] = useState<ReportState>({ status: "idle" })
  const [selectedStation, setSelectedStation] = useState("publication")
  const [selectedObjectKey, setSelectedObjectKey] = useState<string>("")
  const [selectedOutletKey, setSelectedOutletKey] = useState<string>("")
  const [actionAttempted, setActionAttempted] = useState(false)

  async function runProof() {
    setProof({ status: "loading" })
    try {
      const response = await fetch("/api/publish-undrifted-proof", { method: "POST" })
      const body = (await response.json().catch(() => ({}))) as ProofBody
      if (response.ok && body.final_standing === "implemented_and_passage_proven") {
        setProof({ status: "satisfied", body })
        return
      }
      setProof({ status: "held", body })
    } catch (error) {
      setProof({ status: "error", message: error instanceof Error ? error.message : String(error) })
    }
  }

  async function runControls() {
    setControls({ status: "loading" })
    try {
      const params = new URLSearchParams()
      if (selectedObjectKey) params.set("publication_object_key", selectedObjectKey)
      if (selectedOutletKey) params.set("outlet_key", selectedOutletKey)
      const suffix = params.toString() ? `?${params.toString()}` : ""
      const response = await fetch(`/api/publish-undrifted-lapzuli-controls${suffix}`)
      const body = (await response.json().catch(() => ({}))) as ControlsBody
      setControls(response.ok ? { status: "satisfied", body } : { status: "held", body })
    } catch (error) {
      setControls({ status: "error", message: error instanceof Error ? error.message : String(error) })
    }
  }

  async function runDistributionReport() {
    setReport({ status: "loading" })
    try {
      const response = await fetch("/api/undrifted-distribution-report")
      const body = (await response.json().catch(() => ({}))) as DistributionReportBody
      if (!response.ok) throw new Error("Unable to load current unDrifted distribution report")
      setReport({ status: "satisfied", body })
    } catch (error) {
      setReport({ status: "error", message: error instanceof Error ? error.message : String(error) })
    }
  }

  async function pullReport() {
    await Promise.all([runProof(), runControls(), runDistributionReport()])
  }

  async function runAction(action: "dispatch_now" | "schedule") {
    setActionAttempted(true)
    setControls({ status: "loading" })
    try {
      const response = await fetch("/api/publish-undrifted-lapzuli-controls", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action,
          publication_object_key: selectedObjectKey,
          outlet_key: selectedOutletKey,
        }),
      })
      const body = (await response.json().catch(() => ({}))) as ControlsBody
      setControls(response.ok ? { status: "satisfied", body } : { status: "held", body })
    } catch (error) {
      setControls({ status: "error", message: error instanceof Error ? error.message : String(error) })
    }
  }

  const proofBody = proof.status === "satisfied" || proof.status === "held" ? proof.body : null
  const controlsBody = controls.status === "satisfied" || controls.status === "held" ? controls.body : null
  const reportBody = report.status === "satisfied" ? report.body : null
  const reportPublication = reportBody?.articles.find((article) => article.publication_object_key === selectedObjectKey) ?? null
  const selectedChannels = reportPublication?.allowed_channels ?? []
  const publication = reportPublication
    ? {
        dispatch_key: reportPublication.dispatch_key,
        title: reportPublication.title,
        internal_route: reportPublication.internal_route ?? undefined,
        source_sha256: reportPublication.source_sha256 ?? undefined,
        source_drive_id: reportPublication.source_drive_id ?? undefined,
        publication_object_key: reportPublication.publication_object_key,
        desk_key: reportPublication.desk_key,
        source_distribution_hold: reportPublication.source_distribution_hold,
        object_profile_standing: reportPublication.object_profile_standing,
        distribution_state: reportPublication.distribution_state,
      }
    : controlsBody?.passage?.publication_object ?? proofBody?.persistence_state_used?.publication_object ?? null
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
  const reportLoading = report.status === "loading"
  const actionSelectionReady = Boolean(selectedObjectKey && selectedOutletKey)

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
          <div className="publish-chamber-stations" aria-label="Publication chamber stations">
            {STATIONS.map((station) => (
              <button
                key={station.key}
                className="publish-station-button"
                style={{ "--station-x": `${station.x}%`, "--station-y": `${station.y}%` } as CSSProperties}
                aria-pressed={selectedStation === station.key}
                aria-label={station.label}
                onClick={() => setSelectedStation(station.key)}
              >
                <span className="publish-station-label-full">{station.label}</span>
                <span className="publish-station-label-short" aria-hidden="true">{station.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="publish-chamber-console">
          <section className="publish-console-primary" aria-labelledby="publish-console-selected">
            <p className="registry-kicker">{selected.label}</p>
            <h2 id="publish-console-selected">{publication?.title ?? "Pull report to recover current publication state"}</h2>
            <button
              className="publish-pull-report"
              type="button"
              onClick={() => void pullReport()}
              disabled={proof.status === "loading" || controls.status === "loading" || reportLoading}
            >
              Pull Report
            </button>
            {reportBody ? (
              <div className="publish-selection-grid">
                <label>
                  <span>Article</span>
                  <select
                    value={selectedObjectKey}
                    onChange={(event) => {
                      setSelectedObjectKey(event.target.value)
                      setSelectedOutletKey("")
                      setActionAttempted(false)
                    }}
                  >
                    <option value="">Select article</option>
                    {reportBody.articles.map((article) => (
                      <option key={article.publication_object_key} value={article.publication_object_key}>
                        {article.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Channel</span>
                  <select
                    value={selectedOutletKey}
                    onChange={(event) => {
                      setSelectedOutletKey(event.target.value)
                      setActionAttempted(false)
                    }}
                    disabled={!selectedObjectKey}
                  >
                    <option value="">Select channel</option>
                    {selectedChannels.map((channel) => (
                      <option key={channel.outlet_key} value={channel.outlet_key}>
                        {channel.outlet_name ?? channel.outlet_key} / {standingLabel(channel.distribution_mode)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
            <dl className="registry-proof-list publish-proof-list">
              <div>
                <dt>Issue</dt>
                <dd>{reportBody?.issue_key ?? "pending"}</dd>
              </div>
              <div>
                <dt>Published articles</dt>
                <dd>{reportBody?.article_count ?? "pending"}</dd>
              </div>
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
              <div>
                <dt>Source Hold</dt>
                <dd>{publication?.source_distribution_hold === true ? "held" : publication ? "clear" : "pending"}</dd>
              </div>
              <div>
                <dt>Selected Channel</dt>
                <dd>{selectedOutletKey || "pending"}</dd>
              </div>
            </dl>
          </section>

          <section className="publish-console-rail" aria-labelledby="publish-desk-report">
            <p className="registry-kicker">Current issue</p>
            <h2 id="publish-desk-report">DESK DISTRIBUTION REPORT</h2>
            <ul className="registry-proof-sources publish-proof-sources">
              {reportBody?.articles.map((article) => (
                <li key={article.dispatch_key}>
                  <span>{article.desk_key.replaceAll("_", " ")} · {article.title}</span>
                  <strong>
                    {standingLabel(article.distribution_state)} · {article.allowed_channels.length} channels
                  </strong>
                </li>
              ))}
              {report.status === "idle" ? (
                <li><span>Pull Report</span><strong>awaiting current issue</strong></li>
              ) : null}
              {report.status === "error" ? (
                <li><span>Report</span><strong>{report.message}</strong></li>
              ) : null}
            </ul>
          </section>

          <section className="publish-console-rail" aria-labelledby="publish-control-sequence">
            <p className="registry-kicker">Distribution actions</p>
            <h2 id="publish-control-sequence">SOURCE / CHANNEL / ROUTE / ASSIGNMENT</h2>
            <div className="publish-control-grid">
              <span>{reportBody ? `${reportBody.article_count} published` : "awaiting report"}</span>
              <span>{reportBody ? `${reportBody.action_summary.profile_required} profile required` : "awaiting report"}</span>
              <span>{reportBody ? `${reportBody.action_summary.source_hold} source hold` : "awaiting report"}</span>
              <span>{reportBody ? `${reportBody.action_summary.distributed} distributed` : "awaiting report"}</span>
            </div>
            <div className="publish-actions" aria-label="Distribution controls">
              <button type="button" onClick={() => void runAction("schedule")} disabled={!actionSelectionReady || controls.status === "loading"}>
                Schedule
              </button>
              <button type="button" onClick={() => void runAction("dispatch_now")} disabled={!actionSelectionReady || controls.status === "loading"}>
                Dispatch
              </button>
            </div>
            <p className="publish-action-standing">
              {reportBody
                ? actionAttempted
                  ? standingLabel(actionStanding ?? controlsBody?.lapzuli_distribution?.route_standing ?? controls.status)
                  : "held until a source-specific action call is bound"
                : standingLabel(actionStanding ?? controlsBody?.lapzuli_distribution?.route_standing ?? controls.status)}
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
