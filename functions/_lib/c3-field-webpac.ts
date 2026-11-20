export const fieldWebPacKey = "c3field_root_orientation_c3webpac_v1"
export const fieldWebPacManifestKey = "c3field_root_orientation_manifest_v1"
export const fieldReceiverPaths = ["/connect","/contribute","/create"] as const

export type FieldWebPacEnv={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}

export function fieldRecord(value:unknown):Record<string,unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string,unknown> : {}
}

export async function readFieldRows(env:FieldWebPacEnv,table:string,filters:Record<string,string>){
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  url.search=new URLSearchParams(filters).toString()
  const response=await fetch(url,{headers:{
    apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
  },redirect:"manual",signal:AbortSignal.timeout(12000)})
  if (!response.ok) throw new Error("registry_read_failed")
  const rows:unknown=await response.json()
  if (!Array.isArray(rows)) throw new Error("registry_read_failed")
  return rows.map(fieldRecord)
}

export async function qualifiedFieldWebPacSource(env:FieldWebPacEnv,composition:Record<string,unknown>){
  const binding=fieldRecord(composition.webpac_source_ref)
  const {source_key,sha256}=binding
  if (typeof source_key!=="string" || !/^[a-z0-9_]+$/.test(source_key) ||
      typeof sha256!=="string" || !/^[a-f0-9]{64}$/.test(sha256)) return false

  const sources=await readFieldRows(env,"codex_source_reference",{
    select:"source_key,source_status,source_path,source_hash",source_key:"eq."+source_key,source_status:"eq.committed",
  })
  const source=sources[0]
  return sources.length===1 && source.source_key===source_key &&
    source.source_status==="committed" && source.source_hash===sha256 &&
    typeof source.source_path==="string" &&
    /^github_file:c3codex\/measures-of-inanna-governance@[a-f0-9]{40}:webpac\/c3_field\/[a-zA-Z0-9_./-]+$/.test(source.source_path) &&
    !source.source_path.split("/").includes("..")
}

export function resolveFieldReceiver(composition:Record<string,unknown>,path:string){
  const position=fieldRecord(fieldRecord(composition.receiving_positions)[path])
  return position.route===path && position.standing==="active" &&
    position.access_state==="public" ? position : null
}
