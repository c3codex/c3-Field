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
