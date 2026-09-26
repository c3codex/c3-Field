begin;

update public.c3_oar_process_instance
set evidence_path='docs/oar/c3_field/evidence_soft_launch_hardening_optics_sweep_v1.meta.md',
    execution_result='First hardening pass applied and read back. H05, H07 and H08 are evidenced ACT; H01-H04 and H06 remain held.',
    updated_at=now()
where process_instance_key='c3field_soft_launch_hardening_optics_v1';

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_first_readback',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','validation',now(),
  'docs/oar/c3_field/evidence_soft_launch_hardening_optics_sweep_v1.meta.md',
  'First-pass Registry readback confirmed H05, H07 and H08. H01-H04 and H06 remain unresolved and visible.'
)
on conflict (transition_event_key) do nothing;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
      'first_pass_evidence_path','docs/oar/c3_field/evidence_soft_launch_hardening_optics_sweep_v1.meta.md',
      'first_pass_readback','H05_H07_H08_ACT_H01_H02_H03_H04_H06_HLD',
      'optics_public_read_policy_proven',true
    ),
    updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

commit;
