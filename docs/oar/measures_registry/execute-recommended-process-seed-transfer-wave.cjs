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
const bucketName = "measures-seed"

const transfers = [
  {
    relation: "governing_candidate",
    sourcePath: "docs/process/oar_lifecycle.meta.md",
    objectPath: "process/oar_lifecycle.meta.md",
  },
  {
    relation: "governing_candidate",
    sourcePath: "docs/process/oar/oar2_generation_and_handoff_process.meta.md",
    objectPath: "process/oar/oar2_generation_and_handoff_process.meta.md",
  },
  {
    relation: "reference_candidate",
    sourcePath: "docs/process/oar/templates/oar1_template.meta.md",
    objectPath: "process/oar/templates/oar1_template.meta.md",
  },
  {
    relation: "reference_candidate",
    sourcePath: "docs/process/oar/templates/oar2_template.meta.md",
    objectPath: "process/oar/templates/oar2_template.meta.md",
  },
  {
    relation: "reference_candidate",
    sourcePath: "docs/process/oar/db_role_contract_supabase.meta.md",
    objectPath: "process/oar/db_role_contract_supabase.meta.md",
  },
]

const heldCandidates = [
  "process/publication/new-publication-dispatch.ps1",
  "process/oar/new-oar.ps1",
]

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

function contentTypeFor(path) {
  if (path.endsWith(".ps1")) return "text/plain; charset=utf-8"
  return "text/markdown; charset=utf-8"
}

async function listObject(objectPath) {
  const parts = objectPath.split("/")
  const fileName = parts.pop()
  const prefix = parts.join("/")
  const listed = await supabase.storage.from(bucketName).list(prefix, {
    search: fileName,
    limit: 20,
  })
  if (listed.error) throw new Error(`object list failed for ${objectPath}: ${listed.error.message}`)

  return listed.data.some((item) => item.name === fileName)
}

async function assertHeldCandidatesAbsent() {
  const results = []
  for (const objectPath of heldCandidates) {
    results.push({
      objectPath,
      transferred: await listObject(objectPath),
    })
  }

  const transferredHeld = results.filter((item) => item.transferred)
  if (transferredHeld.length > 0) {
    throw new Error(`held candidate object present: ${transferredHeld.map((item) => item.objectPath).join(", ")}`)
  }

  return results
}

async function main() {
  const bucket = await supabase.storage.getBucket(bucketName)
  if (bucket.error) throw new Error(`bucket lookup failed: ${bucket.error.message}`)
  if (bucket.data.public) throw new Error(`${bucketName} is public; transfer blocked`)

  const transferResults = []

  for (const transfer of transfers) {
    const sourceBuffer = readFileSync(transfer.sourcePath)
    const sourceSha256 = sha256(sourceBuffer)

    const upload = await supabase.storage.from(bucketName).upload(transfer.objectPath, sourceBuffer, {
      contentType: contentTypeFor(transfer.sourcePath),
      upsert: true,
    })
    if (upload.error) throw new Error(`upload failed for ${transfer.objectPath}: ${upload.error.message}`)

    const objectFound = await listObject(transfer.objectPath)
    if (!objectFound) throw new Error(`object not found after transfer: ${transfer.objectPath}`)

    const downloaded = await supabase.storage.from(bucketName).download(transfer.objectPath)
    if (downloaded.error) throw new Error(`download validation failed for ${transfer.objectPath}: ${downloaded.error.message}`)

    const storedBuffer = Buffer.from(await downloaded.data.arrayBuffer())
    const storedSha256 = sha256(storedBuffer)
    const contentUnchanged = sourceBuffer.length === storedBuffer.length && sourceSha256 === storedSha256

    if (!contentUnchanged) {
      throw new Error(`content drift for ${transfer.objectPath}: source ${sourceSha256} stored ${storedSha256}`)
    }

    transferResults.push({
      relation: transfer.relation,
      sourcePath: transfer.sourcePath,
      objectPath: transfer.objectPath,
      objectFound,
      sourceBytes: sourceBuffer.length,
      storedBytes: storedBuffer.length,
      sourceSha256,
      storedSha256,
      contentUnchanged,
      transferOnly: true,
      seededStandingClaimed: false,
    })
  }

  const heldCandidateResults = await assertHeldCandidatesAbsent()

  console.log(JSON.stringify({
    generated_at: new Date().toISOString(),
    bucket: bucketName,
    bucketPrivate: bucket.data.public === false,
    transferCount: transferResults.length,
    transfers: transferResults,
    heldCandidates: heldCandidateResults,
    seededStandingClaimed: false,
    seededStandingWithheld: true,
    notchazz_flags_prevented: [
      "BUCKET_TRANSFER_NOT_SEEDED",
      "REFERENCE_PROMOTED_WITHOUT_QUALIFICATION",
      "TOOL_SEEDED_WITHOUT_DEPENDENCY",
      "BULK_SEEDING_ATTEMPT",
    ],
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
