'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, CreditCard } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';
import type { OfferId } from '@/lib/offers';

interface Pack {
  id: string;
  /** Identifiant de l'offre payable en ligne (lib/offers.ts) */
  offerId: OfferId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  adBudget: string;
  highlight?: boolean;
  badge?: string;
}

const PACKS: Pack[] = [
  {
    id: 'starter',
    offerId: 'pack-starter',
    name: 'Acquisition Starter',
    price: '990 €',
    tagline: 'Pour démarrer avec un budget maîtrisé.',
    features: [
      'Optimisation Instagram',
      'Mini direction artistique',
      '9 posts Instagram + 3 stories',
      'One page tunnel simple',
      '2 créas publicitaires',
      'Configuration campagne Meta',
      'Suivi 14 jours',
    ],
    adBudget: 'Budget pub conseillé : 200 à 400 € (à votre charge)',
  },
  {
    id: 'local',
    offerId: 'pack-local',
    name: 'Acquisition Local',
    price: '1 490 €',
    tagline: 'La base digitale complète pour générer des demandes.',
    features: [
      'Identité visuelle express',
      'Optimisation Instagram complète',
      '12 à 15 posts + 5 stories + 3 highlights',
      'One page tunnel de vente',
      '3 à 4 créas publicitaires',
      'Campagne Meta Ads',
      'Suivi 30 jours + bilan & recommandations',
    ],
    adBudget: 'Budget pub conseillé : 300 à 600 € (à votre charge)',
    highlight: true,
    badge: 'Le plus choisi',
  },
  {
    id: 'premium',
    offerId: 'pack-premium',
    name: 'Acquisition Premium',
    price: '1 990 €',
    tagline: 'Pour aller plus loin et tester plusieurs angles.',
    features: [
      'Identité visuelle plus poussée',
      '20 à 24 posts + 8 à 10 stories',
      'One page premium',
      '5 à 6 créas + 2 à 3 angles testés',
      'Campagne Meta Ads 30 à 45 jours',
      'Optimisation plus poussée',
      'Bilan stratégique',
    ],
    adBudget: 'Budget pub conseillé : 500 à 1000 € (à votre charge)',
  },
];

function packMessage(pack: Pack): string {
  return `Bonjour, je suis intéressé(e) par le Pack ${pack.name} (${pack.price}). Pouvez-vous m'en dire plus ?`;
}

export default function AcquisitionPacks() {
  const reduce = useReducedMotion();

  return (
    <section id="offres" className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Nos packages de présence numérique</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Un système complet pour attirer des clients
          </h2>
          <p className="mt-4 text-white/55 text-lg leading-relaxed">
            Image, contenu, page de conversion et campagne publicitaire ciblée. L'objectif :
            maximiser vos chances d'obtenir des demandes qualifiées grâce à une présence crédible.
          </p>
        </motion.div>

        {/* Grille des packs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={reduce ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-xl border backdrop-blur-md p-7 transition-colors ${
                pack.highlight
                  ? 'border-indigo-500/40 bg-indigo-500/10 lg:-mt-4 lg:mb-4 shadow-lg shadow-indigo-900/20'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              {pack.highlight && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
              )}

              {pack.badge && (
                <span className="self-start mb-4 inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-[11px] font-semibold uppercase tracking-wider">
                  {pack.badge}
                </span>
              )}

              <h3 className="text-xl font-semibold text-white">{pack.name}</h3>
              <p className="mt-1 text-sm text-white/50">{pack.tagline}</p>

              <div className="mt-5 mb-6">
                <span className={`text-4xl font-bold tabular-nums ${pack.highlight ? 'text-indigo-200' : 'text-white'}`}>
                  {pack.price}
                </span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {pack.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs text-white/35 mb-5 leading-relaxed">{pack.adBudget}</p>

              <WhatsAppButton
                label={`Choisir ${pack.name.replace('Acquisition ', '')}`}
                size="md"
                message={packMessage(pack)}
              />

              {/* Paiement en ligne — lien discret pour les décidés */}
              <Link
                href={`/checkout?offer=${pack.offerId}`}
                className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-indigo-300 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Ou commander en ligne — acompte 50 %
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Note de réassurance */}
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 text-center text-xs text-white/30 max-w-2xl mx-auto leading-relaxed"
        >
          Le budget publicitaire est versé directement à Meta et reste à votre charge. Nous ne
          garantissons pas un nombre de clients : nous mettons en place un système structuré pour
          maximiser vos chances d'obtenir des demandes qualifiées. Acompte 50 % au démarrage.
        </motion.p>
      </div>
    </section>
  );
}
