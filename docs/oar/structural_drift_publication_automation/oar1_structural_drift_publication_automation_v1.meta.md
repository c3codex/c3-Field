---
document_type: oar1
title: OAR1 Structural Drift Publication Automation
version: v1
status: executed
system: measures_registry
source_oar2: docs/oar/structural_drift_publication_automation/oar2_structural_drift_publication_automation.meta.md
---

# OAR1 Structural Drift Publication Automation

## Execution Summary

Executed the publication automation support OAR with the operator-confirmed generic revision.

The automation tooling now supports repeatable publication dispatch package generation and validation without hardcoded publication or dispatch defaults.

No public posting automation was added.
No Paragraph or X posting was added.
No frontend runtime imports from `docs/oar` or `docs/process` were added.
No publication content was hardcoded into frontend runtime.

## Generator

Created:

`docs/process/publication/new-publication-dispatch.ps1`

Required parameters:

- `PublicationKey`
- `DispatchKey`
- `Title`

Generated package path:

`docs/oar/publication_dispatches/<publication_key>/<dispatch_key>/`

Generated files:

- `oar2_<dispatch_key>.meta.md`
- `dispatch_body.md`
- `paragraph_metadata.json`
- `x_captions.md`

The generator enforces dispatch key format and blocks dispatch keys derived directly from external slugs.

Generated package content uses approval placeholders and does not invent dispatch body, claims, citations, or public captions.

## Validator

Created:

`scripts/validate-publication-dispatch.cjs`

Added npm script:

`validate:publication-dispatch`

Required parameters:

- `--publication-key`
- `--dispatch-key`

Optional parameters:

- `--capture-source`
- `--public-url`

The validator checks:

- publication exists and is published
- dispatch exists and is published
- dispatch belongs to the explicit publication key
- required fields are present
- references are present
- CTAs are present
- media manifest is present
- external slug is not authority
- public read works through deployed browser client config
- subscription capture insert works
- validation capture row is cleaned up

## Revision Applied

Initial draft tooling was corrected before closeout:

- removed publication-specific validator name
- removed hardcoded default `publication_key`
- removed hardcoded default `dispatch_key`
- replaced `validate:structural-drift` with `validate:publication-dispatch`
- replaced Structural Drift-specific generator with generic publication dispatch generator

Structural Drift can still be validated only when explicit keys are passed.

## Validation

Generator command:

```powershell
powershell -ExecutionPolicy Bypass -File docs/process/publication/new-publication-dispatch.ps1 -PublicationKey structural_drift -DispatchKey automation_validation_dispatch_v1 -Title "Automation Validation Dispatch" -ExternalPlatform paragraph -ExternalSlug automation-validation-dispatch -ExternalUrl https://paragraph.com/@measures-registry/automation-validation-dispatch -Force
```

Generated:

`docs/oar/publication_dispatches/structural_drift/automation_validation_dispatch_v1/`

Validator command:

```powershell
npm.cmd run validate:publication-dispatch -- --publication-key structural_drift --dispatch-key agents_of_chaos_dispatch_v1 --capture-source structural_drift_dispatch
```

Result:

```json
{
  "publication": "structural_drift",
  "dispatch": "agents_of_chaos_dispatch_v1",
  "requiredFieldsPresent": true,
  "referenceCount": 2,
  "mediaManifestValid": true,
  "noSlugAuthority": true,
  "publicReadWorks": true,
  "subscriptionCaptureInsertWorks": true,
  "captureCleaned": true
}
```

## Files Updated

- `docs/process/publication/new-publication-dispatch.ps1`
- `scripts/validate-publication-dispatch.cjs`
- `package.json`

## Scope Confirmation

Process tooling only.

No deploy performed.
No public posting automation added.
No frontend publication content hardcoding added.
