import test from "node:test";
import assert from "node:assert/strict";
import {createCanComCodexReviewClient, CanComReviewHold} from "./cancom-codex-review-client.mjs";

const instance = "op044_auth_request_intake_install_c3ops_deploy_codex_20261114_015";
const event = instance + ":codex_security_review:outbox:v1";
const token = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const hash = "a".repeat(64);

function mockClient(answer, traces, getAccessToken = async () => "a.real.user.jwt.placeholder") {
  return createCanComCodexReviewClient({
    supabaseUrl: "https://example.supabase.co",
    publishableKey: "sb_publishable_test",
    getAccessToken,
    fetchImpl: async (url, init) => {
      traces.push({url,init});
      return {ok: true, json: async () => answer};
    },
  });
}
function pickup() {
  return {
    standing: "resolved_and_claimed_for_review",
    allowed_effect: "none",
    work_class: "executor_security_review_continuation",
    operator_final_disposition_reserved: true,
    execution_instance: instance,
    outbox_event_key: event,
    lease_token: token,
    original_oar1_sha256: hash,
  };
}

test("JWT-based pickup calls only the public bounded continuation RPC", async () => {
  const traces = [];
  const response = await mockClient(pickup(),traces).pickup(instance);
  assert.equal(response.lease_token,token);
  assert.match(traces[0].url,/\/rest\/v1\/rpc\/cancom_codex_review_pickup_v1$/);
  assert.equal(traces[0].init.headers.authorization,"Bearer a.real.user.jwt.placeholder");
  const request = JSON.parse(traces[0].init.body);
  assert.deepEqual(request,{p_key_type:"execution_instance",p_key:instance,p_executor:"codex"});
});
test("rejects installation or deployment authority even when gateway says success", async () => {
  const traces=[];
  await assert.rejects(
    mockClient({...pickup(),allowed_effect:"deploy"},traces).pickup(instance),
    CanComReviewHold);
});
test("rejects a generic Registrar work item as a Codex continuation",async()=>{
  await assert.rejects(
    mockClient({...pickup(),work_class:"registrar_oar1_review"},[]).pickup(instance),
    CanComReviewHold);
});
test("rejects missing, forged or mismatched binding values",async()=>{
  for (const mutation of [
    {execution_instance:"other"},
    {lease_token:"not-a-uuid"},
    {original_oar1_sha256:"0"},
    {operator_final_disposition_reserved:false},
  ]) {
    await assert.rejects(
      mockClient({...pickup(),...mutation},[]).pickup(instance),
      CanComReviewHold);
  }
});
test("denies missing user session and never falls back to service key", async()=>{
  await assert.rejects(mockClient(pickup(),[],async()=>null).pickup(instance),CanComReviewHold);
  await assert.rejects(mockClient(pickup(),[],async()=> "sb_publishable_test").pickup(instance),CanComReviewHold);
});
test("ACK is scoped to the exact lease token",async()=>{
  const traces=[];
  const accepted=await mockClient({standing:"acknowledged",idempotent:false},traces)
    .acknowledge(event,token);
  assert.equal(accepted.standing,"acknowledged");
  assert.equal(JSON.parse(traces[0].init.body).p_lease_token,token);
  await assert.rejects(mockClient({standing:"HLD",reason:"lease_expired"},[]).acknowledge(event,token),CanComReviewHold);
});
test("returnReview is evidence-only and keeps operator disposition pending",async()=>{
  const traces=[];
  await mockClient({
    standing:"review_returned",authority_effect:"none",
    operator_disposition:"pending_independent_review",
  },traces).returnReview({
    outboxEventKey:event,leaseToken:token,standing:"HLD",
    evidenceRef:"registry://test/evidence",findingsSha256:hash,
  });
  assert.equal(JSON.parse(traces[0].init.body).p_standing,"HLD");
  await assert.rejects(
    mockClient({standing:"review_returned",authority_effect:"install",operator_disposition:"complete"},[])
    .returnReview({outboxEventKey:event,leaseToken:token,standing:"review_complete",
      evidenceRef:"registry://test/evidence",findingsSha256:hash}),
    CanComReviewHold);
});
test("discovery rejects malformed and effect-authorizing responses",async()=>{
  const data={standing:"discoverable",effect_authority:"none",items:[{event_key:event}]};
  assert.equal((await mockClient(data,[]).discover()).length,1);
  await assert.rejects(mockClient({...data,effect_authority:"deploy"},[]).discover(),CanComReviewHold);
  await assert.rejects(mockClient({...data,items:{}},[]).discover(),CanComReviewHold);
});
test("gateway non-200 responses fail closed",async()=>{
 const client=createCanComCodexReviewClient({
  supabaseUrl:"https://example.supabase.co",publishableKey:"public",
  getAccessToken:async()=> "user-jwt",
  fetchImpl:async()=>({ok:false,status:401}),
 });
 await assert.rejects(client.discover(),CanComReviewHold);
});
