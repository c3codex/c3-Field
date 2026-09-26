const PDS_URL = "https://bsky.social";

const C3_ACCOUNTS = {
  mdm: {
    handle_env: "C3FIELD_BLUESKY_HANDLE",
    password_env: "C3FIELD_APP_PASSWORD",
    default_handle: "c3field.bsky.social",
    canonical_host: "mdm.c3field.online",
    publication_object_key: "mdm_soft_launch_week1_v1",
  },
  "47pct": {
    handle_env: "C3PARTNERS_BLUESKY_HANDLE",
    password_env: "C3PARTNERS_APP_PASSWORD",
    default_handle: "c3partners.bsky.social",
    canonical_host: "47pct.c3field.online",
    publication_object_key: "47pct_soft_launch_week1_v1",
  },
};

const MEDIA_HOSTS = new Set([
  "c3field.online",
  "mdm.c3field.online",
  "47pct.c3field.online",
]);

export async function handleC3BlueskyRequest(request, env, pathname) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "unauthorized", external_publication_effects: 0 }, 401);
  }

  if (pathname === "/bluesky/c3/health") {
    return json({
      ok: true,
      adapter: "bluesky_c3_accounts_v1",
      status: "operative_source",
      accounts: Object.fromEntries(
        Object.entries(C3_ACCOUNTS).map(([key, config]) => [
          key,
          {
            handle: clean(env?.[config.handle_env]) || config.default_handle,
            credential_present: Boolean(clean(env?.[config.password_env])),
            canonical_host: config.canonical_host,
          },
        ]),
      ),
      dry_run_default: true,
      image_required: true,
      external_publication_effects: 0,
    });
  }

  if (pathname === "/bluesky/c3/posts") {
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed", external_publication_effects: 0 }, 405);
    }
    return prepareOrPublishC3BlueskyPost(request, env);
  }

  return json({ ok: false, error: "not_found", external_publication_effects: 0 }, 404);
}

async function prepareOrPublishC3BlueskyPost(request, env) {
  const body = await request.json().catch(() => ({}));
  const accountKey = clean(body.account_key);
  const config = C3_ACCOUNTS[accountKey];
  const missing = [];

  for (const key of [
    "account_key",
    "route_key",
    "publication_object_key",
    "distribution_asset_id",
    "derivative_key",
    "text",
    "canonical_url",
    "image_url",
    "image_alt",
    "authority_reference",
    "idempotency_key",
  ]) {
    if (!clean(body?.[key])) missing.push(key);
  }

  if (!config) missing.push("authorized_c3_account_key");
  if (config && clean(body.publication_object_key) !== config.publication_object_key) {
    missing.push("authorized_publication_object_key_match");
  }
  if (config && !matchesCanonical(body.canonical_url, config.canonical_host)) {
    missing.push("canonical_url_account_match");
  }
  if (!matchesMediaUrl(body.image_url)) missing.push("image_url_c3_media_host");
  if (clean(body.executor_key) !== "bluesky_api") missing.push("executor_key_bluesky_api");
  if (body.lapzuli_callable !== true) missing.push("lapzuli_callable_true");
  if (body.operator_confirmed !== true) missing.push("operator_confirmed_true");

  if (missing.length) {
    return json({
      ok: false,
      standing: "held_c3_bluesky_request_invalid",
      missing,
      external_publication_effects: 0,
    }, 422);
  }

  const identifier = clean(env?.[config.handle_env]) || config.default_handle;
  const password = clean(env?.[config.password_env]);
  const requestIdentity = [
    clean(body.route_key),
    clean(body.distribution_asset_id),
    accountKey,
    clean(body.idempotency_key),
  ].join(":");

  if (body.dry_run !== false) {
    return json({
      ok: true,
      standing: password ? "c3_bluesky_adapter_ready_dry_run" : "held_c3_bluesky_credentials_missing",
      adapter: "atproto_c3_image_post_v1",
      request_identity: requestIdentity,
      account_key: accountKey,
      account_handle: identifier,
      publication_object_key: body.publication_object_key,
      canonical_url: body.canonical_url,
      image_url: body.image_url,
      credential_present: Boolean(password),
      external_publication_effects: 0,
    }, password ? 200 : 409);
  }

  if (body.execute !== true) {
    return json({
      ok: false,
      standing: "held_c3_bluesky_execute_flag_required",
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 409);
  }

  if (!password) {
    return json({
      ok: false,
      standing: "held_c3_bluesky_credentials_missing",
      account_key: accountKey,
      account_handle: identifier,
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 409);
  }

  const sessionResponse = await fetch(`${PDS_URL}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  const session = await sessionResponse.json().catch(() => ({}));
  if (!sessionResponse.ok || !session?.accessJwt || !session?.did) {
    return json({
      ok: false,
      standing: "held_c3_bluesky_session_failed",
      account_key: accountKey,
      external_response_code: sessionResponse.status,
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 502);
  }

  const imageResponse = await fetch(clean(body.image_url));
  const imageType = clean(imageResponse.headers.get("content-type")).split(";")[0].toLowerCase();
  if (!imageResponse.ok || !imageType.startsWith("image/")) {
    return json({
      ok: false,
      standing: "held_c3_bluesky_image_fetch_failed",
      account_key: accountKey,
      external_response_code: imageResponse.status,
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 502);
  }
  const imageBytes = await imageResponse.arrayBuffer();

  const uploadResponse = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.uploadBlob`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
      "content-type": imageType,
    },
    body: imageBytes,
  });
  const upload = await uploadResponse.json().catch(() => ({}));
  if (!uploadResponse.ok || !upload?.blob) {
    return json({
      ok: false,
      standing: "held_c3_bluesky_blob_upload_failed",
      account_key: accountKey,
      external_response_code: uploadResponse.status,
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 502);
  }

  const canonicalUrl = clean(body.canonical_url);
  const suppliedText = clean(body.text);
  const finalText = suppliedText.includes(canonicalUrl)
    ? suppliedText
    : `${suppliedText}\n\n${canonicalUrl}`;

  const facets = linkFacet(finalText, canonicalUrl);
  const record = {
    $type: "app.bsky.feed.post",
    text: finalText,
    createdAt: new Date().toISOString(),
    facets: facets ? [facets] : [],
    embed: {
      $type: "app.bsky.embed.images",
      images: [{
        alt: clean(body.image_alt),
        image: upload.blob,
      }],
    },
  };

  const createResponse = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.createRecord`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.feed.post",
      record,
    }),
  });
  const data = await createResponse.json().catch(() => ({}));
  const rkey = typeof data?.uri === "string" ? data.uri.split("/").pop() : null;
  const publicUrl = rkey
    ? `https://bsky.app/profile/${encodeURIComponent(identifier)}/post/${encodeURIComponent(rkey)}`
    : null;

  return json({
    ok: createResponse.ok,
    standing: createResponse.ok ? "c3_bluesky_post_created" : "held_c3_bluesky_external_response",
    request_identity: requestIdentity,
    account_key: accountKey,
    account_handle: identifier,
    external_response_code: createResponse.status,
    platform_post_id: data?.uri ?? null,
    platform_cid: data?.cid ?? null,
    platform_url: publicUrl,
    external_publication_effects: createResponse.ok ? 1 : 0,
  }, createResponse.ok ? 201 : 502);
}

function matchesCanonical(value, expectedHost) {
  try {
    const url = new URL(clean(value));
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      url.hostname.toLowerCase() === expectedHost
    );
  } catch {
    return false;
  }
}

function matchesMediaUrl(value) {
  try {
    const url = new URL(clean(value));
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      MEDIA_HOSTS.has(url.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}

function linkFacet(text, canonicalUrl) {
  const charStart = text.indexOf(canonicalUrl);
  if (charStart < 0) return null;
  const encoder = new TextEncoder();
  const byteStart = encoder.encode(text.slice(0, charStart)).length;
  const byteEnd = byteStart + encoder.encode(canonicalUrl).length;
  return {
    index: { byteStart, byteEnd },
    features: [{
      $type: "app.bsky.richtext.facet#link",
      uri: canonicalUrl,
    }],
  };
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
