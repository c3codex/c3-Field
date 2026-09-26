const PDS_URL = "https://bsky.social";

const TARGETS = {
  bluesky_c3field: {
    expectedHandle: "c3field.bsky.social",
    handleBinding: "C3FIELD_BLUESKY_HANDLE",
    authBinding: "C3FIELD_BLUESKY_AUTH",
  },
  bluesky_c3partners: {
    expectedHandle: "c3partners.bsky.social",
    handleBinding: "C3PARTNERS_BLUESKY_HANDLE",
    authBinding: "C3PARTNERS_BLUESKY_AUTH",
  },
};

export async function handleC3BlueskyRequest(request, env, pathname) {
  if (!authorized(request, env)) return reply({ ok: false, standing: "HLD", reason: "worker_control_denied", external_publication_effects: 0 }, 401);

  if (pathname === "/bluesky/c3/health") {
    return reply({
      ok: true,
      standing: "ACT",
      adapter: "atproto_c3_bluesky_v1",
      targets: Object.entries(TARGETS).map(([target_key, target]) => ({
        target_key,
        expected_handle: target.expectedHandle,
        handle_binding_present: Boolean(clean(env?.[target.handleBinding])),
        auth_binding_present: Boolean(clean(env?.[target.authBinding])),
      })),
      external_publication_effects: 0,
    });
  }

  if (pathname === "/bluesky/c3/verify") {
    if (request.method !== "POST") return reply({ ok: false, standing: "DNR", reason: "method_not_allowed", external_publication_effects: 0 }, 405);
    const body = await request.json().catch(() => ({}));
    const target = resolveTarget(body?.target_key, env);
    if (!target.ok) return reply(target.body, target.status);
    return verifyTarget(target.value);
  }

  if (pathname === "/bluesky/c3/posts") {
    if (request.method !== "POST") return reply({ ok: false, standing: "DNR", reason: "method_not_allowed", external_publication_effects: 0 }, 405);
    return publish(request, env);
  }

  return reply({ ok: false, standing: "DNR", reason: "not_found", external_publication_effects: 0 }, 404);
}

async function publish(request, env) {
  const body = await request.json().catch(() => ({}));
  const required = ["target_key","publication_object_key","campaign_asset_key","derivative_key","distribution_asset_id","authority_reference","idempotency_key","text","canonical_url"];
  const missing = required.filter((key) => !clean(body?.[key]));
  if (body?.lapzuli_callable !== true) missing.push("lapzuli_callable_true");
  if (body?.operator_confirmed !== true) missing.push("operator_confirmed_true");

  const target = resolveTarget(body?.target_key, env);
  if (!target.ok) missing.push(target.body.reason || "target_not_resolved");

  let canonical = null;
  try {
    canonical = new URL(clean(body?.canonical_url));
    if (canonical.protocol !== "https:" || !(canonical.hostname === "c3field.online" || canonical.hostname.endsWith(".c3field.online"))) missing.push("canonical_url_c3field");
  } catch {
    missing.push("canonical_url_valid");
  }

  if (missing.length) return reply({ ok: false, standing: "HLD", action_state: "HLD", reason: "c3_bluesky_request_invalid", missing, external_publication_effects: 0 }, 422);

  const binding = target.value;
  const requestIdentity = [body.campaign_asset_key,body.distribution_asset_id,body.target_key,body.idempotency_key].map(clean).join(":");

  if (body.dry_run !== false) {
    return reply({
      ok: true, standing: "ACT", action_state: "READY", adapter: "atproto_c3_bluesky_v1",
      request_identity: requestIdentity, target_key: body.target_key, account_handle: binding.handle,
      publication_object_key: body.publication_object_key, campaign_asset_key: body.campaign_asset_key,
      derivative_key: body.derivative_key, distribution_asset_id: body.distribution_asset_id,
      canonical_url: canonical.toString(), text_length: Array.from(clean(body.text)).length,
      external_publication_effects: 0,
    });
  }

  if (body.execute !== true) return reply({ ok: false, standing: "HLD", action_state: "CONFIRMED", reason: "execute_flag_required", request_identity: requestIdentity, external_publication_effects: 0 }, 409);

  const session = await createSession(binding.handle, binding.auth);
  if (!session.ok) return reply(session.body, session.status);

  const canonicalUrl = canonical.toString();
  const sourceText = clean(body.text);
  const text = sourceText.includes(canonicalUrl) ? sourceText : sourceText + "\n\n" + canonicalUrl;
  if (Array.from(text).length > 300) return reply({ ok: false, standing: "HLD", action_state: "CONFIRMED", reason: "bluesky_text_limit_exceeded", text_length: Array.from(text).length, external_publication_effects: 0 }, 422);

  const encoder = new TextEncoder();
  const start = text.indexOf(canonicalUrl);
  const byteStart = encoder.encode(text.slice(0, start)).length;
  const byteEnd = byteStart + encoder.encode(canonicalUrl).length;
  const record = {
    $type: "app.bsky.feed.post",
    text,
    createdAt: new Date().toISOString(),
    facets: [{ index: { byteStart, byteEnd }, features: [{ $type: "app.bsky.richtext.facet#link", uri: canonicalUrl }] }],
  };

  const response = await fetch(PDS_URL + "/xrpc/com.atproto.repo.createRecord", {
    method: "POST",
    headers: { authorization: "Bearer " + session.value.accessJwt, "content-type": "application/json" },
    body: JSON.stringify({ repo: session.value.did, collection: "app.bsky.feed.post", record }),
  });
  const data = await response.json().catch(() => ({}));
  const success = response.ok && Boolean(data?.uri && data?.cid);
  const rkey = typeof data?.uri === "string" ? data.uri.split("/").pop() : null;

  return reply({
    ok: success, standing: success ? "ACT" : "HLD", action_state: success ? "ACT" : "HLD",
    executor: "c3_bluesky_worker", request_identity: requestIdentity, target_key: body.target_key,
    account_handle: binding.handle, external_response_code: response.status,
    platform_post_id: data?.uri ?? null, platform_cid: data?.cid ?? null,
    platform_url: rkey ? "https://bsky.app/profile/" + encodeURIComponent(binding.handle) + "/post/" + encodeURIComponent(rkey) : null,
    external_publication_effects: success ? 1 : 0,
  }, success ? 201 : 502);
}

function resolveTarget(targetKey, env) {
  const key = clean(targetKey);
  const config = TARGETS[key];
  if (!config) return { ok: false, status: 422, body: { ok: false, standing: "DNR", reason: "c3_bluesky_target_not_registered", external_publication_effects: 0 } };
  const handle = clean(env?.[config.handleBinding]);
  const auth = clean(env?.[config.authBinding]);
  if (!handle || !auth) return { ok: false, status: 409, body: { ok: false, standing: "HLD", reason: "c3_bluesky_binding_missing", target_key: key, external_publication_effects: 0 } };
  if (handle.toLowerCase() !== config.expectedHandle) return { ok: false, status: 409, body: { ok: false, standing: "HLD", reason: "c3_bluesky_identity_mismatch", target_key: key, external_publication_effects: 0 } };
  return { ok: true, value: { key, handle: config.expectedHandle, auth } };
}

async function verifyTarget(binding) {
  const session = await createSession(binding.handle, binding.auth);
  if (!session.ok) return reply(session.body, session.status);
  return reply({ ok: true, standing: "ACT", action_state: "READY", target_key: binding.key, handle: session.value.handle, did: session.value.did, external_publication_effects: 0 });
}

async function createSession(identifier, auth) {
  const response = await fetch(PDS_URL + "/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier, password: auth }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.accessJwt || !data?.did || clean(data?.handle).toLowerCase() !== identifier.toLowerCase()) {
    return { ok: false, status: 502, body: { ok: false, standing: "HLD", reason: "c3_bluesky_session_failed", external_response_code: response.status, external_publication_effects: 0 } };
  }
  return { ok: true, value: data };
}

function authorized(request, env) {
  const expected = clean(env?.LAPZULI_DISTRIBUTION_CONTROL_TOKEN);
  if (!expected) return false;
  const header = request.headers.get("authorization") || "";
  const actual = header.startsWith("Bearer ") ? clean(header.slice(7)) : "";
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i += 1) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function clean(value) { return String(value || "").trim(); }
function reply(value, status = 200) {
  return new Response(JSON.stringify(value, null, 2), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}
