#!/usr/bin/env tsx

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const EXPECTED_BUCKET = "measures-seed";
const EXPECTED_PREFIX = "seed/v1";
const LOCAL_SOURCE_DIR = path.resolve(
  process.cwd(),
  "src/docs/measures-seed/seed_package"
);

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

async function main(): Promise<void> {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  console.log("\n=== Seed Storage Confirm ===\n");
  console.log(`Local source: ${LOCAL_SOURCE_DIR}`);
  console.log(`Bucket expected: ${EXPECTED_BUCKET}`);
  console.log(`Prefix expected: ${EXPECTED_PREFIX}`);

  const localFiles = listLocalFiles(LOCAL_SOURCE_DIR);
  console.log(`Local files found: ${localFiles.length}`);

  const { data: remoteFiles, error: listError } = await supabase.storage
    .from(EXPECTED_BUCKET)
    .list(EXPECTED_PREFIX, {
      limit: 200,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (listError) {
    console.error("\nRemote prefix list failed.");
    console.error(`Reason: ${listError.message}`);
    process.exit(1);
  }

  console.log("Supabase reachable: yes");
  console.log("Bucket access: yes");
  console.log("Prefix access: yes");

  const remoteNames = new Set((remoteFiles ?? []).map((file) => file.name));

  const present: string[] = [];
  const missing: string[] = [];

  for (const file of localFiles) {
    if (remoteNames.has(file)) {
      present.push(file);
    } else {
      missing.push(file);
    }
  }

  console.log(`\nRemote files under prefix: ${(remoteFiles ?? []).length}`);
  console.log(`Present remotely: ${present.length}`);
  console.log(`Missing remotely: ${missing.length}`);

  if (present.length > 0) {
    console.log("\nPresent:");
    for (const file of present) {
      console.log(`- ${file}`);
    }
  }

  if (missing.length > 0) {
    console.log("\nMissing:");
    for (const file of missing) {
      console.log(`- ${file}`);
    }
    process.exit(1);
  }

  console.log("\nSeed storage confirm passed.\n");
}

main().catch((error) => {
  console.error("\nConfirm script failed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});