/**
 * SEAT-08 source candidate: READ-ONLY Supabase signed-user/authz probe.
 * Three distinct actual authenticated user IDs are required, NOT merely
 * three different tokens. A separate trusted Registry verifier must verify
 * exact revoked-worker binding evidence before any success standing.
 *
 * This does not issue grants, install RPCs, run workers, or establish M3.
 * Do not expose credentials in logs, source, or return evidence.
 */
import { createCanComCodexReviewClient, CanComReviewHold } from "./lib/cancom-codex-review-client.mjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DENIAL_REASON = "worker_standing_unqualified";

export async function probe({
  env = process.env,
  fetchImpl = globalThis.fetch,
  // Supplied only by an independently authorized Registry evidence verifier;
  // never satisfied by an environment variable or the tested user's claims.
  verifyRevocation = null,
} = {}) {
  const keys = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "CANCOM_WORKER_JWT", "CANCOM_UNBOUND_JWT", "CANCOM_REVOKED_JWT"];
  const missing = keys.filter(k => !env[k] || typeof env[k] !== "string");
  if (missing.length) return { standing: "HLD", reason: "missing_real_auth_inputs", missing, executed: false };

  const { SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: key } = env;
  const roles = [
    ["worker", env.CANCOM_WORKER_JWT, true],
    ["unbound", env.CANCOM_UNBOUND_JWT, false],
    ["revoked", env.CANCOM_REVOKED_JWT, false],
  ];
  if (new Set(roles.map(([, token]) => token)).size !== roles.length) {
    return { standing: "HLD", reason: "distinct_access_tokens_required", executed: false };
  }

  const base = url.endsWith("/") ? url.slice(0, -1) : url;
  const auth = [];
  for (const [caseName, token, expectedAllowed] of roles) {
    let response;
    try {
      response = await fetchImpl(`${base}/auth/v1/user`, {
        headers: { apikey: key, authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      return { standing: "HLD", reason: "auth_endpoint_unavailable", case: caseName, executed: true };
    }
    if (!response.ok) {
      return { standing: "HLD", reason: "platform_auth_user_not_validated", case: caseName, executed: true };
    }
    let user;
    try { user = await response.json(); } catch {
      return { standing: "HLD", reason: "platform_auth_identity_invalid", case: caseName, executed: true };
    }
    if (!user || typeof user !== "object" || Array.isArray(user) || !UUID.test(user.id || "")) {
      return { standing: "HLD", reason: "platform_auth_identity_invalid", case: caseName, executed: true };
    }
    auth.push({ caseName, token, expectedAllowed, principalId: user.id.toLowerCase() });
  }
  if (new Set(auth.map(x => x.principalId)).size !== roles.length) {
    return { standing: "HLD", reason: "distinct_authenticated_principals_required", executed: true };
  }

  // A declared external reference is not sufficient: the verifier must
  // independently check a real Registry event, principal and standing.
  if (typeof verifyRevocation !== "function") {
    return { standing: "HLD", reason: "independent_revocation_evidence_unverified", executed: true };
  }
  let verified;
  try {
    verified = await verifyRevocation({
      principalId: auth[2].principalId,
      expectedStanding: "revoked",
    });
  } catch {
    return { standing: "HLD", reason: "independent_revocation_evidence_unverified", executed: true };
  }
  if (verified?.standing !== "verified" ||
      verified.principalId?.toLowerCase() !== auth[2].principalId ||
      typeof verified.evidenceRef !== "string" || !verified.evidenceRef.trim()) {
    return { standing: "HLD", reason: "independent_revocation_evidence_unverified", executed: true };
  }

  const results = [];
  for (const { caseName, token, expectedAllowed } of auth) {
    const client = createCanComCodexReviewClient({
      supabaseUrl: url, publishableKey: key,
      getAccessToken: async () => token, fetchImpl,
    });
    try {
      await client.discover(1);
      results.push({ case: caseName, standing: expectedAllowed ? "PASS" : "FAIL", outcome: "discoverable" });
    } catch (err) {
      const reason = err instanceof CanComReviewHold ? err.reason : "unexpected_probe_error";
      // Exact, independently scoped authorization denial only; gateway errors,
      // RPC errors, invalid session, unrelated HLD reasons all remain HOLD.
      const bindingDenied = err instanceof CanComReviewHold &&
        err.evidence?.standing === "HLD" &&
        err.evidence.reason === DENIAL_REASON;
      results.push({
        case: caseName,
        standing: !expectedAllowed && bindingDenied ? "PASS" : "HLD",
        outcome: bindingDenied ? "worker_binding_denied" : "unverified",
        reason: String(reason).slice(0, 100),
      });
    }
  }
  return {
    standing: results.length === 3 && results.every(x => x.standing === "PASS") ? "PROBE_PASS" : "HLD",
    scope: "read_only_discovery_probe_not_operational_acceptance",
    results,
    executed: true,
    revocationEvidenceRef: verified.evidenceRef,
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const result = await probe();
  console.log(JSON.stringify(result, null, 2));
  if (result.standing !== "PROBE_PASS") process.exitCode = 1;
}
