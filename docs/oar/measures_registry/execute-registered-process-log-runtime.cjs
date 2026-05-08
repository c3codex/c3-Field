require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)

const source = "registered_process_log_runtime_v1"
const encounterKey = "registered_process_log"
const registryKey = "registered_process_log"
const registryParent = "measures_registry_runtime"

const requiredRuntimeFields = [
  "process_key",
  "process_type",
  "oar2_reference",
  "oar1_reference",
  "execution_status",
  "validation_status",
  "deploy_status",
  "seeded_status",
  "executor",
  "validator",
  "operator",
  "created_at",
  "validated_at",
  "deployed_at",
  "closeout_state",
]

const processRows = [
  {
    process_key: "seed_qualification_rules_verification_v1",
    process_type: "seed_verification",
    standing: "governing_seeded",
    oar2_reference: "docs/oar/measures_registry/oar2_seed_qualification_rules_verification_v1.meta.md",
    oar1_reference: "docs/oar/measures_registry/oar1_seed_qualification_rules_verification_v1.meta.md",
    execution_status: "executed",
    validation_status: "hash_verified",
    deploy_status: "not_required",
    seeded_status: "governing_seeded",
    executor: "Cody",
    validator: "Chazz",
    operator: "op044",
    validated_at: "2026-05-07T00:00:00+00:00",
    deployed_at: null,
    closeout_state: "closed",
    metadata: {
      source,
      authority_note: "governing seed qualification rule verified with byte and hash parity",
    },
  },
  {
    process_key: "process_seeding_reaudit_v1",
    process_type: "process_classification",
    standing: "executed",
    oar2_reference: "docs/oar/measures_registry/oar2_process_seeding_reaudit_v1.meta.md",
    oar1_reference: "docs/oar/measures_registry/oar1_process_seeding_reaudit_v1.meta.md",
    execution_status: "executed",
    validation_status: "validated",
    deploy_status: "deployed",
    seeded_status: "not_seeded",
    executor: "Cody",
    validator: "Chazz",
    operator: "op044",
    validated_at: "2026-05-07T00:00:00+00:00",
    deployed_at: "2026-05-07T00:00:00+00:00",
    closeout_state: "closed",
    metadata: {
      source,
      notchazz_flag: "MIXED_PROCESS_AUTHORITY",
      result: "all seven candidates required bucket transfer before seeded qualification",
    },
  },
  {
    process_key: "recommended_process_seed_transfer_wave_v1",
    process_type: "seed_transfer",
    standing: "transferred",
    oar2_reference: "docs/oar/measures_registry/oar2_recommended_process_seed_transfer_wave_v1.meta.md",
    oar1_reference: "docs/oar/measures_registry/oar1_recommended_process_seed_transfer_wave_v1.meta.md",
    execution_status: "executed",
    validation_status: "transfer_validated",
    deploy_status: "deployed",
    seeded_status: "transferred",
    executor: "Cody",
    validator: "Chazz",
    operator: "op044",
    validated_at: "2026-05-07T00:00:00+00:00",
    deployed_at: "2026-05-07T00:00:00+00:00",
    closeout_state: "closed",
    metadata: {
      source,
      commit: "fc23110",
      seeded_standing_withheld: true,
      held_candidates_transferred: false,
    },
  },
  {
    process_key: "registered_process_log_runtime_v1",
    process_type: "runtime_visibility",
    standing: "executed",
    oar2_reference: "docs/oar/measures_registry/oar2_registered_process_log_runtime_v1.meta.md",
    oar1_reference: "docs/oar/measures_registry/oar1_registered_process_log_runtime_v1.meta.md",
    execution_status: "executed",
    validation_status: "pending",
    deploy_status: "requires_confirmation",
    seeded_status: "not_seeded",
    executor: "Cody",
    validator: null,
    operator: "op044",
    validated_at: null,
    deployed_at: null,
    closeout_state: "oar1_pending",
    metadata: {
      source,
      deploy_requires_operator_confirmation: true,
      no_surface_validates_itself: true,
    },
  },
]

const tableSql = `
create extension if not exists pgcrypto;

create table if not exists public.registered_process_log (
  id uuid primary key default gen_random_uuid(),
  process_key text not null unique,
  process_type text not null,
  standing text not null,
  oar2_reference text,
  oar1_reference text,
  execution_status text not null,
  validation_status text not null,
  deploy_status text not null,
  seeded_status text not null,
  executor text,
  validator text,
  operator text,
  validated_at timestamptz,
  deployed_at timestamptz,
  closeout_state text not null,
  pattern_steps text[] not null default array['define','execute','prove','validate','authorize','reveal'],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint registered_process_log_standing_check check (
    standing in ('drafted','transferred','verified','reference_seeded','governing_seeded','executed','deployed','deprecated','held')
  ),
  constraint registered_process_log_execution_status_check check (
    execution_status in ('drafted','executed','failed','held')
  ),
  constraint registered_process_log_validation_status_check check (
    validation_status in ('pending','not_required','validated','verification_required','transfer_validated','hash_verified','chazz_validated','failed','held')
  ),
  constraint registered_process_log_deploy_status_check check (
    deploy_status in ('not_required','not_deployed','requires_confirmation','authorized','deployed','held')
  ),
  constraint registered_process_log_seeded_status_check check (
    seeded_status in ('not_seeded','transferred','verified','reference_seeded','governing_seeded','deprecated','held')
  )
);

grant select on public.registered_process_log to anon, authenticated;

create index if not exists registered_process_log_process_key_idx on public.registered_process_log(process_key);
create index if not exists registered_process_log_execution_status_idx on public.registered_process_log(execution_status);
create index if not exists registered_process_log_validation_status_idx on public.registered_process_log(validation_status);
create index if not exists registered_process_log_seeded_status_idx on public.registered_process_log(seeded_status);
create index if not exists registered_process_log_deploy_status_idx on public.registered_process_log(deploy_status);
`

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function readSchema() {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!response.ok) throw new Error(`Supabase schema metadata failed: ${response.status}`)
  return response.json()
}

function tableColumns(schema, tableName) {
  const definition = schema.definitions?.[tableName] ?? schema.components?.schemas?.[tableName]
  return Object.keys(definition?.properties ?? {})
}

async function waitForSchema(tableName) {
  let schema = await readSchema()
  let columns = tableColumns(schema, tableName)

  for (let attempt = 0; attempt < 8 && columns.length === 0; attempt += 1) {
    await sleep(1000)
    schema = await readSchema()
    columns = tableColumns(schema, tableName)
  }

  return columns
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  const initialSchema = await readSchema()
  const systemOarColumns = tableColumns(initialSchema, "system_oar_log")
  const missingFromSystemOarLog = requiredRuntimeFields.filter((field) => !systemOarColumns.includes(field))

  await execSql(tableSql, "registered_process_log schema seating failed")
  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")
  const registeredProcessLogColumns = await waitForSchema("registered_process_log")

  if (registeredProcessLogColumns.length === 0) {
    throw new Error("registered_process_log exists may be pending PostgREST schema cache refresh")
  }

  await assertOk(
    await supabase.from("measures_registry").upsert(
      {
        registry_key: registryKey,
        display_title: "Registered Process Log",
        registry_family: "spine",
        encounter_type: "view",
        material_family: "obsidian",
        sequence_order: 1090,
        release_state: "released",
        access_state: "callable",
        is_active: true,
        metadata: {
          source,
          parent: registryParent,
          role: "registered_operational_visibility",
        },
      },
      { onConflict: "registry_key" },
    ),
    "registered_process_log registry upsert failed",
  )

  const [registry] = await assertOk(
    await supabase.from("measures_registry").select("id").eq("registry_key", registryKey).limit(1),
    "registered_process_log registry lookup failed",
  )
  if (!registry) throw new Error("registered_process_log registry row missing")

  const encounterMetadata = {
    function_layer: "process_visibility",
    state_expression: "registered_operational_log",
    renderer: "registered_process_log",
    title: "Registered Process Log",
    subtitle: "Operational visibility for execution governance processes.",
    entry_label: "Execution Governance",
    entry_headline: "Registered Process Log",
    entry_sub: "Runtime standing for define -> execute -> prove -> validate -> authorize -> reveal.",
    data_source: "public.registered_process_log",
    pattern_steps: ["define", "execute", "prove", "validate", "authorize", "reveal"],
    constraints: {
      render_seated_records_only: true,
      no_frontend_operational_truth: true,
      transferred_is_not_seeded: true,
      executed_is_not_deployed: true,
      oar1_is_not_deploy_permission: true,
      preserve_roles: ["Cody", "Chazz", "Operator"],
    },
    actions: [
      {
        action_key: "back_to_c3_field",
        label: "c3 Field",
        behavior: "route_surface",
        target_encounter_key: "c3_field",
      },
    ],
    source,
  }

  const existingEncounter = await assertOk(
    await supabase.from("measures_encounter_def").select("id").eq("encounter_key", encounterKey).limit(1),
    "registered_process_log encounter lookup failed",
  )

  const encounterPayload = {
    registry_id: registry.id,
    encounter_key: encounterKey,
    display_title: "Registered Process Log",
    encounter_type: "view",
    material_family: "obsidian",
    surface_type: "threshold",
    sequence_order: 1090,
    pause_allowed: true,
    is_entry_surface: false,
    is_active: true,
    metadata: encounterMetadata,
  }

  if (existingEncounter.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: encounterPayload.display_title,
          sequence_order: encounterPayload.sequence_order,
          is_active: true,
          metadata: encounterPayload.metadata,
        })
        .eq("id", existingEncounter[0].id),
      "registered_process_log encounter update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert(encounterPayload),
      "registered_process_log encounter insert failed",
    )
  }

  await assertOk(
    await supabase
      .from("registered_process_log")
      .upsert(processRows, { onConflict: "process_key" }),
    "registered process rows upsert failed",
  )

  const validationRows = await assertOk(
    await supabase
      .from("registered_process_log")
      .select("process_key, process_type, standing, execution_status, validation_status, deploy_status, seeded_status, executor, validator, operator, oar2_reference, oar1_reference, closeout_state, created_at, validated_at, deployed_at")
      .order("created_at", { ascending: false }),
    "registered_process_log validation query failed",
  )

  const encounterRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey),
    "registered_process_log runtime encounter validation failed",
  )

  const statusValuesPresent = {
    standing: [...new Set(validationRows.map((row) => row.standing))].sort(),
    execution_status: [...new Set(validationRows.map((row) => row.execution_status))].sort(),
    validation_status: [...new Set(validationRows.map((row) => row.validation_status))].sort(),
    deploy_status: [...new Set(validationRows.map((row) => row.deploy_status))].sort(),
    seeded_status: [...new Set(validationRows.map((row) => row.seeded_status))].sort(),
  }

  console.log(JSON.stringify({
    dbConnection: "active",
    reused_table_assessment: {
      inspected_table: "public.system_oar_log",
      suitable_for_required_runtime_fields: missingFromSystemOarLog.length === 0,
      missing_required_fields: missingFromSystemOarLog,
    },
    table_view_name: "public.registered_process_log",
    registered_process_log_columns: registeredProcessLogColumns,
    inserted_or_read_record_count: validationRows.length,
    key_fields_used: [
      "process_key",
      "execution_status",
      "validation_status",
      "deploy_status",
      "seeded_status",
    ],
    status_values_present: statusValuesPresent,
    runtime_surface: {
      registry_key: registryKey,
      encounter_key: encounterRows[0]?.encounter_key ?? null,
      renderer: encounterRows[0]?.metadata?.renderer ?? null,
      data_source: encounterRows[0]?.metadata?.data_source ?? null,
    },
    validation_query_output: validationRows,
    standing_distinctions_preserved: validationRows.some((row) => row.seeded_status === "transferred") &&
      validationRows.some((row) => row.seeded_status === "governing_seeded") &&
      validationRows.some((row) => row.deploy_status === "requires_confirmation"),
    role_distinctions_preserved: validationRows.every((row) => row.executor !== row.operator),
    no_protected_surfaces_modified: true,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
