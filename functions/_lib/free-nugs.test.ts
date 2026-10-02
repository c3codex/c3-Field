import assert from "node:assert/strict"
import {test} from "node:test"
import {createFreeNugRuntime, createFreeNugServerRuntime, type NugRequest} from "./free-nugs"

const request: NugRequest = {nug_key:"fixture", origin_env_key:"origin", env_key:"target", envpac_key:"pac",
  current_state_key:"current", executor_ref:"fixture_executor", execution_instance:"fixture_execution",
  capability_ref:"cap", authority_oar_key:"oar", context_binding_key:"context"}

test("FREE delegates resolution without synthesizing permission", async () => {
  const calls: unknown[] = []
  const runtime = createFreeNugRuntime(async (name, args) => {
    calls.push([name, args]); return {standing:"HLD", missing_predicates:["authority"]}
  })
  assert.deepEqual(await runtime.resolve(request), {standing:"HLD", missing_predicates:["authority"]})
  assert.deepEqual(calls, [["resolve_c3ops_nug_v1", {p_request:request}]])
})
test("missing boundary and malformed Registry results fail closed", async () => {
  let calls = 0
  const runtime = createFreeNugRuntime(async () => {calls++; return {standing:"approved"}})
  assert.equal((await runtime.resolve({...request, capability_ref:""})).standing,"HLD")
  assert.equal(calls,0)
  assert.equal((await runtime.resolve(request)).standing,"HLD")
})
test("workerless native occurrence returns the exact Current relation", async () => {
  const runtime = createFreeNugRuntime(async (name,args) => {
    assert.equal(name,"call_c3ops_nug_native_v1")
    assert.deepEqual(args,{p_request:request,p_occurrence_key:"occurrence"})
    return {standing:"occurrence_returned",current_state_key:"current",occurrence_key:"occurrence",
      external_effects:0,custody_transferred:false,evidence_return_relation:"registry://c3_current_evidence_ref/current"}
  })
  assert.equal((await runtime.callNative(request,"occurrence")).standing,"occurrence_returned")
})
test("ambiguous call is held without retry; mismatched Current evidence is held", async () => {
  let calls = 0
  const runtime = createFreeNugRuntime(async () => {calls++; throw new Error("lost receipt")})
  assert.equal((await runtime.callNative(request,"occurrence")).reason,"occurrence_return_unverified")
  assert.equal(calls,1)
  const wrong = createFreeNugRuntime(async () => ({standing:"occurrence_returned",current_state_key:"other"}))
  assert.equal((await wrong.callNative(request,"occurrence")).standing,"HLD")
})
test("effect preparation and receipt return never call a provider", async () => {
  const calls: string[] = []
  const runtime = createFreeNugRuntime(async (name, args) => {
    calls.push(name)
    if (name === "prepare_c3ops_nug_effect_v1") return {standing:"awaiting_effect_receipt",
      occurrence_key:args.p_occurrence_key,provider_called:false,external_effects:0}
    assert.equal(name,"return_c3ops_nug_effect_v1")
    return {standing:"receipt_returned",occurrence_key:args.p_occurrence_key,
      receipt_evidence_ref_key:args.p_receipt_evidence_ref_key,provider_called:false,new_external_effects:0,
      custody_transferred:false,current_state_key:"current",evidence_return_relation:"registry://c3_current_evidence_ref/current"}
  })
  assert.equal((await runtime.prepareEffect(request,"effect")).standing,"awaiting_effect_receipt")
  assert.equal((await runtime.returnEffect("effect","fixture_executor","receipt")).standing,"receipt_returned")
  assert.deepEqual(calls,["prepare_c3ops_nug_effect_v1","return_c3ops_nug_effect_v1"])
})
test("supplied receipt identifiers do not bypass Registry hold", async () => {
  const runtime = createFreeNugRuntime(async () => ({standing:"HLD",reason:"effect_receipt_evidence_unresolved"}))
  assert.equal((await runtime.returnEffect("effect","fixture_executor","claimed_receipt")).standing,"HLD")
  assert.equal((await runtime.prepareEffect(request,"")).standing,"HLD")
})
test("server transport uses the bounded Registry RPC with redirect refusal", async () => {
  const original = globalThis.fetch
  try {
    globalThis.fetch = async (input, init) => {
      assert.equal(String(input),"https://fixture.supabase.co/rest/v1/rpc/resolve_c3ops_nug_v1")
      assert.equal(init?.redirect,"manual")
      assert.equal(init?.method,"POST")
      assert.deepEqual(JSON.parse(String(init?.body)),{p_request:request})
      return new Response(JSON.stringify({standing:"HLD",missing_predicates:["authority"]}),{status:200})
    }
    const runtime = createFreeNugServerRuntime("https://fixture.supabase.co","fixture_not_a_real_key")
    assert.equal((await runtime.resolve(request)).standing,"HLD")
    assert.throws(() => createFreeNugServerRuntime("http://fixture.supabase.co","fixture_not_a_real_key"))
  } finally {globalThis.fetch=original}
})

test("manual transport refuses Registry redirects without following or retrying",async()=>{
  const original=globalThis.fetch
  let calls=0
  try{
    globalThis.fetch=async(_input,init)=>{
      calls++;assert.equal(init?.redirect,"manual")
      return new Response(null,{status:302,headers:{location:"https://other.invalid/"}})
    }
    const runtime=createFreeNugServerRuntime("https://fixture.supabase.co","fixture-only")
    assert.deepEqual(await runtime.prepareEffect(request,"redirect-probe"),{standing:"HLD",reason:"nug_registry_redirect_refused"})
    assert.equal(calls,1)
  }finally{globalThis.fetch=original}
})
