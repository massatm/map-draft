import { useEffect, useState } from 'react';
import Lobby from './components/Lobby';
import DraftBoard from './components/DraftBoard';
import { listenDraft, updateDraft } from './draftSync';
import { MAPS } from './draftEngine';
import './styles.css';

export default function App() {
  const [draft, setDraft] = useState(null);
  const [lobby, setLobby] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!lobby) return;
    return listenDraft(lobby.code, setDraft);
  }, [lobby]);

  function start(data) {
    setLobby(data);
    setPlayer(data.player || null);
    setDraft(data.draft || {
      maps: MAPS,
      phase: 'ban',
      bans: [],
      picks: [],
      turn: 0,
      finished: false
    });
  }

  function selectMap(map) {
    if (!draft || !lobby || draft.finished) return;

    const next = {
      ...draft,
      bans: draft.phase === 'ban'
        ? [...(draft.bans || []), map]
        : draft.bans,
      picks: draft.phase === 'pick'
        ? [...(draft.picks || []), map]
        : draft.picks,
      turn: (draft.turn || 0) + 1
    };

    updateDraft(lobby.code, next);
  }

  return (
    <main className="app">
      <h1>🎮 Map Draft</h1>
      {!lobby ? (
        <Lobby onStart={start} />
      ) : (
        <DraftBoard
          draft={draft}
          maps={draft?.maps || MAPS}
          phase={draft?.phase}
          currentPlayer={player?.name}
          onSelect={selectMap}
          bans={draft?.bans || []}
          picks={draft?.picks || []}
        />
      )}
    </main>
  );
}
