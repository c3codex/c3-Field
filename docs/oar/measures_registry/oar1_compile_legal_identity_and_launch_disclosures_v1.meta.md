---
document_type: oar1
authority_level: working
title: OAR1 — Compile Legal Identity and Launch Disclosures
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_compile_legal_identity_and_launch_disclosures_v1.meta.md
commit: a57a29f
---

# OAR1 — Compile Legal Identity and Launch Disclosures

## OBJECTIVE

Seat legal identity and all launch disclosure blocks in DB.
Place legal identity statement in footer (about surface) and about encounter.
All disclosures available for /privacy and /terms routes when created.
Nothing invented — all language sourced verbatim from OAR2.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260011_seat_legal_identity_and_launch_disclosures.sql` | Created — 2 registry UPDATEs, 1 encounter_def UPDATE (nested jsonb_set) |

---

## ENTITY VERIFICATION

| Field | Value |
|---|---|
| Legal Name | **C3 COMMUNITY PARTNERS DAO LLC** |
| Entity Type | Nonprofit Limited Liability Company |
| Additional Designation | Decentralized Organization |
| Management | Member Managed |
| Status | **Active** |
| State | Tennessee |
| Source | Tennessee records (operator-verified, referenced in OAR2) |

Measures Registry operates as a registered branch under C3 COMMUNITY PARTNERS DAO LLC. Not a separate legal entity.

---

## MUTATIONS

### measures_registry_root — top-level additions

`legal_identity` block:
- `legal_name`, `entity_type`, `additional_designation`, `management`, `status`, `state`, `branch_relationship`

`legal_disclosures` block:
- `legal_identity_statement` (footer/public)
- `legal_identity_about_statement` (about surface)
- `federal_tax_status_disclosure`
- `contributions_disclosure`
- `dao_participation_disclosure`
- `mission_support_language`
- `fundraising_standing` (active / held / potential_future)

All disclosure text sourced verbatim from OAR2. No language modified.

### measures_registry_root — footer_contract addition

`footer_contract.legal_identity_statement` — full public identity statement. Available to renderer when footer component is extended.

### about_measures_registry encounter_def — nested additions

`approved_content_contract.legal_identity_statement`:
> "Measures Registry operates under the authority and governance framework of C3 COMMUNITY PARTNERS DAO LLC and is not a separate legal entity."

`footer_contract.copy_lines` (array — renders as `<p>` tags via `renderSystemFooter()`):
> "Measures Registry is a registered branch of C3 COMMUNITY PARTNERS DAO LLC, a member-managed decentralized organization legally formed and operating in the State of Tennessee as a Nonprofit Limited Liability Company and designated as a Decentralized Organization."

This line **will render immediately** in the footer on the `/about` surface via the existing `footerCopy` → `copy_lines` path in `renderSystemFooter()`.

---

## PLACEMENT ANALYSIS

| Surface | Disclosure | Status |
|---|---|---|
| `/about` footer | Legal identity statement (full) | **SEATED — renders via copy_lines** |
| `/about` content | Legal identity about statement | **SEATED — available in approved_content_contract** |
| `measures_registry_root` | All disclosures | **SEATED — available for /privacy and /terms** |
| `/privacy` | federal_tax + contributions + dao_participation + mission_support | DB-ready — route not yet created |
| `/terms` | Informational purpose, no certification, payment boundaries, liability | DB-ready — route not yet created |
| Contribution CTA | Approved labels: "Support the Mission", "Contribute", "Community Support" | Documented — no active contribution surface |
| Footer (all surfaces) | `legal_identity_statement` in `footer_contract` | Available — renderer must be extended to read this key globally |

---

## CONFLICT CHECK

| Check | Result |
|---|---|
| Measures Registry represented as separate entity | NO — branch relationship explicit |
| Federal tax-exempt status implied | NO — disclosure explicitly negates implication |
| Tax deductibility implied | NO — disclosure explicitly negates implication |
| Contributions represented as investments | NO — prohibited by mission_support_language |
| Charitable status represented without authority | NO — held list prohibits charitable_solicitation_campaigns |
| Legal name altered from Tennessee records | NO — "C3 COMMUNITY PARTNERS DAO LLC" exact match |

**No conflicts with current entity standing.**

---

## REMAINING WORK FOR LAUNCH

| Item | Status |
|---|---|
| `/privacy` route + component | Still absent — OAR required after content review |
| `/terms` route + component | Still absent — OAR required after content review |
| Legal footer links (Privacy · Terms) | Still absent — requires routes to exist first |
| Global footer legal statement | `footer_contract.legal_identity_statement` seated but renderer does not yet read it globally — separate source OAR |
| `assessment_contact_capture_contract` | Still null — consent label governance gap remains |

---

## NOTCHAZZ FLAGS

None raised.

- Measures Registry not represented as separate entity
- Federal tax-exempt status not implied
- Tax deductibility not implied
- Contributions not represented as investments
- Charitable status not represented without authority
- Legal name matches Tennessee records
- Operator not governed

---

## CLOSE

Legal identity confirmed: C3 COMMUNITY PARTNERS DAO LLC, Nonprofit LLC, Decentralized Organization, Tennessee, Active.

All disclosure blocks seated in `measures_registry_root.metadata.legal_disclosures`.

Legal identity statement rendering in `/about` footer immediately via `copy_lines`.

Full disclosure set available for /privacy and /terms routes when source OARs create those routes.

Nothing is invented.

Commit: a57a29f
