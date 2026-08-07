import { ref, set, get, update, onValue } from "firebase/database";
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
  const [draft, setDraft] = useState(null);
  const [playerIndex, setPlayerIndex] = useState(null);


  useEffect(() => {
    if (!lobbyCode) return;

    return onValue(
      ref(database, `lobbies/${lobbyCode}/players`),
      (snapshot) => {
        setPlayers(snapshot.val() || []);
      }
    );
  }, [lobbyCode]);


  useEffect(() => {
    if (!lobbyCode) return;

    return onValue(
      ref(database, `lobbies/${lobbyCode}/draft`),
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setDraft({
            phase: data.phase || "waiting",
            bans: data.bans || [],
            picks: data.picks || [],
            turn: data.turn || 0,
            result: data.result || []
          });
        }
      }
    );
  }, [lobbyCode]);


  async function createLobby() {
    const code = createCode();

    const lobby = {
      players: [
        {
          name,
          id: Date.now()
        }
      ],
      draft: {
        phase: "waiting",
        bans: [],
        picks: [],
        turn: 0,
        result: []
      }
    };

    await set(
      ref(database, `lobbies/${code}`),
      lobby
    );

    setLobbyCode(code);
    setPlayerIndex(0);
  }


  async function joinLobby() {
    const snapshot = await get(
      ref(database, `lobbies/${codeInput}`)
    );

    if (!snapshot.exists()) {
      alert("Lobby nicht gefunden");
      return;
    }

    const lobby = snapshot.val();

    if ((lobby.players || []).length >= 4) {
      alert("Lobby voll");
      return;
    }

    const updatedPlayers = [
      ...(lobby.players || []),
      {
        name,
        id: Date.now()
      }
    ];

    await update(
      ref(database, `lobbies/${codeInput}`),
      {
        players: updatedPlayers
      }
    );

    setLobbyCode(codeInput);
    setPlayerIndex(updatedPlayers.length - 1);
  }
    async function startDraft() {
    await update(
      ref(database, `lobbies/${lobbyCode}/draft`),
      {
        phase: "ban",
        bans: [],
        picks: [],
        turn: 0,
        result: []
      }
    );
  }


  async function selectMap(map) {
    if (!draft) return;
    if (playerIndex === null) return;

    const bans = draft.bans || [];
    const picks = draft.picks || [];


    // Prüfen wer dran ist
    const allowedBan =
      draft.phase === "ban" &&
      draft.turn === playerIndex;


    const allowedPick =
      draft.phase === "pick" &&
      draft.turn === playerIndex;


    if (!allowedBan && !allowedPick) {
      return;
    }


    if (draft.phase === "ban") {

      if (bans.includes(map)) return;

      const newBans = [
        ...bans,
        map
      ];


      await update(
        ref(database, `lobbies/${lobbyCode}/draft`),
        {
          bans: newBans,
          turn: draft.turn + 1,
          phase:
            newBans.length === 4
              ? "pick"
              : "ban"
        }
      );
    }


    if (draft.phase === "pick") {

      if (
        bans.includes(map) ||
        picks.includes(map)
      ) {
        return;
      }


      const newPicks = [
        ...picks,
        map
      ];


      if (newPicks.length === 4) {

        const remaining = MAPS.filter(
          (m) =>
            !bans.includes(m) &&
            !newPicks.includes(m)
        );


        const random =
          remaining[
            Math.floor(
              Math.random() * remaining.length
            )
          ];


        await update(
          ref(database, `lobbies/${lobbyCode}/draft`),
          {
            picks: newPicks,
            result: [
              ...newPicks,
              random
            ],
            phase: "done"
          }
        );

        return;
      }


      await update(
        ref(database, `lobbies/${lobbyCode}/draft`),
        {
          picks: newPicks,
          turn: draft.turn + 1
        }
      );
    }
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

      <h1>
        Lobby {lobbyCode}
      </h1>


      <h2>Spieler</h2>

      {players.map((p, i) => (
        <p key={p.id}>
          {i + 1}. {p.name}
        </p>
      ))}



      {players.length === 4 &&
        draft?.phase === "waiting" && (
          <button onClick={startDraft}>
            Draft starten
          </button>
        )
      }



      {draft && draft.phase !== "waiting" && (
        <>

          <h2>
            Phase: {draft.phase}
          </h2>


          {draft.phase !== "done" && (
            <div>

              {MAPS.map((map) => (

                <button
                  key={map}
                  onClick={() => selectMap(map)}
                  disabled={
                    (draft.bans || []).includes(map) ||
                    (draft.picks || []).includes(map)
                  }
                >
                  {map}
                </button>

              ))}

            </div>
          )}



          <h3>
            Bans
          </h3>

          <p>
            {(draft.bans || []).join(", ")}
          </p>



          <h3>
            Picks
          </h3>

          <p>
            {(draft.picks || []).join(", ")}
          </p>



          {draft.phase === "done" && (
            <>
              <h2>
                Ergebnis
              </h2>

              {(draft.result || []).map((map) => (
                <p key={map}>
                  🎯 {map}
                </p>
              ))}

            </>
          )}

        </>
      )}

    </main>
  );
}
