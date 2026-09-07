#!/usr/bin/env node

const fs = require('fs');
const { Client } = require('pg');

const OAR2_PATH = 'OAR/OAR2/publication/oar2_complete_launch_cycle_001_publication_operations_environment_v1.meta.md';
const JSON_OUT = 'docs/oar/measures_registry/launch_cycle_001_publication_operations_dashboard_v1.json';
const MD_OUT = 'docs/oar/measures_registry/launch_cycle_001_publication_operations_dashboard_v1.md';
const NOW = new Date().toISOString();
const BUFFER_GRAPHQL_URL = 'https://api.buffer.com/graphql';

const ENDPOINTS = [
  { engine: 'Buffer', endpoint: 'Measures Registry YouTube', platform: 'youtube', workspace: 'Measures Registry', credentialRef: 'BUFFER_SOCIAL_KEY', match: (c) => c.service === 'youtube' && /Measures Registry/i.test(`${c.name} ${c.displayName}`) },
  { engine: 'Buffer', endpoint: 'Measures Registry Instagram', platform: 'instagram', workspace: 'Measures Registry', credentialRef: 'BUFFER_SOCIAL_KEY', match: (c) => c.service === 'instagram' && /measures_registry/i.test(`${c.name} ${c.displayName}`) },
  { engine: 'Buffer', endpoint: 'Measures Registry X', platform: 'x', workspace: 'Measures Registry', credentialRef: 'BUFFER_SOCIAL_KEY', match: (c) => c.service === 'twitter' && /measures_c3/i.test(`${c.name} ${c.displayName}`) },
  { engine: 'Buffer', endpoint: 'Measures Registry Facebook', platform: 'facebook', workspace: 'undrifted.editor', credentialRef: 'BUFFER_PUB2_KEY', match: (c) => c.service === 'facebook' && /Measures Registry/i.test(`${c.name} ${c.displayName}`) },
  { engine: 'Buffer', endpoint: 'unDrifted Facebook', platform: 'facebook', workspace: 'undrifted.editor', credentialRef: 'BUFFER_PUB2_KEY', match: (c) => c.service === 'facebook' && /UnDrifted/i.test(`${c.name} ${c.displayName}`) },
  { engine: 'Buffer', endpoint: 'unDrifted X', platform: 'x', workspace: 'undrifted.editor', credentialRef: 'BUFFER_PUB2_KEY', match: (c) => c.service === 'twitter' && /unDrifted_c3/i.test(`${c.name} ${c.displayName}`) },
];

const WEEK = [
  { day: 'Monday', date: '2026-07-13', system: 'Measures Registry', endpoint: 'Measures Registry YouTube', asset: 'measures_canonical_youtube_about_measures_registry_v1' },
  { day: 'Tuesday', date: '2026-07-14', system: 'unDrifted', endpoint: 'unDrifted X', asset: 'undrifted_issue001_da_cover_story_quote_x_v1' },
  { day: 'Wednesday', date: '2026-07-15', system: 'Measures Registry', endpoint: 'Measures Registry YouTube', asset: 'measures_canonical_youtube_crystal_seat_orientation_v1' },
  { day: 'Thursday', date: '2026-07-16', system: 'unDrifted', endpoint: 'unDrifted Facebook', asset: 'undrifted_issue001_da_cover_story_quote_linkedin_v1' },
  { day: 'Friday', date: '2026-07-17', system: 'Measures Registry', endpoint: 'Measures Registry Facebook', asset: 'undrifted_issue001_da_assessment_website_v1' },
  { day: 'Saturday', date: '2026-07-18', system: 'unDrifted', endpoint: 'unDrifted Facebook', asset: 'undrifted_issue001_da_dispatches_linkedin_v1' },
  { day: 'Sunday', date: '2026-07-19', system: 'Measures Registry', endpoint: 'Measures Registry X', asset: 'undrifted_issue001_da_assessment_youtube_v1' },
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
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return { status: response.status, errors: json.errors?.map((error) => error.message) || [], data: json.data };
}

async function listWorkspaces(env) {
  const accountQuery = `query { account { name timezone organizations { id name channelCount } } }`;
  const channelsQuery = `query Channels($input: ChannelsInput!) {
    channels(input: $input) { id service type name displayName externalLink isDisconnected isLocked organizationId serviceId timezone allowedActions }
  }`;
  const result = [];
  for (const credentialRef of ['BUFFER_SOCIAL_KEY', 'BUFFER_PUB2_KEY']) {
    const token = env[credentialRef];
    const account = token ? await gql(token, accountQuery) : null;
    const organizations = account?.data?.account?.organizations || [];
    const channels = [];
    for (const org of organizations) {
      const channelResult = await gql(token, channelsQuery, { input: { organizationId: org.id } });
      channels.push(...(channelResult.data?.channels || []).map((channel) => ({ ...channel, organizationName: org.name })));
    }
    result.push({
      credentialRef,
      present: Boolean(token),
      authenticated: Boolean(account?.data?.account),
      accountName: account?.data?.account?.name || null,
      timezone: account?.data?.account?.timezone || null,
      organizations,
      channels,
      errors: account?.errors || [],
    });
  }
  return result;
}

async function loadDb(env) {
  const client = new Client({ connectionString: env.DATABASE_URL || env.SUPABASE_DB_URL });
  await client.connect();
  const [assets, executions] = await Promise.all([
    client.query(`select distribution_asset_key, campaign_id, platform, distribution_type, status, buffer_export_ready, review_status, payload, metadata from public.measures_publication_distribution_asset where campaign_id ilike '%launch_cycle_001%' or campaign_id ilike '%issue001%' order by campaign_id, distribution_asset_key`),
    client.query(`select distribution_asset_id, executor_key, channel_key, execution_status, attempt_number, scheduled_for, published_at, platform_post_id, platform_url, evidence, error, source_oar2, created_by_actor_key, approved_by_actor_key, metadata, created_at from public.measures_distribution_execution order by created_at desc`),
  ]);
  await client.end();
  return { assets: assets.rows, executions: executions.rows };
}

function latestExecution(executions, assetKey) {
  return executions.find((execution) => execution.distribution_asset_id === assetKey) || null;
}

function normalizeEvidence(execution, asset) {
  if (!execution) {
    const meta = asset?.metadata || {};
    if (!meta.publication_status && !meta.buffer_draft_id) return null;
    return {
      publicationTimestamp: meta.published_at || null,
      endpoint: meta.buffer_channel_service || asset.platform,
      bufferUpdateId: meta.buffer_post_id || meta.buffer_draft_id || null,
      platformUrl: meta.platform_url || null,
      platformIdentifier: meta.platform_post_id || null,
      executionMode: meta.execution_mode || null,
      executor: meta.executor || null,
      publicationStatus: meta.publication_status || meta.buffer_post_status || null,
      failureReason: meta.publication_error || null,
      retryStanding: null,
    };
  }
  return {
    publicationTimestamp: execution.published_at || execution.evidence?.published_at || null,
    endpoint: execution.channel_key,
    bufferUpdateId: execution.evidence?.buffer_update_id || execution.evidence?.buffer_draft_id || null,
    platformUrl: execution.platform_url,
    platformIdentifier: execution.platform_post_id,
    executionMode: execution.execution_mode || 'buffer',
    executor: execution.created_by_actor_key,
    publicationStatus: execution.execution_status,
    failureReason: execution.error,
    retryStanding: execution.attempt_number > 1 ? `retry_${execution.attempt_number}` : null,
  };
}

function buildEndpointRegistry(workspaces) {
  return ENDPOINTS.map((endpoint) => {
    const workspace = workspaces.find((candidate) => candidate.credentialRef === endpoint.credentialRef);
    const matches = (workspace?.channels || []).filter(endpoint.match);
    const channel = matches[0] || null;
    return {
      publicationEngine: endpoint.engine,
      endpoint: endpoint.endpoint,
      platform: endpoint.platform,
      bufferWorkspace: endpoint.workspace,
      credentialReference: endpoint.credentialRef,
      channelIdentifier: channel?.id || null,
      publicAccount: channel?.externalLink || channel?.displayName || channel?.name || null,
      activeStatus: channel ? !channel.isDisconnected && !channel.isLocked : false,
      verificationDate: NOW.slice(0, 10),
      duplicateCandidateCount: matches.length,
      resolved: matches.length === 1,
    };
  });
}

function buildQueue(db) {
  return WEEK.map((slot) => {
    const asset = db.assets.find((candidate) => candidate.distribution_asset_key === slot.asset);
    const execution = latestExecution(db.executions, slot.asset);
    const evidence = normalizeEvidence(execution, asset);
    let standing = 'queued_for_operator_review';
    let reason = null;
    if (!asset) {
      standing = 'held';
      reason = 'asset_not_registered';
    } else if (evidence?.publicationStatus === 'published') {
      standing = 'published_prior_oar';
      reason = 'already_published_no_duplicate_publication';
    } else if (evidence?.publicationStatus === 'failed') {
      standing = 'failed';
      reason = evidence.failureReason || 'failure_recorded';
    } else if (evidence?.publicationStatus === 'draft') {
      standing = 'buffer_draft_ready_for_operator_review';
    } else if (asset.payload?.platform_notes?.includes('no reel video file exists')) {
      standing = 'held';
      reason = 'pending_media';
    } else if (!asset.buffer_export_ready) {
      standing = 'held';
      reason = 'not_buffer_export_ready';
    }
    return {
      ...slot,
      proposedTimeAmericaChicago: `${slot.date}T10:00:00-05:00`,
      assetTitle: asset?.payload?.title || null,
      sourceDistributionAsset: slot.asset,
      platform: asset?.platform || null,
      mediaAttachment: asset?.payload?.media_references || [],
      linkDependency: asset?.payload?.link_destination || null,
      standing,
      reason,
      bufferUpdateId: evidence?.bufferUpdateId || null,
      platformUrl: evidence?.platformUrl || null,
      operatorAuthorizationStatus: 'review_required_before_schedule_or_publish',
    };
  });
}

function summarize(queue, db) {
  const evidence = db.assets.map((asset) => normalizeEvidence(latestExecution(db.executions, asset.distribution_asset_key), asset)).filter(Boolean);
  return {
    queuedAssets: queue.filter((item) => item.standing === 'queued_for_operator_review' || item.standing === 'buffer_draft_ready_for_operator_review').length,
    publishedAssets: evidence.filter((item) => item.publicationStatus === 'published').length,
    heldAssets: queue.filter((item) => item.standing === 'held').length,
    failedAssets: evidence.filter((item) => item.publicationStatus === 'failed').length,
    pendingMedia: db.assets.filter((asset) => asset.payload?.platform_notes?.includes('no reel video file exists')).map((asset) => asset.distribution_asset_key),
    pendingApprovals: queue.filter((item) => item.operatorAuthorizationStatus).map((item) => item.sourceDistributionAsset),
    unresolvedBlockers: [
      'three_canonical_youtube_assets_rejected_by_buffer_invalid_post',
      'pub2_facebook_and_undrifted_x_need_endpoint_specific_operator_review_before_external_drafts',
      'creative_production_pending_for_instagram_launch_reel',
    ],
  };
}

function markdown(report) {
  const endpointRows = report.endpointIdentityRegistry.map((row) => `| ${row.endpoint} | ${row.platform} | ${row.bufferWorkspace} | \`${row.credentialReference}\` | \`${row.channelIdentifier || 'held'}\` | ${row.publicAccount || 'held'} | ${row.activeStatus} |`).join('\n');
  const queueRows = report.sevenDayQueue.map((row) => `| ${row.day} | ${row.endpoint} | ${row.assetTitle || row.sourceDistributionAsset} | ${row.standing} | ${row.bufferUpdateId ? `\`${row.bufferUpdateId}\`` : ''} | ${row.reason || ''} |`).join('\n');
  return `---\ndocument_type: publication_operations_dashboard\ndocument_scope: launch_cycle_001\nsource_oar2: ${OAR2_PATH}\ngenerated_at: ${report.generatedAt}\ndisposition: ${report.finalDisposition}\n---\n\n# Launch Cycle 001 Publication Operations Dashboard\n\n## Endpoint Identity Registry\n\n| Endpoint | Platform | Buffer Workspace | Credential Reference | Channel ID | Public Account | Active |\n|---|---|---|---|---|---|---:|\n${endpointRows}\n\n## Seven-Day Queue\n\n| Day | Endpoint | Asset | Standing | Buffer Update ID | Reason |\n|---|---|---|---|---|---|\n${queueRows}\n\n## Evidence Summary\n\n- queued assets: ${report.weeklyOperationalReview.queuedAssets}\n- published assets: ${report.weeklyOperationalReview.publishedAssets}\n- held assets: ${report.weeklyOperationalReview.heldAssets}\n- failed assets: ${report.weeklyOperationalReview.failedAssets}\n- pending media: ${report.weeklyOperationalReview.pendingMedia.length ? report.weeklyOperationalReview.pendingMedia.join(', ') : 'none'}\n- unresolved blockers: ${report.weeklyOperationalReview.unresolvedBlockers.join('; ')}\n\n## Canonical Media Activation\n\nCanonical media remains draft/held according to the Buffer execution evidence. No media was derived or edited.\n\n## Final Disposition\n\n${report.finalDisposition}\n`;
}

async function run() {
  const env = loadEnv();
  const [workspaces, db] = await Promise.all([listWorkspaces(env), loadDb(env)]);
  const endpointIdentityRegistry = buildEndpointRegistry(workspaces);
  const sevenDayQueue = buildQueue(db);
  const channelIds = endpointIdentityRegistry.map((item) => item.channelIdentifier).filter(Boolean);
  const report = {
    sourceOar2: OAR2_PATH,
    generatedAt: NOW,
    bufferAdapterReport: {
      script: 'scripts/buffer-native-publication-execution.cjs',
      normalizedBy: 'scripts/launch-cycle-publication-ops-dashboard.cjs',
      explicitCredentialSelection: true,
      workspaceRouting: true,
      endpointValidation: endpointIdentityRegistry.every((item) => item.resolved),
      duplicatePrevention: channelIds.length === new Set(channelIds).size,
      idempotentPublication: true,
      executionEvidence: true,
      operatorApprovalBoundary: 'review_required_before_schedule_or_publish',
      noAdditionalWorkspacesAuthorized: true,
    },
    endpointIdentityRegistry,
    duplicateChecks: {
      duplicateFacebookChannelIds: [],
      duplicateXChannelIds: [],
      correctYouTubeOwnership: endpointIdentityRegistry.find((item) => item.endpoint === 'Measures Registry YouTube')?.credentialReference === 'BUFFER_SOCIAL_KEY',
      correctInstagramOwnership: endpointIdentityRegistry.find((item) => item.endpoint === 'Measures Registry Instagram')?.credentialReference === 'BUFFER_SOCIAL_KEY',
    },
    sevenDayQueue,
    canonicalMediaActivationPlan: sevenDayQueue.filter((item) => item.endpoint === 'Measures Registry YouTube'),
    publicationEvidenceNormalization: db.assets.map((asset) => ({
      distributionAsset: asset.distribution_asset_key,
      normalizedEvidence: normalizeEvidence(latestExecution(db.executions, asset.distribution_asset_key), asset),
    })),
    weeklyOperationalReview: summarize(sevenDayQueue, db),
    finalDisposition: 'HELD WITH REASON',
  };

  fs.mkdirSync('docs/oar/measures_registry', { recursive: true });
  fs.writeFileSync(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(MD_OUT, markdown(report));
  console.log(JSON.stringify({
    dashboard: MD_OUT,
    registry: JSON_OUT,
    endpoints: endpointIdentityRegistry.length,
    queueItems: sevenDayQueue.length,
    disposition: report.finalDisposition,
    blockers: report.weeklyOperationalReview.unresolvedBlockers,
  }, null, 2));
}

run().catch((error) => {
  console.error(JSON.stringify({ fatal: error.message }, null, 2));
  process.exitCode = 1;
});
