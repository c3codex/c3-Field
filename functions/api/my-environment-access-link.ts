import {requestEnvironmentAccessLink,type PassageEnv} from "../_lib/c1-passage"

const headers={"cache-control":"no-store","referrer-policy":"no-referrer","x-content-type-options":"nosniff"}
const jsonHeaders={...headers,"content-type":"application/json; charset=utf-8"}

function page(message=""){
  const status=message?'<p role="status">'+message+'</p>':""
  return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>My Environment Access</title><body style="font-family:system-ui;background:#111416;color:#f3efe7;margin:0"><main style="max-width:640px;margin:10vh auto;padding:32px"><p style="letter-spacing:.14em;font-size:12px">c3 COMMUNITY PARTNERS</p><h1 style="font-family:Georgia,serif;font-weight:400">Open My Environment</h1><p>We do not recognize this browser yet. Enter the email address you used to Connect and we will send a secure link back to your existing environment.</p><form id="access"><input name="email" type="email" autocomplete="email" required maxlength="254" style="box-sizing:border-box;width:100%;padding:12px;margin:12px 0" aria-label="Email address"><button type="submit" style="padding:12px 18px">SEND ACCESS LINK</button></form><div id="notice">'+status+'</div><p style="margin-top:28px"><a style="color:#f3efe7" href="https://my.c3field.online/">Return to My Environment</a></p></main><script>document.getElementById("access").addEventListener("submit",async function(e){e.preventDefault();const b=this.querySelector("button");const n=document.getElementById("notice");b.disabled=true;n.textContent="Sending…";try{const r=await fetch(location.pathname,{method:"POST",headers:{"content-type":"application/json","accept":"application/json"},body:JSON.stringify({email:new FormData(this).get("email")})});const j=await r.json();n.textContent=j.message||"If this email is connected to a c3Field environment, a secure access link is on its way."}catch{n.textContent="The access-link request could not be processed."}finally{b.disabled=false}})</script></body></html>',{status:200,headers:{...headers,"content-type":"text/html; charset=utf-8"}})
}

export const onRequestGet:PagesFunction<PassageEnv>=async()=>page()

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return new Response(JSON.stringify({standing:"invalid_request",message:"A JSON submission is required."}),{status:415,headers:jsonHeaders})
  const origin=request.headers.get("origin")
  if(origin && origin!==new URL(request.url).origin)
    return new Response(JSON.stringify({standing:"invalid_request",message:"The request could not be verified."}),{status:403,headers:jsonHeaders})
  let body:Record<string,unknown>
  try{body=await request.json() as Record<string,unknown>}
  catch{return new Response(JSON.stringify({standing:"invalid_request",message:"Enter the email address you used to Connect."}),{status:400,headers:jsonHeaders})}
  if(!body||typeof body!=="object"||Array.isArray(body)||Object.keys(body).some(key=>key!=="email"))
    return new Response(JSON.stringify({standing:"invalid_request",message:"Enter the email address you used to Connect."}),{status:400,headers:jsonHeaders})
  return requestEnvironmentAccessLink(body.email,env)
}

export const onRequest:PagesFunction=async()=>new Response("method not allowed",{status:405,headers:{...headers,allow:"GET, POST"}})
