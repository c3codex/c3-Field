require("dotenv").config({ path: ".env" })

const fs = require("fs")
const { createHash } = require("crypto")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sourcePath =
  "docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md"
const expectedHash =
  "78d1a5383c98cc77098d74dc4ec35a8084bfc5efd33cce5b78bb2053c6a3b644"
const expectedByteSize = 4744

const files = {
  seating:
    "docs/oar/measures_registry/measures_registry_sitewide_style_contract_seating_v1.sql",
  validation:
    "docs/oar/measures_registry/measures_registry_sitewide_style_contract_validation_v1.sql",
}

function assertRpcCompatibleSql(sql, label) {
  const transactionCommand = /^\s*(begin|commit|rollback)\s*;/gim
  const match = sql.match(transactionCommand)

  if (match) {
    throw new Error(
      `${label}: RPC package contains transaction control: ${match.join(", ")}`,
    )
  }
}

function validateSourceSnapshot() {
  const bytes = fs.readFileSync(sourcePath)
  const hash = createHash("sha256").update(bytes).digest("hex")

  if (hash !== expectedHash) {
    throw new Error(`source hash mismatch: expected ${expectedHash}, got ${hash}`)
  }
  if (bytes.length !== expectedByteSize) {
    throw new Error(
      `source byte size mismatch: expected ${expectedByteSize}, got ${bytes.length}`,
    )
  }
  console.log("source_snapshot_validation: ok")
}

function validatePackage() {
  validateSourceSnapshot()
  for (const path of Object.values(files)) {
    assertRpcCompatibleSql(fs.readFileSync(path, "utf8"), path)
  }
  console.log("rpc_package_validation: ok")
}

async function execSqlFile(path, label) {
  const sql = fs.readFileSync(path, "utf8")
  assertRpcCompatibleSql(sql, label)
  const { data, error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
  console.log(`${label}: ok`)
  if (data !== null && data !== undefined) {
    console.log(`${label}: ${JSON.stringify(data)}`)
  }
}

async function countRows(table, buildQuery) {
  let query = supabase.from(table).select("*", { count: "exact", head: true })
  query = buildQuery ? buildQuery(query) : query
  const { count, error } = await query
  if (error) throw error
  return count
}

async function readBack() {
  const documentCount = await countRows("concordance_document", (query) =>
    query
      .eq("document_key", "measures_registry_sitewide_style_contract")
      .eq("authority_standing", "active")
      .eq("visibility_standing", "internal")
      .eq("document_scope", "sitewide_style_contract")
      .eq("metadata->>document_type", "style_contract")
      .eq("metadata->>status", "seeded")
      .eq("metadata->>system_key", "measures_registry"),
  )

  const versionCount = await countRows("concordance_version", (query) =>
    query
      .eq("version_key", "measures_registry_sitewide_style_contract_v1")
      .eq("document_key", "measures_registry_sitewide_style_contract")
      .eq("version_standing", "active")
      .eq("visibility_standing", "internal")
      .eq("metadata->>status", "seeded")
      .eq("metadata->>system_key", "measures_registry"),
  )

  const relationCount = await countRows("concordance_relation", (query) =>
    query
      .eq("version_key", "measures_registry_sitewide_style_contract_v1")
      .eq("relation_standing", "active")
      .eq("visibility_standing", "internal")
      .eq("metadata->>seating", "sitewide_style_contract_seating"),
  )

  const snapshotCount = await countRows("seeded_source_snapshot", (query) =>
    query
      .eq("snapshot_key", "mrssc_v1_local_source_78d1a538")
      .eq("version_key", "measures_registry_sitewide_style_contract_v1")
      .eq("verification_standing", "verified")
      .eq("source_sha256", expectedHash)
      .eq("byte_size", expectedByteSize),
  )

  const readback = {
    styleContractDocuments: documentCount,
    styleContractVersions: versionCount,
    styleContractRelations: relationCount,
    verifiedSnapshots: snapshotCount,
  }

  console.log(`sitewide_style_contract_readback: ${JSON.stringify(readback)}`)

  if (documentCount !== 1) throw new Error("style contract document not seated")
  if (versionCount !== 1) throw new Error("style contract version not seated")
  if (relationCount !== 11) {
    throw new Error(`expected 11 style contract relations, got ${relationCount}`)
  }
  if (snapshotCount !== 1) throw new Error("verified source snapshot not seated")
}

async function main() {
  const phase = process.argv[2] || "all"

  validatePackage()
  if (phase === "validate-package") return

  const probe = await supabase
    .from("concordance_version")
    .select("version_key")
    .eq("version_key", "seed_concordance_v1")
    .limit(1)
  if (probe.error) throw new Error(`DB connection failed: ${probe.error.message}`)
  if (!probe.data?.length) throw new Error("Seed Concordance v1 is not seated")
  console.log("db_connection: ok")

  if (phase === "readback") {
    await readBack()
    return
  }

  await execSqlFile(files.seating, "phase_1_sitewide_style_contract_seating")
  await execSqlFile(files.validation, "phase_2_sitewide_style_contract_validation_sql")
  await readBack()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
