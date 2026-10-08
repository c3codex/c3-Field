import assert from "node:assert/strict"
import {test} from "node:test"
import {myStashRequest,MY_STASH_NUG_KEY} from "./my-stash"
import {createFreeNugRuntime} from "./free-nugs"
import {onRequestPost} from "../api/my-environment-stash"

const session={envKey:"env",envpacKey:"pac",subjectKey:"owner"}
const spec={env_key:"env",envpac_key:"pac",current_state_key:"current",origin_env_key:"origin",
  executor_ref:"executor",execution_instance:"execution",capability_ref:"cap",authority_oar_key:"oar",
  context_binding_key:"context",native_process_key:"c3ops_nug_my_stash_v1",
  native_function_ref:"public.resolve_c3ops_my_stash_v1(jsonb)",adapter_class:"direct_native",effect_class:"none",
  native_input:{env_key:"env",envpac_key:"pac",current_state_key:"current",owner_subject_key:"owner",
    default_visibility:"private",event_contract:"my_stash_private_reference_v1"}}
const binding={nug_key:MY_STASH_NUG_KEY,standing:"active",spec}

test("owner/environment mismatch cannot enter the NUG caller",()=>{
  for(const wrong of [{...session,subjectKey:"other"},{...session,envKey:"other"},{...session,envpacKey:"other"}])
    assert.throws(()=>myStashRequest(binding,wrong,{action:"list"}),/session_binding_mismatch/)
})
test("participant input cannot override the Registry boundary or introduce publication",()=>{
  for(const input of [{action:"retain",asset_key:"a",env_key:"other"},{action:"publish",asset_key:"a"},
    {action:"surface_intent",reference_key:"a",visibility:"public"},{action:"list",capability_ref:"invented"}])
    assert.throws(()=>myStashRequest(binding,session,input),/participant_request_boundary/)
})
test("PRIVATE policy and exact native binding are required",()=>{
  assert.throws(()=>myStashRequest({...binding,spec:{...spec,effect_class:"external_email"}},session,{action:"list"}))
  assert.throws(()=>myStashRequest({...binding,spec:{...spec,native_input:{...spec.native_input,default_visibility:"public"}}},session,{action:"list"}))
})
test("FREE forwards explicit participant action; Registry HOLD remains authoritative",async()=>{
  const request=myStashRequest(binding,session,{action:"surface_intent",reference_key:"a",target_surface:"Desk"})
  let calls=0
  const runtime=createFreeNugRuntime(async(name,args)=>{
    calls++;assert.equal(name,"call_c3ops_nug_native_v1");assert.deepEqual(args.p_request,request)
    return {standing:"HLD",missing_predicates:["authority"]}
  })
  assert.deepEqual(await runtime.callNative(request,"occurrence"),{standing:"HLD",missing_predicates:["authority"]})
  assert.equal(calls,1)
})
test("HTTP rejects cross-origin and missing session before Registry access",async()=>{
  const original=globalThis.fetch;let calls=0
  globalThis.fetch=async()=>{calls++;throw new Error("unexpected")}
  try{
    const invoke=(request:Request)=>(onRequestPost as unknown as (ctx:unknown)=>Promise<Response>)({request,env:{}})
    const cross=await invoke(new Request("https://fixture/api/my-environment-stash",{method:"POST",
      headers:{origin:"https://other","content-type":"application/json"},body:'{"action":"list","request_key":"request001"}'}))
    assert.equal(cross.status,403)
    const missing=await invoke(new Request("https://fixture/api/my-environment-stash",{method:"POST",
      headers:{origin:"https://fixture","content-type":"application/json"},body:'{"action":"list","request_key":"request001"}'}))
    assert.equal(missing.status,401);assert.equal(missing.headers.get("cache-control"),"private, no-store")
    assert.equal(calls,0)
  }finally{globalThis.fetch=original}
})
