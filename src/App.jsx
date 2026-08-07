import { useState } from "react";
import { MAPS } from "./draftEngine";
import "./style.css";

export default function App() {
  const [started, setStarted] = useState(false);
  const [bans, setBans] = useState([]);
  const [picks, setPicks] = useState([]);
  const [phase, setPhase] = useState("ban");

  function selectMap(map) {
    if (phase === "ban") {
      const newBans = [...bans, map];
      setBans(newBans);

      if (newBans.length === 4) {
        setPhase("pick");
      }
    }

    if (phase === "pick") {
      const newPicks = [...picks, map];
      setPicks(newPicks);

      if (newPicks.length === 4) {
        setPhase("done");
      }
    }
  }

  if (!started) {
    return (
      <main className="app">
        <h1>🎮 Map Draft</h1>
        <button onClick={() => setStarted(true)}>
          Draft starten
        </button>
      </main>
    );
  }

  return (
    <main className="app">
      <h1>🎮 Map Draft</h1>

      <h2>
        {phase === "ban" && "Ban Phase"}
        {phase === "pick" && "Pick Phase"}
        {phase === "done" && "Ergebnis"}
      </h2>

      <div className="maps">
        {MAPS.map((map) => (
          <button
            key={map}
            onClick={() => selectMap(map)}
          >
            {map}
          </button>
        ))}
      </div>

      <h3>Bans</h3>
      <p>{bans.join(", ")}</p>

      <h3>Picks</h3>
      <p>{picks.join(", ")}</p>
    </main>
  );
}
