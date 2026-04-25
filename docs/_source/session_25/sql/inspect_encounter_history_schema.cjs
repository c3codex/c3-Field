require("dotenv").config({ path: ".env.local" })

const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
)

async function main() {
  const sql = `
    select table_schema, table_name
    from information_schema.tables
    where table_schema = 'public'
      and (
        table_name ilike '%view%'
        or table_name ilike '%history%'
        or table_name ilike '%presence%'
        or table_name ilike '%encounter%'
        or table_name ilike '%session%'
      )
    order by table_name
  `

  const { data, error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw error

  console.log(JSON.stringify(data, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
