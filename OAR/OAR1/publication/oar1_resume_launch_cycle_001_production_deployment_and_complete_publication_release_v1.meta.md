---
document_type: oar1
authority_level: operational
document_scope: launch_cycle_001_production_recovery_and_release_completion
title: OAR1 - Resume Launch Cycle 001 Production Deployment and Complete Publication Release
operator: op044
system: codex
executor: Cody
date: 2026-07-13
responds_to: docs/oar/measures_registry/oar2_resume_launch_cycle_001_production_deployment_and_complete_publication_release_v1.meta.md
closes_prior: OAR/OAR1/publication/oar1_publish_launch_cycle_001_articles_and_project_undrifted_release_v1.meta.md
status: completed_with_endpoint_holds
---

# OAR1 - Launch Cycle 001 Production Recovery and Publication Release

## Disposition

Production recovery, Measures Registry article verification, Paragraph publication, registry evidence seating, and unDrifted Facebook Buffer draft preparation are complete.

Final disposition:

**COMPLETED WITH ENDPOINT HOLDS**

Held endpoints are limited to derivatives that would require new editorial copy, approved shortening, or approved media. No content was invented.

## Production Recovery

Root cause: Cloudflare Pages cloned commit `fc06a19dc274925f73420df0da594d57a5ff1a98` from branch `measures`, but the Launch Cycle 001 registered Markdown article assets were still untracked locally and absent from the remote clone. The production build failed when Rollup could not resolve the raw Markdown imports used by the unDrifted projection.

Correction:

- committed the registered Launch Cycle 001 article assets;
- added explicit article redirect rules before the SPA catch-all;
- surfaced Launch Cycle 001 / Issue 01 on `/undrifted`;
- pushed fix commit `32cfaf2ef373b8fc719e80eef5173230e6cdc676`;
- pushed no-op deploy trigger commit `e70f945`.

Deployment configuration evidence from the operator-provided Pages log:

- production branch: `measures`;
- build command: `npm run build:registry`;
- output directory: `dist-registry`;
- failed cloned commit: `fc06a19dc274925f73420df0da594d57a5ff1a98`.

Cloudflare deployment identifier: not available from the non-Wrangler verification surface used after operator clarification that Wrangler is not part of this workflow.

## Production Verification

Fresh browser verification with service workers blocked passed on desktop `1440x1100` and mobile `390x844`.

| URL | Status | Final URL | H1 | Result |
|---|---:|---|---|---|
| `https://measuresregistry.com/undrifted` | 200 | `https://measuresregistry.com/undrifted/` | `AI ISN'T BROKEN. SYSTEMS ARE.` | Launch Cycle 001 / Issue 01 visible; both article links present |
| `https://measuresregistry.com/undrifted/field-findings-2026-w28` | 200 | `https://measuresregistry.com/undrifted/field-findings-2026-w28/` | `Field Findings 2026-W28` | canonical body present |
| `https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems` | 200 | `https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems/` | `AI Agents Are Not Entering Empty Systems` | canonical body present; links to Field Findings |

Canonical URLs resolved as expected for all three routes. The stale-bundle condition was absent.

## Paragraph Publication

Publication sequence was preserved: Field Findings was verified live before Response publication.

| Publication | Measures Registry URL | Paragraph URL | Paragraph post ID | Status |
|---|---|---|---|---|
| Field Findings 2026-W28 | `https://measuresregistry.com/undrifted/field-findings-2026-w28` | `https://paragraph.com/@undrifted/field-findings-2026-w28` | `8UdwP2yt8pw9FacBWIbw` | published |
| AI Agents Are Not Entering Empty Systems | `https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems` | `https://paragraph.com/@undrifted/ai-agents-are-not-entering-empty-systems` | `SRdBfqs0Xi4jr44T4r8o` | published |

Paragraph public fetch returned HTTP 200 for both posts. Titles and canonical body text were present.

Evidence variance: the Measures Registry Response route links to Field Findings. The live Paragraph Response page did not expose a Field Findings link during fetch verification, so this is recorded in registry evidence rather than silently upgraded.

## Registry Evidence

Migration created and applied:

- `supabase/migrations/20260713134829_record_launch_cycle_001_paragraph_publication_evidence_v1.sql`

Readback from `public.measures_publication_dispatch` confirmed:

- both Launch Cycle 001 dispatch keys exist;
- `status = published`;
- `external_platform = paragraph`;
- Paragraph post IDs seated in `metadata.paragraph_post_id`;
- `execution_mode = direct_paragraph_api_publish`;
- Measures Registry route URLs preserved in metadata.

## Buffer Endpoint Matrix

Endpoint verification resolved the authorized channels without duplicate Facebook or X channel IDs.

| Identity | Platform | Credential | Channel ID | Public account | Disposition |
|---|---|---|---|---|---|
| Measures Registry | YouTube | `BUFFER_SOCIAL_KEY` | `6a54740a80cc80cdcaa976d9` | Measures Registry | not_applicable |
| Measures Registry | Instagram | `BUFFER_SOCIAL_KEY` | `6a23bfc4c687a22dd467a045` | measures_registry | held_missing_approved_derivative |
| Measures Registry | X | `BUFFER_SOCIAL_KEY` | `6a23bff1c687a22dd467a0b3` | measures_c3 | held_missing_approved_derivative |
| Measures Registry | Facebook | `BUFFER_PUB2_KEY` | `6a54734280cc80cdcaa9743b` | Measures Registry | held_missing_approved_derivative |
| unDrifted | Facebook | `BUFFER_PUB2_KEY` | `6a54761280cc80cdcaa97c9a` | UnDrifted | draft_ready |
| unDrifted | X | `BUFFER_PUB2_KEY` | `6a546f6380cc80cdcaa962f0` | unDrifted_c3 | held_missing_approved_url_bound_derivative |
| unDrifted | Instagram | none connected | none | none | held_missing_approved_derivative |
| unDrifted | YouTube | none connected | none | none | not_applicable |

Buffer drafts created:

| Buffer draft ID | Identity | Platform | Target URL | Status |
|---|---|---|---|---|
| `6a54ede947830b281a71e8cd` | unDrifted | Facebook | `https://measuresregistry.com/undrifted/field-findings-2026-w28` | draft |
| `6a54edead6677965d318facb` | unDrifted | Facebook | `https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems` | draft |

No Buffer draft was scheduled or published. Operator approval remains required before send.

## Holds

- unDrifted X: approved thread starters cannot be URL-bound without exceeding platform boundary; shortening/threading requires editorial approval.
- Measures Registry X/Facebook: the available acknowledgement copy is not platform-specific derivative copy for those endpoints.
- Instagram: no approved visual derivative/crop for this recovery OAR.
- YouTube: no approved Launch Cycle 001 video derivative for this recovery OAR.
- Paragraph Response backlink: absent from live Paragraph body, present on Measures Registry Response route.
- Cloudflare deployment identifier: not available through the non-Wrangler verification route used here.

## No-Mutation / No-Invention Confirmation

- Canonical article source text was not edited.
- No source media was edited.
- No new derivatives were created.
- No editorial copy was rewritten.
- No new routes or hosting authority were invented.
- No schedules or public social sends were executed.
- No secrets were committed to artifacts.

Detailed machine-readable evidence:

- `docs/oar/measures_registry/launch_cycle_001_recovery_publication_release_evidence_v1.json`

This OAR1 closes the production and Paragraph release recovery. Buffer remains ready for operator review on unDrifted Facebook and held elsewhere for the reasons recorded above.
