import type { OfferId } from '@/lib/offers';

// ============================================
// PACKS PRICING — HOME (AcquisitionPacks)
// Source de vérité unique des packs affichés sur la page pricing.
// Doit rester aligné avec src/lib/offers.ts (offres payables en ligne).
// ============================================

export interface PricingPack {
  id: string;
  /** Identifiant de l'offre payable en ligne (lib/offers.ts) */
  offerId: OfferId;
  name: string;
  tagline: string;
  price: string;
  /** Argument de paiement échelonné affiché sous le prix (absent = payé comptant) */
  installment?: string;
  /** Libellé du premier versement affiché dans le sous-CTA ("acompte dès X €") */
  firstInstallmentLabel: string;
  /** Délai de livraison affiché sous le prix (optionnel) */
  deliveryNote?: string;
  /** Encart spécial affiché entre le prix et les features (ex: subvention) */
  fundingNote?: string;
  features: string[];
  /** Budget publicitaire conseillé — absent si le pack n'inclut pas de campagne pub */
  adBudget?: string;
  highlight?: boolean;
  badge?: 'most-chosen' | 'fundable';
}

export const PRICING_PACKS: PricingPack[] = [
  {
    id: 'essentiel',
    offerId: 'pack-starter',
    name: 'ESSENTIEL',
    tagline: 'Une image pro pour bien démarrer, sans exploser votre budget.',
    price: '490 €',
    firstInstallmentLabel: 'paiement en une fois',
    deliveryNote: 'prêt en 7 jours',
    features: [
      'Votre logo, vos couleurs et vos 2 polices de caractères',
      '9 visuels Instagram prêts à publier',
      'Un support au choix : flyer, bannière, carte de visite, bon cadeau ou carte de prix',
      'Livré prêt à l\'emploi, vous n\'avez plus qu\'à publier',
    ],
  },
  {
    id: 'croissance',
    offerId: 'pack-local',
    name: 'CROISSANCE',
    tagline: 'Le pack qui fait venir les clients, suivi pendant un mois.',
    price: '1 190 €',
    installment: 'ou 3 × 397 € sans frais',
    firstInstallmentLabel: 'acompte dès 397 €',
    features: [
      'Votre logo, vos couleurs et vos polices',
      'Votre fiche Google mise à jour pour être bien visible',
      'Une page web simple avec un bouton pour vous écrire sur WhatsApp',
      'Votre compte Instagram remis à neuf de A à Z',
      '18 visuels prêts à publier',
      '2 à 3 publicités créées et lancées pour vous',
      'Un mois de suivi, avec un point vocal WhatsApp chaque semaine',
    ],
    adBudget: '200 à 400 € (à votre charge)',
    highlight: true,
    badge: 'most-chosen',
  },
  {
    id: 'signature',
    offerId: 'pack-premium',
    name: 'SIGNATURE',
    tagline: 'Tout ce qu\'il faut pour vous faire connaître en grand.',
    price: '1 990 €',
    installment: 'ou 3 × 664 € sans frais',
    firstInstallmentLabel: 'acompte dès 664 €',
    fundingNote:
      'Aux Antilles, cette offre peut être en partie financée (Chèque TIC en Guadeloupe, Pass Numérique en Martinique). Je m\'occupe du dossier pour vous.',
    features: [
      'Une identité visuelle complète et soignée',
      'Une page web pro pensée pour donner envie de vous contacter',
      '40 visuels prêts à publier',
      '5 à 6 publicités testées pour trouver ce qui marche le mieux',
      'Une campagne lancée et suivie pendant 1 à 1,5 mois',
      'Un suivi rapproché et un bilan complet à la fin',
    ],
    adBudget: '500 à 1000 € (à votre charge)',
    badge: 'fundable',
  },
];

export function packMessage(pack: PricingPack): string {
  return `Bonjour, je suis intéressé(e) par le Pack ${pack.name} (${pack.price}). Pouvez-vous m'en dire plus ?`;
}
