import type { CSSProperties, FormEvent, ReactNode } from "react"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  connectSrcCopy: SectionCopy
  evalFields: Record<string, string>
  renderHeader: () => ReactNode
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
  renderHeader,
  onFieldChange,
  onSubmit,
}: Props) {
  return (
    <main className="measures-registry-runtime" data-surface="connect_src" style={registryTokenStyle}>
      {renderHeader()}
      <section className="registry-connect-src" aria-label={connectSrcCopy.title ?? "Structured Response Contract"}>
        <div className="registry-encounter-entry">
          {connectSrcCopy.eyebrow ? <span>{connectSrcCopy.eyebrow}</span> : null}
          <h1>{connectSrcCopy.title ?? "Structured Response Contract"}</h1>
          {connectSrcCopy.subtitle ? <p>{connectSrcCopy.subtitle}</p> : null}
        </div>
        <form className="registry-iis-eval-form" onSubmit={onSubmit}>
          <fieldset>
            <legend>Institution Contact</legend>
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
          <div className="registry-encounter-actions">
            <button type="submit">{connectSrcCopy.ctaPrimary ?? "Continue to Evaluation"}</button>
          </div>
        </form>
      </section>
    </main>
  )
}
