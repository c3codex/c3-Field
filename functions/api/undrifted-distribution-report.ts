type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type DistributionReportRow = {
  dispatch_key: string
  issue_key: string
  desk_key: string
  title: string
  internal_route: string | null
  external_url: string | null
  publication_status: string
  published_at: string | null
  publication_object_key: string
  source_sha256: string | null
  source_drive_id: string | null
  source_distribution_hold: boolean
  object_profile_standing: string | null
  researched_and_cited: boolean | null
  citations_verified: boolean | null
  execution_count: number
  completed_distribution_count: number
  latest_platform_url: string | null
  distribution_state: string
  allowed_channels: Array<{
    outlet_key?: string
    outlet_name?: string
    distribution_mode?: string
    standing?: string
    fit_score?: number
    account_standing?: string
  }>
}

const headers = { "content-type": "application/json; charset=utf-8" }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), { status, headers })
}

function supabaseConfig(env: Env) {
  const url = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase server credentials are not configured")
  return { url: url.replace(/\/$/, ""), key }
}

async function readReport(env: Env, issueKey?: string | null) {
  const { url, key } = supabaseConfig(env)
  const filter = issueKey ? `&issue_key=eq.${encodeURIComponent(issueKey)}` : ""
  const response = await fetch(
    `${url}/rest/v1/undrifted_distribution_report_v1?select=*&order=published_at.desc.nullslast${filter}`,
    {
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        accept: "application/json",
      },
    },
  )

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Distribution report query failed: ${response.status}`)
  }

  return response.json() as Promise<DistributionReportRow[]>
}

function groupByDesk(rows: DistributionReportRow[]) {
  const desks: Record<string, DistributionReportRow[]> = {}
  for (const row of rows) {
    if (!desks[row.desk_key]) desks[row.desk_key] = []
    desks[row.desk_key].push(row)
  }
  return desks
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const requestedIssue = new URL(request.url).searchParams.get("issue")
    let rows = await readReport(env, requestedIssue)

    const issueKey = requestedIssue ?? rows[0]?.issue_key ?? null
    if (!requestedIssue && issueKey) {
      rows = rows.filter((row) => row.issue_key === issueKey)
    }

    return json({
      issue_key: issueKey,
      article_count: rows.length,
      desks: groupByDesk(rows),
      articles: rows,
      action_summary: {
        ready_for_route_resolution: rows.filter((row) => row.distribution_state === "ready_for_route_resolution").length,
        profile_required: rows.filter((row) => row.distribution_state === "profile_required").length,
        source_hold: rows.filter((row) => row.distribution_state === "source_hold").length,
        distributed: rows.filter((row) => row.distribution_state === "distributed").length,
      },
    })
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Unable to load unDrifted distribution report",
    }, 500)
  }
}

export const onRequest = async () => json({ error: "method not allowed" }, 405)
