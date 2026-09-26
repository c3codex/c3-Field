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

export function rewriteInitiativeSocialHead(html: string, seo: InitiativeSeoProjection) {
  const title = escapeHtml(seo.title)
  const description = escapeHtml(seo.description)
  const canonicalUrl = escapeHtml(seo.canonicalUrl)
  const ogType = escapeHtml(seo.ogType)
  const ogImageUrl = escapeHtml(seo.ogImageUrl)

  let out = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
  out = replaceHeadTag(out, /<meta\s+name="description"[\s\S]*?>/i, `<meta name="description" content="${description}" />`)
  out = replaceHeadTag(out, /<link\s+rel="canonical"[\s\S]*?>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:title"[\s\S]*?>/i, `<meta property="og:title" content="${title}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:description"[\s\S]*?>/i, `<meta property="og:description" content="${description}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:type"[\s\S]*?>/i, `<meta property="og:type" content="${ogType}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:url"[\s\S]*?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
  out = replaceHeadTag(out, /<meta\s+property="og:image"[\s\S]*?>/i, `<meta property="og:image" content="${ogImageUrl}" />`)
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

  if (body.standing !== "bounded_public_runtime" || surface.initiativeKey !== "million_dollar_mission")
    throw new Error("mdm_social_metadata_authority_mismatch")

  const title = stringValue(seo.title)
  const description = stringValue(seo.description)
  const canonicalUrl = stringValue(seo.canonical_url)
  const ogType = stringValue(seo.og_type) ?? "website"
  const ogImageAssetKey = stringValue(seo.og_image_asset_key)

  if (!title || !description || !canonicalUrl || !ogImageAssetKey || !/^[a-z0-9_]+$/i.test(ogImageAssetKey))
    throw new Error("mdm_social_metadata_authority_incomplete")

  const canonical = new URL(canonicalUrl)
  if (canonical.protocol !== "https:" || canonical.hostname !== "mdm.c3field.online")
    throw new Error("mdm_social_metadata_canonical_mismatch")

  const ogImageUrl = new URL("/api/free-media", canonical.origin)
  ogImageUrl.searchParams.set("asset", ogImageAssetKey)

  return { title, description, canonicalUrl, ogType, ogImageUrl: ogImageUrl.toString() }
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
    return projectMdmSocialHead(request, await next())
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
