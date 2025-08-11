import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./config";

/**
 * Returns the default Firebase Storage instance.
 */
const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage at the given path.
 * @param path The storage path (e.g. 'uploads/user123/image.png')
 * @param file The File or Blob to upload
 * @returns Promise with the uploaded file's download URL
 */
export async function uploadFile(path: string, file: Blob | File): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Returns a download URL for a file stored at the given path.
 * @param path The storage path (e.g. 'uploads/user123/image.png')
 * @returns Promise with the download URL
 */
export async function getFileURL(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

export { storage };