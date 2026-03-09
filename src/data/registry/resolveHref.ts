// src/data/registry/resolveHref.ts
/**
 * Registry items should store stable references (keys), not UI/dashboard paths.
 * This helper normalizes legacy generated href values into a storage object key.
 */

export function normalizeCodexVaultKey(hrefOrKey: string): string {
  const raw = (hrefOrKey ?? "").trim();

  // Strip Supabase "dashboard-like" file browser paths
  // Examples:
  //  /storage/files/buckets/codex-vault/Canon_docs/x.pdf
  //  storage/files/buckets/codex-vault/Canon_docs/x.pdf
  let key = raw.replace(/^\/?storage\/files\/buckets\/codex-vault\//i, "");

  // Strip "bucket/key" legacy storage path
  // Examples:
  //  codex-vault/coherent-ai/x.pdf
  key = key.replace(/^codex-vault\//i, "");

  // Also strip accidental leading slashes
  key = key.replace(/^\/+/, "");

  return key;
}

/**
 * Build the public object URL without needing the Supabase client.
 * (Keeps registry layer "structure-only" and not dependent on runtime SDKs.)
 */
export function codexVaultPublicUrl(supabaseUrl: string, hrefOrKey: string): string {
  const key = normalizeCodexVaultKey(hrefOrKey);
  if (!supabaseUrl || !key) return "";

  const base = supabaseUrl.replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/codex-vault/${encodeURI(key)}`;
}