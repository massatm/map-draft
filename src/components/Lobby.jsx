import React, { useState } from 'react';
import { createLobby, joinLobby } from '../lobbyService';

export default function Lobby({ onStart }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  async function create() {
    try {
      const lobby = await createLobby(name || 'Player');
      onStart(lobby);
    } catch (e) {
      setError(e.message);
    }
  }

  async function join() {
    try {
      const lobby = await joinLobby(code.trim(), name || 'Player');
      onStart(lobby);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="container">
      <h1>🎮 Map Draft</h1>
      <p>4 Spieler · 10 Maps · Ban/Pick Draft</p>

      <input
        placeholder="Spielername"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={create}>Neue Lobby erstellen</button>

      <input
        placeholder="Lobby Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={join}>Lobby beitreten</button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
