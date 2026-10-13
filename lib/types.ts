/**
 * Semantic axes of a pure-tone measurement: the only fields that determine its
 * symbol. A measurement may carry much more (level, frequency, masking
 * level…); any object holding these fields will do.
 */

export type Ear = "right" | "left";

/** Transducer placement; per ASHA, symbols represent it, not the ear that responds. */
export type Transducer = "earphones" | "bone_mastoid" | "bone_forehead" | "sound_field";

export type ToneMeasure = "threshold" | "mcl" | "ucl";

/**
 * Device worn on one side. A CROS pairs a transmitter (on the side of the ear
 * that cannot be aided) with a receiver on the other side; a BiCROS pairs a
 * transmitter with a hearing aid.
 */
export type AidDevice = "hearing_aid" | "cros_transmitter" | "cros_receiver";

export type Aided = { right: AidDevice | null; left: AidDevice | null };

export type SymbolAxes = {
  measure: ToneMeasure;
  transducer: Transducer;
  /** Stimulated side; null: not lateralised (sound field, diotic presentation…). */
  ear: Ear | null;
  masked: boolean;
  no_response: boolean;
  aided: Aided;
  /** Number of the device or fitting worn, defined on the audiogram; 1 by default. */
  device?: number;
};

export const isAided = (a: Aided): boolean => a.right !== null || a.left !== null;

/**
 * Aided marking shared by pure-tone and speech symbols, after ISO 8253-3: a
 * diamond around the symbol, and the device number at its right from the
 * second device on.
 */
export type AidMark = {
  aided: boolean;
  /** Device number, drawn from 2 on; null: unaided or first device. */
  device: number | null;
};

/** Aided marking of a measurement; null when aided under earphones or the device number is not an integer ≥ 1. */
export const aidMark = (m: {
  transducer: string;
  aided: Aided;
  device?: number;
}): AidMark | null => {
  const aided = isAided(m.aided);
  const device = m.device ?? 1;
  if (!Number.isInteger(device) || device < 1) return null;
  if (aided && m.transducer !== "sound_field") return null;
  return { aided, device: aided && device > 1 ? device : null };
};

/**
 * Semantic axes of a speech audiometry measurement (one point of the speech
 * audiogram, score versus level or SNR): the fields that determine its symbol
 * in ISO 8253-3:2022, table C.3.
 */
export type SpeechAxes = {
  /** ISO 8253-3 defines no symbol for bone-conducted speech. */
  transducer: "earphones" | "sound_field";
  /** Listening ear; null: binaural (diotic or dichotic). */
  ear: Ear | null;
  /** Contralateral masking; monaural listening only. */
  masked: boolean;
  competing_noise: boolean;
  /** Aided in the sound field when any device is worn. */
  aided: Aided;
  /** Number of the device or fitting worn, defined on the audiogram; 1 by default. */
  device?: number;
  /** Lowercase letter of the speech material, defined on the audiogram. */
  material?: string | null;
};
