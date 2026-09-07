---
document_type: oar1
authority_level: emergency_operational
document_scope: launch_cycle_001_publication_boundary_incident
title: OAR1 - Immediately Contain Codex Governance Leak and Restore Publication Boundary
operator: op044
system: codex
executor: Cody
date: 2026-07-13
responds_to: docs/oar/measures_registry/oar2_immediately_contain_codex_governance_leak_and_restore_publication_boundary_v1.meta.md
incident_class: internal_governance_content_exposed_to_public_projection
status: contained
---

# OAR1 - Publication Boundary Incident Containment

## Disposition

**CONTAINED**

The unsafe Field Findings public projection was replaced with a registered public derivative. The original full asset was preserved unchanged as an internal research record. Paragraph was updated in place. Buffer drafts from the prior release run were deleted. Production now renders with zero incident markers on the affected public routes.

## Containment Actions

- Seated emergency OAR2:
  `docs/oar/measures_registry/oar2_immediately_contain_codex_governance_leak_and_restore_publication_boundary_v1.meta.md`
- Preserved original internal record unchanged:
  `Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_field_findings_2026_w28_article_v1.md`
- Original SHA256:
  `FF491C9478AE3D2B6FA9FD59FED7608ED29B1C37BF2CC2D53234195AD1D95806`
- Created public derivative:
  `Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md`
- Repointed Measures Registry projection to the public derivative:
  `src/measures_registry/encounter_renderer/publications/undriftedLaunchCycle001Projection.ts`
- Updated Paragraph publishing script so future Field Findings publication uses the public derivative:
  `scripts/publish-undrifted-dispatch-to-paragraph.cjs`
- Updated Publication Record 001 frontmatter/body to identify the public derivative and internal research record:
  `docs/_source/codex/publications/publication_record_001_field_findings_2026_w28.meta.md`

Containment commit:

`4ac8b9e` - `Contain Launch Cycle 001 publication boundary leak`

Push:

`96e7d69..4ac8b9e  measures -> measures`

## Paragraph

The existing Field Findings Paragraph post was updated in place using the Paragraph API:

- post ID: `8UdwP2yt8pw9FacBWIbw`
- URL: `https://paragraph.com/@undrifted/field-findings-2026-w28`
- method: `PUT /api/v1/posts/8UdwP2yt8pw9FacBWIbw`
- result: `{"success":true}`
- newsletter send: `false`

Public fetch verification returned HTTP 200 and zero incident markers for:

- `https://paragraph.com/@undrifted/field-findings-2026-w28`
- `https://paragraph.com/@undrifted/ai-agents-are-not-entering-empty-systems`

## Buffer

The prior unDrifted Facebook drafts were deleted:

- `6a54ede947830b281a71e8cd`
- `6a54edead6677965d318facb`

Post-delete verification against Buffer returned:

- matching deleted draft IDs: `0`
- remaining draft count for unDrifted Facebook: `0`

No Buffer drafts, schedules, approvals, or sends remain active from this incident package.

## Registry Evidence

Migration created and applied:

`supabase/migrations/20260713152952_contain_launch_cycle_001_publication_boundary_incident_v1.sql`

Readback confirmed:

- `launch_cycle_001__paragraph__publication_001` now records `public_derivative_asset_path`;
- Field Findings `media_manifest.canonical_asset_path` points to `field_findings_2026_w28_public_article_v2.md`;
- Paragraph update status is recorded as `updated_in_place_with_public_derivative`;
- Response 001 is marked `audited_no_incident_markers_detected`.

## Verification

Local checks:

- `npm run build:registry` passed.
- Public derivative marker scan: pass, zero incident markers.
- Projection marker scan: pass, zero incident markers.
- Local built preview: Field Findings and Response routes rendered article bodies with zero incident markers.

Production checks:

First clean production poll:

- `2026-07-13T15:34:27Z`
- `https://measuresregistry.com/undrifted/field-findings-2026-w28`
- HTTP 200
- public body present
- zero incident markers

Final production pass at `2026-07-13T15:34:50.266Z`:

| URL | Status | H1 | Incident markers |
|---|---:|---|---:|
| `https://measuresregistry.com/undrifted` | 200 | `AI ISN'T BROKEN. SYSTEMS ARE.` | 0 |
| `https://measuresregistry.com/undrifted/field-findings-2026-w28` | 200 | `Field Findings 2026-W28` | 0 |
| `https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems` | 200 | `AI Agents Are Not Entering Empty Systems` | 0 |

## Held / Follow-Up

Release derivatives remain held until operator review approves the new public derivative package for social use.

`Assets/Registry/asset_registry.md` was already dirty before this incident with a larger uncommitted Launch Cycle asset-registry section. To avoid committing unrelated local work, this emergency commit did not stage that file; the standing correction is recorded in Publication Record 001 and the Supabase dispatch metadata.

Machine-readable evidence:

`docs/oar/measures_registry/publication_boundary_incident_containment_evidence_v1.json`
