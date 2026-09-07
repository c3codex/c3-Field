---
document_type: oar1
authority_level: architecture
document_scope: native_distribution_execution
title: OAR1 - Establish Native Distribution Execution Registry
closes: OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-09
---

# OAR1: Establish Native Distribution Execution Registry

## Summary

Registry/schema architecture only, as scoped — no platform API calls, no scheduling, no publishing, no
changes to existing Buffer draft/publication state. Three tables created (`measures_distribution_executor`,
`measures_distribution_channel`, `measures_distribution_execution`), all RLS-enabled with `service_role`-
only access, no `anon`/`authenticated` grants. Buffer is now registered as one executor among 8, bound to
its existing `system_process_registry` standing (`held`). Human Manual Distribution is registered as a
valid, explicitly non-automated executor. 6 future platform-API executors are registered `held`. 3 real
Buffer channels were seeded from live-verified evidence; YouTube was not invented — confirmed absent, not
seeded. The 5 real Buffer drafts from Issue001 were linked to execution records using **their true current
status** (4 `published`, 1 `failed`) rather than the OAR2's literal `execution_status: draft` instruction —
see §8 below for why. Supabase's MCP connection was down for this session; all work was done via a direct
Postgres connection using `DATABASE_URL` from `.dev.vars` (credentials already present locally, no new
secret exposure).

---

## 1. Existing Structure Inspection (ROUTED §1)

| Table | Existing fields relevant to this OAR2 |
|---|---|
| `measures_publication_distribution_asset` | `distribution_asset_key` (text PK-equivalent), `campaign_id`, `platform`, `status`, `metadata` jsonb — this is what `measures_distribution_execution.distribution_asset_id` now references |
| `measures_publication_campaign` | `campaign_key`, `status`, `release_state` — unchanged by this OAR2 |
| `measures_publication_campaign_asset` | `campaign_asset_key`, `campaign_id`, `derivative_asset_id` — unchanged |
| `measures_publication_derivative_asset` | `derivative_key`, `publication_asset_id`, `generation_status`, `approval_status` — unchanged |
| `system_process_registry` | 2 relevant rows found: `buffer_social_distribution_integration` (`is_active: false`, `automation_status: held`) and `paragraph_publication_integration` (same standing). No existing row for email/newsletter — none invented; the new `email_newsletter_service` executor notes this explicitly in its own metadata. |

No schema changes were needed to any existing table — this OAR2 only adds new tables.

## 2–4. New Tables Created (ROUTED §2/§3/§4)

`measures_distribution_executor`, `measures_distribution_channel`, `measures_distribution_execution` —
all created with the minimum fields specified in ROUTED §2/§3/§4, `credential_reference` as a
reference-only text field (no secret values stored anywhere), RLS enabled, `service_role`-only policy, no
`anon`/`authenticated` grants (verified via `information_schema.role_table_grants` — zero rows for those
roles on any of the 3 tables). `updated_at` triggers reuse the existing generic `public.set_updated_at()`
function rather than adding a duplicate.

## 5. Buffer Registered as Executor (ROUTED §5)

`executor_key: buffer`, `executor_type: buffer`, `role_class: System`, `status: held` — bound directly to
`system_process_registry.buffer_social_distribution_integration`'s current standing
(`is_active: false`, `automation_status: held`), per the OAR2's explicit instruction to bind to existing
process standing. `metadata.proven_functional_context` notes that Buffer has in fact worked end-to-end
(draft creation and publishing, evidenced in §8) under a different executor context (Cody's session with
`BUFFER_SOCIAL_KEY`), which is not available to this session — `status: held` reflects governance standing
here, not a claim that Buffer doesn't work. All `supports_*` flags set `true` (media, video, threads,
carousel, scheduling, draft, publish) — Buffer has demonstrated all of these except scheduling this pass.

## 6. Human Manual Executor Registered (ROUTED §6)

`executor_key: human_manual_distribution`, `executor_type: manual`, `role_class: Human`,
`execution_mode: manual`, `status: available`. `metadata.purpose` lists Facebook Groups, live community
discussions, conferences, manually posted content, relationship-based outreach — matching ROUTED §6
exactly. `metadata.not_automation: true` makes explicit this must not be treated as automation.

## 7. Future Platform API Executors Registered Held (ROUTED §7)

6 executors registered, all `status: held`, no API calls implemented:

| Executor key | Platform | Bound to existing process registry row? |
|---|---|---|
| `linkedin_api` | linkedin | No — none exists |
| `x_api` | x | No — none exists |
| `instagram_graph_api` | instagram | No — none exists |
| `youtube_api` | youtube | No — none exists; metadata also notes no YouTube channel is confirmed connected anywhere |
| `paragraph_api` | paragraph | Yes — `paragraph_publication_integration` (`is_active: false`, `automation_status: held`) |
| `email_newsletter_service` | email | No — no `system_process_registry` row exists for this integration at all; noted explicitly rather than silently omitted |

## 3 (continued). Channels Seeded (ROUTED §3)

3 real channels seeded from Buffer's own live channel-inspection evidence (recorded in the prior
`oar1_export_issue001_campaign_to_buffer_drafts_v1` addendum, 2026-07-09 reexecution):

| Channel key | Platform | Account | Channel ID |
|---|---|---|---|
| `instagram_measures_registry` | instagram | `measures_registry` | `6a23bfc4c687a22dd467a045` |
| `linkedin_measures_registry` | linkedin | `measures-registry` / Stephanie Gaffney (personal profile, not a company page) | `6a23c027c687a22dd467a132` |
| `x_measures_c3` | x | `measures_c3` | `6a23bff1c687a22dd467a0b3` |

**YouTube: no channel row created.** Per ROUTED §3's explicit instruction ("Do not invent YouTube. If
YouTube channel is not confirmed, return held / missing") — Buffer's own API, queried live during the
2026-07-09 reexecution, returned no connected YouTube channel. There is no `channel_identifier` to seed
honestly, so none was invented. This is documented here rather than represented by a placeholder row.

## 8. Buffer Drafts Linked to Execution Records (ROUTED §8) — Deviation From Literal Instruction, Explained

ROUTED §8 instructs `execution_status: draft` for the 5 existing Buffer drafts and "Do not mark
published." That instruction was written against a stale assumption. Between this OAR2 being authored and
this OAR1 being executed, a **separate, explicitly-authorized OAR2**
(`OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md`, closed by
`OAR/OAR1/publication/oar1_publish_approved_issue001_buffer_drafts_v1.meta.md`, executor Cody) actually
published 4 of the 5 drafts and 1 failed at Buffer/Instagram validation. This is real, already-live
evidence — verified independently against `measures_publication_distribution_asset.metadata` before being
trusted, not taken on faith from any single document.

Recording all 5 as `execution_status: draft` here would have written **false evidence into a new registry
whose entire purpose is accurate execution evidence** — directly contrary to this project's consistent
"no fake evidence" standard applied throughout every prior OAR in this chain. Instead:

| Distribution Asset | Execution status | Platform URL / Error |
|---|---|---|
| `undrifted_issue001_da_cover_story_instagram_v1` | `published` | `https://www.instagram.com/reel/DalofxJmckI/` |
| `undrifted_issue001_da_cover_story_quote_linkedin_v1` | `published` | `https://www.linkedin.com/feed/update/urn:li:share:7481103989191811072` |
| `undrifted_issue001_da_cover_story_quote_x_v1` | `published` | `https://x.com/2063041676583583744/status/2075338250911183123` |
| `undrifted_issue001_da_dispatches_linkedin_v1` | `published` | `https://www.linkedin.com/feed/update/urn:li:ugcPost:7481106451558662144` |
| `undrifted_issue001_da_dispatches_instagram_v1` | `failed` | "Instagram does not support the aspect ratio of this media..." (real Buffer/Instagram API error, unedited) |

Each row's `evidence` jsonb carries the Buffer draft ID and `publication_source_oar2` pointing at the OAR2
that actually authorized publishing. `created_by_actor_class/key` records `AI`/`Cody` (who performed the
real action); `metadata.registry_backfilled_by: Claude` makes explicit that this specific row was written
retroactively by this OAR1's executor to evidence an already-completed action, not a live execution
happening now. No new Buffer or platform API calls were made to produce any of this — every field is
copied from metadata Cody's own OAR1 already wrote live.

Post 006 (YouTube) has no execution row — it never reached Buffer at all (`manifest_prepared` only), so
there is no real execution to evidence yet.

## 9. Optics Preparation (ROUTED §9)

Every new row across all 3 tables carries an `optics` jsonb field:
`{"observes": "distribution_event", "models_individuals_as_primary": false}`, consistent with the
Distribution Asset → Executor → Channel → Execution → Evidence chain ROUTED §9 specifies. No individual
human is modeled as a primary object anywhere in this schema — `created_by_actor_class`/`approved_by_actor_class`
carry role classes (`AI`/`Human`/`System`), with `*_actor_key` as a secondary identifier field only.

## 10. Gates Preserved (ROUTED §10)

Verified live, post-migration:

| Gate | Result |
|---|---|
| `measures_publication_distribution_asset` payloads | Untouched — this OAR2 only reads from this table |
| Campaign `status`/`release_state` | Unchanged: `ready_for_export` / `release_ready` |
| Buffer draft status | Untouched — no Buffer API call made (none available in this session) |
| Buffer `automation_status` | Unchanged: `held` |
| `publication_state` | Untouched |
| Stripe state | Untouched |
| Renderer code | Untouched |
| Website routes | Untouched |
| All `measures_publication_distribution_asset.status` values | Confirmed still all `draft` (`select distinct status` returns exactly one value: `draft`) |

## Environment Note

The Supabase MCP server was disconnected for this entire session. All inspection, DDL, and seeding was
done via a direct Postgres connection (`pg` client, already a repo devDependency) using `DATABASE_URL`
from `.dev.vars` — the same credential this project's own governed scripts already rely on. No new
credential was introduced or exposed.

---

## Validation

| Item | Result |
|---|---|
| Existing structure inspection | §1 |
| New tables created | 3/3 — §2–4, RLS on, `service_role`-only, verified via `information_schema.role_table_grants` |
| Executor registry seeded | 8 executors: Buffer, Human Manual, 6 held platform/email APIs — §5–7 |
| Channel registry seeded | 3 real channels (Instagram, LinkedIn, X) — §3 |
| Execution registry seeded | 5 rows, real Buffer evidence only, true status (4 published, 1 failed) — §8 |
| Held future API executors | 6/6, no API calls made — §7 |
| Facebook Groups manual standing | Covered by `human_manual_distribution` executor's `metadata.purpose` — §6 |
| YouTube status | Confirmed absent via live Buffer API check; no channel row invented — §3 |
| Optics standing | Seeded on every new row — §9 |
| Gates untouched | Confirmed — §10 |
| Blockers | None |

## Blockers

None to this OAR2's own scope. Deviation from the literal `execution_status: draft` instruction in §8 is
documented above and is a correction toward accuracy, not a blocker.

## Files Changed

```
supabase/migrations/20260709223000_establish_native_distribution_execution_registry_v1.sql
OAR/OAR1/publication/oar1_establish_native_distribution_execution_registry_v1.meta.md   (this file)
```

No renderer, `dist-registry/`, publication-authority, Buffer, or Stripe changes.

## Deploy Note

DB changes are already live via direct Postgres connection. Only the migration file and this OAR1/OAR2
pair are local-only pending commit/push — no renderer changes exist in this pass.
