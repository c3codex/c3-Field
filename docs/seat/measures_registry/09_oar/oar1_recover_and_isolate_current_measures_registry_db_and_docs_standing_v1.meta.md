---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_recovery_and_isolation
title: OAR1 - Recover and Isolate Current Measures Registry DB and Docs Standing v1
status: completed_with_isolation_held
version: v1
operator: op044
system: measures_registry
source_oar2: docs/seat/measures_registry/09_oar/oar2_recover_and_isolate_current_measures_registry_db_and_docs_standing_v1.meta.md
completed_at: 2026-06-15
db_access_standing: partial_read_only_anon
db_mutation: false
frontend_mutation: false
file_deletion_or_rename: false
route_activation: false
publishing_posting_scheduling_or_upload: false
payment_map_seat_crystal_seat_c3_key_field_access_activation: false
recommended_isolation_path: docs/seat/measures_registry_isolated/
---

# OAR1 - Recover and Isolate Current Measures Registry DB and Docs Standing v1

## Result

Completed within the saved OAR2 audit boundary.

Measures Registry docs and live DB-readable standing were recovered and classified without mutation. The recovered standing is mixed. Current package records consistently hold registration and downstream activation, while several live DB rows remain released, callable, or active for commerce, conversion, payment, SEAT-labelled, legacy Epigraph, and publication surfaces.

No recovered surface is promoted to `launch_active` by this audit. Candidate surfaces require operator confirmation and a later seating decision.

The final isolation folder was not created.

## Search Coverage

### Docs folders searched

- `docs/seat/measures_registry/`
- all numbered package folders from `00_index/` through `11_style_contracts/`
- `docs/working/measures_registry_site_review_v1/`
- `docs/oar/`
- `docs/initiatives/`
- `docs/source_authority/`
- `docs/_source/`

The bounded SEAT package contained 64 files at audit time:

| Folder | Files |
| --- | ---: |
| `00_index` | 3 |
| `01_contracts` | 5 |
| `02_encounters` | 3 |
| `03_chamber_directories` | 4 |
| `04_integrations` | 6 |
| `05_automation` | 5 |
| `06_runtime_surfaces` | 5 |
| `07_media_assets` | 5 |
| `08_mrm_contact_memory` | 3 |
| `09_oar` | 11 before this closeout |
| `10_validation` | 4 |
| `11_style_contracts` | 9 |

The wider docs search found 865 files with Measures Registry terms or related recovery references, concentrated in `docs/oar`, `docs/seat`, and `docs/working`.

### DB and reference locations searched

- `.env`
- `.env.cloudflare`
- `.env.local`
- `supabase/migrations/`
- repo SQL and Supabase client references
- live public Supabase REST read models using the configured anonymous key
- `measures_registry`
- `measures_encounter_def`
- `measures_media_map`
- `measures_design_token`
- `measures_publication_registry`
- `measures_publication_dispatch`
- `map_commerce_contracts`
- `measures_publication_subscription_capture`

## DB Access Standing

`partial_read_only_anon`

The configured anonymous project key allowed live read-only inventory. No service-role credential was present in the inspected repo environment, so admin schema inspection, policy inspection, hidden-row completeness, and privileged metadata verification were unavailable.

No RPC or write operation was executed.

## Docs Inventory

| Surface | Recovered standing | Classification |
| --- | --- | --- |
| SEAT package index and manifest | review evidence; registration not granted | held |
| landing signal and Epigraph contract docs | route behavior recorded; live binding still pending revalidation | candidate / unclear |
| AI Operations Assessment docs | Lapis context plus Obsidian assessment distinction preserved | candidate |
| chamber directory docs | Lapis released evidence; Obsidian and Crystal held; Marble explicitly held by package | held / candidate |
| unDrifted publication and social docs | article/dispatch contracts exist; execution remains held | candidate / held |
| Our Story source and clip docs | full video and exported review derivatives exist; launch selection absent | held |
| Paragraph integration docs | registry/export contract only; publish authority absent | held |
| MRM/contact-memory docs | governance requirements exist; persistence/read model incomplete | unclear / held |
| validation and style contracts | review surfaces only; no runtime mutation authority | held |
| working site review package | copy-only mixed review evidence | prior working surface |

## Live DB Inventory

| DB area | Read-only result | Classification |
| --- | --- | --- |
| `measures_registry` | readable; 111 rows reported by count inventory | mixed |
| `measures_encounter_def` | readable; active encounter definitions present | mixed |
| `measures_media_map` | readable; 30 active mappings | candidate / held |
| `measures_design_token` | readable; 52 active Measures Registry tokens | candidate |
| `measures_publication_registry` | 2 published rows: `structural_drift`, `undrifted` | mixed |
| `measures_publication_dispatch` | 2 published dispatch rows | candidate / drift review |
| `map_commerce_contracts` | 3 rows with `release_state=active` | drift |
| `measures_publication_subscription_capture` | 0 rows | held / absent runtime evidence |

### Key registry rows recovered

| Registry key | Live state | Classification |
| --- | --- | --- |
| `measures_registry_runtime` | released, callable, active | candidate |
| `landing_intro_video` | released, callable, active | candidate |
| `lapis_directory` | released, visible, active | candidate |
| `obsidian_directory` | held, visible, active | held |
| `marble_directory` | released, visible, active | drift against package hold until reconciled |
| `crystal_directory` | held, visible, active | held |
| `epigraph` | released, encounterable, typed as encounter | drift |
| `map_integrity_governance` | released, callable, active | held conflict / drift review |
| `cohort_conversion_encounter` | released, callable, active | drift |
| `reserve_seat` | released, callable, active | held conflict / drift review |
| `seat_hold_notification_review` | released, gated, active | held |
| `systems_offering` | released, callable, active | held conflict / drift review |
| `foundation_offering` | released, callable, active | held conflict / drift review |
| `structural_drift_publication` | released, callable, active | deprecated public-route trace / drift review |

### Key encounter rows recovered

Active encounter definitions include `about_measures_registry`, `crystal_chamber`, `epigraph_view`, `eval_passage`, `marble_pathway_reveal`, `measures_phases_reveal`, `phase_payment`, `reserve_seat`, `structural_drift_publication`, `structure_passage`, and `structured_eval`.

`crystal_chamber` is a chamber encounter. It is not evidence that Crystal Seat is an encounter.

No exact `crystal_seat` registry key was returned by the public registry read. No `our_story` campaign media row was returned by the exact campaign-key read.

## Recovered Work

- bounded Measures Registry SEAT review package;
- direct landing and landed-signal contract records;
- AI Operations Assessment contract and encounter evidence;
- Lapis, Obsidian, Marble, and Crystal directory evidence;
- unDrifted publication and dispatch records;
- Paragraph registry/export contract evidence;
- social distribution contracts with execution holds;
- Our Story full-video source contract, timestamp planning, and exported review derivatives;
- active media mappings and design-token rows;
- MRM/contact-memory governance requirements;
- copy-only Measures Registry site review package;
- live registry, encounter, publication, dispatch, and commerce rows.

## Classification Summary

### Launch active

None confirmed by this audit. The OAR2 requires operator confirmation before any recovered surface may inform current launch docs.

### Candidates

- `measures_registry_runtime`;
- direct landing and landing-intro surface;
- AI Operations Assessment and its Lapis-to-Obsidian distinction;
- `lapis_directory`;
- `structure_passage`, `eval_passage`, and `structured_eval`, subject to route reconciliation;
- `undrifted` publication and its existing dispatch records, subject to issue and launch selection;
- active Measures Registry design tokens and media mappings, subject to ownership and placement review;
- About Measures Registry content, subject to current content standing.

### Prior working surfaces only

- `docs/working/measures_registry_site_review_v1/` and its copied runtime conflicts;
- source OAR2 drafts and audit packages not seated as current authority;
- timestamp proposals and clip-review manifests;
- social and Paragraph capability/contract planning surfaces;
- controlled MAP and circuit requirement manifests.

### Held

- current SEAT package registration;
- Crystal Seat / final confirmation;
- Crystal directory release;
- Obsidian directory release-state reconciliation;
- Marble/MAP activation;
- payment and governed commerce execution;
- conversion and certification;
- c3 Key assignment;
- Field access;
- c3 back office;
- Paragraph draft/publish execution;
- social posting or scheduling;
- Our Story campaign selection, upload, or posting;
- MRM/contact persistence and lifecycle authority.

### Deprecated

- Structural Drift as a governing public section; retain publication/history as trace until separately disposed;
- `connect_src` as a pre-assessment route where superseded by current assessment flow;
- older five-question assessment language where superseded by the seated assessment contract;
- `marble_pathway_reveal` as a legacy alias where current MAP integrity-governance naming governs.

### Drift and conflicts

- three active `map_commerce_contracts` rows conflict with the package's inactive payment/MAP standing;
- released/callable `cohort_conversion_encounter` conflicts with held conversion;
- released/callable `reserve_seat`, offering, and MAP rows can imply activation not granted by the package;
- `epigraph` and `epigraph_view` are DB-classified as encounters, while current architecture defines Epigraph as landed-signal behavior rather than an independent mandatory runtime;
- `marble_directory` is live released while the SEAT package holds Marble activation;
- `structural_drift_publication` remains released/callable while Structural Drift is no longer allowed to govern the current public structure;
- active media campaign keys are media organization evidence, not social campaign activation;
- working manifests place `Crystal_Seat` inside chamber-content structures, creating classification ambiguity;
- the public DB mixes Measures Registry, Inanna, publication, commerce, and legacy surfaces without a recovered isolated ownership read model.

### Unclear

- final direct landing launch selection and exact live transition chain;
- whether unDrifted Issue 01 is the selected current launch issue;
- full privileged route/transition metadata not visible to anonymous reads;
- hidden or RLS-restricted rows not visible to the public read model;
- external account verification for X, Instagram, LinkedIn, Facebook, Paragraph, and Buffer;
- final Our Story clip selection and campaign placement;
- exact MRM persistence and registered-contact lifecycle.

## Audit Questions

1. **What Measures Registry docs currently exist?** A 64-file bounded SEAT package plus extensive OAR and working review history. The package spans indexes, contracts, encounters, chamber directories, integrations, automation, runtime surfaces, media, MRM/contact memory, OARs, validation, and style contracts.
2. **What DB or DB-reference surfaces exist?** Live public registry, encounter, media, design-token, publication, dispatch, commerce, and subscription-capture tables, plus migrations, SQL, clients, and environment references.
3. **What appears to be a current launch candidate?** The runtime, direct landing, landing media, assessment flow, Lapis context, unDrifted publication, and registered media/style rows, all pending operator confirmation and reconciliation.
4. **What is prior working surface only?** The site review copy package, proposal/timestamp surfaces, capability contracts, and unseated source OAR traces.
5. **What is held?** Registration and every downstream activation listed in the Held section.
6. **What is deprecated?** Structural Drift as governing public structure, superseded pre-assessment/assessment language, and legacy aliases retained only as trace.
7. **What conflicts with current architecture?** Active commerce/conversion/SEAT-labelled rows, Epigraph encounter typing, released Marble standing, and mixed-system DB ownership.
8. **What files imply Crystal Seat is an encounter?** `docs/working/measures_registry_site_review_v1/04_chambers/chamber_contents_manifest_v1.meta.md` and `docs/oar/oar2_expand_dev_shell_transfer_package_into_measures_registry_full_site_working_folder_v1.meta.md` place `Crystal_Seat` within chamber-content structures. These are working/requirement traces and must not govern final standing.
9. **What files imply social activation?** Social distribution and automation OARs use account-active or campaign terminology, while their execution boundaries hold submission, scheduling, and posting. Active DB media campaign keys also risk false implication.
10. **What files imply Paragraph publishing authorization?** Paragraph API/export and unDrifted distribution records describe registry/export capability. None grants current draft or publish execution.
11. **What files imply MAP/payment/SEAT/c3 Key/Field access activation?** Circuit, commerce, offering, and renderer records contain those terms, but the package manifest and working indexes explicitly mark them inactive. Live active commerce and released callable rows are conflicts, not authorization.
12. **What docs are missing before isolation completes?** A canonical recovered index, row-disposition matrix, launch decision, route/transition decision, publication/issue decision, Crystal Seat final-standing contract, MRM lifecycle contract, and privileged DB evidence report.
13. **What DB references are missing before isolation completes?** A canonical ownership/system key, privileged complete-row inventory, route/transition authority mapping, contact/MRM lifecycle mapping, explicit final-confirmation/Crystal Seat row contract, and reconciled release/access disposition for conflicting rows.
14. **Recommended one-folder isolation path?** `docs/seat/measures_registry_isolated/`.
15. **Recommended DB isolation plan?** Build a read-only ownership and disposition manifest first; classify every relevant row by system, authority, replacement, and hold state; reconcile legacy aliases and contradictions; then use a separately authorized mutation OAR for explicit row-by-row changes. Do not delete or mass-disable mixed rows.
16. **Recommended next OAR2?** `OAR2 - Create Measures Registry Isolated Recovery Index and DB Row Disposition Matrix v1`.

## Missing Critical Docs

- `recovered_active_index`
- `recovered_candidate_index`
- `held_surfaces_index`
- `deprecated_surfaces_index`
- `drift_flags_index`
- `db_inventory_report`
- `docs_inventory_report`
- `launch_surface_decision`
- `assessment_to_crystal_circuit_gap_report`
- `isolation_preflight_checklist`
- explicit Crystal Seat final-confirmation contract that cannot be mistaken for an encounter
- canonical route and publication selection decisions

These are recommended future isolation artifacts. They were not created under this audit OAR2.

## Recommended DB Isolation Plan

1. Preserve the current DB unchanged.
2. Produce a complete privileged read-only export of relevant rows and metadata.
3. Add no inferred ownership. Record existing system/registry ownership and mark missing ownership as unclear.
4. Build a row disposition matrix with `keep_current`, `candidate`, `hold`, `legacy_trace`, `conflict`, and `operator_review` recommendations.
5. Reconcile route aliases, Epigraph behavior, publication keys, commerce rows, conversion rows, SEAT-labelled rows, and final-confirmation terminology.
6. Confirm which rows belong to Measures Registry versus Inanna or shared c3 systems.
7. Seat the isolated docs index before any DB mutation.
8. Route any later DB changes through a separate mutation-authorized OAR2 with exact row keys, rollback evidence, and post-change validation.

## Validation

- searched docs folders: pass
- searched DB/reference locations: pass
- live DB access: partial read-only anonymous access
- docs inventory: pass
- DB inventory: pass within public read scope
- recovered work list: pass
- classification table: pass
- candidate list: pass
- held list: pass
- deprecated list: pass
- drift/conflict list: pass
- missing docs and DB references: pass
- recommended isolation path: pass
- recommended DB isolation plan: pass
- recommended next OAR2: pass
- DB mutation: none
- frontend mutation: none
- file deletion or rename: none
- route activation: none
- publishing/posting/upload/scheduling: none
- payment/MAP/SEAT/Crystal Seat/c3 Key/Field access/certification/conversion/back-office activation: none

## Close

Recovery completed. Isolation remains held pending the recommended manifest-first isolation OAR and privileged read-only DB evidence.

Codex holds. Field structures. Measures registers. OAR2 routes. Chazz validates. Cody audits. src remains unchanged.
