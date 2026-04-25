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
  const [walletAddress, setWalletAddress] = useState("")
  const [coherenceReceived, setCoherenceReceived] = useState(false)
  const [coherenceAcknowledged, setCoherenceAcknowledged] = useState(false)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!capture?.enabled) return null
  if (capture.mode !== "codex_connect_capture") return null
  if (capture.target_table !== "codex_connect_capture") return null

  const triggerLabel = capture.trigger_label ?? capture.submit_label
  if (!triggerLabel) return null
  const fields = capture.fields ?? ["name", "email", "message"]
  const requiredFields = capture.required_fields ?? []

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
        source: sourceRegistryKey === "src1_connect"
          ? "src1_connect_capture"
          : "temple_antechamber_capture",
        wallet_address: walletAddress || null,
        coherence_received: coherenceReceived,
        coherence_acknowledged: coherenceAcknowledged,
      },
    })

    setSubmitting(false)

    if (error) {
      setError("Connect request could not be received.")
      return
    }

    setName("")
    setEmail("")
    setWalletAddress("")
    setCoherenceReceived(false)
    setCoherenceAcknowledged(false)
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
          {fields.includes("name") ? (
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Name"
              value={name}
              required={requiredFields.includes("name")}
              onChange={(event) => setName(event.target.value)}
            />
          ) : null}

          {fields.includes("email") ? (
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              required={requiredFields.includes("email")}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : null}

          {fields.includes("wallet_address") ? (
            <input
              name="wallet_address"
              type="text"
              autoComplete="off"
              placeholder="Wallet address"
              value={walletAddress}
              required={requiredFields.includes("wallet_address")}
              onChange={(event) => setWalletAddress(event.target.value)}
            />
          ) : null}

          {fields.includes("coherence_received") ? (
            <label className="connect-capture-check">
              <input
                name="coherence_received"
                type="checkbox"
                checked={coherenceReceived}
                required={requiredFields.includes("coherence_received")}
                onChange={(event) => setCoherenceReceived(event.target.checked)}
              />
              <span>21 of Coherence received</span>
            </label>
          ) : null}

          {fields.includes("coherence_acknowledged") ? (
            <label className="connect-capture-check">
              <input
                name="coherence_acknowledged"
                type="checkbox"
                checked={coherenceAcknowledged}
                required={requiredFields.includes("coherence_acknowledged")}
                onChange={(event) => setCoherenceAcknowledged(event.target.checked)}
              />
              <span>21 of Coherence acknowledged</span>
            </label>
          ) : null}

          {fields.includes("message") ? (
            <textarea
              name="message"
              placeholder="Message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          ) : null}

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
