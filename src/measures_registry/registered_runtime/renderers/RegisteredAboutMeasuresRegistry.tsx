import type { CSSProperties, FormEvent, ReactNode } from "react"
import { asRecord, asRecordArray, asString, asStringArray } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  aboutCopy: SectionCopy
  videoUrl: string | null
  featuredArticle: Record<string, unknown> | null
  connectFields: Record<string, string>
  connectSubmitting: boolean
  connectSubmitted: boolean
  connectError: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onSetConnectField: (key: string, value: string) => void
  onSubmitConnect: (event: FormEvent<HTMLFormElement>) => void
}

export default function RegisteredAboutMeasuresRegistry({
  registryTokenStyle,
  aboutCopy,
  videoUrl,
  featuredArticle,
  connectFields,
  connectSubmitting,
  connectSubmitted,
  connectError,
  renderHeader,
  renderSystemFooter,
  onSetConnectField,
  onSubmitConnect,
}: Props) {
  const approved = aboutCopy.approvedContentContract

  const pageTitle = asString(approved?.title) ?? aboutCopy.title ?? "About Measures Registry"
  const orientationSections = asRecordArray(approved?.orientation_sections)

  const bridgeSection = asRecord(approved?.undrifted_bridge_section)
  const bridgeLabel = asString(bridgeSection?.label) ?? "unDrifted"
  const bridgeSubtitle = asString(bridgeSection?.subtitle)
  const bridgeIssueLabel = asString(bridgeSection?.issue_label)
  const bridgeHeadline = asString(bridgeSection?.headline)
  const bridgeCtaLabel = asString(bridgeSection?.cta_label) ?? "Read Issue →"
  const bridgeCtaUrl = asString(bridgeSection?.cta_url) ?? "/undrifted"

  const connectSection = asRecord(approved?.connect_section)
  const connectTitle = asString(connectSection?.title) ?? "Connect"
  const connectBody = asString(connectSection?.body)
  const connectSupportingCopy = asStringArray(connectSection?.supporting_copy)
  const connectFields_ = asRecordArray(connectSection?.fields)
  const connectCtaLabel = asString(connectSection?.cta_label) ?? "Request Conversation"
  const connectSuccessTitle = asString(connectSection?.success_title) ?? "Received."
  const connectSuccessCopy = asString(connectSection?.success_copy)

  const articleTitle = asString(featuredArticle?.title)
  const articleUrl = asString(featuredArticle?.article_url) ?? asString(featuredArticle?.external_url) ?? null

  if (!approved) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="about_measures_registry"
        data-material-family="crystal"
        data-public-path="about_measures_registry"
        data-release-standing="held_missing_registry_content"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-held-state" role="status">
          <p>About Measures Registry content is not seated in the registry.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="about_measures_registry"
      data-material-family="crystal"
      data-public-path="about_measures_registry"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}

      {/* ── SECTION 1: About Orientation ───────────────────────────────── */}
      <section className="registry-about-orientation" aria-label={pageTitle}>
        <div className="registry-about-orientation-copy">
          <h2 className="registry-about-orientation-title">{pageTitle}</h2>
          {orientationSections.length > 0 ? (
            <div className="registry-about-orientation-blocks">
              {orientationSections.map((block) => {
                const label = asString(block.label)
                const copy = asString(block.copy)
                if (!label || !copy) return null
                return (
                  <div key={label} className="registry-about-orientation-block">
                    <span className="registry-about-orientation-block-label">{label}</span>
                    <p className="registry-about-orientation-block-copy">{copy}</p>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
        {videoUrl ? (
          <div className="registry-about-orientation-video">
            <video
              src={videoUrl}
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-label={pageTitle}
            />
          </div>
        ) : null}
      </section>

      {/* ── SECTION 3: unDrifted Bridge ────────────────────────────────── */}
      {bridgeSection ? (
        <section className="registry-about-bridge" aria-label="unDrifted publication">
          <a
            className="registry-about-bridge-panel"
            href={articleUrl ?? bridgeCtaUrl}
            rel="noreferrer"
          >
            <span className="registry-about-bridge-label">{bridgeLabel}</span>
            {bridgeSubtitle ? (
              <p className="registry-about-bridge-subtitle">{bridgeSubtitle}</p>
            ) : null}
            {bridgeIssueLabel ? (
              <span className="registry-about-bridge-issue">{bridgeIssueLabel}</span>
            ) : null}
            {bridgeHeadline ? (
              <h2 className="registry-about-bridge-headline">{bridgeHeadline}</h2>
            ) : null}
            <span className="registry-about-bridge-cta">{bridgeCtaLabel}</span>
          </a>
        </section>
      ) : null}

      {/* ── SECTION 4: Connect ─────────────────────────────────────────── */}
      <section className="registry-about-connect" aria-label={connectTitle}>
        <div className="registry-about-connect-content">
          <div className="registry-about-connect-copy">
            <h2 className="registry-about-connect-title">{connectTitle}</h2>
            {connectBody ? (
              <p className="registry-about-connect-body">{connectBody}</p>
            ) : null}
            {connectSupportingCopy.map((line) => (
              <p key={line} className="registry-about-connect-supporting">{line}</p>
            ))}
          </div>

          {connectSubmitted ? (
            <div className="registry-about-connect-success" role="status">
              <h3>{connectSuccessTitle}</h3>
              {connectSuccessCopy ? <p>{connectSuccessCopy}</p> : null}
            </div>
          ) : (
            <form
              className="registry-about-connect-form"
              onSubmit={onSubmitConnect}
              noValidate
            >
              {connectFields_.length > 0
                ? connectFields_.map((field) => {
                    const fieldKey = asString(field.field_key)
                    const label = asString(field.label)
                    const type = asString(field.type) ?? "text"
                    const required = field.required === true
                    if (!fieldKey || !label) return null
                    return (
                      <div key={fieldKey} className="registry-about-connect-field">
                        <label htmlFor={`connect-${fieldKey}`}>{label}{required ? "" : " (optional)"}</label>
                        {type === "textarea" ? (
                          <textarea
                            id={`connect-${fieldKey}`}
                            name={fieldKey}
                            value={connectFields[fieldKey] ?? ""}
                            required={required}
                            rows={4}
                            onChange={(e) => onSetConnectField(fieldKey, e.target.value)}
                          />
                        ) : (
                          <input
                            id={`connect-${fieldKey}`}
                            type={type}
                            name={fieldKey}
                            value={connectFields[fieldKey] ?? ""}
                            required={required}
                            onChange={(e) => onSetConnectField(fieldKey, e.target.value)}
                          />
                        )}
                      </div>
                    )
                  })
                : (
                    <>
                      <div className="registry-about-connect-field">
                        <label htmlFor="connect-name">Name</label>
                        <input id="connect-name" type="text" value={connectFields.name ?? ""} required onChange={(e) => onSetConnectField("name", e.target.value)} />
                      </div>
                      <div className="registry-about-connect-field">
                        <label htmlFor="connect-organization">Organization</label>
                        <input id="connect-organization" type="text" value={connectFields.organization ?? ""} required onChange={(e) => onSetConnectField("organization", e.target.value)} />
                      </div>
                      <div className="registry-about-connect-field">
                        <label htmlFor="connect-email">Email</label>
                        <input id="connect-email" type="email" value={connectFields.email ?? ""} required onChange={(e) => onSetConnectField("email", e.target.value)} />
                      </div>
                      <div className="registry-about-connect-field">
                        <label htmlFor="connect-message">Message (optional)</label>
                        <textarea id="connect-message" value={connectFields.message ?? ""} rows={4} onChange={(e) => onSetConnectField("message", e.target.value)} />
                      </div>
                    </>
                  )}
              {connectError ? (
                <p className="registry-about-connect-error" role="alert">{connectError}</p>
              ) : null}
              <button
                type="submit"
                className="registry-about-connect-submit"
                disabled={connectSubmitting}
              >
                {connectSubmitting ? "Submitting…" : connectCtaLabel}
              </button>
            </form>
          )}
        </div>
      </section>

      {renderSystemFooter()}
    </main>
  )
}
