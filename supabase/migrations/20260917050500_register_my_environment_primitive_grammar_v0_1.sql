-- Register My Environment Primitive Grammar v0.1
-- Operator authorization: op044 / register_my_environment_primitive_grammar_chazz_001
-- Scope: computational custody + protected Registry concordance + Source Concordance v16 alignment.
-- Non-effect: no implementation authority, runtime activation, custody transfer, ownership transfer, or Current creation.

begin;

insert into public.codex_source_reference(
  source_key,source_title,source_type,authority_level,source_scope,version_label,
  source_status,readonly,source_path,source_hash,metadata,created_by
)
values(
  'my_environment_primitive_grammar_v0_1',
  'My Environment Primitive Grammar v0.1',
  'foundational_source',
  'operator',
  'my_environment_primitive_grammar',
  'v0.1',
  'committed',
  true,
  'github-private://c3codex/measures-of-inanna-governance/main/governance/my_environment_primitive_grammar_v0_1_physical_persistence.meta.md',
  '47d613bce201a963b9a4732cf708f122b3a7371e',
  jsonb_build_object(
    'operator','op044',
    'visibility','protected',
    'integrity_algorithm','git_blob_sha1',
    'physical_persistence_key','my_environment_primitive_grammar_v0_1_physical_persistence',
    'elevated_source_key','my_environment_primitive_grammar_v0_1',
    'source_concordance_alignment','current_source_concordance_v16',
    'continuous_project_source',false,
    'registry_registration',true,
    'implementation_authority_created',false,
    'custody_transfer',false,
    'ownership_transfer',false,
    'execution_instance_id','register_my_environment_primitive_grammar_chazz_001'
  ),
  'op044'
)
on conflict(source_key) do update set
  source_title=excluded.source_title,
  source_type=excluded.source_type,
  authority_level=excluded.authority_level,
  source_scope=excluded.source_scope,
  version_label=excluded.version_label,
  source_status=excluded.source_status,
  readonly=excluded.readonly,
  source_path=excluded.source_path,
  source_hash=excluded.source_hash,
  metadata=excluded.metadata,
  updated_at=now();

with src as (
  select id from public.codex_source_reference where source_key='my_environment_primitive_grammar_v0_1'
), terms(term_key,term_label,definition,resolves_to,alignment) as (
  values
  ('myenv_primitive_subject_v0_1','Subject','A person, organization, system, or computational actor that can participate in governed relation.',null,'current_source_concordance_v16#Environment Permission Scope'),
  ('myenv_primitive_environment_v0_1','Environment','A bounded governed place within which relations, conditions, capabilities, packages, and passage may resolve.',null,'current_source_concordance_v16#env_key'),
  ('myenv_primitive_relation_v0_1','Relation','A typed, standing-bearing edge between distinct governed objects that does not collapse identity, ownership, custody, authority, or standing.',null,'current_source_concordance_v16#Native Relation'),
  ('myenv_primitive_grant_v0_1','Grant','A scoped, revocable relation that permits specified action for a subject within an established boundary.',null,'current_source_concordance_v16#Environment Permission Scope'),
  ('myenv_primitive_package_v0_1','Package','A bounded, versioned custody-bearing or reference-bearing package that may be related to an environment without custody collapse. EnvPac, PubPac, and WebPac are package specializations.',null,'current_source_concordance_v16#Asset Manifest'),
  ('myenv_primitive_capability_v0_1','Capability','A bounded function an environment may call when required authority, relation, constraints, and passage conditions are satisfied.',null,'current_source_concordance_v16#Computational Skill'),
  ('myenv_primitive_selection_v0_1','Selection','Mutable owner-controlled environment presentation or preference state whose change does not redefine environment identity, authority, custody, standing, or Current.',null,'current_source_concordance_v16#Environment Handle / Alias'),
  ('myenv_primitive_passage_v0_1','Passage','An attempted or completed movement, invocation, or transition across an established boundary under applicable relation and authority conditions.',null,'current_source_concordance_v16#Governed Object Passage Process'),
  ('myenv_primitive_encounter_v0_1','Encounter','The point at which governed passage meets a subject, environment, capability, surface, or external destination.',null,'current_source_concordance_v16#Operational Encounter'),
  ('myenv_primitive_evidence_v0_1','Evidence','The durable returned record of what actually occurred in an encounter or passage. Evidence appends; it does not overwrite history.',null,'current_source_concordance_v16#OAR1'),
  ('myenv_primitive_current_v0_1','Current','The applicable persisted result of governed passage and evidence. This grammar does not redefine C1/C2/C3 Commerce Current semantics and Current is never command authority.','current_source_concordance_v16#C1/C2/C3 Commerce Currents','current_source_concordance_v16#C1/C2/C3 Commerce Currents'),
  ('myenv_primitive_runtime_session_v0_1','Runtime Session','Temporary runtime admission derived from an active Grant. Session is not Subject identity, Grant, ownership, custody, authority, or environment standing.',null,'current_source_concordance_v16#Runtime / Platform Boundary'),
  ('myenv_primitive_boundary_v0_1','Boundary','The explicit limit within which an environment, authority, custody scope, package, capability, grant, or condition applies and beyond which it does not.',null,'current_source_concordance_v16#c3 Tree Structural Relation / Boundary')
)
insert into public.codex_source_term(
  source_reference_id,term_key,term_label,axis,circuit,role,resolves_to,definition,term_status,metadata
)
select src.id,t.term_key,t.term_label,'my_environment',null,'primitive',t.resolves_to,t.definition,'active',
  jsonb_build_object(
    'primitive_grammar','my_environment_primitive_grammar_v0_1',
    'source_alignment',t.alignment,
    'alignment_mode','append_preserving_no_source_supersession',
    'implementation_authority_created',false
  )
from src cross join terms t
on conflict(term_key) do update set
  source_reference_id=excluded.source_reference_id,
  term_label=excluded.term_label,
  axis=excluded.axis,
  circuit=excluded.circuit,
  role=excluded.role,
  resolves_to=excluded.resolves_to,
  definition=excluded.definition,
  term_status=excluded.term_status,
  metadata=excluded.metadata,
  updated_at=now();

insert into public.concordance_document(
  document_key,title,document_scope,authority_standing,visibility_standing,native_order,source_alignment,metadata
)
values(
  'my_environment_primitive_grammar',
  'My Environment Primitive Grammar',
  'interoperable_environment_primitive_grammar',
  'active',
  'protected',
  'Subject -> Environment -> Relation -> Grant -> Package -> Capability -> Selection -> Passage -> Encounter -> Evidence -> Current -> Runtime Session -> Boundary',
  jsonb_build_array(
    jsonb_build_object('source','current_source_concordance_v16','relation','controlling_semantic_alignment','supersedes',false),
    jsonb_build_object('source','material_environment_qualification_grammar_v1','relation','preserved_alignment','supersedes',false)
  ),
  jsonb_build_object(
    'operator','op044',
    'composition_rule','features_are_projections_of_primitives_primitives_are_not_created_to_satisfy_features',
    'profile_rule','environment_state_remains_relational_and_composable',
    'boundary_proposition','nothing_crosses_merely_because_it_can_see_the_other_side',
    'continuous_project_source',false,
    'implementation_authority_created',false
  )
)
on conflict(document_key) do update set
  title=excluded.title,
  document_scope=excluded.document_scope,
  authority_standing=excluded.authority_standing,
  visibility_standing=excluded.visibility_standing,
  native_order=excluded.native_order,
  source_alignment=excluded.source_alignment,
  metadata=excluded.metadata,
  updated_at=now();

insert into public.concordance_version(
  version_key,document_key,version_label,version_standing,visibility_standing,recognized_at,source_oar2_path,closeout_oar1_path,metadata
)
values(
  'my_environment_primitive_grammar_v0_1',
  'my_environment_primitive_grammar',
  'v0.1',
  'active',
  'protected',
  now(),
  'operator://op044/register_my_environment_primitive_grammar_chazz_001/approval',
  null,
  jsonb_build_object(
    'operator_disposition','approved',
    'operator_disposition_by','op044',
    'recognition_mode','append_preserving',
    'physical_persistence_key','my_environment_primitive_grammar_v0_1_physical_persistence',
    'source_reference_key','my_environment_primitive_grammar_v0_1',
    'source_concordance_control','current_source_concordance_v16',
    'source_impact','aligned_registry_grammar_no_source_supersession',
    'implementation_authority_created',false,
    'execution_instance_id','register_my_environment_primitive_grammar_chazz_001'
  )
)
on conflict(version_key) do update set
  version_standing=excluded.version_standing,
  visibility_standing=excluded.visibility_standing,
  recognized_at=excluded.recognized_at,
  source_oar2_path=excluded.source_oar2_path,
  metadata=excluded.metadata,
  updated_at=now();

insert into public.concordance_term(
  term_key,version_key,term_label,canonical_definition,axis,circuit,role,resolves_to,term_standing,visibility_standing,source_excerpt,metadata
)
values
('myenv_primitive_subject_v0_1','my_environment_primitive_grammar_v0_1','Subject','A person, organization, system, or computational actor that can participate in governed relation.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',1,'source_alignment','current_source_concordance_v16#Environment Permission Scope')),
('myenv_primitive_environment_v0_1','my_environment_primitive_grammar_v0_1','Environment','A bounded governed place within which relations, conditions, capabilities, packages, and passage may resolve.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',2,'source_alignment','current_source_concordance_v16#env_key')),
('myenv_primitive_relation_v0_1','my_environment_primitive_grammar_v0_1','Relation','A typed, standing-bearing edge between distinct governed objects that does not collapse identity, ownership, custody, authority, or standing.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',3,'source_alignment','current_source_concordance_v16#Native Relation')),
('myenv_primitive_grant_v0_1','my_environment_primitive_grammar_v0_1','Grant','A scoped, revocable relation that permits specified action for a subject within an established boundary.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',4,'source_alignment','current_source_concordance_v16#Environment Permission Scope')),
('myenv_primitive_package_v0_1','my_environment_primitive_grammar_v0_1','Package','A bounded, versioned custody-bearing or reference-bearing package that may be related to an environment without custody collapse. EnvPac, PubPac, and WebPac are package specializations.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',5,'source_alignment','current_source_concordance_v16#Asset Manifest')),
('myenv_primitive_capability_v0_1','my_environment_primitive_grammar_v0_1','Capability','A bounded function an environment may call when required authority, relation, constraints, and passage conditions are satisfied.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',6,'source_alignment','current_source_concordance_v16#Computational Skill')),
('myenv_primitive_selection_v0_1','my_environment_primitive_grammar_v0_1','Selection','Mutable owner-controlled environment presentation or preference state whose change does not redefine environment identity, authority, custody, standing, or Current.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',7,'source_alignment','current_source_concordance_v16#Environment Handle / Alias')),
('myenv_primitive_passage_v0_1','my_environment_primitive_grammar_v0_1','Passage','An attempted or completed movement, invocation, or transition across an established boundary under applicable relation and authority conditions.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',8,'source_alignment','current_source_concordance_v16#Governed Object Passage Process')),
('myenv_primitive_encounter_v0_1','my_environment_primitive_grammar_v0_1','Encounter','The point at which governed passage meets a subject, environment, capability, surface, or external destination.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',9,'source_alignment','current_source_concordance_v16#Operational Encounter')),
('myenv_primitive_evidence_v0_1','my_environment_primitive_grammar_v0_1','Evidence','The durable returned record of what actually occurred in an encounter or passage. Evidence appends; it does not overwrite history.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',10,'source_alignment','current_source_concordance_v16#OAR1')),
('myenv_primitive_current_v0_1','my_environment_primitive_grammar_v0_1','Current','The applicable persisted result of governed passage and evidence. This grammar does not redefine C1/C2/C3 Commerce Current semantics and Current is never command authority.','my_environment',null,'primitive','current_source_concordance_v16#C1/C2/C3 Commerce Currents','active','protected',null,jsonb_build_object('index',11,'source_alignment','current_source_concordance_v16#C1/C2/C3 Commerce Currents','source_controls_current_semantics',true)),
('myenv_primitive_runtime_session_v0_1','my_environment_primitive_grammar_v0_1','Runtime Session','Temporary runtime admission derived from an active Grant. Session is not Subject identity, Grant, ownership, custody, authority, or environment standing.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',12,'source_alignment','current_source_concordance_v16#Runtime / Platform Boundary')),
('myenv_primitive_boundary_v0_1','my_environment_primitive_grammar_v0_1','Boundary','The explicit limit within which an environment, authority, custody scope, package, capability, grant, or condition applies and beyond which it does not.','my_environment',null,'primitive',null,'active','protected',null,jsonb_build_object('index',13,'source_alignment','current_source_concordance_v16#c3 Tree Structural Relation / Boundary'))
on conflict(term_key) do update set
  version_key=excluded.version_key,
  term_label=excluded.term_label,
  canonical_definition=excluded.canonical_definition,
  axis=excluded.axis,
  circuit=excluded.circuit,
  role=excluded.role,
  resolves_to=excluded.resolves_to,
  term_standing=excluded.term_standing,
  visibility_standing=excluded.visibility_standing,
  source_excerpt=excluded.source_excerpt,
  metadata=excluded.metadata,
  updated_at=now();

insert into public.concordance_relation(
  relation_key,version_key,source_ref,target_ref,relation_scope,relation_type,relation_label,relation_standing,visibility_standing,source_oar2_path,metadata
)
values
('myenv_grammar_to_source_v16','my_environment_primitive_grammar_v0_1','my_environment_primitive_grammar_v0_1','current_source_concordance_v16','cross_version','source_alignment','current source controls collisions and qualifications','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval',jsonb_build_object('supersedes',false,'continuous_project_source',false)),
('myenv_subject_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_subject_v0_1','current_source_concordance_v16#Environment Permission Scope','term','source_alignment','subject participates in permission resolution; grammar adds reusable subject identity','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_environment_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_environment_v0_1','current_source_concordance_v16#env_key','term','source_alignment','environment primitive preserves canonical env_key identity separation','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_relation_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_relation_v0_1','current_source_concordance_v16#Native Relation','term','source_alignment','typed relation remains non-collapsing','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_grant_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_grant_v0_1','current_source_concordance_v16#Environment Permission Scope','term','source_alignment','grant is the scoped revocable relation used to satisfy permission; knowledge or visibility is insufficient','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_package_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_package_v0_1','current_source_concordance_v16#Asset Manifest','term','source_alignment','package generalizes bounded versioned custody/reference containers without replacing asset-manifest semantics','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_capability_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_capability_v0_1','current_source_concordance_v16#Computational Skill','term','source_alignment','capability preserves the rule that technical availability does not create authority','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_selection_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_selection_v0_1','current_source_concordance_v16#Environment Handle / Alias','term','source_alignment','mutable projection does not redefine underlying environment identity','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_passage_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_passage_v0_1','current_source_concordance_v16#Governed Object Passage Process','term','source_alignment','passage remains bounded movement under applicable authority and boundary conditions','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_encounter_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_encounter_v0_1','current_source_concordance_v16#Operational Encounter','term','source_alignment','encounter generalizes the bounded meeting point without replacing Operational Encounter semantics','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_evidence_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_evidence_v0_1','current_source_concordance_v16#OAR1','term','source_alignment','evidence records objective return and cannot manufacture authority','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_current_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_current_v0_1','current_source_concordance_v16#C1/C2/C3 Commerce Currents','term','source_alignment','Source Concordance controls Current semantics; grammar only preserves result-not-command relation','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval',jsonb_build_object('source_controls_semantics',true)),
('myenv_session_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_runtime_session_v0_1','current_source_concordance_v16#Runtime / Platform Boundary','term','source_alignment','runtime admission remains subordinate to grant and platform/runtime boundary','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb),
('myenv_boundary_to_source_v16','my_environment_primitive_grammar_v0_1','myenv_primitive_boundary_v0_1','current_source_concordance_v16#c3 Tree Structural Relation / Boundary','term','source_alignment','Boundary governs whether passage may proceed and remains foundational to primitive interpretation','active','protected','operator://op044/register_my_environment_primitive_grammar_chazz_001/approval','{}'::jsonb)
on conflict(relation_key) do update set
  version_key=excluded.version_key,
  source_ref=excluded.source_ref,
  target_ref=excluded.target_ref,
  relation_scope=excluded.relation_scope,
  relation_type=excluded.relation_type,
  relation_label=excluded.relation_label,
  relation_standing=excluded.relation_standing,
  visibility_standing=excluded.visibility_standing,
  source_oar2_path=excluded.source_oar2_path,
  metadata=excluded.metadata;

commit;
