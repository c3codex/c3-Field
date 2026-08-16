import assert from "node:assert/strict"
import test from "node:test"

import { guardPublicationRequest, guardRetry, type KnownState } from "./idempotency"
import type { PrismExecutionRecord, PrismPublicationRequest } from "./types"

function baseRequest(overrides: Partial<PrismPublicationRequest> = {}): PrismPublicationRequest {
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

function baseState(overrides: Partial<KnownState> = {}): KnownState {
  return {
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
    priorExecutions: [],
    ...overrides,
  }
}

test("allows a well-formed first request", () => {
  const result = guardPublicationRequest(baseRequest(), baseState())
  assert.equal(result.allowed, true)
})

test("refuses a request with no source OAR2 binding", () => {
  const result = guardPublicationRequest(baseRequest({ sourceOar2Id: "" }), baseState())
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "missing_source_oar2_binding")
})

test("refuses an unresolved channel", () => {
  const result = guardPublicationRequest(baseRequest({ channelKey: "bluesky_undrifted" }), baseState())
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "unresolved_channel_identity")
})

test("refuses a channel that is not confirmed active", () => {
  const state = baseState({ channelStatus: { bluesky_measures_registry: "held" } })
  const result = guardPublicationRequest(baseRequest(), state)
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "channel_not_confirmed_active")
})

test("refuses an executor/channel mismatch", () => {
  const state = baseState({ channelExecutorBinding: { bluesky_measures_registry: "some_other_executor" } })
  const result = guardPublicationRequest(baseRequest(), state)
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "executor_channel_mismatch")
})

test("refuses a duplicate idempotency key with identical content as a duplicate, not a silent pass", () => {
  const prior: PrismExecutionRecord = {
    executionId: "exec-1",
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "x",
    sourceOar2Id: "y",
    executorKey: "bluesky_api",
    channelKey: "bluesky_measures_registry",
    status: "published",
    attemptNumber: 1,
    idempotencyKey: "idem-1",
    contentHash: "hash-a",
    scheduledFor: "2026-07-23T10:00:00Z",
  }
  const state = baseState({ priorExecutions: [prior] })
  const result = guardPublicationRequest(baseRequest(), state)
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "duplicate_idempotency_key")
})

test("refuses a reused idempotency key with a DIFFERENT content hash as changed-after-confirmation, not a plain duplicate", () => {
  const prior: PrismExecutionRecord = {
    executionId: "exec-1",
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "x",
    sourceOar2Id: "y",
    executorKey: "bluesky_api",
    channelKey: "bluesky_measures_registry",
    status: "confirmed",
    attemptNumber: 1,
    idempotencyKey: "idem-1",
    contentHash: "hash-DIFFERENT",
    scheduledFor: "2026-07-23T10:00:00Z",
  }
  const state = baseState({ priorExecutions: [prior] })
  const result = guardPublicationRequest(baseRequest(), state)
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "content_changed_after_confirmation")
})

test("refuses cross-identity publication when the same publication unit already targets a different channel", () => {
  const prior: PrismExecutionRecord = {
    executionId: "exec-1",
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "x",
    sourceOar2Id: "y",
    executorKey: "bluesky_api",
    channelKey: "bluesky_undrifted",
    status: "published",
    attemptNumber: 1,
    idempotencyKey: "idem-other",
    contentHash: "hash-a",
    scheduledFor: "2026-07-23T10:00:00Z",
  }
  const state = baseState({ priorExecutions: [prior] })
  const result = guardPublicationRequest(baseRequest({ idempotencyKey: "idem-2" }), state)
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "cross_identity_publication")
})

test("refuses publication after cancellation", () => {
  const prior: PrismExecutionRecord = {
    executionId: "exec-1",
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "x",
    sourceOar2Id: "y",
    executorKey: "bluesky_api",
    channelKey: "bluesky_measures_registry",
    status: "cancelled_before_publication",
    attemptNumber: 1,
    idempotencyKey: "idem-other",
    contentHash: "hash-a",
    scheduledFor: "2026-07-23T10:00:00Z",
  }
  const state = baseState({ priorExecutions: [prior] })
  const result = guardPublicationRequest(baseRequest({ idempotencyKey: "idem-2" }), state)
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "publication_after_cancellation")
})

test("guardRetry refuses a retry with no recorded authority", () => {
  const prior: PrismExecutionRecord = {
    executionId: "exec-1",
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "x",
    sourceOar2Id: "y",
    executorKey: "bluesky_api",
    channelKey: "bluesky_measures_registry",
    status: "publication_uncertain",
    attemptNumber: 1,
    idempotencyKey: "idem-1",
    contentHash: "hash-a",
    scheduledFor: "2026-07-23T10:00:00Z",
  }
  const result = guardRetry(prior, undefined)
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "retry_without_recorded_authority")
})

test("guardRetry allows a retry with recorded authority for a non-cancelled execution", () => {
  const prior: PrismExecutionRecord = {
    executionId: "exec-1",
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "x",
    sourceOar2Id: "y",
    executorKey: "bluesky_api",
    channelKey: "bluesky_measures_registry",
    status: "publication_uncertain",
    attemptNumber: 1,
    idempotencyKey: "idem-1",
    contentHash: "hash-a",
    scheduledFor: "2026-07-23T10:00:00Z",
  }
  const result = guardRetry(prior, "oar2_authorize_prism_retry_v1")
  assert.equal(result.allowed, true)
})

test("guardRetry refuses a retry of a cancelled execution even with recorded authority", () => {
  const prior: PrismExecutionRecord = {
    executionId: "exec-1",
    publicationUnitId: "pub-unit-1",
    distributionAssetId: "asset-1",
    executionInstanceId: "x",
    sourceOar2Id: "y",
    executorKey: "bluesky_api",
    channelKey: "bluesky_measures_registry",
    status: "cancelled_before_publication",
    attemptNumber: 1,
    idempotencyKey: "idem-1",
    contentHash: "hash-a",
    scheduledFor: "2026-07-23T10:00:00Z",
  }
  const result = guardRetry(prior, "oar2_authorize_prism_retry_v1")
  assert.equal(result.allowed, false)
  assert.equal(result.reason, "publication_after_cancellation")
})
