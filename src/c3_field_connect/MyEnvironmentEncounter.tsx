import {useEffect,useState,type CSSProperties,type FormEvent} from "react"
import "./myEnvironmentEncounter.css"

const DEFAULT_OPENING_VISUAL="https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c3_tree_env.webp"

type EnvPayload={
  authenticated:boolean
  standing:string
  owner?:{display_name:string|null}
  environment?:{env_key:string;environment_name:string;environment_class:string;standing:string;is_active:boolean;is_canonical:boolean}
  envpac?:{envpac_key:string;version:string;standing:string;owner_subject_type:string;custodian_subject_type:string;custodian_subject_key:string;custody_provider:string;portable:boolean;environment_bindings:unknown;rooted_systems:unknown;packages:unknown}
  presentation?:{opening_visual_asset_key:string;opening_visual_url:string;source_webpac_key:string;owner_changeable:boolean;selection_standing:string;selected_at?:string;updated_at?:string}|null
  access?:Array<{grant_key:string;subject_type:string;relation_role:string;scope:unknown;standing:string;evidence_ref?:string|null}>
}
type CanopyReference={reference_key:string;surface_label:string;display_label:string|null;external_url:string;handle:string|null;sort_order:number;reference_state:string;created_at:string;updated_at:string}
type CanopyPayload={standing:string;message?:string;references?:CanopyReference[];reference?:CanopyReference;external_url?:string;public_url?:string}
type CanopyForm={surface_label:string;display_label:string;external_url:string;handle:string;sort_order:number}
const emptyCanopyForm:CanopyForm={surface_label:"",display_label:"",external_url:"",handle:"",sort_order:0}

export default function MyEnvironmentEncounter(){
  const [state,setState]=useState<"claiming"|"loading"|"ready"|"held">("loading")
  const [data,setData]=useState<EnvPayload|null>(null)
  const [message,setMessage]=useState("Opening your environment…")
  const [canopyState,setCanopyState]=useState<"idle"|"loading"|"ready"|"held">("idle")
  const [canopyMessage,setCanopyMessage]=useState("")
  const [canopyReferences,setCanopyReferences]=useState<CanopyReference[]>([])
  const [canopyForm,setCanopyForm]=useState<CanopyForm>(emptyCanopyForm)
  const [editingReference,setEditingReference]=useState<string|null>(null)
  const [canopyBusy,setCanopyBusy]=useState<string|null>(null)

  useEffect(()=>{
    let active=true
    async function run(){
      try{
        const params=new URLSearchParams(location.hash.slice(1))
        const claim=params.get("claim")
        if(claim){
          setState("claiming")
          const response=await fetch("/api/my-environment-claim",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({claim})})
          if(!response.ok) throw new Error("claim")
          history.replaceState(null,"",location.pathname)
        }
        setState("loading")
        const response=await fetch("/api/my-environment",{headers:{"accept":"application/json"}})
        const body=await response.json() as EnvPayload
        if(!active)return
        if(!response.ok || body.standing!=="environment_ready"){setMessage("Your environment is not available from this browser yet.");setState("held");return}
        setData(body)
        document.title=body.owner?.display_name?`${body.owner.display_name} | My Environment | c3 Community Partners`:"My Environment | c3 Community Partners"
        setState("ready")
      }catch{if(active){setMessage("Your environment link is unavailable or has expired.");setState("held")}}
    }
    document.title="My Environment | c3 Community Partners"
    void run()
    return()=>{active=false}
  },[])

  async function loadCanopy(){
    setCanopyState("loading")
    setCanopyMessage("")
    try{
      const response=await fetch("/api/my-environment-canopy",{headers:{accept:"application/json"}})
      const body=await response.json() as CanopyPayload
      if(!response.ok || body.standing!=="canopy_ready") throw new Error(body.message||"My Canopy is unavailable.")
      setCanopyReferences(body.references||[])
      setCanopyState("ready")
    }catch(error){setCanopyMessage(error instanceof Error?error.message:"My Canopy is unavailable.");setCanopyState("held")}
  }

  useEffect(()=>{if(state==="ready") void loadCanopy()},[state])

  async function canopyAction(body:Record<string,unknown>){
    const response=await fetch("/api/my-environment-canopy",{method:"POST",headers:{"content-type":"application/json","accept":"application/json"},body:JSON.stringify(body)})
    const result=await response.json() as CanopyPayload
    if(!response.ok) throw new Error(result.message||"That Canopy action could not be completed.")
    return result
  }

  async function saveCanopy(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setCanopyBusy(editingReference||"add");setCanopyMessage("")
    try{
      await canopyAction(editingReference?{action:"edit",reference_key:editingReference,...canopyForm}:{action:"add",...canopyForm})
      setCanopyForm(emptyCanopyForm);setEditingReference(null);await loadCanopy();setCanopyMessage(editingReference?"Canopy reference updated.":"Canopy reference added.")
    }catch(error){setCanopyMessage(error instanceof Error?error.message:"That Canopy action could not be completed.")}finally{setCanopyBusy(null)}
  }

  function editCanopy(reference:CanopyReference){
    setEditingReference(reference.reference_key)
    setCanopyForm({surface_label:reference.surface_label,display_label:reference.display_label||"",external_url:reference.external_url,handle:reference.handle||"",sort_order:reference.sort_order})
    setCanopyMessage("");document.getElementById("canopy-form")?.scrollIntoView({behavior:"smooth",block:"center"})
  }
  function cancelCanopyEdit(){setEditingReference(null);setCanopyForm(emptyCanopyForm);setCanopyMessage("")}
  async function removeCanopy(reference:CanopyReference){
    if(!window.confirm(`Remove ${reference.display_label||reference.surface_label} from My Canopy?`)) return
    setCanopyBusy(reference.reference_key);setCanopyMessage("")
    try{await canopyAction({action:"remove",reference_key:reference.reference_key});if(editingReference===reference.reference_key)cancelCanopyEdit();await loadCanopy();setCanopyMessage("Canopy reference removed.")}
    catch(error){setCanopyMessage(error instanceof Error?error.message:"That Canopy reference could not be removed.")}finally{setCanopyBusy(null)}
  }
  async function openCanopy(reference:CanopyReference){
    const target=window.open("about:blank","_blank");if(target)target.opener=null
    setCanopyBusy(reference.reference_key);setCanopyMessage("")
    try{const result=await canopyAction({action:"open",reference_key:reference.reference_key});if(typeof result.external_url!=="string")throw new Error("That Canopy destination is unavailable.");if(target)target.location.replace(result.external_url);else window.location.assign(result.external_url)}
    catch(error){target?.close();setCanopyMessage(error instanceof Error?error.message:"That Canopy destination could not be opened.")}finally{setCanopyBusy(null)}
  }
  async function copyText(value:string){
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);return}
    const area=document.createElement("textarea");area.value=value;area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();const copied=document.execCommand("copy");area.remove();if(!copied)throw new Error("Copy is unavailable in this browser.")
  }
  async function inviteConnection(){
    setCanopyBusy("invite");setCanopyMessage("")
    try{
      const result=await canopyAction({action:"invite_connection"})
      if(typeof result.public_url!=="string")throw new Error("The connection invitation is unavailable.")
      if(typeof navigator.share==="function"){
        try{
          await navigator.share({title:"c3 Community Partners",text:"Connect with me through c3 Community Partners.",url:result.public_url})
          setCanopyMessage("Connection invitation shared.")
          return
        }catch(error){
          if(error instanceof DOMException && error.name==="AbortError"){setCanopyMessage("Connection invitation not shared.");return}
        }
      }
      await copyText(result.public_url)
      setCanopyMessage("Connection invitation copied. Share it wherever you choose.")
    }catch(error){setCanopyMessage(error instanceof Error?error.message:"The connection invitation could not be prepared.")}finally{setCanopyBusy(null)}
  }

  if(state!=="ready" || !data?.environment || !data.envpac) return <main className="myenv-shell myenv-held"><section><p className="myenv-kicker">c3 Community Partners</p><h1>My Environment</h1><p>{message}</p><a href="/">Return to Connect</a></section></main>
  const env=data.environment,pac=data.envpac,ownerName=data.owner?.display_name?.trim()||"My Environment"
  const openingVisual=data.presentation?.opening_visual_url||DEFAULT_OPENING_VISUAL
  const environmentStyle={"--myenv-opening-visual":`url("${openingVisual}")`} as CSSProperties
  return <main className="myenv-shell">
    <aside className="myenv-rail"><a href="/" className="myenv-brand"><strong>c3</strong><span>Community Partners</span></a><nav aria-label="My Environment"><a href="#overview" aria-current="page">Overview</a><a href="#canopy">My Canopy</a><a href="#systems">Rooted Systems</a><a href="#access">Access</a><span aria-disabled="true">Marketplace · HLD</span></nav><small>CONNECT · CONTRIBUTE · CREATE</small></aside>
    <section className="myenv-main" style={environmentStyle}>
      <header id="overview" className="myenv-hero"><div><p className="myenv-kicker">My Environment</p><h1>{ownerName}</h1><p>Your environment is connected. You own it; c3 Field holds bounded custody and operating access.</p></div></header>
      <section className="myenv-grid"><article><p className="myenv-kicker">Environment</p><h2>{env.environment_name}</h2><dl><div><dt>Standing</dt><dd>{env.standing}</dd></div><div><dt>Class</dt><dd>{env.environment_class}</dd></div><div><dt>Environment</dt><dd><code>{env.env_key}</code></dd></div></dl></article><article><p className="myenv-kicker">c3EnvPac</p><h2>{pac.version}</h2><dl><div><dt>Standing</dt><dd>{pac.standing}</dd></div><div><dt>Owner</dt><dd>{ownerName}</dd></div><div><dt>Custodian</dt><dd>{pac.custodian_subject_key}</dd></div><div><dt>Portable</dt><dd>{pac.portable?"yes":"no"}</dd></div><div><dt>Opening visual</dt><dd>{data.presentation?.owner_changeable?"owner changeable":"default"}</dd></div></dl></article></section>
      <section id="canopy" className="myenv-section myenv-canopy">
        <div className="myenv-section-heading"><div><p className="myenv-kicker">My Canopy</p><h2>The places you already go</h2><p className="myenv-canopy-intro">These are your references. c3 does not sign in to, read, or operate these accounts. Open takes you to the destination you supplied.</p></div><button type="button" className="myenv-secondary" onClick={()=>void inviteConnection()} disabled={canopyBusy!==null}>Invite Connection</button></div>
        {canopyState==="loading"&&<p className="myenv-canopy-status">Opening My Canopy…</p>}
        {canopyState==="held"&&<div className="myenv-canopy-held"><p>{canopyMessage||"My Canopy is held under the current environment conditions."}</p><button type="button" className="myenv-secondary" onClick={()=>void loadCanopy()}>Try again</button></div>}
        {canopyState==="ready"&&<><div className="myenv-canopy-list">{canopyReferences.length===0?<p className="myenv-canopy-empty">Your Canopy is empty. Add the first place you want to reach from your environment.</p>:canopyReferences.map(reference=><article className="myenv-canopy-card" key={reference.reference_key}><div><p className="myenv-canopy-surface">{reference.surface_label}</p><h3>{reference.display_label||reference.surface_label}</h3>{reference.handle&&<span>{reference.handle}</span>}<small>{reference.external_url}</small></div><div className="myenv-canopy-actions"><button type="button" className="myenv-primary" onClick={()=>void openCanopy(reference)} disabled={canopyBusy!==null}>Open</button><button type="button" className="myenv-secondary" onClick={()=>editCanopy(reference)} disabled={canopyBusy!==null}>Edit</button><button type="button" className="myenv-text-button" onClick={()=>void removeCanopy(reference)} disabled={canopyBusy!==null}>Remove</button></div></article>)}</div>
          <form id="canopy-form" className="myenv-canopy-form" onSubmit={saveCanopy}><div className="myenv-form-heading"><div><p className="myenv-kicker">Canopy Reference</p><h3>{editingReference?"Edit reference":"Add a place"}</h3></div>{editingReference&&<button type="button" className="myenv-text-button" onClick={cancelCanopyEdit}>Cancel</button>}</div><div className="myenv-form-grid"><label><span>Surface</span><input required maxLength={80} placeholder="Facebook" value={canopyForm.surface_label} onChange={event=>setCanopyForm({...canopyForm,surface_label:event.target.value})}/></label><label><span>Label</span><input maxLength={120} placeholder="My Facebook" value={canopyForm.display_label} onChange={event=>setCanopyForm({...canopyForm,display_label:event.target.value})}/></label><label className="myenv-form-wide"><span>Destination</span><input required inputMode="url" maxLength={2048} placeholder="https://… or mailto:…" value={canopyForm.external_url} onChange={event=>setCanopyForm({...canopyForm,external_url:event.target.value})}/></label><label><span>Handle <small>optional</small></span><input maxLength={160} placeholder="@name" value={canopyForm.handle} onChange={event=>setCanopyForm({...canopyForm,handle:event.target.value})}/></label></div><div className="myenv-form-actions"><button type="submit" className="myenv-primary" disabled={canopyBusy!==null}>{canopyBusy?(editingReference?"Saving…":"Adding…"):(editingReference?"Save changes":"Add to My Canopy")}</button><span>No account password or provider authorization is requested.</span></div></form>{canopyMessage&&<p className="myenv-canopy-status" role="status">{canopyMessage}</p>}</>}
      </section>
      <section id="systems" className="myenv-section"><p className="myenv-kicker">Rooted Systems</p><h2>What is allowed to operate here</h2><pre>{JSON.stringify(pac.rooted_systems,null,2)}</pre></section>
      <section id="access" className="myenv-section"><p className="myenv-kicker">Access</p><h2>Ownership and custody</h2><div className="myenv-access">{(data.access||[]).map(g=><article key={g.grant_key}><strong>{g.relation_role}</strong><span>{g.relation_role==="owner"?ownerName:g.subject_type}</span><code>{JSON.stringify(g.scope)}</code></article>)}</div></section>
      <footer><span>People · Places · Possibility</span><span>Connect · Contribute · Create</span></footer>
    </section>
  </main>
}
