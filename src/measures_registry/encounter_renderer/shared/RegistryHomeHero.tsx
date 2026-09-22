type Props = {
  homeHero?: Record<string, unknown> | null
  backgroundUrl?: string | null
  onAssessment?: () => void
}

const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0
const record = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null

export function RegistryHomeHero({
  homeHero,
  backgroundUrl,
  onAssessment,
}: Props) {
  const sourcePacKey = homeHero?.source_pac_key
  const brandName = homeHero?.brand_name
  const headline = homeHero?.headline
  const body = homeHero?.body
  const support = homeHero?.support
  const ctaLabel = homeHero?.primary_cta
  const ctaRoute = homeHero?.primary_cta_route
  const ctaTarget = homeHero?.primary_cta_target
  const visual = record(homeHero?.visual_contract)
  const freeHeader = record(homeHero?.free_header)

  const copyReady =
    isText(sourcePacKey) &&
    isText(brandName) &&
    isText(headline) &&
    isText(body) &&
    isText(ctaLabel) &&
    isText(ctaRoute) &&
    ctaTarget === "obsidian_chamber_orientation"

  const contractReady =
    visual?.architectural_stage_mode === "frontend_css" &&
    visual?.baked_reference_copy_authoritative === false &&
    visual?.stage_copy_allowed === false &&
    visual?.background_media_role === "hero_background" &&
    freeHeader?.free_source_authority === "webpac" &&
    freeHeader?.source_pac_key === sourcePacKey

  if (!copyReady || !contractReady || !backgroundUrl) {
    return (
      <section
        id="hero"
        className="registry-held-state"
        role="status"
        data-release-standing={!copyReady ? "held_missing_registry_home_hero" : "held_home_hero_webpac_binding"}
        data-source-pac={isText(sourcePacKey) ? sourcePacKey : undefined}
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
      data-copy-authority="webpac_via_registry_projection"
      data-source-pac={sourcePacKey as string}
      data-stage-mode={visual.architectural_stage_mode as string}
      data-cta-route={ctaRoute as string}
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="measures-home-hero-shade" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-brand">{brandName as string}</p>
        <h1 id="registry-home-headline">{headline as string}</h1>
        <p className="hero-body">{body as string}</p>
        {isText(support) ? <p className="hero-support">{support}</p> : null}
        {onAssessment ? (
          <button className="hero-primary-cta" type="button" onClick={onAssessment}>
            {ctaLabel as string}
          </button>
        ) : null}
      </div>
    </section>
  )
}
