---
release_id: undrifted_issue01_release01
issue_id: undrifted_issue01
active_issue: true
approved_article_asset_ids: []
approved_banner_asset_ids: []
publication_state: approved
archive_state: not_archived
renderer_eligibility: false
db_sync_status: not_synced
db_sync_path: scripts/sync-undrifted-publication-release.cjs
related_oar2: OAR/OAR2/launch/oar2_resolve_issue001_publication_authority_gate_v1.meta.md
related_oar1: OAR/OAR1/launch/oar1_resolve_issue001_publication_authority_gate_v1.meta.md
notes: >
  Publication authority resolved 2026-07-08. Operator confirmed Option A
  (issue01_content_authority_decision.meta.md): keep the live "Agents With
  Keys" / "Fables & Myths" dispatches unchanged — approved_article_asset_ids
  stays empty by design, matching Option A's own documented meaning
  ("approved to change nothing"). The two file-registered-but-unpublished
  articles (Measures Registry launch article, NSF Computational Systems
  Governance pitch article) remain registered, unsynced, not part of this
  gate. renderer_eligibility and db_sync_status are deliberately left
  untouched — this OAR2 resolved publication authority only, not the
  downstream renderer/sync gates, which remain separate decisions.
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
| approved_article_asset_ids | `[]` by design — Option A ("approved to change nothing") |
| approved_banner_asset_ids | `[]` by design — same |
| publication_state | `approved` (resolved 2026-07-08, `oar2_resolve_issue001_publication_authority_gate_v1`) |
| renderer_eligibility | `false` — deliberately untouched by the authority-gate resolution; a separate future decision |
| db_sync_status | `not_synced` — deliberately untouched; nothing needs syncing since Option A changes nothing |

## Candidate Asset Sets (historical record — Option A resolved, no change made)

**Live in DB today, unchanged** (`measures_encounter_def.metadata.featured_article_set` for `encounter_key = 'undrifted'`, reconfirmed via direct query 2026-07-08):
- "Agents With Keys" — published, `https://paragraph.com/@undrifted/agents-with-keys`
- "Fables & Myths" — published, `https://paragraph.com/@undrifted/fables-and-myths`

**Registered this session, still not synced to DB, still not part of this gate**:
- `undrifted_issue01_measures_registry_launch_article_v1` (article, registered)
- `undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1` (article, registered)
- `undrifted_issue01_measures_registry_launch_banner_v1` (banner, registered — binary in Supabase Storage bucket `measures-registry`)
- `undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1` (banner, registered — binary in Supabase Storage bucket `measures-registry`)

Separately from this decision's original scope, Issue 001 has since gained a full Cover Story ("AI Isn't Broken. Systems Are.") and Editor's Letter, both governed through the Issue Page / dispatch model built later this session — see `measures_publication_issue_page`.

## Next Step

Resolved. `renderer_eligibility` and `db_sync_status` remain separate, un-actioned gates — no sync is needed under Option A, since it changes nothing. A future decision could still revisit Options B/C/D if the operator wants to feature the two unpublished articles later.
