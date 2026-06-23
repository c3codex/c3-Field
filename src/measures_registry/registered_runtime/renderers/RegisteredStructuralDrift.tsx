import { useState } from "react"
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
  const [selectedManifestArticle, setSelectedManifestArticle] = useState<string | null>(null)
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

  // index variant
  const featuredArticleSet = asRecordArray(publicationLandingUnit?.metadata?.featured_article_set)
  const socialLinks = asRecordArray(publicationLandingUnit?.metadata?.social_links)
  const isLegacyStructuralDriftRoute = routePath === "/structural-drift"
  const routeShell =
    routePath === "/undrifted"
      ? "undrifted_publication_landing"
      : isLegacyStructuralDriftRoute ? "structural_drift_legacy_inbound" : null
  const brandCopy = metadataRecord(undriftedPublication, "brand_copy")
  const brandAssets = metadataRecord(undriftedPublication, "brand_assets")
  const styleContract = metadataRecord(undriftedPublication, "style_contract")
  const landingContract = landingRecord(publicationLandingUnit, "landing_design_contract")
  const heroContract = asRecord(landingContract?.hero)
  const aboutContract = asRecord(landingContract?.about)
  const ctaContract = asRecord(landingContract?.cta_footer)
  const brandTitle = asString(brandCopy?.header) ?? undriftedPublication?.title ?? null
  const subtitleLines = asStringArray(brandCopy?.subtitle_lines)
  const principles = asStringArray(landingContract?.principles)
  const publicationRule = asString(brandCopy?.publication_rule)
  const coverHeadline = asString(brandCopy?.primary_line)
  const coverEyebrow = asString(heroContract?.cover_eyebrow)
  const mastHeadPrinciples = asString(brandCopy?.principles_line)
  const editionMarker = asString(landingContract?.edition_marker)
  const coverLinesLabel = asString(landingContract?.cover_lines_label)
  const assessmentBody = asString(heroContract?.assessment_body)
  const styleKey =
    asString(landingContract?.style_contract_key) ??
    asString(styleContract?.key) ??
    asString(undriftedPublication?.metadata?.style_contract_key)
  const landingKey = asString(landingContract?.landing_contract_key)
  const description = asString(heroContract?.description)
  const secondaryCta = asString(heroContract?.secondary_cta_label)
  const secondaryCtaRoute = asString(heroContract?.secondary_cta_route)
  const aboutBody = asString(aboutContract?.body)
  const footerCtaSubline = asString(ctaContract?.subline)
  const footerCtaRoute = asString(ctaContract?.target_route)
  const primaryLogoPath = asString(brandAssets?.primary_full_lockup_path)
  const selectedArticle = featuredArticleSet.find((article) => asString(article.title) === selectedManifestArticle) ?? null

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
      <section className="undrifted-shell" aria-label={brandTitle}>
        {selectedArticle ? (
          <section className="undrifted-article-overlay" role="dialog" aria-modal="true" aria-label={asString(selectedArticle.title) ?? "Article standing"}>
            <button type="button" onClick={() => setSelectedManifestArticle(null)}>Close</button>
            {manifestCover(asString(selectedArticle.media_role)) ? <img src={manifestCover(asString(selectedArticle.media_role)) ?? ""} alt="" /> : null}
            <h2>{asString(selectedArticle.title)}</h2>
            <p>{asString(selectedArticle.publication_state) === "published"
              ? asString(selectedArticle.article_route)
                ? "Article content is available through its seated publication route."
                : "Published standing is seated, but the article route and content are not. Opening remains held."
              : "This article is not yet published. Its registry position and media are seated without inventing publication standing."}</p>
          </section>
        ) : null}

        {isLegacyStructuralDriftRoute ? (
          <section className="undrifted-legacy-route" aria-label="Legacy route standing">
            <span>Legacy Inbound Route</span>
            <h2>Continue to unDrifted</h2>
            <p>Structural Drift is now part of unDrifted.</p>
            <a href="/undrifted">Continue to unDrifted</a>
          </section>
        ) : null}

        {/* 1. MASTHEAD */}
        <header className="undrifted-masthead" aria-label="unDrifted publication masthead">
          <div className="undrifted-masthead-nameplate">
            {registryLogoUrl ? (
              <img className="undrifted-masthead-logo" src={registryLogoUrl} alt={brandTitle} />
            ) : (
              <span className="undrifted-wordmark" aria-label={brandTitle}>
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

        {/* 2. COVER STORY */}
        <section className="undrifted-cover" aria-label="Cover story">
          <div className="undrifted-cover-visual">
            {questionsUngovernedVideoUrl ? (
              <video
                src={questionsUngovernedVideoUrl}
                poster={aiIsntBrokenLandingUrl ?? undefined}
                playsInline
                controls
                preload="metadata"
              />
            ) : aiIsntBrokenLandingUrl ? (
              <img src={aiIsntBrokenLandingUrl} alt="unDrifted — Launch Edition" />
            ) : questionsUngovernedImageUrl ? (
              <img src={questionsUngovernedImageUrl} alt="" />
            ) : null}
          </div>
          <div className="undrifted-cover-editorial">
            {coverEyebrow ? <span className="undrifted-eyebrow">{coverEyebrow}</span> : null}
            {coverHeadline ? <h1>{coverHeadline}</h1> : null}
            {description ? <p className="undrifted-cover-deck">{description}</p> : null}

            <div className="undrifted-cover-assessment">
              <span className="undrifted-eyebrow">{secondaryCta ?? null}</span>
              {assessmentBody ? <p>{assessmentBody}</p> : null}
              {evalReport ? (
                <button type="button" className="undrifted-cta-primary" onClick={onContinueToAssessmentPackage}>
                  Continue to Assessment Package →
                </button>
              ) : secondaryCtaRoute ? (
                <a className="undrifted-cta-primary" href={secondaryCtaRoute}>
                  {secondaryCta ?? null} →
                </a>
              ) : null}
            </div>

            {featuredArticleSet.length > 0 ? (
              <div className="undrifted-cover-lines">
                {coverLinesLabel ? <span className="undrifted-eyebrow">{coverLinesLabel}</span> : null}
                {featuredArticleSet.map((article) => {
                  const title = asString(article.title)
                  const desc = asString(article.description) ?? asString(article.subtitle)
                  const articleUrl = asString(article.article_url) ?? asString(article.external_url) ?? null
                  if (!title) return null
                  const coverUrl = manifestCover(asString(article.media_role))
                  return (
                    <article key={title} className="undrifted-cover-line" data-media-role={asString(article.media_role) ?? undefined}>
                      {coverUrl ? (
                        <div className="undrifted-cover-line-media">
                          <img src={coverUrl} alt="" />
                        </div>
                      ) : null}
                      <span className="undrifted-cover-line-rule" aria-hidden="true" />
                      <div className="undrifted-cover-line-content">
                        <strong>{title}</strong>
                        {desc ? <p>{desc}</p> : null}
                      </div>
                      {articleUrl ? (
                        <a href={articleUrl} target="_blank" rel="noreferrer">Read →</a>
                      ) : (
                        <button type="button" onClick={() => { setSelectedManifestArticle(title); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
                          Standing
                        </button>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : null}
          </div>
        </section>

        {/* 3. HERALD — REGISTRY DESTINATIONS */}
        <section className="undrifted-herald" aria-label="Registry destinations">
          <div className="undrifted-herald-header">
            <span className="undrifted-eyebrow">Registry</span>
            <h2>Measures Registry</h2>
            {aboutBody ? <p>{aboutBody}</p> : null}
          </div>
          <div className="undrifted-dispatch-cards">
            <article className="undrifted-dispatch-card">
              {registryLogoUrl ? (
                <img className="undrifted-dispatch-logo" src={registryLogoUrl} alt="Measures Registry" />
              ) : null}
              <span className="undrifted-eyebrow">About</span>
              <h2>About Measures Registry</h2>
              {aboutBody ? <p>{aboutBody}</p> : null}
              <a href="/about-measures-registry">About Measures Registry →</a>
            </article>
            <article className="undrifted-dispatch-card">
              <h2>c3 Field</h2>
              <p>Nothing exists in isolation. The c3 Field provides the governance framework through which Measures Registry, unDrifted, Measures of Inanna, and future registered systems maintain continuity across environments.</p>
              <a href="https://c3field.online" target="_blank" rel="noreferrer">Explore Our Story →</a>
            </article>
            <article className="undrifted-dispatch-card undrifted-dispatch-card--visual">
              {undriftedFillUrl ? (
                <img className="undrifted-dispatch-card-fill" src={undriftedFillUrl} alt="" aria-hidden="true" />
              ) : null}
              <span className="undrifted-eyebrow">Assessment</span>
              <h2>Structural Drift Is Detectable.</h2>
              <p>AI isn&apos;t broken. Systems are. Assess operational standing, identify structural drift, and discover the next governed pathway.</p>
              <a href="/ai-operations-assessment">Assess the Environment →</a>
            </article>
          </div>
        </section>

        {/* 4. CONNECT FOOTER */}
        <footer className="undrifted-connect-footer" aria-label="Connect">
          <span>Connect</span>
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
