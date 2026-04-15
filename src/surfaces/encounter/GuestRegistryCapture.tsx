import { useMemo, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

type GuestRegistryField = {
  key: string
  label: string
  type: "text" | "email"
  required?: boolean
}

type GuestRegistryConfig = {
  enabled?: boolean
  mode?: string
  position?: string
  trigger_label?: string
  title?: string
  supporting_text?: string
  fields?: GuestRegistryField[]
  submit_label?: string
  success_message?: string
}

export default function GuestRegistryCapture({
  config,
  encounterKey,
  registryKey,
}: {
  config: GuestRegistryConfig
  encounterKey: string
  registryKey: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enabled = config.enabled === true
  const triggerLabel = config.trigger_label?.trim()
  const title = config.title?.trim()
  const supportingText = config.supporting_text?.trim()
  const submitLabel = config.submit_label?.trim()
  const successMessage = config.success_message?.trim()

  const fields = useMemo(
    () =>
      Array.isArray(config.fields)
        ? config.fields.filter(
            (field): field is GuestRegistryField =>
              Boolean(field?.key && field?.label && field?.type)
          )
        : [],
    [config.fields]
  )

  const positionRight = config.position !== "left_offset"

  function updateFieldValue(key: string, value: string) {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const missingRequiredField = fields.find((field) => {
      if (!field.required) return false
      return !formValues[field.key]?.trim()
    })

    if (missingRequiredField) {
      setError("Please complete all required fields.")
      return
    }

    const cleanName = formValues.name?.trim() || ""
    const cleanEmail = formValues.email?.trim() || ""

    if (!cleanName || !cleanEmail) {
      setError("Required guest registry fields are missing.")
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase
      .from("exhibition_guest_registry")
      .insert({
        encounter_key: encounterKey,
        registry_key: registryKey,
        name: cleanName,
        email: cleanEmail,
        submission_status: "recorded",
        metadata: {
          source: encounterKey,
          capture_mode: config.mode || "expandable_light_capture",
          submitted_fields: Object.fromEntries(
            fields.map((field) => [field.key, formValues[field.key]?.trim() || ""])
          ),
        },
      })

    setSubmitting(false)

    if (insertError) {
      setError("Unable to record your presence right now. Please try again.")
      return
    }

    setSuccess(true)
    setFormValues({})
  }

  if (!enabled) return null

  return (
    <div
      style={{
        position: "absolute",
        right: positionRight ? "4vw" : undefined,
        left: positionRight ? undefined : "4vw",
        bottom: isOpen ? "10vh" : "16vh",
        width: isOpen ? "min(28vw, 360px)" : "auto",
        zIndex: 4,
      }}
    >
      {!isOpen ? (
        triggerLabel ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              padding: "12px 16px",
              borderRadius: 999,
              border: "1px solid rgba(210, 230, 255, 0.10)",
              background: "rgba(12, 16, 28, 0.28)",
              backdropFilter: "blur(10px)",
              color: "rgba(245, 248, 255, 0.92)",
              cursor: "pointer",
              fontSize: "0.92rem",
              letterSpacing: "0.01em",
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            }}
          >
            {triggerLabel}
          </button>
        ) : null
      ) : (
        <div
          style={{
            padding: "18px 18px 16px",
            background: "rgba(12, 16, 28, 0.32)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(210, 230, 255, 0.10)",
            borderRadius: 16,
            color: "rgba(245, 248, 255, 0.92)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.22)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              {title ? (
                <h3
                  style={{
                    margin: 0,
                    marginBottom: supportingText ? 8 : 0,
                    fontSize: "0.98rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  {title}
                </h3>
              ) : null}

              {supportingText ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.88rem",
                    lineHeight: 1.45,
                    color: "rgba(235,240,248,0.88)",
                  }}
                >
                  {supportingText}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setError(null)
              }}
              style={{
                border: "none",
                background: "transparent",
                color: "rgba(245,248,255,0.82)",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1,
                padding: 0,
              }}
              aria-label="Close guest registry"
            >
              ×
            </button>
          </div>

          {success ? (
            successMessage ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  lineHeight: 1.45,
                  color: "rgba(245,248,255,0.94)",
                }}
              >
                {successMessage}
              </p>
            ) : null
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
              {fields.map((field) => (
                <label key={field.key} style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: "0.84rem" }}>{field.label}</span>
                  <input
                    type={field.type}
                    value={formValues[field.key] || ""}
                    onChange={(event) =>
                      updateFieldValue(field.key, event.target.value)
                    }
                    required={field.required === true}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(210,230,255,0.10)",
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(245,248,255,0.96)",
                      outline: "none",
                    }}
                  />
                </label>
              ))}

              {error ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.84rem",
                    color: "rgba(255,210,210,0.94)",
                  }}
                >
                  {error}
                </p>
              ) : null}

              {submitLabel ? (
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    justifySelf: "start",
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(210,230,255,0.10)",
                    background: "rgba(18,24,42,0.44)",
                    color: "rgba(245,248,255,0.96)",
                    cursor: submitting ? "default" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Submitting..." : submitLabel}
                </button>
              ) : null}
            </form>
          )}
        </div>
      )}
    </div>
  )
}