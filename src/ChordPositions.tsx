import { useState } from "react";
import Chord from "@tombatossals/react-chords/lib/Chord";

import { InstrumentWithTunings } from "./types";

type ChordPositionsProps = {
  chord: Chord;
  instrumentWithTunings: InstrumentWithTunings;
  handleAddToBook: (chord: Chord, positionIndex: number) => void;
  chordPositionIsInBook: (newChord: Chord, newPositionIndex: number) => boolean;
};

const ChordPositions = ({
  chord,
  instrumentWithTunings,
  handleAddToBook,
  chordPositionIsInBook,
}: ChordPositionsProps) => {
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
      <button
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={() => handleAddToBook(chord, index)}
        disabled={chordPositionIsInBook(chord, index)}
      >
        Add
      </button>
    </div>
  );
};

export default ChordPositions;
