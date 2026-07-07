import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, Timestamp, type Firestore } from 'firebase-admin/firestore';
import type { OrderIntention } from '@/types/firebase';

// ============================================
// FIREBASE ADMIN SDK — serveur uniquement
// Contourne les règles Firestore : à n'utiliser QUE dans les routes API.
// Nécessite FIREBASE_SERVICE_ACCOUNT_KEY (JSON du service account) en env.
// ============================================

function getAdminApp(): App | null {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  try {
    const serviceAccount = JSON.parse(raw);
    return initializeApp({ credential: cert(serviceAccount) });
  } catch (err) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY invalide (JSON attendu):', err);
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

// ============================================
// ORDER INTENTIONS (écriture serveur sécurisée)
// ============================================

const ORDER_INTENTIONS = 'order_intentions';

export async function adminCreateOrderIntention(
  data: Omit<OrderIntention, 'id' | 'createdAt'>
): Promise<string> {
  const db = getAdminDb();
  if (!db) throw new Error('FIREBASE_ADMIN_NOT_CONFIGURED');

  const docRef = await db.collection(ORDER_INTENTIONS).add({
    ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function adminUpdateOrderIntention(
  id: string,
  data: Partial<Omit<OrderIntention, 'id' | 'createdAt'>>
): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error('FIREBASE_ADMIN_NOT_CONFIGURED');

  await db
    .collection(ORDER_INTENTIONS)
    .doc(id)
    .update({
      ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)),
      updatedAt: Timestamp.now(),
    });
}
