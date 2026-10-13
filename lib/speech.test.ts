import {
  AIDED_DIAMOND,
  SPEECH_MARKS,
  SIDE_COLORS,
  speechSymbol,
  symbolSvg,
  type SpeechAxes,
} from "./index.js";

const axes = (fields: Partial<SpeechAxes> = {}): SpeechAxes => ({
  transducer: "earphones",
  ear: "right",
  masked: false,
  competing_noise: false,
  aided: { right: null, left: null },
  ...fields,
});
const aids = { right: "hearing_aid", left: "hearing_aid" } as const;
const aidedSoundField = { transducer: "sound_field", competing_noise: true, aided: aids } as const;

describe("speechSymbol", () => {
  it.each([
    ["right", "O", "red"],
    ["left", "X", "blue"],
    [null, "B", "green"],
  ] as const)("ear %s → %s in %s", (ear, base, color) => {
    expect(speechSymbol(axes({ ear }))).toMatchObject({ kind: "speech", base, color });
  });

  // ISO 8253-3:2022, table C.3, one row per test condition.
  it.each([
    ["without competing noise", {}, {}],
    ["contralateral masking", { masked: true }, { masked: true }],
    ["competing noise", { competing_noise: true }, { competing_noise: true }],
    [
      "sound field, competing noise",
      { transducer: "sound_field", competing_noise: true },
      { sound_field: true, competing_noise: true, aided: false },
    ],
    ["aided, device 1", aidedSoundField, { sound_field: true, aided: true, device: null }],
    ["aided, device 2", { ...aidedSoundField, device: 2 }, { aided: true, device: 2 }],
    [
      "aided, device 2, material a",
      { ...aidedSoundField, device: 2, material: "a" },
      { device: 2, material: "a" },
    ],
  ] as const)("%s", (_, fields, expected) => {
    expect(speechSymbol(axes(fields))).toMatchObject(expected);
  });

  it("composes masking with the sound field", () => {
    expect(speechSymbol(axes({ ...aidedSoundField, masked: true }))).toMatchObject({
      masked: true,
      sound_field: true,
      aided: true,
    });
  });

  it("numbers unaided measurements with no device", () => {
    expect(speechSymbol(axes({ device: 3 }))?.device).toBeNull();
  });

  it.each([
    ["binaural masking", { ear: null, masked: true }],
    ["aided under earphones", { aided: aids }],
    ["device 0", { ...aidedSoundField, device: 0 }],
    ["fractional device", { ...aidedSoundField, device: 1.5 }],
    ["capital material letter", { material: "A" }],
    ["several material letters", { material: "ab" }],
  ] as const)("has no symbol for %s", (_, fields) => {
    expect(speechSymbol(axes(fields))).toBeNull();
  });
});

describe("symbolSvg, speech", () => {
  const svg = (fields: Partial<SpeechAxes>, background?: string | null) =>
    symbolSvg(speechSymbol(axes(fields))!, { background });

  it("draws O and X with the earphone outlines, B as a letter", () => {
    expect(svg({})).toContain('d="M6 0A6 6 0 1 0-6 0A6 6 0 1 0 6 0"');
    expect(svg({ ear: "left" })).toContain('d="M-5-5L5 5M-5 5L5-5"');
    expect(svg({ ear: null })).toContain(">B</text>");
  });

  it("adds each ISO modifier", () => {
    expect(svg({ masked: true })).toContain(
      `d="${SPEECH_MARKS.masked_O}" fill="${SIDE_COLORS.light.red}"`,
    );
    expect(svg({ ear: "left", competing_noise: true })).toContain(`d="${SPEECH_MARKS.noise_X}"`);
    expect(svg({ ear: null, transducer: "sound_field" })).toContain(
      `d="${SPEECH_MARKS.sound_field_B}"`,
    );
    expect(svg({ ...aidedSoundField }, "#000")).toContain(`d="${AIDED_DIAMOND}" fill="#000"`);
  });

  it("writes the device number at the right and the material letter at the left", () => {
    const s = svg({ ...aidedSoundField, device: 2, material: "b" });
    expect(s).toMatch(/text-anchor="start">2<\/text>/);
    expect(s).toMatch(/text-anchor="end">b<\/text>/);
  });

  it("haloes labels only outside the diamond", () => {
    const halo = /paint-order="stroke"[^>]*>a<\/text>/;
    expect(svg({ material: "a" })).toMatch(halo);
    expect(svg({ ...aidedSoundField, material: "a" })).not.toMatch(halo);
  });
});
