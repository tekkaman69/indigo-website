import { Timestamp } from 'firebase/firestore';

export interface ContactSubmission {
  id: string;
  name: string;
  company?: string;
  email: string;
  service?: string;
  budget?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Timestamp;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
  rating: number;
  featured: boolean;
  order: number;
  createdAt: Timestamp;
}

export interface Service {
  id: string;
  value: string;
  title: string;
  description: string;
  icon: string;
  items: ServiceItem[];
  order: number;
}

export interface ServiceItem {
  icon: string;
  text: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  categories?: string[];
  date: string;
  imageUrl: string;
  coverImage?: { url: string; path?: string };
  coverPosition?: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  order: number;
  // Champs contextualisés pour la landing
  industry?: string;
  problem?: string;
  solution?: string;
  result?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  // Type de projet
  type?: 'graphisme' | 'web';
  // URL externe (projets web uniquement)
  url?: string;
  // Mise en avant section web landing
  webFeatured?: boolean;
  // New structured editor data
  sections?: any[]; // Will be typed as Section[] from portfolio-editor
  version?: number;
}

export interface OrderIntention {
  id: string;
  offerId: string;
  offerLabel: string;
  totalPrice: number;
  depositAmount: number;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientDescription?: string;
  status: 'pending' | 'paid' | 'failed';
  lemonOrderId?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
