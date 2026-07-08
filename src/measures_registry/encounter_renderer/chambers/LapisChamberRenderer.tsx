import type { CSSProperties, FormEvent, ReactNode } from "react"
import { useState } from "react"
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
} from "../shared/encounterRendererUtils"
import { encounterStyleDataAttributes } from "../styles/encounterStyleProfile"

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
  if (routeState === "live_but_not_wired_as_issue_page" && page.route_path) return page.route_path
  return asString(metadata?.external_url)
}

function issuePageIsHeld(page: EncounterIssuePageRow | null): boolean {
  return !page || page.release_state !== "released"
}

function resolveNextSurface(encounter: RenderableEncounter): string | null {
  return asString(encounter.transitionNodes[encounter.surface]?.next_surface)
}

// --- Entry point ------------------------------------------------------------

// Receives only RenderableEncounter. No DB access. No authority decisions.
// Dispatches to sub-presentations by surface key (seated in DB via surface assignment).
export default function LapisChamberRenderer(props: LapisChamberProps) {
  const { surface } = props.encounter

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

  const meta = asRecord(encounter.encounterDef?.metadata)
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
              {issueNumber ? <span>ISSUE {issueNumber}</span> : null}
              {issueDate ? <span>{issueDate}</span> : null}
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
