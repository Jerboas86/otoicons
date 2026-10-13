// A complete audiogram drawn with `symbolSvg`: grid, air and bone conduction
// thresholds of both ears, a masked threshold and responses missing at the
// limits of the audiometer. Writes examples/out/audiogram[.dark].svg.
// Run with `node examples/audiogram.ts`.
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SIDE_COLORS,
  THEME_BACKGROUNDS,
  audiogramSymbol,
  symbolSvg,
  type Ear,
  type SymbolAxes,
  type Theme,
  type Transducer,
} from "otoicons";

type Point = { frequency: number; level: number; masked?: boolean; no_response?: boolean };

/** A measured series: every point shares its transducer and ear. */
type Series = { transducer: Transducer; ear: Ear; points: Point[] };

const series: Series[] = [
  {
    transducer: "earphones",
    ear: "right",
    points: [
      { frequency: 250, level: 20 },
      { frequency: 500, level: 25 },
      { frequency: 1000, level: 35 },
      { frequency: 2000, level: 50 },
      { frequency: 4000, level: 65 },
      { frequency: 8000, level: 70 },
    ],
  },
  {
    transducer: "earphones",
    ear: "left",
    points: [
      { frequency: 250, level: 15 },
      { frequency: 500, level: 20 },
      { frequency: 1000, level: 55, masked: true },
      { frequency: 2000, level: 75 },
      { frequency: 4000, level: 90 },
      { frequency: 8000, level: 110, no_response: true },
    ],
  },
  {
    transducer: "bone_mastoid",
    ear: "right",
    points: [
      { frequency: 500, level: 20 },
      { frequency: 1000, level: 30 },
      { frequency: 2000, level: 45 },
      { frequency: 4000, level: 70, no_response: true },
    ],
  },
  {
    transducer: "bone_mastoid",
    ear: "left",
    points: [
      { frequency: 500, level: 15, masked: true },
      { frequency: 1000, level: 50, masked: true },
      { frequency: 2000, level: 70, masked: true },
    ],
  },
];

// ASHA aspect ratio: one octave spans the same length as 20 dB.
const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];
const OCTAVE = 70;
const DB = OCTAVE / 20;
const LEVELS = { min: -10, max: 120 };
const MARGIN = { top: 40, right: 30, bottom: 30, left: 50 };
const SCALE = 1.3; // symbols are drawn in a ±10 unit frame

const width = OCTAVE * (FREQUENCIES.length - 1);
const height = DB * (LEVELS.max - LEVELS.min);
const x = (f: number) => MARGIN.left + OCTAVE * Math.log2(f / FREQUENCIES[0]!);
const y = (l: number) => MARGIN.top + DB * (l - LEVELS.min);

const INK: Record<Theme, { text: string; grid: string }> = {
  light: { text: "#1f2328", grid: "#c4c8cc" },
  dark: { text: "#e6e6e6", grid: "#4a4f55" },
};

const audiogram = (theme: Theme): string => {
  const { text, grid } = INK[theme];
  const out: string[] = [];

  // Grid and axes.
  for (const f of FREQUENCIES) {
    out.push(`<line x1="${x(f)}" x2="${x(f)}" y1="${y(LEVELS.min)}" y2="${y(LEVELS.max)}"/>`);
    const label = f < 1000 ? `${f}` : `${f / 1000}k`;
    out.push(
      `<text x="${x(f)}" y="${MARGIN.top - 12}" text-anchor="middle" stroke="none">${label}</text>`,
    );
  }
  for (let l = LEVELS.min; l <= LEVELS.max; l += 10) {
    out.push(`<line x1="${x(125)}" x2="${x(8000)}" y1="${y(l)}" y2="${y(l)}"/>`);
    out.push(
      `<text x="${MARGIN.left - 8}" y="${y(l) + 4}" text-anchor="end" stroke="none">${l}</text>`,
    );
  }
  const axes = `<g stroke="${grid}" fill="${text}" font-family="Helvetica, Arial, sans-serif" font-size="11">${out.join("")}</g>`;

  // Lines joining air conduction thresholds, drawn below the symbols; ASHA
  // does not join points without response.
  const lines = series
    .filter((s) => s.transducer === "earphones")
    .map((s) => {
      const points = s.points.filter((p) => !p.no_response);
      const d = points.map((p, i) => `${i ? "L" : "M"}${x(p.frequency)} ${y(p.level)}`).join("");
      return `<path d="${d}" fill="none" stroke="${SIDE_COLORS[theme][s.ear === "right" ? "red" : "blue"]}" stroke-width="1.2"/>`;
    });

  // Symbols, centred on each frequency × level intersection.
  const symbols = series.flatMap((s) =>
    s.points.map((p) => {
      const axes: SymbolAxes = {
        measure: "threshold",
        transducer: s.transducer,
        ear: s.ear,
        masked: p.masked ?? false,
        no_response: p.no_response ?? false,
        aided: { right: null, left: null },
      };
      const symbol = audiogramSymbol(axes);
      if (!symbol) return "";
      const g = symbolSvg(symbol, { locale: "en", theme });
      return `<g transform="translate(${x(p.frequency)} ${y(p.level)}) scale(${SCALE})">${g}</g>`;
    }),
  );

  const w = MARGIN.left + width + MARGIN.right;
  const h = MARGIN.top + height + MARGIN.bottom;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`,
    `<rect width="100%" height="100%" fill="${THEME_BACKGROUNDS[theme]}"/>`,
    axes,
    ...lines,
    ...symbols,
    `</svg>`,
  ].join("\n");
};

const dir = new URL("out/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const theme of ["light", "dark"] as const) {
  const file = new URL(theme === "light" ? "audiogram.svg" : "audiogram.dark.svg", dir);
  writeFileSync(file, audiogram(theme));
  console.log(`Written ${file.pathname}`);
}
