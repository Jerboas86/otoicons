/**
 * ASHA symbols, "Guidelines for Audiometric Symbols" (1990), tables 1 and 2.
 * The standard defines no symbol for aided measurements ("locally determined
 * symbols", defined on the audiogram) nor for MCL and UCL: `ashaSymbol`
 * returns `null` for them, and `extension.ts` takes over.
 *
 * Colour carries no information in ASHA; we follow the widespread
 * convention: red right, blue left, green when not lateralised. It always
 * represents the stimulated side.
 */

import { isAided, type Ear, type SymbolAxes, type Transducer } from "./types.js";

/** Conventional colour (not part of the standard). */
export type SideColor = "red" | "blue" | "green";

/** Colour of a measurement from its side; null: not lateralised. */
export const sideColor = (side: Ear | null): SideColor =>
  side === "right" ? "red" : side === "left" ? "blue" : "green";

/** No-response arrow, attached to the bottom of the symbol. */
export type NoResponseArrow = "down_left" | "down_right" | "down";

/** ASHA: 45° outward (to the left for the right ear, and vice versa), straight down when not lateralised. */
export const noResponseArrow = (side: Ear | null): NoResponseArrow =>
  side === "right" ? "down_left" : side === "left" ? "down_right" : "down";

/**
 * SVG paths (`d` attribute, stroke without fill) in a frame centred on the
 * frequency × level intersection; a symbol fits in ±10 units. Bone and
 * reflex symbols are offset from the frequency line as in the ASHA table: to
 * the left for the right ear, to the right for the left ear.
 */
export const ASHA_SHAPES = {
  ac_right: "M6 0A6 6 0 1 0-6 0A6 6 0 1 0 6 0",
  ac_left: "M-5-5L5 5M-5 5L5-5",
  ac_right_masked: "M0-6L6 5H-6Z",
  ac_left_masked: "M-5.5-5.5H5.5V5.5H-5.5Z",
  bc_mastoid_right: "M-3-6L-9 0L-3 6",
  bc_mastoid_left: "M3-6L9 0L3 6",
  bc_mastoid_unspecified: "M-6 4L0-4L6 4",
  bc_mastoid_right_masked: "M-3-7H-8V7H-3",
  bc_mastoid_left_masked: "M3-7H8V7H3",
  bc_forehead_unspecified: "M-6-4L0 4L6-4",
  bc_forehead_right_masked: "M-9-7H-3V3",
  bc_forehead_left_masked: "M3 3V-7H9",
  sf_right: "M6 0A6 6 0 1 0-6 0A6 6 0 1 0 6 0M-7 7L7-7",
  sf_left: "M-5-5L5 5M-5 5L5-5M5 1.5L1.5 5M-1.5-5L-5-1.5",
  sf_unspecified: "M5-4C3-8-5-7-5-3C-5 1 5-1 5 3C5 7-3 8-5 4",
  reflex_contra_right: "M-3-5A5 5 0 0 0-3 5M-8 0H-12",
  reflex_contra_left: "M3-5A5 5 0 0 1 3 5M8 0H12",
  reflex_ipsi_right: "M-3-5V5M-3 0H-11",
  reflex_ipsi_left: "M3-5V5M3 0H11",
} as const;
export type AshaShape = keyof typeof ASHA_SHAPES;

/**
 * Attachment point of the no-response arrow: the bottom of the symbol, on the
 * side the arrow leaves from (outward; centred when not lateralised).
 */
export const ASHA_ARROW_ANCHORS: Record<AshaShape, readonly [number, number]> = {
  ac_right: [-4.24, 4.24],
  ac_left: [5, 5],
  ac_right_masked: [-6, 5],
  ac_left_masked: [5.5, 5.5],
  bc_mastoid_right: [-3, 6],
  bc_mastoid_left: [3, 6],
  bc_mastoid_unspecified: [0, -4],
  bc_mastoid_right_masked: [-8, 7],
  bc_mastoid_left_masked: [8, 7],
  bc_forehead_unspecified: [0, 4],
  bc_forehead_right_masked: [-3, 3],
  bc_forehead_left_masked: [3, 3],
  sf_right: [-7, 7],
  sf_left: [5, 5],
  sf_unspecified: [0.75, 6.5],
  reflex_contra_right: [-3, 5],
  reflex_contra_left: [3, 5],
  reflex_ipsi_right: [-3, 5],
  reflex_ipsi_left: [3, 5],
};

/** SVG path of the no-response arrow starting at `anchor`, in the same frame. */
export const noResponseArrowPath = (
  arrow: NoResponseArrow,
  [x, y]: readonly [number, number],
): string => {
  if (arrow === "down") {
    // Anchored at the apex (^), the arrow must still end below the symbol.
    const end = Math.max(y + 9, 13);
    return `M${x} ${y}V${end}M${x - 3.5} ${end - 3.5}L${x} ${end}L${x + 3.5} ${end - 3.5}`;
  }
  const dx = arrow === "down_left" ? -7 : 7;
  const head = arrow === "down_left" ? 4.5 : -4.5;
  return `M${x} ${y}L${x + dx} ${y + 7}M${x + dx} ${y + 2.5}V${y + 7}H${x + dx + head}`;
};

/** Unicode approximation of each shape, for text rendering. */
export const ASHA_GLYPHS: Record<AshaShape, string> = {
  ac_right: "O",
  ac_left: "X",
  ac_right_masked: "△",
  ac_left_masked: "□",
  bc_mastoid_right: "<",
  bc_mastoid_left: ">",
  bc_mastoid_unspecified: "^",
  bc_mastoid_right_masked: "[",
  bc_mastoid_left_masked: "]",
  bc_forehead_unspecified: "v",
  bc_forehead_right_masked: "┐",
  bc_forehead_left_masked: "┌",
  sf_right: "Ø",
  sf_left: "*",
  sf_unspecified: "S",
  reflex_contra_right: "-C",
  reflex_contra_left: "Ↄ-",
  reflex_ipsi_right: "⊣",
  reflex_ipsi_left: "⊢",
};

export type AshaSymbol = {
  shape: AshaShape;
  /** Ear of the symbol; null: unspecified. */
  ear: Ear | null;
  color: SideColor;
  /** null: response obtained. */
  no_response_arrow: NoResponseArrow | null;
};

type Shapes = { right: AshaShape; left: AshaShape; unspecified: AshaShape | null };

/** ASHA 1990, table 1: [unmasked, masked] per transducer. */
const ASHA: Record<Transducer, [Shapes, Shapes]> = {
  earphones: [
    { right: "ac_right", left: "ac_left", unspecified: null },
    { right: "ac_right_masked", left: "ac_left_masked", unspecified: null },
  ],
  bone_mastoid: [
    { right: "bc_mastoid_right", left: "bc_mastoid_left", unspecified: "bc_mastoid_unspecified" },
    { right: "bc_mastoid_right_masked", left: "bc_mastoid_left_masked", unspecified: null },
  ],
  // The only unmasked forehead symbol is unspecified.
  bone_forehead: [
    {
      right: "bc_forehead_unspecified",
      left: "bc_forehead_unspecified",
      unspecified: "bc_forehead_unspecified",
    },
    { right: "bc_forehead_right_masked", left: "bc_forehead_left_masked", unspecified: null },
  ],
  sound_field: [
    { right: "sf_right", left: "sf_left", unspecified: "sf_unspecified" },
    { right: "sf_right", left: "sf_left", unspecified: "sf_unspecified" },
  ],
};

/** ASHA symbol of an unaided threshold; null when ASHA defines none. */
export const ashaSymbol = (m: SymbolAxes): AshaSymbol | null => {
  if (m.measure !== "threshold" || isAided(m.aided)) return null;
  const shapes = ASHA[m.transducer][m.masked ? 1 : 0];
  const ear = m.transducer === "bone_forehead" && !m.masked ? null : m.ear;
  const shape = ear === null ? shapes.unspecified : shapes[ear];
  if (shape === null) return null;
  return {
    shape,
    ear,
    color: sideColor(ear),
    no_response_arrow: m.no_response ? noResponseArrow(ear) : null,
  };
};
