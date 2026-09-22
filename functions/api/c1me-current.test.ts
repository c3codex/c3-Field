import assert from "node:assert/strict"
import test from "node:test"
import {authorizeResolvedCurrent,onRequestGet,onRequest} from "./c1me-current"

const session={subjectKey:"crs_verified",envKey:"env_owned",envpacKey:"envpac_owned"}
const current={resolution:"existing_c1",relationship_ref:session.subjectKey,
  env_key:session.envKey,envpac_ref:session.envpacKey,current_ref:"current_evidenced"}

test("unauthenticated CURRENT request cannot query Registry or reveal identity",async()=>{
  const result=await onRequestGet({request:new Request("https://c3field.online/api/c1me-current"),env:{}} as any)
  assert.equal(result.status,401)
  assert.deepEqual(await result.json(),{resolution:"auth_required",reason_code:"environment_session_required"})
  assert.equal(result.headers.get("cache-control"),"no-store")
})
test("GET is only supported method",async()=>{
  const response=await onRequest({} as any)
  assert.equal(response.status,405)
})
test("matching authenticated session and registered CURRENT permits only return encounter",async()=>{
  const r=authorizeResolvedCurrent(session,current)
  assert.equal(r.status,200)
  assert.deepEqual(await r.json(),{
    resolution:"existing_c1",next_encounter:"enter_existing_environment",
    current_ref:"current_evidenced",may_create_personal_environment:false
  })
})
test("a different relationship, EnvPac or environment cannot be exposed by resolver",async()=>{
  for(const mismatch of [
    {relationship_ref:"crs_other"},
    {envpac_ref:"envpac_other"},
    {env_key:"env_other"},
    {relationship_ref:undefined},
    {envpac_ref:undefined},
    {env_key:undefined}
  ]){
    const response=authorizeResolvedCurrent(session,{...current,...mismatch})
    assert.equal(response.status,409)
    assert.deepEqual(await response.json(),{
      resolution:"reconciliation_hold",reason_code:"session_environment_mismatch",
      may_create_personal_environment:false
    })
  }
})
test("unresolved personal CURRENT cannot be treated as successful reentry",async()=>{
  for(const state of [
    {...current,current_ref:null},
    {...current,current_ref:""},
    {resolution:"reconciliation_hold",reason_code:"current_evidence_missing"},
    {resolution:"candidate_pending",reason_code:"c1_not_persisted"}
  ]){
    const response=authorizeResolvedCurrent(session,state)
    assert.equal(response.status,409)
    const body=await response.json()
    assert.equal(body.resolution,"reconciliation_hold")
    assert.equal(body.may_create_personal_environment,false)
    assert.equal("envpac_ref" in body,false)
  }
})
