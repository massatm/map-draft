import { useState } from 'react';
import Lobby from './components/Lobby';
import DraftBoard from './components/DraftBoard';
import './styles.css';

export default function App() {
  const [draft, setDraft] = useState(null);

  return (
    <main className="app">
      <h1>🎮 Map Draft</h1>

      {!draft ? (
        <Lobby onStart={setDraft} />
      ) : (
        <DraftBoard draft={draft} />
      )}
    </main>
  );
}
