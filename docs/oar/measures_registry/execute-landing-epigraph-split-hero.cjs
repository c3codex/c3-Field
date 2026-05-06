require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const campaignKey = "agents_of_chaos_integrity_governance"
const source = "landing_epigraph_split_hero_v1"
const bucket = "measures-registry"

const media = [
  {
    role: "epigraph_video",
    path: "registry_epigraph_fracture_to_alignment_15s.mp4",
    mime: "video/mp4",
    sort: 41,
  },
  {
    role: "hero_image",
    path: "hero_fracture_measure.webp",
    mime: "image/webp",
    sort: 42,
  },
  {
    role: "explainer_video",
    path: "structural_coherence_explainer_45s.mp4",
    mime: "video/mp4",
    sort: 43,
  },
]

const encounters = [
  {
    key: "landing_root",
    title: "Measures Registry",
    sequence: 1000,
    metadata: {
      function_layer: "entry",
      state_expression: "public_landing_root",
      renderer: "epigraph_split_hero",
      eyebrow: "Integrity governance for AI systems",
      title: "Behavior that is not registered cannot be governed.",
      subtitle: "Enter through system evaluation or foundational cohort conversion.",
      media_roles: ["epigraph_video", "hero_image"],
      hero_paths: [
        {
          side: "left",
          title: "System Evaluation",
          subtitle: "Identify implementation absence, structural drift, and governance gaps.",
          action_key: "route_educate_eval",
        },
        {
          side: "right",
          title: "Measures Conversion",
          subtitle: "Structured Foundational Cohort",
          action_key: "route_cohort_conversion",
        },
      ],
      actions: [
        {
          action_key: "route_educate_eval",
          label: "System Evaluation",
          behavior: "route_surface",
          target_encounter_key: "educate_eval_encounter",
        },
        {
          action_key: "route_cohort_conversion",
          label: "Measures Conversion",
          behavior: "route_surface",
          target_encounter_key: "cohort_conversion_encounter",
        },
      ],
      source,
    },
  },
  {
    key: "educate_eval_encounter",
    title: "System Evaluation",
    sequence: 1005,
    metadata: {
      function_layer: "education_diagnostic",
      state_expression: "public_educate_eval_encounter",
      renderer: "explainer_to_evaluation_cta",
      eyebrow: "Educational diagnostic",
      title: "Evaluate structural readiness before conversion.",
      subtitle:
        "This encounter identifies implementation absence, governance gaps, traceability risks, and uncontrolled AI deployment patterns before conversion consideration.",
      media_roles: ["explainer_video"],
      sections: [
        {
          title: "Purpose",
          body:
            "The evaluation is educational and diagnostic. It is not SRC, not c3 key assignment, not wallet connection, and not conversion binding.",
        },
        {
          title: "What it surfaces",
          body:
            "Structural drift, missing implementation layers, governance absence, frontend invention risk, uncontrolled AI deployment, and traceability gaps.",
        },
      ],
      actions: [
        {
          action_key: "begin_evaluation",
          label: "Begin Evaluation",
          behavior: "route_surface",
          target_encounter_key: "iis_eval_gate1",
        },
        {
          action_key: "back_landing_root",
          label: "Back",
          behavior: "route_surface",
          target_encounter_key: "landing_root",
        },
      ],
      source,
    },
  },
  {
    key: "cohort_conversion_encounter",
    title: "Measures Conversion",
    sequence: 1010,
    metadata: {
      function_layer: "institutional_conversion",
      state_expression: "public_cohort_conversion_encounter",
      renderer: "cohort_conversion_entry",
      eyebrow: "Structured Foundational Cohort",
      title: "Enter Measures through structured foundational standing.",
      subtitle:
        "The cohort path is for organizations ready to move from evaluation toward registered participation.",
      sections: [
        {
          title: "Conversion boundary",
          body:
            "Foundational cohort participation remains governed by registered offering state and does not imply automatic conversion approval.",
        },
      ],
      actions: [
        {
          action_key: "route_course_review",
          label: "Review Foundational Courses",
          behavior: "route_surface",
          target_encounter_key: "reserve_seat",
        },
        {
          action_key: "back_landing_root",
          label: "Back",
          behavior: "route_surface",
          target_encounter_key: "landing_root",
        },
      ],
      source,
    },
  },
  {
    key: "iis_eval_gate1",
    title: "Institutional Structural Evaluation",
    sequence: 1015,
    metadata: {
      function_layer: "diagnostic_capture",
      state_expression: "public_iis_eval_gate1",
      renderer: "db_bound_evaluation_capture",
      eyebrow: "IIS Evaluation Gate 1",
      title: "Institutional structural evaluation intake.",
      subtitle:
        "This evaluation identifies structural drift and missing implementation layers. It is not SRC, c3 key assignment, wallet connection, or conversion binding.",
      capture_context: "iis_eval_gate1",
      capture_fields: {
        institution: ["institution_name", "institution_address", "institution_phone"],
        contact: ["contact_name", "contact_position", "contact_email"],
      },
      evaluation_sections: [
        {
          title: "AI usage scope",
          questions: [
            "Where is AI currently being used inside the institution?",
            "Which teams or public surfaces rely on AI-assisted output?",
          ],
        },
        {
          title: "Deployment maturity",
          questions: [
            "Which AI workflows are experimental, live, or operationally relied upon?",
            "What approval process exists before AI behavior reaches users or stakeholders?",
          ],
        },
        {
          title: "System / website structure",
          questions: [
            "Where does public-facing system behavior originate and who can change it?",
            "What prevents frontend copy, routing, or media from becoming unregistered truth?",
          ],
        },
        {
          title: "Witnessed AI behavior",
          questions: [
            "What drift, contradiction, hallucination, or unexplained variance has been witnessed?",
            "How are those incidents recorded and reviewed?",
          ],
        },
        {
          title: "Governance + validation",
          questions: [
            "What governance body or role validates AI behavior before deployment?",
            "How are decisions, outputs, and changes traced after release?",
          ],
        },
      ],
      resolution_text:
        "Structural drift indicators were identified.\n\nYour evaluation has been seated for educational review eligibility.\n\nQualified organizations may enroll in the Measures foundational course sequence at reduced institutional entry standing prior to full conversion assessment.",
      capture_metadata: {
        capture_context: "iis_eval_gate1",
        intent: "system_evaluation_request",
        eligibility: {
          foundational_courses: true,
          conversion_assessment: "pending_review",
        },
      },
      email_flow: {
        internal_notification: true,
        confirmation_email_state: "queued",
        campaign_tag: "iis_eval_gate1",
        subject: "Evaluation Received — Educational Review Pending",
        tone: ["institutional", "diagnostic", "non-promotional"],
      },
      actions: [
        {
          action_key: "back_landing_root",
          label: "Back",
          behavior: "route_surface",
          target_encounter_key: "landing_root",
        },
      ],
      source,
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

async function seatMedia(item) {
  const files = await assertOk(
    await supabase.storage.from(bucket).list("", { search: item.path, limit: 10 }),
    `${item.role} storage lookup failed`,
  )
  const file = files.find((candidate) => candidate.name === item.path)
  if (!file) throw new Error(`${item.role} storage path missing: ${bucket}/${item.path}`)

  const payload = {
    registry_key: "measures_registry_landing",
    encounter_key: "landing_root",
    campaign_key: campaignKey,
    media_role: item.role,
    storage_bucket: bucket,
    storage_path: item.path,
    mime_type: item.mime,
    sort_order: item.sort,
    is_active: true,
    metadata: {
      source,
      storage_size: file.metadata?.size ?? file.metadata?.contentLength ?? null,
      oar_role: item.role,
    },
  }

  const existing = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("id")
      .eq("campaign_key", campaignKey)
      .eq("media_role", item.role)
      .limit(1),
    `${item.role} media lookup failed`,
  )

  if (existing.length > 0) {
    await assertOk(
      await supabase.from("measures_media_map").update(payload).eq("id", existing[0].id),
      `${item.role} media update failed`,
    )
  } else {
    await assertOk(
      await supabase.from("measures_media_map").insert(payload),
      `${item.role} media insert failed`,
    )
  }

  return { role: item.role, bucket, path: item.path, size: payload.metadata.storage_size }
}

async function seatEncounter(item) {
  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: item.key,
          display_title: item.title,
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: item.sequence,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: { source, parent: "measures_registry_landing" },
        },
        { onConflict: "registry_key" },
      ),
    `${item.key} registry upsert failed`,
  )

  const [registry] = await assertOk(
    await supabase.from("measures_registry").select("id").eq("registry_key", item.key).limit(1),
    `${item.key} registry lookup failed`,
  )
  if (!registry) throw new Error(`${item.key} registry row missing`)

  const existing = await assertOk(
    await supabase.from("measures_encounter_def").select("id").eq("encounter_key", item.key).limit(1),
    `${item.key} encounter lookup failed`,
  )

  const payload = {
    registry_id: registry.id,
    encounter_key: item.key,
    display_title: item.title,
    encounter_type: "view",
    material_family: "obsidian",
    surface_type: "threshold",
    sequence_order: item.sequence,
    pause_allowed: true,
    is_entry_surface: item.key === "landing_root",
    is_active: true,
    metadata: item.metadata,
  }

  if (existing.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: payload.display_title,
          metadata: payload.metadata,
          sequence_order: payload.sequence_order,
          is_entry_surface: payload.is_entry_surface,
          is_active: payload.is_active,
        })
        .eq("id", existing[0].id),
      `${item.key} encounter update failed`,
    )
  } else {
    await assertOk(await supabase.from("measures_encounter_def").insert(payload), `${item.key} encounter insert failed`)
  }
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  await execSql(
    `
      create extension if not exists pgcrypto;

      create table if not exists public.measures_iis_eval_gate1_capture (
        id uuid primary key default gen_random_uuid(),
        institution_name text not null,
        institution_address text not null,
        institution_phone text not null,
        contact_name text not null,
        contact_position text not null,
        contact_email text not null,
        evaluation_answers jsonb not null default '{}'::jsonb,
        capture_context text not null default 'iis_eval_gate1',
        intent text not null default 'system_evaluation_request',
        eligibility jsonb not null default '{"foundational_courses":true,"conversion_assessment":"pending_review"}'::jsonb,
        campaign_tag text not null default 'iis_eval_gate1',
        notification_state text not null default 'queued',
        confirmation_email_state text not null default 'queued',
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      alter table public.measures_iis_eval_gate1_capture enable row level security;

      drop policy if exists measures_iis_eval_gate1_capture_public_insert
      on public.measures_iis_eval_gate1_capture;

      create policy measures_iis_eval_gate1_capture_public_insert
      on public.measures_iis_eval_gate1_capture
      for insert
      to anon, authenticated
      with check (capture_context = 'iis_eval_gate1' and intent = 'system_evaluation_request');

      grant insert on public.measures_iis_eval_gate1_capture to anon, authenticated;
      grant select on public.measures_iis_eval_gate1_capture to authenticated;
      notify pgrst, 'reload schema';
    `,
    "IIS eval capture table seating failed",
  )

  const mediaResults = []
  for (const item of media) mediaResults.push(await seatMedia(item))
  for (const item of encounters) await seatEncounter(item)

  const rows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", ["landing_root", "educate_eval_encounter", "cohort_conversion_encounter", "iis_eval_gate1"])
      .order("encounter_key"),
    "Validation query failed",
  )

  const mediaRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .eq("campaign_key", campaignKey)
      .in("media_role", ["epigraph_video", "hero_image", "explainer_video"])
      .eq("is_active", true),
    "Media validation failed",
  )

  console.log(JSON.stringify({
    dbConnection: "active",
    requiredEncounterCount: rows.length,
    requiredEncounters: rows.map((row) => row.encounter_key),
    mediaResults,
    mediaRows,
    captureTable: "measures_iis_eval_gate1_capture",
    noScoring: !JSON.stringify(rows).toLowerCase().includes("score"),
    validationRows: rows,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
