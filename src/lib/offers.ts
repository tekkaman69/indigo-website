// ============================================
// OFFRES — PACKS ACQUISITION
// Source de vérité unique des offres payables en ligne.
// Module sans dépendance serveur : importable côté client ET serveur.
// Doit rester aligné avec components/home/funnel/AcquisitionPacks.tsx
// ============================================

export const OFFERS = {
  'pack-starter': {
    label: 'Pack Acquisition Starter',
    totalPrice: 990,
    description:
      'Optimisation Instagram, mini direction artistique, 9 posts + 3 stories, one page tunnel, 2 créas publicitaires, campagne Meta, suivi 14 jours.',
    adBudget: 'Budget pub conseillé : 200 à 400 € (à votre charge)',
  },
  'pack-local': {
    label: 'Pack Acquisition Local',
    totalPrice: 1490,
    description:
      'Identité visuelle express, Instagram complet, 12-15 posts + 5 stories + 3 highlights, one page tunnel de vente, 3-4 créas, campagne Meta Ads, suivi 30 jours + bilan.',
    adBudget: 'Budget pub conseillé : 300 à 600 € (à votre charge)',
  },
  'pack-premium': {
    label: 'Pack Acquisition Premium',
    totalPrice: 1990,
    description:
      'Identité visuelle poussée, 20-24 posts + 8-10 stories, one page premium, 5-6 créas, 2-3 angles testés, campagne Meta Ads 30-45 jours, bilan stratégique.',
    adBudget: 'Budget pub conseillé : 500 à 1000 € (à votre charge)',
  },
} as const;

export type OfferId = keyof typeof OFFERS;

export function isValidOfferId(id: string): id is OfferId {
  return id in OFFERS;
}

export function getOffer(offerId: OfferId) {
  return OFFERS[offerId];
}

/** Acompte de 50 %, arrondi à l'euro. */
export function getDepositAmount(totalPrice: number): number {
  return Math.round(totalPrice * 0.5);
}
