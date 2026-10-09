const fs = require("fs")
const path = require("path")

const outDir = process.argv[2] || "dist"
const routePath = "/community-potential"
const canonical = "https://c3field.online/community-potential"
const title = "Community Potential | c3 Community Partners"
const description = "A Systems Model for Participation, Contribution, Creation, and Shared Value. Public white paper from c3 Community Partners."
const related = "https://measuresregistry.com/governed-environments"
const livingCircuitPath = "/living-circuit"
const livingCircuitCanonical = "https://c3field.online/living-circuit"
const livingCircuitTitle = "The Living Circuit | c3 Community Partners"
const livingCircuitDescription = "Encounter the living circuit: how community can connect, contribute, create, resolve, retain, and carry value forward."

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", "    " + replacement + "\n  </head>")
}

function staticBody() {
  return `<main data-public-static-representation="true" style="max-width:72rem;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6">
    <article>
      <p>c3 Community Partners · Public White Paper · Public Release 1.0</p>
      <h1>Community Potential</h1>
      <p><strong>A Systems Model for Participation, Contribution, Creation, and Shared Value</strong></p>
      <p>Large amounts of public funding, private capital, institutional capacity, labor, property, knowledge, and technology move through structures that do not consistently improve the lives of the people who rely on them. The problem is not only scarcity. It is also organization.</p>
      <h2>Central thesis</h2>
      <p>Potential should not remain unrealized simply because the system around it cannot organize it.</p>
      <h2>Core model</h2>
      <p>Connect → Contribute → Create</p>
      <h2>People and Systems</h2>
      <p>One begins with people. The other begins with computation. Both begin with the environment.</p>
      <p><a href="${related}">Related white paper: Governed Environments</a></p>
      <p>Canonical citation: Community Potential. c3 Community Partners DAO, LLC. Public Release 1.0. September 2026.</p>
    </article>
  </main>`
}

function livingCircuitStaticBody() {
  return `<main data-public-static-representation="true" style="max-width:72rem;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6">
    <article>
      <p>c3 Field · Public Orientation Encounter</p>
      <h1>It’s the living circuit.</h1>
      <p>Community already contains people, relationships, knowledge, resources, work, places, and possibility. The problem is that those things often cannot find each other, move together, retain what they learn, or carry resolved value forward.</p>
      <h2>The circuit</h2>
      <p>The 3×3 is the field. CARs / 322 are the encounters moving through it. The Six are the universal relational conditions. NUGs are services assembled from those conditions. Resolution turns encounter into usable relational state. Resolved Relational Resonance lets recurring structure become recognizable without flattening the individual encounters. Current moves through that resolved relational structure. CURRENT retains what the environment has actually accrued. Baby Chazz navigates the circuit without owning it.</p>
      <h2>Connect → Contribute → Create</h2>
      <p>Connect creates relational passage. Contribute moves something through an encounter. Create is what becomes possible when those relations can actually resolve and persist.</p>
      <p><strong>That is the living circuit that empowers community.</strong></p>
      <p><a href="/connect">Connect →</a></p>
    </article>
  </main>`
}

function main() {
  const templatePath = path.join(outDir, "index.html")
  if (!fs.existsSync(templatePath)) throw new Error("c3 build index.html missing")
  const templateHtml = fs.readFileSync(templatePath, "utf8")
  let html = templateHtml
  html = html.replace(/<title>.*?<\/title>/s, "<title>" + title + "</title>")
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, '<meta name="description" content="' + description + '" />')
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, '<link rel="canonical" href="' + canonical + '" />')
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, '<meta property="og:title" content="' + title + '" />')
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, '<meta property="og:description" content="' + description + '" />')
  html = replaceTag(html, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/s, '<meta property="og:type" content="article" />')
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, '<meta property="og:url" content="' + canonical + '" />')
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, '<meta name="twitter:title" content="' + title + '" />')
  html = replaceTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, '<meta name="twitter:description" content="' + description + '" />')
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"TechArticle",
    headline:"Community Potential",
    alternativeHeadline:"A Systems Model for Participation, Contribution, Creation, and Shared Value",
    description,
    url:canonical,
    datePublished:"2026-09",
    version:"1.0",
    publisher:{"@type":"Organization",name:"c3 Community Partners DAO, LLC",url:"https://c3field.online"},
    about:["community development","participation","contribution","shared value","community systems"],
    isPartOf:{"@type":"CreativeWorkSeries",name:"People and Systems"},
    citation:related
  }
  html = html.replace("</head>", '    <script type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>\n  </head>')
  html = html.replace(/<div\s+id="root"\s*>\s*<\/div>/s, '<div id="root">\n' + staticBody() + '\n</div>')
  const routeDir = path.join(outDir, "community-potential")
  fs.mkdirSync(routeDir, {recursive:true})
  fs.writeFileSync(path.join(routeDir, "index.html"), html)
  let livingHtml = templateHtml
  livingHtml = livingHtml.replace(/<title>.*?<\/title>/s, "<title>" + livingCircuitTitle + "</title>")
  livingHtml = replaceTag(livingHtml, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, '<meta name="description" content="' + livingCircuitDescription + '" />')
  livingHtml = replaceTag(livingHtml, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, '<link rel="canonical" href="' + livingCircuitCanonical + '" />')
  livingHtml = replaceTag(livingHtml, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, '<meta property="og:title" content="' + livingCircuitTitle + '" />')
  livingHtml = replaceTag(livingHtml, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, '<meta property="og:description" content="' + livingCircuitDescription + '" />')
  livingHtml = replaceTag(livingHtml, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/s, '<meta property="og:type" content="website" />')
  livingHtml = replaceTag(livingHtml, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, '<meta property="og:url" content="' + livingCircuitCanonical + '" />')
  livingHtml = replaceTag(livingHtml, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, '<meta name="twitter:title" content="' + livingCircuitTitle + '" />')
  livingHtml = replaceTag(livingHtml, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, '<meta name="twitter:description" content="' + livingCircuitDescription + '" />')
  livingHtml = livingHtml.replace(/<div\s+id="root"\s*>\s*<\/div>/s, '<div id="root">\n' + livingCircuitStaticBody() + '\n</div>')
  const livingCircuitDir = path.join(outDir, "living-circuit")
  fs.mkdirSync(livingCircuitDir, {recursive:true})
  fs.writeFileSync(path.join(livingCircuitDir, "index.html"), livingHtml)
  fs.writeFileSync(path.join(outDir, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://c3field.online/sitemap.xml\n")
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://c3field.online/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n  <url><loc>' + canonical + '</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n  <url><loc>' + livingCircuitCanonical + '</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n</urlset>\n')
  fs.writeFileSync(path.join(outDir, "llms.txt"), '# c3 Community Partners\n\n> c3 Community Partners creates structure and conditions for participation through Connect, Contribute, Create.\n\n## Public Pages\n\n- [c3 Field](https://c3field.online/): Public c3 Community entry.\n- [Community Potential](' + canonical + '): Public Release 1.0 white paper on participation, contribution, creation, shared value, and community return.\n- [The Living Circuit](' + livingCircuitCanonical + '): Public orientation encounter for the c3 Field living circuit.\n- [Related: Governed Environments](' + related + '): Measures Registry white paper on operational systems governance for AI and computational action.\n\n## People and Systems\n\nOne begins with people. The other begins with computation. Both begin with the environment.\n')
  const redirectsPath = path.join(outDir, "_redirects")
  const existing = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, "utf8") : ""
  let routeRedirects = existing
  if (!routeRedirects.includes("/living-circuit")) {
    routeRedirects = "/living-circuit /living-circuit/index.html 200\n/living-circuit/ /living-circuit/index.html 200\n" + routeRedirects
  }
  if (!routeRedirects.includes("/community-potential")) {
    routeRedirects = "/community-potential /community-potential/index.html 200\n/community-potential/ /community-potential/index.html 200\n" + routeRedirects
  }
  fs.writeFileSync(redirectsPath, routeRedirects)
  console.log("Generated c3 Community Potential and Living Circuit discovery surfaces.")
}

main()
