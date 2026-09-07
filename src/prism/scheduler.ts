// Prism Publications Phase 1 — scheduler logic (runtime-agnostic).
//
// This is the pure logic a Cloudflare Worker's `scheduled()` handler calls
// into. It is deliberately separated from any Cloudflare-specific binding so
// it can be unit tested without a Workers runtime, and so the same logic
// could later run from "an authenticated test harness" per the governing
// OAR2's own requirement.

import { createPost, type BlueskyAdapterDeps, type BlueskySession } from "./adapters/bluesky"
import { PrismApiError, PrismUncertainResponseError } from "./types"
import { formNotificationEvent, type FormedPrismNotificationEvent } from "./notifications"
import { recordAttempt, recordFailure, recordPublished, recordUncertain, type PrismQueueRepository } from "./queue"
import type { PrismExecutionRecord } from "./types"

export interface SchedulerRunResult {
  claimed: PrismExecutionRecord | undefined
  outcome: "no_eligible_execution" | "published" | "failed" | "publication_uncertain"
  notifications: FormedPrismNotificationEvent[]
}

/**
 * Atomically claims exactly one eligible execution row, or none. A real
 * database-backed repository must implement this with `SELECT ... FOR UPDATE
 * SKIP LOCKED` (or equivalent) so that concurrent Worker invocations cannot
 * claim the same row twice. This is documented as a hard requirement on any
 * production repository implementation, not merely a suggestion — see
 * docs/oar/measures_registry/prism_publications_phase1_implementation_v1.meta.md,
 * "Known holds."
 */
export interface ClaimingPrismQueueRepository extends PrismQueueRepository {
  claimEligibleExecution(nowIso: string): Promise<PrismExecutionRecord | undefined>
}

export interface SessionResolver {
  (channelKey: string): Promise<{ session: BlueskySession; deps?: BlueskyAdapterDeps }>
}

/**
 * Refuses to claim/publish any execution not in "scheduled" standing with a
 * due `scheduledFor`. Held, draft, unconfirmed, cancelled, and mismatched rows
 * are never eligible — this is enforced primarily by the repository's own
 * `claimEligibleExecution` query, and asserted again here defensively.
 */
function assertEligible(record: PrismExecutionRecord, nowIso: string): void {
  if (record.status !== "scheduled") {
    throw new Error(`claimed execution ${record.executionId} has status "${record.status}", not "scheduled"`)
  }
  if (record.scheduledFor > nowIso) {
    throw new Error(`claimed execution ${record.executionId} is not yet due (scheduledFor ${record.scheduledFor})`)
  }
}

export async function runSchedulerTick(
  repo: ClaimingPrismQueueRepository,
  resolveSession: SessionResolver,
  now: () => Date = () => new Date(),
): Promise<SchedulerRunResult> {
  const nowIso = now().toISOString()
  const claimed = await repo.claimEligibleExecution(nowIso)
  if (!claimed) {
    return { claimed: undefined, outcome: "no_eligible_execution", notifications: [] }
  }

  assertEligible(claimed, nowIso)

  const notifications: FormedPrismNotificationEvent[] = []
  await recordAttempt(repo, claimed.executionId)
  notifications.push(formNotificationEvent("publication_attempted", claimed, now))

  const { session, deps } = await resolveSession(claimed.channelKey)

  try {
    // Content and asset hashes are re-checked by the queue's own guard at
    // draft/confirm time; the scheduler trusts the already-confirmed record
    // rather than re-deriving text, per the queue module's own state machine.
    const result = await createPost(session, { text: (claimed as unknown as { text?: string }).text ?? "" }, deps)
    await recordPublished(repo, claimed.executionId, result)
    notifications.push(formNotificationEvent("published", { ...claimed, status: "published" }, now))
    return { claimed, outcome: "published", notifications }
  } catch (err) {
    if (err instanceof PrismUncertainResponseError) {
      await recordUncertain(repo, claimed.executionId, err.message)
      notifications.push(formNotificationEvent("publication_uncertain", { ...claimed, status: "publication_uncertain" }, now))
      return { claimed, outcome: "publication_uncertain", notifications }
    }
    const errorClass = err instanceof PrismApiError ? err.errorClass : "unknown"
    const message = err instanceof Error ? err.message : String(err)
    await recordFailure(repo, claimed.executionId, errorClass, message)
    notifications.push(formNotificationEvent("failed", { ...claimed, status: "failed" }, now))
    return { claimed, outcome: "failed", notifications }
  }
}
