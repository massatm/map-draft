import { useState } from 'react';
import { createLobby } from './lobbyService';
import { MAPS } from './draftEngine';
import './styles.css';

export default function App() {
  const [lobby, setLobby] = useState(null);

  async function startLobby() {
    const code = await createLobby('Player 1');
    setLobby(code);
  }

  return (
    <main className="app">
      <h1>🎮 Map Draft</h1>
      {!lobby ? (
        <button onClick={startLobby}>Create Lobby</button>
      ) : (
        <div className="panel">
          <h2>Lobby {lobby}</h2>
          <p>Waiting for players...</p>
          <div className="maps">
            {MAPS.map(map => <div className="card" key={map}>{map}</div>)}
          </div>
        </div>
      )}
    </main>
  );
}
