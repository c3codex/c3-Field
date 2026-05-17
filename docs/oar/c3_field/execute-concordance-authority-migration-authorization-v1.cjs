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
  preflight:
    "docs/oar/c3_field/concordance_authority_execution_package_preflight_v1.sql",
  migration:
    "docs/oar/c3_field/concordance_authority_execution_package_migration_v1.sql",
  seating:
    "docs/oar/c3_field/concordance_authority_execution_package_seed_concordance_v1_seating.sql",
  postValidation:
    "docs/oar/c3_field/concordance_authority_execution_package_post_validation_v1.sql",
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSqlFile(path, label) {
  const sql = fs.readFileSync(path, "utf8")
  const { data, error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
  console.log(`${label}: ok`)
  if (data !== null && data !== undefined) {
    console.log(`${label}: ${JSON.stringify(data)}`)
  }
}

async function readCount(table, filter = {}) {
  let query = supabase.from(table).select("*", {
    count: "exact",
    head: true,
  })

  for (const [column, value] of Object.entries(filter)) {
    query = query.eq(column, value)
  }

  const { count, error } = await query
  if (error) throw error
  return count
}

async function validateExpectedState() {
  const counts = {
    concordance_document: await readCount("concordance_document"),
    concordance_version: await readCount("concordance_version"),
    concordance_term_seed_v1: await readCount("concordance_term", {
      version_key: "seed_concordance_v1",
    }),
    concordance_relation_seed_v1: await readCount("concordance_relation", {
      version_key: "seed_concordance_v1",
    }),
    seeded_source_snapshot_seed_v1: await readCount("seeded_source_snapshot", {
      version_key: "seed_concordance_v1",
    }),
  }

  console.log(`post_validation_counts: ${JSON.stringify(counts)}`)

  if (counts.concordance_document < 1) {
    throw new Error("post validation failed: concordance_document not seated")
  }
  if (counts.concordance_version < 1) {
    throw new Error("post validation failed: concordance_version not seated")
  }
  if (counts.concordance_term_seed_v1 < 9) {
    throw new Error("post validation failed: Seed Concordance terms incomplete")
  }
  if (counts.concordance_relation_seed_v1 < 9) {
    throw new Error("post validation failed: Seed Concordance relations incomplete")
  }
  if (counts.seeded_source_snapshot_seed_v1 < 1) {
    throw new Error("post validation failed: source snapshot not recorded")
  }

  return counts
}

async function main() {
  const phase = process.argv[2] || "all"

  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )
  console.log("db_connection: ok")

  await execSqlFile(files.preflight, "phase_1_preflight")
  if (phase === "preflight") return

  await execSqlFile(files.migration, "phase_2_migration")
  await execSqlFile(files.seating, "phase_3_seed_concordance_seating")
  await execSqlFile(files.postValidation, "phase_4_post_validation_sql")
  await validateExpectedState()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
