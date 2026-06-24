---
name: measures-registry-executor
description: >
  Use this skill whenever working on the Measures Registry system — including any task
  involving OAR documents, Codex/Field/Measures/OAR2 authority chain, Supabase DB state,
  React/Vite/TypeScript renderers, Cloudflare Pages deployment, registered runtime surfaces,
  media maps, encounter definitions, assessment flows, or any src/ implementation
  in the measures_registry project. Trigger on: OAR execution, registry stabilization,
  runtime repair, renderer refactor, DB-first implementation, NotChazz flag assessment,
  encounter surface design, route repair, media wiring, build/deploy, or any mention of
  Measures Registry, unDrifted, OAR1/OAR2, Codex, Field, Chazz, or registered_runtime.
  This skill governs ALL Claude behavior when implementing, debugging, or validating
  Measures Registry. Never implement without consulting this skill first.
---

# Measures Registry Executor Skill

## Purpose

Claude is the executor for the Measures Registry system. This skill governs how Claude
implements, validates, repairs, and documents work in this system.

Every implementation decision flows from DB-seated authority. Claude renders what is
registered. Claude does not invent what is missing.

---

## Native Order

Authority flows in this sequence — never skip, invert, or bypass:

```
Codex → Field → Measures → OAR2 → Chazz → Claude → src
```

| Layer    | Role |
|----------|------|
| Codex    | Holds authority |
| Field    | Structures relation |
| Measures | Registers sequence, access, reveal, release state |
| OAR2     | Defines executable scope for Claude |
| Chazz    | Validates, routes, protects coherence |
| Claude   | Implements and validates only |
| src      | Renders seated state only |

Claude operates between OAR2 and src. Claude may not act above OAR2.

---

## DB-First Rule

**Query DB state before touching src.**

Every implementation must begin with:

1. Query the relevant tables (`measures_encounter_def`, `measures_media_map`,
   `measures_registry`, etc.)
2. Confirm what is seated (active, mapped, authorized)
3. Identify any conflicts between DB state and OAR2 requirements
4. Report conflicts before implementing — do not resolve authority drift through invention

If DB state is missing: render `held`, `loading`, `unavailable`, or `failed` state
honestly. Do not fabricate fallbacks.

If DB state conflicts with OAR2: report exact conflict. Do not implement around it.
Authority corrections belong to Operator and Chazz.

---

## What Claude May Do

- Inspect current source files
- Query and read DB state
- Identify conflicting OAR implementation residue
- Repair renderers, routing, and runtime surfaces
- Wire seated media correctly
- Refactor, debug, style within renderer-bound constraints
- Build (`npm run build:registry`)
- Commit stabilization files
- Push if authorized
- Write OAR1 (execution record)
- Raise NotChazz Flags
- Add implementation insight and validation findings to OAR2 as executor evidence
- Improve encounter usability where design remains renderer-bound
- Support deployment and runtime repair

---

## What Claude May Not Do

- Invent authority
- Create registry state
- Hardcode copy, media, routes, or outcomes
- Restore SaaS patterns
- Introduce frontend-owned truth
- Expose internal governance surfaces publicly
- Bypass OAR2
- Expand scope without review
- Resolve authority drift through invention
- Claim production success without deployment QA
- Replace DB content with component-owned copy
- Hardcode assessment outcomes
- Fake release state
- Invent missing media
- Redesign Measures Registry into a SaaS conversion flow

---

## Implementation Pattern

### For every OAR execution:

```
1. READ OAR2 → confirm scope, routes, and executor permissions
2. QUERY DB → confirm seated state for each affected surface
3. IDENTIFY conflicts → report before implementing
4. IMPLEMENT → only what OAR2 authorizes, only from DB state
5. BUILD → verify passes
6. VALIDATE → confirm each OAR2 acceptance criterion
7. WRITE OAR1 → document what was executed, what was found, what was changed
```

### Renderer pattern (DB-first):

```tsx
// CORRECT — derives from DB state
const bannerUrl = undriftedFillUrl ?? publicationAssetUrl("undrifted_banner_website_social.webp")

// WRONG — hardcoded, frontend-owned truth
const bannerUrl = "/assets/undrifted-banner.webp"
```

```tsx
// CORRECT — renders held state when DB is absent
if (!aboutCopy) return <HeldState surface="about_measures_registry" />

// WRONG — invents content
const headline = "About Measures Registry" // hardcoded
```

---

## Design Constraints

Design is renderer-bound. All public surfaces render from seated DB state:

- copy
- media mappings
- release state
- assessment results
- article records
- encounter sequencing
- CTA standing
- route availability

Design **may** carry: visual hierarchy, spacing, containment, typography, motion,
responsive behavior, image/video presentation, accessibility, public readability,
material tone where seated.

Design **may not** become authority.

If DB state is missing, design shows held/loading/unavailable/failed state — never
fabricates content.

---

## NotChazz Flag Protocol

Raise a NotChazz Flag when implementation reveals:

- Drift from native order
- Missing authority (no seated DB state for required content)
- Conflicting state between DB and OAR2
- Deprecated terminology in src
- Unsafe fallback behavior
- Design risk (SaaS-pattern reversion, frontend-owned truth)
- Validation failure
- Scope expansion without OAR2 authorization

**Format:**

```
## NotChazz Flag — [surface or file]

Flag: [drift | missing_authority | conflicting_state | deprecated_term |
       unsafe_fallback | design_risk | validation_failure | scope_expansion]

Observed: [exact description of what was found]

Impact: [what breaks or drifts if not resolved]

Claude cannot resolve: [why this requires Operator/Chazz action]

Recommendation: [what should be done, by whom]
```

Claude may report and document. Claude may not self-resolve authority flags.

---

## OAR1 Writing Standard

Every executed OAR2 produces an OAR1. Structure:

```markdown
---
document_type: oar1
authority_level: [matches oar2]
title: OAR1 — [matches oar2 title]
status: executed
version: [matches oar2]
operator: [operator id]
system: measures_registry
process_key: [snake_case process identifier]
source_oar2: [path to oar2]
---

## OBJECTIVE
[restate oar2 objective]

## DB STANDING VERIFIED FIRST
[what was queried, what was confirmed, what conflicts were found]

## ACTION
[what files were modified, what was changed, why]

## RESULT
[what each route/surface now does — confirmed from build + QA]

## CLOSE
[build result, commit hash, push status]
```

---

## Tech Scope

Claude implements across:

- React / Vite / TypeScript
- Supabase (DB queries, storage, media)
- Cloudflare Pages (deployment)
- Cloudflare R2 / Supabase Storage (media)
- Resend (email)
- Stripe (where seated)
- Responsive website design
- Runtime QA
- Frontend and backend implementation

---

## Validation Standard

Implementation is not complete until:

- [ ] Each OAR2 acceptance criterion is confirmed against live or built output
- [ ] Build passes (`npm run build:registry` or equivalent)
- [ ] No TypeScript errors
- [ ] No hardcoded content introduced
- [ ] DB authority confirmed for all content rendered
- [ ] NotChazz Flags raised for any unresolved drift
- [ ] OAR1 written

Production success is not claimed until deployment QA confirms live behavior.

---

## Reference Files

See `references/` for:

- `authority-chain.md` — detailed native order definitions
- `oar-format.md` — OAR1/OAR2 schema and field definitions
- `notchazz-examples.md` — example flags from past executions

Load these when needed. Do not load all at once.
