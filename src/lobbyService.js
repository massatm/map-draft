import { ref, set, update, onValue, get } from 'firebase/database';
import { database } from './firebase';

export const MAX_PLAYERS = 4;

export function createLobby(code, player) {
  const lobby = {
    code,
    players: {
      [player.id]: player,
    },
    status: 'waiting',
    draft: null,
  };

  return set(ref(database, `lobbies/${code}`), lobby);
}

export async function joinLobby(code, player) {
  const lobby = await getLobby(code);
  const players = lobby?.players || {};

  if (Object.keys(players).length >= MAX_PLAYERS) {
    throw new Error('Lobby is full');
  }

  return update(ref(database, `lobbies/${code}/players/${player.id}`), player);
}

export function listenLobby(code, callback) {
  return onValue(ref(database, `lobbies/${code}`), (snapshot) => {
    callback(snapshot.val());
  });
}

export async function getLobby(code) {
  const snapshot = await get(ref(database, `lobbies/${code}`));
  return snapshot.val();
}

export function startLobby(code, draft) {
  return update(ref(database, `lobbies/${code}`), {
    status: 'drafting',
    draft,
  });
}
