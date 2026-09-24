-- Bind PAC v1 type contracts to the admitted operative PAC semantic source.

update public.c3_pac_type_contract
set source_authority='pac_base_contract_v1',
    architecture_source_key='pac_base_contract_v1'
where contract_key in (
  'pac_contract_envpac_v1',
  'pac_contract_c3webpac_v1',
  'pac_contract_pubpac_v1',
  'pac_contract_campaignpac_v1',
  'pac_contract_profilepac_v1'
);
