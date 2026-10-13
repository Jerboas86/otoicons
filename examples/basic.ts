// From a measurement to its symbol: which symbol the kit picks for a few
// common measurements, and how it is drawn. Run with `node examples/basic.ts`.
import { ASHA_GLYPHS, audiogramSymbol, symbolSvg, type SymbolAxes } from "otoicons";

const unaided = { right: null, left: null };

const measurements: Record<string, SymbolAxes> = {
  "Right ear, earphones": {
    measure: "threshold",
    transducer: "earphones",
    ear: "right",
    masked: false,
    no_response: false,
    aided: unaided,
  },
  "Left ear, earphones, masked": {
    measure: "threshold",
    transducer: "earphones",
    ear: "left",
    masked: true,
    no_response: false,
    aided: unaided,
  },
  "Right ear, bone (mastoid), no response": {
    measure: "threshold",
    transducer: "bone_mastoid",
    ear: "right",
    masked: false,
    no_response: true,
    aided: unaided,
  },
  "Sound field, unaided": {
    measure: "threshold",
    transducer: "sound_field",
    ear: null,
    masked: false,
    no_response: false,
    aided: unaided,
  },
  "Sound field, left hearing aid only": {
    measure: "threshold",
    transducer: "sound_field",
    ear: null,
    masked: false,
    no_response: false,
    aided: { right: null, left: "hearing_aid" },
  },
  "Left ear, MCL": {
    measure: "mcl",
    transducer: "earphones",
    ear: "left",
    masked: false,
    no_response: false,
    aided: unaided,
  },
};

for (const [label, m] of Object.entries(measurements)) {
  const symbol = audiogramSymbol(m);
  if (!symbol) {
    console.log(`${label}: no symbol`);
    continue;
  }
  // ASHA symbols have a Unicode approximation; extension symbols are letters.
  const text = symbol.kind === "asha" ? ASHA_GLYPHS[symbol.shape] : symbol.letter;
  console.log(`${label}: ${text}`, symbol);
}

// The same symbol as an SVG element, centred on the measurement point.
const symbol = audiogramSymbol(measurements["Sound field, left hearing aid only"]!);
if (symbol) console.log(symbolSvg(symbol, { locale: "en", theme: "light" }));
