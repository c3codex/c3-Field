import test from "node:test"
import assert from "node:assert/strict"
import {resolveLapzuliFreeRoute,type Row,type Read} from "./lapzuli-free-runtime"
function fixture(overrides:Record<string,Row[]>={}) {
  const rows:Record<string,Row[]>={
    lapzuli_route:[{route_key:"route",route_status:"authorized",operator_confirmed:true,authority_reference:"op044 exact release",return_required:true,publication_object_key:"publication",outlet_key:"bluesky",desk_key:"desk",payload_reference:"asset",metadata:{campaign_pac_key:"campaign",channel_key:"bluesky_undrifted",executor_key:"bluesky_api"}}],
    c3_pac:[{pac_key:"campaign",pac_type:"CampaignPac",is_effective:true,standing:"registered_complete_lapzuli_ready",metadata:{public_speaking_identity:"unDrifted",source_pubpac:"pubpac"}}],
    measures_publication_distribution_asset:[{publication_asset_id:"publication",metadata:{external_distribution_authorized:true},payload:{text:"Exact registered text",canonical_url:"https://measuresregistry.com/article",ai_disclosure_required:true}}],
    lapzuli_outlet_qualification:[{standing:"qualified_with_constraints",operator_disposition_required:true,requires_ai_disclosure:true}],
    lapzuli_outlet:[{account_standing:"verified"}],
    undrifted_distribution_report_v1:[{publication_status:"published",source_distribution_hold:false}],
    measures_distribution_executor:[{status:"available",supports_publish:true}],
    measures_distribution_channel:[{status:"active",executor_key:"bluesky_api",channel_identifier:"undrifted.bsky.social"}],
    lapzuli_derivative_execution_view_v1:[{registered_standing:"registered",registered_standing_key:"standing"}],
    lapzuli_encounter_evidence:[],measures_distribution_execution:[],...overrides,
  }
  return (async(table)=>rows[table]??[]) as Read
}
const probe=async(path:string)=>({ok:true,body:path.startsWith("/verify")?{handle:"undrifted.bsky.social"}:{external_publication_effects:0,standing:"ready"}})
test("exact upstream authority satisfies proof-era qualification disposition without another confirmation",async()=>{
  const result=await resolveLapzuliFreeRoute(fixture(),"route",probe)
  assert.equal(result.standing,"EXECUTABLE")
  assert.equal(result.second_operator_confirmation_required,false)
})
test("source hold remains authoritative despite active route and available provider",async()=>{
  const result=await resolveLapzuliFreeRoute(fixture({undrifted_distribution_report_v1:[{publication_status:"published",source_distribution_hold:true}]}),"route",probe)
  assert.equal(result.standing,"HLD");assert.equal(result.reason,"publication_release_authority")
})
test("candidate route performs no runtime probe",async()=>{
  let calls=0
  const result=await resolveLapzuliFreeRoute(fixture({lapzuli_route:[{route_status:"candidate"}]}),"route",async()=>{calls++;return probe("")})
  assert.equal(result.standing,"CANDIDATE");assert.equal(calls,0)
})
test("provider identity drift fails current readiness",async()=>{
  const result=await resolveLapzuliFreeRoute(fixture(),"route",async()=>({ok:true,body:{handle:"another.bsky.social",external_publication_effects:0}}))
  assert.equal(result.standing,"HLD");assert.equal(result.reason,"current_provider_identity")
})
test("prior or uncertain effect prevents duplicate execution",async()=>{
  const result=await resolveLapzuliFreeRoute(fixture({measures_distribution_execution:[{execution_status:"publication_uncertain"}]}),"route",probe)
  assert.equal(result.reason,"execution_effect_guard")
})
test("a dry-run response without explicit zero effects cannot establish readiness",async()=>{
  const result=await resolveLapzuliFreeRoute(fixture(),"route",async path=>({ok:true,body:path.startsWith("/verify")?{handle:"undrifted.bsky.social"}:{standing:"ready"}}))
  assert.equal(result.reason,"provider_payload_preflight")
})
test("active atomic claim blocks another dispatch",async()=>{
 const result=await resolveLapzuliFreeRoute(fixture({measures_distribution_execution:[{execution_status:"publication_attempted"}]}),"route",probe)
 assert.equal(result.standing,"HLD");assert.equal(result.reason,"execution_effect_guard")
})
test("CampaignPac speaker is separate from Facebook Measures Registry destination; preflight consumes it with zero effects",async()=>{
  const base=fixture()
  const read:Read=async(table,select,filters)=>{
    const rows=await base(table,select,filters)
    if(table==="lapzuli_route")return rows.map(row=>({...row,outlet_key:"facebook",metadata:{campaign_pac_key:"campaign",channel_key:"facebook_measures_registry",executor_key:"buffer"}}))
    if(table==="measures_distribution_channel")return [{status:"active",executor_key:"buffer",channel_identifier:"facebook-id",channel_url:"https://facebook.com/measuresregistry"}]
    return rows
  }
  const posts:Row[]=[]
  const result=await resolveLapzuliFreeRoute(read,"route",async(path,method,payload)=>{
    if(method==="POST")posts.push(payload!)
    return {ok:true,body:method==="POST"?{external_publication_effects:0}:{channels:[{id:"facebook-id",externalLink:"https://facebook.com/measuresregistry",isDisconnected:false,isLocked:false}]}}
  })
  assert.equal(result.standing,"EXECUTABLE")
  assert.equal(result.public_speaking_identity,"unDrifted")
  assert.equal(result.destination_account_key,"facebook_measures_registry")
  assert.equal(result.destination_account_identifier,"facebook-id")
  assert.equal(result.external_publication_effects,0)
  assert.equal(posts.length,1)
  assert.equal(posts[0].public_speaking_identity,"unDrifted")
  assert.equal(posts[0].campaign_pac_key,"campaign")
  assert.equal(posts[0].execute,false);assert.equal(posts[0].dry_run,true)
})
test("missing speaker cannot be substituted by executor, outlet, desk, payload or hostname",async()=>{
  const base=fixture({c3_pac:[{pac_key:"campaign",pac_type:"CampaignPac",is_effective:true,metadata:{}}]})
  const read:Read=async(table,select,filters)=>(await base(table,select,filters)).map(row=>({...row,public_speaking_identity:"unDrifted",account_name:"unDrifted",desk_key:"unDrifted",executor_name:"unDrifted"}))
  const result=await resolveLapzuliFreeRoute(read,"route",probe)
  assert.equal(result.standing,"HLD");assert.equal(result.reason,"campaignpac_public_speaking_identity")
  assert.equal(result.public_speaking_identity,null)
})
test("missing CampaignPac fails closed while source and duplicate holds retain priority",async()=>{
  const missing={c3_pac:[]}
  const result=await resolveLapzuliFreeRoute(fixture(missing),"route",probe)
  assert.equal(result.reason,"governing_campaignpac_binding")
  const held=await resolveLapzuliFreeRoute(fixture({...missing,undrifted_distribution_report_v1:[{publication_status:"published",source_distribution_hold:true}]}),"route",probe)
  assert.equal(held.reason,"publication_release_authority")
  const historical=await resolveLapzuliFreeRoute(fixture({...missing,lapzuli_encounter_evidence:[{external_id:"exact-prior-effect"}]}),"route",probe)
  assert.equal(historical.standing,"HISTORICAL_OR_SUPERSEDED");assert.equal(historical.reason,"duplicate_guard")
  const provider=await resolveLapzuliFreeRoute(fixture(missing),"route",async()=>({ok:false,body:{}}))
  assert.equal(provider.reason,"current_provider_identity")
  const unbound:Read=async(table,select,filters)=>{
    const rows=await fixture()(table,select,filters)
    return table==="lapzuli_route"?rows.map(row=>({...row,metadata:{channel_key:"bluesky_undrifted",executor_key:"bluesky_api"}})):rows
  }
  assert.equal((await resolveLapzuliFreeRoute(unbound,"route",probe)).reason,"governing_campaignpac_binding")
})
