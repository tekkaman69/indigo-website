export type ServiceCategory =
  | 'Motion Design'
  | 'Montage Vidéo'
  | 'Réseaux sociaux'
  | 'Graphisme'
  | 'Automatisation';

export type QuestionType = 'short_text' | 'long_text' | 'select' | 'multiple_select';

export interface FormQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string[]; // Pour select/multiple_select
  placeholder?: string;
}

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  price: number;
  deliveryTime: number; // en jours
  imageUrl?: string; // Image/GIF pour la card (16:9)
  formSchema: FormQuestion[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'pending'      // En attente paiement
  | 'paid'         // Payé, non démarré
  | 'in_progress'  // En cours de production
  | 'delivered'    // Livré
  | 'cancelled';   // Annulé

export interface OrderItem {
  serviceId: string;
  serviceTitle: string;
  price: number;
  quantity: number;
  answers: Record<string, any>; // Réponses aux questions
}

export interface Order {
  id: string;
  orderId: string; // Format: ORD-XXXXXX
  magicToken: string; // Pour accès sans login
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  lemonSqueezyOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  type: 'admin' | 'system';
  message: string;
  createdAt: Date;
}

export interface OrderFile {
  id: string;
  orderId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface CartItem {
  service: Service;
  quantity: number;
  answers: Record<string, any>;
}
