require("dotenv").config({ path: ".env" })
const { execFileSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

const requiredVars = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "VITE_C3FIELD_R2_PUBLIC_BASE_URL",
  "VITE_R2_PUBLIC_BASE_URL",
]

function hold(message, detail) {
  console.error(`\n[deployment-preflight] HOLD — ${message}`)
  if (detail) console.error(`[deployment-preflight] ${detail}`)
  process.exit(42)
}

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return ""
  }
}

function normalizeRepository(value) {
  if (!value) return ""
  return value
    .trim()
    .replace(/^git@github\.com:/, "")
    .replace(/^https?:\/\/(?:[^/@]+@)?github\.com\//, "")
    .replace(/\.git$/, "")
}

function inferPagesProject(urlValue) {
  if (!urlValue) return ""
  try {
    const host = new URL(urlValue).hostname
    const parts = host.split(".")
    const pagesIndex = parts.lastIndexOf("pages")
    if (pagesIndex < 1) return ""
    return parts[pagesIndex - 1]
  } catch {
    return ""
  }
}

function observedBranch() {
  return process.env.CF_PAGES_BRANCH || process.env.GITHUB_REF_NAME || git(["branch", "--show-current"])
}

function observedRepository() {
  return normalizeRepository(process.env.GITHUB_REPOSITORY || git(["config", "--get", "remote.origin.url"]))
}

function observedBuildCommand() {
  const event = process.env.npm_lifecycle_event || ""
  return event ? `npm run ${event}` : ""
}

function observedOutputDirectory() {
  const pkgPath = path.resolve(process.cwd(), "package.json")
  if (!fs.existsSync(pkgPath)) return ""
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
    const event = process.env.npm_lifecycle_event
    const script = event && pkg.scripts ? pkg.scripts[event] : ""
    const match = typeof script === "string" ? script.match(/--outDir\s+([^\s&]+)/) : null
    return match ? match[1] : ""
  } catch {
    return ""
  }
}

async function loadRegisteredDeployment(envKey) {
  const base = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base) hold("Registry URL unavailable", "SUPABASE_URL or VITE_SUPABASE_URL is required for governed deployment preflight.")
  if (!key) hold("Registry authority unavailable", "SUPABASE_SERVICE_ROLE_KEY is required server-side for governed deployment preflight.")

  const headers = { apikey: key, authorization: `Bearer ${key}` }
  const environmentUrl = new URL(`${base.replace(/\/$/, "")}/rest/v1/c3_environment`)
  environmentUrl.searchParams.set("env_key", `eq.${envKey}`)
  environmentUrl.searchParams.set("select", "env_key,system_key,standing,is_active,metadata")

  const envResponse = await fetch(environmentUrl, { headers, signal: AbortSignal.timeout(15000) })
  if (!envResponse.ok) hold("Registry environment read failed", `HTTP ${envResponse.status}`)
  const envRows = await envResponse.json()
  if (!Array.isArray(envRows) || envRows.length !== 1) {
    hold("Deployment environment unresolved", `Expected exactly one ${envKey} row; observed ${Array.isArray(envRows) ? envRows.length : "invalid response"}.`)
  }

  const row = envRows[0]
  if (row.is_active !== true) hold("Deployment environment inactive", envKey)
  if (row.standing !== "governed_environment") hold("Deployment environment standing mismatch", `${envKey}: ${row.standing}`)

  const processKey = row.metadata?.deployment_preflight_process_key
  const identity = row.metadata?.deployment_identity
  if (!processKey || !identity) hold("Registered deployment identity missing", envKey)
  if (row.metadata?.deployment_identity_standing !== "registered_operator_confirmed") {
    hold("Deployment identity standing unresolved", envKey)
  }
  if (identity.env_key !== row.env_key || identity.system_key !== row.system_key) {
    hold("Deployment identity does not match environment identity", envKey)
  }

  const processUrl = new URL(`${base.replace(/\/$/, "")}/rest/v1/system_process_registry`)
  processUrl.searchParams.set("process_key", `eq.${processKey}`)
  processUrl.searchParams.set("select", "process_key,process_status,authority_state,requires_preflight,metadata")

  const processResponse = await fetch(processUrl, { headers, signal: AbortSignal.timeout(15000) })
  if (!processResponse.ok) hold("Deployment preflight process read failed", `HTTP ${processResponse.status}`)
  const processRows = await processResponse.json()
  if (!Array.isArray(processRows) || processRows.length !== 1) hold("Deployment preflight process unresolved", processKey)

  const processRow = processRows[0]
  if (
    processRow.process_status !== "active" ||
    processRow.authority_state !== "operator_confirmed" ||
    processRow.requires_preflight !== true ||
    processRow.metadata?.fail_closed !== true
  ) {
    hold("Deployment preflight process is not operative", processKey)
  }

  return { identity, processKey }
}

async function loadRegisteredProjectDeployment(processKey) {
  const base = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base) hold("Registry URL unavailable", "SUPABASE_URL or VITE_SUPABASE_URL is required for governed deployment preflight.")
  if (!key) hold("Registry authority unavailable", "SUPABASE_SERVICE_ROLE_KEY is required server-side for governed deployment preflight.")

  const headers = { apikey: key, authorization: `Bearer ${key}` }
  const processUrl = new URL(`${base.replace(/\/$/, "")}/rest/v1/system_process_registry`)
  processUrl.searchParams.set("process_key", `eq.${processKey}`)
  processUrl.searchParams.set("select", "process_key,process_status,authority_state,requires_preflight,metadata")

  const processResponse = await fetch(processUrl, { headers, signal: AbortSignal.timeout(15000) })
  if (!processResponse.ok) hold("Deployment identity process read failed", `HTTP ${processResponse.status}`)
  const processRows = await processResponse.json()
  if (!Array.isArray(processRows) || processRows.length !== 1) hold("Deployment identity process unresolved", processKey)

  const processRow = processRows[0]
  if (
    processRow.process_status !== "active" ||
    processRow.authority_state !== "operator_confirmed_registered" ||
    processRow.requires_preflight !== true
  ) {
    hold("Deployment identity process is not operative", processKey)
  }

  const identity = processRow.metadata?.deployment_identity
  if (!identity) hold("Registered deployment identity missing", processKey)

  const gateUrl = new URL(`${base.replace(/\/$/, "")}/rest/v1/system_process_registry`)
  gateUrl.searchParams.set("process_key", "eq.c3_deployment_identity_preflight_v1")
  gateUrl.searchParams.set("select", "process_key,process_status,authority_state,requires_preflight,metadata")
  const gateResponse = await fetch(gateUrl, { headers, signal: AbortSignal.timeout(15000) })
  if (!gateResponse.ok) hold("Deployment preflight process read failed", `HTTP ${gateResponse.status}`)
  const gateRows = await gateResponse.json()
  if (!Array.isArray(gateRows) || gateRows.length !== 1) hold("Deployment preflight process unresolved", "c3_deployment_identity_preflight_v1")
  const gate = gateRows[0]
  if (
    gate.process_status !== "active" ||
    gate.authority_state !== "operator_confirmed" ||
    gate.requires_preflight !== true ||
    gate.metadata?.fail_closed !== true
  ) {
    hold("Deployment preflight process is not operative", "c3_deployment_identity_preflight_v1")
  }

  return { identity, processKey }
}

function compareDeploymentIdentity(expected, observed, processKey) {
  const mismatches = []
  for (const key of Object.keys(expected)) {
    if (!expected[key]) mismatches.push(`${key}: registered value missing`)
    else if (!observed[key]) mismatches.push(`${key}: observed value missing (expected ${expected[key]})`)
    else if (String(observed[key]) !== String(expected[key])) {
      mismatches.push(`${key}: expected ${expected[key]} observed ${observed[key]}`)
    }
  }
  if (mismatches.length) {
    hold("DEPLOYMENT IDENTITY MISMATCH", `${processKey}\n  - ${mismatches.join("\n  - ")}`)
  }
}

async function enforceDeploymentIdentity() {
  const explicitTarget = process.env.C3_DEPLOYMENT_ENV_KEY || ""
  const cloudflarePagesBuild = Boolean(process.env.CF_PAGES)
  const buildEvent = process.env.npm_lifecycle_event || ""

  if (cloudflarePagesBuild && buildEvent === "build:c3field" && !explicitTarget) {
    const processKey = "c3field_pages_deployment_identity_v1"
    const { identity } = await loadRegisteredProjectDeployment(processKey)
    const pagesUrl = process.env.CF_PAGES_URL || ""
    let pagesHost = ""
    try { pagesHost = pagesUrl ? new URL(pagesUrl).hostname : "" } catch {}
    const pagesDomainMatches = Boolean(identity.pages_domain) &&
      (pagesHost === identity.pages_domain || pagesHost.endsWith("." + identity.pages_domain))

    const observed = {
      repository: observedRepository(),
      production_branch: observedBranch(),
      deployment_project: process.env.C3_DEPLOYMENT_PROJECT || (pagesDomainMatches ? identity.deployment_project : inferPagesProject(pagesUrl)),
      build_command: observedBuildCommand(),
      output_directory: observedOutputDirectory(),
      deployment_mode: process.env.WORKERS_CI ? "cloudflare_workers" : "cloudflare_pages",
    }
    const expected = {
      repository: identity.repository,
      production_branch: identity.production_branch,
      deployment_project: identity.deployment_project,
      build_command: identity.build_command,
      output_directory: identity.output_directory,
      deployment_mode: identity.deployment_mode,
    }
    compareDeploymentIdentity(expected, observed, processKey)

    if (!pagesDomainMatches) {
      hold("DEPLOYMENT IDENTITY MISMATCH", `${processKey}\n  - pages_domain: expected *.${identity.pages_domain} observed ${pagesHost || "missing"}`)
    }
    if (identity.deploy_command_allowed === false && process.env.WORKERS_CI) {
      hold("DEPLOYMENT IDENTITY MISMATCH", `${processKey}\n  - deploy_command_allowed: registered false but Workers Build execution detected`)
    }

    console.log(`[deployment-preflight] PASS c3_field -> ${identity.primary_hostname} via ${identity.deployment_project}/${identity.production_branch}`)
    return
  }

  const inferredProject = inferPagesProject(process.env.CF_PAGES_URL)
  const target = explicitTarget || (inferredProject === "c3ops" ? "env_c3ops" : "")
  if (!target) return

  const { identity, processKey } = await loadRegisteredDeployment(target)

  const observed = {
    env_key: target,
    repository: observedRepository(),
    production_branch: observedBranch(),
    deployment_project: process.env.C3_DEPLOYMENT_PROJECT || inferredProject,
    hostname: process.env.C3_DEPLOYMENT_HOSTNAME || "",
    build_command: observedBuildCommand(),
    output_directory: observedOutputDirectory(),
    deployment_mode: process.env.CF_PAGES
      ? "cloudflare_pages"
      : process.env.WORKERS_CI
        ? "cloudflare_workers"
        : "local_or_unknown",
  }

  const expected = {
    env_key: identity.env_key,
    repository: identity.repository,
    production_branch: identity.production_branch,
    deployment_project: identity.deployment_project,
    hostname: identity.hostname,
    build_command: identity.build_command,
    output_directory: identity.output_directory,
    deployment_mode: identity.deployment_mode,
  }

  compareDeploymentIdentity(expected, observed, processKey)

  if (identity.deploy_command_allowed === false && process.env.WORKERS_CI) {
    hold("DEPLOYMENT IDENTITY MISMATCH", `${processKey}\n  - deploy_command_allowed: registered false but Workers Build execution detected`)
  }

  console.log(`[deployment-preflight] PASS ${target} -> ${identity.hostname} via ${identity.deployment_project}/${identity.production_branch}`)
}

console.log("[pages-env] CF_PAGES:", process.env.CF_PAGES ? "present" : "missing")
console.log("[pages-env] CF_PAGES_BRANCH:", process.env.CF_PAGES_BRANCH || "missing")

for (const name of requiredVars) {
  console.log(`[pages-env] ${name}:`, process.env[name] ? "present" : "missing")
}

console.log(
  "[pages-env] RESOLVED_SUPABASE_URL:",
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    ? "env"
    : "public-fallback",
)

enforceDeploymentIdentity().catch((error) => {
  hold("Deployment preflight execution failed", error instanceof Error ? error.message : String(error))
})
