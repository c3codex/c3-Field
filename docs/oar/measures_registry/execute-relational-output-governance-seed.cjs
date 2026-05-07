require("dotenv").config({ path: ".env" })

const { createHash } = require("node:crypto")
const { readFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)

const sourcePath = "docs/process/governance/relational_output_governance.meta.md"
const bucketName = "measures-seed"
const objectPath = "process/governance/relational_output_governance.meta.md"

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

async function ensurePrivateBucket() {
  const { data, error } = await supabase.storage.getBucket(bucketName)

  if (!error && data) {
    if (data.public) {
      throw new Error(`${bucketName} exists but is public; transfer blocked`)
    }
    return { bucketCreated: false, bucketPublic: data.public }
  }

  if (!/not found|does not exist/i.test(error?.message ?? "")) {
    throw new Error(`bucket lookup failed: ${error.message}`)
  }

  const createResult = await supabase.storage.createBucket(bucketName, {
    public: false,
  })
  if (createResult.error) throw new Error(`private bucket create failed: ${createResult.error.message}`)

  return { bucketCreated: true, bucketPublic: false }
}

async function main() {
  const sourceBuffer = readFileSync(sourcePath)
  const sourceHash = sha256(sourceBuffer)
  const bucketState = await ensurePrivateBucket()

  const upload = await supabase.storage.from(bucketName).upload(objectPath, sourceBuffer, {
    contentType: "text/markdown; charset=utf-8",
    upsert: true,
  })
  if (upload.error) throw new Error(`upload failed: ${upload.error.message}`)

  const listed = await supabase.storage.from(bucketName).list("process/governance", {
    search: "relational_output_governance.meta.md",
    limit: 20,
  })
  if (listed.error) throw new Error(`object list failed: ${listed.error.message}`)

  const objectFound = listed.data.some((item) => item.name === "relational_output_governance.meta.md")

  const downloaded = await supabase.storage.from(bucketName).download(objectPath)
  if (downloaded.error) throw new Error(`download validation failed: ${downloaded.error.message}`)

  const storedBuffer = Buffer.from(await downloaded.data.arrayBuffer())
  const storedHash = sha256(storedBuffer)

  if (sourceHash !== storedHash) {
    throw new Error(`content drift: source ${sourceHash} stored ${storedHash}`)
  }

  console.log(JSON.stringify({
    sourcePath,
    bucket: bucketName,
    objectPath,
    bucketCreated: bucketState.bucketCreated,
    bucketPrivate: bucketState.bucketPublic === false,
    objectFound,
    sourceBytes: sourceBuffer.length,
    storedBytes: storedBuffer.length,
    sourceSha256: sourceHash,
    storedSha256: storedHash,
    contentUnchanged: sourceHash === storedHash,
    seededStanding: "private_governance_reference",
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
