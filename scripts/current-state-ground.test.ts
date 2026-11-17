import assert from "node:assert/strict"
import test from "node:test"
import {GROUND_REGIONS,GROUND_KEY,GROUND_ASSET,GROUND_SHA256,GROUND_MEDIA,matchesGround,groundDestination} from "../src/c3_field_connect/current-state-ground"
const presentation={designpac_key:GROUND_KEY,asset_key:GROUND_ASSET,asset_sha256:GROUND_SHA256,media_url:GROUND_MEDIA,width:1672,height:941,standing:"resolved"}
test("requires exact resolved presentation and refuses missing or substituted media",()=>{
  assert.equal(matchesGround(presentation),true)
  assert.equal(matchesGround(null),false)
  for(const patch of [{standing:"held"},{width:1},{asset_sha256:"wrong"},{designpac_key:"other"},{asset_key:"other"},{media_url:"https://example.invalid/asset"}])assert.equal(matchesGround({...presentation,...patch}),false)
})
test("only exact unique admitted primitive opens a panel",()=>{
  const region=GROUND_REGIONS.find(r=>r.id==="pacs")!
  const admitted={primitive_key:"my_pacs",renderer_key:"c1me.my_pacs"}
  assert.equal(groundDestination(region,[admitted]),"primitive:my_pacs")
  assert.equal(groundDestination(region,[]),null)
  assert.equal(groundDestination(region,[{...admitted,renderer_key:"c1me.chazz"}]),null)
  assert.equal(groundDestination(region,[admitted,admitted]),null)
})
test("all four existing panel mappings resolve, unqualified stash and intelligence stay held",()=>{
  const admitted=[{primitive_key:"my_pacs",renderer_key:"c1me.my_pacs"},{primitive_key:"canopy",renderer_key:"c1me.canopy"},{primitive_key:"native_connections",renderer_key:"c1me.native_connections"},{primitive_key:"invite_connection",renderer_key:"c1me.invite_connection"},{primitive_key:"chazz",renderer_key:"c1me.chazz"},{primitive_key:"my_stash",renderer_key:"c1me.my_stash"}]
  assert.deepEqual(GROUND_REGIONS.map(r=>groundDestination(r,admitted)),[null,"primitive:my_pacs","primitive:canopy","primitive:native_connections","primitive:invite_connection",null])
})
test("regions are within image and do not overlap",()=>{
  for(const a of GROUND_REGIONS){
    assert.ok(a.x>=0&&a.y>=0&&a.w>0&&a.h>0&&a.x+a.w<=100&&a.y+a.h<=100)
    for(const b of GROUND_REGIONS)if(a.id!==b.id)assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,a.id+" overlaps "+b.id)
  }
})
