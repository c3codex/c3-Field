import { useEffect, useState } from "react"
import type { ManifestResponse, LapzuliReadback, C3OpsCurrentStateReadback } from "../../functions/_lib/me-environment"
import { c3OpsRoute, portals } from "./c3OpsRoutes"
import "./c3OpsDoor.css"
type Manifest = ManifestResponse["environments"][number]
const text = (x: unknown) => x == null ? "unresolved" : typeof x === "string" ? x : String(x)
function Rows({records}: {records: Record<string,unknown>[]}) {
  return records.length ? <div className="ops-records">{records.map((r,i)=><dl key={i}>{Object.entries(r).map(([k,v])=><div key={k}><dt>{k.replace(/_/g," ")}</dt><dd>{text(v)}</dd></div>)}</dl>)}</div> : <p className="ops-unresolved">Unresolved — no registered relation returned.</p>
}
function Current({env}:{env:Manifest}) {
  return <><h3>Current</h3><Rows records={env.current.records}/><h3>Evidence for Current</h3><Rows records={env.evidence.records}/></>
}
export default function C3OpsDoor() {
  const route=c3OpsRoute(window.location.pathname)
  const [state,setState]=useState<ManifestResponse|null>(null)
  const [lapzuli,setLapzuli]=useState<LapzuliReadback|null>(null)\n  const [currentState,setCurrentState]=useState<C3OpsCurrentStateReadback|null>(null)
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
        if(route==="/systems-access/current"){\n          const currentResponse=await fetch("/api/c3ops/manifest?view=current_state",{credentials:"same-origin",signal:controller.signal})\n          if(!currentResponse.ok) throw new Error("c3Ops Current State readback unavailable.")\n          setCurrentState(await currentResponse.json())\n        }\n        if(route==="/relational-operations/lapzuli" || route==="/c3optics"){
          const r=await fetch("/api/c3ops/manifest?view=lapzuli",{credentials:"same-origin",signal:controller.signal})
          if(!r.ok) throw new Error("Lapzuli evidence readback unavailable.")
          setLapzuli(await r.json())
        }
      } catch(e) {if(!controller.signal.aborted)setError(e instanceof Error?e.message:"Readback unavailable.")}
    }
    void load()
    return ()=>controller.abort()
  },[route])
  if(route==="/") return <main className="ops-door">
    <div className="ops-tree-stage">
      <img
        className="ops-tree"
        src="https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c3tree.webp"
        alt="c3 Tree"
        onError={()=>setAssetError(true)}
      />
      {assetError && <p className="ops-tree-hold" role="alert">HLD — c3 Tree artwork unavailable.</p>}
    </div>
    <nav className="ops-portals" aria-label="c3Ops entrances">
      {portals.map(p=><a key={p.path} href={p.path}><h2>{p.label}</h2><p>{p.subtitle}</p><span aria-hidden="true">↗</span></a>)}
    </nav>
  </main>
  return <main className="ops-room">
    <header className="ops-room-header"><a href="/" className="ops-brand">c3Ops</a><nav aria-label="Environment navigation">{portals.map(p=><a key={p.path} href={p.path} aria-current={route?.startsWith(p.path)?"page":undefined}>{p.label}</a>)}</nav></header>
    {!route ? <><h1>Route unresolved</h1><p>This route has no c3Ops passage.</p></> : <>
    <h1>{route.includes("lapzuli")?"Lapzuli · Distribution Canopy":route==="/c3optics"?"c3Optics":route.startsWith("/relational")?"Relational Operations":"Systems Access"}</h1>
    {error && <p role="alert" className="ops-unresolved">HLD — {error} <a href={window.location.pathname}>Retry readback</a></p>}
    {!state && !error && <p role="status">Reading registered environments…</p>}
    {state && <>
      <p className="ops-caption">Readback {new Date(state.observed_at).toLocaleString()} · Observation grants no action authority.</p>
      {state.missing_environments?.length>0 && <p className="ops-unresolved">Environment readback missing: {state.missing_environments.join(", ")}</p>}
      {route.startsWith("/systems-access") && <nav className="ops-architecture" aria-label="Operational architecture">{[["Current","/systems-access/current"],["Build","/systems-access/build"],["Work","/systems-access/work"],["Systems","/systems-access"],["Registry","/systems-access/registry"],["Evidence","/c3optics"]].map(([label,path])=><a key={path} href={path}>{label}</a>)}</nav>}
      {(route==="/systems-access/build"||route==="/systems-access/work") && <p className="ops-unresolved">HLD — this passage provides environment readback. Formation and work execution require their own routed authority.</p>}
      {route.startsWith("/relational-operations") && <><p>Resolve registered relationships and inspect their returned evidence.</p><a className="ops-canopy-link" href="/relational-operations/lapzuli">Lapzuli → Distribution Canopy</a></>}
      {route==="/systems-access/current" && currentState && <section aria-label="c3Ops Current State">
        <h2>c3Ops Current State</h2>
        <p className="ops-caption">Registry readback {new Date(currentState.observed_at).toLocaleString()} · ACT = Accrued Current Trace · HLD = Held Live Disposition · DNR = Did Not Resolve.</p>
        <div className="ops-env-grid">{currentState.components.map(component=><article className="ops-env" key={component.key}>
          <p className="ops-kicker">{component.resolution}</p>
          <h2>{component.label}</h2>
          <p>{component.subtitle}</p>
          <p className="ops-caption">{component.source}</p>
          <Rows records={component.records}/>
        </article>)}</div>
      </section>}
      <section className="ops-env-grid" aria-label="Persisted environment state">{state.environments.map(e=><article className="ops-env" key={text(e.identity.env_key)}>
        <p className="ops-kicker">{text(e.identity.system_key)}</p><h2>{text(e.identity.environment_name)}</h2>
        <dl><div><dt>Environment key</dt><dd>{text(e.identity.env_key)}</dd></div><div><dt>Class</dt><dd>{text(e.identity.environment_class)}</dd></div><div><dt>Standing</dt><dd>{text(e.standing)}</dd></div>{e.formation&&<div><dt>Formation</dt><dd>{e.formation}</dd></div>}<div><dt>Active / canonical</dt><dd>{text(e.active)} / {text(e.canonical)}</dd></div>{e.domain&&<div><dt>Domain</dt><dd>{e.domain}</dd></div>}</dl>
        {(route==="/c3optics"||route==="/systems-access/current") ? <Current env={e}/> : <>
        <p>Current: {e.current.records.length?e.current.records.map(c=>text(c.standing)).join(", "):"unresolved"}</p>
        {e.identity.environment_class==="c2_contribute_environment" && <p>Result · independent C2 determination · retained value: unresolved. Formation does not establish these outcomes.</p>}
        <details><summary>Registered relations and holds</summary><h3>Source authority</h3><p>{text(e.source_authority)}</p>
        {(["c1","c2","boundary","interoperability","registered_resources","canopy"] as const).map(k=><section key={k}><h3>{k.replace(/_/g," ")}</h3><p className="ops-caption">{e[k].source}</p><Rows records={e[k].records}/></section>)}
        <h3>Open holds</h3><Rows records={[e.holds]}/><Current env={e}/><h3>Unresolved coverage</h3><ul>{e.unresolved.map(u=><li key={u}>{u}</li>)}</ul></details></>}
      </article>)}</section>
      {lapzuli && <section aria-label="Lapzuli returned encounters"><h2>Returned encounters</h2><ul className="ops-unresolved">{lapzuli.unresolved.map(u=><li key={u}>{u}</li>)}</ul><p>Source: {lapzuli.source}. Provider outcomes are evidence; resulting Current requires its own registered relation.</p><div className="ops-env-grid">{lapzuli.routes.map(r=><article className="ops-env" key={text(r.route_key)}><p className="ops-kicker">{text(r.desk_key)} · {text(r.outlet_key)}</p><h3>{text(r.publication_object_key)}</h3><p>Route: {text(r.route_key)} · {text(r.route_status)}</p><Rows records={lapzuli.evidence.filter(e=>e.route_key===r.route_key)}/><p className="ops-unresolved">Current: unresolved without an explicit proof relation.</p></article>)}</div>{!lapzuli.routes.length&&<p>No registered routes returned.</p>}</section>}
    </>}
    </>}
  </main>
}
