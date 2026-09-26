import assert from "node:assert/strict"
import test from "node:test"
import {beginExistingInitiative322,type PassageEnv} from "./c1-passage"

const relationshipKey="crs_"+"a".repeat(32)
const requestEventKey="event_"+"d".repeat(32)
const env:PassageEnv={
  SUPABASE_URL:"https://zfihrspxvennjzazxcbj.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY:"server-secret",
  C3_RESEND_API_KEY:"transport-secret",
  C1_VERIFICATION_FROM:"c3 <connect@example.invalid>",
  C1_PUBLIC_ORIGIN:"https://c3field.online",
  C1_VERIFICATION_SIGNING_KEY:"s".repeat(48),
  C1_PASSAGE_ENABLED:"true"
}

test("existing My Env owner starts 47pct through acknowledgment-pending passage only",async()=>{
  const calls:Array<{url:string;args:Record<string,unknown>}>=[]
  const deps={
    now:()=>Date.parse("2026-09-25T23:00:00-05:00"),
    fetch:async(input:RequestInfo|URL,init?:RequestInit)=>{
      const url=String(input)
      const args=JSON.parse(String(init?.body||"{}")) as Record<string,unknown>
      calls.push({url,args})
      assert.ok(url.endsWith("/rest/v1/rpc/record_c1_initiative_connect_requested"))
      return new Response(JSON.stringify({
        accepted:true,
        relationship_key:relationshipKey,
        initiative_key:"47pct",
        request_event_key:requestEventKey,
        standing:"acknowledgment_pending",
        next_permitted_encounter:"322_acknowledge",
        existing:false
      }),{status:200,headers:{"content-type":"application/json"}})
    }
  }
  const result:any=await beginExistingInitiative322({
    relationshipKey,
    initiativeKey:"47pct",
    sourceHost:"47pct.c3field.online",
    metadata:{source_envpac_key:"c3envpac_person_test_v0_1"}
  },env,deps)
  assert.equal(calls.length,1)
  assert.equal(calls[0].args.p_relationship_key,relationshipKey)
  assert.equal(calls[0].args.p_initiative_key,"47pct")
  assert.equal(calls[0].args.p_source_host,"47pct.c3field.online")
  assert.deepEqual((calls[0].args.p_metadata as Record<string,unknown>).source_route,"/api/my-environment-initiative-connect")
  assert.equal(result.standing,"322_acknowledgment_required")
  assert.equal(result.saved,true)
  assert.equal(result.acknowledgment_required,true)
  assert.equal(result.initiative_key,"47pct")
  assert.equal(result.request_event_key,requestEventKey)
  assert.equal(result.ack_contract.contractKey,"47pct_pre_my_env_322_v1")
  const next=new URL(result.acknowledgment_url)
  assert.equal(next.origin,"https://c3field.online")
  assert.equal(next.pathname,"/api/c3-community-connect-acknowledge")
  assert.ok(next.hash.startsWith("#ticket="))
  assert.equal("support" in result,false)
  assert.equal("attendance" in result,false)
  assert.equal("contribution" in result,false)
  assert.equal("c2" in result,false)
})

test("existing-owner helper cannot start an unregistered initiative contract",async()=>{
  let called=false
  await assert.rejects(
    beginExistingInitiative322({
      relationshipKey,
      initiativeKey:"million_dollar_mission",
      sourceHost:"mdm.c3field.online"
    },env,{now:()=>Date.now(),fetch:async()=>{called=true;throw new Error("should not fetch")}}),
    /initiative_not_supported/
  )
  assert.equal(called,false)
})
