import type { CSSProperties, ReactNode } from "react"
import { asRecord, asString, asStringArray } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  aboutCopy: SectionCopy
  videoUrl: string | null
  featuredArticle: Record<string, unknown> | null
  featuredArticleImageUrl: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
}

export default function RegisteredAboutMeasuresRegistry({
  registryTokenStyle,
  aboutCopy,
  videoUrl,
  featuredArticle,
  featuredArticleImageUrl,
  renderHeader,
  renderSystemFooter,
}: Props) {
  const approved = aboutCopy.approvedContentContract
  const title = asString(approved?.title) ?? aboutCopy.title ?? "About Measures Registry"
  const positionCopy = asStringArray(approved?.position_copy)
  const connectContract = asRecord(approved?.connect_contract)
  const connectTitle = asString(connectContract?.title)
  const connectEmail = asString(connectContract?.email)
  const connectCtaLabel = asString(connectContract?.cta_label) ?? "Email Measures Registry"
  const connectActionUrl = asString(connectContract?.action_url)
  const articleTitle = asString(featuredArticle?.title)
  const articleDesc = asString(featuredArticle?.description) ?? asString(featuredArticle?.subtitle)
  const articleUrl = asString(featuredArticle?.article_url) ?? asString(featuredArticle?.external_url) ?? null

  if (!title) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="about_measures_registry"
        data-public-path="about_measures_registry"
        data-release-standing="held_missing_registry_content"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-held-state" role="status">
          <p>About Measures Registry content is not seated in the registry.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="about_measures_registry"
      data-public-path="about_measures_registry"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-about-surface" aria-label={title}>
        <h1 className="registry-about-headline">{title}</h1>
        {videoUrl ? (
          <div className="registry-about-video-frame">
            <video
              src={videoUrl}
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-label={title}
            />
          </div>
        ) : null}
        {positionCopy.length > 0 ? (
          <div className="registry-about-body">
            {positionCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        <div className="registry-about-cards">
          {articleTitle ? (
            <div className="registry-about-card">
              <span>Publication</span>
              {featuredArticleImageUrl ? (
                <img src={featuredArticleImageUrl} alt="" className="registry-about-card-cover" />
              ) : null}
              <h2>{articleTitle}</h2>
              {articleDesc ? <p>{articleDesc}</p> : null}
              {articleUrl ? (
                <a href={articleUrl} target="_blank" rel="noreferrer" className="registry-about-card-cta">
                  Read the Dispatch
                </a>
              ) : null}
            </div>
          ) : null}
          {connectTitle ? (
            <div className="registry-about-card">
              <span>Connect</span>
              <h2>{connectTitle}</h2>
              {connectEmail ? <p>{connectEmail}</p> : null}
              {connectActionUrl ? (
                <a href={connectActionUrl} className="registry-about-card-cta">{connectCtaLabel}</a>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
