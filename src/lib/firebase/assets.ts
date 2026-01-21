import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { Asset, AssetUploadResult } from '@/types/asset';
import { calculateFileHash, getImageDimensions } from '@/lib/utils/file-hash';

const ASSETS_COLLECTION = 'assets';
const ASSETS_STORAGE_PATH = 'assets/images';

/**
 * Find an existing asset by hash
 */
export async function findAssetByHash(hash: string): Promise<Asset | null> {
  const assetsRef = collection(db, ASSETS_COLLECTION);
  const q = query(assetsRef, where('hash', '==', hash));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    url: data.url,
    path: data.path,
    type: data.type,
    size: data.size,
    hash: data.hash,
    fileName: data.fileName,
    mimeType: data.mimeType,
    width: data.width,
    height: data.height,
    createdAt: data.createdAt.toDate(),
    usedIn: data.usedIn || [],
  };
}

/**
 * Upload file to Storage and create asset record
 */
async function uploadNewAsset(file: File, hash: string): Promise<Asset> {
  // Generate unique filename with hash prefix to avoid collisions
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const fileName = `${hash.substring(0, 12)}-${timestamp}.${extension}`;
  const storagePath = `${ASSETS_STORAGE_PATH}/${fileName}`;

  // Upload to Firebase Storage
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Get image dimensions if it's an image
  let dimensions: { width?: number; height?: number } = {};
  if (file.type.startsWith('image/')) {
    try {
      dimensions = await getImageDimensions(file);
    } catch (error) {
      console.warn('Failed to get image dimensions:', error);
    }
  }

  // Create asset document
  const assetId = crypto.randomUUID();
  const asset: Asset = {
    id: assetId,
    url,
    path: storagePath,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    size: file.size,
    hash,
    fileName: file.name,
    mimeType: file.type,
    width: dimensions.width,
    height: dimensions.height,
    createdAt: new Date(),
    usedIn: [],
  };

  const assetRef = doc(db, ASSETS_COLLECTION, assetId);
  await setDoc(assetRef, {
    ...asset,
    createdAt: Timestamp.fromDate(asset.createdAt),
  });

  return asset;
}

/**
 * Upload an asset with deduplication
 * If an asset with the same hash exists, reuse it
 * Otherwise, upload a new one
 */
export async function uploadAsset(file: File): Promise<AssetUploadResult> {
  if (!db || !storage) {
    throw new Error('Firebase is not initialized');
  }

  // Calculate file hash
  const hash = await calculateFileHash(file);

  // Check if asset already exists
  const existingAsset = await findAssetByHash(hash);

  if (existingAsset) {
    console.log('[ASSET] Reusing existing asset:', existingAsset.id);
    return {
      asset: existingAsset,
      wasReused: true,
    };
  }

  // Upload new asset
  console.log('[ASSET] Uploading new asset');
  const newAsset = await uploadNewAsset(file, hash);

  return {
    asset: newAsset,
    wasReused: false,
  };
}

/**
 * Mark an asset as used by a project
 */
export async function markAssetAsUsed(assetId: string, projectId: string): Promise<void> {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);
  await updateDoc(assetRef, {
    usedIn: arrayUnion(projectId),
  });
}

/**
 * Mark an asset as no longer used by a project
 */
export async function markAssetAsUnused(assetId: string, projectId: string): Promise<void> {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);
  await updateDoc(assetRef, {
    usedIn: arrayRemove(projectId),
  });
}

/**
 * Get all assets
 */
export async function getAllAssets(): Promise<Asset[]> {
  if (!db) {
    console.error('[ASSETS] Firestore db is not initialized');
    return [];
  }

  try {
    console.log('[ASSETS] Fetching from collection:', ASSETS_COLLECTION);
    const assetsRef = collection(db, ASSETS_COLLECTION);
    const snapshot = await getDocs(assetsRef);

    console.log('[ASSETS] Snapshot size:', snapshot.size);
    console.log('[ASSETS] Snapshot empty:', snapshot.empty);

    if (snapshot.empty) {
      console.log('[ASSETS] No assets found in collection');
      return [];
    }

    const assets = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('[ASSETS] Processing doc:', doc.id, data);

      return {
        id: doc.id,
        url: data.url,
        path: data.path,
        type: data.type,
        size: data.size,
        hash: data.hash,
        fileName: data.fileName,
        mimeType: data.mimeType,
        width: data.width,
        height: data.height,
        createdAt: data.createdAt?.toDate() || new Date(),
        usedIn: data.usedIn || [],
      };
    });

    console.log('[ASSETS] Returning', assets.length, 'assets');
    return assets;
  } catch (error) {
    console.error('[ASSETS] Error fetching assets:', error);
    throw error;
  }
}

/**
 * Get unused assets (not referenced by any project)
 */
export async function getUnusedAssets(): Promise<Asset[]> {
  const allAssets = await getAllAssets();
  return allAssets.filter(asset => asset.usedIn.length === 0);
}

/**
 * Delete an asset (only if unused)
 */
export async function deleteAsset(assetId: string): Promise<void> {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);
  const assetDoc = await getDoc(assetRef);

  if (!assetDoc.exists()) {
    throw new Error('Asset not found');
  }

  const asset = assetDoc.data() as Asset;

  if (asset.usedIn && asset.usedIn.length > 0) {
    throw new Error('Cannot delete asset that is in use');
  }

  // Delete from Storage
  const storageRef = ref(storage, asset.path);
  await deleteObject(storageRef);

  // Delete from Firestore
  await deleteDoc(assetRef);

  console.log('[ASSET] Deleted asset:', assetId);
}

/**
 * Extract asset ID from URL
 * Helps track which assets are used in projects
 */
export function getAssetIdFromUrl(url: string): string | null {
  // Extract the filename from Firebase Storage URL
  const match = url.match(/\/([a-f0-9]{12}-\d+\.[a-z]+)\?/);
  if (!match) return null;

  // The asset ID is stored in Firestore, we need to query by path
  // This is a helper function, actual lookup requires a Firestore query
  return null;
}
