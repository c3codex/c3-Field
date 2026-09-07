import {json, hold, verifyCandidate, type PassageEnv} from "../_lib/c1-passage"

export const onRequestPost: PagesFunction<PassageEnv> = async ({request,env}) => {
  if (request.headers.get("origin") !== new URL(request.url).origin ||
      request.headers.get("origin") !== env?.C1_PUBLIC_ORIGIN) return hold("origin_mismatch")
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    return json({standing:"held_content_type"},415)
  const reader = request.body?.getReader()
  if (!reader) return hold("verification_input")
  let size = 0
  const chunks: Uint8Array[] = []
  try {
    while (true) {
      const {done,value} = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 4096) { await reader.cancel(); return json({standing:"held_request_too_large"},413) }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.byteLength }
    const body = JSON.parse(new TextDecoder().decode(bytes))
    if (!body || typeof body !== "object" || Array.isArray(body)) return hold("verification_input")
    return verifyCandidate(body,env)
  } catch { return hold("verification_input") }
}
export const onRequestGet: PagesFunction = async () => {
  const nonce = crypto.randomUUID().replace(/-/g,"")
  // GET has no effect. Email scanners cannot consume a challenge by following the link.
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>Confirm your connection</title>
<body><main><h1>Confirm your connection</h1><p id="result" role="status">Confirm your email to continue your c3 Community Partners connection.</p><button id="confirm" type="button">Confirm connection</button></main>
<script nonce="${nonce}">
const parameters = new URLSearchParams(location.hash.slice(1));
const receipt = parameters.get("receipt"), token = parameters.get("token");
history.replaceState(null,"",location.pathname);
const button = document.getElementById("confirm"), result = document.getElementById("result");
if (!receipt || !token) {button.disabled=true; result.textContent="This confirmation link is unavailable.";}
button.addEventListener("click",async () => {
 button.disabled=true;
 try {
  const response=await fetch(location.pathname,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({receipt,token})});
  const value=await response.json();
  result.textContent=response.ok && value.standing==="connection_recorded" && value.saved===true
    ? "Your Connect relationship is confirmed and recorded."
    : "We could not confirm your connection. Please request a new link or return later.";
 } catch { result.textContent="We could not confirm your connection. Please return later."; }
});
</script></body></html>`,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store",
    "referrer-policy":"no-referrer","x-content-type-options":"nosniff",
    "content-security-policy":`default-src 'none'; script-src 'nonce-${nonce}'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`}})
}
export const onRequest: PagesFunction = async () => json({error:"method not allowed"},405)
