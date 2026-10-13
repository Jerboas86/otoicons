/**
 * Speech audiometry symbols, ISO 8253-3:2022, clause 14 and table C.3, for
 * the speech audiogram (score versus speech level or SNR).
 *
 * - Base: `O` right ear, `X` left ear, `B` binaural (diotic or dichotic),
 *   after ISO 8253-2. `O` and `X` share their outline with the ASHA
 *   earphone symbols, `B` with the diotic letter of the extension.
 * - Modifiers: filled triangle at the top, contralateral masking (never
 *   binaural); line below, competing noise; line above, sound field;
 *   diamond around the symbol, hearing aid, with the device number from the
 *   second device on, at the right; letter of the speech material at the
 *   left. Numbers and letters are defined on the audiogram.
 *
 * Unlike ASHA (△, □), masking is a filled triangle: the standard says so.
 * Colour follows the listening side, as for pure tones.
 */

import { sideColor, type SideColor } from "./asha.js";
import { isAided, type Ear, type SpeechAxes } from "./types.js";

export type SpeechBase = "O" | "X" | "B";

export type SpeechSymbol = {
  kind: "speech";
  base: SpeechBase;
  /** Listening ear; null: binaural. */
  ear: Ear | null;
  color: SideColor;
  masked: boolean;
  competing_noise: boolean;
  sound_field: boolean;
  aided: boolean;
  /** Device number, drawn from 2 on; null: unaided or first device. */
  device: number | null;
  /** Letter of the speech material; null: none. */
  material: string | null;
};

/** Speech audiogram symbol; null for the conditions ISO 8253-3 excludes. */
export const speechSymbol = (m: SpeechAxes): SpeechSymbol | null => {
  const aided = isAided(m.aided);
  const sound_field = m.transducer === "sound_field";
  const device = m.device ?? 1;
  const material = m.material ?? null;
  if (m.masked && m.ear === null) return null;
  if (aided && !sound_field) return null;
  if (!Number.isInteger(device) || device < 1) return null;
  if (material !== null && !/^[a-z]$/.test(material)) return null;
  return {
    kind: "speech",
    base: m.ear === "right" ? "O" : m.ear === "left" ? "X" : "B",
    ear: m.ear,
    color: sideColor(m.ear),
    masked: m.masked,
    competing_noise: m.competing_noise,
    sound_field,
    aided,
    device: aided && device > 1 ? device : null,
    material,
  };
};
