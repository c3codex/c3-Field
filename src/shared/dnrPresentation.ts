// Bounded DNR presentation correction: preserve the Operator-selected still artwork
// at its existing Supabase Storage custody location. This is a source locator,
// not evidence that a native Registry media binding has been qualified.
// The entrance video and resolver standing are intentionally unchanged.
export const C3_TREE_BACKDROP = "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c1ME_c3tree.webp"
export const DNR_BACKDROP_STYLE = "html,body{margin:0;width:100%;height:100%;background:#000}main{height:100svh}img{display:block;width:100%;height:100%;object-fit:contain}"
export function isC3FieldHost(hostname:string) {
  return hostname === "c3field.online" || hostname.endsWith(".c3field.online")
}
export function dnrDocument() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>c3 Field</title><style>${DNR_BACKDROP_STYLE}</style></head><body><main><img src="${C3_TREE_BACKDROP}" alt="c3 Tree"></main></body></html>`
}
