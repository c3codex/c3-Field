type Props = {
  homeHero?: Record<string, unknown> | null
  backgroundUrl?: string | null
  brandName?: string | null
  ctaLabel?: string | null
  onAssessment?: () => void
}

const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0
const record = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null

export function RegistryHomeHero({
  homeHero,
  backgroundUrl,
  brandName,
  ctaLabel,
  onAssessment,
}: Props) {
  const headline = homeHero?.headline
  const body = homeHero?.body
  const support = homeHero?.support
  const visual = record(homeHero?.visual_contract)

  const copyReady = isText(headline) && isText(body)
  const contractReady =
    visual?.architectural_stage_mode === "frontend_css" &&
    visual?.baked_reference_copy_authoritative === false &&
    visual?.stage_copy_allowed === false &&
    visual?.background_media_role === "hero_background"

  if (!copyReady || !contractReady || !backgroundUrl) {
    return (
      <section
        id="hero"
        className="registry-held-state"
        role="status"
        data-release-standing={!copyReady ? "held_missing_registry_home_hero" : "held_home_hero_visual_contract"}
      >
        <p>Homepage hero is unavailable.</p>
      </section>
    )
  }

  return (
    <section
      id="hero"
      className="measures-home-hero"
      aria-labelledby="registry-home-headline"
      data-copy-authority="measures_registry_root.metadata.home_hero"
      data-stage-mode={visual.architectural_stage_mode as string}
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="measures-home-hero-shade" aria-hidden="true" />
      <div className="hero-content">
        {isText(brandName) ? <p className="hero-brand">{brandName}</p> : null}
        <h1 id="registry-home-headline">{headline as string}</h1>
        <p className="hero-body">{body as string}</p>
        {isText(support) ? <p className="hero-support">{support}</p> : null}
        {isText(ctaLabel) && onAssessment ? (
          <button className="hero-primary-cta" type="button" onClick={onAssessment}>
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
