import { database } from "../config/firebase-config.js";
import { ref, set, get, update, remove, onValue, off } from "firebase/database";

export class DatabaseService {
  static writeData(path, data) {
    return set(ref(database, path), data);
  }

  static updateData(path, updates) {
    return update(ref(database, path), updates);
  }

  static readData(path) {
    return get(ref(database, path))
      .then((snapshot) => snapshot.exists() ? snapshot.val() : null);
  }

  static deleteData(path) {
    return remove(ref(database, path));
  }

  static listenData(path, callback) {
    const dataRef = ref(database, path);
    onValue(dataRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null);
    });
    return () => off(dataRef);
  }
}