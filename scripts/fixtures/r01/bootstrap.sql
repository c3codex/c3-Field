-- DISPOSABLE LOCAL SYNTHETIC ONLY. No remote/project connection supported.
create role anon;create role authenticated;create role service_role nologin bypassrls;
create table public.c3_environment("env_key" text not null,"system_key" text not null,"environment_name" text not null,"environment_class" text not null,"standing" text not null,"is_canonical" boolean default false not null,"is_active" boolean default true not null,"source_authority_ref" text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"relational_circuit" text,"current_pair" text,"model_function" text);
create table public.c3_envpac("envpac_key" text not null,"env_key" text not null,"version" text not null,"standing" text not null,"owner_subject_type" text not null,"owner_subject_key" text not null,"custodian_subject_type" text not null,"custodian_subject_key" text not null,"custody_uri" text not null,"custody_provider" text not null,"content_sha256" text,"architecture_version" text default 'c3pac_v0.1'::text not null,"is_effective" boolean default true not null,"portable" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"effective_at" timestamp with time zone default now() not null,"superseded_at" timestamp with time zone,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3_envpac_capability_grant("capability_key" text not null,"envpac_key" text not null,"system_key" text not null,"capability" text not null,"scope" jsonb default '{}'::jsonb not null,"standing" text default 'active'::text not null,"evidence_ref" text,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3_envpac_environment_binding("binding_key" text not null,"envpac_key" text not null,"env_key" text not null,"binding_role" text not null,"standing" text default 'active'::text not null,"is_primary" boolean default false not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3_envpac_rooted_system("rooted_system_key" text not null,"envpac_key" text not null,"system_key" text not null,"relation_role" text not null,"standing" text default 'active'::text not null,"authority_scope" jsonb default '{}'::jsonb not null,"runtime_ref" text,"source_ref" text,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3_pac("pac_key" text not null,"envpac_key" text not null,"pac_type" text not null,"version" text not null,"standing" text not null,"custody_uri" text not null,"content_sha256" text,"source_authority" text,"is_effective" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"contract_key" text,"architecture_version" text,"custodian_subject_type" text,"custodian_subject_key" text,"custody_provider" text,"authority_effect" text,"release_state" text,"execution_authority_state" text,"formation_state" text,"effective_at" timestamp with time zone,"supersedes_pac_key" text,"superseded_at" timestamp with time zone,"return_evidence_required" boolean,"owner_subject_type" text,"owner_subject_key" text,"owner_environment_key" text,"registration_protocol" text default 'legacy_pre_hardening'::text not null,"registration_sha256" text,"boundary_evaluation_key" text,"registered_at" timestamp with time zone,"registrar_role_call_key" text,"schema_key" text);
create table public.c3ops_asset_lineage_record("lineage_key" text not null,"asset_key" text not null,"parent_asset_key" text,"root_asset_key" text,"successor_asset_key" text,"lineage_type" text not null,"effective_date" timestamp with time zone default now() not null,"termination_date" timestamp with time zone,"replacement_reason" text,"legacy_standing" text default 'legacy'::text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3ops_asset_placement_determination("determination_key" text not null,"asset_key" text not null,"determined_by" text not null,"decision_authority" text not null,"owning_system_key" text not null,"seat_scope" text not null,"src_class" text not null,"src_key" text not null,"c3_key" text,"role_key" text not null,"env_key" text not null,"free_eligibility" boolean default false not null,"free_encounter_key" text,"renderer_key" text,"custody_type" text not null,"custody_provider" text not null,"target_custody_identifier" text not null,"target_object_key" text,"current_asset_key" text,"replacement_relation" text,"retention_rule" text,"rights_standing" text,"release_standing" text,"web3_standing" text,"unresolved_findings" jsonb default '{}'::jsonb not null,"determination_standing" text not null,"confirmed_at" timestamp with time zone,"executed_at" timestamp with time zone,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3ops_partner("partner_key" text not null,"partner_type" text not null,"identity_key" text not null,"owning_or_self_system_key" text,"standing" text default 'proposed'::text not null,"seat_standing" text,"c3_key" text,"default_role_key" text,"permitted_env_keys" text[] default '{}'::text[],"src_relation_keys" text[] default '{}'::text[],"authority_boundary" text,"review_relation" text,"active_from" timestamp with time zone default now(),"inactive_from" timestamp with time zone,"supersedes_partner_key" text,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3ops_publication_component("component_key" text not null,"publication_object_key" text not null,"section_key" text,"component_type" text not null,"asset_key" text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3ops_publication_lineage_record("lineage_key" text not null,"publication_object_key" text not null,"parent_object_key" text,"root_object_key" text,"successor_object_key" text,"lineage_type" text not null,"effective_date" timestamp with time zone default now() not null,"termination_date" timestamp with time zone,"replacement_reason" text,"legacy_standing" text default 'legacy'::text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3ops_publication_object("publication_object_key" text not null,"publisher_key" text not null,"publication_key" text not null,"series_key" text,"issue_key" text,"title" text not null,"description" text,"publication_standing" text default 'draft'::text not null,"editorial_standing" text default 'operator_directed'::text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.measures_encounter_def("id" uuid default gen_random_uuid() not null,"registry_id" uuid not null,"encounter_key" text not null,"display_title" text not null,"encounter_type" text not null,"material_family" text,"surface_type" text,"sequence_order" integer,"pause_allowed" boolean default false not null,"is_entry_surface" boolean default false not null,"is_active" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.measures_registry("id" uuid default gen_random_uuid() not null,"registry_key" text not null,"display_title" text not null,"registry_family" text not null,"encounter_type" text,"material_family" text,"sequence_order" integer,"release_state" text default 'sealed'::text not null,"access_state" text default 'gated'::text not null,"parent_registry_id" uuid,"depends_on_registry_id" uuid,"envelope_id" uuid,"phase_label" text,"is_active" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.measures_seat_hold_capture("id" uuid default gen_random_uuid() not null,"registry_key" text default 'measures_registry'::text not null,"encounter_key" text not null,"email" text not null,"capture_context" text default 'measures_registry_seat_hold'::text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"notification_state" text default 'captured'::text not null,"notified_at" timestamp with time zone,"source_encounter_key" text,"offering_key" text,"seat_lifecycle_state" text default 'held'::text not null);
create table public.measures_transition_rule("id" uuid default gen_random_uuid() not null,"from_registry_id" uuid,"from_encounter_id" uuid,"to_registry_id" uuid,"to_encounter_id" uuid,"transition_kind" text not null,"rule_state" text default 'active'::text not null,"requires_release" boolean default true not null,"requires_dependency_satisfied" boolean default false not null,"requires_passage_ready" boolean default false not null,"requires_connect_prompt" boolean default false not null,"sort_order" integer default 0 not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.system_oar_execution_evidence("evidence_key" text not null,"queue_key" text not null,"evidence_type" text not null,"evidence_summary" text not null,"validation_query" text,"validation_result" jsonb,"artifact_path" text,"commit_hash" text,"created_at" timestamp with time zone default now() not null);
create table public.system_oar_queue("queue_key" text not null,"process_key" text not null,"oar_key" text not null,"oar_type" text not null,"queue_status" text not null,"operator_key" text not null,"system_key" text not null,"scope_key" text not null,"requested_action" text not null,"execution_boundary" text not null,"preflight_status" text default 'required'::text not null,"operator_confirmed_at" timestamp with time zone,"execution_started_at" timestamp with time zone,"execution_completed_at" timestamp with time zone,"blocked_reason" text,"refusal_reason" text,"oar1_path" text,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"source_oar2_path" text,"expected_oar1_path" text,"automation_permissions" jsonb default '{}'::jsonb not null,"cody_handoff_prompt" text,"chazz_review_prompt" text,"chazz_review_prompt_generated_at" timestamp with time zone,"chazz_review_prompt_authority" text default 'thread_prompt_only'::text not null,"execution_summary" text,"db_mutation_standing" text default 'not_authorized'::text not null,"src_mutation_standing" text default 'not_authorized'::text not null,"deploy_standing" text default 'not_authorized'::text not null);
create table public.system_process_registry(process_key text primary key,process_status text not null);
alter table public.c3_environment add constraint "c3_environment_class_nonempty" CHECK ((length(btrim(environment_class)) > 0));
alter table public.c3_environment add constraint "c3_environment_env_key_nonempty" CHECK ((length(btrim(env_key)) > 0));
alter table public.c3_environment add constraint "c3_environment_model_tuple_all_or_none_chk" CHECK ((((relational_circuit IS NULL) AND (current_pair IS NULL) AND (model_function IS NULL)) OR ((relational_circuit IS NOT NULL) AND (current_pair IS NOT NULL) AND (model_function IS NOT NULL))));
alter table public.c3_environment add constraint "c3_environment_name_nonempty" CHECK ((length(btrim(environment_name)) > 0));
alter table public.c3_environment add constraint "c3_environment_pkey" PRIMARY KEY (env_key);
alter table public.c3_environment add constraint "c3_environment_source_authority_nonempty" CHECK ((length(btrim(source_authority_ref)) > 0));
alter table public.c3_environment add constraint "c3_environment_standing_nonempty" CHECK ((length(btrim(standing)) > 0));
alter table public.c3_environment add constraint "c3_environment_system_key_nonempty" CHECK ((length(btrim(system_key)) > 0));
alter table public.c3_envpac add constraint "c3_envpac_custodian_subject_type_check" CHECK ((custodian_subject_type = ANY (ARRAY['individual'::text, 'entity'::text, 'system'::text, 'environment'::text, 'service'::text])));
alter table public.c3_envpac add constraint "c3_envpac_env_key_version_key" UNIQUE (env_key, version);
alter table public.c3_envpac add constraint "c3_envpac_owner_subject_type_check" CHECK ((owner_subject_type = ANY (ARRAY['individual'::text, 'entity'::text, 'system'::text, 'environment'::text])));
alter table public.c3_envpac add constraint "c3_envpac_pkey" PRIMARY KEY (envpac_key);
alter table public.c3_envpac_capability_grant add constraint "c3_envpac_capability_grant_envpac_key_system_key_capability_key" UNIQUE (envpac_key, system_key, capability);
alter table public.c3_envpac_capability_grant add constraint "c3_envpac_capability_grant_pkey" PRIMARY KEY (capability_key);
alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_binding_role_check" CHECK ((binding_role = ANY (ARRAY['owned_environment'::text, 'c3me_environment'::text, 'parent_environment'::text, 'related_environment'::text])));
alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_envpac_key_env_key_binding_ro_key" UNIQUE (envpac_key, env_key, binding_role);
alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_pkey" PRIMARY KEY (binding_key);
alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_envpac_key_system_key_relation_role_key" UNIQUE (envpac_key, system_key, relation_role);
alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_pkey" PRIMARY KEY (rooted_system_key);
alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_relation_role_check" CHECK ((relation_role = ANY (ARRAY['operating_system'::text, 'registry'::text, 'governance'::text, 'publication'::text, 'distribution'::text, 'source_authority'::text, 'evidence'::text, 'supporting_system'::text])));
alter table public.c3_pac add constraint "c3_pac_custodian_subject_type_v1_check" CHECK (((custodian_subject_type IS NULL) OR (custodian_subject_type = ANY (ARRAY['individual'::text, 'entity'::text, 'system'::text, 'environment'::text, 'service'::text]))));
alter table public.c3_pac add constraint "c3_pac_envpac_key_pac_key_version_key" UNIQUE (envpac_key, pac_key, version);
alter table public.c3_pac add constraint "c3_pac_owner_subject_type_hardened_chk" CHECK (((owner_subject_type IS NULL) OR (owner_subject_type = ANY (ARRAY['individual'::text, 'institution'::text, 'system'::text, 'environment'::text, 'service'::text]))));
alter table public.c3_pac add constraint "c3_pac_pkey" PRIMARY KEY (pac_key);
alter table public.c3_pac add constraint "c3_pac_registrar_v1_required_fields_chk" CHECK (((registration_protocol <> 'registrar_v1'::text) OR ((schema_key IS NOT NULL) AND (owner_subject_type IS NOT NULL) AND (owner_subject_key IS NOT NULL) AND (registration_sha256 IS NOT NULL) AND (boundary_evaluation_key IS NOT NULL) AND (registered_at IS NOT NULL) AND (registrar_role_call_key IS NOT NULL) AND ((owner_subject_type <> 'institution'::text) OR (owner_environment_key IS NOT NULL)))));
alter table public.c3_pac add constraint "c3_pac_registration_protocol_chk" CHECK ((registration_protocol = ANY (ARRAY['legacy_pre_hardening'::text, 'registrar_v1'::text])));
alter table public.c3_pac add constraint "c3_pac_registration_sha_chk" CHECK (((registration_sha256 IS NULL) OR (registration_sha256 ~ '^[0-9a-f]{64}$'::text)));
alter table public.c3_pac add constraint "c3_pac_supersedes_not_self_v1_check" CHECK (((supersedes_pac_key IS NULL) OR (supersedes_pac_key <> pac_key)));
alter table public.c3ops_asset_lineage_record add constraint "c3ops_asset_lineage_record_pkey" PRIMARY KEY (lineage_key);
alter table public.c3ops_asset_placement_determination add constraint "c3ops_asset_placement_determination_pkey" PRIMARY KEY (determination_key);
alter table public.c3ops_partner add constraint "c3ops_partner_partner_type_check" CHECK ((partner_type = ANY (ARRAY['individual'::text, 'institution'::text, 'intelligence'::text])));
alter table public.c3ops_partner add constraint "c3ops_partner_pkey" PRIMARY KEY (partner_key);
alter table public.c3ops_publication_component add constraint "c3ops_publication_component_pkey" PRIMARY KEY (component_key);
alter table public.c3ops_publication_lineage_record add constraint "c3ops_publication_lineage_record_pkey" PRIMARY KEY (lineage_key);
alter table public.c3ops_publication_object add constraint "c3ops_publication_object_editorial_standing_check" CHECK ((editorial_standing = ANY (ARRAY['operator_directed'::text, 'operator_reviewed'::text, 'ai_assisted'::text, 'ai_authored'::text, 'collaborative'::text, 'held'::text])));
alter table public.c3ops_publication_object add constraint "c3ops_publication_object_pkey" PRIMARY KEY (publication_object_key);
alter table public.c3ops_publication_object add constraint "c3ops_publication_object_publication_standing_check" CHECK ((publication_standing = ANY (ARRAY['draft'::text, 'review'::text, 'approved'::text, 'scheduled'::text, 'published'::text, 'corrected'::text, 'superseded'::text, 'legacy'::text, 'archived'::text, 'withdrawn'::text])));
alter table public.measures_encounter_def add constraint "measures_encounter_def_encounter_key_key" UNIQUE (encounter_key);
alter table public.measures_encounter_def add constraint "measures_encounter_def_material_family_check" CHECK (((material_family IS NULL) OR (material_family = ANY (ARRAY['obsidian'::text, 'crystal'::text, 'marble'::text, 'lapis'::text]))));
alter table public.measures_encounter_def add constraint "measures_encounter_def_pkey" PRIMARY KEY (id);
alter table public.measures_encounter_def add constraint "measures_encounter_def_registry_id_key" UNIQUE (registry_id);
alter table public.measures_encounter_def add constraint "measures_encounter_def_surface_type_check" CHECK (((surface_type IS NULL) OR (surface_type = ANY (ARRAY['scroll'::text, 'aspect'::text, 'inscription'::text, 'passage'::text, 'glyph_surface'::text, 'phase_map'::text, 'threshold'::text, 'chamberplate'::text]))));
alter table public.measures_registry add constraint "measures_registry_access_state_check" CHECK ((access_state = ANY (ARRAY['gated'::text, 'visible'::text, 'callable'::text, 'encounterable'::text, 'archived'::text])));
alter table public.measures_registry add constraint "measures_registry_material_family_check" CHECK (((material_family IS NULL) OR (material_family = ANY (ARRAY['obsidian'::text, 'crystal'::text, 'marble'::text, 'lapis'::text]))));
alter table public.measures_registry add constraint "measures_registry_pkey" PRIMARY KEY (id);
alter table public.measures_registry add constraint "measures_registry_registry_family_check" CHECK ((registry_family = ANY (ARRAY['spine'::text, 'chamber_directory'::text, 'gate'::text, 'epithet'::text, 'me'::text])));
alter table public.measures_registry add constraint "measures_registry_registry_key_key" UNIQUE (registry_key);
alter table public.measures_registry add constraint "measures_registry_release_state_check" CHECK ((release_state = ANY (ARRAY['sealed'::text, 'held'::text, 'released'::text, 'open'::text, 'closed'::text])));
alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_email_check" CHECK ((POSITION(('@'::text) IN (email)) > 1));
alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_encounter_check" CHECK ((encounter_key = ANY (ARRAY['foundation_seat_hold'::text, 'systems_seat_hold'::text])));
alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_notification_state_check" CHECK ((notification_state = ANY (ARRAY['captured'::text, 'queued'::text, 'notified'::text, 'failed'::text, 'suppressed'::text])));
alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_pkey" PRIMARY KEY (id);
alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_seat_lifecycle_state_check" CHECK ((seat_lifecycle_state = ANY (ARRAY['held'::text, 'reviewed'::text, 'approved'::text, 'notified'::text, 'suppressed'::text, 'expired'::text])));
alter table public.measures_transition_rule add constraint "measures_transition_rule_anchor_chk" CHECK ((((from_registry_id IS NOT NULL) OR (from_encounter_id IS NOT NULL)) AND ((to_registry_id IS NOT NULL) OR (to_encounter_id IS NOT NULL))));
alter table public.measures_transition_rule add constraint "measures_transition_rule_pkey" PRIMARY KEY (id);
alter table public.measures_transition_rule add constraint "measures_transition_rule_rule_state_check" CHECK ((rule_state = ANY (ARRAY['active'::text, 'held'::text, 'inactive'::text])));
alter table public.measures_transition_rule add constraint "measures_transition_rule_transition_kind_check" CHECK ((transition_kind = ANY (ARRAY['progression'::text, 'pause'::text, 'return'::text, 'release'::text, 'seal'::text, 'dependency_unlock'::text, 'connect_request_prompt'::text])));
alter table public.system_oar_execution_evidence add constraint "system_oar_execution_evidence_pkey" PRIMARY KEY (evidence_key);
alter table public.system_oar_execution_evidence add constraint "system_oar_execution_evidence_type_check" CHECK ((evidence_type = ANY (ARRAY['file_check'::text, 'db_query'::text, 'migration_result'::text, 'git_commit'::text, 'operator_review'::text, 'runtime_validation'::text, 'refusal_record'::text])));
alter table public.system_oar_queue add constraint "system_oar_queue_chazz_prompt_thread_only_check" CHECK ((chazz_review_prompt_authority = 'thread_prompt_only'::text));
alter table public.system_oar_queue add constraint "system_oar_queue_closed_requires_oar1_path_check" CHECK (((queue_status <> 'closed'::text) OR (oar1_path IS NOT NULL)));
alter table public.system_oar_queue add constraint "system_oar_queue_completed_requires_execution_completed_check" CHECK (((queue_status <> ALL (ARRAY['oar1_submitted'::text, 'completed'::text, 'closed'::text])) OR (execution_completed_at IS NOT NULL)));
alter table public.system_oar_queue add constraint "system_oar_queue_deploy_standing_check" CHECK ((deploy_standing = ANY (ARRAY['not_authorized'::text, 'not_applicable'::text, 'configured'::text, 'deployed'::text, 'held'::text, 'failed'::text])));
alter table public.system_oar_queue add constraint "system_oar_queue_executing_requires_operator_confirm_check" CHECK (((queue_status <> 'executing'::text) OR (operator_confirmed_at IS NOT NULL)));
alter table public.system_oar_queue add constraint "system_oar_queue_executing_requires_passed_preflight_check" CHECK (((queue_status <> 'executing'::text) OR (preflight_status = 'passed'::text)));
alter table public.system_oar_queue add constraint "system_oar_queue_mutation_standing_check" CHECK (((db_mutation_standing = ANY (ARRAY['not_authorized'::text, 'not_applicable'::text, 'mutated'::text, 'held'::text, 'failed'::text])) AND (src_mutation_standing = ANY (ARRAY['not_authorized'::text, 'not_applicable'::text, 'mutated'::text, 'held'::text, 'failed'::text]))));
alter table public.system_oar_queue add constraint "system_oar_queue_oar1_submitted_requires_oar1_path_check" CHECK (((queue_status <> 'oar1_submitted'::text) OR (oar1_path IS NOT NULL)));
alter table public.system_oar_queue add constraint "system_oar_queue_oar_type_check" CHECK ((oar_type = ANY (ARRAY['oar1'::text, 'oar2'::text])));
alter table public.system_oar_queue add constraint "system_oar_queue_pkey" PRIMARY KEY (queue_key);
alter table public.system_oar_queue add constraint "system_oar_queue_preflight_status_check" CHECK ((preflight_status = ANY (ARRAY['required'::text, 'passed'::text, 'failed'::text, 'waived'::text])));
alter table public.system_oar_queue add constraint "system_oar_queue_queue_status_check" CHECK ((queue_status = ANY (ARRAY['draft'::text, 'queued'::text, 'queued_for_cody'::text, 'preflight_required'::text, 'awaiting_operator_confirm'::text, 'approved_for_execution'::text, 'executing'::text, 'oar1_submitted'::text, 'blocked'::text, 'held'::text, 'refused'::text, 'completed'::text, 'closed'::text])));
alter table public.c3_envpac add constraint "c3_envpac_env_key_fkey" FOREIGN KEY (env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public.c3_envpac_capability_grant add constraint "c3_envpac_capability_grant_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_env_key_fkey" FOREIGN KEY (env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.c3_pac add constraint "c3_pac_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public.c3_pac add constraint "c3_pac_supersedes_pac_key_fkey" FOREIGN KEY (supersedes_pac_key) REFERENCES c3_pac(pac_key) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public.measures_encounter_def add constraint "measures_encounter_def_registry_id_fkey" FOREIGN KEY (registry_id) REFERENCES measures_registry(id) ON DELETE CASCADE;
alter table public.measures_registry add constraint "measures_registry_depends_on_registry_id_fkey" FOREIGN KEY (depends_on_registry_id) REFERENCES measures_registry(id) ON DELETE SET NULL;
alter table public.measures_registry add constraint "measures_registry_parent_registry_id_fkey" FOREIGN KEY (parent_registry_id) REFERENCES measures_registry(id) ON DELETE SET NULL;
alter table public.measures_transition_rule add constraint "measures_transition_rule_from_encounter_id_fkey" FOREIGN KEY (from_encounter_id) REFERENCES measures_encounter_def(id) ON DELETE CASCADE;
alter table public.measures_transition_rule add constraint "measures_transition_rule_from_registry_id_fkey" FOREIGN KEY (from_registry_id) REFERENCES measures_registry(id) ON DELETE CASCADE;
alter table public.measures_transition_rule add constraint "measures_transition_rule_to_encounter_id_fkey" FOREIGN KEY (to_encounter_id) REFERENCES measures_encounter_def(id) ON DELETE CASCADE;
alter table public.measures_transition_rule add constraint "measures_transition_rule_to_registry_id_fkey" FOREIGN KEY (to_registry_id) REFERENCES measures_registry(id) ON DELETE CASCADE;
alter table public.system_oar_execution_evidence add constraint "system_oar_execution_evidence_queue_key_fkey" FOREIGN KEY (queue_key) REFERENCES system_oar_queue(queue_key);
alter table public.c3_environment enable row level security;
alter table public.c3_envpac enable row level security;
alter table public.c3_envpac_capability_grant enable row level security;
alter table public.c3_envpac_environment_binding enable row level security;
alter table public.c3_envpac_rooted_system enable row level security;
alter table public.c3_pac enable row level security;
alter table public.c3ops_asset_lineage_record enable row level security;
alter table public.c3ops_asset_placement_determination enable row level security;
alter table public.c3ops_partner enable row level security;
alter table public.c3ops_publication_component enable row level security;
alter table public.c3ops_publication_lineage_record enable row level security;
alter table public.c3ops_publication_object enable row level security;
alter table public.measures_encounter_def enable row level security;
alter table public.measures_registry enable row level security;
alter table public.measures_seat_hold_capture enable row level security;
alter table public.measures_transition_rule enable row level security;
alter table public.system_oar_execution_evidence enable row level security;
alter table public.system_oar_queue enable row level security;
create policy "Allow anon and authenticated write on c3ops_asset_lineage_recor" on public.c3ops_asset_lineage_record as PERMISSIVE for ALL to public using (true) with check (true);
create policy "Allow public read access on c3ops_asset_lineage_record" on public.c3ops_asset_lineage_record as PERMISSIVE for SELECT to public using (true);
create policy "Allow anon and authenticated write on c3ops_asset_placement_det" on public.c3ops_asset_placement_determination as PERMISSIVE for ALL to public using (true) with check (true);
create policy "Allow public read access on c3ops_asset_placement_determination" on public.c3ops_asset_placement_determination as PERMISSIVE for SELECT to public using (true);
create policy "Allow anon and authenticated write on c3ops_partner" on public.c3ops_partner as PERMISSIVE for ALL to public using (true) with check (true);
create policy "Allow public read access on c3ops_partner" on public.c3ops_partner as PERMISSIVE for SELECT to public using (true);
create policy "Allow anon and authenticated write on c3ops_publication_compone" on public.c3ops_publication_component as PERMISSIVE for ALL to public using (true) with check (true);
create policy "Allow public read access on c3ops_publication_component" on public.c3ops_publication_component as PERMISSIVE for SELECT to public using (true);
create policy "Allow anon and authenticated write on c3ops_publication_lineage" on public.c3ops_publication_lineage_record as PERMISSIVE for ALL to public using (true) with check (true);
create policy "Allow public read access on c3ops_publication_lineage_record" on public.c3ops_publication_lineage_record as PERMISSIVE for SELECT to public using (true);
create policy "Allow anon and authenticated write on c3ops_publication_object" on public.c3ops_publication_object as PERMISSIVE for ALL to public using (true) with check (true);
create policy "Allow public read access on c3ops_publication_object" on public.c3ops_publication_object as PERMISSIVE for SELECT to public using (true);
create view public.c3_envpac_effective_graph as  SELECT envpac_key,
    env_key AS registry_env_key,
    version,
    standing AS envpac_standing,
    owner_subject_type,
    owner_subject_key,
    custodian_subject_type,
    custodian_subject_key,
    custody_uri,
    custody_provider,
    content_sha256,
    portable,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('env_key', b.env_key, 'binding_role', b.binding_role, 'standing', b.standing, 'is_primary', b.is_primary, 'metadata', b.metadata) ORDER BY b.is_primary DESC, b.env_key) AS jsonb_agg
           FROM c3_envpac_environment_binding b
          WHERE b.envpac_key = ep.envpac_key), '[]'::jsonb) AS environment_bindings,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('system_key', rs.system_key, 'relation_role', rs.relation_role, 'standing', rs.standing, 'authority_scope', rs.authority_scope, 'runtime_ref', rs.runtime_ref, 'source_ref', rs.source_ref) ORDER BY rs.relation_role, rs.system_key) AS jsonb_agg
           FROM c3_envpac_rooted_system rs
          WHERE rs.envpac_key = ep.envpac_key), '[]'::jsonb) AS rooted_systems,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('pac_key', p.pac_key, 'pac_type', p.pac_type, 'version', p.version, 'standing', p.standing, 'custody_uri', p.custody_uri, 'content_sha256', p.content_sha256) ORDER BY p.pac_type, p.pac_key) AS jsonb_agg
           FROM c3_pac p
          WHERE p.envpac_key = ep.envpac_key AND p.is_effective = true), '[]'::jsonb) AS packages
   FROM c3_envpac ep
  WHERE is_effective = true;;
create view public.c3_envpac_registry_reference as  SELECT e.env_key,
    e.system_key,
    e.environment_name,
    p.envpac_key,
    p.version AS envpac_version,
    p.standing AS envpac_standing,
    p.owner_subject_type,
    p.owner_subject_key,
    p.custodian_subject_type,
    p.custodian_subject_key,
    p.custody_uri,
    p.custody_provider,
    p.content_sha256,
    p.portable,
    p.effective_at
   FROM c3_environment e
     JOIN c3_envpac p ON p.env_key = e.env_key
  WHERE p.is_effective = true;;
create view public.measures_seat_hold_notification_review_v1 as  SELECT id AS capture_id,
    email,
    offering_key,
    source_encounter_key,
    notification_state,
    seat_lifecycle_state,
    created_at,
    notified_at
   FROM measures_seat_hold_capture
  WHERE registry_key = 'measures_registry'::text
  ORDER BY created_at DESC;;
grant usage on schema public to anon,authenticated,service_role;
grant all on all tables in schema public to anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.add_measures_transition_rule(p_from_registry_key text, p_to_registry_key text, p_transition_kind text, p_requires_release boolean DEFAULT true, p_requires_dependency_satisfied boolean DEFAULT false, p_requires_passage_ready boolean DEFAULT false, p_requires_connect_prompt boolean DEFAULT false, p_sort_order integer DEFAULT 0, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(transition_rule_id uuid, from_registry_id uuid, to_registry_id uuid, transition_kind text, rule_state text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_from_registry_id uuid;
  v_to_registry_id uuid;
  v_rule_id uuid;
begin
  select mr.id
  into v_from_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_from_registry_key
    and mr.is_active = true;

  select mr.id
  into v_to_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_to_registry_key
    and mr.is_active = true;

  if v_from_registry_id is null then
    raise exception 'from registry_key not found or inactive: %', p_from_registry_key;
  end if;

  if v_to_registry_id is null then
    raise exception 'to registry_key not found or inactive: %', p_to_registry_key;
  end if;

  insert into public.measures_transition_rule (
    from_registry_id,
    to_registry_id,
    transition_kind,
    rule_state,
    requires_release,
    requires_dependency_satisfied,
    requires_passage_ready,
    requires_connect_prompt,
    sort_order,
    metadata
  )
  values (
    v_from_registry_id,
    v_to_registry_id,
    p_transition_kind,
    'active',
    coalesce(p_requires_release, true),
    coalesce(p_requires_dependency_satisfied, false),
    coalesce(p_requires_passage_ready, false),
    coalesce(p_requires_connect_prompt, false),
    coalesce(p_sort_order, 0),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_rule_id;

  return query
  select
    mtr.id,
    mtr.from_registry_id,
    mtr.to_registry_id,
    mtr.transition_kind,
    mtr.rule_state
  from public.measures_transition_rule mtr
  where mtr.id = v_rule_id;
end;
$function$
;
grant execute on function public.add_measures_transition_rule(text,text,text,boolean,boolean,boolean,boolean,integer,jsonb) to anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.define_measures_encounter(p_registry_key text, p_encounter_key text, p_display_title text, p_encounter_type text, p_material_family text DEFAULT NULL::text, p_surface_type text DEFAULT NULL::text, p_sequence_order integer DEFAULT NULL::integer, p_pause_allowed boolean DEFAULT false, p_is_entry_surface boolean DEFAULT false, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(encounter_id uuid, registry_id uuid, registry_key text, encounter_key text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_registry_id uuid;
  v_encounter_id uuid;
begin
  select mr.id
  into v_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_registry_key
    and mr.is_active = true;

  if v_registry_id is null then
    raise exception 'registry_key not found or inactive: %', p_registry_key;
  end if;

  insert into public.measures_encounter_def (
    registry_id,
    encounter_key,
    display_title,
    encounter_type,
    material_family,
    surface_type,
    sequence_order,
    pause_allowed,
    is_entry_surface,
    is_active,
    metadata
  )
  values (
    v_registry_id,
    p_encounter_key,
    p_display_title,
    p_encounter_type,
    p_material_family,
    p_surface_type,
    p_sequence_order,
    coalesce(p_pause_allowed, false),
    coalesce(p_is_entry_surface, false),
    true,
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (registry_id) do update
    set encounter_key = excluded.encounter_key,
        display_title = excluded.display_title,
        encounter_type = excluded.encounter_type,
        material_family = excluded.material_family,
        surface_type = excluded.surface_type,
        sequence_order = excluded.sequence_order,
        pause_allowed = excluded.pause_allowed,
        is_entry_surface = excluded.is_entry_surface,
        metadata = excluded.metadata,
        updated_at = now()
  returning id into v_encounter_id;

  return query
  select
    med.id,
    med.registry_id,
    mr.registry_key,
    med.encounter_key
  from public.measures_encounter_def med
  join public.measures_registry mr
    on mr.id = med.registry_id
  where med.id = v_encounter_id;
end;
$function$
;
grant execute on function public.define_measures_encounter(text,text,text,text,text,text,integer,boolean,boolean,jsonb) to anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.system_oar_queue_confirm_and_start_cody(p_queue_key text, p_operator_key text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
begin
  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.oar_type <> 'oar2' then
    raise exception 'only OAR2 queue rows can start Cody execution';
  end if;

  if v_queue.queue_status not in ('awaiting_operator_confirm', 'approved_for_execution', 'queued_for_cody') then
    raise exception 'queue row is not eligible for operator-confirmed Cody execution: %', v_queue.queue_status;
  end if;

  if v_queue.preflight_status <> 'passed' then
    raise exception 'preflight must be passed before Cody execution';
  end if;

  if v_queue.source_oar2_path is null or v_queue.expected_oar1_path is null then
    raise exception 'source_oar2_path and expected_oar1_path are required before Cody execution';
  end if;

  update public.system_oar_queue
  set
    operator_key = p_operator_key,
    operator_confirmed_at = coalesce(operator_confirmed_at, now()),
    queue_status = 'queued_for_cody',
    cody_handoff_prompt = concat(
      'Execute only from confirmed OAR2: ',
      source_oar2_path,
      '. Expected OAR1: ',
      expected_oar1_path,
      '.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  update public.system_oar_queue
  set
    queue_status = 'executing',
    execution_started_at = coalesce(execution_started_at, now())
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;
grant execute on function public.system_oar_queue_confirm_and_start_cody(text,text) to anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.system_oar_queue_submit_oar1_for_chazz_prompt(p_queue_key text, p_oar1_path text, p_evidence_path text, p_execution_summary text, p_db_mutation_standing text DEFAULT 'not_applicable'::text, p_src_mutation_standing text DEFAULT 'not_applicable'::text, p_deploy_standing text DEFAULT 'not_applicable'::text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
  v_evidence_key text;
begin
  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.queue_status <> 'executing' then
    raise exception 'OAR1 can only be submitted from executing standing';
  end if;

  if p_oar1_path is null or length(trim(p_oar1_path)) = 0 then
    raise exception 'OAR1 path is required before Chazz prompt generation';
  end if;

  if p_evidence_path is null or length(trim(p_evidence_path)) = 0 then
    raise exception 'evidence path is required before Chazz prompt generation';
  end if;

  v_evidence_key := concat(p_queue_key, ':oar1-submitted');

  insert into public.system_oar_execution_evidence (
    evidence_key,
    queue_key,
    evidence_type,
    evidence_summary,
    artifact_path
  )
  values (
    v_evidence_key,
    p_queue_key,
    'runtime_validation',
    coalesce(nullif(p_execution_summary, ''), 'OAR1 submitted for Chazz review prompt'),
    p_evidence_path
  )
  on conflict (evidence_key) do update
  set
    evidence_summary = excluded.evidence_summary,
    artifact_path = excluded.artifact_path;

  update public.system_oar_queue
  set
    queue_status = 'oar1_submitted',
    execution_completed_at = coalesce(execution_completed_at, now()),
    oar1_path = p_oar1_path,
    execution_summary = p_execution_summary,
    db_mutation_standing = p_db_mutation_standing,
    src_mutation_standing = p_src_mutation_standing,
    deploy_standing = p_deploy_standing,
    chazz_review_prompt_authority = 'thread_prompt_only',
    chazz_review_prompt_generated_at = now(),
    chazz_review_prompt = concat(
      'Review this OAR1 against its source OAR2.',
      E'\n\nSource OAR2: ',
      source_oar2_path,
      E'\nOAR1: ',
      p_oar1_path,
      E'\nEvidence: ',
      p_evidence_path,
      E'\nExecution standing: oar1_submitted',
      E'\nDB mutation standing: ',
      p_db_mutation_standing,
      E'\nsrc mutation standing: ',
      p_src_mutation_standing,
      E'\nDeploy standing: ',
      p_deploy_standing,
      E'\nWhat Cody changed: ',
      coalesce(p_execution_summary, 'not recorded'),
      E'\nRequested Chazz decision: `validated`, `correction_required`, or `held`.',
      E'\n\nThis prompt is a review surface only. Final standing must be seated back into governed DB/Measures state.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;
grant execute on function public.system_oar_queue_submit_oar1_for_chazz_prompt(text,text,text,text,text,text,text) to anon,authenticated,service_role;
