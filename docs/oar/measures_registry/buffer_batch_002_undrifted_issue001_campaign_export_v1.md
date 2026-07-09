# Buffer Batch 002 - unDrifted Issue 001 Campaign Export v1

Source OAR2: `OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md`

Campaign: `undrifted_issue001_launch_campaign_v1`

Batch key: `buffer_batch_002_undrifted_issue001_campaign_export`

## 2026-07-09 Live Reexecution Addendum

Standing after reexecution: `buffer_drafts_created_for_connected_channels`.

The initial standing below is preserved as the first-pass history. Reexecution used `BUFFER_SOCIAL_KEY`
from `.dev.vars` and created Buffer drafts for the 5 connected channels returned by Buffer (Instagram,
LinkedIn, X). `system_process_registry.buffer_social_distribution_integration` remains `is_active: false`,
`automation_status: held`. This is not a scheduled or published batch.

Live draft IDs:
- Post 001 Instagram: `6a5002b7a9e4eacc31025340`
- Post 002 LinkedIn: `6a5002b8321614183a1f1ff5`
- Post 003 X thread: `6a5002b83c48e2c7b33feafa`
- Post 004 Instagram: `6a5002d83c48e2c7b33feb8c`
- Post 005 LinkedIn: `6a5002d93c48e2c7b33feba4`

Post 006 YouTube remains `manifest_prepared` only because Buffer returned no connected YouTube channel.

Standing: `operator_review_required` — Buffer was **not** called. No `BUFFER_SOCIAL_KEY` exists in this
environment's `.env`, and no Buffer API integration code exists anywhere in this repo's `functions/`,
`scripts/`, or `src/` trees. `system_process_registry.buffer_social_distribution_integration` is
`is_active: false`, `automation_status: held`. This manifest is a payload-complete, Buffer-ready export
for the operator to paste into Buffer manually (or feed to whatever tool previously scheduled
`buffer_batch_001` — see Note below), not a live-scheduled batch.

Credential boundary: no raw platform passwords, Buffer API keys, browser automation, DMs, replies,
scraping, or engagement automation.

**Note on `buffer_batch_001`:** an earlier batch (`docs/oar/measures_registry/buffer_batch_001_undrifted_launch_ready_package_v1.md`)
*was* successfully scheduled live to Buffer on 2026-06-23 (7 posts, real `buffer_id`s recorded in
`docs/oar/measures_registry/oar1_seat_social_urls_fables_dispatch_and_authorize_buffer_batch_001_v1.meta.md`),
through a different execution context that had a working Buffer credential. That credential/tool is not
available in this session — this pass could not verify whether it's still valid.

## Connected Channels (confirmed active, per `oar1_seat_social_urls_fables_dispatch_and_authorize_buffer_batch_001_v1`)

- X: `@measures_c3`
- Instagram: `measures_registry`
- LinkedIn profile: `measures-registry`
- YouTube: **not confirmed as a connected Buffer channel anywhere in this system's records.** One post
  below (Post 006) targets YouTube — operator must confirm a channel connection exists before it can be
  drafted in Buffer at all.

Facebook remains not connected, not in scope (Facebook Groups distribution is human-mediated per this
campaign's own metadata).

## Posts in This Batch

| # | Distribution Asset Key | Platform | Source |
|---|---|---|---|
| 001 | `undrifted_issue001_da_cover_story_instagram_v1` | Instagram | Cover Story intro video |
| 002 | `undrifted_issue001_da_cover_story_quote_linkedin_v1` | LinkedIn | Cover Story summary |
| 003 | `undrifted_issue001_da_cover_story_quote_x_v1` | X (thread, 3 posts) | Cover Story |
| 004 | `undrifted_issue001_da_dispatches_instagram_v1` | Instagram (carousel) | Agents With Keys + Fables and Myths |
| 005 | `undrifted_issue001_da_dispatches_linkedin_v1` | LinkedIn | Agents With Keys + Fables and Myths |
| 006 | `undrifted_issue001_da_assessment_youtube_v1` | YouTube (Short) | Assessment orientation cut |

---

## Post 001 — Cover Story (Instagram)

Distribution Asset: `undrifted_issue001_da_cover_story_instagram_v1`
Campaign Asset: `undrifted_issue001_ca_cover_story_intro_video_v1`

Media: `ai_isnt_broken_intro.mp4`
Media URL: `https://media.c3field.online/ai_isnt_broken_intro.mp4`
Link (in bio): `https://paragraph.com/@undrifted/ai-isnt-broken-systems-are`
CTA: `Take the AI Operations Assessment`

```text
AI Isn't Broken. Systems Are.

This is not an intelligence problem. It is a system problem. Watch the full piece — link in bio.

#AIGovernance #ResponsibleAI #SystemsThinking #unDrifted
```

Platform note: real video post using the existing intro hook video as-is (96 chars body, within Instagram norms).

---

## Post 002 — Cover Story Summary (LinkedIn)

Distribution Asset: `undrifted_issue001_da_cover_story_quote_linkedin_v1`
Campaign Asset: `undrifted_issue001_ca_cover_story_linkedin_summary_v1`

Media: `ai_isnt_broken_landing.webp`
Media URL: `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/ai_isnt_broken_landing.webp`
Alt text: A silhouetted figure stands before a glowing blue keyhole-shaped threshold at the center of a towering triangular archway, flanked by illuminated pillars marked with eight-pointed stars, in a dark reflective hall.
Link: `https://paragraph.com/@undrifted/ai-isnt-broken-systems-are`
CTA: `Take the AI Operations Assessment`

```text
New from unDrifted: "AI Isn't Broken. Systems Are."

Most AI deployment failures aren't model failures — they're structural ones. Fragmented processes, unclear ownership, and competing sources of truth don't disappear when you add intelligence; they become more visible.

Our thesis: responsible AI deployment requires governable systems.

Read the full piece, then measure your own environment with the AI Operations Assessment.
```

---

## Post 003 — Cover Story Thread (X)

Distribution Asset: `undrifted_issue001_da_cover_story_quote_x_v1`
Campaign Asset: `undrifted_issue001_ca_cover_story_x_thread_v1`

Media: none (text-only thread)
Link: `https://paragraph.com/@undrifted/ai-isnt-broken-systems-are`
CTA: `Take the AI Operations Assessment`
Hashtags: `#AIGovernance #unDrifted`

```text
1/ AI isn't broken. Systems are. That's the question behind Issue 001 of unDrifted. What if the biggest constraint on AI isn't the model—but the environment it's deployed into?

2/ AI inherits its operational environment. If ownership is unclear... if processes drift... if authority is fragmented... AI doesn't solve those problems. It exposes them.

3/ Our thesis: responsible AI deployment requires governable systems. Read the cover story of unDrifted Issue 001, then measure your own environment through the AI Operations Assessment.
```

Platform note: verify each of the 3 segments against X's live character limit before drafting — this
manifest does not re-truncate the copy already approved in `oar2_resolve_launch_critical_derivatives_v1`.

---

## Post 004 — Dispatches Carousel (Instagram)

Distribution Asset: `undrifted_issue001_da_dispatches_instagram_v1`
Campaign Asset: `undrifted_issue001_ca_dispatches_carousel_v1`

Media (2-slide carousel):
- Slide 1: `agents_with_keys.webp` — `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/agents_with_keys.webp`
- Slide 2: `fables_and_myths.webp` — `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/fables_and_myths.webp`

Link: `https://paragraph.com/@undrifted/agents-with-keys`
CTA: `Read the Dispatches`
Hashtags: `#AIGovernance #unDrifted #SystemsThinking`

```text
Dispatches — Issue 001

Slide 1 — AGENTS WITH KEYS — Systems Without Governance. Capability is not authority. Structure prevents drift.

Slide 2 — FABLES AND MYTHS — Institutional Narrative and Policy Risk. Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk.
```

---

## Post 005 — Dispatches Summary (LinkedIn)

Distribution Asset: `undrifted_issue001_da_dispatches_linkedin_v1`
Campaign Asset: `undrifted_issue001_ca_dispatches_carousel_v1`

Media:
- `agents_with_keys.webp` — `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/agents_with_keys.webp`
- `fables_and_myths.webp` — `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/fables_and_myths.webp`

Link: `https://paragraph.com/@undrifted/agents-with-keys`
CTA: `Read the Dispatches`

```text
Two Dispatches from unDrifted Issue 001

Two new field dispatches from unDrifted: "Agents With Keys" examines why capability is not authority, and how structure prevents drift. "Fables and Myths" looks at Anthropic, Fables 5, Mythos 5, and the U.S. government — and how institutional narrative about AI capability becomes policy risk when it substitutes for control.
```

---

## Post 006 — Assessment Short (YouTube) — channel unconfirmed

Distribution Asset: `undrifted_issue001_da_assessment_youtube_v1`
Campaign Asset: `undrifted_issue001_ca_assessment_video_v1`

Media: `undrifted_issue001_assessment_short_cut_v1.mp4` (26.871s real cut, original audio intact)
Media URL: `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/campaign_derivatives/undrifted_issue001_assessment_short_cut_v1.mp4`
Link: `https://measuresregistry.com/ai-operations-assessment`
CTA: `Take the AI Operations Assessment`

```text
What Does It Mean to Measure a Governable System?

Your assessment evaluation has identified how your institution's AI-facing environment is currently holding structure. AI systems do not operate in isolation — they interact with workflows, roles, approvals, data, outputs, and decisions. When those systems expand inside an unstructured environment, AI acceleration can amplify instability already present in the institution. Measures Registry exists to address that issue.
```

**Gate:** no YouTube channel connection is confirmed anywhere in this system's records (`buffer_batch_001`'s
connected-channel list covers only X, Instagram, LinkedIn). Do not attempt to draft this post in Buffer
until a YouTube channel connection is confirmed by the operator.

---

## Assets Deliberately Not Included in This Batch

| Distribution Asset | Platform | Reason |
|---|---|---|
| `undrifted_issue001_da_assessment_website_v1` | website | Not a Buffer-postable platform — already-live website feature |
| `undrifted_issue001_da_cover_story_website_v1` | website | Same |
| `undrifted_issue001_da_editors_letter_email_v1` | email | Newsletter, not a Buffer-postable platform |
| `undrifted_issue001_da_launch_digest_email_v1` | email | Same |
| `undrifted_issue001_da_editors_letter_paragraph_v1` | paragraph | `buffer_export_ready: false`; underlying dispatch already published independently at paragraph.com |
| `undrifted_issue001_da_issue_promotion_instagram_reel_v1` | instagram (reel) | Script only — no reel video file has been produced yet (`platform_notes` on the row says so explicitly). Not fabricated here. |

## No-Claims Boundary

Checked package copy avoids: Buy, Pay, Mint, Certify, Convert, Claim c3 Key, Join DAO, Get Recognized,
Enter Marble, Reserve certification. No post claims payment, wallet, c3 Key issuance, SRC binding,
certification, conversion, DAO, permission, recognition, distribution standing, or Marble readiness.
