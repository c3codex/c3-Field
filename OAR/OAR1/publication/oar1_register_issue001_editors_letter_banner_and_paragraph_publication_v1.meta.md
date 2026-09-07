---
document_type: oar1
authority_level: proof
document_scope: publication_release
title: OAR1 - Register Issue 001 Editors Letter Banner and Paragraph Publication
closes: OAR/OAR2/publication/oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Register Issue 001 Editor's Letter, Banner, and Paragraph Publication

## Summary

The Editor's Letter is registered, banner-bound, and **live on Paragraph** — published after explicit operator confirmation mid-execution, using a newly-built (and now checked-in) Paragraph publish integration. Publication Dispatch and Publication Registry are both synchronized with the real result. One correction happened along the way: the initially-identified "Codexstone" banner was wrong; the operator pointed to the actual asset (`editors_note_banner.webp`) partway through, and everything was rebound before anything was published.

---

## 1. Registered Article Asset

```
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_editors_letter_article_v1.md
```

Registered verbatim from the operator-supplied document, including the Acknowledgment and "Continue the Conversation" sections — no content added, altered, or invented. `issue_id` normalized to the file registry's established `undrifted_issue01` (not this OAR2's own `undrifted_issue001` spelling) to avoid adding a fifth naming variant to an inconsistency a prior audit OAR2 already flagged. `status` progressed `ready_for_publication` → `published` once the real Paragraph URL was confirmed (§5).

## 2. Banner — Registration, With a Mid-Course Correction

**Initial identification was wrong, corrected before publishing.** OBSERVED said "the Codexstone banner image has been approved and exists in the registered media bucket." I searched Supabase Storage for "codexstone" and found `official_codexstone_seal.webp` — already registered, already used elsewhere (`marble_payment_confirmation_seal`) — and initially bound the sidecar to it. The operator then supplied the actual filename, `editors_note_banner.webp`, uploaded to the same bucket at `2026-07-08 00:14:10 UTC` (i.e. during this session) and **not yet registered anywhere**. I corrected the sidecar and registered this binary properly:

```
Assets/Banners/unDrifted/Issue01/undrifted_issue01_editors_letter_codexstone_banner_v1.meta.md
```
(filename retains "codexstone" only for path continuity with the article's pre-written `banner_asset_id` reference — the bound binary is `editors_note_banner.webp`.)

New `measures_media_map` row created (migration `20260708002619`): `media_role: 'editorial_banner'`, bound to `measures-registry/editors_note_banner.webp`. This *is* a first-time registration, not a duplicate alias — unlike the Codexstone seal, this binary had no prior media_role mapping at all, so creating this row is exactly what Routed §2 asked for. **Media asset identifier returned: `editorial_banner`** (`measures_media_map`), object path `measures-registry/editors_note_banner.webp`.

## 3. Asset Registry Update

`Assets/Registry/asset_registry.md` — two new rows (article, banner), both bound to `issue_id: undrifted_issue01`. The existing entry for the still-unpublished cover story article was also annotated: the operator has now supplied its full draft twice (once implicitly alongside this OAR2, and it remains available) — noted as available for a follow-up OAR2, not applied here (out of this OAR2's scope, which explicitly disallows altering other article content without approval).

## 4. Publication Dispatch

Row created (migration `20260708002743`), then corrected to carry the full dispatch body rather than an abbreviated placeholder (migration `20260708002825`) — the initial insert cut a corner by pointing at "see the file asset" instead of storing real content; fixed before publishing so `dispatch_body` is a genuine, usable source, not a dead pointer.

`dispatch_key: editors_letter_issue001_v1`, `issue_number: ISSUE 001`, `issue_role: editors_letter` (in `metadata`), `title: From the Editor`. Initial `status: pending_publication`, `article_url: null` — correctly not fabricated.

## 5. Paragraph Publication — Performed, With Explicit Confirmation

**This did happen, after a stop-and-ask.** Per this OAR2's own executor role, "publish to Paragraph" is nominally authorized — but no Paragraph integration existed anywhere in this repo, and this is an irreversible, externally-visible action. I stopped and asked before attempting it. The operator confirmed **"Yes, publish it now"** and separately clarified that `PARAGRAPH_PUBLISH_KEY` exists in `.dev.vars` (I had only checked `.env`, where it's absent).

Built and ran `scripts/publish-undrifted-dispatch-to-paragraph.cjs` (checked in as the reusable, governed publish path for this and future dispatches — not a throwaway script):
- Researched Paragraph's actual API from their published docs (`paragraph.com/docs/api-reference/posts/create-a-new-post`, `.../me/get-authenticated-publication`) — no guessing.
- **Safety check before posting anything:** called `GET /api/v1/me` and confirmed the API key resolves to publication slug `undrifted` — refused-by-design to proceed if it resolved to anything else.
- Read the markdown body directly from the registered article asset file (never duplicated inline in the script).
- Posted with `status: "published"`, `imageUrl` pointing at the registered banner's public Supabase URL, and **`sendNewsletter` hardcoded to `false`** — a newsletter blast is a materially bigger, unsendable-once-sent action than publishing a post, and "publish this article" does not imply "email every subscriber," so I did not do that without separately asking.

**Result — real, not invented:**
- Paragraph post id: `sDE8Tey2cLZ30wOP5BXb`
- Live URL: `https://paragraph.com/@undrifted/from-the-editor` — fetched and independently confirmed reachable, correct title ("From the Editor"), correct author (Stephanie Joanne Gaffney), published 2026-07-08.
- Newsletter: **not sent.**
- Banner: the API accepted and re-hosted the image (confirmed via `GET /posts/:id` returning a Paragraph-CDN `imageUrl`); a post-publish fetch of the live page's rendered markdown didn't show an inline image tag in this pass's read — worth a manual visual check, not treated here as a failure since the API-side confirmation is solid.

## 6. Publication Registry / Dispatch Synchronization

Both performed (migration `20260708003402`), using only the real, API-returned values:
- `measures_publication_dispatch`: `status: 'published'`, `article_url`/`external_url` set to the live URL, `external_platform: 'paragraph'`, `published_at` set from Paragraph's own timestamp, `metadata.paragraph_post_id` recorded.
- `measures_publication_registry.metadata`: new namespaced `editors_letter` object recording `published: true`, `dispatch_key`, `article_url`, `published_at`, `asset_id`. Added as a new field, not folded into `issue_record.section_sequence` — deliberately, so this doesn't silently change what `featured_article_set` regenerates to, which would be a live-rendering/content-authority decision this OAR2 didn't ask for and Publication Encounter Profile changes are explicitly disallowed for.

**Encounter Projection regeneration: not performed, and not required this pass.** No current region in the Publication Encounter Profile consumes an "editor's letter" field (see §7) — regenerating would copy data nothing reads yet.

## 7. Issue Ordering — Verified, Gap Reported, Profile Not Touched

Requested sequence: Cover → Editor's Letter → Contents → Cover Story. Checked the live `encounter_profile.region_order` (seated by the prior finalize OAR2): `[masthead, issue_rail, cover_story, assessment_feature, featured_articles, role_call, next_issue, subscribe, footer]`. **There is no `editors_letter` or `contents` region in the current profile at all.** Per this OAR2's own restriction ("Executor may not: modify Publication Encounter Profile"), I did not add one. The Editor's Letter is now fully published and registered, but has no slot on `/undrifted` to render into yet — same category of gap as the cover story's non-clickable state from the prior OAR2, and should be resolved together in a follow-up OAR2 that's explicitly scoped to touch the Encounter Profile.

## 8. Publication Standing Report

| Article | Registered | Dispatched | Published | Paragraph URL |
|---|---|---|---|---|
| From the Editor | Yes | Yes | **Yes (this pass)** | `paragraph.com/@undrifted/from-the-editor` |
| AI Isn't Broken. Systems Are. | Yes (`registered_draft`, short form) | Yes (`draft`) | No | none |
| Computational Systems Governance / NSF pitch | Yes (file asset only) | No | No | none |
| Agents With Keys | Yes | Yes | Yes | `paragraph.com/@undrifted/agents-with-keys` |
| Fables & Myths | Yes | Yes | Yes | `paragraph.com/@undrifted/fables-and-myths` |
| Structural Drift | Yes | Yes | Yes | `paragraph.com/@undrifted/structural-drift` |
| Agents of Chaos | Yes | Yes | Yes | `paragraph.com/@undrifted/agents-of-chaos` |

Unchanged from the prior OAR1's finding: two bodyless stub dispatch rows (`measures_registry_dispatch_v1`, `undrifted_dispatch_v1`) remain in the table, `published` with no `article_url`, not touched.

---

## Blockers

1. **No Issue-composition slot for the Editor's Letter** (§7) — needs a follow-up OAR2 explicitly scoped to extend the Publication Encounter Profile.
2. **Cover story still short-form** — full draft has now been supplied twice; a follow-up OAR2 should apply it and decide whether to publish.
3. **Banner visual confirmation recommended** — API-side evidence says the image attached correctly; a human glance at the live URL is worth doing since this pass's automated page-fetch didn't surface an inline image tag.
4. **`sendNewsletter` was deliberately not triggered** — if a newsletter dispatch to subscribers is wanted for this piece, that's a separate, explicit decision, not implied by today's publish.

## Files Changed / Created

```
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_editors_letter_article_v1.md   (new)
Assets/Banners/unDrifted/Issue01/undrifted_issue01_editors_letter_codexstone_banner_v1.meta.md (new, corrected mid-execution)
Assets/Registry/asset_registry.md                                                              (updated)
scripts/publish-undrifted-dispatch-to-paragraph.cjs                                            (new — reusable Paragraph publish path)
supabase/migrations/20260708002619_register_undrifted_editors_note_banner_media_role.sql       (new)
supabase/migrations/20260708002743_register_undrifted_editors_letter_pending_dispatch.sql      (new)
supabase/migrations/20260708002825_correct_undrifted_editors_letter_dispatch_body_full_text.sql (new)
supabase/migrations/20260708003402_sync_undrifted_editors_letter_published_to_paragraph.sql    (new)
```

## Next Recommended OAR2

Extend the Publication Encounter Profile with an `editors_letter` region (and decide on "contents," if still wanted) so the now-published letter actually renders on `/undrifted` — bundled with resolving the cover story's content depth and the still-open question of whether `featured_article_set` should be revisited given four now-published-but-unfeatured pieces (Agents of Chaos, Structural Drift) plus this new one.
