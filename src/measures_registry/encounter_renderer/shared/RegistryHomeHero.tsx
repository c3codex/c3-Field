import { useState } from "react"
import { FileText, Map, ChartNoAxesColumnIncreasing } from "lucide-react"
import "./registryHomeHero.css"

type Props = {
  homeHero?: Record<string, unknown> | null
  presentationSealUrl?: string | null
  brandName?: string | null
  ctaLabel?: string | null
  branchRelation?: string | null
  operatorName?: string | null
  onAssessment?: () => void
}
const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0
const record = (v: unknown): Record<string, unknown> | null => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null

export function RegistryHomeHero({ homeHero, presentationSealUrl, brandName, ctaLabel, branchRelation, operatorName, onAssessment }: Props) {
  const [failedSeal, setFailedSeal] = useState<string | null>(null)
  const { eyebrow, headline, body } = homeHero ?? {}
  const visual = record(homeHero?.visual_contract)
  const capabilities = Array.isArray(homeHero?.capabilities) ? homeHero.capabilities.map(record) : []
  const copyReady = [eyebrow, headline, body].every(isText)
  const contractReady = visual?.architectural_stage_mode === "frontend_css" && visual?.seal_public_use_approved === true && visual?.baked_reference_copy_authoritative === false && visual?.stage_copy_allowed === false
  const markersReady = capabilities.length === 3 && capabilities.every(item => isText(item?.label) && item?.standing === "released_home_hero_copy")
  const icons = [FileText, Map, ChartNoAxesColumnIncreasing]
  if (!copyReady || !contractReady || !markersReady || !presentationSealUrl || failedSeal === presentationSealUrl) {
    return <section id="hero" className="registry-held-state" role="status" data-release-standing={!copyReady ? "held_missing_registry_home_hero" : "held_home_hero_visual_contract"}><p>Homepage hero is unavailable.</p></section>
  }
  return (
    <section id="hero" className="measures-home-hero" aria-labelledby="registry-home-headline" data-copy-authority="measures_registry_root.metadata.home_hero" data-stage-mode={visual.architectural_stage_mode as string}>
      <div className="hero-content">
        {isText(brandName) && <div className="hero-brand-lockup"><img src={presentationSealUrl} alt="" width="64" height="64" /><span>{brandName}</span></div>}
        <p className="hero-eyebrow">{eyebrow as string}</p>
        <h1 id="registry-home-headline">{headline as string}</h1>
        <p className="hero-body">{body as string}</p>
        {isText(ctaLabel) && onAssessment && <button className="hero-primary-cta" type="button" onClick={onAssessment}>{ctaLabel}<span aria-hidden="true">→</span></button>}
        <ul className="hero-capabilities">{capabilities.map((item, index) => { const Icon = icons[index]; return <li key={index}><Icon aria-hidden="true" size={25} strokeWidth={1.25} /><span>{item!.label as string}</span></li> })}</ul>
        {isText(branchRelation) && <div className="hero-branch-relation"><span>{branchRelation}</span>{isText(operatorName) && <span>{operatorName}</span>}</div>}
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-stone-wall" /><div className="hero-marble-plinth" />
        <img className="hero-dimensional-seal" src={presentationSealUrl} alt="" width="1254" height="1254" loading="eager" onError={() => setFailedSeal(presentationSealUrl)} />
      </div>
    </section>
  )
}
