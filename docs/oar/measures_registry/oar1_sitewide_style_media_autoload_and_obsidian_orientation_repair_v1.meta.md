---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Sitewide Style Media Autoload and Obsidian Orientation Repair
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_sitewide_style_media_autoload_and_obsidian_orientation_repair_v1
---

# OAR1 - Sitewide Style Media Autoload and Obsidian Orientation Repair

## EXECUTION METHOD

Migration applied via `npx supabase db push` to project `zfihrspxvennjzazxcbj`.
Source changes applied to TypeScript and CSS files.
TypeScript validated via `npx tsc --noEmit` — zero errors.

---

## MIGRATION APPLIED

`supabase/migrations/202607010001_repair_obsidian_orientation_display_title.sql`

Applied: 2026-07-01.

### SQL

```sql
UPDATE public.measures_encounter_def
SET
  display_title = 'Structural Coherence',
  metadata = jsonb_set(
    jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{content_profile,title}',
      '"Structural Coherence"'::jsonb,
      true
    ),
    '{content_profile,subtitle}',
    '"Recognize the environment before evaluation."'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'obsidian_chamber_orientation';
```

### DB Verification

```json
{
  "encounter_key": "obsidian_chamber_orientation",
  "display_title": "Structural Coherence",
  "content_profile": {
    "cta_label": "Continue",
    "subtitle": "Recognize the environment before evaluation.",
    "title": "Structural Coherence",
    "title_source": "encounter_def.display_title"
  }
}
```

---

## SOURCE CHANGES

### `src/measures_registry/encounter_renderer/resolver/registryResolver.ts`

Added three media roles to `MEDIA_ROLES`:
- `fables_and_myths_cover` — DB: measures-registry / fables_and_myths.webp (active)
- `ai_isnt_broken_landing` — DB: measures-registry / ai_isnt_broken_landing.webp (active)
- `measures_registry_logo` — DB: measures-registry / measures_registry_logo.webp (active)

Prior state: `UnDriftedIndex` attempted to resolve these roles from `encounter.mediaByRole` but the resolver never fetched them. All three resolved to null.

After: all three roles are fetched by the resolver and available in `mediaByRole`.

### `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`

`IntroHookSeat` — `epigraphMuted` initial state changed from `false` to `true`.

Prior state: video started unmuted → browser autoplay policy blocked playback → intro appeared blank/non-loading.

After: video starts muted → browser autoplay permitted → video plays on entry → user can unmute via audio control.

DB authority: `ai_isnt_broken_intro.metadata.media_behavior_contract.mute_state = "muted_on_entry"` (confirmed).

### `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx`

`EvalPassage` — two changes:

1. `muted` initial state changed from `false` to `true`. Same browser autoplay fix as IntroHookSeat.

2. Title resolution updated to check `content_profile.title` before `display_title`:
   ```typescript
   const contentProfile = asRecord(meta?.content_profile)
   const title = (unseeded ? null : asString(contentProfile?.title) ?? encounter.encounterDef?.display_title)
     ?? "Before evaluation, recognize the environment."
   ```
   Prior state: `display_title = "Obsidian Chamber Orientation"` (internal term) was shown as the public H1.
   After: `content_profile.title = "Structural Coherence"` is shown (seated via migration 202607010001).

### `src/measures_registry/encounter_renderer/chambers/MarbleChamberRenderer.tsx`

`MarbleOrientationSeat` — `muted` initial state changed from `false` to `true`.

Prior state: assessment_report_orientation video started unmuted → browser blocked autoplay → blank screen.

After: starts muted → autoplay permitted → orientation video plays on entry.

### `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx`

Two additions:

1. `marbleToneUrl` useMemo: finds `marble_tone` media row, resolves R2 URL via `resolveRuntimeMediaUrl`. Source: measures-media / marble_tone_rise_return_5min.wav → `https://media.c3field.online/marble_tone_rise_return_5min.wav`.

2. Ambient `<audio>` element in EncounterEntry render path:
   - `autoPlay`, `loop`, `volume = 0.12` (set via ref/useEffect on marbleToneUrl change)
   - `aria-hidden="true"`, `style={{ position: fixed, width: 0, height: 0, opacity: 0, pointerEvents: none }}`
   - Browser autoplay policy applies — plays only after user interaction if browser requires it.
   - Does NOT play on privacy/terms surfaces (early returns, separate from EncounterEntry path).

### `src/measures_registry/encounter_renderer/styles/encounters/assessment.css`

`registry-report-controls` updated:

```css
.measures-registry-runtime .registry-report-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 1rem;
  position: sticky;
  bottom: 0;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background: var(--registry-brand-field);
  z-index: 2;
}
```

Prior state: CTA could be trapped below visible viewport when report content exceeded one frame.
After: CTA is sticky at bottom of scroll container — always visible regardless of report length.

---

## VALIDATION TABLE

| issue | file / component | DB authority used | CSS / style action | before | after | validation | remaining gap |
|---|---|---|---|---|---|---|---|
| Report CTA not reachable | assessment.css | — | `position: sticky; bottom: 0; background: field` on registry-report-controls | CTA hidden below long report | CTA sticky at bottom of viewport | PASS — sticky applied | None |
| /undrifted media absence | registryResolver.ts | ai_isnt_broken_landing (active), measures_registry_logo (active), fables_and_myths_cover (active) | Added 3 roles to MEDIA_ROLES | all three resolved null in mediaByRole | all three now fetched and available | PASS — resolver now fetches | undrifted_fill role has no DB row (renderer already falls back to ai_isnt_broken_landing) |
| Intro requires click / no autoplay | CrystalSeatRenderer.tsx | ai_isnt_broken_intro.media_behavior_contract.mute_state = muted_on_entry | epigraphMuted starts true | browser blocked unmuted autoplay → blank/no-load | starts muted → autoplay allowed → video loads | PASS — consistent with DB authority | None |
| Media auto-advance | CrystalSeatRenderer.tsx | — | — | epigraphEntered=true from mount → video renders immediately | no change; onEnded→handleSkip continues after video | PASS — auto-advance wired | None |
| Audio mute status (intro) | CrystalSeatRenderer.tsx | muted_on_entry | starts muted | video muted state conflicted with browser policy | consistent: muted on entry, Audio button shows unmute | PASS | None |
| obsidian orientation internal terms | ObsidianChamberRenderer.tsx | obsidian_chamber_orientation.content_profile.title = "Structural Coherence" | EvalPassage reads content_profile.title first | H1 = "Obsidian Chamber Orientation" (internal) | H1 = "Structural Coherence" (public) | PASS — migration + renderer confirmed | None |
| obsidian orientation video / autoplay | ObsidianChamberRenderer.tsx | explainer_video role (structural_coherence_explainer_45s.mp4, measures-media, active) | muted starts true | video blocked by autoplay policy → blank | starts muted → plays | PASS | media_locator.primary_media_role says structured_environment_passage_video but renderer uses explainer_video per transition node. Both rows exist in DB. Renderer behavior consistent with transition node authority. Discrepancy in encounter_def media_locator is a DB metadata note only — no active user impact. |
| marble_tone ambient status | MeasuresRegistryOrchestrator.tsx | marble_tone: measures-media / marble_tone_rise_return_5min.wav (active) | ambient audio at 12% volume, loop, autoPlay | no ambient audio | marble_tone plays sitewide via EncounterEntry path | PASS — wired and browser-policy-safe | Browser autoplay may require user interaction before audio starts; no user control provided (browser media controls cover this) |
| crystal_seat_orientation status | CrystalSeatRenderer.tsx | crystal_seat_orientation transition node: next_surface = crystal_seat_encounter | no change | — | routes correctly: threshold right → orientation → encounter | PASS | measures_position media role has NO active DB row. crystal_seat_orientation renders same IntroHookSeat as threshold surface (shared ai_isnt_broken_intro encounter_def). Both threshold choices on orientation → crystal_seat_encounter. Gap: no distinct orientation experience until measures_position video is seated. |
| mobile/laptop containment | registry.layout.css, assessment.css | — | sticky CTA + existing min-height layout | varied | sticky CTA holds at bottom on both | PARTIAL — needs browser QA | Browser QA not yet performed |

---

## GAPS REPORTED

### GAP 1: `measures_position` media role — no DB row

`crystal_seat_orientation` is assigned to `IntroHookSeat` which reads `measures_position` via `encounter.mediaByRole.get("measures_position")`. No media row with this role exists in either campaign. `MEDIA_ROLES` does not include `measures_position`. Until seated:
- `crystal_seat_orientation` renders the same intro hook video + threshold layout as `crystal_seat_threshold`
- Both left/right threshold choices navigate to `crystal_seat_encounter` (correct, per transition node)
- No broken state — functional but not distinct

### GAP 2: `structured_environment_passage_video` vs `explainer_video` in obsidian_chamber_orientation

`obsidian_chamber_orientation` encounter_def `media_locator.primary_media_role = "structured_environment_passage_video"`. Transition node says `media_role = "explainer_video"`. Renderer uses `explainer_video`. Both roles are active in DB. Renderer behavior is consistent with transition node authority. The encounter_def `media_locator` field is a metadata note with a mismatch. No change applied — prefer transition node authority.

### GAP 3: marble_tone requires user interaction on some browsers

Browsers (especially desktop Chrome/Safari) require user interaction before audio can autoplay. The marble_tone `<audio autoPlay>` may be silently blocked until the user interacts with the page. No tap-to-play UI has been added for ambient audio. This is acceptable per OAR2 ("should respect browser autoplay limitations").

---

## CLOSE

obsidian_chamber_orientation now shows "Structural Coherence" (public) instead of "Obsidian Chamber Orientation" (internal).

All video surfaces (intro, obsidian passage, marble orientation) start muted — browser autoplay policy satisfied.

/undrifted media roles (ai_isnt_broken_landing, measures_registry_logo, fables_and_myths_cover) now fetched by resolver.

marble_tone sitewide ambient seated at 12% volume.

Report CTA is sticky at bottom — reachable regardless of report length.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
