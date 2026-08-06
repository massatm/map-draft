import { useState } from 'react';
import Lobby from './components/Lobby';
import DraftBoard from './components/DraftBoard';
import { MAPS } from './draftEngine';
import './styles.css';

export default function App() {
  const [lobby, setLobby] = useState(null);

  function start(data) {
    setLobby(data);
  }

  const draft = {
    maps: MAPS,
    phase: 'ban',
    bans: [],
    picks: [],
    turn: 0,
    finished: false
  };

  return (
    <main className="app">
      <h1>🎮 Map Draft</h1>
      {!lobby ? (
        <Lobby onStart={start} />
      ) : (
        <DraftBoard
          draft={draft}
          maps={MAPS}
          phase={draft.phase}
          currentPlayer={lobby.player?.name}
          bans={draft.bans}
          picks={draft.picks}
        />
      )}
    </main>
  );
}
