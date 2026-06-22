---
document_type: oar1
authority_level: closeout
document_scope: runtime_route_surface_registration_audit
title: OAR1 — Audit Runtime Route Surface Registration Against Seated Encounter Structure
status: audit_complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_runtime_route_surface_registration_against_seated_encounter_structure_v1.meta.md
---

# OAR1 — Audit Runtime Route Surface Registration Against Seated Encounter Structure v1

## Closeout

```yaml
closeout:
  status: audit_complete
  mutation_performed: false
  db_mutation: false
  runtime_mutation: false
  deployment_performed: false
```

## Actual Route Table

### SPA Router State (source)

```yaml
ROUTE_SURFACE_ALIASES:
  /ai-operations-assessment: ai_operations_assessment_landing
  /structural-drift: structural_drift_dispatches
  /undrifted: structural_drift_dispatches
  /map-integrity-governance: map_integrity_governance

ROUTE_UNIT_KEYS:
  /: measures_registry_root
  /ai-operations-assessment: ai_operations_assessment_landing
  /structural-drift: structural_drift_landing
  /undrifted: undrifted_publication_landing
  /map-integrity-governance: map_integrity_governance_landing

PUBLIC_ROUTE_BY_SURFACE:
  ai_operations_assessment_landing: /ai-operations-assessment
  map_integrity_governance: /map-integrity-governance
  structural_drift_dispatches: /undrifted
  publication_dispatch: /publication/structural_drift
```

### Full Route Audit

**`/`**

```yaml
route: /
spa_route_alias: none (root default)
route_unit_key: measures_registry_root
db_landing_unit: measures_registry_root
db_release_state: released
db_access_state: visible
db_is_active: true
route_head_generated: true
canonical_url: https://measuresregistry.com/ (repaired in prior pass)
og_url: https://measuresregistry.com/ (repaired in prior pass)
rendered_component: RegisteredIntro → then sequence navigation
required_for_launch: yes
action: correct — root head repair already applied
```

**`/undrifted`**

```yaml
route: /undrifted
spa_route_alias: structural_drift_dispatches
route_unit_key: undrifted_publication_landing
db_landing_unit: undrifted_publication_landing
db_release_state: released
db_access_state: visible
db_is_active: true
route_head_generated: true
canonical_url: https://measuresregistry.com/undrifted
og_url: https://measuresregistry.com/undrifted
rendered_component: RegisteredStructuralDrift
required_for_launch: yes
action: correct — no repair needed
```

**`/ai-operations-assessment`**

```yaml
route: /ai-operations-assessment
spa_route_alias: ai_operations_assessment_landing
route_unit_key: ai_operations_assessment_landing
db_landing_unit: ai_operations_assessment_landing
db_release_state: released
db_access_state: visible
db_is_active: true
route_head_generated: true
canonical_url: https://measuresregistry.com/ai-operations-assessment
og_url: https://measuresregistry.com/ai-operations-assessment
rendered_component: RegisteredAssessmentLanding
required_for_launch: yes
action: correct — no repair needed
```

**`/structural-drift`**

```yaml
route: /structural-drift
spa_route_alias: structural_drift_dispatches
route_unit_key: structural_drift_landing
db_landing_unit: structural_drift_landing
db_release_state: released
db_access_state: visible
db_is_active: true
route_head_generated: true
canonical_url: https://measuresregistry.com/undrifted
og_url: https://measuresregistry.com/structural-drift
og_url_canonical_mismatch: true
rendered_component: RegisteredStructuralDrift (same surface as /undrifted)
required_for_launch: redirect/legacy
action: |
  og_url ≠ canonical. Per OG spec, og_url should match canonical (/undrifted).
  Current DB record has og_url set to /structural-drift intentionally.
  Requires operator decision: update DB seo.og_url to /undrifted or retain.
  DB-side fix only — no code change required.
```

**`/ai-isnt-broken`**

```yaml
route: /ai-isnt-broken
spa_route_alias: absent
route_unit_key: absent
db_landing_unit: ai_isnt_broken_intro
db_release_state: released
db_access_state: callable
db_is_active: true
db_route_path: null
db_route_authority: null
route_head_generated: false
canonical_url: none
og_url: none
rendered_component: none (no public route alias)
required_for_launch: no
action: |
  Not a public route. access_state = callable (internal only).
  No route_path or route_authority in DB record.
  Minimal metadata — parent: measures_registry_landing, source: landing_epigraph_split_hero_v1.
  Do not create public route alias. Not seated as public route authority.
  Route must not be added unless operator seats route_path and route_authority in DB.
```

**`/about-measures-registry`**

```yaml
route: /about-measures-registry
spa_route_alias: absent
route_unit_key: absent
db_landing_unit: about_measures_registry_landing — does not exist
db_release_state: not_seated
db_access_state: not_seated
route_head_generated: false
canonical_url: none
og_url: none
rendered_component: RegisteredAboutMeasuresRegistry (accessible only via internal SPA navigation from structural_drift surface)
required_for_launch: pending — About surface is sequence-only in current seated authority
action: |
  About Measures Registry is currently accessible only via internal navigation
  (onAboutMeasuresRegistry() handler on RegisteredStructuralDrift).
  No public URL, no ROUTE_SURFACE_ALIASES entry, no DB landing unit.
  To make this a direct-route public page, the operator must:
  1. Seat about_measures_registry_landing in measures_registry with route_path=/about-measures-registry, route_authority=registry, and full seo block
  2. Add ROUTE_SURFACE_ALIASES["/about-measures-registry"] = "about_measures_registry" to runtime
  3. Add ROUTE_UNIT_KEYS["/about-measures-registry"] = "about_measures_registry_landing" to runtime
  4. Add routeUnit to generate-registry-route-heads.cjs
  5. Build and deploy
  Not a launch blocker unless the operator requires a public URL.
```

**`/c3field`**

```yaml
route: /c3field
spa_route_alias: absent
route_unit_key: absent
db_landing_unit: c3_field_our_story — does not exist
db_release_state: not_seated
db_access_state: not_seated
route_head_generated: false
canonical_url: none
og_url: none
rendered_component: none
footer_link_url: https://measuresregistry.com/c3field (seated in measures_registry_root footer_contract)
footer_link_label: "c3 Field"
footer_link_standing: active
footer_link_target_key: c3_field_our_story
required_for_launch: YES — footer link is active and points to this route
action: |
  MISSING AUTHORITY. Footer link at https://measuresregistry.com/c3field is active.
  Target landing unit c3_field_our_story is not seated in measures_registry.
  Navigating to /c3field via the footer will fall into the root intro (no route alias defined).
  Live link target is broken.
  Required to repair:
  1. Seat c3_field_our_story in measures_registry with route_path=/c3field, route_authority=registry, and full seo block
  2. Define the rendered surface type (new RegisteredSurface type entry + renderer component)
  3. Add ROUTE_SURFACE_ALIASES["/c3field"] = "c3field" to runtime
  4. Add ROUTE_UNIT_KEYS["/c3field"] = "c3_field_our_story" to runtime
  5. Add routeUnit to generate-registry-route-heads.cjs
  6. Build and deploy
  This is a launch-standing defect — active footer link has no route authority.
```

**`/map-integrity-governance`**

```yaml
route: /map-integrity-governance
spa_route_alias: map_integrity_governance
route_unit_key: map_integrity_governance_landing
db_landing_unit: map_integrity_governance_landing — does not exist
db_release_state: not_seated
db_access_state: not_seated
route_head_generated: false
canonical_url: none
og_url: none
rendered_component: held_missing state (governed by source comment in ROUTE_UNIT_KEYS)
required_for_launch: no — held by design per source comment
action: |
  Not a launch blocker. Runtime renders held_missing state by design when landing unit is absent.
  Source code documents: "Governed held state: renders landing_unit_missing until 
  map_integrity_governance_landing is seated in measures_registry."
  No repair required unless operator decides to launch MAP integrity governance route.
```

## Missing Route Records

```yaml
missing_route_records:
  c3_field_our_story:
    severity: launch_defect
    reason: active footer link has no target authority
    required_action: seat in measures_registry with route_path, route_authority, seo

  about_measures_registry_landing:
    severity: pending_operator_decision
    reason: About surface is sequence-only; may not require direct public URL
    required_action: operator decides; if direct route needed, seat landing unit

  ai_isnt_broken_landing:
    severity: none
    reason: ai_isnt_broken_intro is callable but not a public route; correct standing
    required_action: none
```

## Stale Route Records

```yaml
stale_route_records: none
```

## Route Metadata Mismatches

```yaml
route_metadata_mismatches:
  structural_drift_landing:
    field: seo.og_url
    actual: https://measuresregistry.com/structural-drift
    canonical: https://measuresregistry.com/undrifted
    classification: og_url_not_matching_canonical
    severity: minor
    fix_location: db_only
    required_action: operator decision — update seo.og_url to https://measuresregistry.com/undrifted in structural_drift_landing DB record
```

## Required Launch Route Repairs

```yaml
launch_route_repairs_required:
  1:
    route: /c3field
    issue: active footer link with no route authority or landing unit
    severity: launch_defect
    fix: seat c3_field_our_story in DB, wire SPA route alias, build and deploy
    launch_gate: yes

  2:
    route: /
    issue: root route head had wrong og:url (c3field.online), missing canonical, wrong og:image
    severity: deployed_error — repaired in prior pass but not yet committed/deployed
    fix: commit dist-registry/index.html and deploy
    launch_gate: yes
```

## Held / Non-Launch Routes

```yaml
held_or_non_launch:
  /map-integrity-governance:
    standing: held_by_design
    db_unit: not_seated
    runtime_behavior: renders held_missing state
    launch_required: no

  /ai-isnt-broken:
    standing: callable_not_public
    db_unit: ai_isnt_broken_intro (callable, no route authority)
    runtime_behavior: no public route exists; root intro renders by default at /
    launch_required: no

  /about-measures-registry:
    standing: sequence_only_not_public_route
    db_unit: not_seated
    runtime_behavior: accessible only via internal navigation
    launch_required: pending operator decision
```

## Recommended Next OAR2

```yaml
recommended_next:
  oar2_1:
    title: Seat c3field Route Authority and Repair Active Footer Link
    scope: |
      Seat c3_field_our_story in measures_registry.
      Define /c3field rendered surface.
      Wire SPA route alias and route unit key.
      Generate route head.
      Build and deploy.
    priority: launch_blocker

  oar2_2:
    title: Deploy Root Route Head Repair
    scope: |
      Commit repaired dist-registry/index.html.
      Push and verify production propagation.
      Confirm og:url and canonical resolve correctly for / via HTTP inspection.
    priority: in_progress — change is staged, needs deployment commit

  oar2_3:
    title: Operator Decision — structural-drift og:url Alignment
    scope: |
      Update structural_drift_landing DB record seo.og_url from /structural-drift to /undrifted.
      Or retain and document as intentional.
    priority: minor — not a launch blocker

  oar2_4:
    title: Operator Decision — /about-measures-registry Public Route
    scope: |
      Decide whether About Measures Registry should be a direct-route public page.
      If yes, seat about_measures_registry_landing, wire runtime, generate head, deploy.
      If no, document as sequence-only surface and close.
    priority: pending_operator_decision
```
