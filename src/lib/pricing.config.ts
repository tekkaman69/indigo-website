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
  /** Argument de paiement échelonné affiché sous le prix */
  installment: string;
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
    id: 'prezans',
    offerId: 'pack-starter',
    name: 'PREZANS',
    tagline: 'Pour exister là où vos clients vous cherchent.',
    price: '490 €',
    installment: 'ou 3 × 164 € sans frais',
    firstInstallmentLabel: 'acompte dès 164 €',
    deliveryNote: 'livré en 7 jours',
    features: [
      'Fiche Google Business créée et optimisée',
      'Une page mobile avec bouton WhatsApp direct',
      'Une identité visuelle de base (logo, couleurs, typographie)',
      'Profil Instagram remis à niveau de A à Z',
      '1 semaine de publications prêtes à poster',
    ],
  },
  {
    id: 'kliyan',
    offerId: 'pack-local',
    name: 'KLIYAN',
    tagline: 'La machine à demandes, surveillée pendant 30 jours.',
    price: '1 190 €',
    installment: 'ou 3 × 397 € sans frais',
    firstInstallmentLabel: 'acompte dès 397 €',
    features: [
      'Fiche Google Business optimisée',
      'Une page mobile qui convertit vos visiteurs en demandes WhatsApp',
      'Une identité visuelle cohérente (logo, couleurs, typographie)',
      'Profil Instagram remis à niveau de A à Z',
      '3 semaines de publications prêtes à poster',
      '2 à 3 publicités Facebook/Instagram installées et lancées',
      'Suivi 30 jours avec bilan vocal WhatsApp chaque semaine',
    ],
    adBudget: '200 à 400 € (à votre charge)',
    highlight: true,
    badge: 'most-chosen',
  },
  {
    id: 'lide',
    offerId: 'pack-premium',
    name: 'LIDÈ',
    tagline: "L'offre complète pour tester plusieurs angles et scaler.",
    price: '1 990 €',
    installment: 'ou 3 × 664 € sans frais',
    firstInstallmentLabel: 'acompte dès 664 €',
    fundingNote:
      'Reste à charge possible dès ~400 € avec le Chèque TIC (Guadeloupe) ou le Pass Numérique (Martinique). Montage du dossier inclus.',
    features: [
      'Une identité visuelle complète et travaillée',
      '4 à 5 semaines de publications prêtes à poster',
      'Une page premium qui transforme vos visiteurs en demandes',
      '5 à 6 publicités prêtes à diffuser, avec plusieurs angles testés',
      'Campagne Facebook/Instagram installée et lancée sur 30 à 45 jours',
      'Suivi renforcé + bilan stratégique complet en fin de campagne',
      'Montage du dossier de subvention Chèque TIC / Pass Numérique inclus',
    ],
    adBudget: '500 à 1000 € (à votre charge)',
    badge: 'fundable',
  },
];

export function packMessage(pack: PricingPack): string {
  return `Bonjour, je suis intéressé(e) par le Pack ${pack.name} (${pack.price}). Pouvez-vous m'en dire plus ?`;
}
