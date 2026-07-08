import type { PortfolioItem } from '@/types/firebase';
import type { Project, MediaItem, ProjectResult } from '@/types/showcase';
import { extractProjectImages } from '@/lib/utils/extractProjectImages';

function toMedia(url: string | undefined, alt: string): MediaItem {
  return { kind: 'image', src: url ?? '', alt, width: 1080, height: 1350 };
}

/** Un résultat texte libre (le seul format stocké côté Firestore aujourd'hui). */
function toResult(result: string | undefined): ProjectResult | undefined {
  if (!result) return undefined;
  return { kind: 'text', label: result };
}

/**
 * Transforme un PortfolioItem Firestore en Project — le type consommé par
 * les composants showcase/ (ProjectCard, BentoGrid, ProjectFeed, ProjectViewer).
 * Permet de réutiliser le viewer narratif déjà construit sans le réécrire,
 * en pilotant son contenu depuis la vraie base de données.
 */
export function adaptPortfolioItem(item: PortfolioItem): Project {
  const cover = toMedia(item.coverImage?.url || item.imageUrl, item.title);

  const delivered = (item.delivered ?? []).map(d => ({
    label: d.label,
    media: toMedia(d.imageUrl, d.label),
  }));

  // Galerie dérivée des images réelles du projet (cover + sections), en
  // excluant la cover déjà affichée à l'écran 1 du viewer.
  const gallery = extractProjectImages(item)
    .filter(img => !img.isCover)
    .map(img => toMedia(img.src, img.alt));

  return {
    slug: item.id,
    client: item.title,
    sector: item.industry || item.category,
    cover,
    problem: item.problem || item.description,
    delivered,
    gallery,
    before: item.before ? toMedia(item.before.url, `${item.title} — avant`) : undefined,
    after: item.after ? toMedia(item.after.url, `${item.title} — après`) : undefined,
    result: toResult(item.result),
  };
}
