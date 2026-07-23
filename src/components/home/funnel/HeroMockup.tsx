'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import HeroLaptopMockup from './HeroLaptopMockup';
import HeroPhoneMockup from './HeroPhoneMockup';

/**
 * Composition « device stack » du hero : un ordinateur portable (site web
 * stylisé) en fond, avec un téléphone (feed Instagram) qui chevauche devant,
 * en bas à gauche. Illustre les deux livrables phares — site + réseaux —
 * entièrement en CSS, sans image distante. Purement décoratif.
 */
export default function HeroMockup() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[420px] max-w-full"
      aria-hidden="true"
    >
      {/* Halo coloré partagé — profondeur + ancrage lumineux */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-600/30 via-violet-600/20 to-cyan-400/20 blur-3xl rounded-full" />

      {/* Laptop (fond) — décalé vers la droite pour dégager le coin bas-gauche */}
      <div className="relative flex justify-center lg:justify-end pr-2 sm:pr-6">
        <HeroLaptopMockup />
      </div>

      {/* Téléphone (avant) — posé au coin bas-gauche, il ne masque qu'un angle
          du laptop pour qu'on lise bien sa forme complète. */}
      <div className="absolute -bottom-10 -left-4 sm:-left-6 z-10">
        <HeroPhoneMockup />
      </div>

      {/* Pastille "avis 5 étoiles" flottante — micro-preuve sociale */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute -top-3 right-2 sm:right-6 z-20 rounded-xl border border-white/15 bg-[#141527]/90 backdrop-blur-md px-3 py-2 shadow-xl"
      >
        <div className="flex gap-0.5 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.5l7.1-.6z" />
            </svg>
          ))}
        </div>
        <p className="text-white/70 text-[10px] font-medium">Site + réseaux livrés</p>
      </motion.div>
    </motion.div>
  );
}
