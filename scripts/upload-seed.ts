#!/usr/bin/env tsx

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const EXPECTED_BUCKET = "measures-seed";
const EXPECTED_PREFIX = "src/docs/measures-seed";
const LOCAL_SOURCE_DIR = path.resolve(process.cwd(), "src/docs/measures-seed");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value.trim();
}

function listLocalFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Local source folder not found: ${dir}`);
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case ".md":
      return "text/markdown";
    case ".yaml":
    case ".yml":
      return "application/yaml";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

async function main(): Promise<void> {
  const overwrite = process.argv.includes("--overwrite");

  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseAnonKey = requireEnv("VITE_SUPABASE_ANON_KEY");

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("\n=== Seed Upload ===\n");
  console.log(`Local source: ${LOCAL_SOURCE_DIR}`);
  console.log(`Bucket target: ${EXPECTED_BUCKET}`);
  console.log(`Prefix target: ${EXPECTED_PREFIX}`);
  console.log(`Overwrite mode: ${overwrite ? "enabled" : "disabled"}`);

  const { error: bucketError } = await supabase.storage.getBucket(EXPECTED_BUCKET);
  if (bucketError) {
    console.error("\nBucket confirm failed.");
    console.error(`Reason: ${bucketError.message}`);
    process.exit(1);
  }

  const localFiles = listLocalFiles(LOCAL_SOURCE_DIR);
  if (localFiles.length === 0) {
    console.error("\nNo local seed files found to upload.");
    process.exit(1);
  }

  const uploaded: string[] = [];
  const skipped: string[] = [];
  const failed: Array<{ file: string; reason: string }> = [];

  for (const filename of localFiles) {
    const localPath = path.join(LOCAL_SOURCE_DIR, filename);
    const remotePath = `${EXPECTED_PREFIX}/${filename}`;
    const fileBuffer = fs.readFileSync(localPath);

    const { error } = await supabase.storage
      .from(EXPECTED_BUCKET)
      .upload(remotePath, fileBuffer, {
        upsert: overwrite,
        contentType: getContentType(filename),
      });

    if (!error) {
      uploaded.push(filename);
      continue;
    }

    const alreadyExists =
      error.message.toLowerCase().includes("already exists") ||
      error.message.toLowerCase().includes("duplicate");

    if (alreadyExists && !overwrite) {
      skipped.push(filename);
      continue;
    }

    failed.push({ file: filename, reason: error.message });
  }

  console.log(`\nLocal files processed: ${localFiles.length}`);
  console.log(`Uploaded: ${uploaded.length}`);
  console.log(`Skipped (already present): ${skipped.length}`);
  console.log(`Failed: ${failed.length}`);

  if (uploaded.length > 0) {
    console.log("\nUploaded:");
    for (const file of uploaded) {
      console.log(`- ${file}`);
    }
  }

  if (skipped.length > 0) {
    console.log("\nSkipped:");
    for (const file of skipped) {
      console.log(`- ${file}`);
    }
  }

  if (failed.length > 0) {
    console.log("\nFailed:");
    for (const item of failed) {
      console.log(`- ${item.file}: ${item.reason}`);
    }
    process.exit(1);
  }

  console.log("\nSeed upload complete.\n");
}

main().catch((error) => {
  console.error("\nUpload script failed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});