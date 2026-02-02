import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';
import type { ContactSubmission, PortfolioItem } from '@/types/firebase';

export const COLLECTIONS = {
  CONTACTS: 'contacts',
  PORTFOLIO: 'portfolio',
  TESTIMONIALS: 'testimonials',
  SERVICES: 'services',
  SITE_SETTINGS: 'site_settings',
} as const;

// ============================================
// SITE SETTINGS
// ============================================

export interface SiteSettings {
  servicesPageEnabled: boolean;
  updatedAt?: Date;
}

const DEFAULT_SETTINGS: SiteSettings = {
  servicesPageEnabled: false, // Par défaut: page Services désactivée
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }

    // Créer les settings par défaut si ils n'existent pas
    await updateDoc(docRef, { ...DEFAULT_SETTINGS, updatedAt: Timestamp.now() }).catch(() => {
      // Si updateDoc échoue (doc n'existe pas), on utilise setDoc
      return addDoc(collection(db, COLLECTIONS.SITE_SETTINGS), { ...DEFAULT_SETTINGS, updatedAt: Timestamp.now() });
    });

    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting site settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const { setDoc } = await import('firebase/firestore');
    const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'main');
    await setDoc(docRef, {
      ...settings,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
}

export async function addContactSubmission(data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) {
  const contactsRef = collection(db, COLLECTIONS.CONTACTS);
  const docRef = await addDoc(contactsRef, {
    ...data,
    status: 'new',
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getPortfolioItems() {
  const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
  const q = query(portfolioRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as PortfolioItem[];
}

export async function getPortfolioItemById(id: string) {
  const docRef = doc(db, COLLECTIONS.PORTFOLIO, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as PortfolioItem;
  }
  return null;
}

export async function updatePortfolioItem(id: string, data: Partial<PortfolioItem>) {
  const docRef = doc(db, COLLECTIONS.PORTFOLIO, id);
  // Filter out undefined values to prevent Firebase errors
  const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  await updateDoc(docRef, cleanData as DocumentData);
}

export async function deletePortfolioItem(id: string) {
  const docRef = doc(db, COLLECTIONS.PORTFOLIO, id);
  await deleteDoc(docRef);
}

export async function addPortfolioItem(data: Omit<PortfolioItem, 'id'>) {
  const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
  const docRef = await addDoc(portfolioRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}
