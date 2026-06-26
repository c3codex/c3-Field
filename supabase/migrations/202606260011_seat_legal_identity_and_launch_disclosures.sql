-- Seat legal identity and launch disclosures for public release.
-- OAR2: oar2_compile_legal_identity_and_launch_disclosures_v1
--
-- Entity verified from Tennessee records:
-- Legal Name: C3 COMMUNITY PARTNERS DAO LLC
-- Type: Nonprofit Limited Liability Company, Decentralized Organization
-- Status: Active
--
-- All legal language sourced directly from OAR2. Nothing invented.

-- 1. Seat legal_identity and legal_disclosures at root level.

UPDATE measures_registry
SET metadata = metadata || $json${
  "legal_identity": {
    "legal_name": "C3 COMMUNITY PARTNERS DAO LLC",
    "entity_type": "Nonprofit Limited Liability Company",
    "additional_designation": "Decentralized Organization",
    "management": "Member Managed",
    "status": "Active",
    "state": "Tennessee",
    "branch_relationship": "Measures Registry is a registered branch of C3 COMMUNITY PARTNERS DAO LLC and is not a separate legal entity.",
    "source_oar2": "docs/oar/measures_registry/oar2_compile_legal_identity_and_launch_disclosures_v1.meta.md"
  },
  "legal_disclosures": {
    "legal_identity_statement": "Measures Registry is a registered branch of C3 COMMUNITY PARTNERS DAO LLC, a member-managed decentralized organization legally formed and operating in the State of Tennessee as a Nonprofit Limited Liability Company and designated as a Decentralized Organization.",
    "legal_identity_about_statement": "Measures Registry operates under the authority and governance framework of C3 COMMUNITY PARTNERS DAO LLC and is not a separate legal entity.",
    "federal_tax_status_disclosure": "References to nonprofit status describe the Company's state-organized legal structure and public-benefit mission and should not be construed as a representation of federal tax-exempt status under Section 501(c)(3) of the Internal Revenue Code unless expressly stated otherwise.",
    "contributions_disclosure": "C3 COMMUNITY PARTNERS DAO LLC may accept voluntary contributions and support for its public-benefit mission. Unless expressly stated otherwise, contributions to the organization are not represented as tax-deductible charitable contributions for federal income tax purposes. Contributions are intended to support the mission, activities, and operations of the organization and should not be construed as investments or expectations of financial return.",
    "dao_participation_disclosure": "Participation in C3 COMMUNITY PARTNERS DAO LLC may differ materially from participation in other limited liability companies. The Articles of Organization, Operating Agreement, governance processes, and any applicable smart contracts may restrict withdrawal or resignation from the organization, the transfer of ownership interests, the return of capital contributions, or other rights associated with participation. No member, contributor, or participant should assume a right to the return of contributions, redemption of interests, or financial recovery except as expressly provided by applicable law or the governing documents of the organization.",
    "mission_support_language": "Participation in the organization should not be construed as an investment contract, security offering, or guarantee of financial return unless expressly stated in a separate written agreement approved under the governing documents of the organization.",
    "fundraising_standing": {
      "active": ["contributions", "community_support", "member_support"],
      "held": ["charitable_solicitation_campaigns", "tax_deductible_representations", "federal_tax_exempt_claims"],
      "potential_future": ["fiscal_sponsorship_through_eligible_501c3", "separate_federal_exemption_review"]
    },
    "source_oar2": "docs/oar/measures_registry/oar2_compile_legal_identity_and_launch_disclosures_v1.meta.md"
  }
}$json$::jsonb
WHERE registry_key = 'measures_registry_root';

-- 2. Add legal_identity_statement to root footer_contract for renderer access.

UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{footer_contract,legal_identity_statement}',
  $json$"Measures Registry is a registered branch of C3 COMMUNITY PARTNERS DAO LLC, a member-managed decentralized organization legally formed and operating in the State of Tennessee as a Nonprofit Limited Liability Company and designated as a Decentralized Organization."$json$::jsonb
)
WHERE registry_key = 'measures_registry_root';

-- 3. Seat legal identity in about_measures_registry encounter_def.
-- Add legal_identity_statement to approved_content_contract for renderer display.
-- Add copy_lines to footer_contract for system footer on about surface.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{approved_content_contract,legal_identity_statement}',
    $json$"Measures Registry operates under the authority and governance framework of C3 COMMUNITY PARTNERS DAO LLC and is not a separate legal entity."$json$::jsonb
  ),
  '{footer_contract,copy_lines}',
  $json$[
    "Measures Registry is a registered branch of C3 COMMUNITY PARTNERS DAO LLC, a member-managed decentralized organization legally formed and operating in the State of Tennessee as a Nonprofit Limited Liability Company and designated as a Decentralized Organization."
  ]$json$::jsonb
)
WHERE encounter_key = 'about_measures_registry';
