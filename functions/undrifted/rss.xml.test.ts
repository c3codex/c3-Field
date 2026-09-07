import assert from "node:assert/strict"
import test from "node:test"

import { XMLParser } from "fast-xml-parser"

import { renderFeed } from "./rss.xml"

const baseRow = {
  dispatch_key: "drift_report_005_the_wiz_behind_the_curtain",
  title: "The Wiz Behind the Curtain",
  dispatch_body: "Body",
  excerpt: "Excerpt",
  seo_description: "SEO",
  internal_route: "/undrifted/the-wiz-behind-the-curtain",
  article_url: null,
  external_url: null,
  published_at: "2026-08-29T20:32:03.028237+00:00",
  issue_number: "002",
  metadata: {
    series_key: "drift_report",
    series_label: "Drift Report",
  },
}

function parseFeed(xml: string) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" })
  return parser.parse(xml)
}

test("renders RSS 2.0 with self link and real enclosure byte length", () => {
  const xml = renderFeed([
    {
      ...baseRow,
      media_manifest: {
        cover: {
          public_url: "https://example.com/banner.webp",
          byte_size: 218326,
          mime_type: "image/webp",
        },
      },
    },
  ])

  assert.doesNotMatch(xml, /length="0"/)
  const parsed = parseFeed(xml)
  assert.equal(parsed.rss.version, "2.0")
  assert.equal(parsed.rss.channel["atom:link"].href, "https://measuresregistry.com/undrifted/rss.xml")
  assert.equal(parsed.rss.channel.item.enclosure.url, "https://example.com/banner.webp")
  assert.equal(parsed.rss.channel.item.enclosure.length, "218326")
  assert.equal(parsed.rss.channel.item.enclosure.type, "image/webp")
})

test("omits enclosure when media byte length is unavailable", () => {
  const xml = renderFeed([
    {
      ...baseRow,
      media_manifest: {
        banner_url: "https://example.com/banner-without-length.webp",
      },
    },
  ])

  assert.doesNotMatch(xml, /<enclosure\b/)
  assert.doesNotMatch(xml, /length="0"/)
  const parsed = parseFeed(xml)
  assert.equal(parsed.rss.channel.item.title, "The Wiz Behind the Curtain")
})
