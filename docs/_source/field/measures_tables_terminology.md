| table_name               | column_name                   | data_type                | is_nullable |
| ------------------------ | ----------------------------- | ------------------------ | ----------- |
| measures_encounter_def   | id                            | uuid                     | NO          |
| measures_encounter_def   | registry_id                   | uuid                     | NO          |
| measures_encounter_def   | encounter_key                 | text                     | NO          |
| measures_encounter_def   | display_title                 | text                     | NO          |
| measures_encounter_def   | encounter_type                | text                     | NO          |
| measures_encounter_def   | material_family               | text                     | YES         |
| measures_encounter_def   | surface_type                  | text                     | YES         |
| measures_encounter_def   | sequence_order                | integer                  | YES         |
| measures_encounter_def   | pause_allowed                 | boolean                  | NO          |
| measures_encounter_def   | is_entry_surface              | boolean                  | NO          |
| measures_encounter_def   | is_active                     | boolean                  | NO          |
| measures_encounter_def   | metadata                      | jsonb                    | NO          |
| measures_encounter_def   | created_at                    | timestamp with time zone | NO          |
| measures_encounter_def   | updated_at                    | timestamp with time zone | NO          |
| measures_phase_calendar  | id                            | bigint                   | NO          |
| measures_phase_calendar  | phase_key                     | text                     | NO          |
| measures_phase_calendar  | phase_family                  | text                     | NO          |
| measures_phase_calendar  | anchor_name                   | text                     | NO          |
| measures_phase_calendar  | anchor_date                   | date                     | NO          |
| measures_phase_calendar  | sequence_order                | integer                  | NO          |
| measures_phase_calendar  | standing_type                 | text                     | NO          |
| measures_phase_calendar  | notes                         | text                     | YES         |
| measures_phase_calendar  | is_active                     | boolean                  | NO          |
| measures_phase_calendar  | created_at                    | timestamp with time zone | NO          |
| measures_registry        | id                            | uuid                     | NO          |
| measures_registry        | registry_key                  | text                     | NO          |
| measures_registry        | display_title                 | text                     | NO          |
| measures_registry        | registry_family               | text                     | NO          |
| measures_registry        | encounter_type                | text                     | YES         |
| measures_registry        | material_family               | text                     | YES         |
| measures_registry        | sequence_order                | integer                  | YES         |
| measures_registry        | release_state                 | text                     | NO          |
| measures_registry        | access_state                  | text                     | NO          |
| measures_registry        | parent_registry_id            | uuid                     | YES         |
| measures_registry        | depends_on_registry_id        | uuid                     | YES         |
| measures_registry        | envelope_id                   | uuid                     | YES         |
| measures_registry        | phase_label                   | text                     | YES         |
| measures_registry        | is_active                     | boolean                  | NO          |
| measures_registry        | metadata                      | jsonb                    | NO          |
| measures_registry        | created_at                    | timestamp with time zone | NO          |
| measures_registry        | updated_at                    | timestamp with time zone | NO          |
| measures_release_state   | id                            | uuid                     | NO          |
| measures_release_state   | registry_id                   | uuid                     | NO          |
| measures_release_state   | release_state                 | text                     | NO          |
| measures_release_state   | access_state                  | text                     | NO          |
| measures_release_state   | release_reason                | text                     | YES         |
| measures_release_state   | access_reason                 | text                     | YES         |
| measures_release_state   | phase_label                   | text                     | YES         |
| measures_release_state   | release_at                    | timestamp with time zone | YES         |
| measures_release_state   | sealed_at                     | timestamp with time zone | YES         |
| measures_release_state   | effective_at                  | timestamp with time zone | NO          |
| measures_release_state   | metadata                      | jsonb                    | NO          |
| measures_release_state   | created_at                    | timestamp with time zone | NO          |
| measures_release_state   | updated_at                    | timestamp with time zone | NO          |
| measures_release_state   | release_cadence_order         | integer                  | YES         |
| measures_release_state   | ritual_release_label          | text                     | YES         |
| measures_release_state   | ritual_release_at             | timestamp with time zone | YES         |
| measures_transition_rule | id                            | uuid                     | NO          |
| measures_transition_rule | from_registry_id              | uuid                     | YES         |
| measures_transition_rule | from_encounter_id             | uuid                     | YES         |
| measures_transition_rule | to_registry_id                | uuid                     | YES         |
| measures_transition_rule | to_encounter_id               | uuid                     | YES         |
| measures_transition_rule | transition_kind               | text                     | NO          |
| measures_transition_rule | rule_state                    | text                     | NO          |
| measures_transition_rule | requires_release              | boolean                  | NO          |
| measures_transition_rule | requires_dependency_satisfied | boolean                  | NO          |
| measures_transition_rule | requires_passage_ready        | boolean                  | NO          |
| measures_transition_rule | requires_connect_prompt       | boolean                  | NO          |
| measures_transition_rule | sort_order                    | integer                  | NO          |
| measures_transition_rule | metadata                      | jsonb                    | NO          |
| measures_transition_rule | created_at                    | timestamp with time zone | NO          |
| measures_transition_rule | updated_at                    | timestamp with time zone | NO          |