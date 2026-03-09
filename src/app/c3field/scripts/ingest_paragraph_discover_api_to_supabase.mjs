import { CONFIG } from "./config.local.mjs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = CONFIG.SUPABASE_SERVICE_ROLE_KEY;
const PARAGRAPH_SOURCE_ID = CONFIG.PARAGRAPH_SOURCE_ID;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !PARAGRAPH_SOURCE_ID) {
  throw new Error("Config missing in config.local.mjs");
}
const HANDLE = "c3codex";
const PROFILE_URLS = [
  `https://paragraph.com/@${HANDLE}`,
  `https://paragraph.xyz/@${HANDLE}`,
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function toIsoMaybe(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.valueOf()) ? null : d.toISOString();
}

function buildUrlFromSlug(slug, domain = "paragraph.com") {
  return `https://${domain}/@${HANDLE}/${slug}`;
}

function uniq(arr) {
  return [...new Set(arr)];
}

function extractUrls(html) {
  // Pull every https://... string from HTML/JS chunks
  const re = /https:\/\/[^\s"'<>\\]+/g;
  const matches = html.match(re) || [];
  // Clean trailing punctuation
  return uniq(matches.map((u) => u.replace(/[),;]+$/, "")));
}

async function fetchFirstOk(urls) {
  for (const url of urls) {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html,*/*" },
    });
    if (res.ok) return { url, text: await res.text() };
  }
  throw new Error("Could not fetch profile HTML from paragraph.com or paragraph.xyz");
}

function findJsonCandidates(urls) {
  // Heuristics: Next.js data endpoints, api.* endpoints, graphql endpoints
  return urls.filter((u) =>
    /_next\/data|api\.paragraph|paragraph\.com\/api|paragraph\.xyz\/api|graphql|posts|blog|profile/i.test(u)
  );
}

async function tryJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json,text/plain,*/*",
    },
  });
  if (!res.ok) return null;
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json") && !ct.includes("text/plain")) return null;

  try {
    const j = await res.json();
    return j;
  } catch {
    return null;
  }
}

function collectPostObjects(obj, out = []) {
  if (!obj) return out;
  if (Array.isArray(obj)) {
    for (const v of obj) collectPostObjects(v, out);
    return out;
  }
  if (typeof obj !== "object") return out;

  const slug = obj.slug;
  const title = obj.title || obj.headline || obj.name;
  const id = obj.id || obj.postId || obj.post_id;

  // Looks like a post
  if (slug && title && (id || obj.publishedAt || obj.published_at)) out.push(obj);

  for (const k of Object.keys(obj)) collectPostObjects(obj[k], out);
  return out;
}

function normalizeToContentItem(p) {
  const external_id = String(p.id || p.postId || p.post_id || p.slug || "");
  const title = p.title || p.headline || p.name || "(untitled)";
  const slug = p.slug || null;

  // Prefer explicit url if present, else build
  let url = p.url || p.canonicalUrl || p.canonical_url || p.permalink || null;
  if (!url && slug) {
    // Keep paragraph.com as canonical storage, even if we fetched from xyz
    url = buildUrlFromSlug(slug, "paragraph.com");
  }
  if (!external_id || !url) return null;

  const author_name =
    (p.author && (p.author.name || p.author.username)) ||
    (p.user && (p.user.name || p.user.username)) ||
    null;

  const published_at = toIsoMaybe(p.publishedAt || p.published_at || p.createdAt || p.created_at);
  const updated_at = toIsoMaybe(p.updatedAt || p.updated_at);

  return {
    source_id: PARAGRAPH_SOURCE_ID,
    external_id,
    url,
    title,
    slug,
    author_name,
    published_at,
    updated_at,
    raw_json: p,
  };
}

async function run() {
  // 1) Fetch profile HTML
  const { url: profileUrl, text: html } = await fetchFirstOk(PROFILE_URLS);
  console.log("Fetched profile HTML:", profileUrl);

  // 2) Extract potential JSON endpoints from HTML
  const urls = extractUrls(html);
  const candidates = findJsonCandidates(urls);
  console.log(`Found ${urls.length} urls in HTML, ${candidates.length} JSON-ish candidates`);

  // 3) Try candidates until one yields posts
  let posts = [];
  let winningEndpoint = null;

  for (const c of candidates.slice(0, 60)) {
    const j = await tryJson(c);
    if (!j) continue;
    const found = collectPostObjects(j);
    // Deduplicate by id/slug
    const unique = [];
    const seen = new Set();
    for (const p of found) {
      const k = p.id || p.postId || p.slug;
      if (!k || seen.has(k)) continue;
      seen.add(k);
      unique.push(p);
    }
    if (unique.length >= 1) {
      posts = unique;
      winningEndpoint = c;
      break;
    }
  }

  if (!posts.length) {
    throw new Error(
      "Could not discover a JSON endpoint containing posts from the profile HTML. Next step: we’ll capture the network endpoint via DevTools once."
    );
  }

  console.log("Winning endpoint:", winningEndpoint);
  console.log(`Found ${posts.length} post objects`);

  // 4) Normalize + upsert
  const rows = posts.map(normalizeToContentItem).filter(Boolean);

  const { data, error } = await supabase
    .from("content_items")
    .upsert(rows, { onConflict: "source_id,external_id" })
    .select("id,external_id,url,title,published_at");

  if (error) throw error;

  console.log(`Upserted ${data?.length ?? 0} items into public.content_items`);
  console.log("Sample:", (data || []).slice(0, 5));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});