---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Create Minimal Contract-Native CSS Layer for Registered Runtime
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_create_minimal_contract_native_css_layer_for_registered_runtime_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - css-architecture
  - contract-native-css
  - registered-runtime
  - visual-governance
  - drift-containment
  - codex-first
---

# OAR1 — Create Minimal Contract-Native CSS Layer for Registered Runtime

## EXECUTION SUMMARY

Created an isolated, contract-native CSS layer for the clean registered runtime. All selectors scoped under `.measures-registry-runtime`. Existing `src/index.css` preserved as legacy/global fallback. Old monolithic runtime not touched. No routing, scoring, contact capture, or email behavior changed.

## FILES CREATED

```
src/measures_registry/registered_runtime/styles/registry.runtime.css
src/measures_registry/registered_runtime/styles/registry.tokens.css
src/measures_registry/registered_runtime/styles/registry.layout.css
src/measures_registry/registered_runtime/styles/registry.buttons.css
src/measures_registry/registered_runtime/styles/registry.footer.css
src/measures_registry/registered_runtime/styles/encounters/passage.css
```

## FILES MODIFIED

- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` — added `import "./styles/registry.runtime.css"` at line 1

## DB ROWS MODIFIED

None.

## TOKEN BRIDGE

Consumed existing DB-injected CSS variables:

- `--registry-header-height`
- `--registry-content-max-width`
- `--registry-page-padding-active`
- `--registry-section-spacing-active`
- `--registry-brand-field`, `--registry-brand-border`, `--registry-brand-primary-text`, `--registry-brand-secondary-text`, `--registry-brand-muted-text`, `--registry-brand-highlight`

Font variables added as local CSS aliases under `.measures-registry-runtime` (DB font-token seating remains future work):

```css
--registry-font-heading: "Cormorant Garamond", Georgia, serif;
--registry-font-body: Inter, system-ui, sans-serif;
```

No new DB tokens added.

## SCOPED SELECTORS

All overrides prefixed `.measures-registry-runtime`. No broad globals. Key selectors:

- `.measures-registry-runtime` — layout frame, token bridge
- `.measures-registry-runtime .registry-diagnostic-passage` — header offset, width, padding
- `.measures-registry-runtime .registry-diagnostic-passage video` — centering, max-width constraint
- `.measures-registry-runtime .registry-diagnostic-passage-controls` — content-measure alignment
- `.measures-registry-runtime .registry-diagnostic-passage > button` — CTA alignment
- `.measures-registry-runtime .registry-encounter-actions button` — button governance
- `.measures-registry-runtime .registry-system-footer` — footer width and bottom padding

## PASSAGE CSS SUMMARY

Corrected the header offset gap: `.registry-diagnostic-passage` now receives `padding-top: calc(var(--registry-header-height, 3rem) + clamp(0.8rem, 2.2vw, 1.35rem))` so passage content clears the absolute-positioned `.registry-public-header`.

Video constrained to `min(--registry-content-max-width, 100%)` and centered. Controls and primary CTA aligned to the same content-measure edge.

## BUTTON/FOCUS STATE SUMMARY

Applied to `.registry-encounter-actions button` and `.registry-diagnostic-passage button`:

- `:hover` — muted border-color tint on background, primary text border
- `:focus-visible` — 2px highlight outline, 2px offset
- `:active` — 80% opacity, 1px Y drop
- `:disabled` — 40% opacity, `not-allowed` cursor
- `transition` on background, border, color, opacity (0.15s ease)

## VISUAL QA

Operator-confirmed. Contracts under review with Chazz.

- `?surface=eval_passage` — passed
- `?surface=structure_passage` — passed
- `?surface=ai_isnt_broken_intro` — no regression
- `?surface=evaluate_structure_path` — no regression
- Branch advancement `intro → eval_passage → measures_assessment` — confirmed

## BUILD RESULT

```
✓ 105 modules transformed
✓ built in 3.72s
```

No CSS errors. Chunk size warning is pre-existing and unrelated.

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched
- Routing — unchanged
- Assessment scoring — unchanged
- Contact capture behavior — unchanged
- Email contract behavior — unchanged

## CLOSE

Minimal contract-native CSS layer is seated. Registered runtime now builds from governed contracts bottom-up. `src/index.css` drift is not extended.
