require("dotenv").config({ path: ".env" })

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

const requiredRecords = [
  {
    process_key: "oar2_generation_handoff_process_v1",
    title: "OAR2 Generation and Handoff Process",
    source_path: "docs/process/oar/oar2_generation_and_handoff_process.meta.md",
  },
  {
    process_key: "db_role_contract_supabase_v1",
    title: "Database Role Contract - Supabase",
    source_path: "docs/process/oar/db_role_contract_supabase.meta.md",
  },
  {
    process_key: "oar1_template_v1",
    title: "OAR1 Template",
    source_path: "docs/process/oar/templates/oar1_template.meta.md",
  },
  {
    process_key: "oar2_template_v1",
    title: "OAR2 Template",
    source_path: "docs/process/oar/templates/oar2_template.meta.md",
  },
  {
    process_key: "oar_generator_v1",
    title: "OAR Generator",
    source_path: "docs/process/oar/new-oar.ps1",
  },
]

const metadata = {
  system: "measures_registry",
  operator: "op044",
  future_ops_identity: "system@c3field.com",
  no_slug_policy: true,
}

const sql = `
create extension if not exists pgcrypto;

create table if not exists public.system_process_registry (
  id uuid primary key default gen_random_uuid(),
  process_key text not null unique,
  process_family text not null,
  title text not null,
  status text not null,
  source_path text not null,
  authority_state text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

with records(process_key, process_family, title, status, source_path, authority_state, metadata) as (
  values
    (
      'oar2_generation_handoff_process_v1',
      'oar',
      'OAR2 Generation and Handoff Process',
      'seeded',
      'docs/process/oar/oar2_generation_and_handoff_process.meta.md',
      'file_seeded_db_referenced',
      '${JSON.stringify(metadata)}'::jsonb
    ),
    (
      'db_role_contract_supabase_v1',
      'oar',
      'Database Role Contract - Supabase',
      'seeded',
      'docs/process/oar/db_role_contract_supabase.meta.md',
      'file_seeded_db_referenced',
      '${JSON.stringify(metadata)}'::jsonb
    ),
    (
      'oar1_template_v1',
      'oar',
      'OAR1 Template',
      'seeded',
      'docs/process/oar/templates/oar1_template.meta.md',
      'file_seeded_db_referenced',
      '${JSON.stringify(metadata)}'::jsonb
    ),
    (
      'oar2_template_v1',
      'oar',
      'OAR2 Template',
      'seeded',
      'docs/process/oar/templates/oar2_template.meta.md',
      'file_seeded_db_referenced',
      '${JSON.stringify(metadata)}'::jsonb
    ),
    (
      'oar_generator_v1',
      'oar',
      'OAR Generator',
      'seeded',
      'docs/process/oar/new-oar.ps1',
      'file_seeded_db_referenced',
      '${JSON.stringify(metadata)}'::jsonb
    )
)
insert into public.system_process_registry (
  process_key,
  process_family,
  title,
  status,
  source_path,
  authority_state,
  metadata
)
select
  process_key,
  process_family,
  title,
  status,
  source_path,
  authority_state,
  metadata
from records
on conflict (process_key) do update
set
  process_family = excluded.process_family,
  title = excluded.title,
  status = excluded.status,
  source_path = excluded.source_path,
  authority_state = excluded.authority_state,
  metadata = excluded.metadata,
  updated_at = now();
`

async function execSql(statement, label) {
  const { data, error } = await supabase.rpc("exec_sql", { sql: statement })
  if (error) {
    throw new Error(`${label}: ${error.message}`)
  }
  return data
}

async function readTableColumns(tableName) {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase schema metadata failed: ${response.status}`)
  }

  const schema = await response.json()
  const tableDefinition =
    schema.definitions?.[tableName] ?? schema.components?.schemas?.[tableName]

  return Object.keys(tableDefinition?.properties ?? {})
}

async function main() {
  const missingSourcePaths = requiredRecords
    .map((record) => record.source_path)
    .filter((sourcePath) => !require("fs").existsSync(sourcePath))

  if (missingSourcePaths.length > 0) {
    throw new Error(`Missing source paths: ${missingSourcePaths.join(", ")}`)
  }

  await execSql(sql, "OAR process registry seating failed")
  const keys = requiredRecords.map((record) => record.process_key)
  const { data: records, error } = await supabase
    .from("system_process_registry")
    .select("process_key, process_family, source_path, authority_state, metadata")
    .in("process_key", keys)
    .order("process_key")

  if (error) {
    throw new Error(`OAR process registry verification failed: ${error.message}`)
  }

  const tableColumns = await readTableColumns("system_process_registry")
  const slugColumns = tableColumns.filter((column) =>
    column.toLowerCase().includes("slug"),
  )

  const expectedSourcePathByKey = new Map(
    requiredRecords.map((record) => [record.process_key, record.source_path]),
  )

  const verification = {
    system_process_registry_exists: true,
    process_record_count: records.length,
    process_family_all_oar: records.every((record) => record.process_family === "oar"),
    no_slug_fields_exist: slugColumns.length === 0,
    slug_columns_found: slugColumns,
    table_columns: tableColumns,
    source_paths_match: records.every(
      (record) => record.source_path === expectedSourcePathByKey.get(record.process_key),
    ),
    authority_state_all_file_seeded_db_referenced: records.every(
      (record) => record.authority_state === "file_seeded_db_referenced",
    ),
    records,
  }

  console.log(JSON.stringify(verification, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
