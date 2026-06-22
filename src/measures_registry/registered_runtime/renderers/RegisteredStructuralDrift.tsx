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
  const brandTitle = asString(brandCopy?.header) ?? undriftedPublication?.title ?? "unDrifted"
  const subtitleLines = asStringArray(brandCopy?.subtitle_lines)
  const principles = asStringArray(landingContract?.principles)
  const publicationRule = asString(brandCopy?.publication_rule)
  const styleKey =
    asString(landingContract?.style_contract_key) ??
    asString(styleContract?.key) ??
    asString(undriftedPublication?.metadata?.style_contract_key)
  const landingKey = asString(landingContract?.landing_contract_key)
  const parentAuthority = asString(heroContract?.parent_authority)
  const description = asString(heroContract?.description)
  const primaryCta = asString(heroContract?.primary_cta_label) ?? "Read the Dispatches"
  const secondaryCta = asString(heroContract?.secondary_cta_label) ?? "Assess the Environment"
  const secondaryCtaRoute = asString(heroContract?.secondary_cta_route)
  const aboutTitle = asString(aboutContract?.title)
  const aboutBody = asString(aboutContract?.body)
  const footerCtaLabel = asString(ctaContract?.label) ?? "Assess the Environment"
  const footerCtaSubline = asString(ctaContract?.subline) ?? "Begin where drift becomes visible."
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
    if (platform === "Facebook") return "f"
    if (platform === "Instagram") return "◎"
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
        <header className="undrifted-hero">
          <div className="undrifted-hero-copy">
            <span>{parentAuthority ? `${parentAuthority} Publication` : "Measures Registry Publication"}</span>
            {primaryLogoPath ? (
              <img
                className="undrifted-primary-lockup"
                src={primaryLogoPath}
                alt="unDrifted primary mark"
              />
            ) : null}
            <h1 aria-label={brandTitle}>
              <span>{brandTitle.slice(0, 2)}</span>{brandTitle.slice(2)}
            </h1>
            {subtitleLines.length > 0 ? (
              <p className="undrifted-brand-line">
                {subtitleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            ) : undriftedPublication?.subtitle ? (
              <p>{undriftedPublication.subtitle}</p>
            ) : null}
            {description ? <p className="undrifted-description">{description}</p> : null}
            <div className="undrifted-hero-actions" aria-label="Publication actions">
              <a href="#undrifted-dispatches">{primaryCta}</a>
              {secondaryCtaRoute ? (
                <a href={secondaryCtaRoute}>{secondaryCta}</a>
              ) : (
                <button type="button" onClick={onBeginEvaluation}>{secondaryCta}</button>
              )}
            </div>
          </div>
          <div className="undrifted-principles" aria-label="Publication principles">
            {(principles.length > 0 ? principles : [
              "Landing design contract missing.",
            ]).map((principle) => (
              <article key={principle}>
                <span />
                <p>{principle}</p>
              </article>
            ))}
          </div>
        </header>

        {isLegacyStructuralDriftRoute ? (
          <section className="undrifted-legacy-route" aria-label="Legacy route standing">
            <span>Legacy Inbound Route</span>
            <h2>Continue to unDrifted</h2>
            <p>Structural Drift is now part of unDrifted.</p>
            <a href="/undrifted">Continue to unDrifted</a>
          </section>
        ) : null}

        <section id="undrifted-dispatches" className="undrifted-grid undrifted-grid-publication" aria-label="Publication encounters">
          {featuredArticleSet.map((article) => {
            const title = asString(article.title)
            const coverUrl = manifestCover(asString(article.media_role))
            if (!title) return null
            return (
              <article key={title} className="undrifted-article-card" data-publish-state={asString(article.publication_state) ?? "held"}>
                {coverUrl ? <img src={coverUrl} alt="" /> : null}
                <h2>{title}</h2>
                <button type="button" onClick={() => { setSelectedManifestArticle(title); window.scrollTo({ top: 0, behavior: "smooth" }) }}>Open Article Standing</button>
              </article>
            )
          })}
          {featuredArticleSet.length === 0 ? <section className="undrifted-empty"><p>Featured article registry state is not seated.</p></section> : null}
          {publicationRule ? <p className="undrifted-rule">{publicationRule}</p> : null}
        </section>

        {aboutTitle || aboutBody ? (
          <section className="undrifted-about" aria-label="About unDrifted">
            {aboutTitle ? <span>{aboutTitle}</span> : null}
            {aboutBody ? <p>{aboutBody}</p> : null}
          </section>
        ) : null}

        <section className="undrifted-about" aria-label="About Measures Registry teaser">
          <span>About Measures Registry</span>
          <button type="button" onClick={onAboutMeasuresRegistry}>About Measures Registry</button>
        </section>

        <section className="undrifted-about" aria-label="Leadership access">
          <span>Leadership</span>
          <p>c3 Field / Our Story access remains intentional and outside the default root sequence.</p>
          <span>Registered Branch of c3 Field</span>
        </section>

        <section className="undrifted-social-strip" aria-label="unDrifted social profiles">
          {socialLinks.map((social) => {
            const platform = asString(social.platform)
            const url = asString(social.url)
            if (!platform || !url) return null
            return <a key={platform} href={url} aria-label={platform} target="_blank" rel="noreferrer">{socialGlyph(platform)}</a>
          })}
        </section>

        <section className="undrifted-evaluation" aria-label="Evaluation entry">
          <div>
            <span>Diagnostic Intake</span>
            <h2>{evalReport ? "Continue to Assessment Package" : footerCtaLabel}</h2>
            <p>
              {evalReport
                ? "Your assessment result is ready. Continue to receive your assessment package."
                : footerCtaSubline}
            </p>
          </div>
          {evalReport ? (
            <button type="button" onClick={onContinueToAssessmentPackage}>
              Continue to Assessment Package
            </button>
          ) : footerCtaRoute ? (
            <a href={footerCtaRoute}>{footerCtaLabel}</a>
          ) : (
            <button type="button" onClick={onBeginEvaluation}>
              {footerCtaLabel}
            </button>
          )}
        </section>

        {renderSystemFooter()}
      </section>
    </main>
  )
}
