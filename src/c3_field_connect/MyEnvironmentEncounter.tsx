import {FormEvent,useEffect,useState} from "react"

type EnvPayload={
  authenticated:boolean
  standing:string
  owner?:{display_name:string|null}
  environment?:{env_key:string;environment_name:string;environment_class:string;standing:string;is_active:boolean;is_canonical:boolean}
  envpac?:{envpac_key:string;version:string;standing:string;owner_subject_type:string;custodian_subject_type:string;custodian_subject_key:string;custody_provider:string;portable:boolean;environment_bindings:unknown;rooted_systems:unknown;packages:unknown;profile_pac?:ProfileTruth|null}
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
type ProfileTruth={
  projection_standing?:string
  standing?:string
  pac_key?:string
  profile?:{display_label:string;visibility_scope:string;profile_key:string;profile_class?:string}|null
  evaluation?:{completeness_state?:string;resolution_state?:string}
}
type ProfileQuestion={
  key:string
  label:string
  input:"text"|"select"
  required?:boolean
  max_length?:number
  placeholder?:string
  default?:string
  options?:Array<{value:string;label:string}>
}
type ProfileContract={pac_type:string;contract_version:string;questions:ProfileQuestion[];authority_effect:string}
type ProfileIntakePayload={authenticated:boolean;standing:string;contract?:ProfileContract;resolved_profile_class?:string|null}

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
  const [profileContract,setProfileContract]=useState<ProfileContract|null>(null)

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
  const [profilePresentationAsset,setProfilePresentationAsset]=useState("")

  const [inviteMessage,setInviteMessage]=useState("")
  const [inviteInitiative,setInviteInitiative]=useState("")
  const [inviteNotice,setInviteNotice]=useState("")
  const [inviteUrl,setInviteUrl]=useState("")
  const [activePanel,setActivePanel]=useState<string|null>(null)
  const [runtimeNotice,setRuntimeNotice]=useState("")
  const [canopyLoaded,setCanopyLoaded]=useState(false)
  const [profileLoaded,setProfileLoaded]=useState(false)

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
        if(active&&body.primitives){
          setPrimitives([...body.primitives].sort((a,b)=>a.sort_order-b.sort_order))
          setRuntimeNotice("")
        }
      }else if(active){
        setRuntimeNotice("This environment opened, but its EnvPAC components did not resolve.")
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
        if(active){
          setCanopy(body.references||[])
          setCanopyLoaded(true)
        }
      }else if(active){
        setCanopyLoaded(false)
      }
      if(profileResult.status==="fulfilled"&&profileResult.value.ok){
        const body=await profileResult.value.json() as ProfileIntakePayload
        if(active&&body.contract?.pac_type==="ProfilePAC"){
          setProfileContract(body.contract)
          const visibilityQuestion=body.contract.questions.find(question=>question.key==="profile.visibility_scope")
          if(visibilityQuestion?.default)setProfileVisibility(visibilityQuestion.default)
        }
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
        setProfileTruth(body.envpac.profile_pac||null)
        setProfileLoaded(true)
        setProfileDisplayLabel(body.owner?.display_name?.trim()||"")
        setProfilePresentationAsset(body.presentation?.opening_visual_asset_key||"")
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

  useEffect(()=>{
    if(!activePanel)return
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape")setActivePanel(null)
    }
    window.addEventListener("keydown",onKeyDown)
    return()=>window.removeEventListener("keydown",onKeyDown)
  },[activePanel])

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
      const body=await response.json() as {ok?:boolean;standing?:string;reason?:string;next_read?:string}
      if(!response.ok||!body.ok)throw new Error(body.reason||body.standing||"Profile-PAC could not be formed.")
      const environmentResponse=await fetch(body.next_read||"/api/my-environment",{headers:{accept:"application/json"}})
      const environmentBody=await environmentResponse.json() as EnvPayload
      if(!environmentResponse.ok||environmentBody.standing!=="environment_ready"||!environmentBody.envpac)
        throw new Error("Profile-PAC formed, but EnvPAC could not be re-resolved.")
      setData(environmentBody)
      setProfileTruth(environmentBody.envpac.profile_pac||null)
      setProfileLoaded(true)
      setProfileNotice("Profile-PAC is complete in your EnvPAC.")
    }catch(error){setProfileNotice(error instanceof Error?error.message:"Profile-PAC could not be formed.")}
  }

  async function savePresentation(event:FormEvent){
    event.preventDefault();setProfileNotice("")
    if(!data?.presentation?.owner_changeable){setProfileNotice("This EnvPAC presentation is not owner-changeable.");return}
    try{
      const response=await fetch("/api/my-environment-presentation",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({opening_visual_asset_key:profilePresentationAsset.trim()})
      })
      const body=await response.json() as {ok?:boolean;standing?:string;reason?:string;presentation?:EnvPayload["presentation"]}
      if(!response.ok||!body.ok||!body.presentation)throw new Error(body.reason||body.standing||"Environment presentation could not be updated.")
      setData(current=>current?{...current,presentation:body.presentation||null}:current)
      setProfileNotice("Environment presentation updated in this EnvPAC.")
    }catch(error){setProfileNotice(error instanceof Error?error.message:"Environment presentation could not be updated.")}
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
      const profileHeld=profileTruth?.projection_standing==="held"
      const labelQuestion=profileContract?.questions.find(question=>question.key==="profile.display_label")
      const visibilityQuestion=profileContract?.questions.find(question=>question.key==="profile.visibility_scope")
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">PROFILE-PAC</p><h2>{primitive.display_label}</h2>
          <p>Complete the bounded profile only when you want a profile to become encounterable beyond this private environment.</p></div>
        {data?.presentation&&<form className="myenv-thread-compose" onSubmit={savePresentation}>
          <label>Environment presentation</label>
          <input aria-label="Opening visual asset key" maxLength={240} value={profilePresentationAsset} onChange={e=>setProfilePresentationAsset(e.target.value)} disabled={!data.presentation.owner_changeable} placeholder="FREE media asset key"/>
          <p>Current visual: {data.presentation.opening_visual_asset_key}</p>
          <button type="submit" disabled={!data.presentation.owner_changeable||!profilePresentationAsset.trim()}>SAVE PRESENTATION</button>
        </form>}
        {!profileLoaded
          ?<p className="myenv-runtime-warning">Profile-PAC state could not be resolved from this EnvPAC.</p>
          :profileHeld
          ?<p className="myenv-runtime-warning">Profile-PAC is held inside this EnvPAC.</p>
          :profile
          ?<article className="myenv-initiative-card"><div><span>{profile.visibility_scope}</span><h3>{profile.display_label}</h3><p>Profile-PAC ready in EnvPAC.</p></div></article>
          :!labelQuestion||!visibilityQuestion
          ?<p className="myenv-runtime-warning">Profile-PAC intake contract is unavailable.</p>
          :<form className="myenv-thread-compose" onSubmit={formProfile}>
            <input aria-label={labelQuestion.label} maxLength={labelQuestion.max_length||160} value={profileDisplayLabel} onChange={e=>setProfileDisplayLabel(e.target.value)} placeholder={labelQuestion.placeholder||labelQuestion.label} required={labelQuestion.required}/>
            <select aria-label={visibilityQuestion.label} value={profileVisibility} onChange={e=>setProfileVisibility(e.target.value)}>
              {(visibilityQuestion.options||[]).map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
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
          {!canopyLoaded&&<p className="myenv-runtime-warning">Canopy could not be resolved from this session.</p>}
          {canopyLoaded&&canopy.length===0&&<p className="myenv-relations-empty">No Canopy references yet.</p>}
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
          {nativeConnections.map(connection=><article key={connection.connection_key}><div><span>connected</span><time>{new Date(connection.formed_at).toLocaleString()}</time></div><h3>{connection.other.display_name||"Connected environment"}</h3>{connection.messages.slice(-5).map(item=><p key={item.message_key}><strong>{item.sender_relationship_key===connection.other.relationship_key?(connection.other.display_name||"Connection")+": ":"You: "}</strong>{item.body}</p>)}</article>)}
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
  const activePrimitive=activePanel?.startsWith("primitive:")
    ?primitives.find(primitive=>"primitive:"+primitive.primitive_key===activePanel)
    :null
  const activeInitiative=activePanel?.startsWith("initiative:")
    ?initiatives.find(initiative=>"initiative:"+initiative.initiative_key===activePanel)
    :null

  return <main className="myenv-shell myenv-environment" aria-label="My Environment" data-runtime-contract="c1me_env_primitives_v2">
    <img className="myenv-backdrop" src={backdrop} alt="" aria-hidden="true"/>
    <div className="myenv-environment-wash" aria-hidden="true"/>
    <section className="myenv-place" aria-label="c1ME environment">
      <div className="myenv-presence">
        <p className="myenv-kicker">c1ME.env</p>
        <h1>{data.owner?.display_name?.trim()||"My Environment"}</h1>
        <p className="myenv-presence-hint">Hover to discover · tap to open</p>
      </div>
    </section>

    {runtimeNotice&&<p className="myenv-runtime-notice" role="status">{runtimeNotice}</p>}
    {initiatives.some(initiative=>initiative.initiative_key==="47pct")&&<aside className="myenv-runtime-notice" aria-label="Eternal Flame memorial"><strong>Eternal Flame</strong> · For those who died waiting.</aside>}

    <nav className="myenv-discovery" aria-label="Environment touchpoints">
      {primitives.map(primitive=><button
        key={primitive.primitive_key}
        type="button"
        className={"myenv-touchpoint myenv-touchpoint--"+primitive.primitive_key.replace(/_/g,"-")}
        aria-label={"Open "+primitive.display_label}
        aria-expanded={activePanel==="primitive:"+primitive.primitive_key}
        onClick={()=>setActivePanel("primitive:"+primitive.primitive_key)}
      >
        <span className="myenv-touchpoint-dot" aria-hidden="true"/>
        <span className="myenv-touchpoint-label">{primitive.display_label}</span>
      </button>)}
      {initiatives.map(initiative=>{
        const entry=initiative.components.find(component=>component.renderer_key==="initiative.entry_card")
        const label=text(entry?.config?.title,initiative.initiative_key)
        return <button
          key={initiative.initiative_key}
          type="button"
          className="myenv-touchpoint myenv-touchpoint--initiative"
          aria-label={"Open "+label}
          aria-expanded={activePanel==="initiative:"+initiative.initiative_key}
          onClick={()=>setActivePanel("initiative:"+initiative.initiative_key)}
        >
          <span className="myenv-touchpoint-dot" aria-hidden="true"/>
          <span className="myenv-touchpoint-label">{label}</span>
        </button>
      })}
    </nav>

    {(activePrimitive||activeInitiative)&&<div
      className="myenv-overlay"
      role="presentation"
      onMouseDown={event=>{if(event.currentTarget===event.target)setActivePanel(null)}}
    >
      <section className="myenv-panel" role="dialog" aria-modal="true" aria-label={activePrimitive?.display_label||"Initiative"}>
        <button className="myenv-panel-close" type="button" aria-label="Close" onClick={()=>setActivePanel(null)}>×</button>
        {activePrimitive&&renderPrimitive(activePrimitive)}
        {activeInitiative&&<section className="myenv-connections-thread">
          <div className="myenv-thread-heading">
            <p className="myenv-kicker">{activeInitiative.visibility_source.toUpperCase()}</p>
            <h2>Initiative</h2>
            <p>This initiative is visible because this environment has an evidenced encounter or invitation relation.</p>
          </div>
          {activeInitiative.initiative_key==="47pct"&&<article className="myenv-initiative-card" aria-label="Eternal Flame memorial"><div><span>MEMORIAL</span><h3>Eternal Flame</h3><p>For those who died waiting.</p></div></article>}
          {activeInitiative.components.filter(component=>component.renderer_key==="initiative.entry_card").map(component=>{
            const config=component.config||{}
            const held=config.display_state==="held"||config.interaction_enabled===false
            const holdReasons=Array.isArray(config.hold_reasons)?config.hold_reasons.filter((value):value is string=>typeof value==="string"):[]
            return <article key={component.component_key} className="myenv-initiative-card" aria-disabled={held||undefined} style={held?{opacity:.58,filter:"grayscale(1)"}:undefined}>
              <div>
                <span>{held?text(config.status_label,"HOLD"):text(config.target_environment_label,activeInitiative.target_environment_key||"initiative")}</span>
                <h3>{text(config.title,activeInitiative.initiative_key)}</h3>
                {text(config.summary)&&<p>{text(config.summary)}</p>}
                {held&&holdReasons.length>0&&<ul>{holdReasons.map(reason=><li key={reason}>{reason}</li>)}</ul>}
              </div>
              {!held&&text(config.route)&&<a href={text(config.route)}>ENTER →</a>}
            </article>
          })}
        </section>}
      </section>
    </div>}
  </main>
}
