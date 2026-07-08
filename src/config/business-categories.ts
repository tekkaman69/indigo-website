/**
 * Catégories métier fixes pour les filtres de la section Réalisations (home)
 * et le sélecteur admin. Liste fermée — contrairement à `category`/`industry`
 * (texte libre historique), garantit des onglets de filtre cohérents.
 */
export const BUSINESS_CATEGORIES = [
  'Ecommerce',
  'Agence',
  'Startup IA',
  'SaaS',
  'Consulting',
  'Institut de beauté',
  'Santé & Bien-être',
  'Immobilier',
  'Tourisme & Voyage',
  'Restauration',
  'Artisanat',
  'Éducation',
  'Autre',
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];
