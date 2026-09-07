// Prism Publications Phase 1 — notification-event formation.
//
// Reuses the existing measures_notification_template / _dispatch_log pattern's
// shape. This module only FORMS event payload records; it never sends email,
// a message, or a platform notification, and never writes to the database —
// callers decide whether/how to persist or dispatch a formed event.

import type { PrismExecutionRecord, PrismNotificationEvent } from "./types"

/**
 * Preserves: routed -> notified -> acknowledged -> released -> executed ->
 * returned -> reviewed -> disposed. A formed notification event only ever
 * represents ONE of these stages — it is never itself the acceptance,
 * authorization, execution, review, or disposition it describes.
 */
export const LIFECYCLE_STAGE_BY_EVENT: Record<PrismNotificationEvent, string> = {
  route_available: "routed",
  route_acknowledged: "acknowledged",
  execution_released: "released",
  scheduled: "released",
  publication_attempted: "executed",
  published: "executed",
  failed: "executed",
  publication_uncertain: "executed",
  held_identity_or_authority_mismatch: "notified",
  cancelled_before_publication: "acknowledged",
}

export interface FormedPrismNotificationEvent {
  eventType: PrismNotificationEvent
  lifecycleStage: string
  recipientClass: "system"
  sourceTable: "measures_distribution_execution"
  sourceId: string
  templateKey: string
  provider: "prism_internal"
  dispatchState: "formed_not_sent"
  metadata: Record<string, unknown>
  formedAt: string
}

export function formNotificationEvent(
  eventType: PrismNotificationEvent,
  execution: Pick<PrismExecutionRecord, "executionId" | "publicationUnitId" | "channelKey" | "status">,
  now: () => Date = () => new Date(),
): FormedPrismNotificationEvent {
  return {
    eventType,
    lifecycleStage: LIFECYCLE_STAGE_BY_EVENT[eventType],
    recipientClass: "system",
    sourceTable: "measures_distribution_execution",
    sourceId: execution.executionId,
    templateKey: `prism_${eventType}`,
    provider: "prism_internal",
    dispatchState: "formed_not_sent",
    metadata: {
      publication_unit_id: execution.publicationUnitId,
      channel_key: execution.channelKey,
      execution_status_at_formation: execution.status,
    },
    formedAt: now().toISOString(),
  }
}

/**
 * A formed event never implies acceptance/authorization/execution/review/
 * disposition beyond its own lifecycle stage. This helper exists so callers
 * (and tests) have one place to assert that invariant rather than re-deriving
 * it ad hoc.
 */
export function impliesAcceptanceOrClosure(_event: FormedPrismNotificationEvent): false {
  return false
}
