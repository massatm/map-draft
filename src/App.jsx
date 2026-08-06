import React, { useState } from "react";

const initialMaps = [
  "Map 1",
  "Map 2",
  "Map 3",
  "Map 4",
  "Map 5",
  "Map 6",
  "Map 7",
  "Map 8",
  "Map 9",
  "Map 10"
];

const players = [
  "Spieler 1",
  "Spieler 2",
  "Spieler 3",
  "Spieler 4"
];

export default function App() {
  const [maps, setMaps] = useState(initialMaps);
  const [bans, setBans] = useState([]);
  const [picks, setPicks] = useState([]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState("ban");
  const [randomMap, setRandomMap] = useState(null);

  const currentPlayer =
    players[turn % players.length];

  function selectMap(map) {
    if (phase === "ban") {
      setBans([...bans, map]);
      setMaps(maps.filter(m => m !== map));

      if (bans.length + 1 === 4) {
        setPhase("pick");
        setTurn(0);
      } else {
        setTurn(turn + 1);
      }
    }

    if (phase === "pick") {
      setPicks([...picks, map]);
      setMaps(maps.filter(m => m !== map));

      if (picks.length + 1 === 4) {
        setPhase("random");
      } else {
        setTurn(turn + 1);
      }
    }
  }

  function randomize() {
    const choice =
      maps[Math.floor(Math.random() * maps.length)];

    setRandomMap(choice);
    setPhase("done");
  }

  return (
    <div className="container">

      <h1>🎮 Map Draft</h1>

      {phase !== "done" && (
        <h2>
          {phase === "ban"
            ? "🚫 Ban Phase"
            : phase === "pick"
            ? "✅ Pick Phase"
            : "🎲 Random"}
        </h2>
      )}

      {phase !== "random" && phase !== "done" && (
        <h3>
          Am Zug: {currentPlayer}
        </h3>
      )}

      <div className="maps">
        {maps.map(map => (
          <button
            key={map}
            onClick={() => selectMap(map)}
          >
            {map}
          </button>
        ))}
      </div>


      {phase === "random" && (
        <button
          className="random"
          onClick={randomize}
        >
          Letzte Map würfeln 🎲
        </button>
      )}


      <div className="result">

        <h3>Bans</h3>
        {bans.map(b => (
          <p key={b}>🚫 {b}</p>
        ))}

        <h3>Picks</h3>
        {picks.map(p => (
          <p key={p}>✅ {p}</p>
        ))}

        {randomMap && (
          <>
            <h3>Random Map</h3>
            <p>🎲 {randomMap}</p>
          </>
        )}

      </div>

    </div>
  );
}
