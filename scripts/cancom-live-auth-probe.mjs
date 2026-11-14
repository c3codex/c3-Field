/**
 * SEAT-08 bounded LIVE authentication probe. READ-ONLY.
 *
 * No SQL installation, worker pickup/ACK, lease, grant, review return,
 * deployment, signup, or operator disposition is performed.
 * Requires three distinct platform-issued user access tokens:
 *   CANCOM_WORKER_JWT   actively enrolled Codex reviewer (expected discoverable)
 *   CANCOM_UNBOUND_JWT  signed-in user with no worker standing (expected denied)
 *   CANCOM_REVOKED_JWT  previously enrolled worker, subsequently revoked
 * Obtain tokens through authorized sign-in and registrar processes only.
 * DO NOT use service_role, fabricate JWTs, or put tokens in source or logs.
 *
 * The revoked case does not itself revoke any grant/session; the tester
 * must independently establish and document the revocation before running.
 * Discovery is non-mutating and cannot establish worker operational acceptance.
 */
import { createCanComCodexReviewClient, CanComReviewHold } from "./lib/cancom-codex-review-client.mjs";

export async function probe({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const keys = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "CANCOM_WORKER_JWT", "CANCOM_UNBOUND_JWT", "CANCOM_REVOKED_JWT"];
  const missing = keys.filter(k => !env[k] || typeof env[k] !== "string");
  if (missing.length) return { standing: "HLD", reason: "missing_real_auth_inputs", missing, executed: false };

  const { SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: key } = env;
  const tokens = [
    ["worker", env.CANCOM_WORKER_JWT, true],
    ["unbound", env.CANCOM_UNBOUND_JWT, false],
    ["revoked", env.CANCOM_REVOKED_JWT, false],
  ];
  // Prevent success when one privileged token is reused as a negative case.
  if (new Set(tokens.map(([,token]) => token)).size !== 3) {
    return { standing: "HLD", reason: "distinct_signed_principals_required", executed: false };
  }
  const results = [];
  for (const [caseName, token, expectedAllowed] of tokens) {
    // A successful user endpoint call is a useful signed-session signal,
    // but NOT independent proof of active session or grant revocation.
    let userValid = false;
    try {
      const user = await fetchImpl(`${url.replace(/\\/$/, "")}/auth/v1/user`, {
        headers: { apikey: key, authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(15_000),
      });
      userValid = user.ok;
    } catch {
      results.push({ case: caseName, standing: "HLD", reason: "auth_endpoint_unavailable" });
      continue;
    }
    if (!userValid) {
      results.push({ case: caseName, standing: "HLD", reason: "platform_auth_user_not_validated" });
      continue;
    }
    const client = createCanComCodexReviewClient({
      supabaseUrl: url, publishableKey: key,
      getAccessToken: async () => token, fetchImpl,
    });
    try {
      await client.discover(1);
      results.push({ case: caseName, standing: expectedAllowed ? "PASS" : "FAIL", outcome: "discoverable" });
    } catch (err) {
      const reason = err instanceof CanComReviewHold ? err.reason : "unexpected_probe_error";
      // A 404, 401, gateway error, parse issue, or missing RPC is NEVER
      // interpreted as authorization denial. Only a completed RPC that
      // explicitly returns an HLD standing can establish a negative test.
      const confirmedDenied = err instanceof CanComReviewHold &&
        err.evidence?.standing === "HLD";
      results.push({ case: caseName,
        standing: !expectedAllowed && confirmedDenied ? "PASS" : "HLD",
        outcome: confirmedDenied ? "rpc_denied" : "unverified",
        reason: String(reason).slice(0,100),
      });
    }
  }
  return {
    standing: results.length === 3 && results.every(r => r.standing === "PASS") ? "PROBE_PASS" : "HLD",
    scope: "read_only_discovery_authentication_probe_not_operational_acceptance",
    results, executed: true,
  };
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const result = await probe();
  console.log(JSON.stringify(result, null, 2));
  if (result.standing !== "PROBE_PASS") process.exitCode = 1;
}
