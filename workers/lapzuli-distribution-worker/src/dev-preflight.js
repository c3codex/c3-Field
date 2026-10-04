export async function preflightDev(env){
  const key=env.DEV_API_KEY||env.DEVTO_API_KEY||env.DEV_TO_API_KEY||env.FOREM_API_KEY||env["DEV-API-KEY"];
  const reply=(body,status=200)=>new Response(JSON.stringify({external_publication_effects:0,...body}),{status,headers:{"content-type":"application/json"}});
  if(!key)return reply({ok:false,standing:"held_dev_credential_missing",credential_present:false},409);
  const r=await fetch("https://dev.to/api/users/me",{headers:{"api-key":String(key).trim(),accept:"application/vnd.forem.api-v1+json"},redirect:"manual",signal:AbortSignal.timeout(15000)});
  const b=await r.json().catch(()=>null);
  if(!r.ok||!b?.id||!b?.username)return reply({ok:false,standing:"held_dev_identity_unverified",credential_present:true},409);
  return reply({ok:true,standing:"dev_identity_observed",credential_present:true,account_id:b.id,username:b.username,name:b.name});
}
