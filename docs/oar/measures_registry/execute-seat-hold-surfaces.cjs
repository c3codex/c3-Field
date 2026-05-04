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

const holdSurfaces = [
  {
    encounterKey: "foundation_seat_hold",
    displayTitle: "FOUNDATION SEAT",
    source: "foundation_seat_hold_v1",
    sequenceOrder: 1060,
    backTarget: "foundation_offering",
  },
  {
    encounterKey: "systems_seat_hold",
    displayTitle: "SYSTEMS SEAT",
    source: "systems_seat_hold_v1",
    sequenceOrder: 1070,
    backTarget: "systems_offering",
  },
]

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function insertCaptureProbe(surface, probeEmail) {
  let lastError = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await supabase
      .from("measures_seat_hold_capture")
      .insert({
        registry_key: "measures_registry",
        encounter_key: surface.encounterKey,
        email: probeEmail,
        metadata: {
          validation_probe: true,
          source_oar2: surface.source,
        },
      })
      .select("id, encounter_key, email")
      .single()

    if (!result.error) return result.data

    lastError = result.error
    if (!result.error.message.includes("schema cache")) break
    await wait(1200)
  }

  throw new Error(`${surface.encounterKey} capture probe insert failed: ${lastError?.message}`)
}

function metadataFor(surface) {
  return {
    function_layer: "intake",
    state_expression: "public_hold_surface",
    renderer: "hold_surface",
    entry_label: surface.displayTitle,
    entry_headline: "Reserve your place.",
    entry_sub: "You will be notified when enrollment opens.",
    fields: [
      {
        key: "email",
        type: "email",
        required: true,
      },
    ],
    cta_primary: "RESERVE SEAT",
    cta_secondary: "Back to Offering",
    capture: {
      mode: "simple_email_hold",
      target_table: "measures_seat_hold_capture",
      no_src: true,
      no_payment: true,
    },
    actions: [
      {
        action_key: "reserve_seat_hold",
        label: "RESERVE SEAT",
        behavior: "insert_simple_hold_capture",
        target_table: "measures_seat_hold_capture",
      },
      {
        action_key: "back_to_offering",
        label: "Back to Offering",
        behavior: "route_surface",
        target_encounter_key: surface.backTarget,
      },
    ],
  }
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await execSql(
    `
      create extension if not exists pgcrypto;

      create table if not exists public.measures_seat_hold_capture (
        id uuid primary key default gen_random_uuid(),
        registry_key text not null default 'measures_registry',
        encounter_key text not null,
        email text not null,
        capture_context text not null default 'measures_registry_seat_hold',
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        constraint measures_seat_hold_capture_encounter_check check (
          encounter_key in ('foundation_seat_hold','systems_seat_hold')
        ),
        constraint measures_seat_hold_capture_email_check check (
          position('@' in email) > 1
        )
      );

      alter table public.measures_seat_hold_capture enable row level security;

      grant insert on public.measures_seat_hold_capture to anon, authenticated;

      drop policy if exists "public inserts measures registry seat holds"
      on public.measures_seat_hold_capture;

      create policy "public inserts measures registry seat holds"
      on public.measures_seat_hold_capture
      for insert
      to anon, authenticated
      with check (
        registry_key = 'measures_registry'
        and encounter_key in ('foundation_seat_hold','systems_seat_hold')
      );

      notify pgrst, 'reload schema';
    `,
    "Seat hold capture table creation failed",
  )

  for (const surface of holdSurfaces) {
    await assertOk(
      await supabase
        .from("measures_registry")
        .upsert(
          {
            registry_key: surface.encounterKey,
            display_title: surface.displayTitle,
            registry_family: "spine",
            encounter_type: "view",
            material_family: "obsidian",
            sequence_order: surface.sequenceOrder,
            release_state: "released",
            access_state: "callable",
            is_active: true,
            metadata: {
              role: "measures_registry_hold_surface",
              source: surface.source,
              parent: "measures_registry_runtime",
            },
          },
          { onConflict: "registry_key" },
        ),
      `${surface.encounterKey} registry row upsert failed`,
    )

    const registryRows = await assertOk(
      await supabase
        .from("measures_registry")
        .select("id")
        .eq("registry_key", surface.encounterKey)
        .limit(1),
      `${surface.encounterKey} registry id lookup failed`,
    )

    const registryId = registryRows[0]?.id
    if (!registryId) throw new Error(`${surface.encounterKey} registry id missing`)

    const existingRows = await assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("id")
        .eq("encounter_key", surface.encounterKey)
        .limit(1),
      `${surface.encounterKey} encounter lookup failed`,
    )

    const payload = {
      registry_id: registryId,
      encounter_key: surface.encounterKey,
      display_title: surface.displayTitle,
      encounter_type: "view",
      material_family: "obsidian",
      surface_type: "threshold",
      sequence_order: surface.sequenceOrder,
      pause_allowed: true,
      is_entry_surface: false,
      is_active: true,
      metadata: metadataFor(surface),
    }

    if (existingRows.length > 0) {
      await assertOk(
        await supabase
          .from("measures_encounter_def")
          .update({
            display_title: payload.display_title,
            metadata: payload.metadata,
          })
          .eq("id", existingRows[0].id),
        `${surface.encounterKey} encounter update failed`,
      )
    } else {
      await assertOk(
        await supabase.from("measures_encounter_def").insert(payload),
        `${surface.encounterKey} encounter insert failed`,
      )
    }
  }

  const validationRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in(
        "encounter_key",
        holdSurfaces.map((surface) => surface.encounterKey),
      )
      .order("encounter_key"),
    "Seat hold validation failed",
  )

  const probeEmail = `seat-hold-validation-${Date.now()}@example.invalid`
  const probeRows = []

  for (const surface of holdSurfaces) {
    probeRows.push(await insertCaptureProbe(surface, probeEmail))
  }

  await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .delete()
      .eq("email", probeEmail)
      .eq("registry_key", "measures_registry"),
    "Seat hold capture probe cleanup failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        holdSurfaceCount: validationRows.length,
        validation: validationRows.map((row) => {
          const metadata = row.metadata ?? {}
          const fields = metadata.fields ?? []
          return {
            encounter_key: row.encounter_key,
            function_layer: metadata.function_layer,
            state_expression: metadata.state_expression,
            renderer: metadata.renderer,
            singleEmailFieldPresent:
              fields.length === 1 &&
              fields[0]?.key === "email" &&
              fields[0]?.type === "email" &&
              fields[0]?.required === true,
            noSrc: metadata.capture?.no_src === true,
            noPayment: metadata.capture?.no_payment === true,
          }
        }),
        captureProbeInsertedCount: probeRows.length,
        captureProbeCleanedUp: true,
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
