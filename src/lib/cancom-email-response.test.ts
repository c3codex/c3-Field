import assert from "node:assert/strict"
import {test} from "node:test"
import {readCanComEmailResponse} from "./cancom-email-response"
test("HTML gateway failure retains occurrence identity and unverified effect standing",async()=>{
  const result=await readCanComEmailResponse(new Response("<!DOCTYPE html><title>Gateway failure</title>",{status:502,headers:{"content-type":"text/html"}}),"fixture-key")
  assert.equal(result.external_effects,"unverified")
  assert.equal(result.response_status,502)
  assert.deepEqual(result.request_identity,{request_key:"fixture-key",occurrence_key:"myenv-email-fixture-key"})
  assert.ok(!JSON.stringify(result).includes("Gateway failure"))
})
test("verified server decision is preserved",async()=>{
  const decision={ok:false,standing:"receipt_return_held",external_effects:1}
  assert.deepEqual(await readCanComEmailResponse(Response.json(decision),"fixture-key"),decision)
})
