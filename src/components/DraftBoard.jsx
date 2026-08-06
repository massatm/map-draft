import React from 'react';

export default function DraftBoard({ maps = [], phase, currentPlayer, playerId, onSelect, bans = [], picks = [], result = [] }) {
  const canPlay = currentPlayer === playerId && phase !== 'done';

  return (
    <div className="container">
      <h2>
        {phase === 'ban' && '🚫 Ban Phase'}
        {phase === 'pick' && '✅ Pick Phase'}
        {phase === 'done' && '🏁 Draft beendet'}
      </h2>

      {phase !== 'done' && <h3>Am Zug: {currentPlayer}</h3>}

      {phase !== 'done' && (
        <div className="maps">
          {maps.map(map => (
            <button
              key={map}
              disabled={!canPlay}
              onClick={() => onSelect(map)}
            >
              {map}
            </button>
          ))}
        </div>
      )}

      <section className="result">
        <h3>Bans</h3>
        {bans.map(map => <p key={map}>🚫 {map}</p>)}

        <h3>Picks</h3>
        {picks.map(map => <p key={map}>✅ {map}</p>)}

        {phase === 'done' && (
          <>
            <h3>Finale Maps</h3>
            {result.map(map => <p key={map}>🏆 {map}</p>)}
          </>
        )}
      </section>
    </div>
  );
}
