import test from "node:test";
import assert from "node:assert/strict";
import {deliverConsent} from "../workers/owner-consent/delivery.mjs";
const now=()=>1700000000000;
const key="12345678-1234-1234-1234-123456789012";
const proof="a".repeat(64);
const p={relationship_key:"fixture_r",env_key:"fixture_e",envpac_key:"fixture_p",owner_session_token:"b".repeat(64),disposition:"retain_c3_field_custody",portability_receipt_key:null};
const result={standing:"delivery_required",relationship_key:p.relationship_key,env_key:p.env_key,envpac_key:p.envpac_key,disposition:p.disposition,prior_receipt_key:null,challenge_key:key,delivery_email:"owner@example.invalid",challenge_token:proof,expires_at:new Date(now()+300000).toISOString()};
const request=(body=p)=>new Request("https://owner-consent.internal/owner-consent",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
test("owner-only delivery projects receipt, not contact or code",async()=>{
 const sends=[];
 const resp=await deliverConsent(request(),{issue:async input=>{assert.deepEqual(input,p);return result},send:async m=>{sends.push(m);return true},now});
 assert.equal(resp.status,202);
 assert.deepEqual(await resp.json(),{standing:"confirmation_sent",challenge_key:key,expires_at:result.expires_at});
 assert.equal(sends.length,1);assert.equal(sends[0].to,result.delivery_email);
 assert.ok(sends[0].text.includes(proof));assert.ok(sends[0].text.includes("Keep PACs in c3 Field custody"));
});
test("caller-supplied recipient refuses without issue or delivery",async()=>{
 let calls=0;const resp=await deliverConsent(request({...p,delivery_email:"other@example.invalid"}),{issue:async()=>{calls++;return result},send:async()=>{calls++;return true},now});
 assert.equal(resp.status,409);assert.equal(calls,0);
});
test("mismatched target, disposition, prior receipt, expired result and held issuer do not send",async()=>{
 for(const patch of [{env_key:"other"},{disposition:"portable_export"},{prior_receipt_key:key},{expires_at:new Date(now()-1).toISOString()},{standing:"held"}]){
  let sent=0;const resp=await deliverConsent(request(),{issue:async()=>({...result,...patch}),send:async()=>{sent++;return true},now});
  assert.equal(resp.status,409);assert.equal(sent,0);
 }
});
test("transport failure or thrown private detail is not projected",async()=>{
 for(const send of [async()=>false,async()=>{throw Error(proof)}]){
  const resp=await deliverConsent(request(),{issue:async()=>result,send,now});
  assert.equal(resp.status,409);assert.ok(!(await resp.text()).includes(proof));
 }
});
test("no consent issue on GET",async()=>{
 let calls=0;const resp=await deliverConsent(new Request("https://owner-consent.internal/owner-consent"),{issue:async()=>{calls++;return result},send:async()=>true,now});
 assert.equal(resp.status,409);assert.equal(calls,0);
});
