'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/showcase';
import PlaceholderMesh from './PlaceholderMesh';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export type CardVariant = 'bento-large' | 'bento-medium' | 'bento-wide' | 'feed';

// bento-large/medium remplissent leur cellule de grille (hauteur pilotée par
// row-span côté BentoGrid) ; seuls bento-wide et feed ont un ratio fixe.
const ASPECT: Record<CardVariant, string> = {
  'bento-large': 'h-full min-h-[320px]',
  'bento-medium': 'h-full min-h-[240px]',
  'bento-wide': 'aspect-[21/9]',
  feed: 'aspect-[4/5]',
};

interface ProjectCardProps {
  project: Project;
  variant: CardVariant;
  onOpen: (slug: string) => void;
}

export default function ProjectCard({ project, variant, onOpen }: ProjectCardProps) {
  const reduce = useReducedMotion();
  const isFeed = variant === 'feed';

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project.slug)}
      aria-label={`Voir le projet ${project.client}`}
      layoutId={`project-cover-${project.slug}`}
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070815] transition-colors hover:border-cyan-400/50 ${ASPECT[variant]}`}
      whileHover={reduce ? {} : undefined}
    >
      {/* Cover — zoom léger au hover, clippé par le parent overflow-hidden */}
      <div className="absolute inset-0">
        {project.cover.src ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={isFeed ? '100vw' : '(max-width: 1024px) 50vw, 33vw'}
            quality={85}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
            <PlaceholderMesh seed={project.slug} className="h-full w-full" />
          </div>
        )}
      </div>

      {/* Overlay gradient bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Badge projet maison */}
      {project.isInternal && (
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] uppercase tracking-wider text-white/80 backdrop-blur-sm">
          Projet maison
        </span>
      )}

      {/* Client / secteur */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-0.5">{project.sector}</p>
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-base font-semibold text-white">{project.client}</h3>
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </span>
        </div>
        <span className="inline-block mt-1 text-xs text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
          Voir le projet →
        </span>
      </div>
    </motion.button>
  );
}
