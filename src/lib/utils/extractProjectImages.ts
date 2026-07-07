import type { PortfolioItem } from '@/types/firebase';
import type { Block, Section } from '@/types/portfolio-editor';

/**
 * Une image exposable issue d'un projet portfolio.
 * `projectId` permet de lier la tuile vers le détail du projet.
 */
export interface ProjectImage {
  src: string;
  alt: string;
  projectId: string;
  projectTitle: string;
  industry?: string;
  /** true si c'est l'image de couverture (priorité d'affichage) */
  isCover: boolean;
}

/**
 * Extrait toutes les images réelles d'un projet :
 * cover + images des blocks `image` et `gallery` de l'éditeur structuré.
 *
 * Les `sections` du portfolio sont typées `any[]` côté Firestore ;
 * on les re-type localement de façon défensive (données potentiellement partielles).
 */
export function extractProjectImages(item: PortfolioItem): ProjectImage[] {
  const images: ProjectImage[] = [];
  const seen = new Set<string>();

  const push = (src: string | undefined, alt?: string, isCover = false) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    images.push({
      src,
      alt: alt || item.title,
      projectId: item.id,
      projectTitle: item.title,
      industry: item.industry,
      isCover,
    });
  };

  // 1. Cover en premier
  push(item.coverImage?.url || item.imageUrl, item.title, true);

  // 2. Images des sections de l'éditeur
  const sections = (item.sections ?? []) as Section[];
  for (const section of sections) {
    for (const block of (section?.blocks ?? []) as Block[]) {
      if (block?.type === 'image' && block.src) {
        push(block.src, block.alt || block.caption);
      } else if (block?.type === 'gallery') {
        for (const img of block.images ?? []) {
          push(img?.src, img?.alt || img?.caption);
        }
      }
    }
  }

  return images;
}

/**
 * Agrège et entrelace les images de plusieurs projets pour une mosaïque dense.
 * On entrelace pour ne pas afficher tous les visuels d'un même projet à la suite,
 * ce qui donne une mosaïque visuellement variée.
 *
 * @param maxPerProject limite d'images par projet (évite qu'un gros projet domine)
 * @param max          limite totale d'images dans la mosaïque
 */
export function buildMosaicImages(
  items: PortfolioItem[],
  { maxPerProject = 4, max = 18 }: { maxPerProject?: number; max?: number } = {}
): ProjectImage[] {
  const perProject = items.map(item =>
    extractProjectImages(item).slice(0, maxPerProject)
  );

  const interleaved: ProjectImage[] = [];
  let added = true;
  for (let i = 0; added; i++) {
    added = false;
    for (const list of perProject) {
      if (list[i]) {
        interleaved.push(list[i]);
        added = true;
      }
    }
  }

  return interleaved.slice(0, max);
}
