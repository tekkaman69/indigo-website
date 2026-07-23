'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, CreditCard, Info } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from '../WhatsApp';
import PricingBadge from './PricingBadge';
import type { PricingPack } from '@/lib/pricing.config';
import { packMessage } from '@/lib/pricing.config';

interface PricingCardProps {
  pack: PricingPack;
  index: number;
}

/** Carte pricing individuelle — un pack, avec badge optionnel, encart financement optionnel. */
export default function PricingCard({ pack, index }: PricingCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-xl border backdrop-blur-md transition-colors ${
        pack.highlight
          ? 'border-indigo-500/50 bg-indigo-500/[0.12] p-8 lg:-mt-6 lg:mb-6 shadow-xl shadow-indigo-900/30'
          : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05] p-7'
      }`}
    >
      {pack.highlight && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent" />
      )}

      {pack.badge && (
        <PricingBadge variant={pack.badge} className="self-start mb-4" />
      )}

      <h3 className={`font-semibold text-white ${pack.highlight ? 'text-2xl' : 'text-xl'}`}>
        {pack.name}
      </h3>
      <p className="mt-1 text-sm text-white/50">{pack.tagline}</p>

      <div className="mt-5 mb-1">
        <span className={`font-bold tabular-nums ${pack.highlight ? 'text-5xl text-indigo-200' : 'text-4xl text-white'}`}>
          {pack.price}
        </span>
      </div>
      <p className="text-xs text-white/40 mb-6">
        {pack.installment
          ? <>{pack.installment}{pack.deliveryNote && <> — {pack.deliveryNote}</>}</>
          : pack.deliveryNote}
      </p>

      {pack.fundingNote && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3.5 py-3">
          <Info className="w-4 h-4 text-violet-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/70 leading-relaxed">{pack.fundingNote}</p>
        </div>
      )}

      <ul className="space-y-2.5 mb-6 flex-1">
        {pack.features.map(feature => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${pack.highlight ? 'text-indigo-300' : 'text-indigo-400'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Zone basse — toujours alignée en bas de carte quel que soit le nombre de features */}
      <div className="mt-auto">
        {pack.adBudget && (
          <p className="text-xs text-white/35 mb-5 leading-relaxed">
            Budget pub conseillé : {pack.adBudget}
          </p>
        )}

        <WhatsAppButton
          label={`Choisir ${pack.name}`}
          size={pack.highlight ? 'lg' : 'md'}
          message={packMessage(pack)}
          fullWidth
        />

        {/* Paiement en ligne — lien discret pour les décidés */}
        <Link
          href={`/checkout?offer=${pack.offerId}`}
          className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-indigo-300 transition-colors w-full"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Ou commander en ligne — {pack.firstInstallmentLabel}
        </Link>
      </div>
    </motion.div>
  );
}
