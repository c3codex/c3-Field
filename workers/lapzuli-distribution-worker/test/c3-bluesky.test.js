import assert from "node:assert/strict";
import test from "node:test";
import { handleC3BlueskyRequest } from "../src/c3-bluesky-adapter.js";

const env={
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN:"control",
  C3FIELD_BLUESKY_HANDLE:"c3field.bsky.social",
  C3FIELD_BLUESKY_AUTH:"field-auth",
  C3PARTNERS_BLUESKY_HANDLE:"c3partners.bsky.social",
  C3PARTNERS_BLUESKY_AUTH:"partners-auth",
};

function headers(){return{authorization:"Bearer control","content-type":"application/json"}}
function body(overrides={}){
  return{
    target_key:"bluesky_c3field",
    publication_object_key:"mdm_soft_launch_week1_v1",
    campaign_asset_key:"mdm_w1_d1_bluesky_c3field_post_v1",
    derivative_key:"mdm_w1_d1_bluesky_c3field_caption_v1",
    distribution_asset_id:"mdm_w1_d1_bluesky_c3field_dist_v1",
    authority_reference:"campaign_pac_mdm_soft_launch_week1_v1",
    idempotency_key:"mdm:w1:d1:bluesky:c3field",
    text:"What becomes possible when a community can see what it already has?",
    canonical_url:"https://mdm.c3field.online/",
    lapzuli_callable:true,
    operator_confirmed:true,
    dry_run:true,
    ...overrides,
  }
}

test("c3 Bluesky path is protected",async()=>{
  const response=await handleC3BlueskyRequest(new Request("https://worker/bluesky/c3/health"),env,"/bluesky/c3/health");
  assert.equal(response.status,401);
});

test("c3 Bluesky dry run has zero external effects",async()=>{
  const response=await handleC3BlueskyRequest(new Request("https://worker/bluesky/c3/posts",{method:"POST",headers:headers(),body:JSON.stringify(body())}),env,"/bluesky/c3/posts");
  const payload=await response.json();
  assert.equal(response.status,200);
  assert.equal(payload.standing,"ACT");
  assert.equal(payload.action_state,"READY");
  assert.equal(payload.account_handle,"c3field.bsky.social");
  assert.equal(payload.external_publication_effects,0);
});

test("c3 Bluesky identity mismatch holds before provider call",async()=>{
  const response=await handleC3BlueskyRequest(
    new Request("https://worker/bluesky/c3/posts",{method:"POST",headers:headers(),body:JSON.stringify(body())}),
    {...env,C3FIELD_BLUESKY_HANDLE:"wrong.bsky.social"},
    "/bluesky/c3/posts",
  );
  const payload=await response.json();
  assert.equal(response.status,422);
  assert.equal(payload.standing,"HLD");
  assert.ok(payload.missing.includes("c3_bluesky_identity_mismatch"));
});

test("c3 Bluesky execute returns uri cid and public URL",async()=>{
  const original=globalThis.fetch;
  const calls=[];
  globalThis.fetch=async(url,options={})=>{
    calls.push({url,options});
    if(String(url).includes("createSession")) return Response.json({accessJwt:"jwt",did:"did:plc:field",handle:"c3field.bsky.social"});
    if(String(url).includes("createRecord")) return Response.json({uri:"at://did:plc:field/app.bsky.feed.post/abc123",cid:"cid123"});
    throw new Error("unexpected");
  };
  try{
    const response=await handleC3BlueskyRequest(new Request("https://worker/bluesky/c3/posts",{method:"POST",headers:headers(),body:JSON.stringify(body({dry_run:false,execute:true}))}),env,"/bluesky/c3/posts");
    const payload=await response.json();
    assert.equal(response.status,201);
    assert.equal(payload.standing,"ACT");
    assert.equal(payload.platform_cid,"cid123");
    assert.equal(payload.platform_url,"https://bsky.app/profile/c3field.bsky.social/post/abc123");
    assert.equal(payload.external_publication_effects,1);
    assert.equal(calls.length,2);
  }finally{globalThis.fetch=original}
});
