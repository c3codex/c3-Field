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
const metadata = {
  function_layer: "orientation",
  state_expression: "operator_review_surface",
  renderer: "notification_review_surface",
  entry_label: "OPERATOR REVIEW",
  entry_headline: "Seat hold notification review.",
  entry_sub: "Review captured holds and prepare notification state without sending email.",
  data_source: "public.measures_seat_hold_notification_review_v1",
  fields: [
    "email",
    "offering_key",
    "source_encounter_key",
    "notification_state",
    "created_at",
  ],
  allowed_transitions: {
    captured: ["queued", "suppressed"],
    queued: ["notified", "failed"],
    failed: ["queued"],
  },
  constraints: {
    operator_only: true,
    public_routing: false,
    no_automatic_email: true,
    no_payment: true,
    no_src: true,
    no_c3_key: true,
    no_cohort_activation: true,
  },
}

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

async function transitionState(params, label) {
  let lastResult = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await supabase.rpc("update_measures_seat_hold_notification_state", params)
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

  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: encounterKey,
          display_title: "Seat Hold Notification Review",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1080,
          release_state: "released",
          access_state: "gated",
          is_active: true,
          metadata: {
            role: "measures_registry_operator_review",
            source: "seat_hold_notification_review_surface_v1",
            parent: "measures_registry_runtime",
          },
        },
        { onConflict: "registry_key" },
      ),
    "Notification review registry row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id, metadata")
      .eq("registry_key", encounterKey)
      .limit(1),
    "Notification review registry lookup failed",
  )

  const registryId = registryRows[0]?.id
  if (!registryId) throw new Error("Notification review registry id missing")

  const existingRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Notification review encounter lookup failed",
  )

  const payload = {
    registry_id: registryId,
    encounter_key: encounterKey,
    display_title: "Seat Hold Notification Review",
    encounter_type: "view",
    material_family: "obsidian",
    surface_type: "threshold",
    sequence_order: 1080,
    pause_allowed: true,
    is_entry_surface: false,
    is_active: true,
    metadata,
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
      "Notification review encounter update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert(payload),
      "Notification review encounter insert failed",
    )
  }

  await execSql(
    `
      create or replace function public.update_measures_seat_hold_notification_state(
        p_email text,
        p_source_encounter_key text,
        p_created_at timestamptz,
        p_next_state text
      )
      returns table (
        email text,
        offering_key text,
        source_encounter_key text,
        notification_state text,
        created_at timestamptz
      )
      language plpgsql
      security definer
      set search_path = public
      as $$
      declare
        v_current_state text;
        v_allowed boolean;
      begin
        select capture.notification_state
        into v_current_state
        from public.measures_seat_hold_capture capture
        where capture.registry_key = 'measures_registry'
          and capture.email = lower(trim(p_email))
          and capture.source_encounter_key = p_source_encounter_key
          and capture.created_at = p_created_at
        limit 1;

        if v_current_state is null then
          raise exception 'seat hold capture row not found';
        end if;

        v_allowed :=
          (v_current_state = 'captured' and p_next_state in ('queued','suppressed')) or
          (v_current_state = 'queued' and p_next_state in ('notified','failed')) or
          (v_current_state = 'failed' and p_next_state = 'queued');

        if not v_allowed then
          raise exception 'invalid notification transition from % to %', v_current_state, p_next_state;
        end if;

        update public.measures_seat_hold_capture capture
        set
          notification_state = p_next_state,
          notified_at = case when p_next_state = 'notified' then now() else capture.notified_at end,
          metadata = capture.metadata || jsonb_build_object(
            'last_operator_transition_at', now(),
            'last_operator_transition_from', v_current_state,
            'last_operator_transition_to', p_next_state,
            'no_automatic_email', true
          )
        where capture.registry_key = 'measures_registry'
          and capture.email = lower(trim(p_email))
          and capture.source_encounter_key = p_source_encounter_key
          and capture.created_at = p_created_at;

        return query
        select
          review.email,
          review.offering_key,
          review.source_encounter_key,
          review.notification_state,
          review.created_at
        from public.measures_seat_hold_notification_review_v1 review
        where review.email = lower(trim(p_email))
          and review.source_encounter_key = p_source_encounter_key
          and review.created_at = p_created_at;
      end;
      $$;

      revoke all on function public.update_measures_seat_hold_notification_state(text, text, timestamptz, text)
      from public, anon;

      grant execute on function public.update_measures_seat_hold_notification_state(text, text, timestamptz, text)
      to authenticated;

      notify pgrst, 'reload schema';
    `,
    "Notification transition function creation failed",
  )

  const seated = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Notification review validation failed",
  )

  const reviewRows = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .select("email, offering_key, source_encounter_key, notification_state, created_at")
      .limit(5),
    "Review data load validation failed",
  )

  const transitionProbeEmail = `review-transition-${Date.now()}@example.invalid`
  const probe = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .insert({
        registry_key: "measures_registry",
        encounter_key: "foundation_seat_hold",
        source_encounter_key: "foundation_seat_hold",
        offering_key: "foundation_seat",
        email: transitionProbeEmail,
        notification_state: "captured",
        metadata: {
          validation_probe: true,
          source_oar2: "seat_hold_notification_review_surface_v1",
          no_automatic_email: true,
        },
      })
      .select("email, source_encounter_key, notification_state, created_at")
      .single(),
    "Transition probe insert failed",
  )

  const queued = await transitionState(
    {
      p_email: probe.email,
      p_source_encounter_key: probe.source_encounter_key,
      p_created_at: probe.created_at,
      p_next_state: "queued",
    },
    "Valid transition probe failed",
  )

  const invalid = await transitionState({
    p_email: probe.email,
    p_source_encounter_key: probe.source_encounter_key,
    p_created_at: probe.created_at,
    p_next_state: "suppressed",
  })

  await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .delete()
      .eq("email", transitionProbeEmail)
      .eq("registry_key", "measures_registry"),
    "Transition probe cleanup failed",
  )

  const row = seated[0]
  const rowMetadata = row?.metadata ?? {}

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        reviewSurfaceExists: seated.length === 1,
        parent: registryRows[0]?.metadata?.parent,
        function_layer: rowMetadata.function_layer,
        state_expression: rowMetadata.state_expression,
        renderer: rowMetadata.renderer,
        dataSource: rowMetadata.data_source,
        reviewDataLoads: Array.isArray(reviewRows),
        validTransitionResult: queued?.[0]?.notification_state ?? null,
        invalidTransitionBlocked: Boolean(invalid.error),
        invalidTransitionMessage: invalid.error?.message ?? null,
        publicRouting: false,
        noAutomaticEmailSent: true,
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
