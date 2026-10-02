import assert from "node:assert/strict"
import test from "node:test"
import {onRequestGet} from "./my-environment-operations"
import {readC3OpsCurrentState} from "../_lib/me-environment"
import {readResolvedOarOptics,OAR_OPTICS_FIELDS,OAR_OPTICS_INTERFACE} from "../_lib/c3ops-oar-optics"

const request=()=>new Request("https://my.c3field.online/api/my-environment-operations",{
  headers:{cookie:"c3_env_session="+"a".repeat(64)},
})
const env={SUPABASE_URL:"https://registry.example",SUPABASE_SERVICE_ROLE_KEY:"server-test-key"}
const operation={oar_key:"oar2_test",execution_instance:"test",executor_ref:"codex",
  queue_standing:"oar1_submitted",preflight_standing:"passed",requested_action:"bounded work",
  return_standing:"returned_for_registrar_review",model_resolution_standing:"returned",
  validation_standing:"chazz_review_required",deploy_standing:"not_authorized",
  private_secret:"never_return",automation_permissions:{secret:"never_return"},payload_content:"never_return"}
function mock(config:Record<string,unknown>,calls:string[],fail=false):typeof fetch{
  return async(input,init)=>{
    const url=new URL(String(input));calls.push(url.pathname)
    if(url.pathname.endsWith("c3_env_runtime_session")) return Response.json(init?.method==="PATCH"?[]:[{
      session_key:"session",envpac_key:"operator_envpac",env_key:"operator_env",
      subject_type:"individual",subject_key:"owner",expires_at:"2099-01-01T00:00:00Z",
    }])
    if(url.pathname.endsWith("c3_envpac_access_grant"))return Response.json([{grant_key:"owner_grant",subject_type:"individual"}])
    if(url.pathname.endsWith("c3_envpac_runtime_primitive"))return Response.json([{primitive_key:"operations",standing:"active",config}])
    if(url.pathname.endsWith(OAR_OPTICS_INTERFACE)){
      assert.equal(url.searchParams.get("select"),OAR_OPTICS_FIELDS.join(","))
      return fail?new Response("unavailable",{status:503}):Response.json([operation])
    }
    throw Error("unauthorized raw-rail read: "+url.pathname)
  }
}
test("Operations requires owner session and exact op044 non-universal primitive",async()=>{
  assert.equal((await onRequestGet({request:new Request(request().url),env} as never)).status,401)
  const original=globalThis.fetch
  try{
    for(const config of [
      {operator_bound:false,operator_key:"op044",universal:false},
      {operator_bound:true,operator_key:"other",universal:false},
      {operator_bound:true,operator_key:"op044",universal:true},
      {operator_bound:true},
    ]){
      const calls:string[]=[];globalThis.fetch=mock(config,calls)
      const denied=await onRequestGet({request:request(),env} as never)
      assert.equal(denied.status,403)
      assert.equal(calls.some(path=>path.endsWith(OAR_OPTICS_INTERFACE)),false)
    }
  }finally{globalThis.fetch=original}
})
test("My Env renders resolved return/model standing and reads no raw OAR rail",async()=>{
  const original=globalThis.fetch;const calls:string[]=[]
  globalThis.fetch=mock({operator_bound:true,operator_key:"op044",universal:false},calls)
  try{
    const response=await onRequestGet({request:request(),env} as never)
    assert.equal(response.status,200)
    const body=await response.json() as {operations:Record<string,unknown>[];interface:string;authority_created:boolean}
    assert.equal(body.interface,OAR_OPTICS_INTERFACE);assert.equal(body.authority_created,false)
    assert.equal(body.operations[0].return_standing,"returned_for_registrar_review")
    assert.equal(body.operations[0].model_resolution_standing,"returned")
    assert.deepEqual(Object.keys(body.operations[0]),[...OAR_OPTICS_FIELDS])
    assert.doesNotMatch(JSON.stringify(body),/never_return|"payload_content":|automation_permissions/)
    assert.equal(calls.filter(path=>path.endsWith(OAR_OPTICS_INTERFACE)).length,1)
  }finally{globalThis.fetch=original}
})
test("resolved optics failure is held without raw-rail fallback",async()=>{
  const original=globalThis.fetch;const calls:string[]=[]
  globalThis.fetch=mock({operator_bound:true,operator_key:"op044",universal:false},calls,true)
  try{
    const response=await onRequestGet({request:request(),env} as never)
    assert.equal(response.status,500);assert.equal((await response.json() as any).standing,"HLD")
  }finally{globalThis.fetch=original}
})
test("Current State uses same resolved interface and retains separate NotChazz reports",async()=>{
  const calls:string[]=[]
  const read=async(table:string)=>{
    calls.push(table)
    if(table===OAR_OPTICS_INTERFACE)return [operation]
    if(table==="c3ops_notchazz_oar_formation_evaluation")return [{evaluation_key:"boundary",result:"PASS"}]
    if(["system_oar_queue","c3_oar_process_instance","c3_oar_transition_event","system_oar_execution_evidence","c3ops_oar_custody_resolution_event"].includes(table))throw Error("raw rail forbidden")
    return []
  }
  const result=await readC3OpsCurrentState(read)
  const component=result.components.find(c=>c.key==="oar_lifecycle")!
  assert.equal(component.source,OAR_OPTICS_INTERFACE)
  assert.deepEqual(component.records,await readResolvedOarOptics(read))
  assert.equal(component.records.some(r=>r.evaluation_key),false)
  assert.equal(result.components.find(c=>c.key==="optics")!.records.some(r=>r.evaluation_key==="boundary"),true)
  assert.equal(result.mutation_authority,false);assert.equal(result.external_effects,0)
})
