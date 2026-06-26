---
document_type: oar1
authority_level: working
title: OAR1 — Seat Paragraph Lapis Integration Process
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_paragraph_lapis_integration_process_v1.meta.md
commit: 5acce84
---

# OAR1 — Seat Paragraph Lapis Integration Process

## OBJECTIVE

Create `paragraph_publication_integration` process record in `system_process_registry`.
Seat Paragraph as Lapis publication integration — draft standing, held automation.
No publishing. No activation. No dispatch record changes.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260010_seat_paragraph_lapis_integration_process.sql` | Created — 1 INSERT into `system_process_registry` |

---

## PROCESS RECORD CREATED

| Field | Value |
|---|---|
| process_key | `paragraph_publication_integration` |
| process_family | `publication_integration` |
| title | Paragraph Publication Integration |
| process_title | Paragraph Publication Integration |
| status | seeded |
| process_status | **draft** |
| process_scope | lapis |
| authority_level | system |
| authority_state | file_seeded_db_referenced |
| required_oar_type | oar2 |
| requires_operator_confirm | true |
| requires_preflight | true |
| requires_oar1_closeout | true |
| source_path | `docs/oar/measures_registry/oar2_seat_paragraph_lapis_integration_process_v1.meta.md` |

**Metadata:**

| Key | Value |
|---|---|
| integration_provider | paragraph |
| publication_target | undrifted |
| env_binding | PARAGRAPH_PUBLISH_KEY |
| function | external_article_publication |
| chamber_assignment | lapis |
| material_identity | lapis |
| is_active | false |
| automation_status | **held** |
| supported_actions | publish_article, sync_dispatch_status, verify_publication_state |
| prohibited_actions | determine_publication_standing, mutate_registry_authority, activate_social_registry |

---

## AUTOMATION ARCHITECTURE DISCOVERY

No implementation. No activation. Recommendation only.

### Recommended route location

`scripts/lib/paragraph-publish.ts`

Matches pattern of `scripts/lib/` utilities (seed-lib, upload-seed). Accepts dispatch_key as argument, reads from `measures_publication_dispatch`, calls Paragraph API with `PARAGRAPH_PUBLISH_KEY`.

### Recommended process location

Orchestrated from: `scripts/publish-dispatch.cjs`

Reads dispatch record from DB by `dispatch_key`. Validates `status=published` and `paragraph_api_managed=true` metadata flag. Calls Paragraph publish endpoint. Returns Paragraph post_id for storage. Requires operator invocation — no automated trigger.

### Recommended evidence capture

Post-publish, update `measures_publication_dispatch.metadata` with:
- `paragraph_post_id`
- `paragraph_published_at`
- `paragraph_publish_state: "published_via_cli"`

Pattern matches existing `agents_with_keys_dispatch_v1` metadata which has `paragraph_post_id` and `paragraph_published_at` fields already. No new schema required for this level of evidence capture.

Larger distribution trace (retry history, error logging) would require new schema — separate OAR if needed.

### Recommended dispatch sync strategy

Match `dispatch_key` to `metadata.paragraph_post_id` in `measures_publication_dispatch`. After publish confirmation, update `paragraph_publish_state` from `false_until_matched` to `published_via_cli`. This keeps registry as authoritative source — Paragraph state is a downstream artifact.

### Required env bindings (names only)

| Binding | Purpose | Location |
|---|---|---|
| `PARAGRAPH_PUBLISH_KEY` | Paragraph API authentication | `.env.local` (confirmed) |

No additional bindings required for minimal publish route.

---

## PRESERVE VERIFIED

| Record | Status | Mutated |
|---|---|---|
| `structural_drift_dispatch_v1` | published | No |
| `fables_and_myths_dispatch_v1` | published | No |
| `agents_with_keys_dispatch_v1` | published | No |
| `agents_of_chaos_dispatch_v1` | published | No |
| `measures_registry_dispatch_v1` | published | No |
| `undrifted_dispatch_v1` | published | No |

---

## VALIDATION

| Check | Result |
|---|---|
| `paragraph_publication_integration` in `system_process_registry` | PASS |
| `process_scope = lapis` | PASS |
| `process_status = draft` | PASS |
| `automation_status = held` | PASS |
| `PARAGRAPH_PUBLISH_KEY` referenced by name only | PASS |
| No secret values exposed | PASS |
| No publication occurred | PASS |
| No dispatch records changed | PASS |
| No renderer code changed | PASS |
| No frontend inference added | PASS |
| Paragraph seated as Lapis integration only | PASS |

---

## LAPIS INTEGRATION PROCESS STANDING — BOTH INTEGRATIONS

| process_key | process_status | automation_status | env_binding |
|---|---|---|---|
| `buffer_social_distribution_integration` | draft | held | BUFFER_SOCIAL_KEY |
| `paragraph_publication_integration` | draft | held | PARAGRAPH_PUBLISH_KEY |

Both seated. Neither activated. Both require OAR2 + operator confirm + preflight before any activation.

---

## NOTCHAZZ FLAGS

None raised.

- Paragraph did not publish content
- Dispatch records not mutated
- Secret values not exposed
- Paragraph not treated as authority
- Social registry not activated
- No new schema invented
- Automation not implemented
- Process not activated
- Operator not governed

---

## CLOSE

Paragraph is formally seated as a Lapis publication integration process.

Standing: `draft` / `held` — not activated.

Both Lapis publication integrations (Paragraph, Buffer) are now seated in `system_process_registry` with governed activation requirements.

Nothing is invented.

Commit: 5acce84
