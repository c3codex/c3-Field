import { useEffect, useState } from "react"
import { supabase, supabaseConfigError } from "../integrations/supabase/client"
import "./lapzuliPortal.css"

type GovernedResult = "ACT" | "HLD" | "DNR"

type Encounter = {
  key: string
  surface: string
  desk: string
  title: string
  result: GovernedResult
  reason: string
  evidenceUrl: string | null
}

export default function LapzuliPortal() {
  const [encounters, setEncounters] = useState<Encounter[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = "Lapzuli | c3Ops"
    if (supabaseConfigError) {
      setError(supabaseConfigError)
      return
    }

    void Promise.all([
      supabase.from("undrifted_distribution_report_v1").select("publication_object_key,desk_key,title,external_url,source_distribution_hold"),
      supabase.from("lapzuli_route").select("route_key,publication_object_key,desk_key,outlet_key,metadata"),
      supabase.from("measures_distribution_execution").select("execution_id,distribution_asset_id,execution_status,platform_url,executed_at,created_at"),
    ]).then(([publicationResult, routeResult, executionResult]) => {
      const firstError = publicationResult.error ?? routeResult.error ?? executionResult.error
      if (firstError) {
        setError(firstError.message)
        return
      }

      const publications = new Map((publicationResult.data ?? []).map((row) => [row.publication_object_key, row]))
      const executionsByAsset = new Map<string, typeof executionResult.data>()
      for (const execution of executionResult.data ?? []) {
        if (!execution.distribution_asset_id) continue
        const rows = executionsByAsset.get(execution.distribution_asset_id) ?? []
        rows.push(execution)
        executionsByAsset.set(execution.distribution_asset_id, rows)
      }

      const normalized: Encounter[] = []
      for (const route of routeResult.data ?? []) {
        const publication = publications.get(route.publication_object_key)
        if (!publication) continue
        const metadata = route.metadata && typeof route.metadata === "object" && !Array.isArray(route.metadata) ? route.metadata as Record<string, unknown> : {}
        const assetKey = typeof metadata.distribution_asset_key === "string" ? metadata.distribution_asset_key : null
        const executions = assetKey ? executionsByAsset.get(assetKey) ?? [] : []
        const execution = [...executions].sort((a, b) => Date.parse(b.executed_at ?? b.created_at ?? "") - Date.parse(a.executed_at ?? a.created_at ?? ""))[0] ?? null

        let result: GovernedResult | null = null
        let reason = ""
        if (publication.source_distribution_hold === true) {
          result = "HLD"
          reason = "Registry source distribution hold"
        } else if (execution?.execution_status === "held") {
          result = "HLD"
          reason = "Returned execution hold"
        } else if (execution?.execution_status === "failed") {
          result = "DNR"
          reason = "Permitted passage did not resolve"
        } else if (execution?.execution_status === "published" && execution.platform_url) {
          result = "ACT"
          reason = "Active Current Trace returned by destination"
        }
        if (!result) continue

        normalized.push({
          key: `${route.route_key}:${execution?.execution_id ?? publication.publication_object_key}`,
          surface: route.outlet_key ?? "unresolved_surface",
          desk: route.desk_key ?? publication.desk_key ?? "unclassified",
          title: publication.title ?? publication.publication_object_key,
          result,
          reason,
          evidenceUrl: execution?.platform_url ?? publication.external_url,
        })
      }
      setEncounters(normalized)
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Registry-backed Lapzuli readback unavailable"))
  }, [])

  const counts = encounters.reduce<Record<GovernedResult, number>>((acc, encounter) => {
    acc[encounter.result] += 1
    return acc
  }, { ACT: 0, HLD: 0, DNR: 0 })

  return (
    <main className="lapzuli-portal" data-result-vocabulary="ACT|HLD|DNR">
      <header className="lapzuli-hero">
        <div>
          <p className="lapzuli-kicker">c3Ops · First Portal</p>
          <h1>Lapzuli</h1>
          <p>Registry-bound intent → encounter → ACT | HLD | DNR → return evidence → Optics → Current.</p>
        </div>
        <dl className="lapzuli-summary">
          <div><dt>ACT</dt><dd>{counts.ACT}</dd></div>
          <div><dt>HLD</dt><dd>{counts.HLD}</dd></div>
          <div><dt>DNR</dt><dd>{counts.DNR}</dd></div>
        </dl>
      </header>

      {error && <section className="lapzuli-state"><strong>HLD</strong><p>{error}</p></section>}

      <section className="lapzuli-grid" aria-label="Surface Desk Encounter Result Evidence">
        {encounters.map((encounter) => (
          <article className="lapzuli-card" data-result={encounter.result} key={encounter.key}>
            <div><span>{encounter.surface}</span><span>{encounter.desk.replaceAll("_", " ")}</span></div>
            <strong>{encounter.result}</strong>
            <h2>{encounter.title}</h2>
            <p>{encounter.reason}</p>
            {encounter.evidenceUrl && <a href={encounter.evidenceUrl}>Returned evidence</a>}
          </article>
        ))}
      </section>
    </main>
  )
}
