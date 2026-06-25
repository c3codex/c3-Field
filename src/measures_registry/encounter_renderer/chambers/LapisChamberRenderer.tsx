import type { CSSProperties, FormEvent, ReactNode } from "react"
import { useState } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type { EncounterMediaRow, EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"
import {
  asRecord,
  asRecordArray,
  asString,
} from "../../registered_runtime/registeredRuntimeUtils"

// Payload for shell-owned subscription capture write.
// Shell provides onCaptureSubscription in Phase 4. Omitting disables capture persistence.
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

function resolveNextSurface(encounter: RenderableEncounter): string | null {
  return asString(encounter.transitionNodes[encounter.surface]?.next_surface)
}

// --- Entry point ------------------------------------------------------------

// Receives only RenderableEncounter. No DB access. No authority decisions.
// Dispatches to sub-presentations by surface key (seated in DB via surface assignment).
export default function LapisChamberRenderer(props: LapisChamberProps) {
  const { surface } = props.encounter

  if (surface === "structural_drift_dispatches") {
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
  const landingContract = asRecord(meta?.landing_design_contract)
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
  const landingKey = asString(landingContract?.landing_contract_key)

  const issueNumber = asString(issueRecord?.issue_number)
  const issueDate = asString(issueRecord?.issue_date)
  const issueEdition = asString(issueRecord?.edition)

  const coverEyebrow = asString(asRecord(landingContract?.hero)?.cover_eyebrow)
  const coverHeadline = asString(coverStory?.feature_headline)
  const coverDeck = asString(coverStory?.feature_deck)
  const coverPositioning = asString(coverStory?.feature_positioning)
  const coreDistinction = asString(coverStory?.core_distinction)

  const insightsEyebrow = asString(landingContract?.insights_eyebrow)
  const insightsHeading =
    asString(landingContract?.cover_lines_label) ?? asString(landingContract?.insights_heading)

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

  const undriftedBannerUrl =
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
      data-surface="structural_drift_dispatches"
      data-material-family="lapis"
      data-layout-contract="undrifted_publication"
      data-landing-contract={landingKey ?? "missing_landing_contract"}
      data-style-contract={styleKey ?? "missing_style_contract"}
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <section className="undrifted-shell undrifted-cover-canvas" aria-label={title}>

        {/* MASTHEAD */}
        <header className="undrifted-masthead" aria-label="unDrifted publication masthead">
          {undriftedBannerUrl ? (
            <img className="undrifted-banner" src={undriftedBannerUrl} alt={title} />
          ) : (
            <div className="undrifted-masthead-nameplate">
              {primaryLogoPath ? (
                <img className="undrifted-masthead-logo" src={primaryLogoPath} alt={title} />
              ) : (
                <span className="undrifted-wordmark" aria-label={title}>
                  <span>un</span>
                  <strong>Drifted</strong>
                </span>
              )}
              {mastHeadPrinciples ? (
                <div className="undrifted-masthead-text">
                  <span className="undrifted-masthead-principles">{mastHeadPrinciples}</span>
                </div>
              ) : null}
            </div>
          )}
        </header>
        <hr className="undrifted-masthead-rule" aria-hidden="true" />
        {issueNumber || issueDate || issueEdition ? (
          <div className="undrifted-issue-rail" aria-label="Issue information">
            {issueNumber ? <span>ISSUE {issueNumber}</span> : null}
            {issueDate ? <span>{issueDate}</span> : null}
            {issueEdition ? <span>{issueEdition}</span> : null}
          </div>
        ) : null}

        {/* COVER */}
        <section className="undrifted-cover" aria-label="Cover story">
          <div className="undrifted-cover-visual">
            {aiIsntBrokenLandingUrl ? (
              <img src={aiIsntBrokenLandingUrl} alt="unDrifted — Issue 001 Launch Edition" />
            ) : null}
          </div>
          <div className="undrifted-cover-editorial">
            {coverEyebrow ? <span className="undrifted-eyebrow">{coverEyebrow}</span> : null}
            {coverHeadline ? <h1>{coverHeadline}</h1> : null}
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
                        <img src={coverUrl} alt="" />
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

        {/* SUBSCRIPTION — only rendered when shell provides the capture callback */}
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
