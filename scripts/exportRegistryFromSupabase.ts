import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

type Row = {
  id: string;
  kind: string; // artifact.type enum string (from v_registry_items)
  pillar: string; // home_container or 'priceless'
  title: string;
  summary: string;
  status: string;
  route: string | null;
  date: string | null;

  links: {
    source_url?: string | null;
    storage_path?: string | null;
    storage_path_md?: string | null;
    storage_path_pdf?: string | null;
    hash?: string | null;
  } | null;

  related: string[] | null;
  concept_slugs: string[] | null;
};

type CanonRow = {
  slug: string;
  title: string | null;
  type: string | null;
  visibility: string | null;
  scope: string | null;
  storage_path_md: string | null;
  storage_path_pdf: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function uniq(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean)));
}

function toLinks(obj: Row["links"]) {
  const links: { label: string; href: string; external?: boolean }[] = [];
  if (!obj) return links;

  if (obj.source_url) links.push({ label: "Source", href: obj.source_url, external: true });

  // These may be URLs or storage keys; leave as-is.
  if (obj.storage_path) links.push({ label: "Storage", href: obj.storage_path, external: true });
  if (obj.storage_path_md) links.push({ label: "Markdown", href: obj.storage_path_md, external: true });
  if (obj.storage_path_pdf) links.push({ label: "PDF", href: obj.storage_path_pdf, external: true });

  return links;
}

function canonPillarFromSlug(slug: string) {
  const s = (slug || "").toLowerCase();

  if (s.includes("measures")) return "measures";
  if (s.includes("codexstone")) return "codexstone";

  // ✅ CoherentAI canon
  if (s.includes("coherentai") || s.includes("field_lens") || s.includes("field-lens")) return "coherentai";

  // v1: keep the rest in model lens
  return "model";
}

function canonLinks(slug: string, hasMd: boolean, hasPdf: boolean) {
  const links: { label: string; href: string; external?: boolean }[] = [];
  if (hasMd) links.push({ label: "Read (MD)", href: `/api/canon/${slug}?format=md`, external: true });
  if (hasPdf) links.push({ label: "Download (PDF)", href: `/api/canon/${slug}?format=pdf`, external: true });
  return links;
}


function dedupeByIdKeepLast<T extends { id: string }>(arr: T[]) {
  const m = new Map<string, T>();
  for (const x of arr) m.set(x.id, x);
  return Array.from(m.values());
}

function kindFromCanonType(type: string | null) {
  const t = (type || "").toLowerCase().trim();
  if (!t) return "canon";
  // normalize a few common variants
  if (t === "spec" || t === "specification") return "spec";
  if (t === "canon") return "canon";
  if (t === "article") return "article";
  return t; // allow future kinds
}

function extractVersionTags(slug: string) {
  const s = (slug || "").toLowerCase();
  const tags: string[] = [];

  // crude but effective: v1, v1.0, v2.1 etc
  const m = s.match(/v(\d+)(?:\.(\d+))?/);
  if (m) {
    tags.push(`v${m[1]}`);
    if (m[2]) tags.push(`v${m[1]}.${m[2]}`);
  }
  return tags;
}

function canonSummary(c: CanonRow) {
  const t = (c.type || "canon").toLowerCase();
  const scope = (c.scope || "").trim();
  const vis = (c.visibility || "").trim();

  const bits = [t];
  if (scope) bits.push(scope);
  if (vis) bits.push(vis);

  // short, lens-friendly, not poetic
  return `Canon ${bits.join(" • ")}.`;
}

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // 1) existing registry items
  const { data: regData, error: regErr } = await supabase
    .from("v_registry_items")
    .select("id,kind,pillar,title,summary,status,route,date,links,related,concept_slugs")
    .order("title", { ascending: true });

  if (regErr) throw regErr;

  const rows = ((regData || []) as Row[]).map((r) => {
    const tags = uniq([...(r.concept_slugs ?? []), r.kind, r.pillar, "artifact"]);
    const links = toLinks(r.links);

    return {
      id: r.id,
      kind: r.kind, // existing pipeline; stays as-is for now
      pillar: r.pillar,
      title: r.title,
      summary: r.summary,
      status: r.status,
      tags,
      route: r.route ?? undefined,
      links: links.length ? links : undefined,
      related: r.related ?? undefined,
      date: r.date ?? undefined,
    };
  });

  // 2) canon docs (from your new view)
  const { data: canonData, error: canonErr } = await supabase
    .from("canon_public_v1")
    .select("slug,title,type,visibility,scope,storage_path_md,storage_path_pdf,created_at,updated_at")
    .order("created_at", { ascending: true });

  if (canonErr) throw canonErr;

  const canonRows = (canonData || []) as CanonRow[];

 
    const canonItems = canonRows.map((c) => {
    const slug = c.slug;
    const hasMd = !!c.storage_path_md;
    const hasPdf = !!c.storage_path_pdf;

    const links = canonLinks(slug, hasMd, hasPdf);

    return {
      id: slug,
      kind: "article", // v1: represent canon as articles (no type changes)
      pillar: canonPillarFromSlug(slug),
      title: c.title ?? slug,
      summary: "Canon document (vault-resolved).",
      status: "live",
      tags: uniq(["canon", "doc", canonPillarFromSlug(slug)]),
      links: links.length ? links : undefined,
      date: c.created_at ?? undefined,
    };
  });


  // merge; canon last so it wins collisions
  const items = dedupeByIdKeepLast([...rows, ...canonItems]);

  const outPath = path.resolve(process.cwd(), "src/data/registry/generated.ts");

  const file = `/* eslint-disable */
/**
 * AUTO-GENERATED — do not edit by hand.
 * Source: public.v_registry_items + public.canon_public_v1
 * Generated: ${new Date().toISOString()}
 */
import type { RegistryItem } from "./types";

export const GENERATED_ITEMS: RegistryItem[] = ${JSON.stringify(items, null, 2)} as unknown as RegistryItem[];
`;

  fs.writeFileSync(outPath, file, "utf8");
  console.log(`Wrote ${items.length} items -> ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
