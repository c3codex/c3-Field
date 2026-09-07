---
document_type: oar2
authority_level: working
document_scope: measures_registry
title: OAR2 — Deactivate Deprecated Eval Residue and Seat Obsidian-to-Marble Carry-Forward
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_audit_chamber_directories_orphaned_surfaces_and_public_semantic_pairings_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-registry
  - obsidian
  - marble
  - carry-forward
  - src
  - oar1
  - assessment
  - contact-capture
  - deprecated-eval-residue
  - passage
---

# OAR2 — Deactivate Deprecated Eval Residue and Seat Obsidian-to-Marble Carry-Forward v1

## OBSERVED

OAR1 audit confirmed that the chamber-directory schema support exists, but Measures Registry runtime threshold surfaces are not yet bound into the chamber-directory architecture.

The audit also confirmed:

- `measures_assessment` is active.
- The assessment result currently carries forward through component/session state only.
- No durable SRC/OAR1 carry-forward is created after assessment completion.
- Contact capture after assessment is not wired into the active Obsidian-to-Marble route.
- `src_intake_request` exists in DB but is not written by the assessment flow.
- `iis_eval_gate1_capture` exists but has no active surface handler.
- `measures_eval_email_contract` is active residue and represents the deprecated evaluation/email report approach.
- The long evaluation/report behavior is not suitable for the current public flow.
- `obsidian_to_marble_passage_video` is active and should remain the registered transition passage.
- `marble_pathway_reveal` receives session-state assessment props but does not yet receive durable carry-forward state.

This OAR corrects the Obsidian-to-Marble carry-forward seam before Marble hardening.

## ALIGNED

Correct public sequence:

Assess the Environment  
→ AI Operations Assessment  
→ current AI usage dropdown  
→ 7 scored questions  
→ environment score  
→ circuit identification  
→ contact capture  
→ SRC/OAR1 carry-forward creation  
→ passage autoload  
→ MAP Integrity Governance surface receives durable carry-forward state

Correct Obsidian carry-forward payload:

- assessment result id
- current AI usage
- environment score
- circuit identification
- selected assessment indicators where available
- organization name
- contact name
- contact email
- SRC/carry-forward record id
- OAR1 trace id
- passage state
- next surface target

Correct public passage copy:

Assessment received.

Your result has been recorded and matched to a structured review path.

The next page will present the recommended next step and the action available for your organization.

Public surfaces must not expose:

- Obsidian
- Marble
- chamber
- material names
- schema
- SRC
- OAR1
- OAR2
- internal route keys
- raw contract names
- c3 Key
- wallet
- DAO
- certification
- registered system

Correct authority rule:

- DB holds assessment result and carry-forward state.
- SRC/carry-forward record provides the durable carrier.
- OAR1 provides the forward trace.
- Frontend submits and renders only.
- Frontend may not invent durable carry-forward state.
- Email evaluation/report behavior is deprecated from this seam.
- MRM is held for later and must not be introduced in this OAR.

## ROUTED

### 1. Deactivate deprecated evaluation/email report residue

Deactivate or hold the deprecated evaluation/email report contract from active public/runtime use.

Minimum target:

- `measures_eval_email_contract`

Required standing:

- no public route
- no runtime invocation
- no email evaluation report sent from this deprecated contract
- retained only as deprecated reference or audit trace if needed

Do not delete records unless existing system pattern requires deletion. Prefer hold/deactivate/deprecated_reference.

### 2. Deactivate only dangerous public-boundary residue

Apply a tightly scoped safety cleanup only where audit identified public-boundary risk and no active handler dependency.

Candidates from audit:

- `connect_src` — display title exposes `c3 Field`; no active handler
- `measures_eval_email_contract` — deprecated email contract residue
- old inactive evaluation residue if active flag still permits public discovery

Do not broadly deactivate all residue in this OAR.

Do not mutate:

- MAP commerce contracts
- payment tables
- Marble MAP contracts
- SEAT hold/release state
- Crystal
- Lapis
- SEO/social routes
- MRM structures

### 3. Preserve tables/records needed for migration

Preserve existing tables that may support carry-forward:

- `src_intake_request`
- `iis_eval_gate1_capture`
- assessment result structures
- MAP commerce contract tables

If both `src_intake_request` and `iis_eval_gate1_capture` exist, inspect their columns and choose the least-drift durable write path.

Preferred result:

- assessment/contact carry-forward writes to the table intended for SRC/intake continuity.
- if `src_intake_request` is fit for purpose, use it.
- if `iis_eval_gate1_capture` is the current capture table and `src_intake_request` requires later refactor, write capture there and bind/derive SRC reference explicitly.

Do not create new MRM tables.

### 4. Seat post-assessment contact capture

Insert or activate contact capture after assessment value is computed.

Required sequence:

AI Operations Assessment  
→ environment score computed  
→ circuit identification computed  
→ contact capture appears  
→ contact submit creates durable carry-forward  
→ passage autoloads

Required fields:

- organization name
- contact name
- contact email
- current AI usage if not already persisted
- assessment result reference
- environment score
- circuit identification

The contact surface must not appear before assessment completion.

### 5. Create durable SRC/OAR1 carry-forward on contact submit

On contact submission, create durable carry-forward state.

Minimum carry-forward record must include:

- assessment_result_id or equivalent
- organization_name
- contact_name
- contact_email
- current_ai_usage
- environment_score
- circuit_identification
- selected assessment indicators where available
- source_surface = measures_assessment
- passage_surface = obsidian_to_marble_passage_video
- destination_surface = map_integrity_governance or marble_pathway_reveal legacy alias
- state = carried_forward or ready_for_passage
- created_at

Create OAR1 trace or OAR1-equivalent record attached to the carry-forward.

OAR1 fields must resolve conceptually to:

Objective:
Carry completed assessment standing into governed review.

Action:
Assessment result computed; contact submitted; durable carry-forward created; assessment standing bound for passage.

Result:
Assessment standing ready for MAP circuit review.

If the system has an existing OAR logging table, write to it. If not, create only the minimum durable trace required by existing schema and report the missing formal OAR table as a gap.

### 6. Autoload passage after contact submit

After successful contact submission and durable carry-forward creation:

- do not show the long evaluation report
- do not require a separate extra review click before passage
- autoload or navigate to `obsidian_to_marble_passage_video`
- pass carry-forward reference through route/session safely

The passage should receive enough state to continue to Marble without relying only on component-local `evalReport`.

### 7. Correct passage copy

Update public copy for the post-contact passage to:

Assessment received.

Your result has been recorded and matched to a structured review path.

The next page will present the recommended next step and the action available for your organization.

CTA, if needed:

Continue

Do not include:

- MAP explanation beyond what media already carries
- chamber language
- internal material naming
- SRC/OAR1
- schema terms
- “Pathway Reveal”
- long report language
- generic helpful suggestions language

The passage carries the user from assessment submission into the next actionable surface without exposing internal mechanics.

### 8. Ensure Marble receives durable carry-forward reference

When transition completes, the Marble-side surface must be able to resolve from durable carry-forward state.

Until the next Marble hardening OAR, `marble_pathway_reveal` may remain the legacy route handler.

Required interim behavior:

- receive assessment/carry-forward reference
- resolve environment score
- resolve circuit identification
- resolve current AI usage where available
- load correct MAP circuit contract using DB contract authority
- do not rely solely on ephemeral component session state if durable ID exists

### 9. Preserve MAP and SEAT boundaries

This OAR does not harden Marble semantics fully. It must preserve:

- existing MAP pricing
- existing MAP commerce contracts
- Stripe checkout boundary
- payment opens MAP work only
- MAP deliverables/resolution are still future governed completion requirement
- SEAT remains held
- c3 Key remains held
- wallet remains held
- certification/registered system/DAO remain held

### 10. Do not introduce MRM yet

MRM — Measures Relational Management — is valid future architecture but is explicitly held.

Do not create:

- `mrm_organizations`
- `mrm_contacts`
- `mrm_relationships`
- `mrm_communication_events`
- `mrm_confirmation_events`
- `mrm_stage_history`

Those structures come after Obsidian/Marble seam stability.

## EXECUTOR MAY

- inspect `src_intake_request`
- inspect `iis_eval_gate1_capture`
- inspect existing assessment result/capture tables
- inspect runtime assessment result handling
- inspect `MeasuresRegistryRuntimeRegistered.tsx`
- deactivate narrowly scoped deprecated residue
- add post-assessment contact capture if missing
- write carry-forward record after contact submit
- write OAR1 trace if table exists
- add minimal API/server action if needed for DB write
- update passage copy
- autoload passage after contact submit
- pass durable carry-forward reference forward
- run build
- write OAR1

## EXECUTOR MAY NOT

- create MRM
- create broad new CRM structures
- change MAP pricing
- change Stripe checkout behavior
- configure Stripe webhook
- activate SEAT
- activate c3 Key
- activate wallet
- touch Crystal
- touch Lapis
- touch SEO/social route pages
- broadly deactivate all orphaned records
- delete records without hold/deprecation review
- expose internal chamber/material/schema/SRC/OAR language publicly
- treat payment as MAP completion
- treat MAP payment as SEAT release
- rely on frontend-only state as the durable carry-forward authority

## VALIDATION

Return proof:

1. Deprecated `measures_eval_email_contract` is removed from active public/runtime use.
2. Dangerous public-boundary residue is deactivated only where tightly scoped.
3. No broad residue cleanup occurred outside this OAR.
4. AI Operations Assessment still renders before contact capture.
5. Current AI usage dropdown remains part of assessment flow.
6. Environment score is computed before contact capture.
7. Circuit identification is computed before contact capture.
8. Contact capture appears only after assessment completion.
9. Contact fields include organization name, contact name, and contact email.
10. Contact submit writes durable carry-forward state.
11. Carry-forward state includes environment score and circuit identification.
12. Carry-forward state includes contact information.
13. SRC or SRC-equivalent record is created or updated.
14. OAR1 trace or OAR1-equivalent record is created or missing formal OAR table is reported.
15. Passage autoloads after successful contact submit.
16. Passage copy matches approved copy.
17. Long public evaluation report is not shown in the transition.
18. Marble-side surface receives durable carry-forward reference or can resolve it.
19. Correct MAP contract still resolves from circuit identification.
20. MAP pricing remains unchanged.
21. Stripe checkout remains unchanged.
22. SEAT remains held.
23. c3 Key/wallet remain held.
24. Crystal and Lapis unchanged.
25. MRM not introduced.
26. Build passes.
27. OAR1 written.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_deactivate_deprecated_eval_residue_and_seat_obsidian_to_marble_carry_forward_v1.meta.md

## CLOSE

Obsidian identifies.  
Contact creates accountable continuity.  
SRC carries.  
OAR1 traces.  
Passage confirms.  
Marble receives.

This OAR stitches the Obsidian-to-Marble seam without expanding into MRM, Crystal, Lapis, SEO, Stripe webhook, or SEAT activation.
