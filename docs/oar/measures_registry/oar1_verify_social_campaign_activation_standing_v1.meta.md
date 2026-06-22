npm install -g @paragraph-com/clinpm install -g @paragraph-com/cli---
document_type: oar1
authority_level: closeout
system_scope: measures_codex
title: OAR1 — Verify Social Campaign Activation Standing v1
status: verification_complete_findings_returned
version: v1
operator: op044
system: measures_registry
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  paragraph_publish: false
  credential_exposed: false
  deploy: false
---

# OAR1 — Verify Social Campaign Activation Standing v1

## Closeout Standing

```yaml
closeout:
  status: verification_complete_findings_returned
  mutation_performed: false
  credential_exposed: false
```

---

## Key Presence

```yaml
key_presence:
  BUFFER_SOCIAL_KEY:
    present: true
    non_empty: true
    token_type: opaque
    token_length: 43
  PARAGRAPH_SECRET_KEY:
    present: true
    non_empty: true
    token_type: opaque
    token_length: 48
    token_prefix_pattern: para_d...
```

---

## Buffer API Access

```yaml
buffer_api_access:
  endpoint: api.buffer.com (GraphQL)
  status: confirmed
  organization_name: Measures Registry
  organization_id: present
  auth_result: authenticated
```

---

## Connected Buffer Channels

```yaml
connected_channels:
  count: 3

  instagram:
    service: instagram
    type: business
    name: measures_registry
    display_name: measures_registry
    public_url: https://instagram.com/measures_registry
    disconnected: false
    locked: false

  x:
    service: twitter
    type: profile
    name: measures_c3
    display_name: measures_c3
    public_url: https://twitter.com/measures_c3
    disconnected: false
    locked: false

  linkedin:
    service: linkedin
    type: profile
    name: measures-registry
    display_name: Stephanie Gaffney
    public_url: https://www.linkedin.com/in/measures-registry
    disconnected: false
    locked: false

  facebook:
    connected: false
    note: not present in Buffer org — consistent with social campaign record finding
```

---

## Handle Verification Against Campaign Records

```yaml
handle_verification:
  x:
    campaign_record_expected: "@measures_c3"
    buffer_confirmed: "measures_c3"
    match: true
  instagram:
    campaign_record_expected: "measures_registry"
    buffer_confirmed: "measures_registry"
    match: true
  linkedin:
    campaign_record_expected: profile
    buffer_confirmed: measures-registry (display_name Stephanie Gaffney)
    match: true
  facebook:
    campaign_record_expected: not_seated
    buffer_confirmed: not_connected
    match: consistent
```

---

## Paragraph API Access

```yaml
paragraph_api_access:
  endpoint: paragraph.com/api/v3
  status: rejected
  http_status: 403
  api_response: API key not valid.
  token_prefix: para_d
  token_length: 48
  endpoint_reachable: true
  auth_result: key_invalid
  possible_causes:
    - token was generated for a development environment (para_d prefix suggests dev)
    - token has been revoked or expired
    - token was generated under a different account or publication context
  publishing_possible_now: false
```

---

## Batch 001 Scheduling Readiness

```yaml
batch_001_scheduling_readiness:
  buffer:
    key_valid: true
    channels_connected: 3
    channels_match_campaign_records: true
    additional_credentials_required: false
    scheduling_technically_possible: true
    scheduling_authorized_now: false
    note: scheduling requires a future OAR2 authorization before execution

  paragraph:
    key_valid: false
    publishing_possible_now: false
    additional_credentials_required: true
    required_action: regenerate PARAGRAPH_SECRET_KEY from paragraph.com account settings
    note: Paragraph links in Buffer posts can still reference existing published Paragraph URLs without API access — publishing new articles is blocked
```

---

## Missing Permissions / Held Items

```yaml
missing:
  - facebook_not_connected_in_buffer
  - paragraph_api_key_invalid_requires_regeneration

held:
  - social_posting_not_authorized_by_any_oar2
  - social_scheduling_not_authorized_by_any_oar2
  - buffer_execution_not_authorized_by_any_oar2
  - paragraph_publishing_blocked_by_invalid_key
```

---

## Posting Readiness Summary

```yaml
posting_readiness:
  buffer_access: confirmed
  buffer_channels_ready: true
  buffer_channels_count: 3
  paragraph_access: blocked_key_invalid
  facebook_present: false
  operator_handle_confirmation_required: false
  note: handles confirmed by Buffer API — operator_to_confirm standing in seated records is now resolved by direct API verification
  posting_authorized_now: false
  scheduling_authorized_now: false
  gate_before_posting: future_oar2_authorizing_posting_or_scheduling
```

---

## Safety Confirmation

```yaml
safety_confirmation:
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  paragraph_publish: false
  credential_exposed: false
  runtime_mutation: false
  database_mutation: false
  deploy: false
```

---

## Recommended Next OARs

```yaml
recommended_next_oar2_paragraph_key:
  title: OAR2 — Regenerate Paragraph Secret Key and Confirm API Access v1
  required_because: PARAGRAPH_SECRET_KEY token is rejected by paragraph.com/api/v3 with API key not valid — key must be regenerated from Paragraph account settings before any article publishing is possible

recommended_next_oar2_posting:
  title: OAR2 — Authorize Buffer Batch 001 Scheduling for Measures Registry Social Campaign v1
  required_because: Buffer access is confirmed and channels are ready; posting and scheduling remain held until explicit OAR2 authorization
  prerequisite: Paragraph key may be resolved first if Paragraph article publishing is required before scheduling
```

---

## Close

Verification complete. No mutations performed. No credentials exposed.

Codex holds.
