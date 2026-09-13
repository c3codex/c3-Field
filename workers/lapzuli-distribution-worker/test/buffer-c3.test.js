import assert from "node:assert/strict";
import test from "node:test";

import { handleC3BufferRequest } from "../src/buffer-c3-adapter.js";

const env = {
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN: "control",
  c3_COMMUNITY_PARTNERS_BUFFER_KEY: "c3-buffer-key",
};

function authHeaders() {
  return { authorization: "Bearer control" };
}

function installBufferMock({ includeTarget = true, createSuccess = true } = {}) {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => {
    const payload = JSON.parse(options.body || "{}");
    calls.push({ url, options, payload });
    assert.equal(url, "https://api.buffer.com");
    assert.equal(options.headers.authorization, "Bearer c3-buffer-key");

    if (payload.query.includes("LapzuliBufferAccount")) {
      return Response.json({ data: { account: { organizations: [{ id: "org-c3", name: "c3 Community Partners" }] } } });
    }
    if (payload.query.includes("LapzuliBufferChannels")) {
      const channels = [
        { id: "fb-page", name: "c3 Community Partners", service: "facebook" },
        { id: "fb-group", name: "c3 Field Connect Contribute Create", service: "facebook" },
        { id: "ig-c3", name: "c3 Community Partners Instagram", service: "instagram" },
      ];
      return Response.json({ data: { channels: includeTarget ? channels : channels.filter((item) => item.id !== "ig-c3") } });
    }
    if (payload.query.includes("LapzuliCreatePost")) {
      if (!createSuccess) return Response.json({ data: { createPost: { message: "nope" } } });
      return Response.json({
        data: {
          createPost: {
            post: {
              id: "buffer-post-1",
              text: payload.variables.input.text,
              dueAt: null,
              assets: [{ id: "asset-1", mimeType: "image/webp" }],
            },
          },
        },
      });
    }
    throw new Error("unexpected Buffer query");
  };
  return { calls, restore: () => { globalThis.fetch = originalFetch; } };
}

function baseBody(overrides = {}) {
  return {
    dry_run: true,
    publication_object_key: "community_potential",
    derivative_key: "community_potential_social_webp",
    distribution_asset_id: "community_potential_facebook_page_release_v1",
    channel_key: "c3_facebook_page",
    channel_identifier: "fb-page",
    executor_key: "buffer",
    registered_standing_key: "community_potential_registered",
    registered_standing: "REGISTERED",
    idempotency_key: "community_potential:facebook_page:release01",
    text: "Community Potential",
    canonical_url: "https://c3field.online/community-potential",
    image_url: "https://example.com/community-potential.webp",
    lapzuli_callable: true,
    operator_confirmed: true,
    buffer_mode: "shareNow",
    ...overrides,
  };
}

test("c3 Buffer path is protected", async () => {
  const response = await handleC3BufferRequest(
    new Request("https://worker.example/buffer/c3/health"),
    env,
    "/buffer/c3/health",
  );
  assert.equal(response.status, 401);
});

test("c3 channel discovery is read-only and returns Facebook plus Instagram", async () => {
  const mock = installBufferMock();
  try {
    const response = await handleC3BufferRequest(
      new Request("https://worker.example/buffer/c3/channels", { headers: authHeaders() }),
      env,
      "/buffer/c3/channels",
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.channels.length, 3);
    assert.deepEqual(body.channels.map((item) => item.service), ["facebook", "facebook", "instagram"]);
    assert.equal(body.external_publication_effects, 0);
    assert.equal(mock.calls.length, 2);
  } finally {
    mock.restore();
  }
});

test("c3 Instagram dry run validates image post without publishing", async () => {
  const mock = installBufferMock();
  try {
    const request = new Request("https://worker.example/buffer/c3/posts", {
      method: "POST",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify(baseBody({
        channel_key: "c3_instagram",
        channel_identifier: "ig-c3",
        distribution_asset_id: "community_potential_instagram_release_v1",
        idempotency_key: "community_potential:instagram:release01",
      })),
    });
    const response = await handleC3BufferRequest(request, env, "/buffer/c3/posts");
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.standing, "c3_buffer_adapter_ready_dry_run");
    assert.equal(body.platform, "instagram");
    assert.equal(body.external_publication_effects, 0);
    assert.equal(mock.calls.some((call) => call.payload.query.includes("LapzuliCreatePost")), false);
  } finally {
    mock.restore();
  }
});

test("c3 post cannot target a channel outside the dedicated credential", async () => {
  const mock = installBufferMock({ includeTarget: false });
  try {
    const request = new Request("https://worker.example/buffer/c3/posts", {
      method: "POST",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify(baseBody({ channel_key: "c3_instagram", channel_identifier: "ig-c3" })),
    });
    const response = await handleC3BufferRequest(request, env, "/buffer/c3/posts");
    assert.equal(response.status, 409);
    const body = await response.json();
    assert.equal(body.standing, "held_c3_buffer_channel_not_in_credential_scope");
    assert.equal(body.external_publication_effects, 0);
  } finally {
    mock.restore();
  }
});

test("c3 post rejects non-c3 canonical URLs before Buffer is called", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error("should not call"); };
  try {
    const request = new Request("https://worker.example/buffer/c3/posts", {
      method: "POST",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify(baseBody({ canonical_url: "https://measuresregistry.com/governed-environments" })),
    });
    const response = await handleC3BufferRequest(request, env, "/buffer/c3/posts");
    assert.equal(response.status, 422);
    const body = await response.json();
    assert.ok(body.missing.includes("canonical_url_c3field"));
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("c3 execute uses Buffer GraphQL createPost with the registered image", async () => {
  const mock = installBufferMock();
  try {
    const request = new Request("https://worker.example/buffer/c3/posts", {
      method: "POST",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify(baseBody({ dry_run: false, execute: true })),
    });
    const response = await handleC3BufferRequest(request, env, "/buffer/c3/posts");
    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.standing, "c3_buffer_post_accepted");
    assert.equal(body.buffer_post_id, "buffer-post-1");
    assert.equal(body.external_publication_effects, 1);
    const mutation = mock.calls.find((call) => call.payload.query.includes("LapzuliCreatePost"));
    assert.ok(mutation);
    assert.equal(mutation.payload.variables.input.channelId, "fb-page");
    assert.equal(mutation.payload.variables.input.mode, "shareNow");
    assert.equal(mutation.payload.variables.input.assets[0].image.url, "https://example.com/community-potential.webp");
  } finally {
    mock.restore();
  }
});
