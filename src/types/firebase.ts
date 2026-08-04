import { Timestamp } from 'firebase/firestore';
import type { BusinessCategory } from '@/config/business-categories';

export type MosaicTemplate = 'mosaic-6' | 'mosaic-5' | 'mosaic-3';

export interface MosaicSlotImage {
  url: string;
  path?: string;
  /** Point focal du recadrage (en % de la largeur/hauteur), défaut centré 50/50 */
  focalPoint?: { x: number; y: number };
  /** Niveau de zoom du recadrage (en %), défaut 100 = pas de zoom */
  zoom?: number;
}

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

export interface MosaicItem {
  id: string;
  url: string;
  alt: string;
  /** Asset source (collection assets) */
  assetId?: string;
  /** Projet lié si l'image est utilisée dans un projet (clic → /portfolio/[id]) */
  projectId?: string;
  projectTitle?: string;
  industry?: string;
  order: number;
  active: boolean;
  createdAt: Timestamp;
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
  // Récit narratif (viewer story — conservé, non utilisé par le showcase actuel)
  before?: { url: string; path?: string };
  after?: { url: string; path?: string };
  delivered?: Array<{ label: string; imageUrl: string; imagePath?: string }>;
  // Mosaïque de la carte sur la home (ProjectShowcase)
  businessCategory?: BusinessCategory;
  /** Gabarit de mosaïque utilisé par la carte (absent = repli sur coverImage/imageUrl) */
  mosaicTemplate?: MosaicTemplate;
  /** Une image par slot, dans l'ordre défini par le gabarit choisi */
  mosaicSlots?: MosaicSlotImage[];
}

/**
 * Carte projet affichée sur la home (ProjectShowcase) — entité indépendante
 * du vrai système de portfolio (PortfolioItem). L'existence d'un document
 * ici avec published===true est le seul signal d'affichage (pas de notion
 * "featured" : ce n'est plus PortfolioItem.featured qui gère la home).
 */
export interface HomeProject {
  id: string;
  title: string;
  businessCategory?: BusinessCategory;
  mosaicTemplate?: MosaicTemplate;
  mosaicSlots?: MosaicSlotImage[];
  /** Projet portfolio complet lié (clic carte → /portfolio/[id]), optionnel */
  linkedPortfolioId?: string;
  published: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/** Nombre de visuels d'un feed Instagram (grille 3×3 fixe). */
export const FEED_SLOT_COUNT = 9;

/**
 * Feed Instagram réalisé pour un client, affiché sur la home (InstaFeedShowcase)
 * — une mosaïque de 9 visuels au format 4:5 disposés en grille 3 colonnes × 3
 * rangées, mimant l'aperçu d'un profil Instagram. Entité indépendante de
 * HomeProject/PortfolioItem : expose les feeds Insta comme ProjectShowcase
 * expose les identités graphiques.
 */
export interface InstaFeed {
  id: string;
  /** Nom du client / repère affiché sous le feed */
  clientName?: string;
  caption?: string;
  /** Les 9 visuels du feed, dans l'ordre de lecture (gauche→droite, haut→bas) */
  slots: MosaicSlotImage[];
  published: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Image d'un projet de communication — le ratio naturel est conservé pour la
 * mosaïque masonry (pas de recadrage forcé). `ratio` (largeur/hauteur) est
 * mémorisé à l'upload pour éviter tout saut de mise en page au chargement.
 */
export interface CommImage {
  url: string;
  path?: string;
  /** Ratio largeur/hauteur de l'image (ex: 0.71 pour un portrait A4), pour le masonry */
  ratio?: number;
  alt?: string;
}

/**
 * Projet de communication institutionnelle affiché sur la home (CommShowcase)
 * — vitrine à but recruteur (poste chargé de com / graphiste au rectorat) :
 * affiches, brochures, signalétique, supports officiels. Contrairement aux
 * autres modules, chaque projet porte un contexte (titre + description du
 * brief) et affiche ses visuels en mosaïque masonry flexible (ratios variés
 * préservés). Entité indépendante de HomeProject/InstaFeed.
 */
export interface CommProject {
  id: string;
  /** Titre du projet (ex: « Affiche — Journée portes ouvertes ») */
  title: string;
  /** Contexte / brief en une ou deux phrases (affiché sous le titre) */
  description?: string;
  /** Type de support (ex: « Affiche », « Brochure », « Signalétique ») */
  supportType?: string;
  /** Visuels du projet, ratios variés, affichés en masonry */
  images: CommImage[];
  published: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
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
  /** Référence du paiement (id de session Stripe Checkout) */
  paymentRef?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
