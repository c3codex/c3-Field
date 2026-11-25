import {dnrDocument} from "../../src/shared/dnrPresentation"

type Row=Record<string,unknown>
type Env={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}
const row=(value:unknown):Row=>value!==null&&typeof value==="object"&&!Array.isArray(value)?value as Row:{}
const text=(value:unknown)=>typeof value==="string"?value:""
const escape=(value:unknown)=>text(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!))
const ids=["arrival","current-state","possibilities","explore","principles","founders-ground","closing"]
function href(value:unknown){
  const candidate=text(value)
  if(/^#[a-z][a-z0-9-]*$/.test(candidate))return candidate
  try{const url=new URL(candidate);return url.protocol==="https:"&&!url.username&&!url.password?url.href:null}catch{return null}
}
function links(value:unknown){
  return (Array.isArray(value)?value:[]).map(row).map(link=>{
    const destination=href(link.href)
    return destination&&text(link.label)?`<a href="${escape(destination)}">${escape(link.label)}</a>`:""
  }).join("")
}
function list(value:unknown){return Array.isArray(value)&&value.length?`<ul>${value.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:''}
// Only a registered public FREE projection supplies content and destinations.
// Missing admission never falls back to source files, old copy or private PAC data.
export function renderFieldOfPossibility(resolved:unknown):string|null{
  const result=row(resolved),snapshot=row(result.snapshot),landing=row(snapshot.public_landing),design=row(landing.design)
  const identity=row(landing.identity),seo=row(landing.seo)
  const social=row(seo.image)
  const chapters=Array.isArray(landing.chapters)?landing.chapters.map(row):[]
  if(result.standing!=="ACT"||result.free_call_key!=="c3_public_webpac_encounter"||
    snapshot.canonical_host!=="c3field.online"||snapshot.canonical_path!=="/"||snapshot.release_state!=="public"||
    snapshot.authority_effect!=="none"||snapshot.frontend_invention!==false||
    landing.format!=="c3field_field_of_possibility_v1"||
    design.pac_key!=="c3field_public_landing_designpac_v1"||!text(design.registration_sha256).match(/^[a-f0-9]{64}$/)||
    chapters.length!==7||chapters.some((chapter,index)=>chapter.id!==ids[index]||!text(chapter.heading))||
    !text(identity.legal_entity)||!href(identity.privacy_url)||!href(identity.terms_url)||!href(identity.contact_url)||
    !text(seo.title)||!text(seo.description)||seo.canonical_url!=="https://c3field.online/"||
    !/^\/api\/free-media\?asset=[a-zA-Z0-9_-]+$/.test(text(social.runtime_uri))||
    !/^[a-f0-9]{64}$/.test(text(social.sha256))||social.width!==1200||social.height!==630)return null
  const socialHead=`<meta property="og:image" content="https://c3field.online${escape(social.runtime_uri)}"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>`
  const structuredData=JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':'https://c3field.online/#organization',name:identity.legal_entity,url:'https://c3field.online/'},
    {'@type':'WebSite','@id':'https://c3field.online/#website',name:seo.og_title||seo.title,url:'https://c3field.online/',publisher:{'@id':'https://c3field.online/#organization'}},
    {'@type':'WebPage','@id':'https://c3field.online/#webpage',name:seo.title,description:seo.description,url:'https://c3field.online/',isPartOf:{'@id':'https://c3field.online/#website'}}
  ]}).replace(/</g,'\\u003c')
  const sections=chapters.map((chapter,index)=>{
    const paragraphs=(Array.isArray(chapter.paragraphs)?chapter.paragraphs:[]).map(p=>`<p>${escape(p)}</p>`).join("")
    const items=(Array.isArray(chapter.items)?chapter.items:[]).map(row).map(item=>`<article><h3>${escape(item.heading)}</h3><p>${escape(item.body)}</p>${list(item.bullets)}${links(item.links)}</article>`).join("")
    const media=row(chapter.media),uri=text(media.runtime_uri)
    const image=/^\/api\/free-media\?asset=[a-zA-Z0-9_-]+$/.test(uri)&&/^[a-f0-9]{64}$/.test(text(media.sha256))&&text(media.alt)
      ?`<img class="c3-media" src="${escape(uri)}" alt="${escape(media.alt)}" ${index===0?'fetchpriority="high"':'loading="lazy"'} width="${Number.isInteger(media.width)&&Number(media.width)>0?media.width:1600}" height="${Number.isInteger(media.height)&&Number(media.height)>0?media.height:900}"/>`:""
    const heading=index===0?"h1":"h2"
    return `${index===1?`<nav class="c3-main-nav" aria-label="Main navigation">${links(landing.navigation)}</nav>`:''}<section id="${ids[index]}" class="c3-chapter">${image}<div class="c3-content"><${heading}>${escape(chapter.heading)}</${heading}>${chapter.headline?`<p class="c3-headline">${escape(chapter.headline)}</p>`:''}<div class="c3-reading">${paragraphs}${list(chapter.bullets)}</div>${items?`<div class="${index===2?'c3-possibility-mosaic':'c3-field-mosaic'}">${items}</div>`:""}<div class="c3-actions">${links(chapter.actions)}</div></div></section>`
  }).join("")
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escape(seo.title)}</title><meta name="description" content="${escape(seo.description)}"/><link rel="canonical" href="https://c3field.online/"/><meta property="og:title" content="${escape(seo.og_title||seo.title)}"/><meta property="og:description" content="${escape(seo.og_description||seo.description)}"/><meta property="og:type" content="website"/><meta property="og:url" content="https://c3field.online/"/>${socialHead}<script type="application/ld+json">${structuredData}</script><style>${styles}</style></head><body class="c3-public-landing"><a class="c3-skip" href="#arrival">Skip to content</a><main>${sections}</main><footer><nav aria-label="Public navigation">${links(landing.navigation)}</nav><p>${escape(identity.legal_entity)}</p><nav aria-label="Legal"><a href="${escape(href(identity.privacy_url))}">Privacy</a><a href="${escape(href(identity.terms_url))}">Terms</a><a href="${escape(href(identity.contact_url))}">Contact</a></nav></footer></body></html>`
}
async function registeredRows(env:Env,table:string,filters:Record<string,string>,select:string){
  const url=new URL('/rest/v1/'+table,env.SUPABASE_URL)
  url.searchParams.set('select',select)
  for(const [key,value] of Object.entries(filters))url.searchParams.set(key,value)
  const response=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY!},redirect:'error',signal:AbortSignal.timeout(6000)})
  if(!response.ok)throw Error('registered_landing_binding_unavailable')
  const values:unknown=await response.json()
  if(!Array.isArray(values))throw Error('registered_landing_binding_invalid')
  return values.map(row)
}
export async function verifyLandingRegistration(resolved:unknown,env:Env):Promise<boolean>{
  const result=row(resolved),snapshot=row(result.snapshot),landing=row(snapshot.public_landing),design=row(landing.design)
  const webpacKey=text(result.pac_key),designKey=text(design.pac_key),designHash=text(design.registration_sha256)
  if(result.standing!=='ACT'||!webpacKey||!designKey||!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return false
  const [pacs,receipts,relations,components]=await Promise.all([
    registeredRows(env,'c3_pac',{pac_key:'eq.'+designKey,is_effective:'eq.true',superseded_at:'is.null'},'pac_key,pac_type,registration_protocol,registration_sha256,boundary_evaluation_key,release_state,authority_effect'),
    registeredRows(env,'c3_pac_registration_receipt',{pac_key:'eq.'+designKey,standing:'eq.registered',registration_sha256:'eq.'+designHash},'pac_key,boundary_evaluation_key,registration_sha256'),
    registeredRows(env,'c3_pac_relation',{source_pac_key:'eq.'+webpacKey,target_kind:'eq.pac',target_key:'eq.'+designKey,relation_type:'eq.source_package',standing:'eq.active'},'relation_key'),
    registeredRows(env,'c3_pac_member',{pac_key:'eq.'+designKey,member_role:'eq.design_component',standing:'eq.active'},'integrity_value,custody_location')
  ])
  if(pacs.length!==1||receipts.length!==1||relations.length!==1||
    pacs[0].pac_type!=='DesignPac'||pacs[0].registration_protocol!=='registrar_v1'||pacs[0].registration_sha256!==designHash||
    pacs[0].release_state!=='public_release_authorized'||pacs[0].authority_effect!=='none'||
    pacs[0].boundary_evaluation_key!==receipts[0].boundary_evaluation_key||
    !components.some(component=>component.integrity_value===design.source_sha256&&text(component.custody_location))||
    design.source_sha256!=='2089daf7d3a4715dd91afc2fc9f3120384d81486a9b82fb1ef9cd9ea9e3e1a45')return false
  const evaluations=await registeredRows(env,'c3_pac_boundary_evaluation',{evaluation_key:'eq.'+text(pacs[0].boundary_evaluation_key)},'notchazz_result,presented_registration_sha256')
  if(evaluations.length!==1||evaluations[0].notchazz_result!=='PASS'||evaluations[0].presented_registration_sha256!==designHash)return false
  const media=[row(row(landing.seo).image),...(Array.isArray(landing.chapters)?landing.chapters.map(value=>row(row(value).media)).filter(value=>text(value.runtime_uri)):[])]
  for(const asset of media){
    const match=/^\/api\/free-media\?asset=([a-zA-Z0-9_-]+)$/.exec(text(asset.runtime_uri))
    if(!match)return false
    const assets=await registeredRows(env,'c3ops_asset_record',{asset_key:'eq.'+match[1],owning_system_key:'eq.c3_field'},'asset_key,standing,hash_algorithm,content_hash,src_key,license_or_use_rights,free_eligibility,current_free_binding,public_retrieval_standing')
    const record=assets[0]
    if(assets.length!==1||!['operator_approved_webpac_reference','operator_approved_default_environment_visual'].includes(text(record.standing))||
      record.hash_algorithm!=='sha256'||record.content_hash!==asset.sha256||record.free_eligibility!==true||
      record.current_free_binding!==asset.runtime_uri||record.public_retrieval_standing!=='bounded_public_runtime'||
      !text(record.src_key)||!text(record.license_or_use_rights))return false
    const [sources,members]=await Promise.all([
      registeredRows(env,'codex_source_reference',{source_key:'eq.'+text(record.src_key),source_status:'eq.committed'},'source_key,source_hash'),
      registeredRows(env,'c3_pac_member',{pac_key:'eq.'+webpacKey,standing:'eq.active',runtime_uri:'eq.'+text(asset.runtime_uri)},'integrity_algorithm,integrity_value')
    ])
    if(sources.length!==1||!text(sources[0].source_hash)||members.length!==1||members[0].integrity_algorithm!=='sha256'||members[0].integrity_value!==asset.sha256)return false
  }
  return true
}
export async function fieldOfPossibilityResponse(request:Request,env:Env):Promise<Response|null>{
  const url=new URL(request.url)
  if(!['c3field.online','www.c3field.online'].includes(url.hostname)||url.pathname!=="/"||!["GET","HEAD"].includes(request.method))return null
  if(url.hostname==='www.c3field.online')return new Response(null,{status:308,headers:{location:'https://c3field.online/'}})
  const held=()=>new Response(request.method==='HEAD'?null:dnrDocument(),{status:503,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-c3-public-resolution':'DNR'}})
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return held()
  try{
    const response=await fetch(new URL("/rest/v1/rpc/free_resolve_registered_webpac_v1",env.SUPABASE_URL),{
      method:"POST",redirect:"error",signal:AbortSignal.timeout(12000),
      headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},
      body:JSON.stringify({p_host:url.hostname})
    })
    if(!response.ok)return held()
    const resolved:unknown=await response.json()
    const html=renderFieldOfPossibility(resolved)
    if(!html||!await verifyLandingRegistration(resolved,env))return held()
    return new Response(request.method==="HEAD"?null:html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","x-c3-public-resolution":"registered-free-snapshot"}})
  }catch{return held()}
}
const styles=`:root{--c3-obsidian:#151917;--c3-earth:#665447;--c3-moss:#596B50;--c3-sage:#A8B49B;--c3-ivory:#F2EFE6;--c3-marble:#E5E2D9;--c3-luminous:#D5C58C;--c3-text-dark:#20251F;--c3-text-light:#F2EFE6;--c3-border:rgba(242,239,230,.18);--c3-overlay:rgba(21,25,23,.48);--c3-font-display:Georgia,serif;--c3-font-body:system-ui,sans-serif;--c3-display-xl:clamp(3rem,7vw,7rem);--c3-display-lg:clamp(2rem,4.5vw,4rem);--c3-heading:clamp(1.35rem,2vw,2rem);--c3-body:clamp(1rem,1.2vw,1.125rem);--c3-reading-width:65ch;--c3-page-gutter:clamp(1.25rem,5vw,6rem);--c3-section-space:clamp(3rem,8vw,8rem);--c3-content-width:1440px;--c3-radius:.5rem;--c3-motion-fast:180ms;--c3-motion-standard:400ms;--c3-motion-slow:800ms;--c3-ease:cubic-bezier(.22,1,.36,1)}*{box-sizing:border-box}body{margin:0;background:var(--c3-obsidian);color:var(--c3-text-light);font:var(--c3-body)/1.65 var(--c3-font-body)}.c3-chapter{position:relative;min-block-size:100svh;padding:var(--c3-section-space) var(--c3-page-gutter);display:grid;align-content:center;isolation:isolate}.c3-content{width:100%;max-width:var(--c3-content-width);margin-inline:auto}.c3-reading{max-width:var(--c3-reading-width);line-height:1.65}h1,h2,h3{font-family:var(--c3-font-display);font-weight:400;line-height:1.1;overflow-wrap:anywhere}h1{font-size:var(--c3-display-xl);max-width:14ch}h2{font-size:var(--c3-display-lg)}h3{font-size:var(--c3-heading)}a{color:var(--c3-ivory);text-underline-offset:.25em;display:inline-block;padding:.65rem .2rem;min-height:44px}a:focus-visible{outline:3px solid var(--c3-luminous);outline-offset:5px}.c3-actions,nav{display:flex;gap:1.5rem;flex-wrap:wrap}.c3-actions{margin-top:2rem}.c3-actions a:first-child{background:var(--c3-ivory);color:var(--c3-text-dark);padding:.8rem 1.4rem;border-radius:var(--c3-radius)}.c3-possibility-mosaic,.c3-field-mosaic{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1rem,2vw,2rem)}.c3-main-nav{position:sticky;top:0;z-index:5;padding:.5rem var(--c3-page-gutter);background:var(--c3-obsidian);border-block:1px solid var(--c3-border)}.c3-main-nav a:last-child{margin-inline-start:auto}.c3-chapter{scroll-margin-top:6rem}.c3-headline{font-family:var(--c3-font-display);font-size:var(--c3-heading)}article{min-width:0;padding-block:1rem}.c3-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;opacity:.3}.c3-chapter:nth-child(even){background-color:#20251F}.c3-skip{position:fixed;top:-10rem;left:1rem;background:var(--c3-ivory);color:var(--c3-text-dark);z-index:10}.c3-skip:focus{top:1rem}footer{padding:3rem var(--c3-page-gutter);border-top:1px solid var(--c3-border)}@media(max-width:900px){.c3-main-nav{position:static}.c3-chapter{scroll-margin-top:1rem}.c3-possibility-mosaic{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.c3-possibility-mosaic,.c3-field-mosaic{grid-template-columns:minmax(0,1fr)}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}`
