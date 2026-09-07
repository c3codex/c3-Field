---
document_type: oar1
authority_level: working
title: OAR1 — Inventory unDrifted Dispatches and Verify Lapis Publication Automations
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_inventory_undrifted_dispatches_and_verify_lapis_publication_automations_v1.meta.md
commit: f48d47d
---

# OAR1 — Inventory unDrifted Dispatches and Verify Lapis Publication Automations

## OBJECTIVE

Inventory all unDrifted published Paragraph dispatches.
Verify Paragraph and Buffer as Lapis publication integrations.
Register missing dispatch records for verified articles.
Report automation standing for both integrations.
No publishing. No social posting.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260008_register_missing_undrifted_dispatches_and_seat_lapis_integration_flags.sql` | Created — 2 dispatch INSERTs, 1 undrifted registry metadata UPDATE |

---

## DISPATCH INVENTORY

### All 6 Paragraph URLs verified

| URL | article_key | dispatch_key | Pre-state | Post-state | Title | Subtitle |
|---|---|---|---|---|---|---|
| `@undrifted/structural-drift` | structural_drift | `structural_drift_dispatch_v1` | EXISTS | unchanged | Structural Drift | — |
| `@undrifted/fables-and-myths` | fables_and_myths | `fables_and_myths_dispatch_v1` | EXISTS | unchanged | Fables & Myths | Institutional Narrative and Policy Risk |
| `@undrifted/agents-with-keys` | agents_with_keys | `agents_with_keys_dispatch_v1` | EXISTS | unchanged | Agents With Keys | Systems Without Governance |
| `@undrifted/agents-of-chaos` | agents_of_chaos | `agents_of_chaos_dispatch_v1` | EXISTS | unchanged | Agents of Chaos | — |
| `@undrifted/measures-registry` | measures_registry | `measures_registry_dispatch_v1` | **MISSING** | **REGISTERED** | Measures Registry | none (verified from URL) |
| `@undrifted/undrifted` | undrifted | `undrifted_dispatch_v1` | **MISSING** | **REGISTERED** | unDrifted | "Structural drift is detectable. Collapse is not the default." (verified from URL) |

All titles and subtitles verified from Paragraph fetch. No content invented.

### New dispatch records

Both registered with: `publication_key=undrifted`, `status=published`, `external_platform=paragraph`, `dispatch_body=''` (no body content verified — matches pattern of `structural_drift_dispatch_v1`).

---

## PARAGRAPH AUTOMATION VERIFICATION

| Check | Finding | Disposition |
|---|---|---|
| Env binding | `PARAGRAPH_PUBLISH_KEY` found in `.env.local` | PRESENT |
| OAR2 expected binding name | `PARAGRAPH_SECRET_KEY` | **DISCREPANCY — actual name is `PARAGRAPH_PUBLISH_KEY`** |
| Automation route or script | None found in `scripts/` or `src/` | ABSENT |
| Integration process record | None in `system_process_registry` | ABSENT |
| Edge function | `supabase/functions/measures-sign/` — signing only, unrelated | N/A |
| Integration table | None — `src/integrations/` contains only `supabase/client.ts` | ABSENT |
| Lapis assignment | Seated in `undrifted` registry metadata via this OAR | ADDED |
| Automation status | **missing_required** | |

**Disposition: `missing_required` — hold_for_operator_review**

Env key present. No automation route, no process record, no integration schema. Separate OAR required to design Paragraph automation architecture.

---

## BUFFER AUTOMATION VERIFICATION

| Check | Finding | Disposition |
|---|---|---|
| Env binding | `BUFFER_SOCIAL_KEY` found in `.env.local` | PRESENT |
| Automation route or script | None found | ABSENT |
| Integration process record | None in `system_process_registry` | ABSENT |
| Integration table | None | ABSENT |
| Lapis assignment | Seated in `undrifted` registry metadata via this OAR | ADDED |
| Automation status | **missing_required** | |

**Disposition: `missing_required` — hold_for_operator_review**

Env key present. No automation route, no process record, no integration schema. Separate OAR required.

---

## LAPIS INTEGRATION FLAGS

Paragraph and Buffer seated as `lapis_publication_integrations` in `measures_registry.undrifted.metadata`:

```json
{
  "paragraph": {
    "env_binding": "PARAGRAPH_PUBLISH_KEY",
    "function": "external_article_publication",
    "automation_status": "missing_required",
    "disposition": "hold_for_operator_review"
  },
  "buffer": {
    "env_binding": "BUFFER_SOCIAL_KEY",
    "function": "external_social_distribution",
    "automation_status": "missing_required",
    "disposition": "hold_for_operator_review"
  }
}
```

No `system_process_registry` records created for Paragraph or Buffer — required non-nullable fields (`process_family`, `process_scope`, `authority_level`, `required_oar_type`, etc.) cannot be populated without fabrication. Schema supports integration process records but a verified template is absent. Separate OAR required.

---

## TABLES INSPECTED

| Table | Finding |
|---|---|
| `measures_publication_dispatch` | 4 existing records. 2 missing — registered. |
| `measures_publication_registry` | `undrifted` (published), `structural_drift` (deprecated section, hidden). |
| `measures_registry` | `undrifted` updated with integration flags. |
| `system_process_registry` | `c3_field_chamber_directory_lapis_v1` — Lapis chamber directory, active. No Paragraph/Buffer records. |
| `system_oar_queue` | Exists, not queried for this OAR. |
| `system_oar_execution_evidence` | Exists, not queried for this OAR. |
| Integration tables | None found matching `integration`, `automation`, `paragraph`, `buffer`, `social` patterns. |

---

## MISSING SCHEMA — RECOMMENDED NEXT OAR

`system_process_registry` supports integration process records but required fields are not populated for Paragraph or Buffer.

Recommended: separate OAR to design and seat Paragraph and Buffer as formal Lapis integration process records with verified field values for `process_family`, `process_scope`, `authority_level`, `required_oar_type`.

---

## NOTCHAZZ FLAGS

None raised.

- No article metadata invented
- Secret values not exposed — env binding names only
- Paragraph did not publish content
- Buffer did not post content
- Social registry remains planned, not active
- Paragraph and Buffer not treated as authority
- Publication standing determined by Measures Registry
- No new schema invented — `system_process_registry` not extended without verified template
- No unrelated DB rows mutated
- Operator not governed

---

## CLOSE

All 6 unDrifted Paragraph dispatches are now registered in `measures_publication_dispatch`.

Paragraph (`PARAGRAPH_PUBLISH_KEY`) and Buffer (`BUFFER_SOCIAL_KEY`) are seated as `lapis_publication_integrations` in the `undrifted` registry entry.

Both integrations are `missing_required` for automation process records. Separate OARs required before automation can be activated.

Social registry function remains planned, not active.

Nothing is invented.

Commit: f48d47d
