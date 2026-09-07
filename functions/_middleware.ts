type Env = {
  OPERATOR_DISPATCH_KEY?: string
}

const OPERATOR_COOKIE = "mr_operator_chamber"
const PROTECTED_PATHS = [
  "/publish-undrifted",
  "/api/publish-undrifted-proof",
  "/api/publish-undrifted-lapzuli-controls",
]

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
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
  const pathname = new URL(request.url).pathname.replace(/\/$/, "") || "/"
  if (!isProtectedPath(pathname)) return next()
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
