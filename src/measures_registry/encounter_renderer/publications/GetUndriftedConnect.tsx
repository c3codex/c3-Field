import { FormEvent, useMemo, useState } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"
import "./getUndriftedConnect.css"

type DeskKey = "drift_report" | "structural_standings" | "mapped_and_measured" | "current"

type GetUndriftedConnectProps = {
  dispatchKey?: string | null
  sourceRoute: string
  compact?: boolean
}

const DESKS: Array<{ key: DeskKey; label: string }> = [
  { key: "drift_report", label: "Drift Report" },
  { key: "structural_standings", label: "Structural Standings" },
  { key: "mapped_and_measured", label: "Mapped & Measured" },
  { key: "current", label: "Current" },
]

export default function GetUndriftedConnect({
  dispatchKey = null,
  sourceRoute,
  compact = false,
}: GetUndriftedConnectProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [consent, setConsent] = useState(false)
  const [selectedDesks, setSelectedDesks] = useState<DeskKey[]>([])
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const formId = useMemo(
    () => `get-undrifted-${(dispatchKey ?? "publication").replace(/[^a-zA-Z0-9_-]/g, "-")}`,
    [dispatchKey],
  )

  const toggleDesk = (desk: DeskKey) => {
    setSelectedDesks((current) =>
      current.includes(desk) ? current.filter((item) => item !== desk) : [...current, desk],
    )
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!consent || !email.trim()) return

    if (supabaseConfigError) {
      setStatus("error")
      setMessage("The connection path is unavailable right now.")
      return
    }

    setStatus("submitting")
    setMessage("")

    const { error } = await supabase.from("measures_publication_subscription_capture").insert({
      publication_key: "undrifted",
      dispatch_key: dispatchKey,
      email: email.trim().toLowerCase(),
      organization: null,
      capture_source: "get_undrifted",
      metadata: {
        consent_confirmed: true,
        consent_scope: "undrifted_publication_delivery",
        display_name: name.trim() || null,
        desk_preferences: selectedDesks,
        source_route: sourceRoute,
        free_call_key: "get_undrifted",
      },
    })

    if (error) {
      setStatus("error")
      setMessage("We couldn't record that connection. Please try again.")
      return
    }

    setStatus("success")
    setMessage(
      selectedDesks.length
        ? "You're connected. We'll send the desks you selected."
        : "You're connected. We'll send unDrifted publication updates.",
    )
    setEmail("")
    setName("")
    setConsent(false)
  }

  return (
    <section
      className={`undrifted-connect${compact ? " undrifted-connect-compact" : ""}`}
      aria-labelledby={`${formId}-title`}
      data-free-call="get_undrifted"
      data-crs-scope="undrifted_publication_delivery"
    >
      <div className="undrifted-connect-copy">
        <span className="undrifted-eyebrow">Connect</span>
        <h2 id={`${formId}-title`}>Get unDrifted</h2>
        <p>
          Follow the publication, or choose the desks you want to receive. Your email is used only for the
          publication delivery you consent to here.
        </p>
      </div>

      {status === "success" ? (
        <p className="undrifted-connect-status" role="status">{message}</p>
      ) : (
        <form className="undrifted-connect-form" onSubmit={submit}>
          <div className="undrifted-connect-fields">
            <label>
              <span>Name <small>(optional)</small></span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
          </div>

          <fieldset className="undrifted-connect-desks">
            <legend>Preferred desks <small>— leave blank for publication-wide updates</small></legend>
            <div>
              {DESKS.map((desk) => (
                <label key={desk.key}>
                  <input
                    type="checkbox"
                    checked={selectedDesks.includes(desk.key)}
                    onChange={() => toggleDesk(desk.key)}
                  />
                  <span>{desk.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="undrifted-connect-consent">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>I consent to receive unDrifted by email. I can change or withdraw this preference later.</span>
          </label>

          <div className="undrifted-connect-action">
            <button type="submit" disabled={status === "submitting" || !consent}>
              {status === "submitting" ? "Connecting…" : "Get unDrifted"}
            </button>
            {status === "error" ? <p className="undrifted-connect-error" role="alert">{message}</p> : null}
          </div>
        </form>
      )}
    </section>
  )
}
