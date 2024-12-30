import { useState } from "react";
import guitar from "@tombatossals/chords-db/lib/guitar";
import ukulele from "@tombatossals/chords-db/lib/ukulele";
import Chord from "@tombatossals/react-chords/lib/Chord";
import useBreakpoint from "use-breakpoint";

import { InstrumentName, InstrumentWithTunings } from "./types";
import ChordPositions from "./ChordPositions";
import Button from "./Button";
import { CARD_STYLE, SPACING, titleCaseString } from "./util";

const BREAKPOINTS = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };

const instruments: Record<InstrumentName, Instrument> = { ukulele, guitar };

const DEFAULT_CHORD_TYPES = ["major", "minor", "maj7", "7", "m7"];

const ChordsGrid = ({ children }: { children: React.ReactNode }) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "xl");
  return (
    <div
      style={{
        ...CARD_STYLE,
        margin: SPACING * 2,
        padding: SPACING * 2,
        display: "grid",
        gridTemplateColumns: `repeat(${
          breakpoint === "xs"
            ? 1
            : breakpoint === "sm"
            ? 2
            : breakpoint === "md"
            ? 3
            : breakpoint === "lg"
            ? 4
            : 6
        }, 1fr)`,
        gap: SPACING * 2,
      }}
    >
      {children}
    </div>
  );
};

function App() {
  const [instrumentName, setInstrumentName] =
    useState<InstrumentName>("ukulele");
  const selectedInstrument = instruments[instrumentName];

  const instrumentWithTunings: InstrumentWithTunings = Object.assign(
    selectedInstrument.main,
    {
      tunings: selectedInstrument.tunings,
    }
  );
  const [root, setRoot] = useState("C");
  const selectedChords = selectedInstrument.chords[root];

  const [showAllChordTypes, setShowAllChordTypes] = useState(false);
  const [chordTypes, setChordTypes] = useState(DEFAULT_CHORD_TYPES);

  const [chordBook, setChordBook] = useState<
    { chord: Chord; positionIndex: number }[]
  >([]);
  const [showChordBook, setShowChordBook] = useState(false);
  const chordPositionIsInBook = (newChord: Chord, newPositionIndex: number) => {
    return !!chordBook.find(
      ({ chord, positionIndex }) =>
        chord.key === newChord.key &&
        chord.suffix === newChord.suffix &&
        positionIndex === newPositionIndex
    );
  };

  return (
    <>
      <header
        style={{
          marginBottom: SPACING * 2,
          padding: SPACING * 2,
        }}
      >
        <Button
          onClick={() => setShowChordBook(true)}
          style={{
            marginBottom: SPACING,
            position: "fixed",
            right: 10,
            top: 10,
          }}
        >
          Show Book ({chordBook.length})
        </Button>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px auto",
            gridTemplateRows: "repeat(3, auto)",
            alignItems: "center",
            columnGap: 20,
            rowGap: 26,
          }}
        >
          <h2>Instrument</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: SPACING,
            }}
          >
            {(Object.keys(instruments) as InstrumentName[]).map(
              (eachInstrumentName) => (
                <Button
                  key={eachInstrumentName}
                  onClick={() => setInstrumentName(eachInstrumentName)}
                  isSelected={instrumentName === eachInstrumentName}
                >
                  {titleCaseString(eachInstrumentName)}
                </Button>
              )
            )}
          </div>
          <h2>Root</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: SPACING,
            }}
          >
            {selectedInstrument.keys.map((keyRoot: string) => (
              <Button
                key={keyRoot}
                onClick={() => setRoot(keyRoot)}
                isSelected={root === keyRoot}
              >
                {keyRoot}
              </Button>
            ))}
          </div>
          <h2>Types</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: SPACING,
            }}
          >
            {(showAllChordTypes
              ? selectedInstrument.suffixes
              : DEFAULT_CHORD_TYPES
            ).map((suffix: string) => (
              <Button
                key={suffix}
                onClick={() =>
                  setChordTypes(
                    chordTypes.includes(suffix)
                      ? [...chordTypes.filter((type) => type !== suffix)]
                      : [...chordTypes, suffix]
                  )
                }
                isSelected={chordTypes.includes(suffix)}
              >
                {suffix}
              </Button>
            ))}
            {showAllChordTypes ? (
              <Button onClick={() => setShowAllChordTypes(false)}>Less</Button>
            ) : (
              <Button onClick={() => setShowAllChordTypes(true)}>More</Button>
            )}
          </div>
        </div>
      </header>
      <main>
        <ChordsGrid>
          {selectedChords
            .filter((chord) => chordTypes.includes(chord.suffix))
            .map((chord) => {
              return (
                <div
                  key={chord.key + chord.suffix}
                  style={{
                    padding: SPACING,
                  }}
                >
                  <h2 style={{ textAlign: "center", fontSize: 32 }}>
                    {chord.key}
                    <span style={{ fontSize: 20 }}>{chord.suffix}</span>
                  </h2>
                  <ChordPositions
                    chord={chord}
                    instrumentWithTunings={instrumentWithTunings}
                    handleAddToBook={(chord, positionIndex) => {
                      setChordBook([...chordBook, { chord, positionIndex }]);
                    }}
                    chordPositionIsInBook={chordPositionIsInBook}
                  />
                </div>
              );
            })}
        </ChordsGrid>
      </main>
      <dialog
        open={showChordBook}
        style={{ top: 0, width: "100%", height: "100vh" }}
      >
        <h1>Chord Book</h1>
        <Button
          style={{
            position: "absolute",
            right: SPACING * 2,
            top: SPACING * 2,
          }}
          onClick={() => setShowChordBook(false)}
        >
          Close
        </Button>
        <ChordsGrid>
          {chordBook.map(({ chord, positionIndex }, index) => (
            <div key={`${chord.key}-${chord.suffix}-${positionIndex}-${index}`}>
              <h2 style={{ textAlign: "center" }}>
                {chord.key}
                <span style={{ fontSize: 18 }}>{chord.suffix}</span>
              </h2>
              <Chord
                chord={chord.positions[positionIndex]}
                instrument={instrumentWithTunings}
                lite
              />
              <Button
                onClick={() =>
                  setChordBook(
                    chordBook.filter((_, bookIndex) => index !== bookIndex)
                  )
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </ChordsGrid>
      </dialog>
    </>
  );
}

export default App;
