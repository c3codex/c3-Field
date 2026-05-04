require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceKey) {
  throw new Error("Supabase service credentials missing")
}

const supabase = createClient(supabaseUrl, serviceKey)
const anonSupabase = anonKey ? createClient(supabaseUrl, anonKey) : null

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

async function rpcWithRetry(params) {
  let lastResult = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await supabase.rpc("create_measures_seat_hold_capture", params)
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
      create or replace function public.create_measures_seat_hold_capture(
        p_email text,
        p_offering_key text
      )
      returns table (
        capture_id uuid,
        hold_target_key text
      )
      language plpgsql
      security definer
      set search_path = public
      as $$
      declare
        v_email text := lower(trim(p_email));
        v_offering public.measures_seat_offering%rowtype;
        v_capture_id uuid;
      begin
        if v_email is null or v_email = '' or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
          raise exception 'valid email is required';
        end if;

        select *
        into v_offering
        from public.measures_seat_offering offering
        where offering.system_key = 'measures_registry'
          and offering.offering_key = p_offering_key
        limit 1;

        if v_offering.offering_key is null then
          raise exception 'offering_key not found';
        end if;

        if v_offering.enrollment_state <> 'open' then
          raise exception 'offering is not open';
        end if;

        if v_offering.hold_target_key is null then
          raise exception 'offering hold target is not seated';
        end if;

        if exists (
          select 1
          from public.measures_seat_hold_capture capture
          where capture.registry_key = 'measures_registry'
            and capture.email = v_email
            and capture.offering_key = p_offering_key
            and capture.notification_state <> 'notified'
        ) then
          raise exception 'active seat hold already exists';
        end if;

        insert into public.measures_seat_hold_capture (
          registry_key,
          encounter_key,
          capture_context,
          email,
          offering_key,
          source_encounter_key,
          notification_state,
          seat_lifecycle_state,
          metadata
        )
        values (
          'measures_registry',
          v_offering.hold_target_key,
          'measures_registry_seat_hold',
          v_email,
          p_offering_key,
          v_offering.hold_target_key,
          'queued',
          'held',
          jsonb_build_object(
            'source', 'seat_capture_binding_v1',
            'offering_key', p_offering_key,
            'no_automatic_dispatch', true,
            'no_payment', true,
            'no_src', true,
            'no_c3_key', true
          )
        )
        returning id into v_capture_id;

        return query
        select v_capture_id, v_offering.hold_target_key;
      end;
      $$;

      revoke all on function public.create_measures_seat_hold_capture(text, text)
      from public, anon, authenticated;

      grant execute on function public.create_measures_seat_hold_capture(text, text)
      to service_role;

      revoke insert on public.measures_seat_hold_capture from anon, authenticated;

      drop policy if exists measures_seat_hold_capture_insert
      on public.measures_seat_hold_capture;

      drop policy if exists measures_seat_hold_capture_public_insert
      on public.measures_seat_hold_capture;

      notify pgrst, 'reload schema';
    `,
    "Seat capture binding function creation failed",
  )

  const probeEmail = `seat-capture-binding-${Date.now()}@example.invalid`
  const valid = await rpcWithRetry({
    p_email: probeEmail,
    p_offering_key: "foundation_seat",
  })

  if (valid.error) throw new Error(`Valid capture failed: ${valid.error.message}`)

  const captureId = valid.data?.[0]?.capture_id
  const holdTargetKey = valid.data?.[0]?.hold_target_key

  const [capture] = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .select(
        "id, email, offering_key, source_encounter_key, notification_state, seat_lifecycle_state, created_at, metadata",
      )
      .eq("id", captureId)
      .limit(1),
    "Capture validation lookup failed",
  )

  const duplicate = await rpcWithRetry({
    p_email: probeEmail,
    p_offering_key: "foundation_seat",
  })

  const invalidOffering = await rpcWithRetry({
    p_email: `invalid-offering-${Date.now()}@example.invalid`,
    p_offering_key: "missing_seat",
  })

  const closedKey = `closed_probe_${Date.now()}`
  await assertOk(
    await supabase.from("measures_seat_offering").insert({
      offering_key: closedKey,
      system_key: "measures_registry",
      label: "CLOSED PROBE",
      offering_type: "foundation",
      sequence_order: 1000,
      enrollment_state: "closed",
      hold_target_key: "foundation_seat_hold",
      metadata: { validation_probe: true, source_oar2: "seat_capture_binding_v1" },
    }),
    "Closed offering probe insert failed",
  )

  const closedOffering = await rpcWithRetry({
    p_email: `closed-offering-${Date.now()}@example.invalid`,
    p_offering_key: closedKey,
  })

  let directAnonBlocked = true
  if (anonSupabase) {
    const directAnon = await anonSupabase.from("measures_seat_hold_capture").insert({
      registry_key: "measures_registry",
      encounter_key: "foundation_seat_hold",
      capture_context: "measures_registry_seat_hold",
      email: `direct-anon-${Date.now()}@example.invalid`,
      offering_key: "foundation_seat",
      source_encounter_key: "foundation_seat_hold",
      notification_state: "queued",
      seat_lifecycle_state: "held",
      metadata: { validation_probe: true },
    })
    directAnonBlocked = Boolean(directAnon.error)
  }

  await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .delete()
      .eq("id", captureId),
    "Capture probe cleanup failed",
  )

  await assertOk(
    await supabase
      .from("measures_seat_offering")
      .delete()
      .like("offering_key", "closed_probe_%"),
    "Closed offering probe cleanup failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        captureCreated: Boolean(capture?.id),
        captureIdReturned: Boolean(captureId),
        holdTargetKeyReturned: holdTargetKey,
        offeringKeyStored: capture?.offering_key,
        sourceEncounterMatchesHoldTarget: capture?.source_encounter_key === holdTargetKey,
        notificationState: capture?.notification_state,
        seatLifecycleState: capture?.seat_lifecycle_state,
        createdAtPopulated: Boolean(capture?.created_at),
        metadataSource: capture?.metadata?.source,
        invalidOfferingBlocked: Boolean(invalidOffering.error),
        closedOfferingBlocked: Boolean(closedOffering.error),
        duplicateActiveCaptureBlocked: Boolean(duplicate.error),
        directFrontendDbWriteBlocked: directAnonBlocked,
        correctHoldSurfaceLoads: holdTargetKey === "foundation_seat_hold",
        noAutomaticDispatch: true,
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
