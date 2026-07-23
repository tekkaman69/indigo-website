// ============================================
// OFFRES — PACKS ACQUISITION
// Source de vérité unique des offres payables en ligne.
// Module sans dépendance serveur : importable côté client ET serveur.
// Doit rester aligné avec src/lib/pricing.config.ts (packs affichés sur la home)
// ============================================

export const OFFERS = {
  'pack-starter': {
    label: 'Pack ESSENTIEL',
    totalPrice: 490,
    // Offre d'appel : payée comptant, pas de plan en 3 fois.
    paymentMode: 'full',
    description:
      'Votre logo, vos couleurs et vos 2 polices, 9 visuels Instagram prêts à publier, et un support au choix : flyer, bannière, carte de visite, bon cadeau ou carte de prix. Livré prêt à l\'emploi en 7 jours.',
  },
  'pack-local': {
    label: 'Pack CROISSANCE',
    totalPrice: 1190,
    paymentMode: 'installments',
    description:
      'Votre logo et vos couleurs, votre fiche Google mise à jour, une page web simple avec bouton WhatsApp, votre Instagram remis à neuf, 18 visuels prêts à publier, 2 à 3 publicités créées et lancées, et un mois de suivi avec un point WhatsApp chaque semaine.',
    adBudget: 'Budget publicité conseillé : 200 à 400 € (à votre charge)',
  },
  'pack-premium': {
    label: 'Pack SIGNATURE',
    totalPrice: 1990,
    paymentMode: 'installments',
    description:
      'Une identité visuelle complète, une page web pro, 40 visuels prêts à publier, 5 à 6 publicités testées, une campagne lancée et suivie pendant 1 à 1,5 mois, un suivi rapproché et un bilan complet à la fin. Financement possible aux Antilles (dossier inclus).',
    adBudget: 'Budget publicité conseillé : 500 à 1000 € (à votre charge)',
  },
} as const;

export type OfferId = keyof typeof OFFERS;
export type Offer = (typeof OFFERS)[OfferId];
export type PaymentMode = 'full' | 'installments';

export function isValidOfferId(id: string): id is OfferId {
  return id in OFFERS;
}

export function getOffer(offerId: OfferId) {
  return OFFERS[offerId];
}

/**
 * Montant réellement débité au 1er paiement en ligne :
 * - offre 'full' : la totalité du prix (paiement comptant)
 * - offre 'installments' : le 1er des 3 versements sans frais, arrondi à l'euro
 */
export function getPaymentAmount(offer: Offer): number {
  return offer.paymentMode === 'full'
    ? offer.totalPrice
    : Math.round(offer.totalPrice / 3);
}

/**
 * Premier versement du plan en 3 fois sans frais, arrondi à l'euro.
 * @deprecated Utiliser getPaymentAmount(offer) qui gère aussi le comptant.
 */
export function getDepositAmount(totalPrice: number): number {
  return Math.round(totalPrice / 3);
}
