import {useEffect,useState} from "react"
import "./myEnvironmentEncounter.css"

type EnvPayload={
  authenticated:boolean
  standing:string
  owner?:{display_name:string|null}
  environment?:{env_key:string;environment_name:string;environment_class:string;standing:string;is_active:boolean;is_canonical:boolean}
  envpac?:{envpac_key:string;version:string;standing:string;owner_subject_type:string;custodian_subject_type:string;custodian_subject_key:string;custody_provider:string;portable:boolean;environment_bindings:unknown;rooted_systems:unknown;packages:unknown}
  presentation?:{opening_visual_asset_key:string;opening_visual_url:string;source_webpac_key:string;owner_changeable:boolean;selection_standing:string;selected_at?:string;updated_at?:string}|null
}
type Initiative={
  initiative_key:string
  title:string
  summary:string
  target_environment_key:string
  route:string
  relation_required:boolean
  connected:boolean
  participation?:Record<string,unknown>|null
}
type InitiativePayload={
  authenticated:boolean
  standing:string
  initiatives?:Initiative[]
  reason?:string
}

const ARRIVAL_VIDEO="/api/free-media?asset=c3_field_c1me_arrival_video_v1"
const LIVE_BACKDROP="/api/free-media?asset=c3_field_c1me_live_backdrop_v1"

export default function MyEnvironmentEncounter(){
  const [state,setState]=useState<"claiming"|"loading"|"intro"|"ready"|"held">("loading")
  const [data,setData]=useState<EnvPayload|null>(null)
  const [message,setMessage]=useState("Opening your environment…")
  const [initiatives,setInitiatives]=useState<Initiative[]>([])
  const [initiativeNotice,setInitiativeNotice]=useState("")
  const [initiativeBusy,setInitiativeBusy]=useState(false)

  useEffect(()=>{
    let active=true
    async function run(){
      try{
        const params=new URLSearchParams(location.hash.slice(1))
        const claim=params.get("claim")
        if(claim){
          setState("claiming")
          const claimResponse=await fetch("/api/my-environment-claim",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({claim})})
          if(!claimResponse.ok) throw new Error("claim")
          history.replaceState(null,"",location.pathname)
        }
        setState("loading")
        const response=await fetch("/api/my-environment",{headers:{accept:"application/json"}})
        const body=await response.json() as EnvPayload
        if(!active)return
        if(!response.ok||body.standing!=="environment_ready"||!body.environment||!body.envpac){
          setMessage("Your environment is not available from this browser yet.")
          setState("held")
          return
        }
        setData(body)
        const initiativeResponse=await fetch("/api/my-environment-initiatives",{headers:{accept:"application/json"}})
        if(initiativeResponse.ok){
          const initiativeBody=await initiativeResponse.json() as InitiativePayload
          if(active&&initiativeBody.initiatives) setInitiatives(initiativeBody.initiatives)
        }
        document.title=body.owner?.display_name?`${body.owner.display_name} | My Environment | c3 Community Partners`:"My Environment | c3 Community Partners"
        setState(claim?"intro":"ready")
      }catch{
        if(active){setMessage("Your environment link is unavailable or has expired.");setState("held")}
      }
    }
    document.title="My Environment | c3 Community Partners"
    void run()
    return()=>{active=false}
  },[])

  async function connectInitiative(initiative:Initiative){
    setInitiativeBusy(true);setInitiativeNotice("")
    try{
      const response=await fetch("/api/my-environment-initiatives",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"connect",initiative_key:initiative.initiative_key})
      })
      const body=await response.json() as {ok?:boolean;standing?:string;next_url?:string;reason?:string}
      if(!response.ok||!body.ok) throw new Error(body.reason||body.standing||"The connection could not be formed.")
      setInitiatives(current=>current.map(item=>item.initiative_key===initiative.initiative_key?{...item,connected:true}:item))
      setInitiativeNotice("Connected. Opening the Mission…")
      if(body.next_url) window.location.assign(body.next_url)
    }catch(error){
      setInitiativeNotice(error instanceof Error?error.message:"The connection could not be formed.")
    }finally{setInitiativeBusy(false)}
  }

  if(state==="held"||state==="claiming"||state==="loading"||!data?.environment||!data.envpac){
    return <main className="myenv-shell myenv-held"><section><p className="myenv-kicker">c3 Community Partners</p><h1>My Environment</h1><p>{message}</p>{state==="held"&&<a href="/">Return to Connect</a>}</section></main>
  }

  if(state==="intro"){
    return <main className="myenv-shell myenv-arrival" aria-label="Entering your environment">
      <video
        className="myenv-arrival-video"
        src={ARRIVAL_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={()=>setState("ready")}
        onError={()=>setState("ready")}
      />
      <button className="myenv-skip" type="button" onClick={()=>setState("ready")}>Enter environment</button>
    </main>
  }

  return <main className="myenv-shell myenv-environment" aria-label="My Environment">
    <img className="myenv-backdrop" src={LIVE_BACKDROP} alt="" aria-hidden="true"/>
    <div className="myenv-environment-wash" aria-hidden="true"/>
    <section className="myenv-place" aria-label="c1ME environment">
      <div className="myenv-presence">
        <p className="myenv-kicker">c1ME.env</p>
        <h1>{data.owner?.display_name?.trim()||"My Environment"}</h1>
      </div>
    </section>
    <aside className="myenv-relations" aria-label="Connected opportunities">
      <p className="myenv-kicker">CONNECTED POSSIBILITIES</p>
      <h2>Where do you want to go?</h2>
      {initiatives.length===0&&<p className="myenv-relations-empty">No initiative passages are available right now.</p>}
      {initiatives.map(initiative=><article key={initiative.initiative_key} className="myenv-initiative-card">
        <div>
          <span>{initiative.target_environment_key}</span>
          <h3>{initiative.title}</h3>
          <p>{initiative.summary}</p>
        </div>
        {initiative.connected
          ? <a href={initiative.route}>ENTER MISSION →</a>
          : <button type="button" disabled={initiativeBusy} onClick={()=>void connectInitiative(initiative)}>CONNECT TO MISSION →</button>}
      </article>)}
      {initiativeNotice&&<p className="myenv-initiative-notice" role="status">{initiativeNotice}</p>}
    </aside>
  </main>
}
