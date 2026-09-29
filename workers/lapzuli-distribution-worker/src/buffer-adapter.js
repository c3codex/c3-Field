const BUFFER_GRAPHQL_URL = "https://api.buffer.com/graphql";

const AUTHORIZED_CHANNELS = {
  facebook_undrifted: {
    platform: "facebook",
    service: "facebook",
    profile_id: "6a54761280cc80cdcaa97c9a",
    credential: "BUFFER_SOCIAL_KEY",
  },
  facebook_measures_registry: {
    platform: "facebook",
    service: "facebook",
    profile_id: "6a54734280cc80cdcaa9743b",
    credential: "BUFFER_SOCIAL_KEY",
  },
  linkedin_measures_registry: {
    platform: "linkedin",
    service: "linkedin",
    profile_id: "6a23c027c687a22dd467a132",
    credential: "BUFFER_SOCIAL_KEY",
  },
  x_measures_c3: {
    platform: "x",
    service: "twitter",
    profile_id: "6a23bff1c687a22dd467a0b3",
    credential: "BUFFER_3_SOCIAL_KEY",
  },
};

const ALLOWED_SHARE_MODES = new Set(["shareNow", "addToQueue", "shareNext"]);

export async function handleBufferRequest(request, env, pathname) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "unauthorized", external_publication_effects: 0 }, 401);
  }

  if (pathname === "/buffer/health") {
    return json({
      ok: true,
      adapter: "buffer_graphql_registered_channels_v2",
      status: "operative",
      supported_channels: Object.keys(AUTHORIZED_CHANNELS),
      buffer_pub2_key_present: Boolean(env.BUFFER_PUB2_KEY),
      c3_community_partners_buffer_key_present: Boolean(
        env.c3_COMMUNITY_PARTNERS_BUFFER_KEY || env.C3_COMMUNITY_PARTNERS_BUFFER_KEY
      ),
      buffer_social_key_present: Boolean(env.BUFFER_SOCIAL_KEY),
      buffer_3_social_key_present: Boolean(env.BUFFER_3_SOCIAL_KEY),
      dry_run_verifies_provider_identity: true,
      external_publication_effects: 0,
    });
  }

  if (pathname === "/buffer/channels") {\n    if (request.method !== "GET") return json({ ok: false, error: "method_not_allowed", external_publication_effects: 0 }, 405);\n    const evidence = {};\n    for (const credentialReference of ["BUFFER_SOCIAL_KEY", "BUFFER_3_SOCIAL_KEY"]) {\n      const credential = readBufferCredential(env, credentialReference);\n      if (!credential) { evidence[credentialReference] = { ok: false, standing: "credential_missing", external_publication_effects: 0 }; continue; }\n      const discovered = await discoverBufferWorkspace(credential);\n      evidence[credentialReference] = discovered.ok ? { ok: true, standing: "provider_inventory_resolved", account_name: discovered.account_name, organizations: discovered.organizations, channels: discovered.channels, external_publication_effects: 0 } : { ok: false, standing: "provider_inventory_failed", error: discovered.error, external_response_code: discovered.status, external_publication_effects: 0 };\n    }\n    return json({ ok: true, standing: "buffer_provider_inventory", credentials: evidence, external_publication_effects: 0 });\n  }\n  if (pathname === "/buffer/verify-bindings") {
    return json({
      ok: true,
      standing: "buffer_bindings_checked",
      required_bindings: {
        LAPZULI_DISTRIBUTION_CONTROL_TOKEN: Boolean(env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN),
        BUFFER_SOCIAL_KEY: Boolean(env.BUFFER_SOCIAL_KEY),
        BUFFER_3_SOCIAL_KEY: Boolean(env.BUFFER_3_SOCIAL_KEY),
        c3_COMMUNITY_PARTNERS_BUFFER_KEY: Boolean(
          env.c3_COMMUNITY_PARTNERS_BUFFER_KEY || env.C3_COMMUNITY_PARTNERS_BUFFER_KEY
        ),
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

  const discovered = await discoverBufferWorkspace(credential);
  if (!discovered.ok) {
    return json({
      ok: false,
      standing: "held_buffer_account_discovery_failed",
      request_identity: requestIdentity,
      credential_reference: channel.credential,
      error: discovered.error,
      external_response_code: discovered.status,
      external_publication_effects: 0,
    }, 502);
  }

  const selected = discovered.channels.find((item) => clean(item.id) === channel.profile_id);
  if (!selected) {
    return json({
      ok: false,
      standing: "held_buffer_registered_channel_not_in_credential_scope",
      request_identity: requestIdentity,
      channel_key: body.channel_key,
      channel_identifier: channel.profile_id,
      credential_reference: channel.credential,
      authenticated_account_name: discovered.account_name || null,
      discovered_channel_ids: discovered.channels.map((item) => item.id),
      discovered_channels: discovered.channels.map((item) => ({
        id: item.id,
        service: item.service,
        name: item.name,
        display_name: item.displayName || null,
        external_link: item.externalLink || null,
        organization_id: item.organization_id,
        organization_name: item.organization_name,
      })),
      external_publication_effects: 0,
    }, 409);
  }

  if (clean(selected.service).toLowerCase() !== channel.service) {
    return json({
      ok: false,
      standing: "held_buffer_channel_service_mismatch",
      request_identity: requestIdentity,
      channel_key: body.channel_key,
      expected_service: channel.service,
      discovered_service: selected.service,
      external_publication_effects: 0,
    }, 409);
  }

  const mode = clean(body.buffer_mode) || "shareNow";

  if (body.dry_run !== false) {
    return json({
      ok: true,
      standing: "buffer_adapter_ready_dry_run",
      adapter: "buffer_graphql_create_post_v2",
      request_identity: requestIdentity,
      distribution_asset_id: body.distribution_asset_id,
      derivative_key: body.derivative_key,
      channel_key: body.channel_key,
      channel_identifier: selected.id,
      channel_name: selected.name,
      platform: channel.platform,
      provider_service: selected.service,
      organization_id: selected.organization_id,
      organization_name: selected.organization_name,
      registered_standing_key: body.registered_standing_key,
      canonical_url: body.canonical_url,
      image_url: clean(body.image_url) || null,
      media_attached: Boolean(clean(body.image_url)),
      buffer_mode: mode,
      text_length: Array.from(clean(body.text)).length,
      provider_authenticated: true,
      exact_registered_channel_resolved: true,
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

  const createInput = {
    text: clean(body.text),
    channelId: selected.id,
    schedulingType: "automatic",
    mode,
    ...(clean(body.image_url) ? { assets: [{ image: { url: clean(body.image_url) } }] } : {}),
    ...platformMetadata(channel.platform),
  };

  const createMutation = [
    "mutation LapzuliCreatePost($input: CreatePostInput!) {",
    "  createPost(input: $input) {",
    "    __typename",
    "    ... on PostActionSuccess {",
    "      post { id status schedulingType dueAt text channelId channelService externalLink createdAt updatedAt assets { id mimeType } }",
    "    }",
    "    ... on InvalidInputError { message }",
    "    ... on LimitReachedError { message }",
    "    ... on RestProxyError { message }",
    "    ... on UnauthorizedError { message }",
    "    ... on UnexpectedError { message }",
    "    ... on NotFoundError { message }",
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
    standing: success ? "buffer_post_accepted" : "held_buffer_external_response",
    request_identity: requestIdentity,
    distribution_asset_id: body.distribution_asset_id,
    derivative_key: body.derivative_key,
    channel_key: body.channel_key,
    channel_identifier: selected.id,
    channel_name: selected.name,
    platform: channel.platform,
    provider_service: selected.service,
    registered_standing_key: body.registered_standing_key,
    external_response_code: created.status,
    buffer_post_id: post?.id || null,
    buffer_post_status: post?.status || null,
    buffer_due_at: post?.dueAt || null,
    platform_post_id: null,
    platform_url: post?.externalLink || null,
    error: typedError || graphErrors[0] || created.error || null,
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
  if (body?.image_url != null && !clean(body.image_url).startsWith("https://")) missing.push("image_url_https");

  const mode = clean(body?.buffer_mode) || "shareNow";
  if (!ALLOWED_SHARE_MODES.has(mode)) missing.push("buffer_mode_supported");

  return { ok: missing.length === 0, missing };
}

function platformMetadata(platform) {
  if (platform === "facebook") return { metadata: { facebook: { type: "post" } } };
  if (platform === "instagram") return { metadata: { instagram: { type: "post", shouldShareToFeed: true } } };
  return {};
}

async function discoverBufferWorkspace(credential) {
  const accountQuery = [
    "query LapzuliBufferAccount {",
    "  account {",
    "    id",
    "    name",
    "    timezone",
    "    organizations { id name channelCount }",
    "  }",
    "}",
  ].join("\n");
  const account = await bufferGraphql(credential, accountQuery);
  if (!account.ok || !account.payload?.data?.account) {
    return {
      ok: false,
      status: account.status,
      error: account.error || "buffer_account_unresolved",
      channels: [],
      organizations: [],
    };
  }

  const organizations = Array.isArray(account.payload.data.account.organizations)
    ? account.payload.data.account.organizations
    : [];
  const channels = [];

  for (const organization of organizations) {
    const organizationId = clean(organization?.id);
    if (!organizationId) continue;
    const channelsQuery = [
      "query LapzuliBufferChannels($input: ChannelsInput!) {",
      "  channels(input: $input) {",
      "    id",
      "    service",
      "    type",
      "    name",
      "    displayName",
      "    externalLink",
      "    isDisconnected",
      "    isLocked",
      "    organizationId",
      "    timezone",
      "    allowedActions",
      "  }",
      "}",
    ].join("\n");
    const response = await bufferGraphql(credential, channelsQuery, { input: { organizationId } });
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: response.error || "buffer_channel_discovery_failed",
        channels: [],
        organizations,
      };
    }
    const found = Array.isArray(response.payload?.data?.channels) ? response.payload.data.channels : [];
    for (const item of found) {
      channels.push({
        ...item,
        organization_id: organizationId,
        organization_name: clean(organization?.name),
      });
    }
  }

  return {
    ok: true,
    status: 200,
    account_name: clean(account.payload.data.account.name),
    organizations,
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
      "user-agent": "lapzuli-distribution-worker/2.0",
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

function readBufferCredential(env, key) {
  if (key === "BUFFER_SOCIAL_KEY") return env.BUFFER_SOCIAL_KEY;
  if (key === "BUFFER_3_SOCIAL_KEY") return env.BUFFER_3_SOCIAL_KEY;
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
