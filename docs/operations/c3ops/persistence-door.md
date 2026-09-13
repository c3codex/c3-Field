# c3Ops ME.env Persistence Door

Source: oar2_hang_c3ops_me_env_persistence_door_codex_001, amended by the operator-supplied send.card on 2026-09-13.
Host: c3ops.c3field.online. No other host is routed to this entrance.

## Runtime

- Root: byte-identical governed c3 Tree source and three portals.
- /relational-operations: environment relationship readback.
- /relational-operations/lapzuli: registered Lapzuli routes and encounter history.
- /systems-access: actual active environments, formation, standing, canonical relation and Current.
- /systems-access/current: persisted Current and its evidence relations.
- /systems-access/registry: environment source/relations.
- /systems-access/build and /systems-access/work: explicit read-only holds; these retain the six-part architecture without granting formation/work actions.
- /c3optics: Current evidence and provider encounters, kept separate.

## Manifest

GET /api/c3ops/manifest, optional env_key (letters/digits/underscore/hyphen, maximum 160).
GET /api/c3ops/manifest?view=lapzuli reads route/evidence relations.
Only GET is accepted. The API is restricted to the exact c3Ops host.
The existing operator middleware protects /api/c3ops and c3Ops room routes; root/artwork contain no private data. No anonymous grants, RLS changes or new credential scheme.

Server bindings required: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY, and existing OPERATOR_DISPATCH_KEY. All service-role access stays server-side behind the existing operator gate. Runtime binding values must be verified at deployment; none are included in code/evidence.

resolveMEEnvironments(read, envKey) returns:
- contract, observed_at, environments, missing_environments, mutation_authority=false, external_effects=0.
- each environment: identity, standing, active, canonical, formation, source_authority, domain.
- explicit c1 self/parent environment relation and c2 self-environment relation; these do not assert participant or contribution relationships.
- Boundary and Canopy rows scoped by system_key, with source-family labels.
- metadata process references resolved against system_process_registry, with invocation_authorized=false.
- Interoperability remains unresolved without a registered interface binding.
- Current reads only c3_current_state rows with matching env_key and is_current=true.
- evidence reads c3_current_evidence_ref using actual current_state_key.
- explicit holds, unproven contribution outcomes, unresolved coverage, and read errors.
- missing rows and read errors never imply authority, Current or formation.

The adapter paginates 500 records at a time and fails instead of returning a silent partial result at its 10,000-row cap. It does not provide transaction-wide snapshot isolation; observed_at describes completion of the projection. No arbitrary table/column names come from request input.

Lapzuli calls the existing lapzuli_route / lapzuli_encounter_evidence relation. It preserves all encounter history and raw observed outcomes. Published/already_distributed is not converted into Current or ACT. Environment/lane binding coverage is explicitly unresolved for unDrifted, Measures Registry, and Registrar / c3 Community Partners rather than duplicated in frontend state.

## Artwork provenance

Drive ID: 1PJPvKUg3x0R966fKLLAmA7_GSNaliliR.
Source title: c3ops_tree_semantic_background_source_v1.png.
PNG: 1402 x 1122, 3,699,832 bytes.
SHA-256: c7a4a90b62014783bc1f1dcf30dd6a36f94a228440abd531ec61ef3beea41c7d.
public/c3ops/c3-tree-source-v1.png is a byte-identical runtime copy. No regeneration, pixel edits or re-encoding. Responsive CSS controls the viewport only. The source was visually inspected.

## Bounded correction

The operator amendment authorized exactly env_c3ops.metadata.domain:
c3op.c3field.online -> c3ops.c3field.online.
Executed once with transaction lock, expected-before assertion and all-other-row/field invariants.
One row changed, zero unrelated changes, zero Current writes. SQL and result are in the execution evidence.

No migrations/views or environment formation were performed.

## Validation / deployment preparation

Run:
- npm run build:c3field
- node --import tsx --test functions/api/c3ops/manifest.test.ts functions/_middleware.test.ts src/c3_field_connect/c3FieldRouting.test.ts
- tsc -p tsconfig.c3ops.json

The existing full application config requests ignoreDeprecations=6.0; locally available TypeScript is 5.x. A diagnostic override reveals additional errors in unchanged application files; this scope has its own strict typecheck.

Local headless Chrome verification uses the built bundle and directly observed Registry snapshot projected by the same resolver. It is UI/contract verification, not live REST or production proof. Live REST verification from this workspace is unavailable because a service-role binding is not present in the inspected local environment. This does not establish absence of that binding in production.

Deploy preparation only: use the existing c3 Field Pages build/runtime, verify server bindings and the exact host, then verify authenticated GET /api/c3ops/manifest and all three portal readbacks. Deployment is outside this passage's authorized boundary.

