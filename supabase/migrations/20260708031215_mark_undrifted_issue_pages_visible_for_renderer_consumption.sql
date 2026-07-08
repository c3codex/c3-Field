-- OAR2: oar2_render_issue001_through_issue_page_model_v1
-- visibility_state tracks whether a renderer actually consumes a page row (distinct from
-- release_state, which tracks publication/content readiness). This OAR2 is precisely what
-- wires FREE to read measures_publication_issue_page for the first time, so visibility_state
-- flips to 'visible' for all six rows — the RLS read policy is gated on this column, so
-- without this the anon client would see zero rows regardless of release_state. release_state
-- is NOT touched here (still 'held' for any page that isn't actually published — currently
-- none, since the cover story publish landed already, but the mechanism must hold for future
-- issues).

update measures_publication_issue_page
set visibility_state = 'visible'
where publication_key = 'undrifted' and issue_id = 'undrifted_issue01';
