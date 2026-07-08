/**
 * Types du ProjectShowcase (portfolio narratif de la home).
 * Les données proviennent de Firestore (PortfolioItem) via
 * src/lib/adaptPortfolioItem.ts — ce fichier ne contient que les types
 * consommés par les composants showcase/ (Card, Feed, BentoGrid, Viewer...).
 */

export type MediaKind = 'image' | 'video';

export interface MediaItem {
  kind: MediaKind;
  /** '' déclenche un PlaceholderMesh à la place d'une vraie image/vidéo */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Image affichée avant chargement, pour kind: 'video' */
  poster?: string;
}

export interface DeliveredItem {
  label: string;
  media: MediaItem;
}

export type ProjectResult =
  | { kind: 'metric'; value: string; label: string }
  | { kind: 'testimonial'; quote: string; author: string; role: string; avatar?: MediaItem }
  /** Résultat en texte libre (ex: "Augmentation du taux de conversion de 40%") — pas de compteur animé */
  | { kind: 'text'; label: string };

export interface Project {
  slug: string;
  client: string;
  sector: string;
  /** true = projet interne Indigo, affiché honnêtement comme tel */
  isInternal?: boolean;
  /** Cover : tuile bento/feed + écran 1 du viewer (layoutId partagé) */
  cover: MediaItem;
  logo?: MediaItem;
  /** Une phrase, dans les mots du client */
  problem: string;
  /** 3-4 items en langage client, chacun illustré */
  delivered: DeliveredItem[];
  gallery: MediaItem[];
  /** Optionnels ensemble — absents = repli sur un second mockup dans le viewer */
  before?: MediaItem;
  after?: MediaItem;
  result?: ProjectResult;
}
