'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, UserCheck, Clock } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const BADGES = [
  { icon: MapPin, label: 'Originaire des Antilles, disponible partout' },
  { icon: UserCheck, label: 'Un seul interlocuteur : moi' },
  { icon: Clock, label: 'Réponse sous 24h' },
];

export default function AboutFounder() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Qui est derrière Indigo</p>
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10"
        >
          {/* Photo — même recette que l'avatar hero (ring + glow), agrandie */}
          <div className="relative flex-shrink-0 w-44 h-44 md:w-52 md:h-52">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-400/30 blur-xl" />
            <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-br from-cyan-400 to-violet-400">
              <Image
                src="/valentin-about.jpg"
                alt="Valentin, designer et fondateur d'Indigo"
                width={208}
                height={208}
                className="rounded-full object-cover w-full h-full border-4 border-[#070815]"
                style={{ objectPosition: '50% 0%' }}
              />
            </div>
          </div>

          {/* Bio + badges */}
          <div className="text-center md:text-left">
            <p className="text-lg text-white/70 leading-relaxed max-w-lg">
              Je m'appelle Valentin, designer, originaire de Martinique et je travaille
              avec des entreprises partout en France. Chez Indigo, pas d'intermédiaire :
              je m'occupe de votre projet du début à la fin, moi-même. Quand vous
              m'écrivez sur WhatsApp, c'est moi qui vous réponds — pas un commercial.
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              {BADGES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/60"
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
