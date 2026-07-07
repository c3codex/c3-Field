---
oar_id: oar2_register_undrifted_issue_model_and_current_issue_renderer_v1
oar_type: OAR2
status: proposed
system: Measures Registry
surface: unDrifted / Issues / Assets
owner: c3 Community Partners DAO LLC
operator: op044
priority: launch
created_for: Claude / Cody execution
depends_on:
  - oar1_establish_registered_asset_file_structure_v1.meta.md
  - oar1_add_asset_registry_and_sidecar_metadata_convention_v1.meta.md
  - oar1_register_undrifted_issue01_launch_assets_v1.meta.md
purpose: register unDrifted Issue model, bind Issue 01 assets, and update /undrifted to render the active issue
core_rule: unDrifted renders the current active issue. Closed issues move to the library. Articles remain registered assets bound to issue objects.
---

# OAR2 — Register unDrifted Issue Model and Current Issue Renderer

## Observed

unDrifted now has registered article and banner assets for Issue 01.

The current asset registry tracks individual assets, but there is not yet an issue-level registry object that groups articles, banners, campaign assets, and publication status into a monthly editorial issue.

The /undrifted page should behave as the active issue renderer.

Issue 01 should update during the launch month as articles are added.

When Issue 02 begins, Issue 01 should move into the unDrifted library as an archived issue.

## Aligned

Create an issue registry model for unDrifted.

Issue objects must support:

- issue_id
- issue_number
- title
- month
- year
- status
- active flag
- issue slug
- article asset ids
- banner asset ids
- campaign asset ids
- publication targets
- open date
- close date
- archive route
- related OAR2
- related OAR1

Create or confirm:

Assets/Issues/unDrifted/README.md
Assets/Issues/unDrifted/issue_registry.md
Assets/Issues/unDrifted/Issue01/issue01.meta.md

Register Issue 01 as the current active issue.

Bind these assets to Issue 01:

- undrifted_issue01_measures_registry_launch_article_v1
- undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1
- undrifted_issue01_measures_registry_launch_banner_v1
- undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1

Update or prepare runtime/page behavior:

- /undrifted renders the current active issue
- /undrifted/library lists archived issues
- /undrifted/issue-01 renders Issue 01 directly
- article cards pull from registered article assets
- banners pull from registered banner metadata / Supabase Storage paths
- CTA routes to /ai-operations-assessment

Prepare optional magazine layout support:

- issue cover
- article cards
- ordered pages
- current issue navigation
- previous / next issue navigation
- archive state

Do not overbuild page-turn animation unless existing dependencies support it cleanly.

If flippable magazine behavior requires a new library, return recommendation instead of installing without approval.

## Routed

1. Create /Assets/Issues/unDrifted if missing.
2. Create /Assets/Issues/unDrifted/Issue01 if missing.
3. Create /Assets/Issues/unDrifted/README.md.
4. Create /Assets/Issues/unDrifted/issue_registry.md.
5. Create /Assets/Issues/unDrifted/Issue01/issue01.meta.md.
6. Register Issue 01 as active.
7. Bind the two registered articles and two registered banners to Issue 01.
8. Update asset registry if issue binding fields are supported.
9. Inspect /undrifted current implementation.
10. Determine whether /undrifted is hardcoded, DB-driven, file-driven, or hybrid.
11. Update /undrifted to render active issue if within current architecture.
12. Add or prepare /undrifted/library route.
13. Add or prepare /undrifted/issue-01 route.
14. Ensure article CTAs route to /ai-operations-assessment.
15. Ensure research article does not collapse into product marketing.
16. Ensure launch article does not overstate NSF/research status.
17. Return OAR1 with implementation details and blockers.

## Issue 01 Metadata Requirements

issue_id: undrifted_issue01
issue_number: 01
title: Issue 01 — AI Isn't Broken. Systems Are.
publication: unDrifted
month: July
year: 2026
status: active
is_active: true
slug: issue-01
current_route: /undrifted
archive_route: /undrifted/issue-01
library_route: /undrifted/library
open_date: 2026-07-07
close_date: pending
article_assets:
  - undrifted_issue01_measures_registry_launch_article_v1
  - undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1
banner_assets:
  - undrifted_issue01_measures_registry_launch_banner_v1
  - undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1
campaign_assets: []
publication_targets:
  - unDrifted
  - Paragraph
  - Buffer
primary_cta_label: Take the AI Operations Assessment
primary_cta_route: /ai-operations-assessment
related_oar2: OAR/OAR2/publication/oar2_register_undrifted_issue_model_and_current_issue_renderer_v1.meta.md
related_oar1: pending
notes: Issue 01 is the active launch issue and registered editorial collection for Measures Registry launch assets.

## Acceptance Criteria

- Issue registry structure exists.
- Issue 01 metadata file exists.
- Issue 01 is registered as active.
- Issue 01 binds the two existing article assets.
- Issue 01 binds the two existing banner assets.
- /undrifted active issue rendering is inspected and updated or blocker is returned.
- /undrifted/library route is created, prepared, or blocker is returned.
- /undrifted/issue-01 route is created, prepared, or blocker is returned.
- CTA routing to /ai-operations-assessment is verified or blocker is returned.
- No article bodies are embedded in this OAR2.
- OAR1 returns proof.

## Return OAR1 With

- issue folders created
- issue registry files created
- Issue 01 metadata path
- bound asset ids
- /undrifted implementation status
- /undrifted/library status
- /undrifted/issue-01 status
- CTA routing status
- magazine layout feasibility
- unresolved blockers
- next recommended OAR2
