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

const sourcePath = "docs/_source/seed/seed_concordance.meta.md"
const reportPath = "docs/oar/c3_field/seed_concordance_completeness_audit_readback_v1.md"
const auditSqlPath = "docs/oar/c3_field/seed_concordance_completeness_audit_v1.sql"
const validationSqlPath =
  "docs/oar/c3_field/seed_concordance_completeness_validation_v1.sql"

const expectedMissingByScope = new Set([
  "Roots",
  "Boundary",
  "Branches",
  "Canopy",
  "Environment",
  "Geometric Logic",
])

const expectedExcluded = new Set(["SRC3"])

function sourceHeadings() {
  const text = fs.readFileSync(sourcePath, "utf8")
  return [...text.matchAll(/^###\s+`?(.+?)`?\s*$/gm)].map((match) =>
    match[1].replace(/^`|`$/g, "").trim(),
  )
}

async function allRows(table, select, buildQuery) {
  let query = supabase.from(table).select(select)
  query = buildQuery ? buildQuery(query) : query
  const { data, error } = await query
  if (error) throw error
  return data || []
}

function groupCount(rows, keyFn) {
  const out = new Map()
  for (const row of rows) {
    const key = keyFn(row)
    out.set(key, (out.get(key) || 0) + 1)
  }
  return [...out.entries()].sort(([a], [b]) => a.localeCompare(b))
}

function assertReadOnlySql(sql, label) {
  const blocked = /\b(insert|update|delete|merge|alter|drop|create|truncate|grant|revoke|begin|commit|rollback)\b/i
  if (blocked.test(sql)) {
    throw new Error(`${label} contains a mutation or transaction keyword`)
  }
}

async function executeSqlArtifact(path, label) {
  const sql = fs.readFileSync(path, "utf8")
  assertReadOnlySql(sql, label)

  const { data, error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label} failed: ${error.message}`)

  console.log(`${label}: ok`)
  return data
}

async function main() {
  const probe = await supabase
    .from("concordance_version")
    .select("version_key")
    .eq("version_key", "seed_concordance_v1")
    .limit(1)
  if (probe.error) throw new Error(`DB connection failed: ${probe.error.message}`)
  if (!probe.data?.length) throw new Error("Seed Concordance v1 is not seated")
  console.log("db_connection: ok")

  await executeSqlArtifact(auditSqlPath, "audit_sql")
  await executeSqlArtifact(validationSqlPath, "validation_sql")

  const terms = await allRows(
    "concordance_term",
    "term_key,term_label,term_standing,visibility_standing,metadata",
    (query) => query.eq("version_key", "seed_concordance_v1"),
  )
  const relations = await allRows(
    "concordance_relation",
    "relation_key,version_key,source_ref,target_ref,relation_scope,relation_type,relation_standing,visibility_standing,metadata",
    (query) => query.eq("version_key", "seed_concordance_v1"),
  )
  const versions = await allRows(
    "concordance_version",
    "version_key,document_key,version_standing,visibility_standing",
    (query) => query.eq("document_key", "seed_concordance"),
  )
  const documents = await allRows(
    "concordance_document",
    "document_key,authority_standing,visibility_standing,native_order",
    (query) => query.eq("document_key", "seed_concordance"),
  )

  const activeTerms = terms.filter((term) => term.term_standing === "active")
  const activeLabels = new Set(activeTerms.map((term) => term.term_label))
  const activeKeys = new Set(activeTerms.map((term) => term.term_key))
  const sourceTerms = sourceHeadings()

  const duplicateActiveLabels = groupCount(activeTerms, (term) => term.term_label)
    .filter(([, count]) => count > 1)
    .map(([label, count]) => ({ label, count }))

  const orphanRelations = relations.filter(
    (relation) => !versions.some((version) => version.version_key === relation.version_key),
  )

  const unresolvedRefs = relations.filter((relation) => {
    const refs = [relation.source_ref, relation.target_ref].filter(Boolean)
    return refs.some(
      (ref) => ref.startsWith("seed_concordance_v1_") && !activeKeys.has(ref),
    )
  })

  const protectedPublic = activeTerms.filter(
    (term) =>
      term.visibility_standing === "public" &&
      (term.metadata?.protected === true ||
        ["Protected Systems Intelligence", "NotChazz", "Chazz_roles"].includes(
          term.term_label,
        )),
  )

  const missingSourceTerms = sourceTerms
    .filter((label) => !activeLabels.has(label))
    .filter((label) => !expectedExcluded.has(label))
    .map((label) => ({
      label,
      standing: expectedMissingByScope.has(label)
        ? "known_scope_deferred_or_layer_component"
        : "missing_active_term",
    }))

  const relationByStratum = groupCount(relations, (relation) => {
    const stratum = relation.metadata?.expansion || "initial_authority_anchor"
    return `${stratum} / ${relation.relation_type}`
  })

  const visibility = groupCount(activeTerms, (term) => term.visibility_standing)

  const inactiveVersions = versions.filter(
    (version) => version.version_standing !== "active",
  )

  const authorityBoundaryOk =
    documents.length === 1 &&
    documents[0].authority_standing === "active" &&
    documents[0].native_order === "Codex -> Field -> Measures -> Chazz"

  const validationIssues = [
    ...duplicateActiveLabels.map((item) => `duplicate active label: ${item.label}`),
    ...orphanRelations.map((item) => `orphan relation: ${item.relation_key}`),
    ...unresolvedRefs.map((item) => `unresolved ref: ${item.relation_key}`),
    ...protectedPublic.map((item) => `protected public term: ${item.term_label}`),
    ...missingSourceTerms
      .filter((item) => item.standing === "missing_active_term")
      .map((item) => `missing source term: ${item.label}`),
  ]

  const protectedBoundaryLines =
    protectedPublic.length === 0
      ? ["- No protected terms are public."]
      : protectedPublic.map((item) => `- ${item.term_label}: public`)

  const report = [
    "# Seed Concordance Completeness Audit Readback v1",
    "",
    `Source OAR2: \`docs/oar/c3_field/oar2_seed_concordance_completeness_audit_v1.meta.md\``,
    "",
    "## Summary",
    `- Active term count: ${activeTerms.length}`,
    `- Relation count: ${relations.length}`,
    `- Duplicate active labels: ${duplicateActiveLabels.length}`,
    `- Orphan relations: ${orphanRelations.length}`,
    `- Unresolved seated refs: ${unresolvedRefs.length}`,
    `- Protected public terms: ${protectedPublic.length}`,
    `- Inactive Seed Concordance versions: ${inactiveVersions.length}`,
    `- Authority boundary ok: ${authorityBoundaryOk}`,
    `- Validation issues requiring correction route: ${validationIssues.length}`,
    "",
    "## Visibility Standing",
    ...visibility.map(([standing, count]) => `- ${standing}: ${count}`),
    "",
    "## Missing Source Heading Scan",
    ...missingSourceTerms.map((item) => `- ${item.label}: ${item.standing}`),
    "",
    "## Relation Count By Stratum",
    ...relationByStratum.map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Protected Boundary",
    ...protectedBoundaryLines,
    "",
    "## Validation Issues",
    ...(validationIssues.length
      ? validationIssues.map((issue) => `- ${issue}`)
      : ["- none"]),
    "",
    "## Audit Boundary",
    "- Audit SQL executed successfully.",
    "- Validation SQL executed successfully.",
    "- No schema mutation performed.",
    "- No term mutation performed.",
    "- No relation mutation performed.",
    "- No runtime/frontend mutation performed.",
  ].join("\n")

  fs.writeFileSync(reportPath, `${report}\n`)
  console.log(`audit_report: ${reportPath}`)
  console.log(
    `audit_summary: ${JSON.stringify({
      activeTermCount: activeTerms.length,
      relationCount: relations.length,
      duplicateActiveLabels: duplicateActiveLabels.length,
      orphanRelations: orphanRelations.length,
      unresolvedRefs: unresolvedRefs.length,
      protectedPublic: protectedPublic.length,
      inactiveVersions: inactiveVersions.length,
      validationIssues: validationIssues.length,
    })}`,
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
