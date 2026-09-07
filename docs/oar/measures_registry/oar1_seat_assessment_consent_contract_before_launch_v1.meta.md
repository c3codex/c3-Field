---
document_type: oar1
authority_level: working
title: OAR1 — Seat Assessment Consent Contract Before Launch
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_assessment_consent_contract_before_launch_v1.meta.md
commit: 075747d
---

# OAR1 — Seat Assessment Consent Contract Before Launch

## OBJECTIVE

Seat DB-governed consent copy for the assessment contact capture flow.
Close the gap identified in oar1_seat_public_legal_surfaces_before_launch_v1:
`approved_content_contract.assessment_contact_capture_contract` was null.
Update renderer to prefer and display DB contract copy when present.
Nothing invented.

---

## FILES CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260012_seat_assessment_consent_contract_before_launch.sql` | Created — 7 UPDATEs on measures_assessment encounter_def |
| `src/measures_registry/PublicAssessmentSurface.tsx` | Added rendering of submission notice and legal notices from DB contract |

---

## DB MUTATION

### 1. Governance record — `approved_content_contract.assessment_contact_capture_contract`

Seated at:
```
measures_encounter_def WHERE encounter_key = 'measures_assessment'
→ metadata.approved_content_contract.assessment_contact_capture_contract
```

Fields:
- `assessment_submission_notice` — verbatim from OAR2
- `assessment_result_email_consent` — `{label, required: true, default_checked: false}`
- `measures_registry_updates_opt_in` — `{label, required: false, default_checked: false}`
- `privacy_notice` — verbatim from OAR2
- `terms_notice` — verbatim from OAR2
- `boundary_notice` — verbatim from OAR2
- `contact_email` — connect@measuresregistry.com
- `source_oar2` — OAR2 path

### 2. Renderer path — `assessment_contact_capture_oar1_binding_contract_v1.consent_fields`

```json
[
  {
    "field_key": "assessment_result_email_consent",
    "public_label": "Send my assessment results and related follow-up by email.",
    "type": "checkbox",
    "required": true,
    "default_checked": false
  }
]
```

### 3. Renderer path — `assessment_contact_capture_oar1_binding_contract_v1.optional_opt_in_fields`

```json
[
  {
    "field_key": "measures_registry_updates_opt_in",
    "public_label": "I would like to receive occasional Measures Registry updates.",
    "type": "checkbox",
    "required": false,
    "default_checked": false
  }
]
```

### 4–7. Notice texts seated in oar1 binding contract

| Key | Value source |
|---|---|
| `assessment_submission_notice` | Verbatim from OAR2 |
| `standing_boundary_note` | Verbatim from OAR2 boundary_notice (replaces hardcoded fallback) |
| `privacy_notice` | Verbatim from OAR2 |
| `terms_notice` | Verbatim from OAR2 |

---

## SOURCE MUTATION

### `src/measures_registry/PublicAssessmentSurface.tsx`

Three additions to the contact_capture form rendering:

**Extraction (above form):**
```tsx
const assessmentSubmissionNotice = asString(assessmentContactCaptureContract?.assessment_submission_notice)
const privacyNotice = asString(assessmentContactCaptureContract?.privacy_notice)
const termsNotice = asString(assessmentContactCaptureContract?.terms_notice)
```

**Before fieldset:**
```tsx
{assessmentSubmissionNotice ? (
  <p className="registry-consent-submission-notice">{assessmentSubmissionNotice}</p>
) : null}
```

**After fieldset:**
```tsx
{(privacyNotice || termsNotice) ? (
  <div className="registry-consent-legal-notices">
    {privacyNotice ? <p>{privacyNotice}</p> : null}
    {termsNotice ? <p>{termsNotice}</p> : null}
  </div>
) : null}
```

No hardcoded text added. Notices render only when DB contract provides them. Existing fallbacks preserved.

---

## VALIDATION

| Check | Result |
|---|---|
| `assessment_contact_capture_contract` exists | YES — seated in `approved_content_contract` |
| `assessment_submission_notice` exists | YES |
| `assessment_result_email_consent` label exists | YES — `"Send my assessment results and related follow-up by email."` |
| `assessment_result_email_consent` default_checked false | YES |
| `measures_registry_updates_opt_in` label exists | YES — `"I would like to receive occasional Measures Registry updates."` |
| `measures_registry_updates_opt_in` default_checked false | YES |
| `privacy_notice` exists | YES |
| `terms_notice` exists | YES |
| `boundary_notice` exists | YES (as `standing_boundary_note` in renderer path) |
| `contact_email` exists | YES — `connect@measuresregistry.com` |
| Existing metadata preserved | YES — all updates use `jsonb_set` with `create_missing: true` |
| Consent preselected | NO — `default_checked: false` on all fields; no `defaultChecked` in renderer |
| Certification claim added | NO — boundary_notice explicitly negates it |
| SEAT standing implied | NO — explicitly negated in boundary_notice |
| Professional advice implied | NO |
| Build passes | YES — `✓ built in 4.25s` |
| Migration pushed | YES — `Finished supabase db push` |

---

## RENDERER PATH EXPLAINED

The renderer reads from two paths:

| Path | What the renderer reads |
|---|---|
| `assessment_contact_capture_oar1_binding_contract_v1` | `consent_fields`, `optional_opt_in_fields`, `post_assessment_contact_form.fields`, `standing_boundary_note`, `assessment_submission_notice`, `privacy_notice`, `terms_notice` |
| `approved_content_contract.assessment_contact_capture_contract` | Governance record — not read by renderer directly (labels are seeded into oar1 binding contract path) |

The governance record in `approved_content_contract` is the canonical source of truth for the copy. The oar1 binding contract holds the same values in the shape the renderer expects. When copy needs to change, the approved_content_contract is the record to update (requires new OAR), and the oar1 binding contract is updated in the same migration.

---

## NOTCHAZZ FLAGS

None raised.

- Consent not preselected — `default_checked: false` on both consent fields
- Communication opt-in not preselected — `measures_registry_updates_opt_in.required: false`, `default_checked: false`
- Certification not implied — boundary_notice explicitly negates it
- SEAT standing not implied — boundary_notice explicitly negates it
- c3 Key issuance not implied — boundary_notice explicitly negates it
- Tax deductibility not implied
- Professional advice not implied
- Existing metadata not overwritten — `jsonb_set` with `create_missing: true` on all updates
- Operator not governed

---

## CLOSE

Assessment consent contract seated.

`approved_content_contract.assessment_contact_capture_contract` — no longer null.

Consent checkboxes now DB-governed and rendering:
- `assessment_result_email_consent` — required, not preselected
- `measures_registry_updates_opt_in` — optional, not preselected

Notices rendering when DB contract present:
- Assessment submission notice
- Privacy notice
- Terms notice

Boundary note (`standing_boundary_note`) is now DB-governed — hardcoded fallback preserved but no longer active.

Nothing is invented.

Commit: 075747d
