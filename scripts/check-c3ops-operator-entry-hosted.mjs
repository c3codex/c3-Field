// Read-only deployed-host smoke test. No credentials, no mutation, no Registrar call.
// Invoke explicitly AFTER an authorized deployment with:
// node scripts/check-c3ops-operator-entry-hosted.mjs https://c3ops.c3field.online
const target = process.argv[2]
if (target !== 'https://c3ops.c3field.online') {
  console.error('HLD: exact authorized c3Ops HTTPS host required')
  process.exit(42)
}
const base = new URL(target)
const fetchPath = (path, options = {}) => fetch(new URL(path, base), {
  redirect: 'manual', signal: AbortSignal.timeout(12000), cache: 'no-store', ...options
})
const assert = (condition, why) => {
  if (!condition) throw Error('HLD: ' + why)
}
const entry = await fetchPath('/operator-entry', {headers:{accept:'text/html'}})
assert(entry.status === 200, 'entry GET status ' + entry.status)
assert((entry.headers.get('content-type') || '').includes('text/html'), 'entry content-type')
assert((entry.headers.get('cache-control') || '').includes('no-store'), 'entry cache')
assert(entry.headers.get('x-frame-options') === 'DENY', 'entry frame refusal')
const csp = entry.headers.get('content-security-policy') || ''
assert(csp.includes("frame-ancestors 'none'") && csp.includes("script-src 'nonce-"), 'entry CSP nonce')
const html = await entry.text()
assert(html.includes('c3ops_request_registrar_fallback_v1'), 'bounded request contract not present')
assert(!/SUPABASE_SERVICE_ROLE_KEY|OPERATOR_DISPATCH_KEY|service_role/.test(html), 'privileged secret identifier exposed')
const head = await fetchPath('/operator-entry', {method:'HEAD'})
assert(head.status === 200 && (await head.text()) === '', 'HEAD contract')
const post = await fetchPath('/operator-entry', {method:'POST', headers:{'content-type':'text/plain'},body:''})
assert(post.status === 405, 'POST should refuse with 405')
const api = await fetchPath('/api/c3ops/manifest', {headers:{accept:'application/json'}})
assert([401,403].includes(api.status), 'protected API must refuse without credentials')
assert(!(await api.text()).includes('registered operator capabilities'), 'protected API data appeared')
const asset = await fetchPath('/assets/entry.js', {headers:{accept:'application/json'}})
assert([401,403].includes(asset.status), 'protected static asset should refuse unauthenticated')
console.log('PASS: hosted entry, headers and no-credential negative routes. Browser auth/session and governance are separately HLD.')
