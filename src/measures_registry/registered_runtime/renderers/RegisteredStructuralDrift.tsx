import type { CSSProperties, FormEvent, ReactNode } from "react"
import {
  asRecord,
  asRecordArray,
  asString,
  asStringArray,
  dispatchIssueLabel,
  dispatchThesis,
  dispatchTypeLabel,
  markdownBlocks,
  cleanMarkdownText,
  youtubeEmbedUrl,
} from "../registeredRuntimeUtils"
import type { EnvironmentalStandingReport, SectionCopy } from "../registeredRuntimeUtils"
import type { LandingUnitRow, PublicationDispatchRow, PublicationRegistryRow } from "../registeredRuntimeTypes"
import { supabase } from "@/integrations/supabase/client"

type Props = {
  registryTokenStyle: CSSProperties
  variant: "index" | "article"
  routePath: string
  structuralDriftCopy: SectionCopy
  publicationLandingUnit: LandingUnitRow | null
  undriftedPublication: PublicationRegistryRow | null
  structuralDriftPublication: PublicationRegistryRow | null
  structuralDriftDispatches: PublicationDispatchRow[]
  selectedPublicationDispatch: PublicationDispatchRow | null
  evalReport: EnvironmentalStandingReport | null
  publicationEmail: string
  publicationOrganization: string
  publicationSubmitting: boolean
  publicationStatus: string | null
  publicationError: string | null
  onBeginEvaluation: () => void
  onContinueToAssessmentPackage: () => void
  onGoToEvalPassage: () => void
  onAboutMeasuresRegistry: () => void
  onOurStory: () => void
  questionsUngovernedVideoUrl: string | null
  questionsUngovernedImageUrl: string | null
  registryLogoUrl: string | null
  aiIsntBrokenLandingUrl: string | null
  undriftedFillUrl: string | null
  agentsWithKeysCoverUrl: string | null
  fablesAndMythsCoverUrl: string | null
  onPublicationEmailChange: (value: string) => void
  onPublicationOrganizationChange: (value: string) => void
  onSubmitSubscription: (event: FormEvent<HTMLFormElement>) => void
  renderSystemFooter: () => ReactNode
}

function publicationAssetUrl(path: string | null): string | null {
  if (!path) return null
  const normalized = path.startsWith("measures-registry/")
    ? path.slice("measures-registry/".length)
    : path
  return supabase.storage.from("measures-registry").getPublicUrl(normalized).data.publicUrl
}

function metadataRecord(row: PublicationRegistryRow | null, key: string) {
  return asRecord(row?.metadata?.[key])
}

function landingRecord(row: LandingUnitRow | null, key: string) {
  return asRecord(row?.metadata?.[key])
}

export default function RegisteredStructuralDrift({
  registryTokenStyle,
  variant,
  routePath,
  structuralDriftCopy,
  publicationLandingUnit,
  undriftedPublication,
  structuralDriftPublication,
  structuralDriftDispatches,
  selectedPublicationDispatch,
  evalReport,
  publicationEmail,
  publicationOrganization,
  publicationSubmitting,
  publicationStatus,
  publicationError,
  onBeginEvaluation,
  onContinueToAssessmentPackage,
  onGoToEvalPassage,
  onAboutMeasuresRegistry,
  onOurStory,
  questionsUngovernedVideoUrl,
  questionsUngovernedImageUrl,
  registryLogoUrl,
  aiIsntBrokenLandingUrl,
  undriftedFillUrl,
  agentsWithKeysCoverUrl,
  fablesAndMythsCoverUrl,
  onPublicationEmailChange,
  onPublicationOrganizationChange,
  onSubmitSubscription,
  renderSystemFooter,
}: Props) {
  if (variant === "article") {
    const publicationAuthority = undriftedPublication ?? structuralDriftPublication

    if (!publicationAuthority || !selectedPublicationDispatch) {
      return (
        <main
          className="measures-registry-runtime"
          data-surface="publication_dispatch"
          data-material-family="crystal"
          data-layout-contract="publication_encounter"
          data-release-standing="missing_publication_state"
          style={registryTokenStyle}
        >
          <section className="registry-publication-dispatch">
            <p>Publication dispatch is not seated.</p>
          </section>
        </main>
      )
    }

    const mediaManifest = selectedPublicationDispatch.media_manifest ?? {}
    const bannerUrl = publicationAssetUrl(
      asString(mediaManifest.resolved_banner_image) ?? asString(mediaManifest.banner_image),
    )
    const publicationVideo = asString(mediaManifest.publication_video) ? null : (mediaManifest.publication_video as Record<string, unknown> | null)
    const embedUrl = youtubeEmbedUrl(asString(publicationVideo?.external_url))
    const references = selectedPublicationDispatch.references ?? []
    const tags = Array.isArray(selectedPublicationDispatch.tags) ? selectedPublicationDispatch.tags : []

    return (
      <main
        className="measures-registry-runtime"
        data-surface="publication_dispatch"
        data-material-family="crystal"
        data-layout-contract="publication_encounter"
        data-release-standing="published"
        style={registryTokenStyle}
      >
        <article className="registry-publication-dispatch" aria-label={selectedPublicationDispatch.title}>
          <header className="registry-publication-dispatch-header">
            <span>{publicationAuthority.title}</span>
            <p>{publicationAuthority.subtitle}</p>
            <h1>{selectedPublicationDispatch.title}</h1>
            {selectedPublicationDispatch.excerpt ? <p>{selectedPublicationDispatch.excerpt}</p> : null}
            {tags.length > 0 ? (
              <div className="registry-publication-tags" aria-label="Dispatch tags">
                {tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
          </header>

          {bannerUrl ? <img className="registry-publication-banner" src={bannerUrl} alt="" /> : null}

          {embedUrl ? (
            <div className="registry-publication-video">
              <iframe
                src={embedUrl}
                title={asString(publicationVideo?.title) ?? "Publication video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}

          <section className="registry-publication-body">
            {markdownBlocks(selectedPublicationDispatch.dispatch_body).map((block, index) => {
              const text = cleanMarkdownText(block)
              if (!text) return null
              if (block.startsWith("# ")) return <h2 key={`${text}-${index}`}>{text}</h2>
              if (block.startsWith("## ")) return <h3 key={`${text}-${index}`}>{text}</h3>
              if (block.startsWith("*") && block.endsWith("*")) {
                return <p key={`${text}-${index}`} className="registry-publication-emphasis">{text}</p>
              }
              if (block.includes("\n*")) {
                return (
                  <ul key={`${text}-${index}`}>
                    {block.split("\n").map((line) => cleanMarkdownText(line)).filter(Boolean).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )
              }
              return <p key={`${text}-${index}`}>{text}</p>
            })}
          </section>

          {references.length > 0 ? (
            <section className="registry-publication-references" aria-label="References">
              <h2>References</h2>
              {references.map((reference, index) => {
                const title = asString(reference.title)
                const year = asString(reference.year)
                const type = asString(reference.type)
                const citation = asString(reference.citation)
                return (
                  <article key={title ?? index}>
                    {title ? <h3>{title}</h3> : null}
                    <p>{[year, type, citation].filter(Boolean).join(" - ")}</p>
                  </article>
                )
              })}
            </section>
          ) : null}

          <section className="registry-publication-cta" aria-label="Publication actions">
            <div>
              <h2>{selectedPublicationDispatch.primary_cta}</h2>
              <p>{selectedPublicationDispatch.secondary_cta}</p>
            </div>
            <div>
              {evalReport ? (
                <button type="button" onClick={onContinueToAssessmentPackage}>
                  Continue to Assessment Package
                </button>
              ) : (
                <button type="button" onClick={onGoToEvalPassage}>
                  {selectedPublicationDispatch.primary_cta ?? "Continue to Structural Evaluation"}
                </button>
              )}
              {selectedPublicationDispatch.article_url ?? selectedPublicationDispatch.external_url ? (
                <a
                  href={selectedPublicationDispatch.article_url ?? selectedPublicationDispatch.external_url ?? ""}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the Dispatch
                </a>
              ) : null}
            </div>
          </section>

          <section className="registry-publication-subscribe-capture" aria-label="Subscribe to Structural Drift">
            <div>
              <span>Structural Drift</span>
              <h2>View Field Notes</h2>
              <p>Paragraph subscription remains available. This Codex-native capture records registry dispatch interest.</p>
            </div>
            <form onSubmit={onSubmitSubscription}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  required
                  value={publicationEmail}
                  onChange={(event) => onPublicationEmailChange(event.target.value)}
                />
              </label>
              <label>
                <span>Organization</span>
                <input
                  value={publicationOrganization}
                  onChange={(event) => onPublicationOrganizationChange(event.target.value)}
                />
              </label>
              <button type="submit" disabled={publicationSubmitting}>
                {publicationSubmitting ? "Recording..." : "View Field Notes"}
              </button>
              {publicationStatus ? <p className="reserve-seat-success">{publicationStatus}</p> : null}
              {publicationError ? <p className="reserve-seat-error">{publicationError}</p> : null}
            </form>
          </section>
        </article>
      </main>
    )
  }

  // index variant — Issue 001 render from seated publication profiles

  const featuredArticleSet = asRecordArray(publicationLandingUnit?.metadata?.featured_article_set)
  const socialLinks = asRecordArray(publicationLandingUnit?.metadata?.social_links)
  const isLegacyStructuralDriftRoute = routePath === "/structural-drift"
  const routeShell =
    routePath === "/undrifted"
      ? "undrifted_publication_landing"
      : isLegacyStructuralDriftRoute ? "structural_drift_legacy_inbound" : null

  // Seated publication profiles
  const contentProfile = landingRecord(publicationLandingUnit, "content_profile")
  const coverStory = metadataRecord(undriftedPublication, "cover_story")
  const assessmentFeature = landingRecord(publicationLandingUnit, "assessment_feature")
  const roleCallFeature = landingRecord(publicationLandingUnit, "role_call_feature")
  const nextIssueTeaserFeature = metadataRecord(undriftedPublication, "next_issue_teaser")
  const footerRecord = metadataRecord(undriftedPublication, "footer_record")

  const brandCopy = metadataRecord(undriftedPublication, "brand_copy")
  const brandAssets = metadataRecord(undriftedPublication, "brand_assets")
  const styleContract = metadataRecord(undriftedPublication, "style_contract")
  const landingContract = landingRecord(publicationLandingUnit, "landing_design_contract")

  const brandTitle = asString(brandCopy?.header) ?? undriftedPublication?.title ?? null
  const mastHeadPrinciples = asString(contentProfile?.tagline) ?? asString(brandCopy?.principles_line)
  const editionMarker = asString(landingContract?.edition_marker)
  const coverEyebrow = asString(asRecord(landingContract?.hero)?.cover_eyebrow)
  const insightsEyebrow = asString(landingContract?.insights_eyebrow)
  const insightsHeading = asString(landingContract?.insights_heading)
  const styleKey =
    asString(landingContract?.style_contract_key) ??
    asString(styleContract?.key) ??
    asString(undriftedPublication?.metadata?.style_contract_key)
  const landingKey = asString(landingContract?.landing_contract_key)
  const primaryLogoPath = asString(brandAssets?.primary_full_lockup_path)

  // Cover story from seated cover_story feature
  const coverHeadline = asString(coverStory?.feature_headline) ?? asString(contentProfile?.primary_headline)
  const coverDeck = asString(coverStory?.feature_deck)
  const coverPositioning = asString(coverStory?.feature_positioning)
  const coreDistinction = asString(coverStory?.core_distinction)

  // Assessment editor's feature
  const assessmentFeatureLabel = asString(assessmentFeature?.feature_label)
  const assessmentFeatureTitle = asString(assessmentFeature?.feature_title)
  const assessmentFeatureBody = asString(assessmentFeature?.feature_body)
  const assessmentCtaLabel = asString(assessmentFeature?.cta_label)
  const assessmentRoute = asString(assessmentFeature?.route_path)

  // Role Call feature
  const roleCallLabel = asString(roleCallFeature?.feature_label)
  const roleCallTitle = asString(roleCallFeature?.feature_title)
  const roleCallTagline = asString(roleCallFeature?.feature_tagline)
  const roleCallPositions = asStringArray(roleCallFeature?.positions)
  const roleCallCtaLabel = asString(roleCallFeature?.cta_label)

  // Next Issue teaser
  const nextIssueLabel = asString(nextIssueTeaserFeature?.feature_label)
  const nextIssueTitle = asString(nextIssueTeaserFeature?.feature_title)
  const nextIssueBody = asString(nextIssueTeaserFeature?.feature_body)
  const nextIssueHint = asString(nextIssueTeaserFeature?.release_hint)

  // Footer record
  const footerLine1 = asString(footerRecord?.footer_line_1)
  const footerLine2 = asString(footerRecord?.footer_line_2)

  function manifestCover(mediaRole: string | null) {
    if (mediaRole === "agents_with_keys_cover") return agentsWithKeysCoverUrl
    if (mediaRole === "fables_and_myths_cover") return fablesAndMythsCoverUrl
    return null
  }

  function socialGlyph(platform: string) {
    if (platform === "X") return "𝕏"
    if (platform === "Instagram") return "◎"
    if (platform === "LinkedIn") return "in"
    return platform.slice(0, 1)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="structural_drift_dispatches"
      data-material-family="obsidian"
      data-layout-contract="undrifted_publication"
      data-route-shell={routeShell ?? undefined}
      data-landing-contract={landingKey ?? "missing_landing_contract"}
      data-style-contract={styleKey ?? "missing_style_contract"}
      data-release-standing="published"
      style={registryTokenStyle}
    >
      <section className="undrifted-shell" aria-label={brandTitle ?? "unDrifted"}>

        {isLegacyStructuralDriftRoute ? (
          <section className="undrifted-legacy-route" aria-label="Legacy route standing">
            <span>Legacy Inbound Route</span>
            <h2>Continue to unDrifted</h2>
            <p>Structural Drift is now part of unDrifted.</p>
            <a href="/undrifted">Continue to unDrifted</a>
          </section>
        ) : null}

        {/* SECTION 1 — MASTHEAD */}
        <header className="undrifted-masthead" aria-label="unDrifted publication masthead">
          <div className="undrifted-masthead-nameplate">
            {registryLogoUrl ? (
              <img className="undrifted-masthead-logo" src={registryLogoUrl} alt={brandTitle ?? "unDrifted"} />
            ) : (
              <span className="undrifted-wordmark" aria-label={brandTitle ?? "unDrifted"}>
                <span>un</span><strong>Drifted</strong>
              </span>
            )}
            {(mastHeadPrinciples || editionMarker) ? (
              <div className="undrifted-masthead-text">
                {mastHeadPrinciples ? <span className="undrifted-masthead-principles">{mastHeadPrinciples}</span> : null}
                {editionMarker ? <span className="undrifted-masthead-edition">{editionMarker}</span> : null}
              </div>
            ) : null}
          </div>
          <nav className="undrifted-topbar-social" aria-label="Publication social profiles">
            {socialLinks
              .filter((social) => asString(social.platform) !== "Facebook")
              .map((social) => {
                const platform = asString(social.platform)
                const url = asString(social.url)
                if (!platform || !url) return null
                return <a key={platform} href={url} aria-label={platform} target="_blank" rel="noreferrer">{socialGlyph(platform)}</a>
              })}
          </nav>
        </header>
        <hr className="undrifted-masthead-rule" aria-hidden="true" />

        {/* SECTION 2 + 3 — HERO COVER + COVER STORY */}
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
            {coverPositioning ? <p className="undrifted-cover-deck"><strong>{coverPositioning}</strong></p> : null}
            {coreDistinction ? (
              <div className="undrifted-cover-assessment">
                <p>{coreDistinction}</p>
              </div>
            ) : null}
          </div>
        </section>

        {/* SECTION 4 — EDITOR'S FEATURE */}
        {(assessmentFeatureLabel || assessmentFeatureTitle) ? (
          <section className="undrifted-editor-feature" aria-label={assessmentFeatureTitle ?? "Editor's Feature"}>
            {assessmentFeatureLabel ? <span className="undrifted-eyebrow">{assessmentFeatureLabel}</span> : null}
            {assessmentFeatureTitle ? <h2>{assessmentFeatureTitle}</h2> : null}
            {assessmentFeatureBody ? <p>{assessmentFeatureBody}</p> : null}
            {assessmentRoute ? (
              evalReport ? (
                <button type="button" className="undrifted-cta-primary" onClick={onContinueToAssessmentPackage}>
                  {assessmentCtaLabel ?? "Begin Assessment →"}
                </button>
              ) : (
                <a className="undrifted-cta-primary" href={assessmentRoute}>
                  {assessmentCtaLabel ?? "Begin Assessment →"}
                </a>
              )
            ) : null}
          </section>
        ) : null}

        {/* SECTION 5 — FEATURE ARTICLES */}
        {featuredArticleSet.length > 0 ? (
          <section className="undrifted-insights" aria-label="Feature articles">
            {(insightsEyebrow || insightsHeading) ? (
              <div className="undrifted-insights-header">
                {insightsEyebrow ? <span className="undrifted-eyebrow">{insightsEyebrow}</span> : null}
                {insightsHeading ? <h2>{insightsHeading}</h2> : null}
              </div>
            ) : null}
            <div className="undrifted-insights-grid">
              {featuredArticleSet.map((article) => {
                const title = asString(article.title)
                const coverUrl = manifestCover(asString(article.media_role))
                const desc = asString(article.description) ?? asString(article.subtitle)
                const articleUrl = asString(article.article_url) ?? asString(article.external_url) ?? null
                const pubState = asString(article.publication_state)
                if (!title) return null
                return (
                  <article key={title} className="undrifted-insight-card" data-publish-state={pubState ?? "held"} data-media-role={asString(article.media_role) ?? undefined}>
                    {coverUrl ? (
                      <div className="undrifted-insight-cover">
                        <img src={coverUrl} alt="" />
                      </div>
                    ) : null}
                    <div className="undrifted-insight-body">
                      <h3>{title}</h3>
                      {desc ? <p>{desc}</p> : null}
                      {articleUrl ? (
                        <a href={articleUrl} target="_blank" rel="noreferrer">Read the Dispatch →</a>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}

        {/* SECTION 6 — ROLE CALL */}
        {(roleCallLabel || roleCallTitle) ? (
          <section className="undrifted-role-call" aria-label={roleCallTitle ?? "Role Call"}>
            {roleCallLabel ? <span className="undrifted-eyebrow">{roleCallLabel}</span> : null}
            {roleCallTitle ? <h2>{roleCallTitle}</h2> : null}
            {roleCallTagline ? <p className="undrifted-role-call-tagline">{roleCallTagline}</p> : null}
            {roleCallPositions.length > 0 ? (
              <ul className="undrifted-role-call-positions">
                {roleCallPositions.map((pos) => <li key={pos}>{pos}</li>)}
              </ul>
            ) : null}
            {roleCallCtaLabel ? (
              <button type="button" className="undrifted-cta-primary" onClick={onOurStory}>
                {roleCallCtaLabel}
              </button>
            ) : null}
          </section>
        ) : null}

        {/* SECTION 7 — NEXT ISSUE */}
        {(nextIssueLabel || nextIssueTitle) ? (
          <section className="undrifted-next-issue" aria-label={nextIssueTitle ?? "Next Issue"}>
            {nextIssueLabel ? <span className="undrifted-eyebrow">{nextIssueLabel}</span> : null}
            {nextIssueTitle ? <h2>{nextIssueTitle}</h2> : null}
            {nextIssueBody ? <p>{nextIssueBody}</p> : null}
            {nextIssueHint ? <span className="undrifted-masthead-edition">{nextIssueHint}</span> : null}
          </section>
        ) : null}

        {/* SECTION 8 — FOOTER */}
        <footer className="undrifted-connect-footer" aria-label="Publication footer">
          {footerLine1 ? <p className="undrifted-footer-line">{footerLine1}</p> : null}
          {footerLine2 ? <p className="undrifted-footer-line">{footerLine2}</p> : null}
          <nav aria-label="Social profiles">
            {socialLinks
              .filter((social) => asString(social.platform) !== "Facebook")
              .map((social) => {
                const platform = asString(social.platform)
                const url = asString(social.url)
                if (!platform || !url) return null
                return <a key={platform} href={url} aria-label={platform} target="_blank" rel="noreferrer">{socialGlyph(platform)}</a>
              })}
          </nav>
          {renderSystemFooter()}
        </footer>

      </section>
    </main>
  )
}
