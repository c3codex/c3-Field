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
    "docs/oar/c3_field/seed_concordance_audit_findings_disposition_seating_v1.sql",
  validation:
    "docs/oar/c3_field/seed_concordance_audit_findings_disposition_validation_v1.sql",
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

async function allRows(table, select, buildQuery) {
  let query = supabase.from(table).select(select)
  query = buildQuery ? buildQuery(query) : query
  const { data, error } = await query
  if (error) throw error
  return data || []
}

async function readBack() {
  const termCount = await countRows("concordance_term", (query) =>
    query
      .eq("version_key", "seed_concordance_v1")
      .eq("term_standing", "active")
      .eq("term_label", "Conversion Engine Distinction"),
  )

  const currentSeedScopeCount = await countRows("concordance_term", (query) =>
    query
      .eq("version_key", "seed_concordance_v1")
      .eq("term_standing", "active")
      .eq("term_label", "Current Seed Scope"),
  )

  const treeLayerTermsCount = await countRows("concordance_term", (query) =>
    query
      .eq("version_key", "seed_concordance_v1")
      .eq("term_standing", "active")
      .eq("term_label", "TREE Layer Terms"),
  )

  const relationCount = await countRows("concordance_relation", (query) =>
    query
      .eq("version_key", "seed_concordance_v1")
      .eq("relation_standing", "active")
      .eq("metadata->>expansion", "seed_concordance_audit_findings_disposition_v1"),
  )

  const conversionTerms = await allRows(
    "concordance_term",
    "term_key,visibility_standing",
    (query) =>
      query
        .eq("version_key", "seed_concordance_v1")
        .eq("term_standing", "active")
        .eq("term_label", "Conversion Engine Distinction"),
  )
  const activeTerms = await allRows(
    "concordance_term",
    "term_key",
    (query) =>
      query.eq("version_key", "seed_concordance_v1").eq("term_standing", "active"),
  )
  const dispositionRelations = await allRows(
    "concordance_relation",
    "relation_key,source_ref,target_ref,visibility_standing",
    (query) =>
      query
        .eq("version_key", "seed_concordance_v1")
        .eq("relation_standing", "active")
        .eq("metadata->>expansion", "seed_concordance_audit_findings_disposition_v1"),
  )
  const activeKeys = new Set(activeTerms.map((term) => term.term_key))
  const unresolvedRefs = dispositionRelations.filter((relation) =>
    [relation.source_ref, relation.target_ref].filter(Boolean).some((ref) => {
      return ref.startsWith("seed_concordance_v1_") && !activeKeys.has(ref)
    }),
  )
  const nonInternalVisibility = [
    ...conversionTerms.filter((term) => term.visibility_standing !== "internal"),
    ...dispositionRelations.filter(
      (relation) => relation.visibility_standing !== "internal",
    ),
  ]

  const readback = {
    conversionEngineDistinctionTerms: termCount,
    conversionEngineDistinctionRelations: relationCount,
    currentSeedScopeTerms: currentSeedScopeCount,
    treeLayerTermsTerms: treeLayerTermsCount,
    unresolvedRefs: unresolvedRefs.length,
    nonInternalVisibility: nonInternalVisibility.length,
  }

  console.log(`audit_findings_disposition_readback: ${JSON.stringify(readback)}`)

  if (termCount !== 1) {
    throw new Error(`expected 1 Conversion Engine Distinction term, got ${termCount}`)
  }
  if (relationCount !== 9) {
    throw new Error(
      `expected 9 Conversion Engine Distinction relations, got ${relationCount}`,
    )
  }
  if (currentSeedScopeCount !== 0) {
    throw new Error("Current Seed Scope must remain classified as non-term")
  }
  if (treeLayerTermsCount !== 0) {
    throw new Error("TREE Layer Terms must remain deferred")
  }
  if (unresolvedRefs.length !== 0) {
    throw new Error(
      `found unresolved disposition refs: ${unresolvedRefs
        .map((relation) => relation.relation_key)
        .join(", ")}`,
    )
  }
  if (nonInternalVisibility.length !== 0) {
    throw new Error("all disposition terms and relations must remain internal")
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

  await execSqlFile(files.seating, "phase_1_audit_findings_disposition_seating")
  await execSqlFile(files.validation, "phase_2_audit_findings_disposition_validation_sql")
  await readBack()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
