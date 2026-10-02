import assert from "node:assert/strict"
import test from "node:test"
import {onRequestGet} from "./my-environment-operations"

const request=()=>new Request("https://my.c3field.online/api/my-environment-operations",{
  headers:{cookie:"c3_env_session="+"a".repeat(64)}
})
const env={SUPABASE_URL:"https://registry.example",SUPABASE_SERVICE_ROLE_KEY:"server-test-key"}

test("Operations requires an owner session and an exact operator-bound primitive",async()=>{
  const absent=await onRequestGet({request:new Request(request().url),env} as never)
  assert.equal(absent.status,401)
  const original=globalThis.fetch
  globalThis.fetch=async(input,init)=>{
    const url=new URL(String(input))
    if(url.pathname.endsWith("c3_env_runtime_session")) return Response.json(init?.method==="PATCH"?[]:[{
      session_key:"session",envpac_key:"other_envpac",env_key:"other_env",
      subject_type:"individual",subject_key:"owner",expires_at:"2099-01-01T00:00:00Z"
    }])
    if(url.pathname.endsWith("c3_envpac_access_grant")) return Response.json([{
      grant_key:"owner_grant",subject_type:"individual"
    }])
    if(url.pathname.endsWith("c3_envpac_runtime_primitive")) return Response.json([{
      primitive_key:"operations",standing:"active",config:{operator_bound:false,operator_key:"op044",universal:false}
    }])
    throw new Error("unexpected read")
  }
  try{
    const denied=await onRequestGet({request:request(),env} as never)
    assert.equal(denied.status,403)
    assert.equal((await denied.json() as Record<string,unknown>).reason,"operations_surface_not_operator_bound")
  }finally{globalThis.fetch=original}
})

test("operator optics shows return and model standing without payload or control material",async()=>{
  const original=globalThis.fetch
  globalThis.fetch=async(input,init)=>{
    const url=new URL(String(input))
    if(url.pathname.endsWith("c3_env_runtime_session")) return Response.json(init?.method==="PATCH"?[]:[{
      session_key:"session",envpac_key:"operator_envpac",env_key:"operator_env",
      subject_type:"individual",subject_key:"owner",expires_at:"2099-01-01T00:00:00Z"
    }])
    if(url.pathname.endsWith("c3_envpac_access_grant")) return Response.json([{grant_key:"owner_grant",subject_type:"individual"}])
    if(url.pathname.endsWith("c3_envpac_runtime_primitive")) return Response.json([{
      primitive_key:"operations",standing:"active",config:{operator_bound:true,operator_key:"op044",universal:false}
    }])
    if(url.pathname.endsWith("system_oar_queue")) return Response.json([{
      queue_key:"queue_test",oar_key:"oar2_test",oar_type:"oar2",queue_status:"oar1_submitted",
      scope_key:"instance_test",requested_action:"bounded work",preflight_status:"passed",
      automation_permissions:{executor_ref:"codex",model_resolution_evidence_required:true,private_secret:"never_return"}
    }])
    if(url.pathname.endsWith("c3ops_oar_custody_resolution_event")) return Response.json([{
      related_execution_instance:"instance_test",standing:"returned_for_registrar_review",object_identifier:"oar1_test"
    }])
    if(url.pathname.endsWith("system_oar_execution_evidence")) return Response.json([{
      queue_key:"queue_test",validation_result:{model_resolution_evidence:{selected_model:"Codex"},payload_content:"never_return"}
    }])
    throw new Error("unexpected read")
  }
  try{
    const response=await onRequestGet({request:request(),env} as never)
    assert.equal(response.status,200)
    const body=await response.json() as {operations:Array<Record<string,unknown>>;optics_only:boolean;authority_created:boolean}
    assert.equal(body.optics_only,true)
    assert.equal(body.authority_created,false)
    assert.equal(body.operations[0].return_standing,"returned_for_registrar_review")
    assert.equal(body.operations[0].model_resolution_standing,"returned")
    assert.doesNotMatch(JSON.stringify(body),/never_return|"payload_content":|private_secret/)
  }finally{globalThis.fetch=original}
})
