---
document_type: oar1
authority_level: working
document_scope: measures_registry_frontend
title: OAR1 — Audit Obsidian Contract Resolution Failure
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_obsidian_contract_resolution_failure_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - frontend
  - contract-resolution
  - obsidian
  - audit-closeout
---

# OAR1 — Audit Obsidian Contract Resolution Failure

## OBJECTIVE

Close audit for:

`docs/oar/measures_registry/oar2_audit_obsidian_contract_resolution_failure_v1.meta.md`

Determine why `educational_diagnostic_passage` is not resolving its seated obsidian contract at runtime.

---

## ACTION

### Files Inspected

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/measures_registry/MeasuresAssessmentChamber.tsx`
- `src/index.css`
- `docs/oar/measures_registry/execute-educational-diagnostic-passage-codex-publication-surface.cjs`
- `docs/oar/measures_registry/oar1_educational_diagnostic_passage_codex_publication_surface_v1.meta.md`
- `docs/oar/measures_registry/oar2_educational_diagnostic_passage_codex_publication_surface_v1.meta.md`

### Components Inspected

- `renderEducationalDiagnosticPassageSurface()` — the passage surface renderer
- `sectionCopy()` — metadata extraction function
- `MeasuresAssessmentChamber` — comparison surface that correctly resolves obsidian

### Registry / Material Contract Path Checked

- Codex row: `measures_encounter_def.material_family` column — confirmed `"obsidian"` is seated (execute script lines 35, 85)
- Codex metadata: `metadata.styling_contract` — confirmed absent from seeded metadata
- `sectionCopy()` reads `metadata.styling_contract` → returns `null` for this surface
- `educationalDiagnosticPassageCopy.stylingContract` → `null` at runtime

### Token / Style Resolution Path Checked

- `registryTokenStyle` — CSS custom properties from `measures_design_token` table, applied via `style={registryTokenStyle}` on `<main>` — confirmed present and functioning
- `.measures-registry-runtime` base token aliases (`--registry-brand-field`, `--registry-brand-primary-text`, etc.) — confirmed resolving from global token scope
- `.measures-registry-runtime[data-material-family="obsidian"]` CSS rule — confirmed seated in `src/index.css` at line 5278 — confirmed the selector is correct and the obsidian background and overrides are properly defined

### Fallback Path Checked

- `renderEducationalDiagnosticPassageSurface()` — no fallback to any material family; no `data-material-family` attribute is set under any condition
- `sectionCopy()` — `stylingContract` resolves via `asRecordFromPaths(metadata.styling_contract, encounter_contract?.styling_contract)` — both paths return `null` for this surface

### Local Overrides Checked

- No CSS overrides targeting `.registry-diagnostic-passage` that set background or obsidian visual properties
- No inline style on the `<section>` or `<main>` that approximates obsidian
- No Tailwind or utility class injecting obsidian appearance
- One hardcoded `<p>` element confirmed authored in JSX: `<p>This passage prepares the assessment chamber.</p>` at `MeasuresRegistryRuntime.tsx:1824` — not from Codex

---

## RESULT

### Expected Seated Path

```
Codex: measures_encounter_def.material_family = "obsidian"
  ↓
Runtime query: selects material_family column
  ↓
sectionCopy(): passes through as stylingContract.material_family
  ↓
renderEducationalDiagnosticPassageSurface():
  <main data-material-family="obsidian">
  ↓
CSS: .measures-registry-runtime[data-material-family="obsidian"] fires
  ↓
Obsidian background gradient + surface overrides applied
```

### Actual Runtime Path

```
Codex: measures_encounter_def.material_family = "obsidian"  ← seated, not queried
  ↓
Runtime query: SELECT encounter_key, display_title, metadata
  ← material_family column absent from SELECT
  ↓
sectionCopy(): reads metadata.styling_contract → null
  ← styling_contract not seeded in metadata
  ↓
renderEducationalDiagnosticPassageSurface():
  <main className="measures-registry-runtime" data-surface="educational_diagnostic_passage">
  ← no data-material-family applied
  ↓
CSS: .measures-registry-runtime[data-material-family="obsidian"]
  ← selector never matches
  ↓
No obsidian background. No obsidian overrides.
Surface renders with base token styles only — mixed crystal/institutional appearance.
```

### Breakpoint

Three compounding breaks, in order of causality:

**Break 1 — DB seeding gap** (`execute-educational-diagnostic-passage-codex-publication-surface.cjs`)

`material_family: "obsidian"` was seated as a column on the `measures_encounter_def` row, not inside `metadata`. No `styling_contract` key was seeded in `metadata`. The current runtime queries only `metadata`; the column is unreachable through the existing read path.

**Break 2 — Renderer does not apply material contract** (`MeasuresRegistryRuntime.tsx:1787-1792`)

`renderEducationalDiagnosticPassageSurface()` never reads `educationalDiagnosticPassageCopy.stylingContract` and never applies `data-material-family` to the `<main>` element. The evaluation chamber resolves this correctly through `MeasuresAssessmentChamber` (`MeasuresAssessmentChamber.tsx:108-113, 142`). No equivalent pattern exists for the passage renderer.

**Break 3 — Hardcoded internal language in JSX** (`MeasuresRegistryRuntime.tsx:1824`)

`<p>This passage prepares the assessment chamber.</p>` is authored directly in the renderer. It is not from Codex. It is the internal language the OAR2 identified as surface drift.

### Fault Classification

- **DB state** — `styling_contract` not seeded inside `metadata`; `material_family` column not accessible through the current query path
- **Encounter definition** — `educational_diagnostic_passage` metadata does not carry the styling contract needed for renderer resolution
- **Renderer selection** — `renderEducationalDiagnosticPassageSurface()` does not read or apply the material family contract; no `data-material-family` attribute is produced

CSS override: not at fault. The obsidian CSS rule is correctly seated and would fire if the attribute were present.

Design token map: not at fault. Tokens resolve correctly through `registryTokenStyle`.

### Minimal Correction Required

Two-part correction, in dependency order:

**1. Seat `styling_contract` in Codex metadata**

Add `styling_contract: { material_family: "obsidian" }` to the `metadata` of the `educational_diagnostic_passage` row in `measures_encounter_def`.

This does not require a schema change. It is a metadata update to an existing row. The existing query (`SELECT encounter_key, display_title, metadata`) will carry it through without modification.

**2. Apply `data-material-family` in the renderer**

In `renderEducationalDiagnosticPassageSurface()` (`MeasuresRegistryRuntime.tsx:1787-1792`), read `educationalDiagnosticPassageCopy.stylingContract?.material_family` and apply it as `data-material-family` on the `<main>` element. Pattern is already established in `MeasuresAssessmentChamber.tsx:108-113, 142`.

**3. Remove hardcoded copy**

Remove or replace `<p>This passage prepares the assessment chamber.</p>` at `MeasuresRegistryRuntime.tsx:1824` with a Codex-seated value (e.g. a `core_statement` or `passage_note` key in metadata), or remove entirely if no seated equivalent exists.

---

## VALIDATION

### Build Status

Not checked in this audit pass. Audit is read-only per OAR2 scope.

### File References

| File | Relevance |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Renderer and query — primary fault surface |
| `src/measures_registry/MeasuresAssessmentChamber.tsx` | Reference pattern for correct material resolution |
| `src/index.css` | CSS contract confirmed seated; selector confirmed correct |
| `execute-educational-diagnostic-passage-codex-publication-surface.cjs` | Origin of metadata seeding gap |

### Line References

| Location | Note |
|---|---|
| `MeasuresRegistryRuntime.tsx:704-709` | Supabase query — `material_family` column absent from SELECT |
| `MeasuresRegistryRuntime.tsx:537-543` | `sectionCopy()` reads `metadata.styling_contract` — returns null for this surface |
| `MeasuresRegistryRuntime.tsx:1787-1792` | Passage `<main>` — no `data-material-family` attribute applied |
| `MeasuresRegistryRuntime.tsx:1824` | Hardcoded internal copy `<p>This passage prepares the assessment chamber.</p>` |
| `MeasuresAssessmentChamber.tsx:108-113` | Correct pattern: reads `stylingContract.material_family` |
| `MeasuresAssessmentChamber.tsx:142` | Correct pattern: applies as `data-material-family` on element |
| `src/index.css:5278` | `.measures-registry-runtime[data-material-family="obsidian"]` — confirmed seated |
| `src/index.css:4064` | `.registry-diagnostic-passage` — no obsidian override; inherits from parent |
| `execute script:35, 85` | `material_family: "obsidian"` confirmed seeded as column |

### Runtime Behavior Observed

Surface reads mixed styling — base token colors apply (silver frame, lapis night) but the obsidian background gradient (`linear-gradient(145deg, #03050a 0%, #090b14 46%, #020307 100%)`) does not fire. The `<main>` element carries no `data-material-family` attribute, confirmed by tracing the renderer. CSS contract is intact and would resolve correctly if the attribute were present.

### Remaining Uncertainty

- Whether the eyebrow value `"Recognition Passage"` is rendering correctly from Codex metadata or falling through to a prior fallback — could not be confirmed without a live render. The metadata does seat `eyebrow` correctly (execute script line 176), but a live runtime check is warranted.
- Whether any other metadata keys are absent from the `educational_diagnostic_passage` row due to the original seeding pass — not fully audited; scope was limited to the obsidian contract failure.

---

## IMPLEMENTATION STATUS

Audit only.

No implementation performed.

No files modified.

No DB state changed.

---

## ROUTING RECOMMENDATION

Two correction OAR2s required, in dependency order:

**Route 1 — DB correction OAR2**

Seat `styling_contract: { material_family: "obsidian" }` inside `metadata` of the `educational_diagnostic_passage` row in `measures_encounter_def`.

This must be executed before the renderer correction is deployed, as the renderer will read the metadata key.

**Route 2 — Renderer correction OAR2**

Apply `data-material-family` from `educationalDiagnosticPassageCopy.stylingContract?.material_family` to the `<main>` element in `renderEducationalDiagnosticPassageSurface()`.

Remove hardcoded `<p>This passage prepares the assessment chamber.</p>` or replace with seated Codex value.

These may be combined into a single execution OAR2 if operator confirms the DB correction will be seeded in the same pass.

---

## CLOSEOUT

OAR2 audit complete.

No implementation performed.

Fault identified across DB state, encounter definition, and renderer.

OAR1 ready for operator review.
