import assert from "node:assert/strict"
import test from "node:test"

import {
  buildFacets,
  createPost,
  createSession,
  findByteRange,
  graphemeLength,
  resolveHandle,
  validateTextLength,
  withBoundedRetry,
  type BlueskySession,
} from "./bluesky"
import { PrismApiError, PrismUncertainResponseError } from "../types"

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
}

function fakeFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString()
    return handler(url, init)
  }) as typeof fetch
}

test("graphemeLength counts multi-codepoint emoji as one grapheme", () => {
  // family emoji is multiple codepoints joined by ZWJ — must count as 1, not 7.
  const family = "\u{1F468}‍\u{1F469}‍\u{1F467}‍\u{1F466}"
  assert.equal(graphemeLength(family), 1)
})

test("validateTextLength rejects text over 300 graphemes", () => {
  const longText = "a".repeat(301)
  assert.throws(() => validateTextLength(longText), PrismApiError)
})

test("validateTextLength accepts exactly 300 graphemes", () => {
  const exactText = "a".repeat(300)
  assert.doesNotThrow(() => validateTextLength(exactText))
})

test("findByteRange returns UTF-8 byte offsets, not character offsets, across multibyte prefixes", () => {
  // "café " is 5 characters but 6 UTF-8 bytes (é is 2 bytes) before the link.
  const text = "café https://example.com more text"
  const range = findByteRange(text, "https://example.com")
  assert.ok(range)
  // byte offset must be 6 (c-a-f-é(2 bytes)-space), not 5 (character count)
  assert.equal(range!.byteStart, 6)
  assert.equal(range!.byteEnd, 6 + Buffer.byteLength("https://example.com", "utf8"))
})

test("buildFacets extracts both links and mentions with correct byte ranges", () => {
  const text = "See https://example.com and follow @alice.bsky.social"
  const facets = buildFacets(text)
  assert.equal(facets.length, 2)
  assert.equal(facets[0].kind, "link")
  assert.equal(facets[0].target, "https://example.com")
  assert.equal(facets[1].kind, "mention")
  assert.equal(facets[1].target, "alice.bsky.social")
})

test("resolveHandle returns the did on success", async () => {
  const fetchImpl = fakeFetch(() => jsonResponse(200, { did: "did:plc:abc123" }))
  const did = await resolveHandle("measures-registry.bsky.social", { fetchImpl })
  assert.equal(did, "did:plc:abc123")
})

test("resolveHandle classifies a 404 as invalid_request, non-retriable", async () => {
  const fetchImpl = fakeFetch(() => jsonResponse(400, { error: "InvalidRequest" }))
  await assert.rejects(
    resolveHandle("unknown.bsky.social", { fetchImpl }),
    (err: unknown) => err instanceof PrismApiError && err.errorClass === "invalid_request" && !err.retriable,
  )
})

test("createSession classifies a 401 as auth_failed, non-retriable", async () => {
  const fetchImpl = fakeFetch(() => jsonResponse(401, { error: "AuthenticationRequired" }))
  await assert.rejects(
    createSession("measures-registry.bsky.social", "wrong-password", { fetchImpl }),
    (err: unknown) => err instanceof PrismApiError && err.errorClass === "auth_failed" && !err.retriable,
  )
})

test("a 429 response is classified as rate_limited and retriable", async () => {
  const fetchImpl = fakeFetch(() => jsonResponse(429, { error: "RateLimitExceeded" }))
  await assert.rejects(
    resolveHandle("measures-registry.bsky.social", { fetchImpl }),
    (err: unknown) => err instanceof PrismApiError && err.errorClass === "rate_limited" && err.retriable === true,
  )
})

test("a 5xx response is classified as server_error and retriable", async () => {
  const fetchImpl = fakeFetch(() => jsonResponse(503, { error: "InternalServerError" }))
  await assert.rejects(
    resolveHandle("measures-registry.bsky.social", { fetchImpl }),
    (err: unknown) => err instanceof PrismApiError && err.errorClass === "server_error" && err.retriable === true,
  )
})

test("a thrown network error becomes PrismUncertainResponseError, not a classified failure", async () => {
  const fetchImpl = fakeFetch(() => {
    throw new Error("ECONNRESET")
  })
  await assert.rejects(resolveHandle("measures-registry.bsky.social", { fetchImpl }), PrismUncertainResponseError)
})

test("createPost creates a text-only post and derives the public URL from handle + rkey", async () => {
  const session: BlueskySession = { accessJwt: "test-jwt", did: "did:plc:abc123", handle: "measures-registry.bsky.social" }
  const fetchImpl = fakeFetch((url) => {
    assert.match(url, /com\.atproto\.repo\.createRecord$/)
    return jsonResponse(200, { uri: "at://did:plc:abc123/app.bsky.feed.post/3abc123xyz", cid: "bafyabc123" })
  })
  const result = await createPost(session, { text: "Hello from Measures Registry" }, { fetchImpl })
  assert.equal(result.atUri, "at://did:plc:abc123/app.bsky.feed.post/3abc123xyz")
  assert.equal(result.cid, "bafyabc123")
  assert.equal(result.publicUrl, "https://bsky.app/profile/measures-registry.bsky.social/post/3abc123xyz")
})

test("createPost rejects an image with no alt text before any network call", async () => {
  const session: BlueskySession = { accessJwt: "test-jwt", did: "did:plc:abc123", handle: "measures-registry.bsky.social" }
  let called = false
  const fetchImpl = fakeFetch(() => {
    called = true
    return jsonResponse(200, {})
  })
  await assert.rejects(
    createPost(
      session,
      { text: "post with image", images: [{ bytesBase64: "AAAA", mimeType: "image/png", altText: "" }] },
      { fetchImpl },
    ),
    (err: unknown) => err instanceof PrismApiError && err.errorClass === "invalid_request",
  )
  assert.equal(called, false, "must not call the network before validating required alt text")
})

test("createPost rejects text over the grapheme limit before any network call", async () => {
  const session: BlueskySession = { accessJwt: "test-jwt", did: "did:plc:abc123", handle: "measures-registry.bsky.social" }
  let called = false
  const fetchImpl = fakeFetch(() => {
    called = true
    return jsonResponse(200, {})
  })
  await assert.rejects(createPost(session, { text: "a".repeat(301) }, { fetchImpl }), PrismApiError)
  assert.equal(called, false)
})

test("withBoundedRetry retries a retriable error up to maxAttempts then succeeds", async () => {
  let attempts = 0
  const result = await withBoundedRetry(
    async () => {
      attempts++
      if (attempts < 3) throw new PrismApiError("server_error", "temporary", true, 503)
      return "ok"
    },
    { maxAttempts: 3, baseDelayMs: 1, sleep: async () => {} },
  )
  assert.equal(result, "ok")
  assert.equal(attempts, 3)
})

test("withBoundedRetry does not retry a non-retriable error", async () => {
  let attempts = 0
  await assert.rejects(
    withBoundedRetry(
      async () => {
        attempts++
        throw new PrismApiError("auth_failed", "bad creds", false, 401)
      },
      { maxAttempts: 3, baseDelayMs: 1, sleep: async () => {} },
    ),
  )
  assert.equal(attempts, 1)
})

test("withBoundedRetry never retries an uncertain response", async () => {
  let attempts = 0
  await assert.rejects(
    withBoundedRetry(
      async () => {
        attempts++
        throw new PrismUncertainResponseError("timeout")
      },
      { maxAttempts: 3, baseDelayMs: 1, sleep: async () => {} },
    ),
    PrismUncertainResponseError,
  )
  assert.equal(attempts, 1)
})
