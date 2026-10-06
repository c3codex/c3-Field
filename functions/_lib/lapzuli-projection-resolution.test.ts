import test from 'node:test'
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {dirname,resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {readLapzuli,type Row} from './me-environment'
import {handleRead} from '../api/c3ops/manifest'
import projectionAuthority from './fixtures/lapzuli-projection-authority.json'
import report from './lapzuli-registrar-report.json'

const require=createRequire(import.meta.url),root=resolve(dirname(fileURLToPath(import.meta.url)),'../..')
const ui=resolve(root,'src/c3ops/C3OpsDoor.tsx')
const bundle=require('esbuild').buildSync({stdin:{contents:readFileSync(ui,'utf8')+'\nexport {LapzuliDesk,LapzuliProjectionOptics,CampaignSummary};',sourcefile:ui,resolveDir:dirname(ui),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',loader:{'.css':'empty'},packages:'external'}).outputFiles[0].text
const Module=require('node:module'),compiled=new Module(ui+'.cjs');compiled.paths=Module._nodeModulePaths(dirname(ui));compiled._compile(bundle,ui+'.cjs')
const {createElement}=require('react'),{renderToStaticMarkup}=require('react-dom/server')
const html=(component:string,props:unknown)=>renderToStaticMarkup(createElement(compiled.exports[component],props))

function fixture() {
 const rows:Record<string,Row[]>={
  c3_registrar_publication_authority:[structuredClone(projectionAuthority)],
  measures_publication_campaign:[{campaign_key:'issue003',publication_key:'undrifted',campaign_name:'Issue003',status:'historical_campaign_status',release_state:'held_paragraph_process_inactive_executor_held',review_status:'operator_approved',metadata:{activation_operator:'op044',campaign_pac_key:'pac',external_distribution_authorized:true,adapter_strategy:{paragraph:'held_paragraph_process_inactive_executor_held'}}}],
  measures_publication_distribution_asset:[{distribution_asset_key:'paragraph_new',campaign_id:'issue003',publication_asset_id:'publication',status:'ready_for_operator_execution',review_status:'operator_approved',platform:'paragraph',distribution_type:'canonical_crosspost',metadata:{derivative_key:'caption',campaign_pac_key:'pac',registered_standing_key:'standing',route_key:'route',channel_key:'paragraph_undrifted',executor_key:'paragraph_api',operator_confirmed:true,external_distribution_authorized:true},payload:{text:'Exact approved fixture',canonical_url:'https://example.invalid/source'}}],
  measures_publication_derivative_asset:[{derivative_key:'caption',approval_status:'operator_approved',release_state:'released'}],
  lapzuli_derivative_execution_view_v1:[{distribution_asset_key:'paragraph_new',lapzuli_callable:true,registered_standing_key:'standing'}],
  lapzuli_route:[{route_key:'route',payload_reference:'paragraph_new',publication_object_key:'publication',route_status:'authorized',operator_confirmed:true,outlet_key:'paragraph',desk_key:'drift_report',distribution_mode:'canonical_crosspost',metadata:{campaign_pac_key:'pac'}}],
  lapzuli_outlet:[{outlet_key:'paragraph',account_standing:'verified',submission_mode:'canonical_crosspost',metadata:{adapter:'direct_paragraph_api_v1'}}],
  lapzuli_outlet_qualification:[{outlet_key:'paragraph',desk_key:'drift_report',distribution_mode:'canonical_crosspost',standing:'qualified_with_constraints',operator_disposition_required:true}],
  measures_distribution_channel:[{channel_key:'paragraph_undrifted',status:'active',channel_identifier:'registered_publication'}],
  measures_distribution_executor:[{executor_key:'paragraph_api',status:'available',supports_publish:true}],
  c3_pac:[{pac_key:'pac',pac_type:'CampaignPac',is_effective:true,standing:'registered',metadata:{public_speaking_identity:'unDrifted',source_pubpac:'pubpac'}}],
  measures_distribution_execution:[],lapzuli_encounter_evidence:[],
 }
 return {rows,read:async(table:string)=>rows[table]??[],asset:rows.measures_publication_distribution_asset[0],campaign:rows.measures_publication_campaign[0]}
}
const only=(packet:Awaited<ReturnType<typeof readLapzuli>>)=>packet.campaigns[0].assets[0]

test('Issue001 CURRENT mixed trace derives 12 assets, four published and eight held without rewriting campaign evidence',async()=>{
 const f=fixture();f.campaign.campaign_key='issue001';f.campaign.release_state='release_ready';f.campaign.status='ready_for_export';f.rows.measures_publication_distribution_asset=Array.from({length:12},(_,i)=>({distribution_asset_key:'asset_'+i,campaign_id:'issue001',status:'ready_for_export',review_status:'oar2_authorized'}));f.rows.measures_distribution_execution=Array.from({length:4},(_,i)=>({execution_id:'published_'+i,distribution_asset_id:'asset_'+i,execution_status:'published',published_at:'2026-07-01T00:00:00Z'}))
 const before=JSON.stringify(f.rows),packet=await readLapzuli(f.read),campaign=packet.campaigns[0]
 assert.deepEqual(campaign.counts,{assets:12,distributed:4,accepted:0,ready:0,held:8});assert.equal(campaign.standing,'active_trace');assert.equal(campaign.release_state,'active_trace');assert.equal(campaign.historical?.release_state,'release_ready');assert.equal(JSON.stringify(f.rows),before)
 const summary=html('CampaignSummary',{campaign});assert.doesNotMatch(summary.split('<details')[0],/release_ready|ready_for_export/);assert.match(summary,/Historical campaign evidence/);assert.match(summary,/release_ready/)
 const optics=html('LapzuliProjectionOptics',{lapzuli:packet});assert.ok(optics.includes(summary));assert.doesNotMatch(optics,/<button/)
})

test('CURRENT Paragraph outlet, qualification and adapter outrank stale copied campaign metadata',async()=>{
 const f=fixture(),before=JSON.stringify(f.rows),packet=await readLapzuli(f.read),a=only(packet)
 assert.equal(a.distribution_state,'ready_for_operator_execution');assert.equal(a.outlet?.account_standing,'verified');assert.equal(a.outlet?.submission_mode,'canonical_crosspost');assert.equal((a.outlet?.metadata as Row).adapter,'direct_paragraph_api_v1');assert.equal(a.qualification?.standing,'qualified_with_constraints');assert.equal(packet.campaigns[0].standing,'ready_for_operator_execution');assert.equal(JSON.stringify(f.rows),before)
 const desk=html('LapzuliDesk',{lapzuli:packet,onRefresh:async()=>{}}),optics=html('LapzuliProjectionOptics',{lapzuli:packet}),summary=html('CampaignSummary',{campaign:packet.campaigns[0]})
 assert.ok(desk.includes(summary)&&optics.includes(summary));assert.match(desk,/direct_paragraph_api_v1/);assert.match(optics,/direct_paragraph_api_v1/);assert.doesNotMatch(optics,/<button|Dispatch now|Resolve CampaignPAC → Lapzuli/)
})

test('published execution survives a later failed attempt and stale ready asset; no duplicate actions appear',async()=>{
 const f=fixture();f.rows.measures_distribution_execution=[{execution_id:'first',distribution_asset_id:'paragraph_new',execution_status:'published',executed_at:'2026-09-01T00:00:00Z',platform_url:'https://example.invalid/published'},{execution_id:'later',distribution_asset_id:'paragraph_new',execution_status:'failed',executed_at:'2026-10-01T00:00:00Z'}]
 const packet=await readLapzuli(f.read);assert.equal(only(packet).distribution_state,'distributed');assert.equal(only(packet).latest_execution?.execution_status,'failed');assert.doesNotMatch(html('LapzuliDesk',{lapzuli:packet,onRefresh:async()=>{}}),/>Dispatch now<|>Preflight<|Resolve CampaignPAC → Lapzuli/)
})

test('published encounter evidence alone prevents duplicate dispatch without editing the historical record',async()=>{
 const f=fixture();f.rows.lapzuli_encounter_evidence=[{encounter_id:'receipt',route_key:'route',observed_outcome:'published',external_url:'https://paragraph.com/@undrifted/already-published'}];const before=JSON.stringify(f.rows),packet=await readLapzuli(f.read)
 assert.equal(only(packet).distribution_state,'distributed');assert.equal(only(packet).publication_evidence.length,1);assert.equal(JSON.stringify(f.rows),before);assert.doesNotMatch(html('LapzuliDesk',{lapzuli:packet,onRefresh:async()=>{}}),/>Dispatch now<|>Preflight</)
})

test('provider queued proof is accepted, not published; a later failure is not overridden by historical queue evidence',async()=>{
 const f=fixture();f.rows.measures_distribution_execution=[{distribution_asset_id:'paragraph_new',execution_status:'queued',executed_at:'2026-09-01T00:00:00Z',platform_url:'https://example.invalid/receipt'}];assert.equal(only(await readLapzuli(f.read)).distribution_state,'accepted_pending_platform_proof')
 f.rows.measures_distribution_execution.push({distribution_asset_id:'paragraph_new',execution_status:'failed',executed_at:'2026-10-01T00:00:00Z'});assert.notEqual(only(await readLapzuli(f.read)).distribution_state,'accepted_pending_platform_proof')
})

test('missing or conflicting CURRENT resolution owner fails closed before executable presentation',async()=>{
 for(const mutate of [(f:ReturnType<typeof fixture>)=>f.rows.c3_registrar_publication_authority=[],(f:ReturnType<typeof fixture>)=>(f.rows.c3_registrar_publication_authority[0].metadata as any).lapzuli_projection_resolution_v1.outlet_account_owner='campaign_metadata',(f:ReturnType<typeof fixture>)=>f.rows.c3_registrar_publication_authority.push(structuredClone(projectionAuthority))]){const f=fixture();mutate(f);const packet=await readLapzuli(f.read);assert.equal(packet.projection_authority.standing,'HLD');assert.equal(only(packet).distribution_state,'held');assert.doesNotMatch(html('LapzuliDesk',{lapzuli:packet,onRefresh:async()=>{}}),/>Dispatch now<|>Preflight</)}
})

test('missing exact desk/mode qualification and unverified account remain independent CURRENT holds',async()=>{
 for(const[reason,mutate]of [['current_desk_outlet_qualification_unresolved',(f:ReturnType<typeof fixture>)=>f.rows.lapzuli_outlet_qualification[0].distribution_mode='obsolete_mode'],['current_outlet_account_unverified',(f:ReturnType<typeof fixture>)=>f.rows.lapzuli_outlet[0].account_standing='unknown'],['current_outlet_unresolved',(f:ReturnType<typeof fixture>)=>f.rows.lapzuli_outlet=[]]] as const){const f=fixture();mutate(f);const a=only(await readLapzuli(f.read));assert.equal(a.distribution_state,'held');assert.ok(a.blockers.includes(reason))}
})

test('legitimate Paragraph backlog remains visible with exact Chazz review requirement and no execution controls',async()=>{
 const f=fixture();f.asset.review_status='chazz_review_required';const packet=await readLapzuli(f.read),a=only(packet)
 assert.equal(a.distribution_asset_key,'paragraph_new');assert.equal(a.distribution_state,'held');assert.ok(a.blockers.includes('chazz_review_required'));assert.equal(a.outlet?.account_standing,'verified');assert.doesNotMatch(html('LapzuliDesk',{lapzuli:packet,onRefresh:async()=>{}}),/>Dispatch now<|>Preflight</)
})

test('Registrar report is consumed as exact documentary evidence and live resolution is separately exposed',async()=>{
 assert.equal(createHash('sha256').update(Buffer.from(report.content,'utf8')).digest('hex'),report.text_sha256)
 const packet=await readLapzuli(fixture().read);assert.equal(packet.projection_authority.registrar_report.drive_id,'15QItcUJUiAAqACa3hS4Z-4TMXGbxZEQ2Y2JMceSm_g4');assert.equal(packet.projection_authority.resolution.standing,'registered_effective');assert.equal(packet.projection_authority.mutation_authority,false)
 assert.match(html('LapzuliProjectionOptics',{lapzuli:packet}),/Registrar report · historical evidence/)
})

test('production manifest CURRENT projection path makes Registry reads only and no Resolve, Preflight or Dispatch',async()=>{
 const f=fixture(),calls:string[]=[],before=JSON.stringify(f.rows),original=globalThis.fetch
 globalThis.fetch=(async(input,init)=>{const url=new URL(String(input));assert.equal(url.hostname,'registry.fixture.invalid');assert.equal(init?.method??'GET','GET');const table=url.pathname.split('/').pop()!;calls.push(table);return Response.json(f.rows[table]??[])}) as typeof fetch
 try{const response=await handleRead(new Request('https://c3ops.c3field.online/api/c3ops/manifest?view=lapzuli'),{SUPABASE_URL:'https://registry.fixture.invalid',SUPABASE_SERVICE_ROLE_KEY:'isolated_fixture_only'});const body=await response.json();assert.equal(response.status,200);assert.equal(body.projection_authority.standing,'registered_effective');assert.ok(calls.includes('lapzuli_outlet')&&calls.includes('lapzuli_outlet_qualification')&&calls.includes('c3_registrar_publication_authority'));assert.equal(JSON.stringify(f.rows),before)}finally{globalThis.fetch=original}
})
