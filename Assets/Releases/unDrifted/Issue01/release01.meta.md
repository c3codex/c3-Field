---
release_id: undrifted_issue01_release01
issue_id: undrifted_issue01
active_issue: true
approved_article_asset_ids: []
approved_banner_asset_ids: []
publication_state: pending_content_authority_decision
archive_state: not_archived
renderer_eligibility: false
db_sync_status: not_synced
db_sync_path: scripts/sync-undrifted-publication-release.cjs
related_oar2: OAR/OAR2/publication/oar2_establish_undrifted_publication_release_pipeline_v1.meta.md
related_oar1: pending
notes: >
  Shell release for Issue 01. Two candidate article/banner asset sets exist —
  the live-published DB set ("Agents With Keys", "Fables & Myths") and the
  newly file-registered launch set (Measures Registry launch article, NSF
  Computational Systems Governance pitch article, and their two banners).
  Neither is approved here. See issue01_content_authority_decision.meta.md
  for the decision surface. This release cannot advance past
  pending_content_authority_decision, and renderer_eligibility stays false,
  until an operator records an explicit decision there.
---

# Release 01 — unDrifted Issue 01

This file is the Publication Release object for Issue 01. It resolves (or, for now, explicitly does not yet resolve) the seam between the registered Issue object and DB-rendered publication state:

```
Issue (undrifted_issue01) -> Publication Release (this file) -> Registered Assets -> Publication State -> FREE
```

## Current Resolution State

| Field | Value |
|---|---|
| active_issue | true — undrifted_issue01 is the only issue and is active |
| approved_article_asset_ids | none — pending decision |
| approved_banner_asset_ids | none — pending decision |
| publication_state | `pending_content_authority_decision` |
| renderer_eligibility | `false` — FREE must not be pointed at this release's content yet |
| db_sync_status | `not_synced` |

## Candidate Asset Sets (informational only — neither is approved)

**Live in DB today** (`measures_encounter_def.metadata.featured_article_set` for `encounter_key = 'undrifted'`, confirmed via direct query 2026-07-07):
- "Agents With Keys" — published, `https://paragraph.com/@undrifted/agents-with-keys`
- "Fables & Myths" — published, `https://paragraph.com/@undrifted/fables-and-myths`

**Registered this session, not yet synced to DB**:
- `undrifted_issue01_measures_registry_launch_article_v1` (article, registered)
- `undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1` (article, registered)
- `undrifted_issue01_measures_registry_launch_banner_v1` (banner, registered — binary in Supabase Storage bucket `measures-registry`)
- `undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1` (banner, registered — binary in Supabase Storage bucket `measures-registry`)

## Next Step

An operator must record a decision in `issue01_content_authority_decision.meta.md` (keep live / replace / append / split into a separate issue). Once recorded, update `approved_article_asset_ids` / `approved_banner_asset_ids` / `publication_state: approved` here, then run `scripts/sync-undrifted-publication-release.cjs` to write the governed DB sync.
