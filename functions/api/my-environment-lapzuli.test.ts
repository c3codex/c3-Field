import test from "node:test"
import assert from "node:assert/strict"
import {onRequestPost} from "./my-environment-lapzuli"
import {HISTORICAL_ASSET,HISTORICAL_INSTANCE,HISTORICAL_PASSAGE} from "../_lib/lapzuli-historical-claim"
const token="a".repeat(64),service="fixture_service_not_a_real_secret",transport="fixture_transport_not_a_real_secret"
const env={SUPABASE_URL:"https://registry.fixture.invalid",SUPABASE_SERVICE_ROLE_KEY:service,OPERATOR_DISPATCH_KEY:transport}
const grant={standing:"active",scope:{allowed_actions:["historical_identity_passage"],execution_instance:HISTORICAL_INSTANCE,
  operator_ref:"op044",allowed_asset:HISTORICAL_ASSET,expires_at:new Date(Date.now()+600000).toISOString()}}
const action={action:"dispatch_historical_asset",distribution_asset_key:HISTORICAL_ASSET}
function fixture(mode="held"){
  let upstream=0;const calls:string[]=[]
  const fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
    const url=new URL(String(input));calls.push(url.hostname+url.pathname)
    if(url.hostname==="c3ops.c3field.online"){
      upstream++;const headers=new Headers(init?.headers)
      assert.equal(headers.has("cookie"),false);assert.equal(headers.has("authorization"),false);assert.equal(headers.has("origin"),false)
      assert.equal(headers.get("x-operator-dispatch-key"),transport);assert.equal(headers.get("x-c3-private-owner-session"),token)
      assert.equal(headers.get("x-c3-contract"),HISTORICAL_PASSAGE);assert.equal(headers.get("x-c3-execution-instance"),HISTORICAL_INSTANCE)
      assert.deepEqual(JSON.parse(String(init?.body)),action);assert.equal(init?.redirect,"manual")
      if(mode==="timeout")throw Error(token+service+transport)
      if(mode==="redirect")return new Response(null,{status:302,headers:{location:"https://attacker.invalid"}})
      if(mode==="secret-response")return Response.json({standing:"HLD",reason:token,external_publication_effects:0,token,service,transport})
      return Response.json({standing:"HLD",reason:"separate_exact_effect_grant_unresolved:operator",external_publication_effects:0},{status:409})
    }
    assert.equal(url.hostname,"registry.fixture.invalid")
    const table=url.pathname.split("/").pop()
    if(table==="c3_env_runtime_session")return init?.method==="PATCH"?new Response(null,{status:204}):Response.json([{
      session_key:"11111111-1111-4111-8111-111111111111",env_key:"personal",envpac_key:"personalpac",subject_type:"individual",subject_key:"relationship",
      standing:"active",revoked_at:null,expires_at:new Date(Date.now()+600000).toISOString()}])
    if(table==="c3_envpac_access_grant")return Response.json(mode==="revoked-owner"?[]:[{grant_key:"owner",subject_type:"individual",subject_key:"relationship",relation_role:"owner",standing:"active"}])
    if(table==="resolve_c1me_operator_context_internal")return Response.json({resolution:"operator_context_resolved",relationship_ref:"relationship",env_key:"personal",envpac_ref:"personalpac",operator_count:1,
      operators:[{operator_identifier:mode==="wrong-actor"?"another":"op044",named_individual_key:"fixture_person",operator_standing_key:"op044_standing"}]})
    if(table==="c3_envpac_capability_grant")return Response.json([{...grant,standing:mode==="inactive-passage"?"inactive":"active"}])
    throw Error("Unexpected local-test request")
  }
  return{fetch,upstream:()=>upstream,calls}
}
const request=(body=action,extra:Record<string,string>={})=>new Request("https://my.c3field.online/api/my-environment-lapzuli",{
  method:"POST",headers:{origin:"https://my.c3field.online","content-type":"application/json",cookie:"c3_env_session="+token,...extra},body:JSON.stringify(body)})
test("cross-origin and copied-cookie routes cannot use the My Env passage",async()=>{
  const f=fixture(),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof globalThis.fetch
  try{
    const response=await onRequestPost({request:request(action,{origin:"https://attacker.invalid"}),env} as never)
    assert.equal(response.status,403);assert.equal(f.calls.length,0)
  }finally{globalThis.fetch=old}
})
for(const mode of ["revoked-owner","wrong-actor","inactive-passage"])
  test("My Env passage holds before c3Ops: "+mode,async()=>{
    const f=fixture(mode),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof globalThis.fetch
    try{
      const response=await onRequestPost({request:request(),env} as never),body=await response.json()
      assert.equal(response.status,409);assert.equal(f.upstream(),0);assert.equal(body.external_publication_effects,0)
    }finally{globalThis.fetch=old}
  })
for(const mode of ["held","secret-response","timeout","redirect"])
  test("bounded server-side passage and secret-safe receipt: "+mode,async()=>{
    const f=fixture(mode),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof globalThis.fetch
    try{
      const response=await onRequestPost({request:request(),env} as never),text=await response.text(),body=JSON.parse(text)
      assert.equal(f.upstream(),1);assert.equal(body.standing,"HLD")
      for(const secret of [token,service,transport])assert.equal(text.includes(secret),false)
      assert.equal(body.external_publication_effects,["timeout","redirect"].includes(mode)?null:0)
    }finally{globalThis.fetch=old}
  })
test("body cannot supply its own identity or session material",async()=>{
  const f=fixture(),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof globalThis.fetch
  try{
    const response=await onRequestPost({request:request({...action,operator_ref:"op044",session_token:token} as typeof action),env} as never)
    assert.equal(response.status,409);assert.equal(f.upstream(),0)
  }finally{globalThis.fetch=old}
})
