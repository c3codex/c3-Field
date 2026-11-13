import test from 'node:test';
import assert from 'node:assert/strict';
import {nurseryTurn} from './nursery.mjs';
import {createWorkersAIDriver} from './workers_ai_adapter.mjs';
const account='a'.repeat(32),token='TEST_TOKEN_DO_NOT_USE',modelId='@cf/openai/gpt-oss-20b';
const context={environment_key:'synthetic_env_test',current_ref:'synthetic_current_test',current_verified:true,capability:'chazz_conversation',capability_active:true,facts:[{environment_key:'synthetic_env_test',ref:'synthetic:fact',text:'A candidate is not authority.',retrieval_authorized:true}]};
const req={environment_key:'synthetic_env_test',message:'Please orient me.'};
test('requires explicit opt-in before even building inference driver',()=>{
  assert.throws(()=>createWorkersAIDriver({accountId:account,token,modelId}),e=>e.code==='REMOTE_INFERENCE_NOT_AUTHORIZED');
});
test('model is allowlisted, requests only synthetic context, and outputs remain non-authoritative',async()=>{
  let url,body;
  const fetchImpl=async(u,options)=>{url=u;body=JSON.parse(options.body);return {ok:true,json:async()=>({result:{response:JSON.stringify({kind:'orientation',text:'Welcome.',evidence_refs:['synthetic:fact']})}})};};
  const driver=createWorkersAIDriver({accountId:account,token,modelId,remoteOptIn:true,fetchImpl});
  const answer=await nurseryTurn(context,req,driver);
  assert.match(url,/gpt-oss-20b/);
  assert.equal(body.messages.length,2);
  assert.equal(answer.registry_write,false);
  assert.equal(answer.standing,'CANDIDATE_ONLY');
});
test('real environment is never sent to hosted inference',async()=>{
  let invoked=false;
  const driver=createWorkersAIDriver({accountId:account,token,modelId,remoteOptIn:true,fetchImpl:async()=>{invoked=true;throw Error('NOT_ALLOWED');}});
  const real={...context,environment_key:'c3envpac_REAL',current_ref:'c3current_REAL',facts:[{...context.facts[0],environment_key:'c3envpac_REAL'}]};
  await assert.rejects(()=>nurseryTurn(real,{environment_key:'c3envpac_REAL',message:'Hi'},driver),e=>e.code==='REAL_ENVIRONMENT_INFERENCE_FORBIDDEN');
  assert.equal(invoked,false);
});
