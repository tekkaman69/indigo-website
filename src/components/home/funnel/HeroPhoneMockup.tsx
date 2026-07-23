'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Dégradés variés (palette design system) pour les 9 tuiles du faux feed —
// évoque un profil Instagram soigné sans charger de vraies images (perf LCP).
const TILES = [
  'from-indigo-500/80 to-violet-600/80',
  'from-cyan-400/70 to-indigo-500/80',
  'from-violet-500/80 to-fuchsia-500/70',
  'from-indigo-600/80 to-cyan-400/60',
  'from-fuchsia-500/70 to-violet-600/80',
  'from-cyan-500/70 to-indigo-600/80',
  'from-violet-600/80 to-indigo-500/70',
  'from-indigo-500/70 to-cyan-400/70',
  'from-fuchsia-500/60 to-indigo-600/80',
];

/**
 * Maquette iPhone affichant un profil Instagram stylisé (header + grille 3×3),
 * entièrement en CSS — aucune image distante, rendu instantané. Conçue pour
 * être composée avec HeroLaptopMockup (voir HeroMockup). Purement décorative :
 * le halo lumineux est géré au niveau de la composition, pas ici.
 */
export default function HeroPhoneMockup() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? {} : { y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      aria-hidden="true"
    >
      {/* Corps du téléphone */}
      <div className="relative w-[210px] sm:w-[230px] rounded-[2.5rem] border border-white/15 bg-[#0b0c18] p-2.5 shadow-2xl shadow-indigo-950/60">
        {/* Encoche */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 w-24 h-5 rounded-full bg-[#0b0c18] border border-white/10" />

        {/* Écran */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0e0f1d]">
          {/* Header profil */}
          <div className="px-3.5 pt-7 pb-3.5">
            <div className="flex items-center gap-3">
              {/* Avatar avec anneau dégradé */}
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-indigo-400 via-violet-400 to-cyan-400 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[#0e0f1d] flex items-center justify-center">
                  <span className="text-white/90 font-bold">V</span>
                </div>
              </div>
              {/* Stats */}
              <div className="flex-1 flex justify-around text-center">
                {[
                  { n: '2.4k', l: 'abonnés' },
                  { n: '128', l: 'posts' },
                  { n: '4.9', l: 'avis' },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-white text-xs font-bold leading-none">{s.n}</p>
                    <p className="text-white/40 text-[9px] mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nom + bio stylisés (barres) */}
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-20 rounded-full bg-white/25" />
              <div className="h-1.5 w-32 rounded-full bg-white/10" />
            </div>

            {/* Bouton "Contacter" factice */}
            <div className="mt-3 h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold">Contacter</span>
            </div>
          </div>

          {/* Grille feed 3×3 */}
          <div className="grid grid-cols-3 gap-0.5 px-0.5 pb-0.5">
            {TILES.map((grad, i) => (
              <div
                key={i}
                className={`aspect-square bg-gradient-to-br ${grad} relative overflow-hidden`}
              >
                {/* Reflet léger pour donner du relief */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
