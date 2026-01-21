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
  date: string;
  imageUrl: string;
  coverPosition?: string;
  tags: string[];
  featured: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  // New structured editor data
  sections?: any[]; // Will be typed as Section[] from portfolio-editor
  version?: number;
}
