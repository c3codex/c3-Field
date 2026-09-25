import assert from "node:assert/strict"
import test from "node:test"
import {onRequestGet,onRequestPost} from "./my-environment-chazz"

test("Chazz bridge fails closed without an active My Environment session",async()=>{
  const response=await onRequestGet({
    request:new Request("https://my.c3field.online/api/my-environment-chazz"),
    env:{}
  } as never)
  const body=await response.json() as Record<string,unknown>
  assert.equal(response.status,401)
  assert.equal(body.standing,"HLD")
  assert.equal(body.runtime,"chazz_held")
  assert.equal(body.mutation_authority,false)
  assert.equal(body.external_effect_authority,false)
})

test("Chazz bridge rejects non-JSON turns before runtime resolution",async()=>{
  const response=await onRequestPost({
    request:new Request("https://my.c3field.online/api/my-environment-chazz",{method:"POST",body:"hello"}),
    env:{}
  } as never)
  const body=await response.json() as Record<string,unknown>
  assert.equal(response.status,415)
  assert.equal(body.standing,"DNR")
})
