import assert from "node:assert/strict"
import {test} from "node:test"
import {onRequestGet,onRequestPost} from "./my-environment-owner-lifecycle"

type Call={url:string;body:any;method:string}

function fixtureFetch(calls:Call[],mode:"preview"|"export"|"terminate"|"held"="preview"):typeof fetch{
  return async(input,init)=>{
    const url=String(input)
    const method=String(init?.method||"GET")
    const body=init?.body?JSON.parse(String(init.body)):null
    calls.push({url,body,method})
    const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status})
    if(url.includes("c3_env_runtime_session?"))return reply([{
      session_key:"fixture-session",
      envpac_key:"fixture-envpac",
      env_key:"fixture-env",
      subject_type:"individual",
      subject_key:"fixture-owner",
      standing:"active",
      expires_at:"2099-01-01T00:00:00Z",
      revoked_at:null
    }])
    if(url.includes("c3_envpac_access_grant?"))return reply([{
      grant_key:"fixture-owner-grant",
      subject_type:"individual",
      subject_key:"fixture-owner",
      relation_role:"owner",
      standing:"active",
      expires_at:null,
      revoked_at:null
    }])
    if(url.includes("c3_env_runtime_session?session_key=")&&method==="PATCH")return reply([])
    if(url.endsWith("rpc/resolve_my_env_owner_portability_v1")){
      const req=body?.p_request||{}
      if(mode==="held")return reply({standing:"held",reason:"fixture_hold"})
      if(req.action==="preview")return reply({
        standing:"resolved",owned_pac_count:2,non_owned_reference_count:1,
        transfer_blockers:[{pac_key:"initiative-pac",ownership_resolution:"owned_by_other_reference_only"}],
        active_initiative_count:1,active_connection_count:1,manifest_sha256:"a".repeat(64),
        disposition_options:["retain_c3_field_custody","portable_export","custody_transferred"]
      })
      if(req.action==="export")return reply({
        standing:"export_ready",receipt_key:"11111111-1111-4111-8111-111111111111",
        manifest_sha256:"b".repeat(64),manifest:{manifest_version:"fixture"},owned_pac_count:2,non_owned_reference_count:1
      })
    }
    if(url.endsWith("rpc/terminate_my_env_owner_v1")){
      if(mode!=="terminate")return reply({standing:"held",reason:"fixture_hold"})
      return reply({
        standing:"terminated",
        termination_receipt_key:"22222222-2222-4222-8222-222222222222",
        event_key:"event-fixture",
        pac_disposition:body?.p_request?.disposition,
        portable_manifest_sha256:"c".repeat(64),
        terminal_manifest:{manifest_version:"fixture-terminal"}
      })
    }
    throw new Error("unexpected fixture route: "+url)
  }
}

test("preview is session-bound and returns ownership counts",async()=>{
  const original=globalThis.fetch,calls:Call[]=[]
  globalThis.fetch=fixtureFetch(calls,"preview")
  try{
    const request=new Request("https://fixture.invalid/api/my-environment-owner-lifecycle",{headers:{cookie:"c3_env_session="+"a".repeat(64)}})
    const response=await onRequestGet({request,env:{SUPABASE_URL:"https://fixture.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fixture-only"}} as any)
    const body=await response.json() as any
    assert.equal(response.status,200)
    assert.equal(body.owned_pac_count,2)
    const rpc=calls.find(call=>call.url.endsWith("rpc/resolve_my_env_owner_portability_v1"))!
    assert.equal(rpc.body.p_request.relationship_key,"fixture-owner")
    assert.equal(rpc.body.p_request.env_key,"fixture-env")
    assert.equal(rpc.body.p_request.envpac_key,"fixture-envpac")
  }finally{globalThis.fetch=original}
})

test("export ignores caller identity and uses the owner session",async()=>{
  const original=globalThis.fetch,calls:Call[]=[]
  globalThis.fetch=fixtureFetch(calls,"export")
  try{
    const request=new Request("https://fixture.invalid/api/my-environment-owner-lifecycle",{
      method:"POST",headers:{cookie:"c3_env_session="+"a".repeat(64),"content-type":"application/json"},
      body:JSON.stringify({action:"export",relationship_key:"attacker",env_key:"wrong",envpac_key:"wrong"})
    })
    const response=await onRequestPost({request,env:{SUPABASE_URL:"https://fixture.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fixture-only"}} as any)
    const body=await response.json() as any
    assert.equal(response.status,200)
    assert.equal(body.standing,"export_ready")
    const rpc=calls.find(call=>call.url.endsWith("rpc/resolve_my_env_owner_portability_v1"))!
    assert.equal(rpc.body.p_request.relationship_key,"fixture-owner")
    assert.equal(rpc.body.p_request.env_key,"fixture-env")
    assert.equal(rpc.body.p_request.envpac_key,"fixture-envpac")
  }finally{globalThis.fetch=original}
})

test("termination requires exact confirmation before Registry mutation",async()=>{
  const original=globalThis.fetch,calls:Call[]=[]
  globalThis.fetch=fixtureFetch(calls,"terminate")
  try{
    const request=new Request("https://fixture.invalid/api/my-environment-owner-lifecycle",{
      method:"POST",headers:{cookie:"c3_env_session="+"a".repeat(64),"content-type":"application/json"},
      body:JSON.stringify({action:"terminate",confirmation:"terminate",disposition:"retain_c3_field_custody",understands_history_preserved:true,understands_reentry_required:true})
    })
    const response=await onRequestPost({request,env:{SUPABASE_URL:"https://fixture.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fixture-only"}} as any)
    assert.equal(response.status,400)
    assert.equal(calls.some(call=>call.url.endsWith("rpc/terminate_my_env_owner_v1")),false)
  }finally{globalThis.fetch=original}
})

test("successful termination is session-bound and clears the My Env cookie",async()=>{
  const original=globalThis.fetch,calls:Call[]=[]
  globalThis.fetch=fixtureFetch(calls,"terminate")
  try{
    const request=new Request("https://fixture.invalid/api/my-environment-owner-lifecycle",{
      method:"POST",headers:{cookie:"c3_env_session="+"a".repeat(64),"content-type":"application/json"},
      body:JSON.stringify({
        action:"terminate",
        relationship_key:"attacker",
        env_key:"wrong",
        envpac_key:"wrong",
        confirmation:"TERMINATE MY ENVIRONMENT",
        disposition:"retain_c3_field_custody",
        understands_history_preserved:true,
        understands_reentry_required:true
      })
    })
    const response=await onRequestPost({request,env:{SUPABASE_URL:"https://fixture.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fixture-only"}} as any)
    const body=await response.json() as any
    assert.equal(response.status,200)
    assert.equal(body.standing,"terminated")
    assert.match(response.headers.get("set-cookie")||"",/c3_env_session=;/)
    const rpc=calls.find(call=>call.url.endsWith("rpc/terminate_my_env_owner_v1"))!
    assert.equal(rpc.body.p_request.relationship_key,"fixture-owner")
    assert.equal(rpc.body.p_request.env_key,"fixture-env")
    assert.equal(rpc.body.p_request.envpac_key,"fixture-envpac")
  }finally{globalThis.fetch=original}
})
