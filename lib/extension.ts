/**
 * Extension of the ASHA 1990 system to the measurements it does not cover.
 * For aided conditions, ASHA asks for "locally determined symbols that are
 * exclusive of any other symbols", defined on the audiogram.
 *
 * - Letters: `A` aided threshold, `M`/`MA` unaided/aided MCL, `U`/`UA`
 *   unaided/aided UCL, `B` diotic presentation under earphones.
 * - Subscript: right or left aid only; for a CROS or BiCROS, the receiver
 *   side followed by `M` for the contralateral transmitter. No subscript with
 *   two hearing aids.
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
import { isAided, type Aided, type Ear, type SymbolAxes } from "./types.js";

export type ExtensionLetter = "B" | "A" | "M" | "MA" | "U" | "UA";

/** Aids worn, when the subscript must name them. */
export type AidIndex = "right" | "left" | "right_cros" | "left_cros";

export type Locale = "fr" | "en" | "de" | "es" | "it" | "pt";

/**
 * Subscript letters, the initial of the side in each language; `M` (the CROS
 * transmitter's microphone) is shared by all. `right_cros` = right receiver,
 * left transmitter.
 */
export const AID_INDEX_LETTERS: Record<Locale, Record<AidIndex, string>> = {
  fr: { right: "D", left: "G", right_cros: "DM", left_cros: "GM" },
  en: { right: "R", left: "L", right_cros: "RM", left_cros: "LM" },
  de: { right: "R", left: "L", right_cros: "RM", left_cros: "LM" },
  es: { right: "D", left: "I", right_cros: "DM", left_cros: "IM" },
  it: { right: "D", left: "S", right_cros: "DM", left_cros: "SM" },
  pt: { right: "D", left: "E", right_cros: "DM", left_cros: "EM" },
};

export type ExtensionSymbol = {
  letter: ExtensionLetter;
  /** null: two hearing aids, or unaided. */
  aid_index: AidIndex | null;
  /** Stimulated side; null: not lateralised. */
  ear: Ear | null;
  color: SideColor;
  no_response_arrow: NoResponseArrow | null;
};

export type AudiogramSymbol =
  | ({ kind: "asha" } & AshaSymbol)
  | ({ kind: "extension" } & ExtensionSymbol);

const aidIndex = ({ right, left }: Aided): AidIndex | null => {
  if (left === "cros_transmitter") return "right_cros";
  if (right === "cros_transmitter") return "left_cros";
  return right && left ? null : right ? "right" : left ? "left" : null;
};

const extensionLetter = (m: SymbolAxes, aided: boolean): ExtensionLetter | null => {
  if (m.measure === "mcl") return aided ? "MA" : "M";
  if (m.measure === "ucl") return aided ? "UA" : "U";
  if (aided) return "A";
  return m.transducer === "earphones" && m.ear === null ? "B" : null;
};

/** Symbol of a pure-tone measurement: ASHA when defined, else the extension; null when neither covers it. */
export const audiogramSymbol = (m: SymbolAxes): AudiogramSymbol | null => {
  const asha = ashaSymbol(m);
  if (asha) return { kind: "asha", ...asha };
  const letter = extensionLetter(m, isAided(m.aided));
  if (!letter) return null;
  return {
    kind: "extension",
    letter,
    aid_index: aidIndex(m.aided),
    ear: m.ear,
    color: sideColor(m.ear),
    no_response_arrow: m.no_response ? noResponseArrow(m.ear) : null,
  };
};
