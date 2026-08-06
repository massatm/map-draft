import { ref, set, update, onValue, get } from 'firebase/database';
import { database } from './firebase';

export function createLobby(code, data) {
  return set(ref(database, `lobbies/${code}`), data);
}

export function joinLobby(code, player) {
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
