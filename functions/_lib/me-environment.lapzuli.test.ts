import test from "node:test"
import assert from "node:assert/strict"
import {readFileSync} from "node:fs"
import {createRequire} from "node:module"
import {dirname,resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {readLapzuli,type Row,type ReadRows} from "./me-environment"
import {handleLapzuliAction} from "../api/c3ops/lapzuli"

const require=createRequire(import.meta.url),root=resolve(dirname(fileURLToPath(import.meta.url)),"../..")
// Compile the actual existing desk for server rendering; the extra export is test-only.
const uiPath=resolve(root,"src/c3ops/C3OpsDoor.tsx")
const built=require("esbuild").buildSync({stdin:{contents:readFileSync(uiPath,"utf8")+"\nexport {LapzuliDesk};",sourcefile:uiPath,resolveDir:dirname(uiPath),loader:"tsx"},bundle:true,write:false,platform:"node",format:"cjs",jsx:"automatic",loader:{".css":"empty"},packages:"external"}).outputFiles[0].text
const Module=require("node:module"),compiled=new Module(uiPath+".cjs");compiled.paths=Module._nodeModulePaths(dirname(uiPath));compiled._compile(built,uiPath+".cjs")
const {createElement}=require("react"),{renderToStaticMarkup}=require("react-dom/server")
const markup=(packet:Awaited<ReturnType<typeof readLapzuli>>)=>renderToStaticMarkup(createElement(compiled.exports.LapzuliDesk,{lapzuli:packet,onRefresh:async()=>{}}))

function fixture() {
 const rows:Record<string,Row[]>={
  measures_publication_campaign:[{campaign_key:"campaign",publication_key:"undrifted",issue_id:"issue003",campaign_name:"Issue 003",status:"active",review_status:"operator_approved",release_state:"authorized_pending_lapzuli_execution",metadata:{activation_operator:"op044",campaign_pac_key:"pac",external_distribution_authorized:true}}],
  measures_publication_distribution_asset:[{distribution_asset_key:"asset",campaign_id:"campaign",publication_asset_id:"publication",platform:"bluesky",distribution_type:"social_source_link",status:"ready_for_lapzuli_resolution",review_status:"operator_approved",metadata:{campaign_pac_key:"pac",derivative_key:"derivative",channel_key:"bluesky_undrifted",executor_key:"bluesky_api",route_key:"route",operator_confirmed:true,external_distribution_authorized:true},payload:{text:"Exact approved text",canonical_url:"https://measuresregistry.com/article"}}],
  measures_publication_derivative_asset:[{derivative_key:"derivative",approval_status:"operator_approved",review_status:"approved",release_state:"released",metadata:{}}],
  lapzuli_route:[{route_key:"route",publication_object_key:"publication",payload_reference:"asset",route_status:"authorized",operator_confirmed:true,outlet_key:"bluesky",metadata:{campaign_pac_key:"pac"}}],
  measures_distribution_channel:[{channel_key:"bluesky_undrifted",status:"active",channel_identifier:"undrifted.bsky.social"}],
  measures_distribution_executor:[{executor_key:"bluesky_api",status:"available",supports_publish:true}],
  c3_pac:[{pac_key:"pac",pac_type:"CampaignPac",is_effective:true,standing:"registered",metadata:{public_speaking_identity:"unDrifted",source_pubpac:"pubpac"}}],
  lapzuli_derivative_execution_view_v1:[],measures_distribution_execution:[],lapzuli_encounter_evidence:[],registered_process_log:[],
 }
 const read:ReadRows=async table=>rows[table]??[]
 return {rows,read,asset:rows.measures_publication_distribution_asset[0],campaign:rows.measures_publication_campaign[0]}
}
async function project(f=fixture()){return readLapzuli(f.read)}
function only(packet:Awaited<ReturnType<typeof readLapzuli>>){return packet.campaigns[0].assets[0]}

test("approved pre-resolution asset retains standing and Resolve control without execution controls",async()=>{
 const packet=await project(),asset=only(packet),html=markup(packet)
 assert.equal(asset.distribution_state,"ready_for_lapzuli_resolution");assert.equal(asset.registered_standing_key,null);assert.equal(asset.lapzuli_callable,false);assert.deepEqual(asset.blockers,[])
 assert.equal(packet.campaigns[0].standing,"awaiting_lapzuli_resolution")
 assert.match(html,/Resolve CampaignPAC → Lapzuli/);assert.doesNotMatch(html,/>Preflight<|>Dispatch now</)
})
test("explicit awaiting source vocabulary is preserved without promoting it to executable",async()=>{
 const f=fixture();f.asset.status="awaiting_lapzuli_resolution"
 const packet=await project(f);assert.equal(only(packet).distribution_state,"awaiting_lapzuli_resolution");assert.match(markup(packet),/Resolve CampaignPAC → Lapzuli/);assert.doesNotMatch(markup(packet),/>Preflight<|>Dispatch now</)
})
test("generic held source is never converted into pre-resolution standing",async()=>{
 const f=fixture();f.asset.status="held";const packet=await project(f)
 assert.equal(only(packet).distribution_state,"held");assert.doesNotMatch(markup(packet),/Resolve CampaignPAC → Lapzuli|>Preflight<|>Dispatch now</)
})
test("pre-resolution preserves every existing common authority hold",async()=>{
 const cases:Array<[string,(f:ReturnType<typeof fixture>)=>void]>=[
  ["derivative_unresolved",f=>f.rows.measures_publication_derivative_asset=[]],
  ["derivative_not_operator_approved",f=>f.rows.measures_publication_derivative_asset[0].approval_status="draft"],
  ["derivative_not_released",f=>f.rows.measures_publication_derivative_asset[0].release_state="held"],
  ["distribution_asset_not_operator_approved",f=>f.asset.review_status="draft"],
  ["authorized_route_unresolved",f=>f.rows.lapzuli_route[0].route_status="candidate"],
  ["active_channel_unresolved",f=>f.rows.measures_distribution_channel[0].status="held"],
  ["callable_executor_unresolved",f=>f.rows.measures_distribution_executor[0].supports_publish=false],
  ["governing_campaignpac_binding",f=>f.rows.c3_pac[0].is_effective=false],
  ["campaignpac_public_speaking_identity",f=>f.rows.c3_pac[0].metadata={source_pubpac:"pubpac"}],
 ]
 for(const[reason,mutate]of cases){const f=fixture();mutate(f);const packet=await project(f);assert.equal(only(packet).distribution_state,"held",reason);assert.ok(only(packet).blockers.includes(reason),reason);assert.doesNotMatch(markup(packet),/Resolve CampaignPAC → Lapzuli|>Preflight<|>Dispatch now</)}
})
test("pre-resolution cannot bypass current campaign authorization",async()=>{
 for(const mutate of [(f:ReturnType<typeof fixture>)=>f.campaign.review_status="draft",(f:ReturnType<typeof fixture>)=>f.campaign.release_state="draft",(f:ReturnType<typeof fixture>)=>f.campaign.metadata={activation_operator:"op044",campaign_pac_key:"pac",external_distribution_authorized:false},(f:ReturnType<typeof fixture>)=>f.rows.measures_publication_campaign=[]]){const f=fixture();mutate(f);const packet=await project(f);assert.ok(packet.campaigns.every(c=>c.assets.every(a=>a.distribution_state==="held")));assert.doesNotMatch(markup(packet),/Resolve CampaignPAC → Lapzuli/)}
})
test("pre-resolution retains asset confirmation and active campaign scope",async()=>{
 for(const[reason,mutate]of [
  ["asset_operator_confirmation_missing",(f:ReturnType<typeof fixture>)=>f.asset.metadata={...(f.asset.metadata as Row),operator_confirmed:false}],
  ["asset_external_distribution_not_authorized",(f:ReturnType<typeof fixture>)=>f.asset.metadata={...(f.asset.metadata as Row),external_distribution_authorized:false}],
  ["outside_active_distribution_scope",(f:ReturnType<typeof fixture>)=>f.campaign.metadata={...(f.campaign.metadata as Row),lapzuli_active_asset_keys:["another_asset"]}],
  ["campaign_operator_or_pac_unresolved",(f:ReturnType<typeof fixture>)=>f.campaign.metadata={external_distribution_authorized:true,campaign_pac_key:"pac"}],
 ] as const){const f=fixture();mutate(f);const packet=await project(f);assert.equal(only(packet).distribution_state,"held");assert.ok(only(packet).blockers.includes(reason));assert.doesNotMatch(markup(packet),/Resolve CampaignPAC → Lapzuli/)}
 const f=fixture();f.campaign.release_state="release_ready";assert.equal(only(await project(f)).distribution_state,"ready_for_lapzuli_resolution")
})
test("post-resolution requires both registered standing and actual callable view",async()=>{
 const f=fixture();f.asset.status="ready_for_operator_execution"
 let packet=await project(f);assert.equal(only(packet).distribution_state,"held");assert.ok(only(packet).blockers.includes("registered_standing_unresolved"))
 f.asset.metadata={...f.asset.metadata as Row,registered_standing_key:"standing"}
 packet=await project(f);assert.equal(only(packet).distribution_state,"held");assert.ok(only(packet).blockers.includes("lapzuli_callable_contract_unresolved"));assert.doesNotMatch(markup(packet),/>Preflight<|>Dispatch now</)
 f.rows.lapzuli_derivative_execution_view_v1=[{distribution_asset_key:"asset",lapzuli_callable:true,registered_standing_key:"standing"}]
 packet=await project(f);assert.equal(only(packet).distribution_state,"ready_for_operator_execution");assert.match(markup(packet),/>Preflight<|>Dispatch now</);assert.doesNotMatch(markup(packet),/Resolve CampaignPAC → Lapzuli/)
})
test("actual resolveCampaign alone forms standing in a fully isolated Registry fixture",async()=>{
 const f=fixture(),original=globalThis.fetch,writes:string[]=[]
 globalThis.fetch=(async(input,init)=>{
  const url=new URL(String(input));assert.equal(url.hostname,"registry.fixture.invalid","No provider or live request is permitted")
  const table=url.pathname.split('/').pop()!,method=init?.method??"GET"
  if(method==="GET")return Response.json(f.rows[table]??[])
  writes.push(method+" "+table);const body=JSON.parse(String(init?.body))
  if(table==="registered_process_log")f.rows[table].push(body)
  else if(table==="measures_publication_distribution_asset")Object.assign(f.asset,body)
  else if(table==="measures_publication_derivative_asset")Object.assign(f.rows[table][0],body)
  else if(table==="lapzuli_route"){for(const route of Array.isArray(body)?body:[body]){const old=f.rows[table].find(x=>x.route_key===route.route_key);if(old)Object.assign(old,route);else f.rows[table].push(route)}}
  else throw Error("Unexpected mutation "+table)
  return new Response(null,{status:204})
 }) as typeof fetch
 try{
  const response=await handleLapzuliAction(new Request("https://c3ops.c3field.online/api/c3ops/manifest?view=lapzuli_action",{method:"POST",body:JSON.stringify({action:"resolve_campaign",campaign_key:"campaign"})}),{SUPABASE_URL:"https://registry.fixture.invalid",SUPABASE_SERVICE_ROLE_KEY:"fixture_only"})
  const result=await response.json();assert.equal(response.status,200);assert.equal(result.external_publication_effects,0);assert.equal(f.rows.registered_process_log.length,1);assert.equal(f.asset.status,"ready_for_operator_execution");assert.ok((f.asset.metadata as Row).registered_standing_key)
  assert.deepEqual(writes.sort(),["POST lapzuli_route","POST registered_process_log","PATCH measures_publication_derivative_asset","PATCH measures_publication_distribution_asset"].sort())
  assert.equal(only(await project(f)).distribution_state,"held","Registration alone does not invent callability")
  f.rows.lapzuli_derivative_execution_view_v1=[{distribution_asset_key:"asset",lapzuli_callable:true,registered_standing_key:(f.asset.metadata as Row).registered_standing_key}]
  const packet=await project(f);assert.equal(only(packet).distribution_state,"ready_for_operator_execution");assert.match(markup(packet),/>Preflight<|>Dispatch now</)
 }finally{globalThis.fetch=original}
})
test("published and provider-accepted evidence is preserved instead of offering resolution again",async()=>{
 for(const[status,state]of [["published","distributed"],["queued","accepted_pending_platform_proof"]]){const f=fixture();f.rows.measures_distribution_execution=[{distribution_asset_id:"asset",execution_status:status}];const packet=await project(f);assert.equal(only(packet).distribution_state,state);assert.doesNotMatch(markup(packet),/Resolve CampaignPAC → Lapzuli|>Preflight<|>Dispatch now</)}
})
