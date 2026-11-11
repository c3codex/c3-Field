import assert from 'node:assert/strict'
import {test} from 'node:test'
import {fallbackEntry} from '../functions/_lib/c3ops-fallback-entry'

const url='https://c3ops.c3field.online/operator-entry'
const request=(method='GET')=>new Request(url,{method})

test('without the public client key, the entry fails closed',()=>{
 const response=fallbackEntry(request(),undefined)
 assert.equal(response.status,503)
 assert.equal(response.headers.get('cache-control'),'no-store')
})

test('non-navigation methods cannot invoke the entry',()=>{
 const response=fallbackEntry(request('POST'),'test-public-key')
 assert.equal(response.status,405)
 assert.equal(response.headers.get('allow'),'GET, HEAD')
})

test('GET returns bounded login-only document with private headers',async()=>{
 const response=fallbackEntry(request(),'test-public-key')
 assert.equal(response.status,200)
 assert.match(response.headers.get('content-type')??'',/^text\/html/)
 assert.equal(response.headers.get('cache-control'),'private, no-store')
 assert.equal(response.headers.get('x-frame-options'),'DENY')
 assert.match(response.headers.get('content-security-policy')??'',/frame-ancestors 'none'/)
 assert.match(response.headers.get('content-security-policy')??'',/connect-src https:\/\/zfihrspxvennjzazxcbj\.supabase\.co/)
 const html=await response.text()
 assert.match(html,/Sign in and request/)
 assert.match(html,/c3ops_request_registrar_fallback_v1/)
 assert.match(html,/REQUESTED/)
 assert.match(html,/c3ops_resolve_fallback_read_v1/)
 assert.match(html,/READ_PREFLIGHT_CONFIRMED/)
 assert.match(html,/workroom_admission_authorized/)
 assert.match(html,/registrar_execution_authorized/)
 assert.match(html,/Read continuation unavailable \(HLD\)/)
 assert.match(html,/test-public-key/)
 assert.doesNotMatch(html,/service_role|SUPABASE_SERVICE_ROLE_KEY|OPERATOR_DISPATCH_KEY/)
 assert.doesNotMatch(html,/localStorage|sessionStorage/)
})

test('HEAD returns no body but same secure response contract',async()=>{
 const response=fallbackEntry(request('HEAD'),'test-public-key')
 assert.equal(response.status,200)
 assert.equal(await response.text(),'')
 assert.equal(response.headers.get('cache-control'),'private, no-store')
})

test('public key cannot inject script into document',async()=>{
 const response=fallbackEntry(request(),'</script><script>alert(1)</script>')
 const html=await response.text()
 assert.doesNotMatch(html,/<\/script><script>alert\(1\)/)
 assert.match(html,/\\u003c\/script>/)
})


test('middleware allows only the exact fallback entry without the dispatch credential',async()=>{
 const {onRequest}=await import('../functions/_middleware')
 const next=async()=>new Response('protected workroom content')
 const entry=await onRequest({
   request:new Request('https://c3ops.c3field.online/operator-entry',{headers:{accept:'text/html'}}),
   env:{OPERATOR_DISPATCH_KEY:'test-private-dispatch',SUPABASE_ANON_KEY:'test-public-key'},
   next
 } as never)
 assert.equal(entry.status,200)
 assert.match(await entry.text(),/Sign in and request/)
 const api=await onRequest({
   request:new Request('https://c3ops.c3field.online/api/c3ops/manifest',{headers:{accept:'application/json'}}),
   env:{OPERATOR_DISPATCH_KEY:'test-private-dispatch',SUPABASE_ANON_KEY:'test-public-key'},
   next
 } as never)
 assert.equal(api.status,403)
 assert.doesNotMatch(await api.text(),/protected workroom content/)
 const staticAsset=await onRequest({
   request:new Request('https://c3ops.c3field.online/assets/entry.js',{headers:{accept:'application/json'}}),
   env:{OPERATOR_DISPATCH_KEY:'test-private-dispatch',SUPABASE_ANON_KEY:'test-public-key'},
   next
 } as never)
 assert.equal(staticAsset.status,403)
})

test('middleware refuses unauthenticated protected host and never exposes protected content',async()=>{
 const {onRequest}=await import('../functions/_middleware')
 const response=await onRequest({
   request:new Request('https://c3ops.c3field.online/',{headers:{accept:'text/html','sec-fetch-dest':'document'}}),
   env:{OPERATOR_DISPATCH_KEY:'test-private-dispatch',SUPABASE_ANON_KEY:'test-public-key'},
   next:async()=>new Response('protected workroom content')
 } as never)
 assert.equal(response.status,401)
 assert.doesNotMatch(await response.text(),/protected workroom content/)
})

test('operator entry method exceptions never reach protected application',async()=>{
 const {onRequest}=await import('../functions/_middleware')
 let passed=false
 const response=await onRequest({
   request:new Request('https://c3ops.c3field.online/operator-entry',{method:'POST'}),
   env:{OPERATOR_DISPATCH_KEY:'test-private-dispatch',SUPABASE_ANON_KEY:'test-public-key'},
   next:async()=>{passed=true;return new Response('unprotected')}
 } as never)
 assert.equal(response.status,405)
 assert.equal(passed,false)
})

test('operator path exception is exact and host-bound',async()=>{
 const {onRequest}=await import('../functions/_middleware')
 const next=async()=>new Response('downstream')
 const guarded=await onRequest({
   request:new Request('https://c3ops.c3field.online/operator-entry/extra',{headers:{accept:'application/json'}}),
   env:{OPERATOR_DISPATCH_KEY:'test-private-dispatch',SUPABASE_ANON_KEY:'test-public-key'},
   next
 } as never)
 assert.equal(guarded.status,403)
 const otherHost=await onRequest({
   request:new Request('https://c3field.online/operator-entry',{headers:{accept:'application/json'}}),
   env:{OPERATOR_DISPATCH_KEY:'test-private-dispatch',SUPABASE_ANON_KEY:'test-public-key'},
   next
 } as never)
 assert.equal(otherHost.status,200)
 assert.equal(await otherHost.text(),'downstream')
})
