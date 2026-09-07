# Buffer Batch 002 - unDrifted Issue 001 Campaign Export v1

Source OAR2: `OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md`

Campaign: `undrifted_issue001_launch_campaign_v1`

Batch key: `buffer_batch_002_undrifted_issue001_campaign_export`

## Standing: `buffer_drafts_created_for_connected_channels` (as of 2026-07-09 Reexecution)

This batch was executed in two passes. **First pass** (this file's original content, preserved below as
history): a payload-complete manifest was prepared but Buffer was never called — no working Buffer
credential was available in that session. **Second pass, same day (Codex):** reexecuted using
`BUFFER_SOCIAL_KEY` from `.dev.vars`, which that session's Buffer MCP connection accepted. **5 live Buffer
drafts now exist** for the 5 connected-channel posts (Instagram ×2, LinkedIn ×2, X thread). Independently
confirmed against Supabase for this document (not just trusting the file): all 5 corresponding
`measures_publication_distribution_asset` rows carry `buffer_export_state: draft_created` with these exact
draft IDs, and `supabase/migrations/20260709202341_record_undrifted_issue001_buffer_live_draft_ids_v1.sql`
exists in the repo.

Live draft IDs:
- Post 001 Instagram: `6a5002b7a9e4eacc31025340`
- Post 002 LinkedIn: `6a5002b8321614183a1f1ff5`
- Post 003 X thread: `6a5002b83c48e2c7b33feafa`
- Post 004 Instagram: `6a5002d83c48e2c7b33feb8c`
- Post 005 LinkedIn: `6a5002d93c48e2c7b33feba4`

Post 006 (YouTube) remains `manifest_prepared` only — Buffer's own API, queried live, returned no
connected YouTube channel on this account.

`system_process_registry.buffer_social_distribution_integration` remains `is_active: false`,
`automation_status: held` throughout both passes. **This is not a scheduled or published batch** — all 5
drafts sit at `dueAt: null` in Buffer, pending operator review and a separate scheduling authorization.

Credential boundary: no raw platform passwords, browser automation, DMs, replies, scraping, or engagement
automation were used.

**Note on `buffer_batch_001`:** an earlier batch (`docs/oar/measures_registry/buffer_batch_001_undrifted_launch_ready_package_v1.md`)
was successfully scheduled live to Buffer on 2026-06-23 (7 posts, real `buffer_id`s recorded in
`docs/oar/measures_registry/oar1_seat_social_urls_fables_dispatch_and_authorize_buffer_batch_001_v1.meta.md`).
This batch's reexecution confirms the same underlying Buffer account/credential family is still usable.

## Connected Channels (live-verified via Buffer API during the 2026-07-09 reexecution)

| Service | Channel name | Channel ID |
|---|---|---|
| Instagram | `measures_registry` | `6a23bfc4c687a22dd467a045` |
| LinkedIn | `measures-registry` / Stephanie Gaffney (personal profile) | `6a23c027c687a22dd467a132` |
| X/Twitter | `measures_c3` | `6a23bff1c687a22dd467a0b3` |

YouTube: **confirmed absent** — Buffer's account/channel API returned no connected YouTube channel. Post
006 cannot be drafted until one is connected.

Facebook remains not connected, not in scope (Facebook Groups distribution is human-mediated per this
campaign's own metadata).

---

*The section below is the original first-pass manifest, preserved as history — the copy/media it
describes is what was actually used to create the 5 live drafts above.*

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

**Gate:** confirmed absent, not just unconfirmed — the 2026-07-09 reexecution queried Buffer's own API live
and it returned no connected YouTube channel on this account. Do not attempt to draft this post in Buffer
until a YouTube channel is connected.

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
