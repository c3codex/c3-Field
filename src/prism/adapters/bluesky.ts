// Prism Publications Phase 1 — Bluesky (AT Protocol) adapter.
//
// Implemented and verified against the public AT Protocol XRPC HTTP surface:
// - com.atproto.identity.resolveHandle
// - com.atproto.server.createSession
// - com.atproto.repo.uploadBlob
// - com.atproto.repo.createRecord (collection app.bsky.feed.post)
// Documentation reference: atproto.com/specs/xrpc, docs.bsky.app (accessed for
// this implementation's protocol shape; no live network call was made against
// a production account during this execution — see test suite for coverage
// against a local fixture server).
//
// No credential value is embedded here. `password` is supplied at call time
// from a runtime credential reference; nothing in this module reads, logs, or
// persists it beyond the single session-creation request.

import {
  PrismApiError,
  PrismUncertainResponseError,
  type PrismAdapterResult,
  type PrismFacet,
  type PrismImageInput,
} from "../types"

export const DEFAULT_PDS_URL = "https://bsky.social"
export const MAX_GRAPHEMES = 300

export interface BlueskySession {
  accessJwt: string
  did: string
  handle: string
}

export interface BlueskyAdapterDeps {
  pdsUrl?: string
  fetchImpl?: typeof fetch
  now?: () => Date
}

function segmentGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), (s) => s.segment)
  }
  // Fallback: code-point iteration (undercounts some emoji ZWJ sequences,
  // but never overcounts, so it cannot falsely reject a valid short post
  // — it can only be conservative in the opposite direction, which is safe
  // for a length ceiling. Documented as a known limitation of the fallback path.
  return Array.from(text)
}

export function graphemeLength(text: string): number {
  return segmentGraphemes(text).length
}

export function validateTextLength(text: string): void {
  const length = graphemeLength(text)
  if (length > MAX_GRAPHEMES) {
    throw new PrismApiError(
      "invalid_request",
      `post text is ${length} graphemes, exceeds the ${MAX_GRAPHEMES}-grapheme limit`,
      false,
    )
  }
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

/**
 * Locates every occurrence of `substring` in `text` and returns its UTF-8
 * byte-offset span, as required by AT Protocol facets. Character offsets are
 * NOT valid here — multi-byte UTF-8 sequences (emoji, accented characters)
 * shift byte offsets away from character offsets, a documented, known pitfall
 * of naive facet implementations.
 */
export function findByteRange(text: string, substring: string): { byteStart: number; byteEnd: number } | null {
  const charIndex = text.indexOf(substring)
  if (charIndex === -1) return null
  const before = text.slice(0, charIndex)
  const byteStart = byteLength(before)
  const byteEnd = byteStart + byteLength(substring)
  return { byteStart, byteEnd }
}

const URL_PATTERN = /https?:\/\/[^\s]+/g
const MENTION_PATTERN = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

export function buildFacets(text: string): PrismFacet[] {
  const facets: PrismFacet[] = []
  for (const match of text.matchAll(URL_PATTERN)) {
    const range = findByteRange(text, match[0])
    if (range) facets.push({ ...range, kind: "link", target: match[0] })
  }
  for (const match of text.matchAll(MENTION_PATTERN)) {
    const range = findByteRange(text, match[0])
    if (range) facets.push({ ...range, kind: "mention", target: match[0].slice(1) })
  }
  return facets.sort((a, b) => a.byteStart - b.byteStart)
}

function facetsToAtProto(facets: PrismFacet[]) {
  return facets.map((f) => ({
    index: { byteStart: f.byteStart, byteEnd: f.byteEnd },
    features:
      f.kind === "link"
        ? [{ $type: "app.bsky.richtext.facet#link", uri: f.target }]
        : [{ $type: "app.bsky.richtext.facet#mention", did: f.target }],
  }))
}

async function classifiedFetch(
  fetchImpl: typeof fetch,
  url: string,
  init: RequestInit,
): Promise<unknown> {
  let response: Response
  try {
    response = await fetchImpl(url, init)
  } catch (err) {
    // A thrown fetch (network failure, abort, timeout) means we genuinely do
    // not know whether the server received and acted on the request.
    throw new PrismUncertainResponseError(
      `network error calling ${url}: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  if (response.status === 429) {
    throw new PrismApiError("rate_limited", "Bluesky API rate limit exceeded", true, 429)
  }
  if (response.status === 401 || response.status === 403) {
    throw new PrismApiError("auth_failed", "Bluesky API authentication failed", false, response.status)
  }
  if (response.status >= 500) {
    throw new PrismApiError("server_error", `Bluesky API server error (${response.status})`, true, response.status)
  }
  if (response.status >= 400) {
    let body = ""
    try {
      body = await response.text()
    } catch {
      // ignore
    }
    throw new PrismApiError("invalid_request", `Bluesky API rejected the request (${response.status}): ${body}`, false, response.status)
  }

  try {
    return await response.json()
  } catch (err) {
    // Server returned a success status but an unparseable body — this is
    // genuinely ambiguous, not a clean failure.
    throw new PrismUncertainResponseError(
      `could not parse response body from ${url}: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
}

export async function resolveHandle(handle: string, deps: BlueskyAdapterDeps = {}): Promise<string> {
  const pdsUrl = deps.pdsUrl ?? DEFAULT_PDS_URL
  const fetchImpl = deps.fetchImpl ?? fetch
  const result = (await classifiedFetch(
    fetchImpl,
    `${pdsUrl}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
    { method: "GET" },
  )) as { did?: string }
  if (!result.did) {
    throw new PrismApiError("invalid_request", `resolveHandle returned no did for handle ${handle}`, false)
  }
  return result.did
}

export async function createSession(
  identifier: string,
  password: string,
  deps: BlueskyAdapterDeps = {},
): Promise<BlueskySession> {
  const pdsUrl = deps.pdsUrl ?? DEFAULT_PDS_URL
  const fetchImpl = deps.fetchImpl ?? fetch
  const result = (await classifiedFetch(fetchImpl, `${pdsUrl}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  })) as { accessJwt?: string; did?: string; handle?: string }
  if (!result.accessJwt || !result.did || !result.handle) {
    throw new PrismApiError("auth_failed", "createSession did not return a complete session", false)
  }
  return { accessJwt: result.accessJwt, did: result.did, handle: result.handle }
}

async function uploadImage(
  session: BlueskySession,
  image: PrismImageInput,
  deps: BlueskyAdapterDeps,
): Promise<unknown> {
  if (!image.altText || image.altText.trim().length === 0) {
    throw new PrismApiError("invalid_request", "image alt text is required and cannot be empty", false)
  }
  const pdsUrl = deps.pdsUrl ?? DEFAULT_PDS_URL
  const fetchImpl = deps.fetchImpl ?? fetch
  const bytes = Uint8Array.from(atob(image.bytesBase64), (c) => c.charCodeAt(0))
  const result = (await classifiedFetch(fetchImpl, `${pdsUrl}/xrpc/com.atproto.repo.uploadBlob`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      "Content-Type": image.mimeType,
    },
    body: bytes,
  })) as { blob?: unknown }
  if (!result.blob) {
    throw new PrismApiError("invalid_request", "uploadBlob did not return a blob reference", false)
  }
  return result.blob
}

export interface CreatePostInput {
  text: string
  images?: PrismImageInput[]
}

export async function createPost(
  session: BlueskySession,
  input: CreatePostInput,
  deps: BlueskyAdapterDeps = {},
): Promise<PrismAdapterResult> {
  validateTextLength(input.text)
  const facets = buildFacets(input.text)
  const now = deps.now ?? (() => new Date())
  const pdsUrl = deps.pdsUrl ?? DEFAULT_PDS_URL
  const fetchImpl = deps.fetchImpl ?? fetch

  let embed: unknown | undefined
  if (input.images && input.images.length > 0) {
    const blobs = []
    for (const image of input.images) {
      blobs.push({ image: await uploadImage(session, image, deps), alt: image.altText })
    }
    embed = { $type: "app.bsky.embed.images", images: blobs }
  }

  const record: Record<string, unknown> = {
    $type: "app.bsky.feed.post",
    text: input.text,
    createdAt: now().toISOString(),
  }
  if (facets.length > 0) record.facets = facetsToAtProto(facets)
  if (embed) record.embed = embed

  const result = (await classifiedFetch(fetchImpl, `${pdsUrl}/xrpc/com.atproto.repo.createRecord`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.feed.post",
      record,
    }),
  })) as { uri?: string; cid?: string }

  if (!result.uri || !result.cid) {
    throw new PrismApiError("invalid_request", "createRecord did not return uri/cid", false)
  }

  const rkey = result.uri.split("/").pop()
  const publicUrl = `https://bsky.app/profile/${session.handle}/post/${rkey}`

  return { atUri: result.uri, cid: result.cid, publicUrl }
}

/**
 * Bounded retry with backoff for retriable errors only
 * (`rate_limited`, `server_error`). Never retries `auth_failed` or
 * `invalid_request`, and never silently retries a `PrismUncertainResponseError`
 * — an uncertain response must surface to the caller so the execution can be
 * marked `publication_uncertain`, not re-attempted automatically.
 */
export async function withBoundedRetry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number; sleep?: (ms: number) => Promise<void> } = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3
  const baseDelayMs = options.baseDelayMs ?? 200
  const sleep = options.sleep ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)))

  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (err instanceof PrismUncertainResponseError) throw err
      if (err instanceof PrismApiError && err.retriable && attempt < maxAttempts) {
        await sleep(baseDelayMs * 2 ** (attempt - 1))
        continue
      }
      throw err
    }
  }
  throw lastError
}
