import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import {
  DB_HELD_CODEX_SOURCE_RECORDS,
  resolveOar2Governance,
  type Oar2Governance,
} from "@/shared/c3/oar2Governance"

type RuntimeEncounterRow = {
  metadata: Record<string, unknown> | null
}

function statusText(governance: Oar2Governance) {
  if (governance.missing_paths.length > 0) return "correction_required"
  if (governance.blocked_paths.length > 0) return "blocked"
  return "routable"
}

export default function MeasuresRegistryRuntime() {
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [readError, setReadError] = useState<string | null>(null)

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

      {readError ? <p className="registry-read-error">{readError}</p> : null}
    </main>
  )
}
