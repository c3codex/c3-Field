import type { CSSProperties, FormEvent, ReactNode } from "react"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  connectSrcCopy: SectionCopy
  evalFields: Record<string, string>
  evalSubmitting: boolean
  evalError: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onFieldChange: (key: string, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const SRC_LABELS: Record<string, string> = {
  institution_name: "Institution / Company Name",
  institution_type: "Business Type",
  contact_name: "Contact Name",
  contact_email: "Contact Email",
}

const SRC_FIELDS = ["institution_name", "institution_type", "contact_name", "contact_email"]

export default function RegisteredConnectSrc({
  registryTokenStyle,
  connectSrcCopy,
  evalFields,
  evalSubmitting,
  evalError,
  renderHeader,
  renderSystemFooter,
  onFieldChange,
  onSubmit,
}: Props) {
  return (
    <main className="measures-registry-runtime" data-surface="connect_src" style={registryTokenStyle}>
      {renderHeader()}
      <section className="registry-connect-src" aria-label={connectSrcCopy.title ?? "Assessment Package Delivery"}>
        <div className="registry-encounter-entry">
          {connectSrcCopy.eyebrow ? <span>{connectSrcCopy.eyebrow}</span> : null}
          <h1>{connectSrcCopy.title ?? "Your Assessment is Being Prepared"}</h1>
          {connectSrcCopy.subtitle ? <p>{connectSrcCopy.subtitle}</p> : null}
        </div>
        <form className="registry-iis-eval-form" onSubmit={onSubmit}>
          <fieldset disabled={evalSubmitting}>
            <legend>Contact Information</legend>
            {SRC_FIELDS.map((key) => (
              <label key={key}>
                <span>{SRC_LABELS[key] ?? key.replaceAll("_", " ")}</span>
                <input
                  type={key === "contact_email" ? "email" : "text"}
                  value={evalFields[key] ?? ""}
                  onChange={(event) => onFieldChange(key, event.target.value)}
                  required
                />
              </label>
            ))}
          </fieldset>
          {evalError ? <p className="registry-eval-error" role="alert">{evalError}</p> : null}
          <div className="registry-encounter-actions">
            <button type="submit" disabled={evalSubmitting}>
              {evalSubmitting ? "Seating contact..." : (connectSrcCopy.ctaPrimary ?? "Continue")}
            </button>
          </div>
        </form>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
