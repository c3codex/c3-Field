---
document_type: oar1_addendum
authority_level: architecture
title: OAR1 Addendum — Role Key Security Boundary Before FREE role_call Repair
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_addendum_role_key_security_boundary_before_free_role_call_repair_v1.meta.md
migration: 202606290004_register_role_key_security_boundary.sql
---

# OAR1 Addendum — Role Key Security Boundary Before FREE role_call Repair

## FINAL DISPOSITION

**ROLE_KEY_SECURITY_BOUNDARY_RECORDED**

Security boundary registered before FREE role_call repair continues. Native roles confirmed as structural encounter authorities only. Secure role_key generation held for separate OAR. AI role profile boundary registered. No frontend mutation. No login/gating implementation.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Addendum recorded | PASS | Migration `202606290004` applied |
| Nine native roles remain structural only | PASS | `native_role_authority_boundary.rule = "native_roles_are_structural_encounter_authorities_only"` |
| Native roles not login roles | PASS | `not_roles` array includes `login_roles`, `permission_groups`, `authentication_credentials`, `secure_access_tokens` |
| role_key security boundary recorded | PASS | `role_key_security_boundary.requirements.system_generated = true`, `non_public = true`, `never_inferred_from_native_role_names = true` |
| FREE repair scope stated | PASS | `role_key_security_boundary.free_repair_scope` — structural encounter authorization only |
| AI role profile boundary recorded | PASS | `ai_role_profile_boundary.rule = "ai_role_profiles_are_separate_from_nine_native_roles"` |
| No secure role_key generation implemented | PASS | No src changes — migration only |
| No login/gating implementation | PASS | No src changes — migration only |
| No frontend exposure of secure authority | PASS | No src changes — migration only |
| Prior role_call_standing preserved | PASS | `rule = "chambers_assemble_roles_authorize"`, `total_roles = 9` verified by DO $$ block |
| Migration validation passes | PASS | `supabase db push` — applied without error |

---

## CHANGES — EVIDENCE

### `supabase/migrations/202606290004_register_role_key_security_boundary.sql` (created)

Two new keys added to `measures_registry_root.metadata`:

**`role_call_standing.native_role_authority_boundary`**
- `rule`: `native_roles_are_structural_encounter_authorities_only`
- `not_roles`: login_roles, permission_groups, ai_role_profiles, human_user_profiles, authentication_credentials, secure_access_tokens
- `are_roles`: structural authorities for encounter standing, passage requirements, passage modes, renderer authorization
- `public_identifier_note`: native role identifiers are public architectural identifiers, not credentials

**`role_call_standing.role_key_security_boundary`**
- `rule`: `secure_role_key_must_not_derive_from_native_role_names`
- `applies_when`: login, gating, permission, access_control, authorization_of_protected_actions, secure_passage, role_bound_private_state
- All security requirements seated: system_generated, non_guessable, non_public, stored_securely, never_inferred_from_display_copy, never_inferred_from_native_role_names, never_hand_authored_in_public_source, never_exposed_to_frontend_as_authority
- `free_repair_scope`: structural encounter authorization only; secure login/gating requires separate OAR

**`ai_role_profile_boundary`** (root-level)
- `rule`: `ai_role_profiles_are_separate_from_nine_native_roles`
- AI role profiles may support task/voice/workflow/assisted behavior — not native roles unless future OAR registers relationship
- No AI role profile may be treated as a secure role_key

---

## NOTCHAZZ FLAGS

None raised.

- Native role names not used as secure role_keys — boundary explicitly recorded
- AI role profiles not treated as native roles — separate boundary recorded
- No public role names used for login or gating — no frontend mutation
- No secure role_keys hand-authored — no src changes
- No frontend exposure of secure authority — no src changes
- FREE repair scope confirmed: structural encounter authorization only
- Secure role_key generation held for separate OAR
- Operator not governed

---

## FREE REPAIR CONTINUATION

FREE role_call repair (oar2_wire_role_call_and_passage_modes_into_free_renderer_v1) may now continue with the following confirmed boundary:

FREE role_call resolution is limited to:
- Encounter standing determination
- Passage requirement resolution
- Passage mode authorization
- Renderer manifestation authority

FREE role_call may NOT implement:
- Login
- Gating
- Permission checking
- Access control
- Secure passage using native role names as credentials
