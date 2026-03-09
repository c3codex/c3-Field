export function normalizeCodexVaultKey(href: string): string {
  const first = (href ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)[0] ?? "";

  let key = first;

  key = key.replace(/^\/?storage\/files\/buckets\/codex-vault\//i, "");
  key = key.replace(/^codex-vault\//i, "");
  key = key.replace(/^Canon_docs(?=[^/])/, "Canon_docs/"); // fixes Canon_docsc3... typo
  key = key.replace(/^\/+/, "");

  return key;
}

export function codexVaultPublicUrl(supabaseUrl: string, href: string): string {
  const key = normalizeCodexVaultKey(href);
  if (!supabaseUrl || !key) return "";
  const base = supabaseUrl.replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/codex-vault/${encodeURI(key)}`;
}