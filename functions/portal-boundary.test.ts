import test from 'node:test'
import assert from 'node:assert/strict'
import {onRequest} from './_middleware'
const key='synthetic-local-operator-key'
async function run(path:string,headers:Record<string,string>={},configured=true,host='c3ops.c3field.online',method='GET') {
 let called=false
 const response=await onRequest({request:new Request(`https://${host}${path}`,{method,headers:{accept:'text/html',...headers}}),env:configured?{OPERATOR_DISPATCH_KEY:key}:{},next:async()=>{called=true;return new Response('protected room')}} as never)
 return {response,called}
}
test('public c3Ops navigation is tree-only without a challenge and preserves denial status',async()=>{
 for(const path of ['/','/systems-access/current','/c3optics','/relational-operations','/unresolved']) {
  const {response,called}=await run(path)
  assert.equal(called,false);assert.equal(response.status,401)
  assert.equal(response.headers.get('www-authenticate'),null)
  assert.equal(response.headers.get('cache-control'),'private, no-store')
  const body=await response.text();assert.match(body,/c3-tree-source-v1.png/)
  assert.doesNotMatch(body,/<form|<script|Operations|Interops|Optics/)
 }
})
test('missing configuration remains 503; API stays JSON and assets stay protected',async()=>{
 assert.equal((await run('/',{},false)).response.status,503)
 const api=await run('/api/c3ops/manifest')
 assert.equal(api.response.status,403);assert.equal(api.called,false)
 assert.deepEqual(await api.response.json(),{error:'operator access denied'})
 const asset=await run('/assets/protected.js',{accept:'*/*'})
 assert.equal(asset.response.status,401);assert.equal(asset.called,false)
 const tree=await run('/c3ops/c3-tree-source-v1.png',{accept:'image/png'},false)
 assert.equal(tree.called,true)
 assert.equal((await run('/c3ops/c3-tree-source-v1.png/other',{accept:'*/*'})).called,false)
 assert.equal((await run('/c3ops/c3-tree-source-v1.png',{accept:'*/*'},false,'c3ops.c3field.online','POST')).called,false)
})
test('explicit Operator entry challenges and returns to root only after existing key check',async()=>{
 const denied=await run('/operator-entry')
 assert.equal(denied.response.status,401);assert.match(denied.response.headers.get('www-authenticate')!,/Basic/)
 assert.equal(denied.called,false)
 const accepted=await run('/operator-entry',{authorization:'Basic '+btoa('op044:'+key)})
 assert.equal(accepted.response.status,303);assert.equal(accepted.response.headers.get('location'),'/')
 assert.equal(accepted.called,false)
})
test('native proof alone and legacy key-hash cookie cannot bypass the outer c3Ops guard',async()=>{
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key))
 const hash=Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,'0')).join('')
 for(const headers of [{'x-c3ops-session-proof':'synthetic.jwt.proof'},{cookie:'mr_operator_chamber='+hash}]) {
  const {response,called}=await run('/',headers)
  assert.equal(called,false);assert.equal(response.status,401)
 }
})
test('authorized page remains private and expires rather than reissues the legacy cookie',async()=>{
 const {response,called}=await run('/',{authorization:'Basic '+btoa('op044:'+key)})
 assert.equal(called,true);assert.equal(await response.text(),'protected room')
 assert.equal(response.headers.get('cache-control'),'private, no-store')
 assert.match(response.headers.get('set-cookie')!,/Max-Age=0/)
 assert.equal((await run('/systems-access',{'x-operator-dispatch-key':key},true,'my.c3field.online')).response.status,404)
})
test('HEAD boundary has no body',async()=>{
 const {response}=await run('/',{},true,'c3ops.c3field.online','HEAD')
 assert.equal(response.status,401);assert.equal(await response.text(),'')
})
