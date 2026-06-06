---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_paragraph_api_publishing
title: OAR1 - Seat Paragraph API Publishing Contract for DB-Governed Articles v1
status: completed_api_unavailable_export_only
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md
tags:
  - oar1
  - measures-registry
  - undrifted
  - paragraph
  - api
  - publishing
  - db-governed-articles
  - export-only
---

# OAR1 - Seat Paragraph API Publishing Contract for DB-Governed Articles v1

## Result

Completed with API publishing held.

The Paragraph API publishing contract is seated in governed DB metadata for `publication_key = undrifted`.

No Paragraph API draft or publish call was attempted because no Paragraph API key was available and no operator approval was seated for draft or publish.

The valid route for this OAR is export-only manual handoff until a future OAR seats credential availability and operator approval.

## DB / Schema Surfaces Inspected

- `public.measures_publication_registry`
- `public.measures_publication_registry.metadata`
- `public.measures_publication_dispatch`
- `public.measures_publication_dispatch.metadata`

## Files Added

- `docs/oar/measures_registry/seat-paragraph-api-publishing-contract-for-db-governed-articles-v1.sql`
- `docs/oar/measures_registry/paragraph_api_db_to_paragraph_export_package_v1.md`
- `docs/oar/measures_registry/oar1_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md`

## DB Records Updated

- `public.measures_publication_registry`
  - `publication_key = undrifted`
  - seated `metadata.paragraph_api_publishing_contract`
- `public.measures_publication_dispatch`
  - `dispatch_key = structural_drift_dispatch_v1`
  - seated Paragraph external published standing metadata
- `public.measures_publication_dispatch`
  - `dispatch_key = agents_of_chaos_dispatch_v1`
  - seated Paragraph external published standing metadata

## Paragraph API Capability Standing

- platform: `paragraph`
- handle: `@undrifted`
- publication key: `undrifted`
- API capability state: `unavailable`
- API status: `alpha`
- local SDK dependency inspected: `@paragraph-com/sdk` at `^1.6.0`
- direct publish allowed: `false_by_default`
- browser automation authorized: `false`
- raw password handling authorized: `false`

## API Key Requirement Standing

Protected create/update/publish endpoints require an API key.

No `PARAGRAPH` API key was found in local environment variables or repo env files.

No API key value was stored in DB, repo, OAR files, logs, docs, browser runtime, screenshots, or social/media metadata.

## Credential Boundary Standing

Seated in `metadata.paragraph_api_publishing_contract.credential_boundary`.

Allowed storage:

- local environment variable
- deployment secret manager
- future seated CI secret

Prohibited storage:

- GitHub repo
- Supabase DB
- OAR files
- markdown docs
- browser runtime
- logs
- screenshots
- social/media metadata

Log rule: redact key values.

## Article Lifecycle Standing

Seated lifecycle states:

- `drafted_in_db`
- `operator_review_required`
- `approved_for_paragraph_draft`
- `paragraph_draft_created`
- `approved_for_paragraph_publish`
- `published_to_paragraph`
- `failed_paragraph_submission`
- `held_for_revision`
- `deprecated`
- `archived`

Default new article state: `drafted_in_db`.

## Existing Article Standing

Four existing Paragraph articles were preserved as already-published external records:

| dispatch_key | Paragraph URL | standing |
| --- | --- | --- |
| `undrifted_dispatch_v1` | `https://paragraph.com/@undrifted/undrifted` | `published_external_operator_confirmed` |
| `measures_registry_dispatch_v1` | `https://paragraph.com/@undrifted/measures-registry` | `published_external_operator_confirmed` |
| `structural_drift_dispatch_v1` | `https://paragraph.com/@undrifted/structural-drift` | `published_external_operator_confirmed` |
| `agents_of_chaos_dispatch_v1` | `https://paragraph.com/@undrifted/agents-of-chaos` | `published_external_operator_confirmed` |

Existing article body standing: `external_url_standing_or_body_pending`.

API management standing: `false_until_matched`.

No existing article body was overwritten.

No external URL was invented.

## Sync Direction Standing

Default sync direction is seated as `DB_to_Paragraph`.

Allowed readback:

- Paragraph URL
- Paragraph post ID
- Paragraph draft ID
- Paragraph status
- published timestamp
- redacted API response summary

Not allowed by default:

- Paragraph body overwrites DB body
- Paragraph title overwrites DB title
- Paragraph tags overwrite DB tags
- Paragraph becomes article authority

## Approval Boundary Standing

- approval before Paragraph draft: `operator_required`
- approval before Paragraph publish: `operator_required`
- agent-owned publishing decision: `false`
- automatic publish authorized: `false`

## API Draft / Publish Result

No Paragraph API draft or publish action was attempted.

DB readback:

- `api_execution_result.draft_attempted = false`
- `api_execution_result.publish_attempted = false`
- `api_execution_result.reason = missing_api_key_and_missing_operator_approval`

## Paragraph IDs / URLs Returned

No Paragraph draft IDs or post IDs were returned because no API call was made.

Existing external URLs were preserved:

- `https://paragraph.com/@undrifted/undrifted`
- `https://paragraph.com/@undrifted/measures-registry`
- `https://paragraph.com/@undrifted/structural-drift`
- `https://paragraph.com/@undrifted/agents-of-chaos`

## Export Package Standing

Generated:

`docs/oar/measures_registry/paragraph_api_db_to_paragraph_export_package_v1.md`

DB standing:

- `export_package.standing = generated_api_unavailable_manual_handoff`
- `export_package.api_submission_performed = false`

## No-Claims Confirmation

Claim-boundary validation requirements are seated before draft and before publish.

Blocked claim classes are seated for pricing, payment, wallet, c3 Key issuance, temp c3 Key issuance, SRC binding, certification, conversion, DAO, permission, recognition, distribution, and Marble readiness.

Allowed public posture is limited to education, orientation, dispatch, field note, assessment CTA, and governed environment framing.

No runtime article copy was added by this OAR.

## TypeScript / Build

No runtime code changes were made for this OAR.

TypeScript was not run.

Registry build was not run.

`git diff --check` passed for the new Paragraph OAR files.

## Git Status Standing

The working tree remains dirty with prior OAR and runtime changes already present.

New current-OAR files are untracked:

- `docs/oar/measures_registry/oar1_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md`
- `docs/oar/measures_registry/oar2_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md`
- `docs/oar/measures_registry/paragraph_api_db_to_paragraph_export_package_v1.md`
- `docs/oar/measures_registry/seat-paragraph-api-publishing-contract-for-db-governed-articles-v1.sql`

Pre-existing package files show `@paragraph-com/sdk` at `^1.6.0`; this OAR did not modify package files.

## Validation Evidence

Live DB readback from `public.measures_publication_registry`:

```json
{
  "publicationKey": "undrifted",
  "contractKey": "paragraph_api_publishing_contract_for_db_governed_articles_v1",
  "contractStatus": "seated_api_unavailable_export_only",
  "apiState": "unavailable",
  "tokenStorage": "environment_secret_only",
  "apiKeyRequired": "true_for_protected_create_update_publish_endpoints",
  "directPublishAllowed": "false_by_default",
  "lifecycleCount": 10,
  "defaultState": "drafted_in_db",
  "draftApproval": "operator_required",
  "publishApproval": "operator_required",
  "syncDefault": "DB_to_Paragraph",
  "paragraphAuthority": true,
  "existingArticleCount": 4,
  "apiDraftAttempted": false,
  "apiPublishAttempted": false
}
```

Live DB readback from `public.measures_publication_dispatch`:

```json
[
  {
    "dispatch_key": "agents_of_chaos_dispatch_v1",
    "external_url": "https://paragraph.com/@undrifted/agents-of-chaos",
    "article_url": "https://paragraph.com/@undrifted/agents-of-chaos",
    "metadata_article_url": "https://paragraph.com/@undrifted/agents-of-chaos",
    "paragraph_publish_state": "published_external_operator_confirmed",
    "paragraph_api_managed": "false_until_matched",
    "db_body_state": "external_url_standing_or_body_pending",
    "paragraph_post_id": null,
    "paragraph_draft_id": null
  },
  {
    "dispatch_key": "structural_drift_dispatch_v1",
    "external_url": "https://paragraph.com/@undrifted/structural-drift",
    "article_url": "https://paragraph.com/@undrifted/structural-drift",
    "metadata_article_url": "https://paragraph.com/@undrifted/structural-drift",
    "paragraph_publish_state": "published_external_operator_confirmed",
    "paragraph_api_managed": "false_until_matched",
    "db_body_state": "external_url_standing_or_body_pending",
    "paragraph_post_id": null,
    "paragraph_draft_id": null
  }
]
```

Secret scan:

- no `PARAGRAPH_*=` assignment found in the new Paragraph OAR artifacts
- no `apiKey`, `api_key:`, `secret:`, or `token:` literal value pattern found in the new Paragraph OAR artifacts

## Close

DB governs.

Paragraph publishes.

API bridges when capability and approval exist.

This OAR seated the contract and held publication correctly.
