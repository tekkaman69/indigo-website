'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CommImage } from '@/types/firebase';
import PlaceholderMesh from './PlaceholderMesh';
import MosaicLightbox, { type LightboxImage } from './MosaicLightbox';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface MasonryGalleryProps {
  images: CommImage[];
  /** Légende accessible de base pour les alt manquants */
  projectTitle?: string;
  /** Désactive la lightbox (ex: mini-aperçu admin) */
  interactive?: boolean;
}

/**
 * Mosaïque masonry flexible : les images conservent leur ratio naturel et
 * s'imbriquent en colonnes de hauteurs variables (type Pinterest), pour un
 * rendu optimal quels que soient les formats (affiche portrait, bannière,
 * brochure paysage…). Aucun recadrage forcé. Le ratio mémorisé (CommImage.ratio)
 * réserve la hauteur AVANT chargement pour éviter tout saut de mise en page.
 * Clic sur une image → lightbox (sauf mode aperçu).
 */
export default function MasonryGallery({
  images,
  projectTitle = 'Support',
  interactive = true,
}: MasonryGalleryProps) {
  const reduce = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const valid = images.filter(img => img?.url);
  if (valid.length === 0) {
    return <PlaceholderMesh seed={projectTitle} className="w-full aspect-[4/3] rounded-lg" />;
  }

  const lightboxImages: LightboxImage[] = valid.map((img, i) => ({
    url: img.url,
    alt: img.alt || `${projectTitle} — visuel ${i + 1}`,
  }));

  return (
    <>
      {/* columns CSS = masonry natif, robuste, sans calcul JS. break-inside
          empêche une image d'être coupée entre deux colonnes. */}
      <div className="[column-gap:0.75rem] columns-1 sm:columns-2">
        {valid.map((img, i) => (
          <motion.button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => interactive && setLightboxIndex(i)}
            whileHover={reduce || !interactive ? {} : { scale: 1.015 }}
            transition={{ duration: 0.25 }}
            disabled={!interactive}
            aria-label={interactive ? `Agrandir ${projectTitle} — visuel ${i + 1}` : undefined}
            className={`mb-3 block w-full overflow-hidden rounded-lg border border-white/10 [break-inside:avoid] ${
              interactive ? 'cursor-zoom-in' : 'cursor-default'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || `${projectTitle} — visuel ${i + 1}`}
              loading="lazy"
              className="w-full h-auto block"
              style={img.ratio ? { aspectRatio: String(img.ratio) } : undefined}
            />
          </motion.button>
        ))}
      </div>

      {interactive && lightboxIndex !== null && (
        <MosaicLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
