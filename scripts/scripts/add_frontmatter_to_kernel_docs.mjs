import fs from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();

// Change this if your kernel docs live elsewhere in the repo.
const TARGET_DIR = path.join(ROOT_DIR, "codex-vault", "system-kernel");

// Default frontmatter template.
// You can edit these defaults once and rerun safely on files that do not yet have frontmatter.
const DEFAULT_FRONTMATTER = {
  title: "",
  doc_class: "draft",
  binding_strength: "medium",
  pillar: "coherentai",
  status: "active",
  scope: "system",
  container_ref: "",
  encounter_type: "",
  glyph: "",
  glyph_role: "",
  governs_layers: [],
  related_docs: [],
  source_bucket: "codex-vault",
  source_folder: "system-kernel",
};

function isMarkdownFile(filename) {
  return filename.toLowerCase().endsWith(".md");
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && isMarkdownFile(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function hasFrontmatter(content) {
  return content.startsWith("---\n") || content.startsWith("---\r\n");
}

function makeTitleFromFilename(filePath) {
  const base = path.basename(filePath, ".md");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function yamlValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return "\n" + value.map((v) => `  - ${String(v)}`).join("\n");
  }

  if (value === null || value === undefined) return "";

  if (typeof value === "string") {
    return value;
  }

  return String(value);
}

function buildFrontmatter(filePath) {
  const fm = {
    ...DEFAULT_FRONTMATTER,
    title: makeTitleFromFilename(filePath),
  };

  const lines = ["---"];
  for (const [key, value] of Object.entries(fm)) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:${yamlValue(value)}`);
      }
    } else {
      lines.push(`${key}: ${yamlValue(value)}`);
    }
  }
  lines.push("---", "");

  return lines.join("\n");
}

async function main() {
  try {
    const stat = await fs.stat(TARGET_DIR).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      throw new Error(`Target directory not found: ${TARGET_DIR}`);
    }

    const files = await walk(TARGET_DIR);

    if (files.length === 0) {
      console.log(`No markdown files found in ${TARGET_DIR}`);
      return;
    }

    let added = 0;
    let skipped = 0;

    for (const file of files) {
      const content = await fs.readFile(file, "utf8");

      if (hasFrontmatter(content)) {
        skipped += 1;
        console.log(`SKIP  ${path.relative(ROOT_DIR, file)}  (already has frontmatter)`);
        continue;
      }

      const frontmatter = buildFrontmatter(file);
      const updated = `${frontmatter}${content}`;

      await fs.writeFile(file, updated, "utf8");
      added += 1;
      console.log(`ADD   ${path.relative(ROOT_DIR, file)}`);
    }

    console.log("");
    console.log(`Done.`);
    console.log(`Added frontmatter: ${added}`);
    console.log(`Skipped: ${skipped}`);
  } catch (error) {
    console.error("Frontmatter insertion failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();