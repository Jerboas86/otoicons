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
};

export const isAided = (a: Aided): boolean => a.right !== null || a.left !== null;
