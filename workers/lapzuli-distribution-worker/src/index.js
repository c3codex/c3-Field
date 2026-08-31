const PDS_URL = "https://bsky.social";

const ROLE_CALL = {
  worker: "lapzuli-distribution-worker",
  worker_identity: "dizzy_lapzuli_distribution_worker_v1",
  role_identity: "Dizzy",
  process: "lapzuli_distribution",
  primitive_identity: "env.role_call",
  relation:
    "Lapzuli Distribution -> env.role_call -> Dizzy -> qualified distribution execution -> authorized external encounter -> return evidence -> Persistence / CanCom continuation",
  publication_authority: "none",
  autonomous_distribution_authority: "none",
  autonomous_external_write_authority: "none",
  qualification_required_upstream: true,
  operator_confirmation_required: true,
  historical_lapzuli_proof_preserved: true,
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({
        service: "lapzuli-distribution-worker",
        status: "operative",
        worker_identity: env.DIZZY_WORKER_IDENTITY || ROLE_CALL.worker_identity,
        role_identity: ROLE_CALL.role_identity,
        publishing_enabled: false,
        scheduling_enabled: true,
        queue_enabled: false,
        external_publication_effects: 0,
      });
    }

    if (url.pathname === "/verify-bindings") {
      if (!isAuthorized(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
      return json({
        ok: true,
        standing: "bindings_present",
        worker_identity: env.DIZZY_WORKER_IDENTITY || ROLE_CALL.worker_identity,
        required_bindings: {
          LAPZULI_DISTRIBUTION_CONTROL_TOKEN: Boolean(env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN),
          MEASURES_APP_PASSWORD: Boolean(env.MEASURES_APP_PASSWORD),
          MEASURES_BLUESKY_HANDLE: Boolean(env.MEASURES_BLUESKY_HANDLE),
          UNDRIFTED_APP_PASSWORD: Boolean(env.UNDRIFTED_APP_PASSWORD),
          UNDRIFTED_BLUESKY_HANDLE: Boolean(env.UNDRIFTED_BLUESKY_HANDLE),
        },
        external_publication_effects: 0,
      });
    }

    if (url.pathname === "/role-call/proof") {
      if (!isAuthorized(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
      return json({
        ok: true,
        ...ROLE_CALL,
        worker_identity: env.DIZZY_WORKER_IDENTITY || ROLE_CALL.worker_identity,
        execution_instance: env.DIZZY_EXECUTION_INSTANCE || "unknown",
        manual_execution_path: "/role-call/proof",
        scheduled_execution_path: "undrifted-social-scheduler -> DIZZY service binding -> /role-call/proof",
        duplicate_dispatch_protection:
          "scheduler claims rows with UPDATE ... WHERE id = ? AND status = 'scheduled' and treats changes != 1 as duplicate_or_already_claimed",
        return_evidence:
          "encounter evidence is returned through scheduler D1 scheduled_posts platform_uri/platform_cid/public_url/evidence_at and CanCom OAR1",
        external_publication_effects: 0,
      });
    }

    if (url.pathname === "/verify/bluesky/measures") {
      if (!isAuthorized(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
      return verifyBluesky(env.MEASURES_BLUESKY_HANDLE, env.MEASURES_APP_PASSWORD);
    }

    if (url.pathname === "/verify/bluesky/undrifted") {
      if (!isAuthorized(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
      return verifyBluesky(env.UNDRIFTED_BLUESKY_HANDLE, env.UNDRIFTED_APP_PASSWORD);
    }

    return json({ ok: false, error: "not_found" }, 404);
  },
};

function isAuthorized(request, env) {
  if (!env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN) return false;
  const header = request.headers.get("authorization") || "";
  const value = header.startsWith("Bearer ") ? header.slice(7) : "";
  return timingSafeEqual(value.trim(), cleanSecret(env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN));
}

function timingSafeEqual(a, b) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index++) {
    diff |= left[index] ^ right[index];
  }
  return diff === 0;
}

async function verifyBluesky(identifier, password) {
  if (!identifier || !password) return json({ ok: false, error: "missing_binding" }, 500);
  const response = await fetch(`${PDS_URL}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier: cleanSecret(identifier), password: cleanSecret(password) }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.did) {
    return json({ ok: false, status: response.status, external_publication_effects: 0 }, 502);
  }
  return json({
    ok: true,
    did: data.did,
    handle: data.handle,
    external_publication_effects: 0,
  });
}

function cleanSecret(value) {
  return String(value || "").trim();
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
