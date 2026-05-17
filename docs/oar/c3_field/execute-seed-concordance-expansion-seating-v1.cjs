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
  seating: "docs/oar/c3_field/seed_concordance_expansion_seating_v1.sql",
  validation: "docs/oar/c3_field/seed_concordance_expansion_validation_v1.sql",
}

const expansionLabels = [
  "Coherence",
  "c3 Model",
  "Measures Conversion",
  "Quantum Entanglement",
  "OAR1",
  "OAR Log",
  "Signal",
  "Envelope",
  "c3 Key",
  "envKey",
  "SRC",
  "SRC1",
  "SRC2",
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
      .in("term_label", expansionLabels),
  )

  const relationCount = await countRows("concordance_relation", (query) =>
    query
      .eq("version_key", "seed_concordance_v1")
      .eq("relation_standing", "active")
      .eq("metadata->>expansion", "seed_concordance_expansion_seating_v1"),
  )

  const src3Count = await countRows("concordance_term", (query) =>
    query.eq("version_key", "seed_concordance_v1").eq("term_label", "SRC3"),
  )

  console.log(
    `expansion_readback: ${JSON.stringify({
      termCount,
      relationCount,
      src3Count,
    })}`,
  )

  if (termCount !== 13) {
    throw new Error(`expansion validation failed: expected 13 terms, got ${termCount}`)
  }
  if (relationCount !== 51) {
    throw new Error(
      `expansion validation failed: expected 51 relations, got ${relationCount}`,
    )
  }
  if (src3Count !== 0) {
    throw new Error("expansion validation failed: SRC3 was seated")
  }
}

async function main() {
  const phase = process.argv[2] || "all"

  validatePackage()
  if (phase === "validate-package") return

  const probe = await supabase.from("concordance_version").select("version_key").eq("version_key", "seed_concordance_v1").limit(1)
  if (probe.error) throw new Error(`DB connection failed: ${probe.error.message}`)
  if (!probe.data?.length) throw new Error("Seed Concordance v1 is not seated")
  console.log("db_connection: ok")

  if (phase === "readback") {
    await readBack()
    return
  }

  await execSqlFile(files.seating, "phase_1_expansion_seating")
  await execSqlFile(files.validation, "phase_2_expansion_validation_sql")
  await readBack()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
