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

const DEV_API_URL = "https://dev.to/api/articles";
const DEV_ROUTE = {
  route_key: "lapzuli_route_undrifted_drift_report_005_dev_codex_010",
  publication_object_key: "undrifted_drift_report_005",
  dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
  outlet_key: "dev",
  distribution_mode: "canonical_crosspost",
};

const BLUESKY_ROUTE = {
  route_key: "lapzuli_route_undrifted_drift_report_005_bluesky_thread_001",
  publication_object_key: "undrifted_drift_report_005",
  dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
  outlet_key: "bluesky",
  distribution_mode: "social_source_link_distribution",
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
        publishing_enabled: Boolean(readDevApiKey(env)),
        dev_adapter_enabled: true,
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
          DEV_API_KEY: Boolean(readDevApiKey(env)),
          MEASURES_APP_PASSWORD: Boolean(env.MEASURES_APP_PASSWORD),
          MEASURES_BLUESKY_HANDLE: Boolean(env.MEASURES_BLUESKY_HANDLE),
          UNDRIFTED_APP_PASSWORD: Boolean(env.UNDRIFTED_APP_PASSWORD),
          UNDRIFTED_BLUESKY_HANDLE: Boolean(env.UNDRIFTED_BLUESKY_HANDLE),
        },
        external_publication_effects: 0,
      });
    }

    if (url.pathname === "/dev/articles") {
      if (!isAuthorized(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
      if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
      return prepareOrPublishDevArticle(request, env);
    }

    if (url.pathname === "/bluesky/posts") {
      if (!isAuthorized(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
      if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
      return prepareOrPublishBlueskyPost(request, env);
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

async function prepareOrPublishBlueskyPost(request, env) {
  const body = await request.json().catch(() => ({}));
  const missing = [];
  for (const key of [
    "route_key",
    "publication_object_key",
    "dispatch_key",
    "distribution_asset_id",
    "text",
    "canonical_url",
    "authority_reference",
    "idempotency_key",
  ]) {
    if (!cleanSecret(body?.[key])) missing.push(key);
  }
  if (body?.route_key !== BLUESKY_ROUTE.route_key) missing.push("authorized_route_key_match");
  if (body?.publication_object_key !== BLUESKY_ROUTE.publication_object_key) {
    missing.push("authorized_publication_object_key_match");
  }
  if (body?.dispatch_key !== BLUESKY_ROUTE.dispatch_key) missing.push("authorized_dispatch_key_match");
  if (body?.outlet_key !== BLUESKY_ROUTE.outlet_key) missing.push("authorized_outlet_key_match");
  if (body?.distribution_mode !== BLUESKY_ROUTE.distribution_mode) missing.push("authorized_distribution_mode_match");
  if (!body?.constraints?.canonical_required) missing.push("canonical_required");
  if (!body?.constraints?.source_link_required) missing.push("source_link_required");
  if (!body?.constraints?.operator_confirmation_required) missing.push("operator_confirmation_required");

  if (missing.length) {
    return json({
      ok: false,
      standing: "held_bluesky_request_invalid",
      missing,
      external_publication_effects: 0,
    }, 422);
  }

  const identifier = env.UNDRIFTED_BLUESKY_HANDLE;
  const password = env.UNDRIFTED_APP_PASSWORD;
  if (!identifier || !password) {
    return json({
      ok: false,
      standing: "held_bluesky_credentials_missing",
      external_publication_effects: 0,
    }, 409);
  }

  const canonicalUrl = cleanSecret(body.canonical_url);
  const baseText = cleanSecret(body.text);
  const disclosure = "AI-assisted editorial.";
  const finalText = `${baseText}\n\n${canonicalUrl}\n\n${disclosure}`;
  const requestIdentity = `${body.route_key}:${body.distribution_asset_id}:${body.idempotency_key}`;

  if (body.dry_run !== false) {
    return json({
      ok: true,
      standing: "bluesky_adapter_ready_dry_run",
      adapter: "atproto_create_record_v1",
      request_identity: requestIdentity,
      account_handle: cleanSecret(identifier),
      text_length: Array.from(finalText).length,
      external_publication_effects: 0,
    });
  }

  const sessionResponse = await fetch(`${PDS_URL}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      identifier: cleanSecret(identifier),
      password: cleanSecret(password),
    }),
  });
  const session = await sessionResponse.json().catch(() => ({}));
  if (!sessionResponse.ok || !session?.accessJwt || !session?.did) {
    return json({
      ok: false,
      standing: "held_bluesky_session_failed",
      external_response_code: sessionResponse.status,
      external_publication_effects: 0,
    }, 502);
  }

  const encoder = new TextEncoder();
  const prefix = `${baseText}\n\n`;
  const byteStart = encoder.encode(prefix).length;
  const byteEnd = byteStart + encoder.encode(canonicalUrl).length;

  const record = {
    $type: "app.bsky.feed.post",
    text: finalText,
    createdAt: new Date().toISOString(),
    facets: [{
      index: { byteStart, byteEnd },
      features: [{
        $type: "app.bsky.richtext.facet#link",
        uri: canonicalUrl,
      }],
    }],
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
    ? `https://bsky.app/profile/${encodeURIComponent(cleanSecret(identifier))}/post/${encodeURIComponent(rkey)}`
    : null;

  return json({
    ok: createResponse.ok,
    standing: createResponse.ok ? "bluesky_post_created" : "held_bluesky_external_response",
    request_identity: requestIdentity,
    external_response_code: createResponse.status,
    platform_post_id: data?.uri ?? null,
    platform_cid: data?.cid ?? null,
    platform_url: publicUrl,
    external_publication_effects: createResponse.ok ? 1 : 0,
  }, createResponse.ok ? 201 : 502);
}

async function prepareOrPublishDevArticle(request, env) {
  const body = await request.json().catch(() => ({}));
  const validation = validateDevRequest(body);
  const credentialPresent = Boolean(readDevApiKey(env));
  if (!validation.ok) {
    return json({
      ok: false,
      standing: validation.standing,
      missing: validation.missing,
      route_key: body?.route_key || null,
      external_publication_effects: 0,
    }, 422);
  }

  const payload = buildDevArticlePayload(body);
  const requestIdentity = `${body.route_key}:${body.distribution_asset_id}:${body.idempotency_key}`;
  if (body.dry_run !== false) {
    return json({
      ok: true,
      standing: credentialPresent ? "dev_adapter_ready_dry_run" : "held_dev_credentials_missing",
      adapter: "forem_articles_create_v1",
      request_identity: requestIdentity,
      route_key: body.route_key,
      distribution_asset_id: body.distribution_asset_id,
      credential_present: credentialPresent,
      forem_contract: {
        method: "POST",
        url: DEV_API_URL,
        auth_header: "api-key",
        accept: "application/vnd.forem.api-v1+json",
        payload_shape: "article",
      },
      article: {
        title: payload.article.title,
        canonical_url: payload.article.canonical_url,
        published: payload.article.published,
        tags: payload.article.tags,
        body_markdown_bytes: new TextEncoder().encode(payload.article.body_markdown).length,
      },
      external_publication_effects: 0,
    });
  }

  const apiKey = readDevApiKey(env);
  if (!apiKey) {
    return json({
      ok: false,
      standing: "held_dev_credentials_missing",
      request_identity: requestIdentity,
      external_publication_effects: 0,
    }, 409);
  }

  const response = await fetch(DEV_API_URL, {
    method: "POST",
    headers: {
      "api-key": cleanSecret(apiKey),
      accept: "application/vnd.forem.api-v1+json",
      "content-type": "application/json",
      "user-agent": "lapzuli-distribution-worker/1.0",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  return json({
    ok: response.ok,
    standing: response.ok ? "dev_article_created" : "held_dev_external_response",
    request_identity: requestIdentity,
    external_response_code: response.status,
    platform_post_id: data?.id ? String(data.id) : null,
    platform_url: data?.url ?? null,
    external_publication_effects: response.ok ? 1 : 0,
  }, response.ok ? 201 : 502);
}

function validateDevRequest(body) {
  const missing = [];
  for (const key of [
    "route_key",
    "publication_object_key",
    "dispatch_key",
    "distribution_asset_id",
    "title",
    "canonical_url",
    "body_markdown",
    "authority_reference",
    "idempotency_key",
  ]) {
    if (!cleanSecret(body?.[key])) missing.push(key);
  }
  if (body?.route_key !== DEV_ROUTE.route_key) missing.push("authorized_route_key_match");
  if (body?.publication_object_key !== DEV_ROUTE.publication_object_key) {
    missing.push("authorized_publication_object_key_match");
  }
  if (body?.dispatch_key !== DEV_ROUTE.dispatch_key) missing.push("authorized_dispatch_key_match");
  if (body?.outlet_key !== DEV_ROUTE.outlet_key) missing.push("authorized_outlet_key_match");
  if (body?.distribution_mode !== DEV_ROUTE.distribution_mode) missing.push("authorized_distribution_mode_match");
  if (!body?.constraints?.ai_disclosure_required) missing.push("ai_disclosure_required");
  if (!body?.constraints?.canonical_required) missing.push("canonical_required");
  if (!body?.constraints?.fact_check_required) missing.push("fact_check_required");
  if (!body?.constraints?.not_pure_promotion) missing.push("not_pure_promotion");
  return missing.length
    ? { ok: false, standing: "held_dev_request_invalid", missing }
    : { ok: true, standing: "dev_request_validated", missing: [] };
}

function buildDevArticlePayload(body) {
  const tags = Array.isArray(body.tags)
    ? body.tags.slice(0, 4).map(cleanTag).filter(Boolean).join(", ")
    : cleanSecret(body.tags || "ai, security, governance, devops");
  const disclosure = cleanSecret(body.editorial_disclosure);
  const bodyMarkdown = disclosure && !body.body_markdown.includes(disclosure)
    ? `${body.body_markdown.trim()}\n\n---\n\n${disclosure}`
    : body.body_markdown;
  return {
    article: {
      title: cleanSecret(body.title),
      body_markdown: bodyMarkdown,
      published: body.published === true,
      canonical_url: cleanSecret(body.canonical_url),
      description: cleanSecret(body.description),
      tags,
    },
  };
}

function cleanTag(value) {
  return cleanSecret(value).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
}

function readDevApiKey(env) {
  return env.DEV_API_KEY || env.DEVTO_API_KEY || env.DEV_TO_API_KEY || env.FOREM_API_KEY || env["DEV-API-KEY"];
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
