import assert from "node:assert/strict"
import test from "node:test"

import {
  createDraftPublicationUnit,
  inspectPublicationEvidence,
  inspectPublicationStatus,
  loadConfirmedExecution,
  PrismUnauthenticatedError,
  requestCancelBeforePublication,
  validatePublicationUnit,
  type PrismAuthContext,
} from "./contract"
import { InMemoryPrismQueueRepository, confirmExecution } from "./queue"
import type { PrismPublicationRequest } from "./types"

const authed: PrismAuthContext = { callerIdentity: "codex-service", authenticated: true }
const unauthed: PrismAuthContext = { callerIdentity: "", authenticated: false }

function makeRepo() {
  return new InMemoryPrismQueueRepository({
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

test("every contract function rejects an unauthenticated caller", async () => {
  const repo = makeRepo()
  await assert.rejects(createDraftPublicationUnit(unauthed, repo, request()), PrismUnauthenticatedError)
  await assert.rejects(validatePublicationUnit(unauthed, repo, request()), PrismUnauthenticatedError)
  await assert.rejects(loadConfirmedExecution(unauthed, repo, "exec-1"), PrismUnauthenticatedError)
  await assert.rejects(inspectPublicationStatus(unauthed, repo, "exec-1"), PrismUnauthenticatedError)
  await assert.rejects(inspectPublicationEvidence(unauthed, repo, "exec-1"), PrismUnauthenticatedError)
  await assert.rejects(requestCancelBeforePublication(unauthed, repo, "exec-1"), PrismUnauthenticatedError)
})

test("validate_publication_unit reports valid for a well-formed request", async () => {
  const repo = makeRepo()
  const result = await validatePublicationUnit(authed, repo, request())
  assert.equal(result.valid, true)
})

test("validate_publication_unit reports the specific reason for an unresolved channel", async () => {
  const repo = makeRepo()
  const result = await validatePublicationUnit(authed, repo, request({ channelKey: "bluesky_undrifted" }))
  assert.equal(result.valid, false)
  assert.equal(result.reason, "unresolved_channel_identity")
})

test("load_confirmed_execution returns undefined for a draft (a request is not an authorized release)", async () => {
  const repo = makeRepo()
  const draft = await createDraftPublicationUnit(authed, repo, request())
  const loaded = await loadConfirmedExecution(authed, repo, draft.executionId)
  assert.equal(loaded, undefined)
})

test("load_confirmed_execution returns the record once confirmed", async () => {
  const repo = makeRepo()
  const draft = await createDraftPublicationUnit(authed, repo, request())
  await confirmExecution(repo, draft.executionId, "oar2_x")
  const loaded = await loadConfirmedExecution(authed, repo, draft.executionId)
  assert.equal(loaded?.status, "confirmed")
})

test("inspect_publication_status returns only the status field, not full evidence", async () => {
  const repo = makeRepo()
  const draft = await createDraftPublicationUnit(authed, repo, request())
  const result = await inspectPublicationStatus(authed, repo, draft.executionId)
  assert.deepEqual(result, { status: "draft" })
})

test("inspect_publication_evidence returns the full record", async () => {
  const repo = makeRepo()
  const draft = await createDraftPublicationUnit(authed, repo, request())
  const result = await inspectPublicationEvidence(authed, repo, draft.executionId)
  assert.equal(result?.executionId, draft.executionId)
})

test("request_cancel_before_publication transitions to cancelled_before_publication", async () => {
  const repo = makeRepo()
  const draft = await createDraftPublicationUnit(authed, repo, request())
  await requestCancelBeforePublication(authed, repo, draft.executionId)
  const result = await inspectPublicationStatus(authed, repo, draft.executionId)
  assert.deepEqual(result, { status: "cancelled_before_publication" })
})
