import { storage } from './config';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot 
} from "firebase/storage";

/**
 * Firebase Storage Service
 * 
 * This service provides methods for uploading, downloading, and managing files
 * in Firebase Cloud Storage. It handles common operations like profile photos,
 * college ID uploads, and gig-related file storage.
 */

/**
 * Storage paths configuration
 * Organized folder structure for different types of uploads
 */
const STORAGE_PATHS = {
  PROFILE_PHOTOS: 'profile-photos',
  COLLEGE_IDS: 'college-ids',
  ACCEPTANCE_SELFIES: 'acceptance-selfies',
  GIG_ATTACHMENTS: 'gig-attachments'
} as const;

/**
 * Upload a file to Firebase Storage
 * 
 * @param file - The file to upload
 * @param path - Storage path where the file will be saved
 * @param fileName - Optional custom filename
 * @returns Promise<string> - Download URL of the uploaded file
 */
export const uploadFile = async (
  file: File, 
  path: string, 
  fileName?: string
): Promise<string> => {
  try {
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${finalFileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('File uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Upload a file with progress tracking
 * 
 * @param file - The file to upload
 * @param path - Storage path where the file will be saved
 * @param onProgress - Callback function to track upload progress
 * @param fileName - Optional custom filename
 * @returns Promise<string> - Download URL of the uploaded file
 */
export const uploadFileWithProgress = async (
  file: File,
  path: string,
  onProgress: (progress: number) => void,
  fileName?: string
): Promise<string> => {
  try {
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${finalFileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(new Error(`Upload failed: ${error.message}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File uploaded successfully with progress tracking:', downloadURL);
            resolve(downloadURL);
          } catch (error: any) {
            reject(new Error(`Failed to get download URL: ${error.message}`));
          }
        }
      );
    });
  } catch (error: any) {
    console.error('Error setting up upload with progress:', error);
    throw new Error(`Upload setup failed: ${error.message}`);
  }
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param fileUrl - The download URL of the file to delete
 * @returns Promise<void>
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    console.log('File deleted successfully:', fileUrl);
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Upload user profile photo
 * 
 * @param userId - The user's ID
 * @param file - The profile photo file
 * @param onProgress - Optional progress callback
 * @returns Promise<string> - Download URL of the uploaded photo
 */
export const uploadProfilePhoto = async (
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileName = `${userId}_profile.${file.name.split('.').pop()}`;
  
  if (onProgress) {
    return uploadFileWithProgress(file, STORAGE_PATHS.PROFILE_PHOTOS, onProgress, fileName);
  } else {
    return uploadFile(file, STORAGE_PATHS.PROFILE_PHOTOS, fileName);
  }
};

/**
 * Upload college ID document
 * 
 * @param userId - The user's ID
 * @param file - The college ID file
 * @param onProgress - Optional progress callback
 * @returns Promise<string> - Download URL of the uploaded document
 */
export const uploadCollegeId = async (
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileName = `${userId}_college_id.${file.name.split('.').pop()}`;
  
  if (onProgress) {
    return uploadFileWithProgress(file, STORAGE_PATHS.COLLEGE_IDS, onProgress, fileName);
  } else {
    return uploadFile(file, STORAGE_PATHS.COLLEGE_IDS, fileName);
  }
};

/**
 * Upload acceptance selfie for gig verification
 * 
 * @param gigId - The gig's ID
 * @param userId - The user's ID
 * @param file - The selfie file
 * @param onProgress - Optional progress callback
 * @returns Promise<string> - Download URL of the uploaded selfie
 */
export const uploadAcceptanceSelfie = async (
  gigId: string,
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileName = `${gigId}_${userId}_acceptance.${file.name.split('.').pop()}`;
  
  if (onProgress) {
    return uploadFileWithProgress(file, STORAGE_PATHS.ACCEPTANCE_SELFIES, onProgress, fileName);
  } else {
    return uploadFile(file, STORAGE_PATHS.ACCEPTANCE_SELFIES, fileName);
  }
};

/**
 * Upload gig attachment file
 * 
 * @param gigId - The gig's ID
 * @param file - The attachment file
 * @param onProgress - Optional progress callback
 * @returns Promise<string> - Download URL of the uploaded attachment
 */
export const uploadGigAttachment = async (
  gigId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileName = `${gigId}_${Date.now()}_${file.name}`;
  
  if (onProgress) {
    return uploadFileWithProgress(file, STORAGE_PATHS.GIG_ATTACHMENTS, onProgress, fileName);
  } else {
    return uploadFile(file, STORAGE_PATHS.GIG_ATTACHMENTS, fileName);
  }
};

// Export storage paths for external use
export { STORAGE_PATHS };