#!/usr/bin/env node

const fs = require('fs');
const { Client } = require('pg');

const OAR2_PATH = 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md';
const EXECUTED_AT = new Date().toISOString();
const BUFFER_GRAPHQL_URL = 'https://api.buffer.com/graphql';

const REQUIRED_ENDPOINTS = [
  { endpoint: 'Measures Registry YouTube', platform: 'youtube', owner: 'Measures Registry', credentialRef: 'BUFFER_SOCIAL_KEY' },
  { endpoint: 'Measures Registry Instagram', platform: 'instagram', owner: 'Measures Registry', credentialRef: 'BUFFER_SOCIAL_KEY' },
  { endpoint: 'Measures Registry X', platform: 'twitter', owner: 'Measures Registry', credentialRef: 'BUFFER_SOCIAL_KEY' },
  { endpoint: 'Measures Registry Facebook', platform: 'facebook', owner: 'Measures Registry', credentialRef: 'BUFFER_PUB2_KEY' },
  { endpoint: 'unDrifted Facebook', platform: 'facebook', owner: 'unDrifted', credentialRef: 'BUFFER_PUB2_KEY' },
  { endpoint: 'unDrifted X', platform: 'twitter', owner: 'unDrifted', credentialRef: 'BUFFER_PUB2_KEY' },
];

const CANONICAL_VIDEO_ORDER = [
  {
    actionId: 'launch_cycle_001__measures_registry__youtube__about_measures_registry__2026-07-14',
    title: 'About Measures Registry',
    storagePath: 'about_measures_registry.mp4',
    mediaRole: 'about_measures_registry_video',
    description: 'Shared systems governance for institutions deploying AI.',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    proposedTime: '2026-07-14T10:00:00-05:00',
  },
  {
    actionId: 'launch_cycle_001__measures_registry__youtube__ai_isnt_broken_intro__2026-07-14',
    title: "AI Isn't Broken",
    storagePath: 'ai_isnt_broken_intro.mp4',
    mediaRole: 'intro_hook_video',
    description: "AI isn't broken. Systems are. Responsible AI deployment requires governable systems.",
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    proposedTime: '2026-07-14T10:20:00-05:00',
  },
  {
    actionId: 'launch_cycle_001__measures_registry__youtube__crystal_seat_orientation__2026-07-14',
    title: 'Crystal Seat Orientation',
    storagePath: 'crystal_seat_orientation.mp4',
    mediaRole: 'measures_position',
    description: 'Measures Registry orientation for coherence, resonance, and governed system standing.',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    proposedTime: '2026-07-14T10:40:00-05:00',
  },
  {
    actionId: 'launch_cycle_001__measures_registry__youtube__obsidian_chamber_orientation__2026-07-14',
    title: 'Obsidian Chamber Orientation',
    storagePath: 'obsidian_chamber_orientation.mp4',
    mediaRole: 'obsidian',
    description: 'Assessment readiness orientation for the conditions that shape AI behavior.',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    proposedTime: '2026-07-14T11:00:00-05:00',
  },
  {
    actionId: 'launch_cycle_001__measures_registry__youtube__assessment_report_orientation__2026-07-14',
    title: 'Assessment Report Orientation',
    storagePath: 'assessment_report_orientation.mp4',
    mediaRole: 'assessment_report_orientation',
    description: 'A brief orientation before reviewing Measures Registry assessment findings.',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    proposedTime: '2026-07-14T11:20:00-05:00',
  },
];

function loadEnv() {
  const env = { ...process.env };
  for (const file of ['.dev.vars', '.env.local', '.env']) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
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
  const json = await response.json();
  if (json.errors) {
    return { ok: false, status: response.status, errors: json.errors.map((error) => error.message), data: json.data };
  }
  return { ok: response.ok, status: response.status, data: json.data };
}

async function listWorkspace(env, credentialRef) {
  const token = env[credentialRef];
  if (!token) {
    return { credentialRef, present: false, authenticated: false, organizations: [], channels: [] };
  }

  const accountQuery = `query {
    account { id name timezone organizations { id name channelCount } }
  }`;
  const channelsQuery = `query Channels($input: ChannelsInput!) {
    channels(input: $input) {
      id service type name displayName externalLink isDisconnected isLocked organizationId serviceId timezone allowedActions
    }
  }`;

  const accountResult = await gql(token, accountQuery);
  if (!accountResult.ok || !accountResult.data?.account) {
    return {
      credentialRef,
      present: true,
      authenticated: false,
      errors: accountResult.errors || [`http_${accountResult.status}`],
      organizations: [],
      channels: [],
    };
  }

  const organizations = accountResult.data.account.organizations || [];
  const channels = [];
  for (const organization of organizations) {
    const channelResult = await gql(token, channelsQuery, { input: { organizationId: organization.id } });
    for (const channel of channelResult.data?.channels || []) {
      channels.push({ ...channel, credentialRef, organizationName: organization.name });
    }
  }

  return {
    credentialRef,
    present: true,
    authenticated: true,
    accountName: accountResult.data.account.name,
    timezone: accountResult.data.account.timezone,
    organizations,
    channels,
  };
}

function resolveRequiredEndpoints(workspaces) {
  return REQUIRED_ENDPOINTS.map((required) => {
    const workspace = workspaces.find((item) => item.credentialRef === required.credentialRef);
    const candidates = (workspace?.channels || []).filter((channel) => {
      if (channel.service !== required.platform) return false;
      const name = `${channel.name || ''} ${channel.displayName || ''} ${channel.externalLink || ''}`.toLowerCase();
      if (required.endpoint === 'Measures Registry Facebook') return name.includes('measures registry');
      if (required.endpoint === 'unDrifted Facebook') return name.includes('undrifted');
      if (required.endpoint === 'unDrifted X') return name.includes('undrifted');
      if (required.endpoint === 'Measures Registry X') return name.includes('measures_c3') || name.includes('measures');
      if (required.endpoint === 'Measures Registry Instagram') return name.includes('measures_registry');
      if (required.endpoint === 'Measures Registry YouTube') return name.includes('measures registry');
      return false;
    });

    return {
      ...required,
      resolved: candidates.length === 1,
      candidateCount: candidates.length,
      channel: candidates[0] || null,
      holdReason: candidates.length === 1 ? null : `expected_one_channel_found_${candidates.length}`,
    };
  });
}

async function loadCanonicalMedia(env) {
  const client = new Client({ connectionString: env.DATABASE_URL || env.SUPABASE_DB_URL });
  await client.connect();
  const storagePaths = CANONICAL_VIDEO_ORDER.map((item) => item.storagePath);
  const mediaResult = await client.query(
    `select registry_key, encounter_key, campaign_key, media_role, storage_bucket, storage_path, mime_type, sort_order, is_active, metadata
     from public.measures_media_map
     where storage_path = any($1::text[])
     order by sort_order nulls last, storage_path`,
    [storagePaths],
  );
  const distributionResult = await client.query(
    `select distribution_asset_key, platform, distribution_type, status, buffer_export_ready, review_status, payload, metadata
     from public.measures_publication_distribution_asset
     where campaign_id = 'undrifted_issue001_launch_campaign_v1'
     order by distribution_asset_key`,
  );
  const executionResult = await client.query(
    `select distribution_asset_id, execution_status, channel_key, evidence, metadata
     from public.measures_distribution_execution
     order by created_at desc`,
  );
  await client.end();
  return {
    mediaRows: mediaResult.rows,
    distributionAssets: distributionResult.rows,
    existingExecutions: executionResult.rows,
  };
}

function mediaUrl(row) {
  return row?.metadata?.public_url || row?.metadata?.exact_url_seated || null;
}

async function listPostsForChannel(env, credentialRef, organizationId, channelId) {
  const query = `query Posts($input: PostsInput!) {
    posts(input: $input) {
      edges { node { id status schedulingType isCustomScheduled dueAt text channelId channelService externalLink createdAt updatedAt } }
      pageInfo { hasNextPage endCursor }
    }
  }`;
  const result = await gql(env[credentialRef], query, {
    input: {
      organizationId,
      filter: { channelIds: [channelId], status: ['draft', 'scheduled', 'error'] },
    },
  });
  return result.data?.posts?.edges?.map((edge) => edge.node) || [];
}

async function createYoutubeDraft(env, action, channel, mediaRow) {
  const mutation = `mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      __typename
      ... on PostActionSuccess { post { id status schedulingType dueAt text channelId channelService externalLink createdAt updatedAt } }
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
    text: action.description,
    metadata: {
      youtube: {
        title: action.title,
        privacy: 'private',
        categoryId: '27',
        license: 'youtube',
        notifySubscribers: false,
        embeddable: true,
        madeForKids: false,
        isAiGenerated: false,
      },
    },
    channelId: channel.id,
    assets: [{ video: { url: mediaUrl(mediaRow) } }],
    mode: 'addToQueue',
    source: OAR2_PATH,
    aiAssisted: false,
    saveToDraft: true,
  };

  const result = await gql(env.BUFFER_SOCIAL_KEY, mutation, { input });
  return result.data?.createPost || { __typename: 'GraphQLError', message: (result.errors || []).join('; ') || `http_${result.status}` };
}

async function run() {
  const execute = process.argv.includes('--execute');
  const env = loadEnv();
  const workspaces = [];
  for (const credentialRef of ['BUFFER_SOCIAL_KEY', 'BUFFER_PUB2_KEY']) {
    workspaces.push(await listWorkspace(env, credentialRef));
  }

  const endpointMap = resolveRequiredEndpoints(workspaces);
  const channelIds = endpointMap.filter((entry) => entry.channel).map((entry) => entry.channel.id);
  const duplicateChannelIds = [...new Set(channelIds.filter((id, index) => channelIds.indexOf(id) !== index))];

  const registry = await loadCanonicalMedia(env);
  const youtubeEndpoint = endpointMap.find((entry) => entry.endpoint === 'Measures Registry YouTube');
  const existingYoutubePosts = youtubeEndpoint?.resolved
    ? await listPostsForChannel(env, youtubeEndpoint.credentialRef, youtubeEndpoint.channel.organizationId, youtubeEndpoint.channel.id)
    : [];

  const youtubeActions = [];
  for (const action of CANONICAL_VIDEO_ORDER) {
    const mediaRow = registry.mediaRows.find((row) => row.storage_path === action.storagePath);
    const missing = [];
    if (!youtubeEndpoint?.resolved) missing.push('youtube_channel_not_resolved');
    if (!mediaRow) missing.push('media_row_missing');
    if (mediaRow && !mediaRow.is_active) missing.push('media_row_inactive');
    if (mediaRow && !mediaUrl(mediaRow)) missing.push('public_media_url_missing');

    const existingPost = existingYoutubePosts.find((post) => post.text === action.description);
    let bufferResult = null;
    if (existingPost) {
      bufferResult = { __typename: 'ExistingPost', post: existingPost };
    } else if (execute && missing.length === 0) {
      bufferResult = await createYoutubeDraft(env, action, youtubeEndpoint.channel, mediaRow);
    }

    youtubeActions.push({
      ...action,
      endpoint: 'Measures Registry YouTube',
      credentialRef: 'BUFFER_SOCIAL_KEY',
      channelId: youtubeEndpoint?.channel?.id || null,
      channelDisplayName: youtubeEndpoint?.channel?.displayName || null,
      sourceStoragePath: mediaRow?.storage_path || action.storagePath,
      sourceUrl: mediaRow ? mediaUrl(mediaRow) : null,
      mimeType: mediaRow?.mime_type || null,
      thumbnailStatus: 'not_seated_for_this_oar',
      publicationVisibility: 'buffer_draft_private_pending_operator_review',
      operatorAuthorizationStatus: 'not_authorized_to_schedule_or_publish',
      missing,
      bufferDraftId: bufferResult?.post?.id || null,
      bufferStatus: bufferResult?.post?.status || null,
      bufferDueAt: bufferResult?.post?.dueAt || null,
      bufferResultType: bufferResult?.__typename || (execute ? 'not_attempted' : 'dry_run'),
      bufferError: bufferResult?.message || null,
    });
  }

  const socialAssets = registry.distributionAssets.map((asset) => ({
    actionId: `launch_cycle_001__${asset.platform}__${asset.distribution_asset_key}`,
    sourceDistributionAsset: asset.distribution_asset_key,
    platform: asset.platform,
    status: asset.status,
    reviewStatus: asset.review_status,
    bufferExportReady: asset.buffer_export_ready,
    previousBufferDraftId: asset.metadata?.buffer_draft_id || null,
    previousPublicationStatus: asset.metadata?.publication_status || null,
    previousPlatformUrl: asset.metadata?.platform_url || null,
    payloadTitle: asset.payload?.title || null,
    linkDependency: asset.payload?.link_destination || null,
    mediaAttachment: asset.payload?.media_references || [],
    heldReason: asset.metadata?.publication_status
      ? 'already_executed_by_prior_oar_no_duplicate_created'
      : asset.platform === 'website' || asset.platform === 'email' || asset.platform === 'paragraph'
        ? 'not_buffer_endpoint_for_this_oar'
        : asset.payload?.platform_notes?.includes('no reel video file exists')
          ? 'approved_copy_exists_but_required_media_missing'
          : 'requires_endpoint_specific_operator_review_before_new_pub2_or_social_draft',
  }));

  const output = {
    oar2: OAR2_PATH,
    executedAt: EXECUTED_AT,
    mode: execute ? 'execute_drafts_only' : 'dry_run',
    credentialPresence: workspaces.map((workspace) => ({
      credentialRef: workspace.credentialRef,
      present: workspace.present,
      authenticated: workspace.authenticated,
      accountName: workspace.accountName || null,
      timezone: workspace.timezone || null,
      channelCount: workspace.channels.length,
      errors: workspace.errors || [],
    })),
    workspaceCapabilityInventory: workspaces.map((workspace) => ({
      credentialRef: workspace.credentialRef,
      accountName: workspace.accountName || null,
      organizations: workspace.organizations.map((organization) => ({
        organizationId: organization.id,
        organizationName: organization.name,
        channelCount: organization.channelCount,
      })),
      channels: workspace.channels.map((channel) => ({
        channelId: channel.id,
        service: channel.service,
        type: channel.type,
        name: channel.name,
        displayName: channel.displayName,
        externalLink: channel.externalLink,
        isDisconnected: channel.isDisconnected,
        isLocked: channel.isLocked,
        timezone: channel.timezone,
        supportsDraft: channel.allowedActions?.includes('manageUpdates') || false,
        supportsSchedule: channel.allowedActions?.includes('managePostingSchedule') || false,
      })),
    })),
    endpointIdentityMap: endpointMap.map((entry) => ({
      registeredEndpoint: entry.endpoint,
      platform: entry.platform === 'twitter' ? 'x' : entry.platform,
      owningSystem: entry.owner,
      credentialRef: entry.credentialRef,
      channelId: entry.channel?.id || null,
      channelDisplayName: entry.channel?.displayName || null,
      publicHandleOrUrl: entry.channel?.externalLink || entry.channel?.name || null,
      channelActiveState: entry.channel ? !entry.channel.isDisconnected && !entry.channel.isLocked : false,
      channelVerificationDate: EXECUTED_AT.slice(0, 10),
      resolved: entry.resolved,
      holdReason: entry.holdReason,
    })),
    duplicateChannelCheck: {
      duplicateChannelIds,
      passed: duplicateChannelIds.length === 0,
    },
    canonicalYoutubeActions: youtubeActions,
    launchCycle001ReviewQueue: socialAssets,
    knownExcludedMediaIssue: {
      storagePath: 'obsidian-to-marble passage video',
      disposition: 'excluded_by_oar',
      note: 'Registered file exists but media-role naming mismatch remains outside this OAR.',
    },
    disposition: youtubeActions.some((action) => action.bufferDraftId)
      ? 'PARTIALLY READY - SPECIFIC CHANNELS HELD'
      : 'HELD WITH REASON',
  };

  fs.mkdirSync('docs/oar/measures_registry', { recursive: true });
  fs.writeFileSync(
    'docs/oar/measures_registry/buffer_native_publication_execution_review_packet_v1.json',
    `${JSON.stringify(output, null, 2)}\n`,
  );

  console.log(JSON.stringify({
    mode: output.mode,
    credentialPresence: output.credentialPresence,
    endpointCount: output.endpointIdentityMap.length,
    duplicateChannelCheck: output.duplicateChannelCheck,
    youtubeDraftsCreated: youtubeActions.filter((action) => action.bufferDraftId && action.bufferResultType === 'PostActionSuccess').length,
    youtubeDraftsExisting: youtubeActions.filter((action) => action.bufferResultType === 'ExistingPost').length,
    youtubeHeld: youtubeActions.filter((action) => !action.bufferDraftId).map((action) => ({ actionId: action.actionId, missing: action.missing, error: action.bufferError })),
    reviewPacket: 'docs/oar/measures_registry/buffer_native_publication_execution_review_packet_v1.json',
    disposition: output.disposition,
  }, null, 2));
}

run().catch((error) => {
  console.error(JSON.stringify({ fatal: error.message }, null, 2));
  process.exitCode = 1;
});
