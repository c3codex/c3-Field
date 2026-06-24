---
document_type: bucket_path_policy
authority_level: operator_approved
system_scope: measures_codex
title: Measures Registry SEAT Bucket Path Policy by Package Folder Class v1
status: operator_approved_policy
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_apply_operator_dispositions_to_measures_registry_payload_expansion_blockers_v1.meta.md
---

# Measures Registry SEAT Bucket Path Policy by Package Folder Class v1

standing:
  status: operator_approved_policy
  operator_disposition: assign_by_package_folder_class
  env_key_required: true
  manifest_build_authorized: false
  bucket_upload_authorized: false

bucket_paths:
  00_index: seat/current/00_index/
  01_records: seat/current/01_records/
  02_encounters: seat/current/02_encounters/
  03_chamber_directories: seat/current/03_chamber_directories/
  04_integrations: seat/current/04_integrations/
  05_automation: seat/current/05_automation/
  06_runtime_surfaces: seat/current/06_runtime_surfaces/
  07_media_assets: seat/current/07_media_assets/
  08_mrm_contact_memory: seat/current/08_mrm_contact_memory/
  11_style_profiles: seat/current/11_style_profiles/
  12_directory_set_components: seat/current/12_directory_set_components/
