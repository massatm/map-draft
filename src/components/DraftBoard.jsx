import React from 'react';

export default function DraftBoard({ maps = [], phase, currentPlayer, onSelect }) {
  return (
    <div className="container">
      <h2>{phase === 'ban' ? '🚫 Ban' : '✅ Pick'}</h2>
      <h3>Am Zug: {currentPlayer}</h3>
      <div className="maps">
        {maps.map(map => (
          <button key={map} onClick={() => onSelect(map)}>{map}</button>
        ))}
      </div>
    </div>
  );
}
