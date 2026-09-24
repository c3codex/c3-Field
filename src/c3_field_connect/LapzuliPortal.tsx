import { useEffect, useState } from "react"
import "./lapzuliPortal.css"

type GovernedResult = "ACT" | "HLD" | "DNR"

type FreeExecution = {
  executionId: string | null
  distributionAssetId: string | null
  executorKey: string | null
  channelKey: string | null
  executionStatus: string | null
  attemptNumber: number | null
  executedAt: string | null
  publishedAt: string | null
  platformPostId: string | null
  platformUrl: string | null
  error: string | null
  createdAt: string | null
}

type FreeAsset = {
  distributionAssetKey: string | null
  campaignId: string | null
  platform: string | null
  distributionType: string | null
  status: string | null
  bufferExportReady: boolean
  reviewStatus: string | null
  updatedAt: string | null
}

type FreeChannel = {
  channelKey: string | null
  executorKey: string | null
  platform: string | null
  accountName: string | null
  channelIdentifier: string | null
  status: string | null
  updatedAt: string | null
}

type FreePac = {
  pacKey: string
  envpacKey: string | null
  standing: string | null
  isEffective: boolean
  sourceAuthority: string | null
  truth: {
    campaignKey: string | null
    campaignName: string | null
    objective: string | null
    canonicalUrl: string | null
    lapzuliReady: boolean | null
    activationState: string | null
    distributionAuthorized: boolean | null
    externalExecutionAuthorized: boolean | null
  }
  campaign: {
    campaignKey: string | null
    campaignName: string | null
    objective: string | null
    status: string | null
    releaseState: string | null
    reviewStatus: string | null
    updatedAt: string | null
  } | null
  distributionAssets: FreeAsset[]
  executions: FreeExecution[]
  channels: FreeChannel[]
}

type FreeProjection = {
  standing: string
  projection?: string
  authorityCreated?: boolean
  encounterCreated?: boolean
  pacs?: FreePac[]
  reason?: string
}

type Encounter = {
  key: string
  surface: string
  desk: string
  title: string
  result: GovernedResult
  reason: string
  evidenceUrl: string | null
}

function executionTime(execution: FreeExecution) {
  const value=execution.publishedAt??execution.executedAt??execution.createdAt
  const parsed=value?Date.parse(value):0
  return Number.isFinite(parsed)?parsed:0
}

function readableReason(value: string | null) {
  if(!value) return null
  try {
    const parsed=JSON.parse(value)
    if(Array.isArray(parsed)) return parsed.map(String).join(" · ").replaceAll("_"," ")
  } catch {
    // Plain returned executor reason.
  }
  return value.replaceAll("_"," ")
}

function deniedRelease(value: string | null) {
  const normalized=(value??"").toLowerCase()
  return normalized.includes("do_not_release") || normalized.includes("dnr") || normalized.includes("rejected")
}

function encounterForAsset(pac: FreePac, asset: FreeAsset): Encounter {
  const assetKey=asset.distributionAssetKey??"unresolved_asset"
  const executions=pac.executions
    .filter(execution=>execution.distributionAssetId===asset.distributionAssetKey)
    .sort((a,b)=>executionTime(b)-executionTime(a))
  const execution=executions[0]??null
  const channel=execution?.channelKey
    ? pac.channels.find(item=>item.channelKey===execution.channelKey)??null
    : null

  let result: GovernedResult="HLD"
  let reason="Registered distribution asset awaiting bounded encounter"

  if(deniedRelease(pac.campaign?.releaseState??null)){
    result="DNR"
    reason="Campaign release state does not permit distribution"
  }else if(execution?.executionStatus==="published" && execution.platformUrl){
    result="ACT"
    reason="Destination evidence returned"
  }else if(execution?.executionStatus==="held"){
    reason=readableReason(execution.error)??"Returned execution hold"
  }else if(execution?.executionStatus==="failed"){
    reason=readableReason(execution.error)??"Execution attempt failed; authority unchanged"
  }else if(execution?.executionStatus==="queued" || execution?.executionStatus==="prepared"){
    reason=`${execution.executionStatus} awaiting returned destination evidence`
  }else if(asset.status){
    reason=`${asset.status.replaceAll("_"," ")}; no completed destination evidence`
  }

  return {
    key:`${pac.pacKey}:${assetKey}:${execution?.executionId??"pending"}`,
    surface:channel?.accountName??channel?.channelKey??asset.platform??"unresolved destination",
    desk:pac.truth.campaignKey??pac.envpacKey??"campaign",
    title:pac.campaign?.campaignName??pac.truth.campaignName??pac.pacKey,
    result,
    reason,
    evidenceUrl:execution?.platformUrl??null,
  }
}

function encountersFromPac(pac: FreePac): Encounter[] {
  if(pac.distributionAssets.length>0) return pac.distributionAssets.map(asset=>encounterForAsset(pac,asset))

  const distributionHeld=pac.truth.distributionAuthorized===false || pac.truth.externalExecutionAuthorized===false
  return [{
    key:`${pac.pacKey}:pac-truth`,
    surface:"PAC",
    desk:pac.truth.campaignKey??pac.envpacKey??"campaign",
    title:pac.campaign?.campaignName??pac.truth.campaignName??pac.pacKey,
    result:"HLD",
    reason:distributionHeld
      ? "PAC truth currently withholds external distribution"
      : pac.truth.activationState
        ? pac.truth.activationState.replaceAll("_"," ")
        : "PAC registered; exact distribution bindings have not resolved",
    evidenceUrl:null,
  }]
}

export default function LapzuliPortal() {
  const [encounters,setEncounters]=useState<Encounter[]>([])
  const [error,setError]=useState<string|null>(null)

  useEffect(()=>{
    document.title="Lapzuli | c3Ops"
    let active=true

    void fetch("/api/free-lapzuli-pac",{cache:"no-store",headers:{accept:"application/json"}})
      .then(async response=>{
        const payload=await response.json() as FreeProjection
        if(!response.ok || payload.standing!=="free_pac_projection" || !Array.isArray(payload.pacs)){
          throw new Error(payload.reason??payload.standing??"FREE PAC projection unavailable")
        }
        if(payload.authorityCreated!==false || payload.encounterCreated!==false){
          throw new Error("FREE PAC projection boundary mismatch")
        }
        if(!active) return
        setEncounters(payload.pacs.flatMap(encountersFromPac))
        setError(null)
      })
      .catch((reason:unknown)=>{
        if(!active) return
        setEncounters([])
        setError(reason instanceof Error?reason.message:"FREE PAC projection unavailable")
      })

    return()=>{active=false}
  },[])

  const counts=encounters.reduce<Record<GovernedResult,number>>((acc,encounter)=>{
    acc[encounter.result]+=1
    return acc
  },{ACT:0,HLD:0,DNR:0})

  return (
    <main className="lapzuli-portal" data-result-vocabulary="ACT|HLD|DNR" data-truth-source="FREE→PAC">
      <header className="lapzuli-hero">
        <div>
          <p className="lapzuli-kicker">c3Ops · FREE → PAC</p>
          <h1>Lapzuli</h1>
          <p>PAC brings the truth. Runtime computes the projection. Authority stays upstream.</p>
        </div>
        <dl className="lapzuli-summary">
          <div><dt>ACT</dt><dd>{counts.ACT}</dd></div>
          <div><dt>HLD</dt><dd>{counts.HLD}</dd></div>
          <div><dt>DNR</dt><dd>{counts.DNR}</dd></div>
        </dl>
      </header>

      {error && <section className="lapzuli-state"><strong>HLD</strong><p>{error}</p></section>}

      <section className="lapzuli-grid" aria-label="PAC Destination Encounter Result Evidence">
        {encounters.map(encounter=>(
          <article className="lapzuli-card" data-result={encounter.result} key={encounter.key}>
            <div><span>{encounter.surface}</span><span>{encounter.desk.replaceAll("_"," ")}</span></div>
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
