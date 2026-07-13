#!/usr/bin/env node

const fs = require("fs")

const OAR2_PATH =
  "docs/oar/measures_registry/oar2_activate_undrifted_issue_01_and_complete_launch_cycle_001_distribution_v1.meta.md"
const BUFFER_GRAPHQL_URL = "https://api.buffer.com/graphql"
const EXECUTED_AT = new Date().toISOString()

function loadEnv() {
  const env = { ...process.env }
  for (const file of [".dev.vars", ".env.local", ".env"]) {
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!match) continue
      env[match[1]] = match[2].replace(/^['"]|['"]$/g, "")
    }
  }
  return env
}

async function gql(token, query, variables) {
  const response = await fetch(BUFFER_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await response.json().catch(() => null)
  if (!response.ok || json?.errors) {
    return {
      ok: false,
      status: response.status,
      errors: json?.errors?.map((error) => error.message) || [`http_${response.status}`],
      data: json?.data,
    }
  }
  return { ok: true, status: response.status, data: json.data }
}

async function listWorkspace(env, credentialRef) {
  const token = env[credentialRef]
  if (!token) return { credentialRef, present: false, authenticated: false, organizations: [], channels: [] }

  const accountQuery = `query {
    account { id name timezone organizations { id name channelCount } }
  }`
  const channelsQuery = `query Channels($input: ChannelsInput!) {
    channels(input: $input) {
      id service type name displayName externalLink isDisconnected isLocked organizationId timezone allowedActions
    }
  }`

  const accountResult = await gql(token, accountQuery)
  if (!accountResult.ok || !accountResult.data?.account) {
    return {
      credentialRef,
      present: true,
      authenticated: false,
      errors: accountResult.errors || [`http_${accountResult.status}`],
      organizations: [],
      channels: [],
    }
  }

  const channels = []
  for (const organization of accountResult.data.account.organizations || []) {
    const channelResult = await gql(token, channelsQuery, { input: { organizationId: organization.id } })
    for (const channel of channelResult.data?.channels || []) {
      channels.push({ ...channel, credentialRef, organizationName: organization.name })
    }
  }

  return {
    credentialRef,
    present: true,
    authenticated: true,
    accountName: accountResult.data.account.name,
    timezone: accountResult.data.account.timezone,
    organizations: accountResult.data.account.organizations || [],
    channels,
  }
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim()
}

function withUrl(copy, url) {
  return `${normalizeText(copy)}\n\n${url}`
}

const ROUTES = {
  fieldFindings: "https://measuresregistry.com/undrifted/field-findings-2026-w28",
  response: "https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems",
  issue: "https://measuresregistry.com/undrifted",
}

const FINAL_GATES = {
  publication_002: {
    disposition: "held_ambiguous",
    reason: "publication_002_final_gate_failed_paragraph_missing_publication_001_dependency",
  },
}

const RETRACTED_BUFFER_POSTS = {
  launch_cycle_001__fb_undrifted__publication_002: [
    {
      bufferId: "6a552131e236ed1c4722aced",
      retractionStatus: "DeletePostSuccess",
      retractedAt: "2026-07-13T17:47:00.000Z",
    },
  ],
  launch_cycle_001__fb_mr__institutional_ack: [
    {
      bufferId: "6a55213203ce9f97905a1264",
      retractionStatus: "DeletePostSuccess",
      retractedAt: "2026-07-13T17:47:00.000Z",
    },
  ],
}

const DERIVATIVES = [
  {
    assetId: "launch_cycle_001__x_undrifted__publication_001",
    identity: "unDrifted",
    platform: "x",
    credentialRef: "BUFFER_PUB2_KEY",
    channelMatch: (channel) => channel.service === "twitter" && /undrifted/i.test(channel.name || channel.displayName || ""),
    targetUrl: ROUTES.fieldFindings,
    proposedTime: "2026-07-13T10:00:00-05:00",
    copy: `Five sources this week. One pattern. Enterprise AI incidents keep getting classified as security failures,
access failures, traceability failures. They're the same failure, seen from different angles: institutions
assigning autonomous capability faster than they're governing it. Our first Field Findings sweep 🧵`,
  },
  {
    assetId: "launch_cycle_001__x_undrifted__publication_002",
    identity: "unDrifted",
    platform: "x",
    credentialRef: "BUFFER_PUB2_KEY",
    channelMatch: (channel) => channel.service === "twitter" && /undrifted/i.test(channel.name || channel.displayName || ""),
    targetUrl: ROUTES.response,
    finalGate: "publication_002",
    proposedTime: "2026-07-13T13:00:00-05:00",
    copy: `"AI agents are not entering empty systems. They are entering organizations already composed of fragmented
procedures, inherited permissions, unclear ownership... An agent does not remove those conditions. It acts
through them." Our response to this week's Field Findings 🧵`,
  },
  {
    assetId: "launch_cycle_001__fb_undrifted__publication_001",
    identity: "unDrifted",
    platform: "facebook",
    credentialRef: "BUFFER_PUB2_KEY",
    channelMatch: (channel) => channel.service === "facebook" && /undrifted/i.test(channel.name || channel.displayName || ""),
    targetUrl: ROUTES.fieldFindings,
    proposedTime: "2026-07-13T11:00:00-05:00",
    copy: `We ran our first weekly Field Findings sweep this week — five independent sources (Carnegie Endowment, The
Register, Google Cloud, CSA/Zenity, NIST), all converging on the same underlying condition in enterprise AI
deployment. Here's what we found, and why we think the usual classifications (security failure, access
failure, traceability failure) are missing the structural pattern underneath.`,
  },
  {
    assetId: "launch_cycle_001__fb_undrifted__publication_002",
    identity: "unDrifted",
    platform: "facebook",
    credentialRef: "BUFFER_PUB2_KEY",
    channelMatch: (channel) => channel.service === "facebook" && /undrifted/i.test(channel.name || channel.displayName || ""),
    targetUrl: ROUTES.response,
    finalGate: "publication_002",
    proposedTime: "2026-07-13T14:00:00-05:00",
    copy: `This week's unDrifted Response: the AI agent security conversation keeps asking "how do we control the
agent?" We think that's the wrong first question. The right first question is whether the environment the
agent is entering was ever governable to begin with. Read our full response.`,
  },
  {
    assetId: "launch_cycle_001__x_mr__institutional_ack",
    identity: "Measures Registry",
    platform: "x",
    credentialRef: "BUFFER_SOCIAL_KEY",
    channelMatch: (channel) => channel.service === "twitter" && /measures/i.test(channel.name || channel.displayName || ""),
    targetUrl: ROUTES.issue,
    finalGate: "publication_002",
    proposedTime: "2026-07-15T10:00:00-05:00",
    copy: `Measures Registry notes unDrifted's first Field Findings sweep and accompanying Response as an editorial
contribution to the Field, developed under unDrifted's autonomous publication authority. The Response's
central claim — that environments must be measured before autonomous capability is assigned within them —
reflects Measures Registry's own operational premise, but this acknowledgement does not itself constitute a
Measures Registry methodology change, assessment finding, or institutional position on any named
organization discussed in either publication. Measures Registry Review of MAP, Foundations Educational
Module, SEAT, and Computational Systems Governance implications is tracked separately at
docs/_source/codex/publications/measures_registry_review_launch_cycle_001.meta.md and remains its own,
distinct governed record.`,
  },
  {
    assetId: "launch_cycle_001__fb_mr__institutional_ack",
    identity: "Measures Registry",
    platform: "facebook",
    credentialRef: "BUFFER_PUB2_KEY",
    channelMatch: (channel) => channel.service === "facebook" && /measures/i.test(channel.name || channel.displayName || ""),
    targetUrl: ROUTES.issue,
    finalGate: "publication_002",
    proposedTime: "2026-07-15T11:00:00-05:00",
    copy: `Measures Registry notes unDrifted's first Field Findings sweep and accompanying Response as an editorial
contribution to the Field, developed under unDrifted's autonomous publication authority. The Response's
central claim — that environments must be measured before autonomous capability is assigned within them —
reflects Measures Registry's own operational premise, but this acknowledgement does not itself constitute a
Measures Registry methodology change, assessment finding, or institutional position on any named
organization discussed in either publication. Measures Registry Review of MAP, Foundations Educational
Module, SEAT, and Computational Systems Governance implications is tracked separately at
docs/_source/codex/publications/measures_registry_review_launch_cycle_001.meta.md and remains its own,
distinct governed record.`,
  },
]

const STATIC_HELD = [
  {
    assetId: "launch_cycle_001__ig_mr__derivative",
    identity: "Measures Registry",
    platform: "instagram",
    disposition: "held_missing_approved_derivative",
    reason: "no_approved_platform_specific_visual_or_media_derivative_for_launch_cycle_001",
  },
  {
    assetId: "launch_cycle_001__yt_mr__reference",
    identity: "Measures Registry",
    platform: "youtube",
    disposition: "held_missing_approved_derivative",
    reason: "no_approved_launch_cycle_001_video_derivative",
  },
  {
    assetId: "launch_cycle_001__ig_undrifted",
    identity: "unDrifted",
    platform: "instagram",
    disposition: "not_connected",
    reason: "undrifted_instagram_not_connected",
  },
  {
    assetId: "launch_cycle_001__yt_undrifted",
    identity: "unDrifted",
    platform: "youtube",
    disposition: "not_connected",
    reason: "undrifted_youtube_not_connected",
  },
]

async function listPosts(env, credentialRef, channel) {
  const query = `query Posts($input: PostsInput!) {
    posts(input: $input) {
      edges { node { id status schedulingType isCustomScheduled dueAt text channelId channelService externalLink createdAt updatedAt } }
    }
  }`
  const result = await gql(env[credentialRef], query, {
    input: {
      organizationId: channel.organizationId,
      filter: { channelIds: [channel.id], status: ["draft", "scheduled", "sent", "error"] },
    },
  })
  return result.data?.posts?.edges?.map((edge) => edge.node) || []
}

async function createQueuedPost(env, derivative, channel, text) {
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
  }`
  const input = {
      schedulingType: "automatic",
      dueAt: null,
      text,
      channelId: channel.id,
      mode: "addToQueue",
      source: OAR2_PATH,
      aiAssisted: false,
      saveToDraft: false,
  }
  if (derivative.platform === "facebook") {
    input.metadata = { facebook: { type: "post" } }
  }

  const result = await gql(env[derivative.credentialRef], mutation, { input })
  return result.data?.createPost || { __typename: "GraphQLError", message: (result.errors || []).join("; ") || `http_${result.status}` }
}

function postDisposition(post) {
  if (!post) return null
  if (post.status === "sent") return "published"
  if (post.status === "scheduled" || post.dueAt) return "scheduled"
  if (post.status === "draft") return "scheduled"
  return post.status
}

async function run() {
  const execute = process.argv.includes("--execute")
  const env = loadEnv()
  const workspaces = [
    await listWorkspace(env, "BUFFER_SOCIAL_KEY"),
    await listWorkspace(env, "BUFFER_PUB2_KEY"),
  ]
  const channels = workspaces.flatMap((workspace) => workspace.channels || [])
  const results = []

  for (const derivative of DERIVATIVES) {
    const candidates = channels.filter((channel) => channel.credentialRef === derivative.credentialRef && derivative.channelMatch(channel))
    const text = withUrl(derivative.copy, derivative.targetUrl)
    const boundaryMarkers = [
      "Codex Position Governance",
      "Ledger Review",
      "Standing Review",
      "c3_ledger_0001",
      "OAR and advisory process",
      "source_internal_record",
      "source_internal_sha256",
      "â",
      "Â",
      "Ã",
      "�",
    ].filter((marker) => text.includes(marker))

    const base = {
      ...derivative,
      text,
      textLength: [...text].length,
      channelId: candidates[0]?.id || null,
      channelDisplayName: candidates[0]?.displayName || null,
      channelPublicUrl: candidates[0]?.externalLink || null,
      bufferId: null,
      bufferStatus: null,
      scheduledFor: null,
      publicUrl: null,
      timestamp: EXECUTED_AT,
      retractions: RETRACTED_BUFFER_POSTS[derivative.assetId] || [],
    }

    if (candidates.length !== 1) {
      results.push({ ...base, disposition: "held_ambiguous", reason: `expected_one_channel_found_${candidates.length}` })
      continue
    }
    if (derivative.finalGate && FINAL_GATES[derivative.finalGate]) {
      results.push({
        ...base,
        disposition: FINAL_GATES[derivative.finalGate].disposition,
        reason: FINAL_GATES[derivative.finalGate].reason,
      })
      continue
    }
    if (boundaryMarkers.length) {
      results.push({ ...base, disposition: "held_ambiguous", reason: `boundary_markers_found:${boundaryMarkers.join(",")}` })
      continue
    }
    if (derivative.platform === "x" && [...text].length > 280) {
      results.push({ ...base, disposition: "held_ambiguous", reason: `x_payload_exceeds_280_chars:${[...text].length}` })
      continue
    }

    const existingPosts = await listPosts(env, derivative.credentialRef, candidates[0])
    const existing = existingPosts.find((post) => post.text === text)
    if (existing) {
      results.push({
        ...base,
        disposition: postDisposition(existing) || "scheduled",
        reason: "existing_matching_buffer_post_no_duplicate_created",
        bufferId: existing.id,
        bufferStatus: existing.status,
        scheduledFor: existing.dueAt || null,
        publicUrl: existing.externalLink || null,
      })
      continue
    }

    if (!execute) {
      results.push({ ...base, disposition: "scheduled", reason: "dry_run_would_add_to_buffer_queue" })
      continue
    }

    const created = await createQueuedPost(env, derivative, candidates[0], text)
    if (created.__typename !== "PostActionSuccess") {
      results.push({ ...base, disposition: "held_ambiguous", reason: `buffer_create_failed:${created.message || created.__typename}` })
      continue
    }
    results.push({
      ...base,
      disposition: postDisposition(created.post) || "scheduled",
      reason: "buffer_add_to_queue_success",
      bufferId: created.post.id,
      bufferStatus: created.post.status,
      scheduledFor: created.post.dueAt || null,
      publicUrl: created.post.externalLink || null,
    })
  }

  for (const held of STATIC_HELD) results.push({ ...held, timestamp: EXECUTED_AT })

  const endpointMatrix = channels.map((channel) => ({
    platform: channel.service === "twitter" ? "x" : channel.service,
    credentialRef: channel.credentialRef,
    channelId: channel.id,
    displayName: channel.displayName,
    publicUrl: channel.externalLink,
    active: !channel.isDisconnected && !channel.isLocked,
  }))

  const output = {
    document_type: "launch_cycle_001_distribution_execution",
    source_oar2: OAR2_PATH,
    executed_at: EXECUTED_AT,
    mode: execute ? "execute" : "dry_run",
    operator_approval: {
      field_findings_public_derivative: "approved",
      publication_001_content_hold: "lifted",
      issue_01_activation: "authorized",
      registered_approved_social_derivative_release: "authorized",
    },
    credential_presence: workspaces.map((workspace) => ({
      credentialRef: workspace.credentialRef,
      present: workspace.present,
      authenticated: workspace.authenticated,
      accountName: workspace.accountName || null,
      channelCount: workspace.channels?.length || 0,
      errors: workspace.errors || [],
    })),
    endpoint_matrix: endpointMatrix,
    duplicate_channel_ids: endpointMatrix
      .map((channel) => channel.channelId)
      .filter((id, index, ids) => ids.indexOf(id) !== index),
    results,
    summary: {
      published: results.filter((result) => result.disposition === "published").length,
      scheduled: results.filter((result) => result.disposition === "scheduled").length,
      held_missing_approved_derivative: results.filter((result) => result.disposition === "held_missing_approved_derivative").length,
      held_ambiguous: results.filter((result) => result.disposition === "held_ambiguous").length,
      not_connected: results.filter((result) => result.disposition === "not_connected").length,
    },
  }

  fs.mkdirSync("docs/oar/measures_registry", { recursive: true })
  fs.writeFileSync(
    "docs/oar/measures_registry/launch_cycle_001_distribution_execution_v1.json",
    `${JSON.stringify(output, null, 2)}\n`,
  )
  console.log(JSON.stringify(output.summary, null, 2))
  console.log("docs/oar/measures_registry/launch_cycle_001_distribution_execution_v1.json")
}

run().catch((error) => {
  console.error(error.stack || error.message)
  process.exitCode = 1
})
