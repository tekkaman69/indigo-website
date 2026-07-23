'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';
import HeroMockup from './HeroMockup';

// Marques / outils de l'écosystème — réassurance sans gonfler les chiffres
const PARTNERS = [
  { name: 'Instagram', sub: 'Vos publications' },
  { name: 'Facebook', sub: 'Vos publicités' },
  { name: 'Google', sub: 'Votre visibilité' },
  { name: 'WhatsApp', sub: 'Vos clients vous écrivent' },
];

export default function HeroFunnel() {
  const reduce = useReducedMotion();

  return (
    // Hero sombre plein écran. Le -mt-16 annule le padding-top du <main> global
    // pour que le fond passe SOUS la navbar. rounded-b + overflow-hidden : les
    // coins bas arrondis révèlent le body noir derrière (bevel façon ACA).
    <section className="relative -mt-16 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 sm:pt-28 sm:pb-24 overflow-hidden rounded-b-[2.5rem]">
      {/* ── Fond du hero : vidéo boucle + voiles de lisibilité ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Base noire opaque (évite tout flash blanc avant chargement) */}
        <div className="absolute inset-0 bg-[#050509]" />

        {/* Vidéo de fond en boucle (aller-retour, loop parfait).
            poster = première frame, affichée instantanément pendant le
            chargement. prefers-reduced-motion → poster statique, pas de lecture. */}
        {reduce ? (
          <img
            src="/backgrounds/hero-poster.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/backgrounds/hero-poster.jpg"
          >
            <source src="/backgrounds/hero-loop.webm" type="video/webm" />
            <source src="/backgrounds/hero-loop.mp4" type="video/mp4" />
          </video>
        )}

        {/* Voile sombre uniforme — garantit le contraste du texte quel que
            soit le contenu de la vidéo */}
        <div className="absolute inset-0 bg-[#050509]/55" />

        {/* Voile supplémentaire en haut pour que le titre reste lisible net */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #050509 0%, rgba(5,5,9,0.5) 22%, transparent 48%)',
          }}
        />

        {/* Voile bas discret pour ancrer le bevel */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(to top, rgba(5,5,9,0.6) 0%, transparent 100%)',
          }}
        />

        {/* Grain léger */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>

        {/* Liseré dégradé sur le rebord bas arrondi — casse le noir de la
            transition hero → contenu avec une ligne indigo/violet/cyan lumineuse */}
        <div className="absolute inset-x-8 sm:inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
        <div className="absolute inset-x-1/4 bottom-0 h-16 bg-gradient-to-t from-indigo-600/20 to-transparent blur-xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Deux colonnes en desktop : texte à gauche, mockup à droite.
            Sur mobile/tablette : une colonne centrée, mockup sous le texte. */}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] items-center gap-10 lg:gap-8">

          {/* ── Colonne gauche : accroche ── */}
          <div className="text-center lg:text-left">
            {/* Badge de réassurance */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.06] text-white/70 text-sm backdrop-blur-sm"
            >
              <span className="relative flex w-2 h-2">
                {!reduce && (
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full bg-cyan-400"
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <span className="relative inline-flex w-2 h-2 rounded-full bg-cyan-400" />
              </span>
              Studio français · disponible partout, en direct
            </motion.div>

            {/* Headline — courte et affirmée, mot-clé en dégradé */}
            <motion.h1
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold tracking-[-0.03em] text-white leading-[0.98] mb-5"
            >
              Une image
              <br />
              à la hauteur
              <br />
              de votre{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(124,58,237,0.35)]">
                savoir-faire.
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={reduce ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-white/55 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Vous êtes doué dans votre métier. Moi, je fais en sorte que ça se voie —
              logo, réseaux, site, publicités. Vous n'avez rien à gérer : je livre
              tout prêt à l'emploi.
            </motion.p>

            {/* CTA principal */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center lg:items-start gap-3"
            >
              <WhatsAppButton
                label="Réserver mon appel gratuit"
                size="lg"
                message="Bonjour, je viens de votre site et j'aimerais réserver mon appel gratuit de 20 minutes."
              />
              <p className="text-sm text-white/40">
                20 minutes · sans engagement · sans blabla
              </p>

              {/* Preuve humaine */}
              <p className="mt-4 text-sm text-white/60 text-center lg:text-left max-w-xs lg:max-w-none">
                <span className="text-white/85 font-medium">Valentin</span>, designer &
                fondateur — c'est moi qui vous réponds, en direct.
              </p>
            </motion.div>
          </div>

          {/* ── Colonne droite : composition site + téléphone (masquée sur très petit écran) ── */}
          <div className="hidden sm:flex justify-center lg:justify-end pb-10 lg:pb-0">
            <HeroMockup />
          </div>
        </div>

        {/* Bandeau partenaires / écosystème — pleine largeur sous les 2 colonnes */}
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 sm:mt-16"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 mb-5 text-center">
            Présent là où sont vos clients
          </p>
          <div className="flex items-center justify-center gap-x-6 sm:gap-x-10 gap-y-5 flex-wrap">
            {PARTNERS.map((p) => (
              <div key={p.name} className="flex flex-col items-center">
                <span className="text-base font-semibold text-white/70">{p.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/25 mt-0.5">{p.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
