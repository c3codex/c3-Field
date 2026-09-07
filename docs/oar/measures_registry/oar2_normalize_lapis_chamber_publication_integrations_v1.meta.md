---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Normalize Lapis Chamber Publication Integrations
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Normalize Lapis Chamber Publication Integrations

## OBSERVED

The term `structural_drift_publication` continues appearing in source/registry context.

That term is drift.

The seated Lapis structure is:

- `lapis_chamber_encounter`
- public route: `/undrifted`

Lapis Chamber holds publication and distribution integrations.

It must hold:

- registered articles
- Paragraph references
- Buffer references
- social media profile references
- publication dispatch records
- public education links

`/undrifted` is the promoted Lapis Chamber encounter.

It is not required sequence.

## ALIGNED

`structural_drift_publication` is deprecated from active Measures Registry runtime vocabulary.

It may remain only as:

- deprecated
- legacy_alias
- audit_trace
- migration_note

It may not remain as:

- active surface key
- active encounter key
- active route authority
- active profile
- active registry key
- CSS/profile authority
- FREE runtime vocabulary

Lapis Chamber must resolve publication/distribution standing through:

- `lapis_chamber_encounter`
- `/undrifted`

## LAPIS CHAMBER HOLDING RULE

Lapis Chamber holds:

- `lapis_chamber_encounter`
- registered article records
- Paragraph integration standing
- Buffer integration standing
- social media profile standing
- publication dispatch / audit trace standing
- public education links into:
  - `/about-measures-registry`
  - `/ai-operations-assessment`
  - Paragraph articles where seated

Lapis Chamber does not hold:

- Obsidian assessment authority
- Marble MAP authority
- payment authority
- report findings authority
- certification / conversion standing
- required sequence authority

## ROUTED

Cody must audit all references to:

- `structural_drift_publication`
- `structural_drift_dispatches`
- `publication_dispatch`
- `lapis_publication_surface`
- `lapis_chamber_encounter`
- `/undrifted`
- Paragraph
- Buffer
- social profile references
- registered article references

Audit locations:

- DB migrations
- live DB where accessible
- registry resolver
- route maps
- LapisChamberRenderer
- encounter_profile / metadata records
- article/publication constants
- integration references
- CSS/profile selectors

## REQUIRED NORMALIZATION

Cody must normalize active Lapis runtime vocabulary to:

- structural identity: `lapis_chamber_encounter`
- public route: `/undrifted`
- material chamber: Lapis
- profile: `lapis_chamber_encounter` or seated Lapis profile if already normalized
- integration holding: Lapis Chamber

If `structural_drift_publication` exists:

- remove from active resolver/fetch lists if not required
- mark as deprecated / legacy_alias / audit_trace where DB row exists
- replace active references with `lapis_chamber_encounter`
- preserve public article titles/copy where seated
- do not rename public article content unless separately authorized

If `structural_drift_dispatches` remains only as legacy anchor:

- ensure it is not active structural authority
- migrate active standing to `lapis_chamber_encounter` where safe

If `publication_dispatch` remains:

- classify as audit_trace or dispatch sub-surface
- do not let it hide the main Lapis Chamber encounter
- do not make it active route authority unless explicitly seated

## INTEGRATION INVENTORY REQUIREMENT

OAR1 must report:

- registered article records found
- Paragraph references found
- Buffer references found
- social media profile references found
- publication dispatch records found
- missing integration records
- whether `/undrifted` links to seated article records or uses hardcoded links
- whether `/undrifted` links to `/about-measures-registry`
- whether `/undrifted` links to `/ai-operations-assessment`

## DO NOT TOUCH

This OAR does not authorize:

- rewriting article copy
- inventing article records
- inventing social profiles
- inventing Paragraph/Buffer credentials
- payment/Stripe changes
- assessment changes
- report copy changes
- scoring changes
- new required sequence
- registered_runtime restoration
- frontend-owned publication truth

## CODY ROLE

Cody may:

- audit and normalize Lapis naming
- isolate `structural_drift_publication`
- update resolver/fetch references where dependency-safe
- align `/undrifted` to `lapis_chamber_encounter`
- report integration inventory
- preserve article content as seated
- write OAR1 with evidence

Cody may not:

- invent missing article/integration records
- make `/undrifted` required sequence
- move assessment/MAP/payment authority into Lapis
- use generic structural drift publication naming as active architecture
- hardcode integration truth

## VALIDATION

Validation succeeds when:

- `structural_drift_publication` is not active runtime authority
- `/undrifted` resolves as `lapis_chamber_encounter`
- Lapis Chamber is confirmed as holder of registered article/publication/social integration standing
- Paragraph/Buffer/social references are inventoried
- publication dispatch is isolated or correctly classified
- no article/social truth is invented
- `/undrifted` remains optional, promoted, non-sequence
- no assessment/report/payment mutation occurs
- registered_runtime remains retired
- OAR1 records evidence and remaining gaps

## EXPECTED OAR1

docs/oar/measures_registry/oar1_normalize_lapis_chamber_publication_integrations_v1.meta.md

## CLOSE

`structural_drift_publication` is drift.

Lapis Chamber holds publication and distribution standing.

`/undrifted` is the Lapis Chamber encounter.

Lapis relates.
Lapis publishes.
Lapis distributes.
Lapis does not force sequence.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
