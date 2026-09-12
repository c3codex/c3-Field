import "./PublicWhitePaperLanding.css"
import type { WhitePaperDocument } from "./whitePaperContent"

function isHeading(value: string) {
  return value === "Abstract" ||
    value === "Conclusion" ||
    value === "About c3 Community Partners" ||
    value === "Relationship to c3 Community Partners" ||
    value === "References and Publication Note" ||
    /^\d+\.\s/.test(value)
}

export default function PublicWhitePaperLanding({ paper }: { paper: WhitePaperDocument }) {
  return (
    <main className="wp-shell">
      <article className="wp-paper" itemScope itemType="https://schema.org/TechArticle">
        <header className="wp-hero">
          <p className="wp-eyebrow">{paper.brand} · Public White Paper · Public Release 1.0</p>
          <h1 itemProp="headline">{paper.title}</h1>
          <p className="wp-subtitle">{paper.subtitle}</p>
          <p className="wp-abstract" itemProp="abstract">{paper.abstract}</p>
          <div className="wp-actions">
            <a className="wp-primary" href="#white-paper">Read the white paper</a>
            <a href={paper.relatedUrl}>Related paper: {paper.relatedTitle}</a>
          </div>
        </header>

        <section className="wp-thesis" aria-labelledby="wp-thesis-heading">
          <p className="wp-kicker">Central thesis</p>
          <h2 id="wp-thesis-heading">{paper.thesis}</h2>
        </section>

        <div id="white-paper" className="wp-body">
          {paper.paragraphs.map((paragraph, index) =>
            isHeading(paragraph)
              ? <h2 key={paragraph + index}>{paragraph}</h2>
              : <p key={paragraph + index}>{paragraph}</p>
          )}
        </div>

        <aside className="wp-pair">
          <p className="wp-kicker">People and Systems</p>
          <h2>One begins with people. The other begins with computation. Both begin with the environment.</h2>
          <p><a href={paper.relatedUrl}>Continue to {paper.relatedTitle}</a></p>
        </aside>

        <footer className="wp-citation">
          <strong>Cite this release</strong>
          <p itemProp="citation">{paper.title}. {paper.publisher}. Public Release 1.0. September 2026.</p>
          <p><a href={paper.canonicalUrl}>{paper.canonicalUrl}</a></p>
          <meta itemProp="publisher" content={paper.publisher} />
          <meta itemProp="version" content="1.0" />
          <meta itemProp="url" content={paper.canonicalUrl} />
        </footer>
      </article>
    </main>
  )
}
