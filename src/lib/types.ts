export type PortfolioCategory =
  | 'Automatisation'
  | 'Vidéo'
  | 'Réseaux sociaux'
  | 'Graphisme'
  | 'Identité / Branding'
  | 'Ads';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  categories: PortfolioCategory[];
  coverImage: {
    url: string;
    hint: string;
  };
  tags: string[];
  date: string; // ISO 8601 format
  featured: boolean;
  galleryImages?: { url: string; hint: string }[];
}
