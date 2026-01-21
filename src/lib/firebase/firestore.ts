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
} as const;

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
