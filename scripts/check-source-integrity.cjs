const fs = require("node:fs")
const path = require("node:path")

const roots = ["src", "functions"]
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs"])
const failures = []

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (extensions.has(path.extname(entry.name))) inspect(full)
  }
}

function inspect(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
  lines.forEach((line, index) => {
    let inSingle = false
    let inDouble = false
    let inTemplate = false
    let escaped = false
    for (let i = 0; i < line.length - 1; i += 1) {
      const ch = line[i]
      if (escaped) { escaped = false; continue }
      if (ch === "\\") {
        const next = line[i + 1]
        if (!inSingle && !inDouble && !inTemplate && next === "n") {
          const prefix = line.slice(Math.max(0, i - 3), i)
          const suffix = line.slice(i + 2, i + 5)
          const looksLikeRegexEscape =
            prefix.endsWith("/") ||
            prefix.endsWith("[") ||
            prefix.endsWith("[\\r") ||
            suffix.startsWith("{")
          if (!looksLikeRegexEscape) failures.push(`${file}:${index + 1} literal \\n outside a string`)
        }
        escaped = true
        continue
      }
      if (!inDouble && !inTemplate && ch === "'") inSingle = !inSingle
      else if (!inSingle && !inTemplate && ch === '"') inDouble = !inDouble
      else if (!inSingle && !inDouble && ch === "`") inTemplate = !inTemplate
    }
  })
}

roots.forEach(walk)

if (failures.length) {
  console.error("\n[source-integrity] HOLD — escaped newline text found in executable source")
  failures.forEach(item => console.error(`[source-integrity] ${item}`))
  process.exit(42)
}

console.log("[source-integrity] PASS — no literal \\n artifacts outside strings")
// Deployment retrigger: 2026-10-03 — refresh Cloudflare Pages from current c3field HEAD.
