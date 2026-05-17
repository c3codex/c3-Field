require("dotenv").config({ path: ".env" })

const fs = require("fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const files = {
  seating:
    "docs/oar/c3_field/seed_concordance_governance_expansion_seating_v1.sql",
  validation:
    "docs/oar/c3_field/seed_concordance_governance_expansion_validation_v1.sql",
}

const governanceLabels = [
  "Constraints",
  "Roles",
  "Immutables",
  "Verification",
  "Recognition",
  "Dependency",
  "State",
]

function assertRpcCompatibleSql(sql, label) {
  const transactionCommand = /^\s*(begin|commit|rollback)\s*;/gim
  const match = sql.match(transactionCommand)

  if (match) {
    throw new Error(
      `${label}: RPC package contains transaction control: ${match.join(", ")}`,
    )
  }
}

function validatePackage() {
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
  const termCount = await countRows("concordance_term", (query) =>
    query
      .eq("version_key", "seed_concordance_v1")
      .eq("term_standing", "active")
      .in("term_label", governanceLabels),
  )

  const relationCount = await countRows("concordance_relation", (query) =>
    query
      .eq("version_key", "seed_concordance_v1")
      .eq("relation_standing", "active")
      .eq("metadata->>expansion", "seed_concordance_governance_expansion_seating_v1"),
  )

  console.log(
    `governance_expansion_readback: ${JSON.stringify({
      termCount,
      relationCount,
    })}`,
  )

  if (termCount !== 7) {
    throw new Error(`governance validation failed: expected 7 terms, got ${termCount}`)
  }
  if (relationCount !== 35) {
    throw new Error(
      `governance validation failed: expected 35 relations, got ${relationCount}`,
    )
  }
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

  await execSqlFile(files.seating, "phase_1_governance_expansion_seating")
  await execSqlFile(files.validation, "phase_2_governance_expansion_validation_sql")
  await readBack()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
