/**
 * SVG rendering of a symbol, centred on the frequency × level intersection
 * (or the level × score point of a speech audiogram), in the `ASHA_SHAPES`
 * frame: a symbol fits in ±10 units, ±16 with its arrow; an aided symbol fits
 * in its ±17 diamond, down to 26 with its arrow. Place it with a `transform`
 * at the scale you need.
 */

import {
  ASHA_ARROW_ANCHORS,
  ASHA_SHAPES,
  noResponseArrowPath,
  type AshaShape,
  type SideColor,
} from "./asha.js";
import type { AudiogramSymbol } from "./extension.js";
import type { SpeechSymbol } from "./speech.js";
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

/**
 * Aided marking, after ISO 8253-3, for pure tones and speech alike: a diamond
 * around the symbol, filled with the background like the closed shapes.
 */
export const AIDED_DIAMOND = "M0-17L17 0L0 17L-17 0Z";

/** No-response arrow of an aided symbol: from the diamond's lower edges, outward, or its bottom corner. */
const DIAMOND_ARROW_ANCHORS = {
  right: [-8.5, 8.5],
  left: [8.5, 8.5],
  unspecified: [0, 17],
} as const;

/**
 * ISO 8253-3 speech modifiers, in the same frame: masking triangle on top of
 * `O` and `X`, lines below (competing noise) and above (sound field) each
 * base. The lines touch `O`, close the `X` into an hourglass and frame the `B`.
 */
export const SPEECH_MARKS = {
  masked_O: "M-4.24-4.24A6 6 0 0 1 4.24-4.24L0 0Z",
  masked_X: "M-5-5H5L0 0Z",
  noise_O: "M-6 6H6",
  noise_X: "M-5 5H5",
  noise_B: "M-5 6.5H5",
  sound_field_O: "M-6-6H6",
  sound_field_X: "M-5-5H5",
  sound_field_B: "M-5-6.5H5",
} as const;

/** Letter size, and foot of a letter on the arrow side: half-width ≈ 0.36 × size, baseline at 0.36 × size. */
const LETTER_SIZE = 12;
const letterAnchor = (side: Ear | null): [number, number] => {
  const half = 0.36 * LETTER_SIZE;
  return [side === "right" ? -half : side === "left" ? half : 0, 0.36 * LETTER_SIZE];
};

export type SvgOptions = {
  /** Theme: sets the palette and the default background; `light` by default. */
  theme?: Theme;
  /**
   * Background colour, to hide the grid: letter halo and inside of closed
   * shapes and of the diamond. Theme background by default; null:
   * transparent symbol.
   */
  background?: string | null;
};

/** Attributes of a bold letter, haloed with the background to hide the grid. */
const textAttributes = (color: string, background: string | null): string => {
  const halo = background
    ? ` stroke="${background}" stroke-width="3" paint-order="stroke"`
    : ' stroke="none"';
  return `font-family="Helvetica, Arial, sans-serif" font-weight="700" fill="${color}"${halo}`;
};

/**
 * Device number and material letter: size, and distance from the centre,
 * clear of the base symbol and of the diamond; further out for the circles.
 */
const LABEL_SIZE = 6.5;
const labelX = (s: AudiogramSymbol | SpeechSymbol): number =>
  (s.kind === "speech" && s.base === "O") || (s.kind === "asha" && s.shape === "sf_right")
    ? 9
    : 8.5;

/**
 * Small label beside the symbol. Inside the diamond, its fill already hides
 * the grid: a halo would only cut its outline.
 */
const label = (
  s: AudiogramSymbol | SpeechSymbol,
  side: "left" | "right",
  value: string | number,
  color: string,
  background: string | null,
): string => {
  const text = textAttributes(color, s.aided ? null : background);
  const x = side === "right" ? labelX(s) : -labelX(s);
  const anchor = side === "right" ? "start" : "end";
  return `<text x="${x}" y="${LABEL_SIZE * 0.36}" font-size="${LABEL_SIZE}" ${text} text-anchor="${anchor}">${value}</text>`;
};

const letter = (value: string, color: string, background: string | null): string =>
  `<text y="${LETTER_SIZE * 0.36}" font-size="${LETTER_SIZE}" ${textAttributes(color, background)} text-anchor="middle">${value}</text>`;

/** Speech base: the earphone `O` (closed, filled with the background) or `X`, or the letter `B`. */
const speechBase = (s: SpeechSymbol, color: string, background: string | null): string => {
  if (s.base === "B") return letter("B", color, background);
  const fill = s.base === "O" && background ? ` fill="${background}"` : "";
  return `<path d="${ASHA_SHAPES[s.base === "O" ? "ac_right" : "ac_left"]}"${fill}/>`;
};

/** ISO 8253-3 modifiers of a speech symbol; masking never applies to `B`. */
const speechMarks = (s: SpeechSymbol, color: string): string[] => {
  const marks: string[] = [];
  if (s.masked && s.base !== "B")
    marks.push(`<path d="${SPEECH_MARKS[`masked_${s.base}`]}" fill="${color}"/>`);
  if (s.sound_field) marks.push(`<path d="${SPEECH_MARKS[`sound_field_${s.base}`]}"/>`);
  if (s.competing_noise) marks.push(`<path d="${SPEECH_MARKS[`noise_${s.base}`]}"/>`);
  return marks;
};

/** Speech base, its modifiers and its material letter. */
const speechParts = (s: SpeechSymbol, color: string, background: string | null): string[] => [
  speechBase(s, color, background),
  ...speechMarks(s, color),
  ...(s.material ? [label(s, "left", s.material, color, background)] : []),
];

/** Pure-tone base: ASHA shape or extension letter, with its no-response arrow. */
const toneParts = (s: AudiogramSymbol, color: string, background: string | null): string[] => {
  const parts =
    s.kind === "asha"
      ? [
          `<path d="${ASHA_SHAPES[s.shape]}"${background && CLOSED.has(s.shape) ? ` fill="${background}"` : ""}/>`,
        ]
      : [letter(s.letter, color, background)];
  if (s.no_response_arrow) {
    const anchor = s.aided
      ? DIAMOND_ARROW_ANCHORS[s.ear ?? "unspecified"]
      : s.kind === "asha"
        ? ASHA_ARROW_ANCHORS[s.shape]
        : letterAnchor(s.ear);
    parts.push(`<path d="${noResponseArrowPath(s.no_response_arrow, anchor)}"/>`);
  }
  return parts;
};

/** `<g>` element drawing the symbol at the origin. */
export const symbolSvg = (
  s: AudiogramSymbol | SpeechSymbol,
  { theme = "light", background = THEME_BACKGROUNDS[theme] }: SvgOptions = {},
): string => {
  const color = SIDE_COLORS[theme][s.color];
  const parts: string[] = [];
  if (s.aided)
    parts.push(`<path d="${AIDED_DIAMOND}"${background ? ` fill="${background}"` : ""}/>`);
  parts.push(
    ...(s.kind === "speech" ? speechParts(s, color, background) : toneParts(s, color, background)),
  );
  if (s.device) parts.push(label(s, "right", s.device, color, background));
  return `<g stroke="${color}" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${parts.join("")}</g>`;
};
