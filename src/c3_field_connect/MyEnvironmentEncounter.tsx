import {useEffect,useState} from "react"
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
export default function MyEnvironmentEncounter(){
  const [state,setState]=useState<"claiming"|"loading"|"ready"|"held">("loading")
  const [data,setData]=useState<EnvPayload|null>(null)
  const [message,setMessage]=useState("Opening your environment…")
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
  if(state!=="ready" || !data?.environment || !data.envpac) return <main className="myenv-shell myenv-held"><section><p className="myenv-kicker">c3 Community Partners</p><h1>My Environment</h1><p>{message}</p><a href="/">Return to Connect</a></section></main>
  const env=data.environment,pac=data.envpac,ownerName=data.owner?.display_name?.trim()||"My Environment"
  const openingVisual=data.presentation?.opening_visual_url||DEFAULT_OPENING_VISUAL
  return <main className="myenv-shell">
    <aside className="myenv-rail">
      <a href="/" className="myenv-brand"><strong>c3</strong><span>Community Partners</span></a>
      <nav aria-label="My Environment"><a href="#overview" aria-current="page">Overview</a><a href="#systems">Rooted Systems</a><a href="#access">Access</a><span aria-disabled="true">Marketplace · HLD</span></nav>
      <small>CONNECT · CONTRIBUTE · CREATE</small>
    </aside>
    <section className="myenv-main">
      <header id="overview" className="myenv-hero">
        <img src={openingVisual} alt="" />
        <div><p className="myenv-kicker">My Environment</p><h1>{ownerName}</h1><p>Your environment is connected. You own it; c3 Field holds bounded custody and operating access.</p></div>
      </header>
      <section className="myenv-grid">
        <article><p className="myenv-kicker">Environment</p><h2>{env.environment_name}</h2><dl><div><dt>Standing</dt><dd>{env.standing}</dd></div><div><dt>Class</dt><dd>{env.environment_class}</dd></div><div><dt>Environment</dt><dd><code>{env.env_key}</code></dd></div></dl></article>
        <article><p className="myenv-kicker">c3EnvPac</p><h2>{pac.version}</h2><dl><div><dt>Standing</dt><dd>{pac.standing}</dd></div><div><dt>Owner</dt><dd>{ownerName}</dd></div><div><dt>Custodian</dt><dd>{pac.custodian_subject_key}</dd></div><div><dt>Portable</dt><dd>{pac.portable?"yes":"no"}</dd></div><div><dt>Opening visual</dt><dd>{data.presentation?.owner_changeable?"owner changeable":"default"}</dd></div></dl></article>
      </section>
      <section id="systems" className="myenv-section"><p className="myenv-kicker">Rooted Systems</p><h2>What is allowed to operate here</h2><pre>{JSON.stringify(pac.rooted_systems,null,2)}</pre></section>
      <section id="access" className="myenv-section"><p className="myenv-kicker">Access</p><h2>Ownership and custody</h2><div className="myenv-access">{(data.access||[]).map(g=><article key={g.grant_key}><strong>{g.relation_role}</strong><span>{g.relation_role==="owner"?ownerName:g.subject_type}</span><code>{JSON.stringify(g.scope)}</code></article>)}</div></section>
      <footer><span>People · Places · Possibility</span><span>Connect · Contribute · Create</span></footer>
    </section>
  </main>
}
