import assert from "node:assert/strict"
import test from "node:test"
import {isDefaultGroundSelection,verifiedGroundSnapshot,groundAssetMatches,groundBytesVerified,GROUND_FREE_CALL,GROUND_SELECTOR} from "../functions/_lib/current-state-ground"
import {GROUND_KEY,GROUND_ASSET,GROUND_SHA256,GROUND_MEDIA} from "../src/c3_field_connect/current-state-ground"
const base={selection_standing:"active",selected_by_type:"system",opening_visual_asset_key:"c3_field_c1me_live_backdrop_v1"}
test("new Ground does not displace a selected personal or initiative visual",()=>{
 assert.equal(isDefaultGroundSelection([]),true)
 assert.equal(isDefaultGroundSelection([base]),true)
 for(const t of ["individual","operator","initiative"])assert.equal(isDefaultGroundSelection([{...base,selected_by_type:t}]),false)
 assert.equal(isDefaultGroundSelection([base,base]),false)
 assert.equal(isDefaultGroundSelection([{...base,opening_visual_asset_key:"another"}]),false)
})
const snapshot={designpac_key:GROUND_KEY,standing:"resolved",asset_key:GROUND_ASSET,asset_sha256:GROUND_SHA256,media_url:GROUND_MEDIA,width:1672,height:941,presentation_scope:"authenticated_my_env_default",authority_effect:"none"}
const result={standing:"ACT",pac_key:GROUND_KEY,schema_key:"pac_schema_designpac_v1_1",free_call_key:GROUND_FREE_CALL,encounter_key:GROUND_SELECTOR,surface_type:"c3_field",registration_sha256:"1".repeat(64),projection_sha256:"2".repeat(64),ACT:[{}],snapshot}
test("native DNR, wrong selector, media hash or unavailable ACT cannot render",()=>{
 assert.ok(verifiedGroundSnapshot(result))
 for(const patch of [{standing:"DNR"},{encounter_key:"wrong"},{ACT:[]},{snapshot:{...snapshot,asset_sha256:"wrong"}},{snapshot:{...snapshot,authority_effect:"grants"}}])assert.equal(verifiedGroundSnapshot({...result,...patch}),null)
})
test("asset mismatch and byte changes fail closed",async()=>{
 const asset={asset_key:GROUND_ASSET,standing:"operator_approved_webpac_reference",owning_system_key:"c3_field",authoritative_custody_provider:"supabase",authoritative_custody_identifier:"c3-field-media",authoritative_custody_location:"current_state_ground_v1.webp",hash_algorithm:"sha256",content_hash:GROUND_SHA256,byte_size:2094840,mime_type:"image/webp",current_free_binding:GROUND_MEDIA,free_eligibility:true,public_retrieval_standing:"held_for_bounded_runtime_binding"}
 assert.equal(groundAssetMatches(asset),true)
 assert.equal(groundAssetMatches({...asset,public_retrieval_standing:"bounded_public_runtime"}),false)
 assert.equal(groundAssetMatches({...asset,content_hash:"wrong"}),false)
 assert.equal(await groundBytesVerified(new ArrayBuffer(1)),false)
 assert.equal(await groundBytesVerified(new ArrayBuffer(2094840)),false)
})
