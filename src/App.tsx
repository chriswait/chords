// TODO:
// - visual design
// - add chord to book

import { useState } from "react";
import guitar from "@tombatossals/chords-db/lib/guitar";
import ukulele from "@tombatossals/chords-db/lib/ukulele";
import Chord from "@tombatossals/react-chords/lib/Chord";
import useBreakpoint from "use-breakpoint";

import { InstrumentName, InstrumentWithTunings } from "./types";
import ChordOptions from "./ChordOptions";
import { titleCaseString } from "./util";

const BREAKPOINTS = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };

const instruments: Record<InstrumentName, Instrument> = { ukulele, guitar };

const DEFAULT_CHORD_TYPES = ["major", "minor", "maj7", "7", "m7"];

const ChordsGrid = ({ children }: { children: React.ReactNode }) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "xl");
  return (
    <div
      style={{
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
        columnGap: 20,
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
  console.log(chordBook);

  return (
    <>
      <button onClick={() => setShowChordBook(true)}>Show Book</button>
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "120px auto",
          gridTemplateRows: "repeat(3, auto)",
          alignItems: "center",
          gap: 10,
          marginBottom: 40,
        }}
      >
        <h2>Instrument</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {(Object.keys(instruments) as InstrumentName[]).map(
            (eachInstrumentName) => (
              <button
                key={eachInstrumentName}
                onClick={() => setInstrumentName(eachInstrumentName)}
                style={
                  instrumentName === eachInstrumentName
                    ? { fontWeight: "bold" }
                    : {}
                }
              >
                {titleCaseString(eachInstrumentName)}
              </button>
            )
          )}
        </div>
        <h2>Root</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {selectedInstrument.keys.map((keyRoot: string) => (
            <button
              key={keyRoot}
              onClick={() => setRoot(keyRoot)}
              style={root === keyRoot ? { fontWeight: "bold" } : {}}
            >
              {keyRoot}
            </button>
          ))}
        </div>
        <h2>Types</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {(showAllChordTypes ? selectedInstrument.suffixes : chordTypes).map(
            (suffix: string) => (
              <button
                key={suffix}
                onClick={() =>
                  setChordTypes(
                    chordTypes.includes(suffix)
                      ? [...chordTypes.filter((type) => type !== suffix)]
                      : [...chordTypes, suffix]
                  )
                }
                style={
                  chordTypes.includes(suffix) ? { fontWeight: "bold" } : {}
                }
              >
                {suffix}
              </button>
            )
          )}
          {showAllChordTypes ? (
            <button onClick={() => setShowAllChordTypes(false)}>Less</button>
          ) : (
            <button onClick={() => setShowAllChordTypes(true)}>More</button>
          )}
        </div>
      </header>
      <main>
        <ChordsGrid>
          {selectedChords
            .filter((chord) => chordTypes.includes(chord.suffix))
            .map((chord) => {
              return (
                <div key={chord.key + chord.suffix}>
                  <h2 style={{ textAlign: "center" }}>
                    {chord.key}
                    <span style={{ fontSize: 16, color: "#333333" }}>
                      {chord.suffix}
                    </span>
                  </h2>
                  <ChordOptions
                    chord={chord}
                    instrumentWithTunings={instrumentWithTunings}
                    handleAddToBook={(chord, positionIndex) => {
                      setChordBook([...chordBook, { chord, positionIndex }]);
                    }}
                  />
                </div>
              );
            })}
        </ChordsGrid>
      </main>
      <dialog open={showChordBook} style={{ top: 0, width: "100%" }}>
        <h1>Chord Book</h1>
        <button onClick={() => setShowChordBook(false)}>Close</button>
        <ChordsGrid>
          {chordBook.map(({ chord, positionIndex }, index) => (
            <div key={`${chord.key}-${chord.suffix}-${positionIndex}-${index}`}>
              <h2 style={{ textAlign: "center" }}>
                {chord.key}
                <span style={{ fontSize: 16, color: "#333333" }}>
                  {chord.suffix}
                </span>
              </h2>
              <Chord
                chord={chord.positions[positionIndex]}
                instrument={instrumentWithTunings}
                lite
              />
              <button
                onClick={() =>
                  setChordBook(
                    chordBook.filter((_, bookIndex) => index !== bookIndex)
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </ChordsGrid>
      </dialog>
    </>
  );
}

export default App;
