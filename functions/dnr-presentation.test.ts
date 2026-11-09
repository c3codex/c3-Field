import test from 'node:test'
import assert from 'node:assert/strict'
import {onRequest} from './_middleware'
import {dnrDocument,isC3FieldHost} from '../src/shared/dnrPresentation'
async function respond(url:string,status:number,accept='text/html',method='GET') {
 return onRequest({request:new Request(url,{method,headers:{accept}}),env:{},next:async()=>new Response(method==='HEAD'?null:'original failure',{status,headers:{'www-authenticate':'Basic realm="test"','content-type':'text/plain'}})} as never)
}
test('unresolved c3Field browser surfaces share tree-only DNR and retain failure status',async()=>{
 for(const host of ['c3field.online','www.c3field.online','member.c3field.online','47pct.c3field.online'])for(const status of [401,403,404,409,500,503]){
  const r=await respond(`https://${host}/missing`,status)
  assert.equal(r.status,status);assert.equal(r.headers.get('www-authenticate'),null)
  assert.equal(r.headers.get('cache-control'),'private, no-store')
  const html=await r.text();assert.match(html,/c3-tree-source-v1.png/);assert.doesNotMatch(html,/original failure|<form|<script/)
 }
})
test('API responses, non-browser requests and other systems retain original contracts',async()=>{
 for(const [url,accept] of [['https://c3field.online/api/test','text/html'],['https://c3field.online/missing','application/json'],['https://measuresregistry.com/missing','text/html']]){
  const r=await respond(url,404,accept);assert.equal(await r.text(),'original failure')
 }
 assert.equal(isC3FieldHost('c3field.online.example.test'),false)
 assert.equal(isC3FieldHost('fakec3field.online'),false)
})
test('resolved pages are unchanged and HEAD failures have no body',async()=>{
 assert.equal(await (await respond('https://c3field.online/',200)).text(),'original failure')
 const r=await respond('https://c3field.online/missing',404,'text/html','HEAD')
 assert.equal(r.status,404);assert.equal(await r.text(),'')
 assert.match(dnrDocument(),/alt="c3 Tree"/)
})
test('unexpected page failures use DNR while API failures propagate',async()=>{
 const context=(path:string)=>({request:new Request('https://c3field.online'+path,{headers:{accept:'text/html'}}),env:{},next:async()=>{throw new Error('synthetic failure')}} as never)
 const response=await onRequest(context('/broken'))
 assert.equal(response.status,503);assert.match(await response.text(),/c3-tree-source-v1.png/)
 await assert.rejects(()=>onRequest(context('/api/broken')),/synthetic failure/)
})
