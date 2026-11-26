# c3 Field — A Field of Possibility

## Public Landing DesignPAC

**Version:** 1.0 — Proposed\
**Proposed PAC key:** `c3field_public_landing_designpac_v1`\
**Environment:** c3 Field\
**Surface:** c3field.online\
**Companion:** Public Landing WebPAC\
**Classification:** Presentation and environmental experience

### 1. Design Intent

The public landing page shall communicate a living field of possibility.

The experience should feel organic, expansive, grounded and interconnected.

It must not resemble a conventional enterprise SaaS dashboard, generic AI product website or feature-heavy technology marketplace.

Preserve the established c3 Field aesthetic while making the public environment understandable to first-time visitors.

### 2. Environmental Composition

Retain the one-frame design philosophy through a sequence of cinematic chapters.

Each chapter represents a complete visual composition within the larger scrolling environment.

**Chapter 01 — Arrival**

- Immersive environmental backdrop.
- Prominent c3 Field identity.
- A Field of Possibility.
- Connect. Contribute. Create.
- Concise introductory content.
- Primary Current State CTA.
- Secondary exploration CTA.
- Subtle environmental movement.
- No conventional header over the opening composition.

**Chapter 02 — Current State**

- A calmer, more intimate composition.
- Registered Current State visual representation.
- Clear introduction to the personal environment.
- Prominent signup passage.

**Chapter 03 — Possibilities**

- Six application categories arranged in an organic mosaic.
- Desktop composition of six balanced visual regions.
- Responsive two-column and single-column arrangements.
- Distinct imagery for each application category.
- Consistent typography and interaction behavior.

**Chapter 04 — Explore**

- Existing Connect, Contribute and Create mosaic.
- Three interconnected environmental regions.
- Organic transitions between regions.
- Registered initiative representations.
- No unauthorized participant projection.

**Chapter 05 — Principles**

- Quiet, spacious composition.
- Emphasis on typography.
- Three balanced expressions of coherence, creative sovereignty and non-extraction.
- Measures Registry introduction.

**Chapter 06 — Founders Ground**

- Warm, inviting environmental imagery.
- Bring your own ground.
- Strong visual emphasis on invitation rather than promotion.

**Chapter 07 — Closing**

- Return to the expansive Field aesthetic.
- Final Current State enrollment CTA.
- Public footer and organizational identity.

### 3. Proposed Color Tokens
```
:root {
  --c3-obsidian: #151917;
  --c3-earth: #665447;
  --c3-moss: #596B50;
  --c3-sage: #A8B49B;
  --c3-ivory: #F2EFE6;
  --c3-marble: #E5E2D9;
  --c3-luminous: #D5C58C;

  --c3-text-dark: #20251F;
  --c3-text-light: #F2EFE6;
  --c3-border: rgba(242, 239, 230, 0.18);
  --c3-overlay: rgba(21, 25, 23, 0.48);
}
```

These proposed tokens shall be reconciled against the existing registered c3 Field design system before installation.

Avoid dominant neon colors, excessive gradients and ornamental interface effects.

### 4. Typography

Use an editorial serif for principal environmental headlines and a restrained, highly readable sans-serif for supporting content and navigation.

Preserve registered font assets where available.
```
:root {
  --c3-font-display: Georgia, serif;
  --c3-font-body: system-ui, sans-serif;

  --c3-display-xl: clamp(3rem, 7vw, 7rem);
  --c3-display-lg: clamp(2rem, 4.5vw, 4rem);
  --c3-heading: clamp(1.35rem, 2vw, 2rem);
  --c3-body: clamp(1rem, 1.2vw, 1.125rem);

  --c3-reading-width: 65ch;
}
```

Typography shall remain legible over all environmental media.

### 5. Layout and Spatial System
```
:root {
  --c3-page-gutter: clamp(1.25rem, 5vw, 6rem);
  --c3-section-space: clamp(3rem, 8vw, 8rem);
  --c3-content-width: 1440px;
  --c3-radius: 0.5rem;
}

.c3-chapter {
  position: relative;
  min-block-size: 100svh;
  padding: var(--c3-section-space)
           var(--c3-page-gutter);
  display: grid;
  align-content: center;
  isolation: isolate;
}

.c3-content {
  width: 100%;
  max-width: var(--c3-content-width);
  margin-inline: auto;
}

.c3-reading {
  max-width: var(--c3-reading-width);
  line-height: 1.65;
}
```

Chapters must expand naturally when content requires additional space.

Do not enforce fixed viewport heights that clip content.

Do not introduce mandatory scroll snapping or nested scrolling containers.

### 6. Mosaic Composition
```
.c3-possibility-mosaic {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 2rem);
}

.c3-field-mosaic {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}

.c3-mosaic-region {
  position: relative;
  min-block-size: 16rem;
  overflow: hidden;
  isolation: isolate;
}

@media (max-width: 900px) {
  .c3-possibility-mosaic {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .c3-possibility-mosaic,
  .c3-field-mosaic {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

The grid establishes responsive structure. Environmental imagery and composition shall provide the organic visual character.

Avoid repetitive bordered cards and excessive box shadows.

### 7. Navigation and CTA Treatment

- No conventional navigation header on the initial arrival composition.
- Reveal restrained navigation after arrival.
- Maintain an unobtrusive Current State signup CTA.
- Use small, right-aligned controls where appropriate.
- Preserve consistent CTA hierarchy.
- Ensure minimum accessible interaction targets.
- Avoid obstructing content on small screens.

Primary actions shall use a restrained ivory or luminous treatment against dark environmental surfaces.

Secondary actions shall use text or subtle outlined treatments.

### 8. Media and Environmental Movement

Use registered media assets only.

- WebP imagery through qualified storage.
- Video and audio through registered delivery references.
- Responsive image sources.
- Poster imagery for video fallback.
- Muted initial video playback.
- Explicit mute/unmute controls where audio is present.
- No automatic audible playback.
- Subtle environmental movement rather than decorative animation.
- Lazy loading for below-fold media.

Opening imagery must not delay essential content rendering.

### 9. Interaction and Motion
```
:root {
  --c3-motion-fast: 180ms;
  --c3-motion-standard: 400ms;
  --c3-motion-slow: 800ms;
  --c3-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.c3-interactive {
  transition:
    opacity var(--c3-motion-standard) var(--c3-ease),
    transform var(--c3-motion-standard) var(--c3-ease);
}

@media (prefers-reduced-motion: reduce) {
  .c3-public-landing *,
  .c3-public-landing *::before,
  .c3-public-landing *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Reduced-motion mode shall also pause nonessential environmental video and replace it with registered static imagery.

All meaningful hover interactions must have keyboard and touch equivalents.

The established butterfly interaction may be retained for qualified viewable profile encounters, but not used to imply access to unavailable profiles.

### 10. Accessibility

Target WCAG 2.2 AA.

- Sufficient text and control contrast.
- Visible keyboard focus.
- Semantic navigation.
- Accessible form labels.
- Logical reading order.
- Skip-to-content passage.
- Descriptive alternative text.
- No reliance on color alone.
- No content obscured by persistent controls.
- Support for browser zoom and text enlargement.

### 11. Responsive Requirements

Qualify the experience across:

- 360px mobile.
- 390px mobile.
- 768px tablet.
- 1024px compact desktop.
- 1440px desktop.
- 1920px wide desktop.

Maintain the integrity of each composition without horizontal overflow, inaccessible controls or clipped content.

### 12. Performance Targets

Target Core Web Vitals at the 75th percentile:

- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

Reserve media dimensions before loading.

Prioritize the opening visual and essential text.

Do not load all chapter videos on initial arrival.

### 13. Presentation Boundaries

The DesignPAC governs presentation only.

It shall not:

- Establish participant identity.
- Determine CURRENT standing.
- Grant access.
- Register a PAC.
- Establish a NUG authorization.
- Override SRC.
- Modify WebPAC content.
- Infer public standing from visual availability.
- Depend on OAR2 automation for runtime rendering.

Unavailable registered content shall resolve to an approved fallback or remain unprojected.

### 14. Acceptance

The DesignPAC is qualified when:

- All seven chapters render coherently.
- The approved WebPAC content remains intact.
- Current State signup is clearly accessible.
- Registered media resolves correctly.
- Mobile and desktop compositions pass visual review.
- Keyboard and reduced-motion behavior pass qualification.
- SEO content remains visible and indexable.
- Public and participant presentation boundaries remain intact.