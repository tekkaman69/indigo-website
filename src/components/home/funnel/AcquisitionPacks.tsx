'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { PRICING_PACKS } from '@/lib/pricing.config';
import PricingCard from './pricing/PricingCard';
import FinancingBlock from './pricing/FinancingBlock';
import GuaranteeBanner from './pricing/GuaranteeBanner';

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
          className="text-center mb-8 max-w-2xl mx-auto"
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

        <GuaranteeBanner />

        {/* Grille des packs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 items-stretch">
          {PRICING_PACKS.map((pack, i) => (
            <PricingCard key={pack.id} pack={pack} index={i} />
          ))}
        </div>

        <FinancingBlock />

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
          maximiser vos chances d'obtenir des demandes qualifiées. Les acomptes sont non
          remboursables au-delà du délai de garantie de démarrage (14 jours calendaires à compter
          de la signature).
        </motion.p>
      </div>
    </section>
  );
}
