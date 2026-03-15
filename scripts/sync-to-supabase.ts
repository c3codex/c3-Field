/**
 * sync-to-supabase.ts
 *
 * Formats and uploads kernel docs + pillar canon meta to Supabase Storage.
 *
 * Buckets:
 *   codex-vault/system-kernel/   ← kernel docs
 *   codex-vault/pillar-canon/    ← pillar meta docs
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... npx ts-node sync-to-supabase.ts
 *
 * Requires:
 *   npm install @supabase/supabase-js gray-matter
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const BUCKET = "codex-vault";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── File manifest ─────────────────────────────────────────────────────────────

interface SyncEntry {
  localPath: string;
  bucketFolder: string;
}

const MANIFEST: SyncEntry[] = [
  // Kernel docs
  {
    localPath: "kernel-formatted/COHERENTAI_SYSTEM_MAP.md",
    bucketFolder: "system-kernel",
  },
  {
    localPath: "kernel-formatted/COHERENTAI_INSTALLATION_PROTOCOL.md",
    bucketFolder: "system-kernel",
  },
  {
    localPath: "kernel-formatted/COHERENTAI_FIRST_TEST.md",
    bucketFolder: "system-kernel",
  },
  {
    localPath: "kernel-formatted/COHERENTAI_DOCUMENT_CLASSIFICATION_FUNCTION.md",
    bucketFolder: "system-kernel",
  },
  {
    localPath: "kernel-formatted/STRUCTURAL_BOUNDRIES.md",
    bucketFolder: "system-kernel",
  },
  {
    localPath: "kernel-formatted/STRUCTURAL_BOUNDRIES_LEGACY.md",
    bucketFolder: "system-kernel",
  },
  {
    localPath: "kernel-formatted/GLYPH_REGISTRY.md",
    bucketFolder: "system-kernel",
  },
  {
    localPath: "kernel-formatted/c3-canon-decision-protocol.md",
    bucketFolder: "system-kernel",
  },
  // Pillar canon meta
  {
    localPath: "canon/pillars/measures-of-inanna-meta.md",
    bucketFolder: "pillar-canon",
  },
  {
    localPath: "canon/pillars/priceless-priceless-gallery-meta.md",
    bucketFolder: "pillar-canon",
  },
  {
    localPath: "canon/pillars/c3-community-partners-dao-llc-meta.md",
    bucketFolder: "pillar-canon",
  },
];

// ─── Validation ────────────────────────────────────────────────────────────────

function validateFrontmatter(filePath: string, content: string): boolean {
  try {
    const { data } = matter(content);
    const required = ["title", "slug", "document_type", "document_scope", "canonical"];
    const missing = required.filter((k) => !data[k]);
    if (missing.length > 0) {
      console.warn(`  ⚠ Missing frontmatter fields in ${filePath}: ${missing.join(", ")}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`  ✗ Frontmatter parse error in ${filePath}:`, e);
    return false;
  }
}

// ─── Upload ────────────────────────────────────────────────────────────────────

async function uploadFile(entry: SyncEntry, baseDir: string): Promise<void> {
  const fullPath = path.join(baseDir, entry.localPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`  ✗ File not found: ${fullPath}`);
    return;
  }

  const content = fs.readFileSync(fullPath, "utf-8");
  const fileName = path.basename(fullPath);
  const storagePath = `${entry.bucketFolder}/${fileName}`;

  // Validate before upload
  const valid = validateFrontmatter(fullPath, content);
  if (!valid) {
    console.warn(`  ⚠ Skipping upload for ${fileName} — frontmatter incomplete`);
    return;
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, content, {
      contentType: "text/markdown",
      upsert: true,
    });

  if (error) {
    console.error(`  ✗ Upload failed: ${storagePath}`, error.message);
  } else {
    console.log(`  ✓ Synced: ${storagePath}`);
  }
}

// ─── OAR log ──────────────────────────────────────────────────────────────────

async function writeOARLog(results: { path: string; status: string }[]): Promise<void> {
  const { error } = await supabase.from("coherent_oar_log").insert({
    pillar: "coherentai",
    object_ref: "kernel-docs-sync",
    object_slug: "sync-to-supabase",
    task_type: "storage-sync",
    objective: "Sync formatted kernel docs and pillar canon meta to Supabase Storage buckets.",
    action: `Uploaded ${results.length} files to codex-vault bucket across system-kernel and pillar-canon folders.`,
    result: results.map((r) => `${r.status}: ${r.path}`).join("\n"),
    authority_table: "supabase_storage",
    authority_view: "codex-vault",
    status: results.every((r) => r.status === "synced") ? "completed" : "partial",
    context: { sync_manifest: MANIFEST.map((e) => e.localPath) },
    created_by: "sync-to-supabase.ts",
  });

  if (error) {
    console.warn("  ⚠ OAR log write failed (non-blocking):", error.message);
  } else {
    console.log("  ✓ OAR log written");
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Resolve base dir relative to this script
  const baseDir = path.resolve(__dirname, "..");

  console.log(`\n╔══ Supabase Storage Sync ══════════════════════════════╗`);
  console.log(`  Bucket: ${BUCKET}`);
  console.log(`  Files:  ${MANIFEST.length}`);
  console.log(`╚═══════════════════════════════════════════════════════╝\n`);

  const results: { path: string; status: string }[] = [];

  for (const entry of MANIFEST) {
    const fileName = path.basename(entry.localPath);
    const storagePath = `${entry.bucketFolder}/${fileName}`;
    console.log(`→ ${storagePath}`);

    const fullPath = path.join(baseDir, entry.localPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`  ✗ Not found: ${fullPath}`);
      results.push({ path: storagePath, status: "missing" });
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    const valid = validateFrontmatter(fullPath, content);

    if (!valid) {
      results.push({ path: storagePath, status: "skipped-invalid-frontmatter" });
      continue;
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, content, {
        contentType: "text/markdown",
        upsert: true,
      });

    if (error) {
      console.error(`  ✗ ${error.message}`);
      results.push({ path: storagePath, status: `failed: ${error.message}` });
    } else {
      console.log(`  ✓ synced`);
      results.push({ path: storagePath, status: "synced" });
    }
  }

  console.log(`\n── Writing OAR log ─────────────────────────────────────`);
  await writeOARLog(results);

  const synced = results.filter((r) => r.status === "synced").length;
  const failed = results.filter((r) => r.status.startsWith("failed")).length;
  const skipped = results.filter((r) => r.status.startsWith("skipped")).length;

  console.log(`\n╔══ Summary ══════════════════════════════════════════════╗`);
  console.log(`  ✓ Synced:  ${synced}`);
  console.log(`  ✗ Failed:  ${failed}`);
  console.log(`  ⚠ Skipped: ${skipped}`);
  console.log(`╚═════════════════════════════════════════════════════════╝\n`);
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
