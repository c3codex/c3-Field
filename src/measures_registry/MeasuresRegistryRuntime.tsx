import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "@/integrations/supabase/client"
import {
  DB_HELD_CODEX_SOURCE_RECORDS,
  resolveOar2Governance,
  type Oar2Governance,
} from "@/shared/c3/oar2Governance"

type RuntimeEncounterRow = {
  metadata: Record<string, unknown> | null
}

type ReserveSeatForm = {
  origin_type: "named_individual" | "institution_in_service"
  full_name: string
  email: string
  role_or_title: string
  institution_name: string
  interest_area: string
  course_intent: string
  message: string
}

const initialReserveSeatForm: ReserveSeatForm = {
  origin_type: "named_individual",
  full_name: "",
  email: "",
  role_or_title: "",
  institution_name: "",
  interest_area: "",
  course_intent: "",
  message: "",
}

function statusText(governance: Oar2Governance) {
  if (governance.missing_paths.length > 0) return "correction_required"
  if (governance.blocked_paths.length > 0) return "blocked"
  return "routable"
}

function optionalValue(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export default function MeasuresRegistryRuntime() {
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [readError, setReadError] = useState<string | null>(null)
  const [form, setForm] = useState<ReserveSeatForm>(initialReserveSeatForm)
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  )

  useEffect(() => {
    let cancelled = false

    async function loadRuntimeMetadata() {
      setIsLoading(true)
      setReadError(null)

      const { data, error } = await supabase
        .from("measures_encounter_def")
        .select(
          `
          metadata,
          measures_registry!inner (
            registry_key
          )
        `,
        )
        .eq("measures_registry.registry_key", "measures_registry_runtime")
        .eq("encounter_key", "measures_registry_runtime")
        .single()

      if (cancelled) return

      if (error) {
        setReadError("measures_registry_runtime metadata read failed")
        setMetadata(null)
      } else {
        setMetadata(((data as RuntimeEncounterRow | null)?.metadata ?? null) as Record<
          string,
          unknown
        > | null)
      }

      setIsLoading(false)
    }

    loadRuntimeMetadata()

    return () => {
      cancelled = true
    }
  }, [])

  const governance = useMemo(() => resolveOar2Governance(metadata ?? {}), [metadata])

  function updateForm<K extends keyof ReserveSeatForm>(key: K, value: ReserveSeatForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    if (submitState !== "idle") setSubmitState("idle")
  }

  async function handleReserveSeatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState("submitting")

    const { data, error } = await supabase.rpc("submit_src_intake_request", {
      p_origin_type: form.origin_type,
      p_full_name: form.full_name.trim(),
      p_email: form.email.trim(),
      p_role_or_title: optionalValue(form.role_or_title),
      p_institution_name: optionalValue(form.institution_name),
      p_interest_area: optionalValue(form.interest_area),
      p_course_intent: optionalValue(form.course_intent),
      p_message: optionalValue(form.message),
    })

    const response = data as { ok?: boolean } | null

    if (error || response?.ok !== true) {
      setSubmitState("error")
      return
    }

    setForm(initialReserveSeatForm)
    setSubmitState("success")
  }

  return (
    <main className="measures-registry-runtime">
      <header className="measures-registry-header">
        <p>www.measuresregistry.com</p>
        <h1>Measures Registry</h1>
      </header>

      <section className="registry-status-grid" aria-label="Registry standing">
        <article>
          <span>Codex Sources</span>
          <strong>
            {isLoading
              ? "reading"
              : `${governance.codex_source_records.length}/4 seated`}
          </strong>
        </article>
        <article>
          <span>OAR2 Route</span>
          <strong>{statusText(governance)}</strong>
        </article>
        <article>
          <span>Integrity Alignment</span>
          <strong>{governance.integrity_governance.alignment_status}</strong>
        </article>
        <article>
          <span>Phase Map</span>
          <strong>{governance.phase_map_state}</strong>
        </article>
        <article>
          <span>Antechamber</span>
          <strong>{governance.antechamber_state}</strong>
        </article>
      </section>

      <section className="registry-source-list" aria-label="DB-held Codex source records">
        {DB_HELD_CODEX_SOURCE_RECORDS.map((key) => {
          const isSeated = governance.codex_source_records.includes(key)

          return (
            <article key={key} data-seated={isSeated}>
              <span>{key}</span>
              <strong>{isSeated ? "seated" : "absent"}</strong>
            </article>
          )
        })}
      </section>

      {governance.missing_paths.length > 0 ? (
        <section className="registry-source-list" aria-label="Missing DB-held runtime state">
          {governance.missing_paths.map((path) => (
            <article key={path} data-seated={false}>
              <span>{path}</span>
              <strong>correction_required</strong>
            </article>
          ))}
        </section>
      ) : null}

      <section className="reserve-seat-panel" aria-label="Reserve your seat">
        <div className="reserve-seat-copy">
          <span>June Cohort</span>
          <h2>Reserve Your Seat</h2>
        </div>

        <form className="reserve-seat-form" onSubmit={handleReserveSeatSubmit}>
          <label>
            Origin
            <select
              required
              value={form.origin_type}
              onChange={(event) =>
                updateForm(
                  "origin_type",
                  event.target.value as ReserveSeatForm["origin_type"],
                )
              }
            >
              <option value="named_individual">Named individual</option>
              <option value="institution_in_service">Institution in service</option>
            </select>
          </label>

          <label>
            Full name
            <input
              required
              value={form.full_name}
              onChange={(event) => updateForm("full_name", event.target.value)}
              autoComplete="name"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              autoComplete="email"
            />
          </label>

          <label>
            Role or title
            <input
              value={form.role_or_title}
              onChange={(event) => updateForm("role_or_title", event.target.value)}
              autoComplete="organization-title"
            />
          </label>

          <label>
            Institution
            <input
              value={form.institution_name}
              onChange={(event) => updateForm("institution_name", event.target.value)}
              autoComplete="organization"
            />
          </label>

          <label>
            Interest area
            <input
              value={form.interest_area}
              onChange={(event) => updateForm("interest_area", event.target.value)}
            />
          </label>

          <label>
            Course intent
            <input
              value={form.course_intent}
              onChange={(event) => updateForm("course_intent", event.target.value)}
            />
          </label>

          <label className="reserve-seat-message">
            Message
            <textarea
              value={form.message}
              onChange={(event) => updateForm("message", event.target.value)}
            />
          </label>

          <button type="submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? "Submitting..." : "Reserve Your Seat"}
          </button>

          {submitState === "success" ? (
            <p className="reserve-seat-success">Your seat request has been received.</p>
          ) : null}
          {submitState === "error" ? (
            <p className="reserve-seat-error">Submission failed. Please try again.</p>
          ) : null}
        </form>
      </section>

      {readError ? <p className="registry-read-error">{readError}</p> : null}
    </main>
  )
}
