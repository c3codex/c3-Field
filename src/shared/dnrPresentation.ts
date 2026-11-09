export const C3_TREE_BACKDROP = "/c3ops/c3-tree-source-v1.png"
export const DNR_BACKDROP_STYLE = "html,body{margin:0;width:100%;height:100%;background:#000}main{height:100svh}img{display:block;width:100%;height:100%;object-fit:contain}"
export function isC3FieldHost(hostname:string) {
  return hostname === "c3field.online" || hostname.endsWith(".c3field.online")
}
export function dnrDocument() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>c3 Field</title><style>${DNR_BACKDROP_STYLE}</style></head><body><main><img src="${C3_TREE_BACKDROP}" alt="c3 Tree"></main></body></html>`
}
