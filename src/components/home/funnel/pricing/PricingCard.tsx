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
        <PricingBadge variant={pack.badge} className="self-start mb-4" />
      )}

      <h3 className="text-xl font-semibold text-white">{pack.name}</h3>
      <p className="mt-1 text-sm text-white/50">{pack.tagline}</p>

      <div className="mt-5 mb-1">
        <span className={`text-4xl font-bold tabular-nums ${pack.highlight ? 'text-indigo-200' : 'text-white'}`}>
          {pack.price}
        </span>
      </div>
      <p className="text-xs text-white/40 mb-6">
        {pack.installment}
        {pack.deliveryNote && <> — {pack.deliveryNote}</>}
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
            <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {pack.adBudget && (
        <p className="text-xs text-white/35 mb-5 leading-relaxed">
          Budget pub conseillé : {pack.adBudget}
        </p>
      )}

      <WhatsAppButton
        label={`Choisir ${pack.name}`}
        size="md"
        message={packMessage(pack)}
      />

      {/* Paiement en ligne — lien discret pour les décidés */}
      <Link
        href={`/checkout?offer=${pack.offerId}`}
        className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-indigo-300 transition-colors"
      >
        <CreditCard className="w-3.5 h-3.5" />
        Ou commander en ligne — {pack.firstInstallmentLabel}
      </Link>
    </motion.div>
  );
}
