import assert from "node:assert/strict"
import test from "node:test"

import {
  InMemoryPrismQueueRepository,
  confirmExecution,
  createDraft,
  inspectExecution,
  recordAttempt,
  recordFailure,
  recordPublished,
  recordUncertain,
  releaseExecution,
  requestCancellation,
  retryUncertainExecution,
  scheduleExecution,
} from "./queue"
import type { PrismPublicationRequest } from "./types"

function makeRepo() {
  return new InMemoryPrismQueueRepository({
    channels: [
      {
        channelKey: "bluesky_measures_registry",
        handle: "measures-registry.bsky.social",
        publicProfileUrl: "https://bsky.app/profile/measures-registry.bsky.social",
        identityClass: "institutional",
        credentialReference: "PRISM_BLUESKY_MEASURES_REGISTRY_CREDENTIAL_REF",
      },
    ],
    channelExecutorBinding: { bluesky_measures_registry: "bluesky_api" },
    channelStatus: { bluesky_measures_registry: "active" },
  })
}

function request(overrides: Partial<PrismPublicationRequest> = {}): PrismPublicationRequest {
  return {
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "implement_prism_publications_phase1_claude_001",
    sourceOar2Id: "oar2_implement_prism_publications_phase1_foundation_v1",
    executorKey: "bluesky_api",
    channelKey: "bluesky_measures_registry",
    text: "hello",
    scheduledFor: "2026-07-23T10:00:00Z",
    scheduledTimezone: "America/Chicago",
    idempotencyKey: "idem-1",
    contentHash: "hash-a",
    ...overrides,
  }
}

let idCounter = 0
function nextId() {
  idCounter += 1
  return `exec-${idCounter}`
}

test("full lifecycle: draft -> confirmed -> released -> scheduled -> attempted -> published", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  assert.equal(draft.status, "draft")

  await confirmExecution(repo, draft.executionId, "oar2_implement_prism_publications_phase1_foundation_v1")
  let record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "confirmed")

  await releaseExecution(repo, draft.executionId)
  record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "released")

  await scheduleExecution(repo, draft.executionId, "2026-07-23T10:00:00Z")
  record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "scheduled")

  await recordAttempt(repo, draft.executionId)
  record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "publication_attempted")
  assert.equal(record?.attemptNumber, 1)

  await recordPublished(repo, draft.executionId, {
    atUri: "at://did:plc:abc/app.bsky.feed.post/xyz",
    cid: "bafyxyz",
    publicUrl: "https://bsky.app/profile/measures-registry.bsky.social/post/xyz",
  })
  record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "published")
  assert.equal(record?.atUri, "at://did:plc:abc/app.bsky.feed.post/xyz")
})

test("createDraft refuses a request against a held (not active) channel", async () => {
  const repo = new InMemoryPrismQueueRepository({
    channels: [
      {
        channelKey: "bluesky_measures_registry",
        handle: "measures-registry.bsky.social",
        publicProfileUrl: "https://bsky.app/profile/measures-registry.bsky.social",
        identityClass: "institutional",
        credentialReference: "ref",
      },
    ],
    channelExecutorBinding: { bluesky_measures_registry: "bluesky_api" },
    channelStatus: { bluesky_measures_registry: "held" },
  })
  await assert.rejects(createDraft(repo, request(), nextId), /channel_not_confirmed_active/)
})

test("cannot release before confirming", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  await assert.rejects(releaseExecution(repo, draft.executionId), /not "confirmed"/)
})

test("cannot schedule before releasing", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  await confirmExecution(repo, draft.executionId, "oar2_x")
  await assert.rejects(scheduleExecution(repo, draft.executionId, "2026-07-23T10:00:00Z"), /not "released"/)
})

test("recordFailure requires the execution to be in publication_attempted", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  await assert.rejects(recordFailure(repo, draft.executionId, "server_error", "boom"), /not "publication_attempted"/)
})

test("recordUncertain moves publication_attempted -> publication_uncertain, and it is not auto-republished", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  await confirmExecution(repo, draft.executionId, "oar2_x")
  await releaseExecution(repo, draft.executionId)
  await scheduleExecution(repo, draft.executionId, "2026-07-23T10:00:00Z")
  await recordAttempt(repo, draft.executionId)
  await recordUncertain(repo, draft.executionId, "network timeout, response unknown")
  const record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "publication_uncertain")
})

test("retryUncertainExecution refuses without recorded authority", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  await confirmExecution(repo, draft.executionId, "oar2_x")
  await releaseExecution(repo, draft.executionId)
  await scheduleExecution(repo, draft.executionId, "2026-07-23T10:00:00Z")
  await recordAttempt(repo, draft.executionId)
  await recordUncertain(repo, draft.executionId, "timeout")
  await assert.rejects(retryUncertainExecution(repo, draft.executionId, ""), /retry_without_recorded_authority/)
})

test("retryUncertainExecution succeeds with recorded authority, returning to scheduled", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  await confirmExecution(repo, draft.executionId, "oar2_x")
  await releaseExecution(repo, draft.executionId)
  await scheduleExecution(repo, draft.executionId, "2026-07-23T10:00:00Z")
  await recordAttempt(repo, draft.executionId)
  await recordUncertain(repo, draft.executionId, "timeout")
  await retryUncertainExecution(repo, draft.executionId, "oar2_authorize_prism_retry_v1")
  const record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "scheduled")
})

test("requestCancellation succeeds before an attempt and is refused after one", async () => {
  const repo = makeRepo()
  const draft = await createDraft(repo, request(), nextId)
  await confirmExecution(repo, draft.executionId, "oar2_x")
  await requestCancellation(repo, draft.executionId)
  const record = await inspectExecution(repo, draft.executionId)
  assert.equal(record?.status, "cancelled_before_publication")

  const draft2 = await createDraft(repo, request({ idempotencyKey: "idem-2", publicationUnitId: "pub-unit-2" }), nextId)
  await confirmExecution(repo, draft2.executionId, "oar2_x")
  await releaseExecution(repo, draft2.executionId)
  await scheduleExecution(repo, draft2.executionId, "2026-07-23T10:00:00Z")
  await recordAttempt(repo, draft2.executionId)
  await assert.rejects(requestCancellation(repo, draft2.executionId), /cancellation before publication is only permitted/)
})

test("a second createDraft with the same idempotency key and same content hash is refused as a duplicate", async () => {
  const repo = makeRepo()
  await createDraft(repo, request(), nextId)
  await assert.rejects(createDraft(repo, request(), nextId), /duplicate_idempotency_key/)
})
