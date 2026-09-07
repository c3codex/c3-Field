-- Seed MAP Integrity Governance content into map_integrity_governance encounter_def metadata.
-- OAR2: oar2_seed_map_integrity_governance_encounter_content_v1
-- Uses || merge — existing keys preserved. Only 5 new keys added.

UPDATE measures_encounter_def
SET metadata = metadata || $json${
  "governance_header": {
    "eyebrow": "MAP Integrity Governance",
    "headline": "Govern the environment before expanding the system.",
    "body": "AI optimization does not begin with more tools. It begins by understanding whether the environment can support governed deployment.",
    "supporting_copy": "MAP helps identify where system integrity is stable, where structural drift is present, and what preparation is required before deeper alignment work proceeds."
  },
  "map_framing": {
    "title": "Measure. Audit. Prepare.",
    "body": "MAP is the public readiness pathway for organizations seeking to understand AI system risk, operational fragmentation, and governed deployment readiness.",
    "note": "MAP is not certification, SEAT registration, or c3 Key issuance. It is a governed preparation pathway."
  },
  "pathway_cards": [
    {
      "key": "pre_deployment",
      "title": "Pre-Deployment Review",
      "price_label": "",
      "body": "For organizations preparing to introduce AI into an existing operational environment.",
      "cta": "Begin Pre-Deployment Review"
    },
    {
      "key": "optimization",
      "title": "Optimization Review",
      "price_label": "",
      "body": "For organizations already using AI and seeking clearer system integrity, role boundaries, and operational coherence.",
      "cta": "Begin Optimization Review"
    },
    {
      "key": "remediation",
      "title": "Remediation Review",
      "price_label": "",
      "body": "For organizations experiencing drift, failed automation, unclear ownership, or AI processes that no longer remain governable.",
      "cta": "Begin Remediation Review"
    }
  ],
  "action_readiness": {
    "headline": "Structural drift is detectable before failure becomes normalized.",
    "body": "MAP helps determine whether the organization is ready to proceed, needs preparation, or requires remediation before deeper system alignment."
  },
  "seat_hold": {
    "headline": "SEAT remains a governed threshold.",
    "body": "SEAT is not entered through public checkout. MAP may prepare a system for SEAT review, but SEAT standing requires governed review and separate authorization."
  }
}$json$::jsonb
WHERE encounter_key = 'map_integrity_governance';
