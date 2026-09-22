import assert from "node:assert/strict"
import test from "node:test"
import {boundedSteeringProjection,onRequestGet,onRequest} from "./free-environment-steering"

test("missing Registry configuration holds without a public environment",async()=>{
  const response=await onRequestGet({request:new Request("https://c3field.online/api/free-environment-steering?route=/"),env:{}} as any)
  assert.equal(response.status,409)
  assert.deepEqual(await response.json(),{
    steering:"held",reason_code:"public_projection_unavailable",
    render_permitted:false,encounter_created:false})
})
test("arbitrary environment route cannot invoke Registry resolution",async()=>{
  for(const route of ["/my-environment","/c3ops","/measures-registry","/outside"]){
    const response=await onRequestGet({request:new Request(
      "https://c3field.online/api/free-environment-steering?route="+encodeURIComponent(route)),env:{}} as any)
    assert.equal(response.status,409)
    assert.equal((await response.json()).reason_code,"route_not_registered")
  }
})
test("held projection leaks no foreign environmental references or relations",async()=>{
  for(const value of [
    {steering:"held",reason_code:"current_environment_mismatch",environment_key:"foreign",current_key:"foreign_current"},
    {steering:"environment_resolved",render_permitted:false,environment_key:"foreign",
      current_key:"foreign_current",public_relations:[{private:"secret"}]}
  ]){
    const response=boundedSteeringProjection(value)
    assert.equal(response.status,409)
    const body=await response.json()
    assert.equal(body.render_permitted,false)
    assert.equal(body.encounter_created,false)
    assert.equal(JSON.stringify(body).includes("foreign"),false)
    assert.equal(JSON.stringify(body).includes("secret"),false)
  }
})
test("public view cannot render until a registered public-relation projection exists",async()=>{
  const response=boundedSteeringProjection({steering:"environment_resolved",render_permitted:true,
    environment_key:"env_registered",current_key:"current_registered",
    relation_projection:"held_pending_registered_public_projection",public_relations:[]})
  assert.equal(response.status,409)
  assert.equal((await response.json()).render_permitted,false)
})
test("fully matched public projection returns exact records and no encounter",async()=>{
  const response=boundedSteeringProjection({steering:"environment_resolved",render_permitted:true,
    environment_key:"env_registered",current_key:"current_registered",
    relation_projection:"registered_public",public_relations:[]})
  assert.equal(response.status,200)
  assert.deepEqual(await response.json(),{steering:"environment_resolved",
    environment_key:"env_registered",current_key:"current_registered",public_relations:[],
    render_permitted:true,encounter_created:false})
})
test("mutation methods do not steer or create an encounter",async()=>{
  const response=await onRequest({} as any)
  assert.equal(response.status,405)
})
