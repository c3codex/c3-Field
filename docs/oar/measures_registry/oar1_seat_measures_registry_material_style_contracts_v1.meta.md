---
document_type: oar1
authority_level: working
document_scope: measures_registry_style_contracts
title: OAR1 — Seat Measures Registry Material Style Contracts
status: open
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_measures_registry_material_style_contracts_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - material-style-contracts
  - obsidian
  - lapis
  - marble
  - design-tokens
  - contract-native-css
  - codex-first
---

# OAR1 — Seat Measures Registry Material Style Contracts

## EXECUTION SUMMARY

Seated lapis and marble material surface token contracts in `measures_design_token`. Created `registry.materials.css` with scoped material-family rules consuming DB-injected CSS variables. Corrected hardcoded `data-material-family` in two renderers to read from `stylingContract`. Obsidian token contract confirmed intact and unchanged. Build clean.

Browser spot check pending operator confirmation.

## DB TOKEN READBACK (before change)

36 active tokens for `measures_registry`. No `lapis_*` or `marble_*` surface tokens existed.

Material-relevant tokens present before mutation:

| token_key | value |
|---|---|
| background_obsidian | #050607 |
| brand_obsidian | #0E0E17 |
| panel_obsidian | rgba(8,10,14,0.72) |
| brand_lapis_night | #101A4D |
| brand_deep_lapis | #1F2F8D |
| brand_crystal_star | #F2F4F8 |
| brand_marble_accent | #C7CBD2 |
| brand_silver_frame | #D7DBE3 |
| text_primary | #E8E6DF |
| text_secondary | rgba(232,230,223,0.72) |
| text_muted | rgba(232,230,223,0.52) |
| border_subtle | rgba(232,230,223,0.14) |
| accent_cool | rgba(108,154,208,0.82) |

## DB TOKENS INSERTED

All 16 tokens inserted as `token_scope: "material"`.

### Lapis (8 tokens)

| token_key | token_value |
|---|---|
| lapis_field | #0B1238 |
| lapis_panel_surface | #101A4D |
| lapis_primary_text | #D7DBE3 |
| lapis_secondary_text | rgba(215,219,227,0.72) |
| lapis_muted_text | rgba(215,219,227,0.52) |
| lapis_border | rgba(215,219,227,0.14) |
| lapis_accent | rgba(108,154,208,0.82) |
| lapis_highlight | #F2F4F8 |

### Marble (8 tokens)

| token_key | token_value |
|---|---|
| marble_field | #f4efe4 |
| marble_panel_surface | #eae4d9 |
| marble_primary_text | #13110e |
| marble_secondary_text | #3d3830 |
| marble_muted_text | #6b6357 |
| marble_border | rgba(19,17,14,0.14) |
| marble_accent | #2b5ab8 |
| marble_highlight | #2b5ab8 |

`color-mix()` wash values not stored in DB. Derived in CSS from seated base tokens.

## MATERIAL CONTRACT METADATA READBACK

`mrssc_v1_color_material_contract` — standing: active, type: related_to

Governs: obsidian, lapis, crystal, marble, semantic_usage_boundaries, interaction_states

No metadata update required. Contract already governs the correct material families.

## CSS FILES CREATED/MODIFIED

- Created: `src/measures_registry/registered_runtime/styles/registry.materials.css`
- Modified: `src/measures_registry/registered_runtime/styles/registry.runtime.css` — added `@import "./registry.materials.css"`

## EXACT MATERIAL SELECTORS ADDED

```css
.measures-registry-runtime[data-material-family="obsidian"]
.measures-registry-runtime[data-material-family="lapis"]
.measures-registry-runtime[data-material-family="marble"]
```

Each selector overrides the `--registry-brand-*` token aliases from the base `.measures-registry-runtime` definition. DB-injected variables consumed first; fallback literals match DB-seated values.

## RUNTIME FILES MODIFIED

- `src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx` — `data-material-family` now reads from `aboutCopy.stylingContract?.material_family`, fallback `"marble"`. DB pre-flight confirmed `styling_contract.material_family = marble`.
- `src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx` — same pattern, fallback `"marble"`. DB pre-flight confirmed `styling_contract.material_family = marble`.

## HARDCODED MATERIAL-FAMILY FINDINGS

| Renderer | Finding | Correction |
|---|---|---|
| RegisteredAbout | hardcoded `"marble"` | corrected to stylingContract read |
| RegisteredPhaseReveal | hardcoded `"marble"` | corrected to stylingContract read |
| RegisteredPassage | already reads from stylingContract | no change |

## OBSIDIAN SPOT CHECK

Obsidian token contract preserved intact. Existing tokens (`background_obsidian`, `brand_obsidian`, `panel_obsidian`, `brand_lapis_night`, `brand_deep_lapis`, `brand_silver_frame`, `brand_marble_accent`, `brand_crystal_star`, `text_primary`, `text_secondary`, `text_muted`, `border_subtle`) unchanged. Obsidian material selector re-stated explicitly in `registry.materials.css` as documentation — no functional change.

## MARBLE SPOT CHECK

Pending operator browser confirmation on:

    ?surface=measures_phases_reveal
    ?surface=about_measures_registry

## LAPIS STANDING

No active standalone lapis surface in current runtime. Lapis material token contract is now seated and the CSS rule exists under `.measures-registry-runtime[data-material-family="lapis"]`. Ready for consumption when a lapis encounter is scoped.

## CRYSTAL STANDING

`brand_crystal_star: #F2F4F8` seated. No standalone crystal surface in current runtime. Recommendation: seat `crystal_field`, `crystal_panel_surface`, and text tokens in a future OAR when a crystal encounter is scoped.

## BUILD RESULT

```
✓ 105 modules transformed
✓ built in 3.66s
```

No CSS errors. Chunk size warning pre-existing and unrelated.

## SCRIPTS CREATED

- `docs/oar/measures_registry/inspect-material-token-standing-v1.cjs` — read-only token readback
- `docs/oar/measures_registry/update-material-style-contracts-v1.cjs` — lapis and marble token seating

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched
- Routing — unchanged
- Assessment scoring — unchanged
- Contact capture behavior — unchanged
- Email contract behavior — unchanged
- Intro/threshold surfaces — not altered

## CLOSE CONDITION

Open pending operator browser spot check on marble surfaces (`?surface=measures_phases_reveal`, `?surface=about_measures_registry`) and obsidian regression check (`?surface=eval_passage`).

Close this OAR1 when spot check passes and operator confirms.
