---
document_type: oar1
authority_level: proof
document_scope: campaign_release_authorization
title: OAR1 - Authorize Issue 001 Campaign Release for Buffer Draft Export
closes: OAR/OAR2/publication/oar2_authorize_issue001_campaign_release_for_buffer_draft_export_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Authorize Issue 001 Campaign Release for Buffer Draft Export

## Summary

Issue 001's Launch Campaign moved from `status: draft` / `release_state: held` to `status: ready_for_export` / `release_state: release_ready`. All 12 Distribution Assets recorded `export_status: ready_for_buffer_draft_export` in `metadata` (no dedicated column exists — used the OAR2's own explicit fallback). No mismatches were found against live state before writing; every confirmation criterion in ROUTED §2 checked out cleanly. Buffer was not called. Nothing was scheduled or published.

---

## 1. Live State Inspection (ROUTED §1) — No Mismatches

| Check | Result |
|---|---|
| Publication authority | `measures_publication_release.publication_state = 'approved'` |
| Launch-critical derivatives pending | 0 — remaining 4 pending are `deferred_production` (3) / `documentation` (1), correctly classified by the prior OAR2 |
| Campaign Assets → Derivatives | All 12 Campaign Assets reference a real derivative; the 3 pointing at still-pending derivatives (assessment hero, cover story hero, editor's letter thumbnail) are the same 3 classified `deferred_production` — launch-valid, not blocking |
| Distribution Assets | All 12 `status: draft`, all with populated `payload` |
| Scheduled/published statuses | None — `distinct status` across all 12 rows returns only `draft` |
| Buffer integration | `automation_status: held`, `is_active: false` — unchanged |

No writes were made until every one of these was confirmed.

## 2. Campaign Row — Before / After

| Field | Before | After |
|---|---|---|
| `status` | `draft` | `ready_for_export` |
| `release_state` | `held` | `release_ready` |
| `metadata` | no approval fields | `approved_by_actor_class: Human`, `approved_by_actor_key: op044`, `source_oar2`, `decision_scope: campaign release readiness only`, `buffer_scheduling_authorized: false`, `publication_authority_dependency: resolved`, `stripe_dependency: separate_runtime_gate`, `facebook_groups_distribution_mode: human_mediated` |

No `check` constraint exists on `status`/`release_state` for this table — both values write freely, no schema workaround needed.

## 3. Distribution Readiness Update

`measures_publication_distribution_asset` has no `export_status` column — checked via `information_schema.columns` before writing, per ROUTED §4's explicit instruction to verify schema support first. Recorded `export_status: ready_for_buffer_draft_export` inside each row's existing `metadata` jsonb instead, with a note explaining why. All 12 rows' `status` column remains `draft`, unchanged — confirmed via `count(*) filter (where metadata->>'export_status' = 'ready_for_buffer_draft_export')` returning 12/12 against `status = 'draft'`.

## 4. Gates Preserved (ROUTED §5)

| Gate | Status |
|---|---|
| Buffer `automation_status` | Untouched — still `held` |
| Buffer schedules | None created — Buffer API was never called |
| `measures_publication_release.publication_state` | Untouched — still `approved` (from the prior gate) |
| Stripe | Untouched — no Stripe table written |
| Renderer code | Untouched |
| Website routes | Untouched |
| Paragraph posts | Untouched |

---

## Validation

| Item | Result |
|---|---|
| Campaign row before/after | Documented in §2 |
| Distribution readiness update | 12/12 rows, `metadata`-recorded (schema has no dedicated column) |
| Buffer automation confirmed held | Yes |
| Publication authority confirmed approved | Yes |
| Derivative standing | 17 approved / 4 pending (3 deferred production, 1 documentation) — unchanged by this OAR2 |
| Facebook Groups human-mediated standing | Recorded in campaign metadata: `facebook_groups_distribution_mode: human_mediated` |
| Gates untouched | Confirmed — §4 |
| Blockers | None |
| Security advisors | Ran post-migration — no findings |

---

## Blockers

None.

## Files Changed

```
supabase/migrations/20260709000240_authorize_undrifted_issue001_campaign_release_for_buffer_draft_export_v1.sql
```

No renderer, `dist-registry/`, publication-authority, Buffer, or Stripe changes.

## Next Gate Recommendation (ROUTED §6 — not executed)

Two gates remain, per this OAR2's own list:
- **Buffer Draft Export** — the natural next step now that the campaign and all distribution payloads are release-ready; still requires a separate explicit authorization to actually generate exportable drafts, and Buffer's own `automation_status` remains `held` until the operator decides to un-hold it.
- **Stripe Production Verification Path** — remains outside this system's ability to complete unilaterally; needs direct operator action in Stripe's own dashboard/API surface.

Neither was executed here, per explicit instruction.

## Deploy Note

DB changes are already live. Only this migration and the OAR1/OAR2 pair are local-only pending commit.
