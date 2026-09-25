update public.c3_pac
set metadata =
  jsonb_set(
    metadata,
    '{public_presentation}',
    coalesce(metadata->'public_presentation','{}'::jsonb)
      || jsonb_build_object(
           'header_line','A c3 Field Initiative',
           'model_descriptor','A structured participation model.',
           'model_path','Connect · Contribute · Create',
           'model_body','The c3 Model gives people a shared structure to connect, contribute according to their capacity, and create bounded action together.',
           'open_question','What brings you to 4.7%, and how would you like to participate?',
           'open_question_helper','Share only what you choose. You do not need to disclose survivor details to Connect.',
           'formal_authority_statement','c3 Community Partners DAO, LLC operating within computational systems governance.',
           'og_title','4.7% | A c3 Field Initiative',
           'og_description','A c3 Field Initiative of c3 Community Partners DAO, LLC operating within computational systems governance. 4.7% makes the distance between recognized harm, allowed compensation, and actual payment publicly visible.'
         ),
    true
  )
  || jsonb_build_object(
       'footer_contract',
       jsonb_build_object(
         'source_key','c3field_public_presentation_authority_v1_2',
         'source_type','governed_c3_field_public_presentation',
         'required_on_public_surfaces',true,
         'required_links',jsonb_build_array('Privacy','Terms','Contact'),
         'environment_line','c3Field is the relational operations environment for structured participation.',
         'copyright','© 2026 c3 Community Partners DAO, LLC. All rights reserved.',
         'initiative_relation_line','A c3 Field Initiative',
         'formal_authority_statement','c3 Community Partners DAO, LLC operating within computational systems governance.',
         'frontend_invention',false
       ),
       'public_header_rule',
       jsonb_build_object(
         'emblem_style','full_color',
         'emblem_size','larger',
         'header_text','A c3 Field Initiative',
         'duplicate_47pct_header_text_allowed',false
       ),
       'header_model_footer_state','STAGED_PENDING_DEPLOY'
     ),
    updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';