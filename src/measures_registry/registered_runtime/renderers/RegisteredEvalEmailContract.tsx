import type { CSSProperties, FormEvent, ReactNode } from "react"
import type { EnvironmentalStandingReport, SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  emailContractResolving: boolean
  evalReport: EnvironmentalStandingReport | null
  evalFields: Record<string, string>
  emailCopy: SectionCopy
  renderHeader: () => ReactNode
  onFieldChange: (key: string, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const DELIVERY_LABELS: Record<string, string> = {
  institution_name: "Institution / Company Name",
  institution_type: "Business Type",
  contact_name: "Contact Name",
  contact_email: "Contact Email",
}

const DELIVERY_FIELDS = ["institution_name", "institution_type", "contact_name", "contact_email"]

export default function RegisteredEvalEmailContract({
  registryTokenStyle,
  emailContractResolving,
  evalReport,
  evalFields,
  emailCopy,
  renderHeader,
  onFieldChange,
  onSubmit,
}: Props) {
  if (emailContractResolving) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="measures_eval_email_contract"
        data-resolving="true"
        style={registryTokenStyle}
      >
        <div className="registry-eval-resolution registry-assessment-resolving">
          <span>Resolving environmental standing</span>
          <h2>Reviewing operating conditions.</h2>
          <ol>
            <li>Resolving environmental standing...</li>
            <li>Reviewing operating conditions...</li>
            <li>Assessing implementation structure...</li>
          </ol>
        </div>
      </main>
    )
  }

  const subject = emailCopy.title ?? "Your Measures Registry Assessment Package"
  const instruction =
    emailCopy.subtitle ??
    "Your assessment is being generated. Enter where the completed assessment package and recommended structural response should be sent."

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

        {evalReport ? (
          <div className="registry-email-assessment-package" aria-label="Assessment package">
            <article className="registry-email-section">
              <span>{evalReport.assessment_title}</span>
              <h2>{evalReport.assessment_result}</h2>
              {evalReport.environmental_standing ? <p>{evalReport.environmental_standing}</p> : null}
            </article>
            {evalReport.findings.length > 0 ? (
              <article className="registry-email-section">
                <span>Primary Finding</span>
                {evalReport.findings.map((finding) => (
                  <p key={finding}>{finding}</p>
                ))}
              </article>
            ) : null}
            <article className="registry-email-section">
              <span>Assessment Interpretation</span>
              <p>{evalReport.operational_exposure_summary}</p>
            </article>
            <article className="registry-email-section">
              <span>{evalReport.recommended_response_label}</span>
              <p>{evalReport.recommended_structured_action}</p>
            </article>
          </div>
        ) : null}

        <form className="registry-iis-eval-form" onSubmit={onSubmit}>
          <fieldset>
            <legend>Delivery Contact</legend>
            {DELIVERY_FIELDS.map((key) => (
              <label key={key}>
                <span>{DELIVERY_LABELS[key] ?? key.replaceAll("_", " ")}</span>
                <input
                  type={key === "contact_email" ? "email" : "text"}
                  value={evalFields[key] ?? ""}
                  onChange={(event) => onFieldChange(key, event.target.value)}
                  required
                />
              </label>
            ))}
          </fieldset>
          <div className="registry-encounter-actions">
            <button type="submit">{emailCopy.ctaPrimary ?? "Continue"}</button>
          </div>
        </form>
      </section>
    </main>
  )
}
