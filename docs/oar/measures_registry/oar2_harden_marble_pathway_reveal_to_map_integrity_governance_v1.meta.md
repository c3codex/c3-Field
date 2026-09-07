---
document_type: oar2
authority_level: working
document_scope: measures_registry
title: OAR2 — Harden marble_pathway_reveal to MAP Integrity Governance
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_deactivate_deprecated_eval_residue_and_seat_obsidian_to_marble_carry_forward_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-registry
  - marble
  - map-integrity-governance
  - marble-pathway-reveal
  - carry-forward
  - map-circuit
  - seat-held
  - public-route
---

# OAR2 — Harden marble_pathway_reveal to MAP Integrity Governance v1

## OBSERVED

The Obsidian-to-Marble carry-forward seam has been partially corrected.

Executed OAR1 confirmed:

- deprecated `measures_eval_email_contract` is inactive
- `connect_src` is inactive
- assessment completion now computes environment score and circuit identification before contact capture
- contact submission writes durable carry-forward payload into `measures_iis_eval_gate1_capture.metadata.carry_forward`
- contact submission writes interim `oar1_trace` into `measures_iis_eval_gate1_capture.metadata.oar1_trace`
- passage autoloads after successful contact submission
- long public evaluation report is bypassed
- passage copy now confirms assessment receipt and structured review path
- MAP pricing, Stripe checkout, SEAT, c3 Key, wallet, Crystal, Lapis, and MRM were not touched

Remaining gap:

`marble_pathway_reveal` still receives assessment state through React session/component state. Durable carry-forward exists in the database, but the Marble-side surface does not yet resolve it from the DB by carry-forward ID.

Current Marble opening URL:

`https://measuresregistry.com/?surface=marble_pathway_reveal`

This surface currently has weak context and should harden into the MAP Integrity Governance encounter.

Current required public route:

`/map-integrity-governance`

Correct standing:

- `marble_pathway_reveal` = legacy alias / residue route
- `map_integrity_governance` = correct internal encounter key
- MAP Integrity Governance = public title
- Pre-Deployment MAP / Optimization MAP / Remediation MAP = selected MAP circuit labels

## ALIGNED

Correct public sequence:

Assess the Environment  
→ AI Operations Assessment  
→ assessment result computed  
→ contact captured  
→ durable carry-forward created  
→ receipt passage autoloads  
→ MAP Integrity Governance loads  
→ selected MAP circuit contract renders  
→ payment opens MAP work  
→ MAP deliverables/resolution complete commerce circuit  
→ SEAT releases only after MAP resolution

Correct MAP definition:

MAP = Measure / Audit / Prepare

MAP measures, audits, and prepares the organization for SEAT.

Correct SEAT definition:

SEAT = System Environment Alignment Track

SEAT remains held until MAP deliverables/resolution complete the commerce circuit.

Correct Marble-side function:

MAP Integrity Governance is the public-facing encounter that receives the carried assessment result and presents the selected MAP circuit.

It must:

- resolve durable carry-forward state from DB
- load the correct MAP circuit contract from circuit identification
- personalize the surface using available carried state
- explain that the initial assessment identified a review path
- explain that MAP is not a repeat assessment
- explain why Measures Registry does not provide generic helpful suggestions
- preserve payment and pricing authority in the MAP commerce contract
- preserve SEAT as held until MAP resolution

Public surfaces must not expose:

- Marble
- Obsidian
- chamber
- material names
- chamber directory
- schema
- SRC
- OAR1
- OAR2
- internal route keys
- raw contract JSON
- table names
- c3 Key
- wallet
- DAO
- certification
- registered system

## ROUTED

### 1. Seed or bind `map_integrity_governance`

Create or bind the correct encounter standing:

Internal encounter key:

`map_integrity_governance`

Public title:

`MAP Integrity Governance`

Public purpose:

Presents the selected MAP review path after assessment completion and contact submission.

Material/internal context:

May remain internally assigned to Marble through existing registry/chamber-directory mechanics, but public copy must not expose chamber or material language.

If a full new encounter row is required, seat it in `measures_encounter_def` and/or `measures_registry` according to existing schema patterns.

If a safer first step is to update `marble_pathway_reveal` to carry the correct title and metadata while adding alias support, do that and report remaining migration requirements.

### 2. Treat `marble_pathway_reveal` as legacy alias

Do not keep `marble_pathway_reveal` as the public semantic identity.

Required behavior:

- `marble_pathway_reveal` may remain as a legacy surface alias.
- Public title must resolve as `MAP Integrity Governance`.
- Public route must harden to `/map-integrity-governance`.
- Query route `?surface=marble_pathway_reveal` may continue to resolve during migration.
- Any public copy using “Recommended Governed Pathway,” “Pathway Reveal,” “Marble Directory,” or “Commerce Directory” must be removed or replaced.

### 3. Add or harden public route `/map-integrity-governance`

Seat `/map-integrity-governance` as the public route alias for the MAP Integrity Governance encounter.

Route rule:

`/map-integrity-governance` resolves to the correct DB-seated encounter and must not become an authority surface.

The route must resolve through registry/contract state, not hardcoded copy or component-owned truth.

### 4. Resolve durable carry-forward from DB

The MAP Integrity Governance surface must not depend only on React session state.

It must be able to resolve the carried assessment from durable DB state.

Use the current durable write path:

`measures_iis_eval_gate1_capture.metadata.carry_forward`

Required loaded values:

- organization_name
- contact_name where needed internally
- contact_email where needed internally
- current_ai_usage
- environment_score
- circuit_identification
- continuation_pathway if present
- selected assessment indicators where available
- source_surface
- passage_surface
- destination_surface
- destination_legacy_alias
- state

If a carry-forward ID exists in route/session, use it.

If only session state exists, use session state as temporary support but preserve DB lookup as the governed path.

If neither exists, show a public-safe state:

Assessment context unavailable. Please return to the assessment to continue.

Do not fabricate a MAP circuit when carry-forward state is missing.

### 5. Load the correct MAP circuit contract

Use `circuit_identification` from durable carry-forward to select the correct active MAP commerce contract.

MAP circuit labels:

- Pre-Deployment MAP
- Optimization MAP
- Remediation MAP

The selected contract must resolve from DB authority.

Do not hardcode:

- price
- contract terms
- Stripe product ID
- deliverables
- selected MAP circuit

Expected relationship:

`circuit_identification`  
→ active MAP contract via `applicable_standing_keys` or equivalent  
→ selected MAP circuit  
→ amount / product / payment state from contract table

### 6. Personalize the MAP Integrity Governance surface

The public surface should use carried assessment data without overexposing internal mechanics.

Use available personalization:

- organization name
- environment score
- selected MAP circuit
- current AI usage standing
- three selected assessment indicators if available

Do not show all raw answers.

Preferred structure:

Title:

MAP Integrity Governance

Assessment standing:

Your result has been matched to a structured review path.

Personalized context:

For {{organization_name}}, the assessment result identified:

- Environment score: {{environment_score}}
- Selected review path: {{selected_map_circuit}}
- Current AI usage: {{current_ai_usage}}

Assessment indicators:

Show three concise answer-based indicators where available.

### 7. Explain why this is not “another assessment”

The surface must qualify why MAP follows the assessment.

Approved meaning:

The initial assessment identifies the review path.  
The MAP is not a repeat of the assessment.  
It is the structured review used to measure, audit, and prepare the organization for the System Environment Alignment Track.

Suggested copy:

Your initial assessment identified the review path. The MAP is not a repeat of that assessment. It is the structured review required to measure, audit, and prepare your organization for the System Environment Alignment Track.

### 8. Explain why Measures Registry does not provide generic helpful suggestions

The surface must clarify Measures Registry’s position without sounding dismissive.

Approved meaning:

Helpful suggestions can describe possible improvements, but they do not verify whether an organization has the authority, roles, evidence paths, review ownership, and implementation readiness required for accountable AI use.

Suggested copy:

Measures Registry does not provide generic helpful suggestions from this assessment. Suggestions can describe possible improvements, but they do not verify authority, role boundaries, evidence paths, review ownership, or implementation readiness. The selected MAP is the governed review path for determining what can be acted on responsibly.

### 9. Render selected MAP action

The selected MAP contract should show:

- selected MAP name
- what the MAP reviews
- what the MAP prepares
- deliverables/resolution boundary
- payment action if payment is available
- held SEAT state

Payment action language:

Begin MAP Review

or:

Start Selected MAP

Do not say:

- Complete Integrity Governance
- Open SEAT
- Become certified
- Register system
- Activate c3 Key
- Connect wallet

### 10. Preserve payment and release boundaries

Payment opens MAP work only.

Payment may not:

- complete the commerce circuit
- release SEAT
- issue c3 Key
- activate wallet
- certify anything
- create registered system standing
- create DAO/distribution standing

SEAT release rule:

SEAT releases only after MAP deliverables/resolution complete the commerce circuit.

If deliverables/resolution state does not exist yet, show SEAT as held.

### 11. Preserve existing MAP pricing and Stripe behavior

Do not change:

- MAP prices
- `map_commerce_contracts`
- Stripe product IDs
- checkout endpoint mechanics
- webhook behavior
- payment event schema

If the selected MAP contract cannot resolve, show a safe error and do not offer payment.

### 12. Maintain public/private boundary

No public text may expose:

- `marble_pathway_reveal`
- `map_commerce_contracts`
- `measures_iis_eval_gate1_capture`
- `carry_forward`
- `oar1_trace`
- chamber or material language
- schema/table/view language
- internal route keys
- raw JSON
- SRC/OAR terminology

## EXECUTOR MAY

- inspect `measures_iis_eval_gate1_capture`
- inspect `measures_encounter_def`
- inspect `measures_registry`
- inspect existing route alias behavior
- inspect `map_commerce_contracts`
- inspect `MarbleCommerceDirectory`
- inspect `MeasuresRegistryRuntimeRegistered.tsx`
- seed or update `map_integrity_governance` encounter metadata
- add `/map-integrity-governance` route alias if supported
- update public title/copy for the Marble-side MAP surface
- update runtime to resolve durable carry-forward by ID
- preserve session state as fallback support only
- load MAP contract from durable circuit identification
- run build
- write OAR1

## EXECUTOR MAY NOT

- touch Obsidian assessment scoring
- change contact capture behavior from prior OAR
- change passage copy from prior OAR unless needed for route target
- create MRM
- create new CRM structures
- write to `src_intake_request`
- modify `oar1_log` schema
- change MAP pricing
- change Stripe checkout behavior
- configure Stripe webhook
- activate SEAT before MAP resolution
- activate c3 Key
- activate wallet
- activate certification
- activate registered system standing
- touch Crystal
- touch Lapis
- touch SEO/social landing routes
- restore codexstone or wrong-authority visual assets
- hardcode selected MAP contract or price in frontend

## VALIDATION

Return proof:

1. `map_integrity_governance` encounter/standing exists or `marble_pathway_reveal` is explicitly rebound as its legacy alias.
2. Public title renders as `MAP Integrity Governance`.
3. `/map-integrity-governance` route works or required blocker is reported.
4. `?surface=marble_pathway_reveal` no longer displays obsolete public semantics.
5. MAP surface can resolve durable carry-forward from DB.
6. Direct Marble entry without carry-forward shows safe unavailable state.
7. Organization name renders when available.
8. Environment score renders when available.
9. Selected MAP circuit renders from `circuit_identification`.
10. Current AI usage renders if carried.
11. Three selected assessment indicators render if available; otherwise safe fallback copy appears.
12. Correct MAP contract loads from DB contract authority.
13. Price still resolves from DB contract table.
14. No hardcoded price or selected contract added to frontend.
15. Copy explains the initial assessment identified the review path.
16. Copy explains MAP is not a repeat assessment.
17. Copy explains why Measures Registry does not provide generic helpful suggestions.
18. Payment action opens MAP work only.
19. SEAT remains held until MAP resolution.
20. c3 Key, wallet, certification, registered system, DAO remain held.
21. Public copy exposes no chamber/material/schema/SRC/OAR/table/view/internal route language.
22. Crystal unchanged.
23. Lapis unchanged.
24. Obsidian scoring/contact flow unchanged.
25. MRM not introduced.
26. Build passes.
27. OAR1 written.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_harden_marble_pathway_reveal_to_map_integrity_governance_v1.meta.md

## CLOSE

`marble_pathway_reveal` is residue.  
`map_integrity_governance` is the encounter.  
`/map-integrity-governance` is the public route.  
Durable carry-forward determines the selected MAP.  
MAP opens review.  
MAP resolution releases SEAT.
