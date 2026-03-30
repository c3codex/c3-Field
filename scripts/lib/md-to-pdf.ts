#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SOURCE_DIR = path.resolve(process.cwd(), "src/docs/_source");
const OUTPUT_DIR = path.resolve(process.cwd(), "src/docs/_pdf");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter((f) => f.endsWith(".md"));

if (files.length === 0) {
  console.log("No markdown files found.");
  process.exit(0);
}

for (const file of files) {
  const inputPath = path.join(SOURCE_DIR, file);
  const outputPath = path.join(
    OUTPUT_DIR,
    file.replace(".md", ".pdf")
  );

  console.log(`Converting: ${file}`);

  try {
    execSync(`pandoc "${inputPath}" -o "${outputPath}"`, {
      stdio: "inherit",
    });
  } catch (err) {
    console.error(`Failed: ${file}`);
  }
}

console.log("\nPDF conversion complete.\n");
