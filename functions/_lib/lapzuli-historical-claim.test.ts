import test from "node:test"
import assert from "node:assert/strict"
import {claimHistoricalAsset,historicalOperatorToken,HISTORICAL_ASSET,HISTORICAL_ROUTE,HISTORICAL_INSTANCE,HISTORICAL_OAR2,HISTORICAL_PASSAGE} from "./lapzuli-historical-claim"
import {handleLapzuliAction} from "../api/c3ops/lapzuli"
const token="a".repeat(64)
const preflight={standing:"EXECUTABLE",distribution_asset_key:HISTORICAL_ASSET,route_key:HISTORICAL_ROUTE,
  executor_key:"bluesky_api",channel_key:"bluesky_undrifted",public_speaking_identity:"unDrifted",destination_account_identifier:"undrifted.bsky.social"}
const occurrence="historical_manual_distribution_v1:"+"b".repeat(64)
const fixture=()=>({claimed:true,execution_id:"11111111-1111-4111-8111-111111111111",attempt_number:1,occurrence_key:occurrence,
  binding:{occurrence_key:occurrence,execution_instance:HISTORICAL_INSTANCE,source_oar2:HISTORICAL_OAR2,
    distribution_asset_key:HISTORICAL_ASSET,route_key:HISTORICAL_ROUTE,destination_account_identifier:"undrifted.bsky.social",
    operator_ref:"op044",individual_authenticated:true}})
test("missing individual token holds before all Registry calls",async()=>{
  await assert.rejects(()=>claimHistoricalAsset(async()=>{throw Error("must not call")},null,preflight),/native_individual_operator_session_required/)
})
test("c3Ops accepts only a bounded server-side passage, never a copied host cookie",()=>{
  const headers={"x-c3-contract":HISTORICAL_PASSAGE,"x-c3-source-origin":"https://my.c3field.online",
    "x-c3-execution-instance":HISTORICAL_INSTANCE,"x-c3-private-owner-session":token}
  const req=(h:Record<string,string>,url="https://c3ops.c3field.online/api/c3ops/lapzuli")=>new Request(url,{method:"POST",headers:h})
  assert.equal(historicalOperatorToken(req({cookie:"c3_env_session="+token})),null)
  assert.equal(historicalOperatorToken(req(headers)),token)
  assert.equal(historicalOperatorToken(req({...headers,origin:"https://my.c3field.online"})),null)
  assert.equal(historicalOperatorToken(req({...headers,"x-c3-execution-instance":"another"})),null)
  assert.equal(historicalOperatorToken(req(headers,"https://attacker.invalid")),null)
})

test("changed account, asset, speaker or route holds before native claim",async()=>{
  for(const key of ["distribution_asset_key","route_key","public_speaking_identity","destination_account_identifier"])
    await assert.rejects(()=>claimHistoricalAsset(async()=>{throw Error("must not call")},token,{...preflight,[key]:"wrong"}),/historical_preflight_binding_mismatch/)
})
test("HLD, missing RPC, malformed and unbound claims never fall back",async()=>{
  for(const result of [null,[],[{}],[{claimed:false,reason:"effect_authority_absent"}],
    [{...fixture(),binding:{}}],[{...fixture(),execution_id:null}],[fixture(),fixture()]])
    await assert.rejects(()=>claimHistoricalAsset(async()=>result,token,preflight))
  await assert.rejects(()=>claimHistoricalAsset(async()=>{throw Error("RPC 404")},token,preflight),/historical_native_claim_unavailable_or_unverified/)
})
test("bound native receipt is required before returning worker execution identity",async()=>{
  let calls=0
  const bound=await claimHistoricalAsset(async(name,args)=>{
    calls++;assert.equal(name,"claim_lapzuli_historical_occurrence_v1")
    assert.equal(args.p_operator_session_token,token);assert.equal(args.p_execution_instance,HISTORICAL_INSTANCE)
    assert.deepEqual(args.p_preflight,preflight);return [fixture()]
  },token,preflight)
  assert.equal(calls,1);assert.equal(bound.occurrenceKey,occurrence);assert.equal(bound.executionId,fixture().execution_id)
})
test("exact historical asset cannot use standard action; allowlist and session holds have zero network effects",async()=>{
  const original=globalThis.fetch;let calls=0
  globalThis.fetch=async()=>{calls++;throw Error("No Registry/provider request allowed")}
  try{
    for(const [body,reason] of [
      [{action:"dispatch_asset",distribution_asset_key:HISTORICAL_ASSET},"historical_bound_action_required"],
      [{action:"dispatch_historical_asset",distribution_asset_key:"another_asset"},"historical_asset_outside_allowlist"],
      [{action:"dispatch_historical_asset",distribution_asset_key:HISTORICAL_ASSET,operator_ref:"op044",operator_session_token:token},"native_individual_operator_session_required"],
    ] as const){
      const r=await handleLapzuliAction(new Request("https://c3ops.c3field.online/api/c3ops/lapzuli",{method:"POST",body:JSON.stringify(body)}),{})
      const result=await r.json();assert.equal(r.status,409);assert.equal(result.reason,reason);assert.equal(result.external_publication_effects,0)
    }
    assert.equal(calls,0)
  }finally{globalThis.fetch=original}
})

function runtimeFixture(mode:"held"|"accepted"|"transport_unknown"|"receipt_write_failed") {
  const route={route_key:HISTORICAL_ROUTE,route_status:"authorized",operator_confirmed:true,authority_reference:"fixture release",
    return_required:true,publication_object_key:"publication",outlet_key:"bluesky",desk_key:"desk",payload_reference:HISTORICAL_ASSET,
    metadata:{campaign_pac_key:"campaign",channel_key:"bluesky_undrifted",executor_key:"bluesky_api",operator:"op044"}}
  const rows:Record<string,unknown[]>={
    lapzuli_route:[route],
    c3_pac:[{pac_key:"campaign",pac_type:"CampaignPac",is_effective:true,standing:"registered_complete_lapzuli_ready",metadata:{public_speaking_identity:"unDrifted",source_pubpac:"pubpac"}}],
    measures_publication_distribution_asset:[{distribution_asset_key:HISTORICAL_ASSET,publication_asset_id:"publication",metadata:{route_key:HISTORICAL_ROUTE,external_distribution_authorized:true},payload:{text:"Fixture text",canonical_url:"https://measuresregistry.com/article",ai_disclosure_required:true}}],
    lapzuli_outlet_qualification:[{standing:"qualified_with_constraints",requires_ai_disclosure:true}],lapzuli_outlet:[{account_standing:"verified"}],
    undrifted_distribution_report_v1:[{publication_status:"published",source_distribution_hold:false}],
    measures_distribution_executor:[{status:"available",supports_publish:true}],
    measures_distribution_channel:[{status:"active",executor_key:"bluesky_api",channel_identifier:"undrifted.bsky.social"}],
    lapzuli_derivative_execution_view_v1:[{lapzuli_callable:true,registered_standing:"registered",registered_standing_key:"fixture_standing",registered_operator:"op044",
      channel_key:"bluesky_undrifted",executor_key:"bluesky_api",channel_identifier:"undrifted.bsky.social"}],
    lapzuli_encounter_evidence:[],measures_distribution_execution:[],
  }
  let dispatches=0,claims=0;const writes:Record<string,unknown>[]=[]
  const fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
    const url=new URL(String(input)),table=url.pathname.split("/").pop()!,method=init?.method??"GET"
    const body=init?.body?JSON.parse(String(init.body)):{}
    if(url.hostname==="worker.fixture.invalid"){
      if(url.pathname.startsWith("/verify"))return Response.json({ok:true,handle:"undrifted.bsky.social"})
      assert.equal(url.pathname,"/bluesky/posts")
      if(body.dry_run===true)return Response.json({ok:true,external_publication_effects:0})
      dispatches++;assert.equal(body.atomic_execution_id,fixture().execution_id);assert.equal(body.historical_occurrence_key,occurrence)
      if(mode==="transport_unknown")throw Error("worker transport interrupted")
      return Response.json({ok:true,external_publication_effects:1,platform_url:"https://bsky.app/profile/fixture/post/observed",platform_post_id:"fixture_post"})
    }
    assert.equal(url.hostname,"registry.fixture.invalid")
    assert.notEqual(table,"claim_lapzuli_distribution_execution_v1","Historical action must never call unbound fallback")
    if(table==="claim_lapzuli_historical_occurrence_v1"){
      claims++;assert.equal(body.p_operator_session_token,token)
      assert.equal(body.p_preflight.prepared_worker_request.execute,true)
      return Response.json(mode==="held"?[{claimed:false,reason:"native_individual_source_effect_admission_uninstalled"}]:[fixture()])
    }
    if(method==="PATCH"){
      writes.push(body)
      if(mode==="receipt_write_failed"||mode==="transport_unknown")return Response.json({error:"fixture persistence failure"},{status:500})
      return new Response(null,{status:204})
    }
    return Response.json(rows[table]??[])
  }
  return{fetch,writes,claims:()=>claims,dispatches:()=>dispatches}
}
for(const mode of ["held","accepted","transport_unknown","receipt_write_failed"] as const)
  test("historical API integration: "+mode,async()=>{
    const f=runtimeFixture(mode),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof globalThis.fetch
    try{
      const response=await handleLapzuliAction(new Request("https://c3ops.c3field.online/api/c3ops/lapzuli",{
        method:"POST",headers:{"x-c3-contract":HISTORICAL_PASSAGE,"x-c3-source-origin":"https://my.c3field.online","x-c3-execution-instance":HISTORICAL_INSTANCE,"x-c3-private-owner-session":token},body:JSON.stringify({action:"dispatch_historical_asset",distribution_asset_key:HISTORICAL_ASSET}),
      }),{SUPABASE_URL:"https://registry.fixture.invalid",SUPABASE_SERVICE_ROLE_KEY:"fixture",LAPZULI_DISTRIBUTION_CONTROL_TOKEN:"fixture",LAPZULI_DISTRIBUTION_WORKER_URL:"https://worker.fixture.invalid"})
      const result=await response.json();assert.equal(f.claims(),1)
      if(mode==="held"){
        assert.equal(result.reason,"native_individual_source_effect_admission_uninstalled");assert.equal(f.dispatches(),0);assert.equal(result.external_publication_effects,0)
      }else{
        assert.equal(f.dispatches(),1);assert.equal(f.writes.length,1)
        assert.equal((f.writes[0].metadata as Record<string,unknown>).historical_occurrence!==undefined,true)
        assert.equal(result.external_publication_effects,mode==="transport_unknown"?null:1)
        assert.equal(result.standing,mode==="accepted"?"ACT":"HLD")
        assert.equal((f.writes[0].metadata as Record<string,unknown>).automatic_retry_allowed,false)
      }
    }finally{globalThis.fetch=old}
  })
