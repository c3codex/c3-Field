import test from "node:test"
import assert from "node:assert/strict"
import {resolveCampaignPacSpeaker} from "./campaignpac-speaker"
import {readLapzuli} from "./me-environment"

const route={route_key:"route",publication_object_key:"object",outlet_key:"facebook",metadata:{campaign_pac_key:"campaign-a",distribution_asset_key:"asset",channel_key:"facebook_measures_registry"}}
const pacs=[
  {pac_key:"campaign-a",pac_type:"CampaignPac",is_effective:true,metadata:{public_speaking_identity:"unDrifted",source_pubpac:"same-pubpac",scope:{published_objects:["object"],destinations:["facebook_measures_registry"]}}},
  {pac_key:"campaign-b",pac_type:"CampaignPac",is_effective:true,metadata:{public_speaking_identity:"Another governed speaker",source_pubpac:"same-pubpac"}},
]
test("same PubPac/object supports distinct governed CampaignPac speakers without mutating publication authority",()=>{
  const before=JSON.stringify({route,pacs})
  const a=resolveCampaignPacSpeaker(route,undefined,undefined,pacs,"facebook_measures_registry")
  const b=resolveCampaignPacSpeaker({...route,metadata:{campaign_pac_key:"campaign-b"}},undefined,undefined,pacs,"facebook_measures_registry")
  assert.equal(a.public_speaking_identity,"unDrifted");assert.equal(b.public_speaking_identity,"Another governed speaker")
  assert.equal(a.source_pubpac_key,b.source_pubpac_key);assert.equal(JSON.stringify({route,pacs}),before)
})
test("conflicting bindings, ineffective PACs, PubPacs and out-of-scope objects fail closed",()=>{
  assert.equal(resolveCampaignPacSpeaker(route,{metadata:{campaign_pac_key:"campaign-b"}},undefined,pacs,"facebook_measures_registry").speaker_binding_reason,"governing_campaignpac_binding")
  for(const pac of [{...pacs[0],is_effective:false},{...pacs[0],pac_type:"PubPac"}])
    assert.equal(resolveCampaignPacSpeaker(route,undefined,undefined,[pac],"facebook_measures_registry").public_speaking_identity,null)
  assert.equal(resolveCampaignPacSpeaker({...route,publication_object_key:"other"},undefined,undefined,pacs,"facebook_measures_registry").speaker_binding_reason,"campaignpac_route_scope")
})
test("portal route readback separates speaker and destination and does not invent historical bindings",async()=>{
  const rows:Record<string,Record<string,unknown>[]>={c3_pac:pacs,lapzuli_route:[route,{...route,route_key:"historical",metadata:{channel_key:"facebook_measures_registry"}}],measures_distribution_channel:[{channel_key:"facebook_measures_registry",channel_identifier:"registered-account-id"}]}
  const before=JSON.stringify(rows)
  const result=await readLapzuli(async table=>rows[table]??[])
  assert.equal(result.routes[0].public_speaking_identity,"unDrifted")
  assert.equal(result.routes[0].destination_account_key,"facebook_measures_registry")
  assert.equal(result.routes[1].public_speaking_identity,null)
  assert.equal(result.routes[1].speaker_binding_reason,"governing_campaignpac_binding")
  assert.equal(result.external_effects,0);assert.equal(JSON.stringify(rows),before)
})
test("portal holds new callable assets without a speaker and preserves recorded historical distribution",async()=>{
  const rows:Record<string,Record<string,unknown>[]>={
    measures_publication_campaign:[{campaign_key:"legacy-campaign",status:"active"}],
    measures_publication_distribution_asset:[{distribution_asset_key:"asset",campaign_id:"legacy-campaign",status:"ready_for_operator_execution",review_status:"operator_approved",metadata:{registered_standing_key:"standing",derivative_key:"derivative",channel_key:"facebook_measures_registry",executor_key:"buffer"}}],
    measures_publication_derivative_asset:[{derivative_key:"derivative",approval_status:"operator_approved",release_state:"released"}],
    lapzuli_derivative_execution_view_v1:[{distribution_asset_key:"asset",lapzuli_callable:true}],
    lapzuli_route:[{...route,route_status:"authorized",operator_confirmed:true,metadata:{distribution_asset_key:"asset"}}],
    measures_distribution_channel:[{channel_key:"facebook_measures_registry",status:"active"}],
    measures_distribution_executor:[{executor_key:"buffer",status:"available",supports_publish:true}],
  }
  const result=await readLapzuli(async table=>rows[table]??[])
  assert.equal(result.campaigns[0].assets[0].distribution_state,"held")
  assert.ok(result.campaigns[0].assets[0].blockers.includes("governing_campaignpac_binding"))
  rows.measures_distribution_execution=[{distribution_asset_id:"asset",execution_status:"published",platform_url:"https://facebook.com/existing"}]
  const before=JSON.stringify(rows)
  const historical=await readLapzuli(async table=>rows[table]??[])
  assert.equal(historical.campaigns[0].assets[0].distribution_state,"distributed")
  assert.equal(historical.campaigns[0].assets[0].speaker_binding_reason,"governing_campaignpac_binding")
  assert.equal(JSON.stringify(rows),before)
})
