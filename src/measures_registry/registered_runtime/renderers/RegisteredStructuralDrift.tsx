import type { CSSProperties, FormEvent, ReactNode } from "react"
import {
  asString,
  dispatchIssueLabel,
  dispatchThesis,
  dispatchTypeLabel,
  markdownBlocks,
  cleanMarkdownText,
  youtubeEmbedUrl,
} from "../registeredRuntimeUtils"
import type { EnvironmentalStandingReport, SectionCopy } from "../registeredRuntimeUtils"
import type { PublicationDispatchRow, PublicationRegistryRow } from "../registeredRuntimeTypes"
import { supabase } from "@/integrations/supabase/client"

type Props = {
  registryTokenStyle: CSSProperties
  variant: "index" | "article"
  structuralDriftCopy: SectionCopy
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

export default function RegisteredStructuralDrift({
  registryTokenStyle,
  variant,
  structuralDriftCopy,
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
  onPublicationEmailChange,
  onPublicationOrganizationChange,
  onSubmitSubscription,
  renderSystemFooter,
}: Props) {
  if (variant === "article") {
    if (!structuralDriftPublication || !selectedPublicationDispatch) {
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
            <span>{structuralDriftPublication.title}</span>
            <p>{structuralDriftPublication.subtitle}</p>
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
                  {selectedPublicationDispatch.primary_cta ?? "Evaluate Structural Coherence"}
                </button>
              )}
              {selectedPublicationDispatch.article_url ?? selectedPublicationDispatch.external_url ? (
                <a
                  href={selectedPublicationDispatch.article_url ?? selectedPublicationDispatch.external_url ?? ""}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read on Paragraph
                </a>
              ) : null}
            </div>
          </section>

          <section className="registry-publication-subscribe-capture" aria-label="Subscribe to Structural Drift">
            <div>
              <span>Structural Drift</span>
              <h2>Receive Registry Dispatches</h2>
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
                {publicationSubmitting ? "Recording..." : "Receive Registry Dispatches"}
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
  const featuredDispatch = structuralDriftDispatches[0] ?? null

  return (
    <main
      className="measures-registry-runtime"
      data-surface="structural_drift_dispatches"
      data-material-family="crystal"
      data-layout-contract="publication_encounter"
      data-release-standing="published"
      style={registryTokenStyle}
    >
      <section className="registry-field-guide" aria-label={structuralDriftPublication?.title ?? "Structural Drift"}>
        <header className="registry-field-guide-masthead">
          <span>Measures Registry Analysis Surface</span>
          <h1>{structuralDriftPublication?.title ?? "Structural Drift publication state missing"}</h1>
          {structuralDriftPublication?.subtitle ? <p>{structuralDriftPublication.subtitle}</p> : null}
          <p>
            Structural Drift documents recurring implementation failures, governance gaps, authority fragmentation,
            and environmental instability observed across AI-accelerated systems.
          </p>
        </header>

        {featuredDispatch ? (
          <article className="registry-field-guide-featured">
            <div>
              <span>{dispatchIssueLabel(featuredDispatch)}</span>
              <strong>{dispatchTypeLabel(featuredDispatch)}</strong>
            </div>
            <h2>{featuredDispatch.title}</h2>
            {dispatchThesis(featuredDispatch) ? <p>{dispatchThesis(featuredDispatch)}</p> : null}
            {featuredDispatch.internal_route ? (
              <a href={featuredDispatch.internal_route}>Read dispatch</a>
            ) : (
              <span>Article route not seated</span>
            )}
          </article>
        ) : (
          <section className="registry-field-guide-empty" aria-label="Missing dispatch state">
            <span>Article registry state</span>
            <p>No published Structural Drift dispatch rows are currently seated.</p>
          </section>
        )}

        <section className="registry-field-guide-index" aria-label="Dispatch index">
          <div>
            <span>Dispatch Index</span>
            <h2>Registered field notes</h2>
          </div>
          <div className="registry-field-guide-grid">
            {structuralDriftDispatches.map((dispatch) => (
              <article key={dispatch.dispatch_key}>
                <span>{dispatchIssueLabel(dispatch)}</span>
                <strong>{dispatchTypeLabel(dispatch)}</strong>
                <h3>{dispatch.title}</h3>
                {dispatchThesis(dispatch) ? <p>{dispatchThesis(dispatch)}</p> : null}
                {dispatch.internal_route ? (
                  <a href={dispatch.internal_route}>Read dispatch</a>
                ) : (
                  <small>Article route not seated</small>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="registry-field-guide-cta" aria-label="Evaluation entry">
          <div>
            <span>Diagnostic Intake</span>
            <h2>{evalReport ? "Continue to Assessment Package" : "Begin Structural Evaluation"}</h2>
            <p>
              {evalReport
                ? "Your assessment result is ready. Continue to receive your assessment package."
                : "Move from recognition into structured diagnostic intake."}
            </p>
          </div>
          {evalReport ? (
            <button type="button" onClick={onContinueToAssessmentPackage}>
              Continue to Assessment Package
            </button>
          ) : (
            <button type="button" onClick={onBeginEvaluation}>
              Begin Structural Evaluation
            </button>
          )}
        </section>

        {renderSystemFooter()}
      </section>
    </main>
  )
}
