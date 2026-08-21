import type { CSSProperties, FormEvent, ReactNode } from "react"
import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type {
  EncounterIssuePageRow,
  EncounterMediaRow,
  EncounterSurface,
  RenderableEncounter,
} from "../types/encounterRendererTypes"
import {
  asRecord,
  asRecordArray,
  asString,
  asStringArray,
} from "../shared/encounterRendererUtils"
import { encounterStyleDataAttributes } from "../styles/encounterStyleProfile"
import {
  launchCycleArticleForPath,
  UNDRIFTED_LAUNCH_CYCLE_001_ARTICLES,
  type UndriftedLaunchCycleArticle,
} from "../publications/undriftedLaunchCycle001Projection"

// Payload for Encounter Boundary subscription capture write.
// Encounter Boundary provides onCaptureSubscription. Omitting disables capture persistence.
export type SubscriptionCapturePayload = {
  email: string
  organization: string | null
  dispatchKey: string | null
}

export type LapisChamberProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

// --- Helpers ----------------------------------------------------------------

function mediaUrl(row: EncounterMediaRow | undefined): string | null {
  if (!row) return null
  const meta = asRecord(row.metadata)
  return resolveRuntimeMediaUrl({
    publicUrl: asString(meta?.public_url) ?? asString(meta?.exact_url_seated),
    bucketName: row.storage_bucket,
    storagePath: row.storage_path,
  })
}

// Issue Page helpers — read only seated state (measures_publication_issue_page via
// encounter.issuePages), never invent a route or mark a held page as available.
// route_path is only used when metadata.route_state marks it genuinely live; otherwise the
// only usable link is the page's own external_url (Paragraph), if present.
function issuePageHref(page: EncounterIssuePageRow | null): string | null {
  if (!page) return null
  const metadata = asRecord(page.metadata)
  const routeState = asString(metadata?.route_state)
  if (routeState === "live" && page.route_path) return page.route_path
  if (routeState === "live_but_not_wired_as_issue_page" && page.route_path) return page.route_path
  return asString(metadata?.external_url)
}

function issuePageIsHeld(page: EncounterIssuePageRow | null): boolean {
  return !page || page.release_state !== "released"
}

function publicIssueNumber(value: string | null): string | null {
  if (!value) return null
  const numeric = value.match(/^0*(\d+)$/)
  if (!numeric) return value
  const parsed = Number.parseInt(numeric[1], 10)
  if (!Number.isFinite(parsed)) return value
  return parsed < 10 ? `0${parsed}` : String(parsed)
}

function publicIssuePeriod(value: string | null): string | null {
  if (!value) return null
  const match = value.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/)
  if (!match) return value
  const monthIndex = Number.parseInt(match[2], 10) - 1
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthIndex]
  return month ? `${month} ${match[1]}` : value
}

function resolveNextSurface(encounter: RenderableEncounter): string | null {
  return asString(encounter.transitionNodes[encounter.surface]?.next_surface)
}

// --- Entry point ------------------------------------------------------------

// Receives only RenderableEncounter. No DB access. No authority decisions.
// Dispatches to sub-presentations by surface key (seated in DB via surface assignment).
export default function LapisChamberRenderer(props: LapisChamberProps) {
  const { surface } = props.encounter

  if (surface === "measures_registry_home") {
    return <MeasuresRegistryHome {...props} />
  }
  if (surface === "lapis_chamber_encounter") {
    return <UnDriftedIndex {...props} />
  }
  if (surface === "publication_dispatch") {
    return <PublicationDispatch {...props} />
  }

  // Renderer gap: surface is lapis-assigned but presentation not yet seated
  return (
    <main
      className="measures-registry-runtime"
      data-surface={surface}
      data-material-family="lapis"
      data-release-standing="renderer_gap"
      style={props.registryTokenStyle}
    >
      {props.renderHeader({ title: props.encounter.encounterDef?.display_title ?? "Measures Registry" })}
      <section className="registry-held-state" role="status">
        <span>Lapis</span>
        <p>Presentation for lapis surface <code>{surface}</code> is not yet seated.</p>
      </section>
      {props.renderSystemFooter()}
    </main>
  )
}

// --- structural_drift_dispatches --------------------------------------------

function UnDriftedIndex({
  encounter,
  registryTokenStyle,
  onCaptureSubscription,
  renderHeader,
  renderSystemFooter,
}: LapisChamberProps) {
  const [email, setEmail] = useState("")
  const [organization, setOrganization] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [subError, setSubError] = useState<string | null>(null)
  const launchCycleArticle =
    typeof window !== "undefined" ? launchCycleArticleForPath(window.location.pathname) : null

  const defMeta = asRecord(encounter.encounterDef?.metadata)
  const regMeta = asRecord(encounter.registryRow?.metadata)
  const meta = { ...defMeta, ...regMeta }
  const brandCopy = asRecord(meta?.brand_copy)
  const brandAssets = asRecord(meta?.brand_assets)
  const styleContract = asRecord(meta?.style_contract)
  // Publication Registry's canonical style_contract.tokens (--undrifted-*), regenerated into
  // this projection by oar2_seat_undrifted_publication_synchronization_and_launch_ready_encounter_projection_v1.
  // Reconnected here rather than hardcoded so future Publication Registry edits flow through
  // without a renderer change.
  const styleContractTokens = asRecord(styleContract?.tokens) as CSSProperties | undefined
  // landing_design_contract is retained only for historical trace — its copy fields moved to
  // section_labels and its composition authority moved to encounter_profile, per OAR2 "Finalize
  // unDrifted Launch Projection and Encounter Profile" §3. Both new fields are canonical under
  // Publication Registry; landingContract is read below only as a fallback.
  const landingContract = asRecord(meta?.landing_design_contract)
  const sectionLabels = asRecord(meta?.section_labels)
  const encounterProfile = asRecord(meta?.encounter_profile)
  const viewportContract = asRecord(encounterProfile?.viewport_contract)
  // Composition viewport tokens from the Publication Encounter Profile — consumed by lapis.css
  // scoped under [data-layout-contract="undrifted_publication"], never redeclared inline.
  const profileStyleVars = viewportContract
    ? ({
        "--undrifted-desktop-max-width": asString(viewportContract.desktop_content_max_width) ?? undefined,
        "--undrifted-tablet-max-width": asString(viewportContract.tablet_content_max_width) ?? undefined,
        "--undrifted-mobile-max-width": asString(viewportContract.mobile_content_max_width) ?? undefined,
      } as CSSProperties)
    : undefined
  const issueRecord = asRecord(meta?.issue_record)
  const coverStory = asRecord(meta?.cover_story)
  const assessmentFeature = asRecord(meta?.assessment_feature)
  const roleCallFeature = asRecord(meta?.role_call_feature)
  const nextIssueTeaserFeature = asRecord(meta?.next_issue_teaser)
  const footerRecord = asRecord(meta?.footer_record)
  const featuredArticleSet = asRecordArray(meta?.featured_article_set)

  const title =
    asString(brandCopy?.header) ?? encounter.encounterDef?.display_title ?? "unDrifted"
  const mastHeadPrinciples = asString(brandCopy?.principles_line)
  const primaryLogoPath = asString(brandAssets?.primary_full_lockup_path)
  const styleKey =
    asString(landingContract?.style_contract_key) ?? asString(styleContract?.key)
  // Prefer the Publication Encounter Profile as the authoritative composition pointer now
  // that landing_design_contract is superseded — falls back only if the profile is absent.
  const landingKey = asString(encounterProfile?.profile_key) ?? asString(landingContract?.landing_contract_key)

  const issueNumber = asString(issueRecord?.issue_number)
  const issueDate = asString(issueRecord?.issue_date)
  const issueEdition = asString(issueRecord?.edition)
  const issuePublisher = asString(issueRecord?.publisher)
  const issueBranchStanding = asString(issueRecord?.branch_standing)
  const issueDisplayNumber = publicIssueNumber(issueNumber)
  const issueDisplayPeriod = publicIssuePeriod(issueDate)
  const activeIssueLabel =
    issueDisplayNumber && issueDisplayPeriod ? `Issue ${issueDisplayNumber} / ${issueDisplayPeriod}` : null
  const descriptorLine = asString(brandCopy?.descriptor_line)

  const coverEyebrow =
    asString(sectionLabels?.cover_eyebrow) ?? asString(asRecord(landingContract?.hero)?.cover_eyebrow)
  const coverHeadline = asString(coverStory?.feature_headline)
  const coverDeck = asString(coverStory?.feature_deck)
  const coverPositioning = asString(coverStory?.feature_positioning)
  const coreDistinction = asString(coverStory?.core_distinction)

  const insightsEyebrow = asString(sectionLabels?.insights_eyebrow) ?? asString(landingContract?.insights_eyebrow)
  const insightsHeading =
    asString(sectionLabels?.insights_heading) ??
    asString(landingContract?.cover_lines_label) ??
    asString(landingContract?.insights_heading)

  const assessmentFeatureLabel = asString(assessmentFeature?.feature_label)
  const assessmentFeatureTitle = asString(assessmentFeature?.feature_title)
  const assessmentFeatureBody = asString(assessmentFeature?.feature_body)
  const assessmentCtaLabel = asString(assessmentFeature?.cta_label)
  const assessmentRoute = asString(assessmentFeature?.route_path)
  const assessmentRatingDisplay = asString(assessmentFeature?.rating_display)

  const roleCallLabel = asString(roleCallFeature?.feature_label)
  const roleCallTitle = asString(roleCallFeature?.feature_title)
  const roleCallTagline = asString(roleCallFeature?.feature_tagline)
  const roleCallBody = asString(roleCallFeature?.feature_body)
  const roleCallDestinationLabel = asString(roleCallFeature?.destination_label)
  const roleCallStoryBody = asString(roleCallFeature?.story_body)
  const roleCallCtaLabel = asString(roleCallFeature?.cta_label)
  const roleCallUrl = asString(roleCallFeature?.external_url)

  const nextIssueLabel = asString(nextIssueTeaserFeature?.feature_label)
  const nextIssueTitle = asString(nextIssueTeaserFeature?.feature_title)
  const nextIssueBody = asString(nextIssueTeaserFeature?.feature_body)
  const nextIssueHint = asString(nextIssueTeaserFeature?.release_hint)

  const footerLine1 = asString(footerRecord?.footer_line_1)
  const footerLine2 = asString(footerRecord?.footer_line_2)

  // Issue Page sequence — seated by oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1,
  // consumed here by oar2_render_issue001_through_issue_page_model_v1. Renders only seated
  // state; page_number order and release_state come from the DB, never inferred from
  // component order. Empty when no issue-page model is seated for this registry — every
  // section below is optional and the existing DB-metadata-driven sections above/below are
  // untouched, so nothing regresses when issuePages is [].
  const issuePages = encounter.issuePages
  const editorsLetterPage = issuePages.find((p) => p.page_role === "editors_letter") ?? null
  const coverStoryPage = issuePages.find((p) => p.page_role === "cover_story") ?? null
  const contentsPages = issuePages.filter((p) => p.page_role !== "cover" && p.page_role !== "contents")
  const launchCycleIssuePages = issuePages.filter((p) =>
    UNDRIFTED_LAUNCH_CYCLE_001_ARTICLES.some((article) => article.routePath === p.route_path),
  )

  const undriftedBannerUrl =
    mediaUrl(encounter.mediaByRole.get("undrifted_publication_masthead")) ??
    mediaUrl(encounter.mediaByRole.get("undrifted_fill")) ??
    mediaUrl(encounter.mediaByRole.get("ai_isnt_broken_landing"))
  const registryLogoUrl = mediaUrl(encounter.mediaByRole.get("measures_registry_logo"))
  const aiIsntBrokenLandingUrl = mediaUrl(encounter.mediaByRole.get("ai_isnt_broken_landing"))
  const agentsWithKeysCoverUrl = mediaUrl(encounter.mediaByRole.get("agents_with_keys_cover"))
  const fablesAndMythsCoverUrl = mediaUrl(encounter.mediaByRole.get("fables_and_myths_cover"))

  function manifestCover(mediaRole: string | null): string | null {
    if (mediaRole === "agents_with_keys_cover") return agentsWithKeysCoverUrl
    if (mediaRole === "fables_and_myths_cover") return fablesAndMythsCoverUrl
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!onCaptureSubscription) return
    setSubmitting(true)
    setSubError(null)
    setStatus(null)
    const { error } = await onCaptureSubscription({
      email: email.trim().toLowerCase(),
      organization: organization.trim() || null,
      dispatchKey: null,
    })
    setSubmitting(false)
    if (error) {
      setSubError(error)
      return
    }
    setEmail("")
    setOrganization("")
    setStatus("Registry dispatch subscription recorded.")
  }

  if (launchCycleArticle) {
    return (
      <UnDriftedLaunchCycleArticle
        article={launchCycleArticle}
        encounter={encounter}
        registryTokenStyle={registryTokenStyle}
        renderHeader={renderHeader}
        renderSystemFooter={renderSystemFooter}
        styleContractTokens={styleContractTokens}
        profileStyleVars={profileStyleVars}
        landingKey={landingKey}
        styleKey={styleKey}
        encounterProfile={encounterProfile}
        title={title}
      />
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="lapis"
      data-layout-contract="undrifted_publication"
      data-landing-contract={landingKey ?? "missing_landing_contract"}
      data-style-contract={styleKey ?? "missing_style_contract"}
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      data-masthead-behavior={asString(encounterProfile?.masthead_behavior) ?? undefined}
      data-cover-story-behavior={asString(encounterProfile?.cover_story_behavior) ?? undefined}
      data-assessment-behavior={asString(encounterProfile?.assessment_feature_behavior) ?? undefined}
      data-featured-article-behavior={asString(encounterProfile?.featured_article_behavior) ?? undefined}
      data-role-call-behavior={asString(encounterProfile?.role_call_behavior) ?? undefined}
      style={{ ...registryTokenStyle, ...styleContractTokens, ...profileStyleVars }}
    >
      {renderHeader({ title })}
      <section className="undrifted-shell undrifted-cover-canvas" aria-label={title}>

        {/* MASTHEAD */}
        <header className="undrifted-masthead" aria-label="unDrifted publication masthead">
          {undriftedBannerUrl ? (
            <img className="undrifted-banner" src={undriftedBannerUrl} alt={title} loading="eager" />
          ) : (
            <div className="undrifted-masthead-nameplate">
              {primaryLogoPath ? (
                <img className="undrifted-masthead-logo" src={primaryLogoPath} alt={title} loading="eager" />
              ) : (
                <span className="undrifted-wordmark" aria-label={title}>
                  <span>un</span>
                  <strong>Drifted</strong>
                </span>
              )}
              {mastHeadPrinciples || descriptorLine ? (
                <div className="undrifted-masthead-text">
                  {mastHeadPrinciples ? (
                    <span className="undrifted-masthead-principles">{mastHeadPrinciples}</span>
                  ) : null}
                  {descriptorLine ? (
                    <span className="undrifted-masthead-descriptor">{descriptorLine}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </header>
        <p className="undrifted-masthead-slogan">
          Structural drift is detectable. Collapse is not the default.
        </p>
        <hr className="undrifted-masthead-rule" aria-hidden="true" />
        {issueNumber || issueDate || issueEdition || issuePublisher || issueBranchStanding ? (
          <div className="undrifted-issue-rail" aria-label="Issue information">
            <div className="undrifted-issue-rail-left">
              {activeIssueLabel ? <span>{activeIssueLabel}</span> : null}
              {!activeIssueLabel && issueNumber ? <span>ISSUE {issueNumber}</span> : null}
              {!activeIssueLabel && issueDate ? <span>{issueDate}</span> : null}
              {issueEdition ? <span>{issueEdition}</span> : null}
            </div>
            {issuePublisher || issueBranchStanding ? (
              <div className="undrifted-issue-rail-right">
                {issuePublisher ? <span>{issuePublisher}</span> : null}
                {issueBranchStanding ? <span>{issueBranchStanding}</span> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Issue 002 Current Desks section (rendered only if current standing is Issue 002) */}
        {issueNumber === "002" ? (
          <section className="undrifted-desks-section" style={{ borderBottom: "1px solid rgba(237, 242, 248, 0.1)", paddingBottom: "2.5rem", marginBottom: "2.5rem" }}>
            <div className="undrifted-insights-header" style={{ marginBottom: "1.5rem" }}>
              <span className="undrifted-eyebrow">Current Desks — Issue 002</span>
              <h2>{activeIssueLabel ? `${activeIssueLabel} Desks` : "Issue 002 Desks"}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))", gap: "1.5rem" }}>
              {asRecordArray(meta?.editorial_sections).map((sec, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", border: "1px solid rgba(237, 242, 248, 0.1)", padding: "1.5rem", background: "rgba(237, 242, 248, 0.02)" }}>
                  <span className="undrifted-eyebrow" style={{ color: "var(--undrifted-cyan)", fontSize: "0.7rem" }}>Desk 0{idx + 1}</span>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.4-rem", margin: 0, color: "var(--undrifted-text)", fontWeight: 500 }}>{asString(sec.title)}</h3>
                  {asString(sec.question) ? (
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--undrifted-muted)", lineHeight: "1.5" }}>{asString(sec.question)}</p>
                  ) : null}
                </div>
              ))}
            </div>
            <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "var(--undrifted-muted)", fontStyle: "italic", textAlign: "center" }}>
              Issue 002 dispatches are approved and undergoing registry standing review prior to publication.
            </p>
          </section>
        ) : null}

        {/* Historical Issue 001 Preserved Dispatches Section */}
        <section className="undrifted-launch-cycle" aria-label="Historical Preserved Issue 001 Dispatches" style={issueNumber === "002" ? { borderTop: "none" } : undefined}>
          <div className="undrifted-insights-header">
            <span className="undrifted-eyebrow">{issueNumber === "002" ? "Historical Preserved Dispatches" : "Launch Cycle 001"}</span>
            <h2>
              {issueNumber === "002" ? "Issue 001 Preserved Dispatches" : (activeIssueLabel ? `${activeIssueLabel} Field Publications` : "Issue 01 Field Publications")}
            </h2>
          </div>
          <div className="undrifted-launch-cycle-grid">
            {UNDRIFTED_LAUNCH_CYCLE_001_ARTICLES.filter((article) => article.issueLabel === "Launch Cycle 001").map((article) => (
              <article
                className="undrifted-launch-cycle-card"
                key={article.publicationId}
                data-publication-id={article.publicationId}
              >
                <img src={article.bannerUrl} alt={article.bannerAlt} loading="lazy" />
                <div>
                  <span className="undrifted-eyebrow">{article.publicationLabel}</span>
                  <h3>{article.title}</h3>
                  {article.subtitle ? <p className="undrifted-launch-cycle-subtitle">{article.subtitle}</p> : null}
                  <p>{article.issueExcerpt}</p>
                  <div className="undrifted-article-meta">
                    <span>{article.authorName}</span>
                    <span>{article.publicationDate}</span>
                  </div>
                  <a href={article.routePath}>Read on Measures Registry →</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EDITOR'S LETTER — Issue Page model, page_role: editors_letter */}
        {editorsLetterPage ? (
          <section className="undrifted-editors-letter" aria-label={editorsLetterPage.title}>
            <h2>{editorsLetterPage.title}</h2>
            {editorsLetterPage.subtitle ? (
              <p className="undrifted-editors-letter-subtitle">{editorsLetterPage.subtitle}</p>
            ) : null}
            {issuePageIsHeld(editorsLetterPage) ? (
              <span className="undrifted-issue-page-held">Coming soon</span>
            ) : issuePageHref(editorsLetterPage) ? (
              <a
                className="undrifted-issue-page-link"
                href={issuePageHref(editorsLetterPage) as string}
                target="_blank"
                rel="noreferrer"
              >
                Read →
              </a>
            ) : null}
          </section>
        ) : null}

        {/* CONTENTS — Issue Page model, page_role: contents. Lists every other seated page in
            page_number order; never infers order from component/render order. */}
        {contentsPages.length > 0 ? (
          <nav className="undrifted-contents" aria-label="Issue Contents">
            <h2>Contents</h2>
            <ol className="undrifted-contents-list">
              {contentsPages.map((page) => {
                const href = issuePageHref(page)
                const held = issuePageIsHeld(page)
                const external = href?.startsWith("http") ?? false
                return (
                  <li key={page.page_key} data-page-role={page.page_role} data-release-state={page.release_state}>
                    {href && !held ? (
                      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                        {page.title}
                      </a>
                    ) : (
                      <span>{page.title}</span>
                    )}
                    {held ? <span className="undrifted-issue-page-held"> · Coming soon</span> : null}
                  </li>
                )
              })}
              {launchCycleIssuePages.map((page) => {
                const href = issuePageHref(page)
                const held = issuePageIsHeld(page)
                return (
                  <li key={page.page_key} data-page-role={page.page_role} data-release-state={page.release_state}>
                    {href && !held ? (
                      <a href={href}>{page.title}</a>
                    ) : (
                      <span>{page.title}</span>
                    )}
                    {held ? <span className="undrifted-issue-page-held"> · Coming soon</span> : null}
                  </li>
                )
              })}
            </ol>
          </nav>
        ) : null}

        {/* COVER */}
        <section className="undrifted-cover" aria-label="Cover story">
          <div className="undrifted-cover-visual">
            {aiIsntBrokenLandingUrl ? (
              <img src={aiIsntBrokenLandingUrl} alt="unDrifted — Issue 001 Launch Edition" loading="eager" />
            ) : null}
          </div>
          <div className="undrifted-cover-editorial">
            {coverEyebrow ? <span className="undrifted-eyebrow">{coverEyebrow}</span> : null}
            {coverHeadline ? (
              <h1>
                <a className="undrifted-cover-headline-link" href="/ai-operations-assessment">
                  {coverHeadline}
                </a>
              </h1>
            ) : null}
            {coverDeck ? <p className="undrifted-cover-deck">{coverDeck}</p> : null}
            {coverPositioning ? (
              <p className="undrifted-cover-deck">
                <strong>{coverPositioning}</strong>
              </p>
            ) : null}
            {coreDistinction ? (
              <div className="undrifted-cover-assessment">
                <p>{coreDistinction}</p>
              </div>
            ) : null}
            {/* Cover Story article link — Issue Page model, page_role: cover_story.
                Held pages never get a link (Routed §4: must not expose an unpublished cover
                story as clickable); released pages link to their real, seated URL only. */}
            {coverStoryPage ? (
              issuePageIsHeld(coverStoryPage) ? (
                <span className="undrifted-issue-page-held undrifted-cover-story-status">
                  Full article coming soon
                </span>
              ) : issuePageHref(coverStoryPage) ? (
                <a
                  className="undrifted-cover-story-link"
                  href={issuePageHref(coverStoryPage) as string}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the full article →
                </a>
              ) : null
            ) : null}
          </div>
        </section>

        {/* EDITOR'S FEATURE */}
        {assessmentFeatureLabel || assessmentFeatureTitle ? (
          <section
            className="undrifted-editor-feature"
            aria-label={assessmentFeatureTitle ?? "Editor's Feature"}
          >
            {registryLogoUrl ? (
              <img
                className="undrifted-editor-feature-mark"
                src={registryLogoUrl}
                alt="Measures Registry"
                loading="lazy"
              />
            ) : null}
            {assessmentFeatureLabel ? (
              <span className="undrifted-eyebrow">{assessmentFeatureLabel}</span>
            ) : null}
            {assessmentFeatureTitle ? <h2>{assessmentFeatureTitle}</h2> : null}
            {assessmentRatingDisplay ? (
              <div className="undrifted-assessment-rating">{assessmentRatingDisplay}</div>
            ) : null}
            {assessmentFeatureBody ? <p>{assessmentFeatureBody}</p> : null}
            {assessmentRoute ? (
              <a className="undrifted-cta-primary" href={assessmentRoute}>
                {assessmentCtaLabel ?? "Begin Assessment →"}
              </a>
            ) : null}
          </section>
        ) : null}

        {/* FEATURED ARTICLES */}
        {featuredArticleSet.length > 0 ? (
          <section className="undrifted-insights" aria-label="Feature articles">
            {insightsEyebrow || insightsHeading ? (
              <div className="undrifted-insights-header">
                {insightsEyebrow ? (
                  <span className="undrifted-eyebrow">{insightsEyebrow}</span>
                ) : null}
                {insightsHeading ? <h2>{insightsHeading}</h2> : null}
              </div>
            ) : null}
            <div className="undrifted-insights-grid">
              {featuredArticleSet.map((article) => {
                const articleTitle = asString(article.title)
                const coverUrl = manifestCover(asString(article.media_role))
                const eyebrow =
                  asString(article.feature_label) ?? asString(article.section_label)
                const teaser = asString(article.teaser) ?? asString(article.excerpt)
                const desc = asString(article.description) ?? asString(article.subtitle)
                const articleUrl =
                  asString(article.article_url) ?? asString(article.external_url) ?? null
                const pubState = asString(article.publication_state)
                if (!articleTitle) return null
                return (
                  <article
                    key={articleTitle}
                    className="undrifted-insight-card"
                    data-publish-state={pubState ?? "held"}
                    data-media-role={asString(article.media_role) ?? undefined}
                  >
                    {coverUrl ? (
                      <div className="undrifted-insight-cover">
                        <img src={coverUrl} alt="" loading="lazy" />
                      </div>
                    ) : null}
                    <div className="undrifted-insight-body">
                      {eyebrow ? (
                        <span className="undrifted-eyebrow">{eyebrow}</span>
                      ) : null}
                      <h3>{articleTitle}</h3>
                      {teaser ? (
                        <p className="undrifted-insight-teaser">{teaser}</p>
                      ) : null}
                      {desc ? <p>{desc}</p> : null}
                      {articleUrl ? (
                        <a href={articleUrl} target="_blank" rel="noreferrer">
                          Read the Dispatch →
                        </a>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}

        {/* ROLE CALL */}
        {roleCallLabel || roleCallTitle ? (
          <section className="undrifted-role-call" aria-label={roleCallTitle ?? "Role Call"}>
            {roleCallLabel ? (
              <span className="undrifted-eyebrow">{roleCallLabel}</span>
            ) : null}
            {roleCallTitle ? <h2>{roleCallTitle}</h2> : null}
            {roleCallTagline ? (
              <p className="undrifted-role-call-tagline">{roleCallTagline}</p>
            ) : null}
            {roleCallBody ? (
              <p className="undrifted-role-call-body">{roleCallBody}</p>
            ) : null}
            {roleCallDestinationLabel ? (
              <p className="undrifted-role-call-destination">{roleCallDestinationLabel}</p>
            ) : null}
            {roleCallStoryBody ? (
              <p className="undrifted-role-call-story">{roleCallStoryBody}</p>
            ) : null}
            {roleCallUrl && roleCallCtaLabel ? (
              <a
                className="undrifted-cta-primary"
                href={roleCallUrl}
                target="_blank"
                rel="noreferrer"
              >
                {roleCallCtaLabel}
              </a>
            ) : null}
          </section>
        ) : null}

        {/* NEXT ISSUE */}
        {nextIssueLabel || nextIssueTitle ? (
          <section
            className="undrifted-next-issue"
            aria-label={nextIssueTitle ?? "Next Issue"}
          >
            {nextIssueLabel ? (
              <span className="undrifted-eyebrow">{nextIssueLabel}</span>
            ) : null}
            {nextIssueTitle ? <h2>{nextIssueTitle}</h2> : null}
            {nextIssueBody ? <p>{nextIssueBody}</p> : null}
            {nextIssueHint ? (
              <span className="undrifted-masthead-edition">{nextIssueHint}</span>
            ) : null}
          </section>
        ) : null}

        {/* SUBSCRIPTION — only rendered when Encounter Boundary provides the capture callback */}
        {onCaptureSubscription ? (
          <section
            className="registry-publication-subscribe-capture"
            aria-label="Subscribe to Structural Drift"
          >
            <form onSubmit={handleSubmit}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <span>Organization</span>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </label>
              <button type="submit" disabled={submitting}>
                {submitting ? "Recording..." : "View Field Notes"}
              </button>
              {status ? <p className="reserve-seat-success">{status}</p> : null}
              {subError ? <p className="reserve-seat-error">{subError}</p> : null}
            </form>
          </section>
        ) : null}

        <footer className="undrifted-connect-footer" aria-label="Publication footer">
          {footerLine1 ? <p className="undrifted-footer-line">{footerLine1}</p> : null}
          {footerLine2 ? <p className="undrifted-footer-line">{footerLine2}</p> : null}
        </footer>

      </section>
      {renderSystemFooter()}
    </main>
  )
}

function UnDriftedLaunchCycleArticle({
  article,
  encounter,
  registryTokenStyle,
  renderHeader,
  renderSystemFooter,
  styleContractTokens,
  profileStyleVars,
  landingKey,
  styleKey,
  encounterProfile,
  title,
}: {
  article: UndriftedLaunchCycleArticle
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
  styleContractTokens: CSSProperties | undefined
  profileStyleVars: CSSProperties | undefined
  landingKey: string | null
  styleKey: string | null
  encounterProfile: Record<string, unknown> | null
  title: string
}) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="lapis"
      data-layout-contract="undrifted_publication"
      data-landing-contract={landingKey ?? "missing_landing_contract"}
      data-style-contract={styleKey ?? "missing_style_contract"}
      data-release-standing="public"
      data-publication-projection="undrifted_registered_asset_bridge"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      data-masthead-behavior={asString(encounterProfile?.masthead_behavior) ?? undefined}
      data-cover-story-behavior={asString(encounterProfile?.cover_story_behavior) ?? undefined}
      data-assessment-behavior={asString(encounterProfile?.assessment_feature_behavior) ?? undefined}
      data-featured-article-behavior={asString(encounterProfile?.featured_article_behavior) ?? undefined}
      data-role-call-behavior={asString(encounterProfile?.role_call_behavior) ?? undefined}
      style={{ ...registryTokenStyle, ...styleContractTokens, ...profileStyleVars }}
    >
      {renderHeader({ title })}
      <article className="undrifted-shell undrifted-article-shell" aria-label={article.title}>
        <nav className="undrifted-article-return" aria-label="unDrifted navigation">
          <a href="/undrifted">unDrifted</a>
          <span aria-hidden="true">/</span>
          <span>{article.issueLabel}</span>
        </nav>
        <header className="undrifted-article-header">
          <img className="undrifted-article-banner" src={article.bannerUrl} alt={article.bannerAlt} loading="eager" />
          <div className="undrifted-article-kicker">{article.publicationLabel}</div>
          <h1>{article.title}</h1>
          {article.subtitle ? <p className="undrifted-article-subtitle">{article.subtitle}</p> : null}
          <div className="undrifted-article-meta">
            <span>{article.authorName}</span>
            <span>{article.publicationDate}</span>
          </div>
          {article.dependencyRoutePath && article.dependencyLabel ? (
            <p className="undrifted-article-dependency">
              Responds to <a href={article.dependencyRoutePath}>{article.dependencyLabel}</a>.
            </p>
          ) : null}
        </header>
        <section className="undrifted-article-body" data-source-asset={article.canonicalAssetPath}>
          <ReactMarkdown>{article.bodyMarkdown}</ReactMarkdown>
        </section>
        <footer className="undrifted-article-evidence" aria-label="Publication evidence">
          <p>
            Canonical source: <code>{article.canonicalAssetPath}</code>
          </p>
          <p>
            Publication record: <code>{article.publicationRecordPath}</code>
          </p>
        </footer>
      </article>
      {renderSystemFooter()}
    </main>
  )
}

// --- publication_dispatch ---------------------------------------------------

// Publication dispatch article content (dispatch_body, article-specific media,
// issue metadata) is not yet piped through the encounter data model.
// Renders the publication container with encounter context; honest gap for article body.
function PublicationDispatch({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: LapisChamberProps) {
  const title = encounter.encounterDef?.display_title ?? "unDrifted"
  const next = resolveNextSurface(encounter)

  return (
    <main
      className="measures-registry-runtime"
      data-surface="publication_dispatch"
      data-material-family="lapis"
      data-layout-contract="publication_encounter"
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <article className="registry-publication-dispatch" aria-label={title}>
        <header className="registry-publication-dispatch-header">
          <span>{title}</span>
        </header>
        {/* Dispatch article body requires measures_publication_dispatch data.
            That data is not yet in the encounter data model.
            When the resolver is extended to include publication dispatch rows,
            this surface renders the full article. */}
        <section
          className="registry-held-state"
          role="status"
          data-gap-reason="publication_dispatch_not_in_encounter_model"
        >
          <span>Lapis</span>
          <p>Publication dispatch content is not yet seated in the encounter data model.</p>
        </section>
        {next ? (
          <section className="registry-publication-cta" aria-label="Navigation">
            <button type="button" onClick={() => onNavigate(next as EncounterSurface)}>
              Continue
            </button>
          </section>
        ) : null}
      </article>
      {renderSystemFooter()}
    </main>
  )
}

// --- Measures Registry Home (Lapis-led Public Relational Encounter) ---------

function MeasuresRegistryHome({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: LapisChamberProps) {
  const [aboutVideoActivated, setAboutVideoActivated] = useState(false)
  
  const approved = asRecord(encounter.encounterDef?.metadata?.approved_content_contract)
  if (!approved) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface={encounter.surface}
        data-material-family="lapis"
        data-release-standing="held_missing_registry_content"
        style={registryTokenStyle}
      >
        {renderHeader({ title: "Measures Registry" })}
        <section className="registry-held-state" role="status">
          <span>Lapis Chamber</span>
          <p>Measures Registry Home content is not seated in the registry.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  // Seated branding and content properties
  const identity = asRecord(approved.identity)
  const category = asString(identity?.category) ?? "Computational Systems Governance"
  const tagline = asString(identity?.tagline) ?? "Governed Systems. Relational Operations."
  const missionText = asString(approved.mission) ?? "Make computational participation governable."

  // Hero & Brand media consumed through registered encounter media roles
  const presentationSealRow = encounter.mediaByRole.get("mr_public_presentation_seal_artwork_webp_v1")
  const socialBannerRow = encounter.mediaByRole.get("mr_public_social_banner_webp_v1")
  const presentationSealUrl = mediaUrl(presentationSealRow)
  const socialBannerUrl = mediaUrl(socialBannerRow)

  // Hero media
  const videoRow = encounter.mediaByRole.get("about_measures_registry_video")
  const posterRow = encounter.mediaByRole.get("about_hero_poster")
  const videoUrl = mediaUrl(videoRow)
  const posterUrl = mediaUrl(posterRow)

  // Section list from metadata
  const sectionsArray = asRecordArray(approved.sections)
  const getSection = (key: string) => sectionsArray.find((s) => asString(s.key) === key)

  const heroSection = getSection("hero")
  const problemSection = getSection("problem")
  const positionSection = getSection("position")
  const missionSection = getSection("mission")
  const assessmentSection = getSection("assessment")
  const alignmentSection = getSection("alignment")
  const registrySection = getSection("registry")
  const operationsRelationSection = getSection("operations_relation")
  const undriftedSection = getSection("undrifted")
  const institutionalRelationSection = getSection("institutional_relation")

  return (
    <main
      className="measures-registry-runtime"
      data-surface="measures_registry_home"
      data-material-family="lapis"
      data-layout-contract="measures_registry_home"
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      style={registryTokenStyle}
    >
      {renderHeader({ title: "Measures Registry" })}

      <div className="registry-home-shell">
        {/* 1. HERO SECTION - Approved registered Measures Registry banner as Hero */}
        {socialBannerUrl ? (
          <section id="hero" className="registry-home-hero-banner" aria-label="Hero Banner" style={{ width: "100%", overflow: "hidden", borderBottom: "1px solid rgba(114, 144, 188, 0.15)", paddingBottom: "2rem" }}>
            <img
              src={socialBannerUrl}
              alt="Measures Registry — Computational Systems Governance — Governed Systems. Relational Operations."
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="eager"
            />
          </section>
        ) : null}

        {/* space / material transition */}
        <div style={{ height: "3rem" }} />

        {/* Approved talking-head video */}
        {videoUrl ? (
          <section className="registry-home-video-section" aria-label="Orientation Video" style={{ borderBottom: "1px solid rgba(114, 144, 188, 0.15)", paddingBottom: "3.5rem" }}>
            <div className="registry-home-video-wrapper" style={{ maxWidth: "36rem", margin: "0 auto", width: "100%" }}>
              {aboutVideoActivated ? (
                <video
                  src={videoUrl}
                  poster={posterUrl ?? undefined}
                  controls
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Measures Registry Orientation"
                />
              ) : posterUrl ? (
                <div className="registry-home-video-poster" onClick={() => setAboutVideoActivated(true)}>
                  <img src={posterUrl} alt="Video Poster" loading="eager" />
                  <button type="button" className="registry-home-video-play-btn" aria-label="Play video">
                    <span aria-hidden="true">▶</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="registry-home-video-activate-btn"
                  onClick={() => setAboutVideoActivated(true)}
                  aria-label="Play video"
                >
                  <span>▶ Play Video</span>
                </button>
              )}
            </div>
          </section>
        ) : null}

        {/* 2. THE PROBLEM SECTION */}
        {problemSection ? (
          <section id="problem" className="registry-home-problem" aria-label="The Problem" style={{ maxWidth: "48rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(114, 144, 188, 0.15)" }}>
            <span className="registry-home-section-eyebrow">The Problem</span>
            <h2 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 700, margin: "0 0 1rem" }}>{asString(problemSection.heading)}</h2>
            <p className="registry-home-core-line" style={{ fontSize: "1.25rem", color: "rgba(237, 242, 248, 0.85)", lineHeight: "1.5" }}>{asString(problemSection.core_line)}</p>
          </section>
        ) : null}

        {/* 3. MEASURES REGISTRY POSITION SECTION */}
        {positionSection ? (
          <section id="position" className="registry-home-position" aria-label="Our Position" style={{ maxWidth: "48rem", borderLeft: "2px solid var(--registry-accent-lapis-primary, #92bbf3)", padding: "2rem 2.5rem", background: "rgba(146, 187, 243, 0.04)", borderRadius: "4px" }}>
            <span className="registry-home-section-eyebrow">Home Positioning</span>
            <h2 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, margin: "0 0 1rem" }}>{asString(positionSection.heading)}</h2>
            <p className="registry-home-core-line" style={{ fontSize: "1.1rem", fontStyle: "italic", marginBottom: "1rem" }}>{asString(positionSection.core_line)}</p>
            {asString(positionSection.public_positioning) ? (
              <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: "1.65", color: "rgba(237, 242, 248, 0.78)" }}>
                {asString(positionSection.public_positioning)}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* 4. MISSION SECTION */}
        {missionSection ? (
          <section id="mission" className="registry-home-mission" aria-label="Our Mission" style={{ maxWidth: "42rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(114, 144, 188, 0.15)" }}>
            <span className="registry-home-section-eyebrow">Mission</span>
            <p className="registry-home-mission-text" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", fontWeight: 400, fontFamily: "var(--registry-font-heading, Georgia, serif)", lineHeight: "1.3", color: "var(--registry-brand-primary-text, #edf2f8)", margin: 0 }}>{asString(missionSection.heading) ?? missionText}</p>
          </section>
        ) : null}

        {/* 5. ASSESSMENT SECTION - Guides user to the Assessment Passage video */}
        {assessmentSection ? (
          <section id="assessment" className="registry-home-assessment" aria-label="Assessment" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <span className="registry-home-section-eyebrow">Assessment</span>
            <h2 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(1.7rem, 3vw, 2.4rem)", margin: 0 }}>{asString(assessmentSection.heading)}</h2>
            <div className="registry-home-assessment-card" style={{ padding: "1.5rem 2rem", background: "rgba(237, 242, 248, 0.02)", border: "1px solid rgba(114, 144, 188, 0.2)", borderRadius: "2rem", maxWidth: "38rem" }}>
              <h3 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(1.35rem, 2vw, 1.65rem)", margin: "0 0 0.5rem", color: "var(--registry-brand-primary-text, #edf2f8)" }}>{asString(assessmentSection.assessment_name) ?? "AI Operations Assessment"}</h3>
              <p className="registry-home-progression-path" style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.04em", color: "var(--registry-accent-lapis-primary, #92bbf3)", margin: "0 0 1rem" }}>{asString(assessmentSection.progression)}</p>
              <button
                type="button"
                className="registry-home-card-cta"
                onClick={() => onNavigate("obsidian_chamber_orientation")}
              >
                Assess the Environment →
              </button>
            </div>
          </section>
        ) : null}

        {/* 6. ALIGNMENT / GOVERNED PROGRESSION SECTION */}
        {alignmentSection ? (
          <section id="alignment" className="registry-home-alignment" aria-label="Progression" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <span className="registry-home-section-eyebrow">Alignment / Governed Progression</span>
            <h2 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(1.7rem, 3vw, 2.4rem)", margin: 0 }}>{asString(alignmentSection.heading)}</h2>
            <div className="registry-home-progression-steps">
              {asStringArray(alignmentSection.progression).map((step, idx) => (
                <div key={step} className="registry-home-progression-step">
                  <span className="registry-home-step-num">0{idx + 1}</span>
                  <span className="registry-home-step-name">{step}</span>
                  {idx < asStringArray(alignmentSection.progression).length - 1 ? (
                    <span className="registry-home-step-arrow" aria-hidden="true">→</span>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* 7. THE REGISTRY SECTION */}
        {registrySection ? (
          <section id="registry" className="registry-home-registry" aria-label="The Registry" style={{ maxWidth: "48rem" }}>
            <span className="registry-home-section-eyebrow">The Registry</span>
            <h2 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", margin: "0 0 1rem" }}>{asString(registrySection.heading)}</h2>
            <p className="registry-home-boundary-desc">{asString(registrySection.boundary)}</p>
          </section>
        ) : null}

        {/* 8. REGISTRY → GOVERNED OPERATIONS BOUNDARY SECTION */}
        {operationsRelationSection ? (
          <section id="operations_relation" className="registry-home-operations-relation" aria-label="Registry Operations" style={{ maxWidth: "48rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(114, 144, 188, 0.15)" }}>
            <span className="registry-home-section-eyebrow">Registry &rarr; Governed Operations</span>
            <h2 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(1.65rem, 3vw, 2.3rem)", fontWeight: 700, margin: "0 0 1rem" }}>{asString(operationsRelationSection.heading)}</h2>
            <p className="registry-home-boundary-desc" style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "rgba(237, 242, 248, 0.85)" }}>{asString(operationsRelationSection.boundary)}</p>
            {asString(operationsRelationSection.portable_standing_line) ? (
              <p style={{ marginTop: "1rem", fontSize: "1rem", fontStyle: "italic", color: "var(--registry-accent-lapis-primary, #92bbf3)" }}>
                {asString(operationsRelationSection.portable_standing_line)}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* 9. UNDRIFTED SECTION */}
        {undriftedSection ? (
          <section id="undrifted" className="registry-home-undrifted" aria-label="unDrifted Publication" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <span className="registry-home-section-eyebrow">unDrifted Publication</span>
            <div className="registry-home-undrifted-card" style={{ padding: "1.5rem 2rem", background: "rgba(237, 242, 248, 0.02)", border: "1px solid rgba(114, 144, 188, 0.2)", borderRadius: "2rem", maxWidth: "42rem" }}>
              <div className="registry-home-undrifted-card-header">
                <h2>{asString(undriftedSection.name) ?? "unDrifted"}</h2>
                <span className="registry-home-undrifted-issue">Active Issue {asString(undriftedSection.issue)}</span>
              </div>
              <p className="registry-home-undrifted-tagline">{asString(undriftedSection.tagline)}</p>
              <p className="registry-home-undrifted-rhythm">{asString(undriftedSection.rhythm_line)}</p>
              
              <div className="registry-home-undrifted-sections">
                <h4>Featured Sections:</h4>
                <ul>
                  {asStringArray(undriftedSection.sections).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              
              <button
                type="button"
                className="registry-home-card-cta"
                onClick={() => onNavigate("lapis_chamber_encounter")}
              >
                Explore unDrifted Publications &rarr;
              </button>
            </div>
          </section>
        ) : null}

        {/* 10. INSTITUTIONAL RELATION SECTION - Presentation Seal used in its actual relational provenance context */}
        {institutionalRelationSection ? (
          <section id="institutional_relation" className="registry-home-institutional-relation" aria-label="Institutional Relation" style={{ borderTop: "1px solid rgba(114, 144, 188, 0.15)", paddingTop: "4rem" }}>
            <span className="registry-home-section-eyebrow">Institutional Relation</span>
            <div className="registry-home-institutional-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "center" }}>
              {presentationSealUrl ? (
                <div style={{ maxWidth: "7.5rem", margin: "0 auto" }}>
                  <img
                    src={presentationSealUrl}
                    alt="Measures Registry Public Presentation Seal"
                    style={{ width: "100%", height: "auto" }}
                    loading="lazy"
                  />
                </div>
              ) : null}
              
              <div className="registry-home-institutional-copy" style={{ textAlign: "center" }}>
                <h2 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(1.65rem, 3vw, 2.2rem)", margin: "0 0 1rem", fontWeight: 700 }}>{asString(institutionalRelationSection.branch_relation)}</h2>
                <p style={{ margin: 0, fontSize: "1.05rem", color: "rgba(237, 242, 248, 0.72)" }}>
                  {asString(institutionalRelationSection.operator)}
                </p>
                {asString(institutionalRelationSection.closing_positioning) ? (
                  <p style={{ marginTop: "1rem", fontSize: "1.05rem", fontStyle: "italic", color: "var(--registry-accent-lapis-primary, #92bbf3)", maxWidth: "38rem", marginLeft: "auto", marginRight: "auto" }}>
                    {asString(institutionalRelationSection.closing_positioning)}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {renderSystemFooter()}
    </main>
  )
}

// --- Measures Registry FAQ / Questions Surface (Lapis-led Public Relational) --

function MeasuresRegistryFaq({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: LapisChamberProps) {
  const approved = asRecord(encounter.encounterDef?.metadata?.approved_content_contract)
  if (!approved) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface={encounter.surface}
        data-material-family="lapis"
        data-release-standing="held_missing_registry_content"
        style={registryTokenStyle}
      >
        {renderHeader({ title: "Measures Registry" })}
        <section className="registry-held-state" role="status">
          <span>Lapis Chamber</span>
          <p>Questions surface content is not seated in the registry.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  // Seated title
  const title = asString(approved.title) ?? "Questions — Measures Registry"

  // Brand assets fetched via registered media roles
  const socialBannerRow = encounter.mediaByRole.get("mr_public_social_banner_webp_v1")
  const presentationSealRow = encounter.mediaByRole.get("mr_public_presentation_seal_artwork_webp_v1")
  const socialBannerUrl = mediaUrl(socialBannerRow)
  const presentationSealUrl = mediaUrl(presentationSealRow)

  // Parse questions list dynamically from metadata
  const questionsList = asRecordArray(approved.questions).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  )

  return (
    <main
      className="measures-registry-runtime"
      data-surface="measures_registry_faq"
      data-material-family="lapis"
      data-layout-contract="measures_registry_faq"
      data-release-standing="public"
      {...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}
      style={registryTokenStyle}
    >
      {renderHeader({ title: "Measures Registry" })}

      <div className="registry-home-shell" style={{ maxWidth: "48rem" }}>
        
        {/* Restrained Width Masthead Banner */}
        {socialBannerUrl ? (
          <div className="registry-faq-banner-wrapper" style={{ width: "100%", maxWidth: "36rem", margin: "0 auto 2.5rem", overflow: "hidden", border: "1px solid rgba(114, 144, 188, 0.15)", borderRadius: "4px" }}>
            <img
              src={socialBannerUrl}
              alt="Measures Registry"
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="eager"
            />
          </div>
        ) : null}

        {/* Public Page Heading */}
        <h1 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, textAlign: "center", margin: "0 0 3.5rem" }}>
          {title}
        </h1>

        {/* FAQ Content Section (Editorial Open Document Scroll, Not SaaS Accordions) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
          {questionsList.map((item, idx) => {
            const q = asString(item.question)
            const a = asString(item.answer)
            if (!q || !a) return null
            return (
              <article key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderBottom: "1px solid rgba(114, 144, 188, 0.1)", paddingBottom: "2.5rem" }}>
                <h3 style={{ fontFamily: "var(--registry-font-heading, Georgia, serif)", fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "var(--registry-brand-primary-text, #edf2f8)" }}>
                  {q}
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.65", color: "rgba(237, 242, 248, 0.72)", margin: 0 }}>
                  {a}
                </p>
              </article>
            )
          })}
        </div>

        {/* Relational / Provance Presentation Seal Placement */}
        {presentationSealUrl ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "4rem", borderTop: "1px solid rgba(114, 144, 188, 0.15)", paddingTop: "3rem" }}>
            <img
              src={presentationSealUrl}
              alt="Measures Registry Public Presentation Seal"
              style={{ width: "6.5rem", height: "auto", opacity: 0.8 }}
              loading="lazy"
            />
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "rgba(237, 242, 248, 0.4)" }}>
              OPERATOR AUTHORIZED RECORD · REGISTERED STANDING
            </span>
          </div>
        ) : null}

      </div>

      {renderSystemFooter()}
    </main>
  )
}
