import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.js";

const env = {
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN: "control",
  MEASURES_APP_PASSWORD: "present",
  MEASURES_BLUESKY_HANDLE: "measures-registry.bsky.social",
  UNDRIFTED_APP_PASSWORD: "present",
  UNDRIFTED_BLUESKY_HANDLE: "undrifted.bsky.social",
  DIZZY_WORKER_IDENTITY: "dizzy_lapzuli_distribution_worker_v1",
  DIZZY_EXECUTION_INSTANCE: "complete_dizzy_worker_scheduler_integration_codex_002",
  DEV_API_KEY: "present",
};

test("role-call proof is protected and returns bounded Dizzy standing", async () => {
  const unauthorized = await worker.fetch(new Request("https://worker.example/role-call/proof"), env);
  assert.equal(unauthorized.status, 401);

  const response = await worker.fetch(
    new Request("https://worker.example/role-call/proof", {
      headers: { authorization: "Bearer control" },
    }),
    env,
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.role_identity, "Dizzy");
  assert.equal(body.publication_authority, "none");
  assert.equal(body.autonomous_distribution_authority, "none");
  assert.equal(body.external_publication_effects, 0);
});

test("DEV article adapter validates authorized Wiz route without publishing during dry run", async () => {
  const request = new Request("https://worker.example/dev/articles", {
    method: "POST",
    headers: { authorization: "Bearer control" },
    body: JSON.stringify({
      dry_run: true,
      route_key: "lapzuli_route_undrifted_drift_report_005_dev_codex_010",
      publication_object_key: "undrifted_drift_report_005",
      dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
      distribution_asset_id: "undrifted_drift_report_005_dev_canonical_crosspost_v1",
      outlet_key: "dev",
      distribution_mode: "canonical_crosspost",
      title: "The Wiz Behind the Curtain",
      canonical_url: "https://measuresregistry.com/undrifted/the-wiz-behind-the-curtain/",
      body_markdown: "Body",
      authority_reference: "CanCom/codex/oar2_implement_dev_delivery_adapter_wiz_distribution_asset_codex_012",
      idempotency_key: "lapzuli_route_undrifted_drift_report_005_dev_codex_010:implementation_ready",
      constraints: {
        ai_disclosure_required: true,
        canonical_required: true,
        fact_check_required: true,
        not_pure_promotion: true,
      },
    }),
  });

  const response = await worker.fetch(request, env);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.standing, "dev_adapter_ready_dry_run");
  assert.equal(body.adapter, "forem_articles_create_v1");
  assert.equal(body.forem_contract.method, "POST");
  assert.equal(body.article.published, false);
  assert.equal(body.external_publication_effects, 0);
});
