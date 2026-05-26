import type { CSSProperties, ReactNode } from "react"
import type { EnvironmentalStandingReport, SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  evalReport: EnvironmentalStandingReport | null
  emailCopy: SectionCopy
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onContinue: () => void
}

export default function RegisteredEvalEmailContract({
  registryTokenStyle,
  evalReport,
  emailCopy,
  renderHeader,
  renderSystemFooter,
  onContinue,
}: Props) {
  const subject = emailCopy.title ?? "Your Assessment Package is Being Prepared"
  const instruction =
    emailCopy.subtitle ??
    "Your completed assessment package and recommended structural response will be sent to the contact information you provided."

  return (
    <main
      className="measures-registry-runtime"
      data-surface="measures_eval_email_contract"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-eval-email-contract" aria-label={subject}>
        <div className="registry-encounter-entry">
          {emailCopy.eyebrow ? <span>{emailCopy.eyebrow}</span> : null}
          <h1>{subject}</h1>
          <p>{instruction}</p>
        </div>

        <div className="registry-email-package-summary" aria-label="Assessment package contents">
          {evalReport ? (
            <article className="registry-email-section">
              <span>{evalReport.assessment_title}</span>
              <h2>{evalReport.assessment_result}</h2>
            </article>
          ) : null}
          <ul className="registry-email-package-includes">
            <li>Completed assessment standing</li>
            <li>Primary operational finding</li>
            <li>Recommended structural response</li>
            <li>Reserve seat pathway</li>
          </ul>
          <p className="registry-email-dispatch-note">Assessment package delivery is deferred pending seat availability confirmation.</p>
        </div>

        <div className="registry-encounter-actions">
          <button type="button" onClick={onContinue}>
            {emailCopy.ctaPrimary ?? "Continue"}
          </button>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
