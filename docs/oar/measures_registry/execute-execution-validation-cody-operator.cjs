require("dotenv").config({ path: ".env" })

const fs = require("fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const oarKey = "oar2_execution_validation_cody_operator_v1"
const processKey = "oar_execution_validation_cody_operator_v1"
const sourceOar2Path =
  "docs/oar/measures_registry/oar2_execution_validation_cody_operator_v1.meta.md"

const objective =
  "Validate the OAR2 execution model as a constrained Codex operator process."
const action =
  "Registered the Cody operator execution validation as an approved OAR2 log record for continued reference, onboarding, template improvement, and institutional positioning."
const result =
  "OAR2 execution model validated as slower at initial definition, safer during execution, cleaner at closeout, and effective at reducing frontend-authority leakage."
const validationSummary = [
  "OAR2 provides explicit structure",
  "Cody executes with reduced ambiguity",
  "DB-first enforcement prevents frontend invention",
  "OAR1 provides persistent trace and closure",
  "execution and deployment separation reduces risk",
  "process validated for continued use",
].join("; ")

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

async function readSchema() {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase schema metadata failed: ${response.status}`)
  }

  return response.json()
}

function tableColumns(schema, tableName) {
  const definition =
    schema.definitions?.[tableName] ?? schema.components?.schemas?.[tableName]
  return Object.keys(definition?.properties ?? {})
}

async function main() {
  if (!fs.existsSync(sourceOar2Path)) {
    throw new Error(`Source OAR2 missing: ${sourceOar2Path}`)
  }

  await assertOk(
    await supabase.from("system_oar_log").select("id").limit(1),
    "system_oar_log availability check failed",
  )

  const schema = await readSchema()
  const columns = tableColumns(schema, "system_oar_log")
  const slugFields = columns.filter((column) => column.toLowerCase().includes("slug"))

  const metadata = {
    system: "measures_registry",
    operator: "op044",
    execution_context: "openai_codex_app",
    source_document_type: "codex_validation",
    source_status: "ready_for_seating",
    validated_for: [
      "continued_use",
      "codex_reference",
      "onboarding_reference",
      "oar2_template_improvement",
      "institutional_positioning",
    ],
    no_slug_policy: true,
  }

  const logRecord = await assertOk(
    await supabase
      .from("system_oar_log")
      .upsert(
        {
          oar_key: oarKey,
          oar_type: "oar2",
          process_key: processKey,
          source_oar2_path: sourceOar2Path,
          oar1_file_path: null,
          objective,
          action,
          result,
          validation_summary: validationSummary,
          status: "validated",
          metadata,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "oar_key" },
      )
      .select(
        "id, oar_key, oar_type, process_key, source_oar2_path, oar1_file_path, status, validation_summary, metadata",
      )
      .single(),
    "Execution validation OAR2 registration failed",
  )

  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")

  const validationRows = await assertOk(
    await supabase
      .from("system_oar_log")
      .select("oar_key, oar_type, process_key, source_oar2_path, status, validation_summary")
      .eq("oar_key", oarKey)
      .eq("oar_type", "oar2")
      .eq("status", "validated"),
    "Execution validation OAR2 verification failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        systemOarLogConfirmed: columns.length > 0,
        noSlugFieldsExist: slugFields.length === 0,
        slugFieldsFound: slugFields,
        registeredRecord: logRecord,
        validationRowCount: validationRows.length,
        validationRows,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
