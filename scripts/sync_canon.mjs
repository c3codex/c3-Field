import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const CANON_BUCKET = process.env.CANON_BUCKET?.trim() || "canon-docs";
const CANON_ROOT = process.env.CANON_ROOT?.trim() || "src/canon";
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}
 console.log("KEY LENGTH:", SUPABASE_SERVICE_ROLE_KEY?.length);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function toPosix(p) {
  return p.split(path.sep).join(path.posix.sep);
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function contentTypeFor(filePath) {
  if (filePath.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}

async function uploadFile(localPath) {
  const rel = toPosix(path.relative(CANON_ROOT, localPath));
  const storagePath = rel;
  const buffer = await fs.readFile(localPath);
  const checksum = sha256(buffer);

  const { error } = await supabase.storage
    .from(CANON_BUCKET)
    .upload(storagePath, buffer, {
      contentType: contentTypeFor(localPath),
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Upload failed for ${rel}: ${error.message}`);
  }

  const { data } = supabase.storage.from(CANON_BUCKET).getPublicUrl(storagePath);

  return {
    slug: path.basename(localPath, path.extname(localPath)),
    local_path: localPath,
    storage_path: storagePath,
    checksum,
    public_url: data.publicUrl,
  };
}

async function main() {
  const allFiles = await walk(CANON_ROOT);
  const syncableFiles = allFiles.filter((f) => {
    const name = path.basename(f);
    return !name.startsWith(".") && (f.endsWith(".md") || f.endsWith(".json"));
  });

  console.log(`Found ${syncableFiles.length} canon files to sync`);

  const uploaded = [];
  for (const file of syncableFiles) {
    const result = await uploadFile(file);
    uploaded.push(result);
    console.log(`Synced: ${result.storage_path}`);
  }

  const manifest = {
    bucket: CANON_BUCKET,
    root: CANON_ROOT,
    synced_at: new Date().toISOString(),
    count: uploaded.length,
    files: uploaded,
  };

  const manifestPath = path.join(process.cwd(), "canon-sync-manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  console.log("\nDone.");
  console.log(`Manifest written: ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});