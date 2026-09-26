import {useEffect,useMemo,useState} from "react"
import EternalFlame from "../c3_field_connect/EternalFlame"
import "./c247PctEncounter.css"

type Row=Record<string,unknown>
type ComponentRow={component_key:string;renderer_key:string;sort_order:number;standing:string;config:Row}
type PropertyPoint={
  property_key:string;name:string;council_name:string;location_label:string;address:string
  summary?:string;qualification?:string;registry_standing?:string;transaction_class?:string
  transaction_state?:string;current_use_state?:string;current_as_of?:string;acreage?:number|null
  settlement_cash?:number|null;settlement_property?:number|null
  sources?:Array<{assertion_key?:string;type?:string;status?:string;statement?:string;source_name?:string;source_url?:string;source_date?:string}>
}
type MoneyAssertion={
  assertion_key:string;property_key:string;assertion_type:string;statement:string;source_name:string
  source_url:string;source_date?:string;observed_date?:string;attribution?:string;assertion_status?:string
}
type Payload={
  authenticated:boolean;standing:string;reason?:string
  participant?:{relationship_key:string;visibility_key:string;visibility_source:string}
  environment?:{env_key:string;envpac_key:string;label:string;access_role:string}
  evidence?:{pac_key:string;standing:string;corpus_state:string;quantifier_gate:string}
  components?:ComponentRow[]
  ground?:{resolution:string;map_points:PropertyPoint[];universe_sources:Row[]}
  money?:{assertions:MoneyAssertion[];rule:string}
  current?:Row[]
  ledger?:{standing:string;writable:boolean}
}
type Tab="ground"|"money"|"evidence"|"ledger"|"current"

function money(value:unknown){
  return typeof value==="number"&&Number.isFinite(value)
    ?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value)
    :""
}
function dedupeAssertions(rows:MoneyAssertion[]){
  const seen=new Set<string>()
  return rows.filter(row=>{
    const key=[row.assertion_type,row.statement,row.source_name,row.source_date].join("|")
    if(seen.has(key)) return false
    seen.add(key);return true
  })
}
function sourceLabel(source:Row){
  return String(source.source_name||source.source_key||"Registered source")
}

export default function C247PctEncounter(){
  const [data,setData]=useState<Payload|null>(null)
  const [tab,setTab]=useState<Tab>("ground")
  const [selected,setSelected]=useState<string|null>(null)

  useEffect(()=>{
    let cancelled=false
    void fetch("/api/c2-47pct",{credentials:"same-origin",headers:{accept:"application/json"}})
      .then(async response=>{
        const body=await response.json() as Payload
        if(!cancelled)setData(body)
      })
      .catch(()=>{if(!cancelled)setData({authenticated:false,standing:"47pct_c2_held",reason:"encounter_unavailable"})})
    return()=>{cancelled=true}
  },[])

  const tennessee=useMemo(
    ()=>data?.ground?.map_points.filter(point=>point.council_name==="Middle Tennessee Council"||/\bTN\b|Tennessee/i.test(point.address+" "+point.location_label))||[],
    [data]
  )
  const active=useMemo(
    ()=>tennessee.find(point=>point.property_key===selected)||tennessee[0]||null,
    [tennessee,selected]
  )
  const moneyAssertions=useMemo(()=>dedupeAssertions(data?.money?.assertions||[]),[data])

  if(!data) return <main className="pct47-c2 pct47-c2--held"><p className="pct47-c2-kicker">c2ME.env · 4.7%</p><h1>Resolving the encounter…</h1></main>
  if(!data.authenticated) return <main className="pct47-c2 pct47-c2--held">
    <p className="pct47-c2-kicker">c2ME.env · 4.7%</p>
    <h1>This encounter resolves through My Environment.</h1>
    <p>Your active 4.7% relation must be resolved before C2 opens.</p>
    <a href="/">RETURN TO MY ENVIRONMENT</a>
    <small>{data.standing}{data.reason?" · "+data.reason:""}</small>
  </main>

  return <main className="pct47-c2">
    <header className="pct47-c2-topbar">
      <div><p className="pct47-c2-kicker">c2ME.env · 4.7%</p><h1>Ground · Money · Evidence</h1></div>
      <a href="/">← MY ENVIRONMENT</a>
    </header>

    <section className="pct47-c2-status">
      <span>{data.evidence?.corpus_state||"OPEN_INCOMPLETE"}</span>
      <span>Evidence: {data.evidence?.pac_key}</span>
      <span>Access: {data.environment?.access_role}</span>
    </section>

    <nav className="pct47-c2-tabs" aria-label="4.7% encounter">
      {(["ground","money","evidence","ledger","current"] as Tab[]).map(value=>
        <button key={value} type="button" className={tab===value?"active":""} onClick={()=>setTab(value)}>{value.toUpperCase()}</button>
      )}
    </nav>

    {tab==="ground"&&<section className="pct47-c2-ground">
      <aside className="pct47-c2-maprail">
        <p className="pct47-c2-eyebrow">TENNESSEE GROUND</p>
        <h2>Registered Scouting ground</h2>
        <p>Property identity and disposition are shown from Evidence_PAC. A property pin never implies abuse occurred there.</p>
        <div className="pct47-c2-ground-list">
          {tennessee.map(point=><button key={point.property_key} className={active?.property_key===point.property_key?"selected":""} onClick={()=>setSelected(point.property_key)}>
            <strong>{point.name}</strong>
            <span>{point.location_label}</span>
            <small>{point.registry_standing}</small>
          </button>)}
        </div>
      </aside>
      <article className="pct47-c2-dossier">
        {!active?<p>No Tennessee property currently resolves for this layer.</p>:<>
          <p className="pct47-c2-eyebrow">GROUND RECORD</p>
          <h2>{active.name}</h2>
          <p className="pct47-c2-address">{active.address}</p>
          <p>{active.summary}</p>
          <div className="pct47-c2-facts">
            {active.acreage!=null&&<span><b>{active.acreage.toLocaleString()}</b> acres</span>}
            {active.transaction_state&&<span><b>{active.transaction_state.replace(/_/g," ")}</b> transaction state</span>}
            {active.current_use_state&&<span><b>{active.current_use_state.replace(/_/g," ")}</b> current use</span>}
          </div>
          {active.qualification&&<div className="pct47-c2-hold"><strong>Qualification</strong><p>{active.qualification}</p></div>}
          <section className="pct47-c2-sources">
            <h3>Sources</h3>
            {(active.sources||[]).map(source=><article key={source.assertion_key||source.statement}>
              <span>{source.status||"registered"}</span>
              <p>{source.statement}</p>
              <footer>
                {source.source_url?<a href={source.source_url} target="_blank" rel="noreferrer">{source.source_name||"SOURCE"} ↗</a>:<b>{source.source_name||"SOURCE"}</b>}
                {source.source_date&&<time>{source.source_date}</time>}
              </footer>
            </article>)}
          </section>
        </>}
      </article>
    </section>}

    {tab==="money"&&<section className="pct47-c2-panel">
      <p className="pct47-c2-eyebrow">MONEY / CURRENT</p>
      <h2>Follow the documented flow, not an inferred total.</h2>
      <p>{data.money?.rule}</p>
      <div className="pct47-c2-money-grid">
        {moneyAssertions.map(item=><article key={item.assertion_key}>
          <span>{item.assertion_type.replace(/_/g," ")}</span>
          <p>{item.statement}</p>
          <footer>
            {item.source_url?<a href={item.source_url} target="_blank" rel="noreferrer">{item.source_name} ↗</a>:<b>{item.source_name}</b>}
            {item.source_date&&<time>{item.source_date}</time>}
          </footer>
        </article>)}
        {moneyAssertions.length===0&&<p>No source-qualified money assertions are currently projected.</p>}
      </div>
      <div className="pct47-c2-axis">
        <span>RECOGNIZED HARM</span><span>ALLOWED CLAIM VALUE</span><span>ACTUAL DISTRIBUTION</span>
        <span>TRUST / BANKRUPTCY FLOW</span><span>INSTITUTIONAL ASSETS</span><span>SETTLEMENT CONTRIBUTION</span>
      </div>
    </section>}

    {tab==="evidence"&&<section className="pct47-c2-panel">
      <p className="pct47-c2-eyebrow">EVIDENCE_PAC</p>
      <h2>Sourced and citeable evidence.</h2>
      <div className="pct47-c2-evidence-status">
        <article><span>Corpus</span><strong>{data.evidence?.corpus_state}</strong></article>
        <article><span>Standing</span><strong>{data.evidence?.standing}</strong></article>
        <article><span>Quantifiers</span><strong>SOURCE + CITATION REQUIRED</strong></article>
      </div>
      <h3>Universe sources</h3>
      <div className="pct47-c2-money-grid">
        {(data.ground?.universe_sources||[]).map((source,index)=><article key={String(source.source_key||index)}>
          <span>{String(source.authority_class||"source").replace(/_/g," ")}</span>
          <p><strong>{sourceLabel(source)}</strong></p>
          <p>{String(source.scope_description||"")}</p>
          {source.source_date&&<time>{String(source.source_date)}</time>}
        </article>)}
      </div>
      <p className="pct47-c2-rule">The corpus is open and incomplete. Allegation is not finding. Historical is not current. Survivor testimony owns occurrence.</p>
    </section>}

    {tab==="ledger"&&<section className="pct47-c2-panel pct47-c2-held-panel">
      <p className="pct47-c2-eyebrow">C2 LEDGER</p>
      <h2>Held at the seam.</h2>
      <p>The Ledger belongs in c2ME.env. Its generic carrier is not yet formed, so writes remain disabled rather than being routed through the MDM ledger.</p>
      <span>Standing: {data.ledger?.standing||"held"}</span>
    </section>}

    {tab==="current"&&<section className="pct47-c2-panel">
      <p className="pct47-c2-eyebrow">CURRENT</p>
      <h2>What the C2 environment presently resolves.</h2>
      <div className="pct47-c2-current">
        {(data.current||[]).map((row,index)=><article key={String(row.current_state_key||index)}>
          <span>{String(row.resolution_standing||"resolved")}</span>
          <h3>{String(row.current_state_key||"CURRENT")}</h3>
          <p>{String(row.standing||"")}</p>
          {row.effective_at&&<time>{new Date(String(row.effective_at)).toLocaleString()}</time>}
        </article>)}
      </div>
    </section>}

    <aside className="pct47-c2-flame" aria-label="Eternal Flame memorial"><EternalFlame compact /></aside>
    <footer className="pct47-c2-footer">
      <span>4.7% · c2ME.env</span>
      <span>Evidence_PAC is factual authority · CURRENT is present-state authority</span>
    </footer>
  </main>
}
