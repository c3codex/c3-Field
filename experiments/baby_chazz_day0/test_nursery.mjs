import test from 'node:test';
import assert from 'node:assert/strict';
import { nurseryTurn } from './nursery.mjs';

const ENV = 'synthetic_env_A';
const base = () => ({
  environment_key: ENV, current_ref: 'synthetic_current_A_v1', current_verified: true,
  capability: 'chazz_conversation', capability_active: true,
  facts: [{environment_key: ENV, ref: 'synthetic:pac:1', text: 'A candidate PAC is not registered.', retrieval_authorized: true}],
});
const ask = () => ({ environment_key: ENV, message: 'What can I do here?' });
const oriented = async envelope => ({kind: 'orientation', text: 'I can explain the available context.', evidence_refs: [envelope.facts[0].ref]});
const hold = (fn, code) => assert.rejects(fn, e => e.name === 'AdmissionHold' && e.code === code);

test('read-only orientation never creates standing or effects', async () => {
  const r = await nurseryTurn(base(), ask(), oriented);
  assert.equal(r.standing, 'CANDIDATE_ONLY');
  assert.equal(r.authority_effect, 'none');
  assert.equal(r.registry_write, false);
  assert.equal(r.cancom_send, false);
  assert.equal(r.durable_memory_write, false);
});
test('cannot receive another environment\'s facts', async () => {
  const env = base();
  env.facts.push({environment_key:'synthetic_env_B',ref:'private:B',text:'Secret',retrieval_authorized:true});
  await hold(() => nurseryTurn(env, ask(), oriented), 'FACT_OUTSIDE_AUTHORIZED_ENVIRONMENT');
});
test('missing CURRENT fails closed', async () => {
  const env=base(); env.current_verified=false;
  await hold(() => nurseryTurn(env, ask(), oriented), 'CURRENT_UNVERIFIED');
});
test('wrong requested environment fails closed', async () => {
  await hold(() => nurseryTurn(base(), {environment_key:'synthetic_env_B',message:'Hello'}, oriented), 'ENVIRONMENT_MISMATCH');
});
test('missing conversation capability fails closed', async () => {
  const env=base(); env.capability_active=false;
  await hold(() => nurseryTurn(env, ask(), oriented), 'CAPABILITY_NOT_RESOLVED');
});
test('model cannot smuggle an execution instruction as output field', async () => {
  await hold(() => nurseryTurn(base(), ask(), async()=>({kind:'candidate',text:'Ready',evidence_refs:[],candidate:{summary:'PAC'},action:'register_pac'})), 'MODEL_REPLY_UNSUPPORTED_FIELD');
});
test('model cannot cite evidence from another environment', async () => {
  await hold(() => nurseryTurn(base(), ask(), async()=>({kind:'explanation',text:'Based on secret',evidence_refs:['private:B']})), 'EVIDENCE_OUTSIDE_ENVIRONMENT');
});
test('PAC draft remains candidate, never registered', async () => {
  const out=await nurseryTurn(base(),ask(),async()=>({kind:'candidate',text:'Here is a draft.',evidence_refs:['synthetic:pac:1'],candidate:{summary:'Form a community PAC'}}));
  assert.equal(out.candidate.registration,'not_requested');
  assert.equal(out.registry_write,false);
  assert.equal(out.standing,'CANDIDATE_ONLY');
});
test('HLD is a safe result',async()=>{
  const out=await nurseryTurn(base(),ask(),async()=>({kind:'hold',text:'Missing a relationship.',evidence_refs:[]}));
  assert.equal(out.standing,'HLD');
});
test('only admitted facts reach model driver',async()=>{
  const env=base();env.not_for_model='do not disclose';
  let received;
  await nurseryTurn(env,ask(),async c=>{received=c;return{kind:'orientation',text:'Hello',evidence_refs:[]};});
  assert.ok(!('not_for_model' in received));
  assert.ok(Object.isFrozen(received));
});
