---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_audit
title: OAR2 — Runtime Audit: Obsidian Eval Report and Marble Route Binding
status: approved_for_execution
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  executor: cody_or_claude
  src: renderer
tags:
  - oar2
  - measures-registry
  - runtime-audit
  - obsidian
  - marble
  - eval-report
  - marble-pathway-reveal
  - route-binding
  - media-map
  - style-contract
  - no-mutation
---

# OAR2 — Runtime Audit: Obsidian Eval Report and Marble Route Binding v1

## OBSERVED

Deploy succeeded.

Live QA shows:

- Eval report loads, but Obsidian styling/media contract is not visibly applied.
- Footer/content frame appears inconsistent with intended Obsidian evaluation result surface.
- Begin Pathway Review exists.
- Marble pathway reveal route loads a large visual chamber surface instead of the expected MarbleCommerceDirectory content.
- Marble route appears to carry old chamber/codexstone-style assumptions.
- Passage/content behavior needs review and rewrite.
- Auto-advance / continue behavior is not confirmed.

Current affected routes:

- https://measuresregistry.com/?surface=measures_assessment
- https://measuresregistry.com/?surface=marble_pathway_reveal

## ALIGNED

This is an audit OAR, not a mutation OAR.

Executor must inspect before changing.

No assumptions from screenshots may become runtime fixes until verified against:

- DB records
- runtime handlers
- route registry
- media map
- style contract consumption
- transition rules
- deployed Cloudflare behavior

Frontend remains renderer only.

Codex / contract state remains authority.

## ROUTED

### 1. Audit Obsidian eval report runtime

Check:

- which component renders the final eval report
- whether obsidian_eval_result_surface_visual_v1.webp resolves from measures_media_map
- whether --registry-obsidian-eval-result-visual is present in live DOM/style
- whether CSS selectors consume that variable
- whether legacy report shell CSS overrides Obsidian contract
- whether footer/header frame is expected or bleed
- whether report content comes from Codex/contract or inline runtime copy

Return finding:

obsidian_eval_report_status =
- contract_consumed
- contract_seated_not_consumed
- missing_media_map
- legacy_style_override
- hardcoded_report_shell

### 2. Audit Marble Passage route

Check the full path:

measures_assessment result
→ Begin Pathway Review
→ obsidian_to_marble_passage_video
→ marble_pathway_reveal

Verify:

- whether registered Marble Passage still exists
- whether passage video/content loads
- whether passage copy is current or stale
- whether passage has continue control
- whether passage has auto-advance behavior
- whether passage routes to marble_pathway_reveal

Return finding:

marble_passage_status =
- valid_registered_passage
- stale_copy
- missing_continue
- missing_auto_advance
- wrong_target
- bypassed

### 3. Audit Marble Directory route binding

Check:

- which handler owns marble_pathway_reveal
- whether MarbleCommerceDirectory is imported
- whether MarbleCommerceDirectory is mounted at marble_pathway_reveal
- whether a legacy visual-only surface overrides it
- whether codexstone / Measures of Inanna logic is bleeding into Measures Registry
- whether old chamber renderer still handles marble_pathway_reveal
- whether MAP contracts are loaded by the route

Return finding:

marble_directory_status =
- directory_mounted
- handler_not_mounted
- legacy_visual_override
- wrong_surface_key
- codexstone_bleed
- db_contract_missing

### 4. Audit MAP commerce contract read path

Check:

- map_commerce_contracts table exists
- three MAP contracts exist
- amount_usd resolves from DB
- applicable_standing_keys match eval results
- payment action appears only for recommended circuit
- Stripe checkout endpoint is callable
- frontend does not render static Stripe links

Return finding:

map_contract_status =
- valid
- missing_contracts
- standing_key_mismatch
- payment_action_missing
- frontend_hardcode_detected

### 5. Audit deployed API functions

Check deployed routes:

- POST /api/map/create-checkout-session
- POST /api/stripe/webhook
- GET /api/map/payment-status/:map_order_id

Return:

api_route_status =
- reachable
- deployed_but_env_missing
- not_deployed
- route_mismatch

Do not run a live charge unless explicitly approved.

### 6. Audit forbidden leakage

Search runtime/source for public leakage:

- C1
- C2
- C3
- Direct
- Mapped
- Federated
- SEAT pricing
- c3 Key issuance
- wallet connect
- Registry Certification
- Registered System
- DAO
- 33x3x1
- codexstone
- Measures of Inanna handler bleed

Return exact files/locations if found.

## EXECUTOR MAY

- inspect source
- inspect DB
- inspect deployed route behavior
- run local build
- run grep/search
- return route/component mapping
- return audit findings
- recommend corrective OAR scope

## EXECUTOR MAY NOT

- change runtime
- rewrite copy
- modify DB
- change CSS
- change route handlers
- activate Stripe
- run payment
- touch Lapis
- touch SEO/socials
- activate c3 Key/SEAT/wallet

## VALIDATION OUTPUT REQUIRED

Return:

1. active component for measures_assessment eval result
2. active media key for eval result
3. whether CSS variable is consumed
4. active component for marble_pathway_reveal
5. whether MarbleCommerceDirectory is mounted
6. whether codexstone/old marble handler bleed exists
7. active route sequence from eval result to Marble
8. MAP contract read status
9. deployed API route status
10. forbidden leakage findings
11. recommended corrective OAR2 title

## EXPECTED RESULT

No fix yet.

Expected closeout:

docs/oar/measures_registry/oar1_runtime_audit_obsidian_eval_report_and_marble_route_binding_v1.meta.md

Then write the corrective OAR based on findings.

## CLOSE

Clean sequence:

1. Runtime audit OAR.
2. Corrective runtime/style/route OAR.
3. Deploy verification.
4. Chamber-set registration closeout.
5. Lapis / SEO / socials.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Executor audits from OAR2 only.
src renders seated state only.
