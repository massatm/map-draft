import React, { useState } from 'react';
import { createLobby, joinLobby } from '../lobbyService';

export default function Lobby({ onJoined }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  async function create() {
    const lobby = await createLobby(name || 'Player');
    onJoined(lobby);
  }

  async function join() {
    const lobby = await joinLobby(code, name || 'Player');
    onJoined(lobby);
  }

  return (
    <div className="container">
      <h1>🎮 Map Draft</h1>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <button onClick={create}>Lobby erstellen</button>
      <input placeholder="Lobby Code" value={code} onChange={e=>setCode(e.target.value)} />
      <button onClick={join}>Beitreten</button>
    </div>
  );
}
