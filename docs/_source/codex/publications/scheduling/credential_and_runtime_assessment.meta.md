---
document_type: credential_and_runtime_assessment
authority_level: operational
document_scope: codex_publication_scheduling
title: Credential Boundary and Scheduler Runtime Assessment
status: assessed
operator: op044
system: codex
executor: Claude/Cody
established_by: OAR/OAR2/publication/oar2_implement_codex_publication_scheduling_and_endpoint_delivery_v1.meta.md
date: 2026-07-12
note: >
  Contains no secret values. Every check below confirmed presence/absence only, via redacted grep or
  file-existence checks — no credential content was read, printed, or stored in this or any file this OAR
  touched.
---

# Credential Boundary and Scheduler Runtime Assessment

## Credential Inventory (Presence Only, No Values)

| Platform | Credential found? | Storage location | Existing publish path |
|---|---|---|---|
| Paragraph | **Yes** — `PARAGRAPH_PUBLISH_KEY` | `.dev.vars` (gitignored, confirmed via `.gitignore` line 10 — correct server-side-only boundary, never exposed to the browser bundle) | **Yes** — `scripts/publish-undrifted-dispatch-to-paragraph.cjs`, a real, working, human-invoked CLI script hitting `https://public.api.paragraph.com/api/v1`. Already used to publish the Editor's Letter and cover story in Issue 01. |
| X (Twitter) | No — only `VITE_TWITTER_HANDLE` exists, which is a `VITE_`-prefixed variable (exposed to the browser bundle by Vite's own convention) holding a display handle string, not an API credential | N/A | None |
| Facebook | No | N/A | None |
| Instagram | No | N/A | None |
| YouTube | No | N/A | None |

**No credential value was ever read or displayed** — presence was confirmed via `grep -i "PARAGRAPH" .dev.vars | sed 's/=.*/=***REDACTED***/'`-style redaction throughout this assessment.

## Registered Credential Metadata (Non-Secret)

Per the OAR2's Credential Records section — only Paragraph has a credential to register:

```yaml
credential_reference_id: paragraph_publish_key_ref
endpoint: unDrifted / Paragraph (@undrifted)
provider: Paragraph (public.api.paragraph.com)
permission_scope: publish (draft/post creation for the "undrifted" publication slug)
status: present_and_previously_verified_working
expiration_date: unknown — not exposed by the API in a way this assessment checked
last_verified_date: 2026-07-08 (per the existing script's prior use publishing the Editor's Letter — not re-verified live in this pass, since doing so would require an actual API call, which was not authorized as part of assessment)
secret_storage_location_reference: .dev.vars (gitignored; Cloudflare Pages environment for production deploys, per scripts/check-pages-env.cjs pattern used elsewhere in this repo)
revocation_status: unknown — no revocation check performed (would require an API call)
```

No credential record was created for X, Facebook, Instagram, or YouTube — there is nothing to register.

## Scheduler Runtime Assessment

| Candidate runtime | Present in this repo? | Verdict |
|---|---|---|
| GitHub Actions (`.github/workflows/`) | **No** — directory absent or empty | Not available |
| Cloudflare scheduled Workers (Cron Triggers via `wrangler.toml`) | **No** — no `wrangler.toml` found anywhere in the repo (confirmed absent for the main site, same as the earlier `c3field.online` finding of no `wrangler.toml`/deliberate removal in favor of Pages) | Not available |
| Cloudflare Pages Functions | **Yes**, but HTTP-triggered only (`functions/api/*.ts` — Stripe webhook, MAP checkout session, notification dispatches). Pages Functions do not support cron triggers; only Workers do, and this project deliberately uses Pages, not standalone Workers, for its main deploys. | Present, but not a scheduler |
| Supabase Edge Functions + `pg_cron` | One Edge Function exists (`supabase/functions/measures-sign`), but **no `pg_cron`/`cron.schedule` usage found anywhere in `supabase/migrations/`** | Function runtime present, scheduling extension not configured |

**Finding: no scheduled/cron execution runtime currently exists anywhere in this stack.**

## Scheduler Recommendation: Do Not Build One For This Proof Case

Building a scheduler (Cloudflare Worker + Cron Trigger, or enabling `pg_cron` + a Supabase function) is real,
non-trivial infrastructure work, and the OAR2 explicitly warns against exactly this: "Do not add a new
infrastructure vendor merely to schedule Launch Cycle 001... Prefer the smallest existing supported runtime."
The smallest existing runtime, honestly, **is none** — for a single one-time release, the correct minimum is
**human-triggered execution at a proposed time**, not genuine automated cron scheduling. This is not a
downgrade from the OAR2's intent; "proposed release date/time" and "operator authorization" both already assume
a human checkpoint exists before anything fires, which a manually-triggered script satisfies exactly as well as
an automated one would for a single run.

**If a recurring weekly cadence makes this worth automating later** (multiple Launch Cycles, not just 001),
recommend Supabase `pg_cron` + a new Edge Function as the smallest addition — it reuses infrastructure already
present (a Supabase project, one existing Edge Function) rather than introducing Cloudflare Workers as a new
deploy target alongside the existing Pages-only setup. Not built now — this is a recommendation for a future
OAR, not an implementation performed here.
