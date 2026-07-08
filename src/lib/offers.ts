// ============================================
// OFFRES — PACKS ACQUISITION
// Source de vérité unique des offres payables en ligne.
// Module sans dépendance serveur : importable côté client ET serveur.
// Doit rester aligné avec src/lib/pricing.config.ts (packs affichés sur la home)
// ============================================

export const OFFERS = {
  'pack-starter': {
    label: 'Pack PREZANS',
    totalPrice: 490,
    description:
      'Fiche Google Business créée et optimisée, une page mobile avec bouton WhatsApp direct, profil Instagram remis à niveau de A à Z, 1 semaine de publications prêtes à poster.',
  },
  'pack-local': {
    label: 'Pack KLIYAN',
    totalPrice: 1190,
    description:
      'Fiche Google Business optimisée, page mobile qui convertit vos visiteurs en demandes WhatsApp, profil Instagram remis à niveau, 3 semaines de publications, 2 à 3 publicités Facebook/Instagram installées et lancées, suivi 30 jours avec bilan vocal WhatsApp chaque semaine.',
    adBudget: 'Budget pub conseillé : 200 à 400 € (à votre charge)',
  },
  'pack-premium': {
    label: 'Pack LIDÈ',
    totalPrice: 1990,
    description:
      'Identité visuelle complète, 4 à 5 semaines de publications, page premium, 5 à 6 publicités avec plusieurs angles testés, campagne Facebook/Instagram sur 30 à 45 jours, suivi renforcé + bilan stratégique, montage du dossier de subvention Chèque TIC / Pass Numérique inclus.',
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

/** Premier versement du plan en 3 fois sans frais, arrondi à l'euro. */
export function getDepositAmount(totalPrice: number): number {
  return Math.round(totalPrice / 3);
}
