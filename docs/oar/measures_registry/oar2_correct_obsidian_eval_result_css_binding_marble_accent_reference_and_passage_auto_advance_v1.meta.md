---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_correction
title: OAR2 — Correct Obsidian Eval Result CSS Binding, Marble Accent Reference, and Passage Auto-Advance
status: approved_for_execution
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_runtime_audit_obsidian_eval_report_and_marble_route_binding_v1.meta.md
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
  - runtime-correction
  - obsidian
  - marble
  - eval-result
  - css-binding
  - media-map
  - passage-auto-advance
  - no-webhook
  - no-lapis
  - no-web3
---

# OAR2 — Correct Obsidian Eval Result CSS Binding, Marble Accent Reference, and Passage Auto-Advance v1

## OBSERVED

Runtime audit executed with no mutation.

Audit findings:

- Obsidian eval result media contract is seated but not visually consumed.
- MarbleCommerceDirectory is correctly mounted.
- Marble visual issue is caused by media map artifact: `marble_accent_reference` points to old codexstone / pre-codex image.
- Obsidian-to-Marble passage route is valid but lacks video auto-advance.
- Stripe/API environment variables remain pending and are not part of this correction.

Audit confirmed:

- `obsidian_eval_result_surface_visual` exists and is active in `measures_media_map`.
- Runtime sets `--registry-obsidian-eval-result-visual`.
- No CSS selector consumes `--registry-obsidian-eval-result-visual`.
- `marble_pathway_reveal` mounts `MarbleCommerceDirectory`.
- `marble_accent_reference` points to `measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp`.
- Passage video has CTA routing but no `onEnded` auto-advance.

## ALIGNED

This is a runtime/style/media correction OAR.

This is not a commerce, webhook, Lapis, SEO, social, or web3 OAR.

Renderer remains DB/media-map driven.

Frontend must not become authority.

Corrective action must address only:

1. Obsidian eval result CSS consumption.
2. Marble accent reference artifact.
3. Marble passage auto-advance.

Do not touch:

- Lapis
- SEO
- socials
- Stripe webhook setup
- Stripe environment variables
- MAP pricing
- MAP contract logic
- c3 Key
- SEAT
- wallet
- DAO
- Registry Certification
- Registered System
- Optics

## ROUTED

### 1. Correct Obsidian eval result visual binding

Use the already-seated runtime CSS variable:

`--registry-obsidian-eval-result-visual`

Apply it to the actual eval result surface rendered by:

- `PublicAssessmentResult`
- `.registry-eval-resolution`
- `.registry-assessment-complete`

Required behavior:

- Eval result surface visibly consumes `obsidian_eval_result_surface_visual_v1.webp`.
- Visual is background/accent only.
- Copy remains DB/contract driven.
- CTA remains DB/contract driven.
- Report findings remain DB/contract driven.
- Scoring remains unchanged.
- Routing remains unchanged.

Do not hardcode image URL.

Consume the CSS variable already set by runtime.

Acceptable selector targets include:

- `[data-material-family="obsidian"][data-chamber-state="result"]`
- `[data-layout-contract="result_gate"]`
- `.registry-eval-resolution.registry-assessment-complete`

Use the selector that matches actual rendered DOM.

### 2. Correct Marble accent reference

Current media map artifact:

- `media_role = marble_accent_reference`
- `storage_path = measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp`

This must not render as the public Marble Directory visual.

Allowed correction:

Option A:

- Replace `marble_accent_reference` with a governed Marble/MAP visual path only if a correct asset is already seated and confirmed.

Option B:

- Set `marble_accent_reference` inactive until a governed visual is seated.

Preferred if no governed Marble asset is confirmed:

- `is_active = false` for `media_role = marble_accent_reference`

Do not invent a new asset path.

Do not use pre-codex, codexstone, or Measures of Inanna visuals in Measures Registry Marble Directory.

Do not alter unrelated media-map entries.

### 3. Add Marble Passage auto-advance

For the registered passage:

`obsidian_to_marble_passage_video`

Add video end behavior:

`onEnded → navigate("marble_pathway_reveal")`

Required behavior:

- video ends → `marble_pathway_reveal`
- CTA click → `marble_pathway_reveal`
- mute control remains available
- registered passage is not bypassed

Do not route directly from eval result to Marble Directory.

Do not bypass the registered Marble Passage.

### 4. Preserve MarbleCommerceDirectory binding

Preserve active route:

`surface=marble_pathway_reveal`
→ `MarbleCommerceDirectory`

Do not replace MarbleCommerceDirectory.

Do not restore image-only chamber entrance.

Do not route to Codexstone chamber.

Do not route to Measures of Inanna surfaces.

Do not route directly to checkout.

## EXECUTOR MAY

- update CSS selectors
- update media map row for `marble_accent_reference`
- add video `onEnded` handler
- run local build
- deploy after correction
- write OAR1

## EXECUTOR MAY NOT

- touch Lapis
- touch SEO/socials
- change MAP prices
- change MAP contracts except marble accent media reference if required
- configure Stripe webhook
- add static Stripe links
- activate c3 Key
- activate SEAT
- activate wallet
- surface Registry Certification
- surface Registered System standing
- use pre-codex / codexstone image as Marble Directory visual
- invent a new media asset path

## VALIDATION

Return proof:

1. CSS selector consuming `--registry-obsidian-eval-result-visual`.
2. Eval result surface visibly uses `obsidian_eval_result_surface_visual_v1.webp`.
3. `marble_accent_reference` no longer points to codexstone / pre-codex asset OR is inactive.
4. `marble_pathway_reveal` still mounts `MarbleCommerceDirectory`.
5. Obsidian-to-Marble passage auto-advances on video end.
6. Manual CTA still routes to `marble_pathway_reveal`.
7. Lapis files unchanged.
8. MAP pricing/contracts unchanged.
9. No c3 Key / SEAT / wallet activation.
10. Build passes.
11. OAR1 written.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_correct_obsidian_eval_result_css_binding_marble_accent_reference_and_passage_auto_advance_v1.meta.md

## CLOSE

This correction resolves runtime consumption and media artifact seams only.

Webhook configuration remains pending and outside this OAR.

Lapis / SEO / socials remain open and outside this OAR.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Executor corrects from OAR2 only.
src renders seated state only.
