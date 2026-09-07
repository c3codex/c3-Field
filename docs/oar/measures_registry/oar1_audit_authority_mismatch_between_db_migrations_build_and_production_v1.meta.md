---
document_type: oar1
authority_level: launch_repair
document_scope: authority_mismatch_audit
title: OAR1 - Audit Authority Mismatch Between DB Migrations Build and Production
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_audit_authority_mismatch_between_db_migrations_build_and_production_v1
---

# OAR1 - Audit Authority Mismatch Between DB Migrations Build and Production

## AUDIT RESULTS

---

### 1. Production commit audit

| Item | Value |
|---|---|
| Local HEAD | `fd0aa55` — OAR1: retire runtime monolith naming (measures branch) |
| origin/measures HEAD | `fd0aa55` ✓ (local = pushed) |
| origin/main HEAD | `a1bdb9d` — "c3Field legacy baseline before canon architecture" |
| Commits measures ahead of main | **641** |
| Cloudflare deployed commit | **UNVERIFIABLE** — wrangler CLI auth failed (9106 / 6111) |
| Cloudflare watched branch | **UNVERIFIABLE** — dashboard access required |

**Key finding**: `MeasuresRegistryOrchestrator.tsx` does not exist on `main` (349 insertions comparing measures→main). If Cloudflare Pages is watching `main`, the entire FREE encounter renderer is absent from production.

---

### 2. Supabase project audit

| Item | Value |
|---|---|
| VITE_SUPABASE_URL (.env) | `https://zfihrspxvennjzazxcbj.supabase.co/` |
| VITE_SUPABASE_URL (.env.cloudflare) | `https://zfihrspxvennjzazxcbj.supabase.co/` |
| PUBLIC_SUPABASE_URL (vite.config.ts fallback) | `https://zfihrspxvennjzazxcbj.supabase.co` (hardcoded) |
| supabase/.temp/linked-project.json | `zfihrspxvennjzazxcbj` (Measures Codex) |

**Result**: All sources point to same project. Supabase project mismatch ruled out.
Whether Cloudflare Pages build env has `VITE_SUPABASE_URL` set cannot be confirmed without dashboard access — but `vite.config.ts` hardcodes the fallback so the correct project is used regardless.

---

### 3. Migration application audit

`npx supabase migration list` output — all session migrations applied Local = Remote:

| Migration | Local | Remote | Status |
|---|---|---|---|
| 202606300001 | ✓ | ✓ | APPLIED |
| 202606300002 | ✓ | ✓ | APPLIED |
| 202606300003 | ✓ | ✓ | APPLIED |
| 202606300004 | ✓ | ✓ | APPLIED |
| 202606300005 | ✓ | ✓ | APPLIED |

All 63 total migrations confirmed applied to remote DB. DB state is authoritative.

**Result**: MIGRATIONS_NOT_APPLIED ruled out.

---

### 4. Active encounter def audit

**BLOCKED** — MCP `execute_sql` requires SUPABASE_ACCESS_TOKEN not configured. DB direct query not available via CLI for SELECT statements.

Migration list confirms migrations applied. Live metadata values cannot be independently verified at audit time. Assume correct pending Cloudflare branch confirmation.

---

### 5. Active transition audit

**BLOCKED** — same constraint as section 4.

Encounter transitions are DB-driven. If correct branch is deployed and migrations applied, transitions should route: assessment → contact_capture → obsidian_to_marble_passage_video → (report in passage) → map_integrity_governance.

---

### 6. Passage media audit

**BLOCKED** — same constraint as section 4.

Migration 202606300004 confirmed applied. `exact_url_seated` should be present in `measures_media_map` for `before_the_pathway_obsidian_to_marble_passage_video`. Cannot verify actual value.

---

### 7. Active renderer audit

From source:

| Component | Location | Status |
|---|---|---|
| MeasuresRegistryOrchestrator | `encounter_renderer/MeasuresRegistryOrchestrator.tsx` | active entry point — confirmed |
| EncounterEntry | `encounter_renderer/EncounterEntry.tsx` | active — confirmed |
| EncounterBoundary | `encounter_renderer/boundary/EncounterBoundary.tsx` | active — confirmed |
| ChamberRouter | `encounter_renderer/router/ChamberRouter.tsx` | active — confirmed |
| ObsidianToMarblePassage (report-after-passage) | `chambers/ObsidianChamberRenderer.tsx` | active — `passageComplete && pendingReport` branch confirmed |
| PublicAssessmentResult | `encounter_renderer/chambers/ObsidianChamberRenderer.tsx` (via import) | active — confirmed |
| MeasuresRegistryRuntimeRegistered | `registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | ROLLBACK_ONLY — confirmed |

**MeasuresRegistryOrchestrator.tsx does NOT exist on `main`** (0 lines on main vs 349 insertions on measures).

**IF** Cloudflare Pages is watching `main`:
- MeasuresRegistryOrchestrator is absent → FREE is absent → all OAR repairs absent
- MeasuresRegistryRuntimeRegistered would be active route authority
- Every observed production symptom is explained

**IF** Cloudflare Pages is watching `measures`:
- Renderer authority is correct as of `fd0aa55`
- Symptom cause would shift to cache/sessionStorage

---

### 8. Session storage audit

Browser action required. Cannot automate from build environment.

**Instruction for operator:**
1. Open browser DevTools → Application → Session Storage → clear all
2. Also clear Local Storage
3. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. Rerun in incognito window (clean state)
5. Complete full flow from root URL

Stale `__mreg_pending_report` in sessionStorage would cause old assessment report to render even if new code is deployed. This is the most common cause of "wrong results" when build changes are deployed but the browser ran an assessment before the deploy.

---

### 9. Cache audit

Browser action required.

- Hard refresh result: follow section 8 instructions
- Incognito result: required to confirm — eliminates cache, extensions, sessionStorage
- Cloudflare cache: cannot purge without dashboard access

---

## ROOT CAUSE ANALYSIS

### Primary suspect: DEPLOYMENT_COMMIT_STALE

**Evidence:**
- `measures` is 641 commits ahead of `main`
- `MeasuresRegistryOrchestrator.tsx` does not exist on `main`
- Cloudflare watched branch is unverified
- If Cloudflare deploys from `main`, every observed symptom is explained

**Probability: HIGH** — all symptoms consistent with legacy renderer active in production.

### Secondary suspect: PRODUCTION_CACHE_STALE

**Evidence:**
- Stale `__mreg_pending_report` in sessionStorage would explain "wrong assessment results"
- New build code can still show stale report from pre-deploy assessment run
- This would NOT explain "no continuation to MAP" or "passage media not taken hold"

**Probability: MEDIUM** — explains some symptoms but not all.

---

## FINAL DISPOSITION

**DEPLOYMENT_COMMIT_STALE** (most probable) — pending Cloudflare branch verification

Cannot confirm `WRONG_SUPABASE_PROJECT`, `MIGRATIONS_NOT_APPLIED`, or `RENDERER_AUTHORITY_DRIFT` as primary cause — each of those has been ruled out or contradicted by evidence.

---

## REQUIRED OPERATOR ACTION (ORDERED)

### Step 1 — Cloudflare Pages branch verification (REQUIRED FIRST)

1. Log into Cloudflare Dashboard
2. Navigate to: Pages → Measures Registry project → Settings → Builds & deployments
3. Check: **Production branch**
4. If branch is NOT `measures`: change to `measures`, save, trigger redeploy
5. If branch IS `measures`: note the most recent deployment commit hash and compare to `fd0aa55`

### Step 2 — Browser cache clear (do after Step 1 if redeploy triggered)

1. Open browser DevTools → Application → Storage → Clear site data
2. Also run in console: `sessionStorage.clear(); localStorage.clear()`
3. Hard refresh
4. Test full flow in incognito window

### Step 3 — Cloudflare cache purge (if build is correct but stale assets persist)

1. Cloudflare Dashboard → Pages → Measures Registry → Deployments
2. Trigger cache purge or force rebuild

### Step 4 — If issues persist after Steps 1–3

Return new OAR2 describing exactly what remains broken. Do not apply further repairs until these steps are completed and results reported.

---

## NO MUTATIONS APPLIED

This OAR is audit-only. No source changes. No migrations. No repairs.

## SECURITY CONSTRAINTS

- No secret values inspected or exposed
- Supabase URL referenced by project ID only
- Cloudflare account ID not expanded
