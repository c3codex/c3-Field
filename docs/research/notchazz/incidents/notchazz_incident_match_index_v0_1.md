# NotChazz Historical Incident Match Index v0.1

**Standing:** research evidence index; incomplete; non-operative  
**Rule:** a title/reference match is not sufficient. Incident status becomes `matched` only after direct source inspection.

| Incident key | Historical reference | Exact source identity | Drive ID | Source standing | Match status | Normalized evidence |
|---|---|---|---|---|---|---|
| `notchazz_incident_2026_03_31_session5_cadence` | Session 5 NotChazz Report and Resolution | `session_5_notchazz_report_and_resolution.meta.md` | `1jw7kTnEzl2bpFOdUX7d9M04ZgxWdN2-C` | `status: corrected`; `authority_level: working` | matched by direct read | `../normalized/notchazz_normalized_evidence_session5_v0_1.md` |
| `notchazz_incident_2026_03_31_session5_file_closeout` | Session 5 NotChazz Review and Resolution OAR | `session_5_notchazz_review_and_resolution_oar.meta.md` | `1_0CpcbT7yTO95TZ4hD5GVI4SIDxELyua` | `status: working`; `authority_level: working`; historical OAR2 | matched by direct read; related to same Session 5 incident family | `../normalized/notchazz_normalized_evidence_session5_v0_1.md` |
| `notchazz_incident_2026_04_15_phase_map_boundary` | Session 18 Phase Map Boundary Resolution | `session_18_notchazz_rr_phase_map_boundary_resolution.meta.md` | `1UcYH0AWMEuJxdGJZHtAIDBg92trxYgQX` | `status: complete`; `authority_level: working` | matched by direct read | `../normalized/notchazz_normalized_evidence_session18_v0_1.md` |
| `notchazz_incident_2026_04_15_session19_role_collapse` | Session 19 NotChazz R&R | `session_19_notchazz_rr.meta.md` | `1tFcEr9owpi3ebzZzhSKfAiRtnOpMmokf` | historical working record per lineage ledger | pending direct source read in this bundle | pending |
| `notchazz_incident_relational_output_governance` | Relational Output Governance | `relational_output_governance.meta.md` | `1YKl_IuUjJnStLhbg3ZOjKuKipJCTrTfF` | working process-governance source per lineage ledger | pending direct source read in this bundle | pending |
| `notchazz_incident_field_operations_manual` | c3 Field Operations Manual v1 | `c3_field_operations_manual_v1.md` | `1J-E5nXWzMpmqX9JIshWpAQetcje6sI6-` | operational manual source per lineage ledger | pending direct source read in this bundle | pending |
| `notchazz_incident_operator_review_hard_stop` | Operator-review-required hard stop | `oar2_seat_notchazz_operator_review_required_hard_stop_process_intel_for_mr_backoffice_v1.meta.md` | `150JsMw4_PNIR0s7QT28CMpIXHc4O_Mbs` | proposed only; not activated | pending direct source read in this bundle | pending |
| `notchazz_incident_system_environment_mismatch` | System/environment mismatch guard | `notchazz_system_environment_mismatch_record_codex_001.meta.md` | `1dzmpiKimNH1bx27wSzhGXFWO7iyzQ4mW` | implementation evidence; registry standing unverified | pending direct source read in this bundle | pending |

## Matching rule

For each inventory candidate, attempt to resolve: source object → incident/event → related OAR/process/evidence objects → resolution/disposition → current-model relation. Keep all historical terminology intact in the source relation. Only the normalized evidence file may express present-day c3Ops terminology, and it must name what was retained, superseded, conflicting, unresolved or environment-specific.

## No implied authority

A `matched` incident establishes evidence lineage only. It does not register a flag, create a current environment profile, activate a trigger, or grant NotChazz authority.
