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
  const sections=chapters.map((chapter,index)=>{
    const paragraphs=(Array.isArray(chapter.paragraphs)?chapter.paragraphs:[]).map(p=>`<p>${escape(p)}</p>`).join("")
    const items=(Array.isArray(chapter.items)?chapter.items:[]).map(row).map(item=>`<article><h3>${escape(item.heading)}</h3><p>${escape(item.body)}</p>${links(item.links)}</article>`).join("")
    const media=row(chapter.media),uri=text(media.runtime_uri)
    const image=/^\/api\/free-media\?asset=[a-zA-Z0-9_-]+$/.test(uri)&&/^[a-f0-9]{64}$/.test(text(media.sha256))&&text(media.alt)
      ?`<img class="c3-media" src="${escape(uri)}" alt="${escape(media.alt)}" ${index===0?'fetchpriority="high"':'loading="lazy"'} width="${Number.isInteger(media.width)&&Number(media.width)>0?media.width:1600}" height="${Number.isInteger(media.height)&&Number(media.height)>0?media.height:900}"/>`:""
    const heading=index===0?"h1":"h2"
    return `<section id="${ids[index]}" class="c3-chapter">${image}<div class="c3-content"><${heading}>${escape(chapter.heading)}</${heading}><div class="c3-reading">${paragraphs}</div>${items?`<div class="${index===2?'c3-possibility-mosaic':'c3-field-mosaic'}">${items}</div>`:""}<div class="c3-actions">${links(chapter.actions)}</div></div></section>`
  }).join("")
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escape(seo.title)}</title><meta name="description" content="${escape(seo.description)}"/><link rel="canonical" href="https://c3field.online/"/><meta property="og:title" content="${escape(seo.og_title||seo.title)}"/><meta property="og:description" content="${escape(seo.og_description||seo.description)}"/><meta property="og:type" content="website"/><meta property="og:url" content="https://c3field.online/"/>${socialHead}<style>${styles}</style></head><body class="c3-public-landing"><a class="c3-skip" href="#arrival">Skip to content</a><main>${sections}</main><footer><nav aria-label="Public navigation">${links(landing.navigation)}</nav><p>${escape(identity.legal_entity)}</p><nav aria-label="Legal"><a href="${escape(href(identity.privacy_url))}">Privacy</a><a href="${escape(href(identity.terms_url))}">Terms</a><a href="${escape(href(identity.contact_url))}">Contact</a></nav></footer></body></html>`
}
export async function fieldOfPossibilityResponse(request:Request,env:Env):Promise<Response|null>{
  const url=new URL(request.url)
  if(url.hostname!=="c3field.online"||url.pathname!=="/"||!["GET","HEAD"].includes(request.method))return null
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return null
  try{
    const response=await fetch(new URL("/rest/v1/rpc/free_resolve_registered_webpac_v1",env.SUPABASE_URL),{
      method:"POST",redirect:"error",signal:AbortSignal.timeout(12000),
      headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},
      body:JSON.stringify({p_host:url.hostname})
    })
    if(!response.ok)return null
    const html=renderFieldOfPossibility(await response.json())
    if(!html)return null
    return new Response(request.method==="HEAD"?null:html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","x-c3-public-resolution":"registered-free-snapshot"}})
  }catch{return null}
}
const styles=`:root{--c3-obsidian:#151917;--c3-earth:#665447;--c3-moss:#596B50;--c3-sage:#A8B49B;--c3-ivory:#F2EFE6;--c3-marble:#E5E2D9;--c3-luminous:#D5C58C;--c3-text-dark:#20251F;--c3-text-light:#F2EFE6;--c3-border:rgba(242,239,230,.18);--c3-overlay:rgba(21,25,23,.48);--c3-font-display:Georgia,serif;--c3-font-body:system-ui,sans-serif;--c3-display-xl:clamp(3rem,7vw,7rem);--c3-display-lg:clamp(2rem,4.5vw,4rem);--c3-heading:clamp(1.35rem,2vw,2rem);--c3-body:clamp(1rem,1.2vw,1.125rem);--c3-reading-width:65ch;--c3-page-gutter:clamp(1.25rem,5vw,6rem);--c3-section-space:clamp(3rem,8vw,8rem);--c3-content-width:1440px;--c3-radius:.5rem;--c3-motion-fast:180ms;--c3-motion-standard:400ms;--c3-motion-slow:800ms;--c3-ease:cubic-bezier(.22,1,.36,1)}*{box-sizing:border-box}body{margin:0;background:var(--c3-obsidian);color:var(--c3-text-light);font:var(--c3-body)/1.65 var(--c3-font-body)}.c3-chapter{position:relative;min-block-size:100svh;padding:var(--c3-section-space) var(--c3-page-gutter);display:grid;align-content:center;isolation:isolate}.c3-content{width:100%;max-width:var(--c3-content-width);margin-inline:auto}.c3-reading{max-width:var(--c3-reading-width);line-height:1.65}h1,h2,h3{font-family:var(--c3-font-display);font-weight:400;line-height:1.1;overflow-wrap:anywhere}h1{font-size:var(--c3-display-xl);max-width:14ch}h2{font-size:var(--c3-display-lg)}h3{font-size:var(--c3-heading)}a{color:var(--c3-ivory);text-underline-offset:.25em;display:inline-block;padding:.65rem .2rem;min-height:44px}a:focus-visible{outline:3px solid var(--c3-luminous);outline-offset:5px}.c3-actions,nav{display:flex;gap:1.5rem;flex-wrap:wrap}.c3-actions{margin-top:2rem}.c3-actions a:first-child{background:var(--c3-ivory);color:var(--c3-text-dark);padding:.8rem 1.4rem;border-radius:var(--c3-radius)}.c3-possibility-mosaic,.c3-field-mosaic{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1rem,2vw,2rem)}article{min-width:0;padding-block:1rem}.c3-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;opacity:.3}.c3-chapter:nth-child(even){background-color:#20251F}.c3-skip{position:fixed;top:-10rem;left:1rem;background:var(--c3-ivory);color:var(--c3-text-dark);z-index:10}.c3-skip:focus{top:1rem}footer{padding:3rem var(--c3-page-gutter);border-top:1px solid var(--c3-border)}@media(max-width:900px){.c3-possibility-mosaic{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.c3-possibility-mosaic,.c3-field-mosaic{grid-template-columns:minmax(0,1fr)}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}`
