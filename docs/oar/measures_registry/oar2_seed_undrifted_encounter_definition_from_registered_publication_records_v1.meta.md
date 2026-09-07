---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seed Undrifted Encounter Definition From Registered Publication Records
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_normalize_lapis_chamber_publication_integrations_v1
---

# OAR2 - Seed Undrifted Encounter Definition From Registered Publication Records

## OBSERVED

OAR1 confirmed:

- `/undrifted` resolves correctly as `lapis_chamber_encounter`
- registry gate is active and released
- renderer dispatch is functioning
- `encounterDef` is null

As a result, `UnDriftedIndex` renders an empty shell:

- no masthead
- no cover story
- no featured articles
- no assessment CTA
- no role call
- no footer
- no publication cards

Content exists, but it exists outside the FREE encounter model.

Existing sources:

- `measures_publication_registry`
- `measures_publication_dispatch`

FREE does not query those tables.

Lapis Chamber holds the publications.
The encounter cannot yet encounter them.

## ALIGNED

Lapis Chamber holds:

- publication registry
- publication dispatch
- registered articles
- Paragraph integration
- Buffer integration
- social profile integrations
- publication encounters

The public encounter surface for these holdings is:

- `lapis_chamber_encounter`
- public route: `/undrifted`

This OAR ports display content into:

    encounter_key = 'undrifted'

without changing publication authority.

Publication authority remains in:

- measures_publication_registry
- measures_publication_dispatch

The encounter receives encounter copies for rendering only.

## REQUIRED CONTENT SEED

Seed or update:

    measures_encounter_def
    encounter_key = 'undrifted'

Required metadata sections:

### brand_copy

- title
- subtitle
- introduction

### cover_story

- featured story record
- hero image reference if present
- excerpt

### featured_article_set

- article title
- article_url
- teaser
- publication status

### assessment_feature

- route_path:
  `/ai-operations-assessment`

- CTA copy:
  Assess the Environment

### role_call_feature

- leadership / participation call
- registry participation copy

### next_issue_teaser

- next publication placeholder if available

### footer_record

- publication footer
- registry explanation
- publication references

### issue_record

- issue metadata
- publication metadata

### landing_design_contract

Legacy implementation field.

Allowed only because schema already expects it.

No new contract terminology is introduced.

## CONTENT SOURCE RULE

Source of truth remains:

- measures_publication_registry
- measures_publication_dispatch

Do not duplicate authority.

This encounter definition is a rendering projection.

If source records are missing:

- report exact gap
- do not invent article content
- do not invent publication records

## ARTICLE INVENTORY RULE

Use only seated article records.

Current known records:

- Measures Registry
- unDrifted

Additional articles may be included only if registered records exist.

Do not hardcode article inventory.

## PARAGRAPH RULE

Paragraph remains:

- publication authority
- external URL authority

Do not import article bodies unless already seated.

External URL may remain article authority.

## BUFFER / SOCIAL RULE

Inventory only.

Do not activate automation.

Do not invent profile records.

Do not create social registry schema.

## ROUTED

Cody must inspect:

- measures_publication_registry
- measures_publication_dispatch
- measures_encounter_def
- LapisChamberRenderer.tsx
- UnDriftedIndex
- encounter metadata expectations
- Paragraph references
- existing issue metadata

Cody may seed:

- measures_encounter_def row
- metadata fields expected by UnDriftedIndex

Cody may not:

- rewrite article content
- invent publication records
- invent social records
- activate Buffer automation
- change publication authority

## EXPECTED RESULT

`/undrifted` should render:

- masthead
- cover story
- featured article cards
- assessment CTA
- role call
- footer
- publication references

without requiring:

- registered_runtime
- publication table queries in FREE
- hardcoded article data

## DO NOT TOUCH

This OAR does not authorize:

- Obsidian changes
- Marble changes
- payment changes
- scoring changes
- report changes
- route changes
- sequence changes
- CSS redesign
- registered_runtime restoration

## VALIDATION

Validation succeeds when:

- `encounter_key = 'undrifted'` exists
- `encounterDef` is returned by registryResolver
- `UnDriftedIndex` no longer renders empty shell
- featured article cards render from seeded metadata
- assessment CTA renders
- footer renders
- role call renders
- no publication truth is duplicated
- no article content is invented
- `/undrifted` remains optional and non-sequence
- TypeScript/build passes or exact failure is reported
- OAR1 records before/after proof and seeded metadata inventory

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seed_undrifted_encounter_definition_from_registered_publication_records_v1.meta.md

## CLOSE

Lapis holds publications.

The encounter must be able to encounter them.

Seed the encounter definition.
Preserve publication authority.
Render the chamber holdings.

Lapis relates.
Lapis publishes.
Lapis distributes.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
