// GovernanceAuditSurface — FREE-to-Codex governance audit for Crystal, Obsidian, Lapis directories.
// Route: /governance-audit (unpromoted; direct URL only; no auth gate active)
// Data: live Supabase queries — no hardcoded audit truth.
// Scope: crystal_seat_directory, obsidian_chamber_directory, lapis_chamber_directory.

import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

// ── Audit scope ────────────────────────────────────────────────────────────────

const CRYSTAL_SURFACE_KEYS = [
  "crystal_seat_intro",
  "crystal_seat_threshold",
  "crystal_seat_orientation",
  "crystal_seat_encounter",
] as const

const OBSIDIAN_SURFACE_KEYS = [
  "obsidian_chamber_orientation",
  "obsidian_chamber_encounter_surface",
  "obsidian_chamber_C1_compact",
] as const

const LAPIS_SURFACE_KEYS = ["lapis_chamber_encounter"] as const

// Held/legacy surface_keys to audit-trace
const HELD_SURFACE_KEYS = [
  "crystal_seat_split_path",
  "crystal_seat_orientation_passage",
  "obsidian_to_marble_passage_video",
  "obsidian_chamber_orientation_passage",
  "eval_passage",
  "structure_passage",
  "publication_dispatch",
  "measures_structured_environments",
] as const

// All registry_keys to fetch (directories + surface registry_keys + legacy)
const REGISTRY_KEYS = [
  "crystal_seat_directory",
  "obsidian_chamber_directory",
  "lapis_chamber_directory",
  "crystal_seat_intro",
  "ai_isnt_broken_intro",
  "about_measures_registry",
  "undrifted",
  "obsidian_chamber_orientation",
  "measures_assessment",
  "obsidian_chamber_C1_compact",
  "marble_chamber_orientation",
  "marble_chamber_encounter",
  "map_integrity_governance",
  "marble_chamber_C2_agreement",
  "marble_chamber_C2_resolution",
  "eval_passage",
  "obsidian_to_marble_passage_video",
  "structure_passage",
  "obsidian_chamber_orientation_passage",
  "structural_drift_publication",
  "evaluate_structure_path",
] as const

const ENCOUNTER_DEF_KEYS = [
  "crystal_seat_intro",
  "ai_isnt_broken_intro",
  "about_measures_registry",
  "undrifted",
  "obsidian_chamber_orientation",
  "measures_assessment",
  "obsidian_chamber_C1_compact",
  "marble_chamber_orientation",
  "marble_chamber_encounter",
  "map_integrity_governance",
  "marble_chamber_C2_agreement",
  "marble_chamber_C2_resolution",
  "eval_passage",
  "structure_passage",
  "structural_drift_publication",
] as const

const MEDIA_ROLES = [
  "intro_hook_video",
  "left_hero_fracture",
  "left_hero_fracture_motion",
  "right_measured_hero",
  "measured_hero_motion_graphic",
  "measures_position",
  "official_codexstone_seal",
  "about_measures_registry_video",
  "lapis_background",
  "obsidian",
  "obsidian_assessment_surface_visual",
  "obsidian_contact_surface_visual",
  "obsidian_eval_result_surface_visual",
  "assessment_report_orientation",
  "structural_environment_passage_video",
  "installation_tone_marble",
  "crystal_tone",
  "lapis_tone",
  "obsidian_tone",
  "marble_tone",
  "registry_mark",
  "agents_with_keys_cover",
  "fables_and_myths_cover",
  "ai_isnt_broken_landing",
  "measures_registry_logo",
] as const

// Primary media role per surface key (for gap detection)
const SURFACE_PRIMARY_MEDIA_ROLE: Partial<Record<string, string>> = {
  crystal_seat_intro: "intro_hook_video",
  crystal_seat_threshold: "intro_hook_video",
  crystal_seat_orientation: "measures_position",
  crystal_seat_encounter: "about_measures_registry_video",
  lapis_chamber_encounter: "lapis_background",
  obsidian_chamber_orientation: "obsidian",
  obsidian_chamber_encounter_surface: "obsidian_assessment_surface_visual",
  obsidian_to_marble_passage_video: "structural_environment_passage_video",
  marble_chamber_orientation: "assessment_report_orientation",
  marble_chamber_C2_compact: "right_measured_hero",
}

// ── Types ──────────────────────────────────────────────────────────────────────

type RegistryRow = {
  registry_key: string
  display_title: string | null
  registry_family: string | null
  release_state: string | null
  access_state: string | null
  is_active: boolean
  metadata: Record<string, unknown> | null
}

type AssignmentRow = {
  surface_key: string
  registry_key: string
  encounter_key: string | null
  material_identity: string
  chamber_assignment: string
  public_routes: string[]
  metadata: Record<string, unknown> | null
}

type DefRow = {
  encounter_key: string
  display_title: string | null
  metadata: Record<string, unknown> | null
}

type MediaRow = {
  media_role: string
  storage_bucket: string
  storage_path: string
  mime_type: string | null
  is_active: boolean | null
}

type DispatchRow = {
  dispatch_key: string
  publication_key: string
  title: string | null
  external_platform: string | null
  external_url: string | null
  status: string | null
  metadata: Record<string, unknown> | null
}

type AuditData = {
  registryByKey: Map<string, RegistryRow>
  assignmentBySurface: Map<string, AssignmentRow>
  defByKey: Map<string, DefRow>
  mediaByRole: Map<string, MediaRow>
  dispatches: DispatchRow[]
  errors: string[]
}

type StatusGroup =
  | "hot"
  | "held"
  | "inactive"
  | "legacy_alias"
  | "audit_trace"
  | "gap"
  | "renderer_gap"
  | "media_gap"
  | "content_gap"

// ── Helpers ────────────────────────────────────────────────────────────────────

function asRecord(v: unknown): Record<string, unknown> | null {
  return v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null
}

function asStr(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null
}

function deriveStatus(
  surfaceKey: string,
  registry: RegistryRow | undefined,
  assignment: AssignmentRow | undefined,
  def: DefRow | undefined,
  mediaByRole: Map<string, MediaRow>,
): StatusGroup {
  if (!registry) return "gap"
  if (!registry.is_active) return "inactive"

  const meta = asRecord(assignment?.metadata) ?? {}
  const standing = asStr(meta.standing)
  if (standing === "legacy_alias") return "legacy_alias"
  if (standing === "audit_trace") return "audit_trace"

  if (registry.release_state !== "released") return "held"
  if (!assignment) return "renderer_gap"
  if (meta.renderer_gap === true) return "renderer_gap"

  const primaryRole = SURFACE_PRIMARY_MEDIA_ROLE[surfaceKey]
  if (primaryRole) {
    const mediaRow = mediaByRole.get(primaryRole)
    if (!mediaRow || mediaRow.is_active === false) return "media_gap"
  }

  if (!def) return "content_gap"
  return "hot"
}

// ── DB loader ─────────────────────────────────────────────────────────────────

async function loadAuditData(): Promise<AuditData> {
  const errors: string[] = []

  const [regResult, assignResult, defResult, mediaResult, dispResult] = await Promise.all([
    supabase
      .from("measures_registry")
      .select("registry_key, display_title, registry_family, release_state, access_state, is_active, metadata")
      .in("registry_key", [...REGISTRY_KEYS]),
    supabase
      .from("measures_encounter_surface_assignment")
      .select("surface_key, registry_key, encounter_key, material_identity, chamber_assignment, public_routes, metadata"),
    supabase
      .from("measures_encounter_def")
      .select("encounter_key, display_title, metadata")
      .in("encounter_key", [...ENCOUNTER_DEF_KEYS]),
    supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .in("media_role", [...MEDIA_ROLES]),
    supabase
      .from("measures_publication_dispatch")
      .select("dispatch_key, publication_key, title, external_platform, external_url, status, metadata")
      .eq("publication_key", "undrifted")
      .order("dispatch_key", { ascending: true }),
  ])

  if (regResult.error) errors.push(`measures_registry: ${regResult.error.message}`)
  if (assignResult.error) errors.push(`surface_assignment: ${assignResult.error.message}`)
  if (defResult.error) errors.push(`encounter_def: ${defResult.error.message}`)
  if (mediaResult.error) errors.push(`media_map: ${mediaResult.error.message}`)
  if (dispResult.error) errors.push(`publication_dispatch: ${dispResult.error.message}`)

  const registryByKey = new Map<string, RegistryRow>()
  for (const r of regResult.data ?? []) registryByKey.set(r.registry_key, r as RegistryRow)

  const assignmentBySurface = new Map<string, AssignmentRow>()
  for (const r of assignResult.data ?? []) assignmentBySurface.set(r.surface_key, r as AssignmentRow)

  const defByKey = new Map<string, DefRow>()
  for (const r of defResult.data ?? []) defByKey.set(r.encounter_key, r as DefRow)

  // For duplicate roles, prefer active row
  const mediaByRole = new Map<string, MediaRow>()
  for (const r of mediaResult.data ?? []) {
    const existing = mediaByRole.get(r.media_role)
    if (!existing || (r.is_active === true && existing.is_active !== true)) {
      mediaByRole.set(r.media_role, r as MediaRow)
    }
  }

  return {
    registryByKey,
    assignmentBySurface,
    defByKey,
    mediaByRole,
    dispatches: (dispResult.data ?? []) as DispatchRow[],
    errors,
  }
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const S = {
  shell: {
    minHeight: "100vh",
    background: "#090a0e",
    color: "#c2cad6",
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: "0.77rem",
    lineHeight: 1.65,
    padding: "2rem 1.75rem",
    boxSizing: "border-box" as const,
    maxWidth: "100%",
    overflowX: "auto" as const,
  },
  header: {
    borderBottom: "1px solid rgba(194,202,214,0.12)",
    paddingBottom: "1.25rem",
    marginBottom: "2rem",
  },
  h1: {
    margin: "0 0 0.3rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#e0e6f0",
    letterSpacing: "-0.01em",
  },
  h2: {
    margin: "0",
    fontSize: "0.84rem",
    fontWeight: 700,
    color: "#e0e6f0",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  h3: {
    margin: "0 0 0.4rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#b0baca",
    letterSpacing: "0.03em",
  },
  muted: {
    color: "rgba(194,202,214,0.45)",
    fontSize: "0.7rem",
  },
  section: {
    marginBottom: "2rem",
    padding: "1.1rem 1.25rem",
    border: "1px solid rgba(194,202,214,0.09)",
    borderRadius: "4px",
  },
  sectionHead: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.75rem",
    marginBottom: "0.85rem",
    paddingBottom: "0.6rem",
    borderBottom: "1px solid rgba(194,202,214,0.08)",
    flexWrap: "wrap" as const,
  },
  dirMeta: {
    display: "flex",
    gap: "1.25rem",
    marginBottom: "0.85rem",
    padding: "0.5rem 0.65rem",
    background: "rgba(194,202,214,0.035)",
    borderRadius: "3px",
    flexWrap: "wrap" as const,
    fontSize: "0.68rem",
    color: "rgba(194,202,214,0.55)",
  },
  card: {
    marginBottom: "0.65rem",
    padding: "0.7rem 0.85rem",
    border: "1px solid rgba(194,202,214,0.07)",
    borderRadius: "3px",
    background: "rgba(255,255,255,0.012)",
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "0.45rem",
    flexWrap: "wrap" as const,
  },
  surfKey: {
    fontWeight: 700,
    color: "#8fa0b8",
    fontSize: "0.78rem",
  },
  chain: {
    display: "grid",
    gridTemplateColumns: "6.5rem 1fr",
    gap: "0.18rem 0",
  },
  chainLabel: {
    color: "rgba(194,202,214,0.35)",
    fontSize: "0.66rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    alignSelf: "start" as const,
    paddingTop: "0.05rem",
  },
  chainValue: {
    color: "rgba(194,202,214,0.72)",
    fontSize: "0.7rem",
    wordBreak: "break-word" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "0.68rem",
  },
  th: {
    textAlign: "left" as const,
    padding: "0.28rem 0.45rem",
    color: "rgba(194,202,214,0.38)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    borderBottom: "1px solid rgba(194,202,214,0.09)",
    fontSize: "0.62rem",
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "0.28rem 0.45rem",
    borderBottom: "1px solid rgba(194,202,214,0.05)",
    verticalAlign: "top" as const,
    color: "rgba(194,202,214,0.65)",
  },
  errBanner: {
    margin: "0.65rem 0 0",
    padding: "0.6rem 0.75rem",
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.18)",
    borderRadius: "3px",
    color: "#fca5a5",
    fontSize: "0.7rem",
  },
  noteBanner: {
    marginTop: "0.65rem",
    padding: "0.5rem 0.65rem",
    background: "rgba(194,202,214,0.025)",
    borderRadius: "3px",
    color: "rgba(194,202,214,0.4)",
    fontSize: "0.68rem",
    lineHeight: 1.6,
  },
} as const

const BADGE_COLOR: Record<StatusGroup, string> = {
  hot: "#22c55e",
  held: "#facc15",
  inactive: "#6b7280",
  legacy_alias: "#f97316",
  audit_trace: "#a78bfa",
  gap: "#ef4444",
  renderer_gap: "#fb923c",
  media_gap: "#f59e0b",
  content_gap: "#fb7185",
}

function Badge({ status }: { status: StatusGroup }) {
  const c = BADGE_COLOR[status]
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.08rem 0.42rem",
        borderRadius: "2rem",
        border: `1px solid ${c}`,
        color: c,
        fontSize: "0.62rem",
        letterSpacing: "0.06em",
        fontWeight: 600,
        whiteSpace: "nowrap" as const,
      }}
    >
      {status.replace(/_/g, " ")}
    </span>
  )
}

// ── SurfaceCard ────────────────────────────────────────────────────────────────

function SurfaceCard({ sk, data }: { sk: string; data: AuditData }) {
  const assignment = data.assignmentBySurface.get(sk)
  const registry = assignment ? data.registryByKey.get(assignment.registry_key) : undefined
  const def = assignment?.encounter_key ? data.defByKey.get(assignment.encounter_key) : undefined

  const status = deriveStatus(sk, registry, assignment, def, data.mediaByRole)
  const meta = asRecord(assignment?.metadata) ?? {}
  const defMeta = asRecord(def?.metadata) ?? {}
  const contentProfile = asRecord(defMeta.content_profile)
  const mediaLocatorMeta = asRecord(defMeta.media_locator)
  const primaryMediaRole =
    asStr(mediaLocatorMeta?.primary_media_role) ?? SURFACE_PRIMARY_MEDIA_ROLE[sk] ?? null
  const mediaRow = primaryMediaRole ? data.mediaByRole.get(primaryMediaRole) : undefined

  // Chain values
  const codexPresent = !!registry
  const measuresLine = registry
    ? `release_state=${registry.release_state ?? "null"} | access_state=${registry.access_state ?? "null"} | is_active=${String(registry.is_active)}`
    : "absent — unavailable_to_FREE (registry_key not in ENCOUNTER_REGISTRY_KEYS)"
  const fieldLine = assignment
    ? [
        asStr(meta.style_profile) ? `style=${String(meta.style_profile)}` : "style=gap",
        asStr(meta.registered_surface) ? `reg=${String(meta.registered_surface)}` : "reg=gap",
        asStr(meta.directory_key) ? `dir=${String(meta.directory_key)}` : "dir=gap",
        contentProfile ? `content_authority=${asStr(contentProfile.content_authority) ?? "present"}` : "content_profile=gap",
      ].join(" | ")
    : "no surface_assignment — unavailable_to_FREE"
  const freeRenderLine = !assignment
    ? "gap: no surface_assignment"
    : meta.renderer_gap === true
    ? `renderer_gap — ${asStr(meta.renderer_gap_reason) ?? asStr(meta.standing_note) ?? "renderer not yet implemented"}`
    : `dispatched via chamber_assignment=${assignment.chamber_assignment}`
  const routeLine =
    assignment?.public_routes?.length
      ? assignment.public_routes.join(", ")
      : "(no public route)"
  const mediaStatusLine = mediaRow
    ? mediaRow.is_active === true
      ? `${primaryMediaRole}: active in ${mediaRow.storage_bucket}/${mediaRow.storage_path}`
      : `${primaryMediaRole}: row present but is_active=false — media_gap`
    : primaryMediaRole
    ? `${primaryMediaRole}: ABSENT from media_map — media_gap`
    : "no required media role"

  const opticsColor = status === "hot" ? "#22c55e" : status === "media_gap" ? "#f59e0b" : "rgba(194,202,214,0.72)"

  return (
    <article style={S.card}>
      <div style={S.cardHead}>
        <span style={S.surfKey}>{sk}</span>
        <Badge status={status} />
        {assignment && (
          <span style={S.muted}>
            {assignment.material_identity}/{assignment.chamber_assignment}
          </span>
        )}
        {assignment?.encounter_key && (
          <span style={S.muted}>enc:{assignment.encounter_key}</span>
        )}
      </div>
      <div style={S.chain}>
        <span style={S.chainLabel}>Codex</span>
        <span style={{ ...S.chainValue, color: codexPresent ? "#22c55e" : "#ef4444" }}>
          {codexPresent ? `present (registry_key=${assignment?.registry_key ?? "?"})` : "absent"}
        </span>

        <span style={S.chainLabel}>Measures</span>
        <span style={S.chainValue}>{measuresLine}</span>

        <span style={S.chainLabel}>Field</span>
        <span style={S.chainValue}>{fieldLine}</span>

        <span style={S.chainLabel}>FREE render</span>
        <span style={S.chainValue}>{freeRenderLine}</span>

        <span style={S.chainLabel}>Route/action</span>
        <span style={S.chainValue}>{routeLine}</span>

        <span style={S.chainLabel}>Optics</span>
        <span style={{ ...S.chainValue, color: opticsColor }}>{mediaStatusLine}</span>

        {asStr(meta.standing_note) && (
          <>
            <span style={S.chainLabel}>Note</span>
            <span style={{ ...S.chainValue, color: "#facc15" }}>{String(meta.standing_note)}</span>
          </>
        )}
      </div>
    </article>
  )
}

// ── DirectorySection ───────────────────────────────────────────────────────────

type DirSectionProps = {
  directoryKey: string
  title: string
  surfaces: readonly string[]
  data: AuditData
  extraContent?: React.ReactNode
}

function DirectorySection({ directoryKey, title, surfaces, data, extraContent }: DirSectionProps) {
  const dirRow = data.registryByKey.get(directoryKey)
  const dirMeta = asRecord(dirRow?.metadata) ?? {}
  const dirSurfaces = (dirMeta.directory_surfaces as unknown[] | undefined) ?? []

  const statuses = surfaces.map((sk) => {
    const a = data.assignmentBySurface.get(sk)
    const r = a ? data.registryByKey.get(a.registry_key) : undefined
    const d = a?.encounter_key ? data.defByKey.get(a.encounter_key) : undefined
    return deriveStatus(sk, r, a, d, data.mediaByRole)
  })
  const hotCount = statuses.filter((s) => s === "hot").length
  const gapCount = statuses.filter((s) => ["gap", "renderer_gap", "media_gap", "content_gap"].includes(s)).length
  const heldCount = statuses.filter((s) => ["held", "inactive", "legacy_alias"].includes(s)).length

  return (
    <section style={S.section}>
      <div style={S.sectionHead}>
        <h2 style={S.h2}>{title}</h2>
        <span style={S.muted}>{directoryKey}</span>
        <span style={{ ...S.muted, marginLeft: "auto" }}>
          hot:{hotCount} held:{heldCount} gap:{gapCount}
        </span>
      </div>

      {dirRow ? (
        <div style={S.dirMeta}>
          <span>registry_family:{dirRow.registry_family ?? "null"}</span>
          <span>release_state:{dirRow.release_state ?? "null"}</span>
          <span>access_state:{dirRow.access_state ?? "null"}</span>
          <span>is_active:{String(dirRow.is_active)}</span>
          <span>directory_surfaces:{dirSurfaces.length}</span>
          <span style={{ color: "#f59e0b" }}>
            source:direct_query — unavailable_to_FREE (not in ENCOUNTER_REGISTRY_KEYS)
          </span>
        </div>
      ) : (
        <div style={{ ...S.dirMeta, color: "#ef4444" }}>
          {directoryKey} — absent from registry fetch. Requires resolver expansion.
        </div>
      )}

      {surfaces.map((sk) => (
        <SurfaceCard key={sk} sk={sk} data={data} />
      ))}

      {extraContent}
    </section>
  )
}

// ── Lapis extras ───────────────────────────────────────────────────────────────

function LapisExtra({ data }: { data: AuditData }) {
  const undriftedReg = data.registryByKey.get("undrifted")
  const integrations = asRecord(asRecord(undriftedReg?.metadata)?.lapis_publication_integrations) ?? {}

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={S.h3}>Publication Dispatches (undrifted)</h3>
      <p style={{ ...S.muted, marginBottom: "0.45rem" }}>
        Source: measures_publication_dispatch — unavailable_to_FREE (separate table; requires resolver expansion)
      </p>
      {data.dispatches.length === 0 ? (
        <p style={{ color: "#ef4444", fontSize: "0.7rem" }}>No dispatch rows returned from measures_publication_dispatch</p>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>dispatch_key</th>
              <th style={S.th}>title</th>
              <th style={S.th}>platform</th>
              <th style={S.th}>status</th>
              <th style={S.th}>external_url</th>
            </tr>
          </thead>
          <tbody>
            {data.dispatches.map((d) => (
              <tr key={d.dispatch_key}>
                <td style={S.td}>{d.dispatch_key}</td>
                <td style={S.td}>{d.title ?? "—"}</td>
                <td style={S.td}>{d.external_platform ?? "—"}</td>
                <td style={S.td}>{d.status ?? "—"}</td>
                <td style={{ ...S.td, wordBreak: "break-all" as const, fontSize: "0.63rem" }}>
                  {d.external_url ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {Object.keys(integrations).length > 0 && (
        <div style={{ marginTop: "0.85rem" }}>
          <h3 style={S.h3}>Lapis Integration Standing</h3>
          <p style={{ ...S.muted, marginBottom: "0.45rem" }}>
            Source: measures_registry.metadata.lapis_publication_integrations — available to FREE via registryRow.metadata
          </p>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>provider</th>
                <th style={S.th}>env_binding</th>
                <th style={S.th}>function</th>
                <th style={S.th}>automation_status</th>
                <th style={S.th}>disposition</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(integrations).map(([provider, rawVal]) => {
                const v = asRecord(rawVal) ?? {}
                return (
                  <tr key={provider}>
                    <td style={S.td}>{provider}</td>
                    <td style={S.td}>{asStr(v.env_binding) ?? "—"}</td>
                    <td style={S.td}>{asStr(v.function) ?? "—"}</td>
                    <td style={S.td}>{asStr(v.automation_status) ?? "—"}</td>
                    <td style={S.td}>{asStr(v.disposition) ?? "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={S.noteBanner}>
        Drift audit: structural_drift_publication is not active authority (audit_trace).
        structural_drift_dispatches is not active surface authority.
        Article preview records from registered dispatch rows, not hardcoded.
        /undrifted resolves as lapis_chamber_encounter (registry_key=undrifted).
        Lapis is optional/promoted/non-required path.
      </div>
    </div>
  )
}

// ── Held / Audit Trace ────────────────────────────────────────────────────────

function HeldAuditSection({ data }: { data: AuditData }) {
  return (
    <section style={{ ...S.section, borderColor: "rgba(250,204,21,0.08)" }}>
      <div style={S.sectionHead}>
        <h2 style={S.h2}>Held / Legacy Audit Trace</h2>
        <span style={S.muted}>retained; not active public launch standing</span>
      </div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>surface_key</th>
            <th style={S.th}>registry_key</th>
            <th style={S.th}>encounter_key</th>
            <th style={S.th}>chamber</th>
            <th style={S.th}>is_active</th>
            <th style={S.th}>release_state</th>
            <th style={S.th}>assignment standing</th>
            <th style={S.th}>status</th>
          </tr>
        </thead>
        <tbody>
          {[...HELD_SURFACE_KEYS].map((sk) => {
            const a = data.assignmentBySurface.get(sk)
            const r = a ? data.registryByKey.get(a.registry_key) : undefined
            const d = a?.encounter_key ? data.defByKey.get(a.encounter_key) : undefined
            const status = deriveStatus(sk, r, a, d, data.mediaByRole)
            const meta = asRecord(a?.metadata) ?? {}
            return (
              <tr key={sk}>
                <td style={{ ...S.td, fontWeight: 600, color: "#8fa0b8" }}>{sk}</td>
                <td style={S.td}>{a?.registry_key ?? "—"}</td>
                <td style={S.td}>{a?.encounter_key ?? "—"}</td>
                <td style={S.td}>{a?.chamber_assignment ?? "—"}</td>
                <td style={S.td}>{r ? String(r.is_active) : "—"}</td>
                <td style={S.td}>{r?.release_state ?? "—"}</td>
                <td style={S.td}>{asStr(meta.standing) ?? "—"}</td>
                <td style={S.td}><Badge status={status} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

// ── Legend ─────────────────────────────────────────────────────────────────────

function LegendSection() {
  const entries: [StatusGroup, string][] = [
    ["hot", "active, released, renderer dispatched, media present"],
    ["held", "release_state ≠ released or is_active = false"],
    ["inactive", "is_active = false"],
    ["legacy_alias", "deprecated key; collapsed or superseded"],
    ["audit_trace", "retained for traceability only"],
    ["gap", "no Codex row found for this surface key"],
    ["renderer_gap", "no surface_assignment or renderer_gap flag set"],
    ["media_gap", "primary media role absent or is_active = false"],
    ["content_gap", "no encounter_def found for encounter_key"],
  ]
  return (
    <section style={{ ...S.section, borderColor: "rgba(194,202,214,0.05)" }}>
      <h2 style={{ ...S.h2, marginBottom: "0.75rem" }}>Status Legend</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(18rem, 1fr))", gap: "0.4rem 1.5rem" }}>
        {entries.map(([s, d]) => (
          <div key={s} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Badge status={s} />
            <span style={S.muted}>{d}</span>
          </div>
        ))}
      </div>
      <div style={{ ...S.noteBanner, marginTop: "0.85rem" }}>
        <strong style={{ color: "rgba(194,202,214,0.55)" }}>unavailable_to_FREE</strong>
        {" "}— field visible in governance audit via direct DB query; not currently in registryResolver.ts fetch scope.
        Requires resolver expansion to expose to FREE encounter pipeline.
        {" | "}
        <strong style={{ color: "rgba(194,202,214,0.55)" }}>Access</strong>
        {" "}— /governance-audit is unpromoted from public navigation; direct URL only; no auth gate is active.
      </div>
    </section>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function GovernanceAuditSurface() {
  const [data, setData] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadAuditData()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setLoadErr(err instanceof Error ? err.message : "Audit load failed")
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div style={S.shell}>
        <p style={S.muted}>Loading governance audit data…</p>
      </div>
    )
  }

  if (loadErr) {
    return (
      <div style={S.shell}>
        <div style={S.errBanner}>Load error: {loadErr}</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div style={S.shell}>
      <header style={S.header}>
        <h1 style={S.h1}>FREE-to-Codex Governance Audit</h1>
        <p style={S.muted}>Measures Registry · Crystal / Obsidian / Lapis Directories</p>
        <p style={S.muted}>
          Operator surface · not linked from public navigation · direct URL access · no auth gate active
        </p>
        {data.errors.length > 0 && (
          <div style={S.errBanner}>
            {data.errors.map((e) => (
              <p key={e} style={{ margin: "0.1rem 0" }}>{e}</p>
            ))}
          </div>
        )}
      </header>

      <DirectorySection
        directoryKey="crystal_seat_directory"
        title="Crystal Seat Directory"
        surfaces={CRYSTAL_SURFACE_KEYS}
        data={data}
        extraContent={
          <div style={S.noteBanner}>
            Proof: intro uses ai_isnt_broken_intro · threshold owns L/R choice · orientation uses measures_position ·
            encounter resolves /about-measures-registry · crystal_seat_split_path is legacy_alias ·
            crystal_seat_orientation_passage is held
          </div>
        }
      />

      <DirectorySection
        directoryKey="obsidian_chamber_directory"
        title="Obsidian Chamber Directory"
        surfaces={OBSIDIAN_SURFACE_KEYS}
        data={data}
        extraContent={
          <div style={S.noteBanner}>
            Drift audit: structural_coherence_explainer renamed to obsidian_chamber_orientation ·
            media_role confirmed obsidian (not explainer_video) per migration 202607010006 ·
            encounter route /ai-operations-assessment · C1 compact is contact_capture + email continuance ·
            no active obsidian_chamber_orientation_passage · no active obsidian_to_marble_passage_video public route
          </div>
        }
      />

      <DirectorySection
        directoryKey="lapis_chamber_directory"
        title="Lapis Chamber Directory"
        surfaces={LAPIS_SURFACE_KEYS}
        data={data}
        extraContent={<LapisExtra data={data} />}
      />

      <HeldAuditSection data={data} />

      <LegendSection />
    </div>
  )
}
