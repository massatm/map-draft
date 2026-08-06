import { ref, update, onValue } from 'firebase/database';
import { database } from './firebase';

export function updateDraft(code, payload) {
  return update(ref(database, `lobbies/${code}/draft`), payload);
}

export function listenDraft(code, callback) {
  return onValue(ref(database, `lobbies/${code}/draft`), snapshot => {
    callback(snapshot.val() || {});
  });
}
