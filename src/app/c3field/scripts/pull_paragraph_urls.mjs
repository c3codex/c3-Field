// scripts/ingest_paragraph_to_content_items.mjs
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Paragraph docs confirm API + TS SDK support for accessing post/publication data. :contentReference[oaicite:1]{index=1}
import { ParagraphAPI } from "@paragraph-com/sdk";

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const SUPABASE_URL = mustEnv("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = mustEnv("SUPABASE_SERVICE_ROLE_KEY");
const PARAGRAPH_SOURCE_ID = mustEnv("PARAGRAPH_SOURCE_ID");

// If the SDK needs auth for private/extended endpoints, set it.
// Some installations can read public data without a token, but keep this ready.
const PARAGRAPH_API_KEY = process.env.PARAGRAPH_API_KEY || null;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const paragraph = new ParagraphAPI(
  PARAGRAPH_API_KEY ? { apiKey: PARAGRAPH_API_KEY } : undefined
);

// --- helpers ---
function pick(obj, paths) {
  for (const p of paths) {
    const v = p.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), obj);
    if (v != null) return v;
  }
  return null;
}

function toIsoMaybe(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.valueOf()) ? null : d.toISOString();
}

function buildCanonicalUrl(post) {
  // Prefer explicit URL from API if present
  const direct = pick(post, ["url", "canonicalUrl", "canonical_url", "permalink"]);
  if (direct) return direct;

  // Otherwise best-effort: paragraph.com/@<pub>/<slug>
  const slug = pick(post, ["slug", "postSlug"]);
  const pub = pick(post, [
    "publication.slug",
    "publicationSlug",
    "publication_handle",
    "publication.handle",
  ]);

  if (pub && slug) return `https://paragraph.com/@${pub}/${slug}`;
  return null;
}

async function listPostsBestEffort() {
  // Strategy:
  // 1) If you can list by publication in your SDK version, do that (preferred).
  // 2) Otherwise fallback to a feed list and filter later.
  //
  // The docs cover building on their API/SDK but specific method names can differ by version. :contentReference[oaicite:2]{index=2}

  // --- (A) Try a publication list method if available ---
  // If you have a known publication id/handle, you can add a method here.
  // For now, try feed as a dependable baseline.
  if (paragraph?.feed?.get) {
    const res = await paragraph.feed.get({ limit: 100 });
    return res?.items || res?.posts || [];
  }

  throw new Error("No supported listing method found on ParagraphAPI instance.");
}

async function upsertContentItems(rows) {
  // Upsert requires unique index on (source_id, external_id)
  const { data, error } = await supabase
    .from("content_items")
    .upsert(rows, { onConflict: "source_id,external_id" })
    .select("id,external_id,url,title,updated_at");

  if (error) throw error;
  return data || [];
}

async function run() {
  const posts = await listPostsBestEffort();

  if (!posts.length) {
    console.log("No posts returned. If this is unexpected, set PARAGRAPH_API_KEY or switch to a publication-specific endpoint.");
    return;
  }

  const rows = posts
    .map((post) => {
      const external_id = String(pick(post, ["id", "postId", "post_id"]) || "");
      if (!external_id) return null;

      const url = buildCanonicalUrl(post);
      const title = pick(post, ["title", "name", "headline"]) || "(untitled)";

      const slug = pick(post, ["slug", "postSlug"]);
      const author_name = pick(post, [
        "author.name",
        "author.username",
        "user.name",
        "user.username",
      ]);

      const published_at = toIsoMaybe(pick(post, ["publishedAt", "published_at", "createdAt", "created_at"]));
      const updated_at = toIsoMaybe(pick(post, ["updatedAt", "updated_at"]));

      // Your schema requires url NOT NULL: if we can't build it, skip and log.
      if (!url) {
        console.warn("Skipping post (missing url):", { external_id, title });
        return null;
      }

      return {
        source_id: PARAGRAPH_SOURCE_ID,
        external_id,
        url,
        title,
        slug: slug || null,
        author_name: author_name || null,
        published_at,
        updated_at,
        raw_json: post, // provenance: keep everything
      };
    })
    .filter(Boolean);

  console.log(`Prepared ${rows.length} rows for upsert.`);

  const upserted = await upsertContentItems(rows);
  console.log(`Upserted ${upserted.length} rows into public.content_items`);

  // quick sample output
  console.log("Sample:", upserted.slice(0, 5));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});