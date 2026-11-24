// OAR026 delivery-only adapter. No public routes, no generic service credential.
const dispositions={
  retain_c3_field_custody:"Keep PACs in c3 Field custody",
  portable_export:"Retain ownership with a verified portable export",
  custody_transferred:"Retain ownership after a verified custody transfer"
};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const token=/^[0-9a-f]{64}$/;
const key=/^[a-zA-Z0-9_:-]{1,160}$/;
const json=(body,status)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store","referrer-policy":"no-referrer"}});
const held=()=>json({standing:"held",message:"Owner confirmation is unavailable. No termination was performed."},409);
function valid(p){
  return p&&typeof p==="object"&&!Array.isArray(p)&&Object.keys(p).every(k=>["relationship_key","env_key","envpac_key","owner_session_token","disposition","portability_receipt_key"].includes(k))&&
    ["relationship_key","env_key","envpac_key"].every(k=>typeof p[k]==="string"&&key.test(p[k]))&&
    typeof p.owner_session_token==="string"&&token.test(p.owner_session_token)&&
    Object.hasOwn(dispositions,p.disposition)&&
    (p.disposition==="retain_c3_field_custody"?p.portability_receipt_key==null:typeof p.portability_receipt_key==="string"&&uuid.test(p.portability_receipt_key));
}
export async function deliverConsent(request,{issue,send,now=Date.now}){
  try{
    if(request.method!=="POST"||new URL(request.url).pathname!=="/owner-consent"||new URL(request.url).search||!request.headers.get("content-type")?.startsWith("application/json"))return held();
    const raw=await request.text();
    if(raw.length>4096)return held();
    const p=JSON.parse(raw);
    if(!valid(p))return held();
    const result=await issue(p);
    const exp=Date.parse(result?.expires_at);
    if(result?.standing!=="delivery_required"||!uuid.test(result.challenge_key||"")||
      !token.test(result.challenge_token||"")||typeof result.delivery_email!=="string"||!/^\S+@\S+\.\S+$/.test(result.delivery_email)||
      !["relationship_key","env_key","envpac_key","disposition"].every(k=>result[k]===p[k])||
      (result.prior_receipt_key??null)!==(p.portability_receipt_key??null)||
      !Number.isFinite(exp)||exp<=now()||exp>now()+600000)return held();
    const accepted=await send({
      to:result.delivery_email,
      subject:"Current State | Confirm withdrawal",
      idempotencyKey:"owner-consent-"+result.challenge_key,
      text:["A request was made to terminate your My Env.","Environment: "+result.env_key,
        "Disposition: "+dispositions[result.disposition],
        "Your ownership and historical evidence are retained. Active participation will end; explicit reentry will be required.",
        "If you made this request, return to the same My Env session and paste the confirmation code below.",
        result.challenge_token,"Expires: "+new Date(exp).toISOString(),
        "If you did not request termination, ignore this message. Do not share the code."].join("\n\n")
    });
    if(accepted!==true||exp<=now())return held();
    // Project only transport acceptance; no proof, recipient, provider body, or effect.
    return json({standing:"confirmation_sent",challenge_key:result.challenge_key,expires_at:result.expires_at},202);
  }catch{return held()}
}
