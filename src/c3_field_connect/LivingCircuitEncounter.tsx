import {useEffect,useMemo,useState} from "react"
import "./LivingCircuitEncounter.css"

type Mechanic={
  key:string
  label:string
  statement:string
  items?:string[]
}
type Motion={label:string;statement:string}
type Encounter={
  encounter_key:string
  route:string
  canonical_url:string
  title:string
  kicker:string
  hero:string
  opening:string[]
  mechanics:Mechanic[]
  motion:Motion[]
  agency:string[]
  environment_can_say:string[]
  closing:string[]
  interaction:{
    mode:string
    progression:string
    writes_state:boolean
    creates_standing:boolean
    completion_effect:string
    cta_label:string
    cta_route:string
  }
  seo?:Record<string,string>
  frontend_rule:string
  standing_created:boolean
}
type RootPresentation={
  standing:string
  manifest:{
    composition:{
      public_encounters?:{
        living_circuit?:Encounter
      }
    }
  }
  runtimeMedia?:{
    backdrop?:{runtime_uri?:string}
  }
  publicIdentity?:Record<string,string>
}

const CAR_POSITIONS=[
  "lc-car--1","lc-car--2","lc-car--3","lc-car--6",
  "lc-car--9","lc-car--8","lc-car--7","lc-car--4"
]

export default function LivingCircuitEncounter(){
  const [state,setState]=useState<RootPresentation|null>(null)
  const [held,setHeld]=useState(false)
  const [step,setStep]=useState(0)
  const [entered,setEntered]=useState(false)

  useEffect(()=>{
    let active=true
    fetch("/api/c3-root-presentation",{headers:{accept:"application/json"},cache:"no-store"})
      .then(async response=>{
        const body=await response.json().catch(()=>null) as RootPresentation|null
        if(!response.ok||body?.standing!=="bounded_public_runtime")throw new Error("root_unavailable")
        const encounter=body.manifest?.composition?.public_encounters?.living_circuit
        if(!encounter
          || encounter.route!=="/living-circuit"
          || encounter.canonical_url!=="https://c3field.online/living-circuit"
          || encounter.standing_created!==false
          || encounter.interaction?.creates_standing!==false
          || encounter.interaction?.writes_state!==false
          || encounter.interaction?.completion_effect!=="none"
          || !Array.isArray(encounter.mechanics)
          || encounter.mechanics.length<1
        )throw new Error("encounter_authority_held")
        if(active)setState(body)
      })
      .catch(()=>{if(active)setHeld(true)})
    return()=>{active=false}
  },[])

  const encounter=state?.manifest.composition.public_encounters?.living_circuit
  const mechanics=encounter?.mechanics||[]
  const activeMechanic=mechanics[Math.min(step,Math.max(0,mechanics.length-1))]
  const carClass=CAR_POSITIONS[Math.min(step,CAR_POSITIONS.length-1)]||CAR_POSITIONS[0]
  const backdrop=state?.runtimeMedia?.backdrop?.runtime_uri||""
  const identity=state?.publicIdentity||{}

  const allTouchpoints=useMemo(
    ()=>mechanics.find(item=>item.key==="six")?.items||[],
    [mechanics]
  )

  if(held)return <main className="lc-shell lc-held"><p>The Living Circuit encounter is temporarily held because its registered presentation authority could not be resolved.</p><a href="/">Return to c3 Field</a></main>
  if(!encounter)return <main className="lc-shell lc-held"><p>Resolving the Living Circuit…</p></main>

  if(!entered){
    return <main className="lc-shell lc-opening" data-standing-created="false">
      {backdrop&&<img className="lc-backdrop" src={backdrop} alt="" aria-hidden="true"/>}
      <div className="lc-wash" aria-hidden="true"/>
      <header className="lc-topbar"><a href="/">c3 Field</a><span>{encounter.kicker}</span></header>
      <section className="lc-opening-copy">
        <p className="lc-eyebrow">CONNECT · CONTRIBUTE · CREATE</p>
        <h1>{encounter.hero}</h1>
        {encounter.opening.map(line=><p key={line}>{line}</p>)}
        <button type="button" className="lc-enter" onClick={()=>setEntered(true)}>ENTER THE CIRCUIT <span aria-hidden="true">→</span></button>
        <small>No standing is created here. This is a public orientation encounter.</small>
      </section>
    </main>
  }

  return <main className="lc-shell" data-standing-created="false" data-encounter-key={encounter.encounter_key}>
    {backdrop&&<img className="lc-backdrop" src={backdrop} alt="" aria-hidden="true"/>}
    <div className="lc-wash" aria-hidden="true"/>
    <header className="lc-topbar">
      <a href="/">c3 Field</a>
      <span>{encounter.title}</span>
      <span>{step+1} / {mechanics.length}</span>
    </header>

    <section className="lc-field" aria-labelledby="lc-stage-title">
      <div className="lc-field-visual" aria-hidden="true">
        <div className="lc-grid">
          {Array.from({length:9},(_,index)=><span key={index}/>)}
          <div className={"lc-car "+carClass}>CAR / 322</div>
        </div>
        <div className="lc-grid-caption">3×3 FIELD</div>
      </div>

      <div className="lc-stage">
        <p className="lc-eyebrow">{activeMechanic?.label}</p>
        <h1 id="lc-stage-title">{activeMechanic?.statement}</h1>

        {activeMechanic?.key==="six"&&<div className="lc-six" aria-label="The six relational conditions">
          {allTouchpoints.map(item=><span key={item}>{item}</span>)}
        </div>}

        <nav className="lc-stage-nav" aria-label="Living Circuit stages">
          {mechanics.map((mechanic,index)=><button
            key={mechanic.key}
            type="button"
            className={index===step?"is-active":""}
            aria-current={index===step?"step":undefined}
            onClick={()=>setStep(index)}
          ><span>{String(index+1).padStart(2,"0")}</span>{mechanic.label}</button>)}
        </nav>

        <div className="lc-controls">
          <button type="button" onClick={()=>setStep(value=>Math.max(0,value-1))} disabled={step===0}>← BACK</button>
          {step<mechanics.length-1
            ?<button type="button" onClick={()=>setStep(value=>Math.min(mechanics.length-1,value+1))}>NEXT →</button>
            :<a href="#motion">SEE THE MOTION ↓</a>}
        </div>
      </div>
    </section>

    <section id="motion" className="lc-motion">
      <p className="lc-eyebrow">THE MOTION OF THE CIRCUIT</p>
      <div className="lc-motion-grid">
        {encounter.motion.map(item=><article key={item.label}><strong>{item.label}</strong><p>{item.statement}</p></article>)}
      </div>
    </section>

    <section className="lc-agency">
      {encounter.agency.map((line,index)=>index===0?<h2 key={line}>{line}</h2>:<p key={line}>{line}</p>)}
    </section>

    <section className="lc-environment">
      <p className="lc-eyebrow">THE ENVIRONMENT CAN SAY</p>
      <div>{encounter.environment_can_say.map(line=><p key={line}>{line}</p>)}</div>
    </section>

    <section className="lc-close">
      {encounter.closing.map((line,index)=>index===0?<h2 key={line}>{line}</h2>:<p key={line}>{line}</p>)}
      <a className="lc-connect" href={encounter.interaction.cta_route}>{encounter.interaction.cta_label} <span aria-hidden="true">→</span></a>
      <small>The encounter ends without creating standing. Connect is a separate governed passage.</small>
    </section>

    <footer className="lc-footer">
      <div><strong>c3 Community Partners</strong><span>{identity.environment_definition}</span><span>{identity.formal_authority_statement}</span></div>
      <nav aria-label="Footer">
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a>
      </nav>
      <span>{identity.copyright}</span>
    </footer>
  </main>
}
