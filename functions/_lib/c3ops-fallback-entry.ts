// Isolated op044 sign-in and REQUEST-only Registrar fallback intake.
// This page is the sole HTML exception to the c3Ops whole-host dispatch guard.
// It exposes no privileged APIs, registry records, service keys, or general workroom UI.
const AUTH_ORIGIN = "https://zfihrspxvennjzazxcbj.supabase.co";

function pageHeaders(nonce: string) {
  return {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "private, no-store",
    "cdn-cache-control": "no-store",
    "cloudflare-cdn-cache-control": "no-store",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "content-security-policy": [
      "default-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'none'",
      "style-src 'nonce-" + nonce + "'",
      "script-src 'nonce-" + nonce + "'",
      "connect-src " + AUTH_ORIGIN,
    ].join("; "),
  };
}

export function fallbackEntry(request: Request, publicKey?: string): Response {
  if (request.method !== "GET" && request.method !== "HEAD")
    return new Response("Method not allowed", {status:405,headers:{"allow":"GET, HEAD","cache-control":"no-store"}});
  // No entry without the known PUBLIC client key. This is never a service-role key.
  if (!publicKey) return new Response("Operator entry unavailable", {status:503,headers:{"cache-control":"no-store"}});
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const serializedKey = JSON.stringify(publicKey).replace(/</g, "\\u003c");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>c3Ops · Operator request</title>
<style nonce="${nonce}">:root{color-scheme:dark}body{font-family:system-ui,sans-serif;background:#101820;color:#f2f1ed;min-height:100vh;display:grid;place-items:center;margin:0;padding:1rem}main{width:min(100%,440px);border:1px solid #56646a;border-radius:14px;padding:1.7rem;background:#18252d}h1{font-size:1.6rem}p{line-height:1.5;color:#cbd5d9}label{display:block;margin:1rem 0}input{box-sizing:border-box;width:100%;margin-top:.4rem;padding:.7rem;border-radius:6px;border:1px solid #7a858c;background:#0e151b;color:white}button{padding:.7rem 1rem;background:#f0d29b;color:#151b1e;border:0;border-radius:6px;cursor:pointer}button:disabled{opacity:.5;cursor:wait}code{overflow-wrap:anywhere}#receipt{padding-top:.5rem}</style>
</head><body><main>
<h1>c3Ops · Operator entrance</h1>
<p>Authenticated Operator request for the bounded Registrar fallback. This records a request only; it does not grant Registrar execution, c3Ops access, or installation.</p>
<form id="signin" autocomplete="on"><label>Email <input id="email" type="email" autocomplete="username" required></label><label>Password <input id="password" type="password" autocomplete="current-password" required></label><button id="submit" type="submit">Sign in and request</button></form>
<p id="status" role="status" aria-live="polite"></p><p id="receipt"></p>
</main>
<script nonce="${nonce}">
(()=>{
  const url=${JSON.stringify(AUTH_ORIGIN)},apiKey=${serializedKey};
  const form=document.getElementById("signin"),submit=document.getElementById("submit"),status=document.getElementById("status"),receipt=document.getElementById("receipt");
  let running=false;
  const report=message=>{status.textContent=message;};
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(running)return;
    running=true;submit.disabled=true;receipt.textContent="";report("Verifying signed-in Operator...");
    const password=document.getElementById("password"),email=document.getElementById("email");
    let token;
    try{
      const response=await fetch(url+"/auth/v1/token?grant_type=password",{
        method:"POST",mode:"cors",cache:"no-store",credentials:"omit",
        headers:{"apikey":apiKey,"content-type":"application/json"},
        body:JSON.stringify({email:email.value,password:password.value})
      });
      if(!response.ok)throw Error("sign_in_not_verified");
      const session=await response.json();
      if(typeof session.access_token!=="string"||!Number.isFinite(session.expires_in)||session.expires_in<=0)throw Error("session_invalid");
      token=session.access_token;
      password.value="";
      const identity=await fetch(url+"/auth/v1/user",{
        headers:{"apikey":apiKey,"authorization":"Bearer "+token},
        cache:"no-store",credentials:"omit"
      });
      if(!identity.ok)throw Error("operator_unverified");
      const actor=await identity.json();
      if(actor.id!=="1cd2c032-7ef0-4537-8b08-e99b68895eb0"||!actor.email_confirmed_at)throw Error("operator_unverified");
      const rpc=await fetch(url+"/rest/v1/rpc/c3ops_request_registrar_fallback_v1",{
        method:"POST",cache:"no-store",credentials:"omit",
        headers:{"apikey":apiKey,"authorization":"Bearer "+token,"content-type":"application/json"},
        body:"{}"
      });
      if(!rpc.ok)throw Error("registrar_request_held");
      const result=await rpc.json();
      if(result.standing!=="REQUESTED"||typeof result.request_id!=="string"||typeof result.expires_at!=="string"||result.registrar_execution_authorized!==false||result.installation_authorized!==false)throw Error("invalid_request_receipt");
      report("REQUESTED · Recorded only; Registrar execution and installation remain held.");
      receipt.textContent="Request: "+result.request_id+" · Expires: "+new Date(result.expires_at).toLocaleString();
      form.hidden=true;
    }catch{
      report("Request not confirmed. Check the Operator credentials, active c3Ops grant, and current authorization window. No execution authority was granted.");
    }finally{
      password.value="";
      token=undefined;
      running=false;
      submit.disabled=false;
    }
  });
})();
</script></body></html>`;
  return new Response(request.method === "HEAD" ? null : html, {status:200,headers:pageHeaders(nonce)});
}
