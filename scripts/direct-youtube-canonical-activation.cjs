#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Client } = require('pg');

const OAR2_PATH = 'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md';
const REPORT_JSON = 'docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.json';
const REPORT_MD = 'docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.md';
const NOW = new Date().toISOString();
const CHANNEL_ID = 'UC84Jbvswj0ykzd5nuKxoNSA';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const VIDEOS_INSERT_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';
const PLAYLIST_INSERT_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const THUMBNAIL_SET_URL = 'https://www.googleapis.com/upload/youtube/v3/thumbnails/set';

const CANONICAL_ASSETS = [
  {
    actionId: 'direct_youtube__measures_registry__about_measures_registry__v1',
    title: 'About Measures Registry',
    storagePath: 'about_measures_registry.mp4',
    mediaRole: 'about_measures_registry_video',
    description: 'Shared systems governance for institutions deploying AI.',
    proposedVisibility: 'private',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    order: 1,
  },
  {
    actionId: 'direct_youtube__measures_registry__ai_isnt_broken_intro__v1',
    title: "AI Isn't Broken",
    storagePath: 'ai_isnt_broken_intro.mp4',
    mediaRole: 'intro_hook_video',
    description: "AI isn't broken. Systems are. Responsible AI deployment requires governable systems.",
    proposedVisibility: 'private',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    order: 2,
  },
  {
    actionId: 'direct_youtube__measures_registry__crystal_seat_orientation__v1',
    title: 'Crystal Seat Orientation',
    storagePath: 'crystal_seat_orientation.mp4',
    mediaRole: 'measures_position',
    description: 'Measures Registry orientation for coherence, resonance, and governed system standing.',
    proposedVisibility: 'private',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    order: 3,
  },
  {
    actionId: 'direct_youtube__measures_registry__obsidian_chamber_orientation__v1',
    title: 'Obsidian Chamber Orientation',
    storagePath: 'obsidian_chamber_orientation.mp4',
    mediaRole: 'obsidian',
    description: 'Assessment readiness orientation for the conditions that shape AI behavior.',
    proposedVisibility: 'private',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    order: 4,
  },
  {
    actionId: 'direct_youtube__measures_registry__assessment_report_orientation__v1',
    title: 'Assessment Report Orientation',
    storagePath: 'assessment_report_orientation.mp4',
    mediaRole: 'assessment_report_orientation',
    description: 'A brief orientation before reviewing Measures Registry assessment findings.',
    proposedVisibility: 'private',
    playlistRecommendation: 'Measures Registry Canonical Orientation',
    order: 5,
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

function credentialAssessment(env) {
  const names = [
    'YOUTUBE_CLIENT_ID',
    'YOUTUBE_CLIENT_SECRET',
    'YOUTUBE_REFRESH_TOKEN',
    'YOUTUBE_ACCESS_TOKEN',
    'YOUTUBE_CHANNEL_ID',
    'YOUTUBE_PLAYLIST_ID',
  ];
  const presence = Object.fromEntries(names.map((name) => [name, Boolean(env[name])]));
  const uploadReady = Boolean(
    env.YOUTUBE_ACCESS_TOKEN || (env.YOUTUBE_CLIENT_ID && env.YOUTUBE_CLIENT_SECRET && env.YOUTUBE_REFRESH_TOKEN),
  );
  return {
    requiredBoundary: 'OAuth 2.0 user authorization for the Measures Registry YouTube channel',
    expectedScope: 'https://www.googleapis.com/auth/youtube.upload for upload; https://www.googleapis.com/auth/youtube or youtube.force-ssl for playlist/thumbnail operations',
    channelIdExpected: CHANNEL_ID,
    credentialPresence: presence,
    uploadReady,
    channelIdMatchesKnownMeasuresRegistryChannel: !env.YOUTUBE_CHANNEL_ID || env.YOUTUBE_CHANNEL_ID === CHANNEL_ID,
    blocker: uploadReady ? null : 'missing_youtube_oauth_upload_credentials',
  };
}

async function loadRegistry(env) {
  const client = new Client({ connectionString: env.DATABASE_URL || env.SUPABASE_DB_URL });
  await client.connect();
  const media = await client.query(
    `select registry_key, encounter_key, campaign_key, media_role, storage_bucket, storage_path, mime_type, sort_order, is_active, metadata
     from public.measures_media_map
     where storage_path = any($1::text[])
     order by sort_order nulls last, storage_path`,
    [CANONICAL_ASSETS.map((asset) => asset.storagePath)],
  );
  const executions = await client.query(
    `select distribution_asset_id, execution_status, attempt_number, evidence, error, platform_url, platform_post_id, published_at, metadata
     from public.measures_distribution_execution
     where distribution_asset_id like 'measures_canonical_youtube_%'
     order by created_at desc`,
  );
  await client.end();
  return { mediaRows: media.rows, bufferEvidence: executions.rows };
}

function mediaUrl(row) {
  return row?.metadata?.public_url || row?.metadata?.exact_url_seated || null;
}

async function accessToken(env) {
  if (env.YOUTUBE_ACCESS_TOKEN) return env.YOUTUBE_ACCESS_TOKEN;
  const body = new URLSearchParams({
    client_id: env.YOUTUBE_CLIENT_ID,
    client_secret: env.YOUTUBE_CLIENT_SECRET,
    refresh_token: env.YOUTUBE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await response.json();
  if (!response.ok || !json.access_token) {
    throw new Error(`youtube_oauth_token_failed:${json.error || response.status}`);
  }
  return json.access_token;
}

async function downloadMedia(url, storagePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`media_download_failed:${response.status}:${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const file = path.join(os.tmpdir(), `measures-registry-${Date.now()}-${path.basename(storagePath)}`);
  fs.writeFileSync(file, buffer);
  return { file, size: buffer.length };
}

async function uploadVideo(token, action, mediaRow, env) {
  const url = mediaUrl(mediaRow);
  const downloaded = await downloadMedia(url, action.storagePath);
  const metadata = {
    snippet: {
      title: action.title,
      description: action.description,
      categoryId: '27',
    },
    status: {
      privacyStatus: action.proposedVisibility,
      madeForKids: false,
      selfDeclaredMadeForKids: false,
    },
  };

  const init = await fetch(`${VIDEOS_INSERT_URL}?uploadType=resumable&part=snippet,status`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': String(downloaded.size),
      'X-Upload-Content-Type': mediaRow.mime_type || 'video/mp4',
    },
    body: JSON.stringify(metadata),
  });
  if (!init.ok || !init.headers.get('location')) {
    const text = await init.text();
    throw new Error(`youtube_upload_session_failed:${init.status}:${text.slice(0, 300)}`);
  }

  const upload = await fetch(init.headers.get('location'), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': mediaRow.mime_type || 'video/mp4',
      'Content-Length': String(downloaded.size),
    },
    body: fs.readFileSync(downloaded.file),
  });
  fs.rmSync(downloaded.file, { force: true });
  const video = await upload.json();
  if (!upload.ok || !video.id) {
    throw new Error(`youtube_upload_failed:${upload.status}:${JSON.stringify(video).slice(0, 300)}`);
  }

  const playlist = env.YOUTUBE_PLAYLIST_ID ? await addToPlaylist(token, env.YOUTUBE_PLAYLIST_ID, video.id) : null;
  return {
    youtubeVideoId: video.id,
    publicUrl: `https://www.youtube.com/watch?v=${video.id}`,
    publicationTimestamp: video.snippet?.publishedAt || new Date().toISOString(),
    publicationStatus: video.status?.privacyStatus || action.proposedVisibility,
    playlist,
  };
}

async function addToPlaylist(token, playlistId, videoId) {
  const response = await fetch(`${PLAYLIST_INSERT_URL}?part=snippet,status`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: { kind: 'youtube#video', videoId },
      },
    }),
  });
  const json = await response.json();
  if (!response.ok) return { playlistId, status: 'failed', error: JSON.stringify(json).slice(0, 300) };
  return { playlistId, status: 'inserted', playlistItemId: json.id || null };
}

function evidenceDesign(action, result) {
  return {
    registryTarget: 'public.measures_distribution_execution plus measures_publication_distribution_asset.metadata',
    idempotencyKey: action.actionId,
    evidenceFields: {
      youtube_video_id: result?.youtubeVideoId || null,
      public_url: result?.publicUrl || null,
      publication_timestamp: result?.publicationTimestamp || null,
      playlist: result?.playlist || action.playlistRecommendation,
      publication_status: result?.publicationStatus || 'held',
      executor: 'Cody',
      execution_mode: 'direct_youtube_api',
      evidence_timestamp: NOW,
    },
  };
}

function markdown(report) {
  const rows = report.activationPlan.map((item) => `| ${item.title} | ${item.storagePath} | ${item.sourceUrl || 'held'} | ${item.status} | ${item.blocker || ''} |`).join('\n');
  return `---\ndocument_type: direct_youtube_activation_plan\ndocument_scope: canonical_youtube_activation\nsource_oar2: ${OAR2_PATH}\ngenerated_at: ${report.generatedAt}\ndisposition: ${report.finalDisposition}\n---\n\n# Direct Canonical YouTube Activation Plan\n\n## Capability Assessment\n\nDirect YouTube publication should use the YouTube Data API videos.insert upload path with OAuth 2.0 user authorization for the Measures Registry YouTube channel. Buffer remains downstream distribution only.\n\nCredential blocker: ${report.capabilityAssessment.blocker || 'none'}\n\n## Canonical Activation Plan\n\n| Title | File | Source URL | Status | Blocker |\n|---|---|---|---|---|\n${rows}\n\n## Registry Evidence Design\n\nEvidence is recorded after a YouTube video ID and public URL exist. Upload completion alone is not final publication evidence.\n\n## Final Disposition\n\n${report.finalDisposition}\n`;
}

async function run() {
  const execute = process.argv.includes('--execute');
  const env = loadEnv();
  const capabilityAssessment = credentialAssessment(env);
  const registry = await loadRegistry(env);
  let token = null;
  if (execute && capabilityAssessment.uploadReady) token = await accessToken(env);

  const activationPlan = [];
  for (const action of CANONICAL_ASSETS) {
    const mediaRow = registry.mediaRows.find((row) => row.storage_path === action.storagePath);
    const blockers = [];
    if (!mediaRow) blockers.push('media_row_missing');
    if (mediaRow && !mediaRow.is_active) blockers.push('media_row_inactive');
    if (mediaRow && !mediaUrl(mediaRow)) blockers.push('source_public_url_missing');
    if (!capabilityAssessment.uploadReady) blockers.push('missing_youtube_oauth_upload_credentials');

    let result = null;
    let error = null;
    if (execute && token && blockers.length === 0) {
      try {
        result = await uploadVideo(token, action, mediaRow, env);
      } catch (err) {
        error = err.message;
      }
    }

    activationPlan.push({
      ...action,
      channelId: CHANNEL_ID,
      sourceUrl: mediaRow ? mediaUrl(mediaRow) : null,
      mimeType: mediaRow?.mime_type || null,
      status: result ? 'uploaded_pending_registry_confirmation' : 'held',
      blocker: error || blockers.join('; ') || null,
      result,
      evidenceDesign: evidenceDesign(action, result),
    });
  }

  const report = {
    sourceOar2: OAR2_PATH,
    generatedAt: NOW,
    researchedSources: [
      'https://developers.google.com/youtube/v3/guides/uploading_a_video',
      'https://developers.google.com/youtube/v3/docs/videos/insert',
      'https://developers.google.com/youtube/v3/docs/playlistItems/insert',
      'https://developers.google.com/youtube/v3/docs/thumbnails/set',
    ],
    capabilityAssessment,
    recommendedGovernedUploadPath: {
      path: 'Canonical Video -> YouTube Data API videos.insert -> Registry Evidence -> Buffer Distribution',
      directUploadMethod: 'resumable upload through YouTube Data API videos.insert',
      defaultVisibility: 'private until operator confirms publication state',
      playlistMethod: 'playlistItems.insert after video ID exists and playlist ID is authorized',
      thumbnailMethod: 'thumbnails.set only when a seated thumbnail file exists',
      serviceAccountsAllowed: false,
      note: 'YouTube upload modifies a channel and requires OAuth user authorization for the channel owner/delegate.',
    },
    activationPlan,
    bufferRelationship: {
      role: 'downstream_distribution_scheduler',
      mayReferenceCanonicalYoutubeUrlAfterPublication: true,
      noLongerCanonicalUploadPath: true,
    },
    finalDisposition: activationPlan.every((item) => item.status !== 'held') ? 'DIRECT YOUTUBE ACTIVATION READY' : 'HELD WITH REASON',
  };

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(REPORT_MD, markdown(report));
  console.log(JSON.stringify({
    report: REPORT_MD,
    reportJson: REPORT_JSON,
    uploadReady: capabilityAssessment.uploadReady,
    activationItems: activationPlan.length,
    heldItems: activationPlan.filter((item) => item.status === 'held').length,
    disposition: report.finalDisposition,
    blocker: capabilityAssessment.blocker,
  }, null, 2));
}

run().catch((error) => {
  console.error(JSON.stringify({ fatal: error.message }, null, 2));
  process.exitCode = 1;
});
