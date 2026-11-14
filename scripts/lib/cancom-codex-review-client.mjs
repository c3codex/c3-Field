/**
 * Bounded CanCom Codex review-transport client, source-only.
 *
 * This is NOT a scheduler or a Codex worker. It does NOT execute an OAR2,
 * install SQL, issue grants, or authenticate a worker by itself.
 * A genuine Supabase-issued user JWT and an independently registered
 * c3Ops worker binding must exist before the server accepts any action.
 *
 * Corresponding REVIEW CANDIDATE: governance PR #23, public
 * cancom_codex_review_{discover,pickup,ack,return}_v1 RPCs.
 * Do not send a service-role token to this client.
 */
export class CanComReviewHold extends Error {
  constructor(reason, evidence) {
    super(reason);
    this.name = "CanComReviewHold";
    this.reason = reason;
    this.evidence = evidence;
  }
}

function requiredText(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new CanComReviewHold(`missing_${name}`);
  }
  return value;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA256 = /^[0-9a-f]{64}$/;
const RPC = Object.freeze({
  discover: "cancom_codex_review_discover_v1",
  pickup: "cancom_codex_review_pickup_v1",
  ack: "cancom_codex_review_ack_v1",
  returned: "cancom_codex_review_return_v1",
});

export function createCanComCodexReviewClient({
  supabaseUrl, publishableKey, getAccessToken,
  fetchImpl = globalThis.fetch,
}) {
  const base = requiredText(supabaseUrl, "supabase_url").replace(/\/$/, "");
  const key = requiredText(publishableKey, "publishable_key");
  if (typeof getAccessToken !== "function" || typeof fetchImpl !== "function") {
    throw new CanComReviewHold("authenticated_transport_required");
  }

  async function call(name, args) {
    if (!Object.values(RPC).includes(name)) {
      throw new CanComReviewHold("unrecognized_review_operation");
    }
    // The caller supplies a fresh, platform-issued USER session token. No
    // synthetic claim headers or service_role fallback are supported.
    const token = requiredText(await getAccessToken(), "signed_user_access_token");
    if (token === key) {
      throw new CanComReviewHold("service_role_or_anon_key_cannot_be_worker_identity");
    }
    let response;
    try {
      response = await fetchImpl(`${base}/rest/v1/rpc/${name}`, {
        method: "POST",
        headers: {
          apikey: key,
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new CanComReviewHold("review_transport_unavailable");
    }
    if (!response.ok) {
      throw new CanComReviewHold("review_gateway_rejected", { status: response.status });
    }
    let result;
    try { result = await response.json(); } catch {
      throw new CanComReviewHold("review_rpc_invalid_json");
    }
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      throw new CanComReviewHold("review_rpc_invalid_response");
    }
    return result;
  }

  return Object.freeze({
    async discover(limit = 20) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new CanComReviewHold("invalid_discovery_limit");
      }
      const result = await call(RPC.discover, { p_limit: limit });
      if (result.standing !== "discoverable" || result.effect_authority !== "none" ||
          !Array.isArray(result.items)) {
        throw new CanComReviewHold(String(result.reason ?? "discovery_held"), result);
      }
      return result.items;
    },

    async pickup(executionInstance) {
      const instance = requiredText(executionInstance, "execution_instance");
      const result = await call(RPC.pickup, {
        p_key_type: "execution_instance", p_key: instance, p_executor: "codex",
      });
      if (result.standing !== "resolved_and_claimed_for_review" ||
          result.work_class !== "executor_security_review_continuation" ||
          result.allowed_effect !== "none" ||
          result.operator_final_disposition_reserved !== true ||
          result.execution_instance !== instance ||
          !UUID.test(result.lease_token || "") ||
          !SHA256.test(result.original_oar1_sha256 || "") ||
          !requiredText(result.outbox_event_key, "outbox_event_key").endsWith(
            ":codex_security_review:outbox:v1")) {
        throw new CanComReviewHold(String(result.reason ?? "review_pickup_boundary"), result);
      }
      return result;
    },

    async acknowledge(outboxEventKey, leaseToken) {
      if (!UUID.test(requiredText(leaseToken, "lease_token"))) {
        throw new CanComReviewHold("invalid_lease_token");
      }
      const result = await call(RPC.ack, {
        p_event_key: requiredText(outboxEventKey, "outbox_event_key"),
        p_lease_token: leaseToken,
      });
      if (result.standing !== "acknowledged") {
        throw new CanComReviewHold(String(result.reason ?? "acknowledgement_held"), result);
      }
      return result;
    },

    async returnReview({ outboxEventKey, leaseToken, standing, evidenceRef, findingsSha256 }) {
      if (!UUID.test(requiredText(leaseToken, "lease_token")) ||
          !SHA256.test(requiredText(findingsSha256, "findings_sha256")) ||
          !["HLD", "review_complete"].includes(standing)) {
        throw new CanComReviewHold("invalid_review_return");
      }
      const result = await call(RPC.returned, {
        p_event_key: requiredText(outboxEventKey, "outbox_event_key"),
        p_lease_token: leaseToken,
        p_standing: standing,
        p_evidence_ref: requiredText(evidenceRef, "evidence_ref"),
        p_findings_sha256: findingsSha256,
      });
      if (result.standing !== "review_returned" ||
          result.authority_effect !== "none" ||
          result.operator_disposition !== "pending_independent_review") {
        throw new CanComReviewHold(String(result.reason ?? "review_return_held"), result);
      }
      return result;
    },
  });
}
