import assert from "node:assert/strict"
import test from "node:test"

import { onRequest, rewriteInitiativeSocialHead } from "./_middleware"

const env = { OPERATOR_DISPATCH_KEY: "operator-test-key" }

async function callMiddleware(request: Request, overrides: { env?: Record<string, string>; next?: () => Promise<Response> } = {}) {
  return onRequest({
    request,
    env: overrides.env ?? env,
    next: overrides.next ?? (async () => new Response("ok", { status: 200 })),
  } as never)
}

async function operatorCookie(key: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key))
  const value = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
  return `mr_operator_chamber=${value}`
}

test("passes public undrifted routes without operator key", async () => {
  let nextCalled = false
  const response = await callMiddleware(
    new Request("https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/"),
    {
      next: async () => {
        nextCalled = true
        return new Response("public")
      },
    },
  )

  assert.equal(response.status, 200)
  assert.equal(await response.text(), "public")
  assert.equal(nextCalled, true)
})

test("challenges anonymous chamber page for browser credential entry", async () => {
  const response = await callMiddleware(new Request("https://measuresregistry.com/publish-undrifted/"))

  assert.equal(response.status, 401)
  assert.match(response.headers.get("www-authenticate") ?? "", /Measures Registry operator chamber/)
  assert.equal(await response.text(), "operator access denied")
})

test("denies anonymous privileged API as json", async () => {
  const response = await callMiddleware(
    new Request("https://measuresregistry.com/api/publish-undrifted-lapzuli-controls", {
      headers: { accept: "application/json" },
    }),
  )

  assert.equal(response.status, 403)
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8")
  assert.deepEqual(await response.json(), { error: "operator access denied" })
})

test("allows existing operator dispatch key and marks response private", async () => {
  let nextCalled = false
  const response = await callMiddleware(
    new Request("https://measuresregistry.com/publish-undrifted/", {
      headers: { "x-operator-dispatch-key": env.OPERATOR_DISPATCH_KEY },
    }),
    {
      next: async () => {
        nextCalled = true
        return new Response("chamber")
      },
    },
  )

  assert.equal(response.status, 200)
  assert.equal(nextCalled, true)
  assert.equal(response.headers.get("cache-control"), "private, no-store")
  assert.match(response.headers.get("set-cookie") ?? "", /mr_operator_chamber=/)
  assert.equal(await response.text(), "chamber")
})

test("allows browser basic auth password and marks response private", async () => {
  let nextCalled = false
  const basic = btoa(`op044:${env.OPERATOR_DISPATCH_KEY}`)
  const response = await callMiddleware(
    new Request("https://measuresregistry.com/publish-undrifted/", {
      headers: { authorization: `Basic ${basic}` },
    }),
    {
      next: async () => {
        nextCalled = true
        return new Response("chamber")
      },
    },
  )

  assert.equal(response.status, 200)
  assert.equal(nextCalled, true)
  assert.equal(response.headers.get("cache-control"), "private, no-store")
  assert.match(response.headers.get("set-cookie") ?? "", /mr_operator_chamber=/)
  assert.equal(await response.text(), "chamber")
})

test("allows derived operator cookie after dispatch key authorization", async () => {
  const response = await callMiddleware(
    new Request("https://measuresregistry.com/api/publish-undrifted-proof", {
      headers: { cookie: await operatorCookie(env.OPERATOR_DISPATCH_KEY) },
    }),
    { next: async () => Response.json({ ok: true }) },
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
})

test("holds protected surfaces when operator key is not configured", async () => {
  const response = await callMiddleware(
    new Request("https://measuresregistry.com/api/publish-undrifted-proof"),
    { env: {} },
  )

  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: "operator access not configured" })
})


test("rewrites crawler-visible MDM social head without Measures Registry fallback", () => {
  const html = `<!doctype html><html><head>
    <title>Measures Registry</title>
    <meta name="description" content="Computational Systems Governance." />
    <link rel="canonical" href="https://measuresregistry.com/" />
    <meta property="og:title" content="Measures Registry" />
    <meta property="og:description" content="Computational Systems Governance." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://measuresregistry.com/" />
    <meta property="og:image" content="https://measuresregistry.com/og.jpeg" />
    <meta property="og:image:alt" content="Measures Registry" />
    <meta name="twitter:title" content="Measures Registry" />
    <meta name="twitter:description" content="Computational Systems Governance." />
    <meta name="twitter:image" content="https://measuresregistry.com/og.jpeg" />
  </head><body></body></html>`

  const result = rewriteInitiativeSocialHead(html, {
    title: "The Million Dollar Mission | c3 Community Partners",
    description: "The Million Dollar Mission is a live test of what becomes possible when a community can connect what it already has.",
    canonicalUrl: "https://mdm.c3field.online/",
    ogType: "website",
    ogImageUrl: "https://mdm.c3field.online/api/free-media?asset=c3_field_mdm_c3_center_og_master_v1",
  })

  assert.match(result, /<title>The Million Dollar Mission \| c3 Community Partners<\/title>/)
  assert.match(result, /property="og:url" content="https:\/\/mdm\.c3field\.online\/"/)
  assert.match(result, /property="og:image" content="https:\/\/mdm\.c3field\.online\/api\/free-media\?asset=c3_field_mdm_c3_center_og_master_v1"/)
  assert.match(result, /name="twitter:title" content="The Million Dollar Mission \| c3 Community Partners"/)
  assert.doesNotMatch(result, /Measures Registry/)
})
