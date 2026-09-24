import {FormEvent,useEffect,useState} from "react"

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
type ConnectionEntry={
  entry_key:string
  entry_type:string
  title?:string|null
  body:string
  related_type?:string|null
  related_key?:string|null
  related_route?:string|null
  standing:string
  created_at:string
}
type ConnectionsPayload={
  authenticated:boolean
  standing:string
  entries?:ConnectionEntry[]
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
  const [connections,setConnections]=useState<ConnectionEntry[]>([])
  const [connectionType,setConnectionType]=useState("note")
  const [connectionBody,setConnectionBody]=useState("")
  const [connectionNotice,setConnectionNotice]=useState("")
  const [connectionBusy,setConnectionBusy]=useState(false)

  useEffect(()=>{
    let active=true
    async function hydrateSecondary(){
      const [initiativeResult,connectionsResult]=await Promise.allSettled([
        fetch("/api/my-environment-initiatives",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-connections",{headers:{accept:"application/json"}})
      ])
      if(!active)return
      if(initiativeResult.status==="fulfilled"&&initiativeResult.value.ok){
        const initiativeBody=await initiativeResult.value.json() as InitiativePayload
        if(active&&initiativeBody.initiatives) setInitiatives(initiativeBody.initiatives)
      }
      if(connectionsResult.status==="fulfilled"&&connectionsResult.value.ok){
        const connectionsBody=await connectionsResult.value.json() as ConnectionsPayload
        if(active&&connectionsBody.entries) setConnections(connectionsBody.entries)
      }
    }
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
          setMessage(
            response.status===401&&body.standing==="environment_claim_required"
              ?"This browser has not carried its existing c3Field session onto the canonical My Environment host yet."
              :"Your environment is not available from this browser yet."
          )
          setState("held")
          return
        }
        setData(body)
        document.title=body.owner?.display_name?`${body.owner.display_name} | My Environment | c3 Community Partners`:"My Environment | c3 Community Partners"
        setState(claim?"intro":"ready")
        void hydrateSecondary()
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

  async function addConnectionEntry(event:FormEvent){
    event.preventDefault()
    if(!connectionBody.trim()) return
    setConnectionBusy(true);setConnectionNotice("")
    try{
      const response=await fetch("/api/my-environment-connections",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({entry_type:connectionType,body:connectionBody.trim()})
      })
      const body=await response.json() as {ok?:boolean;standing?:string;entry?:ConnectionEntry;reason?:string}
      if(!response.ok||!body.ok||!body.entry) throw new Error(body.reason||body.standing||"The connection entry could not be recorded.")
      setConnections(current=>[body.entry!,...current])
      setConnectionBody("")
      setConnectionNotice("Added to your Connections thread.")
    }catch(error){
      setConnectionNotice(error instanceof Error?error.message:"The connection entry could not be recorded.")
    }finally{setConnectionBusy(false)}
  }

  if(state==="held"||state==="claiming"||state==="loading"||!data?.environment||!data.envpac){
    return <main className="myenv-shell myenv-held"><section><p className="myenv-kicker">c3 Community Partners</p><h1>My Environment</h1><p>{message}</p>{state==="held"&&<a href="https://c3field.online/api/my-environment-session-handoff">Continue existing My Environment</a>}</section></main>
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
      <section className="myenv-connections-thread" aria-label="Connections thread">
        <div className="myenv-thread-heading">
          <p className="myenv-kicker">CONNECTIONS THREAD</p>
          <h2>Connections</h2>
          <p>Keep introductions, opportunities, follow-ups, and connection notes with your environment.</p>
        </div>
        <div className="myenv-thread-entries">
          {connections.length===0&&<p className="myenv-relations-empty">Your connections thread is ready.</p>}
          {connections.slice(0,8).map(entry=><article key={entry.entry_key}>
            <div>
              <span>{entry.entry_type.replace(/_/g," ")}</span>
              <time>{new Date(entry.created_at).toLocaleString()}</time>
            </div>
            {entry.title&&<h3>{entry.title}</h3>}
            <p>{entry.body}</p>
            {entry.related_route&&<a href={entry.related_route}>OPEN CONNECTION →</a>}
          </article>)}
        </div>
        <form className="myenv-thread-compose" onSubmit={addConnectionEntry}>
          <select aria-label="Connection entry type" value={connectionType} onChange={e=>setConnectionType(e.target.value)}>
            <option value="note">Note</option>
            <option value="connection">Connection</option>
            <option value="introduction">Introduction</option>
            <option value="opportunity">Opportunity</option>
            <option value="follow_up">Follow-up</option>
          </select>
          <textarea aria-label="Connection note" rows={3} maxLength={5000} value={connectionBody} onChange={e=>setConnectionBody(e.target.value)} placeholder="Add something you want to keep connected to your environment." />
          <button type="submit" disabled={connectionBusy||!connectionBody.trim()}>ADD TO CONNECTIONS</button>
        </form>
        {connectionNotice&&<p className="myenv-initiative-notice" role="status">{connectionNotice}</p>}
      </section>
    </aside>
  </main>
}
