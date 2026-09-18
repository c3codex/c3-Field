import {FormEvent, useEffect, useMemo, useState} from "react"
import "./c2Environment.css"

type Prospect={
  prospect_key:string
  display_name:string
  county:string
  state:string
  standing:string
  prospect_reason_summary:string
  tract_context:Record<string,unknown>
  demographics_summary?:string|null
  economic_context_summary?:string|null
  history_identity_summary?:string|null
  transportation_access_summary?:string|null
  existing_assets:unknown[]
  missing_conditions:unknown[]
  public_private_investment:unknown[]
  property_place_leads:Array<Record<string,unknown>>
  people_institutions_businesses:unknown[]
  open_questions:unknown[]
  participant_contribution_needs:unknown[]
  current_stage:string
  supporter_count:number
  contributor_count:number
  evidence:Array<Record<string,unknown>>
}
type Payload={
  authenticated:boolean
  standing:string
  participant?:{relationship_key:string}
  mission?:{title:string;working_form:string;question:string}
  prospects?:Prospect[]
  my_support?:Record<string,unknown>|null
  my_contributions?:Array<Record<string,unknown>>
  current?:Array<Record<string,unknown>>
  reason?:string
}
const CONTRIBUTION_TYPES=[
  "local knowledge","introduction / relationship","property or land lead","business capacity",
  "institutional contact","funding / capital contact","skill / professional capacity","labor / time",
  "food / hospitality","tools / equipment","transportation / logistics","creative / cultural contribution",
  "technology / systems capacity","research / evidence","community need","opportunity / idea","other"
]
function textItems(values:unknown[]){
  return values.map((value,index)=>{
    if(typeof value==="string") return <li key={index}>{value}</li>
    if(value&&typeof value==="object"){
      const row=value as Record<string,unknown>
      const title=String(row.title||row.type||"Item")
      const details=String(row.details||row.standing||"")
      return <li key={index}><strong>{title}</strong>{details?" — "+details:""}</li>
    }
    return null
  })
}
export default function C2EnvironmentShell(){
  const [data,setData]=useState<Payload|null>(null)
  const [selected,setSelected]=useState<string|null>(null)
  const [busy,setBusy]=useState(false)
  const [notice,setNotice]=useState("")
  const [type,setType]=useState(CONTRIBUTION_TYPES[0])
  const [description,setDescription]=useState("")
  const [tab,setTab]=useState<"mission"|"places"|"current">("places")

  async function load(){
    const response=await fetch("/api/c2-mdm",{credentials:"same-origin"})
    const payload=await response.json() as Payload
    setData(payload)
    if(payload.prospects?.length && !selected) setSelected(payload.prospects[0].prospect_key)
  }
  useEffect(()=>{void load()},[])
  const prospects=data?.prospects||[]
  const active=useMemo(()=>prospects.find(p=>p.prospect_key===selected)||prospects[0], [prospects,selected])
  const mySupport=typeof data?.my_support?.prospect_key==="string"?data?.my_support?.prospect_key:null

  async function support(prospectKey:string){
    setBusy(true);setNotice("")
    try{
      const response=await fetch("/api/c2-mdm",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json"},body:JSON.stringify({action:"support",prospect_key:prospectKey})})
      const result=await response.json()
      if(!response.ok) throw new Error(String(result.reason||result.standing||"Support could not be recorded."))
      setNotice("Your town support has been recorded.")
      await load()
    }catch(error){setNotice(error instanceof Error?error.message:"Support could not be recorded.")}
    finally{setBusy(false)}
  }

  async function contribute(event:FormEvent){
    event.preventDefault()
    if(!active||!description.trim()) return
    setBusy(true);setNotice("")
    try{
      const response=await fetch("/api/c2-mdm",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json"},body:JSON.stringify({
        action:"contribute",prospect_key:active.prospect_key,contribution_type:type,description:description.trim()
      })})
      const result=await response.json()
      if(!response.ok) throw new Error(String(result.reason||result.standing||"Contribution could not be submitted."))
      setDescription("")
      setNotice("Contribution submitted for review.")
      await load()
    }catch(error){setNotice(error instanceof Error?error.message:"Contribution could not be submitted.")}
    finally{setBusy(false)}
  }

  if(!data) return <main className="c2-shell"><p className="c2-shell-label">c2ME.env</p><p>Opening the Million Dollar Mission…</p></main>

  if(!data.authenticated) return <main className="c2-shell c2-held">
    <a href="/">c3 Field</a>
    <p className="c2-shell-label">c2ME.env · Million Dollar Mission</p>
    <h1>Connect before entering the mission.</h1>
    <p>The Million Dollar Mission environment is available after your c1 relationship has been persisted.</p>
    <a className="c2-primary-link" href="/connect">CONNECT</a>
    <p className="c2-small">Standing: {data.standing}{data.reason?" · "+data.reason:""}</p>
  </main>

  return <main className="c2-shell" aria-labelledby="c2-title">
    <header className="c2-topbar">
      <a className="c2-brand" href="/"><span>c3</span> Community Partners</a>
      <p className="c2-shell-label">c2ME.env · connected initiative</p>
    </header>

    <section className="c2-mission-head">
      <p className="c2-eyebrow">THE MILLION DOLLAR MISSION</p>
      <h1 id="c2-title">{data.mission?.working_form||"One small town / One million dollars / 90 days"}</h1>
      <p>{data.mission?.question}</p>
      <nav className="c2-tabs" aria-label="Million Dollar Mission">
        <button className={tab==="mission"?"active":""} onClick={()=>setTab("mission")}>MISSION</button>
        <button className={tab==="places"?"active":""} onClick={()=>setTab("places")}>PLACES</button>
        <button className={tab==="current"?"active":""} onClick={()=>setTab("current")}>CURRENT</button>
      </nav>
    </section>

    {tab==="mission"&&<section className="c2-panel c2-mission-panel">
      <p className="c2-eyebrow">WHAT WE ARE TESTING</p>
      <h2>Can local potential become visible, connected, useful, and shared?</h2>
      <div className="c2-metric-grid">
        <article><strong>{prospects.length}</strong><span>active prospect cities</span></article>
        <article><strong>{prospects.reduce((n,p)=>n+p.supporter_count,0)}</strong><span>registered supporters</span></article>
        <article><strong>{prospects.reduce((n,p)=>n+p.contributor_count,0)}</strong><span>contributions</span></article>
      </div>
      <div className="c2-principles">
        <span>VISIBLE PARTICIPATION</span><span>MEANINGFUL CONTRIBUTION</span><span>LOCAL BENEFIT</span><span>RETAINED VALUE</span><span>VERIFIABLE OUTCOMES</span>
      </div>
    </section>}

    {tab==="places"&&<section className="c2-places">
      <div className="c2-prospect-list" aria-label="Prospect cities">
        <div className="c2-section-heading">
          <p className="c2-eyebrow">PROSPECT CITIES</p>
          <h2>Choose a place to see why it is here.</h2>
        </div>
        {prospects.map(prospect=><button key={prospect.prospect_key} className={"c2-prospect-card "+(active?.prospect_key===prospect.prospect_key?"selected":"")} onClick={()=>setSelected(prospect.prospect_key)}>
          <span className="c2-card-place">{prospect.display_name}</span>
          <span className="c2-card-county">{prospect.county}</span>
          <span className="c2-card-summary">{prospect.prospect_reason_summary}</span>
          <span className="c2-card-stats">{prospect.supporter_count} supporters · {prospect.contributor_count} contributors</span>
          <span className="c2-card-action">VIEW WHY THIS PLACE →</span>
        </button>)}
      </div>

      {active&&<article className="c2-dossier">
        <p className="c2-eyebrow">WHY THIS PLACE?</p>
        <h2>{active.display_name}</h2>
        <p className="c2-dossier-lead">{active.prospect_reason_summary}</p>

        <div className="c2-tract">
          <span>PROSPECT AREA</span>
          <strong>{String(active.tract_context?.label||"Registered prospect geography")}</strong>
          <small>Opportunity Zone / tract context is shown separately from municipal boundaries.</small>
        </div>

        <div className="c2-dossier-grid">
          <section><h3>What is already here</h3><ul>{textItems(active.existing_assets)}</ul></section>
          <section><h3>What appears to be missing</h3><ul>{textItems(active.missing_conditions)}</ul></section>
          <section><h3>Properties / places</h3><ul>{textItems(active.property_place_leads)}</ul></section>
          <section><h3>What we still need to know</h3><ul>{textItems(active.open_questions)}</ul></section>
        </div>

        {active.public_private_investment.length>0&&<section className="c2-evidence-block">
          <h3>Prior investment context</h3>
          <ul>{textItems(active.public_private_investment)}</ul>
          <p>Prior investment is evidence for the prospect analysis, not a selection decision.</p>
        </section>}

        <section className="c2-contribute">
          <div>
            <p className="c2-eyebrow">WHAT CAN YOU BRING?</p>
            <h3>Help us understand this place better.</h3>
            <ul>{textItems(active.participant_contribution_needs)}</ul>
          </div>
          <form onSubmit={contribute}>
            <label>Contribution type
              <select value={type} onChange={e=>setType(e.target.value)}>{CONTRIBUTION_TYPES.map(value=><option key={value}>{value}</option>)}</select>
            </label>
            <label>What are you bringing?
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5} maxLength={4000} placeholder="Share what you know, who you can connect, a place or resource, or something the Mission should see." />
            </label>
            <button type="submit" disabled={busy||!description.trim()}>CONTRIBUTE</button>
            <small>Submission begins review. It does not become verified simply because it was submitted.</small>
          </form>
        </section>

        <div className="c2-support">
          <div><p className="c2-eyebrow">CHOOSE</p><h3>Do you think the Mission should keep pursuing {active.display_name}?</h3><p>Support is one input into selection. It is not the final decision.</p></div>
          <button disabled={busy||mySupport===active.prospect_key} onClick={()=>void support(active.prospect_key)}>
            {mySupport===active.prospect_key?"YOU SUPPORT THIS TOWN":"SUPPORT THIS TOWN"}
          </button>
        </div>
        {notice&&<p className="c2-notice" role="status">{notice}</p>}
      </article>}
    </section>}

    {tab==="current"&&<section className="c2-panel">
      <p className="c2-eyebrow">CURRENT</p>
      <h2>What has actually changed.</h2>
      <div className="c2-current-list">
        {(data.current||[]).map((row,index)=><article key={String(row.current_key||index)}>
          <span>{String(row.standing||"registered")}</span>
          <p>{String(row.statement||"")}</p>
          <time>{typeof row.occurred_at==="string"?new Date(row.occurred_at).toLocaleString():""}</time>
        </article>)}
      </div>
    </section>}

    <footer className="c2-footer">
      <span>c2ME.env · Million Dollar Mission</span>
      <span>Support is not selection · Submission is not verification · Current is readback</span>
    </footer>
  </main>
}
