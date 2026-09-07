import assert from "node:assert/strict"
import test from "node:test"

import { resolveC3FieldRoute } from "./c3FieldRouting"

test("routes c3 Field root to C1 Connect without operations spine", () => {
  const route = resolveC3FieldRoute("/")
  assert.equal(route.kind, "connect")
  assert.equal(route.component, "C3CommunityConnect")
  assert.equal(route.exposesOperationsSpine, false)
  assert.equal(route.createsStanding, false)
})

test("routes c3ops to the existing operations spine", () => {
  const route = resolveC3FieldRoute("/c3ops/")
  assert.equal(route.kind, "operations")
  assert.equal(route.component, "OarOperationsConsole")
  assert.equal(route.exposesOperationsSpine, true)
  assert.equal(route.createsStanding, false)
})

test("unknown c3 Field paths hold instead of exposing operations", () => {
  const route = resolveC3FieldRoute("/anything-else")
  assert.equal(route.kind, "held_unknown")
  assert.equal(route.component, "HeldUnknownC3FieldRoute")
  assert.equal(route.exposesOperationsSpine, false)
  assert.equal(route.createsStanding, false)
})
