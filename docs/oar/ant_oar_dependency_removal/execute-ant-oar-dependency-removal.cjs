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

const driftViews = [
  "v_envelope_bundle_by_envkey_v1",
  "v_ant_intake_queue_v1",
  "v_ant_passage_readiness_v1",
]

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function execSql(sql, label) {
  const { data, error } = await supabase.rpc("exec_sql", { sql })
  if (error) {
    const details = [error.message, error.details, error.hint, error.code]
      .filter(Boolean)
      .join(" | ")
    throw new Error(`${label}: ${details}`)
  }
  return data
}

async function readSchemaTables() {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase schema metadata failed: ${response.status}`)
  }

  const schema = await response.json()
  return Object.keys(schema.definitions ?? schema.components?.schemas ?? {})
}

async function main() {
  const beforeTables = await readSchemaTables()
  const existingViewsBefore = driftViews.filter((view) => beforeTables.includes(view))
  const missingViewsBefore = driftViews.filter((view) => !beforeTables.includes(view))
  const antOarLogExistedBefore = beforeTables.includes("ant_oar_log")
  const systemOarLogExistedBefore = beforeTables.includes("system_oar_log")

  if (missingViewsBefore.length > 0) {
    throw new Error(`Required drift views missing before removal: ${missingViewsBefore.join(", ")}`)
  }

  if (!antOarLogExistedBefore) {
    throw new Error("ant_oar_log missing before removal")
  }

  if (!systemOarLogExistedBefore) {
    throw new Error("system_oar_log missing before removal; refusing to proceed")
  }

  const { count: antOarLogRowCount, error: countError } = await supabase
    .from("ant_oar_log")
    .select("id", { count: "exact", head: true })

  if (countError) {
    throw new Error(`ant_oar_log row count failed: ${countError.message}`)
  }

  if (antOarLogRowCount !== 0) {
    throw new Error(`ant_oar_log is not empty; row count = ${antOarLogRowCount}`)
  }

  for (const view of driftViews) {
    await execSql(`drop view public.${view};`, `${view} drop failed`)
  }

  await execSql("drop table public.ant_oar_log;", "ant_oar_log drop failed")
  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")

  let afterTables = await readSchemaTables()
  for (
    let attempt = 0;
    attempt < 8 &&
    (afterTables.includes("ant_oar_log") ||
      driftViews.some((view) => afterTables.includes(view)));
    attempt += 1
  ) {
    await wait(1000)
    afterTables = await readSchemaTables()
  }

  const viewsStillPresent = driftViews.filter((view) => afterTables.includes(view))
  const antOarLogExistsAfter = afterTables.includes("ant_oar_log")
  const systemOarLogRemainsIntact = afterTables.includes("system_oar_log")

  if (viewsStillPresent.length > 0 || antOarLogExistsAfter || !systemOarLogRemainsIntact) {
    throw new Error(
      JSON.stringify({
        views_still_present: viewsStillPresent,
        ant_oar_log_exists_after: antOarLogExistsAfter,
        system_oar_log_remains_intact: systemOarLogRemainsIntact,
      }),
    )
  }

  console.log(
    JSON.stringify(
      {
        views_existing_before_removal: existingViewsBefore,
        views_removed: driftViews,
        ant_oar_log_existed_before_removal: antOarLogExistedBefore,
        ant_oar_log_row_count_before_removal: antOarLogRowCount,
        ant_oar_log_removed: true,
        system_oar_log_remains_intact: systemOarLogRemainsIntact,
        cascade_used: false,
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
