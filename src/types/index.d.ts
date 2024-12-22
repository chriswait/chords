declare module "@tombatossals/react-chords/lib/Chord";

type Position = {
  frets: number[];
  fingers: number[];
  baseFret: number;
  barrest: number[];
  midi: number[];
};

type Chord = {
  key: string;
  suffix: string;
  positions: Position[];
};

type Instrument = {
  main: {
    strings: number;
    fretsOnChord: number;
    name: string;
    numberOfChords: number;
  };
  tunings: Record<string, string[]>;
  keys: string[];
  suffixes: string[];
  chords: Record<string, Chord[]>;
};

declare module "@tombatossals/chords-db/lib/guitar" {
  let guitar: Instrument;
  export = guitar;
}

declare module "@tombatossals/chords-db/lib/ukulele" {
  let ukulele: Instrument;
  export = ukulele;
}
