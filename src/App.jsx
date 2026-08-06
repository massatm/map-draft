import { useEffect, useState } from 'react';
import Lobby from './components/Lobby';
import DraftBoard from './components/DraftBoard';
import { listenDraft, updateDraft } from './draftSync';
import { MAPS } from './draftEngine';
import './styles.css';

export default function App() {
  const [draft, setDraft] = useState(null);
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    if (!lobby) return;
    return listenDraft(lobby, setDraft);
  }, [lobby]);

  function start(data) {
    setLobby(data.code);
    setDraft(data.draft || { maps: MAPS, phase: 'ban', bans: [], picks: [] });
  }

  function selectMap(map) {
    if (!draft || !lobby) return;
    const next = {
      ...draft,
      bans: draft.phase === 'ban' ? [...(draft.bans || []), map] : draft.bans,
      picks: draft.phase === 'pick' ? [...(draft.picks || []), map] : draft.picks
    };
    updateDraft(lobby, next);
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
          onSelect={selectMap}
        />
      )}
    </main>
  );
}
