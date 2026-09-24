import {FormEvent,useEffect,useState} from "react"

type EnvPayload={
  authenticated:boolean
  standing:string
  owner?:{display_name:string|null}
  environment?:{env_key:string;environment_name:string;environment_class:string;standing:string;is_active:boolean;is_canonical:boolean}
  envpac?:{envpac_key:string;version:string;standing:string;owner_subject_type:string;custodian_subject_type:string;custodian_subject_key:string;custody_provider:string;portable:boolean;environment_bindings:unknown;rooted_systems:unknown;packages:unknown}
  presentation?:{opening_visual_asset_key:string;opening_visual_url:string;source_webpac_key:string;owner_changeable:boolean;selection_standing:string;selected_at?:string;updated_at?:string}|null
}
type Primitive={
  primitive_key:string
  primitive_class:string
  display_label:string
  renderer_key:string
  runtime_endpoint?:string|null
  sort_order:number
  config?:Record<string,unknown>
}
type PrimitivePayload={authenticated:boolean;standing:string;primitives?:Primitive[]}
type InitiativeComponent={component_key:string;renderer_key:string;sort_order:number;config?:Record<string,unknown>}
type Initiative={initiative_key:string;initiative_envpac_key:string;target_environment_key?:string|null;visibility_source:string;components:InitiativeComponent[]}
type InitiativePayload={authenticated:boolean;standing:string;initiatives?:Initiative[]}
type LedgerEntry={entry_key:string;entry_type:string;title?:string|null;body:string;related_route?:string|null;standing:string;created_at:string}
type ConnectionMessage={message_key:string;sender_relationship_key:string;message_type:string;body:string;created_at:string}
type NativeConnection={
  connection_key:string
  source_relationship_key:string
  target_relationship_key:string
  standing:string
  formed_at:string
  other:{relationship_key:string;display_name:string|null}
  messages:ConnectionMessage[]
}
type ConnectionsPayload={authenticated:boolean;standing:string;entries?:LedgerEntry[];native_connections?:NativeConnection[]}
type CanopyReference={reference_key:string;surface_label:string;display_label?:string|null;external_url:string;handle?:string|null;sort_order:number}
type CanopyPayload={standing:string;references?:CanopyReference[]}
type ProfileTruth={standing?:string;profile?:{display_label:string;visibility_scope:string;profile_key:string}|null}
type ProfilePayload={authenticated:boolean;standing:string;truth?:ProfileTruth}

const ARRIVAL_VIDEO="/api/free-media?asset=c3_field_c1me_arrival_video_v1"
const LIVE_BACKDROP="/api/free-media?asset=c3_field_c1me_live_backdrop_v1"

function text(value:unknown,fallback=""){return typeof value==="string"?value:fallback}

export default function MyEnvironmentEncounter(){
  const [state,setState]=useState<"claiming"|"loading"|"intro"|"ready"|"held">("loading")
  const [data,setData]=useState<EnvPayload|null>(null)
  const [message,setMessage]=useState("Opening your environment…")
  const [primitives,setPrimitives]=useState<Primitive[]>([])
  const [initiatives,setInitiatives]=useState<Initiative[]>([])
  const [ledgerEntries,setLedgerEntries]=useState<LedgerEntry[]>([])
  const [nativeConnections,setNativeConnections]=useState<NativeConnection[]>([])
  const [canopy,setCanopy]=useState<CanopyReference[]>([])
  const [profileTruth,setProfileTruth]=useState<ProfileTruth|null>(null)

  const [ledgerType,setLedgerType]=useState("note")
  const [ledgerBody,setLedgerBody]=useState("")
  const [ledgerNotice,setLedgerNotice]=useState("")
  const [ledgerBusy,setLedgerBusy]=useState(false)

  const [selectedConnection,setSelectedConnection]=useState("")
  const [connectionMessageType,setConnectionMessageType]=useState("note")
  const [connectionMessage,setConnectionMessage]=useState("")
  const [connectionNotice,setConnectionNotice]=useState("")
  const [connectionBusy,setConnectionBusy]=useState(false)

  const [canopySurface,setCanopySurface]=useState("")
  const [canopyLabel,setCanopyLabel]=useState("")
  const [canopyUrl,setCanopyUrl]=useState("")
  const [canopyHandle,setCanopyHandle]=useState("")
  const [canopyNotice,setCanopyNotice]=useState("")

  const [profileDisplayLabel,setProfileDisplayLabel]=useState("")
  const [profileVisibility,setProfileVisibility]=useState("private")
  const [profileNotice,setProfileNotice]=useState("")

  const [inviteMessage,setInviteMessage]=useState("")
  const [inviteInitiative,setInviteInitiative]=useState("")
  const [inviteNotice,setInviteNotice]=useState("")
  const [inviteUrl,setInviteUrl]=useState("")

  useEffect(()=>{
    let active=true
    async function hydrateSecondary(){
      const results=await Promise.allSettled([
        fetch("/api/my-environment-primitives",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-initiatives",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-connections",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-canopy",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-profile",{headers:{accept:"application/json"}})
      ])
      if(!active)return
      const [primitiveResult,initiativeResult,connectionsResult,canopyResult,profileResult]=results
      if(primitiveResult.status==="fulfilled"&&primitiveResult.value.ok){
        const body=await primitiveResult.value.json() as PrimitivePayload
        if(active&&body.primitives) setPrimitives([...body.primitives].sort((a,b)=>a.sort_order-b.sort_order))
      }
      if(initiativeResult.status==="fulfilled"&&initiativeResult.value.ok){
        const body=await initiativeResult.value.json() as InitiativePayload
        if(active&&body.initiatives) setInitiatives(body.initiatives)
      }
      if(connectionsResult.status==="fulfilled"&&connectionsResult.value.ok){
        const body=await connectionsResult.value.json() as ConnectionsPayload
        if(active){
          setLedgerEntries(body.entries||[])
          setNativeConnections(body.native_connections||[])
          setSelectedConnection(current=>current||(body.native_connections?.[0]?.connection_key||""))
        }
      }
      if(canopyResult.status==="fulfilled"&&canopyResult.value.ok){
        const body=await canopyResult.value.json() as CanopyPayload
        if(active&&body.references) setCanopy(body.references)
      }
      if(profileResult.status==="fulfilled"&&profileResult.value.ok){
        const body=await profileResult.value.json() as ProfilePayload
        if(active&&body.truth) setProfileTruth(body.truth)
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
          setMessage(response.status===401&&body.standing==="environment_claim_required"
            ?"This browser has not carried its existing c3Field session onto the canonical My Environment host yet."
            :"Your environment is not available from this browser yet.")
          setState("held")
          return
        }
        setData(body)
        setProfileDisplayLabel(body.owner?.display_name?.trim()||"")
        document.title=body.owner?.display_name?body.owner.display_name+" | My Environment | c3 Community Partners":"My Environment | c3 Community Partners"
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

  async function addLedgerEntry(event:FormEvent){
    event.preventDefault()
    if(!ledgerBody.trim())return
    setLedgerBusy(true);setLedgerNotice("")
    try{
      const response=await fetch("/api/my-environment-connections",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({entry_type:ledgerType,body:ledgerBody.trim()})
      })
      const body=await response.json() as {ok?:boolean;entry?:LedgerEntry;standing?:string;reason?:string}
      if(!response.ok||!body.ok||!body.entry)throw new Error(body.reason||body.standing||"The ledger entry could not be recorded.")
      setLedgerEntries(current=>[body.entry!,...current]);setLedgerBody("");setLedgerNotice("Added to your Ledger.")
    }catch(error){setLedgerNotice(error instanceof Error?error.message:"The ledger entry could not be recorded.")}
    finally{setLedgerBusy(false)}
  }

  async function sendNativeMessage(event:FormEvent){
    event.preventDefault()
    if(!selectedConnection||!connectionMessage.trim())return
    setConnectionBusy(true);setConnectionNotice("")
    try{
      const response=await fetch("/api/my-environment-connections",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"send_message",connection_key:selectedConnection,message_type:connectionMessageType,body:connectionMessage.trim()})
      })
      const body=await response.json() as {ok?:boolean;message?:ConnectionMessage;standing?:string;reason?:string}
      if(!response.ok||!body.ok||!body.message)throw new Error(body.reason||body.standing||"The message could not be sent.")
      setNativeConnections(current=>current.map(connection=>connection.connection_key===selectedConnection
        ?{...connection,messages:[...connection.messages,body.message!]}:connection))
      setConnectionMessage("");setConnectionNotice("Message added to the shared connection ledger.")
    }catch(error){setConnectionNotice(error instanceof Error?error.message:"The message could not be sent.")}
    finally{setConnectionBusy(false)}
  }

  async function addCanopyReference(event:FormEvent){
    event.preventDefault();setCanopyNotice("")
    try{
      const response=await fetch("/api/my-environment-canopy",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"add",surface_label:canopySurface,display_label:canopyLabel||null,external_url:canopyUrl,handle:canopyHandle||null,sort_order:canopy.length})
      })
      const body=await response.json() as {standing?:string;reference?:CanopyReference;message?:string}
      if(!response.ok||!body.reference)throw new Error(body.message||body.standing||"The Canopy reference could not be added.")
      setCanopy(current=>[...current,body.reference!]);setCanopySurface("");setCanopyLabel("");setCanopyUrl("");setCanopyHandle("");setCanopyNotice("Added to My Canopy.")
    }catch(error){setCanopyNotice(error instanceof Error?error.message:"The Canopy reference could not be added.")}
  }

  async function removeCanopyReference(referenceKey:string){
    setCanopyNotice("")
    try{
      const response=await fetch("/api/my-environment-canopy",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"remove",reference_key:referenceKey})})
      if(!response.ok)throw new Error("The Canopy reference could not be removed.")
      setCanopy(current=>current.filter(reference=>reference.reference_key!==referenceKey))
    }catch(error){setCanopyNotice(error instanceof Error?error.message:"The Canopy reference could not be removed.")}
  }

  async function formProfile(event:FormEvent){
    event.preventDefault();setProfileNotice("")
    try{
      const response=await fetch("/api/my-environment-profile",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({display_label:profileDisplayLabel,visibility_scope:profileVisibility})
      })
      const body=await response.json() as {ok?:boolean;result?:{truth?:ProfileTruth};standing?:string;reason?:string}
      if(!response.ok||!body.ok)throw new Error(body.reason||body.standing||"Profile-PAC could not be formed.")
      const truth=body.result?.truth
      if(truth)setProfileTruth(truth)
      setProfileNotice("Profile-PAC is complete.")
    }catch(error){setProfileNotice(error instanceof Error?error.message:"Profile-PAC could not be formed.")}
  }

  async function prepareInvite(event:FormEvent){
    event.preventDefault();setInviteNotice("");setInviteUrl("")
    try{
      const response=await fetch("/api/my-environment-invite",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({message:inviteMessage,...(inviteInitiative?{source_initiative_key:inviteInitiative}:{})})
      })
      const body=await response.json() as {ok?:boolean;public_url?:string;standing?:string;reason?:string}
      if(!response.ok||!body.ok||!body.public_url)throw new Error(body.reason||body.standing||"The invitation could not be prepared.")
      setInviteUrl(body.public_url);setInviteNotice("Personalized invitation ready.")
    }catch(error){setInviteNotice(error instanceof Error?error.message:"The invitation could not be prepared.")}
  }

  function renderPrimitive(primitive:Primitive){
    if(primitive.renderer_key==="c1me.personalize"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">ENVIRONMENT</p><h2>{primitive.display_label}</h2>
          <p>Your presentation resolves from this EnvPAC. Avatar is optional, not required.</p>
          {data?.presentation?.opening_visual_asset_key&&<p>Current visual: {data.presentation.opening_visual_asset_key}</p>}
        </div>
      </section>
    }
    if(primitive.renderer_key==="c1me.profile_pac"){
      const profile=profileTruth?.profile
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">PROFILE-PAC</p><h2>{primitive.display_label}</h2>
          <p>Complete the bounded profile only when you want a profile to become encounterable beyond this private environment.</p></div>
        {profile
          ?<article className="myenv-initiative-card"><div><span>{profile.visibility_scope}</span><h3>{profile.display_label}</h3><p>Profile-PAC ready.</p></div></article>
          :<form className="myenv-thread-compose" onSubmit={formProfile}>
            <input aria-label="Profile display label" maxLength={160} value={profileDisplayLabel} onChange={e=>setProfileDisplayLabel(e.target.value)} placeholder="Display label"/>
            <select aria-label="Profile visibility" value={profileVisibility} onChange={e=>setProfileVisibility(e.target.value)}>
              <option value="private">Private</option><option value="environment">This environment</option><option value="relational">Relational</option><option value="public">Public</option>
            </select>
            <button type="submit" disabled={!profileDisplayLabel.trim()}>COMPLETE PROFILE-PAC</button>
          </form>}
        {profileNotice&&<p className="myenv-initiative-notice" role="status">{profileNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.ledger"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">LEDGER</p><h2>{primitive.display_label}</h2><p>Keep private notes, introductions, opportunities, and follow-ups with your environment.</p></div>
        <div className="myenv-thread-entries">
          {ledgerEntries.length===0&&<p className="myenv-relations-empty">Your Ledger is ready.</p>}
          {ledgerEntries.slice(0,8).map(entry=><article key={entry.entry_key}><div><span>{entry.entry_type.replace(/_/g," ")}</span><time>{new Date(entry.created_at).toLocaleString()}</time></div>{entry.title&&<h3>{entry.title}</h3>}<p>{entry.body}</p></article>)}
        </div>
        <form className="myenv-thread-compose" onSubmit={addLedgerEntry}>
          <select aria-label="Ledger entry type" value={ledgerType} onChange={e=>setLedgerType(e.target.value)}>
            <option value="note">Note</option><option value="introduction">Introduction</option><option value="opportunity">Opportunity</option><option value="follow_up">Follow-up</option>
          </select>
          <textarea aria-label="Ledger note" rows={3} maxLength={5000} value={ledgerBody} onChange={e=>setLedgerBody(e.target.value)} placeholder="Add something you want to keep with your environment."/>
          <button type="submit" disabled={ledgerBusy||!ledgerBody.trim()}>ADD TO LEDGER</button>
        </form>
        {ledgerNotice&&<p className="myenv-initiative-notice" role="status">{ledgerNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.canopy"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">MY CANOPY</p><h2>{primitive.display_label}</h2><p>Owner-selected external surfaces remain environment-held and create no Registry standing.</p></div>
        <div className="myenv-thread-entries">
          {canopy.length===0&&<p className="myenv-relations-empty">No Canopy references yet.</p>}
          {canopy.map(reference=><article key={reference.reference_key}><div><span>{reference.surface_label}</span></div><h3>{reference.display_label||reference.handle||reference.surface_label}</h3>{reference.handle&&<p>{reference.handle}</p>}<p><a href={reference.external_url} target="_blank" rel="noreferrer">OPEN SURFACE →</a></p><button type="button" onClick={()=>void removeCanopyReference(reference.reference_key)}>REMOVE</button></article>)}
        </div>
        <form className="myenv-thread-compose" onSubmit={addCanopyReference}>
          <input aria-label="Surface" maxLength={80} value={canopySurface} onChange={e=>setCanopySurface(e.target.value)} placeholder="Facebook, Instagram, LinkedIn…"/>
          <input aria-label="Display label" maxLength={120} value={canopyLabel} onChange={e=>setCanopyLabel(e.target.value)} placeholder="Display label"/>
          <input aria-label="Handle" maxLength={160} value={canopyHandle} onChange={e=>setCanopyHandle(e.target.value)} placeholder="@handle (optional)"/>
          <input aria-label="URL" maxLength={2048} value={canopyUrl} onChange={e=>setCanopyUrl(e.target.value)} placeholder="https://…"/>
          <button type="submit" disabled={!canopySurface.trim()||!canopyUrl.trim()}>ADD TO CANOPY</button>
        </form>
        {canopyNotice&&<p className="myenv-initiative-notice" role="status">{canopyNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.native_connections"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">C3-NATIVE</p><h2>{primitive.display_label}</h2><p>Accepted c3 connections appear in both environments. Messages here are shared across the connection.</p></div>
        <div className="myenv-thread-entries">
          {nativeConnections.length===0&&<p className="myenv-relations-empty">No c3-native connections yet.</p>}
          {nativeConnections.map(connection=><article key={connection.connection_key}><div><span>connected</span><time>{new Date(connection.formed_at).toLocaleString()}</time></div><h3>{connection.other.display_name||"Connected environment"}</h3>{connection.messages.slice(-5).map(item=><p key={item.message_key}><strong>{item.sender_relationship_key===data?.envpac?.envpac_key?"You":""}</strong>{item.body}</p>)}</article>)}
        </div>
        {nativeConnections.length>0&&<form className="myenv-thread-compose" onSubmit={sendNativeMessage}>
          <select aria-label="Connected environment" value={selectedConnection} onChange={e=>setSelectedConnection(e.target.value)}>
            {nativeConnections.map(connection=><option key={connection.connection_key} value={connection.connection_key}>{connection.other.display_name||"Connected environment"}</option>)}
          </select>
          <select aria-label="Message type" value={connectionMessageType} onChange={e=>setConnectionMessageType(e.target.value)}>
            <option value="note">Note</option><option value="introduction">Introduction</option><option value="opportunity">Opportunity</option><option value="follow_up">Follow-up</option>
          </select>
          <textarea aria-label="Connection message" rows={3} maxLength={5000} value={connectionMessage} onChange={e=>setConnectionMessage(e.target.value)} placeholder="Leave a message on this connection ledger."/>
          <button type="submit" disabled={connectionBusy||!selectedConnection||!connectionMessage.trim()}>SEND TO CONNECTION</button>
        </form>}
        {connectionNotice&&<p className="myenv-initiative-notice" role="status">{connectionNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.invite_connection"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">RELATIONAL PASSAGE</p><h2>{primitive.display_label}</h2><p>Prepare a personalized invitation from this environment. The connection forms only when the recipient authenticates into their environment.</p></div>
        <form className="myenv-thread-compose" onSubmit={prepareInvite}>
          <textarea aria-label="Invitation message" rows={3} maxLength={1200} value={inviteMessage} onChange={e=>setInviteMessage(e.target.value)} placeholder="Add a personal invitation message."/>
          <select aria-label="Initiative context" value={inviteInitiative} onChange={e=>setInviteInitiative(e.target.value)}>
            <option value="">No initiative context</option>
            {initiatives.map(initiative=><option key={initiative.initiative_key} value={initiative.initiative_key}>{text(initiative.components?.[0]?.config?.title,initiative.initiative_key)}</option>)}
          </select>
          <button type="submit">PREPARE INVITE</button>
        </form>
        {inviteNotice&&<p className="myenv-initiative-notice" role="status">{inviteNotice}</p>}
        {inviteUrl&&<article className="myenv-initiative-card"><div><span>personalized invite</span><h3>Invitation ready</h3>{inviteMessage&&<p>{inviteMessage}</p>}<p><a href={inviteUrl}>OPEN INVITATION →</a></p></div></article>}
      </section>
    }
    return null
  }

  if(state==="held"||state==="claiming"||state==="loading"||!data?.environment||!data.envpac){
    return <main className="myenv-shell myenv-held"><section><p className="myenv-kicker">c3 Community Partners</p><h1>My Environment</h1><p>{message}</p>{state==="held"&&<a href="https://c3field.online/api/my-environment-session-handoff">Continue existing My Environment</a>}</section></main>
  }
  if(state==="intro"){
    return <main className="myenv-shell myenv-arrival" aria-label="Entering your environment"><video className="myenv-arrival-video" src={ARRIVAL_VIDEO} autoPlay muted playsInline preload="auto" onEnded={()=>setState("ready")} onError={()=>setState("ready")}/></main>
  }

  const backdrop=data.presentation?.opening_visual_url||LIVE_BACKDROP
  return <main className="myenv-shell myenv-environment" aria-label="My Environment">
    <img className="myenv-backdrop" src={backdrop} alt="" aria-hidden="true"/>
    <div className="myenv-environment-wash" aria-hidden="true"/>
    <section className="myenv-place" aria-label="c1ME environment"><div className="myenv-presence"><p className="myenv-kicker">c1ME.env</p><h1>{data.owner?.display_name?.trim()||"My Environment"}</h1></div></section>
    <aside className="myenv-relations" aria-label="My Environment components">
      {initiatives.length>0&&<section className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">ENCOUNTERED / INVITED</p><h2>Initiatives</h2><p>Only initiatives evidenced by an encounter or invitation relation appear here.</p></div>
        {initiatives.flatMap(initiative=>initiative.components.filter(component=>component.renderer_key==="initiative.entry_card").map(component=>{
          const config=component.config||{}
          return <article key={initiative.initiative_key+":"+component.component_key} className="myenv-initiative-card"><div><span>{text(config.target_environment_label,initiative.target_environment_key||"initiative")}</span><h3>{text(config.title,initiative.initiative_key)}</h3><p>{text(config.summary)}</p></div>{text(config.route)&&<a href={text(config.route)}>ENTER →</a>}</article>
        }))}
      </section>}
      {primitives.map(renderPrimitive)}
    </aside>
  </main>
}
