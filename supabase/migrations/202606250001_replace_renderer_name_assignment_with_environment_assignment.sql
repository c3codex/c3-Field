-- Replace renderer implementation names with structural environment assignment values.
-- Registry should carry where an encounter belongs, not which component renders it.
-- Mapping: CrystalSeatRenderer→crystal_seat, ObsidianChamberRenderer→obsidian,
--          LapisChamberRenderer→lapis, MarbleChamberRenderer→marble

UPDATE measures_encounter_surface_assignment
SET chamber_assignment = CASE chamber_assignment
  WHEN 'CrystalSeatRenderer'   THEN 'crystal_seat'
  WHEN 'ObsidianChamberRenderer' THEN 'obsidian'
  WHEN 'LapisChamberRenderer'  THEN 'lapis'
  WHEN 'MarbleChamberRenderer' THEN 'marble'
  ELSE chamber_assignment
END
WHERE chamber_assignment IN (
  'CrystalSeatRenderer',
  'ObsidianChamberRenderer',
  'LapisChamberRenderer',
  'MarbleChamberRenderer'
);
