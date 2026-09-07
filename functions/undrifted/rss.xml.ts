type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_ANON_KEY?: string
  VITE_SUPABASE_ANON_KEY?: string
}

type MediaObject = Record<string, unknown>

type DispatchRow = {
  dispatch_key: string
  title: string
  dispatch_body: string | null
  excerpt: string | null
  seo_description: string | null
  media_manifest: MediaObject | null
  internal_route: string | null
  article_url: string | null
  external_url: string | null
  published_at: string | null
  issue_number: string | null
  metadata: Record<string, unknown> | null
}

type Enclosure = {
  url: string
  length: number
  type: string
}

const BASE_URL = "https://measuresregistry.com"
const FEED_URL = `${BASE_URL}/undrifted/rss.xml`
const PUBLICATION_URL = `${BASE_URL}/undrifted`
const FEED_CREATOR = "unDrifted"

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

function devSafeCategory(row: DispatchRow) {
  const label = row.metadata?.series_label
  const key = row.metadata?.series_key
  const raw =
    (typeof label === "string" && label.trim()) ||
    (typeof key === "string" && key.trim()) ||
    row.issue_number ||
    "undrifted"

  const normalized = String(raw).toLowerCase().replace(/[^a-z0-9]/g, "")
  return normalized.slice(0, 20) || "undrifted"
}

function stripMarkdown(value: string) {
  return value
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function summary(row: DispatchRow) {
  const body = row.dispatch_body ? stripMarkdown(row.dispatch_body) : ""
  const preferred = [row.excerpt, row.seo_description]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim()

  let value = preferred
  if (value.length < 300 && body) {
    value = body
  }
  if (!value) value = "Read this unDrifted article."

  if (value.length <= 520) return value
  const clipped = value.slice(0, 517)
  const boundary = clipped.lastIndexOf(" ")
  return `${clipped.slice(0, boundary > 300 ? boundary : 517).trim()}...`
}

function asMediaObject(value: unknown): MediaObject | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as MediaObject)
    : null
}

function positiveLength(value: unknown): number | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const parsed = Number(value.trim())
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
  }
  return null
}

function lengthFromMedia(media: MediaObject) {
  return (
    positiveLength(media.bytes) ??
    positiveLength(media.byte_size) ??
    positiveLength(media.byte_count) ??
    positiveLength(media.size_bytes) ??
    positiveLength(media.content_length)
  )
}

function mediaFromObject(value: unknown): Enclosure | null {
  const media = asMediaObject(value)
  if (!media) return null
  const url = typeof media.public_url === "string" ? media.public_url : null
  if (!url?.startsWith("https://")) return null
  const length = lengthFromMedia(media)
  if (!length) return null
  return {
    url,
    length,
    type: typeof media.mime_type === "string" ? media.mime_type : "image/webp",
  }
}

function enclosure(row: DispatchRow): Enclosure | null {
  const manifest = row.media_manifest
  if (!manifest) return null

  for (const candidate of [manifest.cover, manifest.website, manifest.paragraph]) {
    const found = mediaFromObject(candidate)
    if (found) return found
  }

  return null
}

async function loadPublishedDispatches(env: Env): Promise<DispatchRow[]> {
  const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const anonKey = env.SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) throw new Error("Supabase public runtime credentials are not configured")

  const query = new URLSearchParams({
    select:
      "dispatch_key,title,dispatch_body,excerpt,seo_description,media_manifest,internal_route,article_url,external_url,published_at,issue_number,metadata",
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
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
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

export function renderFeed(rows: DispatchRow[]) {
  const items = rows
    .map((row) => {
      const url = canonicalUrl(row)
      if (!url || !row.published_at) return ""
      const published = new Date(row.published_at).toUTCString()
      const itemEnclosure = enclosure(row)

      return `    <item>
      <title>${xmlEscape(row.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${xmlEscape(published)}</pubDate>
      <dc:creator>${xmlEscape(FEED_CREATOR)}</dc:creator>
      <category>${xmlEscape(devSafeCategory(row))}</category>
      <description>${xmlEscape(summary(row))}</description>${
        itemEnclosure
          ? `\n      <enclosure url="${xmlEscape(itemEnclosure.url)}" length="${itemEnclosure.length}" type="${xmlEscape(itemEnclosure.type)}" />`
          : ""
      }
    </item>`
    })
    .filter(Boolean)
    .join("\n")

  const lastBuildDate = rows[0]?.published_at
    ? new Date(rows[0].published_at).toUTCString()
    : new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
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
