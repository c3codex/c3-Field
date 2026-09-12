import "./PublicWhitePaperLanding.css"

type WhitePaperProps = {
  brand: string
  title: string
  subtitle: string
  abstract: string
  thesis: string
  publisher: string
  canonicalUrl: string
  relatedUrl: string
  relatedTitle: string
  sections: Array<{ heading: string; body: string[] }>
}

export default function PublicWhitePaperLanding(props: WhitePaperProps) {
  return (
    <main className="wp-shell">
      <article className="wp-paper" itemScope itemType="https://schema.org/TechArticle">
        <header className="wp-hero">
          <p className="wp-eyebrow">{props.brand} · Public White Paper · Public Release 1.0</p>
          <h1 itemProp="headline">{props.title}</h1>
          <p className="wp-subtitle">{props.subtitle}</p>
          <p className="wp-abstract" itemProp="abstract">{props.abstract}</p>
          <div className="wp-actions">
            <a href="#white-paper">Read the white paper</a>
            <a href={props.relatedUrl}>Related paper: {props.relatedTitle}</a>
          </div>
        </header>

        <section className="wp-thesis" aria-labelledby="wp-thesis-heading">
          <p className="wp-kicker">Central thesis</p>
          <h2 id="wp-thesis-heading">{props.thesis}</h2>
        </section>

        <div id="white-paper" className="wp-body">
          {props.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>

        <aside className="wp-pair">
          <p className="wp-kicker">People and Systems</p>
          <h2>One begins with people. The other begins with computation. Both begin with the environment.</h2>
          <p><a href={props.relatedUrl}>Continue to {props.relatedTitle}</a></p>
        </aside>

        <footer className="wp-citation">
          <strong>Cite this release</strong>
          <p itemProp="citation">{props.title}. {props.publisher}. Public Release 1.0. September 2026.</p>
          <p><a href={props.canonicalUrl}>{props.canonicalUrl}</a></p>
          <meta itemProp="publisher" content={props.publisher} />
          <meta itemProp="version" content="1.0" />
          <meta itemProp="url" content={props.canonicalUrl} />
        </footer>
      </article>
    </main>
  )
}
