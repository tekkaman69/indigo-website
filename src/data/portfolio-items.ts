import type { PortfolioItem } from '@/lib/types';

/**
 * Portfolio items statiques
 *
 * Ce fichier contenait initialement des projets d'exemple.
 * Ils ont été migrés vers Firestore et peuvent maintenant être gérés
 * depuis l'interface admin: /admin/portfolio
 *
 * Laissez ce tableau vide pour utiliser uniquement Firestore.
 */
export const portfolioItems: PortfolioItem[] = [];
