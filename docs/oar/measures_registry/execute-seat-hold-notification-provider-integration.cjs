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

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await execSql(
    `
      create extension if not exists pgcrypto;

      create table if not exists public.measures_seat_hold_notification_template (
        id uuid primary key default gen_random_uuid(),
        offering_key text not null,
        subject text not null,
        body text not null,
        is_active boolean not null default true,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        constraint measures_seat_hold_notification_template_unique unique (offering_key)
      );

      insert into public.measures_seat_hold_notification_template (
        offering_key,
        subject,
        body,
        metadata,
        updated_at
      )
      values
        (
          'foundation_seat',
          'Your Foundation Seat has been held',
          'Your seat has been recorded. You will be notified when enrollment opens.',
          jsonb_build_object(
            'source_oar2','seat_hold_notification_provider_integration_v1',
            'provider','resend',
            'sender','Measures Registry <connect@measuresregistry.com>',
            'reply_to','connect@measuresregistry.com'
          ),
          now()
        ),
        (
          'systems_seat',
          'Your Systems Seat has been held',
          'Your seat has been recorded. You will be notified when enrollment opens.',
          jsonb_build_object(
            'source_oar2','seat_hold_notification_provider_integration_v1',
            'provider','resend',
            'sender','Measures Registry <connect@measuresregistry.com>',
            'reply_to','connect@measuresregistry.com'
          ),
          now()
        )
      on conflict (offering_key)
      do update set
        subject = excluded.subject,
        body = excluded.body,
        is_active = true,
        metadata = excluded.metadata,
        updated_at = now();

      create table if not exists public.measures_seat_hold_notification_dispatch_log (
        id uuid primary key default gen_random_uuid(),
        capture_id uuid not null,
        offering_key text,
        source_encounter_key text,
        recipient_email text not null,
        dispatch_state text not null,
        provider text not null,
        provider_message_id text,
        error_message text,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        constraint measures_seat_hold_notification_dispatch_state_check
        check (dispatch_state in ('attempted','sent','failed'))
      );

      revoke all on public.measures_seat_hold_notification_dispatch_log from public, anon;
      grant select on public.measures_seat_hold_notification_dispatch_log to authenticated;

      drop view if exists public.measures_seat_hold_notification_review_v1;

      create view public.measures_seat_hold_notification_review_v1 as
      select
        id as capture_id,
        email,
        offering_key,
        source_encounter_key,
        notification_state,
        created_at
      from public.measures_seat_hold_capture
      where registry_key = 'measures_registry'
      order by created_at desc;

      grant select on public.measures_seat_hold_notification_review_v1 to authenticated;

      revoke all on function public.dispatch_measures_seat_hold_notification(uuid)
      from public, anon, authenticated;

      notify pgrst, 'reload schema';
    `,
    "Provider integration DB seating failed",
  )

  const templates = await assertOk(
    await supabase
      .from("measures_seat_hold_notification_template")
      .select("offering_key, subject, body, metadata, is_active")
      .eq("is_active", true)
      .order("offering_key"),
    "Provider template validation failed",
  )

  const queuedRows = await assertOk(
    await supabase
      .from("measures_seat_hold_notification_review_v1")
      .select("capture_id, notification_state")
      .eq("notification_state", "queued")
      .limit(1),
    "Provider review view validation failed",
  )

  const frontendLeakCheck = {
    vitePrefixedResendKey: Boolean(process.env.VITE_RESEND_API_KEY),
    serverResendKeyPresent: Boolean(process.env.RESEND_API_KEY),
  }

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        provider: "resend",
        sender: "Measures Registry <connect@measuresregistry.com>",
        replyTo: "connect@measuresregistry.com",
        templates,
        reviewViewHasCaptureId: true,
        queuedRowsAvailableForDispatch: queuedRows.length,
        oldDbTemplateDispatchRevoked: true,
        resendApiKeyServerSideOnly: !frontendLeakCheck.vitePrefixedResendKey,
        serverResendKeyPresentLocally: frontendLeakCheck.serverResendKeyPresent,
        requiredCloudflareEnv: [
          "RESEND_API_KEY",
          "OPERATOR_DISPATCH_KEY",
          "SUPABASE_SERVICE_ROLE_KEY",
          "SUPABASE_URL or VITE_SUPABASE_URL",
        ],
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
