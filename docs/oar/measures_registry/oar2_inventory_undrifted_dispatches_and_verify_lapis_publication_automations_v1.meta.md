---
document_type: oar2
authority_level: working
document_scope: lapis_publication_integrations
title: OAR2 - Inventory unDrifted Dispatches and Verify Lapis Publication Automations
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Inventory unDrifted Dispatches and Verify Lapis Publication Automations

## GOVERNANCE STANDING

Governance belongs to the body.
Agency belongs to the individual.
Integrity belongs to both.

This OAR governs the Lapis publication integration body.
It does not govern the operator.

Purpose is to inventory published unDrifted dispatches and verify Paragraph and Buffer automation standing as Lapis integrations.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Native architecture normalization is complete.

unDrifted is authoritative Lapis publication standing.

Structural Drift is registered as a published Paragraph article.

Additional Paragraph publications to verify:

- https://paragraph.com/@undrifted/structural-drift
- https://paragraph.com/@undrifted/fables-and-myths
- https://paragraph.com/@undrifted/agents-with-keys
- https://paragraph.com/@undrifted/agents-of-chaos
- https://paragraph.com/@undrifted/measures-registry
- https://paragraph.com/@undrifted/undrifted

Paragraph and Buffer are Lapis publication integrations.

They are not authority.

Measures Registry determines standing.

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures determine.
c3 Field arranges.
Optics prove.

Lapis Chamber arranges publication, relationship, and integration standing.

unDrifted current function:

- landing page
- publication surface

unDrifted planned future function:

- social registry surface

Future social registry function is not active in this OAR.

Paragraph function:

- external article publication

Buffer function:

- external social distribution

Neither Paragraph nor Buffer determines registry standing.

## ROUTED

Perform inventory and verification.

Primary tasks:

1. Inspect unDrifted publication dispatch records.
2. Verify each provided Paragraph URL.
3. Register missing published dispatches only if existing publication schema supports it.
4. Verify Paragraph automation configuration.
5. Verify Buffer automation configuration.
6. Confirm both automations are or can be seated as Lapis integrations.
7. Do not publish new content.
8. Do not post social content.
9. Do not activate social registry standing.

## DISPATCH URLS TO VERIFY

Verify these Paragraph URLs:

- https://paragraph.com/@undrifted/structural-drift
- https://paragraph.com/@undrifted/fables-and-myths
- https://paragraph.com/@undrifted/agents-with-keys
- https://paragraph.com/@undrifted/agents-of-chaos
- https://paragraph.com/@undrifted/measures-registry
- https://paragraph.com/@undrifted/undrifted

For each URL return:

- article_key
- title
- subtitle if present
- publication_key
- external_platform
- external_url
- published status
- existing dispatch key if present
- missing dispatch if absent
- metadata gaps
- recommended disposition

## EXPECTED ARTICLE KEYS

Use these keys unless existing DB standing already differs:

- structural_drift
- fables_and_myths
- agents_with_keys
- agents_of_chaos
- measures_registry
- undrifted

Do not invent titles, subtitles, dates, authors, excerpts, or images.

Only store metadata verified from Paragraph or existing DB.

## TABLES TO INSPECT

At minimum inspect:

- measures_publication_registry
- measures_publication_dispatch
- measures_publication_subscription_capture
- measures_registry
- measures_encounter_def
- measures_encounter_surface_assignment
- system_process_registry
- system_oar_queue
- system_oar_execution_evidence

If integration tables exist, inspect them.

If no integration table exists, report missing schema and propose next OAR.

## PARAGRAPH AUTOMATION VERIFICATION

Verify whether Paragraph automation is configured.

Check for:

- Paragraph publish key presence by env binding name only, not secret value
- Paragraph integration process record
- Paragraph automation route or script
- Paragraph publication target undrifted
- Paragraph dispatch sync logic
- error logging or evidence capture
- Lapis chamber or material assignment
- current automation status

Allowed dispositions:

- automation_ready
- active_keep
- missing_required
- stale_configuration
- hold_for_operator_review
- audit_trace_only

Do not expose secret values.

Do not publish anything.

## BUFFER AUTOMATION VERIFICATION

Verify whether Buffer automation is configured.

Check for:

- Buffer token or key presence by env binding name only, not secret value
- Buffer integration process record
- Buffer social distribution route or script
- connected profile targets if safely visible
- posting queue logic
- error logging or evidence capture
- Lapis chamber or material assignment
- current automation status

Allowed dispositions:

- automation_ready
- active_keep
- missing_required
- stale_configuration
- hold_for_operator_review
- audit_trace_only

Do not expose secret values.

Do not post anything.

## REQUIRED MUTATIONS

This OAR is primarily inventory.

Mutations allowed only if schema already supports them and evidence is clear:

1. Upsert missing published dispatch records for verified Paragraph articles.
2. Add metadata flags identifying Paragraph and Buffer as Lapis publication integrations.
3. Add integration standing records only if an existing table or schema clearly supports them.

Do not create new integration schema.

Do not invent automation architecture.

If schema is missing, stop and recommend a separate OAR.

## REQUIRED OUTPUT

Return OAR1 evidence showing:

1. All six Paragraph URLs were checked.
2. Existing dispatch records identified.
3. Missing dispatch records registered or reported.
4. No article content invented.
5. Paragraph automation status verified.
6. Buffer automation status verified.
7. Env bindings checked by name only.
8. Secret values were not exposed.
9. Lapis assignment confirmed or missing_required returned.
10. No publishing occurred.
11. No social posting occurred.
12. Social registry remains planned, not active.
13. Any mutations are listed row by row.
14. Any missing schema is reported.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- article metadata is invented
- secret values are exposed
- Paragraph publishes content
- Buffer posts content
- social registry is activated
- Paragraph or Buffer is treated as authority
- publication standing is determined outside Measures Registry
- new schema is invented without OAR
- unrelated DB rows are mutated
- operator is governed instead of the work body

## CLOSE

Inventory published dispatches.

Verify Paragraph and Buffer as Lapis publication integrations.

Register only what is proven.

Do not publish.

Do not post.

Nothing is invented.
