import test from 'node:test';
import assert from 'node:assert/strict';
import {admitHistoricalWorkerClaim} from '../src/historical-claim.js';
const base={distribution_asset_id:'undrifted_hole_map_bluesky_dist_v1',dry_run:false,execute:true,
  atomic_execution_id:'11111111-1111-4111-8111-111111111111',historical_occurrence_key:'historical_manual_distribution_v1:'+'b'.repeat(64)};
const env={SUPABASE_URL:'https://registry.fixture.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture_only'};
test('unrelated and dry-run paths require no new grant',async()=>{
  assert.equal(await admitHistoricalWorkerClaim({...base,dry_run:true},{}),null);
  assert.equal(await admitHistoricalWorkerClaim({...base,distribution_asset_id:'unrelated'},{}),null);
});
test('historical provider requests HOLD without a bound claim or worker Registry configuration',async()=>{
  assert.equal((await admitHistoricalWorkerClaim({...base,atomic_execution_id:null},env)).reason,'historical_bound_worker_claim_required');
  assert.equal((await admitHistoricalWorkerClaim(base,{})).reason,'historical_worker_registry_credentials_unconfigured');
});
test('native HLD, unavailable or mismatched consume receipts do not admit provider dispatch',async()=>{
  const old=globalThis.fetch;
  try{
    for(const result of [null,{standing:'HLD',reason:'revoked'},{standing:'dispatch_admitted',execution_id:'another',occurrence_key:base.historical_occurrence_key}]){
      globalThis.fetch=async()=>Response.json(result);
      assert.equal((await admitHistoricalWorkerClaim(base,env)).external_publication_effects,0);
    }
    globalThis.fetch=async()=>{throw Error('timeout')};
    assert.equal((await admitHistoricalWorkerClaim(base,env)).standing,'HLD');
  }finally{globalThis.fetch=old}
});
test('native one-shot receipt must match exact execution and historical occurrence',async()=>{
  const old=globalThis.fetch;let calls=0;
  globalThis.fetch=async(url,init)=>{
    calls++;assert.equal(new URL(url).hostname,'registry.fixture.invalid');
    assert.equal(new URL(url).pathname,'/rest/v1/rpc/consume_lapzuli_historical_worker_claim_v1');
    assert.deepEqual(JSON.parse(init.body),{p_request:base});
    return Response.json({standing:'dispatch_admitted',execution_id:base.atomic_execution_id,occurrence_key:base.historical_occurrence_key});
  };
  try{assert.equal(await admitHistoricalWorkerClaim(base,env),null);assert.equal(calls,1)}finally{globalThis.fetch=old}
});
