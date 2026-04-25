import { useState, type FormEvent } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { CaptureContract } from "./types"

type Props = {
  capture: CaptureContract
  sourceRegistryKey: string
}

export default function ConnectCaptureForm({ capture, sourceRegistryKey }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!capture?.enabled) return null
  if (capture.mode !== "codex_connect_capture") return null
  if (capture.target_table !== "codex_connect_capture") return null

  const triggerLabel = capture.trigger_label ?? capture.submit_label
  if (!triggerLabel) return null

  async function submitCapture(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)

    const { error } = await supabase.from("codex_connect_capture").insert({
      source_registry_key: sourceRegistryKey,
      capture_context: "measures_of_inanna_connect",
      name,
      email,
      message: message || null,
      metadata: {
        source: "temple_antechamber_capture",
      },
    })

    setSubmitting(false)

    if (error) {
      setError("Connect request could not be received.")
      return
    }

    setName("")
    setEmail("")
    setMessage("")
    setSuccess(capture.success_message || "Your connect request has been received.")
  }

  return (
    <section className={`connect-capture ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="connect-capture-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {triggerLabel}
      </button>

      {isOpen ? (
        <form className="connect-capture-form" onSubmit={submitCapture}>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Name"
            value={name}
            required={capture.required_fields?.includes("name")}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            required={capture.required_fields?.includes("email")}
            onChange={(event) => setEmail(event.target.value)}
          />

          {capture.fields?.includes("message") && (
            <textarea
              name="message"
              placeholder="Message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "Receiving..." : capture.submit_label || triggerLabel}
          </button>

          {success && <p className="connect-capture-success">{success}</p>}
          {error && <p className="connect-capture-error">{error}</p>}
        </form>
      ) : null}
    </section>
  )
}
