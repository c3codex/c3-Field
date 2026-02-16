// src/pillars/measures/data/gate0Cuneiform.ts
// Cuneiform constraint keys for Gate 0: Obsidian Gate / Queen of Heaven
// These are NOT decoration - they are structural markers of gate requirements

export type CuneiformKey = {
  gate: string;
  glyph: string;
  label: string;
  principle: string;
  displayOrder: number;
  source: string;
  visibility: "plate-only" | "gallery-item" | "book-only";
};

/**
 * Gate 0 Cuneiform Keys
 * 
 * These 3 glyphs mark the constraint field of the Obsidian Gate.
 * Each is bound to the specific condition of "Solitude as Sovereignty."
 * 
 * Design rules:
 * - 3 glyphs minimum (not 7, not decoration)
 * - Each tied to gate-specific condition
 * - Readable at 22-28px minimum height
 * - High contrast (warm off-white on near-black)
 * - Structured as objects for CoherentAI indexing
 */
export const GATE_0_CUNEIFORM: readonly CuneiformKey[] = [
  {
    gate: "gate0",
    glyph: "𒀭", // DINGIR
    label: "Sovereign Presence",
    principle: "Station requires no witness.",
    displayOrder: 1,
    source: "Measures of Inanna / Obsidian Gate Plate",
    visibility: "plate-only",
  },
  {
    gate: "gate0",
    glyph: "𒄑", // IGI
    label: "The Eye",
    principle: "Only you are watching.",
    displayOrder: 2,
    source: "Measures of Inanna / Obsidian Gate Plate",
    visibility: "plate-only",
  },
  {
    gate: "gate0",
    glyph: "𒂵", // GIR
    label: "Edge",
    principle: "Solitude is a boundary you choose.",
    displayOrder: 3,
    source: "Measures of Inanna / Obsidian Gate Plate",
    visibility: "plate-only",
  },
] as const;

/**
 * Supabase Schema (for reference)
 * 
 * Table: cuneiform_keys
 * Columns:
 * - id (uuid, primary key)
 * - gate (text, e.g., "gate0")
 * - glyph (text, actual Unicode character)
 * - label (text, short 1-3 word label)
 * - principle (text, one sentence gate-specific)
 * - display_order (integer, 1-3)
 * - source (text, attribution)
 * - visibility (text, enum: "plate-only" | "gallery-item" | "book-only")
 * - created_at (timestamp)
 * 
 * Example insert:
 * INSERT INTO cuneiform_keys (gate, glyph, label, principle, display_order, source, visibility)
 * VALUES ('gate0', '𒀭', 'Sovereign Presence', 'Station requires no witness.', 1, 'Measures of Inanna / Obsidian Gate Plate', 'plate-only');
 */

/**
 * CoherentAI Display Format
 * 
 * When CoherentAI needs to reference or display these glyphs:
 * 
 * {
 *   "type": "cuneiform_key",
 *   "gate": "gate0",
 *   "glyph": "𒀭",
 *   "label": "Sovereign Presence",
 *   "principle": "Station requires no witness.",
 *   "context": "constraint_marker"
 * }
 * 
 * Rendering guidelines:
 * - Minimum font-size: 22px (desktop), 20px (mobile)
 * - Color: rgba(250,246,240,0.75) or warmer off-white
 * - Background: near-black with subtle contrast
 * - Tooltip: label + principle on hover/press
 * - No blur, minimum opacity 0.75
 */

/**
 * Usage in components:
 * 
 * import { GATE_0_CUNEIFORM } from '@/pillars/measures/data/gate0Cuneiform';
 * 
 * {GATE_0_CUNEIFORM.map((key) => (
 *   <div key={key.displayOrder}>
 *     <span title={`${key.label}: ${key.principle}`}>
 *       {key.glyph}
 *     </span>
 *   </div>
 * ))}
 */
