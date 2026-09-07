---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - FREE to Codex Governance Audit for Crystal Obsidian Lapis Directories
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - FREE to Codex Governance Audit for Crystal Obsidian Lapis Directories

## OBJECTIVE

Create an operator-readable governance audit surface proving that FREE renders from Codex/DB-held standing.

Audit scope:

- Crystal Seat Directory
- Obsidian Chamber Directory
- Lapis Chamber Directory

This is a FREE-to-Codex proof of governance.

The directories should be readable somewhere to the operator.

## OBSERVED

Directory keys are seated.

DB-held standing now includes:

- registered_surface
- style_profile
- content_profile
- media_locator
- directory_key

FREE consumes standing across the 13 registered surfaces.

However, there is not yet a readable governance audit surface that shows:

- what each directory holds
- what FREE receives
- what Measures allows
- what Field arranges
- what Roles authorize
- what Optics can prove

The operator needs a governance-readable directory view.

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

FREE is the public render surface of Field.

This OAR creates proof that FREE is rendering from Codex-held standing.

## SCOPE

In scope:

- `crystal_seat_directory`
- `obsidian_chamber_directory`
- `lapis_chamber_directory`

Out of scope for this OAR:

- `marble_chamber_directory`
- public visitor navigation exposure
- styling redesign
- scoring changes
- payment changes
- route changes
- passage activation
- antechamber activation

Marble may be audited later after launchable-to-Marble entry is confirmed.

## GOVERNANCE AUDIT SURFACE

Create an operator-readable route or view.

Preferred route:

- `/governance-audit`

Alternative if route policy requires namespace:

- `/operator/governance-audit`

The route must not be promoted publicly.

It may be accessible only by direct URL for now unless auth exists.

If auth/gating exists, use operator-only gating.

If auth/gating does not exist, keep it unlinked from public navigation and report access limitation.

## DIRECTORY READ REQUIREMENT

For each directory, display all held contents by `directory_key`.

Minimum fields:

- directory_key
- registered_surface
- surface_key
- registry_key
- encounter_key
- material_identity
- chamber_assignment
- release_state
- access_state
- is_active
- standing
- style_profile
- content_profile
- media_locator
- route_path if any
- renderer status
- FREE consumption status
- role/action availability if known
- notes/gaps

## DIRECTORY STATUS GROUPS

The audit must distinguish:

- hot
- released
- held
- inactive
- legacy_alias
- audit_trace
- secured_scale
- gap
- renderer_gap
- media_gap
- content_gap
- route_gap

No held or secured_scale item should appear as active public launch standing.

## CRYSTAL DIRECTORY EXPECTATIONS

`crystal_seat_directory` should show:

- `crystal_seat_intro`
- `crystal_seat_threshold`
- `crystal_seat_orientation`
- `crystal_seat_encounter`

It should also show any legacy/held Crystal records if they remain, but status-separated.

Specific proofs:

- intro uses `ai_isnt_broken_intro`
- threshold owns L/R choice
- orientation uses `measures_position`
- orientation includes governed-site / Codexstone standing
- encounter resolves `/about-measures-registry`
- `crystal_seat_split_path` is legacy_alias if present
- `crystal_seat_orientation_passage` is held if present

## OBSIDIAN DIRECTORY EXPECTATIONS

`obsidian_chamber_directory` should show:

- `obsidian_chamber_orientation`
- `obsidian_chamber_encounter_surface`
- `obsidian_chamber_C1_compact`

Specific proofs:

- orientation media locator is `obsidian`
- no active `structural_coherence_explainer` drift
- encounter route is `/ai-operations-assessment`
- C1 compact is contact_capture + email continuance
- no active `obsidian_chamber_orientation_passage`
- no active `obsidian_to_marble_passage_video`

## LAPIS DIRECTORY EXPECTATIONS

`lapis_chamber_directory` should show:

- `lapis_chamber_encounter`
- registered article references
- Paragraph dispatch records
- Buffer/social integration standing where seated
- publication dispatch / audit_trace records where present

Specific proofs:

- `/undrifted` resolves as `lapis_chamber_encounter`
- Lapis holds publication and distribution
- Lapis is optional/promoted/non-required
- `structural_drift_publication` is not active authority
- `structural_drift_dispatches` is not active surface authority
- article preview records are from registered dispatch rows, not hardcoded

## FREE TO CODEX PROOF

The audit surface must show a clear chain for each item:

- Codex/DB row exists
- Measures release/access standing
- Field/FREE render state
- Role/action state if interactive
- Optics/gap evidence

Suggested display:

    Codex row: present
    Measures standing: released / encounterable / held / etc.
    Field arrangement: style_profile + content_profile + media_locator
    FREE render: rendered / gap / held / unavailable
    Role action: continue / assess / subscribe / none
    Optics note: proof/gap

## IMPLEMENTATION RULE

Cody must not hardcode audit truth.

The audit surface must be generated from live resolved registry/directory data wherever possible.

If a field is unavailable to FREE, show:

- unavailable_to_FREE
- requires resolver expansion

Do not invent missing values.

## ROUTED

Cody must:

1. Audit current resolver data available to FREE.
2. Determine whether directory contents can be resolved from existing payload.
3. If needed, extend resolver to expose directory inventory for the three directories.
4. Create an operator-readable audit view.
5. Add status grouping.
6. Include legacy/held records if available.
7. Keep route unpromoted from public navigation.
8. Run TypeScript/build validation.
9. Write OAR1 with screenshots/route/status evidence if possible.

## DO NOT TOUCH

This OAR does not authorize:

- public navigation promotion
- new public sequence
- scoring changes
- payment changes
- report copy changes
- passage activation
- antechamber activation
- social automation activation
- registered_runtime restoration
- concordance update

## REQUIRED OAR1 TABLE

OAR1 must include:

- directory_key
- contents found
- active/hot count
- held count
- gap count
- route created
- access model
- FREE data source
- missing resolver fields
- validation result

Minimum directories:

- crystal_seat_directory
- obsidian_chamber_directory
- lapis_chamber_directory

## VALIDATION

Validation succeeds when:

- operator can open the audit surface
- Crystal directory contents are readable
- Obsidian directory contents are readable
- Lapis directory contents are readable
- active/held/gap statuses are separated
- FREE-to-Codex proof chain is visible
- no audit truth is hardcoded
- no public launch flow is changed
- no payment/scoring/report mutation occurs
- passages and antechambers remain held
- TypeScript/build passes or exact failure is reported

## EXPECTED OAR1

docs/oar/measures_registry/oar1_free_to_codex_governance_audit_for_crystal_obsidian_lapis_directories_v1.meta.md

## CLOSE

Directories must be readable.

FREE must prove what Codex holds.

Crystal, Obsidian, and Lapis directory standing becomes operator-visible.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
