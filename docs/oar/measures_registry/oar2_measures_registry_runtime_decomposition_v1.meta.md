# OAR2 — Measures Registry Runtime Decomposition v1

## OBSERVED

`src/measures_registry/MeasuresRegistryRuntime.tsx` is carrying too many responsibilities.

Current runtime density increases risk during future refinement.

## ALIGNED

This OAR2 is decomposition only.

Thread carries reasoning.  
OAR2 carries executable instruction.  
OAR1 carries proof.

## ROUTED

Split `MeasuresRegistryRuntime.tsx` into bounded components/modules while preserving exact current behavior.

Required extractions where safe:

- assessment chamber render component
- assessment branding/watermark component
- returned assessment result component
- recommended operating protocol component
- current question definitions module
- current copy/constants module

Preserve:

- current copy
- current questions
- current answer options
- current styling
- current assessment logic
- current routing
- current persistence
- current deterministic standing behavior
- current eligibility continuation

Do not:

- change questions
- change answer count
- redesign chamber visuals
- change assessment semantics
- change deterministic logic
- change DB behavior
- add routes
- add tables
- add new public language

## CODY ROLE

Cody may refactor file structure, extract components, preserve imports, run build validation, and write OAR1.

Cody may not change behavior, semantics, styling, logic, or scope.

## VALIDATION

Success requires:

- build passes
- current assessment behavior unchanged
- extracted components render same UI
- deterministic assessment flow unchanged
- no new DB changes
- OAR1 written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_measures_registry_runtime_decomposition_v1.meta.md

## PROCESS REFERENCE

implementation_branch: measures

## CLOSE

Reduce runtime load first. Refine design after decomposition.
