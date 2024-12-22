// TODO:
// - visual design
// - add chord to book

import { useState } from "react";
import guitar from "@tombatossals/chords-db/lib/guitar";
import ukulele from "@tombatossals/chords-db/lib/ukulele";
import useBreakpoint from "use-breakpoint";

import { InstrumentName, InstrumentWithTunings } from "./types";
import ChordOptions from "./ChordOptions";
import { titleCaseString } from "./util";

const BREAKPOINTS = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };

const instruments: Record<InstrumentName, Instrument> = { ukulele, guitar };

const DEFAULT_CHORD_TYPES = ["major", "minor", "maj7", "7", "m7"];

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
  const selectedChords = selectedInstrument.chords[root];

  const [showAllChordTypes, setShowAllChordTypes] = useState(false);
  const [chordTypes, setChordTypes] = useState(DEFAULT_CHORD_TYPES);

  return (
    <>
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
      <main
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
        {selectedChords
          .filter((chord) => chordTypes.includes(chord.suffix))
          .map((chord) => {
            return (
              <div key={chord.key + chord.suffix}>
                <h2 style={{ textAlign: "center" }}>
                  {root}
                  <span style={{ fontSize: 16, color: "#333333" }}>
                    {chord.suffix}
                  </span>
                </h2>
                <ChordOptions
                  chord={chord}
                  instrumentWithTunings={instrumentWithTunings}
                />
              </div>
            );
          })}
      </main>
    </>
  );
}

export default App;
