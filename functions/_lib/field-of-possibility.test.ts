import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFileSync} from 'node:fs'
import {renderFieldOfPossibility,fieldOfPossibilityResponse,verifyLandingRegistration} from './field-of-possibility.ts'
// Synthetic admitted projection tests the renderer, not Registry admission.
function fixture(){return {standing:'ACT',free_call_key:'c3_public_webpac_encounter',snapshot:{canonical_host:'c3field.online',canonical_path:'/',release_state:'public',authority_effect:'none',frontend_invention:false,public_landing:{format:'c3field_field_of_possibility_v1',design:{pac_key:'c3field_public_landing_designpac_v1',registration_sha256:'a'.repeat(64)},identity:{legal_entity:'c3 Community Partners DAO, LLC',privacy_url:'https://c3field.online/privacy',terms_url:'https://c3field.online/terms',contact_url:'https://c3field.online/contact'},seo:{image:{runtime_uri:'/api/free-media?asset=registered_social',sha256:'b'.repeat(64),width:1200,height:630},title:'c3 Field — A Field of Possibility',description:'Connect. Contribute. Create.',canonical_url:'https://c3field.online/'},chapters:['arrival','current-state','possibilities','explore','principles','founders-ground','closing'].map(id=>({id,heading:id,paragraphs:['Approved text'],actions:[{label:'Enter Current State',href:'https://my.c3field.online/'}]}))}}}}
test('all seven chapters and enrollment are indexable without JavaScript',()=>{const html=renderFieldOfPossibility(fixture())!;assert.ok(html);assert.equal((html.match(/<h1>/g)||[]).length,1);assert.equal((html.match(/<section /g)||[]).length,7);assert.match(html,/https:\/\/my.c3field.online\//);assert.equal((html.match(/<script/g)||[]).length,1);assert.match(html,/<script type="application\/ld\+json">/);assert.match(html,/prefers-reduced-motion/);assert.match(html,/Skip to content/)})
test('unadmitted, private and mismatched projections never render',()=>{for(const change of [(f:any)=>f.standing='DNR',(f:any)=>f.snapshot.release_state='private',(f:any)=>f.snapshot.frontend_invention=true,(f:any)=>f.snapshot.canonical_host='my.c3field.online',(f:any)=>f.snapshot.public_landing.design.registration_sha256='',(f:any)=>f.snapshot.public_landing.chapters.pop()]){const f=fixture();change(f);assert.equal(renderFieldOfPossibility(f),null)}})
test('copy is escaped and unsafe navigation/media are excluded',()=>{const f=fixture();Object.assign(f.snapshot.public_landing.chapters[0],{heading:'<script>alert(1)</script>',actions:[{label:'unsafe',href:'javascript:alert(1)'}],media:{runtime_uri:'https://private.invalid/object',sha256:'a'.repeat(64),alt:'private'}});const html=renderFieldOfPossibility(f)!;assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/javascript:|private.invalid|<script>/)})
test('participant and operational hosts are never intercepted',async()=>{for(const host of ['my.c3field.online','c3ops.c3field.online'])assert.equal(await fieldOfPossibilityResponse(new Request(`https://${host}/`),{}),null);assert.equal(await fieldOfPossibilityResponse(new Request('https://c3field.online/api/my-environment'),{}),null)})
test('missing configuration, refused or private projections return a terminal DNR response',async()=>{
  const request=new Request('https://c3field.online/')
  assert.equal((await fieldOfPossibilityResponse(request,{}))?.status,503)
  const original=globalThis.fetch
  try{for(const value of [{standing:'DNR',snapshot:{private_secret:'never expose'}},{...fixture(),snapshot:{...fixture().snapshot,release_state:'private'}}]){
    globalThis.fetch=async()=>Response.json(value)
    const response=await fieldOfPossibilityResponse(request,{SUPABASE_URL:'https://registry.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture-only'})
    assert.equal(response?.status,503);assert.doesNotMatch(await response!.text(),/never expose|Approved text/)
  }}finally{globalThis.fetch=original}
})
test('www root redirects to the canonical registered surface',async()=>{const response=await fieldOfPossibilityResponse(new Request('https://www.c3field.online/'),{});assert.equal(response?.status,308);assert.equal(response?.headers.get('location'),'https://c3field.online/')})
function registrationFixture(){const f:any=fixture();f.pac_key='qualified-webpac';f.snapshot.public_landing.design.source_sha256='2089daf7d3a4715dd91afc2fc9f3120384d81486a9b82fb1ef9cd9ea9e3e1a45';return f}
function registeredFetch(f:any,missing=''){return async(input:RequestInfo|URL)=>{
  const name=new URL(String(input)).pathname.split('/').pop()
  if(name===missing)return Response.json([])
  const hash=f.snapshot.public_landing.design.registration_sha256
  const records:Record<string,unknown[]>={c3_pac:[{pac_type:'DesignPac',registration_protocol:'registrar_v1',registration_sha256:hash,boundary_evaluation_key:'evaluation',release_state:'public',authority_effect:'none'}],c3_pac_registration_receipt:[{registration_sha256:hash,boundary_evaluation_key:'evaluation'}],c3_pac_relation:[{relation_key:'registered-companion'}],c3_pac_boundary_evaluation:[{notchazz_result:'PASS',presented_registration_sha256:hash}],c3ops_asset_record:[{standing:'operator_approved_webpac_reference',hash_algorithm:'sha256',content_hash:'b'.repeat(64),free_eligibility:true,current_free_binding:'/api/free-media?asset=registered_social',public_retrieval_standing:'bounded_public_runtime',src_key:'registered-source',license_or_use_rights:'fixture-qualified-rights'}],codex_source_reference:[{source_key:'registered-source',source_hash:'fixture-committed-source'}]}
  if(name==='c3_pac_member'){const role=new URL(String(input)).searchParams.get('member_role');return Response.json(role?[{integrity_value:f.snapshot.public_landing.design.source_sha256,custody_location:'fixture-custody'}]:[{integrity_algorithm:'sha256',integrity_value:'b'.repeat(64)}])}
  return Response.json(records[name!]||[])
}}
test('companion registration, source custody, relation and media predicates are required independently',async()=>{
 const original=globalThis.fetch;const f=registrationFixture();const env={SUPABASE_URL:'https://registry.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture-only'}
 try{globalThis.fetch=registeredFetch(f);assert.equal(await verifyLandingRegistration(f,env),true)
  for(const missing of ['c3_pac','c3_pac_registration_receipt','c3_pac_relation','c3_pac_boundary_evaluation','c3ops_asset_record','codex_source_reference']){globalThis.fetch=registeredFetch(f,missing);assert.equal(await verifyLandingRegistration(f,env),false,missing)}
 }finally{globalThis.fetch=original}
})
test('approved source candidate retains seven chapters, full categories, navigation and truthful SEO',()=>{
 const candidate=JSON.parse(readFileSync(new URL('../../governance/qualification/field-legacy-succession-20261125/approved-landing-content.candidate.json',import.meta.url),'utf8'))
 assert.equal(candidate.standing,'SOURCE_CANDIDATE_NOT_REGISTERED')
 const f:any=fixture();f.snapshot.public_landing=candidate.public_landing
 // Synthetic bindings only for isolated rendering; candidate remains unregistered.
 f.snapshot.public_landing.design.registration_sha256='a'.repeat(64)
 f.snapshot.public_landing.seo.image={runtime_uri:'/api/free-media?asset=fixture',sha256:'b'.repeat(64),width:1200,height:630}
 const html=renderFieldOfPossibility(f)!
 assert.ok(html);assert.match(html,/Connect. Contribute. Create./);assert.match(html,/Research &amp; Education/)
 assert.match(html,/Bring your own ground./);assert.match(html,/api\/my-environment-access-link/)
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1])
 assert.deepEqual(graph['@graph'].map((v:any)=>v['@type']),['Organization','WebSite','WebPage'])
 assert.doesNotMatch(html,/SoftwareApplication|aggregateRating/)
 assert.ok(html.indexOf('class="c3-main-nav"')>html.indexOf('id="arrival"'))
})
test('hosting middleware never falls through to legacy content on landing refusal',async()=>{
 const {onRequest}=await import('../_middleware')
 let fallback=false
 const response=await onRequest({request:new Request('https://c3field.online/',{headers:{accept:'text/html'}}),env:{},next:async()=>{fallback=true;return new Response('legacy-public-content')}} as never)
 assert.equal(response.status,503);assert.equal(fallback,false);assert.doesNotMatch(await response.text(),/legacy-public-content/)
})
