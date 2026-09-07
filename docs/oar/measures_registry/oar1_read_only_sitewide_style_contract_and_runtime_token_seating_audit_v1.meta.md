---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Read Only Sitewide Style Contract and Runtime Token Seating Audit
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_read_only_sitewide_style_contract_and_runtime_token_seating_audit_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - read-only
  - sitewide-style-contract
  - runtime-token-seating
  - fonts
  - colors
  - visual-governance
  - codex-first
---

# OAR1 — Read Only Sitewide Style Contract and Runtime Token Seating Audit

## EXECUTION SUMMARY

Read-only audit of the Measures Registry sitewide style contract, runtime token pipeline, and CSS implementation. No DB rows modified. No source files modified. No CSS modified.

**Script used:** `docs/oar/measures_registry/inspect-sitewide-style-contract-and-token-seating-v1.cjs`

---

## SITEWIDE CONTRACT READBACK

### concordance_document

```
document_key: measures_registry_sitewide_style_contract
title: Measures Registry Sitewide Runtime/Style Contract
document_scope: sitewide_style_contract
authority_standing: active
visibility_standing: internal
native_order: 1
source_alignment: measures_registry_runtime_audit_intelligence
status: seeded
implementation_order: sitewide_runtime_contract → encounter_contracts → renderer_behavior → runtime_state
```

### concordance_version

```
version_key: measures_registry_sitewide_style_contract_v1
visibility_standing: internal
status: seeded
```

Note: `concordance_version` does not carry `authority_standing` or `implementation_order` as top-level fields — those fields are on `concordance_document`.

### registered_13_public_runtime_contract

**MISSING** — `registered_13_public_runtime_contract` was not found in `concordance_document`. It is referenced in OAR2 as a source contract but is not seated.

### Active Relations (11 mrssc_v1 relations)

All 11 relations active, `relation_standing: active`, `visibility_standing: internal`:

| relation_key | target_ref | governs |
|---|---|---|
| `mrssc_v1_typography_contract` | typography | heading_font_authority, body_font_authority, hierarchy_scaling, desktop_mobile_typography |
| `mrssc_v1_color_material_contract` | color_material | obsidian, lapis, crystal, marble, semantic_usage_boundaries, interaction_states |
| `mrssc_v1_button_icon_contract` | button_icon | primary_cta, secondary_cta, passage_controls, icon_rendering_authority, hover_focus_behavior, mobile_scaling |
| `mrssc_v1_branding_contract` | branding | registry_mark_usage, mark_placement_classes, mark_opacity_rules, institutional_identity_boundaries |
| `mrssc_v1_footer_contract` | footer | copyright_authority, footer_visibility_rules, footer_copy_authority, system_linkage_rules |
| `mrssc_v1_viewport_containment_contract` | viewport_containment | desktop_containment, mobile_containment, single_screen_encounter_fit, overflow_behavior, encounter_viewport_boundaries |
| `mrssc_v1_media_behavior_contract` | media_behavior | autoplay_rules, mute_unmute_behavior, interaction_unlock_rules, media_persistence_boundaries, encounter_scoped_media_behavior |
| `mrssc_v1_marble_tone_contract` | marble_tone | low_volume_baseline, encounter_scoped_playback_rules, continuity_rules, mute_relationship_rules |
| `mrssc_v1_transition_contract` | transition | encounter_transition_behavior, dissolve_fade_authority, state_isolation_expectations |
| `mrssc_v1_preserved_runtime_assets` | preserved_runtime_assets | MeasuresAssessmentChamber, sectionCopy(), token_pipeline, navigation_history, obsidian_material_contract |
| `mrssc_v1_intelligence_binding` | measures_registry_runtime_audit_intelligence | upstream authority |

**Existing audit findings already recorded in concordance:**
- `mrssc_v1_footer_contract`: `audit_finding: copyright_hardcoded_in_jsx`
- `mrssc_v1_media_behavior_contract`: `audit_finding: passageMuted_is_session_global`
- `mrssc_v1_marble_tone_contract`: `audit_finding: marble_tone_persists_across_surfaces_unscoped`
- `mrssc_v1_transition_contract`: `audit_finding: orphaned_transition_contract_unrealized`

---

## DESIGN TOKENS READBACK

36 active tokens from `measures_design_token` (registry_key: `measures_registry`):

**Palette / brand tokens:**
```
accent_cool:               rgba(108,154,208,0.82)   → --registry-accent-cool
accent_warm:               rgba(214,132,62,0.82)    → --registry-accent-warm
background_obsidian:       #050607                  → --registry-background-obsidian
brand_crystal_star:        #F2F4F8                  → --registry-brand-crystal-star
brand_deep_lapis:          #1F2F8D                  → --registry-brand-deep-lapis
brand_lapis_night:         #101A4D                  → --registry-brand-lapis-night
brand_marble_accent:       #C7CBD2                  → --registry-brand-marble-accent
brand_obsidian:            #0E0E17                  → --registry-brand-obsidian
brand_silver_frame:        #D7DBE3                  → --registry-brand-silver-frame
panel_obsidian:            rgba(8,10,14,0.72)       → --registry-panel-obsidian
text_muted:                rgba(232,230,223,0.52)   → --registry-text-muted
text_primary:              #E8E6DF                  → --registry-text-primary
text_secondary:            rgba(232,230,223,0.72)   → --registry-text-secondary
border_subtle:             rgba(232,230,223,0.14)   → --registry-border-subtle
```

**Scale / spatial tokens:**
```
body:                  16px                         → --registry-body
body (mobile):         15px                         → --registry-body-mobile
entry_headline:        clamp(36px,4.5vw,48px)       → --registry-entry-headline
entry_headline (mob):  clamp(26px,9vw,32px)         → --registry-entry-headline-mobile
entry_label:           13px                         → --registry-entry-label
entry_sub:             17px                         → --registry-entry-sub
entry_sub (mobile):    15px                         → --registry-entry-sub-mobile
header_height:         64px                         → --registry-header-height
content_max_width:     1080px                       → --registry-content-max-width
text_max_width:        680px                        → --registry-text-max-width
mobile_breakpoint:     768px                        → --registry-mobile-breakpoint
page_padding_desktop:  48px                         → --registry-page-padding-desktop
page_padding_mobile:   20px                         → --registry-page-padding-mobile
plaque_body:           16px                         → --registry-plaque-body
plaque_body (mobile):  15px                         → --registry-plaque-body-mobile
plaque_padding_desktop: 32px                        → --registry-plaque-padding-desktop
plaque_padding_mobile:  24px                        → --registry-plaque-padding-mobile
plaque_title:          24px                         → --registry-plaque-title
plaque_title (mobile): 21px                         → --registry-plaque-title-mobile
section_headline:      24px                         → --registry-section-headline
section_spacing_desktop: 72px                       → --registry-section-spacing-desktop
section_spacing_mobile: 44px                        → --registry-section-spacing-mobile
```

**No font family tokens exist in DB.** No `--registry-font-heading`, `--registry-font-body`, or equivalent.

---

## RUNTIME TOKEN PIPELINE

**Source:** `MeasuresRegistryRuntimeRegistered.tsx` lines 263–270

```ts
const registryTokenStyle = useMemo(() => {
  const style: Record<string, string> = {}
  for (const token of designTokens) {
    if (token.is_active === false) continue
    style[cssTokenName(token.token_key, token.media_query)] = token.token_value
  }
  return style as CSSProperties
}, [designTokens])
```

**`cssTokenName()` in `registeredRuntimeUtils.ts` line 342:**
```ts
export function cssTokenName(tokenKey: string, mediaQuery: string | null): string {
  const suffix = mediaQuery ? "-mobile" : ""
  return `--registry-${tokenKey.replaceAll("_", "-")}${suffix}`
}
```

- `token_key: "background_obsidian"` → `--registry-background-obsidian`
- `token_key: "body"`, `media_query: "(max-width: 768px)"` → `--registry-body-mobile`

**Application:** `registryTokenStyle` is applied as `style={registryTokenStyle}` on `<main class="measures-registry-runtime">` in every renderer.

**CSS brand token derivation** (`.measures-registry-runtime` root rule, `src/index.css` lines 30–38):
```css
--registry-brand-field: var(--registry-brand-obsidian, var(--registry-background-obsidian));
--registry-brand-panel-surface: var(--registry-brand-lapis-night, var(--registry-panel-obsidian));
--registry-brand-accent: var(--registry-brand-deep-lapis, var(--registry-accent-cool));
--registry-brand-primary-text: var(--registry-brand-silver-frame, var(--registry-text-primary));
--registry-brand-secondary-text: var(--registry-brand-marble-accent, var(--registry-text-secondary));
--registry-brand-muted-text: var(--registry-brand-marble-accent, var(--registry-text-muted));
--registry-brand-border: var(--registry-brand-silver-frame, var(--registry-border-subtle));
--registry-brand-highlight: var(--registry-brand-crystal-star, var(--registry-text-primary));
```

**Scale alias tokens** (`.measures-registry-runtime` root rule, lines 40–47):
```css
--registry-entry-headline-active: var(--registry-entry-headline);
--registry-body-active: var(--registry-body);
--registry-page-padding-active: var(--registry-page-padding-desktop);
--registry-section-spacing-active: var(--registry-section-spacing-desktop);
```

Mobile media query (inside `@media (max-width: 760px)`) switches active aliases to `-mobile` counterparts.

**Pipeline assessment:** Working correctly for scale, spacing, palette tokens. DB → inline CSS custom props → CSS var() → consumed. No breakage found.

**Sitewide contract NOT directly loaded by runtime.** The runtime loads `measures_encounter_def` (per-encounter metadata), `measures_design_token`, `measures_media_map`, `measures_seat_offering`, `measures_publication_registry`, `measures_publication_dispatch`. The sitewide concordance document/relations are not queried at runtime. The contract governs via the author/executor layer only.

**`sectionCopy()` reads from per-encounter DB rows:**
- `metadata.styling_contract` → `stylingContract`
- `metadata.layout_contract` → `layoutContract`
- `metadata.source_sitewide_contract` → not exposed in `sectionCopy()` — not surfaced to renderers

---

## TYPOGRAPHY / FONT CONTRACT

**Contract:** `mrssc_v1_typography_contract` — governs heading_font_authority, body_font_authority, hierarchy_scaling, desktop_mobile_typography.

### Font Loading
- **Heading font:** `Cormorant Garamond` (300–700, italic variants)
- **Body font:** `Inter` (300–600)
- **Load mechanism:** Google Fonts `<link>` in `index.html` / `dist-registry/index.html` — NOT via CSS `@font-face`, NOT via CSS `@import`, NOT via font token
- **Font display:** `swap` (via Google Fonts URL parameter `&display=swap`)

### CSS Font Family Declarations
```
src/index.css line 75:   font-family: Inter, system-ui, sans-serif               (c3-ops-shell)
src/index.css line 169:  font-family: "Cormorant Garamond", Georgia, serif        (repeated ~11x for headings)
src/index.css line 6627: font-family: Inter, system-ui, -apple-system, ...        (mobile override)
src/styles/global.css:   font-family: Inter, system-ui, ...                       (global body)
```

- All font family declarations are **hardcoded string literals** in CSS
- **No CSS custom property exists for font families** (`--registry-font-heading`, `--registry-font-body`, or equivalent are absent)
- **No font family DB tokens exist** — the 36 active `measures_design_token` rows contain only scale/palette/spatial values
- The `.measures-registry-runtime` root rule sets `font-size: var(--registry-body)` — body SIZE is tokened, but font FAMILY is not

### Scale Token Coverage
```
--registry-entry-headline: clamp(36px, 4.5vw, 48px)  [seated, consumed]
--registry-entry-sub: 17px                             [seated, consumed]
--registry-body: 16px                                  [seated, consumed]
--registry-entry-label: 13px                           [seated, consumed]
--registry-plaque-title: 24px                          [seated, consumed]
--registry-plaque-body: 16px                           [seated, consumed]
--registry-section-headline: 24px                      [seated, consumed]
```

All with mobile counterparts switching via `--registry-*-active` alias pattern in mobile media query.

### Classification
- **Body size scale:** seated and consumed ✓
- **Heading size scale:** seated and consumed ✓
- **Heading font family:** consumed but not seated — hardcoded `"Cormorant Garamond"` literal in CSS, no token
- **Body font family:** consumed but not seated — hardcoded `Inter` literal in CSS, no token
- **Font loading mechanism:** HTML link tag only — not governed by CSS token system

---

## COLOR / MATERIAL TOKEN CONTRACT

**Contract:** `mrssc_v1_color_material_contract` — governs obsidian, lapis, crystal, marble, semantic_usage_boundaries, interaction_states.

### Obsidian Material
- DB tokens for obsidian palette: fully seated (`brand_obsidian`, `background_obsidian`, `brand_silver_frame`, `brand_marble_accent`, `brand_crystal_star`, `brand_deep_lapis`, `brand_lapis_night`, `panel_obsidian`, all text/border tokens)
- CSS `.measures-registry-runtime` root rule: derives brand tokens via `var()` chains from DB-injected custom properties — correctly resolves to obsidian surface
- `[data-material-family="obsidian"]` CSS rule at line 5322: adds `--registry-obsidian-edge`, `--registry-obsidian-gold`, `--registry-obsidian-smoke`, gradient background — scoped to assessment chamber
- **Obsidian: seated and consumed ✓**

### Marble Material
- Marble literal colors hardcoded in CSS `[data-material-family="marble"]` at line 6209:
  ```css
  --registry-brand-field: #f4efe4;
  --registry-brand-panel-surface: #eae4d9;
  --registry-brand-primary-text: #13110e;
  --registry-brand-secondary-text: #3d3830;
  --registry-brand-muted-text: #6b6357;
  --registry-brand-border: rgba(19, 17, 14, 0.14);
  --registry-brand-accent: #2b5ab8;
  --registry-brand-highlight: #2b5ab8;
  ```
- These values are NOT DB tokens — they are hardcoded in CSS
- `data-material-family="marble"` attribute is hardcoded in JSX on `RegisteredPhaseReveal` and `RegisteredAbout` — not read from `stylingContract.material_family`
- **Marble: partially seated** — CSS rule present and functioning, but marble literal colors not in DB token system; JSX attribute hardcoded

### Lapis Material
- DB has lapis tokens: `brand_deep_lapis: #1F2F8D` (accent), `brand_lapis_night: #101A4D` (panel)
- These are consumed as obsidian accent/panel via the root brand token derivation
- **No `[data-material-family="lapis"]` CSS rule exists** — no dedicated lapis surface rendering
- **Lapis: seated in DB, consumed as obsidian sub-tokens only, no lapis surface override**

### Crystal Material
- DB has: `brand_crystal_star: #F2F4F8` — consumed as obsidian highlight via `--registry-brand-highlight`
- **No `[data-material-family="crystal"]` CSS rule exists** — no dedicated crystal surface rendering
- **Crystal: seated in DB, consumed as obsidian highlight only, no crystal surface override**

### Semantic Conflation: Secondary and Muted Text
CSS root rule lines 34–35:
```css
--registry-brand-secondary-text: var(--registry-brand-marble-accent, var(--registry-text-secondary));
--registry-brand-muted-text: var(--registry-brand-marble-accent, var(--registry-text-muted));
```
Both `--registry-brand-secondary-text` and `--registry-brand-muted-text` resolve to the same DB token: `brand_marble_accent: #C7CBD2`. Distinct semantic roles share a single color value on obsidian surfaces. This conflates "secondary" (active content, supporting text) with "muted" (deemphasized, captions).

### Interaction States
`.registry-encounter-actions button` at line 3753: `border`, `background`, `color`, `padding`, `font`, `cursor` — **no hover or focus-visible state defined**. Interaction states are missing for the primary CTA surface.

### Classification
- Obsidian: **seated and consumed**
- Marble: **partially seated** (CSS hardcoded, JSX hardcoded, not DB tokens)
- Lapis: **seated in DB, not consumed as a surface** (consumed as accent/panel only)
- Crystal: **seated in DB, not consumed as a surface** (consumed as highlight only)
- Secondary/muted text semantic conflation: **hardcoded drift**
- Interaction states (hover/focus on encounter buttons): **missing**

---

## BUTTON / CTA CONTRACT

**Contract:** `mrssc_v1_button_icon_contract` — governs primary_cta, secondary_cta, passage_controls, icon_rendering_authority, hover_focus_behavior, mobile_scaling.

### Current CSS Coverage
- `.registry-encounter-actions` (line 3747): flex container, `gap: 0.75rem`
- `.registry-encounter-actions button` (line 3753): border, border-radius, panel-surface background, primary-text color, padding, `font: inherit`, body font-size, cursor
- `.registry-diagnostic-passage button` (line 4132): passage control button styling
- `.registry-reserve-option` (line 3778): seat offering buttons — own extensive styling
- No `.registry-action-primary` class in CSS
- No `.registry-action-secondary` class in CSS
- No hover or focus-visible states for `.registry-encounter-actions button`

### Missing Contract Fields
- **Primary vs secondary CTA visual hierarchy:** missing — all encounter action buttons share identical styling regardless of action type (submit, continue, back)
- **Hover/focus behavior:** missing — `.registry-encounter-actions button` has no hover/focus-visible CSS. Accessibility gap on all downstream surfaces.
- **Icon rendering authority:** missing — no icon CSS, no icon component in registered runtime renderers
- **Mobile button scaling:** partially consumed — `font-size: var(--registry-body-active)` switches with active alias, but no dedicated button height, padding, or layout tokens for mobile

### Classification
- Basic encounter button styling: **consumed but not seated** (no contract-specified class names; no primary/secondary distinction)
- Hover/focus states: **missing**
- Primary/secondary CTA distinction: **missing**
- Icon rendering: **missing**
- Mobile scaling: **partially consumed**

---

## BRANDING / MARK / WATERMARK CONTRACT

**Contract:** `mrssc_v1_branding_contract` — governs registry_mark_usage, mark_placement_classes, mark_opacity_rules, institutional_identity_boundaries.

### Registry Mark
- Media role `registry_mark` is in `REGISTERED_MEDIA_ROLES` — DB-seated
- `registryMarkUrl` is resolved from `mediaMap.get("registry_mark")` — consumed
- `renderHeader()` in shell renders `<img src={registryMarkUrl} />` inside `.registry-public-brand`
- CSS `.registry-public-brand img` (line 3345): `width: 1.05rem; height: 1.05rem; border-radius: 999px; object-fit: contain`
- CSS `.registry-mark` (line 5839): `width: clamp(3rem, 8vw, 5.5rem); height: auto` — this class is NOT used in the registered runtime; it applies to old runtime rendering
- Mark appears in all registered surfaces via `renderHeader()` — very small (1.05rem)

### Registry Watermark
- Media roles `registry_watermark` and `watermark` are loaded and used via `registryWatermarkUrl`
- `registryWatermarkUrl` is passed to `RegisteredAssessment` → `MeasuresAssessmentChamber`
- Watermark rendering is scoped to the assessment chamber only
- No watermark rendering on other registered surfaces

### Mark Opacity Rules
- `.registry-public-brand img`: no explicit opacity rule — opacity 1 by default
- `[data-material-family="obsidian"] .registry-assessment-brand-layer .registry-assessment-watermark` (line 5352): has opacity CSS for assessment chamber watermark
- No material-specific mark opacity for the header mark on marble vs obsidian surfaces — same `.registry-public-brand img` rule applies to all

### Classification
- Registry mark loading: **seated and consumed** (DB media role → runtime resolved)
- Header mark placement: **partially consumed** — mark renders in header but uses non-contract `.registry-public-brand img` class (not `.registry-mark`); size is 1.05rem vs contract-specified `clamp(3rem, 8vw, 5.5rem)`
- Watermark: **seated and consumed** (assessment chamber only)
- Mark opacity per material: **missing** — no per-material mark adjustment for header

---

## FOOTER / COPYRIGHT CONTRACT

**Contract:** `mrssc_v1_footer_contract` — `audit_finding: copyright_hardcoded_in_jsx`. Governs copyright_authority, footer_visibility_rules, footer_copy_authority, system_linkage_rules.

### Current State (post OAR1: apply_footer_contract)
- `renderSystemFooter()` defined once in shell
- Footer passed to: eval_passage, structure_passage, connect_src, measures_eval_email_contract, measures_phases_reveal, about_measures_registry, structural_drift_dispatches, publication_dispatch, reserve_seat, phase_payment
- Footer omitted from: intro, path_choice (evaluate_structure_path)
- CSS `.registry-system-footer` (line 4669): flex layout, border-top, muted text — **in place**
- **Hardcoded copy:** `"&copy; 2026 c3 Community Partners DAO, LLC"` and `"Measures Registry is a registered c3 Field system."` — not in DB

### Classification
- Footer visibility rules: **consumed** ✓
- Footer CSS: **seated and consumed** ✓
- Copyright text authority: **hardcoded drift** — not in DB, hardcoded JSX

---

## VIEWPORT CONTAINMENT CONTRACT

**Contract:** `mrssc_v1_viewport_containment_contract` — governs desktop_containment, mobile_containment, single_screen_encounter_fit, overflow_behavior, encounter_viewport_boundaries.

### Root Containment
- `.measures-registry-runtime` (line 22): `min-height: 100svh; width: 100%; overflow: auto`
- `overflow: auto` — allows scroll when content exceeds viewport height (correct — no clip)

### Surface Wrapper Coverage
| Surface | Class | min-height | top padding |
|---|---|---|---|
| eval_passage | `.registry-diagnostic-passage` | `100svh` | `clamp(0.8rem, 2.2vw, 1.35rem)` — **NO header offset** |
| structure_passage | `.registry-diagnostic-passage` | `100svh` | `clamp(0.8rem, 2.2vw, 1.35rem)` — **NO header offset** |
| measures_assessment | `MeasuresAssessmentChamber` | present | `calc(header-height + spacing)` — correct |
| connect_src | `.registry-connect-src` | `100svh` | `calc(var(--registry-header-height) + spacing)` ✓ |
| measures_eval_email_contract | `.registry-eval-email-contract` | `100svh` | `calc(var(--registry-header-height) + spacing)` ✓ |
| measures_phases_reveal | `.registry-phases-reveal` | `100svh` | `calc(var(--registry-header-height) + spacing)` ✓ |
| about_measures_registry | `.registry-about-authority` | `100svh` | `calc(var(--registry-header-height) + spacing)` ✓ |
| reserve_seat | `.registry-reserve-selector` | `100svh` | `calc(var(--registry-header-height) + spacing)` ✓ |
| phase_payment | `.registry-hold-surface` | `100svh` | `calc(var(--registry-header-height) + spacing)` ✓ |

**`eval_passage` / `structure_passage` header offset gap:** `.registry-diagnostic-passage` top padding is `clamp(0.8rem, 2.2vw, 1.35rem)` — does not account for `--registry-header-height: 64px`. Content will render behind the fixed header on these surfaces. All other surfaces correctly use `calc(var(--registry-header-height) + var(--registry-section-spacing-active))`.

### Desktop/Mobile Token Coverage
- `--registry-page-padding-active` switches: desktop=48px, mobile=20px
- `--registry-section-spacing-active` switches: desktop=72px, mobile=44px
- Mobile `@media (max-width: 760px)` media query switches `--registry-*-active` aliases

### Classification
- Desktop containment: **seated and consumed** ✓
- Mobile containment: **seated and consumed** ✓
- Single screen fit: **consumed for most surfaces** — gap: eval/structure passage missing header-height top padding offset
- Overflow: **seated and consumed** (`overflow: auto` on root)
- Passage top padding: **CSS parity incomplete** — `.registry-diagnostic-passage` missing `--registry-header-height` offset

---

## MEDIA BEHAVIOR CONTRACT

**Contract:** `mrssc_v1_media_behavior_contract` — `audit_finding: passageMuted_is_session_global`. Governs autoplay_rules, mute_unmute_behavior, interaction_unlock_rules, media_persistence_boundaries, encounter_scoped_media_behavior.

**Contract:** `mrssc_v1_marble_tone_contract` — `audit_finding: marble_tone_persists_across_surfaces_unscoped`. Governs low_volume_baseline, encounter_scoped_playback_rules, continuity_rules, mute_relationship_rules.

### `passageMuted` Scope
```tsx
// MeasuresRegistryRuntimeRegistered.tsx line 153
const [passageMuted, setPassageMuted] = useState(true)
```
- Single `useState` shared across all surfaces
- Passed to `RegisteredPassage` (both eval and structure variants via `sharedAssessmentProps`)
- Passed to `RegisteredAssessment` via `sharedAssessmentProps.passageMuted`
- Not reset when navigating between surfaces
- `onToggleMuted` changes this single boolean for all passage contexts
- **Session-global drift confirmed** — `mrssc_v1_media_behavior_contract` requires `persistence_boundary: encounter`

### Marble Tone Continuity
```tsx
// MeasuresRegistryRuntimeRegistered.tsx line 630-643
function renderMarbleToneContinuity() {
  if (passageMuted || !marbleToneUrl) return null
  return (
    <audio
      className="registry-marble-tone"
      src={marbleToneUrl}
      autoPlay loop preload="auto" aria-hidden="true"
      ref={(node) => { if (node) node.volume = 0.08 }}
    />
  )
}
```
- Renders in shell wrapper (not inside any surface renderer)
- Plays whenever `!passageMuted && marbleToneUrl` — regardless of which surface is active
- Begins when user unmutes a passage; persists across ALL subsequent surface transitions
- **Session-global drift confirmed** — `mrssc_v1_marble_tone_contract` requires encounter-scoped playback

### Autoplay / Video Behavior
- `epigraphVideoRef` + `useEffect` drives epigraph autoplay (muted by default, user must unmute)
- Passage video: `autoPlay muted={passageMuted}` — autoplay is muted by default (browser-safe)
- Video controls are present on passage surfaces

### Classification
- Autoplay (muted default): **seated and consumed** ✓
- `passageMuted` scope: **session-global drift** — must reset per encounter
- Marble tone scope: **session-global drift** — must be scoped to marble encounter surfaces
- Passage video controls: **consumed** ✓

---

## TRANSITION CONTRACT

**Contract:** `mrssc_v1_transition_contract` — `audit_finding: orphaned_transition_contract_unrealized`. Governs encounter_transition_behavior, dissolve_fade_authority, state_isolation_expectations.

### Current State
- No transition wrapper component in registered runtime
- No Framer Motion or equivalent animation library in use
- Surface switching: instant React state change, no mount/unmount animation
- CSS `@keyframes` present for: `registry-failure-drift`, `registry-coherence-align`, `registry-coherence-resolve`, `registry-epigraph-context-soften`, `c3-crystal-coherence-pulse` — all scoped to intro/assessment UI, not surface-to-surface transitions
- CSS `transition:` rules are on individual elements (hover effects, link borders), not on surface-level elements

### Classification
- Encounter transition behavior: **orphaned contract** — completely unimplemented; instant surface swaps

---

## CORRECTION CLASSIFICATION MAP

| Layer | Contract Standing | Runtime/CSS Standing | Classification | Recommended Correction |
|---|---|---|---|---|
| Typography — font family | `mrssc_v1_typography_contract` active | Hardcoded literals in CSS; no CSS custom props | **Consumed but not seated** | Add `--registry-font-heading` / `--registry-font-body` CSS custom props; seed as DB tokens; wire to CSS |
| Typography — font scale | `mrssc_v1_typography_contract` active | DB tokens → CSS vars → consumed | **Seated and consumed** | No correction needed |
| Colors — obsidian | `mrssc_v1_color_material_contract` active | DB tokens → CSS brand chain → consumed | **Seated and consumed** | No correction needed |
| Colors — marble | `mrssc_v1_color_material_contract` active | CSS hardcoded literals; JSX hardcoded attr | **Partially seated / hardcoded drift** | Seat marble token values in DB; read `stylingContract.material_family` from DB in renderers |
| Colors — lapis surface | `mrssc_v1_color_material_contract` active | Lapis DB tokens consumed as accent/panel only; no lapis surface CSS rule | **Seated in DB, not consumed as surface** | Add `[data-material-family="lapis"]` CSS override when lapis surfaces are needed |
| Colors — crystal surface | `mrssc_v1_color_material_contract` active | Crystal DB token consumed as highlight only; no crystal surface CSS rule | **Seated in DB, not consumed as surface** | Add `[data-material-family="crystal"]` CSS override when crystal surfaces are needed |
| Colors — secondary/muted semantic split | `mrssc_v1_color_material_contract` active | Both `--registry-brand-secondary-text` and `--registry-brand-muted-text` resolve to `brand_marble_accent` | **Hardcoded drift** | Split var chains: secondary-text should use `brand_silver_frame`; muted-text should use `brand_marble_accent` |
| Buttons — encounter actions | `mrssc_v1_button_icon_contract` active | Basic styling present; no contract class names; no hover/focus | **Consumed but not seated** | Add hover/focus-visible CSS; introduce `.registry-action-primary` / `.registry-action-secondary` distinctions |
| Buttons — hover/focus states | `mrssc_v1_button_icon_contract` active | Missing — no hover/focus-visible on `.registry-encounter-actions button` | **Missing** | Add hover and focus-visible states (priority) |
| Buttons — icon rendering | `mrssc_v1_button_icon_contract` active | No icon CSS or component | **Missing** | Future scope — requires icon seating in DB |
| Branding — registry mark | `mrssc_v1_branding_contract` active | DB media role loaded and rendered in header | **Seated and consumed** | No correction needed for loading |
| Branding — mark placement class | `mrssc_v1_branding_contract` active | `.registry-public-brand img` used (1.05rem); `.registry-mark` class exists but unused in registered runtime | **Consumed but not seated** | Reconcile header mark sizing to contract; consider `.registry-mark` class usage |
| Branding — watermark | `mrssc_v1_branding_contract` active | DB media role; consumed in assessment chamber | **Seated and consumed (chamber only)** | No correction needed |
| Branding — mark opacity per material | `mrssc_v1_branding_contract` active | No material-specific mark adjustment | **Missing** | Add mark opacity/filter adjustment for marble surface header |
| Footer — visibility | `mrssc_v1_footer_contract` active | Shared render prop; centralized decision | **Consumed** ✓ | Accepted by prior OAR |
| Footer — CSS | `mrssc_v1_footer_contract` active | `.registry-system-footer` in CSS | **Seated and consumed** ✓ | No correction needed |
| Footer — copyright text | `mrssc_v1_footer_contract` active | Hardcoded in JSX | **Hardcoded drift** | Seat copyright copy in DB; read from `sitewide_contract.footer_copy` or encounter metadata |
| Viewport — surface wrappers | `mrssc_v1_viewport_containment_contract` active | `min-height: 100svh` on all surfaces | **Seated and consumed** ✓ | No correction needed |
| Viewport — passage header offset | `mrssc_v1_viewport_containment_contract` active | `.registry-diagnostic-passage` missing `--registry-header-height` offset | **CSS parity incomplete** | Add header-height top padding offset to `.registry-diagnostic-passage` |
| Media behavior — passageMuted | `mrssc_v1_media_behavior_contract` active | Session-global state; does not reset per encounter | **Session-global drift** | Scope `passageMuted` to encounter or reset on surface navigation |
| Media behavior — marble tone | `mrssc_v1_marble_tone_contract` active | Persists across all surface transitions | **Session-global drift** | Scope marble tone to marble-family surfaces only |
| Transition | `mrssc_v1_transition_contract` active | Completely unimplemented; instant surface swaps | **Orphaned contract** | Future scope — requires transition wrapper architecture |
| Runtime token pipeline | `mrssc_v1_preserved_runtime_assets` active | DB → cssTokenName() → inline style → CSS vars → consumed | **Seated and consumed** ✓ | No correction needed |
| Registered 13 public runtime contract | Not found in concordance | N/A | **Missing from DB** | Seat `registered_13_public_runtime_contract` in `concordance_document` |

---

## FIRST ENCOUNTER CORRECTION TARGET: `eval_passage`

Based on sitewide contract audit. Confirmation: `eval_passage` is the correct first target.

### Typography
- Font family: `Cormorant Garamond` hardcoded CSS literal — font family token gap affects all surfaces, not correctable per-encounter without sitewide CSS property introduction
- Font scale: seated and consumed — no correction needed for `eval_passage` specifically
- **Correction:** Sitewide CSS action — add `--registry-font-heading` and `--registry-font-body` custom props to `.measures-registry-runtime`; wire to all heading/body declarations; seed as DB tokens (applicable to all surfaces simultaneously)

### Material / Color
- `eval_passage` is obsidian surface — token chain functions correctly
- Secondary/muted text semantic split: `#C7CBD2` for both — minor visual impact on obsidian (both resolve to marble-accent silver)
- No `data-material-family` correction needed for `eval_passage` (obsidian is the default)
- **Correction:** Sitewide CSS action — split `--registry-brand-secondary-text` and `--registry-brand-muted-text` var chains; secondary should use `brand_silver_frame` (#D7DBE3, lighter/brighter), muted should stay as `brand_marble_accent` (#C7CBD2, more muted)

### Video / Media
- `passageMuted` does not reset at encounter exit — carries across surface transitions
- User unmuting on `eval_passage` will cause marble tone to play on subsequent marble surfaces unexpectedly
- **Correction:** Add `passageMuted` reset on surface navigation in `navigate()` or add per-surface mute state keyed by surface; scope marble tone to `activeSurface` being a marble-family surface

### CTA / Button
- `.registry-encounter-actions button` on `eval_passage` has no hover or focus-visible state
- No primary/secondary distinction
- **Correction (priority):** Add hover and focus-visible CSS for `.registry-encounter-actions button` — minimum required for visual governance and accessibility compliance
- **Correction (follow-on):** Introduce `.registry-action-primary` / `.registry-action-secondary` class distinctions in CSS and wiring in renderers (per `mrssc_v1_button_icon_contract`)

### Viewport Containment
- `.registry-diagnostic-passage` top padding is `clamp(0.8rem, 2.2vw, 1.35rem)` — content renders behind `registry-public-header` (64px height)
- **Correction:** Change top padding to `calc(var(--registry-header-height) + var(--registry-section-spacing-active))` — matching pattern of all other downstream surfaces

### Footer
- Footer now appears on `eval_passage` via shared render prop ✓
- **No correction needed for `eval_passage` specifically**

### Transition
- No encounter transition implemented
- **Not in scope for first encounter correction** — requires architecture decision

---

## CONFIRMATIONS

- No DB rows modified ✓
- No source files modified ✓
- No CSS modified ✓
- No routing changed ✓
- No scoring changed ✓
- No contact capture behavior changed ✓
- No email contract behavior changed ✓
- Old `src/measures_registry/MeasuresRegistryRuntime.tsx` not touched ✓

---

## OPEN CORRECTION GROUPS (POST-AUDIT)

The following correction groups are defined from this audit for routing into OAR2:

### Priority Group A — Accessibility / Visual Governance (immediate)
1. **Hover/focus states for `.registry-encounter-actions button`** — missing on all downstream surfaces; accessibility gap
2. **`.registry-diagnostic-passage` header offset** — content hidden behind fixed header on eval_passage and structure_passage

### Priority Group B — Material/Color Semantic Integrity
3. **Secondary/muted text semantic split** — `--registry-brand-secondary-text` and `--registry-brand-muted-text` both resolve to `brand_marble_accent`; must be split
4. **Marble token seating in DB** — marble literal values hardcoded in CSS; should be DB-tokened
5. **`data-material-family` read from DB** — `RegisteredPhaseReveal` and `RegisteredAbout` hardcode `data-material-family="marble"`; should read from `stylingContract.material_family`

### Priority Group C — Typography / Font Governance
6. **Font family CSS custom properties** — `--registry-font-heading` / `--registry-font-body` do not exist; font families not governable via token system

### Priority Group D — Media State Scoping
7. **`passageMuted` session scope** — must reset per encounter (`mrssc_v1_media_behavior_contract`)
8. **Marble tone surface scope** — must gate on active surface being marble-family (`mrssc_v1_marble_tone_contract`)

### Group E — DB Contract Seating
9. **Footer copyright text** — must be seated in DB
10. **`registered_13_public_runtime_contract`** — not found in concordance_document
11. **Primary/secondary CTA distinction** — `.registry-action-primary` / `.registry-action-secondary` CSS classes and DB button contract seating

### Group F — Orphaned Contract (future scope)
12. **Encounter transitions** — `mrssc_v1_transition_contract` unimplemented; requires architecture decision
