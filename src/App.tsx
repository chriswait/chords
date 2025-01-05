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

const Container = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: SPACING * 4 }}>{children}</div>
);

const ChordHeading = ({ chord }: { chord: Chord }) => (
  <h2 style={{ textAlign: "center", fontSize: 32 }}>
    {chord.key}
    <span style={{ fontSize: 20 }}>{chord.suffix}</span>
  </h2>
);

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
      <Button
        disabled={!showChordBook && chordBook.length === 0}
        onClick={() => setShowChordBook(!showChordBook)}
        secondary
        style={{
          position: "fixed",
          right: SPACING,
          zIndex: 1,
          ...(breakpoint === "xs" || breakpoint === "sm"
            ? { bottom: SPACING * 2 }
            : { top: SPACING * 2 }),
        }}
      >
        {!showChordBook ? `Show Book (${chordBook.length})` : "Close"}
      </Button>
      {!showChordBook ? (
        <main>
          <Container>
            <header style={{ marginBottom: SPACING * 4 }}>
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
                <h2>Chords</h2>
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
                  <Button
                    text
                    onClick={() => setShowAllChordTypes(!showAllChordTypes)}
                  >
                    {showAllChordTypes ? "Less" : "More"}
                  </Button>
                </div>
              </div>
            </header>
            <ChordsGrid>
              {selectedChords
                ?.filter((chord) => chordTypes.includes(chord.suffix))
                .map((chord) => {
                  return (
                    <div key={chord.key + chord.suffix}>
                      <ChordHeading chord={chord} />
                      <ChordPositions
                        chord={chord}
                        instrumentWithTunings={instrumentWithTunings}
                        handleAddToBook={(chord, positionIndex) => {
                          setChordBook([
                            ...chordBook,
                            { chord, positionIndex },
                          ]);
                        }}
                        chordPositionIsInBook={chordPositionIsInBook}
                      />
                    </div>
                  );
                })}
            </ChordsGrid>
          </Container>
        </main>
      ) : (
        <dialog open style={{ width: "100%" }}>
          <Container>
            <h1 style={{ marginBottom: SPACING * 2 }}>Chord Book</h1>
            <ChordsGrid>
              {chordBook.map(({ chord, positionIndex }, index) => (
                <div
                  key={`${chord.key}-${chord.suffix}-${positionIndex}-${index}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ChordHeading chord={chord} />
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
          </Container>
        </dialog>
      )}
    </>
  );
}

export default App;
