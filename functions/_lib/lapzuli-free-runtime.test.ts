import test from "node:test"
import assert from "node:assert/strict"
import {resolveLapzuliFreeRoute,type Row,type Read} from "./lapzuli-free-runtime"
function fixture(overrides:Record<string,Row[]>={}) {
  const rows:Record<string,Row[]>={
    lapzuli_route:[{route_key:"route",route_status:"authorized",operator_confirmed:true,authority_reference:"op044 exact release",return_required:true,publication_object_key:"publication",outlet_key:"bluesky",desk_key:"desk",payload_reference:"asset",metadata:{channel_key:"bluesky_undrifted",executor_key:"bluesky_api"}}],
    measures_publication_distribution_asset:[{publication_asset_id:"publication",metadata:{external_distribution_authorized:true},payload:{text:"Exact registered text",canonical_url:"https://measuresregistry.com/article",ai_disclosure_required:true}}],
    lapzuli_outlet_qualification:[{standing:"qualified_with_constraints",operator_disposition_required:true,requires_ai_disclosure:true}],
    lapzuli_outlet:[{account_standing:"verified"}],
    undrifted_distribution_report_v1:[{publication_status:"published",source_distribution_hold:false}],
    measures_distribution_executor:[{status:"available",supports_publish:true}],
    measures_distribution_channel:[{status:"active",channel_identifier:"undrifted.bsky.social"}],
    lapzuli_derivative_execution_view_v1:[{registered_standing:"registered",registered_standing_key:"standing"}],
    lapzuli_encounter_evidence:[],measures_distribution_execution:[],...overrides,
  }
  return (async(table)=>rows[table]??[]) as Read
}
const probe=async(path:string)=>({ok:true,body:path.startsWith("/verify")?{handle:"undrifted.bsky.social"}:{external_publication_effects:0,standing:"ready"}})
test("exact upstream authority satisfies proof-era qualification disposition without another confirmation",async()=>{
  const result=await resolveLapzuliFreeRoute(fixture(),"route",probe)
  assert.equal(result.standing,"EXECUTEABLE")
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
