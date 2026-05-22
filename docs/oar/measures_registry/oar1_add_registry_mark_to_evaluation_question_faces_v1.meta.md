---
document_type: oar1
authority_level: working
document_scope: measures_registry_frontend
title: OAR1 — Add Registry Mark to Evaluation Question Faces
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_add_registry_mark_to_evaluation_question_faces_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - evaluation-surface
  - registry-mark
  - branding-contract
  - frontend
---

# OAR1 — Add Registry Mark to Evaluation Question Faces

## OBJECTIVE

Execute correction for:

`docs/oar/measures_registry/oar2_add_registry_mark_to_evaluation_question_faces_v1.meta.md`

Add the Measures Registry mark to the upper-right corner of all evaluation question faces, resolved from the existing runtime/media contract.

---

## ACTION

### Renderer Change

File: `src/measures_registry/MeasuresAssessmentChamber.tsx`

Inside the question form branch, added mark image inside `registry-single-question-fieldset`:

```tsx
{registryMarkUrl ? (
  <img className="registry-question-mark" src={registryMarkUrl} alt="" aria-hidden="true" />
) : null}
```

- Renders only when `registryMarkUrl` is non-null
- Resolves from `registryMarkUrl` prop — already sourced from `mediaMap.get("registry_mark")` via the seated media contract
- No hardcoded path introduced

### CSS Change

File: `src/index.css`

Added `position: relative` to `.registry-single-question-fieldset` to establish positioning context.

Added `.registry-question-mark` rule:

```css
.registry-question-mark {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: clamp(1.5rem, 2.5vw, 2rem);
  opacity: 0.55;
  pointer-events: none;
}
```

Added obsidian override:

```css
.measures-registry-runtime[data-material-family="obsidian"] .registry-question-mark {
  opacity: 0.72;
}
```

### Preserved

- Question text, options, answer behavior unchanged
- Evaluation flow and routing unchanged
- Material contracts unchanged
- Assessment chamber behavior unchanged
- No duplicate branding authority introduced

---

## VALIDATION

### Mark Source

`registryMarkUrl` → `mediaUrl(mediaMap.get("registry_mark"))` → seated `measures_media_map` media role.

No hardcoded asset path. No new branding authority.

### Build Status

Command: `npm.cmd run build:registry`

Result: passed

Output directory: `dist-registry`

Generated build artifacts cleaned after validation.

### File References

| File | Change |
|---|---|
| `src/measures_registry/MeasuresAssessmentChamber.tsx` | Mark img added inside `registry-single-question-fieldset` |
| `src/index.css` | `position: relative` on fieldset; `.registry-question-mark` positioning and obsidian opacity rules added |

### Confirmation

- Mark resolves from seated `registry_mark` media role — not hardcoded
- Renders only when `registryMarkUrl` is non-null
- Upper-right corner of question fieldset
- Obsidian opacity override applied
- No unrelated surfaces modified
- Build passed

---

## IMPLEMENTATION STATUS

Renderer and CSS correction executed.

Build validated.

---

## CLOSEOUT

OAR2 correction executed.

Measures Registry mark now appears in the upper-right corner of all evaluation question faces, resolved from the seated branding/media contract.

OAR1 ready for operator review.
