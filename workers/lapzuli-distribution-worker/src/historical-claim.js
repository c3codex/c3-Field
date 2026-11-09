const ASSET="undrifted_hole_map_bluesky_dist_v1";
// Called only after adapter payload/identity validation, before any provider I/O.
export async function admitHistoricalWorkerClaim(body,env){
  const exactEffect=body.distribution_asset_id===ASSET||body.route_key==="lapzuli_route_"+ASSET||
    (body.channel_key==="bluesky_undrifted"&&body.canonical_url==="https://measuresregistry.com/undrifted/the-hole-in-the-map");
  if(!exactEffect||body.dry_run!==false)return null;
  const held=reason=>({ok:false,standing:"HLD",reason,external_publication_effects:0});
  if(body.execute!==true||!body.atomic_execution_id||!body.historical_occurrence_key)
    return held("historical_bound_worker_claim_required");
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)
    return held("historical_worker_registry_credentials_unconfigured");
  try{
    const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/consume_lapzuli_historical_worker_claim_v1",{
      method:"POST",redirect:"manual",signal:AbortSignal.timeout(15000),
      headers:{"content-type":"application/json",apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
      body:JSON.stringify({p_request:body}),
    });
    const result=await response.json().catch(()=>null);
    if(!response.ok||result?.standing!=="dispatch_admitted"||result.execution_id!==body.atomic_execution_id||
      result.occurrence_key!==body.historical_occurrence_key)
      return held(typeof result?.reason==="string"?result.reason:"historical_worker_registry_admission_unverified");
    return null;
  }catch{return held("historical_worker_registry_admission_unverified");}
}
