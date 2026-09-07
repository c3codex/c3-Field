---
document_type: paragraph_export_package
authority_level: governed_export
document_scope: measures_registry_paragraph_api_publishing
title: Paragraph API DB-to-Paragraph Export Package v1
status: generated_api_unavailable_manual_handoff
source_oar2: docs/oar/measures_registry/oar2_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md
publication_key: undrifted
---

# Paragraph API DB-to-Paragraph Export Package v1

## Standing

Paragraph API publishing was not attempted.

Reason:

- no Paragraph API key was available in the local environment or repo env files
- no operator approval was seated for draft creation
- no operator approval was seated for publish

This package is the manual DB-to-Paragraph handoff shape for future governed articles.

## Authority

DB governs article truth.

Paragraph receives approved article drafts or manually published articles.

Returned Paragraph URL, post ID, draft ID, status, and timestamp may be written back to governed DB metadata after operator confirmation.

Paragraph body, title, and tags must not overwrite DB authority by default.

## Existing External Articles

| dispatch_key | title | Paragraph URL | standing |
| --- | --- | --- | --- |
| undrifted_dispatch_v1 | unDrifted | https://paragraph.com/@undrifted/undrifted | published_external_operator_confirmed |
| measures_registry_dispatch_v1 | Measures Registry | https://paragraph.com/@undrifted/measures-registry | published_external_operator_confirmed |
| structural_drift_dispatch_v1 | Structural Drift | https://paragraph.com/@undrifted/structural-drift | published_external_operator_confirmed |
| agents_of_chaos_dispatch_v1 | Agents of Chaos | https://paragraph.com/@undrifted/agents-of-chaos | published_external_operator_confirmed |

All four existing articles remain `paragraph_api_managed: false_until_matched`.

No existing article body is rewritten by this package.

## Future Article Export Shape

```yaml
dispatch_key:
publication_key: undrifted
series_key:
title:
subtitle:
slug:
excerpt:
body_markdown:
body_html_if_required:
author_display:
publish_state: drafted_in_db
approval_state: operator_review_required
canonical_url:
paragraph_url:
paragraph_post_id:
paragraph_draft_id:
tags:
section:
cta_label: Assess the Environment
cta_url: https://measuresregistry.com/ai-operations-assessment
claim_boundary: education_only
social_preview_title:
social_preview_description:
social_preview_image:
created_at:
updated_at:
published_at:
```

## Manual Handoff Checklist

- DB article record exists.
- Claim-boundary validation passed.
- Operator approved Paragraph draft creation.
- Paragraph draft was created manually or through a future seated API executor.
- Paragraph draft URL or ID was returned for DB readback.
- Operator reviewed the Paragraph draft.
- Operator approved publish.
- Paragraph URL and published timestamp were returned for DB readback.

## Claim Boundary

Do not include claims about pricing, payment, wallet standing, c3 Key issuance, temp c3 Key issuance, SRC binding, certification, conversion, DAO standing, permission standing, recognition standing, distribution standing, or Marble readiness.

Allowed posture:

- education_only
- orientation
- dispatch
- field note
- assessment CTA
- governed environment framing

## CTA Boundary

Allowed CTAs:

- Read the Dispatch
- Assess the Environment
- Continue to Structural Evaluation
- Understand the Environment
- View Field Notes

Primary CTA:

`Assess the Environment`

`https://measuresregistry.com/ai-operations-assessment`

Publication CTA:

`Read unDrifted`

`https://paragraph.com/@undrifted`

Public support line:

`Begin where drift becomes visible.`
