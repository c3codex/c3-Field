// Governed Paragraph publish path for unDrifted dispatches.
//
// Per oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1: publish a
// registered, pending_publication measures_publication_dispatch row to the live unDrifted
// Paragraph publication, then report back exactly what to write into the dispatch row and
// Publication Registry (this script does NOT write to Supabase itself — publish is
// irreversible and one-directional; the DB sync is a separate, reviewable step).
//
// Safety:
// - Verifies the API key resolves to the expected publication slug before posting anything.
// - Defaults sendNewsletter to false always — a newsletter blast is a materially bigger,
//   unsendable action than publishing a post, and is not implied by "publish this article."
// - Never invents a Paragraph URL — only reports what the API actually returns.
//
// Usage:
//   node scripts/publish-undrifted-dispatch-to-paragraph.cjs <dispatch_key> [--send-newsletter]

require("dotenv").config({ path: ".dev.vars" })

const API_BASE = "https://public.api.paragraph.com/api/v1"
const EXPECTED_PUBLICATION_SLUG = "undrifted"

const apiKey = process.env.PARAGRAPH_PUBLISH_KEY
if (!apiKey) {
  throw new Error("PARAGRAPH_PUBLISH_KEY missing (expected in .dev.vars)")
}

const dispatchKey = process.argv[2]
if (!dispatchKey) {
  throw new Error("Usage: node scripts/publish-undrifted-dispatch-to-paragraph.cjs <dispatch_key> [--send-newsletter]")
}
const sendNewsletter = process.argv.includes("--send-newsletter")

async function paragraphFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(`Paragraph API ${path} failed (${res.status}): ${JSON.stringify(body)}`)
  }
  return body
}

// Dispatches this script knows how to publish. Sourced directly from the registered article
// asset bodies — never authored inline here.
const DISPATCHES = {
  editors_letter_issue001_v1: {
    title: "From the Editor",
    subtitle: null,
    slug: "from-the-editor",
    imageUrl: "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/editors_note_banner.webp",
    assetPath: "Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_editors_letter_article_v1.md",
  },
}

function extractMarkdownBody(fileContents) {
  const frontmatterEnd = fileContents.indexOf("\n---", 4)
  if (!fileContents.startsWith("---") || frontmatterEnd === -1) {
    throw new Error("Could not locate end of frontmatter block in asset file")
  }
  return fileContents.slice(frontmatterEnd + 4).trim()
}

async function run() {
  const dispatch = DISPATCHES[dispatchKey]
  if (!dispatch) {
    throw new Error(`No known dispatch mapping for "${dispatchKey}". Known: ${Object.keys(DISPATCHES).join(", ")}`)
  }

  const me = await paragraphFetch("/me")
  if (me.slug !== EXPECTED_PUBLICATION_SLUG) {
    throw new Error(
      `Refusing to publish: API key resolves to publication slug "${me.slug}", expected "${EXPECTED_PUBLICATION_SLUG}".`,
    )
  }

  const fs = require("fs")
  const path = require("path")
  const fileContents = fs.readFileSync(path.join(__dirname, "..", dispatch.assetPath), "utf8")
  const markdown = extractMarkdownBody(fileContents)

  const result = await paragraphFetch("/posts", {
    method: "POST",
    body: JSON.stringify({
      title: dispatch.title,
      markdown,
      subtitle: dispatch.subtitle ?? undefined,
      imageUrl: dispatch.imageUrl ?? undefined,
      slug: dispatch.slug,
      status: "published",
      sendNewsletter,
    }),
  })

  console.log(
    JSON.stringify(
      {
        published: true,
        dispatch_key: dispatchKey,
        paragraph_publication_slug: me.slug,
        paragraph_post_id: result.id,
        paragraph_status: result.status,
        sendNewsletter,
        next_step: `Update measures_publication_dispatch (dispatch_key='${dispatchKey}') with status='published', article_url/external_url, published_at, and metadata.paragraph_post_id='${result.id}'. This script does not write to Supabase.`,
      },
      null,
      2,
    ),
  )
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
