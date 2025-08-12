import { storage } from './config';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  UploadMetadata 
} from "firebase/storage";

// Helper function to convert data URL to blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Generate a unique filename with timestamp and random string
const generateFileName = (prefix: string, extension: string = 'jpg'): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomString}.${extension}`;
};

// Upload profile photo
export const uploadProfilePhoto = async (userId: string, dataURL: string): Promise<string> => {
  try {
    const blob = dataURLtoBlob(dataURL);
    const fileName = generateFileName('profile');
    const storageRef = ref(storage, `users/${userId}/${fileName}`);
    
    const metadata: UploadMetadata = {
      contentType: blob.type,
      customMetadata: {
        userId: userId,
        uploadType: 'profile'
      }
    };

    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading profile photo:", error);
    throw new Error(`Failed to upload profile photo: ${error.message}`);
  }
};

// Upload college ID photo
export const uploadCollegeId = async (userId: string, dataURL: string): Promise<string> => {
  try {
    const blob = dataURLtoBlob(dataURL);
    const fileName = generateFileName('collegeId');
    const storageRef = ref(storage, `users/${userId}/${fileName}`);
    
    const metadata: UploadMetadata = {
      contentType: blob.type,
      customMetadata: {
        userId: userId,
        uploadType: 'collegeId'
      }
    };

    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading college ID:", error);
    throw new Error(`Failed to upload college ID: ${error.message}`);
  }
};

// Upload payment screenshot
export const uploadPaymentScreenshot = async (requestId: string, dataURL: string): Promise<string> => {
  try {
    const blob = dataURLtoBlob(dataURL);
    const fileName = generateFileName('screenshot');
    const storageRef = ref(storage, `walletRequests/${requestId}/${fileName}`);
    
    const metadata: UploadMetadata = {
      contentType: blob.type,
      customMetadata: {
        requestId: requestId,
        uploadType: 'paymentScreenshot'
      }
    };

    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading payment screenshot:", error);
    throw new Error(`Failed to upload payment screenshot: ${error.message}`);
  }
};

// Upload acceptance selfie for gig
export const uploadAcceptanceSelfie = async (gigId: string, dataURL: string): Promise<string> => {
  try {
    const blob = dataURLtoBlob(dataURL);
    const fileName = generateFileName('selfie');
    const storageRef = ref(storage, `gigs/${gigId}/${fileName}`);
    
    const metadata: UploadMetadata = {
      contentType: blob.type,
      customMetadata: {
        gigId: gigId,
        uploadType: 'acceptanceSelfie'
      }
    };

    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading acceptance selfie:", error);
    throw new Error(`Failed to upload acceptance selfie: ${error.message}`);
  }
};

// Delete file from storage
export const deleteFromStorage = async (downloadURL: string): Promise<void> => {
  try {
    const storageRef = ref(storage, downloadURL);
    await deleteObject(storageRef);
  } catch (error: any) {
    console.error("Error deleting file from storage:", error);
    // Don't throw error as this is not critical
  }
};

// Upload generic file
export const uploadFile = async (
  path: string, 
  file: File | Blob, 
  metadata?: UploadMetadata
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};