import assert from "node:assert/strict"
import test from "node:test"
import {onRequestPost, onRequest} from "./c3-community-connect-capture"
import {onRequest as packageRequest} from "./c3-community-connect-package"

const candidate = {name:"Review Participant",email:"review@example.invalid",message:"Connect local skills.",consent:true,participationIntention:true,attestation:true,connectAs:"individual"}
const send = (body: unknown, headers: Record<string,string> = {"content-type":"application/json"}) => {
  const request=new Request("http://127.0.0.1/api/c3-community-connect-capture",{method:"POST",headers,body:JSON.stringify(body)})
  return onRequestPost({request,env:{}} as any)
}
test("surfaced evidence reaches handler without registration or contact leakage", async () => {
  const response = await send(candidate), body = await response.json()
  assert.equal(response.status,409)
  assert.equal(body.saved,false)
  assert.equal(body.standing,"unable_to_process")
  assert.deepEqual(Object.keys(body).sort(),["message","saved","standing"])
  assert.ok(!JSON.stringify(body).includes(candidate.email))
  assert.equal(response.headers.get("cache-control"),"no-store")
})
for (const field of ["consent","participationIntention","attestation"]) {
  test(field + " must be explicit boolean true", async () => {
    for (const value of [undefined,false,"true",1]) assert.equal((await send({...candidate,[field]:value})).status,400)
  })
}
for (const field of ["current","standing","persistence","boundary","registryCar","contactVerified","timestamp","env_key"]) {
  test("rejects client authority field " + field, async () => {
    assert.equal((await send({...candidate,[field]:"cleared"})).status,400)
  })
}
test("unregistered initiative never transfers custody", async () => {
  const r = await send({...candidate,connectAs:"initiative",initiativeKey:"invented"})
  assert.equal(r.status,409)
  assert.equal((await r.json()).standing,"unable_to_process")
})
test("malformed, oversized and cross-origin inputs fail closed", async () => {
  for (const body of [null,[],{}, { ...candidate,email:"invalid" }]) assert.equal((await send(body)).status,400)
  assert.equal((await send({...candidate,message:"x".repeat(17000)})).status,413)
  assert.equal((await send(candidate,{"content-type":"text/plain"})).status,415)
  assert.equal((await send(candidate,{"content-type":"application/json",origin:"https://elsewhere.invalid"})).status,403)
})
test("method and hosted package routes stay closed regardless of client flags",async () => {
  assert.equal((await onRequest({} as any)).status,405)
  for (const url of ["https://c3field.online/api/c3-community-connect-package?review=1", "http://localhost/api/c3-community-connect-package"]) {
    const r = await packageRequest({request:new Request(url)} as any)
    assert.equal(r.status,423)
    assert.equal((await r.json()).available,false)
  }
})
