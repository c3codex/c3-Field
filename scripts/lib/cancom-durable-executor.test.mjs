import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createDurableExecutor} from './cancom-durable-executor.mjs';
function fixture() {
 const bytes=Buffer.from('payload'),sha=createHash('sha256').update(bytes).digest('hex');
 const p={standing:'resolved_for_executor',execution_instance:'i',executor_ref:'codex',passage_key:'i',return_route:'registry://cancom/oar1_return/i',serialization_basis:'utf8_raw_bytes_sha256',oar_key:'o',sha256:sha,payload_bytes:7,payload_custody_ref:'fixture'};
 let c,phase='',env,runs=0,timeout=false;const log=[];
 const receipt={standing:'held_for_registrar_review',execution_instance:'i',origin_oar2_key:'o',return_route:p.return_route,return_event_key:'receipt'};
 const gateway={call:async(op,args)=>{log.push(op);if(op==='resolve')return p;
 if(op==='claim'){if(phase)throw Error('HLD_duplicate');phase='claimed';return {standing:'claimed',token:'t',fence:1,action_key:'test',pickup:p};}
 if(op==='ack')return {standing:'acknowledged'};
 if(op==='start'){phase='started';return {standing:'started',fence:1,action_key:'test'};}
 if(op==='check')return {standing:'effect_fence_current',execution_instance:'i',token:'t',fence:1,action_key:'test'};
 if(op==='prepare'){env=args.envelope;phase='ready';return {standing:'ready'};}
 if(op==='status')return {standing:phase,envelope:env,receipt,execution_instance:'i',token:'t',fence:1};
 if(op==='return'){if(timeout)throw Error('timeout');phase='returned';return receipt;}
 throw Error('unknown');}};
 const checkpoint={get:async()=>c,insert:async(_,v)=>{if(c)return false;c=v;return true;}};
 const actions={test:async({assertFence})=>{runs++;await assertFence();return {oar1_text:'observed',origin_oar2_key:'o',canonical_sha256:sha,canonical_payload_ref:'fixture'};}};
 return {gateway,actions,log,p,timeout:v=>timeout=v,runs:()=>runs,worker:()=>createDurableExecutor({gateway,checkpoint,actions,readPayload:async()=>bytes})};
}
test('start precedes action fence and prepare precedes return',async()=>{const f=fixture();await f.worker().run('i');assert.ok(f.log.indexOf('start')<f.log.indexOf('check'));assert.ok(f.log.indexOf('prepare')<f.log.indexOf('return'));assert.equal(f.runs(),1);});
test('prepare then lost response recovers without effect replay',async()=>{const f=fixture();f.timeout(true);await assert.rejects(f.worker().run('i'),/timeout/);f.timeout(false);await f.worker().run('i');assert.equal(f.runs(),1);await f.worker().run('i');assert.equal(f.runs(),1);});
test('crash after start holds on restart',async()=>{const f=fixture();f.actions.test=async()=>{throw Error('crash');};await assert.rejects(f.worker().run('i'),/crash/);await assert.rejects(f.worker().run('i'),/HLD/);});
test('wrong instance or digest prevents action',async()=>{for(const mutate of [p=>p.execution_instance='other',p=>p.sha256='0'.repeat(64)]){const f=fixture();mutate(f.p);await assert.rejects(f.worker().run('i'),/HLD/);assert.equal(f.runs(),0);}});
test('unknown action cannot execute',async()=>{const f=fixture();delete f.actions.test;await assert.rejects(f.worker().run('i'),/HLD/);});
