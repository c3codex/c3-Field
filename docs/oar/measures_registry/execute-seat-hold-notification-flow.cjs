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
    offeringKey: "foundation_seat",
    successMessage: "Your Foundation Seat has been held.",
    successSubtext: "You will be notified when enrollment opens.",
  },
  {
    encounterKey: "systems_seat_hold",
    offeringKey: "systems_seat",
    successMessage: "Your Systems Seat has been held.",
    successSubtext: "You will be notified when enrollment opens.",
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

async function insertProbe(surface, probeEmail) {
  let lastError = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await supabase
      .from("measures_seat_hold_capture")
      .insert({
        registry_key: "measures_registry",
        encounter_key: surface.encounterKey,
        source_encounter_key: surface.encounterKey,
        offering_key: surface.offeringKey,
        email: probeEmail,
        metadata: {
          validation_probe: true,
          source_oar2: "seat_hold_notification_flow_v1",
        },
      })
      .select(
        "id, email, offering_key, source_encounter_key, notification_state, created_at",
      )
      .single()

    if (!result.error) return result.data
    lastError = result.error
    if (!result.error.message.includes("schema cache")) break
    await wait(1200)
  }

  throw new Error(`${surface.encounterKey} notification probe failed: ${lastError?.message}`)
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await execSql(
    `
      alter table public.measures_seat_hold_capture
      add column if not exists notification_state text not null default 'captured',
      add column if not exists notified_at timestamptz,
      add column if not exists source_encounter_key text,
      add column if not exists offering_key text;

      alter table public.measures_seat_hold_capture
      drop constraint if exists measures_seat_hold_capture_notification_state_check;

      alter table public.measures_seat_hold_capture
      add constraint measures_seat_hold_capture_notification_state_check
      check (
        notification_state in ('captured','queued','notified','failed','suppressed')
      );

      update public.measures_seat_hold_capture
      set
        source_encounter_key = coalesce(source_encounter_key, encounter_key),
        offering_key = coalesce(
          offering_key,
          case
            when encounter_key = 'foundation_seat_hold' then 'foundation_seat'
            when encounter_key = 'systems_seat_hold' then 'systems_seat'
            else offering_key
          end
        )
      where encounter_key in ('foundation_seat_hold','systems_seat_hold');

      drop view if exists public.measures_seat_hold_notification_review_v1;

      create view public.measures_seat_hold_notification_review_v1 as
      select
        email,
        offering_key,
        source_encounter_key,
        notification_state,
        created_at
      from public.measures_seat_hold_capture
      where registry_key = 'measures_registry'
      order by created_at desc;

      grant select on public.measures_seat_hold_notification_review_v1 to authenticated;

      notify pgrst, 'reload schema';
    `,
    "Seat hold notification schema update failed",
  )

  for (const surface of holdSurfaces) {
    const rows = await assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("id, metadata")
        .eq("encounter_key", surface.encounterKey)
        .limit(1),
      `${surface.encounterKey} lookup failed`,
    )

    if (rows.length !== 1) throw new Error(`${surface.encounterKey} not seated`)

    const metadata = rows[0].metadata ?? {}
    const nextMetadata = {
      ...metadata,
      success_message: surface.successMessage,
      success_subtext: surface.successSubtext,
      offering_key: surface.offeringKey,
      capture: {
        ...(metadata.capture ?? {}),
        mode: "simple_email_hold",
        target_table: "measures_seat_hold_capture",
        notification_state_default: "captured",
        no_src: true,
        no_payment: true,
        no_automatic_email: true,
      },
    }

    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({ metadata: nextMetadata })
        .eq("id", rows[0].id),
      `${surface.encounterKey} metadata update failed`,
    )
  }

  const probeEmail = `seat-hold-notification-${Date.now()}@example.invalid`
  const probes = []

  for (const surface of holdSurfaces) {
    probes.push(await insertProbe(surface, probeEmail))
  }

  const reviewRows = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .select(
        "email, offering_key, source_encounter_key, notification_state, created_at",
      )
      .eq("email", probeEmail)
      .order("created_at", { ascending: false }),
    "Operator review query failed",
  )

  await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .delete()
      .eq("email", probeEmail)
      .eq("registry_key", "measures_registry"),
    "Notification probe cleanup failed",
  )

  const metadataRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in(
        "encounter_key",
        holdSurfaces.map((surface) => surface.encounterKey),
      )
      .order("encounter_key"),
    "Success metadata validation failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        notificationColumnsReady: true,
        allowedNotificationStates: [
          "captured",
          "queued",
          "notified",
          "failed",
          "suppressed",
        ],
        defaultNotificationState: "captured",
        probeInsertCount: probes.length,
        operatorReviewRows: reviewRows,
        successMessages: metadataRows.map((row) => ({
          encounter_key: row.encounter_key,
          offering_key: row.metadata?.offering_key,
          success_message: row.metadata?.success_message,
          success_subtext: row.metadata?.success_subtext,
        })),
        noAutomaticEmailSent: true,
        noSrcPaymentC3KeyLogic: true,
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
