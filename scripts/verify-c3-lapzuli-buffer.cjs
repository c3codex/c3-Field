const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".dev.vars", override: true });

const WORKER_URL = (
  process.env.LAPZULI_DISTRIBUTION_WORKER_URL ||
  "https://lapzuli-distribution-worker.c3field.workers.dev"
).replace(/\/$/, "");

const CONTROL_TOKEN = String(process.env.LAPZULI_DISTRIBUTION_CONTROL_TOKEN || "").trim();
const SUPABASE_URL = String(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ""
).trim().replace(/\/$/, "");

const CANONICAL_URL = "https://c3field.online/community-potential";
const IMAGE_URL = String(
  process.env.C3_COMMUNITY_POTENTIAL_SOCIAL_URL ||
  (SUPABASE_URL
    ? `${SUPABASE_URL}/storage/v1/object/public/c3-field-media/c3_Community_Potential_social_1x1.webp`
    : "")
).trim();

if (!CONTROL_TOKEN) {
  throw new Error(
    "Missing LAPZULI_DISTRIBUTION_CONTROL_TOKEN in .dev.vars or process environment."
  );
}

if (!IMAGE_URL) {
  throw new Error(
    "Missing public image URL. Set C3_COMMUNITY_POTENTIAL_SOCIAL_URL or SUPABASE_URL/VITE_SUPABASE_URL."
  );
}

const authHeaders = {
  authorization: `Bearer ${CONTROL_TOKEN}`,
};

async function jsonRequest(pathname, options = {}) {
  const response = await fetch(`${WORKER_URL}${pathname}`, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    const error = new Error(`${pathname} returned HTTP ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

function pickChannels(channels) {
  const normalized = channels.map((channel) => ({
    ...channel,
    name_lc: String(channel.name || "").toLowerCase(),
    name_key: String(channel.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ""),
    service_lc: String(channel.service || "").toLowerCase(),
  }));

  const instagram = normalized.filter((channel) => channel.service_lc === "instagram");
  const facebook = normalized.filter((channel) => channel.service_lc === "facebook");

  const pageCandidates = facebook.filter((channel) =>
    channel.name_key.includes("c3communitypartners")
  );
  const groupCandidates = facebook.filter((channel) =>
    channel.name_lc.includes("connect") ||
    channel.name_lc.includes("contribute") ||
    channel.name_lc.includes("create") ||
    channel.name_lc.includes("c3 field")
  );

  const page = pageCandidates.length === 1 ? pageCandidates[0] : null;
  const group = groupCandidates.length === 1 ? groupCandidates[0] : null;
  const ig = instagram.length === 1 ? instagram[0] : null;

  if (page && group && page.id === group.id) {
    throw new Error("Facebook Page and Group resolved to the same Buffer channel.");
  }

  return {
    page,
    group,
    instagram: ig,
    discovered: normalized.map(({ name_lc, name_key, service_lc, ...channel }) => channel),
  };
}

function postBody(channelKey, channel, text, suffix) {
  return {
    dry_run: true,
    publication_object_key: "community_potential",
    derivative_key: "community_potential_social_webp",
    distribution_asset_id: `community_potential_${suffix}_release_v1`,
    channel_key: channelKey,
    channel_identifier: channel.id,
    executor_key: "buffer",
    registered_standing_key: "community_potential_registered",
    registered_standing: "REGISTERED",
    idempotency_key: `community_potential:${suffix}:release01`,
    text,
    canonical_url: CANONICAL_URL,
    image_url: IMAGE_URL,
    lapzuli_callable: true,
    operator_confirmed: true,
    buffer_mode: "shareNow",
  };
}

const copy = {
  page: `We’re publishing the first c3 Community Partners white paper: Community Potential — A Systems Model for Participation, Contribution, Creation, and Shared Value.

Communities already contain enormous potential — people, skills, knowledge, resources, creativity, relationships, and ideas.

The problem is often not that the potential is missing. It is that the structures around it fail to make that potential visible, connected, useful, and accountable to outcomes.

Community Potential introduces the simple model at the center of c3:

Connect → Contribute → Create

Read Community Potential — White Paper 01:
${CANONICAL_URL}`,
  group: `We’ve published Community Potential, the first white paper from c3 Community Partners.

This paper puts into words much of what this group is here to explore:

Connect → Contribute → Create

What happens when people can first become visible to one another, contribute what they actually have to offer, and organize those contributions around something worth creating?

Take a look, and tell us what resonates with you:
${CANONICAL_URL}`,
  instagram: `Communities already contain enormous potential. The challenge is making it visible, connected, useful, and shared.

Community Potential — the first c3 Community Partners white paper — introduces the model at the center of c3:

Connect → Contribute → Create

${CANONICAL_URL}`,
};

(async () => {
  const health = await jsonRequest("/buffer/c3/health");
  const discovery = await jsonRequest("/buffer/c3/channels");
  const channels = Array.isArray(discovery?.channels) ? discovery.channels : [];
  const selected = pickChannels(channels);

  const pageDryRun = selected.page
    ? await jsonRequest("/buffer/c3/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          postBody("c3_facebook_page", selected.page, copy.page, "facebook_page")
        ),
      })
    : null;

  const groupDryRun = selected.group
    ? await jsonRequest("/buffer/c3/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          postBody("c3_facebook_group", selected.group, copy.group, "facebook_group")
        ),
      })
    : null;

  const instagramDryRun = selected.instagram
    ? await jsonRequest("/buffer/c3/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          postBody("c3_instagram", selected.instagram, copy.instagram, "instagram")
        ),
      })
    : null;

  const result = {
    standing:
      selected.page && selected.group && selected.instagram
        ? "C3_LAPZULI_BUFFER_LIVE_DRY_RUN_COMPLETE"
        : selected.page && selected.group
          ? "C3_LAPZULI_BUFFER_FACEBOOK_DRY_RUN_COMPLETE_INSTAGRAM_HELD"
          : "HELD_C3_LAPZULI_BUFFER_CHANNEL_MAPPING_INCOMPLETE",
    worker_url: WORKER_URL,
    health: {
      ok: health?.ok === true,
      adapter: health?.adapter || null,
      credential_present: health?.credential_present === true,
      external_publication_effects: health?.external_publication_effects ?? null,
    },
    publication: {
      key: "community_potential",
      canonical_url: CANONICAL_URL,
      image_url: IMAGE_URL,
    },
    channels: {
      facebook_page: selected.page
        ? {
            id: selected.page.id,
            name: selected.page.name,
            organization_id: selected.page.organization_id,
          }
        : null,
      facebook_group: selected.group
        ? {
            id: selected.group.id,
            name: selected.group.name,
            organization_id: selected.group.organization_id,
          }
        : null,
      instagram: selected.instagram
        ? {
            id: selected.instagram.id,
            name: selected.instagram.name,
            organization_id: selected.instagram.organization_id,
          }
        : null,
      discovered: selected.discovered,
    },
    dry_runs: {
      facebook_page: pageDryRun
        ? {
            ok: pageDryRun?.ok === true,
            standing: pageDryRun?.standing || null,
            external_publication_effects: pageDryRun?.external_publication_effects ?? null,
          }
        : { ok: false, standing: "held_channel_not_mapped", external_publication_effects: 0 },
      facebook_group: groupDryRun
        ? {
            ok: groupDryRun?.ok === true,
            standing: groupDryRun?.standing || null,
            external_publication_effects: groupDryRun?.external_publication_effects ?? null,
          }
        : { ok: false, standing: "held_channel_not_mapped", external_publication_effects: 0 },
      instagram: instagramDryRun
        ? {
            ok: instagramDryRun?.ok === true,
            standing: instagramDryRun?.standing || null,
            external_publication_effects: instagramDryRun?.external_publication_effects ?? null,
          }
        : { ok: false, standing: "held_not_returned_by_buffer_api", external_publication_effects: 0 },
    },
  };

  console.log(JSON.stringify(result, null, 2));
})().catch((error) => {
  console.error(
    JSON.stringify(
      {
        standing: "HELD_C3_LAPZULI_BUFFER_LIVE_VERIFICATION",
        message: error.message,
        status: error.status || null,
        response: error.body || null,
        channels: error.channels || null,
      },
      null,
      2
    )
  );
  process.exitCode = 1;
});
