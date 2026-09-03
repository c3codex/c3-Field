import assert from "node:assert/strict"
import test from "node:test"

import { onRequestGet, onRequestPost } from "./publish-undrifted-lapzuli-controls"

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN: "lapzuli-test",
  LAPZULI_DISTRIBUTION_WORKER_URL: "https://lapzuli.example",
}

const wizDevRouteKey = "lapzuli_route_undrifted_drift_report_005_dev_codex_010"
const wizDevAssetKey = "undrifted_drift_report_005_dev_canonical_crosspost_v1"

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
    article_url: "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/",
    dispatch_body: "Body",
    excerpt: "Excerpt",
    seo_description: "A Drift Report on Wiz and operational security.",
    tags: ["unDrifted", "Drift Report", "AI infrastructure", "Wiz"],
    status: "published",
    published_at: "2026-08-29T20:32:03.028237+00:00",
    metadata: {
      series_key: "drift_report",
      source_sha256: "4c84fa696df8dcefe25877f86a2b3b8670267c795a884ffd378980c85b8813c9",
      source_drive_id: "16PJHULbIWZ7Sz6s1Q9pmJWfEgyoYGaVJ",
    },
  }]
}

function reportRows() {
  return [{
    dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
    issue_key: "undrifted_issue_003",
    desk_key: "drift_report",
    title: "The Wiz Behind the Curtain",
    internal_route: "/undrifted/the-wiz-behind-the-curtain",
    external_url: "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/",
    publication_status: "published",
    published_at: "2026-08-29T20:32:03.028237+00:00",
    publication_object_key: "undrifted_drift_report_005",
    source_sha256: "4c84fa696df8dcefe25877f86a2b3b8670267c795a884ffd378980c85b8813c9",
    source_drive_id: "16PJHULbIWZ7Sz6s1Q9pmJWfEgyoYGaVJ",
    source_distribution_hold: true,
    object_profile_standing: "profiled_citation_verified",
    researched_and_cited: true,
    citations_verified: true,
    execution_count: 0,
    completed_distribution_count: 0,
    latest_platform_url: null,
    distribution_state: "source_hold",
    allowed_channels: [{
      outlet_key: "dev",
      outlet_name: "DEV Community",
      distribution_mode: "canonical_crosspost",
      standing: "qualified_with_constraints",
      fit_score: 82,
      account_standing: "verified",
    }],
  }]
}

function reportRowsClearHold() {
  return reportRows().map((row) => ({
    ...row,
    source_distribution_hold: false,
    distribution_state: "ready_for_route_resolution",
  }))
}

function authorizedRouteRows() {
  return [{
    route_key: wizDevRouteKey,
    publication_object_key: "undrifted_drift_report_005",
    desk_key: "drift_report",
    outlet_key: "dev",
    distribution_mode: "canonical_crosspost",
    route_status: "authorized",
    authority_reference: "op044 authorization for DR_005 distribution plus CanCom/codex/oar2_resolve_lapzuli_route_status_and_form_dev_route_codex_010",
    operator_confirmed: true,
    canonical_url: "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/",
    payload_reference: `measures_publication_distribution_asset:${wizDevAssetKey}:payload.body_markdown`,
    metadata: {
      return_required: true,
      oar2_path: "CanCom/codex/oar2_resolve_lapzuli_route_status_and_form_dev_route_codex_010",
    },
  }]
}

function distributionAssetRows() {
  return [{
    distribution_asset_key: wizDevAssetKey,
    platform: "dev",
    distribution_type: "canonical_crosspost",
    status: "ready_for_operator_execution",
    review_status: "chazz_review_required",
    payload: {
      title: "The Wiz Behind the Curtain",
      body_markdown: "Body",
      canonical_url: "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/",
      published: false,
      description: "A Drift Report on Wiz and operational security.",
      tags: ["ai", "security", "governance", "devops"],
      idempotency_key: `${wizDevRouteKey}:${wizDevAssetKey}`,
      constraints: {
        ai_disclosure_required: true,
        canonical_required: true,
        fact_check_required: true,
        not_pure_promotion: true,
      },
      editorial_disclosure: "Editorial Disclosure: present",
    },
    metadata: {
      route_key: wizDevRouteKey,
      publication_object_key: "undrifted_drift_report_005",
      dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
      outlet_key: "dev",
      distribution_mode: "canonical_crosspost",
      external_publication_authorized: false,
      external_publication_effects: 0,
    },
  }]
}

function mockHandler(url: string, init: RequestInit) {
  if (init.method === "POST" && url.includes("c3_oar_")) {
    return new Response("", { status: 201 })
  }
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
  if (url.includes("measures_publication_distribution_asset?")) {
    return Response.json([])
  }
  if (url.includes("undrifted_distribution_report_v1?")) {
    return Response.json(reportRows())
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

test("returns selectable objects without silently choosing an action target", async () => {
  const response = await withMockedFetch(mockHandler, () => onRequestGet({
    request: new Request("https://example.com/api/publish-undrifted-lapzuli-controls"),
    env,
  } as never))

  assert.equal(response.status, 200)
  const body = await response.json() as Record<string, any>
  assert.equal(body.final_standing, "implemented_publish_undrifted_lapzuli_human_compute_controls_proven")
  assert.equal(body.passage.publication_object, null)
  assert.equal(body.controls.select_object[0].publication_object_key, "undrifted_drift_report_005")
  assert.equal(body.lapzuli_distribution.route_standing, "held_binding")
  assert.equal(body.controls.dispatch_now, "held_binding")
  assert.equal(body.dizzy.worker_identity, "dizzy_lapzuli_distribution_worker_v1")
  assert.equal(body.external_publication_effects, 0)
  assert.equal(body.source_oar2_path, "CanCom/codex/oar2_resolve_lapzuli_route_status_and_form_dev_route_codex_010")
  assert.equal(body.expected_oar1_path, "G:/My Drive/CanCom/cancom/oar1_resolve_lapzuli_route_status_and_form_dev_route_codex_010.meta.md")
  assert.equal(body.operator_access.mechanism, "existing OPERATOR_DISPATCH_KEY")
  assert.equal(body.chamber_environment.media_role, "lapis_publication_chamber_operator_environment")
  assert.equal(body.chamber_environment.derivative_storage_path, "undrifted/publication-chamber/lapis_antechamber_ops_surface_web_v1.webp")
  assert.equal(body.stations.length, 6)
  assert.deepEqual(body.stations.map((station: Record<string, string>) => station.station_key), [
    "desks",
    "pubpac",
    "publication",
    "social",
    "audience",
    "campaigns",
  ])
})

test("dispatch action requires an explicit publication object and target channel", async () => {
  const response = await withMockedFetch(mockHandler, () => onRequestPost({
    request: new Request("https://example.com/api/publish-undrifted-lapzuli-controls", {
      method: "POST",
      body: JSON.stringify({ action: "dispatch_now" }),
    }),
    env,
  } as never))

  assert.equal(response.status, 400)
  const body = await response.json() as Record<string, any>
  assert.equal(body.action_result.standing, "held_explicit_selection_required")
  assert.equal(body.action_result.mutation_count, 0)
  assert.equal(body.action_result.external_publication_effects, 0)
})

test("dispatch action persists a held evidence event for selected source-held object", async () => {
  const response = await withMockedFetch(mockHandler, () => onRequestPost({
    request: new Request("https://example.com/api/publish-undrifted-lapzuli-controls", {
      method: "POST",
      body: JSON.stringify({
        action: "dispatch_now",
        publication_object_key: "undrifted_drift_report_005",
        outlet_key: "dev",
      }),
    }),
    env,
  } as never))

  assert.equal(response.status, 409)
  const body = await response.json() as Record<string, any>
  assert.equal(body.action_result.standing, "held_source_distribution_hold")
  assert.equal(body.action_result.mutation_count, 1)
  assert.equal(body.action_result.external_publication_effects, 0)
  assert.match(body.action_result.evidence_identity, /^lapzuli_source_action_undrifted_drift_report_005_dev_/)
})

test("dispatch action recognizes an authorized route and stops before Dizzy execution", async () => {
  const handler = (url: string, init: RequestInit) => {
    if (url.includes("undrifted_distribution_report_v1?")) return Response.json(reportRowsClearHold())
    if (url.includes("lapzuli_route?")) return Response.json(authorizedRouteRows())
    if (url.includes("measures_distribution_execution?")) return Response.json([])
    if (url.includes("measures_publication_distribution_asset?")) return Response.json(distributionAssetRows())
    if (url === "https://lapzuli.example/dev/articles") {
      assert.equal(init.method, "POST")
      assert.equal((init.headers as Record<string, string>).authorization, "Bearer lapzuli-test")
      const requestBody = JSON.parse(String(init.body))
      assert.equal(requestBody.dry_run, true)
      assert.equal(requestBody.route_key, wizDevRouteKey)
      assert.equal(requestBody.canonical_url, "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/")
      return Response.json({
        ok: true,
        standing: "dev_adapter_ready_dry_run",
        adapter: "forem_articles_create_v1",
        request_identity: `${wizDevRouteKey}:${wizDevAssetKey}:${wizDevRouteKey}:${wizDevAssetKey}`,
        credential_present: true,
        forem_contract: {
          method: "POST",
          url: "https://dev.to/api/articles",
          auth_header: "api-key",
          accept: "application/vnd.forem.api-v1+json",
          payload_shape: "article",
        },
        article: {
          title: "The Wiz Behind the Curtain",
          canonical_url: "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/",
          published: false,
          tags: "ai, security, governance, devops",
          body_markdown_bytes: 4,
        },
        external_publication_effects: 0,
      })
    }
    return mockHandler(url, init)
  }

  const response = await withMockedFetch(handler, () => onRequestPost({
    request: new Request("https://example.com/api/publish-undrifted-lapzuli-controls", {
      method: "POST",
      body: JSON.stringify({
        action: "dispatch_now",
        publication_object_key: "undrifted_drift_report_005",
        outlet_key: "dev",
      }),
    }),
    env,
  } as never))

  assert.equal(response.status, 409)
  const body = await response.json() as Record<string, any>
  assert.equal(body.lapzuli_distribution.route_standing, "authorized")
  assert.equal(body.lapzuli_distribution.route_key, wizDevRouteKey)
  assert.equal(body.controls.dispatch_now, "ready_for_operator_dev_execution")
  assert.equal(body.controls.dev_adapter.ok, true)
  assert.equal(body.controls.dev_adapter.external_publication_effects, 0)
  assert.equal(body.action_result.standing, "held_dizzy_execution_not_authorized")
  assert.equal(body.action_result.mutation_count, 1)
  assert.equal(body.action_result.external_publication_effects, 0)
  assert.equal(body.action_result.selected_route.route_status, "authorized")
})
