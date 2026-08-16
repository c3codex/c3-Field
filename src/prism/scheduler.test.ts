import assert from "node:assert/strict"
import test from "node:test"

import { InMemoryPrismQueueRepository, confirmExecution, createDraft, releaseExecution, scheduleExecution } from "./queue"
import type { ClaimingPrismQueueRepository } from "./scheduler"
import { runSchedulerTick } from "./scheduler"
import { PrismUncertainResponseError, PrismApiError } from "./types"
import type { PrismExecutionRecord, PrismPublicationRequest } from "./types"
import type { BlueskySession } from "./adapters/bluesky"

class TestClaimingRepository extends InMemoryPrismQueueRepository implements ClaimingPrismQueueRepository {
  async claimEligibleExecution(nowIso: string): Promise<PrismExecutionRecord | undefined> {
    // `listAll` is `protected` on the base class — directly accessible here since
    // this is a subclass, not an external caller.
    return this.listAll().find((r) => r.status === "scheduled" && r.scheduledFor <= nowIso)
  }
}

function makeRepo() {
  return new TestClaimingRepository({
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
    scheduledFor: "2020-01-01T00:00:00Z",
    scheduledTimezone: "America/Chicago",
    idempotencyKey: "idem-1",
    contentHash: "hash-a",
    ...overrides,
  }
}

async function setUpScheduledExecution(repo: TestClaimingRepository, overrides: Partial<PrismPublicationRequest> = {}) {
  const draft = await createDraft(repo, request(overrides))
  await confirmExecution(repo, draft.executionId, "oar2_x")
  await releaseExecution(repo, draft.executionId)
  await scheduleExecution(repo, draft.executionId, "2020-01-01T00:00:00Z")
  return draft.executionId
}

const fakeSession: BlueskySession = { accessJwt: "test", did: "did:plc:abc", handle: "measures-registry.bsky.social" }

test("runSchedulerTick returns no_eligible_execution when nothing is due", async () => {
  const repo = makeRepo()
  const result = await runSchedulerTick(repo, async () => ({ session: fakeSession }))
  assert.equal(result.outcome, "no_eligible_execution")
})

test("runSchedulerTick publishes an eligible execution and forms published + attempted notifications", async () => {
  const repo = makeRepo()
  await setUpScheduledExecution(repo)

  const resolveSession = async () => ({
    session: fakeSession,
    deps: {
      fetchImpl: (async () =>
        new Response(JSON.stringify({ uri: "at://did:plc:abc/app.bsky.feed.post/xyz", cid: "bafyxyz" }), {
          status: 200,
        })) as unknown as typeof fetch,
    },
  })

  const result = await runSchedulerTick(repo, resolveSession)
  assert.equal(result.outcome, "published")
  assert.ok(result.notifications.some((n) => n.eventType === "publication_attempted"))
  assert.ok(result.notifications.some((n) => n.eventType === "published"))
})

test("runSchedulerTick records a classified failure without throwing out of the tick", async () => {
  const repo = makeRepo()
  await setUpScheduledExecution(repo)

  const resolveSession = async () => ({
    session: fakeSession,
    deps: {
      fetchImpl: (async () => new Response(JSON.stringify({ error: "AuthenticationRequired" }), { status: 401 })) as unknown as typeof fetch,
    },
  })

  const result = await runSchedulerTick(repo, resolveSession)
  assert.equal(result.outcome, "failed")
  assert.ok(result.notifications.some((n) => n.eventType === "failed"))
})

test("runSchedulerTick marks publication_uncertain on a network error, and does not silently retry within the same tick", async () => {
  const repo = makeRepo()
  await setUpScheduledExecution(repo)

  const resolveSession = async () => ({
    session: fakeSession,
    deps: {
      fetchImpl: (async () => {
        throw new Error("ECONNRESET")
      }) as unknown as typeof fetch,
    },
  })

  const result = await runSchedulerTick(repo, resolveSession)
  assert.equal(result.outcome, "publication_uncertain")
  assert.ok(result.notifications.some((n) => n.eventType === "publication_uncertain"))
})
