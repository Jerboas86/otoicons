import {
  ASHA_GLYPHS,
  ashaSymbol,
  audiogramSymbol,
  noResponseArrowPath,
  sideColor,
  type SymbolAxes,
} from "./index.js";

const axes = (fields: Partial<SymbolAxes> = {}): SymbolAxes => ({
  measure: "threshold",
  transducer: "earphones",
  ear: "right",
  masked: false,
  no_response: false,
  aided: { right: null, left: null },
  ...fields,
});
const soundField = { transducer: "sound_field", ear: null } as const;
const aid = "hearing_aid" as const;

describe("ashaSymbol", () => {
  it.each([
    ["earphones", "right", false, "O"],
    ["earphones", "left", false, "X"],
    ["earphones", "right", true, "△"],
    ["earphones", "left", true, "□"],
    ["bone_mastoid", "right", false, "<"],
    ["bone_mastoid", "left", false, ">"],
    ["bone_mastoid", null, false, "^"],
    ["bone_mastoid", "right", true, "["],
    ["bone_mastoid", "left", true, "]"],
    ["bone_forehead", null, false, "v"],
    ["bone_forehead", "right", false, "v"],
    ["bone_forehead", "right", true, "┐"],
    ["bone_forehead", "left", true, "┌"],
    ["sound_field", null, false, "S"],
    ["sound_field", "right", false, "Ø"],
    ["sound_field", "left", false, "*"],
  ] as const)("%s, ear %s, masked %s → %s", (transducer, ear, masked, glyph) => {
    expect(ASHA_GLYPHS[ashaSymbol(axes({ transducer, ear, masked }))!.shape]).toBe(glyph);
  });

  it("points the no-response arrow away from the ear, straight down when unspecified", () => {
    const arrow = (fields: Partial<SymbolAxes>) =>
      ashaSymbol(axes({ no_response: true, ...fields }))?.no_response_arrow;
    expect(arrow({ ear: "right" })).toBe("down_left");
    expect(arrow({ ear: "left" })).toBe("down_right");
    expect(arrow(soundField)).toBe("down");
    expect(arrow({ transducer: "bone_forehead", ear: "left" })).toBe("down");
    expect(ashaSymbol(axes())?.no_response_arrow).toBeNull();
  });

  it("starts the no-response arrow at the given anchor", () => {
    expect(noResponseArrowPath("down_left", [-4, 6])).toBe("M-4 6L-11 13M-11 8.5V13H-6.5");
    expect(noResponseArrowPath("down_right", [5, 5])).toBe("M5 5L12 12M12 7.5V12H7.5");
    expect(noResponseArrowPath("down", [0, 4])).toBe("M0 4V13M-3.5 9.5L0 13L3.5 9.5");
  });

  it("colours right red, left blue, non-lateralised green", () => {
    expect([sideColor("right"), sideColor("left"), sideColor(null)]).toEqual([
      "red",
      "blue",
      "green",
    ]);
    expect(ashaSymbol(axes({ ear: "left" }))?.color).toBe("blue");
  });

  it.each([
    ["diotic earphones", { ear: null }],
    ["MCL", { measure: "mcl" }],
    ["UCL", { measure: "ucl" }],
    ["aided threshold", { ...soundField, aided: { right: aid, left: null } }],
  ] as const)("has no ASHA symbol for %s", (_, fields) => {
    expect(ashaSymbol(axes(fields))).toBeNull();
  });
});

describe("audiogramSymbol", () => {
  it("uses the ASHA symbol when there is one, unaided", () => {
    expect(audiogramSymbol(axes())).toMatchObject({
      kind: "asha",
      shape: "ac_right",
      aided: false,
      device: null,
    });
  });

  it.each([
    ["diotic earphones", { ear: null }, "B"],
    ["MCL", { measure: "mcl" }, "M"],
    ["aided MCL", { measure: "mcl", ...soundField, aided: { right: null, left: aid } }, "M"],
    ["UCL", { measure: "ucl", ear: "left" }, "U"],
    ["aided UCL", { measure: "ucl", ...soundField, aided: { right: aid, left: null } }, "U"],
  ] as const)("%s → %s", (_, fields, letter) => {
    expect(audiogramSymbol(axes(fields))).toMatchObject({ kind: "extension", letter });
  });

  it.each([
    [null, "sf_unspecified"],
    ["right", "sf_right"],
    ["left", "sf_left"],
  ] as const)("draws an aided threshold, ear %s, as %s in a diamond", (ear, shape) => {
    expect(
      audiogramSymbol(axes({ ...soundField, ear, aided: { right: aid, left: aid } })),
    ).toMatchObject({ kind: "asha", shape, aided: true, device: null });
  });

  it("marks aided MCL and UCL like aided thresholds", () => {
    expect(
      audiogramSymbol(axes({ measure: "mcl", ...soundField, aided: { right: aid, left: null } })),
    ).toMatchObject({ aided: true });
    expect(audiogramSymbol(axes({ measure: "mcl" }))).toMatchObject({ aided: false });
  });

  it("numbers the device from the second one on", () => {
    const aided = (device?: number) =>
      audiogramSymbol(axes({ ...soundField, aided: { right: aid, left: null }, device }));
    expect(aided()?.device).toBeNull();
    expect(aided(1)?.device).toBeNull();
    expect(aided(3)?.device).toBe(3);
    expect(audiogramSymbol(axes({ device: 2 }))?.device).toBeNull();
  });

  it.each([
    ["aided under earphones", { aided: { right: aid, left: null } }],
    ["device 0", { ...soundField, aided: { right: aid, left: null }, device: 0 }],
    ["fractional device", { ...soundField, aided: { right: aid, left: null }, device: 2.5 }],
  ] as const)("has no symbol for %s", (_, fields) => {
    expect(audiogramSymbol(axes(fields))).toBeNull();
  });

  it("takes colour and arrow from the stimulated ear, not the aids worn", () => {
    const aided = (ear: "right" | "left" | null) =>
      audiogramSymbol(
        axes({ ...soundField, ear, no_response: true, aided: { right: aid, left: null } }),
      );
    expect(aided(null)).toMatchObject({ ear: null, color: "green", no_response_arrow: "down" });
    expect(aided("left")).toMatchObject({ color: "blue", no_response_arrow: "down_right" });
  });
});
