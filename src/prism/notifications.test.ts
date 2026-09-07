import assert from "node:assert/strict"
import test from "node:test"

import { formNotificationEvent, impliesAcceptanceOrClosure, LIFECYCLE_STAGE_BY_EVENT } from "./notifications"
import type { PrismExecutionRecord } from "./types"

const execution: Pick<PrismExecutionRecord, "executionId" | "publicationUnitId" | "channelKey" | "status"> = {
  executionId: "exec-1",
  publicationUnitId: "pub-unit-1",
  channelKey: "bluesky_measures_registry",
  status: "published",
}

test("forms a notification event with dispatchState formed_not_sent, never 'sent'", () => {
  const event = formNotificationEvent("published", execution)
  assert.equal(event.dispatchState, "formed_not_sent")
  assert.equal(event.provider, "prism_internal")
})

test("every required event type has a defined lifecycle stage", () => {
  const required = [
    "route_available",
    "route_acknowledged",
    "execution_released",
    "scheduled",
    "publication_attempted",
    "published",
    "failed",
    "publication_uncertain",
    "held_identity_or_authority_mismatch",
    "cancelled_before_publication",
  ] as const
  for (const eventType of required) {
    assert.ok(LIFECYCLE_STAGE_BY_EVENT[eventType], `missing lifecycle stage for ${eventType}`)
  }
})

test("no formed event ever implies acceptance or closure", () => {
  const event = formNotificationEvent("published", execution)
  assert.equal(impliesAcceptanceOrClosure(event), false)
})

test("a 'route_available' event's lifecycle stage is 'routed', not 'acknowledged' or later", () => {
  const event = formNotificationEvent("route_available", execution)
  assert.equal(event.lifecycleStage, "routed")
})

test("event metadata preserves execution status at formation time, not a live re-read", () => {
  const event = formNotificationEvent("publication_uncertain", { ...execution, status: "publication_uncertain" })
  assert.equal(event.metadata.execution_status_at_formation, "publication_uncertain")
})
