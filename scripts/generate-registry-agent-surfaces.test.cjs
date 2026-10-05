const { test } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const { spawnSync } = require("node:child_process")

const script = path.join(__dirname, "generate-registry-agent-surfaces.cjs")
const routes = ["index.html", "home/index.html", "connect/index.html", "publish-undrifted/index.html", "ai-operations-assessment/index.html", "undrifted/index.html", "undrifted/field-findings-2026-w28/index.html", "undrifted/ai-agents-are-not-entering-empty-systems/index.html", "undrifted/the-boundary-problem/index.html", "undrifted/environmentally-enabled/index.html", "undrifted/the-pair-over-time/index.html", "undrifted/who-ordered-all-this-compute/index.html", "privacy/index.html", "terms/index.html"]
const publicationCanonical = "https://undrifted.measuresregistry.com/"
const registeredAuthority = { source: "measures_registry", routes: { "/undrifted": { unit_key: "undrifted_publication_landing", route_authority: "registry", canonical_url: publicationCanonical } } }

function run(canonical, authority) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "registry-agent-canonical-test-"))
  try {
    for (const relative of routes) {
      const file = path.join(dir, relative)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      const href = relative === "undrifted/index.html" ? canonical : "https://measuresregistry.com/"
      fs.writeFileSync(file, `<html><head><title>Registered title</title><meta name="description" content="Registered description" /><link rel="canonical" href="${href}" /></head><body><div id="root"></div></body></html>`)
    }
    if (authority) fs.writeFileSync(path.join(dir, "_registry-route-authority.json"), JSON.stringify(authority))
    const result = spawnSync(process.execPath, [script, dir], { encoding: "utf8", windowsHide: true })
    return { ...result, html: fs.readFileSync(path.join(dir, "undrifted/index.html"), "utf8") }
  } finally {
    assert.equal(path.dirname(fs.realpathSync(dir)).toLowerCase(), fs.realpathSync(os.tmpdir()).toLowerCase())
    assert.ok(path.basename(dir).startsWith("registry-agent-canonical-test-"))
    fs.rmSync(dir, { recursive: true })
  }
}

test("existing Measures Registry origin builds without a publication authority exception", () => {
  const r = run("https://measuresregistry.com/undrifted")
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.html, /data-public-static-representation="true"/)
})

test("exact registered publication canonical survives generation unchanged", () => {
  const r = run(publicationCanonical, registeredAuthority)
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.html, /data-public-static-representation="true"/)
  assert.ok(r.html.includes(`<link rel="canonical" href="${publicationCanonical}" />`))
  assert.ok(r.html.includes(`<a href="${publicationCanonical}">Canonical public page</a>`))
})

test("publication host remains held without generated Registry authority", () => {
  const r = run(publicationCanonical)
  assert.equal(r.status, 1)
  assert.match(r.stderr, /unexpected canonical URL/)
})

test("authority must match the exact generated route and canonical", () => {
  const wrongCanonical = structuredClone(registeredAuthority)
  wrongCanonical.routes["/undrifted"].canonical_url = "https://undrifted.measuresregistry.com/other"
  const wrongRoute = { source: "measures_registry", routes: { "/other": registeredAuthority.routes["/undrifted"] } }
  for (const authority of [wrongCanonical, wrongRoute]) {
    const r = run(publicationCanonical, authority)
    assert.equal(r.status, 1)
    assert.match(r.stderr, /unexpected canonical URL/)
  }
})

test("missing or ungoverned authority fails closed", () => {
  for (const mutate of [a => { a.source = "frontend" }, a => { a.routes["/undrifted"].unit_key = null }, a => { a.routes["/undrifted"].route_authority = "unverified" }]) {
    const authority = structuredClone(registeredAuthority)
    mutate(authority)
    const r = run(publicationCanonical, authority)
    assert.equal(r.status, 1)
    assert.match(r.stderr, /unexpected canonical URL/)
  }
})

test("registered external canonical still requires HTTPS", () => {
  const authority = structuredClone(registeredAuthority)
  const canonical = "http://undrifted.measuresregistry.com/"
  authority.routes["/undrifted"].canonical_url = canonical
  const r = run(canonical, authority)
  assert.equal(r.status, 1)
  assert.match(r.stderr, /unexpected canonical URL/)
})

test("a hostname sharing only the Measures Registry string prefix is rejected", () => {
  for (const canonical of ["https://measuresregistry.com.example.invalid/", "https://measuresregistry.com@example.invalid/"]) {
    const r = run(canonical)
    assert.equal(r.status, 1)
    assert.match(r.stderr, /unexpected canonical URL/)
  }
})
