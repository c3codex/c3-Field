import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import YAML from "yaml";

export type PackageManifest = {
  package_name: string;
  package_type: string;
  version: string;
  source_root: string;
  storage_bucket: string;
  storage_prefix: string;
  pdf?: {
    enabled: boolean;
    include: string[];
  };
  files: string[];
};

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value.trim();
}

export function readManifest(manifestPath: string): PackageManifest {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  const raw = fs.readFileSync(manifestPath, "utf8");
  const parsed = YAML.parse(raw) as PackageManifest;

  if (!parsed.package_name || !parsed.source_root || !parsed.storage_bucket || !parsed.storage_prefix) {
    throw new Error(`Manifest missing required fields: ${manifestPath}`);
  }

  if (!Array.isArray(parsed.files) || parsed.files.length === 0) {
    throw new Error(`Manifest has no files: ${manifestPath}`);
  }

  return parsed;
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function assertFilesExist(sourceRoot: string, files: string[]): void {
  const missing = files.filter((file) => !fs.existsSync(path.resolve(process.cwd(), sourceRoot, file)));
  if (missing.length > 0) {
    throw new Error(`Missing source files:\n- ${missing.join("\n- ")}`);
  }
}

export function renderMarkdownBuild(sourceRoot: string, files: string[], buildMdDir: string): string[] {
  ensureDir(buildMdDir);
  const rendered: string[] = [];

  for (const file of files) {
    const sourcePath = path.resolve(process.cwd(), sourceRoot, file);
    const outPath = path.resolve(buildMdDir, file);

    ensureDir(path.dirname(outPath));
    fs.copyFileSync(sourcePath, outPath);
    rendered.push(outPath);
  }

  return rendered;
}

export function renderPdfBuild(sourceRoot: string, files: string[], buildPdfDir: string): string[] {
  ensureDir(buildPdfDir);
  const rendered: string[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".md")) continue;

    const inputPath = path.resolve(process.cwd(), sourceRoot, file);
    const outputPath = path.resolve(buildPdfDir, file.replace(/\.md$/i, ".pdf"));

    ensureDir(path.dirname(outputPath));

    execSync(`pandoc "${inputPath}" -o "${outputPath}"`, {
      stdio: "inherit",
    });

    rendered.push(outputPath);
  }

  return rendered;
}

export function writeRunReport(
  reportPath: string,
  manifest: PackageManifest,
  uploaded: string[],
  skipped: string[],
  failed: Array<{ file: string; reason: string }>,
  builtMd: string[],
  builtPdf: string[],
): void {
  ensureDir(path.dirname(reportPath));

  const lines = [
    "---",
    "document_type: run_report",
    `package_name: ${manifest.package_name}`,
    `package_type: ${manifest.package_type}`,
    `version: ${manifest.version}`,
    `status: ${failed.length > 0 ? "failed" : "complete"}`,
    "---",
    "",
    `# Run Report — ${manifest.package_name}`,
    "",
    `- Storage bucket: ${manifest.storage_bucket}`,
    `- Storage prefix: ${manifest.storage_prefix}`,
    `- Built markdown: ${builtMd.length}`,
    `- Built pdf: ${builtPdf.length}`,
    `- Uploaded: ${uploaded.length}`,
    `- Skipped: ${skipped.length}`,
    `- Failed: ${failed.length}`,
    "",
    "## Uploaded",
    ...uploaded.map((f) => `- ${f}`),
    "",
    "## Skipped",
    ...skipped.map((f) => `- ${f}`),
    "",
    "## Failed",
    ...failed.map((f) => `- ${f.file}: ${f.reason}`),
    "",
  ];

  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
}

export function getContentType(filename: string): string {
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
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}