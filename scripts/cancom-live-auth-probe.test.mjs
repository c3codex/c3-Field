import test from "node:test";
import assert from "node:assert/strict";
import { probe } from "./cancom-live-auth-probe.mjs";

const ids = {
  "worker-test-token": "11111111-1111-4111-8111-111111111111",
  "unbound-test-token": "22222222-2222-4222-8222-222222222222",
  "revoked-test-token": "33333333-3333-4333-8333-333333333333",
};
const env = {
  SUPABASE_URL: "https://unit-test.example", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
  CANCOM_WORKER_JWT: "worker-test-token", CANCOM_UNBOUND_JWT: "unbound-test-token",
  CANCOM_REVOKED_JWT: "revoked-test-token",
};
const verifyRevocation = async ({principalId,expectedStanding}) => ({
  standing: expectedStanding === "revoked" ? "verified" : "HLD",
  principalId, evidenceRef: "registry://isolated-test/revoked-binding",
});
const denying = reason => ({standing:"HLD",reason});
function mockFetch({
  authStatus = 200, authBody = null, denialReason = "worker_standing_unqualified",
  samePrincipal = false, malformedUser = false, discovery = null, traces = [],
} = {}) {
  return async (url, opts) => {
    const token = opts.headers.authorization.replace(/^Bearer /, "");
    traces.push({url,token});
    if (url.endsWith("/auth/v1/user")) return {
      ok:authStatus === 200,status:authStatus,
      json:async()=>malformedUser?{}:(authBody ?? {id:samePrincipal ? ids["worker-test-token"] : ids[token]}),
    };
    if (!url.endsWith("/rest/v1/rpc/cancom_codex_review_discover_v1")) throw Error("mutating RPC forbidden");
    if (discovery) return discovery(token);
    if (token==="worker-test-token") return {
      ok:true,json:async()=>({standing:"discoverable",effect_authority:"none",items:[]}),
    };
    return {ok:true,json:async()=>denying(denialReason)};
  };
}
test("missing credentials HOLD with no network calls",async()=>{
  const r=await probe({env:{},fetchImpl:async()=>{throw Error("network forbidden");}});
  assert.equal(r.standing,"HLD");assert.equal(r.executed,false);
});
test("identical token strings HOLD even before auth call",async()=>{
  const r=await probe({env:{...env,CANCOM_REVOKED_JWT:env.CANCOM_WORKER_JWT},fetchImpl:mockFetch()});
  assert.equal(r.reason,"distinct_access_tokens_required");assert.equal(r.executed,false);
});
test("3 roles positive read-only mock, not operational acceptance",async()=>{
  const traces=[];
  const r=await probe({env,fetchImpl:mockFetch({traces}),verifyRevocation});
  assert.equal(r.standing,"PROBE_PASS");
  assert.match(r.scope,/not_operational_acceptance/);
  assert.deepEqual(r.results.map(x=>x.standing),["PASS","PASS","PASS"]);
  assert.equal(traces.length,6);
  assert.ok(traces.every(x=>x.url.endsWith("/auth/v1/user") || x.url.endsWith("/rest/v1/rpc/cancom_codex_review_discover_v1")));
});
test("three distinct tokens for same authenticated user can NEVER pass",async()=>{
  const traces=[];
  const r=await probe({env,fetchImpl:mockFetch({samePrincipal:true,traces}),verifyRevocation});
  assert.equal(r.standing,"HLD");assert.equal(r.reason,"distinct_authenticated_principals_required");
  assert.equal(traces.length,3); // no RPC discovery allowed
});
test("malformed or unparseable user identity HOLD",async()=>{
  for (const body of [{id:"not-a-uuid"},{id:5},[],null]) {
    const r=await probe({env,fetchImpl:mockFetch({authBody:body}),verifyRevocation});
    assert.equal(r.standing,"HLD");
    assert.equal(r.reason,"platform_auth_identity_invalid");
  }
  const r=await probe({env,fetchImpl:async(url,opts)=>url.endsWith("/auth/v1/user")?
    {ok:true,json:async()=>{throw Error("bad json");}}:
    {ok:true,json:async()=>denying("worker_standing_unqualified")},verifyRevocation});
  assert.equal(r.reason,"platform_auth_identity_invalid");
});
test("invalid /auth/v1/user response is not valid identity",async()=>{
  const r=await probe({env,fetchImpl:mockFetch({authStatus:401}),verifyRevocation});
  assert.equal(r.reason,"platform_auth_user_not_validated");
});
test("missing independent revocation proof HOLD without discovery",async()=>{
  const traces=[];
  const r=await probe({env,fetchImpl:mockFetch({traces})});
  assert.equal(r.standing,"HLD");
  assert.equal(r.reason,"independent_revocation_evidence_unverified");
  assert.equal(traces.length,3);
});
test("self-declared or misbound revocation reference cannot pass",async()=>{
  for (const verifier of [
    async()=>({standing:"verified",principalId:ids["worker-test-token"],evidenceRef:"registry://claimed"}),
    async()=>({standing:"verified",principalId:ids["revoked-test-token"],evidenceRef:""}),
    async()=>({standing:"HLD",principalId:ids["revoked-test-token"],evidenceRef:"registry://test"}),
  ]) {
    const r=await probe({env,fetchImpl:mockFetch(),verifyRevocation:verifier});
    assert.equal(r.reason,"independent_revocation_evidence_unverified");
  }
});
test("an unrelated HLD is never authorization denial PASS",async()=>{
  for (const reason of ["unrelated_failure","session_not_live","invalid_session_claim","not_found",""]) {
    const r=await probe({env,fetchImpl:mockFetch({denialReason:reason}),verifyRevocation});
    assert.equal(r.standing,"HLD");
    assert.notEqual(r.results[1].standing,"PASS");
    assert.notEqual(r.results[2].standing,"PASS");
  }
});
test("gateway 404 and malformed JSON are not authorization denial",async()=>{
  const r=await probe({env,fetchImpl:mockFetch({discovery:async()=>({ok:false,status:404})}),verifyRevocation});
  assert.equal(r.standing,"HLD");
  assert.ok(r.results.every(x=>x.standing==="HLD"));
});
test("unbound or revoked worker wrongly granted discovery FAIL",async()=>{
  const r=await probe({env,fetchImpl:mockFetch({discovery:async()=>({
    ok:true,json:async()=>({standing:"discoverable",effect_authority:"none",items:[]}),
  })}),verifyRevocation});
  assert.equal(r.standing,"HLD");
  assert.deepEqual(r.results.map(x=>x.standing),["PASS","FAIL","FAIL"]);
});
test("unexpected standing is never denial PASS",async()=>{
  const r=await probe({env,fetchImpl:mockFetch({discovery:async token=>token==="worker-test-token" ?
    {ok:true,json:async()=>({standing:"discoverable",effect_authority:"none",items:[]})} :
    {ok:true,json:async()=>({standing:"unknown",reason:"worker_standing_unqualified"})}}),verifyRevocation});
  assert.equal(r.standing,"HLD");assert.notEqual(r.results[1].standing,"PASS");
});
