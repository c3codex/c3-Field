---
oar1_key: oar1_current_state_owner_portability_resolution_codex_20261019_001
origin_oar2_key: oar2_current_state_owner_portability_resolution_codex_20261019_001
execution_instance: current_state_owner_portability_resolution_codex_20261019_001
executor: codex
standing: held_for_registrar_review
return_route: registry://cancom/oar1_return/current_state_owner_portability_resolution_codex_20261019_001
execution_class: bounded_source_patch_and_isolated_tests
---

Prepared and tested an isolated owner-portability candidate. Production remains unchanged. This return does not authorize installation, an owner export, transfer, termination, PAC formation, or external publication.

Authority and integrity

- Registry pickup resolved_for_executor / approved_for_execution, exact execution instance above. Saved OAR2: 6757 UTF-8 bytes, SHA-256 4c5e2a2419aabe8d304b6ac42fe172be945300f23ecfa509ac62d2472bbff08e.
- Immutable source: c3codex/measures-of-inanna-governance commit 5298356e7cf59fe873db13b651364ffd98428f07, governance/maturity/c3_field_m3_20261008/OAR/OAR2/chazz/oar2_current_state_owner_portability_resolution_codex_candidate_20261019.md.
- Active finite capability portability_001_codex_source_test; source/test only, expires 2026-10-26T20:37:44.400Z. Registrar grant portability_001_registrar_cancom_delivery. Independent evaluation f1c33160-d38c-4f46-bcdf-95e7f00b8564: PASS, exact source hash and instance, no unresolved dispatch predicates. PASS creates no authority.
- Operator scope source: governance repository commit 0e552eba73cde34c70f829a23f2fd7849ffef40e, governance/maturity/c3_field_m3_20261008/OAR/REGISTRAR/current_state_portability_001_exact_source_operator_scope_20261019.md.

Source and environment inventory

- Isolated checkout C:\c3-portability-001, branch codex/portability-001, base c3-Field commit 462026d3e07f7ae24560e81ba7e6ea056d645fa2. Local source/test commit 06be1d8749ee31f7549b3182eb546a1caaac2652. No push or deployment trigger.
- Installed Registry: Measures Codex, project zfihrspxvennjzazxcbj. Catalog reads only; no invocation of live portability/termination functions, including preview.
- Live resolver body equals the normalized body of repository migration 20261004142250_my_env_portability_unknown_ownership_reference_only_v1_2.sql. Exact live definition preserved in installed.json and installed.sql. This proves function-body correspondence only, not complete production application/deployment correspondence.
- PostgreSQL 17.6 disposable localhost fixtures on 127.0.0.1:55439, synthetic owners/PACs only. Cluster stopped after tests; test-data retained locally, excluded from Git. Test dependencies reused from C:\c3-lapzuli-013-testtools; caller runner from C:\c3-invite-002\node_modules\tsx. No remote test database.

Declared / observed / governed evidence and findings

| Finding | Classification | Evidence and reliability | Consequence / bounded next action |
|---|---|---|---|
| F06 header-owned PAC excluded by metadata predicate | drifted | Direct read: run_aground_my_env_field_projection_c3webpac_v1 has individual header owner and matching environment, registrar_v1, registered receipt and matching PASS/hash, no ownership_model. High reliability for observed rows. | Installed function excludes this PAC; review candidate before a separately qualified installer. |
| Native dispatcher and exact-instance source/test capability | aligned | Live pickup, grants and independent NotChazz evaluation; high reliability for this instance only. | Execute local source/test scope; no future authority inferred. |
| Original prior OAR1 hash 2f12f90f70728386672c743d2e704942b7576a0491983be4c188e1da915a1e5e | unverified | Claimed in OAR2; original bytes and original manifest unavailable on inspected sources. Governance disposition read at pinned commit: current_state_ground_oar1_20261019_disposition.md; documentary disposition only. | Registrar must supply independently hashed uploaded copy and original custody/manifest. Do not assert original integrity. |
| October 18 composition | held | Governing OAR2 says source-only system c3_field composition under c3envpac_c1me_v0_1; exact proposed design PAC key has no current c3_pac row. | Neither system source composition nor Connect membership creates a participant owner right. Assembly left untouched. |
| Application deployment relationship | unverified | Local source base known and installed resolver body matches; current production artifact/account binding not established. | Installer preflight must identify current c3 Ops/c1 deployment and exact source/runtime hashes. |
| Concurrent owner/grant changes during effect call | held | Fixture atomic rollback proven; concurrent revocation, registration change and PAC insertion races not tested or eliminated by this candidate. | Qualify transaction isolation/locking and recheck authority before any installer/live effect admission. |
| Legacy metadata authority | held | Candidate preserves installed explicit legacy_pre_hardening metadata semantics, no new ownership inferred from custody. | Registrar must qualify legacy contract provenance before approving installation; missing/malformed/contradictory registered authority holds. |

Before / after ownership predicate

Before: EnvPAC membership AND metadata.ownership_model.owner_subject_type='individual' AND owner_subject_key=request relationship; nine repeated checks. Dedicated registered owner fields are ignored.

Candidate: first reject any scoped PAC classified held, then compute one v_owned_keys array. For a header-bearing PAC require complete owner type/key, registrar_v1, registered_at, exact registered receipt/hash/role-call binding, matching independent PASS evaluation including owner/environment. Any present ownership metadata must be a complete object agreeing with header type/key. Individual owner must match request subject and exact owner_environment_key; foreign/system/initiative owners remain references. Header-absent registrar records hold. Header-absent explicitly legacy_pre_hardening records retain the installed metadata rule; missing metadata means reference only. Custodian, projection, EnvPAC membership and proposed DesignPAC composition grant no ownership.

Every owned count, reference count, transfer blocker, owned manifest, owned relation selection, reference index, custody-map completeness check, target-validation loop and custody-update loop now uses the same v_owned_keys membership test. Candidate and unified patch are retained; no ownership data backfill or rewrite.

Dependency and caller map

Authenticated c3_env_session -> functions/_lib/env-session -> functions/api/my-environment-owner-lifecycle.ts exactOwnerRequest -> service-role RPC resolve_my_env_owner_portability_v1 -> individual c3_environment/c3_envpac plus active owner export grant -> classification over c3_pac and registration receipt/boundary evaluation -> manifest/relations/reference index -> synthetic tested export receipt or custody updates/receipt. terminate_my_env_owner_v1 also calls portability preview; it is unchanged and was never invoked live. UI/caller identity is session-derived; arbitrary body owner context is ignored by the existing handler.

Access and security findings

Installed resolver and termination functions are SECURITY INVOKER, execute only postgres/service_role. Observed six relevant tables all have RLS enabled, force-RLS false, zero policies. c3_pac/c3_envpac/access-grant table ACL includes anon/authenticated, while RLS with no policies denies ordinary row access; receipt/evaluation/lifecycle tables grant postgres/service_role. No ACL or RLS change performed. Candidate helper is SECURITY INVOKER with empty search_path, explicitly revokes PUBLIC/anon/authenticated execution and grants service_role only. CREATE OR REPLACE preserves existing resolver ACL. Fixture tests run as local postgres with simplified synthetic schema; they do not prove live RLS, trigger, installer, concurrency or owner-session admission. Full live ACL/RLS proof remains an installer prerequisite.

Validation matrix

26 PostgreSQL cases PASS: baseline defect reproduced; registered header with missing metadata; matching metadata; foreign individual/system/initiative references excluded; contradictory ownership holds preview/export/transfer; revoked/expired/inactive/rightless/missing export grants hold; wrong env/EnvPAC/subject holds; wrong header environment holds; missing receipt and boundary mismatch hold; explicit legacy semantics; custody/membership alone excluded; repeated preview equal in same transaction with no receipt; export complete manifest/receipt without custody change; header-owned PAC map requirement; incomplete second target no partial mutation; successful synthetic transfer preserves owner/lineage/receipt; injected second-PAC failure rolls back custody and receipt atomically. See test-output.txt and reproducible test.cjs/fixtures.sql.

4 unchanged caller tests PASS: session-bound preview, export ignores caller identity, termination confirmation and session clearing (mocked transport only). See caller-tests.txt. Baseline production function-body correspondence and exact OAR2 byte hash PASS via verify-evidence.py. No frontend build required for this SQL/source-only candidate.

DNR / HLD: live owner preview/export/transfer/termination DNR, production SQL application DNR, deployment DNR, new grants/PACs/EnvPACs DNR, public release DNR. Original OAR1 custody, legacy qualification, production deployment mapping, concurrent authority changes, full live-schema effect fixtures and installer admission HLD. No successful source fixture is represented as a live owner effect.

Mutation accounting and changed-file record

- Local source/test: seven new committed files under OAR/portability-001 (.gitignore, baseline.sql, build-candidate.py, candidate.sql, fixtures.sql, test.cjs, verify-evidence.py). Additional uncommitted task-only evidence, OAR2/OAR1, patch, test logs and SHA-256 manifest in that same directory. Existing source/runtime files unchanged; original workspace untouched.
- Disposable local fixture DB created, mutated, rolled back per case and stopped. No real PAC/owner data copied into fixture tables.
- Production business/schema/owner/grant mutations: zero. Provider effects, external messages, deployments, pushes: zero.
- Authorized native OAR1 return is separate: one register_cancom_oar_return_v1 call is intended to insert custody/transition/execution evidence and update queue/process lifecycle; actual receipt/readback recorded separately. This return bookkeeping is not owner-PAC or production-schema implementation.
- No secret values read, captured or returned.

Evidence index and missing evidence

OAR2.md; pickup.json; grants.json; notchazz.json; ownership.json; installed.json/sql; security.json; baseline.sql; candidate.sql; candidate.patch; build-candidate.py; fixtures.sql; test.cjs; test-output.txt; caller-tests.txt; verify-evidence.py; OAR1.md; SHA256.json. Registry return evidence embeds OAR1 text and candidate/test artifacts so return content is retrievable without local-file access. SHA256.json lists exact raw-byte hashes; native return receipt/readback are post-return artifacts and excluded from the pre-return manifest.

Next bounded decision

Chazz reviews candidate and evidence; Operator confirms disposition. A new installer OAR2 must pin reviewed candidate bytes and source commit, resolve original OAR1 custody, qualify legacy and concurrent authority behavior, identify current production installation/deployment, verify complete schema/constraints/triggers/ACL/RLS and run full isolated compatibility tests. Require a transaction-wrapped installer, preserved function ACLs and exact preimage rollback: restore installed.sql and remove only the new helper after confirming dependencies. Do not execute rollback or install from this return. Subsequent owner-session-bound read-only preview and owner acceptance require separate admission; eventual portable export/transfer requires its own exact grant and effect receipts. Ground presentation and Keeper remain later OAR2 lanes.
