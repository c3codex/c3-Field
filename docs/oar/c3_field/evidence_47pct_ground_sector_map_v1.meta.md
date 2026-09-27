# Evidence — 4.7% Ground Sector Map v1

**hardening finding:** H01  
**initiative:** 4.7%  
**authority:** `evidence_pac_47pct_v1`  
**status:** SOURCE + REGISTRY RESOLUTION COMPLETE / LIVE RUNTIME READBACK DEFERRED TO H06

## Resolution

The C2 Ground encounter now resolves property-map data through a separate geocode registry and a sectorized renderer.

### Registry readback

`public.resolve_47pct_property_map_internal(true)` returns:

- resolution: `registry_resolved`
- map population: `registry_standing_and_registered_geocode_only`
- sector rule: `state_code_from_registered_property_address`
- coordinate rule: `registered_geocode_relation_only`
- sector invention allowed: `false`
- frontend invention allowed: `false`
- survivor occurrence inference allowed: `false`
- parcel boundary claimed: `false`

Current registered sectors:

- Tennessee — 5 properties / 5 verified coordinates
- Arkansas — 1 property / 1 qualified coordinate
- Iowa — 1 property / 1 verified coordinate

Total currently map-resolved properties: **7**.

## Geocode evidence boundary

Coordinates are stored separately in `public.c3_47pct_property_geocode` so property evidence and location derivation remain independently inspectable.

Every current coordinate record retains:

- property key,
- latitude / longitude,
- precision class,
- source name,
- source URL,
- observed date,
- Registry standing,
- public projection permission,
- explicit no-parcel-boundary / no-survivor-occurrence effect.

Camp Pioneer, Arkansas is intentionally `registered_qualified` at locale-centroid precision. It is not represented as an exact address coordinate or parcel boundary.

## Runtime source

- `src/c3_field_contribution/C247GroundSectorMap.tsx`
- `src/c3_field_contribution/C247PctEncounter.tsx`
- `src/c3_field_contribution/c247PctEncounter.css`
- `functions/api/c2-47pct.ts`

The Ground renderer receives only Registry-projected `sector_key`, `sector_label`, coordinates, disposition state, and sourced property assertions.

The UI provides:

1. Registry-defined state sectors,
2. coordinate-map pins,
3. sector-filtered property evidence cards,
4. a selected property dossier,
5. geocode-source disclosure,
6. property Evidence_PAC assertions and links.

## Survivor-occurrence boundary

A property pin proves only that a registered property record resolves to the displayed coordinate standing.

It does **not** establish:

- that abuse occurred at the property,
- that a survivor was present there,
- parcel ownership beyond the separately qualified title evidence,
- any causal relationship between the property and a survivor occurrence.

Survivor testimony remains the authority for survivor-pinned occurrence.

## H01 disposition

H01 is eligible for **ACT** once this source is merged to the registered `c3field` branch. Browser/live-deployment readback remains part of H06 and must not be inferred from source merge.
