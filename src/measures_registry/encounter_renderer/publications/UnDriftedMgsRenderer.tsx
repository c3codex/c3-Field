import { Component, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import type { PublicationIssue, PublicationMedia, PublicationObject, PublicationPresentation } from "@/shared/publicationPresentation"
import type { EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"
import { archiveIndex, composeLivingIssue, orderedObjects, orderedDeskObjects, resolveReaderPosition, type MagazinePage } from "./designpacComposition"
import GetUndriftedConnect from "./GetUndriftedConnect"
import "../styles/encounters/designpac.css"

export type UnDriftedMgsRendererProps = {
  encounter: RenderableEncounter; registryTokenStyle: CSSProperties;
  onNavigate: (surface: EncounterSurface) => void;
  renderHeader: (opts: { title: string }) => ReactNode;
  renderSystemFooter: () => ReactNode;
}
export function shouldUseUnDriftedMgsRenderer(encounter: RenderableEncounter): boolean {
  return encounter.surfaceAssignmentMetadata?.publication_presentation_renderer === "designpac_v1"
}
const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/"
function routePath(route: string | null): string | null {
  if (!route) return null
  try { const url = new URL(route, window.location.origin); return url.origin === window.location.origin ? normalizePath(url.pathname) : null } catch { return null }
}
function issueHref(p: PublicationPresentation, issue: PublicationIssue, objectId?: string): string {
  const url = new URL(p.publication.homeRoute, window.location.origin)
  url.searchParams.set("view", issue.archived ? "index" : "issue"); url.searchParams.set("issue", issue.id)
  if (objectId) url.searchParams.set("object", objectId)
  return url.pathname + url.search
}
function Media({ media }: { media: PublicationMedia }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [media.url])
  return failed ? <p className="designpac-unavailable">Image unavailable: {media.alt}</p> : <img src={media.url} alt={media.alt} data-media-role={media.role} data-asset-key={media.assetKey || undefined} onError={() => setFailed(true)} />
}
function Reading({ object }: { object: PublicationObject }) {
  return object.body ? <div className="designpac-prose"><ReactMarkdown>{object.body}</ReactMarkdown></div> : object.kind === "visual" && object.media.length ? null : <p className="designpac-unavailable">Article reading unavailable.</p>
}
function ObjectLinks({ p, issue, object }: { p: PublicationPresentation; issue: PublicationIssue; object: PublicationObject }) {
  const direct = object.route && routePath(object.route) !== normalizePath(p.publication.homeRoute)
  return <div className="designpac-object-links">{direct && <a href={object.route!}>Read article</a>}<a href={issueHref(p, issue, object.id)}>View in Issue</a></div>
}
function Contents({ p, issue, jump, positions }: { p: PublicationPresentation; issue: PublicationIssue; jump?: (id: string) => void; positions?: Map<string, number> }) {
  const link = (object: PublicationObject) => <>{jump ? <button onClick={() => jump(object.id)}>{object.title}</button> : <a href={issueHref(p, issue, object.id)}>{object.title}</a>}{positions?.has(object.id) && <span className="designpac-contents-position"> · Page {positions.get(object.id)! + 1}</span>}</>
  const feature = issue.objects.find(x => x.id === issue.featureId)
  return <div className="designpac-contents"><h2>Contents</h2>{feature && <section><h3>Feature</h3>{link(feature)}<ObjectLinks p={p} issue={issue} object={feature} /></section>}{p.desks.map(desk => {
    const objects = orderedDeskObjects(issue, desk.id)
    return objects.length ? <section key={desk.id}><h3>{desk.title}</h3><ul>{objects.map(o => <li key={o.id}>{link(o)}<ObjectLinks p={p} issue={issue} object={o} /></li>)}</ul></section> : null
  })}</div>
}
function CleanIssue({ p, issue }: { p: PublicationPresentation; issue: PublicationIssue }) {
  const feature = issue.objects.find(x => x.id === issue.featureId)
  const objects = issue.archived ? archiveIndex(issue) || issue.objects : [feature, ...p.desks.flatMap(d => orderedDeskObjects(issue, d.id))].filter((x): x is PublicationObject => !!x)
  return <section className="designpac-clean"><h1>{issue.label}</h1><Contents p={p} issue={issue} /><div>{objects.map(object => <article key={object.id} id={object.id} data-object-id={object.id}><p>{p.desks.find(x => x.id === object.deskKey)?.title}</p><h2>{object.title}</h2>{object.media.map((m, i) => <Media key={m.url + i} media={m} />)}<Reading object={object} /><ObjectLinks p={p} issue={issue} object={object} /></article>)}</div></section>
}
class ReadingBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
function Page({ page, p, issue, jump, positions }: { page: MagazinePage; p: PublicationPresentation; issue: PublicationIssue; jump: (id: string) => void; positions: Map<string, number> }) {
  const object = issue.objects.find(x => x.id === page.objectId), desk = p.desks.find(x => x.id === page.deskId)
  if (page.grammar === "issue_cover") {
    const feature = issue.objects.find(x => x.id === issue.featureId)!
    return <article className="designpac-page designpac-cover" data-grammar={page.grammar}><Media media={p.brand.masthead} /><p>{issue.label} {issue.date}</p><h1><button onClick={() => jump(feature.id)}>{feature.title}</button></h1>{feature.media[0] && <Media media={feature.media[0]} />}<p>{feature.excerpt}</p><div className="designpac-cover-desks">{p.desks.map(d => {
      const lead = issue.deskLeads ? issue.objects.find(x => x.id === issue.deskLeads?.[d.id]) : orderedObjects(issue.objects.filter(x => x.deskKey === d.id && x.id !== feature.id))[0]
      return lead ? <section key={d.id}><h2>{d.title}</h2><button onClick={() => jump(lead.id)}>{lead.title}</button></section> : null
    })}</div></article>
  }
  if (page.grammar === "live_contents") return <article className="designpac-page" data-grammar={page.grammar}><Contents p={p} issue={issue} jump={jump} positions={positions} /></article>
  if (page.grammar === "closing_back_cover") return <article className="designpac-page designpac-closing" data-grammar={page.grammar}><Media media={p.brand.masthead} /><h2>{p.publication.title}</h2><p>{p.publication.slogan}</p><p>{p.publication.principles}</p>{p.publication.footer.map(line => <p key={line}>{line}</p>)}</article>
  if (!object) return <article className="designpac-page" data-grammar={page.grammar}><h2>{desk?.title}</h2>{issue.objects.filter(x => x.deskKey === page.deskId).map(o => <button key={o.id} onClick={() => jump(o.id)}>{o.title}</button>)}</article>
  return <article className="designpac-page" data-grammar={page.grammar} data-object-id={object.id} data-page-key={page.key}><p className="designpac-kicker">{page.grammar === "feature_opening_spread" ? "Feature" : desk?.title}</p>{page.opening ? <><h2>{object.title}</h2>{object.excerpt && <p className="designpac-deck">{object.excerpt}</p>}{object.media.map((m, i) => <Media key={m.url + i} media={m} />)}{!object.body && <Reading object={object} />}<ObjectLinks p={p} issue={issue} object={object} /></> : <><h2 className="designpac-continuation-title">{object.title}{page.part > 0 ? " · continued" : ""}</h2><div className="designpac-prose"><ReactMarkdown>{page.body || ""}</ReactMarkdown></div></>}</article>
}
function LivingMagazine({ p, issue }: { p: PublicationPresentation; issue: PublicationIssue }) {
  const composition = useMemo(() => composeLivingIssue(p, issue), [p, issue])
  const [cursor, setCursor] = useState<{ key: string | null; objectId: string | null }>(() => ({ key: null, objectId: new URLSearchParams(window.location.search).get("object") }))
  const [single, setSingle] = useState(() => window.matchMedia("(max-width: 850px)").matches)
  const [expanded, setExpanded] = useState(false)
  const viewport = useRef<HTMLDivElement>(null), magazine = useRef<HTMLElement>(null), expandButton = useRef<HTMLButtonElement>(null), touch = useRef<{ x: number; y: number } | null>(null)
  const position = resolveReaderPosition(composition, cursor.key, cursor.objectId)
  const count = single || position < 2 ? 1 : Math.min(2, composition.pages.length - position)
  const visible = composition.pages.slice(position, position + count)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 850px)"); const change = () => setSingle(window.matchMedia("(max-width: 850px)").matches)
    mq.addEventListener("change", change); window.addEventListener("resize", change)
    return () => { mq.removeEventListener("change", change); window.removeEventListener("resize", change) }
  }, [])
  useEffect(() => {
    if (!expanded) return
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"
    viewport.current?.focus()
    return () => { document.body.style.overflow = previousOverflow; expandButton.current?.focus() }
  }, [expanded])
  const go = (index: number, focus = true) => {
    const page = composition.pages[Math.max(0, Math.min(index, composition.pages.length - 1))]
    setCursor({ key: page.key, objectId: page.objectId })
    if (focus) requestAnimationFrame(() => viewport.current?.focus())
  }
  const jump = (id: string) => go(composition.objectPositions.get(id) ?? 1)
  return <section ref={magazine} className={"designpac-magazine" + (expanded ? " designpac-expanded" : "")} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={issue.label} onKeyDown={event => {
    if (!expanded) return
    if (event.key === "Escape") { event.preventDefault(); setExpanded(false) }
    if (event.key === "Tab") {
      const items = Array.from(magazine.current?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href],[tabindex='0']") || [])
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === viewport.current)) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
  }}>
    <nav className="designpac-controls" aria-label="Issue reading"><button onClick={() => go(0)}>Cover</button><button onClick={() => go(1)}>Contents</button>{p.desks.map(d => composition.deskPositions.has(d.id) ? <button key={d.id} onClick={() => go(composition.deskPositions.get(d.id)!)}>{d.title}</button> : null)}<a href={issueHref(p, issue) + "&reading=clean"}>Clean reading</a><button ref={expandButton} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Exit expanded view" : "Expand"}</button></nav>
    <div ref={viewport} tabIndex={-1} className={"designpac-spread" + (visible.length === 1 ? " designpac-single" : "")} onKeyDown={event => {
      if (event.key === "Escape") { setExpanded(false); return }
      const target = event.target as HTMLElement
      if (target.closest("input,textarea,select")) return
      if (event.key === "ArrowRight") { event.preventDefault(); go(position + count) }
      if (event.key === "ArrowLeft") { event.preventDefault(); go(position - (single || position <= 2 ? 1 : 2)) }
    }} onTouchStart={e => { touch.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } }} onTouchEnd={e => {
      if (!touch.current) return
      const dx = e.changedTouches[0].clientX - touch.current.x, dy = e.changedTouches[0].clientY - touch.current.y; touch.current = null
      if (Math.abs(dx) > 80 && Math.abs(dy) < 60) go(position + (dx < 0 ? count : -(single || position <= 2 ? 1 : 2)))
    }}>{visible.map(page => <Page key={page.key} page={page} p={p} issue={issue} jump={jump} positions={composition.objectPositions} />)}</div>
    <nav className="designpac-paging" aria-label="Page navigation"><button disabled={position === 0} onClick={() => go(position - (single || position <= 2 ? 1 : 2))}>Previous</button><span aria-live="polite">{position + 1}{count === 2 ? "–" + (position + 2) : ""} / {composition.pages.length}</span><button disabled={position + count >= composition.pages.length} onClick={() => go(position + count)}>Next</button></nav>
  </section>
}
function Archive({ p }: { p: PublicationPresentation }) {
  const [opened, setOpened] = useState<string | null>(() => new URLSearchParams(window.location.search).get("issue"))
  return <section className="designpac-archive"><h2>Archive</h2>{p.issues.filter(x => x.archived).map(issue => {
    const members = archiveIndex(issue)
    return <section key={issue.id}><h3>{issue.label}</h3>{members && issue.finalCover ? <><button className="designpac-archive-cover" aria-label={"Open " + issue.label} onClick={() => setOpened(opened === issue.id ? null : issue.id)} aria-expanded={opened === issue.id}><Media media={issue.finalCover} /><span>Open {issue.label}</span></button>{opened === issue.id && <ol>{members.map(o => <li key={o.id}><span>{p.desks.find(d => d.id === o.deskKey)?.title}</span>{o.route && <a href={o.route}>{o.title}</a>}{!o.route && <span>{o.title}</span>}</li>)}</ol>}</> : <><p className="designpac-unavailable">Archive presentation unavailable.</p><ul>{issue.objects.map(o => <li key={o.id}>{o.route ? <a href={o.route}>{o.title}</a> : o.title}</li>)}</ul></>}</section>
  })}</section>
}
function RegistryReadingFallback({ encounter }: { encounter: RenderableEncounter }) {
  const path = normalizePath(window.location.pathname), articles = encounter.publicationDispatches.filter(x => x.status === "published")
  const current = articles.find(x => routePath(x.internal_route || x.article_url) === path)
  return <section className="designpac-clean"><p className="designpac-unavailable">Issue presentation unavailable.</p>{current && <article><h1>{current.title}</h1><div className="designpac-prose"><ReactMarkdown>{current.dispatch_body || ""}</ReactMarkdown></div></article>}<ul>{articles.map(x => { const href = x.internal_route || x.article_url; return href && routePath(href) ? <li key={x.dispatch_key}><a href={href}>{x.title}</a></li> : null })}</ul></section>
}
export default function UnDriftedMgsRenderer({ encounter, renderSystemFooter }: UnDriftedMgsRendererProps) {
  const [p, setP] = useState<PublicationPresentation | null>(null), [failed, setFailed] = useState(false)
  const epoch = useRef(0)
  useEffect(() => {
    let stopped = false; const requests = new Set<AbortController>()
    const refresh = async () => {
      const current = ++epoch.current, controller = new AbortController(); requests.add(controller)
      try {
        const response = await fetch("/api/publication-presentation?surface=" + encodeURIComponent(encounter.surface), { cache: "no-store", signal: controller.signal })
        const packet = await response.json() as { standing?: string; presentation?: PublicationPresentation }
        if (!response.ok || packet.standing !== "resolved" || packet.presentation?.version !== "designpac_v1") throw new Error("unresolved")
        if (!stopped && current === epoch.current) { setP(packet.presentation); setFailed(false) }
      } catch { if (!stopped && current === epoch.current) { setP(null); setFailed(true) } }
      finally { requests.delete(controller) }
    }
    const foreground = () => { if (document.visibilityState === "visible") void refresh() }
    void refresh(); const timer = window.setInterval(foreground, 60000)
    window.addEventListener("focus", foreground); document.addEventListener("visibilitychange", foreground)
    return () => { stopped = true; window.clearInterval(timer); window.removeEventListener("focus", foreground); document.removeEventListener("visibilitychange", foreground); requests.forEach(c => c.abort()) }
  }, [encounter.surface])
  if (!p) return <main className="designpac-publication">{failed ? <RegistryReadingFallback encounter={encounter} /> : <p role="status">Opening publication…</p>}{renderSystemFooter()}</main>
  const current = p.issues.find(x => x.active && !x.archived), path = normalizePath(window.location.pathname)
  const hasRoute = (x: PublicationIssue) => x.objects.some(o => routePath(o.route) === path && path !== normalizePath(p.publication.homeRoute))
  const articleIssue = p.issues.find(x => x.active && !x.archived && hasRoute(x)) || p.issues.find(hasRoute)
  const object = articleIssue?.objects.find(o => routePath(o.route) === path)
  const search = new URLSearchParams(window.location.search), requestedIssue = p.issues.find(x => x.id === search.get("issue"))
  const shownIssue = requestedIssue || current
  const home = path === normalizePath(p.publication.homeRoute)
  return <main className="designpac-publication" style={p.brand.tokens as CSSProperties} data-layout-contract="designpac_publication" data-renderer-identity={p.rendererIdentity}>
    <header className="designpac-masthead"><a href={p.publication.homeRoute} aria-label={p.publication.title}><Media media={p.brand.masthead} /></a><p>{p.publication.slogan}</p><nav aria-label="Publication"><a href={p.publication.homeRoute}>Current Issue</a><a href={p.publication.homeRoute + "?view=archive"}>Archive</a></nav></header>
    {object && articleIssue ? <article className="designpac-clean" data-object-id={object.id}><p>{articleIssue.label} · {p.desks.find(d => d.id === object.deskKey)?.title}</p><h1>{object.title}</h1>{object.media.map((m, i) => <Media key={m.url + i} media={m} />)}<Reading object={object} /><ObjectLinks p={p} issue={articleIssue} object={object} /></article> : home && shownIssue ? search.get("view") === "archive" || shownIssue.archived ? <Archive p={p} /> : shownIssue.holds.some(x => x.startsWith("desk_lead_relation_conflict:") || x.startsWith("desk_lead_chronology_")) ? <><p className="designpac-unavailable">Issue presentation unavailable. Published reading remains available below.</p><CleanIssue p={p} issue={shownIssue} /></> : search.get("reading") === "clean" ? <CleanIssue p={p} issue={shownIssue} /> : <ReadingBoundary key={shownIssue.id} fallback={<CleanIssue p={p} issue={shownIssue} />}><LivingMagazine p={p} issue={shownIssue} /></ReadingBoundary> : <section className="designpac-clean"><p>Requested reading unavailable.</p>{current && <Contents p={p} issue={current} />}</section>}
    <GetUndriftedConnect dispatchKey={object?.id || null} sourceRoute={window.location.pathname} compact desks={p.desks.map(d => ({ key: d.id, label: d.title }))} />
    <footer className="designpac-footer">{p.publication.footer.map(line => <p key={line}>{line}</p>)}</footer>{renderSystemFooter()}
  </main>
}
