import { useState } from "react";
import Chord from "@tombatossals/react-chords/lib/Chord";

import { InstrumentWithTunings } from "./types";

type ChordOptionsProps = {
  chord: Chord;
  instrumentWithTunings: InstrumentWithTunings;
};

const ChordOptions = ({ chord, instrumentWithTunings }: ChordOptionsProps) => {
  const [index, setIndex] = useState(0);
  return (
    <div style={{ position: "relative" }}>
      <button
        style={{ position: "absolute", top: "45%", left: 10 }}
        onClick={() => setIndex(index - 1)}
        disabled={index <= 0}
      >
        prev
      </button>
      <Chord
        chord={chord.positions[index]}
        instrument={instrumentWithTunings}
        lite
      />
      <button
        style={{ position: "absolute", top: "45%", right: 10 }}
        onClick={() => setIndex(index + 1)}
        disabled={index >= chord.positions.length - 1}
      >
        next
      </button>
    </div>
  );
};

export default ChordOptions;
