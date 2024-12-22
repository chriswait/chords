export type InstrumentName = "guitar" | "ukulele";
export type InstrumentWithTunings = Instrument["main"] & {
  tunings: Instrument["tunings"];
};
