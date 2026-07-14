#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BUFFER_GRAPHQL_URL = 'https://api.buffer.com/graphql';
const OAR2_PATH = 'OAR/OAR2/publication/oar2_finalize_launch_cycle_001_buffer_queue_and_prepare_scheduling_v1.meta.md';
const EXECUTED_AT = new Date().toISOString();
const OUTPUT_PATH = 'docs/oar/measures_registry/launch_cycle_001_final_buffer_queue_scheduling_packet_v1.json';

const BASE_MEDIA_URL = 'https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/';
const ARTICLE_URLS = {
  p001: 'https://measuresregistry.com/undrifted/field-findings-2026-w28',
  p002: 'https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems',
};

const MEDIA = {
  ff_landscape_v1: 'launch_cycle_001/launch_cycle_001_field_findings_landscape_v1.webp',
  ff_square_v1: 'launch_cycle_001/launch_cycle_001_field_findings_square_v1.webp',
  ff_story_v1: 'launch_cycle_001/launch_cycle_001_field_findings_story_v1.webp',
  ff_quote_01_v1: 'launch_cycle_001/launch_cycle_001_field_findings_quote_01_v1.webp',
  ff_discussion_01_v1: 'launch_cycle_001/launch_cycle_001_field_findings_discussion_01_v1.webp',
  rs_landscape_v1: 'launch_cycle_001/launch_cycle_001_response_landscape_v1.webp',
  rs_square_v1: 'launch_cycle_001/launch_cycle_001_response_square_v1.webp',
  rs_story_v1: 'launch_cycle_001/launch_cycle_001_response_story_v1.webp',
  rs_quote_01_v1: 'launch_cycle_001/launch_cycle_001_response_quote_01_v1.webp',
  rs_discussion_01_v1: 'launch_cycle_001/launch_cycle_001_response_discussion_01_v1.webp',
  crystal_presenter_thumbnail_v1: 'launch_cycle_001/crystal_seat_presenter_thumbnail_v1.webp',
  assessment_primary_clip_v1: 'campaign_derivatives/assessment_primary_clip__9x16_v1.mp4',
};

const ACK_COPY =
  "Measures Registry notes unDrifted's first Field Findings sweep and accompanying Response as an editorial contribution to the Field, developed under unDrifted's autonomous publication authority. The Response's central claim — that environments must be measured before autonomous capability is assigned within them — reflects Measures Registry's own operational premise, but this acknowledgement does not itself constitute a Measures Registry methodology change, assessment finding, or institutional position on any named organization discussed in either publication. Measures Registry Review of MAP, Foundations Educational Module, SEAT, and Computational Systems Governance implications is tracked separately at docs/_source/codex/publications/measures_registry_review_launch_cycle_001.meta.md and remains its own, distinct governed record.";

const TARGETS = [
  {
    id: 'lc001_p001_ud_x_release',
    publication: 'publication_001',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: "Five sources, one pattern: enterprise AI incidents keep getting classified as security, access, or traceability failures. They're the same failure — institutions assigning capability faster than they're governing it. Field Findings 2026-W28 🧵",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_landscape_v1',
    proposedAt: '2026-07-14T09:00:00-05:00',
  },
  {
    id: 'lc001_p001_ud_x_quote',
    publication: 'publication_001',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: '"Organizations are assigning autonomous capability faster than they are establishing the operational environments required to govern it." — Field Findings 2026-W28',
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_quote_01_v1',
    proposedAt: '2026-07-15T10:00:00-05:00',
  },
  {
    id: 'lc001_p001_ud_x_discussion',
    publication: 'publication_001',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: 'Is your operational environment governed enough to receive an autonomous participant? Field Findings 2026-W28.',
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_discussion_01_v1',
    proposedAt: '2026-07-17T10:00:00-05:00',
  },
  {
    id: 'lc001_p001_ud_x_followup',
    publication: 'publication_001',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: "Board-level AI governance discussion isn't the same as governance that reaches runtime. 90% of surveyed orgs discuss it; half have a budget and a program. Field Findings 2026-W28.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_square_v1',
    proposedAt: '2026-07-18T10:00:00-05:00',
  },
  {
    id: 'lc001_p001_ud_x_source_ack',
    publication: 'publication_001',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: "This week's sweep drew on Carnegie Endowment, The Register, Google Cloud, CSA/Zenity, and NIST/CAISI — five independent sources converging on one pattern. Field Findings 2026-W28.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: null,
    proposedAt: '2026-07-19T09:30:00-05:00',
  },
  {
    id: 'lc001_p001_ud_fb_release',
    publication: 'publication_001',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: "We ran our first weekly Field Findings sweep this week — five independent sources (Carnegie Endowment, The Register, Google Cloud, CSA/Zenity, NIST), all converging on the same underlying condition in enterprise AI deployment. Here's what we found, and why we think the usual classifications (security failure, access failure, traceability failure) are missing the structural pattern underneath.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_landscape_v1',
    preserveExistingId: '6a55213145f81c20067e99cf',
    proposedAt: '2026-07-13T20:31:00-05:00',
  },
  {
    id: 'lc001_p001_ud_fb_quote',
    publication: 'publication_001',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: '"Organizations are assigning autonomous capability faster than they are establishing the operational environments required to govern it." Our first weekly Field Findings sweep.',
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_quote_01_v1',
    proposedAt: '2026-07-15T11:00:00-05:00',
  },
  {
    id: 'lc001_p001_ud_fb_discussion',
    publication: 'publication_001',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: "Is your operational environment governed enough to receive an autonomous participant? That's the question underneath this week's Field Findings sweep.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_discussion_01_v1',
    proposedAt: '2026-07-17T11:00:00-05:00',
  },
  {
    id: 'lc001_p001_ud_fb_square',
    publication: 'publication_001',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: "The dominant failure isn't 'the AI produced bad code.' It's closer to: the organization allowed an insufficiently identified, poorly configured, or inadequately governed computational participant to act inside its systems. From this week's Field Findings.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_square_v1',
    proposedAt: '2026-07-18T11:00:00-05:00',
  },
  {
    id: 'lc001_p001_ud_fb_source_ack',
    publication: 'publication_001',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: "This week's Field Findings sweep drew on five independent sources: Carnegie Endowment, The Register, Google Cloud, CSA/Zenity, and NIST/CAISI — each approaching the same pattern from a different angle.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: null,
    proposedAt: '2026-07-19T10:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_x_release',
    publication: 'publication_002',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: '"AI agents are not entering empty systems. They\'re entering organizations already built from fragmented procedures, unclear ownership, inherited permissions." Our response to this week\'s Field Findings 🧵',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_landscape_v1',
    proposedAt: '2026-07-14T12:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_x_quote',
    publication: 'publication_002',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: '"AI agents are not entering empty systems." — unDrifted Response 001',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_quote_01_v1',
    proposedAt: '2026-07-16T10:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_x_discussion',
    publication: 'publication_002',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: 'What kind of institution can responsibly receive an autonomous agent? unDrifted Response 001.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_discussion_01_v1',
    proposedAt: '2026-07-17T13:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_x_followup',
    publication: 'publication_002',
    endpoint: 'unDrifted X',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'x',
    copy: 'A perfectly identified, permissioned, monitored agent can still be assigned the wrong objective. Identity controls aren\'t the same question as "should this function exist." unDrifted Response 001.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_square_v1',
    proposedAt: '2026-07-18T13:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_fb_release',
    publication: 'publication_002',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: 'This week\'s unDrifted Response: the AI agent security conversation keeps asking "how do we control the agent?" We think that\'s the wrong first question. The right first question is whether the environment the agent is entering was ever governable to begin with. Read our full response.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_landscape_v1',
    proposedAt: '2026-07-14T13:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_fb_quote',
    publication: 'publication_002',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: '"AI agents are not entering empty systems. They are entering organizations already composed of fragmented procedures, inherited permissions, unclear ownership, informal approvals, disconnected data, overlapping tools, and responsibilities that may never have been explicitly defined."',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_quote_01_v1',
    proposedAt: '2026-07-16T11:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_fb_discussion',
    publication: 'publication_002',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: 'What kind of institution can responsibly receive an autonomous agent? That\'s the question our Response argues comes before any question about the model itself.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_discussion_01_v1',
    proposedAt: '2026-07-17T14:00:00-05:00',
  },
  {
    id: 'lc001_p002_ud_fb_square',
    publication: 'publication_002',
    endpoint: 'unDrifted Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: 'A perfectly identified agent can still be assigned the wrong objective. A tightly permissioned agent can still optimize a harmful process. A monitored agent can still faithfully execute a position that should never have been established. From unDrifted Response 001.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_square_v1',
    proposedAt: '2026-07-18T14:00:00-05:00',
  },
  {
    id: 'lc001_p001_mr_x_ack',
    publication: 'publication_001',
    endpoint: 'Measures Registry X',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'x',
    copy: "unDrifted's first Field Findings sweep is now live — an editorial contribution to the Field, developed under unDrifted's own publication authority.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_landscape_v1',
    proposedAt: '2026-07-15T09:00:00-05:00',
  },
  {
    id: 'lc001_p002_mr_x_contribution',
    publication: 'publication_002',
    endpoint: 'Measures Registry X',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'x',
    copy: "unDrifted's Response to this week's Field Findings is live. Measures Registry's own premise: measure the environment before assigning autonomous capability within it.",
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'assessment_primary_clip_v1',
    proposedAt: '2026-07-16T09:00:00-05:00',
  },
  {
    id: 'lc001_p001_mr_fb_ack',
    publication: 'publication_001',
    endpoint: 'Measures Registry Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: ACK_COPY,
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_landscape_v1',
    proposedAt: '2026-07-15T12:00:00-05:00',
  },
  {
    id: 'lc001_p002_mr_fb_contribution',
    publication: 'publication_002',
    endpoint: 'Measures Registry Facebook',
    credentialRef: 'BUFFER_PUB2_KEY',
    platform: 'facebook',
    copy: ACK_COPY,
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'crystal_presenter_thumbnail_v1',
    proposedAt: '2026-07-16T12:00:00-05:00',
  },
  {
    id: 'lc001_p001_mr_ig_square',
    publication: 'publication_001',
    endpoint: 'Measures Registry Instagram',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'instagram',
    instagramType: 'post',
    copy: "unDrifted's first Field Findings sweep is live — five sources (Carnegie Endowment, The Register, Google Cloud, CSA/Zenity, NIST) converging on one pattern in enterprise AI deployment. An editorial contribution to the Field. Link in bio.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_square_v1',
    includeUrl: false,
    proposedAt: '2026-07-15T13:00:00-05:00',
  },
  {
    id: 'lc001_p001_mr_ig_story',
    publication: 'publication_001',
    endpoint: 'Measures Registry Instagram',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'instagram',
    instagramType: 'story',
    copy: "unDrifted's first Field Findings sweep is live. Five sources, one pattern. Link in bio.",
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_story_v1',
    includeUrl: false,
    proposedAt: '2026-07-15T17:00:00-05:00',
  },
  {
    id: 'lc001_p001_mr_ig_quote',
    publication: 'publication_001',
    endpoint: 'Measures Registry Instagram',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'instagram',
    instagramType: 'post',
    copy: '"Organizations are assigning autonomous capability faster than they are establishing the operational environments required to govern it." — unDrifted, Field Findings 2026-W28. Link in bio.',
    articleUrl: ARTICLE_URLS.p001,
    assetId: 'ff_quote_01_v1',
    includeUrl: false,
    proposedAt: '2026-07-16T13:00:00-05:00',
  },
  {
    id: 'lc001_p002_mr_ig_square',
    publication: 'publication_002',
    endpoint: 'Measures Registry Instagram',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'instagram',
    instagramType: 'post',
    copy: "unDrifted's Response to this week's Field Findings is live: AI agents aren't failing because they're broken — they're failing because they're given a position in systems that were never made governable. Link in bio.",
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_square_v1',
    includeUrl: false,
    proposedAt: '2026-07-16T14:00:00-05:00',
  },
  {
    id: 'lc001_p002_mr_ig_story',
    publication: 'publication_002',
    endpoint: 'Measures Registry Instagram',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'instagram',
    instagramType: 'story',
    copy: 'unDrifted Response 001 is live: AI agents are not entering empty systems. Link in bio.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_story_v1',
    includeUrl: false,
    proposedAt: '2026-07-16T17:00:00-05:00',
  },
  {
    id: 'lc001_p002_mr_ig_quote',
    publication: 'publication_002',
    endpoint: 'Measures Registry Instagram',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'instagram',
    instagramType: 'post',
    copy: '"AI agents are not entering empty systems." — unDrifted Response 001. Link in bio.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_quote_01_v1',
    includeUrl: false,
    proposedAt: '2026-07-17T15:00:00-05:00',
  },
  {
    id: 'lc001_p002_mr_ig_discussion',
    publication: 'publication_002',
    endpoint: 'Measures Registry Instagram',
    credentialRef: 'BUFFER_SOCIAL_KEY',
    platform: 'instagram',
    instagramType: 'post',
    copy: 'What kind of institution can responsibly receive an autonomous agent? From unDrifted Response 001. Link in bio.',
    articleUrl: ARTICLE_URLS.p002,
    assetId: 'rs_discussion_01_v1',
    includeUrl: false,
    proposedAt: '2026-07-18T15:00:00-05:00',
  },
];

const HELD_TARGETS = [
  {
    id: 'lc001_p001_mr_ig_reel',
    endpoint: 'Measures Registry Instagram',
    publication: 'publication_001',
    status: 'held_no_asset',
    reason: 'endpoint_copy_package_marks_reel_not_applicable_no_purpose_made_video_exists_for_this_cycle',
  },
  {
    id: 'lc001_p002_mr_ig_reel',
    endpoint: 'Measures Registry Instagram',
    publication: 'publication_002',
    status: 'held_no_approved_reel_caption',
    reason: 'endpoint_copy_package_does_not_provide_a_publication_002_instagram_reel_caption',
  },
];

function loadEnv() {
  const env = { ...process.env };
  for (const file of ['.dev.vars', '.env.local', '.env']) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (match) env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
  return env;
}

async function gql(token, query, variables) {
  const response = await fetch(BUFFER_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || json?.errors) {
    return {
      ok: false,
      status: response.status,
      errors: json?.errors?.map((error) => error.message) || [`http_${response.status}`],
      data: json?.data || null,
    };
  }
  return { ok: true, status: response.status, data: json.data };
}

async function listWorkspace(env, credentialRef) {
  const accountQuery = `query { account { id name timezone organizations { id name channelCount } } }`;
  const channelsQuery = `query Channels($input: ChannelsInput!) {
    channels(input: $input) {
      id service type name displayName externalLink isDisconnected isLocked organizationId timezone allowedActions
    }
  }`;

  const token = env[credentialRef];
  if (!token) return { credentialRef, present: false, authenticated: false, channels: [], organizations: [] };

  const account = await gql(token, accountQuery);
  if (!account.ok || !account.data?.account) {
    return { credentialRef, present: true, authenticated: false, channels: [], organizations: [], errors: account.errors || [] };
  }

  const channels = [];
  for (const organization of account.data.account.organizations || []) {
    const result = await gql(token, channelsQuery, { input: { organizationId: organization.id } });
    for (const channel of result.data?.channels || []) {
      channels.push({ ...channel, credentialRef, organizationName: organization.name });
    }
  }

  return {
    credentialRef,
    present: true,
    authenticated: true,
    accountName: account.data.account.name,
    timezone: account.data.account.timezone,
    organizations: account.data.account.organizations || [],
    channels,
  };
}

function channelMatchesEndpoint(channel, endpoint) {
  const corpus = `${channel.service || ''} ${channel.name || ''} ${channel.displayName || ''} ${channel.externalLink || ''}`.toLowerCase();
  if (endpoint === 'Measures Registry X') return channel.service === 'twitter' && corpus.includes('measures');
  if (endpoint === 'Measures Registry Instagram') return channel.service === 'instagram' && corpus.includes('measures_registry');
  if (endpoint === 'Measures Registry Facebook') return channel.service === 'facebook' && corpus.includes('measures registry');
  if (endpoint === 'unDrifted X') return channel.service === 'twitter' && corpus.includes('undrifted');
  if (endpoint === 'unDrifted Facebook') return channel.service === 'facebook' && corpus.includes('undrifted');
  return false;
}

async function listPosts(env, credentialRef, channel) {
  const query = `query Posts($input: PostsInput!) {
    posts(input: $input) {
      edges {
        node {
          id status schedulingType isCustomScheduled dueAt text channelId channelService externalLink createdAt updatedAt
          assets { id type mimeType source thumbnail }
        }
      }
    }
  }`;
  const result = await gql(env[credentialRef], query, {
    input: {
      organizationId: channel.organizationId,
      filter: { channelIds: [channel.id], status: ['draft', 'scheduled', 'sent', 'error'] },
    },
  });
  return result.data?.posts?.edges?.map((edge) => edge.node) || [];
}

function mediaUrl(assetId) {
  if (!assetId) return null;
  if (!MEDIA[assetId]) throw new Error(`unknown media asset ${assetId}`);
  return `${BASE_MEDIA_URL}${MEDIA[assetId]}`;
}

function assetInput(assetId) {
  const url = mediaUrl(assetId);
  if (!url) return [];
  if (url.endsWith('.mp4')) return [{ video: { url } }];
  return [{ image: { url } }];
}

function buildText(target) {
  if (target.includeUrl === false) return target.copy;
  return `${target.copy}\n\n${target.articleUrl}`;
}

function metadataFor(target) {
  if (target.platform === 'facebook') return { facebook: { type: 'post' } };
  if (target.platform === 'instagram') {
    return {
      instagram: {
        type: target.instagramType || 'post',
        shouldShareToFeed: target.instagramType !== 'story',
        isAiGenerated: false,
      },
    };
  }
  return undefined;
}

function hasTargetAsset(post, target) {
  if (!target.assetId) return (post.assets || []).length === 0;
  const url = mediaUrl(target.assetId);
  return (post.assets || []).some((asset) => asset.source === url || asset.thumbnail === url);
}

function duplicateKey(post) {
  return `${post.channelId}::${(post.text || '').trim()}`;
}

async function createDraft(env, target, channel, text) {
  const mutation = `mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      __typename
      ... on PostActionSuccess {
        post { id status schedulingType dueAt text channelId channelService externalLink createdAt updatedAt assets { id type mimeType source thumbnail } }
      }
      ... on InvalidInputError { message }
      ... on LimitReachedError { message }
      ... on RestProxyError { message }
      ... on UnauthorizedError { message }
      ... on UnexpectedError { message }
      ... on NotFoundError { message }
    }
  }`;
  const input = {
    schedulingType: 'automatic',
    dueAt: null,
    text,
    metadata: metadataFor(target),
    channelId: channel.id,
    assets: assetInput(target.assetId),
    mode: 'addToQueue',
    source: OAR2_PATH,
    aiAssisted: false,
    saveToDraft: true,
  };
  const result = await gql(env[target.credentialRef], mutation, { input });
  return result.data?.createPost || { __typename: 'GraphQLError', message: (result.errors || []).join('; ') || `http_${result.status}` };
}

async function editPost(env, target, post, text) {
  const mutation = `mutation EditPost($input: EditPostInput!) {
    editPost(input: $input) {
      __typename
      ... on PostActionSuccess {
        post { id status schedulingType dueAt text channelId channelService externalLink createdAt updatedAt assets { id type mimeType source thumbnail } }
      }
      ... on InvalidInputError { message }
      ... on LimitReachedError { message }
      ... on RestProxyError { message }
      ... on UnauthorizedError { message }
      ... on UnexpectedError { message }
      ... on NotFoundError { message }
    }
  }`;
  const input = {
    id: post.id,
    schedulingType: 'automatic',
    dueAt: post.dueAt || null,
    text,
    metadata: metadataFor(target),
    assets: assetInput(target.assetId),
    mode: post.dueAt ? 'customScheduled' : 'addToQueue',
    source: OAR2_PATH,
    aiAssisted: false,
    saveToDraft: post.status === 'draft',
  };
  const result = await gql(env[target.credentialRef], mutation, { input });
  return result.data?.editPost || { __typename: 'GraphQLError', message: (result.errors || []).join('; ') || `http_${result.status}` };
}

async function head(url) {
  if (!url) return null;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { url, ok: response.ok, status: response.status, contentType: response.headers.get('content-type') };
  } catch (error) {
    return { url, ok: false, status: null, error: error.message };
  }
}

function schedulePacket(results) {
  return [
    { day: 'Monday', date: '2026-07-13', items: results.filter((item) => item.proposedAt?.startsWith('2026-07-13')) },
    { day: 'Tuesday', date: '2026-07-14', items: results.filter((item) => item.proposedAt?.startsWith('2026-07-14')) },
    { day: 'Wednesday', date: '2026-07-15', items: results.filter((item) => item.proposedAt?.startsWith('2026-07-15')) },
    { day: 'Thursday', date: '2026-07-16', items: results.filter((item) => item.proposedAt?.startsWith('2026-07-16')) },
    { day: 'Friday', date: '2026-07-17', items: results.filter((item) => item.proposedAt?.startsWith('2026-07-17')) },
    { day: 'Saturday', date: '2026-07-18', items: results.filter((item) => item.proposedAt?.startsWith('2026-07-18')) },
    { day: 'Sunday', date: '2026-07-19', items: results.filter((item) => item.proposedAt?.startsWith('2026-07-19')) },
  ].map((day) => ({
    ...day,
    items: day.items.map((item) => ({
      instanceId: item.id,
      endpoint: item.endpoint,
      proposedAt: item.proposedAt,
      bufferId: item.bufferId,
      status: item.status,
      assetId: item.assetId,
    })),
  }));
}

async function main() {
  const execute = process.argv.includes('--execute');
  const env = loadEnv();
  const workspaces = await Promise.all(['BUFFER_SOCIAL_KEY', 'BUFFER_PUB2_KEY'].map((credential) => listWorkspace(env, credential)));
  const channels = workspaces.flatMap((workspace) => workspace.channels);
  const endpointMap = [...new Set(TARGETS.map((target) => `${target.credentialRef}::${target.endpoint}`))].map((key) => {
    const [credentialRef, endpoint] = key.split('::');
    const candidates = channels.filter((channel) => channel.credentialRef === credentialRef && channelMatchesEndpoint(channel, endpoint));
    return { credentialRef, endpoint, resolved: candidates.length === 1, candidateCount: candidates.length, channel: candidates[0] || null };
  });

  const postsByChannel = new Map();
  for (const endpoint of endpointMap) {
    if (!endpoint.resolved) continue;
    postsByChannel.set(endpoint.channel.id, await listPosts(env, endpoint.credentialRef, endpoint.channel));
  }

  const mediaChecks = await Promise.all([...new Set(TARGETS.map((target) => mediaUrl(target.assetId)).filter(Boolean))].map((url) => head(url)));
  const articleChecks = await Promise.all(Object.values(ARTICLE_URLS).map((url) => head(url)));
  const results = [];

  for (const target of TARGETS) {
    const endpoint = endpointMap.find((entry) => entry.credentialRef === target.credentialRef && entry.endpoint === target.endpoint);
    const text = buildText(target);
    const mediaCheck = target.assetId ? mediaChecks.find((check) => check.url === mediaUrl(target.assetId)) : null;
    const articleCheck = articleChecks.find((check) => check.url === target.articleUrl);
    const base = {
      id: target.id,
      publication: target.publication,
      endpoint: target.endpoint,
      credentialRef: target.credentialRef,
      platform: target.platform,
      articleUrl: target.articleUrl,
      articleUrlVerified: articleCheck?.ok || false,
      assetId: target.assetId,
      mediaUrl: mediaUrl(target.assetId),
      mediaVerified: target.assetId ? mediaCheck?.ok || false : true,
      proposedAt: target.proposedAt,
      textLength: [...text].length,
      bufferId: null,
      status: null,
      action: null,
      reason: null,
      duplicateStanding: null,
    };

    if (!endpoint?.resolved) {
      results.push({ ...base, status: 'held', reason: `endpoint_resolution_expected_one_found_${endpoint?.candidateCount ?? 0}` });
      continue;
    }
    if (target.assetId && !mediaCheck?.ok) {
      results.push({ ...base, channelId: endpoint.channel.id, status: 'held', reason: `media_head_failed_${mediaCheck?.status || 'unknown'}` });
      continue;
    }
    if (!articleCheck?.ok) {
      results.push({ ...base, channelId: endpoint.channel.id, status: 'held', reason: `article_head_failed_${articleCheck?.status || 'unknown'}` });
      continue;
    }

    const posts = postsByChannel.get(endpoint.channel.id) || [];
    const exactMatches = posts.filter((post) => duplicateKey(post) === `${endpoint.channel.id}::${text.trim()}`);
    const withAsset = exactMatches.find((post) => hasTargetAsset(post, target));
    if (withAsset) {
      results.push({
        ...base,
        channelId: endpoint.channel.id,
        bufferId: withAsset.id,
        status: withAsset.status,
        bufferDueAt: withAsset.dueAt,
        action: 'preserved_existing',
        duplicateStanding: 'exact_text_and_asset_match_no_duplicate_created',
      });
      continue;
    }

    const preferredExisting = target.preserveExistingId
      ? posts.find((post) => post.id === target.preserveExistingId && post.text === text)
      : exactMatches[0];
    if (preferredExisting && target.preserveExistingId && execute) {
      const edited = await editPost(env, target, preferredExisting, text);
      if (edited.__typename === 'PostActionSuccess') {
        results.push({
          ...base,
          channelId: endpoint.channel.id,
          bufferId: edited.post.id,
          status: edited.post.status,
          bufferDueAt: edited.post.dueAt,
          action: 'edited_existing_preserved_id',
          duplicateStanding: 'existing_text_only_post_updated_with_registered_media',
        });
      } else {
        results.push({
          ...base,
          channelId: endpoint.channel.id,
          bufferId: preferredExisting.id,
          status: 'held',
          action: 'edit_failed_no_duplicate_created',
          reason: edited.message || edited.__typename,
          duplicateStanding: 'existing_text_only_post_preserved_without_competing_draft',
        });
      }
      continue;
    }
    if (preferredExisting) {
      results.push({
        ...base,
        channelId: endpoint.channel.id,
        bufferId: preferredExisting.id,
        status: preferredExisting.status,
        bufferDueAt: preferredExisting.dueAt,
        action: execute ? 'held_existing_without_asset' : 'dry_run_would_edit_existing',
        duplicateStanding: 'matching_text_exists_no_duplicate_created',
      });
      continue;
    }

    if (!execute) {
      results.push({ ...base, channelId: endpoint.channel.id, status: 'dry_run_ready', action: 'would_create_draft' });
      continue;
    }

    const created = await createDraft(env, target, endpoint.channel, text);
    if (created.__typename === 'PostActionSuccess') {
      results.push({
        ...base,
        channelId: endpoint.channel.id,
        bufferId: created.post.id,
        status: created.post.status,
        bufferDueAt: created.post.dueAt,
        action: 'created_draft',
        duplicateStanding: 'no_existing_exact_match_before_creation',
      });
    } else {
      results.push({
        ...base,
        channelId: endpoint.channel.id,
        status: 'held',
        action: 'create_failed',
        reason: created.message || created.__typename,
      });
    }
  }

  const duplicateIds = results
    .filter((item) => item.bufferId)
    .map((item) => item.bufferId)
    .filter((id, index, array) => array.indexOf(id) !== index);
  const createdOrReady = results.filter((item) => ['draft', 'scheduled'].includes(item.status)).length;
  const report = {
    oar2: OAR2_PATH,
    executedAt: EXECUTED_AT,
    mode: execute ? 'execute_buffer_drafts_no_schedule_no_publish' : 'dry_run',
    credentialPresence: workspaces.map((workspace) => ({
      credentialRef: workspace.credentialRef,
      present: workspace.present,
      authenticated: workspace.authenticated,
      accountName: workspace.accountName || null,
      channelCount: workspace.channels?.length || 0,
      errors: workspace.errors || [],
    })),
    endpointMap: endpointMap.map((endpoint) => ({
      endpoint: endpoint.endpoint,
      credentialRef: endpoint.credentialRef,
      resolved: endpoint.resolved,
      candidateCount: endpoint.candidateCount,
      channelId: endpoint.channel?.id || null,
      channelDisplayName: endpoint.channel?.displayName || null,
      service: endpoint.channel?.service || null,
      publicAccount: endpoint.channel?.externalLink || null,
      organizationName: endpoint.channel?.organizationName || null,
    })),
    finalDraftInventory: results,
    heldTargets: HELD_TARGETS,
    duplicateVerification: {
      duplicateBufferIdsInTargetSet: [...new Set(duplicateIds)],
      duplicateDraftsCreated: false,
      notes: [
        'Existing exact text+asset matches were preserved.',
        'Existing text-only Pub001 unDrifted Facebook scheduled item was edited in place when Buffer accepted the edit.',
        'No publishing or automatic scheduling action was requested.',
      ],
    },
    mediaVerification: {
      mediaChecks,
      articleChecks,
    },
    proposedScheduleTimezone: 'America/Chicago',
    proposedSchedule: schedulePacket(results),
    finalDisposition:
      results.some((item) => item.status === 'held') || HELD_TARGETS.length
        ? 'HELD_WITH_REASON'
        : 'BUFFER_QUEUE_READY_FOR_SCHEDULING_APPROVAL',
    summary: {
      targetCount: TARGETS.length,
      createdOrReady,
      heldCount: results.filter((item) => item.status === 'held').length + HELD_TARGETS.length,
      createdDraftCount: results.filter((item) => item.action === 'created_draft').length,
      preservedCount: results.filter((item) => item.action === 'preserved_existing').length,
      editedCount: results.filter((item) => item.action === 'edited_existing_preserved_id').length,
    },
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`${report.finalDisposition}: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
