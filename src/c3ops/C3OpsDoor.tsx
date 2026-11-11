import {DnrBackdrop} from "../shared/DnrBackdrop"
import {PortalHome} from "./PortalHome"
import {OperatorSignIn} from './OperatorSignIn'
import {AuthorizationOptics} from './AuthorizationOptics'
import type {AuthorizationOpticsReadback} from '../../functions/_lib/c3ops-authorization-optics'
import { useEffect, useState, useCallback, useRef } from "react"
import type { ManifestResponse, LapzuliReadback, C3OpsCurrentStateReadback } from "../../functions/_lib/me-environment"
import type {C3OpsOperatorAuthority} from '../../functions/_lib/c3ops-operator-authority'
import { c3OpsRoute, portals } from "./c3OpsRoutes"
import "./opsPortal.css"

type Manifest = ManifestResponse["environments"][number]
type OperatorManifest=ManifestResponse&{operator_authority?:C3OpsOperatorAuthority}

export function OperatorAuthority({authority}:{authority?:C3OpsOperatorAuthority}){
  if(!authority)return <section aria-label="Operator authority"><h2>Operator access</h2><p>HOLD — operator authority readback unavailable.</p></section>
  return <section aria-label="Operator authority">
    <h2>Operator access · op044</h2>
    <p>Registered standing: {authority.registered_operator.standing}. Environmental qualification: {authority.environmental_qualification}.</p>
    <p>Access grant: {authority.effective_access_grant.standing}. Expires: {authority.effective_access_grant.expires_at??'unresolved'}.</p>
    <p>Registered rights: {authority.registered_rights.join(', ')||'none'}.</p>
    <p>Identity continuity: {authority.identity_continuity.standing}. This record does not authenticate a session.</p>
    <p>Authenticated recognition: {authority.authenticated_actor.standing}. {authority.authenticated_actor.standing==='HOLD'?'HOLD — an independently verified operator session is required.':''}</p>
    <p>Eligible read effects: {authority.eligible_read_effects.join(', ')||'none'}. This view runs no actions.</p>
    {authority.refusals.length>0&&<p role="status">HOLD — current operator authority could not be qualified.</p>}
  </section>
}
type CurrentStateComponent = C3OpsCurrentStateReadback["components"][number]
type LapzuliCampaign = LapzuliReadback["campaigns"][number]
type LapzuliAsset = LapzuliCampaign["assets"][number]

const text = (x: unknown) => x == null ? "unresolved" : typeof x === "string" ? x : String(x)

function EvidenceValue({value}:{value:unknown}) {
  if (Array.isArray(value)) {
    if (!value.length) return <>none</>
    if (value.every(item=>item && typeof item==="object" && !Array.isArray(item))) {
      return <div className="ops-records">{value.map((item,i)=><dl key={i}>{Object.entries(item as Record<string,unknown>).map(([k,v])=><div key={k}><dt>{k.replace(/_/g," ")}</dt><dd><EvidenceValue value={v}/></dd></div>)}</dl>)}</div>
    }
    return <>{value.map(item=>text(item)).join(", ")}</>
  }
  if (value && typeof value==="object") {
    return <div className="ops-records"><dl>{Object.entries(value as Record<string,unknown>).map(([k,v])=><div key={k}><dt>{k.replace(/_/g," ")}</dt><dd><EvidenceValue value={v}/></dd></div>)}</dl></div>
  }
  return <>{text(value)}</>
}

function Rows({records}: {records: Record<string,unknown>[]}) {
  return records.length
    ? <div className="ops-records">{records.map((r,i)=><dl key={i}>{Object.entries(r).map(([k,v])=><div key={k}><dt>{k.replace(/_/g," ")}</dt><dd><EvidenceValue value={v}/></dd></div>)}</dl>)}</div>
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

function ProjectionAuthority({lapzuli}:{lapzuli:LapzuliReadback}) {
  const authority=lapzuli.projection_authority
  return <details className="lapzuli-campaign" aria-label="Registrar projection resolution">
    <summary>Registrar resolution · {authority.standing}</summary>
    <p className="ops-caption">{authority.source}</p>
    {authority.hold_reasons.length>0&&<p className="ops-unresolved">HLD — {authority.hold_reasons.join(", ")}</p>}
    <Rows records={[authority.resolution]}/>
    <details><summary>Registrar report · historical evidence</summary>
      <a href={authority.registrar_report.url}>{authority.registrar_report.title}</a>
      <p className="ops-caption">{authority.registrar_report.text_sha256} · {authority.registrar_report.integrity_basis}</p>
      <p style={{whiteSpace:"pre-wrap"}}>{authority.registrar_report.content}</p>
    </details>
  </details>
}

function CampaignSummary({campaign}:{campaign:LapzuliCampaign}) {
  return <>
    <header>
      <div><p className="ops-kicker">{text(campaign.publication_key)} · {campaign.historical?"CURRENT object trace":text(campaign.release_state)}</p>
        <h3>{text(campaign.campaign_name)}</h3><p>{text(campaign.campaign_objective)}</p></div>
      <strong className="lapzuli-standing">{text(campaign.standing)}</strong>
    </header>
    <div className="lapzuli-counts"><span>{campaign.counts.assets} assets</span><span>{campaign.counts.ready} ready</span><span>{campaign.counts.accepted} accepted</span><span>{campaign.counts.distributed} published</span><span>{campaign.counts.held} held</span></div>
    {campaign.historical&&<details aria-label="Historical campaign evidence"><summary>Historical campaign evidence / provenance</summary><Rows records={[campaign.historical]}/></details>}
  </>
}

function LapzuliProjectionOptics({lapzuli}:{lapzuli:LapzuliReadback}) {
  return <section aria-label="Lapzuli CURRENT projection optics">
    <h2>Lapzuli CURRENT object trace</h2>
    <p>Consumes the Registrar report, registered resolution, and the same CURRENT projection as Lapzuli. Observation grants no action authority.</p>
    <ProjectionAuthority lapzuli={lapzuli}/>
    <div className="lapzuli-campaigns">{lapzuli.campaigns.filter(campaign=>campaign.publication_key==="undrifted").map(campaign=><article className="lapzuli-campaign" data-campaign-key={text(campaign.campaign_key)} data-standing={campaign.standing} key={text(campaign.campaign_key)}>
      <CampaignSummary campaign={campaign}/>
      <details><summary>Inspect CURRENT assets</summary>{campaign.assets.map(asset=><article className="lapzuli-asset" data-state={asset.distribution_state} key={text(asset.distribution_asset_key)}>
        <h4>{text(asset.distribution_asset_key)}</h4><p>{asset.distribution_state}</p>
        <Rows records={[{route:asset.route,outlet:asset.outlet,qualification:asset.qualification,blockers:asset.blockers,current_owner_holds:asset.current_owner_holds}]}/>
        {(asset.latest_execution||asset.publication_evidence.length>0)&&<details><summary>Recorded execution / publication evidence</summary><Rows records={[{execution_evidence:asset.latest_execution,publication_evidence:asset.publication_evidence}]}/></details>}
      </article>)}</details>
    </article>)}</div>
  </section>
}

function LapzuliDesk({lapzuli,onRefresh}:{lapzuli:LapzuliReadback;onRefresh:()=>Promise<void>}) {
  const [busy,setBusy]=useState("")
  const [actionResult,setActionResult]=useState<Record<string,unknown>|null>(null)
  const [actionError,setActionError]=useState("")

  async function run(action:"verify_bluesky_identities"|"resolve_campaign"|"preflight_asset"|"dispatch_asset", key="") {
    setBusy(action+":"+key)
    setActionError("")
    setActionResult(null)
    try {
      const response=await fetch("/api/c3ops/manifest?view=lapzuli_action",{
        method:"POST",
        credentials:"same-origin",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify(action==="verify_bluesky_identities"?{action}:action==="resolve_campaign"?{action,campaign_key:key}:{action,distribution_asset_key:key}),
      })
      const contentType=response.headers.get("content-type")??""
      const raw=await response.text()
      if(!contentType.includes("application/json")) throw new Error("Lapzuli action route did not resolve to JSON.")
      const body=JSON.parse(raw) as Record<string,unknown>
      setActionResult(body)
      const reason=typeof body.reason==="string"?body.reason:null
      const error=typeof body.error==="string"?body.error:null
      if(!response.ok) throw new Error(reason??error??"Lapzuli action held.")
      await onRefresh()
    } catch(e) {
      setActionError(e instanceof Error?e.message:"Lapzuli action held.")
    } finally {
      setBusy("")
    }
  }

  const totals=lapzuli.campaigns.reduce((sum,campaign)=>({
    assets:sum.assets+campaign.counts.assets,
    ready:sum.ready+campaign.counts.ready,
    accepted:sum.accepted+campaign.counts.accepted,
    distributed:sum.distributed+campaign.counts.distributed,
    held:sum.held+campaign.counts.held,
  }),{assets:0,ready:0,accepted:0,distributed:0,held:0})

  return <section className="lapzuli-desk" aria-label="Lapzuli distribution desk">
    <div className="lapzuli-desk-mast">
      <div><p className="ops-kicker">REGISTRY-BACKED DISTRIBUTION</p><h2>What can move now?</h2><p>{lapzuli.source}</p><details><summary>Provider identity checks</summary><button className="lapzuli-action" disabled={Boolean(busy)} onClick={()=>void run("verify_bluesky_identities")}>{busy==="verify_bluesky_identities"?"Verifying Bluesky…":"Re-verify Bluesky identities"}</button></details></div>
      <dl className="lapzuli-desk-totals">
        <div><dt>Campaigns</dt><dd>{lapzuli.campaigns.length}</dd></div>
        <div><dt>Ready</dt><dd>{totals.ready}</dd></div>
        <div><dt>Accepted</dt><dd>{totals.accepted}</dd></div>
        <div><dt>Published</dt><dd>{totals.distributed}</dd></div>
        <div><dt>Held</dt><dd>{totals.held}</dd></div>
      </dl>
    </div>

    {(actionResult||actionError)&&<div className={"lapzuli-action-result "+(actionError?"is-held":"is-act")} role="status">
      <strong>{actionError?"HLD":text(actionResult?.standing)}</strong>
      <span>{actionError||text(actionResult?.action)}</span>
      <span>External effects: {actionResult?.external_publication_effects == null ? "UNKNOWN" : text(actionResult.external_publication_effects)}</span>
      {actionResult && "public_speaking_identity" in actionResult && <span>Public speaker: {actionResult.public_speaking_identity ? text(actionResult.public_speaking_identity) : "Unresolved"}</span>}
      {actionResult && "destination_account_key" in actionResult && <span>Destination account: {text(actionResult.destination_account_key)}</span>}
      {actionResult && Array.isArray(actionResult.identities) && <details open><summary>Bluesky identity proof</summary><Rows records={actionResult.identities as Record<string,unknown>[]}/></details>}
      {actionResult && typeof actionResult.worker_result==="object" && actionResult.worker_result!==null && <details>
        <summary>Provider preflight evidence</summary>
        <Rows records={[actionResult.worker_result as Record<string,unknown>]}/>
      </details>}
    </div>}

    <ProjectionAuthority lapzuli={lapzuli}/>
    <div className="lapzuli-campaigns">
      {lapzuli.campaigns.map((campaign:LapzuliCampaign)=><article className="lapzuli-campaign" key={text(campaign.campaign_key)} data-campaign-key={text(campaign.campaign_key)} data-standing={campaign.standing}>
        <CampaignSummary campaign={campaign}/>
        {campaign.assets.some((asset:LapzuliAsset)=>asset.distribution_state==="awaiting_lapzuli_resolution" || asset.distribution_state==="ready_for_lapzuli_resolution")&&<button
          className="lapzuli-action"
          disabled={Boolean(busy)}
          onClick={()=>void run("resolve_campaign",text(campaign.campaign_key))}
        >{busy==="resolve_campaign:"+text(campaign.campaign_key)?"Resolving…":"Resolve CampaignPAC → Lapzuli"}</button>}

        <details>
          <summary>Inspect distribution assets</summary>
          <div className="lapzuli-assets">
            {campaign.assets.map((asset:LapzuliAsset)=><article className="lapzuli-asset" key={text(asset.distribution_asset_key)} data-state={asset.distribution_state}>
              <div className="lapzuli-asset-head">
                <div><strong>{text(asset.platform)}</strong><small>{text(asset.channel_key)}</small></div>
                <span>{text(asset.distribution_state)}</span>
              </div>
              <p>{text(asset.distribution_asset_key)}</p>
              <dl>
                <div><dt>Public speaker</dt><dd>{asset.public_speaking_identity ? text(asset.public_speaking_identity) : "Unresolved"}</dd></div>
                <div><dt>Destination account</dt><dd>{text(asset.destination_account_key)}</dd></div>
                <div><dt>CampaignPac</dt><dd>{text(asset.campaign_pac_key)}</dd></div>
                <div><dt>Source PubPac</dt><dd>{text(asset.source_pubpac_key)}</dd></div>
                <div><dt>Derivative</dt><dd>{text(asset.derivative_key)}</dd></div>
                <div><dt>Executor</dt><dd>{text(asset.executor_key)}</dd></div>
                <div><dt>Route</dt><dd>{text(asset.route?.route_key)}</dd></div>
                {campaign.publication_key==="undrifted"&&<><div><dt>CURRENT outlet/account</dt><dd>{text(asset.outlet?.outlet_key)} / {text(asset.outlet?.account_standing)}</dd></div>
                <div><dt>CURRENT qualification</dt><dd>{text(asset.qualification?.standing)}</dd></div>
                <div><dt>CURRENT adapter</dt><dd>{text(asset.outlet?.metadata && (asset.outlet.metadata as Record<string,unknown>).adapter)}</dd></div></>}
              </dl>
              {asset.blockers.length>0&&<ul className="lapzuli-blockers">{asset.blockers.map(blocker=><li key={blocker}>{blocker.replace(/_/g," ")}</li>)}</ul>}
              {asset.distribution_state==="ready_for_operator_execution"&&<div className="lapzuli-asset-actions">
                <button disabled={Boolean(busy)} onClick={()=>void run("preflight_asset",text(asset.distribution_asset_key))}>
                  {busy==="preflight_asset:"+text(asset.distribution_asset_key)?"Checking…":"Preflight"}
                </button>
                <button className="is-live" disabled={Boolean(busy)} onClick={()=>void run("dispatch_asset",text(asset.distribution_asset_key))}>
                  {busy==="dispatch_asset:"+text(asset.distribution_asset_key)?"Dispatching…":"Dispatch now"}
                </button>
              </div>}
              {asset.latest_execution&&<details><summary>Recorded execution evidence</summary><Rows records={[asset.latest_execution]}/></details>}
            </article>)}
            {!campaign.assets.length&&<p className="ops-unresolved">DNR — no distribution assets are bound to this campaign.</p>}
          </div>
        </details>
      </article>)}
    </div>
  </section>
}

export default function C3OpsDoor() {
  const [pathname,setPathname]=useState(window.location.pathname)
  const [showAuth,setShowAuth]=useState(false)
  const route=c3OpsRoute(pathname)
  const [operatorProof,setOperatorProof]=useState("")
  const [state,setState]=useState<OperatorManifest|null>(null)
  const [lapzuli,setLapzuli]=useState<LapzuliReadback|null>(null)
  const [currentState,setCurrentState]=useState<C3OpsCurrentStateReadback|null>(null)
  const [authorizationOptics,setAuthorizationOptics]=useState<AuthorizationOpticsReadback|null>(null)
  const [error,setError]=useState("")

  const readGeneration=useRef(0)
  useEffect(()=>{
    const pop=()=>setPathname(window.location.pathname)
    const navigate=(event:MouseEvent)=>{
      if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return
      const anchor=(event.target as Element)?.closest?.('a')
      if(!anchor || anchor.target || anchor.hasAttribute('download'))return
      const url=new URL(anchor.href,window.location.href)
      if(url.origin!==window.location.origin || url.search || url.hash || c3OpsRoute(url.pathname)===null || url.pathname===window.location.pathname)return
      event.preventDefault();window.history.pushState(null,'',url.pathname);setPathname(url.pathname)
    }
    window.addEventListener('popstate',pop);document.addEventListener('click',navigate)
    return()=>{window.removeEventListener('popstate',pop);document.removeEventListener('click',navigate)}
  },[])
  const [readEpoch,setReadEpoch]=useState(0)
  const changeProof=useCallback((proof:string)=>{readGeneration.current++;setState(null);setLapzuli(null);setCurrentState(null);setAuthorizationOptics(null);setError("");setOperatorProof(proof);setReadEpoch(n=>n+1)},[])
  async function refreshLapzuli() {
    const response=await fetch("/api/c3ops/manifest?view=lapzuli",{credentials:"same-origin"})
    if(!response.ok) throw new Error("Lapzuli evidence readback unavailable.")
    const body=await response.json() as LapzuliReadback
    if(body.contract!=="lapzuli_distribution_desk_v1") throw new Error("Lapzuli distribution contract unresolved.")
    setLapzuli(body)
  }

  useEffect(()=>{
    document.title="c3Ops"
    if(route===null || !operatorProof) return
    setState(null);setLapzuli(null);setCurrentState(null);setAuthorizationOptics(null);setError("")
    const requestGeneration=++readGeneration.current
    const controller=new AbortController()
    async function load() {
      try {
        const response=await fetch("/api/c3ops/manifest",{credentials:"same-origin",headers:operatorProof?{"x-c3ops-session-proof":operatorProof}:{},signal:controller.signal})
        if(!response.ok){
          // Display only the bounded native handler refusal category. Never
          // expose raw Registry errors, tokens, or server configuration.
          const failure=await response.json().catch(()=>null) as {standing?:unknown;reason?:unknown}|null
          const reason=typeof failure?.reason==="string"&&/^(readback_unavailable:(native_recognition|registry_configuration|registered_authority|registered_projection)|native_session_required|native_auth_configuration|native_recognition_denied|native_recognition_binding_mismatch|native_recognition_unavailable|registered_read_authority_unavailable)$/.test(failure.reason)?failure.reason:null
          throw new Error(reason?`HLD — ${reason}`:response.status===403?"Operator read authority is held.":response.status===401?"Native Operator recognition held.":"Registry readback unavailable.")
        }
        const body=await response.json() as OperatorManifest
        if(body.contract!=="me_environment_manifest_v1" || !Array.isArray(body.environments)) throw new Error("Registry response is not a manifest.")
        if(controller.signal.aborted||requestGeneration!==readGeneration.current)return;setState(body)

        if(route==="/c3optics"){
          const opticsResponse=await fetch("/api/c3ops/manifest?view=authorizations",{
            credentials:"same-origin",headers:operatorProof?{"x-c3ops-session-proof":operatorProof}:{},signal:controller.signal
          })
          if(!opticsResponse.ok) throw new Error("Authorization Optics live Registry readback HLD.")
          const opticsBody=await opticsResponse.json() as AuthorizationOpticsReadback
          if(opticsBody.contract!=="c3ops_authorization_optics_v1"
            ||opticsBody.environment!=="env_c3ops"
            ||opticsBody.execution_authority!==false
            ||opticsBody.mutation_authority!==false
            ||!Array.isArray(opticsBody.requests)) throw new Error("Authorization Optics contract unresolved.")
          if(controller.signal.aborted||requestGeneration!==readGeneration.current)return
          setAuthorizationOptics(opticsBody)
        }
        if(route==="/systems-access/current"){
          const currentResponse=await fetch("/api/c3ops/manifest?view=current_state",{credentials:"same-origin",headers:operatorProof?{"x-c3ops-session-proof":operatorProof}:{},signal:controller.signal})
          if(!currentResponse.ok) throw new Error("c3Ops Current State readback unavailable.")
          const currentBody=await currentResponse.json() as C3OpsCurrentStateReadback
          if(currentBody.contract!=="c3ops_current_state_v1" || !Array.isArray(currentBody.components)) throw new Error("Current State projection is not governed.")
          if(controller.signal.aborted||requestGeneration!==readGeneration.current)return;setCurrentState(currentBody)
        }

        if(false){
          const r=await fetch("/api/c3ops/manifest?view=lapzuli",{credentials:"same-origin",headers:operatorProof?{"x-c3ops-session-proof":operatorProof}:{},signal:controller.signal})
          if(!r.ok) throw new Error("Lapzuli evidence readback unavailable.")
          const lapzuliBody=await r.json() as LapzuliReadback
          if(lapzuliBody.contract!=="lapzuli_distribution_desk_v1") throw new Error("Lapzuli distribution contract unresolved.")
          if(controller.signal.aborted||requestGeneration!==readGeneration.current)return;setLapzuli(lapzuliBody)
        }
      } catch(e) {
        if(!controller.signal.aborted&&requestGeneration===readGeneration.current) setError(e instanceof Error?e.message:"Readback unavailable.")
      }
    }
    void load()
    return ()=>controller.abort()
  },[route,operatorProof,readEpoch])

  useEffect(()=>{
    if(route!=="/c3optics"||!operatorProof)return
    const timer=window.setInterval(()=>setReadEpoch(n=>n+1),60000)
    return ()=>window.clearInterval(timer)
  },[route,operatorProof])
  if(route===null) return <DnrBackdrop/>
  const currentComponent=currentState?.components.find(component=>component.key==="current")
  const stations=currentState?.components.filter(component=>component.key!=="current") ?? []

  return <>
    <section hidden={(route==="/"&&!showAuth)||(route!=="/"&&Boolean(state))} className={"ops-entry-auth"+(route==="/"?" ops-auth-dialog":"")} role={route==="/"&&showAuth?"dialog":undefined} aria-modal={route==="/"&&showAuth?true:undefined} aria-label={route==="/"&&showAuth?"Operator authentication":undefined}>
      {route==="/" && <button type="button" className="ops-auth-close" onClick={()=>setShowAuth(false)} aria-label="Close authentication">✕</button>}
      <OperatorSignIn onProof={changeProof} readComplete={!!state} readHeld={!!error}/>
      {route==="/" && operatorProof && !state && !error && <p role="status">Checking registered read permissions…</p>}
      {route==="/" && error && <p role="alert">HLD — {error}</p>}
    </section>
    {route==="/" ? <PortalHome onEnter={()=>setShowAuth(true)} authorized={Boolean(state)}/> : <main className="ops-room">
    <nav className="ops-return-nav" aria-label="c3Ops navigation"><a href="/">← Return to c3Ops portal</a></nav>
    <header className="ops-room-header">
      <a href="/" className="ops-brand"><span>c3</span>Ops</a>
      <nav aria-label="Environment navigation">{portals.map(p=><a key={p.path} href={p.path} aria-current={route?.startsWith(p.path)?"page":undefined}>{p.label}</a>)}</nav>
    </header>

    {!route ? <><h1>Route unresolved</h1><p>This route has no c3Ops passage.</p></> : <>
      {!state && <p role="status" className="ops-unresolved">Operator authentication is separate from Registry read qualification. This room remains held until the registered readback succeeds. You can return to the portal without requesting or renewing authority.</p>}
      {state && <div className="ops-room-title">
        <p className="ops-kicker">c3Ops / operator environment</p>
        <h1>{route.includes("lapzuli")?"Lapzuli · Distribution Canopy":route==="/c3optics"?"c3Optics":route.startsWith("/relational")?"Relational Operations":"Systems Access"}</h1>
      </div>}

      {state && <p>Read-only access. Distribution and operational actions are unavailable in this release.</p>}
      {error && <p role="alert" className="ops-unresolved ops-alert">HLD — {error} <a href={window.location.pathname}>Retry readback</a></p>}
      {operatorProof && !state && !error && <p role="status" className="ops-reading">Reading registered environments…</p>}

      {state && <>
        <p className="ops-caption">Readback {new Date(state.observed_at).toLocaleString()} · Observation grants no action authority.</p>
        <OperatorAuthority authority={state.operator_authority}/>
        {route==="/c3optics" && authorizationOptics && <AuthorizationOptics data={authorizationOptics} onRefresh={()=>setReadEpoch(n=>n+1)}/>}
        {route==="/c3optics" && !authorizationOptics && <p role="status" className="ops-unresolved">HLD — live authorization Optics has not resolved.</p>}
        {state.missing_environments?.length>0 && <p className="ops-unresolved">Environment readback missing: {state.missing_environments.join(", ")}</p>}

        {route.startsWith("/systems-access") && <nav className="ops-architecture" aria-label="Operational architecture">{[["Current","/systems-access/current"],["Build","/systems-access/build"],["Work","/systems-access/work"],["Systems","/systems-access"],["Registry","/systems-access/registry"],["Evidence","/c3optics"]].map(([label,path])=><a key={path} href={path}>{label}</a>)}</nav>}

        {(route==="/systems-access/build"||route==="/systems-access/work") && <p className="ops-unresolved">HLD — this passage provides environment readback. Formation and work execution require their own routed authority.</p>}

        {route.startsWith("/relational-operations") && <p className="ops-unresolved" role="status">HLD — Interops requires its own registered interoperability observation or execution authority. Operator read-preflight scope does not grant it.</p>}

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

        {route!=="/systems-access/current" && !route.startsWith("/relational-operations") && <section className="ops-env-grid" aria-label="Persisted environment state">{state.environments.map(e=><article className="ops-env" key={text(e.identity.env_key)}>
          <p className="ops-kicker">{text(e.identity.system_key)}</p><h2>{text(e.identity.environment_name)}</h2>
          <dl><div><dt>Environment key</dt><dd>{text(e.identity.env_key)}</dd></div><div><dt>Class</dt><dd>{text(e.identity.environment_class)}</dd></div><div><dt>Standing</dt><dd>{text(e.standing)}</dd></div>{e.formation&&<div><dt>Formation</dt><dd>{e.formation}</dd></div>}<div><dt>Active / canonical</dt><dd>{text(e.active)} / {text(e.canonical)}</dd></div>{e.domain&&<div><dt>Domain</dt><dd>{e.domain}</dd></div>}</dl>
          {route==="/c3optics" ? <Current env={e}/> : <>
          <p>Current: {e.current.records.length?e.current.records.map(c=>text(c.standing)).join(", "):"unresolved"}</p>
          {e.identity.environment_class==="c2_contribute_environment" && <p>Result · independent C2 determination · retained value: unresolved. Formation does not establish these outcomes.</p>}
          <details><summary>Registered relations and holds</summary><h3>Source authority</h3><p>{text(e.source_authority)}</p>
          {(["c1","c2","boundary","interoperability","registered_resources","canopy"] as const).map(k=><section key={k}><h3>{k.replace(/_/g," ")}</h3><p className="ops-caption">{e[k].source}</p><Rows records={e[k].records}/></section>)}
          <h3>Open holds</h3><Rows records={[e.holds]}/><Current env={e}/><h3>Unresolved coverage</h3><ul>{e.unresolved.map(u=><li key={u}>{u}</li>)}</ul></details></>}
        </article>)}</section>}

        {false && lapzuli && route==="/relational-operations/lapzuli" && <LapzuliDesk lapzuli={lapzuli} onRefresh={refreshLapzuli}/>}
        {lapzuli && route==="/c3optics" && <><LapzuliProjectionOptics lapzuli={lapzuli}/><section aria-label="Lapzuli returned encounters"><h2>Lapzuli returned encounters</h2><p>Provider outcomes are evidence; resulting Current requires its own registered relation.</p><div className="ops-env-grid">{lapzuli.routes.map(r=><article className="ops-env" key={text(r.route_key)}><p className="ops-kicker">{text(r.desk_key)} · {text(r.outlet_key)}</p><h3>{text(r.publication_object_key)}</h3><p>Route: {text(r.route_key)} · {text(r.route_status)}</p><Rows records={lapzuli.evidence.filter(e=>e.route_key===r.route_key)}/></article>)}</div></section></>}
      </>}
    </>}
  </main>}
  </>
}
