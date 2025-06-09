import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const storage = getStorage();

export class StorageService {
  static async uploadFile(path, file) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  static async getFileUrl(path) {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }

  static async deleteFile(path) {
    const storageRef = ref(storage, path);
    return deleteObject(storageRef);
  }
}