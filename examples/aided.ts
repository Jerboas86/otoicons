// Aided measurements, CROS and BiCROS: how the subscript names the aided side
// in each language. Writes a legend for every locale to
// examples/out/aided.<locale>.svg. Run with `node examples/aided.ts`.
import { mkdirSync, writeFileSync } from "node:fs";
import {
  AID_INDEX_LETTERS,
  THEME_BACKGROUNDS,
  audiogramSymbol,
  symbolSvg,
  type Aided,
  type Locale,
  type SymbolAxes,
} from "otoicons";

const fitting: Record<string, Aided> = {
  "Two hearing aids": { right: "hearing_aid", left: "hearing_aid" },
  "Right hearing aid only": { right: "hearing_aid", left: null },
  "Left hearing aid only": { right: null, left: "hearing_aid" },
  "CROS, receiver on the right": { right: "cros_receiver", left: "cros_transmitter" },
  "BiCROS, hearing aid on the left": { right: "cros_transmitter", left: "hearing_aid" },
};

/** Aided sound-field threshold with a given fitting. */
const aidedThreshold = (aided: Aided): SymbolAxes => ({
  measure: "threshold",
  transducer: "sound_field",
  ear: null,
  masked: false,
  no_response: false,
  aided,
});

const ROW = 34;
const theme = "light";

const legend = (locale: Locale): string => {
  const rows = Object.entries(fitting).map(([label, aided], i) => {
    const symbol = audiogramSymbol(aidedThreshold(aided));
    const g = symbol ? symbolSvg(symbol, { locale, theme }) : "";
    const cy = 24 + i * ROW;
    return (
      `<g transform="translate(30 ${cy}) scale(1.4)">${g}</g>` +
      `<text x="64" y="${cy + 4}">${label}</text>`
    );
  });
  const h = 24 + Object.keys(fitting).length * ROW - 10;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 ${h}" width="320" height="${h}">`,
    `<rect width="100%" height="100%" fill="${THEME_BACKGROUNDS[theme]}"/>`,
    `<g font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#1f2328">${rows.join("")}</g>`,
    `</svg>`,
  ].join("\n");
};

const dir = new URL("out/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const locale of Object.keys(AID_INDEX_LETTERS) as Locale[]) {
  const file = new URL(`aided.${locale}.svg`, dir);
  writeFileSync(file, legend(locale));
  console.log(`Written ${file.pathname}`);
}

// The subscript is derived from the fitting alone; only its letters follow
// the locale.
for (const [label, aided] of Object.entries(fitting)) {
  const symbol = audiogramSymbol(aidedThreshold(aided));
  if (symbol?.kind !== "extension") continue;
  const index = symbol.aid_index;
  const letters = index
    ? (Object.keys(AID_INDEX_LETTERS) as Locale[])
        .map((l) => `${l}: ${symbol.letter}${AID_INDEX_LETTERS[l][index]}`)
        .join(", ")
    : symbol.letter;
  console.log(`${label} → ${letters}`);
}
