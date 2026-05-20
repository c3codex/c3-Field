# DB Source Relation Map + Reconstruction Passage v1

Source OAR2: `docs/oar/process/oar2_db_source_relation_map_reconstruction_passage_v1.meta.md`

## Boundary
This artifact defines DB continuity relations for future reconstruction, transfer, migration, restore, replication, or reseating.

It does not migrate the database.

It does not mutate the database.

It does not expose secrets, service-role credentials, protected execution intelligence, private environment values, or authority-bypassing logic.

## Reconstruction Order
Required passage order:

1. schema relations
2. authority standing
3. registry standing
4. relation continuity
5. release/access standing
6. OAR lineage
7. transition continuity
8. seeded references
9. runtime contracts
10. validation passage

## Source Relation Map
| Relation surface | Required table | Required keys | Parent relation | Dependency relation | Runtime consumer | Seeded reference dependency | Validation requirement | Reconstruction order |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Concordance document authority | `concordance_document` | `document_key` | Codex authority surface | Source alignment and native order | Concordance readback and governance closeout | Source OAR2/OAR1 paths in metadata/source alignment | One document row per authority surface, native order preserved | 2 |
| Concordance version authority | `concordance_version` | `version_key`, `document_key` | `concordance_document.document_key` | Active version per document, recognized trace | Concordance validation helpers | Source OAR2 and OAR1 closeout paths | Active/internal versions reconstructable and not duplicated | 2 |
| Concordance semantic terms | `concordance_term` | `term_key`, `version_key`, `term_label` | `concordance_version.version_key` | Active term standing and visibility | Concordance relation validation and semantic runtime references | Seed Concordance source and OAR expansion records | No duplicate active labels per version | 3 |
| Concordance relations | `concordance_relation` | `relation_key`, `version_key`, `source_ref`, `target_ref` | `concordance_version.version_key` | Scope-neutral relation continuity | Relation readback, audit, governance/system-intel posture relations | Source OAR2 path per relation | No orphan versions; term-key refs resolve where they look seated | 4 |
| Concordance source snapshots | `seeded_source_snapshot` | `snapshot_key`, `version_key`, `source_sha256` | `concordance_version.version_key` | Snapshot evidence, not authority | Governance/system-intel snapshot verification | Local source path and OAR closeout | Snapshot hash and byte size preserved where verified | 8 |
| OAR process instance lineage | `c3_oar_process_instance` | `process_instance_key` | Source OAR2 path | Expected/actual OAR1 and evidence path | `loadOarSpineRegistry`, `OarOperationsConsole`, transition governance engine | `c3_oar_seeded_reference` | Confirmed source standing, evidence/OAR1 presence where required | 6 |
| OAR transition continuity | `c3_oar_transition_event` | `transition_event_key`, `process_instance_key` | `c3_oar_process_instance.process_instance_key` | Append-only transition event continuity | Runtime transition governance engine | Evidence reference per transition | Transition rows have evidence and parent process | 7 |
| OAR seeded references | `c3_oar_seeded_reference` | `seeded_reference_key`, `seeded_reference_path` | Process/OAR source references | Runtime seeded-reference standing | `loadOarSpineRegistry`, seeded validation checks | Source local docs | Seeded reference status is present and visible | 8 |
| Process registry | `system_process_registry` | `process_key` | Governed process identity | Queue process relation | Process registry runtime contract and future queues | Source reference set | Active/draft/paused/retired/blocked status only | 9 |
| OAR execution queue | `system_oar_queue` | `queue_key`, `process_key`, `oar_key` | `system_process_registry.process_key` | Operator-confirmed execution passage | Future governed execution queue and automation bridge compatibility | OAR key/source path | Executing requires operator confirmation and preflight pass | 9 |
| OAR execution evidence | `system_oar_execution_evidence` | `evidence_key`, `queue_key` | `system_oar_queue.queue_key` | Queue closeout evidence | Queue validation and closeout proof | Artifact path/commit hash when present | Closed queue must have evidence | 9 |
| Measures registry standing | `measures_registry` | `registry_key` | Measures registry root | Release/access and encounter records | Measures Registry runtime, Inanna passage runtime | Measures source docs/OARs | Registry keys resolve before encounter/render | 3 |
| Measures release/access standing | `measures_release_state` | registry/release key | `measures_registry.registry_key` | Release cadence and access standing | Measures runtime, transition governance inputs | Registry row | Release/access state permits render only when valid | 5 |
| Measures transition rules | `measures_transition_rule` | transition/rule key | Measures release/access standing | Allowed passage transitions | Measures runtime and passage logic | Registry row and source OAR | Invalid transitions blocked | 7 |
| Runtime contracts | Runtime source modules and DB-backed process tables | table keys plus source module imports | Process and OAR lineage | Read-only derived runtime standing | `transitionGovernanceEngine`, `operatorGatedAutomationBridge`, optics registries | Seeded OAR/process references | Runtime remains readable without fallback authority | 9 |

## Runtime Consumers
- `src/c3_field_convergence/oarSpineRegistry.ts` consumes `c3_oar_process_instance`, `c3_oar_transition_event`, and `c3_oar_seeded_reference`.
- `src/c3_field_convergence/transitionGovernanceEngine.ts` consumes loaded OAR process and transition standing and derives read-only runtime consequence.
- `src/c3_field_convergence/operatorGatedAutomationBridge.ts` consumes transition governance and derives governed propagation eligibility without mutation authority.
- `src/c3_field_convergence/OarOperationsConsole.tsx` renders runtime standing and bridge standing; it does not grant authority.
- Measures runtime surfaces depend on registry, release/access, transition, encounter, and media/provider standing before render.

## Validation Passage
Reconstruction is not valid until validation confirms:

- required tables exist
- required primary/foreign-key continuity exists
- append-only or mutation-prevention triggers exist where required
- no duplicate Concordance active labels
- no orphan Concordance relations
- OAR transition events retain parent process rows
- OAR transition events retain evidence references
- seeded references are present
- queue execution cannot bypass operator confirmation
- closed queue standing requires evidence
- runtime consumer tables remain readable
- frontend, markdown, and snapshots do not become authority

## Source-First Discipline
Future DB movement must begin with this relation map before any migration, restore, reseating, replication, or continuity recovery.

No source relation map means no coherent DB passage.

## Authority Distinction
The relation map describes continuity.

It does not become authority.

Codex remains authority.

The reconstruction passage preserves reseating continuity only.
