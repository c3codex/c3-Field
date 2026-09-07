const BUFFER_API_URL = "https://api.bufferapp.com/1/updates/create.json";

const AUTHORIZED_CHANNELS = {
  facebook_undrifted: {
    platform: "facebook",
    profile_id: "6a54761280cc80cdcaa97c9a",
    credential: "BUFFER_PUB2_KEY",
  },
  facebook_measures_registry: {
    platform: "facebook",
    profile_id: "6a54734280cc80cdcaa9743b",
    credential: "BUFFER_PUB2_KEY",
  },
  linkedin_measures_registry: {
    platform: "linkedin",
    profile_id: "6a23c027c687a22dd467a132",
    credential: "BUFFER_SOCIAL_KEY",
  },
};

export async function handleBufferRequest(request, env, pathname) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "unauthorized", external_publication_effects: 0 }, 401);
  }

  if (pathname === "/buffer/health") {
    return json({
      ok: true,
      adapter: "buffer_updates_create_v1",
      status: "operative",
      supported_channels: Object.keys(AUTHORIZED_CHANNELS),
      buffer_pub2_key_present: Boolean(env.BUFFER_PUB2_KEY),
      buffer_social_key_present: Boolean(env.BUFFER_SOCIAL_KEY),
      dry_run_default: true,
      external_publication_effects: 0,
    });
  }

  if (pathname === "/buffer/verify-bindings") {
    return json({
      ok: true,
      standing: "buffer_bindings_checked",
      required_bindings: {
        LAPZULI_DISTRIBUTION_CONTROL_TOKEN: Boolean(env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN),
        BUFFER_PUB2_KEY: Boolean(env.BUFFER_PUB2_KEY),
        BUFFER_SOCIAL_KEY: Boolean(env.BUFFER_SOCIAL_KEY),
      },
      external_publication_effects: 0,
    });
  }

  if (pathname !== "/buffer/posts") {
    return json({ ok: false, error: "not_found", external_publication_effects: 0 }, 404);
  }

  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed", external_publication_effects: 0 }, 405);
  }

  return prepareOrPublishBufferPost(request, env);
}

async function prepareOrPublishBufferPost(request, env) {
  const body = await request.json().catch(() => ({}));
  const validation = validateBufferRequest(body);
  if (!validation.ok) {
    return json({
      ok: false,
      standing: "held_buffer_request_invalid",
      missing: validation.missing,
      external_publication_effects: 0,
    }, 422);
  }

  const channel = AUTHORIZED_CHANNELS[body.channel_key];
  const credential = readBufferCredential(env, channel.credential);
  const requestIdentity = `${body.registered_standing_key}:${body.distribution_asset_id}:${body.idempotency_key}`;

  if (!credential) {
    return json({
      ok: false,
      standing: "held_buffer_credentials_missing",
      request_identity: requestIdentity,
      credential_reference: channel.credential,
      external_publication_effects: 0,
    }, 409);
  }

  const payload = buildBufferPayload(body, channel.profile_id);
  if (body.dry_run !== false) {
    return json({
      ok: true,
      standing: "buffer_adapter_ready_dry_run",
      adapter: "buffer_updates_create_v1",
      request_identity: requestIdentity,
      distribution_asset_id: body.distribution_asset_id,
      derivative_key: body.derivative_key,
      channel_key: body.channel_key,
      profile_id: channel.profile_id,
      platform: channel.platform,
      registered_standing_key: body.registered_standing_key,
      text_length: Array.from(payload.get("text") || "").length,
      canonical_url: body.canonical_url,
      external_publication_effects: 0,
    });
  }

  if (body.execute !== true) {
    return json({
      ok: false,
      standing: "held_buffer_execute_flag_required",
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 409);
  }

  const apiUrl = clean(env.BUFFER_API_URL) || BUFFER_API_URL;
  payload.set("access_token", clean(credential));

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      accept: "application/json",
      "user-agent": "lapzuli-distribution-worker/1.0",
    },
    body: payload,
  });

  const data = await response.json().catch(() => ({}));
  const update = Array.isArray(data?.updates) ? data.updates[0] : null;
  const success = response.ok && data?.success !== false && Boolean(update?.id || data?.update?.id || data?.id);
  const bufferUpdateId = update?.id || data?.update?.id || data?.id || null;
  const servicePostId = update?.service_update_id || update?.service_update?.id || null;
  const serviceUrl = update?.service_update_url || update?.service_update?.url || null;

  return json({
    ok: success,
    standing: success ? "buffer_post_created" : "held_buffer_external_response",
    request_identity: requestIdentity,
    distribution_asset_id: body.distribution_asset_id,
    derivative_key: body.derivative_key,
    channel_key: body.channel_key,
    registered_standing_key: body.registered_standing_key,
    external_response_code: response.status,
    buffer_update_id: bufferUpdateId,
    buffer_post_status: update?.status || data?.status || null,
    platform_post_id: servicePostId,
    platform_url: serviceUrl,
    external_publication_effects: success ? 1 : 0,
  }, success ? 201 : 502);
}

function validateBufferRequest(body) {
  const missing = [];
  for (const key of [
    "publication_object_key",
    "derivative_key",
    "distribution_asset_id",
    "channel_key",
    "channel_identifier",
    "executor_key",
    "registered_standing_key",
    "registered_standing",
    "idempotency_key",
    "text",
    "canonical_url",
  ]) {
    if (!clean(body?.[key])) missing.push(key);
  }

  const channel = AUTHORIZED_CHANNELS[body?.channel_key];
  if (!channel) missing.push("authorized_channel_key_match");
  if (channel && clean(body?.channel_identifier) !== channel.profile_id) missing.push("authorized_channel_identifier_match");
  if (clean(body?.executor_key) !== "buffer") missing.push("executor_key_buffer");
  if (body?.lapzuli_callable !== true) missing.push("lapzuli_callable_true");
  if (clean(body?.registered_standing) !== "governing_seeded") missing.push("registered_standing_governing_seeded");
  if (body?.operator_confirmed !== true) missing.push("operator_confirmed_true");
  if (!clean(body?.registered_standing_key).endsWith("_registered")) missing.push("registered_standing_key_valid");
  if (!clean(body?.canonical_url).startsWith("https://measuresregistry.com/")) missing.push("canonical_url_measures_registry");

  return { ok: missing.length === 0, missing };
}

function buildBufferPayload(body, profileId) {
  const params = new URLSearchParams();
  params.append("profile_ids[]", profileId);
  params.set("text", clean(body.text));
  params.set("now", "true");
  params.set("shorten", "false");
  return params;
}

function readBufferCredential(env, key) {
  if (key === "BUFFER_PUB2_KEY") return env.BUFFER_PUB2_KEY;
  if (key === "BUFFER_SOCIAL_KEY") return env.BUFFER_SOCIAL_KEY;
  return null;
}

function isAuthorized(request, env) {
  const expected = clean(env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN);
  if (!expected) return false;
  const header = request.headers.get("authorization") || "";
  const actual = header.startsWith("Bearer ") ? clean(header.slice(7)) : "";
  return timingSafeEqual(actual, expected);
}

function timingSafeEqual(a, b) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

function clean(value) {
  return String(value || "").trim();
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
