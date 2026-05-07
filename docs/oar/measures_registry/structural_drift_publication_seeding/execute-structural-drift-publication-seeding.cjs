require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)

const source = "structural_drift_publication_seeding_v2"
const publicationKey = "structural_drift"
const dispatchKey = "agents_of_chaos_dispatch_v1"
const paragraphMarkdownUrl = "https://paragraph.com/@measures-registry/agents-of-chaos.md"

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withSchemaRetry(operation, label) {
  let lastError = null

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const result = await operation()
    if (!result.error) return result.data

    lastError = result.error
    if (!/schema cache|Could not find the table|Could not find/.test(result.error.message)) {
      break
    }

    await sleep(1500)
  }

  throw new Error(`${label}: ${lastError?.message ?? "unknown error"}`)
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  await execSql(`
    create table if not exists public.measures_publication_registry (
      id uuid primary key default gen_random_uuid(),
      publication_key text unique not null,
      title text not null,
      subtitle text,
      publication_type text not null,
      status text not null,
      distribution_surface text,
      external_platform text,
      external_slug text,
      external_url text,
      tone jsonb not null default '[]'::jsonb,
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists public.measures_publication_dispatch (
      id uuid primary key default gen_random_uuid(),
      publication_key text not null,
      dispatch_key text unique not null,
      title text not null,
      dispatch_body text not null,
      excerpt text,
      seo_description text,
      tags jsonb not null default '[]'::jsonb,
      primary_cta text,
      secondary_cta text,
      "references" jsonb not null default '[]'::jsonb,
      media_manifest jsonb not null default '{}'::jsonb,
      internal_route text,
      external_platform text,
      external_slug text,
      external_url text,
      status text not null,
      published_at timestamptz,
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists public.measures_publication_subscription_capture (
      id uuid primary key default gen_random_uuid(),
      publication_key text not null,
      dispatch_key text,
      email text not null,
      organization text,
      capture_source text not null,
      created_at timestamptz not null default now(),
      metadata jsonb not null default '{}'::jsonb,
      constraint measures_publication_subscription_email_check check (position('@' in email) > 1)
    );

    alter table public.measures_publication_registry enable row level security;
    alter table public.measures_publication_dispatch enable row level security;
    alter table public.measures_publication_subscription_capture enable row level security;

    drop policy if exists measures_publication_registry_public_read
    on public.measures_publication_registry;
    create policy measures_publication_registry_public_read
    on public.measures_publication_registry
    for select
    to anon, authenticated
    using (status = 'published');

    drop policy if exists measures_publication_dispatch_public_read
    on public.measures_publication_dispatch;
    create policy measures_publication_dispatch_public_read
    on public.measures_publication_dispatch
    for select
    to anon, authenticated
    using (status = 'published');

    drop policy if exists measures_publication_subscription_public_insert
    on public.measures_publication_subscription_capture;
    create policy measures_publication_subscription_public_insert
    on public.measures_publication_subscription_capture
    for insert
    to anon, authenticated
    with check (capture_source = 'structural_drift_dispatch');

    grant select on public.measures_publication_registry to anon, authenticated;
    grant select on public.measures_publication_dispatch to anon, authenticated;
    grant insert on public.measures_publication_subscription_capture to anon, authenticated;

    notify pgrst, 'reload schema';
  `, "publication schema seating failed")

  const dispatchBody = await fetch(paragraphMarkdownUrl).then((response) => {
    if (!response.ok) throw new Error(`Paragraph markdown fetch failed: ${response.status}`)
    return response.text()
  })

  const bannerLookup = await assertOk(
    await supabase.storage.from("measures-registry").list("", { search: "structural_drift.webp", limit: 10 }),
    "structural drift banner lookup failed",
  )
  const banner = bannerLookup.find((file) => file.name === "structural_drift.webp")
  if (!banner) throw new Error("structural_drift.webp storage object missing")

  const publicationPayload = {
    publication_key: publicationKey,
    title: "Structural Drift",
    subtitle: "Dispatches from the Measures Registry",
    publication_type: "institutional_diagnostic",
    status: "published",
    distribution_surface: "x_primary",
    external_platform: "paragraph",
    external_slug: "structural-drift",
    external_url: "https://paragraph.com/@measures-registry/structural-drift",
    tone: ["institutional", "diagnostic", "restrained", "evidence_backed"],
    metadata: {
      source,
      authority: "publication_key",
    },
    updated_at: new Date().toISOString(),
  }

  const dispatchPayload = {
    publication_key: publicationKey,
    dispatch_key: dispatchKey,
    title: "The Harness Was Never the Fix",
    dispatch_body: dispatchBody,
    excerpt:
      "Autonomous agents are not failing in isolation. They are exposing structural drift inside the systems that deploy them.",
    seo_description:
      "A Measures Registry dispatch on autonomous AI agents, structural drift, and why institutional AI failures emerge from unresolved systems, not intelligence alone.",
    tags: [
      "AI Governance",
      "AI Agents",
      "Autonomous Agents",
      "Structural Drift",
      "Integrity Governance",
      "Enterprise AI",
      "Agentic Systems",
      "Harness Engineering",
      "Operational Coherence",
    ],
    primary_cta: "Evaluate Structural Coherence",
    secondary_cta: "Receive Registry Dispatches",
    references: [
      {
        title: "Agents of Chaos",
        year: "2026",
        type: "research_paper",
      },
      {
        title: "The Last Harness You'll Ever Build",
        year: "2026",
        type: "research_paper",
        citation: "arXiv:2604.21003v1",
      },
    ],
    media_manifest: {
      banner_image: "measures-registry/structural_drift.webp",
      resolved_banner_image: "structural_drift.webp",
      publication_video: {
        platform: "youtube",
        external_url: "https://youtu.be/29f2Gcxwv9o",
        title: "AI isn't broken. Systems are.",
        type: "longform_dispatch_video",
      },
    },
    internal_route: "/publication/structural_drift/agents_of_chaos_dispatch_v1",
    external_platform: "paragraph",
    external_slug: "agents-of-chaos",
    external_url: "https://paragraph.com/@measures-registry/agents-of-chaos",
    status: "published",
    published_at: "2026-05-06T00:00:00.000Z",
    metadata: {
      source,
      renderer_key: "publication_dispatch",
      subscription_type: "dual_surface",
      capture_source: "structural_drift_dispatch",
      body_source_url: paragraphMarkdownUrl,
      banner_storage_size: banner.metadata?.size ?? banner.metadata?.contentLength ?? null,
    },
    updated_at: new Date().toISOString(),
  }

  await withSchemaRetry(
    () =>
      supabase
        .from("measures_publication_registry")
        .upsert(publicationPayload, { onConflict: "publication_key" }),
    "publication upsert failed",
  )

  await withSchemaRetry(
    () =>
      supabase
        .from("measures_publication_dispatch")
        .upsert(dispatchPayload, { onConflict: "dispatch_key" }),
    "dispatch upsert failed",
  )

  const [publication] = await withSchemaRetry(
    () =>
      supabase
        .from("measures_publication_registry")
        .select("publication_key, title, status, external_url, tone")
        .eq("publication_key", publicationKey)
        .limit(1),
    "publication validation failed",
  )

  const [dispatch] = await withSchemaRetry(
    () =>
      supabase
        .from("measures_publication_dispatch")
        .select("dispatch_key, title, status, internal_route, references, media_manifest, primary_cta, secondary_cta, dispatch_body")
        .eq("dispatch_key", dispatchKey)
        .limit(1),
    "dispatch validation failed",
  )

  console.log(JSON.stringify({
    dbConnection: "active",
    publication,
    dispatch: {
      dispatch_key: dispatch.dispatch_key,
      title: dispatch.title,
      status: dispatch.status,
      internal_route: dispatch.internal_route,
      referenceCount: dispatch.references?.length ?? 0,
      hasBanner: Boolean(dispatch.media_manifest?.banner_image),
      hasVideo: Boolean(dispatch.media_manifest?.publication_video?.external_url),
      primary_cta: dispatch.primary_cta,
      secondary_cta: dispatch.secondary_cta,
      bodyLength: dispatch.dispatch_body?.length ?? 0,
    },
    subscriptionCaptureTable: "measures_publication_subscription_capture",
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
