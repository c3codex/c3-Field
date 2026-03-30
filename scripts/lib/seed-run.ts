#!/usr/bin/env tsx

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  assertFilesExist,
  ensureDir,
  getContentType,
  readManifest,
  renderMarkdownBuild,
  renderPdfBuild,
  requireEnv,
  writeRunReport,
} from "./seed-lib";

async function main(): Promise<void> {
  const overwrite = process.argv.includes("--overwrite");
  const manifestArg = process.argv.find((arg) => arg.startsWith("--manifest="));
  const manifestPath = manifestArg
    ? manifestArg.replace("--manifest=", "")
    : "src/docs/_source/seed/v1/package.manifest.yaml";

  const supabaseUrl = requireEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const manifest = readManifest(path.resolve(process.cwd(), manifestPath));

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const sourceRootAbs = path.resolve(process.cwd(), manifest.source_root);
  const buildMdDir = path.resolve(process.cwd(), "src/docs/_build/md", manifest.package_name);
  const buildPdfDir = path.resolve(process.cwd(), "src/docs/_build/pdf", manifest.package_name);
  const reportDir = path.resolve(process.cwd(), "src/docs/_build/reports");
  const reportPath = path.resolve(reportDir, `${manifest.package_name}_run.md`);

  console.log("\n=== Seed Run ===\n");
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Package: ${manifest.package_name}`);
  console.log(`Source root: ${sourceRootAbs}`);
  console.log(`Storage bucket: ${manifest.storage_bucket}`);
  console.log(`Storage prefix: ${manifest.storage_prefix}`);
  console.log(`Overwrite mode: ${overwrite ? "enabled" : "disabled"}`);

  assertFilesExist(manifest.source_root, manifest.files);

  const builtMd = renderMarkdownBuild(manifest.source_root, manifest.files, buildMdDir);

  let builtPdf: string[] = [];
  if (manifest.pdf?.enabled) {
    builtPdf = renderPdfBuild(manifest.source_root, manifest.pdf.include, buildPdfDir);
  }

  const { error: accessError } = await supabase.storage
    .from(manifest.storage_bucket)
    .list(manifest.storage_prefix, {
      limit: 1,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (accessError) {
    console.error("\nRemote prefix access failed.");
    console.error(`Reason: ${accessError.message}`);
    process.exit(1);
  }

  const uploaded: string[] = [];
  const skipped: string[] = [];
  const failed: Array<{ file: string; reason: string }> = [];

  for (const file of manifest.files) {
    const localPath = path.resolve(sourceRootAbs, file);
    const remotePath = `${manifest.storage_prefix}/${file}`;
    const fileBuffer = fs.readFileSync(localPath);

    const { error } = await supabase.storage
      .from(manifest.storage_bucket)
      .upload(remotePath, fileBuffer, {
        upsert: overwrite,
        contentType: getContentType(file),
      });

    if (!error) {
      uploaded.push(file);
      continue;
    }

    const message = error.message.toLowerCase();
    const alreadyExists =
      message.includes("already exists") ||
      message.includes("duplicate") ||
      message.includes("exists");

    if (alreadyExists && !overwrite) {
      skipped.push(file);
      continue;
    }

    failed.push({ file, reason: error.message });
  }

  writeRunReport(reportPath, manifest, uploaded, skipped, failed, builtMd, builtPdf);

  console.log(`\nBuilt markdown: ${builtMd.length}`);
  console.log(`Built pdf: ${builtPdf.length}`);
  console.log(`Uploaded: ${uploaded.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Report: ${reportPath}`);

  if (failed.length > 0) {
    process.exit(1);
  }

  console.log("\nSeed run complete.\n");
}

main().catch((error) => {
  console.error("\nSeed run failed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
