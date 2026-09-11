export function RegistryHomeHero({ homeHero }: { homeHero?: Record<string, unknown> | null }) {
  // Validate without normalizing: Registry strings are rendered verbatim as text.
  const { eyebrow, headline, body } = homeHero ?? {}
  if (![eyebrow, headline, body].every((value) => typeof value === "string" && value.trim().length > 0)) {
    return (
      <section id="hero" className="registry-held-state" role="status" data-release-standing="held_missing_registry_home_hero">
        <p>Homepage hero copy is unavailable.</p>
      </section>
    )
  }
  return (
    <section id="hero" className="registry-home-hero" aria-labelledby="registry-home-headline" data-copy-authority="measures_registry_root.metadata.home_hero">
      <p className="registry-home-category">{eyebrow as string}</p>
      <h1 id="registry-home-headline" className="registry-home-tagline">{headline as string}</h1>
      <p className="registry-home-core-line">{body as string}</p>
    </section>
  )
}
