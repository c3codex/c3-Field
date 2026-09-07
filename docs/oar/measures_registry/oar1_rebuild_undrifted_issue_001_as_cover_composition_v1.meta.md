# OAR1 — Rebuild unDrifted Issue 001 as Cover Composition v1

```yaml
oar1:
  key: oar1_rebuild_undrifted_issue_001_as_cover_composition_v1
  source_oar2: docs/oar/measures_registry/oar2_rebuild_undrifted_issue_001_as_cover_composition_v1.meta.md
  executed_at: 2026-06-23
  execution_state: completed_with_deployed_visual_validation_held
  route: /undrifted
  authority:
    codex: saved OAR2 execution contract
    field: existing registered Lapis publication chamber
    measures:
      - undrifted_publication_landing
      - measures_publication_registry.publication_key=undrifted
      - measures_registry_root.metadata.footer_contract
      - measures_media_map active publication media roles
    chazz: approved cover-composition hierarchy and uploaded visual reference
    cody: registered runtime implementation
    src: renderer only
  database_mutation: false
  publication_state_mutation: false
  route_mutation: false
  deployment_mutation: false
```

## Result

`/undrifted` now renders Issue 001 as one editorial cover canvas rather than a sequence of website sections. The renderer continues to consume seated publication, landing, media, assessment, article, Role Call, next-issue, and footer records.

The uploaded `undrifted_issue_001` image was used as presentation reference only. It was not copied into the runtime and did not replace registry authority.

## Component mutations

- `MeasuresRegistryRuntimeRegistered.tsx`
  - removed the hardcoded Role Call destination
  - reads `measures_registry_root.metadata.footer_contract.link_url`
  - passes the seated URL through the Lapis chamber contract
- `LapisChamberRuntime.tsx`
  - replaced the imperative `onOurStory` callback with nullable `roleCallUrl`
  - preserves missing authority as absence instead of fallback navigation
- `RegisteredStructuralDrift.tsx`
  - renders the unDrifted primary lockup from `brand_assets.primary_full_lockup_path`
  - renders issue number, issue date, and edition from `issue_record`
  - prefers the canonical publication `role_call_feature`
  - preserves cover story, assessment, article, Role Call, next-issue, and footer copy from seated records
  - removes website-style social/header and system-footer chrome from the cover surface
- `registry.visual-system.css`
  - introduces the governed Issue 001 cover composition and responsive presentation

## Layout mutations

- oversized unDrifted masthead establishes publication identity first
- three-part issue rail presents Issue 001, June 2026, and Launch Edition
- cover artwork becomes the dominant canvas with the seated cover story overlaid
- Agents With Keys and Fables & Myths render as artwork-led editorial features
- Assess the Environment renders as the third editorial feature, not a conversion block
- Role Call and Next Issue share the issue-close grid
- marble-like rule discipline, obsidian threshold surface, crystal-blue coherence accents, and codex-gold publication accents preserve material hierarchy
- desktop uses one bounded cover canvas; tablet and mobile retain the masthead, issue rail, artwork dominance, editorial rules, and publication sequencing

## Authority evidence

Read-only privileged preflight confirmed:

- landing route: `/undrifted`, released, visible, active
- cover story: `AI ISN'T BROKEN. SYSTEMS ARE.`
- article standing: Agents With Keys published; Fables & Myths published
- assessment route: `/ai-operations-assessment`, released, visible, active
- Role Call destination: `https://measuresregistry.com/c3field`
- next issue: `FROM ASSESSMENT TO ACTION`, `COMING JULY 2026`
- active media roles: `ai_isnt_broken_landing`, `agents_with_keys_cover`, `fables_and_myths_cover`

No database row, storage object, publication standing, article URL, assessment route, or release state was changed.

## Responsive QA

Code-level responsive validation is complete at desktop, tablet (`max-width: 860px`), and mobile (`max-width: 620px`) breakpoints. The composition changes from a three-column cover grid to two columns and then one column without changing registry content or CTA destinations.

Interactive viewport inspection is held because the Browser bootstrap in this thread returned `missing field sandboxPolicy`. No browser retry was made after that bootstrap failure.

## Production QA

Command:

```text
npm.cmd run build:registry
```

Result:

```text
105 modules transformed
registry production build passed
governed route heads generated for /ai-operations-assessment, /structural-drift, /undrifted
```

Vite emitted the existing chunk-size advisory for the main JavaScript bundle. It did not fail the build.

No push or deployment was performed. Deployed production truth remains held pending deployment authorization and post-deploy browser validation.

## Screenshot evidence

- reference reviewed: `C:\Users\c3DAO\Downloads\undrifted_issue_001.png`
- reference use: hierarchy, rhythm, cover density, and publication presentation only
- local runtime screenshot: held — Browser unavailable in this thread
- deployed runtime screenshot: held — no deployment authorized

## Acceptance standing

```yaml
acceptance:
  unDrifted_identified_before_measures_registry: implemented
  publication_identified_before_website: implemented
  assessment_reads_as_editorial_feature: implemented
  role_call_reads_as_publication_feature: implemented
  entire_page_reads_as_issue_001_cover: implemented
  registry_driven_rendering_preserved: true
  hardcoded_role_call_destination_removed: true
  local_production_build: passed
  responsive_browser_qa: held_browser_unavailable
  deployed_production_qa: held_not_deployed
  runtime_screenshot_evidence: held_browser_unavailable
```

## Close

Issue 001 authority remains seated. The renderer now presents that authority as a governed publication cover composition.
