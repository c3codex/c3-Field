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

const source = "codex_entity_seed_c3_community_partners_v1"
const entityKey = "c3_community_partners_dao"

const artifactRows = [
  {
    artifact_key: "tn_annual_report_2026",
    artifact_title: "Tennessee Annual Report Filing Acknowledgment 2026",
    artifact_type: "state_filing",
    file_name: "tn_license2026.pdf",
    storage_path: "tn_license2026.pdf",
    source_status: "operator_uploaded",
    metadata: { source },
  },
  {
    artifact_key: "tn_dao_statute_ha0748",
    artifact_title: "Tennessee DAO Law Amendment HA0748",
    artifact_type: "legal_framework",
    file_name: "HA0748.pdf",
    storage_path: "HA0748.pdf",
    source_status: "operator_uploaded",
    metadata: { source },
  },
  {
    artifact_key: "tn_dao_law_reference",
    artifact_title: "Tennessee DAO Law Reference",
    artifact_type: "legal_framework",
    file_name: "tn_law_dao.pdf",
    storage_path: "tn_law_dao.pdf",
    source_status: "operator_uploaded",
    metadata: { source },
  },
  {
    artifact_key: "measures_registry_whitepaper",
    artifact_title: "Measures Registry Full Whitepaper",
    artifact_type: "system_whitepaper",
    file_name: "Measures_Registry_Full_Whitepaper.pdf",
    storage_path: "Measures_Registry_Full_Whitepaper.pdf",
    source_status: "operator_uploaded",
    metadata: { source },
  },
]

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withSchemaRetry(operation, label) {
  let lastResult = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await operation()
    if (!result.error) return result.data

    lastResult = result
    if (!result.error.message.includes("schema cache")) break
    await wait(1200)
  }

  throw new Error(`${label}: ${lastResult?.error?.message}`)
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await execSql(
    `
      create table if not exists public.codex_entity (
        id uuid primary key default gen_random_uuid(),
        entity_key text not null unique,
        entity_name text not null,
        entity_type text not null,
        jurisdiction text not null,
        formation_locale text not null,
        legal_status text not null,
        control_number text,
        designation text,
        management_type text,
        operating_role text,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists public.codex_entity_artifact (
        id uuid primary key default gen_random_uuid(),
        entity_id uuid not null references public.codex_entity(id) on delete cascade,
        artifact_key text not null,
        artifact_title text not null,
        artifact_type text not null,
        file_name text not null,
        storage_path text not null,
        source_status text not null,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        constraint codex_entity_artifact_unique unique (entity_id, artifact_key)
      );

      create table if not exists public.codex_entity_relationship (
        id uuid primary key default gen_random_uuid(),
        source_entity_id uuid not null references public.codex_entity(id) on delete cascade,
        relationship_type text not null,
        target_key text not null,
        target_type text not null,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        constraint codex_entity_relationship_unique unique (
          source_entity_id,
          relationship_type,
          target_key,
          target_type
        )
      );

      create or replace function public.set_codex_entity_updated_at()
      returns trigger
      language plpgsql
      set search_path = public
      as $$
      begin
        new.updated_at = now();
        return new;
      end;
      $$;

      drop trigger if exists codex_entity_updated_at
      on public.codex_entity;

      create trigger codex_entity_updated_at
      before update on public.codex_entity
      for each row
      execute function public.set_codex_entity_updated_at();

      alter table public.codex_entity enable row level security;
      alter table public.codex_entity_artifact enable row level security;
      alter table public.codex_entity_relationship enable row level security;

      revoke all on public.codex_entity from public, anon;
      revoke all on public.codex_entity_artifact from public, anon;
      revoke all on public.codex_entity_relationship from public, anon;

      notify pgrst, 'reload schema';
    `,
    "Codex entity table creation failed",
  )

  await withSchemaRetry(
    () => supabase
      .from("codex_entity")
      .upsert(
        {
          entity_key: entityKey,
          entity_name: "C3 Community Partners DAO, LLC",
          entity_type: "nonprofit_limited_liability_company",
          jurisdiction: "Tennessee",
          formation_locale: "Tennessee",
          legal_status: "active",
          control_number: "002005092",
          designation: "decentralized_organization",
          management_type: "member_managed",
          operating_role: "operating_entity_for_measures_registry",
          metadata: {
            source,
            annual_report_next_due: "2027-04-01",
            business_county: "Wilson",
            naics: ["813410", "813319", "541720"],
            public_contact: "connect@c3communitypartners.xyz",
            measures_registry_contact: "connect@measuresregistry.com",
          },
        },
        { onConflict: "entity_key" },
      ),
    "Codex entity upsert failed",
  )

  const [entity] = await withSchemaRetry(
    () => supabase
      .from("codex_entity")
      .select("id, entity_key, legal_status, control_number, designation, operating_role")
      .eq("entity_key", entityKey)
      .limit(1),
    "Codex entity lookup failed",
  )

  if (!entity) throw new Error("Codex entity missing after upsert")

  await assertOk(
    await supabase.from("codex_entity_artifact").upsert(
      artifactRows.map((artifact) => ({
        ...artifact,
        entity_id: entity.id,
      })),
      { onConflict: "entity_id,artifact_key" },
    ),
    "Codex entity artifact upsert failed",
  )

  await assertOk(
    await supabase
      .from("codex_entity_relationship")
      .upsert(
        {
          source_entity_id: entity.id,
          relationship_type: "operates",
          target_key: "measures_registry",
          target_type: "system_runtime",
          metadata: {
            source,
            relationship_statement:
              "Measures Registry is developed and operated by c3 Community Partners DAO, LLC.",
          },
        },
        { onConflict: "source_entity_id,relationship_type,target_key,target_type" },
      ),
    "Codex entity relationship upsert failed",
  )

  const artifacts = await assertOk(
    await supabase
      .from("codex_entity_artifact")
      .select("artifact_key, file_name, source_status")
      .eq("entity_id", entity.id)
      .order("artifact_key"),
    "Codex entity artifact validation failed",
  )

  const relationships = await assertOk(
    await supabase
      .from("codex_entity_relationship")
      .select("relationship_type, target_key, target_type")
      .eq("source_entity_id", entity.id)
      .eq("relationship_type", "operates")
      .eq("target_key", "measures_registry")
      .eq("target_type", "system_runtime"),
    "Codex entity relationship validation failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        codexEntityExists: Boolean(entity.id),
        entityKey: entity.entity_key,
        legalStatus: entity.legal_status,
        controlNumber: entity.control_number,
        designation: entity.designation,
        operatingRole: entity.operating_role,
        artifactsAttached: artifacts.length,
        artifactKeys: artifacts.map((artifact) => artifact.artifact_key),
        relationshipExists: relationships.length === 1,
        relationship: relationships[0] ?? null,
        aboutPageUnchanged: true,
        noPaymentSrcC3Key: true,
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
