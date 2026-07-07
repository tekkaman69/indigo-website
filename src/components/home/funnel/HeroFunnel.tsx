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
    <section className="relative -mt-16 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-28 pb-40 overflow-hidden rounded-b-[2.5rem]">
      {/* ── Fond du hero : noir + large bande lumineuse en bas (esthétique ACA) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Base noire opaque (recouvre le shader global) */}
        <div className="absolute inset-0 bg-[#050509]" />

        {/* Bande lumineuse pleine largeur — monte haut dans l'écran (façon ACA).
            Les sources sont ancrées juste au bord bas (≈100%) pour que la
            lueur irradie vers le haut, pas qu'elle reste tassée en bas. */}
        <div className="absolute inset-x-0 bottom-0 h-[80%]">
          {/* Source VIOLET/MAGENTA — bas gauche */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(90% 85% at 2% 100%, rgba(168,85,247,0.95) 0%, rgba(124,58,237,0.50) 26%, rgba(99,102,241,0.18) 48%, transparent 70%)',
            }}
          />
          {/* Source CYAN/BLEU — bas droite */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(90% 85% at 98% 100%, rgba(34,211,238,0.78) 0%, rgba(56,189,248,0.44) 24%, rgba(99,102,241,0.16) 48%, transparent 70%)',
            }}
          />
          {/* Cœur indigo central qui lie les deux ailes et remonte au centre */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(75% 95% at 50% 108%, rgba(99,102,241,0.62) 0%, rgba(79,70,229,0.26) 42%, transparent 70%)',
            }}
          />
          {/* Halo blanc-bleuté concentré sous le CTA (point chaud) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(45% 55% at 50% 102%, rgba(199,210,254,0.50) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* Voile sombre en haut pour que le titre reste lisible sur du noir net */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #050509 0%, rgba(5,5,9,0.55) 28%, transparent 52%)',
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
        {/* Badge */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/70 text-sm backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
          Martinique · Guadeloupe · Antilles
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-7"
        >
          Attire plus de clients
          <br className="hidden sm:block" />{' '}
          avec une présence qui{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            inspire confiance.
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-white/55 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Image, contenu, page de conversion et campagne publicitaire : toute la base
          digitale pour générer des demandes qualifiées — pour les TPE de Martinique
          et Guadeloupe.
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
        </motion.div>

        {/* Bandeau partenaires / écosystème */}
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 mb-5">
            Un écosystème complet à votre service
          </p>
          <div className="flex items-center justify-center gap-x-10 gap-y-5 flex-wrap">
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
