import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createNativeExecutor,ExecutorHold} from './cancom-native-executor.mjs';
function fixture() {
 const bytes=Buffer.from('exact approved bytes'), sha=createHash('sha256').update(bytes).digest('hex');
 const state=new Map(); let runs=0;
 const permit={standing:'qualified',executor:'codex',principalId:'user',sessionId:'session',expiresAt:1000,oarKey:'oar',sourceSha256:sha,returnRoute:'registry://cancom/oar1_return/i',action:'local_test'};
 const pickup={standing:'resolved_for_executor',executor_ref:'codex',execution_instance:'i',passage_key:'i',oar_key:'oar',capability_ref:'cap',authority_scope_ref:'capability:cap',wake_event_key:'wake',manifest_event_key:'manifest',return_route:permit.returnRoute,serialization_basis:'utf8_raw_bytes_sha256',sha256:sha,payload_custody_ref:'github_file:pinned',payload_bytes:bytes.length};
 const adapter={authorize:async()=>({...permit}),resolve:async()=>({...pickup}),readPayload:async()=>bytes,claim:async()=>({token:'lease',expiresAt:1000}),returnOar1:async r=>({standing:r.result.standing,execution_instance:r.instance,origin_oar2_key:r.oar2Key,return_route:r.returnRoute,return_event_key:'receipt'})};
 const journal={get:async k=>state.get(k),insert:async(k,v)=>{if(state.has(k))return false;state.set(k,v);return true;},replace:async(k,p,v)=>{if(state.get(k)?.phase!==p)return false;state.set(k,v);return true;}};
 const actions={local_test:async()=>{runs++;return {oar1Text:'actual evidence',standing:'returned_for_registrar_review'};}};
 return {adapter,journal,actions,permit,pickup,state,runs:()=>runs,worker:()=>createNativeExecutor({adapter,journal,actions,now:()=>10})};
}
test('bounded native passage returns once; completed replay holds',async()=>{const f=fixture();assert.equal((await f.worker().run('i')).standing,'source_run_returned');await assert.rejects(f.worker().run('i'),/already_returned/);assert.equal(f.runs(),1);});
for(const [name,change] of [
 ['wrong executor',f=>f.pickup.executor_ref='other'],
 ['wrong digest',f=>f.pickup.sha256='a'.repeat(64)],
 ['wrong instance',f=>f.pickup.execution_instance='other'],
 ['unknown action',f=>f.permit.action='deploy'],
 ['revoked authority',f=>f.permit.standing='revoked'],
 ['expired authority',f=>f.permit.expiresAt=0],
 ['missing identity',f=>f.permit.sessionId=''],
 ['missing bytes',f=>f.adapter.readPayload=async()=>null],
 ['missing adapter',f=>f.adapter.claim=null],
 ['lease denied',f=>f.adapter.claim=async()=>null],
]) test(name+' holds without execution',async()=>{const f=fixture();change(f);await assert.rejects(f.worker().run('i'),ExecutorHold);assert.equal(f.runs(),0);});
test('timeout after execution retries only same return after restart',async()=>{const f=fixture();const send=f.adapter.returnOar1;f.adapter.returnOar1=async()=>{throw Error('network timeout');};await assert.rejects(f.worker().run('i'),/timeout/);f.adapter.returnOar1=send;await f.worker().run('i');assert.equal(f.runs(),1);});
test('crash during action never reruns ambiguous work',async()=>{const f=fixture();f.actions.local_test=async()=>{throw Error('crash');};await assert.rejects(f.worker().run('i'),/crash/);await assert.rejects(f.worker().run('i'),/outcome_unknown/);});
test('duplicate simultaneous dispatch executes at most once',async()=>{const f=fixture();const r=await Promise.allSettled([f.worker().run('i'),f.worker().run('i')]);assert.equal(r.filter(x=>x.status==='fulfilled').length,1);assert.equal(f.runs(),1);});
test('ambiguous receipt remains ready, never executes again',async()=>{const f=fixture();f.adapter.returnOar1=async()=>({standing:'returned_for_registrar_review'});await assert.rejects(f.worker().run('i'),/ambiguous/);assert.equal(f.state.get('i').phase,'ready');assert.equal(f.runs(),1);});
