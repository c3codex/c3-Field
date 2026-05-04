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

const dependencySql = `
select distinct
  dependent_ns.nspname as dependent_schema,
  dependent_class.relname as dependent_object,
  dependent_class.relkind::text as dependent_kind,
  dep.deptype::text as deptype
from pg_depend dep
join pg_rewrite rewrite on dep.objid = rewrite.oid
join pg_class dependent_class on rewrite.ev_class = dependent_class.oid
join pg_namespace dependent_ns on dependent_class.relnamespace = dependent_ns.oid
where dep.refobjid = 'public.ant_oar_log'::regclass
union all
select distinct
  connamespace::regnamespace::text as dependent_schema,
  conname as dependent_object,
  'constraint' as dependent_kind,
  contype::text as deptype
from pg_constraint
where confrelid = 'public.ant_oar_log'::regclass
   or conrelid = 'public.ant_oar_log'::regclass
order by dependent_schema, dependent_object;
`

const genericDependencySql = `
select
  dep.classid::regclass::text as dependency_catalog,
  dep.objid::text as dependent_object_id,
  dep.objsubid,
  dep.refobjsubid,
  dep.deptype::text as deptype
from pg_depend dep
where dep.refobjid = 'public.ant_oar_log'::regclass
order by dependency_catalog, dependent_object_id;
`

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
  const antOarLogExistedBefore = beforeTables.includes("ant_oar_log")
  const systemOarLogExistedBefore = beforeTables.includes("system_oar_log")

  if (!antOarLogExistedBefore) {
    throw new Error("ant_oar_log did not exist before removal")
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

  const dependencies = await execSql(
    dependencySql,
    "ant_oar_log dependency inspection failed",
  )

  if (dependencies.length > 0) {
    console.log(
      JSON.stringify(
        {
          ant_oar_log_existed_before_removal: antOarLogExistedBefore,
          ant_oar_log_row_count_before_removal: antOarLogRowCount,
          ant_oar_log_removed: false,
          removal_blocked_reason:
            "Dependent objects exist; refusing to use cascade because this OAR only authorizes dropping public.ant_oar_log.",
          dependencies,
          system_oar_log_remains_intact: true,
        },
        null,
        2,
      ),
    )
    return
  }

  const genericDependencies = await execSql(
    genericDependencySql,
    "ant_oar_log generic dependency inspection failed",
  )

  if (genericDependencies.length > 0) {
    console.log(
      JSON.stringify(
        {
          ant_oar_log_existed_before_removal: antOarLogExistedBefore,
          ant_oar_log_row_count_before_removal: antOarLogRowCount,
          ant_oar_log_removed: false,
          removal_blocked_reason:
            "Dependent catalog objects exist; refusing to use cascade because this OAR only authorizes dropping public.ant_oar_log.",
          dependencies: genericDependencies,
          system_oar_log_remains_intact: true,
        },
        null,
        2,
      ),
    )
    return
  }

  await execSql("drop table public.ant_oar_log;", "ant_oar_log drop failed")
  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")

  let afterTables = await readSchemaTables()
  for (let attempt = 0; attempt < 8 && afterTables.includes("ant_oar_log"); attempt += 1) {
    await wait(1000)
    afterTables = await readSchemaTables()
  }

  const antOarLogExistsAfter = afterTables.includes("ant_oar_log")
  const systemOarLogRemainsIntact = afterTables.includes("system_oar_log")

  if (antOarLogExistsAfter) {
    throw new Error("ant_oar_log still appears in Supabase schema metadata after removal")
  }

  if (!systemOarLogRemainsIntact) {
    throw new Error("system_oar_log missing after removal")
  }

  console.log(
    JSON.stringify(
      {
        ant_oar_log_existed_before_removal: antOarLogExistedBefore,
        ant_oar_log_row_count_before_removal: antOarLogRowCount,
        ant_oar_log_exists_after_removal: antOarLogExistsAfter,
        system_oar_log_remains_intact: systemOarLogRemainsIntact,
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
