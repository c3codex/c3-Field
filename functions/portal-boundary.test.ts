import test from 'node:test'
import assert from 'node:assert/strict'
import {onRequest} from './_middleware'
import {handleRead} from './api/c3ops/manifest'

const key='synthetic-local-operator-key'
async function run(path:string,headers:Record<string,string>={},configured=true,host='c3ops.c3field.online',method='GET') {
 let called=false
 const response=await onRequest({request:new Request(`https://${host}${path}`,{method,headers:{accept:'text/html',...headers}}),env:configured?{OPERATOR_DISPATCH_KEY:key}:{},next:async()=>{called=true;return new Response('public SPA shell')}} as never)
 return {response,called}
}
test('canonical c3Ops portal and room document shells are public, private data is not',async()=>{
 for(const path of ['/','/systems-access','/systems-access/current','/c3optics','/relational-operations']){
  const {response,called}=await run(path,{},false)
  assert.equal(response.status,200);assert.equal(called,true)
  assert.equal(await response.text(),'public SPA shell')
  assert.equal(response.headers.get('cache-control'),'private, no-store')
 }
})
test('old standalone fallback entry redirects to canonical root, never accepts another POST entrance',async()=>{
 const get=await run('/operator-entry',{},false)
 assert.equal(get.called,false);assert.equal(get.response.status,308);assert.equal(get.response.headers.get('location'),'/')
 const post=await run('/operator-entry',{},false,'c3ops.c3field.online','POST')
 assert.equal(post.called,false);assert.equal(post.response.status,405)
})
test('API still prevents direct data access and all action routes remain protected',async()=>{
 const r=await run('/api/c3ops/manifest')
 assert.equal(r.called,true) // protected handler, not middleware, determines native identity
 const noProof=await handleRead(new Request('https://c3ops.c3field.online/api/c3ops/manifest'),{})
 assert.notEqual(noProof.status,200)
 assert.equal((await noProof.json()).mutation_authority,false)
 const keyOnly=await handleRead(new Request('https://c3ops.c3field.online/api/c3ops/manifest',{headers:{'x-operator-dispatch-key':key}}),{OPERATOR_DISPATCH_KEY:key})
 assert.notEqual(keyOnly.status,200)
 for(const path of ['/api/c3ops/lapzuli','/api/chazz','/other']) {
  const denied=await run(path)
  assert.equal(denied.called,false);assert.ok([401,403].includes(denied.response.status))
 }
})
test('unrelated hosts cannot access c3Ops rooms',async()=>{
 for(const path of ['/systems-access','/c3optics','/relational-operations']) {
  const result=await run(path,{},false,'my.c3field.online')
  assert.equal(result.called,false);assert.equal(result.response.status,404)
 }
})
test('static asset public scope exact and never makes arbitrary files public',async()=>{
 for(const path of ['/assets/app-test.js','/c3ops/c3-tree-source-v1.png']){
  const r=await run(path,{},false);assert.equal(r.called,true);assert.equal(r.response.status,200)
 }
 for(const path of ['/c3ops/private.png','/assets-private/secrets.js','/private-config.json']){
  const r=await run(path,{},false);assert.equal(r.called,false);assert.notEqual(r.response.status,200)
 }
})
test('all public c3Ops entries deny non-GET/HEAD methods',async()=>{
 for(const path of ['/','/c3optics','/systems-access','/assets/app.js']){
  const r=await run(path,{},false,'c3ops.c3field.online','POST')
  assert.equal(r.called,false);assert.notEqual(r.response.status,200)
 }
})
