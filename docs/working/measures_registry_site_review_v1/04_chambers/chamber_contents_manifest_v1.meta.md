---
artifact_id: measures_registry_chamber_contents_manifest_v1
artifact_type: chamber_grammar_working_review_manifest
system_scope: measures_registry
status: review_contract_only
grammar_entry_count: 12
authority_created: false
---

# Chamber Contents Manifest v1

```yaml
level_1_native_system:
  Epigraph:
    function: first surface / intro / hero / hook
    position: before_threshold
    chamber: false
    passage_required: false
    creates_first_orthogonal_vector: true
  Crystal_Seat:
    function: c3 model seat / threshold position
    chamber: false
    passage_required: false
    allowed_passage_to: [Marble_Chamber]
    represents: c3_model
  Obsidian_Chamber:
    function: threshold chamber / assessment / gate logic / secured crossing
    chamber: true
    position: threshold
    passage_required: true
    gate_allowed: true
    may_have_antechamber: true
    antechamber:
      materially_relational: true
      non_runtime: true
      may_be_secured: true
      directory_may_require_security_key: true
  Lapis_Chamber:
    function: relational chamber between Obsidian and Marble
    chamber: true
    passage_required: false
    runtime_role: relational
    may_hold: [landing_pages, MRM, integrations, relational_continuity]
    antechamber:
      role_bound: true
      may_be_called_by: [Obsidian_Chamber, Marble_Chamber]
  Marble_Chamber:
    function: governance / resolution chamber
    chamber: true
    passage_required: true
    may_have_multiple_antechambers: true
    antechamber_constraint:
      each_antechamber_supports_only_one_resolution: true
  Harrumuck:
    function: forward passage
    direction: forward
  Kumurrah:
    function: return passage
    direction: return
  Gate:
    function: Obsidian threshold mechanism
    allowed_only_in: [Obsidian_Chamber]
  Codexstone:
    function: Integrity Governance / Registry Seal / c3 Field Registered System
    binds: [registry_key]
    conversion_point:
      creates: [Branch]
    monitored_by: [c3_Optics]
    does_not_create: [SEAT, payment, MAP_delivery, c3_backoffice]
  MAP:
    function: phase
    public_expression_controlled: [MAP the Environment]
    delivery_activated: false
  SEAT:
    standing: held_requirements_container
    confirmed_System_Environment_Alignment_Track: false
    activated: false
  Epithet:
    function: role dispersion structure
    chamber_of_epithets_holds_all_materials: true
    constraint: role dispersion cannot exceed material chamber contract
```

