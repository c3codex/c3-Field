---
document_type: oar1
authority_level: launch_repair
document_scope: passage_media_seating
title: OAR1 - Seat Obsidian to Marble Passage Video Media Row
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_obsidian_to_marble_passage_video_media_row_v1
---

# OAR1 - Seat Obsidian to Marble Passage Video Media Row

## REPAIR APPLIED

Migration `202606300001_seat_obsidian_to_marble_passage_video_media_row.sql` — applied via `supabase db push`.

Inserted row into `public.measures_media_map`:

| Field | Value |
|---|---|
| `registry_key` | `obsidian_to_marble_passage_video` |
| `encounter_key` | `obsidian_to_marble_passage_video` |
| `campaign_key` | `agents_of_chaos_integrity_governance` |
| `media_role` | `before_the_pathway_obsidian_to_marble_passage_video` |
| `storage_bucket` | `measures-media` |
| `storage_path` | `1before_the_pathway_obsidian_to_marble_passage_v1.mp4` |
| `mime_type` | `video/mp4` |
| `sort_order` | `20` |
| `is_active` | `true` |

URL resolution: `resolveRuntimeMediaUrl` detects `measures-media` bucket → resolves via `VITE_R2_PUBLIC_BASE_URL` env var → `${VITE_R2_PUBLIC_BASE_URL}/1before_the_pathway_obsidian_to_marble_passage_v1.mp4`.

---

## VALIDATION

- Approved video asset identified: `measures-media` R2 bucket / `1before_the_pathway_obsidian_to_marble_passage_v1.mp4`
- Storage path confirmed by operator
- Media row inserted: ✓ (migration applied, validation DO block passed)
- `media_role` matches renderer expectation: ✓ (`encounter.mediaByRole.get("before_the_pathway_obsidian_to_marble_passage_video")` in `ObsidianToMarblePassage`)
- Row active/released: ✓ (`is_active = true`)
- Migration validation DO block: passed (row confirmed present and active post-insert)
- No unrelated mutations: ✓ (single INSERT + DO validation only)

## PENDING BROWSER QA

- Passage video renders on `obsidian_to_marble_passage_video` surface
- Continue button advances to `map_integrity_governance`
- Full post-assessment flow: contact capture → report → passage video → MAP encounter

Requires `VITE_R2_PUBLIC_BASE_URL` env var set in Cloudflare Pages for video URL to resolve in production.

## HELD

- No changes to assessment, report, MAP, Stripe, legal, or email behavior
- No changes to source code
