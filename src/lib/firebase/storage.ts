import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  console.log('[STORAGE] Uploading to path:', path);
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  console.log('[STORAGE] Upload complete:', snapshot.metadata.fullPath);
  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log('[STORAGE] Download URL:', downloadURL);
  return downloadURL;
}

/**
 * Upload any file type to Firebase Storage
 * Generic function that works for images, videos, documents, etc.
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  return uploadImage(file, path); // Same implementation
}

export async function deleteImage(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export function getImagePath(type: 'portfolio' | 'testimonials' | 'services', id: string, filename: string): string {
  return `${type}/${id}/${filename}`;
}

/**
 * Génère un nom de fichier unique pour éviter les collisions
 * @param originalName - Le nom original du fichier
 * @returns Un nom de fichier unique avec timestamp
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}
