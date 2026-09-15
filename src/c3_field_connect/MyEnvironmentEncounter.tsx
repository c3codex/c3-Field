import { useEffect, useMemo, useState } from "react"
import { supabase, supabaseConfigError } from "../integrations/supabase/client"
import "./myEnvironmentEncounter.css"

type JsonRecord = Record<string, unknown>

type EnvPacGraph = {
  envpac_key: string
  registry_env_key: string
  version: string
  envpac_standing: string
  owner_subject_type: string
  owner_subject_key: string
  custodian_subject_type: string
  custodian_subject_key: string
  custody_uri: string
  custody_provider: string
  content_sha256: string | null
  portable: boolean
  environment_bindings: JsonRecord[]
  rooted_systems: JsonRecord[]
  packages: JsonRecord[]
}

const asString = (v: unknown) => typeof v === "string" && v.trim() ? v.trim() : "unresolved"
const asArray = (v: unknown) => Array.isArray(v) ? v as JsonRecord[] : []

function statusLabel(value: string) {
  return value.replace(/_/g, " ")
}

export default function MyEnvironmentEncounter() {
  const [graph,setGraph]=useState<EnvPacGraph|null>(null)
  const [access,setAccess]=useState<JsonRecord[]>([])
  const [evidence,setEvidence]=useState<JsonRecord[]>([])
  const [current,setCurrent]=useState<JsonRecord[]>([])
  const [error,setError]=useState("")

  useEffect(()=>{
    document.title="My Environment | c3 Community Partners"
    if(supabaseConfigError){setError("Environment readback is not configured.");return}
    let active=true
    const db=supabase as any
    Promise.all([
      db.from("c3_envpac_effective_graph").select("*").eq("registry_env_key","env_measures_registry").maybeSingle(),
      db.from("c3_envpac_access_grant").select("grant_key,subject_type,subject_key,relation_role,scope,standing").eq("envpac_key","c3envpac_measures_registry_v0_1"),
      db.from("c3_current_state").select("current_state_key,standing,state_version,effective_at").eq("env_key","env_measures_registry").eq("is_current",true),
      db.from("c3_current_evidence_ref").select("current_evidence_ref_key,evidence_key,evidence_class,evidence_standing,attested_at,content_hash").limit(12),
    ]).then(([g,a,c,e])=>{
      if(!active)return
      if(g.error){setError("Environment graph is held: "+g.error.message);return}
      setGraph(g.data as EnvPacGraph)
      setAccess((a.data??[]) as JsonRecord[])
      setCurrent((c.data??[]) as JsonRecord[])
      setEvidence((e.data??[]) as JsonRecord[])
    }).catch(()=>active&&setError("Environment graph is unavailable."))
    return()=>{active=false}
  },[])

  const rooted=useMemo(()=>asArray(graph?.rooted_systems),[graph])
  const packages=useMemo(()=>asArray(graph?.packages),[graph])
  const envBindings=useMemo(()=>asArray(graph?.environment_bindings),[graph])

  if(error) return <main className="myenv-shell"><section className="myenv-held"><p className="myenv-kicker">My Environment</p><h1>Encounter held</h1><p>{error}</p></section></main>
  if(!graph) return <main className="myenv-shell"><section className="myenv-held"><p role="status">Resolving your environment…</p></section></main>

  return <main className="myenv-shell" data-encounter="my_environment" data-envpac={graph.envpac_key}>
    <aside className="myenv-rail">
      <a className="myenv-brand" href="/">c3<span>Community Partners</span></a>
      <nav aria-label="My Environment">
        <a href="#overview">My Environment</a>
        <a href="#overview">Overview</a>
        <a href="#systems">Environments</a>
        <a href="#packages">Projects</a>
        <a href="#access">Partners</a>
        <a href="#access">Access</a>
        <a href="#activity">Activity</a>
        <a href="#evidence">Evidence</a>
        <span aria-disabled="true" title="Held pending commerce readiness">Marketplace · HLD</span>
      </nav>
      <div className="myenv-rail-foot"><strong>c3</strong><span>CONNECT · CONTRIBUTE · CREATE</span></div>
    </aside>

    <section className="myenv-stage" id="overview">
      <div className="myenv-tree" aria-hidden="true"><img src="/c3ops/c3-tree-source-v1.png" alt="" /></div>
      <div className="myenv-title">
        <p className="myenv-kicker">c3 Community Partners</p>
        <h1>My<br/>Environment</h1>
        <p>People. Places. Possibility.</p>
        <p className="myenv-thesis">Your environment. Your participation. A more connected tomorrow.</p>
      </div>

      <aside className="myenv-identity" aria-label="Environment identity">
        <p className="myenv-kicker">Environment</p>
        <h2>{graph.registry_env_key.replace(/^env_/,"").replace(/_/g," ")}</h2>
        <code>{graph.envpac_key}</code>
        <dl>
          <div><dt>Standing</dt><dd>{statusLabel(graph.envpac_standing)}</dd></div>
          <div><dt>Version</dt><dd>{graph.version}</dd></div>
          <div><dt>Portable</dt><dd>{graph.portable ? "Yes" : "No"}</dd></div>
          <div><dt>Owner</dt><dd>{graph.owner_subject_key.replace(/_/g," ")}</dd></div>
          <div><dt>Custodian</dt><dd>{graph.custodian_subject_key.replace(/_/g," ")}</dd></div>
          <div><dt>Environment</dt><dd>{envBindings.length ? asString(envBindings[0].env_key) : graph.registry_env_key}</dd></div>
        </dl>
        <button type="button" disabled title="Export lifecycle is captured but not yet released">Export Environment · HLD</button>
      </aside>

      <div className="myenv-metrics">
        <a href="#systems"><span>Rooted Systems</span><strong>{rooted.length}</strong><small>Connected and operating</small></a>
        <a href="#packages"><span>Packages</span><strong>{packages.length}</strong><small>Nested c3Pacs</small></a>
        <a href="#access"><span>Access</span><strong>{access.filter(x=>x.standing==="active").length}</strong><small>Active grants</small></a>
        <a href="#evidence"><span>Evidence</span><strong>{evidence.length}</strong><small>Returned records</small></a>
        <a href="#activity"><span>Current</span><strong>{current.length}</strong><small>Effective state</small></a>
      </div>
    </section>

    <section className="myenv-grid">
      <article id="systems" className="myenv-panel">
        <header><p className="myenv-kicker">Rooted Systems</p><h2>Systems that may operate here</h2></header>
        {rooted.length ? rooted.map((s,i)=><details key={i}><summary><strong>{asString(s.system_key)}</strong><span>{statusLabel(asString(s.relation_role))}</span></summary>
          <dl><div><dt>Standing</dt><dd>{asString(s.standing)}</dd></div><div><dt>Runtime</dt><dd>{asString(s.runtime_ref)}</dd></div><div><dt>Source</dt><dd>{asString(s.source_ref)}</dd></div></dl>
          <pre>{JSON.stringify(s.authority_scope??{},null,2)}</pre>
        </details>) : <p>No rooted systems returned.</p>}
      </article>

      <article id="packages" className="myenv-panel">
        <header><p className="myenv-kicker">Nested Packages</p><h2>What belongs to this environment</h2></header>
        {packages.length ? packages.map((p,i)=><details key={i}><summary><strong>{asString(p.pac_key)}</strong><span>{asString(p.pac_type)} · {asString(p.version)}</span></summary>
          <dl><div><dt>Standing</dt><dd>{asString(p.standing)}</dd></div><div><dt>Custody</dt><dd>{asString(p.custody_uri)}</dd></div><div><dt>Hash</dt><dd>{asString(p.content_sha256)}</dd></div></dl>
        </details>) : <p>No nested packages returned.</p>}
      </article>

      <article id="access" className="myenv-panel">
        <header><p className="myenv-kicker">Access & Permissions</p><h2>Who may do what</h2></header>
        {access.length ? access.map((g,i)=><details key={i}><summary><strong>{asString(g.relation_role)}</strong><span>{asString(g.subject_key).replace(/_/g," ")}</span></summary>
          <dl><div><dt>Subject</dt><dd>{asString(g.subject_type)}</dd></div><div><dt>Standing</dt><dd>{asString(g.standing)}</dd></div></dl>
          <pre>{JSON.stringify(g.scope??{},null,2)}</pre>
        </details>) : <p>No access grants returned.</p>}
      </article>

      <article id="activity" className="myenv-panel">
        <header><p className="myenv-kicker">Activity</p><h2>Current state</h2></header>
        {current.length ? current.map((r,i)=><dl key={i}><div><dt>Standing</dt><dd>{asString(r.standing)}</dd></div><div><dt>Version</dt><dd>{asString(r.state_version)}</dd></div><div><dt>Effective</dt><dd>{asString(r.effective_at)}</dd></div></dl>) : <p>Current unresolved.</p>}
      </article>

      <article id="evidence" className="myenv-panel">
        <header><p className="myenv-kicker">Evidence</p><h2>Returned proof</h2></header>
        {evidence.length ? evidence.map((r,i)=><details key={i}><summary>{asString(r.evidence_key)}</summary><dl><div><dt>Class</dt><dd>{asString(r.evidence_class)}</dd></div><div><dt>Standing</dt><dd>{asString(r.evidence_standing)}</dd></div><div><dt>Hash</dt><dd>{asString(r.content_hash)}</dd></div></dl></details>) : <p>No evidence returned.</p>}
      </article>
    </section>
  </main>
}
