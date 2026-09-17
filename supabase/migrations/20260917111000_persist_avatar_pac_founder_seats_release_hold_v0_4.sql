begin;

insert into public.system_process_registry (
  process_key,process_family,title,status,source_path,authority_state,metadata,process_title,process_scope,process_status,authority_level,source_reference_set,required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'avatar_pac_founder_seats_v0_4','c3_field','avatar_pac Founder Seats v0.4','held','governance/avatar_pac_v0_4_founder_seats_release_hold.meta.md','elevated_release_held',
  jsonb_build_object('operator','op044','package_key','avatar_pac_v0_4','founder_seats',jsonb_build_array('Primus Artus','Gemynd Corpus','Percipari'),'founder_seats_required_before_later_seat_creation',true,'provenance_stack',jsonb_build_array('Measures of Inanna Epithet','Oracle artwork','corresponding Knew Album song','c3 Field avatar interpretation','avatar_pac source custody','later DRIV when separately authorized'),'material_rule',jsonb_build_object('c1ME','obsidian','c2ME','obsidian+lapis','c3ME','obsidian+lapis+marble','branch_creator','crystal_only'),'crystal_inanna_star',jsonb_build_object('classification','origin_branch_creator_artifact','reserved_to','op044','release','held'),'public_release','held','runtime_release','held','drivs_created',false,'release_requires_separate_governed_authorization',true),
  'avatar_pac Founder Seats v0.4','Founder Seat sequencing, provenance lineage, Crystal Inanna Star designation, and release hold','blocked','elevated_governance_rule',jsonb_build_array('avatar_pac_v0_3','governance:avatar_pac_v0_4_founder_seats_release_hold'),'oar2',false,false,false,now(),now()
)
on conflict (process_key) do nothing;

insert into public.measures_persistence_state (
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'avatar_pac_v0_4:founder_seats_release_hold','avatar_pac_founder_seats_v0_4','elevate_avatar_pac_founder_seats_release_hold_op044_001','measures_registry','avatar_pac_v0_4_founder_seats_release_hold','avatar_pac_founder_seat_rule',
  jsonb_build_object('package_key','avatar_pac_v0_4','founder_seats',jsonb_build_array(jsonb_build_object('seat',1,'epithet','Primus Artus'),jsonb_build_object('seat',2,'epithet','Gemynd Corpus'),jsonb_build_object('seat',3,'epithet','Percipari')),'all_three_must_be_occupied_before_later_seat_creation',true,'later_seat_creation_authorized',false,'public_release_authorized',false,'runtime_release_authorized',false,'driv_generation_authorized',false,'free_rendering_authorized',false,'registry_profile_projection_authorized',false,'crystal_inanna_star',jsonb_build_object('reserved_to_originating_creator','op044','classification','origin_branch_creator_artifact','runtime_authority_created',false)),
  jsonb_build_object('operator_instruction','capture add to avatar_pac elevate persist and hold any release','governance_path','github-private://c3codex/measures-of-inanna-governance/main/governance/avatar_pac_v0_4_founder_seats_release_hold.meta.md','governance_commit','82e7e7e308e1821619198c0ff700454e52141775'),
  jsonb_build_object('package_custody','avatar_pac','source_asset_custody','avatar_pac exact source PNG custody','oracle_artwork_custody','source provenance retained separately','knew_album_song_custody','source provenance retained separately','registry_custody_transfer',false,'free_custody_transfer',false,'public_release',false),
  jsonb_build_object('append_preserving',true,'prior_package','avatar_pac_v0_3','source_png_count',12,'source_assets_modified',false,'drivs_created',false,'provenance_stack',jsonb_build_array('Epithet identity','Oracle artwork','Knew Album song','avatar form','material expression','avatar_pac source asset','future DRIV')),
  'elevated_founder_seat_rule_release_held','separate_explicit_governed_release_authorization','registrar',now(),now()
)
on conflict (persistence_key) do nothing;

commit;
