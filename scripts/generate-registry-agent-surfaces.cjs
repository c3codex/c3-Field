const fs = require("fs")
const path = require("path")

const outDir = process.argv[2] || "dist-registry"
const baseUrl = "https://measuresregistry.com"

const publicNav = [
  ["Measures Registry", "/"],
  ["Connect", "/connect"],
  ["Assess the Environment", "/ai-operations-assessment"],
  ["publish_undrifted", "/publish-undrifted"],
  ["unDrifted", "/undrifted"],
]

const publicRouteFiles = [
  "index.html",
  "home/index.html",
  "connect/index.html",
  "publish-undrifted/index.html",
  "ai-operations-assessment/index.html",
  "undrifted/index.html",
  "undrifted/field-findings-2026-w28/index.html",
  "undrifted/ai-agents-are-not-entering-empty-systems/index.html",
  "undrifted/the-boundary-problem/index.html",
  "undrifted/environmentally-enabled/index.html",
  "undrifted/the-pair-over-time/index.html",
  "undrifted/who-ordered-all-this-compute/index.html",
  "privacy/index.html",
  "terms/index.html",
]

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace("</head>", `    ${replacement}\n  </head>`)
}

function extract(html, pattern, label, filePath) {
  const match = html.match(pattern)
  if (!match || !match[1]?.trim()) {
    throw new Error(`${filePath} missing ${label}`)
  }
  return match[1].trim()
}

function normalizeRootHead(html) {
  const title = "Measures Registry | Computational Systems Governance"
  const description = "Measures Registry provides Computational Systems Governance for governed systems and relational operations."
  let out = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
  out = replaceTag(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${description}" />`)
  out = replaceTag(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="${title}" />`)
  out = replaceTag(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="${description}" />`)
  out = replaceTag(out, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:title" content="${title}" />`)
  out = replaceTag(out, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:description" content="${description}" />`)
  return out
}

function fallbackMarkup({ title, description, canonical }) {
  const nav = publicNav
    .map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`)
    .join(" · ")

  return `<main data-public-static-representation="true" style="max-width:72rem;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.5">
      <header>
        <p>Measures Registry</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </header>
      <nav aria-label="Public pages">${nav}</nav>
      <p><a href="${escapeHtml(canonical)}">Canonical public page</a></p>
    </main>`
}

function injectStaticRepresentation(html, filePath) {
  const title = extract(html, /<title>(.*?)<\/title>/s, "title", filePath)
  const description = extract(
    html,
    /<meta\s+name="description"\s+content="([^"]+)"\s*\/>/s,
    "meta description",
    filePath,
  )
  const canonical = extract(
    html,
    /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/>/s,
    "canonical URL",
    filePath,
  )

  if (!canonical.startsWith(baseUrl)) {
    throw new Error(`${filePath} has unexpected canonical URL: ${canonical}`)
  }

  if (!/<div\s+id="root"\s*>\s*<\/div>/s.test(html)) {
    throw new Error(`${filePath} does not contain the expected empty React root`)
  }

  return html.replace(
    /<div\s+id="root"\s*>\s*<\/div>/s,
    `<div id="root">\n    ${fallbackMarkup({ title, description, canonical })}\n    </div>`,
  )
}

function main() {
  const rootIndex = path.join(outDir, "index.html")
  if (!fs.existsSync(rootIndex)) throw new Error(`${rootIndex} missing`)
  fs.writeFileSync(rootIndex, normalizeRootHead(fs.readFileSync(rootIndex, "utf8")))

  for (const relative of publicRouteFiles) {
    const filePath = path.join(outDir, relative)
    if (!fs.existsSync(filePath)) throw new Error(`required public route missing: ${relative}`)
    const html = fs.readFileSync(filePath, "utf8")
    const rendered = injectStaticRepresentation(html, relative)
    if (!rendered.includes('data-public-static-representation="true"')) {
      throw new Error(`required public route lacks static representation: ${relative}`)
    }
    fs.writeFileSync(filePath, rendered)
  }

  console.log(`Generated agent-readable static representations for ${publicRouteFiles.length} governed public routes.`)
}

main()
