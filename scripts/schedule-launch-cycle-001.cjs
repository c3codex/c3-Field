#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BUFFER_GRAPHQL_URL = 'https://api.buffer.com/graphql';
const OAR2_PATH = 'OAR/OAR2/publication/oar2_schedule_and_launch_launch_cycle_001_v1.meta.md';
const SOURCE_PACKET = 'docs/oar/measures_registry/launch_cycle_001_final_buffer_queue_scheduling_packet_v1.json';
const OUTPUT_PATH = 'docs/oar/measures_registry/launch_cycle_001_scheduling_and_launch_execution_packet_v1.json';
const EXECUTED_AT = new Date().toISOString();

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

async function getPost(env, credentialRef, postId) {
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
  // Buffer's post listing is organization-scoped; query the known connected workspaces.
  const organizations = credentialRef === 'BUFFER_SOCIAL_KEY'
    ? ['6a23bebd718b53dcaa0839fc']
    : ['6a546d1271344fb67de5c6c4'];
  for (const organizationId of organizations) {
    const result = await gql(env[credentialRef], query, {
      input: {
        organizationId,
        filter: { status: ['draft', 'scheduled', 'sent', 'error'] },
      },
    });
    const post = result.data?.posts?.edges?.map((edge) => edge.node).find((node) => node.id === postId);
    if (post) return post;
  }
  return null;
}

async function getPostForItem(env, item) {
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
  const organizationId = item.credentialRef === 'BUFFER_SOCIAL_KEY'
    ? '6a23bebd718b53dcaa0839fc'
    : '6a546d1271344fb67de5c6c4';
  const result = await gql(env[item.credentialRef], query, {
    input: {
      organizationId,
      filter: { channelIds: [item.channelId], status: ['draft', 'scheduled', 'sent', 'error'] },
    },
  });
  return result.data?.posts?.edges?.map((edge) => edge.node).find((node) => node.id === item.bufferId) || null;
}

async function schedulePost(env, item, existingPost) {
  const mutation = `mutation EditPost($input: EditPostInput!) {
    editPost(input: $input) {
      __typename
      ... on PostActionSuccess {
        post { id status schedulingType isCustomScheduled dueAt text channelId channelService externalLink createdAt updatedAt assets { id type mimeType source thumbnail } }
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
    id: item.bufferId,
    schedulingType: 'automatic',
    dueAt: new Date(item.proposedAt).toISOString(),
    mode: 'customScheduled',
    metadata: metadataFor(item),
    source: OAR2_PATH,
    aiAssisted: false,
    saveToDraft: false,
  };
  // If Buffer needs text present for edit validation, preserve the existing approved body verbatim.
  if (existingPost?.text) input.text = existingPost.text;
  if (existingPost?.assets?.length) {
    input.assets = existingPost.assets.map((asset) => {
      if (asset.type === 'video') return { video: { url: asset.source } };
      if (asset.type === 'image') return { image: { url: asset.source } };
      return null;
    }).filter(Boolean);
  }

  const result = await gql(env[item.credentialRef], mutation, { input });
  return result.data?.editPost || { __typename: 'GraphQLError', message: (result.errors || []).join('; ') || `http_${result.status}` };
}

function metadataFor(item) {
  if (item.platform === 'facebook') return { facebook: { type: 'post' } };
  if (item.platform === 'instagram') {
    const type = item.id.includes('_story') ? 'story' : 'post';
    return { instagram: { type, shouldShareToFeed: type !== 'story', isAiGenerated: false } };
  }
  return undefined;
}

function approvedItems(source) {
  const scheduleById = new Map();
  for (const day of source.proposedSchedule || []) {
    for (const item of day.items || []) scheduleById.set(item.instanceId, { day: day.day, date: day.date, proposedAt: item.proposedAt });
  }
  return source.finalDraftInventory
    .filter((item) => item.bufferId && ['draft', 'scheduled'].includes(item.status))
    .map((item) => ({ ...item, ...(scheduleById.get(item.id) || {}) }));
}

function executionStanding(post) {
  if (!post) return 'not_found';
  if (post.status === 'sent') return 'published';
  if (post.status === 'scheduled') return 'scheduled_pending_release';
  if (post.status === 'draft') return 'draft_not_scheduled';
  if (post.status === 'error') return 'execution_error';
  return post.status || 'unknown';
}

async function main() {
  const execute = process.argv.includes('--execute');
  const env = loadEnv();
  const source = JSON.parse(fs.readFileSync(SOURCE_PACKET, 'utf8'));
  const priorReport = fs.existsSync(OUTPUT_PATH) ? JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8')) : null;
  const items = approvedItems(source);
  const results = [];

  for (const item of items) {
    const before = await getPostForItem(env, item);
    const base = {
      instanceId: item.id,
      publication: item.publication,
      endpoint: item.endpoint,
      credentialRef: item.credentialRef,
      bufferId: item.bufferId,
      assetId: item.assetId,
      approvedProposedAt: item.proposedAt,
      approvedProposedAtUtc: new Date(item.proposedAt).toISOString(),
      beforeStatus: before?.status || null,
      beforeDueAt: before?.dueAt || null,
      beforeExternalLink: before?.externalLink || null,
      mediaCount: before?.assets?.length || 0,
      action: null,
      afterStatus: null,
      afterDueAt: null,
      platformUrl: null,
      executionStanding: null,
      error: null,
    };

    if (!before) {
      results.push({ ...base, action: 'held_post_not_found', executionStanding: 'not_found', error: 'buffer_post_not_found' });
      continue;
    }

    if (before.status === 'sent' || before.status === 'scheduled') {
      results.push({
        ...base,
        action: 'preserved_existing_publication_state',
        afterStatus: before.status,
        afterDueAt: before.dueAt,
        platformUrl: before.externalLink || null,
        executionStanding: executionStanding(before),
      });
      continue;
    }

    if (!execute) {
      results.push({ ...base, action: 'dry_run_would_schedule', afterStatus: before.status, afterDueAt: before.dueAt, executionStanding: executionStanding(before) });
      continue;
    }

    const edit = await schedulePost(env, item, before);
    if (edit.__typename === 'PostActionSuccess') {
      results.push({
        ...base,
        action: 'scheduled_existing_draft',
        afterStatus: edit.post.status,
        afterDueAt: edit.post.dueAt,
        platformUrl: edit.post.externalLink || null,
        executionStanding: executionStanding(edit.post),
      });
    } else {
      results.push({
        ...base,
        action: 'schedule_failed',
        afterStatus: before.status,
        afterDueAt: before.dueAt,
        executionStanding: 'execution_exception_recorded',
        error: edit.message || edit.__typename,
      });
    }
  }

  const scheduled = results.filter((item) => item.executionStanding === 'scheduled_pending_release').length;
  const published = results.filter((item) => item.executionStanding === 'published').length;
  const exceptions = results.filter((item) => item.executionStanding === 'execution_exception_recorded' || item.executionStanding === 'not_found');
  const report = {
    oar2: OAR2_PATH,
    sourcePacket: SOURCE_PACKET,
    executedAt: EXECUTED_AT,
    mode: execute ? 'schedule_existing_buffer_posts' : 'dry_run',
    schedulingAuthority: 'operator_approved_launch_cycle_001_schedule',
    deferredCampaignExtensions: source.heldTargets || [],
    scheduledPublicationInventory: results,
    actualPublicationInventory: results.filter((item) => item.executionStanding === 'published'),
    pendingPublicationInventory: results.filter((item) => item.executionStanding === 'scheduled_pending_release'),
    executionExceptions: exceptions,
    priorExecutionExceptions: priorReport?.executionExceptions || [],
    duplicateVerification: {
      bufferIdsScheduled: results.map((item) => item.bufferId),
      duplicateBufferIds: results.map((item) => item.bufferId).filter((id, index, array) => array.indexOf(id) !== index),
      duplicatePostsCreated: false,
      note: 'This OAR edited existing Buffer IDs only; no createPost mutation was used.',
    },
    endpointVerification: source.endpointMap || [],
    mediaVerification: source.mediaVerification || null,
    summary: {
      approvedItems: items.length,
      scheduledPendingRelease: scheduled,
      alreadyPublished: published,
      executionExceptions: exceptions.length,
      deferredCampaignExtensions: (source.heldTargets || []).length,
    },
    finalDisposition: exceptions.length
      ? 'PARTIALLY_LAUNCHED_EXECUTION_EXCEPTIONS_RECORDED'
      : 'LAUNCH_CYCLE_001_SCHEDULED_FOR_GOVERNED_PUBLIC_EXECUTION',
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
