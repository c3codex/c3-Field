create table public."c1_environment_connection_thread"("thread_key" text not null,"env_key" text not null,"envpac_key" text not null,"owner_relationship_key" text not null,"title" text default 'Connections'::text not null,"standing" text default 'active'::text not null,"visibility" text default 'owner_private'::text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public."c1_environment_connection_thread_entry"("entry_key" uuid default gen_random_uuid() not null,"thread_key" text not null,"owner_relationship_key" text not null,"entry_type" text not null,"title" text,"body" text not null,"related_type" text,"related_key" text,"related_route" text,"standing" text default 'active'::text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public."c3_cancom_device_key"("device_key" text not null,"relationship_key" text not null,"env_key" text not null,"envpac_key" text not null,"encryption_public_key" text not null,"signing_public_key" text not null,"encryption_algorithm" text default 'X25519'::text not null,"signing_algorithm" text default 'Ed25519'::text not null,"key_fingerprint" text not null,"standing" text default 'active'::text not null,"created_at" timestamp with time zone default now() not null,"last_seen_at" timestamp with time zone default now() not null,"revoked_at" timestamp with time zone,"metadata" jsonb default '{}'::jsonb not null);
create table public."c3_current_evidence_ref"("current_evidence_ref_key" text not null,"current_state_key" text not null,"evidence_key" text not null,"evidence_class" text not null,"asset_key" text,"content_hash" text not null,"hash_algorithm" text default 'sha256'::text not null,"authoritative_custody_type" text not null,"authoritative_custody_provider" text,"authoritative_custody_identifier" text,"authoritative_custody_location" text,"evidence_standing" text not null,"tokenization_standing_at_attest" text,"external_anchor_ref_at_attest" jsonb,"source_execution_instance_id" text,"metadata" jsonb default '{}'::jsonb not null,"attested_by" text not null,"attested_at" timestamp with time zone default now() not null);
create table public."c3_current_state"("current_state_key" text not null,"env_key" text not null,"state_version" integer not null,"standing" text not null,"effective_at" timestamp with time zone default now() not null,"superseded_at" timestamp with time zone,"formation_authority_ref" text not null,"advance_disposition_ref" text,"predecessor_current_state_key" text,"is_current" boolean default true not null,"source_grammar_key" text default 'codexstone_source_spark_weave_field_form'::text not null,"metadata" jsonb default '{}'::jsonb not null,"created_by" text not null,"created_at" timestamp with time zone default now() not null,"mutation_protocol" text default 'legacy_pre_hardening'::text not null,"registrar_role_key" text);
create table public."c3_env_initiative_visibility"("visibility_key" text not null,"relationship_key" text not null,"env_key" text not null,"envpac_key" text not null,"initiative_key" text not null,"initiative_envpac_key" text not null,"target_environment_key" text,"visibility_source" text not null,"source_ref" text,"standing" text default 'active'::text not null,"visible_at" timestamp with time zone default now() not null,"revoked_at" timestamp with time zone,"metadata" jsonb default '{}'::jsonb not null);
create table public."c3_env_native_connection"("connection_key" text not null,"pair_key" text not null,"source_relationship_key" text not null,"source_env_key" text not null,"source_envpac_key" text not null,"target_relationship_key" text not null,"target_env_key" text not null,"target_envpac_key" text not null,"standing" text default 'active'::text not null,"formed_from_share_reference" uuid,"formed_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"revoked_at" timestamp with time zone,"metadata" jsonb default '{}'::jsonb not null);
create table public."c3_env_runtime_session"("session_key" uuid default gen_random_uuid() not null,"token_sha256" text not null,"envpac_key" text not null,"env_key" text not null,"subject_type" text not null,"subject_key" text not null,"standing" text default 'active'::text not null,"created_at" timestamp with time zone default now() not null,"last_seen_at" timestamp with time zone default now() not null,"expires_at" timestamp with time zone not null,"revoked_at" timestamp with time zone,"evidence_ref" text,"metadata" jsonb default '{}'::jsonb not null);
create table public."c3_envpac_access_grant"("grant_key" text not null,"envpac_key" text not null,"subject_type" text not null,"subject_key" text not null,"relation_role" text not null,"scope" jsonb default '{}'::jsonb not null,"standing" text default 'active'::text not null,"granted_by_type" text not null,"granted_by_key" text not null,"granted_at" timestamp with time zone default now() not null,"expires_at" timestamp with time zone,"revoked_at" timestamp with time zone,"evidence_ref" text,"metadata" jsonb default '{}'::jsonb not null);
create table public."c3_envpac_canopy_event"("event_key" uuid default gen_random_uuid() not null,"envpac_key" text not null,"reference_key" uuid,"owner_subject_key" text not null,"event_type" text not null,"event_data" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null);
create table public."c3_envpac_canopy_reference"("reference_key" uuid default gen_random_uuid() not null,"envpac_key" text not null,"owner_subject_key" text not null,"surface_label" text not null,"display_label" text,"external_url" text not null,"handle" text,"sort_order" integer default 0 not null,"reference_state" text default 'active'::text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"removed_at" timestamp with time zone);
create table public."c3_envpac_runtime_primitive"("binding_key" text not null,"envpac_key" text not null,"primitive_key" text not null,"primitive_class" text not null,"display_label" text not null,"renderer_key" text not null,"runtime_endpoint" text,"sort_order" integer default 0 not null,"standing" text default 'active'::text not null,"config" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public."c3_profile_pac"("pac_key" text not null,"profile_key" text not null,"subject_type" text not null,"subject_key" text not null,"profile_class" text not null,"display_label" text not null,"visibility_scope" text default 'private'::text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public."crs_relationship"("relationship_key" text not null,"primary_email" text not null,"display_name" text,"organization" text,"relationship_standing" text default 'active_test'::text not null,"source_encounter" text not null,"is_test_relationship" boolean default false not null,"is_active" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public."c3_pac_member"("member_key" text not null,"pac_key" text not null,"member_kind" text not null,"member_role" text not null,"source_object_key" text,"custody_provider" text,"custody_identifier" text,"custody_location" text,"runtime_uri" text,"runtime_binding_key" text,"integrity_algorithm" text,"integrity_value" text,"version" text,"standing" text default 'active'::text not null,"required" boolean default false not null,"release_scope" text default 'registered'::text not null,"ordinal" integer,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
alter table public."c1_environment_connection_thread" add constraint "c1_environment_connection_thr_env_key_owner_relationship_ke_key" UNIQUE (env_key, owner_relationship_key);
alter table public."c1_environment_connection_thread" add constraint "c1_environment_connection_thread_pkey" PRIMARY KEY (thread_key);
alter table public."c1_environment_connection_thread" add constraint "c1_environment_connection_thread_standing_check" CHECK ((standing = ANY (ARRAY['active'::text, 'held'::text, 'closed'::text])));
alter table public."c1_environment_connection_thread" add constraint "c1_environment_connection_thread_visibility_check" CHECK ((visibility = ANY (ARRAY['owner_private'::text, 'shared_bounded'::text])));
alter table public."c1_environment_connection_thread_entry" add constraint "c1_environment_connection_thread_entry_entry_type_check" CHECK ((entry_type = ANY (ARRAY['connection'::text, 'note'::text, 'introduction'::text, 'opportunity'::text, 'follow_up'::text, 'system_update'::text])));
alter table public."c1_environment_connection_thread_entry" add constraint "c1_environment_connection_thread_entry_pkey" PRIMARY KEY (entry_key);
alter table public."c1_environment_connection_thread_entry" add constraint "c1_environment_connection_thread_entry_standing_check" CHECK ((standing = ANY (ARRAY['active'::text, 'held'::text, 'resolved'::text, 'superseded'::text])));
alter table public."c3_cancom_device_key" add constraint "c3_cancom_device_key_algorithms_check" CHECK (((encryption_algorithm = 'X25519'::text) AND (signing_algorithm = 'Ed25519'::text)));
alter table public."c3_cancom_device_key" add constraint "c3_cancom_device_key_fingerprint_check" CHECK ((key_fingerprint ~ '^[0-9a-f]{64}$'::text));
alter table public."c3_cancom_device_key" add constraint "c3_cancom_device_key_pkey" PRIMARY KEY (device_key);
alter table public."c3_cancom_device_key" add constraint "c3_cancom_device_key_standing_check" CHECK ((standing = ANY (ARRAY['active'::text, 'revoked'::text])));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_anchor_object" CHECK (((external_anchor_ref_at_attest IS NULL) OR (jsonb_typeof(external_anchor_ref_at_attest) = 'object'::text)));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_attested_by_nonblank" CHECK ((length(btrim(attested_by)) > 0));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_class_nonblank" CHECK ((length(btrim(evidence_class)) > 0));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_custody_nonblank" CHECK ((length(btrim(authoritative_custody_type)) > 0));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_hash_algorithm_nonblank" CHECK ((length(btrim(hash_algorithm)) > 0));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_hash_nonblank" CHECK ((length(btrim(content_hash)) > 0));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_identity_unique" UNIQUE (current_state_key, evidence_key, content_hash);
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_key_nonblank" CHECK ((length(btrim(evidence_key)) > 0));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_metadata_object" CHECK ((jsonb_typeof(metadata) = 'object'::text));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_ref_key_nonblank" CHECK ((length(btrim(current_evidence_ref_key)) > 0));
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_ref_pkey" PRIMARY KEY (current_evidence_ref_key);
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_standing_nonblank" CHECK ((length(btrim(evidence_standing)) > 0));
alter table public."c3_current_state" add constraint "c3_current_state_created_by_nonblank" CHECK ((length(btrim(created_by)) > 0));
alter table public."c3_current_state" add constraint "c3_current_state_env_key_nonblank" CHECK ((length(btrim(env_key)) > 0));
alter table public."c3_current_state" add constraint "c3_current_state_env_version_unique" UNIQUE (env_key, state_version);
alter table public."c3_current_state" add constraint "c3_current_state_formation_authority_nonblank" CHECK ((length(btrim(formation_authority_ref)) > 0));
alter table public."c3_current_state" add constraint "c3_current_state_initial_or_successor" CHECK ((((state_version = 1) AND (predecessor_current_state_key IS NULL) AND (advance_disposition_ref IS NULL)) OR ((state_version > 1) AND (predecessor_current_state_key IS NOT NULL) AND (advance_disposition_ref IS NOT NULL) AND (length(btrim(advance_disposition_ref)) > 0))));
alter table public."c3_current_state" add constraint "c3_current_state_key_nonblank" CHECK ((length(btrim(current_state_key)) > 0));
alter table public."c3_current_state" add constraint "c3_current_state_metadata_object" CHECK ((jsonb_typeof(metadata) = 'object'::text));
alter table public."c3_current_state" add constraint "c3_current_state_mutation_protocol_chk" CHECK ((mutation_protocol = ANY (ARRAY['legacy_pre_hardening'::text, 'registrar_v1'::text])));
alter table public."c3_current_state" add constraint "c3_current_state_pkey" PRIMARY KEY (current_state_key);
alter table public."c3_current_state" add constraint "c3_current_state_predecessor_not_self" CHECK (((predecessor_current_state_key IS NULL) OR (predecessor_current_state_key <> current_state_key)));
alter table public."c3_current_state" add constraint "c3_current_state_registrar_protocol_chk" CHECK (((mutation_protocol <> 'registrar_v1'::text) OR (registrar_role_key = 'c3_registrar_ci_v1'::text)));
alter table public."c3_current_state" add constraint "c3_current_state_standing_nonblank" CHECK ((length(btrim(standing)) > 0));
alter table public."c3_current_state" add constraint "c3_current_state_supersession_consistency" CHECK ((((is_current IS TRUE) AND (superseded_at IS NULL)) OR ((is_current IS FALSE) AND (superseded_at IS NOT NULL))));
alter table public."c3_current_state" add constraint "c3_current_state_version_positive" CHECK ((state_version >= 1));
alter table public."c3_env_initiative_visibility" add constraint "c3_env_initiative_visibility_pkey" PRIMARY KEY (visibility_key);
alter table public."c3_env_initiative_visibility" add constraint "c3_env_initiative_visibility_relationship_key_initiative_ke_key" UNIQUE (relationship_key, initiative_key);
alter table public."c3_env_initiative_visibility" add constraint "c3_env_initiative_visibility_source_check" CHECK ((visibility_source = ANY (ARRAY['encounter'::text, 'invite'::text])));
alter table public."c3_env_initiative_visibility" add constraint "c3_env_initiative_visibility_standing_check" CHECK ((standing = ANY (ARRAY['active'::text, 'revoked'::text])));
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_distinct_relations_check" CHECK ((source_relationship_key <> target_relationship_key));
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_pair_key_key" UNIQUE (pair_key);
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_pkey" PRIMARY KEY (connection_key);
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_standing_check" CHECK ((standing = ANY (ARRAY['active'::text, 'revoked'::text])));
alter table public."c3_env_runtime_session" add constraint "c3_env_runtime_session_pkey" PRIMARY KEY (session_key);
alter table public."c3_env_runtime_session" add constraint "c3_env_runtime_session_token_sha256_check" CHECK ((token_sha256 ~ '^[a-f0-9]{64}$'::text));
alter table public."c3_env_runtime_session" add constraint "c3_env_runtime_session_token_sha256_key" UNIQUE (token_sha256);
alter table public."c3_envpac_access_grant" add constraint "c3_envpac_access_grant_pkey" PRIMARY KEY (grant_key);
alter table public."c3_envpac_access_grant" add constraint "c3_envpac_access_grant_relation_role_check" CHECK ((relation_role = ANY (ARRAY['owner'::text, 'custodian'::text, 'delegate'::text, 'consumer'::text])));
alter table public."c3_envpac_access_grant" add constraint "c3_envpac_access_grant_subject_type_check" CHECK ((subject_type = ANY (ARRAY['individual'::text, 'entity'::text, 'system'::text, 'environment'::text, 'service'::text])));
alter table public."c3_envpac_canopy_event" add constraint "c3_envpac_canopy_event_pkey" PRIMARY KEY (event_key);
alter table public."c3_envpac_canopy_event" add constraint "c3_envpac_canopy_event_type_check" CHECK ((event_type = ANY (ARRAY['reference_added'::text, 'reference_edited'::text, 'reference_removed'::text, 'open_requested'::text, 'c3_link_copied'::text, 'connection_invite_prepared'::text])));
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_display_label_check" CHECK (((display_label IS NULL) OR (char_length(display_label) <= 120)));
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_handle_check" CHECK (((handle IS NULL) OR (char_length(handle) <= 160)));
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_pkey" PRIMARY KEY (reference_key);
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_sort_check" CHECK (((sort_order >= 0) AND (sort_order <= 9999)));
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_state_check" CHECK ((reference_state = ANY (ARRAY['active'::text, 'removed'::text])));
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_surface_label_check" CHECK (((char_length(TRIM(BOTH FROM surface_label)) >= 1) AND (char_length(TRIM(BOTH FROM surface_label)) <= 80)));
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_url_check" CHECK ((((char_length(external_url) >= 1) AND (char_length(external_url) <= 2048)) AND (external_url ~* '^(https?://|mailto:)'::text)));
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_class_check" CHECK ((length(btrim(primitive_class)) > 0));
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_envpac_key_primitive_key_key" UNIQUE (envpac_key, primitive_key);
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_key_check" CHECK ((length(btrim(primitive_key)) > 0));
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_label_check" CHECK ((length(btrim(display_label)) > 0));
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_pkey" PRIMARY KEY (binding_key);
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_renderer_check" CHECK ((length(btrim(renderer_key)) > 0));
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_sort_check" CHECK (((sort_order >= 0) AND (sort_order <= 9999)));
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_standing_check" CHECK ((standing = ANY (ARRAY['active'::text, 'held'::text, 'retired'::text])));
alter table public."c3_profile_pac" add constraint "c3_profile_pac_display_label_check" CHECK ((length(btrim(display_label)) > 0));
alter table public."c3_profile_pac" add constraint "c3_profile_pac_pkey" PRIMARY KEY (pac_key);
alter table public."c3_profile_pac" add constraint "c3_profile_pac_profile_class_check" CHECK ((profile_class = ANY (ARRAY['individual'::text, 'organization'::text, 'initiative'::text, 'project'::text, 'place'::text])));
alter table public."c3_profile_pac" add constraint "c3_profile_pac_subject_key_check" CHECK ((length(btrim(subject_key)) > 0));
alter table public."c3_profile_pac" add constraint "c3_profile_pac_subject_type_check" CHECK ((length(btrim(subject_type)) > 0));
alter table public."c3_profile_pac" add constraint "c3_profile_pac_visibility_scope_check" CHECK ((visibility_scope = ANY (ARRAY['private'::text, 'environment'::text, 'relational'::text, 'public'::text])));
alter table public."crs_relationship" add constraint "crs_relationship_pkey" PRIMARY KEY (relationship_key);
alter table public."c3_pac_member" add constraint "c3_pac_member_custody_shape_check" CHECK ((((custody_identifier IS NULL) AND (custody_location IS NULL)) OR (custody_provider IS NOT NULL)));
alter table public."c3_pac_member" add constraint "c3_pac_member_integrity_pair_check" CHECK ((((integrity_algorithm IS NULL) AND (integrity_value IS NULL)) OR ((integrity_algorithm IS NOT NULL) AND (integrity_value IS NOT NULL))));
alter table public."c3_pac_member" add constraint "c3_pac_member_member_kind_check" CHECK ((member_kind = ANY (ARRAY['asset'::text, 'record'::text, 'content'::text, 'media'::text, 'derivative'::text, 'route'::text, 'relation'::text, 'destination'::text, 'evidence'::text, 'pac'::text])));
alter table public."c3_pac_member" add constraint "c3_pac_member_ordinal_check" CHECK (((ordinal IS NULL) OR (ordinal > 0)));
alter table public."c3_pac_member" add constraint "c3_pac_member_pkey" PRIMARY KEY (member_key);
alter table public."c1_environment_connection_thread" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c1_environment_connection_thread" to service_role;
alter table public."c1_environment_connection_thread_entry" add constraint "c1_environment_connection_thread_entry_thread_key_fkey" FOREIGN KEY (thread_key) REFERENCES c1_environment_connection_thread(thread_key) ON DELETE CASCADE;
alter table public."c1_environment_connection_thread_entry" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c1_environment_connection_thread_entry" to service_role;
alter table public."c3_cancom_device_key" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_cancom_device_key" to service_role;
alter table public."c3_current_evidence_ref" add constraint "c3_current_evidence_ref_current_state_key_fkey" FOREIGN KEY (current_state_key) REFERENCES c3_current_state(current_state_key) ON DELETE RESTRICT;
alter table public."c3_current_evidence_ref" enable row level security;
grant INSERT,SELECT on public."c3_current_evidence_ref" to service_role;
alter table public."c3_current_state" add constraint "c3_current_state_predecessor_current_state_key_fkey" FOREIGN KEY (predecessor_current_state_key) REFERENCES c3_current_state(current_state_key) ON DELETE RESTRICT;
alter table public."c3_current_state" enable row level security;
grant SELECT on public."c3_current_state" to service_role;
alter table public."c3_env_initiative_visibility" add constraint "c3_env_initiative_visibility_env_key_fkey" FOREIGN KEY (env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE;
alter table public."c3_env_initiative_visibility" add constraint "c3_env_initiative_visibility_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE;
alter table public."c3_env_initiative_visibility" add constraint "c3_env_initiative_visibility_initiative_envpac_key_fkey" FOREIGN KEY (initiative_envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE;
alter table public."c3_env_initiative_visibility" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_env_initiative_visibility" to service_role;
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_source_env_key_fkey" FOREIGN KEY (source_env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE;
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_source_envpac_key_fkey" FOREIGN KEY (source_envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE;
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_target_env_key_fkey" FOREIGN KEY (target_env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE;
alter table public."c3_env_native_connection" add constraint "c3_env_native_connection_target_envpac_key_fkey" FOREIGN KEY (target_envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE;
alter table public."c3_env_native_connection" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_env_native_connection" to service_role;
alter table public."c3_env_runtime_session" add constraint "c3_env_runtime_session_env_key_fkey" FOREIGN KEY (env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public."c3_env_runtime_session" add constraint "c3_env_runtime_session_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public."c3_env_runtime_session" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_env_runtime_session" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_env_runtime_session" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_env_runtime_session" to service_role;
alter table public."c3_envpac_access_grant" add constraint "c3_envpac_access_grant_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public."c3_envpac_access_grant" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_access_grant" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_access_grant" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_access_grant" to service_role;
alter table public."c3_envpac_canopy_event" add constraint "c3_envpac_canopy_event_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key);
alter table public."c3_envpac_canopy_event" add constraint "c3_envpac_canopy_event_reference_key_fkey" FOREIGN KEY (reference_key) REFERENCES c3_envpac_canopy_reference(reference_key);
alter table public."c3_envpac_canopy_event" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_canopy_event" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_canopy_event" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_canopy_event" to service_role;
alter table public."c3_envpac_canopy_reference" add constraint "c3_envpac_canopy_reference_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key);
alter table public."c3_envpac_canopy_reference" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_canopy_reference" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_canopy_reference" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_canopy_reference" to service_role;
alter table public."c3_envpac_runtime_primitive" add constraint "c3_envpac_runtime_primitive_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public."c3_envpac_runtime_primitive" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_envpac_runtime_primitive" to service_role;
alter table public."c3_pac" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_pac" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_pac" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_pac" to service_role;
alter table public."c3_profile_pac" add constraint "c3_profile_pac_pac_key_fkey" FOREIGN KEY (pac_key) REFERENCES c3_pac(pac_key) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public."c3_profile_pac" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_profile_pac" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_profile_pac" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_profile_pac" to service_role;
alter table public."crs_relationship" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."crs_relationship" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."crs_relationship" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."crs_relationship" to service_role;
alter table public."c3_pac_member" add constraint "c3_pac_member_pac_key_fkey" FOREIGN KEY (pac_key) REFERENCES c3_pac(pac_key) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public."c3_pac_member" enable row level security;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_pac_member" to anon;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_pac_member" to authenticated;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public."c3_pac_member" to service_role;
CREATE INDEX c1_environment_connection_thread_entry_thread_idx ON public.c1_environment_connection_thread_entry USING btree (thread_key, created_at DESC);
CREATE INDEX c3_cancom_device_key_relationship_idx ON public.c3_cancom_device_key USING btree (relationship_key, standing, last_seen_at DESC);
CREATE INDEX c3_current_evidence_asset_idx ON public.c3_current_evidence_ref USING btree (asset_key) WHERE (asset_key IS NOT NULL);
CREATE INDEX c3_current_evidence_state_idx ON public.c3_current_evidence_ref USING btree (current_state_key);
CREATE INDEX c3_current_state_env_history_idx ON public.c3_current_state USING btree (env_key, state_version DESC);
CREATE UNIQUE INDEX c3_current_state_one_current_per_env ON public.c3_current_state USING btree (env_key) WHERE (is_current IS TRUE);
CREATE INDEX c3_current_state_predecessor_idx ON public.c3_current_state USING btree (predecessor_current_state_key) WHERE (predecessor_current_state_key IS NOT NULL);
CREATE INDEX c3_env_native_connection_source_idx ON public.c3_env_native_connection USING btree (source_relationship_key, standing, formed_at DESC);
CREATE INDEX c3_env_native_connection_target_idx ON public.c3_env_native_connection USING btree (target_relationship_key, standing, formed_at DESC);
CREATE INDEX c3_env_runtime_session_envpac_idx ON public.c3_env_runtime_session USING btree (envpac_key);
CREATE INDEX c3_env_runtime_session_subject_idx ON public.c3_env_runtime_session USING btree (subject_key);
CREATE INDEX c3_envpac_access_subject_idx ON public.c3_envpac_access_grant USING btree (subject_type, subject_key, standing);
CREATE INDEX c3_envpac_canopy_event_envpac_idx ON public.c3_envpac_canopy_event USING btree (envpac_key, created_at DESC);
CREATE UNIQUE INDEX c3_envpac_canopy_reference_active_url_uq ON public.c3_envpac_canopy_reference USING btree (envpac_key, lower(external_url)) WHERE (reference_state = 'active'::text);
CREATE INDEX c3_envpac_canopy_reference_owner_idx ON public.c3_envpac_canopy_reference USING btree (envpac_key, owner_subject_key, reference_state, sort_order, created_at);
CREATE INDEX c3_pac_contract_key_idx ON public.c3_pac USING btree (contract_key);
CREATE INDEX c3_pac_supersedes_pac_key_idx ON public.c3_pac USING btree (supersedes_pac_key);
CREATE INDEX c3_pac_member_pac_key_idx ON public.c3_pac_member USING btree (pac_key);
CREATE INDEX c3_pac_member_pac_role_idx ON public.c3_pac_member USING btree (pac_key, member_role);
CREATE INDEX c3_pac_member_source_object_idx ON public.c3_pac_member USING btree (source_object_key) WHERE (source_object_key IS NOT NULL);
CREATE INDEX c3_profile_pac_profile_key_idx ON public.c3_profile_pac USING btree (profile_key);
CREATE INDEX c3_profile_pac_subject_idx ON public.c3_profile_pac USING btree (subject_type, subject_key);
CREATE UNIQUE INDEX crs_relationship_primary_email_normalized_uidx ON public.crs_relationship USING btree (lower(btrim(primary_email)));
CREATE OR REPLACE FUNCTION public.c3_pac_public_payload_v1(p_pac_key text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'pac_key',p.pac_key,
    'version',p.version,
    'pac_type',p.pac_type,
    'custody_uri',p.custody_uri,
    'canonical_host',p.metadata->>'canonical_host',
    'source_authority',p.source_authority,
    'public_presentation',coalesce(p.metadata->'public_presentation','{}'::jsonb),
    'proposal_projection',coalesce(p.metadata->'proposal_projection','{}'::jsonb),
    'approved_public_asset_keys',coalesce(p.metadata->'approved_public_asset_keys','[]'::jsonb),
    'prohibited_public_objects',coalesce(p.metadata->'prohibited_public_objects','[]'::jsonb),
    'members',coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'member_key',m.member_key,
          'member_kind',m.member_kind,
          'member_role',m.member_role,
          'source_object_key',m.source_object_key,
          'custody_provider',m.custody_provider,
          'custody_identifier',m.custody_identifier,
          'custody_location',m.custody_location,
          'runtime_uri',m.runtime_uri,
          'runtime_binding_key',m.runtime_binding_key,
          'integrity_algorithm',m.integrity_algorithm,
          'integrity_value',m.integrity_value,
          'version',m.version,
          'standing',m.standing,
          'required',m.required,
          'release_scope',m.release_scope,
          'ordinal',m.ordinal,
          'metadata',m.metadata
        )
        order by coalesce(m.ordinal,2147483647),m.member_key
      )
      from public.c3_pac_member m
      where m.pac_key=p.pac_key
        and m.standing='active'
        and m.release_scope='registered'
    ),'[]'::jsonb)
  )
  from public.c3_pac p
  where p.pac_key=p_pac_key
    and p.pac_type='c3WebPac'
    and p.is_effective=true;
$function$
;
revoke all on function public.c3_pac_public_payload_v1(text) from public,anon,authenticated,service_role;
grant execute on function public.c3_pac_public_payload_v1(text) to anon;
grant execute on function public.c3_pac_public_payload_v1(text) to authenticated;
grant execute on function public.c3_pac_public_payload_v1(text) to service_role;
grant execute on function public.c3_pac_public_payload_v1(text) to public;
CREATE OR REPLACE FUNCTION public.c3_pac_review_payload_v1(p_pac_key text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select case
    when p.pac_type='c3WebPac' then public.c3_pac_public_payload_v1(p.pac_key)
    when p.pac_type='ProfilePAC' then jsonb_build_object(
      'pac_key',p.pac_key,
      'version',p.version,
      'pac_type',p.pac_type,
      'custody_uri',p.custody_uri,
      'profile',coalesce((
        select jsonb_build_object(
          'profile_key',pp.profile_key,
          'profile_class',pp.profile_class,
          'display_label',pp.display_label,
          'visibility_scope',pp.visibility_scope,
          'metadata',pp.metadata
        )
        from public.c3_profile_pac pp
        where pp.pac_key=p.pac_key
        limit 1
      ),'{}'::jsonb)
    )
    else jsonb_build_object(
      'pac_key',p.pac_key,
      'version',p.version,
      'pac_type',p.pac_type,
      'custody_uri',p.custody_uri,
      'source_authority',p.source_authority
    )
  end
  from public.c3_pac p
  where p.pac_key=p_pac_key
    and p.is_effective=true;
$function$
;
revoke all on function public.c3_pac_review_payload_v1(text) from public,anon,authenticated,service_role;
grant execute on function public.c3_pac_review_payload_v1(text) to service_role;
CREATE OR REPLACE FUNCTION public.c3_pac_review_sha256_v1(p_pac_key text)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'extensions'
AS $function$
  select encode(
    extensions.digest(
      convert_to(public.c3_pac_review_payload_v1(p_pac_key)::text,'UTF8'),
      'sha256'
    ),
    'hex'
  );
$function$
;
revoke all on function public.c3_pac_review_sha256_v1(text) from public,anon,authenticated,service_role;
grant execute on function public.c3_pac_review_sha256_v1(text) to service_role;
CREATE OR REPLACE FUNCTION public.c3_pac_review_candidate_v1(p_pac_key text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'pac_key',p_pac_key,
    'snapshot_hash',public.c3_pac_review_sha256_v1(p_pac_key),
    'payload',public.c3_pac_review_payload_v1(p_pac_key)
  );
$function$
;
revoke all on function public.c3_pac_review_candidate_v1(text) from public,anon,authenticated,service_role;
grant execute on function public.c3_pac_review_candidate_v1(text) to service_role;
CREATE OR REPLACE FUNCTION public.c3_pac_set_personal_review_v1(p_pac_key text, p_subject_key text, p_disposition text, p_candidate_hash text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_pac public.c3_pac%rowtype;
  v_now timestamptz:=now();
  v_current_hash text;
  v_approval_hash text;
begin
  if p_disposition not in ('REVIEWED','HLD') then
    return jsonb_build_object('standing','DNR','reason','unsupported_review_disposition');
  end if;

  select * into v_pac
  from public.c3_pac
  where pac_key=p_pac_key and is_effective=true
  for update;

  if not found then
    return jsonb_build_object('standing','DNR','reason','pac_unavailable');
  end if;

  if v_pac.custodian_subject_type is distinct from 'individual'
     or v_pac.custodian_subject_key is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{ownership_model,owner_subject_type}','')<>'individual'
     or v_pac.metadata#>>'{ownership_model,owner_subject_key}' is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{custody_model,custody_class}','')<>'personal_pac_custody' then
    return jsonb_build_object('standing','DNR','reason','personal_owner_custody_required');
  end if;

  v_current_hash:=public.c3_pac_review_sha256_v1(p_pac_key);
  v_approval_hash:=v_pac.metadata#>>'{custody_approval,approval_snapshot_hash}';

  if p_candidate_hash is null or p_candidate_hash is distinct from v_current_hash then
    return jsonb_build_object(
      'standing','DNR',
      'reason','review_candidate_changed',
      'current_snapshot_hash',v_current_hash
    );
  end if;

  update public.c3_pac
  set metadata=coalesce(metadata,'{}'::jsonb)
    || jsonb_build_object(
      'review_resolution',jsonb_build_object(
        'standing',p_disposition,
        'review_snapshot_hash',v_current_hash,
        'review_surface','my_pacs_preview',
        'reviewed_by',p_subject_key,
        'reviewed_at',v_now
      ),
      'distribution_resolution',case
        when p_disposition='HLD' then jsonb_build_object(
          'standing','HLD_REVIEW',
          'review_snapshot_hash',v_current_hash,
          'reason','owner_held_after_review'
        )
        when v_approval_hash is distinct from v_current_hash then jsonb_build_object(
          'standing','HLD_APPROVAL_REFRESH_REQUIRED',
          'review_snapshot_hash',v_current_hash,
          'reason','review_complete_exact_approval_required'
        )
        else jsonb_build_object(
          'standing','HLD_OWNER_DISTRIBUTION_DECISION_REQUIRED',
          'review_snapshot_hash',v_current_hash,
          'approval_snapshot_hash',v_approval_hash,
          'reason','review_and_approval_complete_distribution_not_authorized'
        )
      end
    ),
    updated_at=v_now
  where pac_key=p_pac_key;

  return jsonb_build_object(
    'standing',case when p_disposition='REVIEWED' then 'ACT' else 'HLD' end,
    'pac_key',p_pac_key,
    'review_standing',p_disposition,
    'review_snapshot_hash',v_current_hash,
    'reviewed_at',v_now
  );
end;
$function$
;
revoke all on function public.c3_pac_set_personal_review_v1(text,text,text,text) from public,anon,authenticated,service_role;
grant execute on function public.c3_pac_set_personal_review_v1(text,text,text,text) to service_role;
CREATE OR REPLACE FUNCTION public.c3_pac_set_personal_disposition_v1(p_pac_key text, p_subject_key text, p_disposition text, p_note text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_pac public.c3_pac%rowtype;
  v_now timestamptz:=now();
  v_state text;
  v_current_hash text;
  v_review_hash text;
  v_existing_projection jsonb;
begin
  if p_disposition not in ('APPROVED','HLD') then
    return jsonb_build_object('standing','DNR','reason','unsupported_personal_disposition');
  end if;

  select * into v_pac
  from public.c3_pac
  where pac_key=p_pac_key and is_effective=true
  for update;

  if not found then
    return jsonb_build_object('standing','DNR','reason','pac_unavailable');
  end if;

  if v_pac.custodian_subject_type is distinct from 'individual'
     or v_pac.custodian_subject_key is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{custody_model,custody_class}','')<>'personal_pac_custody'
     or coalesce(v_pac.metadata#>>'{ownership_model,owner_subject_type}','')<>'individual'
     or v_pac.metadata#>>'{ownership_model,owner_subject_key}' is distinct from p_subject_key then
    return jsonb_build_object('standing','DNR','reason','personal_owner_custody_required');
  end if;

  v_current_hash:=public.c3_pac_review_sha256_v1(p_pac_key);
  v_review_hash:=v_pac.metadata#>>'{review_resolution,review_snapshot_hash}';
  v_existing_projection:=coalesce(v_pac.metadata->'encounter_projection','{}'::jsonb);

  if p_disposition='APPROVED' and (
      coalesce(v_pac.metadata#>>'{review_resolution,standing}','')<>'REVIEWED'
      or v_review_hash is distinct from v_current_hash
  ) then
    return jsonb_build_object(
      'standing','DNR',
      'reason','current_review_required',
      'current_snapshot_hash',v_current_hash,
      'review_snapshot_hash',v_review_hash
    );
  end if;

  v_state:=case when p_disposition='APPROVED' then 'ACT' else 'HLD' end;

  update public.c3_pac
  set metadata=coalesce(metadata,'{}'::jsonb)
    || jsonb_build_object(
      'custody_approval',jsonb_build_object(
        'standing',p_disposition,
        'subject_key',p_subject_key,
        'context_class','personal_custody',
        'approval_surface','my_pacs',
        'approval_snapshot_hash',case when p_disposition='APPROVED' then v_current_hash else null end,
        'note',nullif(btrim(coalesce(p_note,'')),''),
        'resolved_at',v_now
      ),
      'encounter_projection',case
        when p_disposition='APPROVED'
             and coalesce(v_existing_projection->>'authorized_by_owner','false')='true'
          then v_existing_projection || jsonb_build_object(
            'authorization_snapshot_hash',v_current_hash,
            'reviewed_approval_bound_at',v_now
          )
        when p_disposition='APPROVED' then jsonb_build_object(
          'standing','PENDING',
          'encounter_key','c3envpac_c2me_v0_1',
          'owner_authorization_required',true,
          'authorized_by_owner',false,
          'projection_surface','c2ME_env',
          'reason','separate_owner_encounter_decision_required'
        )
        else jsonb_build_object(
          'standing','HLD',
          'encounter_key','c3envpac_c2me_v0_1',
          'owner_authorization_required',true,
          'authorized_by_owner',false,
          'projection_surface','c2ME_env',
          'reason','pac_not_approved_in_custody'
        )
      end,
      'distribution_resolution',case
        when p_disposition='APPROVED' then jsonb_build_object(
          'standing','HLD_OWNER_DISTRIBUTION_DECISION_REQUIRED',
          'review_snapshot_hash',v_current_hash,
          'approval_snapshot_hash',v_current_hash,
          'reason','approval_does_not_authorize_distribution'
        )
        else jsonb_build_object(
          'standing','HLD_PAC',
          'reason','pac_not_approved_in_custody'
        )
      end
    ),
    updated_at=v_now
  where pac_key=p_pac_key;

  return jsonb_build_object(
    'standing',v_state,
    'pac_key',p_pac_key,
    'disposition',p_disposition,
    'approval_surface','my_pacs',
    'approval_snapshot_hash',case when p_disposition='APPROVED' then v_current_hash else null end,
    'encounter_projection_standing',case
      when p_disposition='APPROVED' and coalesce(v_existing_projection->>'authorized_by_owner','false')='true'
        then coalesce(v_existing_projection->>'standing','AUTHORIZED')
      when p_disposition='APPROVED' then 'PENDING'
      else 'HLD'
    end,
    'encounter_authorization_preserved',
      p_disposition='APPROVED' and coalesce(v_existing_projection->>'authorized_by_owner','false')='true',
    'owner_encounter_decision_required',
      not (p_disposition='APPROVED' and coalesce(v_existing_projection->>'authorized_by_owner','false')='true'),
    'resolved_at',v_now
  );
end;
$function$
;
revoke all on function public.c3_pac_set_personal_disposition_v1(text,text,text,text) from public,anon,authenticated,service_role;
grant execute on function public.c3_pac_set_personal_disposition_v1(text,text,text,text) to service_role;
CREATE OR REPLACE FUNCTION public.c3_pac_set_personal_encounter_projection_v1(p_pac_key text, p_subject_key text, p_action text, p_encounter_key text DEFAULT 'c3envpac_c2me_v0_1'::text, p_surface_scope text DEFAULT 'c3field_only'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_pac public.c3_pac%rowtype;
  v_envpac public.c3_envpac%rowtype;
  v_now timestamptz:=now();
  v_authorized boolean;
  v_standing text;
  v_host text;
  v_url text;
  v_existing_reference uuid;
  v_current_hash text;
  v_review_hash text;
  v_approval_hash text;
begin
  if p_action not in ('AUTHORIZE','REVOKE') then
    return jsonb_build_object('standing','DNR','reason','unsupported_projection_action');
  end if;

  if p_surface_scope not in ('c3field_only','c3field_plus_canopy') then
    return jsonb_build_object('standing','DNR','reason','unsupported_surface_scope');
  end if;

  select * into v_pac
  from public.c3_pac
  where pac_key=p_pac_key and is_effective=true
  for update;

  if not found then
    return jsonb_build_object('standing','DNR','reason','pac_unavailable');
  end if;

  if v_pac.custodian_subject_type is distinct from 'individual'
     or v_pac.custodian_subject_key is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{ownership_model,owner_subject_type}','')<>'individual'
     or v_pac.metadata#>>'{ownership_model,owner_subject_key}' is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{custody_model,custody_class}','')<>'personal_pac_custody' then
    return jsonb_build_object('standing','DNR','reason','personal_owner_custody_required');
  end if;

  v_current_hash:=public.c3_pac_review_sha256_v1(p_pac_key);
  v_review_hash:=v_pac.metadata#>>'{review_resolution,review_snapshot_hash}';
  v_approval_hash:=v_pac.metadata#>>'{custody_approval,approval_snapshot_hash}';

  if p_action='AUTHORIZE' then
    if coalesce(v_pac.metadata#>>'{custody_approval,standing}','')<>'APPROVED' then
      return jsonb_build_object('standing','DNR','reason','custody_approval_required');
    end if;

    if coalesce(v_pac.metadata#>>'{review_resolution,standing}','')<>'REVIEWED'
       or v_review_hash is distinct from v_current_hash
       or v_approval_hash is distinct from v_current_hash then
      return jsonb_build_object(
        'standing','DNR',
        'reason','current_reviewed_approval_required',
        'current_snapshot_hash',v_current_hash,
        'review_snapshot_hash',v_review_hash,
        'approval_snapshot_hash',v_approval_hash
      );
    end if;
  end if;

  select * into v_envpac
  from public.c3_envpac
  where envpac_key=v_pac.envpac_key
    and owner_subject_type='individual'
    and owner_subject_key=p_subject_key
    and is_effective=true;

  if not found then
    return jsonb_build_object('standing','DNR','reason','owner_envpac_required');
  end if;

  v_authorized:=p_action='AUTHORIZE';
  v_standing:=case when v_authorized then 'AUTHORIZED' else 'REVOKED' end;

  update public.c3_pac
  set metadata=jsonb_set(
        coalesce(metadata,'{}'::jsonb),
        '{encounter_projection}',
        jsonb_build_object(
          'standing',v_standing,
          'encounter_key',p_encounter_key,
          'projection_surface','c2ME_env',
          'owner_authorization_required',true,
          'authorized_by_owner',v_authorized,
          'owner_subject_key',p_subject_key,
          'authorization_surface','my_pacs',
          'presentation_scope',case when v_authorized then p_surface_scope else 'none' end,
          'surface_projections',case
            when not v_authorized then '[]'::jsonb
            when p_surface_scope='c3field_plus_canopy'
              then jsonb_build_array('c3field','canopy')
            else jsonb_build_array('c3field')
          end,
          'authorization_snapshot_hash',case when v_authorized then v_current_hash else null end,
          'resolved_at',v_now
        ),
        true
      ),
      updated_at=v_now
  where pac_key=p_pac_key;

  v_host:=nullif(v_pac.metadata->>'canonical_host','');
  if v_host is null then
    v_host:=nullif(v_pac.metadata#>>'{public_presentation,canonical_host}','');
  end if;
  if v_host is not null then v_url:='https://'||v_host||'/'; end if;

  select reference_key into v_existing_reference
  from public.c3_envpac_canopy_reference
  where envpac_key=v_pac.envpac_key
    and owner_subject_key=p_subject_key
    and metadata->>'source_pac_key'=p_pac_key
  order by created_at desc
  limit 1;

  if v_authorized and p_surface_scope='c3field_plus_canopy' and v_url is not null then
    if v_existing_reference is null then
      insert into public.c3_envpac_canopy_reference(
        reference_key,envpac_key,owner_subject_key,surface_label,display_label,
        external_url,handle,sort_order,reference_state,metadata,created_at,updated_at
      ) values (
        gen_random_uuid(),v_pac.envpac_key,p_subject_key,'c3 Field',
        coalesce(v_pac.metadata#>>'{public_presentation,title}',p_pac_key),
        v_url,
        coalesce(v_pac.metadata#>>'{public_presentation,title}',p_pac_key),
        10,'active',
        jsonb_build_object(
          'source_process','personal_pac_encounter_projection_v1',
          'selection_class','canopy_reference',
          'source_pac_key',p_pac_key,
          'encounter_key',p_encounter_key,
          'projection_class','owner_selected_encounter_surface',
          'projection_snapshot_hash',v_current_hash,
          'custody_transfer',false,
          'owner_surface_scope','c3field_plus_canopy'
        ),
        v_now,v_now
      );
    else
      update public.c3_envpac_canopy_reference
      set reference_state='active',
          removed_at=null,
          external_url=v_url,
          metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
            'projection_class','owner_selected_encounter_surface',
            'projection_snapshot_hash',v_current_hash,
            'owner_surface_scope','c3field_plus_canopy',
            'custody_transfer',false
          ),
          updated_at=v_now
      where reference_key=v_existing_reference;
    end if;
  elsif v_existing_reference is not null then
    update public.c3_envpac_canopy_reference
    set reference_state='removed',
        removed_at=v_now,
        metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
          'removed_by_owner_surface_scope',true,
          'owner_surface_scope',case when v_authorized then 'c3field_only' else 'none' end
        ),
        updated_at=v_now
    where reference_key=v_existing_reference
      and reference_state<>'removed';
  end if;

  return jsonb_build_object(
    'standing',case when v_authorized then 'ACT' else 'HLD' end,
    'pac_key',p_pac_key,
    'encounter_projection_standing',v_standing,
    'encounter_key',p_encounter_key,
    'authorized_by_owner',v_authorized,
    'presentation_scope',case when v_authorized then p_surface_scope else 'none' end,
    'surface_projections',case
      when not v_authorized then '[]'::jsonb
      when p_surface_scope='c3field_plus_canopy' then jsonb_build_array('c3field','canopy')
      else jsonb_build_array('c3field')
    end,
    'authorization_snapshot_hash',case when v_authorized then v_current_hash else null end,
    'resolved_at',v_now
  );
end;
$function$
;
revoke all on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text) from public,anon,authenticated,service_role;
grant execute on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text) to service_role;
CREATE OR REPLACE FUNCTION public.resolve_c1me_current_internal(p_relationship_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  r public.crs_relationship%rowtype;
  v_envpac_count integer;
  v_envpac text;
  v_env text;
  v_grant_count integer;
  v_current_count integer;
  v_current text;
  v_evidence_count integer;
begin
  if p_relationship_key is null or btrim(p_relationship_key)='' then
    return jsonb_build_object('resolution','auth_required','reason_code','missing_verified_subject');
  end if;

  select * into r from public.crs_relationship
  where relationship_key=p_relationship_key
    and is_active=true
    and coalesce(is_test_relationship,false)=false;

  if not found or r.relationship_standing<>'c1_C1_persisted' then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','c1_not_persisted',
      'may_create_personal_environment',false);
  end if;

  select count(*),min(envpac_key),min(env_key)
    into v_envpac_count,v_envpac,v_env
  from public.c3_envpac
  where owner_subject_type='individual'
    and owner_subject_key=p_relationship_key
    and is_effective=true
    and standing='effective';

  if v_envpac_count<>1 then
    return jsonb_build_object('resolution','reconciliation_hold',
      'reason_code',case when v_envpac_count=0 then 'canonical_env_missing' else 'canonical_env_ambiguous' end,
      'may_create_personal_environment',false);
  end if;

  select count(*) into v_grant_count
  from public.c3_envpac_access_grant
  where envpac_key=v_envpac
    and subject_type='individual'
    and subject_key=p_relationship_key
    and relation_role='owner'
    and standing='active'
    and revoked_at is null
    and (expires_at is null or expires_at>now());

  if v_grant_count<>1 then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','owner_grant_missing_or_ambiguous',
      'may_create_personal_environment',false);
  end if;

  select count(*),min(current_state_key)
    into v_current_count,v_current
  from public.c3_current_state
  where env_key=v_env and is_current=true and effective_at<=now() and superseded_at is null;

  if v_current_count<>1 then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','personal_current_missing_or_ambiguous',
      'may_create_personal_environment',false);
  end if;

  select count(*) into v_evidence_count
  from public.c3_current_evidence_ref
  where current_state_key=v_current
    and evidence_standing in ('effective','attested','accepted','registered');

  if v_evidence_count<1 then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','current_evidence_missing',
      'may_create_personal_environment',false);
  end if;

  return jsonb_build_object(
    'resolution','existing_c1',
    'next_encounter','enter_existing_environment',
    'relationship_ref',p_relationship_key,
    'envpac_ref',v_envpac,
    'env_key',v_env,
    'current_ref',v_current,
    'may_create_personal_environment',false,
    'reason_code','resolved_from_registered_current'
  );
end;
$function$
;
revoke all on function public.resolve_c1me_current_internal(text) from public,anon,authenticated,service_role;
grant execute on function public.resolve_c1me_current_internal(text) to service_role;
CREATE OR REPLACE FUNCTION public.resolve_c1me_envpac_primitives_internal(p_relationship_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_current jsonb;
  v_envpac_key text;
  v_declared_contract text;
  v_declared_count integer;
  v_component_count integer;
  v_component_keys text[];
  v_components jsonb;
  v_contextual jsonb;
begin
  v_current := public.resolve_c1me_current_internal(p_relationship_key);

  if coalesce(v_current->>'resolution','') <> 'existing_c1' then
    return v_current || jsonb_build_object(
      'component_resolution','held',
      'runtime_component_contract','c1me_env_runtime_components_v6',
      'runtime_component_count',5,
      'relational_condition_contract','c3_six_relational_conditions_v1',
      'relational_condition_count',6,
      'contextual_component_count',0,
      'components','[]'::jsonb,
      'contextual_components','[]'::jsonb,
      'primitive_resolution','held',
      'primitive_contract','c1me_env_primitives_v5',
      'primitive_count',5,
      'primitives','[]'::jsonb,
      'primitive_compatibility_deprecated',true
    );
  end if;

  v_envpac_key := v_current->>'envpac_ref';

  select
    metadata->>'runtime_component_contract',
    nullif(metadata->>'runtime_component_count','')::integer
  into v_declared_contract,v_declared_count
  from public.c3_envpac
  where envpac_key=v_envpac_key
    and is_effective=true
    and standing='effective';

  select
    count(*) filter (
      where coalesce(config->>'universal_runtime_component','false')='true'
    ),
    array_agg(primitive_key order by primitive_key)
      filter (
        where coalesce(config->>'universal_runtime_component','false')='true'
      )
  into v_component_count,v_component_keys
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active';

  if v_declared_contract is distinct from 'c1me_env_runtime_components_v6'
     or v_declared_count is distinct from 5
     or v_component_count is distinct from 5
     or v_component_keys is distinct from
        array['canopy','current','invite_connection','my_pacs','native_connections']::text[] then
    return v_current || jsonb_build_object(
      'component_resolution','held',
      'reason_code','universal_runtime_component_contract_drift',
      'runtime_component_contract','c1me_env_runtime_components_v6',
      'declared_component_contract',v_declared_contract,
      'declared_component_count',v_declared_count,
      'resolved_universal_component_count',coalesce(v_component_count,0),
      'resolved_universal_component_keys',to_jsonb(coalesce(v_component_keys,array[]::text[])),
      'expected_universal_component_keys',jsonb_build_array(
        'canopy','current','invite_connection','my_pacs','native_connections'
      ),
      'relational_condition_contract','c3_six_relational_conditions_v1',
      'components','[]'::jsonb,
      'contextual_components','[]'::jsonb,
      'primitive_resolution','held',
      'primitive_contract','c1me_env_primitives_v5',
      'primitives','[]'::jsonb,
      'primitive_compatibility_deprecated',true,
      'frontend_invention_allowed',false
    );
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'component_key',primitive_key,
        'component_class',primitive_class,
        'display_label',display_label,
        'renderer_key',renderer_key,
        'runtime_endpoint',runtime_endpoint,
        'sort_order',sort_order,
        'config',config,
        'primitive_key',primitive_key,
        'primitive_class',primitive_class
      ) order by sort_order,primitive_key
    ),
    '[]'::jsonb
  )
  into v_components
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active'
    and coalesce(config->>'universal_runtime_component','false')='true';

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'component_key',primitive_key,
        'component_class',primitive_class,
        'display_label',display_label,
        'renderer_key',renderer_key,
        'runtime_endpoint',runtime_endpoint,
        'sort_order',sort_order,
        'config',config,
        'primitive_key',primitive_key,
        'primitive_class',primitive_class
      ) order by sort_order,primitive_key
    ),
    '[]'::jsonb
  )
  into v_contextual
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active'
    and coalesce(config->>'universal_runtime_component','false')<>'true';

  return v_current || jsonb_build_object(
    'component_resolution','envpac_resolved',
    'runtime_component_contract','c1me_env_runtime_components_v6',
    'runtime_component_count',jsonb_array_length(v_components),
    'components',v_components,
    'contextual_component_count',jsonb_array_length(v_contextual),
    'contextual_components',v_contextual,
    'contextual_component_rule','active_nonuniversal_runtime_component_rows',
    'relational_condition_contract','c3_six_relational_conditions_v1',
    'relational_condition_count',6,
    'relational_condition_keys',jsonb_build_array(
      'identity','ownership','custody','verification','relationship','persistence'
    ),
    'free_resolution_source','envpac',
    'initiative_projection_rule','encountered_or_invited_initiative_envpac_only',
    'frontend_invention_allowed',false,

    -- Backward-compatible aliases only. Do not treat as semantic authority.
    'primitive_resolution','envpac_resolved',
    'primitive_contract','c1me_env_primitives_v5',
    'primitive_count',jsonb_array_length(v_components),
    'primitives',v_components,
    'primitive_compatibility_deprecated',true
  );
end
$function$
;
revoke all on function public.resolve_c1me_envpac_primitives_internal(text) from public,anon,authenticated,service_role;
grant execute on function public.resolve_c1me_envpac_primitives_internal(text) to service_role;
CREATE OR REPLACE FUNCTION public.resolve_cancom_connection_devices_internal(p_connection_key text, p_requester_relationship_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare
  v_connection public.c3_env_native_connection%rowtype;
  v_devices jsonb;
begin
  select * into v_connection
  from public.c3_env_native_connection
  where connection_key=p_connection_key
    and standing='active'
    and revoked_at is null;

  if not found then
    return jsonb_build_object('standing','HLD','reason','connection_unavailable','devices','[]'::jsonb);
  end if;

  if p_requester_relationship_key not in (
    v_connection.source_relationship_key,
    v_connection.target_relationship_key
  ) then
    return jsonb_build_object('standing','HLD','reason','connection_message_not_authorized','devices','[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'device_key',d.device_key,
      'relationship_key',d.relationship_key,
      'encryption_public_key',d.encryption_public_key,
      'signing_public_key',d.signing_public_key,
      'key_fingerprint',d.key_fingerprint,
      'participant_role',case when d.relationship_key=p_requester_relationship_key then 'requester' else 'peer' end,
      'created_at',d.created_at
    )
    order by d.relationship_key,d.created_at,d.device_key
  ),'[]'::jsonb)
  into v_devices
  from public.c3_cancom_device_key d
  where d.standing='active'
    and d.revoked_at is null
    and d.relationship_key in (
      v_connection.source_relationship_key,
      v_connection.target_relationship_key
    );

  return jsonb_build_object(
    'standing','resolved',
    'connection_key',p_connection_key,
    'devices',v_devices
  );
end
$function$
;
revoke all on function public.resolve_cancom_connection_devices_internal(text,text) from public,anon,authenticated,service_role;
grant execute on function public.resolve_cancom_connection_devices_internal(text,text) to service_role;