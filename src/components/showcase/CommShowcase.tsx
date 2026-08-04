'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { getCommProjectsForDisplay } from '@/lib/firebase/firestore';
import type { CommProject } from '@/types/firebase';
import CommProjectCard from './CommProjectCard';
import FadeCarousel from './FadeCarousel';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const CONTACT_EMAIL = 'valentinclaudejeanbaptiste@gmail.com';

/**
 * Section « communication institutionnelle » de la home — vitrine à but
 * recruteur (poste chargé de com / graphiste). Expose des supports (affiches,
 * brochures, signalétique…) en mosaïque masonry, avec le brief de chaque
 * projet. Même logique de carrousel timé que branding / feeds. Placée entre
 * ProjectShowcase (identités) et InstaFeedShowcase (feeds).
 */
export default function CommShowcase() {
  const [projects, setProjects] = useState<CommProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    getCommProjectsForDisplay()
      .then(setProjects)
      .catch(err => console.error('Error loading comm projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || projects.length === 0) return null;

  return (
    <section id="communication" className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Communication institutionnelle</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Des supports pensés pour informer et rassembler
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Affiches, brochures, signalétique, documents officiels : des supports clairs,
            accessibles et à l'image d'une institution. Cliquez pour voir chaque projet en détail.
          </p>
        </motion.div>

        {/* Carrousel timé — 2 projets par ligne, remplacés en fondu, en boucle. */}
        <FadeCarousel
          items={projects}
          perPage={2}
          intervalMs={4000}
          getKey={(project) => project.id}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start"
          renderItem={(project) => <CommProjectCard project={project} />}
        />

        {/* CTA recruteur — contact professionnel, pas de démarche commerciale */}
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Contact — poste chargé de communication / graphiste')}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Me contacter pour un poste ou une mission
          </a>
        </motion.div>
      </div>
    </section>
  );
}
