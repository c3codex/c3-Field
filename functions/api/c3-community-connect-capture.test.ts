import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./c3-community-connect-capture"

function request(body: unknown) {
  return new Request("https://c3field.online/api/c3-community-connect-capture", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

test("holds invalid candidate signals without mutation", async () => {
  const response = await onRequestPost({
    request: request({ name: "A", email: "not-email" }),
    env: {},
  } as never)
  assert.equal(response.status, 400)
  const body = await response.json() as Record<string, unknown>
  assert.equal(body.standing, "held_invalid_candidate_signal")
  assert.equal(body.external_standing_created, false)
  assert.equal(body.mutation_count, 0)
})

test("valid candidate signal returns Current-review hold without standing", async () => {
  const response = await onRequestPost({
    request: request({ name: "Ada Lovelace", email: "Ada@Example.com", message: "Interested in C1." }),
    env: {},
  } as never)
  assert.equal(response.status, 409)
  const body = await response.json() as Record<string, any>
  assert.equal(body.standing, "held_candidate_capture_adapter_missing")
  assert.equal(body.result_label, "Pending Current Review")
  assert.equal(body.source_registry_key, "c3_community_connect")
  assert.equal(body.capture_context, "c3_community_c1_connect_candidate")
  assert.equal(body.external_standing_created, false)
  assert.equal(body.mutation_count, 0)
  assert.equal(body.candidate_signal.email_present, true)
})
