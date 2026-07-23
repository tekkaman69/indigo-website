'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { PRICING_PACKS } from '@/lib/pricing.config';
import PricingCard from './pricing/PricingCard';
import FinancingBlock from './pricing/FinancingBlock';
import GuaranteeBanner from './pricing/GuaranteeBanner';
import { GradientTopLine, GradientGlow } from './GradientAccents';

export default function AcquisitionPacks() {
  const reduce = useReducedMotion();

  return (
    <section id="offres" className="relative w-full py-20 px-4 overflow-hidden">
      {/* Accents décoratifs — rebord haut + halo diffus pour réchauffer le fond */}
      <GradientTopLine />
      <GradientGlow className="top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-70" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Nos formules</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Une formule claire. Un prix fixe. Zéro surprise.
          </h2>
          <p className="mt-4 text-white/55 text-lg leading-relaxed">
            Vous choisissez jusqu'où vous voulez aller — de la simple mise en beauté
            de votre image jusqu'aux publicités qui vous ramènent des clients.
            Le reste, c'est mon travail.
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
          Le budget des publicités est payé directement à Facebook et reste à votre charge. Je ne
          promets pas un nombre de clients : je mets en place tout ce qu'il faut pour vous donner
          les meilleures chances d'en obtenir. L'acompte n'est plus remboursable passé le délai de
          garantie de démarrage (14 jours après la signature).
        </motion.p>
      </div>
    </section>
  );
}
