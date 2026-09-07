import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./publish-undrifted-proof"

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
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
    metadata: {
      registration: { standing: "registered", implementation: "pending" },
      physical_component: { path: `governance/${key}.meta.md` },
      computational_custody: { identity_custody: "Registry / Measures Codex" },
    },
  }]
}

function processRow(key: string) {
  const metadata: Record<string, unknown> = {}
  if (key === "env_role_call_persistence_binding_v1") {
    metadata.call_relation = "Environment -> env.role_call -> Persistence"
  }
  if (key === "env_role_call_publish_undrifted_binding_v1") {
    metadata.passage_surface = "/publish-undrifted"
    metadata.resulting_encounter = "/undrifted"
    metadata.persistence_binding_process = "env_role_call_persistence_binding_v1"
  }
  return [{
    process_key: key,
    title: key,
    process_title: null,
    status: "active",
    process_status: null,
    authority_state: "operator_confirmed_registered",
    authority_level: "governed",
    metadata,
  }]
}

test("proves passage and records recoverable event after preflight passes", async () => {
  const writes: Array<{ url: string; body: unknown }> = []
  const response = await withMockedFetch((url, init) => {
    if (init.method === "POST") {
      writes.push({ url, body: JSON.parse(String(init.body)) })
      return new Response("", { status: 201 })
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
      return Response.json([{
        dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
        publication_key: "undrifted",
        title: "The Wiz Behind the Curtain",
        internal_route: "/undrifted/the-wiz-behind-the-curtain",
        external_url: null,
        status: "published",
        published_at: "2026-08-29T20:32:03.028237+00:00",
        metadata: {
          series_key: "drift_report",
          source_sha256: "abc123",
          source_drive_id: "drive123",
        },
      }])
    }
    return Response.json([])
  }, () => onRequestPost({
    request: new Request("https://example.com/api/publish-undrifted-proof", { method: "POST" }),
    env,
  } as never))

  assert.equal(response.status, 200)
  const body = await response.json() as Record<string, any>
  assert.equal(body.final_standing, "implemented_and_passage_proven")
  assert.equal(body.passage_surface, "/publish-undrifted")
  assert.equal(body.resulting_encounter, "/undrifted")
  assert.equal(body.persistence_state_used.publication_object.dispatch_key, "drift_report_005_the_wiz_behind_the_curtain")
  assert.equal(writes.length, 2)
  assert.match(writes[0].url, /c3_oar_process_instance/)
  assert.match(writes[1].url, /c3_oar_transition_event/)
})
