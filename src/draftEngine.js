export const MAPS = [
  'Map 1','Map 2','Map 3','Map 4','Map 5',
  'Map 6','Map 7','Map 8','Map 9','Map 10'
];

export function createDraft(players = []) {
  return {
    maps: MAPS,
    players,
    bans: [],
    picks: [],
    phase: 'ban',
    turn: 0,
    result: []
  };
}

export function currentPlayer(state) {
  return state.players[state.turn % state.players.length];
}

export function applyAction(state, map) {
  if (state.phase === 'done') return state;

  const next = { ...state };

  if (state.phase === 'ban') {
    if (state.bans.includes(map) || state.bans.length >= 4) return state;
    next.bans = [...state.bans, map];

    if (next.bans.length === 4) {
      next.phase = 'pick';
      next.turn = 0;
    } else {
      next.turn++;
    }
  } else if (state.phase === 'pick') {
    if (state.picks.includes(map) || state.picks.length >= 4) return state;
    next.picks = [...state.picks, map];

    if (next.picks.length === 4) {
      const remaining = next.maps.filter(
        m => !next.bans.includes(m) && !next.picks.includes(m)
      );
      const random = remaining[Math.floor(Math.random() * remaining.length)];
      next.result = [...next.picks, random];
      next.phase = 'done';
    } else {
      next.turn++;
    }
  }

  return next;
}

export function getResult(state) {
  return state.result || [];
}
