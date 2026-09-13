const BUFFER_GRAPHQL_URL = "https://api.buffer.com";
const C3_BUFFER_CREDENTIAL = "c3_COMMUNITY_PARTNERS_BUFFER_KEY";

const C3_CHANNEL_ROLES = {
  c3_facebook_page: { service: "facebook", role: "page" },
  c3_facebook_group: { service: "facebook", role: "group" },
  c3_instagram: { service: "instagram", role: "instagram" },
};

const ALLOWED_SHARE_MODES = new Set(["shareNow", "addToQueue", "shareNext"]);

export async function handleC3BufferRequest(request, env, pathname) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "unauthorized", external_publication_effects: 0 }, 401);
  }

  if (pathname === "/buffer/c3/health") {
    return json({
      ok: true,
      adapter: "buffer_graphql_c3_community_partners_v1",
      status: "operative",
      credential_reference: C3_BUFFER_CREDENTIAL,
      credential_present: Boolean(readC3Credential(env)),
      supported_channel_roles: Object.keys(C3_CHANNEL_ROLES),
      canonical_host: "c3field.online",
      dry_run_default: true,
      external_publication_effects: 0,
    });
  }

  if (pathname === "/buffer/c3/channels") {
    if (request.method !== "GET") {
      return json({ ok: false, error: "method_not_allowed", external_publication_effects: 0 }, 405);
    }
    return discoverC3ChannelsResponse(env);
  }

  if (pathname === "/buffer/c3/posts") {
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed", external_publication_effects: 0 }, 405);
    }
    return prepareOrPublishC3Post(request, env);
  }

  return json({ ok: false, error: "not_found", external_publication_effects: 0 }, 404);
}

async function discoverC3ChannelsResponse(env) {
  const discovered = await discoverC3Channels(env);
  if (!discovered.ok) {
    return json({
      ok: false,
      standing: discovered.standing,
      error: discovered.error,
      external_response_code: discovered.external_response_code,
      external_publication_effects: 0,
    }, discovered.status || 502);
  }

  return json({
    ok: true,
    standing: "c3_buffer_channels_discovered",
    credential_reference: C3_BUFFER_CREDENTIAL,
    organizations: discovered.organizations,
    channels: discovered.channels,
    external_publication_effects: 0,
  });
}

async function prepareOrPublishC3Post(request, env) {
  const body = await request.json().catch(() => ({}));
  const validation = validateC3Request(body);
  if (!validation.ok) {
    return json({
      ok: false,
      standing: "held_c3_buffer_request_invalid",
      missing: validation.missing,
      external_publication_effects: 0,
    }, 422);
  }

  const discovered = await discoverC3Channels(env);
  if (!discovered.ok) {
    return json({
      ok: false,
      standing: discovered.standing,
      error: discovered.error,
      external_response_code: discovered.external_response_code,
      external_publication_effects: 0,
    }, discovered.status || 502);
  }

  const role = C3_CHANNEL_ROLES[clean(body.channel_key)];
  const selected = discovered.channels.find((channel) => channel.id === clean(body.channel_identifier));
  if (!selected) {
    return json({
      ok: false,
      standing: "held_c3_buffer_channel_not_in_credential_scope",
      channel_key: body.channel_key,
      channel_identifier: body.channel_identifier,
      discovered_channel_ids: discovered.channels.map((channel) => channel.id),
      external_publication_effects: 0,
    }, 409);
  }

  if (clean(selected.service).toLowerCase() !== role.service) {
    return json({
      ok: false,
      standing: "held_c3_buffer_channel_service_mismatch",
      channel_key: body.channel_key,
      expected_service: role.service,
      discovered_service: selected.service,
      external_publication_effects: 0,
    }, 409);
  }

  const requestIdentity = [
    clean(body.registered_standing_key),
    clean(body.distribution_asset_id),
    clean(body.channel_identifier),
    clean(body.idempotency_key),
  ].join(":");
  const mode = clean(body.buffer_mode) || "shareNow";

  if (body.dry_run !== false) {
    return json({
      ok: true,
      standing: "c3_buffer_adapter_ready_dry_run",
      adapter: "buffer_graphql_create_post_v1",
      request_identity: requestIdentity,
      publication_object_key: body.publication_object_key,
      distribution_asset_id: body.distribution_asset_id,
      derivative_key: body.derivative_key,
      channel_key: body.channel_key,
      channel_role: role.role,
      channel_identifier: selected.id,
      channel_name: selected.name,
      platform: selected.service,
      organization_id: selected.organization_id,
      organization_name: selected.organization_name,
      registered_standing_key: body.registered_standing_key,
      canonical_url: body.canonical_url,
      image_url: body.image_url,
      buffer_mode: mode,
      text_length: Array.from(clean(body.text)).length,
      external_publication_effects: 0,
    });
  }

  if (body.execute !== true) {
    return json({
      ok: false,
      standing: "held_c3_buffer_execute_flag_required",
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 409);
  }

  const credential = readC3Credential(env);
  if (!credential) {
    return json({
      ok: false,
      standing: "held_c3_buffer_credentials_missing",
      credential_reference: C3_BUFFER_CREDENTIAL,
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 409);
  }

  const createInput = {
    text: clean(body.text),
    channelId: selected.id,
    schedulingType: "automatic",
    mode,
    assets: [{ image: { url: clean(body.image_url) } }],
    metadata: selected.service === "facebook"
      ? { facebook: { type: "post" } }
      : { instagram: { type: "post", shouldShareToFeed: true } },
  };

  const createMutation = [
    "mutation LapzuliCreatePost($input: CreatePostInput!) {",
    "  createPost(input: $input) {",
    "    ... on PostActionSuccess {",
    "      post { id text dueAt assets { id mimeType } }",
    "    }",
    "    ... on MutationError { message }",
    "  }",
    "}",
  ].join("\n");

  const created = await bufferGraphql(credential, createMutation, { input: createInput });
  const action = created.payload?.data?.createPost || null;
  const post = action?.post || null;
  const typedError = action?.message || null;
  const graphErrors = Array.isArray(created.payload?.errors)
    ? created.payload.errors.map((item) => item?.message).filter(Boolean)
    : [];
  const success = created.ok && Boolean(post?.id) && !typedError && graphErrors.length === 0;

  return json({
    ok: success,
    standing: success ? "c3_buffer_post_accepted" : "held_c3_buffer_external_response",
    request_identity: requestIdentity,
    publication_object_key: body.publication_object_key,
    distribution_asset_id: body.distribution_asset_id,
    derivative_key: body.derivative_key,
    channel_key: body.channel_key,
    channel_role: role.role,
    channel_identifier: selected.id,
    channel_name: selected.name,
    platform: selected.service,
    registered_standing_key: body.registered_standing_key,
    external_response_code: created.status,
    buffer_post_id: post?.id || null,
    buffer_due_at: post?.dueAt || null,
    buffer_asset_ids: Array.isArray(post?.assets) ? post.assets.map((asset) => asset?.id).filter(Boolean) : [],
    error: typedError || graphErrors[0] || created.error || null,
    external_publication_effects: success ? 1 : 0,
  }, success ? 201 : 502);
}

function validateC3Request(body) {
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
    "image_url",
  ]) {
    if (!clean(body?.[key])) missing.push(key);
  }

  const channelKey = clean(body?.channel_key);
  if (!C3_CHANNEL_ROLES[channelKey]) missing.push("authorized_c3_channel_key_match");
  if (clean(body?.executor_key) !== "buffer") missing.push("executor_key_buffer");
  if (body?.lapzuli_callable !== true) missing.push("lapzuli_callable_true");
  if (body?.operator_confirmed !== true) missing.push("operator_confirmed_true");
  if (clean(body?.registered_standing).toLowerCase() !== "registered") missing.push("registered_standing_registered");
  if (!clean(body?.registered_standing_key).endsWith("_registered")) missing.push("registered_standing_key_valid");
  if (!clean(body?.canonical_url).startsWith("https://c3field.online/")) missing.push("canonical_url_c3field");
  if (!clean(body?.image_url).startsWith("https://")) missing.push("image_url_https");

  const mode = clean(body?.buffer_mode) || "shareNow";
  if (!ALLOWED_SHARE_MODES.has(mode)) missing.push("buffer_mode_supported");

  return { ok: missing.length === 0, missing };
}

async function discoverC3Channels(env) {
  const credential = readC3Credential(env);
  if (!credential) {
    return {
      ok: false,
      status: 409,
      standing: "held_c3_buffer_credentials_missing",
      error: "missing_c3_community_partners_buffer_key",
      external_response_code: null,
    };
  }

  const accountQuery = [
    "query LapzuliBufferAccount {",
    "  account {",
    "    organizations { id name }",
    "  }",
    "}",
  ].join("\n");
  const account = await bufferGraphql(credential, accountQuery);
  if (!account.ok) {
    return {
      ok: false,
      status: 502,
      standing: "held_c3_buffer_account_discovery_failed",
      error: account.error,
      external_response_code: account.status,
    };
  }

  const organizations = Array.isArray(account.payload?.data?.account?.organizations)
    ? account.payload.data.account.organizations
    : [];
  const channels = [];

  for (const organization of organizations) {
    const organizationId = clean(organization?.id);
    if (!organizationId) continue;
    const channelsQuery = [
      "query LapzuliBufferChannels {",
      "  channels(input: { organizationId: " + JSON.stringify(organizationId) + " }) {",
      "    id",
      "    name",
      "    service",
      "  }",
      "}",
    ].join("\n");
    const response = await bufferGraphql(credential, channelsQuery);
    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        standing: "held_c3_buffer_channel_discovery_failed",
        error: response.error,
        external_response_code: response.status,
      };
    }
    const found = Array.isArray(response.payload?.data?.channels) ? response.payload.data.channels : [];
    for (const channel of found) {
      const service = clean(channel?.service).toLowerCase();
      if (service !== "facebook" && service !== "instagram") continue;
      channels.push({
        id: clean(channel?.id),
        name: clean(channel?.name),
        service,
        organization_id: organizationId,
        organization_name: clean(organization?.name),
      });
    }
  }

  return {
    ok: true,
    organizations: organizations.map((organization) => ({
      id: clean(organization?.id),
      name: clean(organization?.name),
    })),
    channels,
  };
}

async function bufferGraphql(credential, query, variables = undefined) {
  const response = await fetch(BUFFER_GRAPHQL_URL, {
    method: "POST",
    headers: {
      authorization: "Bearer " + clean(credential),
      "content-type": "application/json",
      accept: "application/json",
      "user-agent": "lapzuli-distribution-worker/1.0",
    },
    body: JSON.stringify(variables ? { query, variables } : { query }),
  });
  const payload = await response.json().catch(() => ({}));
  const graphErrors = Array.isArray(payload?.errors) ? payload.errors : [];
  return {
    ok: response.ok && graphErrors.length === 0,
    status: response.status,
    payload,
    error: graphErrors[0]?.message || (!response.ok ? "buffer_http_error" : null),
  };
}

function readC3Credential(env) {
  return clean(env?.[C3_BUFFER_CREDENTIAL]);
}

function isAuthorized(request, env) {
  const expected = clean(env?.LAPZULI_DISTRIBUTION_CONTROL_TOKEN);
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
  for (let index = 0; index < left.length; index += 1) diff |= left[index] ^ right[index];
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
