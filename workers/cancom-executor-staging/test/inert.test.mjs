import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.ts';
import {dispatchBoundary} from '../src/dispatch-boundary.ts';
import {readFile} from 'node:fs/promises';
test('health is static and secret-safe, with zero outbound calls',async()=>{
 const saved=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw Error('outbound forbidden');};
 try {const r=await worker.fetch(new Request('https://local/health'),{EXECUTION_ENABLED:'false',PRIVATE_TOKEN:'must-not-appear'});
 assert.equal(r.status,200);const body=await r.text();assert.ok(!body.includes('must-not-appear'));assert.equal(JSON.parse(body).execution_enabled,false);assert.equal(calls,0);}finally{globalThis.fetch=saved;}
});
for(const path of ['/execute','/wake','/poll','/claim','/return','/health'])test('POST '+path+' never dispatches',async()=>{
 const r=await worker.fetch(new Request('https://local'+path,{method:'POST'}),{EXECUTION_ENABLED:'false'});assert.equal(r.status,403);
});
test('missing or true execution flag fails closed',async()=>{for(const e of [{},{EXECUTION_ENABLED:'true'}])assert.equal((await worker.fetch(new Request('https://local/health'),e)).status,503);});
for(const reason of ['missing identity','revoked session','invalid payload','duplicate','timeout','crash','gateway unavailable','malformed receipt','replayed receipt'])test(reason+' cannot invoke any adapter in inert build',async()=>{
 let calls=0;const r=await dispatchBoundary({instance:'i',executionEnabled:true,qualify:async()=>{calls++;throw Error(reason);},runner:{run:async()=>{calls++;throw Error(reason);}}});assert.equal(r.standing,'HLD');assert.equal(calls,0);
});
test('configuration has no cron, queue, route, secret or active flags',async()=>{
 const c=JSON.parse(await readFile(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
 for(const x of [c,c.env.staging]){assert.equal(x.vars.EXECUTION_ENABLED,'false');assert.deepEqual(x.triggers.crons,[]);assert.deepEqual(x.routes,[]);assert.equal(x.workers_dev,false);assert.equal(x.preview_urls,false);assert.equal(x.queues,undefined);assert.equal(x.kv_namespaces,undefined);assert.equal(x.durable_objects,undefined);}
 assert.equal(worker.scheduled,undefined);assert.equal(worker.queue,undefined);
});
