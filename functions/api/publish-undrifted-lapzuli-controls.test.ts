import assert from "node:assert/strict"
import test from "node:test"

import { onRequestGet, onRequestPost } from "./publish-undrifted-lapzuli-controls"

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN: "lapzuli-test",
  LAPZULI_DISTRIBUTION_WORKER_URL: "https://lapzuli.example",
}

async function withMockedFetch(
  handler: (url: string, init: RequestInit) => Response | Promise<Response>,
  run: () => Promise<Response>,
) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init ?? {})) as typeof fetch
  try {
    return await run()
  } finally {
    globalThis.fetch = originalFetch
  }
}

function registryRow(key: string) {
  return [{
    registry_key: key,
    display_title: key,
    release_state: key === "undrifted" ? "released" : "sealed",
    access_state: key === "undrifted" ? "encounterable" : "gated",
    is_active: true,
    metadata: { registration: { standing: "registered" } },
  }]
}

function processRow(key: string) {
  return [{
    process_key: key,
    status: "active",
    process_status: null,
    authority_state: "operator_confirmed_registered",
    metadata: {
      passage_surface: key === "env_role_call_publish_undrifted_binding_v1" ? "/publish-undrifted" : undefined,
      resulting_encounter: key === "env_role_call_publish_undrifted_binding_v1" ? "/undrifted" : undefined,
      call_relation: key === "env_role_call_persistence_binding_v1" ? "Environment -> env.role_call -> Persistence" : undefined,
    },
  }]
}

function dispatchRows() {
  return [{
    dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
    publication_key: "undrifted",
    title: "The Wiz Behind the Curtain",
    internal_route: "/undrifted/the-wiz-behind-the-curtain",
    external_url: "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/",
    status: "published",
    published_at: "2026-08-29T20:32:03.028237+00:00",
    metadata: {
      series_key: "drift_report",
      source_sha256: "4c84fa696df8dcefe25877f86a2b3b8670267c795a884ffd378980c85b8813c9",
      source_drive_id: "16PJHULbIWZ7Sz6s1Q9pmJWfEgyoYGaVJ",
    },
  }]
}

function mockHandler(url: string, init: RequestInit) {
  if (url === "https://lapzuli.example/role-call/proof") {
    assert.equal((init.headers as Record<string, string>).authorization, "Bearer lapzuli-test")
    return Response.json({
      ok: true,
      standing: "role_call_proven",
      worker_identity: "dizzy_lapzuli_distribution_worker_v1",
      role_identity: "Dizzy",
      process: "lapzuli_distribution",
      relation: "Lapzuli Distribution -> env.role_call -> Dizzy",
      operator_confirmation_required: true,
      autonomous_distribution_authority: "none",
      external_publication_effects: 0,
    })
  }
  if (url.includes("measures_registry?registry_key=eq.")) {
    const key = decodeURIComponent(url.match(/registry_key=eq\.([^&]+)/)?.[1] ?? "")
    return Response.json(registryRow(key))
  }
  if (url.includes("system_process_registry?process_key=eq.")) {
    const key = decodeURIComponent(url.match(/process_key=eq\.([^&]+)/)?.[1] ?? "")
    return Response.json(processRow(key))
  }
  if (url.includes("measures_publication_dispatch?")) {
    return Response.json(dispatchRows())
  }
  if (url.includes("lapzuli_object_profile?")) {
    return Response.json([{
      publication_object_key: "undrifted_drift_report_005",
      desk_key: "drift_report",
      researched_and_cited: true,
      citations_verified: true,
      standing: "profiled_citation_verified",
      provenance: {},
    }])
  }
  if (url.includes("lapzuli_outlet_qualification?")) {
    return Response.json([{
      outlet_key: "dev",
      desk_key: "drift_report",
      distribution_mode: "canonical_crosspost",
      standing: "qualified_with_constraints",
      fit_score: 82,
      operator_disposition_required: true,
      provenance_constraints: ["canonical link required"],
      evidence: ["operator route confirmation"],
    }])
  }
  if (url.includes("lapzuli_outlet?")) {
    return Response.json([{
      outlet_key: "dev",
      outlet_name: "DEV Community",
      outlet_class: "community",
      base_url: "dev.to",
      qualification_state: "qualified",
      account_standing: "account_verified",
      metadata: {},
    }])
  }
  if (url.includes("lapzuli_route?") || url.includes("measures_distribution_execution?")) {
    return Response.json([])
  }
  return Response.json([])
}

test("returns proven controls with distribution actions held when no route exists", async () => {
  const response = await withMockedFetch(mockHandler, () => onRequestGet({
    request: new Request("https://example.com/api/publish-undrifted-lapzuli-controls"),
    env,
  } as never))

  assert.equal(response.status, 200)
  const body = await response.json() as Record<string, any>
  assert.equal(body.final_standing, "implemented_publish_undrifted_lapzuli_human_compute_controls_proven")
  assert.equal(body.passage.publication_object.dispatch_key, "drift_report_005_the_wiz_behind_the_curtain")
  assert.equal(body.lapzuli_distribution.route_standing, "qualification_required")
  assert.equal(body.controls.dispatch_now, "held_route_required")
  assert.equal(body.dizzy.worker_identity, "dizzy_lapzuli_distribution_worker_v1")
  assert.equal(body.external_publication_effects, 0)
})

test("dispatch action returns a held zero-mutation result without a route", async () => {
  const response = await withMockedFetch(mockHandler, () => onRequestPost({
    request: new Request("https://example.com/api/publish-undrifted-lapzuli-controls", {
      method: "POST",
      body: JSON.stringify({ action: "dispatch_now" }),
    }),
    env,
  } as never))

  assert.equal(response.status, 409)
  const body = await response.json() as Record<string, any>
  assert.equal(body.action_result.standing, "held_route_required")
  assert.equal(body.action_result.mutation_count, 0)
  assert.equal(body.action_result.external_publication_effects, 0)
})
