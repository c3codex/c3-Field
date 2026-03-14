import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CONTENT_ROOT = path.resolve("src/pillars/measures/content");
const BUCKET = "Measures-open";
const STORAGE_ROOT = "measures";

function requireField(data, field, filePath) {
  if (
    data[field] === undefined ||
    data[field] === null ||
    String(data[field]).trim() === ""
  ) {
    throw new Error(`Missing required frontmatter "${field}" in ${filePath}`);
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return full.endsWith(".md") ? [full] : [];
    })
  );
  return files.flat();
}

async function main() {
  const files = await walk(CONTENT_ROOT);

  console.log("FILES FOUND:");
files.forEach((f) => console.log(f));

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data ?? {};
    const bodyMd = parsed.content.trim();

    requireField(data, "manifest_slug", filePath);
    requireField(data, "text_kind", filePath);
    requireField(data, "title", filePath);

    const textSlot = data.text_slot ?? "primary";
const slug = `${data.manifest_slug}__${data.text_kind}__${textSlot}`;
   const storagePath = `${STORAGE_ROOT}/${data.manifest_slug}/${data.text_kind}.${textSlot}.md`;
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;

    const uploadRes = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, raw, {
        contentType: "text/markdown; charset=utf-8",
        upsert: true,
      });

    if (uploadRes.error) {
      throw new Error(
        `Storage upload failed for ${filePath}: ${uploadRes.error.message}`
      );
    }

    const row = {
  slug,
  manifest_slug: data.manifest_slug,
  text_kind: data.text_kind,
  text_slot: data.text_slot ?? "primary",
  title: data.title,
  display_label: data.display_label ?? null,
  artifact_type: data.artifact_type ?? null,
  artifact_number: data.artifact_number ?? null,
  body_md: bodyMd,
  storage_path: storagePath,
  public_url: publicUrl,
  is_active: data.is_active ?? true,
  updated_at: new Date().toISOString(),
};

    const { error } = await supabase
      .from("measures_text_content")
      .upsert(row, {
        onConflict: "slug",
      });

    if (error) {
      throw new Error(`DB upsert failed for ${filePath}: ${error.message}`);
    }

    console.log(`Synced ${data.manifest_slug} [${data.text_kind}]`);
  }

  console.log("Measures content sync complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});