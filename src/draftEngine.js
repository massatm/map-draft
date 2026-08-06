export const MAPS = [
  'Map 1','Map 2','Map 3','Map 4','Map 5',
  'Map 6','Map 7','Map 8','Map 9','Map 10'
];

export function createDraft() {
  return {
    maps: MAPS,
    bans: [],
    picks: [],
    phase: 'ban',
  };
}

export function banMap(state, map) {
  if (state.bans.length >= 4) return state;
  return { ...state, bans: [...state.bans, map] };
}

export function pickMap(state, map) {
  if (state.picks.length >= 4) return state;
  return { ...state, picks: [...state.picks, map] };
}

export function getResult(state) {
  const remaining = state.maps.filter(
    (map) => !state.bans.includes(map) && !state.picks.includes(map)
  );

  const random = remaining[Math.floor(Math.random() * remaining.length)];
  return [...state.picks, random];
}
