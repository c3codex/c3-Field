# OAR1 — unDrifted Launch Surface Editorial Reconstruction

Version: 1.0  
Source authority: `oar2_undrifted_launch_surface_editorial_reconstruction_v1.md`  
Execution date: 2026-06-24  
Disposition: DEPLOYED WITH RENDERED QA HELD  
Operator: op044  
Target: `/undrifted`

## Result

The approved editorial-reconstruction OAR was executed as a DB-first presentation correction.

The current deployed polish had already established the Issue 001 masthead, issue rail, left-weighted cover story, caption-band article cards, Measures Registry assessment mark, and governed Role Call. This pass corrected the remaining launch-surface gaps without inventing copy or authority.

## DB authority evidence

Read-only live preflight confirmed:

- `/undrifted` is released, visible, and active
- publication type is `digital magazine`
- publication title is `unDrifted`
- strapline is `Structural drift is detectable. Collapse is not the default.`
- cover headline is `AI ISN'T BROKEN. SYSTEMS ARE.`
- issue record is Issue 001, June 2026, Launch Edition
- article set contains `Agents With Keys` and `Fables & Myths`
- assessment feature is `ASSESS THE ENVIRONMENT`
- landing design contract seats `In This Issue`
- canonical Role Call title is `ALL POSITIONS AVAILABLE`
- Role Call explicitly supersedes `leadership_briefing` and `leadership_call`

No DB mutation was performed.

## Source mutations

### `RegisteredStructuralDrift.tsx`

- reads the seated `cover_lines_label` for the editorial article-band heading
- preserves `insights_heading` only as a seated fallback
- therefore renders `In This Issue` instead of the website-like `Read unDrifted` heading

### `registry.visual-system.css`

- compresses the masthead minimum height from the prior oversized arrival frame
- reduces the publication lockup footprint while retaining masthead dominance
- preserves the seated strapline beside the masthead
- changes the governed cover image to `object-fit: contain`
- centers the complete cover artwork on an obsidian field instead of cropping it
- retains the existing obsidian/gold editorial language

## Requirement standing

```yaml
requirements:
  publication_cover_not_website_header: preserved_from_deployed_polish
  excessive_negative_space_removed: implemented
  full_cover_image_not_cropped: implemented
  cover_story_headline_promoted: preserved_from_seated_cover_story
  seated_strapline_present: preserved
  inside_issue_reframe: implemented_as_seated_in_this_issue
  agents_with_keys_preserved: true
  fables_and_myths_preserved: true
  assess_the_environment_preserved: true
  leadership_briefing_upgrade: satisfied_by_seated_role_call_supersession
  obsidian_gold_language_preserved: true
  invented_copy: false
  invented_media: false
  invented_routes: false
```

The OAR wording `Inside This Issue` was not hardcoded because DB authority currently seats `In This Issue`. The renderer uses the seated label.

The requested Leadership Briefing rewrite was not invented. Live publication metadata states that the governed Role Call feature supersedes Leadership Briefing and seats the more specific title `ALL POSITIONS AVAILABLE`.

## Build validation

Command:

```text
npm.cmd run build:registry
```

Result:

```yaml
status: passed
modules_transformed: 105
javascript_asset: dist-registry/assets/index-BDDqOPFx.js
css_asset: dist-registry/assets/index-ByzwHrrz.css
governed_route_heads:
  - /ai-operations-assessment
  - /structural-drift
  - /undrifted
```

Vite emitted its existing main-chunk size advisory. It did not fail the build.

## QA and deployment standing

```yaml
source_contract_qa: passed
production_build_qa: passed
rendered_browser_qa: held_missing_sandboxPolicy
deployment: confirmed
production_http_status: 200
production_javascript: assets/index-BDDqOPFx.js
production_css: assets/index-ByzwHrrz.css
production_asset_match: true
```

Browser bootstrap again returned `missing field sandboxPolicy`. No screenshot or viewport acceptance is claimed.

## Commit and push evidence

```yaml
commit: 2304f49ecbdf08dcf5ad8be524015b1f13cd1015
commit_message: Deploy unDrifted editorial reconstruction
branch: measures
remote: origin/measures
push_range: b86e946..2304f49
remote_ref_match: true
staged_paths:
  - oar1_undrifted_launch_surface_editorial_reconstruction_v1.md
  - oar2_undrifted_launch_surface_editorial_reconstruction_v1.md
  - src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
  - src/measures_registry/registered_runtime/styles/registry.visual-system.css
unauthorized_staged_paths: 0
```

The exact four-path package was committed while 311 unrelated or prior dirty paths remained uncommitted and unstaged.

## Mutation boundary

```yaml
database_mutation: false
media_mutation: false
route_mutation: false
map_mutation: false
payment_mutation: false
assessment_flow_mutation: false
seat_mutation: false
commit: performed_exact_path
push: performed_origin_measures
held_drift_mutation: false
```

## Close

The launch surface is deployed with a tighter Issue 001 arrival frame, a full uncropped governed cover encounter, and a seated editorial issue heading. Rendered viewport QA remains the only held acceptance gate.
