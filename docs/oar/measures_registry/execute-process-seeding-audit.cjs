require("dotenv").config({ path: ".env" })

const { createHash } = require("node:crypto")
const { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } = require("node:fs")
const { dirname, extname, join, relative, sep } = require("node:path")
const { execFileSync } = require("node:child_process")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const bucketName = "measures-seed"
const auditJsonPath = "docs/oar/measures_registry/process_seeding_audit_v1.json"
const auditMdPath = "docs/oar/measures_registry/process_seeding_audit_v1.md"

const roots = [
  "docs/process",
  "docs/_source/process",
  "docs/_source/oar/session/session_5/process",
]

const dependencyScanRoots = [
  "docs/oar",
  "docs/process",
  "docs/_source/process",
  "scripts",
  "src",
]

function toPosix(path) {
  return path.split(sep).join("/")
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

function walk(dir) {
  if (!existsSync(dir)) return []
  const entries = readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return [toPosix(path)]
  })
}

function frontmatter(content) {
  if (!content.startsWith("---\n")) return {}
  const end = content.indexOf("\n---", 4)
  if (end === -1) return {}
  const block = content.slice(4, end)
  return Object.fromEntries(
    block
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].replace(/^["']|["']$/g, "")]),
  )
}

function classifyPath(path, tracked, dirty, seededMatch, duplicateCanonical) {
  if (dirty || !tracked) return "working_unseeded"
  if (seededMatch) return "seeded"
  if (duplicateCanonical) return "stale_or_superseded"
  return "committed_unseeded"
}

function governingStatus(path, standing) {
  if (standing === "seeded") return "verified_seeded_reference"
  if (standing === "stale_or_superseded") return "non_governing_duplicate_or_source_copy"
  if (path.startsWith("docs/process/")) return "active_local_process_surface_unseeded"
  return "source_reference_unseeded"
}

async function listBucketFiles(prefix = "") {
  const { data, error } = await supabase.storage.from(bucketName).list(prefix, { limit: 1000 })
  if (error) throw new Error(`bucket list failed for ${prefix || "/"}: ${error.message}`)
  const files = []
  for (const item of data) {
    const path = prefix ? `${prefix}/${item.name}` : item.name
    if (item.metadata === null) {
      files.push(...await listBucketFiles(path))
    } else {
      files.push(path)
    }
  }
  return files
}

async function bucketHash(path) {
  const { data, error } = await supabase.storage.from(bucketName).download(path)
  if (error) return null
  const buffer = Buffer.from(await data.arrayBuffer())
  return { sha256: sha256(buffer), bytes: buffer.length }
}

function referenceCount(path, basename) {
  const needles = Array.from(new Set([path, basename]))
  const matches = []
  for (const needle of needles) {
    try {
      const output = execFileSync("rg", ["-n", "--fixed-strings", needle, ...dependencyScanRoots], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim()
      if (output) matches.push(...output.split(/\r?\n/))
    } catch {
      // rg returns non-zero when no matches are found.
    }
  }
  return Array.from(new Set(matches)).filter((line) => !line.includes(auditJsonPath) && !line.includes(auditMdPath))
}

async function main() {
  const bucket = await supabase.storage.getBucket(bucketName)
  if (bucket.error) throw new Error(`bucket lookup failed: ${bucket.error.message}`)

  const bucketFiles = await listBucketFiles()
  const sourceProcessBasenames = new Set(walk("docs/_source/process").map((path) => path.split("/").pop()))
  const rows = []

  for (const path of Array.from(new Set(roots.flatMap(walk))).sort()) {
    const ext = extname(path)
    if (![".md", ".ps1"].includes(ext)) continue

    const content = readFileSync(path)
    const text = content.toString("utf8")
    const basename = path.split("/").pop()
    const metadata = frontmatter(text)
    const status = git(["status", "--porcelain", "--", path])
    const tracked = (() => {
      try {
        git(["ls-files", "--error-unmatch", path])
        return true
      } catch {
        return false
      }
    })()
    const lastCommit = tracked ? git(["log", "-1", "--format=%h %s", "--", path]) : null
    const fileHash = sha256(content)
    const seedCandidate =
      path.startsWith("docs/process/")
        ? `process/${path.slice("docs/process/".length)}`
        : path.startsWith("docs/_source/process/")
          ? `process_source/${path.slice("docs/_source/process/".length)}`
          : null
    const seededObject =
      seedCandidate && bucketFiles.includes(seedCandidate)
        ? { path: seedCandidate, ...(await bucketHash(seedCandidate)) }
        : null
    const seededMatch = Boolean(seededObject && seededObject.sha256 === fileHash)
    const duplicateCanonical =
      path.startsWith("docs/_source/oar/session/session_5/process/") && sourceProcessBasenames.has(basename)
    const standing = classifyPath(path, tracked, status.length > 0, seededMatch, duplicateCanonical)
    const refs = referenceCount(path, basename)

    rows.push({
      path,
      title: metadata.title ?? null,
      document_type: metadata.document_type ?? null,
      current_standing: standing,
      governing_status: governingStatus(path, standing),
      supersession_relation: duplicateCanonical ? `superseded_by docs/_source/process/${basename}` : null,
      seeded_verification_status: seededObject
        ? seededMatch
          ? "hash_verified"
          : "object_present_hash_mismatch"
        : "not_found_in_measures_seed",
      seeded_object_path: seededObject?.path ?? null,
      file_sha256: fileHash,
      stored_sha256: seededObject?.sha256 ?? null,
      tracked,
      git_status: status || "clean",
      last_commit: lastCommit,
      downstream_dependency_references: refs.slice(0, 20),
      downstream_dependency_reference_count: refs.length,
    })
  }

  const summary = {
    generated_at: new Date().toISOString(),
    bucket: bucketName,
    bucket_private: bucket.data.public === false,
    audited_roots: roots,
    row_count: rows.length,
    counts: rows.reduce((acc, row) => {
      acc[row.current_standing] = (acc[row.current_standing] ?? 0) + 1
      return acc
    }, {}),
    notchazz_flags: Array.from(new Set([
      rows.some((row) => row.current_standing !== "seeded") ? "MIXED_PROCESS_STANDING" : null,
      rows.some((row) => row.governing_status === "active_local_process_surface_unseeded")
        ? "UNSEEDED_GOVERNING_REFERENCE"
        : null,
      rows.some((row) => row.current_standing === "stale_or_superseded" && row.downstream_dependency_reference_count > 0)
        ? "SUPERSEDED_PROCESS_SURFACE"
        : null,
      rows.some((row) => row.current_standing !== "seeded" && row.downstream_dependency_reference_count > 0)
        ? "PROCESS_AUTHORITY_AMBIGUITY"
        : null,
    ].filter(Boolean))),
  }

  const report = { summary, rows }

  mkdirSync(dirname(auditJsonPath), { recursive: true })
  writeFileSync(auditJsonPath, `${JSON.stringify(report, null, 2)}\n`)

  const lines = [
    "# Process Seeding Audit v1",
    "",
    `Generated: ${summary.generated_at}`,
    "",
    "## Summary",
    "",
    `- Bucket: ${bucketName}`,
    `- Bucket private: ${summary.bucket_private}`,
    `- Rows audited: ${summary.row_count}`,
    `- Counts: ${JSON.stringify(summary.counts)}`,
    `- NotChazz flags: ${summary.notchazz_flags.length ? summary.notchazz_flags.join(", ") : "none"}`,
    "",
    "## Audit Rows",
    "",
    "| Path | Standing | Governing status | Seed verification | Supersession | Reference count |",
    "| --- | --- | --- | --- | --- | ---: |",
    ...rows.map((row) =>
      `| ${row.path} | ${row.current_standing} | ${row.governing_status} | ${row.seeded_verification_status} | ${row.supersession_relation ?? ""} | ${row.downstream_dependency_reference_count} |`,
    ),
    "",
  ]
  writeFileSync(auditMdPath, `${lines.join("\n")}\n`)

  console.log(JSON.stringify(summary, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
