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
  map: "docs/oar/process/db_source_relation_map_reconstruction_passage_v1.md",
  validation:
    "docs/oar/process/db_source_relation_map_reconstruction_validation_v1.sql",
  recovery:
    "docs/oar/process/db_source_relation_map_reconstruction_recovery_posture_v1.md",
}

function assertReadOnlySql(sql, label) {
  const blocked = /\b(insert|update|delete|merge|alter|drop|create|truncate|grant|revoke|begin|commit|rollback)\b/i
  if (blocked.test(sql)) {
    throw new Error(`${label}: validation passage contains mutation or transaction keyword`)
  }
}

function validateArtifacts() {
  for (const [label, path] of Object.entries(files)) {
    if (!fs.existsSync(path)) throw new Error(`${label}: missing artifact ${path}`)
  }

  const map = fs.readFileSync(files.map, "utf8")
  const requiredSections = [
    "## Reconstruction Order",
    "## Source Relation Map",
    "## Runtime Consumers",
    "## Validation Passage",
    "## Authority Distinction",
  ]

  const missing = requiredSections.filter((section) => !map.includes(section))
  if (missing.length > 0) {
    throw new Error(`map missing sections: ${missing.join(", ")}`)
  }

  assertReadOnlySql(fs.readFileSync(files.validation, "utf8"), files.validation)
  console.log("artifact_validation: ok")
}

async function execValidationSql() {
  const sql = fs.readFileSync(files.validation, "utf8")
  assertReadOnlySql(sql, files.validation)

  const { data, error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`validation_sql: ${error.message}`)

  console.log("validation_sql: ok")
  if (data !== null && data !== undefined) {
    console.log(`validation_sql: ${JSON.stringify(data)}`)
  }
}

async function readBackCoreTables() {
  const checks = [
    ["concordance_document", "document_key"],
    ["concordance_version", "version_key"],
    ["concordance_relation", "relation_key"],
    ["c3_oar_process_instance", "process_instance_key"],
    ["c3_oar_transition_event", "transition_event_key"],
    ["c3_oar_seeded_reference", "seeded_reference_key"],
    ["system_process_registry", "process_key"],
    ["system_oar_queue", "queue_key"],
    ["system_oar_execution_evidence", "evidence_key"],
  ]

  const readback = {}

  for (const [table, column] of checks) {
    const { count, error } = await supabase
      .from(table)
      .select(column, { count: "exact", head: true })

    readback[table] = error ? `unreadable: ${error.message}` : count
  }

  console.log(`core_table_readback: ${JSON.stringify(readback)}`)
}

async function main() {
  validateArtifacts()

  const probe = await supabase
    .from("c3_oar_process_instance")
    .select("process_instance_key")
    .limit(1)
  if (probe.error) throw new Error(`DB connection failed: ${probe.error.message}`)
  console.log("db_connection: ok")

  await execValidationSql()
  await readBackCoreTables()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
