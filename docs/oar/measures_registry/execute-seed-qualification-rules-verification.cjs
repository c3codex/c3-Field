require("dotenv").config({ path: ".env" })

const { createHash } = require("node:crypto")
const { readFileSync } = require("node:fs")
const { execFileSync } = require("node:child_process")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)

const sourcePath = "docs/process/governance/seed_qualification_rules.meta.md"
const bucketName = "measures-seed"
const objectPath = "process/governance/seed_qualification_rules.meta.md"

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

async function main() {
  const sourceBuffer = readFileSync(sourcePath)
  const sourceHash = sha256(sourceBuffer)
  const gitStatus = git(["status", "--porcelain", "--", sourcePath])
  const committedPath = git(["ls-files", "--error-unmatch", sourcePath])
  const sourceCommit = git(["log", "-1", "--format=%h %s", "--", sourcePath])

  if (gitStatus) throw new Error(`source has uncommitted changes: ${gitStatus}`)
  if (committedPath !== sourcePath) throw new Error(`source is not committed at expected path: ${committedPath}`)

  const bucket = await supabase.storage.getBucket(bucketName)
  if (bucket.error) throw new Error(`bucket lookup failed: ${bucket.error.message}`)
  if (bucket.data.public) throw new Error(`${bucketName} is public; seeded verification blocked`)

  const listed = await supabase.storage.from(bucketName).list("process/governance", {
    search: "seed_qualification_rules.meta.md",
    limit: 20,
  })
  if (listed.error) throw new Error(`object list failed: ${listed.error.message}`)

  const objectFound = listed.data.some((item) => item.name === "seed_qualification_rules.meta.md")
  if (!objectFound) throw new Error(`object not found at ${objectPath}`)

  const downloaded = await supabase.storage.from(bucketName).download(objectPath)
  if (downloaded.error) throw new Error(`download validation failed: ${downloaded.error.message}`)

  const storedBuffer = Buffer.from(await downloaded.data.arrayBuffer())
  const storedHash = sha256(storedBuffer)

  if (sourceBuffer.length !== storedBuffer.length) {
    throw new Error(`byte mismatch: source ${sourceBuffer.length} stored ${storedBuffer.length}`)
  }

  if (sourceHash !== storedHash) {
    throw new Error(`hash mismatch: source ${sourceHash} stored ${storedHash}`)
  }

  console.log(JSON.stringify({
    sourcePath,
    sourceCommitted: true,
    sourceCommit,
    bucket: bucketName,
    bucketPrivate: bucket.data.public === false,
    objectPath,
    objectFound,
    sourceBytes: sourceBuffer.length,
    storedBytes: storedBuffer.length,
    sourceSha256: sourceHash,
    storedSha256: storedHash,
    contentUnchanged: sourceHash === storedHash,
    operationalRelation: "governing_seeded",
    seededStanding: "seeded",
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
