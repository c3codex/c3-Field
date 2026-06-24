---
name: measures-registry-design
description: >
  Use this skill whenever implementing, refactoring, or reviewing visual design for
  Measures Registry public surfaces in Claude Code. Triggers on: CSS work, layout
  changes, typography, spacing, motion, responsive behavior, component styling,
  image/video presentation, encounter surface design, or any task that touches the
  visual layer of registered_runtime renderers. Also triggers when asked to improve
  readability, redesign a surface, fix visual hierarchy, or style a new encounter.
  This skill governs design decisions within the Measures Registry executor system —
  always used alongside the measures-registry-executor skill, never as a replacement
  for it. Design here is renderer-bound: it serves seated DB state, never replaces it.
---

# Measures Registry Design Implementation Skill

## Role

Claude is the design implementor for Measures Registry public surfaces.

Design here has one job: make seated Codex/Measures state clear, usable,
public-facing, and coherent — without the frontend owning truth.

This skill operates **inside** the executor constraint system. Read
`measures-registry-executor` SKILL.md first if not already in context.

---

## The Core Constraint

Design may carry. Design may not become authority.

| Design may carry | Design may not do |
|-----------------|-------------------|
| Visual hierarchy | Replace DB copy with component-owned text |
| Spacing and containment | Hardcode assessment outcomes |
| Typography | Fake release state |
| Motion and animation | Invent missing media |
| Responsive behavior | Expose internal governance terms publicly |
| Image/video presentation | Create fallback truth |
| Accessibility | Redesign into a SaaS conversion flow |
| Public readability | Make design decisions that imply authority |
| Material tone where seated | Override seated encounter sequencing |

If DB state is absent, design renders honest state:
- `held` — content exists but is not yet released
- `loading` — async fetch in progress
- `unavailable` — surface exists, content not seated
- `failed` — fetch error, show clearly

Never fabricate. Never fill the gap with invented copy or placeholder media.

---

## Design Principles for This System

### 1. Render what is registered

All content visible on a public surface must derive from DB state. Typography,
layout, and motion frame that content — they do not supply it.

```tsx
// CORRECT — copy from DB
<h1 className="registry-about-headline">{aboutCopy.approvedContentContract.title}</h1>

// WRONG — design is supplying authority
<h1 className="registry-about-headline">About Measures Registry</h1>
```

### 2. Material tone follows Codex, not convention

Measures Registry is not a SaaS product. Do not reach for:
- hero sections with value propositions
- feature grids with icon + headline + body
- pricing card layouts
- generic CTA button patterns ("Get Started", "Learn More")
- light backgrounds with rounded cards
- conversion-optimized layout hierarchy

The system has its own material character. Design should carry that character
without inventing it.

### 3. Held and missing state is a design problem too

When DB state is absent, the design surface is not "empty" — it is in a
specific state that the user may encounter. Design that state deliberately:

```tsx
// A held surface is not a blank div
<div className="surface-held" data-surface={surfaceKey}>
  <span className="held-indicator">—</span>
</div>
```

Held state should feel intentional, not broken. Missing state should feel
honest, not hidden.

### 4. Signature before decoration

Choose one element per surface that carries the visual character. Everything
else supports it quietly. Do not scatter bold choices — spend them in one place.

### 5. Motion serves encounter sequence, not atmosphere

Animation must relate to encounter state: intro plays before path choice,
transitions follow registered navigation order, reveals follow release state.

Do not add motion that implies a sequence the DB has not seated.

---

## CSS Architecture

### Naming convention

Surface-scoped selectors:

```css
/* Surface root */
[data-public-path="surface_key"] { }

/* Surface-specific components */
.registry-{surface}-{element} { }

/* Examples */
.registry-about-surface { }
.registry-about-headline { }
.registry-about-video-frame { }
.registry-about-body { }
.registry-about-card { }
```

### Visual system file

Global design tokens live in:
`src/measures_registry/registered_runtime/styles/registry.visual-system.css`

Add new shared tokens here. Do not redefine tokens per-surface.

### Surface style files

Per-surface CSS lives in:
`src/measures_registry/registered_runtime/styles/encounters/{surface}.css`

One file per surface. Scope all selectors to `[data-public-path]` or surface
class prefixes to prevent bleed.

### Specificity discipline

CSS selector conflicts are a common failure mode. Before writing CSS:
- Identify which selectors already exist for this surface
- Do not create class names that collide with global utility classes
- Prefer `[data-public-path="x"] .component` over bare `.component`
- Test padding/margin conflicts between adjacent sections

---

## Media Presentation

Images and video derive from DB media map. Never hardcode asset paths.

```tsx
// CORRECT — media from DB or publicationAssetUrl with OAR2-specified fallback
const bannerUrl = undriftedFillUrl ?? publicationAssetUrl("undrifted_banner_website_social.webp")

// WRONG — hardcoded path
const bannerUrl = "/assets/undrifted-banner.webp"
```

### Video surfaces

Use native controls where the encounter does not require custom playback UI:

```tsx
<video
  className="registry-about-video-frame"
  src={videoUrl}
  autoPlay
  muted
  controls
  playsInline
/>
```

Do not add custom Audio/Mute toggles unless OAR2 explicitly requires them.
Prefer native `controls` — simpler, accessible, no state to manage.

### Banner/image surfaces

When a banner image is present, it leads the masthead. Adjust masthead
constraints to fit the image rather than forcing the image into a fixed box:

```css
.undrifted-masthead:has(.undrifted-banner) {
  min-height: unset;
  padding: 0;
}

.undrifted-banner {
  width: 100%;
  height: auto;
  display: block;
}
```

---

## Responsive Behavior

All surfaces must be functional and readable on mobile. Design constraints:

- Desktop: layout may use side-by-side panels, multi-column grids
- Mobile: single column, full-width media, touch-friendly tap targets
- Type scale must remain readable at all breakpoints
- Motion must respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  .registry-motion-element {
    animation: none;
    transition: none;
  }
}
```

---

## Accessibility Floor

Every surface ships with:

- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Visible keyboard focus indicators
- [ ] Alt text for all `<img>` elements (from DB where seated, `""` for decorative)
- [ ] Heading hierarchy consistent with visual hierarchy
- [ ] Interactive elements reachable by keyboard
- [ ] No motion without reduced-motion fallback

---

## What Not To Build

These patterns indicate SaaS drift. Raise a NotChazz Flag if OAR2 requires them
without explicit Codex authority:

| Pattern | Why it drifts |
|---------|--------------|
| Hero + value prop + CTA | Implies Measures Registry is a product being sold |
| Feature grid (icon + title + body) | Fragments the system into sales points |
| Testimonial / social proof section | Frontend-owned authority |
| Pricing cards | Not a registered surface |
| "Get Started" / "Sign Up" CTAs | Replace seated CTA standing with convention |
| Skeleton loaders with fake content shape | Implies known content shape — invent |
| Placeholder copy ("Lorem ipsum" or invented headlines) | Hardcoded, not seated |

---

## Design Review Checklist

Before committing any design implementation:

- [ ] All visible copy derives from DB state (no hardcoded strings)
- [ ] Media sources derive from DB media map or OAR2-specified asset
- [ ] Held/loading/unavailable states are designed, not blank
- [ ] No SaaS layout patterns introduced
- [ ] CSS selectors scoped to surface — no global bleed
- [ ] No specificity conflicts with existing selectors
- [ ] Responsive behavior confirmed at mobile width
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Accessibility floor met
- [ ] Build passes with no TypeScript errors
- [ ] NotChazz Flag raised for any design decision that required invention
