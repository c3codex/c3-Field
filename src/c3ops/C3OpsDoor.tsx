import { useEffect, useState } from "react"
import type { ManifestResponse, LapzuliReadback } from "../../functions/_lib/me-environment"
import { c3OpsRoute, portals } from "./c3OpsRoutes"
import "./c3OpsDoor.css"
type Manifest = ManifestResponse["environments"][number]

type LapzuliExecution={
  executionId:string|null
  distributionAssetId:string|null
  executorKey:string|null
  channelKey:string|null
  executionStatus:string|null
  attemptNumber:number|null
  executedAt:string|null
  publishedAt:string|null
  platformPostId:string|null
  platformUrl:string|null
  error:string|null
  createdAt:string|null
}
type LapzuliAsset={
  distributionAssetKey:string|null
  campaignId:string|null
  platform:string|null
  distributionType:string|null
  status:string|null
  bufferExportReady:boolean
  reviewStatus:string|null
  updatedAt:string|null
}
type LapzuliChannel={
  channelKey:string|null
  executorKey:string|null
  platform:string|null
  accountName:string|null
  channelIdentifier:string|null
  status:string|null
  updatedAt:string|null
}
type LapzuliPac={
  pacKey:string
  envpacKey:string|null
  standing:string|null
  isEffective:boolean
  sourceAuthority:string|null
  truth:{
    campaignKey:string|null
    campaignName:string|null
    objective:string|null
    canonicalUrl:string|null
    lapzuliReady:boolean|null
    activationState:string|null
    distributionAuthorized:boolean|null
    externalExecutionAuthorized:boolean|null
  }
  campaign:{
    campaignKey:string|null
    campaignName:string|null
    objective:string|null
    status:string|null
    releaseState:string|null
    reviewStatus:string|null
    updatedAt:string|null
  }|null
  distributionAssets:LapzuliAsset[]
  executions:LapzuliExecution[]
  channels:LapzuliChannel[]
}
type LapzuliPacProjection={
  standing:string
  projection?:string
  authorityCreated?:boolean
  encounterCreated?:boolean
  pacs:LapzuliPac[]
  reason?:string
}

const text = (x: unknown) => x == null ? "unresolved" : typeof x === "string" ? x : String(x)
function Rows({records}: {records: Record<string,unknown>[]}) {
  return records.length ? <div className="ops-records">{records.map((r,i)=><dl key={i}>{Object.entries(r).map(([k,v])=><div key={k}><dt>{k.replace(/_/g," ")}</dt><dd>{text(v)}</dd></div>)}</dl>)}</div> : <p className="ops-unresolved">Unresolved — no registered relation returned.</p>
}
function Current({env}:{env:Manifest}) {
  return <><h3>Current</h3><Rows records={env.current.records}/><h3>Evidence for Current</h3><Rows records={env.evidence.records}/></>
}
function executionTime(execution:LapzuliExecution){
  const value=execution.publishedAt??execution.executedAt??execution.createdAt
  const parsed=value?Date.parse(value):0
  return Number.isFinite(parsed)?parsed:0
}
function readableReason(value:string|null){
  if(!value)return null
  try{
    const parsed=JSON.parse(value)
    if(Array.isArray(parsed))return parsed.map(String).join(" · ").replaceAll("_"," ")
  }catch{/* plain executor reason */}
  return value.replaceAll("_"," ")
}
function assetRows(pac:LapzuliPac):Record<string,unknown>[]{
  if(!pac.distributionAssets.length)return [{
    result:"HLD",
    destination:"PAC",
    asset:"unresolved",
    reason:pac.truth.distributionAuthorized===false||pac.truth.externalExecutionAuthorized===false
      ?"PAC truth currently withholds external distribution"
      :(pac.truth.activationState??"exact distribution bindings unresolved").replaceAll("_"," ")
  }]
  return pac.distributionAssets.map(asset=>{
    const execution=pac.executions
      .filter(item=>item.distributionAssetId===asset.distributionAssetKey)
      .sort((a,b)=>executionTime(b)-executionTime(a))[0]??null
    const channel=execution?.channelKey
      ? pac.channels.find(item=>item.channelKey===execution.channelKey)??null
      : null
    const release=(pac.campaign?.releaseState??"").toLowerCase()
    let result="HLD"
    let reason=asset.status?.replaceAll("_"," ")??"registered distribution asset awaiting encounter"
    if(release.includes("do_not_release")||release.includes("dnr")||release.includes("rejected")){
      result="DNR";reason="campaign release state does not permit distribution"
    }else if(execution?.executionStatus==="published"&&execution.platformUrl){
      result="ACT";reason="destination evidence returned"
    }else if(execution?.executionStatus==="held"){
      reason=readableReason(execution.error)??"returned execution hold"
    }else if(execution?.executionStatus==="failed"){
      reason=readableReason(execution.error)??"execution attempt failed; authority unchanged"
    }else if(execution?.executionStatus==="queued"||execution?.executionStatus==="prepared"){
      reason=`${execution.executionStatus} awaiting returned destination evidence`
    }
    return {
      result,
      destination:channel?.accountName??channel?.channelKey??asset.platform??"unresolved",
      asset:asset.distributionAssetKey??"unresolved",
      execution_status:execution?.executionStatus??"not attempted",
      reason,
      evidence_url:execution?.platformUrl??null
    }
  })
}
function pacCounts(projection:LapzuliPacProjection){
  const counts={ACT:0,HLD:0,DNR:0}
  for(const pac of projection.pacs)for(const row of assetRows(pac)){
    const result=String(row.result) as keyof typeof counts
    if(result in counts)counts[result]+=1
  }
  return counts
}

export default function C3OpsDoor() {
  const route=c3OpsRoute(window.location.pathname)
  const [state,setState]=useState<ManifestResponse|null>(null)
  const [lapzuli,setLapzuli]=useState<LapzuliReadback|null>(null)
  const [lapzuliPac,setLapzuliPac]=useState<LapzuliPacProjection|null>(null)
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
        if(route==="/relational-operations/lapzuli"){
          const r=await fetch("/api/free-lapzuli-pac",{credentials:"same-origin",cache:"no-store",signal:controller.signal})
          const projection=await r.json() as LapzuliPacProjection
          if(!r.ok||projection.standing!=="free_pac_projection"||!Array.isArray(projection.pacs)) throw new Error(projection.reason??"FREE PAC readback unavailable.")
          if(projection.authorityCreated!==false||projection.encounterCreated!==false) throw new Error("FREE PAC projection boundary mismatch.")
          setLapzuliPac(projection)
        }else if(route==="/c3optics"){
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
    <img className="ops-tree" src="/c3ops/c3-tree-source-v1.png" alt="c3 Tree — Threaded Rooted Encounter Environment" onError={()=>setAssetError(true)}/>
    <div className="ops-door-content"><header><p className="ops-kicker">c3Ops</p><h1>Enter the environment.</h1></header>
    {assetError && <p role="alert">HLD — governed tree artwork unavailable.</p>}
    <nav className="ops-portals" aria-label="c3Ops entrances">{portals.map(p=><a key={p.path} href={p.path}><h2>{p.label}</h2><p>{p.subtitle}</p><span aria-hidden="true">↗</span></a>)}</nav></div>
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
      {lapzuliPac && <section aria-label="Lapzuli FREE PAC projection">
        <h2>FREE → PAC distribution projection</h2>
        <p>Source: {lapzuliPac.projection??"registry_pac_truth"}. PAC brings governed truth; this runtime computes the operator projection and creates no authority.</p>
        {(()=>{const counts=pacCounts(lapzuliPac);return <p className="ops-caption">ACT {counts.ACT} · HLD {counts.HLD} · DNR {counts.DNR}</p>})()}
        <div className="ops-env-grid">{lapzuliPac.pacs.map(pac=><article className="ops-env" key={pac.pacKey}>
          <p className="ops-kicker">Campaign PAC · {text(pac.standing)}</p>
          <h3>{text(pac.campaign?.campaignName??pac.truth.campaignName??pac.pacKey)}</h3>
          <dl><div><dt>PAC</dt><dd>{pac.pacKey}</dd></div><div><dt>Campaign</dt><dd>{text(pac.truth.campaignKey)}</dd></div><div><dt>Release</dt><dd>{text(pac.campaign?.releaseState)}</dd></div><div><dt>Activation</dt><dd>{text(pac.truth.activationState)}</dd></div></dl>
          <Rows records={assetRows(pac)}/>
        </article>)}</div>
      </section>}
      {lapzuli && route==="/c3optics" && <section aria-label="Lapzuli returned encounters"><h2>Returned encounters</h2><ul className="ops-unresolved">{lapzuli.unresolved.map(u=><li key={u}>{u}</li>)}</ul><p>Source: {lapzuli.source}. Provider outcomes are evidence; resulting Current requires its own registered relation.</p><div className="ops-env-grid">{lapzuli.routes.map(r=><article className="ops-env" key={text(r.route_key)}><p className="ops-kicker">{text(r.desk_key)} · {text(r.outlet_key)}</p><h3>{text(r.publication_object_key)}</h3><p>Route: {text(r.route_key)} · {text(r.route_status)}</p><Rows records={lapzuli.evidence.filter(e=>e.route_key===r.route_key)}/><p className="ops-unresolved">Current: unresolved without an explicit proof relation.</p></article>)}</div>{!lapzuli.routes.length&&<p>No registered routes returned.</p>}</section>}
    </>}
    </>}
  </main>
}
