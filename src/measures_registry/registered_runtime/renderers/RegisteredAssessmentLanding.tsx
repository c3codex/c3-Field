import type { CSSProperties, ReactNode } from "react"
import { asRecord, asRecordArray, asString, asStringArray } from "../registeredRuntimeUtils"
import type { LandingUnitRow } from "../registeredRuntimeTypes"

type Props = {
  registryTokenStyle: CSSProperties
  landingUnit: LandingUnitRow | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onAssessEnvironment: () => void
}

export default function RegisteredAssessmentLanding({
  registryTokenStyle,
  landingUnit,
  renderHeader,
  renderSystemFooter,
  onAssessEnvironment,
}: Props) {
  const contract = asRecord(landingUnit?.metadata?.landing_design_contract)
  const hero = asRecord(contract?.hero)
  const evaluation = asRecord(contract?.what_it_evaluates)
  const exclusions = asRecord(contract?.what_it_is_not)
  const cta = asRecord(contract?.cta)
  const title = asString(hero?.title)
  const supportingLine = asString(hero?.supporting_line)
  const explanation = asString(hero?.public_explanation)
  const ctaLabel = asString(cta?.label)
  const ctaSubline = asString(cta?.subline)
  const evaluationItems = asStringArray(evaluation?.items)
  const exclusionItems = asRecordArray(exclusions?.items)
  const styleContractKey = asString(contract?.style_contract_key) ?? asString(landingUnit?.metadata?.style_contract_key)
  const hasContract = Boolean(title && supportingLine && explanation && ctaLabel)

  return (
    <main
      className="measures-registry-runtime"
      data-surface="ai_operations_assessment_landing"
      data-material-family="obsidian"
      data-layout-contract="assessment_public_landing"
      data-route-shell="ai_operations_assessment_landing"
      data-style-contract={styleContractKey ?? "missing_style_contract"}
      data-release-standing={hasContract ? "public" : "missing_landing_design_contract"}
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="assessment-landing-shell" aria-label={title ?? "Assessment landing contract missing"}>
        {hasContract ? (
          <>
            <header className="assessment-landing-hero">
              <div>
                <span>Measures Registry Evaluation Entry</span>
                <h1>{title}</h1>
                <p className="assessment-landing-line">{supportingLine}</p>
                <p>{explanation}</p>
              </div>
              <button type="button" onClick={onAssessEnvironment}>{ctaLabel}</button>
            </header>

            <section className="assessment-landing-grid" aria-label="Assessment scope">
              <article className="assessment-landing-panel">
                <span>What It Evaluates</span>
                <div>
                  {evaluationItems.map((item) => <p key={item}>{item}</p>)}
                </div>
              </article>

              <article className="assessment-landing-panel assessment-landing-boundary">
                <span>What It Is Not</span>
                <div>
                  {exclusionItems.map((item) => {
                    const label = asString(item.label)
                    return label ? <p key={label}>{label}</p> : null
                  })}
                </div>
              </article>
            </section>

            <section className="assessment-landing-cta" aria-label="Assessment entry">
              <div>
                <span>Begin where drift becomes visible</span>
                {ctaSubline ? <p>{ctaSubline}</p> : null}
              </div>
              <button type="button" onClick={onAssessEnvironment}>{ctaLabel}</button>
            </section>
          </>
        ) : (
          <section className="registry-held-state" role="status">
            <span>Landing contract missing</span>
            <h1>AI Operations Assessment</h1>
            <p>Governed landing page design metadata is not seated for this route.</p>
          </section>
        )}
        {renderSystemFooter()}
      </section>
    </main>
  )
}
