import { useState } from "react";
import Chord from "@tombatossals/react-chords/lib/Chord";

import { InstrumentWithTunings } from "./types";
import Left from "./assets/left.svg?react";
import Right from "./assets/right.svg?react";
import { ARROW_BUTTON_STYLE, SPACING } from "./util";
import Button from "./Button";

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
    <>
      <div style={{ position: "relative" }}>
        <button
          style={{
            ...ARROW_BUTTON_STYLE,
            left: SPACING / 2,
          }}
          onClick={() => setIndex(index - 1)}
          disabled={index <= 0}
        >
          <Left />
        </button>
        <Chord
          chord={chord.positions[index]}
          instrument={instrumentWithTunings}
          lite
        />
        <button
          style={{
            ...ARROW_BUTTON_STYLE,
            right: SPACING,
          }}
          onClick={() => setIndex(index + 1)}
          disabled={index >= chord.positions.length - 1}
        >
          <Right />
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={() => handleAddToBook(chord, index)}
          disabled={chordPositionIsInBook(chord, index)}
        >
          Add
        </Button>
      </div>
    </>
  );
};

export default ChordPositions;
