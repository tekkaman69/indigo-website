import type { Project } from '@/types/showcase';
import ProjectCard, { type CardVariant } from './ProjectCard';

interface BentoGridProps {
  projects: Project[];
  onOpen: (slug: string) => void;
}

/**
 * Grille asymétrique desktop (≥lg) : 1 grande tuile 2x2, 2 moyennes, 1 large
 * horizontale. Layout personnalisé (pas de grille générique/uniforme),
 * fixé pour un jeu de 4 projets.
 */
export default function BentoGrid({ projects, onOpen }: BentoGridProps) {
  const [large, medium1, medium2, wide] = projects;
  const cell = (project: Project | undefined, variant: CardVariant, span: string) =>
    project && (
      <div className={span}>
        <ProjectCard project={project} variant={variant} onOpen={onOpen} />
      </div>
    );

  return (
    <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-4 auto-rows-fr">
      {cell(large, 'bento-large', 'col-span-2 row-span-2')}
      {cell(medium1, 'bento-medium', 'col-span-1 row-span-1')}
      {cell(medium2, 'bento-medium', 'col-span-1 row-span-1')}
      {cell(wide, 'bento-wide', 'col-span-2 row-span-1')}
    </div>
  );
}
