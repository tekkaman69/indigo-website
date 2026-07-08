'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';

// Marques / outils de l'écosystème — réassurance sans gonfler les chiffres
const PARTNERS = [
  { name: 'Meta Ads', sub: 'Partenaire publicité' },
  { name: 'Instagram', sub: 'Création de contenu' },
  { name: 'Google', sub: 'Visibilité locale' },
  { name: 'WhatsApp', sub: 'Contact direct' },
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
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Badge géographique — différenciateur face aux agences métropole */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.06] text-white/70 text-sm backdrop-blur-sm"
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
          Martinique · Guadeloupe · Antilles
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] sm:leading-[1.05] mb-5 sm:mb-7"
        >
          Attirez plus de clients
          <br className="hidden sm:block" />{' '}
          avec une présence qui{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            inspire confiance.
          </span>
        </motion.h1>

        {/* Sous-titre — langage résultat, pas liste de livrables */}
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-white/55 leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto"
        >
          On construit votre image, votre Instagram, votre page et vos publicités —
          pour que les clients de Martinique et Guadeloupe vous trouvent, vous
          fassent confiance, et vous contactent.
        </motion.p>

        {/* CTA principal */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <WhatsAppButton
            label="Obtenir mon audit gratuit"
            size="lg"
            message="Bonjour, je viens de votre site et j'aimerais obtenir mon audit gratuit de 20 minutes."
          />
          <p className="text-sm text-white/40">
            20 minutes · Zéro engagement · Résultats concrets
          </p>

          {/* Preuve humaine — la confiance passe par un visage, pas un logo */}
          <div className="mt-5 max-w-xs sm:max-w-none mx-auto">
            <p className="text-sm text-white/60 text-center sm:text-left">
              <span className="text-white/85 font-medium">Valentin</span>, designer &
              fondateur — c'est moi qui vous réponds sur WhatsApp.
            </p>
          </div>
        </motion.div>

        {/* Bandeau partenaires / écosystème */}
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 sm:mt-16"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 mb-5">
            Un écosystème complet à votre service
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
