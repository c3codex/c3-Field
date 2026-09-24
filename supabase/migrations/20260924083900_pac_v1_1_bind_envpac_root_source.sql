-- PAC v1.1 source/resolver correction
update public.c3_pac_type_contract
set source_authority='pac_base_contract_v1_1',
    architecture_source_key='pac_base_contract_v1_1'
where contract_key in (
  'pac_contract_envpac_v1',
  'pac_contract_c3webpac_v1',
  'pac_contract_pubpac_v1',
  'pac_contract_campaignpac_v1',
  'pac_contract_profilepac_v1'
);

update public.c3_pac_type_contract
set resolver_policy='{"resolver":"Registry","runtime_projection":"FREE","root_projection":true,"fail_closed":true}'::jsonb
where contract_key='pac_contract_envpac_v1';

update public.c3_pac_type_contract
set resolver_policy='{"resolver":"EnvPAC_FREE","surface":"OYE/My Environment","child_of":"EnvPAC","direct_frontend_root":false,"fail_closed":true}'::jsonb
where contract_key='pac_contract_profilepac_v1';
