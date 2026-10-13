// Aided measurements: one rule for pure tones and speech, after ISO 8253-3.
// A diamond marks an aided measurement; from the second device or fitting on,
// its number stands at the right, defined in the audiogram legend. Writes
// that legend to examples/out/aided.svg. Run with `node examples/aided.ts`.
import { mkdirSync, writeFileSync } from "node:fs";
import {
  THEME_BACKGROUNDS,
  audiogramSymbol,
  speechSymbol,
  symbolSvg,
  type Aided,
  type SymbolAxes,
} from "otoicons";

/** Fittings tested on the same audiogram, numbered in the legend. */
const fittings: { label: string; aided: Aided }[] = [
  { label: "Two hearing aids", aided: { right: "hearing_aid", left: "hearing_aid" } },
  { label: "Right hearing aid only", aided: { right: "hearing_aid", left: null } },
  {
    label: "CROS, receiver on the right",
    aided: { right: "cros_receiver", left: "cros_transmitter" },
  },
];

/** Aided sound-field threshold, not lateralised, with fitting number `device`. */
const threshold = (aided: Aided, device: number): SymbolAxes => ({
  measure: "threshold",
  transducer: "sound_field",
  ear: null,
  masked: false,
  no_response: false,
  aided,
  device,
});

const ROW = 44;
const theme = "light";
const place = (x: number, y: number, g: string) =>
  `<g transform="translate(${x} ${y}) scale(1.2)">${g}</g>`;

const rows = fittings.map(({ label, aided }, i) => {
  const device = i + 1;
  const tone = audiogramSymbol(threshold(aided, device));
  const speech = speechSymbol({
    transducer: "sound_field",
    ear: null,
    masked: false,
    competing_noise: false,
    aided,
    device,
  });
  const cy = 34 + i * ROW;
  return (
    place(36, cy, tone ? symbolSvg(tone, { theme }) : "") +
    place(90, cy, speech ? symbolSvg(speech, { theme }) : "") +
    `<text x="130" y="${cy + 4}">${device}: ${label}</text>`
  );
});

const h = 34 + fittings.length * ROW - 10;
const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${h}" width="360" height="${h}">`,
  `<rect width="100%" height="100%" fill="${THEME_BACKGROUNDS[theme]}"/>`,
  `<g font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#1f2328">${rows.join("")}</g>`,
  `</svg>`,
].join("\n");

const dir = new URL("out/", import.meta.url);
mkdirSync(dir, { recursive: true });
const file = new URL("aided.svg", dir);
writeFileSync(file, svg);
console.log(`Written ${file.pathname}`);

// The symbol carries the aided marking only; the legend names the fitting.
for (const [i, { label, aided }] of fittings.entries()) {
  const symbol = audiogramSymbol(threshold(aided, i + 1));
  console.log(`${label} → aided: ${symbol?.aided}, device: ${symbol?.device}`);
}
