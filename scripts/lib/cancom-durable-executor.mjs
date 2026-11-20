import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex');
const fail=()=>{throw Error('HLD_durable_execution_boundary');};

// No scheduler or default actions. gateway is the authenticated proposed RPC
// client; checkpoint must durably store token/fence before start. Action sink
// MUST call assertFence at the effect and enforce the fence atomically there.
export function createDurableExecutor({gateway,readPayload,checkpoint,actions={}}) {
 return {async run(instance) {
  const p=await gateway.call('resolve',{instance});
  if(p.standing!=='resolved_for_executor'||p.execution_instance!==instance||
   p.executor_ref!=='codex'||p.passage_key!==instance||
   p.return_route!==`registry://cancom/oar1_return/${instance}`||
   p.serialization_basis!=='utf8_raw_bytes_sha256'||!p.oar_key)fail();
  const validReceipt=r=>r?.standing==='held_for_registrar_review'&&r.execution_instance===instance&&
   r.origin_oar2_key===p.oar_key&&r.return_route===p.return_route&&typeof r.return_event_key==='string'&&r.return_event_key.length>0;
  let c=await checkpoint.get(instance),envelope;
  if(c) {
   if(c.sourceSha!==p.sha256||c.oarKey!==p.oar_key)fail();
   const s=await gateway.call('status',{instance,token:c.token,fence:c.fence});
   if(s.execution_instance!==instance||s.token!==c.token||s.fence!==c.fence)fail();
   if(s.standing==='returned'){if(!validReceipt(s.receipt))fail();return s.receipt;}
   if(s.standing!=='ready'||!s.envelope)fail(); // started/uncertain never reruns
   envelope=s.envelope;
  } else {
   const bytes=await readPayload(p.payload_custody_ref);
   if(!(bytes instanceof Uint8Array)||bytes.length!==p.payload_bytes||hash(bytes)!==p.sha256)fail();
   const lease=await gateway.call('claim',{instance,payload:bytes});
   if(lease.standing!=='claimed'||typeof lease.token!=='string'||
    !Number.isSafeInteger(lease.fence)||lease.fence<1||
    JSON.stringify(lease.pickup)!==JSON.stringify(p)||!Object.hasOwn(actions,lease.action_key))fail();
   c={token:lease.token,fence:lease.fence,sourceSha:p.sha256,oarKey:p.oar_key};
   if(!await checkpoint.insert(instance,c))fail();
   const args={instance,token:c.token,fence:c.fence};
   if((await gateway.call('ack',args)).standing!=='acknowledged')fail();
   const started=await gateway.call('start',args);
   if(started.standing!=='started'||started.fence!==c.fence||started.action_key!==lease.action_key)fail();
   const assertFence=async()=>{
    const s=await gateway.call('check',args);
    if(s.standing!=='effect_fence_current'||s.execution_instance!==instance||
     s.token!==c.token||s.fence!==c.fence||s.action_key!==lease.action_key)fail();
   };
   await assertFence();
   envelope=await actions[lease.action_key]({bytes,instance,fence:c.fence,assertFence});
   if(!envelope||typeof envelope.oar1_text!=='string'||!envelope.oar1_text||
    envelope.origin_oar2_key!==p.oar_key||envelope.canonical_sha256!==p.sha256||
    envelope.canonical_payload_ref!==p.payload_custody_ref)fail();
   if((await gateway.call('prepare',{...args,envelope})).standing!=='ready')fail();
  }
  const receipt=await gateway.call('return',{instance,token:c.token,fence:c.fence,envelope});
  if(!validReceipt(receipt))fail();
  return receipt;
 }};
}
