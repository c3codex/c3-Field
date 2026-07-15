---
document_type: oar1
authority_level: operational
document_scope: codex_publication_scheduling_and_endpoint_delivery
title: OAR1 - Implement Codex Publication Scheduling and Endpoint Delivery
closes: OAR/OAR2/publication/oar2_implement_codex_publication_scheduling_and_endpoint_delivery_v1.meta.md
operator: op044
system: codex
executor: Claude/Cody
date: 2026-07-12
status: prepared
disposition: PARTIALLY_READY_SPECIFIC_ENDPOINTS_HELD
---

# OAR1: Implement Codex Publication Scheduling and Endpoint Delivery

## Summary

Full Required Executor Deliverable produced across three files:
`docs/_source/codex/publications/scheduling/distribution_run_model.meta.md` (object model + rationale),
`credential_and_runtime_assessment.meta.md` (credential inventory + scheduler runtime finding), and
`launch_cycle_001_distribution_run.meta.md` (the populated proof case, readiness matrix, dry-run, weekly
cadence, final disposition). No credential was created or exposed. No external publication, scheduling, or
credential action occurred.

## 1. Existing Capability Inventory

Investigated directly rather than assumed: no GitHub Actions, no `wrangler.toml`/Cloudflare Cron Triggers, no
`pg_cron` usage in any migration. Cloudflare Pages Functions exist but are HTTP-triggered only, not scheduled.
One real, working, credentialed publish path exists: Paragraph, via `scripts/publish-undrifted-dispatch-to-paragraph.cjs`
+ `PARAGRAPH_PUBLISH_KEY` in the correctly-gitignored `.dev.vars`. No credential or script exists for X,
Facebook, Instagram, or YouTube — only a display-only `VITE_TWITTER_HANDLE` (client-exposed by design, not a
secret). No website rendering path exists for this new publication class — the live `/undrifted` renderer is
hard-keyed to the Issue-page model.

## 2. Reused and Newly Established Operational Objects

Reused: the existing Paragraph script (extended by data only, not new logic), the Publication Distribution
Package (source for all derivative content), the Editorial Identity Assets (source imagery for the dry-run
field mapping). Newly established: the Distribution Run/Endpoint Action/Publication Evidence model, implemented
as governed filesystem records rather than a new database table — two existing DB candidates
(`c3_oar_process_instance...` and `system_process_registry...`) were evaluated and explicitly rejected, the
latter because it carries a known, previously-flagged, unresolved RLS gap that would have been compounded by
building on top of it.

## 3. Scheduler Runtime Selected and Why

**None selected — deliberately.** No scheduler runtime exists in this stack, and building one (Cloudflare
Worker + Cron Trigger, or `pg_cron`) for a single one-time release is disproportionate infrastructure
investment, which the OAR2 itself warned against. All proposed times in the distribution run are targets for
human-triggered execution. A `pg_cron` + Supabase Edge Function path is recommended as the smallest future
addition if a recurring weekly cadence eventually justifies automating this — not built now.

## 4. Credential Boundary and Security Assessment

No secret value was read, printed, or stored anywhere in this OAR's output — every check used redacted
grep/existence checks only. Paragraph's credential is correctly isolated in a gitignored `.dev.vars` file, never
exposed to the browser bundle. Registered non-secret credential metadata for Paragraph only (reference ID,
provider, permission scope, storage location reference) — no metadata record was created for platforms with no
credential to describe.

## 5. Endpoint-by-Endpoint Readiness Matrix

13 endpoint actions modeled across both publications. 6 ready (2 Paragraph API, 4 unDrifted social manual), 2
ready pending operator scheduling (Measures Registry institutional acknowledgement, manual), 4 held (Website ×2,
Instagram, YouTube), 1 held-not-started (institutional correspondence — now superseded by the correspondence
OAR2 that arrived separately). Full matrix in the distribution run file.

## 6. Launch Cycle 001 Populated Distribution Run

`launch_cycle_001_distribution_run.meta.md` — `current_state: queued`, `operator_authorization_status:
not_authorized`, proposed release 2026-07-13 08:00 America/Chicago, four `unresolved_blockers` recorded
explicitly in frontmatter, not buried in prose.

## 7. Proposed Monday Release Schedule (America/Chicago)

8:00 AM Paragraph (Field Findings) → 9:00 AM Paragraph (Response) → 10:00 AM X (Field Findings) → 11:00 AM
Facebook (Field Findings) → 1:00 PM X (Response) → 2:00 PM Facebook (Response). Response actions sequenced
after their corresponding Field Findings action, preserving the family's own dependency order (Response
extends, does not precede, Findings).

## 8. Proposed Weekly Derivative Schedule

Monday: release announcements. Tuesday: quotation derivatives. Wednesday: Measures Registry acknowledgement.
Thursday: discussion prompts. Friday: later-week reflection/excerpts. Media derivatives: held until a fitting
asset exists. Distinguishes every category the OAR2 named, avoiding a same-day dump of the whole derivative
package.

## 9. Dry-Run Evidence

Verified, without invoking the live Paragraph API, that every field the existing script's `DISPATCHES` object
requires (`title, subtitle, slug, imageUrl, assetPath`) resolves cleanly for both articles from already-registered
records — including the exact live Editorial Identity Asset URLs confirmed present in an earlier OAR this
session. Structurally ready; not executed.

## 10. Manual Fallback Packet

Not re-drafted — the Publication Distribution Package (prior OAR) already contains the exact content for every
Manual-mode action; this run references it rather than duplicating it.

## 11. Remaining Blockers

Website rendering path (real frontend work, not attempted here); institutional correspondence (addressed by a
separate, concurrently-arrived OAR2 — see below); Instagram/YouTube media derivative; and the absence of any
scheduler runtime, meaning every proposed time requires a human to actually trigger it.

## 12. Final Disposition

**PARTIALLY READY — SPECIFIC ENDPOINTS HELD.** Chosen deliberately over the other three options: not fully
ready (real gaps exist and weren't papered over), not "manual-only" (Paragraph's API path is genuinely ready,
not merely a fallback), not fully held (6 of 13 actions — including both canonical Paragraph publishes — are
ready pending only operator authorization).

---

## Constraints Confirmed

Neither canonical article was modified. No new editorial claim was introduced. Nothing was published or
scheduled externally. No secret was stored in source control or any governance file. No autonomous engagement
capability was created. No new public account was created. No unregistered endpoint was activated. Buffer was
not treated as canonical authority (it was not touched at all). No queued/scheduled state was recorded as
published. No Ledger standing was modified. No broader c3 Field architecture was touched.
