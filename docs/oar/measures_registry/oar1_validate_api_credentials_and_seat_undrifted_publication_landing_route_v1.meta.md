---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_api_validation_and_undrifted_route
title: OAR1 - Validate API Credentials and Seat unDrifted Publication Landing Route v1
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md
tags:
  - oar1
  - measures-registry
  - undrifted
  - api-validation
  - buffer
  - paragraph
  - route-registration
  - publication-landing
---

# OAR1 - Validate API Credentials and Seat unDrifted Publication Landing Route v1

## Result

Completed.

`/undrifted` is seated as the governed unDrifted publication landing route.

`/structural-drift` remains available and is reclassified as the Structural Drift diagnostic series route under unDrifted.

Buffer and Paragraph credentials were validated for read-only capability only. No Buffer draft, Buffer schedule, Buffer post, Paragraph draft, Paragraph update, or Paragraph publish action was performed.

## Env Secret Name Standing

Presence checks were performed without printing values:

- `BUFFER_SOCIAL_KEY present: true`
- `PARAGRAPH_SECRET_KEY present: true`

No secret values were echoed, stored, committed, written to DB, written to OAR files, or included in logs.

## Gitignore Standing

`.env.local` is ignored by Git.

`.gitignore` contains:

- `.env`
- `.env.local`
- `.env.*.local`

## Buffer Capability Standing

Read-only Buffer validation succeeded.

Evidence:

- bearer token accepted by `https://api.buffer.com`
- account query returned HTTP `200`
- organization read succeeded
- channels read succeeded
- channel count: `3`
- expected X channel confirmed: `measures_c3`
- expected Instagram channel confirmed: `measures_registry`
- expected LinkedIn channel confirmed: `measures-registry`

DB metadata seated on `public.measures_publication_registry.metadata.buffer_scheduler_contract.buffer_capability_standing`:

- `buffer_api_available: true`
- `buffer_secret_name: BUFFER_SOCIAL_KEY`
- `credential_storage: environment_secret_only`
- `direct_posting_authorized: false`
- `approval_required: true`
- `capability_state: validated_read_only`
- `draft_created: false`
- `post_scheduled: false`
- `post_published: false`

## Paragraph Capability Standing

Read-only Paragraph validation succeeded.

Evidence:

- authenticated SDK client constructed from `PARAGRAPH_SECRET_KEY`
- `@undrifted` / `undrifted` publication accessible
- publication name read as `unDrifted`
- post feed accessible
- expected post slugs confirmed:
  - `undrifted`
  - `measures-registry`
  - `structural-drift`
  - `agents-of-chaos`

DB metadata seated on `public.measures_publication_registry.metadata.paragraph_api_publishing_contract.capability`:

- `paragraph_api_available: true`
- `paragraph_secret_name: PARAGRAPH_SECRET_KEY`
- `credential_storage: environment_secret_only`
- `direct_publish_authorized: false_by_default`
- `approval_required: true`
- `api_capability_state: validated_read_only`
- `publication_access_confirmed: true`
- `post_feed_access_confirmed: true`
- `draft_created: false`
- `post_published: false`

## DB / Schema Surfaces Inspected

- `public.measures_registry`
- `public.measures_registry.metadata`
- `public.measures_publication_registry`
- `public.measures_publication_registry.metadata`
- `public.measures_publication_dispatch`

## Records Inserted or Updated

`public.measures_registry`

- inserted or updated `registry_key = undrifted_publication_landing`
- updated `registry_key = structural_drift_landing`

`public.measures_publication_registry`

- updated `publication_key = undrifted`

## `/undrifted` Route Standing

Live DB readback:

```json
{
  "registry_key": "undrifted_publication_landing",
  "display_title": "unDrifted | Measures Registry",
  "release_state": "released",
  "access_state": "visible",
  "is_active": true,
  "route_path": "/undrifted",
  "route_role": "primary_publication_landing",
  "publication_key": "undrifted",
  "runtime_surface": "structural_drift_dispatches",
  "canonical_url": "https://measuresregistry.com/undrifted",
  "title": "unDrifted | Measures Registry",
  "description": "Structural drift is detectable. Collapse is not the default.",
  "og_type": "website",
  "twitter_card": "summary_large_image"
}
```

The renderer maps `/undrifted` to the governed `undrifted_publication_landing` route unit and the existing `structural_drift_dispatches` runtime surface, which already renders the `undrifted` publication record and dispatch rows.

## `/structural-drift` Route Standing

Live DB readback:

```json
{
  "registry_key": "structural_drift_landing",
  "display_title": "Structural Drift | unDrifted",
  "release_state": "released",
  "access_state": "visible",
  "is_active": true,
  "route_path": "/structural-drift",
  "route_role": "diagnostic_series_route",
  "series_key": "structural_drift",
  "umbrella_publication_key": "undrifted",
  "legacy_inbound_supported": true,
  "runtime_surface": "structural_drift_dispatches",
  "canonical_url": "https://measuresregistry.com/structural-drift",
  "title": "Structural Drift | unDrifted",
  "description": "Structural Drift is the diagnostic series inside unDrifted, naming the seams where AI operations lose alignment.",
  "og_type": "website",
  "twitter_card": "summary_large_image"
}
```

No redirect behavior was added.

## Route-Head Validation

`npm.cmd run build:registry` regenerated crawler-visible static heads for:

- `/ai-operations-assessment`
- `/structural-drift`
- `/undrifted`

Validated in built HTML:

- title
- description
- canonical
- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

Local built-route checks returned HTTP `200`, contained the app root, and had expected title/canonical for all three routes.

## Runtime / Code Changes

Updated route maps:

- `src/app/App.tsx`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

Updated static route-head generator:

- `scripts/generate-registry-route-heads.cjs`

Added DB seating artifact:

- `docs/oar/measures_registry/validate-api-credentials-and-seat-undrifted-publication-landing-route-v1.sql`

Updated ignore posture:

- `.gitignore`

## No-Publishing / No-Scheduling Confirmation

Confirmed:

- no Buffer draft created
- no Buffer post scheduled
- no Buffer post published
- no Paragraph draft created
- no Paragraph post updated
- no Paragraph post published
- no article body sync performed
- no browser automation performed
- no raw password handled

## No-Claims Confirmation

No route metadata or runtime change creates or implies:

- pricing
- payment standing
- wallet standing
- c3 Key issuance
- temp c3 Key issuance
- SRC binding
- Measures Conversion
- Registry Certification
- DAO standing
- permission standing
- recognition standing
- distribution standing
- Marble readiness

## Validation Commands

- `git check-ignore -v .env.local`
- Buffer read-only GraphQL account / organizations / channels probes
- Paragraph SDK read-only publication / post feed probes
- Supabase `exec_sql` for `validate-api-credentials-and-seat-undrifted-publication-landing-route-v1.sql`
- live Supabase readback for route and capability metadata
- `npm.cmd run build:registry`
- `npx.cmd tsc --noEmit`
- local built-route HTTP checks for `/undrifted/`, `/structural-drift/`, `/ai-operations-assessment/`
- `git diff --check`

## Build / TypeScript Result

- TypeScript: passed
- Registry build: passed
- Route-head generation: passed

Build warning:

- Vite reported a chunk larger than 500 kB after minification. This was informational and did not fail the build.

## Git Status Standing

Working tree remains dirty with prior OAR/runtime work.

Current OAR files added or updated:

- `.gitignore`
- `scripts/generate-registry-route-heads.cjs`
- `src/app/App.tsx`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `docs/oar/measures_registry/oar1_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md`
- `docs/oar/measures_registry/oar2_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md`
- `docs/oar/measures_registry/validate-api-credentials-and-seat-undrifted-publication-landing-route-v1.sql`
- `dist-registry/undrifted/index.html`
- regenerated `dist-registry` assets and route HTML

No staging or commit was performed.

## Close

Keys are capability.

They are not permission.

unDrifted has the front door.

Structural Drift keeps the series path.
