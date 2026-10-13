/**
 * Extension of the ASHA 1990 system to the measurements it does not cover.
 * For aided conditions, ASHA asks for "locally determined symbols that are
 * exclusive of any other symbols", defined on the audiogram: we take them from
 * ISO 8253-3, as for speech.
 *
 * - Aided: the symbol of the unaided measurement in a diamond (an aided
 *   threshold is the ASHA sound-field symbol of the ear); from the second
 *   device or fitting on, its number at the right, defined on the audiogram.
 * - Letters: `M` MCL, `U` UCL, `B` diotic presentation under earphones (the
 *   binaural `B` of ISO 8253-3).
 *
 * As with ASHA, colour and no-response arrow follow the stimulated side.
 */

import {
  ashaSymbol,
  noResponseArrow,
  sideColor,
  type AshaSymbol,
  type NoResponseArrow,
  type SideColor,
} from "./asha.js";
import { aidMark, type AidMark, type Ear, type SymbolAxes } from "./types.js";

export type ExtensionLetter = "B" | "M" | "U";

export type ExtensionSymbol = {
  letter: ExtensionLetter;
  /** Stimulated side; null: not lateralised. */
  ear: Ear | null;
  color: SideColor;
  no_response_arrow: NoResponseArrow | null;
};

export type AudiogramSymbol =
  | ({ kind: "asha" } & AshaSymbol & AidMark)
  | ({ kind: "extension" } & ExtensionSymbol & AidMark);

const UNAIDED = { right: null, left: null };

const extensionLetter = (m: SymbolAxes): ExtensionLetter | null => {
  if (m.measure === "mcl") return "M";
  if (m.measure === "ucl") return "U";
  return m.transducer === "earphones" && m.ear === null ? "B" : null;
};

/**
 * Symbol of a pure-tone measurement: ASHA when defined (in a diamond when
 * aided), else the extension; null when neither covers it.
 */
export const audiogramSymbol = (m: SymbolAxes): AudiogramSymbol | null => {
  const aid = aidMark(m);
  if (!aid) return null;
  const asha = m.measure === "threshold" && ashaSymbol({ ...m, aided: UNAIDED });
  if (asha) return { kind: "asha", ...asha, ...aid };
  const letter = extensionLetter(m);
  if (!letter) return null;
  return {
    kind: "extension",
    letter,
    ear: m.ear,
    color: sideColor(m.ear),
    no_response_arrow: m.no_response ? noResponseArrow(m.ear) : null,
    ...aid,
  };
};
