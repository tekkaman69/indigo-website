'use client';

import type { CommProject } from '@/types/firebase';
import MasonryGallery from './MasonryGallery';

interface CommProjectCardProps {
  project: CommProject;
}

/**
 * Carte d'un projet de communication institutionnelle : contexte en tête
 * (type de support + titre + brief), puis mosaïque masonry des visuels.
 * Contrairement aux cartes branding/feeds (orientées vente), elle expose le
 * BRIEF pour prouver la compétence à un recruteur — le « pourquoi » derrière
 * chaque réalisation.
 */
export default function CommProjectCard({ project }: CommProjectCardProps) {
  return (
    <div
      className="group flex flex-col rounded-2xl bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-cyan-400/30 p-px
      shadow-[0_0_24px_-8px_rgba(99,102,241,0.35)] transition-shadow duration-300
      hover:shadow-[0_0_32px_-6px_rgba(99,102,241,0.5)]"
    >
      <div className="relative flex flex-col rounded-2xl bg-gray-950/90 backdrop-blur-md overflow-hidden">
        {/* En-tête contexte — l'atout face à un recruteur */}
        <div className="px-5 pt-5 pb-4">
          {project.supportType && (
            <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-1.5">
              {project.supportType}
            </p>
          )}
          <h3 className="text-lg font-semibold text-white leading-snug">{project.title}</h3>
          {project.description && (
            <p className="mt-2 text-sm text-white/50 leading-relaxed">{project.description}</p>
          )}
        </div>

        {/* Mosaïque masonry des visuels */}
        <div className="px-3 pb-3">
          <MasonryGallery images={project.images} projectTitle={project.title} />
        </div>
      </div>
    </div>
  );
}
