import { useEffect, useState } from "react"
import type { ManifestResponse, LapzuliReadback, C3OpsCurrentStateReadback } from "../../functions/_lib/me-environment"
import { c3OpsRoute, portals } from "./c3OpsRoutes"
import "./c3OpsDoor.css"

type Manifest = ManifestResponse["environments"][number]
type CurrentStateComponent = C3OpsCurrentStateReadback["components"][number]

const text = (x: unknown) => x == null ? "unresolved" : typeof x === "string" ? x : String(x)

function Rows({records}: {records: Record<string,unknown>[]}) {
  return records.length
    ? <div className="ops-records">{records.map((r,i)=><dl key={i}>{Object.entries(r).map(([k,v])=><div key={k}><dt>{k.replace(/_/g," ")}</dt><dd>{text(v)}</dd></div>)}</dl>)}</div>
    : <p className="ops-unresolved">DNR — no registered relation returned.</p>
}

function Current({env}:{env:Manifest}) {
  return <><h3>Current</h3><Rows records={env.current.records}/><h3>Evidence for Current</h3><Rows records={env.evidence.records}/></>
}

function Station({component}:{component:CurrentStateComponent}) {
  const resolved=component.resolution!=="DNR"
  return <article className={"ops-station ops-station--"+component.key}>
    <div className="ops-station-head">
      <span className={"ops-state-dot "+(resolved?"is-resolved":"is-dnr")} aria-hidden="true"/>
      <p className="ops-kicker">{resolved?"REGISTRY RESOLVED":"DNR"}</p>
    </div>
    <h3>{component.label}</h3>
    <p className="ops-station-subtitle">{component.subtitle}</p>
    {component.key==="chazz" && <div className="ops-chazz-brief" aria-label="Chazz operating boundary">
      <span>resolve</span><span>build</span><span>return evidence</span>
      <small>Capability never implies authority.</small>
    </div>}
    <details>
      <summary>Inspect live state</summary>
      <p className="ops-caption">{component.source}</p>
      <Rows records={component.records}/>
    </details>
  </article>
}

export default function C3OpsDoor() {
  const route=c3OpsRoute(window.location.pathname)
  const [state,setState]=useState<ManifestResponse|null>(null)
  const [lapzuli,setLapzuli]=useState<LapzuliReadback|null>(null)
  const [currentState,setCurrentState]=useState<C3OpsCurrentStateReadback|null>(null)
  const [error,setError]=useState("")
  const [assetError,setAssetError]=useState(false)

  useEffect(()=>{
    document.title="c3Ops"
    if(route==="/" || route===null) return
    const controller=new AbortController()
    async function load() {
      try {
        const response=await fetch("/api/c3ops/manifest",{credentials:"same-origin",signal:controller.signal})
        if(!response.ok) throw new Error(response.status===403 ? "Operator access is required." : "Registry readback unavailable.")
        const body=await response.json() as ManifestResponse
        if(body.contract!=="me_environment_manifest_v1" || !Array.isArray(body.environments)) throw new Error("Registry response is not a manifest.")
        setState(body)

        if(route==="/systems-access/current"){
          const currentResponse=await fetch("/api/c3ops/manifest?view=current_state",{credentials:"same-origin",signal:controller.signal})
          if(!currentResponse.ok) throw new Error("c3Ops Current State readback unavailable.")
          const currentBody=await currentResponse.json() as C3OpsCurrentStateReadback
          if(currentBody.contract!=="c3ops_current_state_v1" || !Array.isArray(currentBody.components)) throw new Error("Current State projection is not governed.")
          setCurrentState(currentBody)
        }

        if(route==="/relational-operations/lapzuli" || route==="/c3optics"){
          const r=await fetch("/api/c3ops/manifest?view=lapzuli",{credentials:"same-origin",signal:controller.signal})
          if(!r.ok) throw new Error("Lapzuli evidence readback unavailable.")
          setLapzuli(await r.json())
        }
      } catch(e) {
        if(!controller.signal.aborted) setError(e instanceof Error?e.message:"Readback unavailable.")
      }
    }
    void load()
    return ()=>controller.abort()
  },[route])

  if(route==="/") return <main className="ops-door">
    <header className="ops-entry-mast">
      <div>
        <p className="ops-entry-eyebrow">c3Ops</p>
        <p className="ops-entry-sub">governed operations environment</p>
      </div>
      <div className="ops-entry-presence" aria-label="Chazz systems presence">
        <span className="ops-presence-pulse" aria-hidden="true"/>
        <div><strong>CHAZZ</strong><small>systems presence</small></div>
      </div>
    </header>

    <div className="ops-tree-stage">
      <div className="ops-tree-halo" aria-hidden="true"/>
      <img
        className="ops-tree"
        src="https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c3tree.webp"
        alt="c3 Tree"
        onError={()=>setAssetError(true)}
      />
      <div className="ops-entry-copy">
        <p>CURRENT IN · EVIDENCE OUT</p>
        <h1>Systems come here to work.</h1>
        <span>Registry state resolves the room. Nothing here invents authority.</span>
      </div>
      {assetError && <p className="ops-tree-hold" role="alert">HLD — c3 Tree artwork unavailable.</p>}
    </div>

    <nav className="ops-portals" aria-label="c3Ops entrances">
      {portals.map((p,i)=><a key={p.path} href={p.path}>
        <span className="ops-portal-index">0{i+1}</span>
        <h2>{p.label}</h2>
        <p>{p.subtitle}</p>
        <span className="ops-portal-arrow" aria-hidden="true">↗</span>
      </a>)}
    </nav>

    <footer className="ops-entry-footer">
      <span>ACT · Accrued Current Trace</span>
      <span>HLD · Held Live Disposition</span>
      <span>DNR · Did Not Resolve</span>
    </footer>
  </main>

  const currentComponent=currentState?.components.find(component=>component.key==="current")
  const stations=currentState?.components.filter(component=>component.key!=="current") ?? []

  return <main className="ops-room">
    <header className="ops-room-header">
      <a href="/" className="ops-brand"><span>c3</span>Ops</a>
      <div className="ops-room-presence"><span className="ops-presence-pulse" aria-hidden="true"/><span>CHAZZ / SYSTEMS</span></div>
      <nav aria-label="Environment navigation">{portals.map(p=><a key={p.path} href={p.path} aria-current={route?.startsWith(p.path)?"page":undefined}>{p.label}</a>)}</nav>
    </header>

    {!route ? <><h1>Route unresolved</h1><p>This route has no c3Ops passage.</p></> : <>
      <div className="ops-room-title">
        <p className="ops-kicker">c3Ops / operator environment</p>
        <h1>{route.includes("lapzuli")?"Lapzuli · Distribution Canopy":route==="/c3optics"?"c3Optics":route.startsWith("/relational")?"Relational Operations":"Systems Access"}</h1>
      </div>

      {error && <p role="alert" className="ops-unresolved ops-alert">HLD — {error} <a href={window.location.pathname}>Retry readback</a></p>}
      {!state && !error && <p role="status" className="ops-reading"><span className="ops-presence-pulse" aria-hidden="true"/> Reading registered environments…</p>}

      {state && <>
        <p className="ops-caption">Readback {new Date(state.observed_at).toLocaleString()} · Observation grants no action authority.</p>
        {state.missing_environments?.length>0 && <p className="ops-unresolved">Environment readback missing: {state.missing_environments.join(", ")}</p>}

        {route.startsWith("/systems-access") && <nav className="ops-architecture" aria-label="Operational architecture">{[["Current","/systems-access/current"],["Build","/systems-access/build"],["Work","/systems-access/work"],["Systems","/systems-access"],["Registry","/systems-access/registry"],["Evidence","/c3optics"]].map(([label,path])=><a key={path} href={path}>{label}</a>)}</nav>}

        {(route==="/systems-access/build"||route==="/systems-access/work") && <p className="ops-unresolved">HLD — this passage provides environment readback. Formation and work execution require their own routed authority.</p>}

        {route.startsWith("/relational-operations") && <><p>Resolve registered relationships and inspect their returned evidence.</p><a className="ops-canopy-link" href="/relational-operations/lapzuli">Lapzuli → Distribution Canopy</a></>}

        {route==="/systems-access/current" && currentState && <section className="ops-command-room" aria-label="c3Ops Current State">
          <div className="ops-command-mast">
            <div>
              <p className="ops-kicker">LIVE GOVERNED READBACK</p>
              <h2>Current State</h2>
            </div>
            <div className="ops-command-legend">
              <span><b>ACT</b> Accrued Current Trace</span>
              <span><b>HLD</b> Held Live Disposition</span>
              <span><b>DNR</b> Did Not Resolve</span>
            </div>
          </div>

          <div className="ops-current-core" aria-label="CURRENT core">
            <div className="ops-current-orbit" aria-hidden="true"/>
            <p className="ops-kicker">C3OPS / PRESENT GOVERNED STATE</p>
            <h2>CURRENT</h2>
            <p className="ops-current-time">{new Date(currentState.observed_at).toLocaleString()}</p>
            {currentComponent ? <Rows records={currentComponent.records}/> : <p className="ops-unresolved">DNR — c3Ops Current did not resolve.</p>}
          </div>

          <div className="ops-station-grid" aria-label="c3Ops governed stations">
            {stations.map(component=><Station component={component} key={component.key}/>)}
          </div>

          <footer className="ops-command-footer">
            <span>Registry-backed · read only · fail closed</span>
            <span>Chazz resolves and executes only inside registered authority.</span>
          </footer>
        </section>}

        {route!=="/systems-access/current" && <section className="ops-env-grid" aria-label="Persisted environment state">{state.environments.map(e=><article className="ops-env" key={text(e.identity.env_key)}>
          <p className="ops-kicker">{text(e.identity.system_key)}</p><h2>{text(e.identity.environment_name)}</h2>
          <dl><div><dt>Environment key</dt><dd>{text(e.identity.env_key)}</dd></div><div><dt>Class</dt><dd>{text(e.identity.environment_class)}</dd></div><div><dt>Standing</dt><dd>{text(e.standing)}</dd></div>{e.formation&&<div><dt>Formation</dt><dd>{e.formation}</dd></div>}<div><dt>Active / canonical</dt><dd>{text(e.active)} / {text(e.canonical)}</dd></div>{e.domain&&<div><dt>Domain</dt><dd>{e.domain}</dd></div>}</dl>
          {route==="/c3optics" ? <Current env={e}/> : <>
          <p>Current: {e.current.records.length?e.current.records.map(c=>text(c.standing)).join(", "):"unresolved"}</p>
          {e.identity.environment_class==="c2_contribute_environment" && <p>Result · independent C2 determination · retained value: unresolved. Formation does not establish these outcomes.</p>}
          <details><summary>Registered relations and holds</summary><h3>Source authority</h3><p>{text(e.source_authority)}</p>
          {(["c1","c2","boundary","interoperability","registered_resources","canopy"] as const).map(k=><section key={k}><h3>{k.replace(/_/g," ")}</h3><p className="ops-caption">{e[k].source}</p><Rows records={e[k].records}/></section>)}
          <h3>Open holds</h3><Rows records={[e.holds]}/><Current env={e}/><h3>Unresolved coverage</h3><ul>{e.unresolved.map(u=><li key={u}>{u}</li>)}</ul></details></>}
        </article>)}</section>}

        {lapzuli && <section aria-label="Lapzuli returned encounters"><h2>Returned encounters</h2><ul className="ops-unresolved">{lapzuli.unresolved.map(u=><li key={u}>{u}</li>)}</ul><p>Source: {lapzuli.source}. Provider outcomes are evidence; resulting Current requires its own registered relation.</p><div className="ops-env-grid">{lapzuli.routes.map(r=><article className="ops-env" key={text(r.route_key)}><p className="ops-kicker">{text(r.desk_key)} · {text(r.outlet_key)}</p><h3>{text(r.publication_object_key)}</h3><p>Route: {text(r.route_key)} · {text(r.route_status)}</p><Rows records={lapzuli.evidence.filter(e=>e.route_key===r.route_key)}/><p className="ops-unresolved">Current: unresolved without an explicit proof relation.</p></article>)}</div>{!lapzuli.routes.length&&<p>No registered routes returned.</p>}</section>}
      </>}
    </>}
  </main>
}
