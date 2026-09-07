# OAR1: Register unDrifted Issue 01 Launch Assets
**Closes:** OAR/OAR2/publication/oar2_register_undrifted_issue01_launch_assets_v1.meta.md
**Depends on:** oar1_establish_registered_asset_file_structure_v1.meta.md, oar1_add_asset_registry_and_sidecar_metadata_convention_v1.meta.md
**Branch:** measures
**Date:** 2026-07-07

---

## Status by Item

| # | Acceptance Criterion | Status |
|---|-----------------------|--------|
| 1 | Both article assets exist | SEATED |
| 2 | Both article assets include frontmatter | SEATED |
| 3 | Both article bodies are complete | SEATED |
| 4 | Both banner metadata sidecars exist | SEATED |
| 5 | Asset registry is updated | SEATED |
| 6 | Article assets are registered | SEATED |
| 7 | Banner asset status accurately reflects binary presence | SEATED — `registered` (binaries confirmed in Supabase Storage) |
| 8 | No article bodies embedded beyond this authority transfer | CONFIRMED |
| 9 | OAR1 identifies exact next step for publication integration | SEATED (below) |

---

## Article Files Created

```
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_measures_registry_launch_article_v1.md
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md
```

Both created with full required frontmatter (asset_id, asset_type, title, slug, version, status: registered, issue_or_campaign, publication_targets, banner_asset_id, banner_path, cta_label, cta_route, related_oar2, related_oar1: pending, created_by, updated_by, notes) and complete article bodies exactly as specified in the OAR2, including the required language ("governable systems," "responsible AI deployment requires governable systems," "AI isn't broken. Systems are.") and without substituting "governed systems" anywhere.

`related_oar1` in both files' frontmatter is left as `pending`, matching the OAR2's literal required frontmatter — update in a follow-up pass if the convention should point to this OAR1 instead.

## Banner Metadata Sidecars Created

```
Assets/Banners/unDrifted/Issue01/undrifted_issue01_measures_registry_launch_banner_v1.meta.md
Assets/Banners/unDrifted/Issue01/undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.meta.md
```

Both created with required metadata (asset_id, asset_type, title, slug, version, status, issue_or_campaign, file_path, related_article_asset_id, related_oar2, related_oar1: pending, publication_targets, notes).

## Banner Binary Presence / Absence

**Present — in Supabase Storage, not in the local repo tree.** Initial directory listing of `Assets/Banners/unDrifted/Issue01/` found no local `.webp` files. The operator then clarified the binaries live in a Supabase bucket. Queried `storage.objects` in project `zfihrspxvennjzazxcbj` (Measures Codex) and confirmed both binaries exist in bucket `measures-registry`:

| object_path | size | mimetype | uploaded_at |
|---|---|---|---|
| `undrifted_issue01_measures_registry_launch_banner_v1.webp` | 133,386 B | image/webp | 2026-07-07T17:47:45Z |
| `undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.webp` | 117,680 B | image/webp | 2026-07-07T17:48:14Z |

Both sidecars updated to `status: registered` with new `storage_bucket` / `storage_object_path` / `storage_size_bytes` / `storage_mimetype` / `storage_uploaded_at` fields recording the canonical binary location. No binary was fabricated or copied into the local repo — the sidecar `file_path` remains the repo-relative convention path, while `storage_object_path` is the actual resolved location.

## Asset Registry Updates

`Assets/Registry/asset_registry.md` updated:
- Both article rows: `status: draft → registered`, `related_oar2` updated to `oar2_register_undrifted_issue01_launch_assets_v1`.
- Both banner rows: `status: draft → registered`, `related_oar2` updated to `oar2_register_undrifted_issue01_launch_assets_v1`, `file_path` column replaced with the resolved Supabase Storage location.

## Exact Paths (Summary)

```
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_measures_registry_launch_article_v1.md
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md
Assets/Banners/unDrifted/Issue01/undrifted_issue01_measures_registry_launch_banner_v1.meta.md
Assets/Banners/unDrifted/Issue01/undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.meta.md
Assets/Registry/asset_registry.md (updated)
```

## Unresolved Blockers

- No local repo copy of either banner `.webp` exists — both binaries live only in the Supabase `measures-registry` storage bucket. If the runtime/build expects banners to resolve from a local `Assets/Banners/...` path, a follow-up step is needed to either fetch a local copy or confirm the render path reads from Supabase Storage directly.
- `related_oar1: pending` in both article frontmatter blocks and both banner sidecars was left as-is per the OAR2's literal spec — confirm whether it should instead be back-filled to reference this OAR1.
- Per OAR2 scope: Paragraph publication and Buffer scheduling were explicitly **not** performed in this pass.

## Next Recommended OAR2

An OAR2 to begin Paragraph publication integration and Buffer campaign scheduling now that both articles and both banners are fully registered — including confirming whether the site/publication runtime resolves banner images from Supabase Storage directly or requires a local/CDN copy.
