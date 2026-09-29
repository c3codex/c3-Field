import {useEffect,useState} from "react"
import "./c2Environment.css"

type PacTruth={
  pac_key:string
  title?:string
  subtitle?:string|null
  thesis?:string|null
  standing?:string
  release_state?:string
  custody_uri?:string
  canonical_host?:string
  evaluation?:{completeness_state?:string;resolution_state?:string;reason?:string}
  workflow?:{
    ni_public_encounter_approval?:Record<string,unknown>|null
    operator_encounter_approval?:string
    registry_submission_state?:string
    registry_approval_state?:string
    free_resolution_state?:string
    runtime_state?:string
  }
  registry_registration_state?:string|null
  registered_content_sha256?:string|null
  runtime_binding_ready?:boolean
  runtime_blockers?:Array<{member_key?:unknown;member_role?:unknown;reason?:unknown}>
}
type Payload={
  authenticated:boolean
  standing:string
  environment?:string
  custody_transfer?:boolean
  pacs?:PacTruth[]
  reason?:string
}

export default function C2PacEncounter(){
  const params=new URLSearchParams(window.location.search)
  const requestedPac=params.get("pac")||""
  const [data,setData]=useState<Payload|null>(null)
  const [busy,setBusy]=useState(false)
  const [notice,setNotice]=useState("")

  async function load(){
    const suffix=requestedPac?"?pac="+encodeURIComponent(requestedPac):""
    const response=await fetch("/api/c2-pac-encounter"+suffix,{credentials:"same-origin",headers:{accept:"application/json"},cache:"no-store"})
    const body=await response.json() as Payload
    setData(body)
  }

  useEffect(()=>{void load()},[requestedPac])

  async function act(action:"approve_public_encounter"|"register_public_encounter",pacKey:string){
    setBusy(true);setNotice("")
    try{
      const response=await fetch("/api/c2-pac-encounter",{
        method:"POST",
        credentials:"same-origin",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({action,pac_key:pacKey})
      })
      const result=await response.json() as Record<string,unknown>
      if(!response.ok||result.standing!=="ACT")
        throw new Error(String(result.reason||result.standing||"The encounter did not resolve."))
      setNotice(action==="approve_public_encounter"
        ?"Public encounter approved by the PAC custodian."
        :"PAC registered. FREE will resolve only while Registry and current PAC state match.")
      await load()
    }catch(error){
      setNotice(error instanceof Error?error.message:"The encounter did not resolve.")
    }finally{setBusy(false)}
  }

  if(!data) return <main className="c2-shell"><p className="c2-shell-label">C2ME_env · PAC encounter</p><p>Resolving governed encounter…</p></main>

  if(!data.authenticated||data.standing==="DNR") return <main className="c2-shell c2-held">
    <nav className="c2-home-nav"><a className="c2-home-link" href="/my-environment">← MY ENVIRONMENT</a><a href="/">c3 FIELD</a></nav>
    <p className="c2-shell-label">C2ME_env · PAC encounter</p>
    <h1>Encounter did not resolve.</h1>
    <p>{data.reason||"Persisted CURRENT and C2 standing are required."}</p>
    <p className="c2-small">Standing: DNR</p>
  </main>

  const pacs=data.pacs||[]
  return <main className="c2-shell">
    <header className="c2-topbar">
      <a className="c2-brand" href="/"><span>c3</span> Community Partners</a>
      <div className="c2-topbar-actions">
        <p className="c2-shell-label">C2ME_env · governed PAC encounter</p>
        <a className="c2-home-link" href="/my-environment">← MY ENVIRONMENT</a>
      </div>
    </header>

    <section className="c2-mission-head">
      <p className="c2-eyebrow">PAC ENCOUNTER</p>
      <h1>Review what may cross the public boundary.</h1>
      <p>C2ME_env governs the encounter. PAC custody does not transfer. Registry may register only the PAC state explicitly approved here.</p>
    </section>

    <section className="c2-panel">
      {pacs.length===0&&<article className="c2-current-list"><p>No eligible custodied WebPAC resolves for this encounter.</p></article>}
      {pacs.map(pac=>{
        const approved=pac.workflow?.operator_encounter_approval==="APPROVED"
        const registered=pac.registry_registration_state==="REGISTERED"
        const complete=pac.evaluation?.completeness_state==="pass"
        const runtimeReady=pac.runtime_binding_ready===true
        return <article key={pac.pac_key} className="c2-evidence-block">
          <p className="c2-eyebrow">SEPARATELY CUSTODIED PAC</p>
          <h2>{pac.title||pac.pac_key}</h2>
          {pac.subtitle&&<p>{pac.subtitle}</p>}
          {pac.thesis&&<p><strong>{pac.thesis}</strong></p>}
          <div className="c2-current-list">
            <article><span>custody</span><p>{pac.custody_uri||"separate PAC custody"}</p></article>
            <article><span>contract</span><p>{complete?"PASS":"HELD"} · {pac.evaluation?.resolution_state||"held"}</p></article>
            <article><span>NI approval</span><p>{approved?"APPROVED":"PENDING"}</p></article>
            <article><span>Registry</span><p>{registered?"REGISTERED":pac.workflow?.registry_submission_state||"NOT SUBMITTED"}</p></article>
            <article><span>runtime bindings</span><p>{runtimeReady?"READY":"HELD"}</p></article>
            <article><span>FREE</span><p>{pac.workflow?.free_resolution_state||"BLOCKED"}</p></article>
          </div>

          {!approved&&<button
            type="button"
            disabled={busy||!complete}
            onClick={()=>void act("approve_public_encounter",pac.pac_key)}
          >APPROVE PUBLIC ENCOUNTER</button>}

          {approved&&!registered&&<button
            type="button"
            disabled={busy||!complete||!runtimeReady}
            onClick={()=>void act("register_public_encounter",pac.pac_key)}
          >REGISTER APPROVED PAC</button>}

          {!runtimeReady&&<div className="c2-notice">
            <strong>HELD — required public runtime binding incomplete.</strong>
            {(pac.runtime_blockers||[]).map((blocker,index)=><p key={index}>
              {String(blocker.member_role||blocker.member_key||"required member")} · {String(blocker.reason||"runtime binding required")}
            </p>)}
          </div>}

          {registered&&<p className="c2-notice">REGISTERED · {pac.registered_content_sha256}</p>}
          {pac.canonical_host&&<p className="c2-small">Public host: {pac.canonical_host}</p>}
        </article>
      })}
      {notice&&<p className="c2-notice" role="status">{notice}</p>}
    </section>

    <footer className="c2-footer">
      <span>C2ME_env · governed relational encounter</span>
      <span>Custody stays separate · Registry records approved state · mismatch resolves DNR</span>
    </footer>
  </main>
}
