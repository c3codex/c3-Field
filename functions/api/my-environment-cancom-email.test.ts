import assert from "node:assert/strict"
import {test} from "node:test"
import {onRequestPost} from "./my-environment-cancom-email"

const spec={nug_key:"myenv_cancom_email_op044_v1",env_key:"env-fixture",envpac_key:"pac-fixture",current_state_key:"current_env_person_eea672f5a7676dad4316755b_v1",origin_env_key:"origin-fixture",executor_ref:"registered-executor",execution_instance:"registered-execution",capability_ref:"registered-capability",authority_oar_key:"registered-oar",context_binding_key:"registered-context",effect_class:"external_email",native_function_ref:"public.resolve_cancom_context_v1(jsonb)"}
const key="12345678-1234-4234-8234-123456789012",occurrence="myenv-email-"+key

async function run(mode:"held"|"permission"|"success"|"receipt-held"|"ambiguous"){
  const original=globalThis.fetch, calls:{url:string;body:any}[]=[]
  globalThis.fetch=async(input,init)=>{
    const url=String(input),body=init?.body?JSON.parse(String(init.body)):null
    calls.push({url,body})
    const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status})
    if(url.includes("c3_env_runtime_session?"))return reply([{env_key:spec.env_key,envpac_key:spec.envpac_key,subject_key:"fixture-owner",subject_type:"individual",expires_at:"2099-01-01T00:00:00Z"}])
    if(url.includes("c3_envpac_access_grant?"))return reply([{grant_key:"fixture-grant"}])
    if(url.includes("codex_source_reference?"))return reply([{metadata:{}}])
    if(url.includes("c3ops_nug_binding?"))return reply([{standing:"active",spec}])
    if(url.endsWith("rpc/prepare_c3ops_nug_effect_v1")){
      if(mode==="held")return reply({standing:"HLD",reason:"authority_unresolved",missing_predicates:["authority"]})
      if(mode==="permission")return reply({code:"42501",message:"permission denied for table c3_current_state",hint:"SECRET MUST NOT LEAK"},403)
      return reply({standing:"awaiting_effect_receipt",occurrence_key:occurrence,provider_called:false,external_effects:0})
    }
    if(url==="https://api.resend.com/emails"){
      if(mode==="ambiguous")throw new Error("timeout fixture")
      return reply({id:"fixture-provider-id"})
    }
    if(url==="https://api.resend.com/emails/fixture-provider-id")return reply({message_id:"fixture-message-id"})
    if(url.endsWith("rpc/resolve_c3_env_directory_v1"))return reply({standing:"resolved",contact:{contact_key:"fixture-contact"}})
    if(url.endsWith("rpc/return_c3ops_nug_effect_v1"))return reply(mode==="receipt-held"?{standing:"HLD",reason:"effect_receipt_evidence_unresolved"}:{standing:"receipt_returned",occurrence_key:occurrence,receipt_evidence_ref_key:"nug_effect_receipt:"+occurrence,provider_called:false,new_external_effects:0,custody_transferred:false,current_state_key:spec.current_state_key,evidence_return_relation:"registry://c3_current_evidence_ref/"+spec.current_state_key})
    if(/c3_cancom_thread_ref|c3_cancom_message_ref|c3ops_oar_custody_resolution_event|c3_current_evidence_ref/.test(url))return new Response(null,{status:201})
    throw new Error("unexpected fixture route: "+url)
  }
  try{
    const request=new Request("https://fixture.invalid/api/my-environment-cancom-email",{method:"POST",headers:{cookie:"c3_env_session="+"a".repeat(64),"content-type":"application/json"},body:JSON.stringify({action:"send",to:"operator@example.invalid",subject:"fixture",text:"fixture",request_key:key})})
    const response=await onRequestPost({request,env:{SUPABASE_URL:"https://fixture.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fixture-only",C3_RESEND_API_KEY:"fixture-only",C1_VERIFICATION_FROM:"c3 Community Partners <connect@c3field.online>"}} as any)
    return {response,body:await response.json() as any,calls}
  }finally{globalThis.fetch=original}
}

test("Registry hold returns all six decision fields and never dispatches",async()=>{
  const {body,calls,response}=await run("held")
  assert.equal(response.status,409);assert.equal(body.reason_code,"authority_unresolved")
  for(const f of ["standing","disposition","reason_code","request_identity","provider_preflight","external_effects"])assert.ok(Object.hasOwn(body,f))
  assert.equal(body.external_effects,0);assert.deepEqual(body.missing_predicates,["authority"])
  assert.equal(calls.filter(c=>c.url.startsWith("https://api.resend.com")).length,0)
})
test("server permission diagnosis is safe and prevents dispatch",async()=>{
  const {body,calls}=await run("permission")
  assert.equal(body.reason_code,"nug_registry_permission_denied")
  assert.deepEqual(body.registry_error,{code:"42501",relation:"c3_current_state"})
  assert.ok(!JSON.stringify(body).includes("SECRET"))
  assert.equal(calls.filter(c=>c.url.startsWith("https://api.resend.com")).length,0)
})
test("accepted fixture effect uses the existing custody contract and returns receipt",async()=>{
  const {body,calls}=await run("success")
  assert.equal(body.standing,"email_effect_returned");assert.equal(body.external_effects,1)
  const custody=calls.find(c=>c.url.endsWith("c3ops_oar_custody_resolution_event"))!.body
  assert.equal(custody.process_key,"oar_evidence_asset_custody_resolution_v1")
  assert.equal(custody.object_type,"evidence");assert.equal(custody.intended_function,"nug_effect_receipt")
  assert.equal(custody.metadata.executor_ref,spec.executor_ref)
  assert.equal(calls.filter(c=>c.url==="https://api.resend.com/emails").length,1)
})
test("receipt hold retains provider acceptance and effect count",async()=>{
  const {body}=await run("receipt-held")
  assert.equal(body.standing,"receipt_return_held");assert.equal(body.external_effects,1)
  assert.equal(body.provider_preflight.standing,"provider_accepted")
})
test("ambiguous provider response is unverified and is never retried",async()=>{
  const {body,calls}=await run("ambiguous")
  assert.equal(body.external_effects,"unverified");assert.equal(body.disposition,"dispatch_unverified")
  assert.equal(calls.filter(c=>c.url==="https://api.resend.com/emails").length,1)
})
