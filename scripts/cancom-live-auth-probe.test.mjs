import test from "node:test";
import assert from "node:assert/strict";
import { probe } from "./cancom-live-auth-probe.mjs";

const env = {
  SUPABASE_URL: "https://unit-test.example", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
  CANCOM_WORKER_JWT: "worker-test-token", CANCOM_UNBOUND_JWT: "unbound-test-token",
  CANCOM_REVOKED_JWT: "revoked-test-token",
};
function mockFetch({ denial = "HLD", authStatus = 200, workerAllowed = true } = {}) {
  return async (url, opts) => {
    const jwt = opts.headers.authorization.replace(/^Bearer /,"");
    if (url.includes("/auth/v1/user")) return { ok: authStatus === 200, status: authStatus };
    if (!url.includes("/rest/v1/rpc/cancom_codex_review_discover_v1")) throw Error("mutating RPC forbidden");
    if (jwt === "worker-test-token" && workerAllowed) return {
      ok: true, json: async()=>({standing:"discoverable",effect_authority:"none",items:[]}),
    };
    return {ok:true,json:async()=>({standing:denial,reason:"worker_binding_denied"})};
  };
}
test("no credentials means HOLD without network calls",async()=>{
  const r=await probe({env:{},fetchImpl:async()=>{throw Error("no network");}});
  assert.equal(r.standing,"HLD");assert.equal(r.executed,false);
});
test("distinct actual principals required",async()=>{
  const r=await probe({env:{...env,CANCOM_REVOKED_JWT:env.CANCOM_WORKER_JWT},fetchImpl:mockFetch()});
  assert.equal(r.standing,"HLD");assert.equal(r.reason,"distinct_signed_principals_required");
});
test("3-role read-only discovery passes mock contract, never claims full acceptance",async()=>{
  const r=await probe({env,fetchImpl:mockFetch()});
  assert.equal(r.standing,"PROBE_PASS");
  assert.match(r.scope,/not_operational_acceptance/);
  assert.deepEqual(r.results.map(x=>x.standing),["PASS","PASS","PASS"]);
});
test("gateway transport rejection is HOLD, never proof of denied authority",async()=>{
  const r=await probe({env,fetchImpl:async(url,opts)=>url.includes("/auth/v1/user")?
    {ok:true,status:200}:{ok:false,status:404}});
  assert.equal(r.standing,"HLD");
  assert.ok(r.results.every(x=>x.standing==="HLD"));
});
test("unauthorized discovery mistakenly permitted must not pass",async()=>{
  const r=await probe({env,fetchImpl:async(url,opts)=>{
    if(url.includes("/auth/v1/user")) return {ok:true,status:200};
    return {ok:true,json:async()=>({standing:"discoverable",effect_authority:"none",items:[]})};
  }});
  assert.equal(r.standing,"HLD");assert.deepEqual(r.results.map(x=>x.standing),["PASS","FAIL","FAIL"]);
});
test("unexpected RPC JSON standing is not an authorization-denial pass",async()=>{
  const r=await probe({env,fetchImpl:mockFetch({denial:"unknown"})});
  assert.equal(r.standing,"HLD");assert.notEqual(r.results[1].standing,"PASS");
});
test("invalid platform auth user cannot be treated as worker authorization proof",async()=>{
  const r=await probe({env,fetchImpl:mockFetch({authStatus:401})});
  assert.equal(r.standing,"HLD");assert.ok(r.results.every(x=>x.reason==="platform_auth_user_not_validated"));
});
