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
  limit,
  Timestamp,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';
import type { ContactSubmission, PortfolioItem, OrderIntention, MosaicItem, HomeProject } from '@/types/firebase';

export const COLLECTIONS = {
  CONTACTS: 'contacts',
  PORTFOLIO: 'portfolio',
  TESTIMONIALS: 'testimonials',
  SERVICES: 'services',
  SITE_SETTINGS: 'site_settings',
  ORDER_INTENTIONS: 'order_intentions',
  MOSAIC_ITEMS: 'mosaic_items',
  HOME_PROJECTS: 'home_projects',
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

export async function getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
    // Tenter une requête combinée (nécessite un index Firestore)
    const q = query(
      portfolioRef,
      where('published', '==', true),
      where('featured', '==', true),
      orderBy('order', 'asc'),
      limit(24)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as PortfolioItem[];
  } catch {
    // Fallback: récupérer tous les items et filtrer côté client
    // (utile si l'index Firestore n'est pas encore créé)
    const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
    const snapshot = await getDocs(portfolioRef);
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as PortfolioItem[];
    return all
      .filter(item => item.published !== false && item.featured === true)
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .slice(0, 24);
  }
}

export async function getFeaturedWebPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
    const q = query(
      portfolioRef,
      where('published', '==', true),
      where('webFeatured', '==', true),
      orderBy('order', 'asc'),
      limit(6)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as PortfolioItem[];
  } catch {
    const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
    const snapshot = await getDocs(portfolioRef);
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as PortfolioItem[];
    return all
      .filter(item => item.published !== false && item.webFeatured === true)
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .slice(0, 6);
  }
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
  // Filtrer les undefined (Firestore les rejette)
  const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {} as Record<string, unknown>);
  const docRef = await addDoc(portfolioRef, {
    ...cleanData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// ============================================
// ORDER INTENTIONS (checkout acompte)
// ============================================

export async function createOrderIntention(
  data: Omit<OrderIntention, 'id' | 'createdAt'>
): Promise<string> {
  const ref = collection(db, COLLECTIONS.ORDER_INTENTIONS);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateOrderIntention(
  id: string,
  data: Partial<Omit<OrderIntention, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.ORDER_INTENTIONS, id);
  const cleanData = Object.entries({ ...data, updatedAt: Timestamp.now() }).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>
  );
  await updateDoc(docRef, cleanData as DocumentData);
}

export async function getOrderIntentionById(id: string): Promise<OrderIntention | null> {
  const docRef = doc(db, COLLECTIONS.ORDER_INTENTIONS, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as OrderIntention;
  }
  return null;
}

export async function getOrderIntentions(): Promise<OrderIntention[]> {
  const ref = collection(db, COLLECTIONS.ORDER_INTENTIONS);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as OrderIntention[];
}

// ============================================
// MOSAIC ITEMS
// ============================================

export async function getMosaicItems(): Promise<MosaicItem[]> {
  const ref = collection(db, COLLECTIONS.MOSAIC_ITEMS);
  try {
    // Requête combinée (nécessite un index composite active + order)
    const q = query(ref, where('active', '==', true), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as MosaicItem[];
  } catch {
    // Fallback sans index : on récupère tout et on filtre/trie côté client
    const snap = await getDocs(ref);
    return (snap.docs.map(d => ({ id: d.id, ...d.data() })) as MosaicItem[])
      .filter(m => m.active !== false)
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }
}

export async function getAllMosaicItems(): Promise<MosaicItem[]> {
  const ref = collection(db, COLLECTIONS.MOSAIC_ITEMS);
  const snap = await getDocs(ref);
  return (snap.docs.map(d => ({ id: d.id, ...d.data() })) as MosaicItem[])
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function addMosaicItem(
  item: Omit<MosaicItem, 'id' | 'createdAt'>
): Promise<string> {
  const ref = collection(db, COLLECTIONS.MOSAIC_ITEMS);
  const docRef = await addDoc(ref, { ...item, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateMosaicItem(
  id: string,
  data: Partial<Omit<MosaicItem, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MOSAIC_ITEMS, id);
  await updateDoc(docRef, data);
}

export async function deleteMosaicItem(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MOSAIC_ITEMS, id);
  await deleteDoc(docRef);
}

// ============================================
// HOME PROJECTS (cartes ProjectShowcase — entité indépendante de PortfolioItem)
// ============================================

export async function getHomeProjectsForDisplay(): Promise<HomeProject[]> {
  const ref = collection(db, COLLECTIONS.HOME_PROJECTS);
  try {
    const q = query(ref, where('published', '==', true), orderBy('order', 'asc'), limit(24));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as HomeProject[];
  } catch {
    // Fallback: récupérer tous les items et filtrer côté client
    // (utile si l'index Firestore n'est pas encore créé)
    const snap = await getDocs(ref);
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as HomeProject[];
    return all
      .filter(item => item.published === true)
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .slice(0, 24);
  }
}

export async function getAllHomeProjects(): Promise<HomeProject[]> {
  const ref = collection(db, COLLECTIONS.HOME_PROJECTS);
  const snap = await getDocs(ref);
  return (snap.docs.map(d => ({ id: d.id, ...d.data() })) as HomeProject[])
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getHomeProjectById(id: string): Promise<HomeProject | null> {
  const docRef = doc(db, COLLECTIONS.HOME_PROJECTS, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as HomeProject;
  }
  return null;
}

export async function addHomeProject(data: Omit<HomeProject, 'id' | 'createdAt'>): Promise<string> {
  const ref = collection(db, COLLECTIONS.HOME_PROJECTS);
  const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {} as Record<string, unknown>);
  const docRef = await addDoc(ref, { ...cleanData, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateHomeProject(id: string, data: Partial<Omit<HomeProject, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.HOME_PROJECTS, id);
  const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {} as Record<string, unknown>);
  await updateDoc(docRef, cleanData as DocumentData);
}

export async function deleteHomeProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.HOME_PROJECTS, id);
  await deleteDoc(docRef);
}
