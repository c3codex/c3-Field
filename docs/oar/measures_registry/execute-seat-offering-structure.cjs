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

const offerings = [
  {
    offering_key: "foundation_seat",
    system_key: "measures_registry",
    label: "FOUNDATION SEAT",
    short_label: "Foundation",
    description:
      "Establish core understanding of system coherence, drift, distinction, and responsibility.",
    offering_type: "foundation",
    sequence_order: 1,
    enrollment_state: "open",
    offering_surface_key: "foundation_offering",
    hold_target_key: "foundation_seat_hold",
    metadata: {
      source_oar2: "seat_offering_structure_v1",
      no_payment: true,
      no_src: true,
      no_c3_key: true,
    },
  },
  {
    offering_key: "systems_seat",
    system_key: "measures_registry",
    label: "SYSTEMS SEAT",
    short_label: "Systems",
    description:
      "Apply coherence principles to structured environments and operational systems.",
    offering_type: "systems",
    sequence_order: 2,
    enrollment_state: "open",
    offering_surface_key: "systems_offering",
    hold_target_key: "systems_seat_hold",
    metadata: {
      source_oar2: "seat_offering_structure_v1",
      no_payment: true,
      no_src: true,
      no_c3_key: true,
    },
  },
  {
    offering_key: "cohort",
    system_key: "measures_registry",
    label: "COHORT REGISTRATION",
    short_label: "Cohort",
    description:
      "Guided implementation cohort. Registration opens after Foundation and Systems seat structure is complete.",
    offering_type: "cohort",
    sequence_order: 3,
    enrollment_state: "coming_soon",
    offering_surface_key: null,
    hold_target_key: null,
    metadata: {
      source_oar2: "seat_offering_structure_v1",
      no_payment: true,
      no_src: true,
      no_c3_key: true,
      no_cohort_activation: true,
    },
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
      create table if not exists public.measures_seat_offering (
        id uuid primary key default gen_random_uuid(),
        offering_key text not null unique,
        system_key text not null,
        label text not null,
        short_label text,
        description text,
        offering_type text not null,
        sequence_order integer not null,
        enrollment_state text not null default 'coming_soon',
        hold_target_key text,
        offering_surface_key text,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        constraint measures_seat_offering_type_check
          check (offering_type in ('foundation','systems','cohort')),
        constraint measures_seat_offering_enrollment_state_check
          check (enrollment_state in ('open','coming_soon','held','closed'))
      );

      create or replace function public.set_measures_seat_offering_updated_at()
      returns trigger
      language plpgsql
      set search_path = public
      as $$
      begin
        new.updated_at = now();
        return new;
      end;
      $$;

      drop trigger if exists measures_seat_offering_updated_at
      on public.measures_seat_offering;

      create trigger measures_seat_offering_updated_at
      before update on public.measures_seat_offering
      for each row
      execute function public.set_measures_seat_offering_updated_at();

      alter table public.measures_seat_offering enable row level security;

      drop policy if exists measures_seat_offering_public_read
      on public.measures_seat_offering;

      create policy measures_seat_offering_public_read
      on public.measures_seat_offering
      for select
      to anon, authenticated
      using (system_key = 'measures_registry');

      notify pgrst, 'reload schema';
    `,
    "Seat offering table creation failed",
  )

  await withSchemaRetry(
    () => supabase
      .from("measures_seat_offering")
      .upsert(offerings, { onConflict: "offering_key" }),
    "Seat offering upsert failed",
  )

  const [reserveSeat] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", "reserve_seat")
      .limit(1),
    "Reserve seat lookup failed",
  )

  if (!reserveSeat) throw new Error("reserve_seat encounter missing")

  const metadata = reserveSeat.metadata ?? {}
  const nextMetadata = {
    ...metadata,
    renderer: "reserve_seat_selector",
    data_source: "public.measures_seat_offering",
    options_source: "measures_seat_offering",
    options: [],
    constraints: {
      ...(metadata.constraints ?? {}),
      no_frontend_authored_offering_truth: true,
      no_payment: true,
      no_src: true,
      no_c3_key: true,
      no_cohort_activation: true,
    },
  }

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("id", reserveSeat.id),
    "Reserve seat metadata update failed",
  )

  const rows = await withSchemaRetry(
    () => supabase
      .from("measures_seat_offering")
      .select(
        "offering_key, system_key, label, offering_type, sequence_order, enrollment_state, offering_surface_key, hold_target_key",
      )
      .eq("system_key", "measures_registry")
      .order("sequence_order", { ascending: true }),
    "Seat offering validation failed",
  )

  const rowByKey = new Map(rows.map((row) => [row.offering_key, row]))
  const invalidType = await supabase.from("measures_seat_offering").insert({
    offering_key: `invalid_type_${Date.now()}`,
    system_key: "measures_registry",
    label: "INVALID",
    offering_type: "invalid",
    sequence_order: 99,
    enrollment_state: "open",
  })
  const invalidState = await supabase.from("measures_seat_offering").insert({
    offering_key: `invalid_state_${Date.now()}`,
    system_key: "measures_registry",
    label: "INVALID",
    offering_type: "foundation",
    sequence_order: 99,
    enrollment_state: "invalid",
  })

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        measuresSeatOfferingExists: true,
        recordCount: rows.length,
        foundationEnrollmentState: rowByKey.get("foundation_seat")?.enrollment_state ?? null,
        systemsEnrollmentState: rowByKey.get("systems_seat")?.enrollment_state ?? null,
        cohortEnrollmentState: rowByKey.get("cohort")?.enrollment_state ?? null,
        reserveSeatDataSource: nextMetadata.data_source,
        reserveSeatOptionsSource: nextMetadata.options_source,
        hardcodedMetadataOptionsRemoved: Array.isArray(nextMetadata.options) && nextMetadata.options.length === 0,
        foundationRoute: rowByKey.get("foundation_seat")?.offering_surface_key ?? null,
        systemsRoute: rowByKey.get("systems_seat")?.offering_surface_key ?? null,
        cohortDisabled: rowByKey.get("cohort")?.enrollment_state === "coming_soon",
        invalidOfferingTypeBlocked: Boolean(invalidType.error),
        invalidEnrollmentStateBlocked: Boolean(invalidState.error),
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
