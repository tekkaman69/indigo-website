import type { MosaicTemplate } from '@/types/firebase';

export interface SlotSpec {
  /** classes de span appliquées à la cellule dans la grille 4 colonnes (desktop) */
  span: string;
  /** ratio par défaut de la cellule (ex: "16/10"), point de départ avant tout dézoom */
  aspect: string;
}

/**
 * Gabarits de mosaïque pour les cartes projet de la home (ProjectShowcase).
 * Chaque slot est rempli par une image uploadée sur mesure via l'admin
 * (/admin/portfolio) — aucune composition automatique. Le ratio `aspect` est
 * le point de départ (zoom 100%) ; le cadre s'ajuste ensuite dynamiquement
 * si l'image est dézoomée (voir MosaicSlotImage).
 */
export const MOSAIC_TEMPLATES: Record<MosaicTemplate, SlotSpec[]> = {
  // 6 slots — façon "exposure/menova" : 1 bannière + 1 moyen, puis 4 égaux
  'mosaic-6': [
    { span: 'col-span-2 row-span-1', aspect: '16/10' },
    { span: 'col-span-2 row-span-1', aspect: '16/10' },
    { span: 'col-span-1 row-span-1', aspect: '3/4' },
    { span: 'col-span-1 row-span-1', aspect: '3/4' },
    { span: 'col-span-1 row-span-1', aspect: '3/4' },
    { span: 'col-span-1 row-span-1', aspect: '3/4' },
  ],
  // 5 slots — façon "Atlas" : 2 grands en haut, 3 petits en bas
  'mosaic-5': [
    { span: 'col-span-2 row-span-1', aspect: '4/3' },
    { span: 'col-span-2 row-span-1', aspect: '4/3' },
    { span: 'col-span-1 row-span-1', aspect: '3/4' },
    { span: 'col-span-1 row-span-1', aspect: '3/4' },
    { span: 'col-span-2 row-span-1', aspect: '16/9' },
  ],
  // 3 slots — façon "monty" : épuré, 1 grand + 2 moyens
  'mosaic-3': [
    { span: 'col-span-4 row-span-1', aspect: '21/9' },
    { span: 'col-span-2 row-span-1', aspect: '1/1' },
    { span: 'col-span-2 row-span-1', aspect: '1/1' },
  ],
};

export const MOSAIC_TEMPLATE_LABELS: Record<MosaicTemplate, string> = {
  'mosaic-6': '6 visuels',
  'mosaic-5': '5 visuels',
  'mosaic-3': '3 visuels',
};
