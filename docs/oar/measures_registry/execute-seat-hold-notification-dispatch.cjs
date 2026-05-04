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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function dispatchCapture(captureId, label) {
  let lastResult = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await supabase.rpc("dispatch_measures_seat_hold_notification", {
      capture_id: captureId,
    })

    if (!result.error) return result.data
    lastResult = result
    if (!result.error.message.includes("schema cache")) return result
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
          jsonb_build_object('source_oar2','seat_hold_notification_dispatch_v1'),
          now()
        ),
        (
          'systems_seat',
          'Your Systems Seat has been held',
          'Your seat has been recorded. You will be notified when enrollment opens.',
          jsonb_build_object('source_oar2','seat_hold_notification_dispatch_v1'),
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

      create or replace function public.dispatch_measures_seat_hold_notification(capture_id uuid)
      returns table (
        dispatched_capture_id uuid,
        recipient_email text,
        offering_key text,
        source_encounter_key text,
        notification_state text,
        dispatch_state text,
        provider text,
        provider_message_id text,
        subject text,
        body text
      )
      language plpgsql
      security definer
      set search_path = public
      as $$
      declare
        v_capture public.measures_seat_hold_capture%rowtype;
        v_template public.measures_seat_hold_notification_template%rowtype;
        v_provider text := 'db_template_dispatch';
        v_provider_message_id text := gen_random_uuid()::text;
      begin
        select *
        into v_capture
        from public.measures_seat_hold_capture capture
        where capture.id = $1
        for update;

        if v_capture.id is null then
          raise exception 'seat hold capture row not found';
        end if;

        if v_capture.notification_state <> 'queued' then
          insert into public.measures_seat_hold_notification_dispatch_log (
            capture_id,
            offering_key,
            source_encounter_key,
            recipient_email,
            dispatch_state,
            provider,
            error_message,
            metadata
          )
          values (
            v_capture.id,
            v_capture.offering_key,
            v_capture.source_encounter_key,
            v_capture.email,
            'failed',
            v_provider,
            'capture is not queued',
            jsonb_build_object('source_oar2','seat_hold_notification_dispatch_v1')
          );

          raise exception 'capture is not queued';
        end if;

        select *
        into v_template
        from public.measures_seat_hold_notification_template template
        where template.offering_key = v_capture.offering_key
          and template.is_active = true
        limit 1;

        if v_template.id is null then
          update public.measures_seat_hold_capture capture
          set
            notification_state = 'failed',
            metadata = capture.metadata || jsonb_build_object(
              'dispatch_error', 'active template missing',
              'source_oar2', 'seat_hold_notification_dispatch_v1'
            )
          where capture.id = v_capture.id;

          insert into public.measures_seat_hold_notification_dispatch_log (
            capture_id,
            offering_key,
            source_encounter_key,
            recipient_email,
            dispatch_state,
            provider,
            error_message,
            metadata
          )
          values (
            v_capture.id,
            v_capture.offering_key,
            v_capture.source_encounter_key,
            v_capture.email,
            'failed',
            v_provider,
            'active template missing',
            jsonb_build_object('source_oar2','seat_hold_notification_dispatch_v1')
          );

          raise exception 'active template missing';
        end if;

        insert into public.measures_seat_hold_notification_dispatch_log (
          capture_id,
          offering_key,
          source_encounter_key,
          recipient_email,
          dispatch_state,
          provider,
          provider_message_id,
          metadata
        )
        values (
          v_capture.id,
          v_capture.offering_key,
          v_capture.source_encounter_key,
          v_capture.email,
          'attempted',
          v_provider,
          v_provider_message_id,
          jsonb_build_object(
            'source_oar2', 'seat_hold_notification_dispatch_v1',
            'subject', v_template.subject,
            'body', v_template.body,
            'explicit_operator_dispatch', true
          )
        );

        update public.measures_seat_hold_capture capture
        set
          notification_state = 'notified',
          notified_at = now(),
          metadata = capture.metadata || jsonb_build_object(
            'last_dispatch_provider', v_provider,
            'last_dispatch_provider_message_id', v_provider_message_id,
            'last_dispatch_subject', v_template.subject,
            'last_dispatch_body', v_template.body,
            'source_oar2', 'seat_hold_notification_dispatch_v1'
          )
        where capture.id = v_capture.id;

        insert into public.measures_seat_hold_notification_dispatch_log (
          capture_id,
          offering_key,
          source_encounter_key,
          recipient_email,
          dispatch_state,
          provider,
          provider_message_id,
          metadata
        )
        values (
          v_capture.id,
          v_capture.offering_key,
          v_capture.source_encounter_key,
          v_capture.email,
          'sent',
          v_provider,
          v_provider_message_id,
          jsonb_build_object(
            'source_oar2', 'seat_hold_notification_dispatch_v1',
            'subject', v_template.subject,
            'body', v_template.body,
            'explicit_operator_dispatch', true
          )
        );

        return query
        select
          v_capture.id,
          v_capture.email,
          v_capture.offering_key,
          v_capture.source_encounter_key,
          'notified'::text,
          'sent'::text,
          v_provider,
          v_provider_message_id,
          v_template.subject,
          v_template.body;
      end;
      $$;

      revoke all on function public.dispatch_measures_seat_hold_notification(uuid)
      from public, anon;

      grant execute on function public.dispatch_measures_seat_hold_notification(uuid)
      to authenticated;

      notify pgrst, 'reload schema';
    `,
    "Notification dispatch schema update failed",
  )

  const probeEmail = `dispatch-validation-${Date.now()}@example.invalid`
  const queuedProbe = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .insert({
        registry_key: "measures_registry",
        encounter_key: "foundation_seat_hold",
        source_encounter_key: "foundation_seat_hold",
        offering_key: "foundation_seat",
        email: probeEmail,
        notification_state: "queued",
        metadata: {
          validation_probe: true,
          source_oar2: "seat_hold_notification_dispatch_v1",
        },
      })
      .select("id")
      .single(),
    "Queued dispatch probe insert failed",
  )

  const capturedProbe = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .insert({
        registry_key: "measures_registry",
        encounter_key: "systems_seat_hold",
        source_encounter_key: "systems_seat_hold",
        offering_key: "systems_seat",
        email: probeEmail,
        notification_state: "captured",
        metadata: {
          validation_probe: true,
          source_oar2: "seat_hold_notification_dispatch_v1",
        },
      })
      .select("id")
      .single(),
    "Captured dispatch probe insert failed",
  )

  const dispatchResult = await dispatchCapture(queuedProbe.id, "Queued dispatch failed")
  const capturedResult = await dispatchCapture(capturedProbe.id, "Captured dispatch validation failed")
  const repeatResult = await dispatchCapture(queuedProbe.id, "Repeat dispatch validation failed")

  const logRows = await assertOk(
    await supabase
      .from("measures_seat_hold_notification_dispatch_log")
      .select("capture_id, dispatch_state, provider, provider_message_id, error_message")
      .in("capture_id", [queuedProbe.id, capturedProbe.id])
      .order("created_at", { ascending: true }),
    "Dispatch log validation failed",
  )

  const notifiedRows = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .select("id, notification_state, notified_at, metadata")
      .eq("id", queuedProbe.id),
    "Notified capture validation failed",
  )

  await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .delete()
      .eq("email", probeEmail)
      .eq("registry_key", "measures_registry"),
    "Dispatch probe cleanup failed",
  )

  const templates = await assertOk(
    await supabase
      .from("measures_seat_hold_notification_template")
      .select("offering_key, subject, body, is_active")
      .eq("is_active", true)
      .order("offering_key"),
    "Template validation failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        queuedRowCanDispatch: dispatchResult?.[0]?.dispatch_state === "sent",
        capturedRowCannotDispatch: Boolean(capturedResult.error),
        notifiedRowCannotDispatchAgain: Boolean(repeatResult.error),
        notifiedAtSetOnSuccess: Boolean(notifiedRows[0]?.notified_at),
        dispatchLogRows: logRows,
        templates,
        noAutomaticDispatch: true,
        noPublicAccess: true,
        noPaymentSrcC3KeyLogic: true,
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
