import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.js";

function env(overrides = {}) {
  return {
    PRISM_CONTROL_TOKEN: "control",
    LAPZULI_DISTRIBUTION_CONTROL_TOKEN: "lapzuli",
    SCHEDULER_EXECUTION_INSTANCE: "complete_dizzy_worker_scheduler_integration_codex_002",
    DB: {
      prepare(sql) {
        return {
          bind() {
            return {
              async all() {
                assert.match(sql, /status = 'scheduled'/);
                return { results: [] };
              },
              async run() {
                return { meta: { changes: 1 } };
              },
            };
          },
        };
      },
    },
    DIZZY: {
      async fetch(request) {
        assert.equal(request.headers.get("authorization"), "Bearer lapzuli");
        return Response.json({
          ok: true,
          worker_identity: "dizzy_lapzuli_distribution_worker_v1",
          relation: "Lapzuli Distribution -> env.role_call -> Dizzy",
        });
      },
    },
    ...overrides,
  };
}

test("scheduler proof calls Dizzy over the service binding", async () => {
  const response = await worker.fetch(
    new Request("https://scheduler.example/dizzy-proof", {
      headers: { authorization: "Bearer control" },
    }),
    env(),
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.dizzy.worker_identity, "dizzy_lapzuli_distribution_worker_v1");
  assert.equal(body.dueCount, 0);
});
