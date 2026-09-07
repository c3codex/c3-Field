const PDS_URL = "https://bsky.social";
const MAX_ATTEMPTS = 3;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return json({ ok: true, worker: "undrifted-social-scheduler" });
    }
    if (url.pathname === "/dry-run") {
      const authorized = await isAuthorized(request, env);
      if (!authorized) return json({ ok: false, error: "unauthorized" }, 401);
      const now = url.searchParams.get("now") || new Date().toISOString();
      const dizzy = await proveDizzyRoleCall(env);
      const rows = await dueRows(env, now);
      return json({ ok: true, now, dizzy, dueCount: rows.length, rows: rows.map(redactRow) });
    }
    if (url.pathname === "/dizzy-proof") {
      const authorized = await isAuthorized(request, env);
      if (!authorized) return json({ ok: false, error: "unauthorized" }, 401);
      const now = url.searchParams.get("now") || new Date().toISOString();
      const dizzy = await proveDizzyRoleCall(env);
      const rows = await dueRows(env, now);
      return json({
        ok: true,
        scheduler: "undrifted-social-scheduler",
        scheduler_identity: "dizzy_scheduler_v1",
        execution_instance: env.SCHEDULER_EXECUTION_INSTANCE || null,
        scheduled_relation:
          "scheduled governed state -> undrifted-social-scheduler -> Lapzuli Distribution -> env.role_call -> Dizzy -> external encounter -> return evidence -> Persistence / CanCom continuation",
        dizzy,
        dueCount: rows.length,
        duplicate_dispatch_protection:
          "claimRowForAttempt increments attempt_count only where id is scheduled; changes != 1 returns duplicate_or_already_claimed",
        external_publication_effects: 0,
      });
    }
    return json({ ok: false, error: "not_found" }, 404);
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(dispatchDue(env, controller.scheduledTime ? new Date(controller.scheduledTime).toISOString() : new Date().toISOString()));
  },
};

async function isAuthorized(request, env) {
  const header = request.headers.get("authorization") || "";
  const value = header.startsWith("Bearer ") ? header.slice(7) : "";
  const token = value.trim();
  return [env.PRISM_CONTROL_TOKEN, env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN]
    .filter(Boolean)
    .some((candidate) => timingSafeEqual(token, cleanSecret(candidate)));
}

async function timingSafeEqual(a, b) {
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

async function dueRows(env, nowIso) {
  const result = await env.DB.prepare(
    `SELECT * FROM scheduled_posts
     WHERE status = 'scheduled' AND scheduled_utc <= ?
     ORDER BY scheduled_utc ASC, id ASC
     LIMIT 5`,
  ).bind(nowIso).all();
  return result.results || [];
}

async function dispatchDue(env, nowIso) {
  await proveDizzyRoleCall(env);
  const rows = await dueRows(env, nowIso);
  for (const row of rows) {
    await dispatchOne(env, row);
  }
}

async function dispatchOne(env, row) {
  if (row.platform !== "bluesky") {
    await hold(env, row, "unsupported_platform_for_worker");
    return;
  }
  if (row.attempt_count >= MAX_ATTEMPTS) {
    await hold(env, row, "max_attempts_reached");
    return;
  }

  const claimed = await claimRowForAttempt(env, row);
  if (!claimed) {
    return { ok: false, id: row.id, standing: "duplicate_or_already_claimed" };
  }

  try {
    const session = await sessionFor(env, row.channel_key);
    if (session.did !== row.platform_did) {
      throw new Error(`session_did_mismatch:${session.did}`);
    }
    const blob = await uploadImage(session, row.media_url);
    const record = {
      $type: "app.bsky.feed.post",
      text: row.caption,
      createdAt: new Date().toISOString(),
      facets: facets(row.caption),
      embed: {
        $type: "app.bsky.embed.images",
        images: [{ image: blob, alt: `${row.object_key} campaign image` }],
      },
    };
    const created = await xrpc(session, "com.atproto.repo.createRecord", {
      repo: session.did,
      collection: "app.bsky.feed.post",
      record,
    });
    const rkey = String(created.uri || "").split("/").pop();
    const publicHandle = row.channel_key === "measures_bluesky" ? env.MEASURES_BLUESKY_PUBLIC_HANDLE : env.UNDRIFTED_BLUESKY_HANDLE;
    await env.DB.prepare(
      `UPDATE scheduled_posts
       SET status = 'published',
           platform_uri = ?,
           platform_cid = ?,
           public_url = ?,
           published_at = ?,
           evidence_at = ?,
           last_error = NULL
       WHERE id = ?`,
    ).bind(
      created.uri || null,
      created.cid || null,
      `https://bsky.app/profile/${publicHandle}/post/${rkey}`,
      new Date().toISOString(),
      new Date().toISOString(),
      row.id,
    ).run();
    return { ok: true, id: row.id, standing: "published", public_url: `https://bsky.app/profile/${publicHandle}/post/${rkey}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const nextStatus = row.attempt_count + 1 >= MAX_ATTEMPTS ? "held" : "scheduled";
    await env.DB.prepare(
      `UPDATE scheduled_posts
       SET status = ?,
           last_error = ?,
           held_at = CASE WHEN ? = 'held' THEN ? ELSE held_at END
       WHERE id = ?`,
    ).bind(nextStatus, redactError(message), nextStatus, new Date().toISOString(), row.id).run();
    return { ok: false, id: row.id, standing: nextStatus, error: redactError(message) };
  }
}

async function claimRowForAttempt(env, row) {
  const result = await env.DB.prepare(
    `UPDATE scheduled_posts
     SET status = 'attempting',
         attempt_count = attempt_count + 1,
         attempted_at = ?
     WHERE id = ? AND status = 'scheduled'`,
  ).bind(new Date().toISOString(), row.id).run();
  return result.meta?.changes === 1;
}

async function hold(env, row, reason) {
  await env.DB.prepare(
    `UPDATE scheduled_posts
     SET status = 'held', last_error = ?, held_at = ?
     WHERE id = ?`,
  ).bind(redactError(reason), new Date().toISOString(), row.id).run();
}

async function sessionFor(env, channelKey) {
  if (channelKey === "measures_bluesky") {
    return createSession(env.MEASURES_BLUESKY_AUTH_IDENTIFIER, env.MEASURES_APP_PASSWORD);
  }
  if (channelKey === "undrifted_bluesky") {
    return createSession(env.UNDRIFTED_BLUESKY_HANDLE, env.UNDRIFTED_APP_PASSWORD);
  }
  throw new Error(`unknown_bluesky_channel:${channelKey}`);
}

async function proveDizzyRoleCall(env) {
  if (!env.DIZZY?.fetch) {
    throw new Error("missing_dizzy_service_binding");
  }
  if (!env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN) {
    throw new Error("missing_lapzuli_distribution_control_token");
  }
  const request = new Request("https://lapzuli-distribution-worker/role-call/proof", {
    headers: { authorization: `Bearer ${cleanSecret(env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN)}` },
  });
  const response = await env.DIZZY.fetch(request);
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    throw new Error(`dizzy_role_call_failed:${response.status}`);
  }
  return data;
}

function cleanSecret(value) {
  return String(value || "").trim();
}

async function createSession(identifier, password) {
  return xrpc(null, "com.atproto.server.createSession", { identifier: cleanSecret(identifier), password: cleanSecret(password) });
}

async function uploadImage(session, mediaUrl) {
  const image = await fetch(mediaUrl);
  if (!image.ok) throw new Error(`media_fetch_failed:${image.status}`);
  const contentType = image.headers.get("content-type") || "image/webp";
  const bytes = await image.arrayBuffer();
  const response = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.uploadBlob`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
      "content-type": contentType,
    },
    body: bytes,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.blob) {
    throw new Error(`upload_blob_failed:${response.status}`);
  }
  return data.blob;
}

async function xrpc(session, method, body) {
  const headers = { "content-type": "application/json" };
  if (session?.accessJwt) headers.authorization = `Bearer ${session.accessJwt}`;
  const response = await fetch(`${PDS_URL}/xrpc/${method}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${method}_failed:${response.status}`);
  return data;
}

function facets(text) {
  const encoder = new TextEncoder();
  const out = [];
  for (const match of text.matchAll(/https?:\/\/[^\s]+/g)) {
    const before = text.slice(0, match.index);
    const byteStart = encoder.encode(before).length;
    const byteEnd = byteStart + encoder.encode(match[0]).length;
    out.push({
      index: { byteStart, byteEnd },
      features: [{ $type: "app.bsky.richtext.facet#link", uri: match[0] }],
    });
  }
  return out;
}

function redactError(message) {
  return String(message).replace(/[A-Za-z0-9_-]{24,}/g, "[redacted]");
}

function redactRow(row) {
  return {
    id: row.id,
    object_key: row.object_key,
    channel_key: row.channel_key,
    scheduled_utc: row.scheduled_utc,
    status: row.status,
    attempt_count: row.attempt_count,
    idempotency_key: row.idempotency_key,
  };
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
