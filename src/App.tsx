import Chord from "@tombatossals/react-chords/lib/Chord";
import guitar from "@tombatossals/chords-db/lib/guitar";
import ukulele from "@tombatossals/chords-db/lib/ukulele";
import { useState } from "react";

type InstrumentName = "guitar" | "ukulele";
const instruments: Record<InstrumentName, Instrument> = { ukulele, guitar };

function App() {
  const [instrumentName, setInstrumentName] =
    useState<InstrumentName>("ukulele");
  const selectedInstrument = instruments[instrumentName];

  const instrumentWithTunings = Object.assign(selectedInstrument.main, {
    tunings: selectedInstrument.tunings,
  });
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
          <div>
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
            Hide Chords
          </button>
        </>
      ) : (
        <button onClick={() => setShowAllChordTypes(true)}>Show Chords</button>
      )}
      <h2>{root}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, auto)",
        }}
      >
        {selectedChords
          .filter((chord) => chordTypes.includes(chord.suffix))
          .map((chord) => {
            return (
              <div key={chord.key + chord.suffix}>
                <h2>{chord.suffix}</h2>
                {chord.positions.map((position, index) => (
                  <Chord
                    key={`position-${index}`}
                    chord={position}
                    instrument={instrumentWithTunings}
                    lite={false}
                  />
                ))}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default App;
