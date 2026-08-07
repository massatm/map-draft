import { ref, set, get, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { database } from "./firebase";
import { MAPS } from "./draftEngine";
import "./style.css";

function createCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function App() {
  const [name, setName] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [lobbyCode, setLobbyCode] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!lobbyCode) return;

    const lobbyRef = ref(
      database,
      `lobbies/${lobbyCode}/players`
    );

    return onValue(lobbyRef, (snapshot) => {
      setPlayers(snapshot.val() || []);
    });
  }, [lobbyCode]);

  async function createLobby() {

  async function joinLobby() {
    const snapshot = await get(
      ref(database, `lobbies/${codeInput}`)
    );

    if (!snapshot.exists()) {
      alert("Lobby nicht gefunden");
      return;
    }

    const lobby = snapshot.val();

    const updatedPlayers = [
      ...(lobby.players || []),
      {
        name,
        id: Date.now()
      }
    ];

    await set(
      ref(database, `lobbies/${codeInput}/players`),
      updatedPlayers
    );

    setLobbyCode(codeInput);
    setPlayers(updatedPlayers);
  }

  if (!lobbyCode) {
    return (
      <main className="app">
        <h1>🎮 Map Draft</h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={createLobby}>
          Lobby erstellen
        </button>

        <hr />

        <input
          placeholder="Lobby Code"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
        />

        <button onClick={joinLobby}>
          Beitreten
        </button>
      </main>
    );
  }

  return (
    <main className="app">
      <h1>Lobby {lobbyCode}</h1>

      <h2>Spieler</h2>

      {players.map((p) => (
        <p key={p.id}>
          ✅ {p.name}
        </p>
      ))}
    </main>
  );
}
useEffect(() => {
  if (!lobbyCode) return;

  const lobbyRef = ref(
    database,
    `lobbies/${lobbyCode}/players`
  );

  return onValue(lobbyRef, (snapshot) => {
    setPlayers(snapshot.val() || []);
  });
}, [lobbyCode]);
