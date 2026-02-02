import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import type {
  Service,
  Order,
  OrderMessage,
  OrderFile,
  OrderStatus,
} from '@/types/marketplace';

const COLLECTIONS = {
  SERVICES: 'services',
  ORDERS: 'orders',
  ORDER_MESSAGES: 'order_messages',
  ORDER_FILES: 'order_files',
};

// ============================================
// SERVICES
// ============================================

export async function getServices(activeOnly = true): Promise<Service[]> {
  try {
    const servicesRef = collection(db, COLLECTIONS.SERVICES);
    let q = query(servicesRef, orderBy('createdAt', 'desc'));

    if (activeOnly) {
      q = query(servicesRef, where('active', '==', true), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Service;
    });
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const docRef = doc(db, COLLECTIONS.SERVICES, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Service;
  } catch (error) {
    console.error('Error getting service:', error);
    throw error;
  }
}

export async function addService(
  data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SERVICES, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SERVICES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

// ============================================
// ORDERS
// ============================================

function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateMagicToken(): string {
  return crypto.randomUUID();
}

export async function createOrder(
  data: Omit<Order, 'id' | 'orderId' | 'magicToken' | 'createdAt' | 'updatedAt'>
): Promise<{ orderId: string; magicToken: string }> {
  try {
    const now = Timestamp.now();
    const orderId = generateOrderId();
    const magicToken = generateMagicToken();

    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      ...data,
      orderId,
      magicToken,
      createdAt: now,
      updatedAt: now,
    });

    return { orderId, magicToken };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const q = query(ordersRef, where('magicToken', '==', token));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Order;
  } catch (error) {
    console.error('Error getting order by token:', error);
    throw error;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order;
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Order;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updateOrder(
  id: string,
  data: Partial<Omit<Order, 'id' | 'orderId' | 'magicToken' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

// ============================================
// ORDER MESSAGES
// ============================================

export async function addOrderMessage(
  orderId: string,
  message: string,
  type: 'admin' | 'system'
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDER_MESSAGES), {
      orderId,
      message,
      type,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding order message:', error);
    throw error;
  }
}

export async function getOrderMessages(orderId: string): Promise<OrderMessage[]> {
  try {
    const messagesRef = collection(db, COLLECTIONS.ORDER_MESSAGES);
    const q = query(messagesRef, where('orderId', '==', orderId), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as OrderMessage;
    });
  } catch (error) {
    console.error('Error getting order messages:', error);
    throw error;
  }
}

// ============================================
// ORDER FILES
// ============================================

export async function addOrderFile(
  orderId: string,
  fileName: string,
  fileUrl: string,
  fileSize: number
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDER_FILES), {
      orderId,
      fileName,
      fileUrl,
      fileSize,
      uploadedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding order file:', error);
    throw error;
  }
}

export async function getOrderFiles(orderId: string): Promise<OrderFile[]> {
  try {
    const filesRef = collection(db, COLLECTIONS.ORDER_FILES);
    const q = query(filesRef, where('orderId', '==', orderId), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        uploadedAt: data.uploadedAt?.toDate() || new Date(),
      } as OrderFile;
    });
  } catch (error) {
    console.error('Error getting order files:', error);
    throw error;
  }
}

export async function deleteOrderFile(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.ORDER_FILES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting order file:', error);
    throw error;
  }
}
