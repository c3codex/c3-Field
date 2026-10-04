const API="https://public.api.paragraph.com/api/v1";
const PUBLICATION={id:"leouxPnZrCGqMYqnboYx",slug:"undrifted"};
const clean=v=>typeof v==="string"?v.trim():"";
const reply=(body,status=200)=>new Response(JSON.stringify({external_publication_effects:0,...body}),{status,headers:{"content-type":"application/json"}});
async function read(env,path){
  const response=await fetch(API+path,{headers:{Authorization:"Bearer "+clean(env.PARAGRAPH_PUBLISH_KEY)},redirect:"manual",signal:AbortSignal.timeout(15000)});
  if(!response.ok)return null;
  return response.json().catch(()=>null);
}
export async function handleParagraph(request,env){
  const path=new URL(request.url).pathname;
  if(!clean(env.PARAGRAPH_PUBLISH_KEY))return reply({ok:false,standing:"held_paragraph_credential_missing"},409);
  const identity=await read(env,"/me");
  if(!identity)return reply({ok:false,standing:"held_paragraph_identity_unverified"},409);
  if(identity.id!==PUBLICATION.id||identity.slug!==PUBLICATION.slug)return reply({ok:false,standing:"held_paragraph_publication_identity_mismatch",publication_id:identity.id,publication_slug:identity.slug},409);
  const proof={credential_present:true,publication_id:identity.id,publication_slug:identity.slug,adapter:"paragraph_direct_api_v1"};
  if(path==="/paragraph/preflight")return request.method==="GET"?reply({ok:true,standing:"EXECUTABLE",capability:"registered_paragraph_provider",...proof}):reply({ok:false,standing:"held_method_not_allowed"},405);
  if(path!=="/paragraph/posts"||request.method!=="POST")return reply({ok:false,standing:"held_method_not_allowed"},405);
  const body=await request.json().catch(()=>({}));
  const missing=["route_key","publication_object_key","distribution_asset_id","authority_reference","idempotency_key","title","body_markdown","slug","canonical_url"].filter(k=>!clean(body[k]));
  if(body.operator_confirmed!==true||body.lapzuli_callable!==true||body.channel_key!=="paragraph_undrifted"||body.channel_identifier!==PUBLICATION.id)missing.push("exact_registered_authority_and_channel");
  try{const u=new URL(body.canonical_url);if(u.protocol!=="https:"||u.hostname!=="measuresregistry.com")missing.push("canonical_scope")}catch{missing.push("canonical_scope")}
  if(body.sendNewsletter===true)missing.push("newsletter_not_authorized");
  if(missing.length)return reply({ok:false,standing:"held_paragraph_payload_or_authority",missing,...proof},409);
  let cursor="";const seen=new Set();let complete=false;let existing=null;
  for(let page=0;page<20;page++){
    const data=await read(env,"/posts?"+new URLSearchParams({limit:"100",...(cursor?{cursor}:{})}));
    if(!data||!Array.isArray(data.items)||typeof data.pagination?.hasMore!=="boolean")return reply({ok:false,standing:"held_paragraph_duplicate_read_unverified",...proof},409);
    existing=data.items.find(p=>p.slug===body.slug)||existing;
    if(existing)break;
    if(!data.pagination.hasMore){complete=true;break;}
    cursor=clean(data.pagination.cursor);if(!cursor||seen.has(cursor))break;seen.add(cursor);
  }
  if(existing)return reply({ok:false,standing:"HISTORICAL_OR_SUPERSEDED",reason:"paragraph_slug_already_exists",platform_post_id:existing.id,platform_url:existing.url||existing.publicUrl||null,...proof},409);
  if(!complete)return reply({ok:false,standing:"held_paragraph_duplicate_coverage_incomplete",...proof},409);
  if(body.dry_run!==false)return reply({ok:true,standing:"paragraph_adapter_ready_dry_run",duplicate_guard:"complete_provider_slug_inventory",...proof});
  if(body.execute!==true||!clean(body.atomic_execution_id))return reply({ok:false,standing:"held_paragraph_atomic_claim_required",...proof},409);
  // The trusted Registry caller supplies the acquired atomic occurrence.
  const response=await fetch(API+"/posts",{method:"POST",redirect:"manual",signal:AbortSignal.timeout(30000),headers:{Authorization:"Bearer "+clean(env.PARAGRAPH_PUBLISH_KEY),"content-type":"application/json"},body:JSON.stringify({title:body.title,markdown:body.body_markdown,slug:body.slug,status:"published",sendNewsletter:false,...(clean(body.image_url)?{imageUrl:body.image_url}:{})})});
  const created=await response.json().catch(()=>null);const confirmed=response.ok&&clean(created?.id);
  return reply({ok:!!confirmed,standing:confirmed?"paragraph_post_created":"held_paragraph_outcome_uncertain",...proof,platform_post_id:created?.id??null,platform_url:created?.url??created?.publicUrl??null,external_response_code:response.status,external_publication_effects:confirmed?1:null},confirmed?201:502);
}
