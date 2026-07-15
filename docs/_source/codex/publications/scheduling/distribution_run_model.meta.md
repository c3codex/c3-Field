---
document_type: operational_object_model
authority_level: operational
document_scope: codex_publication_scheduling
title: Distribution Run / Endpoint Action / Publication Evidence — Object Model
status: registered
operator: op044
system: codex
executor: Claude/Cody
established_by: OAR/OAR2/publication/oar2_implement_codex_publication_scheduling_and_endpoint_delivery_v1.meta.md
date: 2026-07-12
---

# Distribution Run / Endpoint Action / Publication Evidence — Object Model

## Why File-Based, Not a New Database Table

The OAR2 explicitly says "use existing objects where they are fit for purpose" and "create the minimum new
operational representation only where no governed equivalent exists." Two existing candidates were evaluated
and rejected:

- **`c3_oar_process_instance`/`_transition_event`/`_seeded_reference`** — wrong domain (OAR lifecycle tracking,
  frozen demo data since 2026-05-14, per this session's `c3field.online` advisory) and wrong shape (no
  concept of a platform, a derivative, or delivery evidence).
- **`system_process_registry`/`system_oar_queue`/`system_oar_execution_evidence`** — closer in spirit
  (queue/execution-evidence pattern) but wrong domain (proves an OAR executed, not that a publication
  reached a platform) and has a **known, unresolved RLS gap** — no `enable row level security` was ever run on
  these three tables (flagged in this session's `c3field.online` advisory §4 and again in the Role Governance
  advisory as a repeating "reuse stale/gapped infrastructure" pattern). Building publication-delivery evidence
  on top of an already-flagged security gap would compound a known problem rather than avoid one.

Given no live scheduler runtime exists either (confirmed below), and given Supabase MCP write access is
unauthenticated in this environment (same limitation encountered repeatedly this session), a new database
migration for this proof case would be new infrastructure investment disproportionate to a single one-time
release — exactly what the OAR2 warns against ("Do not add a new infrastructure vendor merely to schedule
Launch Cycle 001"). **These three objects are implemented as governed filesystem records**, consistent with
every other governance object this session (Ledger, Publication Registry, Initiative records), with a note
that a DB-backed version is the natural next step *if and when* a recurring cadence makes manual file updates
genuinely burdensome — not before.

## Distribution Run

One file per run, `docs/_source/codex/publications/scheduling/runs/<distribution_run_id>.meta.md`, frontmatter
fields matching the OAR2's required list exactly: `distribution_run_id, publication_family,
canonical_publications, governing_system, current_state, proposed_release_datetime, timezone,
operator_authorization_status, created_at, authorized_at, completed_at, unresolved_blockers`.

`current_state` controlled values: `queued, authorized, scheduled, executing, succeeded, failed, held,
cancelled` (per the OAR2's Scheduler Requirements list — reused here as the Distribution Run's own state
machine, since no separate scheduler process exists to own these states independently).

## Endpoint Action

One file per action, `docs/_source/codex/publications/scheduling/runs/<distribution_run_id>_actions/<endpoint_action_id>.meta.md`,
with all fields the OAR2 requires: `endpoint_action_id, distribution_run_id, endpoint_registry_reference,
owning_system, platform, account_identity, content_derivative_reference, media_asset_reference, action_type,
proposed_publish_time, execution_mode, authorization_state, delivery_state, attempt_count,
resulting_public_url, error_evidence, confirmation_evidence`.

`execution_mode` controlled values: `api, manual, external_scheduler, held` (exactly the OAR2's four modes).

## Publication Evidence

Embedded as a body section on the Endpoint Action file it belongs to, rather than a separate file per evidence
record — at current volume (one distribution run, ~15 endpoint actions) a separate evidence-file layer would
add indirection without benefit. Revisit as a separate object if evidence volume grows (e.g., multiple retry
attempts per action, each needing distinct evidence). Required fields per the OAR2: `endpoint_action_reference
(implicit — same file), platform, publication_timestamp, public_url, returned_platform_identifier,
content_checksum_or_derivative_reference, screenshot_or_response_evidence, executor_or_operator_confirmation,
delivery_result, error_detail, retry_standing`.

**A `scheduled` state is not evidence of publication** — enforced by convention here (evidence fields stay
empty/null until `delivery_state` reaches `succeeded` or `failed`), the same rule the OAR2 states explicitly.

## Idempotency

`endpoint_action_id` is the idempotency key — deterministically derived from `distribution_run_id` +
`platform` + `publication_id` (e.g., `launch_cycle_001__paragraph__publication_001`), not randomly generated.
Before any execution (once genuinely automated), the action's own `delivery_state` must be checked; a
`succeeded` action is never re-run. At file-based-manual-mode scale, this is enforced by the operator/executor
checking the file before acting, not by a runtime guard — a real limitation, noted here rather than glossed
over, and a concrete reason a DB-backed version with an actual uniqueness constraint would be stronger once
volume justifies it.
