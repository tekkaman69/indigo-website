'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Project } from '@/types/showcase';
import ProjectCard from './ProjectCard';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ProjectFeedProps {
  projects: Project[];
  onOpen: (slug: string) => void;
  showHint: boolean;
}

/**
 * Feed vertical mobile (<lg). Scroll-snap doux (proximity, pas mandatory)
 * pour ne pas frustrer l'utilisateur. Le hint "Appuyez pour découvrir"
 * n'apparaît que sur la première carte, tant qu'aucun tap n'a eu lieu
 * dans la session (état géré par le parent ProjectShowcase).
 */
export default function ProjectFeed({ projects, onOpen, showHint }: ProjectFeedProps) {
  const reduce = useReducedMotion();

  return (
    <div className="lg:hidden flex flex-col gap-6 snap-y snap-proximity">
      {projects.map((project, i) => (
        <div key={project.slug} className="relative snap-center">
          <ProjectCard project={project} variant="feed" onOpen={onOpen} />
          {i === 0 && showHint && (
            <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/15 backdrop-blur-sm text-xs text-white/70">
                Appuyez pour découvrir
                <motion.span
                  animate={reduce ? {} : { y: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
