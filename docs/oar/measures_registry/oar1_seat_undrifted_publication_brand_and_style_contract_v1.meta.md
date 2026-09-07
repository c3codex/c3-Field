---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_publication_brand_style
title: OAR1 - Seat unDrifted Publication Brand and Style Contract v1
status: complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_undrifted_publication_brand_and_style_contract_v1.meta.md
completed_at: 2026-06-05
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
  src: renderer
tags:
  - oar1
  - measures-registry
  - undrifted
  - publication-brand
  - style-contract
  - structural-drift
  - dispatches
  - governed-environments
  - codex-first
---

# OAR1 - Seat unDrifted Publication Brand and Style Contract v1

## EXECUTED

The unDrifted publication brand and style contract were seated in existing Measures Registry publication tables.

No new schema was created.

Frontend rendering was updated to read the unDrifted umbrella publication row and existing Structural Drift dispatch rows from governed DB state.

## DB / SCHEMA SURFACES INSPECTED

Inspected and used:

- `public.measures_publication_registry`
- `public.measures_publication_dispatch`
- `public.measures_registry`
- `public.measures_release_state`

Existing metadata surfaces supported the OAR2 contract:

- `public.measures_publication_registry.metadata`
- `public.measures_publication_dispatch.metadata`

No missing-schema stop was required.

## RECORDS INSERTED OR UPDATED

SQL artifact:

- `docs/oar/measures_registry/seat-undrifted-publication-brand-style-contract-v1.sql`

Live execution surface:

- Supabase `exec_sql` RPC

Inserted or updated in `public.measures_publication_registry`:

- `publication_key`: `undrifted`
- `title`: `unDrifted`
- `subtitle`: `Structural drift is detectable. Collapse is not the default.`
- `publication_type`: `dispatch_publication`
- `status`: `published`
- `distribution_surface`: `measures_registry`
- `claim_boundary`: `education_only`
- `cta_boundary`: `no_payment_no_conversion_no_certification`
- `parent_authority`: `measures_registry`
- `primary_series`: `structural_drift`
- `style_contract_key`: `undrifted_publication_style_v1`

Updated in `public.measures_publication_registry`:

- `publication_key`: `structural_drift`
- `metadata.umbrella_publication_key`: `undrifted`
- `metadata.parent_publication_key`: `undrifted`
- `metadata.series_key`: `structural_drift`
- `metadata.publication_role`: `diagnostic_series`

Updated published rows in `public.measures_publication_dispatch`:

- `agents_of_chaos_dispatch_v1`
- `structural_drift_dispatch_v1`

Dispatch updates:

- `metadata.umbrella_publication_key`: `undrifted`
- `metadata.series_key`: `structural_drift`
- `metadata.claim_boundary`: `education_only`
- `metadata.cta_boundary`: `no_payment_no_conversion_no_certification`
- `metadata.cta_label`: `Read the Dispatch`
- `primary_cta`: `Continue to Structural Evaluation`
- `secondary_cta`: `View Field Notes`

## PUBLIC BRAND LOCK

Canonical publication lock:

```text
unDrifted
Structural drift is detectable.
Collapse is not the default.
```

The longer line was retained only as secondary description / metadata description:

```text
Dispatches from Measures Registry on structural drift, AI operations, and governed environments.
```

Allowed metadata description:

```text
Structural drift is detectable. Collapse is not the default. unDrifted is a Measures Registry publication on AI operations, governed environments, and the correction of structural drift.
```

## STYLE CONTRACT STANDING

Seated style contract key:

- `undrifted_publication_style_v1`

Seated material posture:

- `base_material`: `obsidian`
- `accent_material`: `lapis_cyan`
- `secondary_material`: `graphite`
- `text_material`: `cold_white`

Seated visual posture:

- `dark_editorial`
- `fracture_aware`
- `registry_governed`
- `precise`
- `non_sensational`

Seated token set includes:

- `--undrifted-bg`
- `--undrifted-panel`
- `--undrifted-graphite`
- `--undrifted-line`
- `--undrifted-line-strong`
- `--undrifted-text`
- `--undrifted-muted`
- `--undrifted-faint`
- `--undrifted-blue`
- `--undrifted-cyan`
- `--undrifted-obsidian`

Forbidden visual patterns were seated as contract exclusions in metadata.

## CANONICAL LOGO LOCK

Operator selected the primary unDrifted logo mark:

- source file: `C:/Users/c3DAO/Downloads/undrifted_logo.png`
- repo asset: `public/undrifted_logo.png`
- public path: `/undrifted_logo.png`

Seated in `public.measures_publication_registry.metadata.brand_assets`:

- `primary_full_lockup_path`: `/undrifted_logo.png`
- `publication_header_path`: `/undrifted_logo.png`
- `avatar_favicon_source`: `uD monogram only crop from primary mark`
- `social_banner_source`: `unDrifted wordmark + canonical brand line + Measures Registry parent mark`

Seated in `public.measures_publication_registry.metadata.logo_contract`:

- primary mark status: `canonical`
- wordmark: `unDrifted`
- tagline: `MEASURE · DETECT · CORRECT · GOVERN`
- usage hierarchy:
  - primary full lockup: `uD monogram + unDrifted wordmark + tagline`
  - publication header: `unDrifted wordmark + canonical brand line`
  - avatar / favicon: `uD monogram only`
  - social banner: `unDrifted wordmark + canonical brand line + Measures Registry parent mark`

Primary mark characteristics seated:

- dark obsidian field
- circular detection / registry geometry
- split uD monogram
- left-side drift displacement lines
- central vertical measurement axis
- cyan/lapis corrected D form
- cold white drifted/u form
- governed circular relation field
- wordmark: `unDrifted`
- tagline: `MEASURE · DETECT · CORRECT · GOVERN`

Forbidden logo patterns seated:

- illustrated scene
- badge emblem
- mascot
- generic cyber logo
- compliance seal
- crypto token mark

## HIERARCHY STANDING

Governed hierarchy:

```text
Measures Registry
  -> unDrifted
      -> Structural Drift
          -> Structural Drift
          -> Agents of Chaos
      -> Assessment-First
      -> Governed Environments
      -> AI Operations
      -> Field Notes
```

Structural Drift remains a diagnostic series/category under unDrifted.

unDrifted remains a Measures Registry publication surface.

## DISPATCH / ARTICLE STANDING

Current published Structural Drift dispatch rows remain governed:

- `agents_of_chaos_dispatch_v1`
- `structural_drift_dispatch_v1`

No new article truth was invented.

Future series lanes were seated only as future-state hierarchy metadata, not published dispatch content.

## FILES CHANGED

- `docs/oar/measures_registry/seat-undrifted-publication-brand-style-contract-v1.sql`
- `docs/oar/measures_registry/oar1_seat_undrifted_publication_brand_and_style_contract_v1.meta.md`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx`
- `src/measures_registry/registered_runtime/styles/registry.visual-system.css`
- regenerated `dist-registry` artifacts

## VISUAL IMPLEMENTATION SUMMARY

Renderer changes:

- publication registry fetch now reads both `undrifted` and `structural_drift`
- publication index renders unDrifted as the umbrella brand
- Structural Drift dispatch cards continue to resolve from published `measures_publication_dispatch` rows
- `main[data-layout-contract="undrifted_publication"]` carries `data-style-contract="undrifted_publication_style_v1"`
- CTA labels render from the allowed boundary

Style changes:

- dark editorial obsidian field
- graphite panels
- restrained lapis/cyan relation lines
- subtle fracture/lattice texture
- responsive publication grid
- mobile brand lock verified with no horizontal overflow

## ROUTE VALIDATION

Local preview:

- `http://127.0.0.1:4177`
- artifact: `dist-registry`

`/structural-drift`:

- existing intro threshold continuity preserved on plain route entry
- direct governed publication surface `?surface=structural_drift_publication` rendered:
  - `h1`: `unDrifted`
  - brand line: `Structural drift is detectable.` / `Collapse is not the default.`
  - `main[data-surface="structural_drift_dispatches"]`
  - `main[data-layout-contract="undrifted_publication"]`
  - `data-style-contract="undrifted_publication_style_v1"`
  - allowed CTAs only: `Read the Dispatch`, `Continue to Structural Evaluation`
- CTA routed to `?surface=measures_assessment`
- CTA target resolved `main[data-surface="measures_ai_operational_evaluation"]`

Mobile viewport validation:

- viewport: `390 x 844`
- brand lock rendered as two lines
- no horizontal overflow

`/ai-operations-assessment`:

- `?surface=eval_passage` rendered `main[data-surface="eval_passage"]`
- `Continue to Evaluation` routed to `?surface=measures_assessment`
- CTA target resolved `main[data-surface="measures_ai_operational_evaluation"]`
- deprecated eval residue did not appear in public copy

Crawler-visible route heads:

- `dist-registry/ai-operations-assessment/index.html`
- `dist-registry/structural-drift/index.html`

Both built route heads retain:

- `title`
- `description`
- `canonical`
- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

Built route-head scans found no deprecated eval residue and no forbidden CTA/claim terms.

## NO-CLAIMS CONFIRMATION

No public route output introduced:

- pricing
- payment
- wallet
- c3 Key issuance
- temp c3 Key issuance
- SRC claim
- certification claim
- conversion claim
- DAO claim
- permission claim
- recognition claim
- distribution claim
- Marble readiness claim

No assessment questions were changed.

No scoring logic was changed.

No contact gate or result gate was bypassed.

## VALIDATION COMMANDS

TypeScript:

```powershell
npx.cmd tsc --noEmit
```

Result: passed.

Registry build:

```powershell
npm.cmd run build:registry
```

Result: passed.

Build output included the existing registry chunk-size warning.

## GIT STATUS STANDING

This closeout was written in a worktree that already contained the prior deprecated-residue OAR package and generated registry artifacts.

The unDrifted package is not committed in this closeout step.

## CLOSE

unDrifted names the correction surface.

Structural drift is detectable.

Collapse is not the default.

Measures Registry remains the authority.

Publication renders from governed standing.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes.
src renders.
