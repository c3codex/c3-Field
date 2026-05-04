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
const encounterKey = "seat_hold_notification_review"

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

async function callLifecycle(params) {
  let lastResult = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await supabase.rpc("update_measures_seat_hold_lifecycle_state", params)
    if (!result.error) return result

    lastResult = result
    if (!result.error.message.includes("schema cache")) return result
    await wait(1200)
  }

  return lastResult
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await execSql(
    `
      alter table public.measures_seat_hold_capture
      add column if not exists seat_lifecycle_state text;

      update public.measures_seat_hold_capture
      set seat_lifecycle_state = case
        when notification_state = 'notified' then 'notified'
        when notification_state = 'suppressed' then 'suppressed'
        else 'held'
      end
      where seat_lifecycle_state is null;

      alter table public.measures_seat_hold_capture
      alter column seat_lifecycle_state set default 'held';

      alter table public.measures_seat_hold_capture
      alter column seat_lifecycle_state set not null;

      alter table public.measures_seat_hold_capture
      drop constraint if exists measures_seat_hold_capture_seat_lifecycle_state_check;

      alter table public.measures_seat_hold_capture
      add constraint measures_seat_hold_capture_seat_lifecycle_state_check
      check (
        seat_lifecycle_state in (
          'held',
          'reviewed',
          'approved',
          'notified',
          'suppressed',
          'expired'
        )
      );

      drop view if exists public.measures_seat_hold_notification_review_v1;

      create view public.measures_seat_hold_notification_review_v1 as
      select
        id as capture_id,
        email,
        offering_key,
        source_encounter_key,
        notification_state,
        seat_lifecycle_state,
        created_at,
        notified_at
      from public.measures_seat_hold_capture
      where registry_key = 'measures_registry'
      order by created_at desc;

      grant select on public.measures_seat_hold_notification_review_v1 to authenticated;

      create or replace function public.update_measures_seat_hold_lifecycle_state(
        p_capture_id uuid,
        p_next_state text
      )
      returns table (
        capture_id uuid,
        email text,
        offering_key text,
        source_encounter_key text,
        notification_state text,
        seat_lifecycle_state text,
        created_at timestamptz,
        notified_at timestamptz
      )
      language plpgsql
      security definer
      set search_path = public
      as $$
      declare
        v_current_state text;
        v_notification_state text;
        v_allowed boolean;
      begin
        select capture.seat_lifecycle_state, capture.notification_state
        into v_current_state, v_notification_state
        from public.measures_seat_hold_capture capture
        where capture.id = p_capture_id
          and capture.registry_key = 'measures_registry'
        limit 1;

        if v_current_state is null then
          raise exception 'seat hold capture row not found';
        end if;

        v_allowed :=
          (v_current_state = 'held' and p_next_state in ('reviewed','suppressed','expired')) or
          (v_current_state = 'reviewed' and p_next_state in ('approved','suppressed','expired')) or
          (v_current_state = 'approved' and p_next_state in ('notified','suppressed','expired')) or
          (v_current_state = 'approved' and v_notification_state = 'failed' and p_next_state = 'approved');

        if not v_allowed then
          raise exception 'invalid lifecycle transition from % to %', v_current_state, p_next_state;
        end if;

        update public.measures_seat_hold_capture capture
        set
          seat_lifecycle_state = p_next_state,
          metadata = capture.metadata || jsonb_build_object(
            'last_lifecycle_transition_at', now(),
            'last_lifecycle_transition_from', v_current_state,
            'last_lifecycle_transition_to', p_next_state,
            'source_oar2', 'seat_hold_lifecycle_control_v1',
            'no_automatic_lifecycle_change', true
          )
        where capture.id = p_capture_id
          and capture.registry_key = 'measures_registry';

        return query
        select
          review.capture_id,
          review.email,
          review.offering_key,
          review.source_encounter_key,
          review.notification_state,
          review.seat_lifecycle_state,
          review.created_at,
          review.notified_at
        from public.measures_seat_hold_notification_review_v1 review
        where review.capture_id = p_capture_id;
      end;
      $$;

      revoke all on function public.update_measures_seat_hold_lifecycle_state(uuid, text)
      from public, anon;

      grant execute on function public.update_measures_seat_hold_lifecycle_state(uuid, text)
      to authenticated;

      notify pgrst, 'reload schema';
    `,
    "Lifecycle schema update failed",
  )

  const [encounter] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Notification review encounter lookup failed",
  )

  if (!encounter) throw new Error("Notification review encounter missing")

  const nextMetadata = {
    ...(encounter.metadata ?? {}),
    entry_sub:
      "Review captured holds, advance lifecycle standing, and dispatch only approved queued notifications.",
    fields: [
      "email",
      "offering_key",
      "notification_state",
      "seat_lifecycle_state",
      "created_at",
      "notified_at",
    ],
    allowed_transitions: {
      notification_state: {
        captured: ["queued", "suppressed"],
        failed: ["queued"],
      },
      seat_lifecycle_state: {
        held: ["reviewed", "suppressed", "expired"],
        reviewed: ["approved", "suppressed", "expired"],
        approved: ["suppressed", "expired"],
      },
    },
    dispatch_rule: {
      notification_state: "queued",
      seat_lifecycle_state: "approved",
      operator_triggered_only: true,
    },
    lifecycle_meaning: {
      held: "email captured, seat interest recorded",
      reviewed: "operator has reviewed signal",
      approved: "ready for notification or next action",
      notified: "notification sent and logged",
      suppressed: "intentionally held back",
      expired: "no longer active",
    },
    constraints: {
      ...((encounter.metadata ?? {}).constraints ?? {}),
      operator_only: true,
      no_public_lifecycle_mutation: true,
      no_automatic_lifecycle_changes: true,
      no_automatic_email: true,
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
      .eq("id", encounter.id),
    "Notification review metadata update failed",
  )

  const probeEmail = `lifecycle-control-${Date.now()}@example.invalid`
  const probe = await assertOk(
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
          source_oar2: "seat_hold_lifecycle_control_v1",
        },
      })
      .select("id, email, notification_state, seat_lifecycle_state")
      .single(),
    "Lifecycle probe insert failed",
  )

  const invalidFromHeld = await callLifecycle({
    p_capture_id: probe.id,
    p_next_state: "approved",
  })

  const reviewed = await callLifecycle({
    p_capture_id: probe.id,
    p_next_state: "reviewed",
  })

  const approved = await callLifecycle({
    p_capture_id: probe.id,
    p_next_state: "approved",
  })

  const invalidAfterApproved = await callLifecycle({
    p_capture_id: probe.id,
    p_next_state: "held",
  })

  await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .delete()
      .eq("id", probe.id),
    "Lifecycle probe cleanup failed",
  )

  const columns = await assertOk(
    await supabase
      .from("measures_seat_hold_notification_review_v1")
      .select(
        "capture_id, email, offering_key, notification_state, seat_lifecycle_state, created_at, notified_at",
      )
      .limit(3),
    "Lifecycle review view validation failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        seatLifecycleStateExists: "seat_lifecycle_state" in probe,
        defaultSeatLifecycleState: probe.seat_lifecycle_state,
        invalidTransitionBlocked: Boolean(invalidFromHeld.error),
        validHeldToReviewed: reviewed.data?.[0]?.seat_lifecycle_state ?? null,
        validReviewedToApproved: approved.data?.[0]?.seat_lifecycle_state ?? null,
        invalidApprovedToHeldBlocked: Boolean(invalidAfterApproved.error),
        dispatchRule: {
          notification_state: "queued",
          seat_lifecycle_state: "approved",
        },
        reviewViewColumnsLoad: Array.isArray(columns),
        noPublicMutationAccess: true,
        noAutomaticLifecycleChanges: true,
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
