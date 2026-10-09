import {resolveRegisteredInitiativeProjection} from "../src/c3_field_connect/registeredInitiativeProjection"

type Env = {
  OPERATOR_DISPATCH_KEY?: string
}

const OPERATOR_COOKIE = "mr_operator_chamber"
const PROTECTED_PATHS = [
  "/publish-undrifted",
  "/api/publish-undrifted-proof",
  "/api/publish-undrifted-lapzuli-controls",
  "/api/c3ops",
  "/api/chazz",
]

type InitiativeSeoProjection = {
  title: string
  description: string
  canonicalUrl: string
  ogType: string
  ogImageUrl: string
  ogImageType?: string
  ogImageWidth?: number
  ogImageHeight?: number
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function replaceHeadTag(html: string, pattern: RegExp, replacement: string) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html
}

function upsertHeadTag(html: string, pattern: RegExp, replacement: string) {
  if (pattern.test(html)) return html.replace(pattern, replacement)
  return html.replace(/<\/head>/i, `  ${replacement}\n</head>`)
}

export function rewriteInitiativeSocialHead(html: string, seo: InitiativeSeoProjection) {
  const title = escapeHtml(seo.title)
  const description = escapeHtml(seo.description)
  const canonicalUrl = escapeHtml(seo.canonicalUrl)
  const ogType = escapeHtml(seo.ogType)
  const ogImageUrl = escapeHtml(seo.ogImageUrl)
  const ogImageType = escapeHtml(seo.ogImageType ?? "image/jpeg")
  const ogImageWidth = Number.isFinite(seo.ogImageWidth) ? String(seo.ogImageWidth) : null
  const ogImageHeight = Number.isFinite(seo.ogImageHeight) ? String(seo.ogImageHeight) : null

  let out = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
  out = replaceHeadTag(out, /<meta\s+name="description"[\s\S]*?>/i, `<meta name="description" content="${description}" />`)
  out = replaceHeadTag(out, /<link\s+rel="canonical"[\s\S]*?>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:title"[\s\S]*?>/i, `<meta property="og:title" content="${title}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:description"[\s\S]*?>/i, `<meta property="og:description" content="${description}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:type"[\s\S]*?>/i, `<meta property="og:type" content="${ogType}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:url"[\s\S]*?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:image"[\s\S]*?>/i, `<meta property="og:image" content="${ogImageUrl}" />`)
  out = upsertHeadTag(out, /<meta\s+property="og:image:secure_url"[\s\S]*?>/i, `<meta property="og:image:secure_url" content="${ogImageUrl}" />`)
  out = upsertHeadTag(out, /<meta\s+property="og:image:type"[\s\S]*?>/i, `<meta property="og:image:type" content="${ogImageType}" />`)
  if (ogImageWidth) out = upsertHeadTag(out, /<meta\s+property="og:image:width"[\s\S]*?>/i, `<meta property="og:image:width" content="${ogImageWidth}" />`)
  if (ogImageHeight) out = upsertHeadTag(out, /<meta\s+property="og:image:height"[\s\S]*?>/i, `<meta property="og:image:height" content="${ogImageHeight}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:image:alt"[\s\S]*?>/i, `<meta property="og:image:alt" content="${title}" />`)
  out = replaceHeadTag(out, /<meta\s+name="twitter:title"[\s\S]*?>/i, `<meta name="twitter:title" content="${title}" />`)
  out = replaceHeadTag(out, /<meta\s+name="twitter:description"[\s\S]*?>/i, `<meta name="twitter:description" content="${description}" />`)
  out = replaceHeadTag(out, /<meta\s+name="twitter:image"[\s\S]*?>/i, `<meta name="twitter:image" content="${ogImageUrl}" />`)
  return out
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

async function resolveMdmSeo(request: Request): Promise<InitiativeSeoProjection> {
  const registered=await registeredInitiative(request,"million_dollar_mission")
  const presentationUrl = new URL("/api/c3-public-presentation", request.url)
  const response = await fetch(presentationUrl.toString(), {
    headers: { accept: "application/json" },
    redirect: "manual",
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) throw new Error("mdm_social_metadata_authority_unavailable")

  const body = record(await response.json())
  const surface = record(body.surface)
  const presentation = record(body.presentation)
  const seo = record(presentation.seo)
  const og = record(presentation.open_graph_contract)

  if (body.standing !== "bounded_public_runtime" || surface.initiativeKey !== "million_dollar_mission" || surface.webpacKey!==registered.webpacKey || surface.canonicalUrl!==registered.canonicalUrl)
    throw new Error("mdm_social_metadata_authority_mismatch")

  const title = stringValue(seo.title)
  const description = stringValue(seo.description)
  const canonicalUrl = new URL(request.url).pathname.replace(/\/$/,"")==="/connect" ? new URL(registered.connectRoute,registered.canonicalUrl).href : registered.canonicalUrl
  const ogType = stringValue(seo.og_type) ?? "website"
  const ogImageAssetKey = stringValue(seo.og_image_asset_key)

  if (!title || !description || !canonicalUrl || seo.canonical_url!==registered.canonicalUrl || !ogImageAssetKey || !/^[a-z0-9_]+$/i.test(ogImageAssetKey) || og.image_asset_key!==ogImageAssetKey || og.title!==title || og.description!==description || og.canonical_url!==registered.canonicalUrl || og.frontend_fallback_allowed!==false || og.runtime_uri!=="/api/free-media?asset="+ogImageAssetKey || !stringValue(og.webpac_binding_key))
    throw new Error("mdm_social_metadata_authority_incomplete")

  const canonical = new URL(canonicalUrl)
  const expectedCanonical=new URL(request.url).pathname.replace(/\/$/,"")==="/connect" ? new URL(registered.connectRoute,registered.canonicalUrl).href : registered.canonicalUrl
  if (canonicalUrl!==expectedCanonical || canonical.protocol !== "https:" || canonical.hostname !== "mdm.c3field.online")
    throw new Error("mdm_social_metadata_canonical_mismatch")

  const ogImageUrl = new URL("/api/free-media", canonical.origin)
  ogImageUrl.searchParams.set("asset", ogImageAssetKey)

  return { title, description, canonicalUrl, ogType, ogImageUrl: ogImageUrl.toString(),ogImageType:"image/webp" }
}

async function registeredInitiative(request:Request,initiativeKey:string){
  const response=await fetch(new URL("/api/public-surface",request.url),{headers:{accept:"application/json"},redirect:"manual",signal:AbortSignal.timeout(12000)})
  if(!response.ok)throw new Error("registered_surface_unavailable")
  const surface=resolveRegisteredInitiativeProjection(await response.json(),new URL(request.url).hostname)
  if(!surface||surface.initiativeKey!==initiativeKey)throw new Error("registered_surface_mismatch")
  return surface
}

async function resolve47PctSeo(request: Request): Promise<InitiativeSeoProjection> {
  const body=await registeredInitiative(request,"47pct")
  const presentation = record(body.publicPresentation)
  const og = record(body.openGraphContract)

  if (body.standing !== "resolved" || body.initiativeKey !== "47pct")
    throw new Error("47pct_social_metadata_authority_mismatch")

  const title = stringValue(presentation.og_title)
  const description = stringValue(presentation.og_description)
  const canonicalUrl = new URL(request.url).pathname.replace(/\/$/,"")==="/connect" ? new URL(body.connectRoute,body.canonicalUrl).href : body.canonicalUrl
  const ogImageAssetKey = stringValue(presentation.og_image_asset_key)
  const socialDeliveryUri = stringValue(og.social_delivery_uri)
  const ogImageType = stringValue(og.image_mime_type) ?? "image/webp"
  const ogImageWidth = typeof og.image_width === "number" ? og.image_width : undefined
  const ogImageHeight = typeof og.image_height === "number" ? og.image_height : undefined

  if (!title || !description || !canonicalUrl || !ogImageAssetKey || !socialDeliveryUri || !/^[a-z0-9_]+$/i.test(ogImageAssetKey) || og.image_asset_key!==ogImageAssetKey || og.runtime_uri!=="/api/free-media?asset="+ogImageAssetKey || og.frontend_fallback_allowed!==false || !stringValue(og.webpac_binding_key) || !stringValue(og.image_integrity_sha256))
    throw new Error("47pct_social_metadata_authority_incomplete")

  const canonical = new URL(canonicalUrl)
  if (canonical.protocol !== "https:" || canonical.hostname !== "47pct.c3field.online")
    throw new Error("47pct_social_metadata_canonical_mismatch")

  const delivery = new URL(socialDeliveryUri)
  if (delivery.protocol !== "https:")
    throw new Error("47pct_social_image_delivery_mismatch")

  return {
    title,
    description,
    canonicalUrl,
    ogType: "website",
    ogImageUrl: delivery.toString(),
    ogImageType,
    ogImageWidth,
    ogImageHeight,
  }
}

async function project47PctSocialHead(request: Request, response: Response) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/$/, "") || "/"
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? ""
  if (
    url.hostname !== "47pct.c3field.online" ||
    !["/", "/connect"].includes(pathname) ||
    !contentType.includes("text/html") ||
    !response.ok
  ) return response

  try {
    const seo = await resolve47PctSeo(request)
    const html = await response.text()
    const headers = new Headers(response.headers)
    headers.delete("content-length")
    headers.set("x-c3-social-head", "47pct-webpac-projected")
    return new Response(rewriteInitiativeSocialHead(html, seo), {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch {
    return new Response("4.7% presentation temporarily unavailable", {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-c3-social-head": "47pct-held",
      },
    })
  }
}

async function projectMdmSocialHead(request: Request, response: Response) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/$/, "") || "/"
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? ""
  if (
    url.hostname !== "mdm.c3field.online" ||
    !["/", "/connect"].includes(pathname) ||
    !contentType.includes("text/html") ||
    !response.ok
  ) return response

  try {
    const seo = await resolveMdmSeo(request)
    const html = await response.text()
    const headers = new Headers(response.headers)
    headers.delete("content-length")
    headers.set("x-c3-social-head", "mdm-registry-projected")
    return new Response(rewriteInitiativeSocialHead(html, seo), {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch {
    return new Response("MDM presentation temporarily unavailable", {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-c3-social-head": "mdm-held",
      },
    })
  }
}

async function projectOwnerCustodiedSocialHead(request:Request,response:Response){
  const url=new URL(request.url)
  if(url.hostname!=="runaground.c3field.online"||url.pathname!=="/"||!response.ok||!response.headers.get("content-type")?.includes("text/html"))return response
  const r=await fetch(new URL("/api/public-surface",request.url),{headers:{accept:"application/json"},redirect:"manual",signal:AbortSignal.timeout(12000)})
  const body=r.ok?record(await r.json()):{},p=record(body.presentation),presentation=record(p.public_presentation)
  if(body.status!=="available"||p.projection_type!=="registered_owner_custodied_pac_projection"||p.canonical_host!==url.hostname||p.canonical_path!=="/"||p.release_state!=="public"||p.frontend_invention!==false||p.authority_effect!=="none"||p.custody_transfer!==false||!stringValue(presentation.title))return response
  let html=await response.text()
  // No approved OG description/image contract is registered for this projection.
  // Remove the unrelated Measures identity; do not promote its cover into OG authority.
  html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${escapeHtml(String(presentation.title))}</title>`)
  html=upsertHeadTag(html,/<link\s+rel="canonical"[\s\S]*?>/i,`<link rel="canonical" href="${escapeHtml(url.origin+"/")}" />`)
  html=html.replace(/<meta\s+(?:property="og:[^"]+"|name="(?:twitter:[^"]+|description)")[\s\S]*?>/gi,"")
  const headers=new Headers(response.headers);headers.delete("content-length");headers.set("x-c3-social-head","owner-projection-held-missing-approved-og-contract")
  return new Response(html,{status:response.status,headers})
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? ""
  return cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) ?? null
}

function basicPassword(authorization: string) {
  if (!authorization.toLowerCase().startsWith("basic ")) return null
  try {
    const decoded = atob(authorization.slice(6).trim())
    return decoded.includes(":") ? decoded.slice(decoded.indexOf(":") + 1) : null
  } catch {
    return null
  }
}

function bearerToken(authorization: string) {
  return authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : null
}

async function isAuthorizedOperator(request: Request, key: string) {
  const authorization = request.headers.get("authorization") ?? ""
  const candidates = [
    request.headers.get("x-operator-dispatch-key"),
    bearerToken(authorization),
    basicPassword(authorization),
  ]
  if (candidates.some((candidate) => candidate === key)) return true
  return cookieValue(request, OPERATOR_COOKIE) === await sha256Hex(key)
}

function denied(request: Request) {
  const wantsJson =
    request.url.includes("/api/") ||
    request.headers.get("accept")?.toLowerCase().includes("application/json")
  if (wantsJson) {
    return new Response(JSON.stringify({ error: "operator access denied" }), {
      status: 403,
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  }
  return new Response("operator access denied", {
    status: 401,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "www-authenticate": 'Basic realm="Measures Registry operator chamber", charset="UTF-8"',
    },
  })
}

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const requestUrl = new URL(request.url)
  const pathname = requestUrl.pathname.replace(/\/$/, "") || "/"
  const c3OpsRoom = requestUrl.hostname === "c3ops.c3field.online" &&
    ["/systems-access", "/relational-operations", "/c3optics"].some(p => pathname === p || pathname.startsWith(p + "/"))

  if (!isProtectedPath(pathname) && !c3OpsRoom) {
    const response = await next()
    return project47PctSocialHead(request, await projectMdmSocialHead(request, await projectOwnerCustodiedSocialHead(request,response).catch(()=>response)))
  }
  if (!env.OPERATOR_DISPATCH_KEY) {
    return new Response(JSON.stringify({ error: "operator access not configured" }), {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  }
  if (!(await isAuthorizedOperator(request, env.OPERATOR_DISPATCH_KEY))) return denied(request)

  const response = await next()
  const headers = new Headers(response.headers)
  headers.append(
    "set-cookie",
    `${OPERATOR_COOKIE}=${await sha256Hex(env.OPERATOR_DISPATCH_KEY)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
  )
  headers.set("cache-control", "private, no-store")
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}
