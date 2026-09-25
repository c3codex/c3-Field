import {useEffect,useState} from "react"
import {loadC3PublicPresentation,type C3PublicDocument,type C3PublicPresentation} from "./c3PublicPresentation"

export default function C3PublicDocumentPage({kind}:{kind:"privacy"|"terms"|"contact"}){
  const [presentation,setPresentation]=useState<C3PublicPresentation|null>(null)
  const [failed,setFailed]=useState(false)
  useEffect(()=>{
    let active=true
    loadC3PublicPresentation().then(value=>{if(active)setPresentation(value)}).catch(()=>{if(active)setFailed(true)})
    return()=>{active=false}
  },[])
  if(failed) return <main className="c3-public-doc"><div className="c3-connect-width"><p>Public document authority is temporarily unavailable.</p></div></main>
  if(!presentation) return <main className="c3-public-doc"><div className="c3-connect-width"><p>Loading…</p></div></main>
  const document:C3PublicDocument=kind==="privacy"?presentation.privacy_document:kind==="terms"?presentation.terms_document:presentation.contact_document
  const identity=presentation.public_identity
  const emblem= presentation.media_roles.handcrafted_emblem ? `/api/free-media?asset=${presentation.media_roles.handcrafted_emblem}` : null
  return <main className="c3-public-doc">
    <header className="c3-public-doc-header c3-connect-width">
      <a href="/" className="c3-public-doc-brand">{emblem&&<img src={emblem} alt="" width="42" height="42"/>}<span>{identity.brand}</span></a>
      <nav aria-label="Public">{presentation.navigation.map(item=><a key={item.route} href={item.route}>{item.label}</a>)}</nav>
    </header>
    <article className="c3-public-doc-body c3-connect-width">
      <p className="c3-connect-kicker">{identity.environment_name}</p>
      <h1>{document.title}</h1>
      {document.effective_date&&<p className="c3-public-doc-meta">Effective {document.effective_date}</p>}
      {document.intro&&<p className="c3-public-doc-intro">{document.intro}</p>}
      {document.body&&<p>{document.body}</p>}
      {document.email&&<p><a href={`mailto:${document.email}`}>{document.email}</a></p>}
      {document.phone&&<p><a href={identity.contact_phone_href}>{document.phone}</a></p>}
      {document.sections?.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
    </article>
    <footer className="c3-public-doc-footer c3-connect-width">
      <div><strong>{identity.brand}</strong><p>{identity.environment_definition}</p><p>{identity.formal_authority_statement}</p><p><a href={`mailto:${identity.contact_email}`}>{identity.contact_email}</a> · <a href={identity.contact_phone_href}>{identity.contact_phone}</a></p><p>{identity.copyright}</p></div>
      <nav aria-label="Footer">{presentation.navigation.filter(item=>["/community-potential","/privacy","/terms","/contact"].includes(item.route)).map(item=><a key={item.route} href={item.route}>{item.label}</a>)}</nav>
    </footer>
  </main>
}
