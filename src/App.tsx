// TODO:
// - visual design
// - add chord to book
// - fix toggle chord types

import { useState } from "react";
import guitar from "@tombatossals/chords-db/lib/guitar";
import ukulele from "@tombatossals/chords-db/lib/ukulele";
import useBreakpoint from "use-breakpoint";

import { InstrumentName, InstrumentWithTunings } from "./types";
import ChordOptions from "./ChordOptions";

const BREAKPOINTS = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };

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
  const selectedChords = selectedInstrument.chords[root];

  const [showAllChordTypes, setShowAllChordTypes] = useState(false);
  const [chordTypes, setChordTypes] = useState([
    "major",
    "minor",
    "maj7",
    "7",
    "m7",
  ]);

  return (
    <>
      <div style={{ marginBottom: 10 }}>
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
              {eachInstrumentName}
            </button>
          )
        )}
      </div>
      <div style={{ marginBottom: 10 }}>
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
      {showAllChordTypes ? (
        <>
          <div style={{ marginBottom: 10 }}>
            {selectedInstrument.suffixes.map((suffix: string) => (
              <button
                key={suffix}
                onClick={() => setChordTypes([suffix])}
                style={
                  chordTypes.includes(suffix) ? { fontWeight: "bold" } : {}
                }
              >
                {suffix}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAllChordTypes(false)}>
            Less Chord Types
          </button>
        </>
      ) : (
        <button onClick={() => setShowAllChordTypes(true)}>
          More Chord Types
        </button>
      )}
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
      </div>
    </>
  );
}

export default App;
