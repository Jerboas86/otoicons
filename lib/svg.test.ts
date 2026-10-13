import {
  SIDE_COLORS,
  THEME_BACKGROUNDS,
  audiogramSymbol,
  symbolSvg,
  type SymbolAxes,
  type Theme,
} from "./index.js";

const aidedLeft: SymbolAxes = {
  measure: "threshold",
  transducer: "sound_field",
  ear: "left",
  masked: false,
  no_response: true,
  aided: { right: null, left: "hearing_aid" },
};

describe("symbolSvg", () => {
  it("draws an ASHA shape in its side colour, filling closed shapes with the background", () => {
    const svg = symbolSvg(
      audiogramSymbol({
        ...aidedLeft,
        transducer: "earphones",
        ear: "right",
        no_response: false,
        aided: { right: null, left: null },
      })!,
      { background: "#000" },
    );
    expect(svg).toContain(`stroke="${SIDE_COLORS.light.red}"`);
    expect(svg).toContain('fill="#000"');
  });

  it("writes the aid subscript in the requested language, with the no-response arrow", () => {
    const symbol = audiogramSymbol(aidedLeft)!;
    expect(symbolSvg(symbol)).toContain(">G</text>");
    expect(symbolSvg(symbol, { locale: "en" })).toContain(">L</text>");
    expect(symbolSvg(symbol, { locale: "it" })).toContain(">S</text>");
    expect(symbolSvg(symbol).match(/<path /g)).toHaveLength(1);
  });

  it("leaves the symbol transparent without a background", () => {
    const closed = symbolSvg(
      audiogramSymbol({
        ...aidedLeft,
        transducer: "earphones",
        ear: "right",
        no_response: false,
        aided: { right: null, left: null },
      })!,
      { background: null },
    );
    const letter = symbolSvg(audiogramSymbol(aidedLeft)!, { background: null });
    expect(closed).not.toContain('fill="#');
    expect(letter).not.toContain("paint-order");
  });

  it("takes the palette and the default background from the theme", () => {
    const svg = symbolSvg(
      audiogramSymbol({
        ...aidedLeft,
        transducer: "earphones",
        ear: "right",
        no_response: false,
        aided: { right: null, left: null },
      })!,
      { theme: "dark" },
    );
    expect(svg).toContain(`stroke="${SIDE_COLORS.dark.red}"`);
    expect(svg).toContain(`fill="${THEME_BACKGROUNDS.dark}"`);
  });
});

/** Rapport de contraste WCAG 2 entre deux couleurs `#rrggbb`. */
const contrast = (a: string, b: string) => {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

describe("SIDE_COLORS", () => {
  it.each(["light", "dark"] as Theme[])(
    "keeps every colour at 5:1 on the %s background",
    (theme) => {
      for (const color of Object.values(SIDE_COLORS[theme]))
        expect(contrast(color, THEME_BACKGROUNDS[theme])).toBeCloseTo(5, 1);
    },
  );
});
