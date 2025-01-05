// Dialog Scrolling
// Allow switching chord positions in chord book?
// Drag+Drop into sections

import { useEffect, useState } from "react";
import guitar from "@tombatossals/chords-db/lib/guitar";
import ukulele from "@tombatossals/chords-db/lib/ukulele";
import Chord from "@tombatossals/react-chords/lib/Chord";
import useBreakpoint from "use-breakpoint";

import { InstrumentName, InstrumentWithTunings } from "./types";
import ChordPositions from "./ChordPositions";
import Button from "./Button";
import {
  BREAKPOINTS,
  DEFAULT_CHORD_TYPES,
  ENHARMONICS,
  HEADER_FLEX_STYLE,
  SPACING,
  titleCaseString,
} from "./util";
import ChordsGrid from "./ChordsGrid";

const instruments: Record<InstrumentName, Instrument> = { ukulele, guitar };

function App() {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "xl");

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
  const rootReplaced = root.replace("#", "sharp");
  useEffect(() => {
    // When we change instruments, if the root doesn't exist swap for the enharmonic one
    if (!Object.keys(selectedInstrument.chords).includes(rootReplaced)) {
      setRoot(ENHARMONICS[root]);
    }
  }, [root, rootReplaced, selectedInstrument]);
  const selectedChords = selectedInstrument.chords[rootReplaced];

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
            position: "fixed",
            right: SPACING,
            zIndex: 1,
            ...(breakpoint === "xs" || breakpoint === "sm"
              ? { bottom: SPACING * 2 }
              : { top: SPACING * 2 }),
          }}
        >
          Show Book ({chordBook.length})
        </Button>
        <div
          style={{
            display: "grid",
            ...(breakpoint === "xs" || breakpoint === "sm"
              ? { textAlign: "center", rowGap: SPACING * 2 }
              : {
                  gridTemplateColumns: "140px auto",
                  gridTemplateRows: "repeat(3, auto)",
                  alignItems: "flex-start",
                  rowGap: SPACING * 3,
                }),
            columnGap: SPACING * 2,
          }}
        >
          <h2>Instrument</h2>
          <div
            style={{
              ...HEADER_FLEX_STYLE(breakpoint),
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
              ...HEADER_FLEX_STYLE(breakpoint),
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
              ...HEADER_FLEX_STYLE(breakpoint),
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
            ?.filter((chord) => chordTypes.includes(chord.suffix))
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
