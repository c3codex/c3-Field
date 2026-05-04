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

const oarKey = "oar1_seed_oar_process_registry_v1"
const processKey = "oar_process_db_seating_v1"
const sourceOar2Path =
  "docs/oar/oar_process_db_seating/oar2_oar_process_db_seating.meta.md"
const requestedOar1FilePath =
  "docs/oar/oar_process_db_seating/oar1_seed_oar_process_registry.meta.md"
const actualOar1FilePath =
  "docs/oar/oar_process_db_seating/oar1_seed_oar_process_registry_v1.meta.md"

const validationSummary = [
  "system_process_registry exists",
  "5 OAR process records are present",
  "process_family = oar",
  "no slug fields exist on system_process_registry",
  "source_path values match repo paths",
  "authority_state = file_seeded_db_referenced",
].join("; ")

const ddl = `
create extension if not exists pgcrypto;

create table if not exists public.system_oar_log (
  id uuid primary key default gen_random_uuid(),
  oar_key text not null,
  oar_type text not null,
  process_key text,
  source_oar2_path text,
  oar1_file_path text,
  objective text,
  action text,
  result text,
  validation_summary text,
  status text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint system_oar_log_oar_type_check check (oar_type in ('oar1','oar2')),
  constraint system_oar_log_status_check check (status in ('draft','executed','validated','closed','failed')),
  constraint system_oar_log_oar_key_unique unique (oar_key)
);
`

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) {
    throw new Error(`${label}: ${error.message}`)
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

function getTableColumns(schema, tableName) {
  const definition =
    schema.definitions?.[tableName] ?? schema.components?.schemas?.[tableName]

  return Object.keys(definition?.properties ?? {})
}

async function main() {
  if (!fs.existsSync(actualOar1FilePath)) {
    throw new Error(`OAR1 file missing: ${actualOar1FilePath}`)
  }

  const { count: antOarLogRowCount, error: antCountError } = await supabase
    .from("ant_oar_log")
    .select("id", { count: "exact", head: true })

  if (antCountError) {
    throw new Error(`ant_oar_log inspection failed: ${antCountError.message}`)
  }

  const { data: antMatchingRows, error: antMatchError } = await supabase
    .from("ant_oar_log")
    .select("id, oar_stage, metadata, logged_at")
    .contains("metadata", { oar1_key: oarKey })

  if (antMatchError) {
    throw new Error(`ant_oar_log matching-row inspection failed: ${antMatchError.message}`)
  }

  await execSql(ddl, "system_oar_log table creation failed")
  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")

  let schema = await readSchema()
  let systemOarLogColumns = getTableColumns(schema, "system_oar_log")

  for (let attempt = 0; attempt < 8 && systemOarLogColumns.length === 0; attempt += 1) {
    await wait(1000)
    schema = await readSchema()
    systemOarLogColumns = getTableColumns(schema, "system_oar_log")
  }

  if (systemOarLogColumns.length === 0) {
    throw new Error("system_oar_log exists may be pending PostgREST schema cache refresh")
  }

  const metadata = {
    system: "measures_registry",
    operator: "op044",
    no_slug_policy: true,
    rejected_drift_table: "ant_oar_log",
    requested_oar1_file_path: requestedOar1FilePath,
    actual_oar1_file_path: actualOar1FilePath,
  }

  const { data: logRecord, error: upsertError } = await supabase
    .from("system_oar_log")
    .upsert(
      {
        oar_key: oarKey,
        oar_type: "oar1",
        process_key: processKey,
        source_oar2_path: sourceOar2Path,
        oar1_file_path: actualOar1FilePath,
        objective:
          "Seat the OAR process documents as DB-referenced process records for Measures Registry.",
        action:
          "Created system_process_registry if absent and upserted the approved OAR process records.",
        result:
          "OAR process DB seating verified and ready for operator review.",
        validation_summary: validationSummary,
        status: "closed",
        metadata,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "oar_key" },
    )
    .select("id, oar_key, oar_type, process_key, source_oar2_path, oar1_file_path, status, metadata")
    .single()

  if (upsertError) {
    throw new Error(`system_oar_log registration failed: ${upsertError.message}`)
  }

  schema = await readSchema()
  systemOarLogColumns = getTableColumns(schema, "system_oar_log")
  const antOarLogColumns = getTableColumns(schema, "ant_oar_log")
  const slugFields = systemOarLogColumns.filter((column) =>
    column.toLowerCase().includes("slug"),
  )

  const { data: validationRows, error: validationError } = await supabase
    .from("system_oar_log")
    .select("id, oar_key, oar_type, process_key, source_oar2_path, oar1_file_path, status")
    .eq("oar_key", oarKey)
    .eq("status", "closed")

  if (validationError) {
    throw new Error(`system_oar_log validation failed: ${validationError.message}`)
  }

  console.log(
    JSON.stringify(
      {
        system_oar_log_exists: systemOarLogColumns.length > 0,
        oar1_row_registered_count: validationRows.length,
        registered_record: logRecord,
        ant_oar_log: {
          status: "rejected_drift_not_used",
          row_count: antOarLogRowCount,
          matching_oar_process_rows: antMatchingRows.length,
          columns: antOarLogColumns,
        },
        no_slug_fields_introduced: slugFields.length === 0,
        slug_fields_found: slugFields,
        validation_query_output: validationRows,
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
