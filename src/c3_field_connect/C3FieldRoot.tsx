import {useEffect,useState} from "react"

type Section={key:string;title?:string;headline?:string;body?:string;descriptor?:string;role?:string;items?:string[];points?:string[]}
type PublicEncounter={route:string;title:string;hero?:string;root_entry_label?:string;root_entry_summary?:string;standing_created?:boolean}
type RootPresentation={standing:string;manifest:{composition:{header?:{owner?:string};sections?:Section[];community_potential_whitepaper?:{label?:string;route_state?:string};public_encounters?:{living_circuit?:PublicEncounter}};og_share_presentation?:{title?:string;description?:string;canonical_url?:string;image_runtime_uri?:string}};runtimeMedia:{opening:{runtime_uri:string};backdrop:{runtime_uri:string}};publicIdentity:Record<string,string>}

export default function C3FieldRoot(){
  const [state,setState]=useState<RootPresentation|null>(null)
  const [held,setHeld]=useState(false)
  const [videoDone,setVideoDone]=useState(false)
  useEffect(()=>{fetch("/api/c3-root-presentation",{headers:{accept:"application/json"},cache:"no-store"}).then(async r=>{const body=await r.json();if(!r.ok||body?.standing!=="bounded_public_runtime")throw new Error("held");setState(body)}).catch(()=>setHeld(true))},[])
  if(held)return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#111",color:"#eee",fontFamily:"system-ui",padding:"2rem"}}><p>c3 Field presentation temporarily unavailable.</p></main>
  if(!state)return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#111",color:"#eee",fontFamily:"system-ui"}}><p>Opening c3 Field…</p></main>
  const c=state.manifest.composition
  const sections=c.sections||[]
  const identity=state.publicIdentity
  return <main style={{minHeight:"100vh",background:"#101311",color:"#f2f1ea",fontFamily:"system-ui, sans-serif",position:"relative"}}>
    <div aria-hidden="true" style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(rgba(10,14,11,.72),rgba(10,14,11,.9)),url("${state.runtimeMedia.backdrop.runtime_uri}")`,backgroundSize:"cover",backgroundPosition:"center",zIndex:0}} />
    {!videoDone&&<div style={{position:"fixed",inset:0,zIndex:20,background:"#000",display:"grid",placeItems:"center"}}>
      <video src={state.runtimeMedia.opening.runtime_uri} autoPlay playsInline controls onEnded={()=>setVideoDone(true)} style={{width:"100%",height:"100%",objectFit:"cover"}} />
      <button onClick={()=>setVideoDone(true)} style={{position:"absolute",right:"1rem",bottom:"1rem",padding:".65rem 1rem"}}>Enter c3 Field</button>
    </div>}
    <div style={{position:"relative",zIndex:1,maxWidth:"960px",margin:"0 auto",padding:"2rem 1.25rem 4rem"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",paddingBottom:"12vh"}}>
        <strong>c3 Field</strong><span style={{fontSize:".8rem",opacity:.7}}>{c.header?.owner}</span>
      </header>
      {sections.map(section=><section key={section.key} style={{padding:"clamp(2.5rem,8vh,6rem) 0",borderTop:"1px solid rgba(255,255,255,.16)"}}>
        {section.headline&&<h1 style={{fontSize:"clamp(2.4rem,7vw,5.6rem)",lineHeight:.98,maxWidth:"14ch",margin:"0 0 1.5rem"}}>{section.headline}</h1>}
        {section.title&&<h2 style={{fontSize:"clamp(1.8rem,4vw,3.2rem)",margin:"0 0 1rem"}}>{section.title}</h2>}
        {section.descriptor&&<p style={{fontSize:"clamp(1.35rem,3vw,2rem)",margin:".25rem 0"}}>{section.descriptor}</p>}
        {section.body&&<p style={{fontSize:"1.15rem",lineHeight:1.7,maxWidth:"68ch",opacity:.9}}>{section.body}</p>}
        {section.role&&<p style={{fontSize:"1.1rem",lineHeight:1.6,opacity:.82}}>{section.role.replaceAll("_"," ")}</p>}
        {section.items&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem",marginTop:"1.5rem"}}>{section.items.map(item=><div key={item} style={{padding:"1.4rem",border:"1px solid rgba(255,255,255,.2)",borderRadius:"1rem",fontSize:"1.25rem"}}>{item}</div>)}</div>}
        {section.points&&<div style={{display:"grid",gap:".7rem",marginTop:"1.5rem"}}>{section.points.map(point=><div key={point} style={{fontSize:"1.2rem",padding:"1rem 0",borderBottom:"1px solid rgba(255,255,255,.12)"}}>{point}</div>)}</div>}
      </section>)}
      {c.public_encounters?.living_circuit?.standing_created===false&&<section style={{padding:"clamp(2.5rem,8vh,6rem) 0",borderTop:"1px solid rgba(255,255,255,.16)"}}>
        <p style={{fontSize:".72rem",letterSpacing:".14em",textTransform:"uppercase",opacity:.68}}>Public orientation encounter</p>
        <h2 style={{fontSize:"clamp(2.2rem,5vw,4.6rem)",lineHeight:1,margin:".6rem 0 1rem",fontFamily:"Georgia,serif",fontWeight:400}}>{c.public_encounters.living_circuit.title}</h2>
        <p style={{fontSize:"1.15rem",lineHeight:1.7,maxWidth:"62ch",opacity:.86}}>{c.public_encounters.living_circuit.root_entry_summary||c.public_encounters.living_circuit.hero}</p>
        <a href={c.public_encounters.living_circuit.route} style={{display:"inline-block",marginTop:"1rem",color:"inherit",fontWeight:700,textDecoration:"none",letterSpacing:".05em"}}>{(c.public_encounters.living_circuit.root_entry_label||c.public_encounters.living_circuit.title).toUpperCase()} →</a>
      </section>}
      <footer style={{borderTop:"1px solid rgba(255,255,255,.16)",paddingTop:"2rem",fontSize:".85rem",lineHeight:1.8,opacity:.72}}>
        <div>{identity.environment_definition}</div><div>{identity.formal_authority_statement}</div>
        <nav style={{display:"flex",gap:"1rem",flexWrap:"wrap",margin:"1rem 0"}}><a style={{color:"inherit"}} href={identity.privacy_route}>Privacy</a><a style={{color:"inherit"}} href={identity.terms_route}>Terms</a><a style={{color:"inherit"}} href={identity.contact_route}>Contact</a></nav>
        <div>{identity.copyright}</div>
      </footer>
    </div>
  </main>
}
