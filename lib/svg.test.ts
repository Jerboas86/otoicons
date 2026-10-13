import {
  AIDED_DIAMOND,
  ASHA_SHAPES,
  SIDE_COLORS,
  THEME_BACKGROUNDS,
  audiogramSymbol,
  symbolSvg,
  type SymbolAxes,
  type Theme,
} from "./index.js";

const unaided = { right: null, left: null };
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

  it("surrounds an aided symbol with the diamond, number and arrow from its edge", () => {
    const svg = symbolSvg(audiogramSymbol({ ...aidedLeft, device: 2 })!);
    expect(svg).toContain(`d="${AIDED_DIAMOND}" fill="${THEME_BACKGROUNDS.light}"`);
    expect(svg).toContain(`d="${ASHA_SHAPES.sf_left}"`);
    expect(svg).toMatch(/text-anchor="start">2<\/text>/);
    expect(svg).not.toContain("paint-order");
    expect(svg).toContain('d="M8.5 8.5L15.5 15.5');
  });

  it("draws the extension letters with their halo and arrow", () => {
    const svg = symbolSvg(audiogramSymbol({ ...aidedLeft, measure: "ucl", aided: unaided })!);
    expect(svg).toMatch(/paint-order="stroke"[^>]*>U<\/text>/);
    expect(svg).toContain('d="M4.32 4.32L11.32 11.32');
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
    const aided = symbolSvg(audiogramSymbol({ ...aidedLeft, measure: "mcl" })!, {
      background: null,
    });
    expect(closed).not.toContain('fill="#');
    expect(aided).not.toContain(`fill="${THEME_BACKGROUNDS.light}"`);
    expect(aided).not.toContain("paint-order");
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
