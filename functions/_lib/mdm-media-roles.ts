type Row=Record<string,unknown>
export function projectMdmMediaRoles(rows:Row[]){
  const result:{entry_intro?:string;feature_film?:string}={}
  for(const role of ["entry_intro","feature_film"] as const){
    const candidates=rows.filter(row=>row.media_role===role&&row.standing==="active")
    if(candidates.length!==1)continue
    const row=candidates[0]
    const metadata=row.metadata as Row|undefined
    const asset=metadata?.source_asset_key
    if(typeof asset!=="string"||!/^[a-z0-9_]+$/.test(asset))continue
    const expected="/api/free-media?asset="+asset
    if(row.runtime_uri!==expected)continue
    result[role]=expected
  }
  if(result.entry_intro&&result.entry_intro===result.feature_film){
    delete result.entry_intro
    delete result.feature_film
  }
  return result
}
