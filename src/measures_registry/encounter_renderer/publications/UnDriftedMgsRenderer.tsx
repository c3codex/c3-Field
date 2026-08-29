import type { CSSProperties, ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type {
  EncounterIssuePageRow,
  EncounterPublicationDispatchRow,
  EncounterSurface,
  RenderableEncounter,
} from "../types/encounterRendererTypes"

export type UnDriftedMgsRendererProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

type RecordValue = Record<string, unknown>

function asRecord(value: unknown): RecordValue | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as RecordValue
    : null
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function asRecordArray(value: unknown): RecordValue[] {
  return Array.isArray(value) ? value.map(asRecord).filter((v): v is RecordValue => Boolean(v)) : []
}

function normalizePath(path: string): string {
  if (!path) return "/"
  return path.length > 1 ? path.replace(/\/$/, "") : path
}

function pathFromUrl(value: string | null): string | null {
  if (!value) return null
  try {
    return normalizePath(new URL(value, "https://measuresregistry.com").pathname)
  } catch {
    return null
  }
}

function pageHref(page: EncounterIssuePageRow): string | null {
  const meta = asRecord(page.metadata)
  const routeState = asString(meta?.route_state)
  if ((routeState === "live" || routeState === "live_but_not_wired_as_issue_page") && page.route_path) {
    return normalizePath(page.route_path)
  }
  return asString(meta?.external_url)
}

function dispatchPath(dispatch: EncounterPublicationDispatchRow): string | null {
  return dispatch.internal_route
    ? normalizePath(dispatch.internal_route)
    : pathFromUrl(dispatch.article_url) ?? pathFromUrl(dispatch.external_url)
}

function dispatchForPage(
  page: EncounterIssuePageRow,
  dispatches: EncounterPublicationDispatchRow[],
): EncounterPublicationDispatchRow | null {
  if (page.dispatch_key) {
    const exact = dispatches.find((d) => d.dispatch_key === page.dispatch_key)
    if (exact) return exact
  }
  const href = pageHref(page)
  if (!href) return null
  const path = href.startsWith("http") ? pathFromUrl(href) : normalizePath(href)
  return dispatches.find((d) => dispatchPath(d) === path) ?? null
}

function dispatchBanner(dispatch: EncounterPublicationDispatchRow | null): string | null {
  if (!dispatch) return null
  const manifest = asRecord(dispatch.media_manifest)
  const website = asRecord(manifest?.website)
  const cover = asRecord(manifest?.cover)
  const paragraph = asRecord(manifest?.paragraph)
  return (
    asString(website?.public_url) ??
    asString(cover?.public_url) ??
    asString(manifest?.banner_url) ??
    asString(paragraph?.public_url) ??
    null
  )
}

function registeredMediaUrl(encounter: RenderableEncounter, role: string): string | null {
  const row = encounter.mediaByRole.get(role)
  if (!row) return null
  const meta = asRecord(row.metadata)
  return resolveRuntimeMediaUrl({
    publicUrl: asString(meta?.public_url) ?? asString(meta?.exact_url_seated),
    bucketName: row.storage_bucket,
    storagePath: row.storage_path,
  })
}

function formatDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return value
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date)
}

function isEligibleIssuePage(page: EncounterIssuePageRow): boolean {
  return page.release_state === "released" && page.visibility_state === "visible"
}

function latestDeskPage(
  deskKey: string,
  activePages: EncounterIssuePageRow[],
  dispatches: EncounterPublicationDispatchRow[],
): { page: EncounterIssuePageRow; dispatch: EncounterPublicationDispatchRow | null } | null {
  const candidates = activePages
    .filter((page) => asString(asRecord(page.metadata)?.desk_key) === deskKey)
    .map((page) => ({ page, dispatch: dispatchForPage(page, dispatches) }))
    .filter(({ dispatch }) => !dispatch || dispatch.status === "published")
    .sort((a, b) => {
      const aTime = a.dispatch?.published_at ? Date.parse(a.dispatch.published_at) : 0
      const bTime = b.dispatch?.published_at ? Date.parse(b.dispatch.published_at) : 0
      return bTime - aTime || b.page.page_number - a.page.page_number
    })
  return candidates[0] ?? null
}

function ArticleView({
  encounter,
  dispatch,
  registryTokenStyle,
  renderHeader,
  renderSystemFooter,
}: UnDriftedMgsRendererProps & { dispatch: EncounterPublicationDispatchRow }) {
  const meta = asRecord(dispatch.metadata)
  const seriesLabel = asString(meta?.series_label)
  const banner = dispatchBanner(dispatch)
  const published = formatDate(dispatch.published_at)

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="lapis"
      data-layout-contract="undrifted_publication"
      data-release-standing="public"
      data-publication-projection="registry_dispatch"
      style={registryTokenStyle}
    >
      {renderHeader({ title: "unDrifted" })}
      <article className="undrifted-shell undrifted-article-shell" aria-label={dispatch.title}>
        <nav className="undrifted-article-return" aria-label="unDrifted navigation">
          <a href="/undrifted">unDrifted</a>
          {seriesLabel ? <><span aria-hidden="true">/</span><span>{seriesLabel}</span></> : null}
        </nav>
        <header className="undrifted-article-header">
          {banner ? <img className="undrifted-article-banner" src={banner} alt="" loading="eager" /> : null}
          {seriesLabel ? <div className="undrifted-article-kicker">{seriesLabel}</div> : null}
          <h1>{dispatch.title}</h1>
          {dispatch.excerpt ? <p className="undrifted-article-subtitle">{dispatch.excerpt}</p> : null}
          {published ? <div className="undrifted-article-meta"><span>{published}</span></div> : null}
        </header>
        <section className="undrifted-article-body" data-source="measures_publication_dispatch">
          <ReactMarkdown>{dispatch.dispatch_body ?? ""}</ReactMarkdown>
        </section>
      </article>
      {renderSystemFooter()}
    </main>
  )
}

export function shouldUseUnDriftedMgsRenderer(encounter: RenderableEncounter): boolean {
  if (encounter.registryKey !== "undrifted") return false
  if (typeof window === "undefined") return true
  const path = normalizePath(window.location.pathname)
  if (path === "/undrifted") return true
  return encounter.publicationDispatches.some(
    (dispatch) => dispatch.issue_number === "002" && dispatchPath(dispatch) === path,
  )
}

export default function UnDriftedMgsRenderer({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: UnDriftedMgsRendererProps) {
  const pathname = typeof window !== "undefined" ? normalizePath(window.location.pathname) : "/undrifted"
  const issue002Dispatch = encounter.publicationDispatches.find(
    (dispatch) => dispatch.issue_number === "002" && dispatchPath(dispatch) === pathname,
  )
  if (pathname !== "/undrifted" && issue002Dispatch) {
    return (
      <ArticleView
        encounter={encounter}
        dispatch={issue002Dispatch}
        registryTokenStyle={registryTokenStyle}
        onNavigate={onNavigate}
        renderHeader={renderHeader}
        renderSystemFooter={renderSystemFooter}
      />
    )
  }

  const defMeta = asRecord(encounter.encounterDef?.metadata)
  const regMeta = asRecord(encounter.registryRow.metadata)
  const meta = { ...(defMeta ?? {}), ...(regMeta ?? {}) }
  const brandCopy = asRecord(meta.brand_copy)
  const issueRecord = asRecord(meta.issue_record)
  const assessmentFeature = asRecord(meta.assessment_feature)
  const desks = asRecordArray(meta.editorial_sections)
  const activeIssueKey = asString(issueRecord?.issue_key)
  const activeIssueNumber = asString(issueRecord?.issue_number)
  const activeIssueDate = asString(issueRecord?.issue_date)
  const activePages = encounter.issuePages.filter(
    (page) => page.issue_id === activeIssueKey && isEligibleIssuePage(page),
  )
  const pastPages = encounter.issuePages.filter(
    (page) => page.issue_id !== activeIssueKey && isEligibleIssuePage(page),
  )
  const masthead = registeredMediaUrl(encounter, "undrifted_publication_masthead")
  const title = asString(brandCopy?.header) ?? "unDrifted"
  const primaryLine = asString(brandCopy?.primary_line)
  const principles = asString(brandCopy?.principles_line)

  const archivedByIssue = new Map<string, EncounterIssuePageRow[]>()
  for (const page of pastPages) {
    const pages = archivedByIssue.get(page.issue_id) ?? []
    pages.push(page)
    archivedByIssue.set(page.issue_id, pages)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="lapis"
      data-layout-contract="undrifted_publication"
      data-release-standing="public"
      data-mgs-standard="minimum_governed_standard_v1"
      data-publication-projection="registry_state"
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <section className="undrifted-shell undrifted-cover-canvas" aria-label={title}>
        <header className="undrifted-masthead" aria-label="unDrifted publication masthead">
          {masthead ? <img className="undrifted-banner" src={masthead} alt={title} loading="eager" /> : <h1>{title}</h1>}
        </header>
        {primaryLine ? <p className="undrifted-masthead-slogan"><span>{primaryLine}</span></p> : null}
        {principles ? <p className="undrifted-eyebrow">{principles}</p> : null}
        <hr className="undrifted-masthead-rule" aria-hidden="true" />

        <div className="undrifted-issue-rail" aria-label="Active Issue information">
          <div className="undrifted-issue-rail-left">
            <span>ACTIVE ISSUE {activeIssueNumber ?? "—"}</span>
            {activeIssueDate ? <span>{activeIssueDate}</span> : null}
          </div>
        </div>

        <section className="undrifted-desks-section" aria-label="Current Desks">
          <div className="undrifted-insights-header">
            <span className="undrifted-eyebrow">Current Desks</span>
            <h2>Latest from each Desk</h2>
          </div>
          <div className="undrifted-desks-grid">
            {desks.map((desk, index) => {
              const deskKey = asString(desk.key)
              if (!deskKey) return null
              const latest = latestDeskPage(deskKey, activePages, encounter.publicationDispatches)
              const href = latest ? pageHref(latest.page) : null
              const banner = dispatchBanner(latest?.dispatch ?? null)
              return (
                <article className="undrifted-desk-card" key={deskKey} data-desk-key={deskKey}>
                  {banner ? <img src={banner} alt="" loading="lazy" /> : null}
                  <span className="undrifted-eyebrow">Desk {String(index + 1).padStart(2, "0")}</span>
                  <h3>{asString(desk.title) ?? deskKey}</h3>
                  {latest ? (
                    <>
                      <h4>{latest.page.title}</h4>
                      {latest.dispatch?.excerpt ? <p>{latest.dispatch.excerpt}</p> : null}
                      {href ? <a href={href}>Read the latest →</a> : <span>Published object has no public route seated.</span>}
                    </>
                  ) : (
                    <p>No published article is currently seated for this Desk.</p>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section className="undrifted-current-issue" aria-label={`Active Issue ${activeIssueNumber ?? ""}`}>
          <div className="undrifted-insights-header">
            <span className="undrifted-eyebrow">Active Issue</span>
            <h2>Issue {activeIssueNumber ?? "—"}{activeIssueDate ? ` · ${activeIssueDate}` : ""}</h2>
          </div>
          <div className="undrifted-current-supporting">
            {activePages.map((page) => {
              const dispatch = dispatchForPage(page, encounter.publicationDispatches)
              const href = pageHref(page)
              const deskTitle = asString(asRecord(page.metadata)?.desk_title)
              const banner = dispatchBanner(dispatch)
              return (
                <article key={page.page_key} data-page-role={page.page_role}>
                  {banner ? <img src={banner} alt="" loading="lazy" /> : null}
                  {deskTitle ? <span className="undrifted-eyebrow">{deskTitle}</span> : null}
                  <h3>{page.title}</h3>
                  {dispatch?.excerpt ? <p>{dispatch.excerpt}</p> : null}
                  {href ? <a href={href}>Read →</a> : null}
                </article>
              )
            })}
          </div>
        </section>

        <section className="undrifted-archive" aria-label="Past Issues">
          <div className="undrifted-insights-header">
            <span className="undrifted-eyebrow">Past Issues</span>
            <h2>Archive</h2>
          </div>
          {[...archivedByIssue.entries()].map(([issueId, pages]) => (
            <section key={issueId} className="undrifted-archive-contents" aria-label={issueId}>
              <h3>{issueId === "undrifted_issue01" ? "Issue 001" : issueId}</h3>
              <ol>
                {pages.map((page) => {
                  const href = pageHref(page)
                  return <li key={page.page_key}>{href ? <a href={href}>{page.title}</a> : <span>{page.title}</span>}</li>
                })}
              </ol>
            </section>
          ))}
        </section>

        {asString(assessmentFeature?.route_path) ? (
          <section className="undrifted-editor-feature" aria-label="Assessment">
            <span className="undrifted-eyebrow">{asString(assessmentFeature?.feature_label) ?? "Measures Registry"}</span>
            <h2>{asString(assessmentFeature?.feature_title) ?? "Assess the Environment"}</h2>
            {asString(assessmentFeature?.feature_body) ? <p>{asString(assessmentFeature?.feature_body)}</p> : null}
            <a className="undrifted-cta-primary" href={asString(assessmentFeature?.route_path) as string}>
              {asString(assessmentFeature?.cta_label) ?? "Assess the Environment"}
            </a>
          </section>
        ) : null}
      </section>
      {renderSystemFooter()}
    </main>
  )
}
