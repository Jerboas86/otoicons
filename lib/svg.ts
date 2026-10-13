/**
 * SVG rendering of a symbol, centred on the frequency × level intersection,
 * in the `ASHA_SHAPES` frame (a symbol fits in ±10 units, ±16 with its
 * arrow). Place it with a `transform` at the scale you need.
 */

import {
  ASHA_ARROW_ANCHORS,
  ASHA_SHAPES,
  noResponseArrowPath,
  type AshaShape,
  type SideColor,
} from "./asha.js";
import {
  AID_INDEX_LETTERS,
  type AudiogramSymbol,
  type ExtensionLetter,
  type Locale,
} from "./extension.js";
import type { Ear } from "./types.js";

export type Theme = "light" | "dark";

export const THEME_BACKGROUNDS: Record<Theme, string> = { light: "#ffffff", dark: "#000000" };

/**
 * Red / blue / green convention at constant contrast: each hue is adjusted in
 * lightness (OKLCH, hue preserved) to a 5:1 WCAG contrast ratio against the
 * theme background. No colour dominates, and legibility is the same on light
 * and dark backgrounds.
 */
export const SIDE_COLORS: Record<Theme, Record<SideColor, string>> = {
  light: { red: "#c74031", blue: "#396dc7", green: "#0a8040" },
  dark: { red: "#d64e3e", blue: "#457ad5", green: "#228d4c" },
};

/** Closed shapes, filled with the background to hide the frequency line. */
const CLOSED = new Set<AshaShape>(["ac_right", "ac_right_masked", "ac_left_masked", "sf_right"]);

/** Subscript size and drop below the baseline, as fractions of the letter size. */
const INDEX_SIZE = 0.62;
const INDEX_DROP = 0.32;

/**
 * Foot of the symbol on the arrow side: half-width ≈ 0.36 × size per letter,
 * baseline at 0.36 × size; the subscript extends the right side.
 */
const letterAnchor = (
  letter: ExtensionLetter,
  index: string | null,
  size: number,
  side: Ear | null,
): [number, number] => {
  const half = 0.36 * size * letter.length;
  const baseline = size * 0.36;
  if (side === "right") return [-half, baseline];
  if (side === null) return [0, baseline];
  return index
    ? [half + 0.72 * INDEX_SIZE * size * index.length, baseline + INDEX_DROP * size]
    : [half, baseline];
};

export type SvgOptions = {
  /** Language of the subscript letters; `fr` by default. */
  locale?: Locale;
  /** Theme: sets the palette and the default background; `light` by default. */
  theme?: Theme;
  /**
   * Background colour, to hide the grid: letter halo and inside of closed
   * shapes. Theme background by default; null: transparent symbol.
   */
  background?: string | null;
};

/** `<g>` element drawing the symbol at the origin. */
export const symbolSvg = (
  s: AudiogramSymbol,
  { locale = "fr", theme = "light", background = THEME_BACKGROUNDS[theme] }: SvgOptions = {},
): string => {
  const color = SIDE_COLORS[theme][s.color];
  const parts: string[] = [];
  let anchor: readonly [number, number];
  if (s.kind === "asha") {
    const fill = background && CLOSED.has(s.shape) ? ` fill="${background}"` : "";
    parts.push(`<path d="${ASHA_SHAPES[s.shape]}"${fill}/>`);
    anchor = ASHA_ARROW_ANCHORS[s.shape];
  } else {
    const size = s.letter.length > 1 ? 10 : 12;
    const index = s.aid_index && AID_INDEX_LETTERS[locale][s.aid_index];
    const halo = background
      ? ` stroke="${background}" stroke-width="3" paint-order="stroke"`
      : ' stroke="none"';
    const text = `font-family="Helvetica, Arial, sans-serif" font-weight="700" fill="${color}"${halo}`;
    anchor = letterAnchor(s.letter, index, size, s.ear);
    parts.push(
      `<text y="${size * 0.36}" font-size="${size}" ${text} text-anchor="middle">${s.letter}</text>`,
    );
    if (index)
      parts.push(
        `<text x="${0.36 * size * s.letter.length + 0.3}" y="${size * (0.36 + INDEX_DROP)}" font-size="${size * INDEX_SIZE}" ${text}>${index}</text>`,
      );
  }
  if (s.no_response_arrow)
    parts.push(`<path d="${noResponseArrowPath(s.no_response_arrow, anchor)}"/>`);
  return `<g stroke="${color}" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${parts.join("")}</g>`;
};
