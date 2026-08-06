import React from 'react';

export default function DraftBoard({ maps = [], phase, currentPlayer, onSelect, bans = [], picks = [] }) {
  return (
    <div className="container">
      <h2>{phase === 'ban' ? '🚫 Ban Phase' : '✅ Pick Phase'}</h2>
      <h3>Am Zug: {currentPlayer}</h3>

      <div className="maps">
        {maps.map(map => (
          <button key={map} onClick={() => onSelect(map)}>{map}</button>
        ))}
      </div>

      <section className="result">
        <h3>Bans</h3>
        {bans.map(map => <p key={map}>🚫 {map}</p>)}

        <h3>Picks</h3>
        {picks.map(map => <p key={map}>✅ {map}</p>)}
      </section>
    </div>
  );
}
