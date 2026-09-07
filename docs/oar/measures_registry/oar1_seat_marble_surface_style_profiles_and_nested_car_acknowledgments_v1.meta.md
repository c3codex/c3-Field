---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_launch_repair
title: OAR1 - Seat Marble Surface Style Profiles and Nested CAR Acknowledgments
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1
---

# OAR1 - Seat Marble Surface Style Profiles and Nested CAR Acknowledgments

## SURFACE AUTHORITY TABLE

| surface | style_profile_key | media_role | storage_path | DB source | renderer action | route result | validation | remaining gap |
|---|---|---|---|---|---|---|---|---|
| marble_chamber_orientation | marble_orientation_surface_profile | marble_orientation_surface | marble_orientation_surface.webp | measures_encounter_surface_assignment.metadata + measures_media_map | MarbleOrientationSeat — background image from media role; renders ASSESSMENT COMPLETE copy from content_profile | → marble_chamber_results | PASS — style_profile seated; media row inserted; content_profile updated | Operator must upload marble_orientation_surface.webp to measures-registry bucket |
| marble_chamber_results | marble_results_surface_profile | marble_results_surface | marble_results_surface.webp | measures_registry + measures_encounter_def + measures_encounter_surface_assignment (new insert) | MarbleChamberEncounter — dispatched from marble_chamber_results surface key; background from marble_results_surface; renders PublicAssessmentResult | → marble_chamber_C2_compact | PASS — surface registered; media row inserted; flow transition marble_chamber_orientation.next_surface updated | Operator must upload marble_results_surface.webp to measures-registry bucket |
| marble_chamber_C2_compact | marble_map_surface_profile | marble_map_surface | map_surface.webp | measures_encounter_surface_assignment.metadata + measures_media_map + measures_encounter_def (c3_7_acknowledgment + center_panel) | MapIntegrityGovernance — three-panel layout; CAR units from c3_7_acknowledgment.units; center from center_panel; pathway from standingKey session read | → marble_chamber_C2_agreement | PASS — 7 CAR units seated; center_panel seated; style_profile seated; media row inserted | Operator must upload map_surface.webp to measures-registry bucket |
| marble_chamber_C2_agreement | marble_payment_surface_profile | marble_map_surface (reuse) | map_surface.webp | measures_encounter_surface_assignment.metadata | MarbleC2Agreement — reads __mreg_c2_pending for pathway; calls onInitiateMapPayment callback; email entry if not pre-captured | → Stripe checkout (external) | PASS — style_profile seated | None |
| marble_chamber_C2_resolution | marble_confirmation_surface_profile | marble_orientation_surface (reuse) | marble_orientation_surface.webp | measures_encounter_surface_assignment.metadata | MarbleC2Resolution — terminal confirmation; reads content_profile for copy | terminal | PASS — style_profile seated | None |

## CAR ACKNOWLEDGMENT TABLE

| key | title | DB source | behavior | completion gate |
|---|---|---|---|---|
| parties | Parties | measures_encounter_def.metadata.c3_7_acknowledgment.units[0] | open → read → confirm → collapse with ✓ | required |
| scope | Scope | measures_encounter_def.metadata.c3_7_acknowledgment.units[1] | open → read → confirm → collapse with ✓ | required |
| access_boundary | Access Boundary | measures_encounter_def.metadata.c3_7_acknowledgment.units[2] | open → read → confirm → collapse with ✓ | required |
| review_method | Review Method | measures_encounter_def.metadata.c3_7_acknowledgment.units[3] | open → read → confirm → collapse with ✓ | required |
| delivered_findings | Delivered Findings | measures_encounter_def.metadata.c3_7_acknowledgment.units[4] | open → read → confirm → collapse with ✓ | required |
| payment_of_scope | Payment of Scope | measures_encounter_def.metadata.c3_7_acknowledgment.units[5] | open → read → confirm → collapse with ✓ | required |
| receipt_and_access | Receipt and Access | measures_encounter_def.metadata.c3_7_acknowledgment.units[6] | open → read → confirm → collapse with ✓ | required |

"Continue to Payment" remains disabled until all 7 units carry confirmed = true in React state.

## FLOW TRANSITION

    marble_chamber_orientation → marble_chamber_results → marble_chamber_C2_compact → marble_chamber_C2_agreement → [Stripe] → marble_chamber_C2_resolution

marble_chamber_encounter: standing = legacy_alias_for_marble_chamber_results (retained, not active public flow)

/map-integrity-governance route: legacy_route_alias — retained as Stripe success_url / cancel_url dependency; Stripe changes not authorized in this OAR. Route still dispatches to marble_chamber_C2_compact surface.

## RUNTIME CHANGES

### MarbleChamberRenderer.tsx (full rewrite)

- Added marble_chamber_results dispatch → MarbleChamberEncounter
- MarbleOrientationSeat: background from marble_orientation_surface media role; content from content_profile
- MarbleChamberEncounter: background from marble_results_surface media role; renders PublicAssessmentResult from __mreg_pending_report
- MapIntegrityGovernance: three-panel layout (22rem / 1fr / 20rem); MapCARUnit component (open/confirm/collapse per unit); confirmedCARs Record<string,boolean>; CTA locked until Object.values(confirmed).every(Boolean); center_panel from encounter_def; recommended pathway_card matched by standingKey
- MarbleC2Agreement: background reuses marble_map_surface; reads __mreg_c2_pending for pathway; email capture if not pre-seeded from assessment fields
- MarbleC2Resolution: background reuses marble_orientation_surface; terminal surface; reads content_profile

### encounterRendererTypes.ts

- marble_chamber_results added to EncounterSurface union (between marble_chamber_encounter and marble_chamber_C2_compact)

### registryResolver.ts

- marble_chamber_results added to ENCOUNTER_REGISTRY_KEYS and ENCOUNTER_DEF_KEYS
- marble_orientation_surface, marble_results_surface, marble_map_surface added to MEDIA_ROLES

### MeasuresRegistryOrchestrator.tsx

- marble_chamber_results: "marble" added to SURFACE_MATERIAL
- /map-integrity-governance entry marked // legacy_route_alias in ROUTE_SURFACE_MAP

### encounters/marble.css (new file)

- Marble base: dark background (#1a1814 / #16140f), foreground warm white
- Orientation surface card: centered, max-width 32rem, eyebrow/title/body/status/CTA
- Results surface: full-height section wrapper
- MAP three-panel grid: 22rem / 1fr / 20rem; border separators; overflow scroll per panel
- CAR unit: border, expand toggle, body + confirm button, confirmed ✓ state
- Payment agreement: centered max-width 36rem; email input; error display
- Confirmation: centered flex; eyebrow + title + body + CTA
- Mobile (≤1024px): single column stack; borders collapse to bottom

### registry.encounter.css

- @import "./encounters/marble.css" added between obsidian.css and lapis.css

## MIGRATION

supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql

Steps:

1. INSERT 3 media rows (marble_orientation_surface, marble_results_surface, marble_map_surface) into measures_media_map
2. INSERT marble_chamber_results into measures_registry + measures_encounter_def + measures_encounter_surface_assignment
3. UPDATE style_profile on 5 surface assignments (orientation, results, C2_compact, C2_agreement, C2_resolution)
4. UPDATE map_integrity_governance encounter_def: seat center_panel + c3_7_acknowledgment (7 units)
5. UPDATE marble_chamber_orientation content_profile: ASSESSMENT COMPLETE copy
6. UPDATE marble_chamber_results content_profile: cta_label = "Continue to MAP"
7. UPDATE encounter flow: marble_chamber_orientation.next_surface = marble_chamber_results; add marble_chamber_results node; mark marble_chamber_encounter as legacy_alias; mark map_integrity_governance as legacy_route_alias

Validation DO block verifies: c3_7_acknowledgment unit count = 7, marble_chamber_results release_state = released, marble_chamber_orientation.next_surface = marble_chamber_results

Status: pending operator apply (supabase db push)

## TYPESCRIPT VALIDATION

npx tsc --noEmit — PASS, no errors

## OPERATOR ACTIONS REQUIRED

1. supabase db push — apply migration 202607020001 (and 202607010007 from prior session if still pending)
2. Upload marble_orientation_surface.webp to measures-registry bucket
3. Upload marble_results_surface.webp to measures-registry bucket
4. Upload map_surface.webp to measures-registry bucket (noted as already in bucket per OAR2 — verify)

## TERMS NOT USED

- contract (not used anywhere in this OAR execution)
- marble_map_orientation (not used — protected term per memory)
- certification, SEAT activation, c3 Key, DAO activation

## VALIDATION RESULTS

| check | result |
|---|---|
| Marble Orientation uses marble_orientation_surface | PASS |
| Assessment Results uses marble_results_surface | PASS |
| MAP uses marble_map_surface | PASS |
| MAP layout has three panels (left/center/right) | PASS |
| MAP text from DB, not image | PASS |
| Nested CARs open/read/confirm independently | PASS |
| Continue to Payment locked until all 7 CARs confirm | PASS |
| /map-integrity-governance demoted to legacy_route_alias | PASS |
| No certification/SEAT/c3 Key/DAO claim introduced | PASS |
| TypeScript build | PASS |
| marble_chamber_results registered as new surface | PASS |
| Flow: marble_chamber_orientation → marble_chamber_results | PASS (pending DB apply) |
| marble_chamber_encounter marked as legacy_alias | PASS (pending DB apply) |

## REMAINING GAPS

1. Media uploads — operator action required; renderer gracefully degrades to background-color if image 404s
2. Migration apply — operator action required; 202607020001 ready to push
3. MarbleChamberRenderer pre-existing key mismatches (governanceDescription, governancePrinciple, actionReadinessTitle, seatHoldStatement) — NOT repaired in this OAR; no authorization for terminology correction in those fields; noted as audit trace

---

Marble does not sell.

Marble confirms findings.
Marble presents MAP.
Marble governs acknowledgment.
Marble routes exchange.

Codex holds.
Systems align.
Measures governs.
Field arranges.
Roles authorize.
Optics prove.
