import {useState} from "react"
import type {C3PublicPresentation} from "./c3PublicPresentation"


const media=(key:string)=>`/api/free-media?asset=${key}`

export default function MillionDollarMissionLanding({presentation}:{presentation:C3PublicPresentation}){
  const [storyRequested,setStoryRequested]=useState(()=>window.location.hash==="#film")
  const story= presentation.runtime_media ? presentation.runtime_media.feature_film : "/api/free-media?asset=c3_field_public_intro_million_dollar_mission_v1"
  const copy=presentation.landing
  const center=media(presentation.media_roles.og_master)
  const capacity=media(presentation.media_roles.capacity_projects)
  const serene=media(presentation.media_roles.serene_place)
  const emblem=media(presentation.media_roles.handcrafted_emblem)
  const identity=presentation.public_identity
  return <main className="mdm-page" data-c3-environment="env_c3_community_connect" data-c3-presentation-state="c3field_public_landing">
    <header className="mdm-header">
      <a className="mdm-brand" href="/" aria-label={identity.brand+" home"}><img src={emblem} alt="" width="44" height="44"/><span>{identity.brand}</span></a>
      <nav className="mdm-nav" aria-label="Primary">
        {presentation.navigation.filter(item=>["/community-potential","/privacy","/contact"].includes(item.route)).map(item=><a key={item.route} href={item.route}>{item.label.toUpperCase()}</a>)}
        <a className="mdm-nav-cta" href={presentation.connect_route}>CONNECT</a>
      </nav>
    </header>

    <section className="mdm-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(10,12,13,.82),rgba(10,12,13,.12)),url("${center}")`}}>
      <div className="mdm-hero-copy">
        <p className="mdm-kicker">{copy.kicker}</p>
        <h1>{copy.hero_title}</h1>
        <p className="mdm-hero-lead">{copy.hero_lead}</p>
        <div className="mdm-actions">
          <a className="mdm-button mdm-button-primary" href={copy.primary_cta_route}>{copy.primary_cta}<span aria-hidden="true">↗</span></a>
          <a className="mdm-button mdm-button-quiet" href="#film" onClick={()=>setStoryRequested(true)}>WATCH THE STORY</a>
        </div>
      </div>
    </section>

    <section className="mdm-video-section" id="film">
      <div className="mdm-video-shell">{story && storyRequested ? <video src={story} playsInline controls preload="metadata" aria-label={copy.kicker}>Your browser does not support this video.</video> : !story ? <p role="status">The story film is currently unavailable.</p> : null}</div>
    </section>

    <section className="mdm-question" id="mission">
      <p className="mdm-kicker">THE QUESTION</p>
      <h2>{copy.question_title}</h2>
      <p>{copy.question_body}</p>
    </section>

    <section className="mdm-visual-break" style={{backgroundImage:`linear-gradient(90deg,rgba(10,12,13,.12),rgba(10,12,13,.12)),url("${capacity}")`}} aria-label={copy.capacity_title}>
      <div className="mdm-visual-break-copy"><h2>{copy.capacity_title}</h2></div>
    </section>

    <section className="mdm-c3-grid" aria-label="The c3 model">
      <article><span>01</span><h3>{copy.connect_title}</h3><p>{copy.connect_body}</p></article>
      <article><span>02</span><h3>{copy.contribute_title}</h3><p>{copy.contribute_body}</p></article>
      <article><span>03</span><h3>{copy.create_title}</h3><p>{copy.create_body}</p></article>
    </section>

    <section className="mdm-backdrop" style={{backgroundImage:`linear-gradient(90deg,rgba(11,13,14,.84),rgba(11,13,14,.18)),url("${serene}")`}}>
      <div className="mdm-backdrop-copy"><h2>{copy.core_premise}</h2><a className="mdm-button mdm-button-primary" href={presentation.connect_route}>CONNECT <span aria-hidden="true">↗</span></a></div>
    </section>

    <footer className="mdm-footer">
      <div><strong>{identity.brand}</strong><span>{identity.environment_definition}</span><span>{identity.formal_authority_statement}</span><span><a href={`mailto:${identity.contact_email}`}>{identity.contact_email}</a> · <a href={identity.contact_phone_href}>{identity.contact_phone}</a></span><span>{identity.copyright}</span></div>
      <nav aria-label="Footer">{presentation.navigation.filter(item=>["/community-potential","/privacy","/terms","/contact"].includes(item.route)).map(item=><a key={item.route} href={item.route}>{item.label}</a>)}</nav>
    </footer>
  </main>
}
