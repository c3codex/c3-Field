require("dotenv").config({ path: ".env" })

const { createHash } = require("node:crypto")
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs")
const { dirname, extname, sep } = require("node:path")
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
const auditJsonPath = "docs/oar/measures_registry/process_seeding_reaudit_v1.json"
const auditMdPath = "docs/oar/measures_registry/process_seeding_reaudit_v1.md"

const governingRule = {
  sourcePath: "docs/process/governance/seed_qualification_rules.meta.md",
  objectPath: "process/governance/seed_qualification_rules.meta.md",
}

const candidatePaths = [
  "docs/process/oar_lifecycle.meta.md",
  "docs/process/oar/oar2_generation_and_handoff_process.meta.md",
  "docs/process/oar/templates/oar1_template.meta.md",
  "docs/process/oar/templates/oar2_template.meta.md",
  "docs/process/oar/db_role_contract_supabase.meta.md",
  "docs/process/publication/new-publication-dispatch.ps1",
  "docs/process/oar/new-oar.ps1",
]

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
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

function toObjectPath(path) {
  return `process/${path.slice("docs/process/".length).split(sep).join("/")}`
}

async function downloadHash(objectPath) {
  const { data, error } = await supabase.storage.from(bucketName).download(objectPath)
  if (error) return null
  const buffer = Buffer.from(await data.arrayBuffer())
  return { bytes: buffer.length, sha256: sha256(buffer) }
}

function referenceCount(path) {
  const basename = path.split("/").pop()
  const roots = ["docs/oar", "docs/process", "docs/_source/process", "scripts", "src"]
  const needles = Array.from(new Set([path, basename]))
  const matches = []

  for (const needle of needles) {
    try {
      const output = execFileSync("rg", ["-n", "--fixed-strings", needle, ...roots], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim()
      if (output) matches.push(...output.split(/\r?\n/))
    } catch {
      // no matches
    }
  }

  return Array.from(new Set(matches)).filter((line) => !line.includes(auditJsonPath) && !line.includes(auditMdPath))
}

async function verifyGoverningRule(bucket) {
  const buffer = readFileSync(governingRule.sourcePath)
  const sourceHash = sha256(buffer)
  const status = git(["status", "--porcelain", "--", governingRule.sourcePath])
  const sourceCommit = git(["log", "-1", "--format=%h %s", "--", governingRule.sourcePath])
  const stored = await downloadHash(governingRule.objectPath)

  return {
    ...governingRule,
    sourceCommit,
    sourceClean: status.length === 0,
    bucketPrivate: bucket.data.public === false,
    sourceBytes: buffer.length,
    storedBytes: stored?.bytes ?? null,
    sourceSha256: sourceHash,
    storedSha256: stored?.sha256 ?? null,
    contentUnchanged: Boolean(stored && stored.sha256 === sourceHash && stored.bytes === buffer.length),
    operationalRelation: "governing_seeded",
  }
}

async function classifyCandidate(path) {
  const exists = existsSync(path)
  const buffer = exists ? readFileSync(path) : Buffer.from("")
  const content = buffer.toString("utf8")
  const metadata = exists ? frontmatter(content) : {}
  const gitStatus = exists ? git(["status", "--porcelain", "--", path]) : "missing"
  const tracked = (() => {
    if (!exists) return false
    try {
      git(["ls-files", "--error-unmatch", path])
      return true
    } catch {
      return false
    }
  })()
  const lastCommit = tracked ? git(["log", "-1", "--format=%h %s", "--", path]) : null
  const objectPath = exists && path.startsWith("docs/process/") ? toObjectPath(path) : null
  const stored = objectPath ? await downloadHash(objectPath) : null
  const fileHash = exists ? sha256(buffer) : null
  const refs = exists ? referenceCount(path) : []

  const requirements = {
    local_file_exists: exists,
    repository_source_committed: tracked && gitStatus.length === 0,
    bucket_transfer_complete: Boolean(stored),
    hash_verification_complete: Boolean(stored && stored.sha256 === fileHash && stored.bytes === buffer.length),
    operational_relation_declared: false,
  }

  const isTemplate = path.includes("/templates/")
  const isScript = extname(path).toLowerCase() === ".ps1"
  const activeWorkflowDoc = path.endsWith(".meta.md") && path.startsWith("docs/process/")
  const allVerificationReady =
    requirements.local_file_exists &&
    requirements.repository_source_committed &&
    requirements.bucket_transfer_complete &&
    requirements.hash_verification_complete

  let classification = "committed_unseeded"
  if (!exists || !tracked || gitStatus.length > 0) classification = "requires_additional_validation"
  else if (!stored) classification = "requires_bucket_transfer"
  else if (!requirements.hash_verification_complete) classification = "requires_hash_verification"
  else if (isTemplate || isScript) classification = "qualifies_for_reference_seeded"
  else if (activeWorkflowDoc) classification = "qualifies_for_governing_seeded"

  return {
    path,
    title: metadata.title ?? null,
    document_type: metadata.document_type ?? null,
    current_standing: stored && requirements.hash_verification_complete ? "verified_unrecognized" : "committed_unseeded",
    candidate_classification: classification,
    recommended_seeded_type:
      classification === "qualifies_for_governing_seeded"
        ? "governing_seeded"
        : classification === "qualifies_for_reference_seeded"
          ? "reference_seeded"
          : null,
    requirements,
    requires_additional_validation: classification === "requires_additional_validation",
    requires_bucket_transfer: !requirements.bucket_transfer_complete,
    requires_hash_verification: requirements.bucket_transfer_complete && !requirements.hash_verification_complete,
    objectPath,
    sourceBytes: exists ? buffer.length : null,
    storedBytes: stored?.bytes ?? null,
    sourceSha256: fileHash,
    storedSha256: stored?.sha256 ?? null,
    git_status: gitStatus || "clean",
    tracked,
    lastCommit,
    downstream_dependency_reference_count: refs.length,
    downstream_dependency_references: refs.slice(0, 20),
  }
}

async function main() {
  const bucket = await supabase.storage.getBucket(bucketName)
  if (bucket.error) throw new Error(`bucket lookup failed: ${bucket.error.message}`)
  if (bucket.data.public) throw new Error(`${bucketName} is public; re-audit blocked`)

  const governingRuleVerification = await verifyGoverningRule(bucket)
  if (!governingRuleVerification.contentUnchanged) {
    throw new Error("governing seed qualification rule failed hash verification")
  }

  const candidates = []
  for (const path of candidatePaths) {
    candidates.push(await classifyCandidate(path))
  }

  const summary = {
    generated_at: new Date().toISOString(),
    bucket: bucketName,
    bucket_private: bucket.data.public === false,
    governing_rule: governingRuleVerification,
    candidate_count: candidates.length,
    counts: candidates.reduce((acc, row) => {
      acc[row.candidate_classification] = (acc[row.candidate_classification] ?? 0) + 1
      return acc
    }, {}),
    next_seed_candidates: candidates
      .filter((row) => row.candidate_classification.startsWith("qualifies_for_"))
      .map((row) => ({ path: row.path, type: row.recommended_seeded_type })),
    notchazz_flags: Array.from(new Set([
      "MIXED_PROCESS_AUTHORITY",
      candidates.some((row) => row.candidate_classification.startsWith("qualifies_for_"))
        ? "IMPLIED_SEEDED_STANDING"
        : null,
    ].filter(Boolean))),
    bulk_seeding_prevented: true,
  }

  const report = { summary, candidates }
  mkdirSync(dirname(auditJsonPath), { recursive: true })
  writeFileSync(auditJsonPath, `${JSON.stringify(report, null, 2)}\n`)

  const lines = [
    "# Process Seeding Re-Audit v1",
    "",
    `Generated: ${summary.generated_at}`,
    "",
    "## Governing Rule",
    "",
    `- Source: ${governingRuleVerification.sourcePath}`,
    `- Object: ${governingRuleVerification.objectPath}`,
    `- Operational relation: ${governingRuleVerification.operationalRelation}`,
    `- Hash verified: ${governingRuleVerification.contentUnchanged}`,
    "",
    "## Summary",
    "",
    `- Candidate count: ${summary.candidate_count}`,
    `- Counts: ${JSON.stringify(summary.counts)}`,
    `- Bulk seeding prevented: ${summary.bulk_seeding_prevented}`,
    `- NotChazz flags: ${summary.notchazz_flags.join(", ")}`,
    "",
    "## Candidate Rows",
    "",
    "| Path | Classification | Recommended standing | Requires bucket transfer | Requires hash verification | References |",
    "| --- | --- | --- | --- | --- | ---: |",
    ...candidates.map((row) =>
      `| ${row.path} | ${row.candidate_classification} | ${row.recommended_seeded_type ?? ""} | ${row.requires_bucket_transfer} | ${row.requires_hash_verification} | ${row.downstream_dependency_reference_count} |`,
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
