---
document_type: oar1
authority_level: proof
document_scope: campaign_derivatives
title: OAR1 - Add Campaign Derivative Assets and Human AI Role Attribution
closes: OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Add Campaign Derivative Assets and Human AI Role Attribution

## Summary

Closed the remaining seam in the Campaign Registry: seated `measures_publication_derivative_asset` so the governed lifecycle is now `Publication Asset → Derivative Asset → Campaign Asset → Distribution Asset → Evidence`. Added Human/AI actor attribution (constrained to exactly those two classes) to all four campaign-layer tables, backfilled it accurately onto every existing row, linked all 6 existing Campaign Assets to a new Derivative Asset, merged the 5-step optics observation chain into all four tables, and recorded Conversation Threads' architectural standing (`working_surface`, `authority: none`). Registry only — no renderer, Buffer automation, scheduling, or UI touched, exactly as instructed.

---

## 1. Derivative Asset Model (ROUTED §1)

`measures_publication_derivative_asset` seated with every required minimum field, plus `optics`, actor attribution (§2), and `generation_source` (§5) built in at creation since this is a new table. `derivative_type` is constrained by a `check` to the 13 listed types (excerpt, pull_quote, summary, carousel_copy, reel_script, video_short, video_long, audio_narration, transcript, thumbnail, hero, caption, alt_text). Every `publication_asset_id` points at exactly one canonical Publication Asset — verified against `asset_registry.md`, `measures_publication_dispatch`, and `measures_publication_issue_page`, no duplication. RLS: service_role only, matching the rest of the campaign layer.

## 2. Human / AI Actor Attribution (ROUTED §2)

Added `created_by_actor_class`, `created_by_actor_key`, `approved_by_actor_class`, `approved_by_actor_key`, `review_status` to all four campaign-layer tables (`measures_publication_campaign`, `_campaign_asset`, `_distribution_asset`, and built into `_derivative_asset` at creation). `actor_class` columns are `check`-constrained to exactly `'Human'` or `'AI'` (nullable otherwise) — no other actor system (Operator, Profile, c3_key, Role Profile) was invented, per explicit instruction not to. Every row across all four tables — the 7 new derivatives and the 17 rows carried over from the prior campaign OAR2 — was set to `created_by_actor_class: AI, created_by_actor_key: claude_sonnet_5, approved_by_actor_class: Human, approved_by_actor_key: op044, review_status: oar2_authorized`. This is a factual backfill, not a retroactive fiction: the AI executed both this and the prior OAR2, and the Human operator authored/authorized both OAR2 documents that instruct the row creation — that relationship is the actual approval instrument in this system, matching the OAR2 (authority) / OAR1 (proof) pattern already used everywhere else.

## 3. Campaign Asset Update (ROUTED §3)

`measures_publication_campaign_asset.campaign_key` renamed to `campaign_id` (values unchanged — same FK target, same data) for literal field-name parity with `distribution_asset.campaign_id`, which already used that name. Added `derivative_asset_id` (FK → `derivative_asset.derivative_key`). All 6 existing Campaign Assets updated with a `derivative_asset_id` link:

| Campaign Asset | Derivative |
|---|---|
| Cover Story Hero | `undrifted_ai_isnt_broken_landing_banner_v1_hero_v1` |
| Cover Story Quote | `undrifted_issue01_ai_isnt_broken_systems_are_article_v1_pull_quote_v1` |
| Editor's Letter Thumbnail | `undrifted_issue01_editors_letter_codexstone_banner_v1_thumbnail_v1` |
| Dispatches Carousel | `agents_with_keys_dispatch_v1_carousel_copy_v1` (primary) |
| Issue 001 Launch Digest | `undrifted_issue01_ai_isnt_broken_systems_are_article_v1_summary_v1` |
| Assessment Hero | `undrifted_issue01_page06_launch_encounter_hero_v1` |

**Disclosed compromise**: "Dispatches Carousel" is a 2-slide composite (Agents With Keys + Fables and Myths), but a Campaign Asset holds exactly one `derivative_asset_id` and a Derivative Asset holds exactly one `publication_asset_id`, per §1's cardinality rule. Rather than fabricate a false single source or silently drop the second slide, I created a second `carousel_copy` derivative (`fables_and_myths_dispatch_v1_carousel_copy_v1`) and recorded it in `metadata.additional_derivative_asset_ids` on the Campaign Asset row, with an explicit `multi_derivative_note` explaining why. Flagged here rather than hidden.

## 4. Distribution Asset Update (ROUTED §4)

No schema change beyond actor attribution — Distribution Assets continue to reference Campaign Assets only (`campaign_asset_id`, unchanged from the prior OAR2). No `derivative_asset_id` was added to `distribution_asset`, since that would duplicate the derivative reference already held one level up by the Campaign Asset, which §4 explicitly warns against ("Do not duplicate derivatives").

## 5. Derivative Generation Standing (ROUTED §5)

`generation_source` column added to `derivative_asset` (provenance: `human_authored | ai_assisted | ai_generated | human_edited | human_approved`), left `null` on all 7 rows since nothing has been generated yet — populating it now would misrepresent provenance that doesn't exist. All 7 rows are `generation_status: 'pending'`, `approval_status: 'pending'`, `release_state: 'held'`. No generation workflow was implemented, per explicit instruction.

## 6. Optics Preparation (ROUTED §6)

Merged `observes_chain: [publication_asset, derivative_asset, campaign_asset, distribution_asset, evidence]` into the existing `optics` jsonb on all four tables (new derivatives seeded with it directly; the 17 pre-existing campaign/campaign_asset/distribution_asset rows updated via `optics || jsonb_build_object(...)`, preserving their prior `prepared`/`tracks_individuals`/`attached_to` fields rather than overwriting them). No individuals are modeled as primary objects anywhere in this schema — `tracks_individuals: false` throughout. No analytics implementation exists.

## 7. Thread Standing (ROUTED §7)

Recorded in `system_process_registry` (`conversation_threads_working_surface_standing_v1`, `process_family: system_architecture`), following the same schema pattern already used for the Buffer/Paragraph integration processes: `metadata.status: working_surface`, `metadata.authority: none`, with a note that Registry remains authority until a governed Role Workbench exists. No implementation performed — this is a standing record only, as instructed.

---

## Validation

| Item | Result |
|---|---|
| Derivative Asset model | `measures_publication_derivative_asset` seated, 7 rows, all `generation_status: pending` |
| Campaign updates | `campaign_key` → `campaign_id` rename confirmed; attribution columns confirmed on `measures_publication_campaign` |
| Distribution updates | Attribution columns confirmed on all 10 rows (10/10 attributed) |
| Human / AI attribution | All 4 tables constrained to `Human`/`AI`; all 24 rows (7 derivatives + 1 campaign + 6 campaign assets + 10 distribution assets) attributed |
| Optics updates | `observes_chain` confirmed present in `optics` on the campaign row (verified via direct query); same merge applied to campaign_asset/distribution_asset/derivative_asset |
| Thread standing | 1 row confirmed in `system_process_registry` |
| Migration files | 5 files, listed below |
| No duplicated authority | Every derivative/campaign-asset/distribution-asset row holds pointers only, never content |
| No duplicated media | Confirmed — no storage uploads, no asset_registry.md content rows added |
| No Buffer scheduling | Confirmed — `buffer_social_distribution_integration` still `automation_status: held`, untouched |
| No renderer changes | Confirmed — no files under `src/measures_registry/encounter_renderer/` touched, no `dist-registry/` rebuild needed |
| Security advisors | Ran `get_advisors(type=security)` post-migration — no findings for any of the four campaign-layer tables |

---

## Blockers

None. The one disclosed compromise (§3, Dispatches Carousel's second slide) is a documented modeling decision, not a blocker.

## Files Changed

```
Assets/Registry/asset_registry.md                                                                    (Derivative Asset Layer section added)
supabase/migrations/20260708125753_seat_undrifted_publication_derivative_asset_model.sql
supabase/migrations/20260708125804_extend_undrifted_campaign_model_with_derivative_links_and_actor_attribution.sql
supabase/migrations/20260708125829_register_undrifted_issue001_derivative_assets.sql
supabase/migrations/20260708125903_link_undrifted_campaign_assets_to_derivatives_and_backfill_attribution.sql
supabase/migrations/20260708125913_record_conversation_thread_architectural_standing.sql
```

## Next Recommended OAR2

A derivative-generation OAR2 to actually produce content for the 7 `pending` derivatives (real quote crops, carousel copy text, hero images) — still registry-governed, still requiring explicit generation_source provenance per row, and still separate from any Buffer/Paragraph scheduling decision.

## Deploy Note

DB changes are already live (Supabase migrations apply directly). The only file change here (`asset_registry.md`) plus this OAR1/OAR2 pair are local-only pending commit — no renderer or `dist-registry/` changes exist in this OAR2, so nothing new needs pushing to `origin/measures` beyond the registry file and the OAR pair themselves.
