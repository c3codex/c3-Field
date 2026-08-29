type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type DispatchRow = {
  dispatch_key: string
  title: string
  excerpt: string | null
  seo_description: string | null
  internal_route: string | null
  article_url: string | null
  external_url: string | null
  published_at: string | null
  updated_at: string | null
  issue_number: string | null
  metadata: Record<string, unknown> | null
}

const BASE_URL = "https://measuresregistry.com"
const FEED_URL = `${BASE_URL}/undrifted/rss.xml`
const PUBLICATION_URL = `${BASE_URL}/undrifted`

function xmlEscape(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function canonicalUrl(row: DispatchRow) {
  if (row.article_url?.startsWith(BASE_URL)) return row.article_url.replace(/\/$/, "")

  const measuresUrl = row.metadata?.measures_registry_url
  if (typeof measuresUrl === "string" && measuresUrl.startsWith(BASE_URL)) {
    return measuresUrl.replace(/\/$/, "")
  }

  if (row.internal_route?.startsWith("/undrifted/")) {
    return `${BASE_URL}${row.internal_route}`.replace(/\/$/, "")
  }

  return row.article_url || row.external_url || null
}

function category(row: DispatchRow) {
  const label = row.metadata?.series_label
  if (typeof label === "string" && label.trim()) return label.trim()
  const key = row.metadata?.series_key
  if (typeof key === "string" && key.trim()) return key.replaceAll("_", " ")
  return row.issue_number || "unDrifted"
}

async function loadPublishedDispatches(env: Env): Promise<DispatchRow[]> {
  const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase server credentials are not configured")

  const query = new URLSearchParams({
    select:
      "dispatch_key,title,excerpt,seo_description,internal_route,article_url,external_url,published_at,updated_at,issue_number,metadata",
    publication_key: "eq.undrifted",
    status: "eq.published",
    published_at: "not.is.null",
    order: "published_at.desc",
    limit: "50",
  })

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/measures_publication_dispatch?${query.toString()}`,
    {
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        accept: "application/json",
      },
    },
  )

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Supabase request failed: ${response.status}`)
  }

  return (await response.json()) as DispatchRow[]
}

function renderFeed(rows: DispatchRow[]) {
  const items = rows
    .map((row) => {
      const url = canonicalUrl(row)
      if (!url || !row.published_at) return ""
      const description = row.excerpt || row.seo_description || "Read this unDrifted article."
      const published = new Date(row.published_at).toUTCString()
      const updated = row.updated_at ? new Date(row.updated_at).toUTCString() : null

      return `    <item>
      <title>${xmlEscape(row.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${xmlEscape(published)}</pubDate>
      ${updated ? `<atom:updated>${xmlEscape(updated)}</atom:updated>` : ""}
      <category>${xmlEscape(category(row))}</category>
      <description>${xmlEscape(description)}</description>
    </item>`
    })
    .filter(Boolean)
    .join("\n")

  const lastBuildDate = rows[0]?.published_at
    ? new Date(rows[0].published_at).toUTCString()
    : new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>unDrifted</title>
    <link>${PUBLICATION_URL}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>unDrifted examines AI systems, structural drift, accountability, research, and the environments technology enters.</description>
    <language>en-us</language>
    <lastBuildDate>${xmlEscape(lastBuildDate)}</lastBuildDate>
    <generator>Measures Registry publication registry</generator>
${items}
  </channel>
</rss>`
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const rows = await loadPublishedDispatches(env)
    return new Response(renderFeed(rows), {
      status: 200,
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=300",
        "x-content-type-options": "nosniff",
      },
    })
  } catch (error) {
    console.error("unDrifted RSS generation failed", error)
    return new Response("RSS feed unavailable", {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }
}
