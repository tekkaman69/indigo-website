'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { HomeProject } from '@/types/firebase';
import { MOSAIC_TEMPLATES } from './mosaicTemplates';
import PlaceholderMesh from './PlaceholderMesh';
import MosaicSlotImage from './MosaicSlotImage';
import MosaicLightbox, { type LightboxImage } from './MosaicLightbox';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ProjectMosaicCardProps {
  item: HomeProject;
}

/**
 * Carte projet de la home : au clic sur un visuel, ouvre un overlay
 * plein écran (lightbox) pour regarder les images du projet en grand,
 * avec navigation entre elles — la home est le point de contact principal
 * des clients, le lien vers /portfolio/[id] complet reste accessible via
 * le CTA dédié de ProjectShowcase, pas depuis la carte elle-même.
 * Si un gabarit de mosaïque est configuré, affiche la mini-mosaïque
 * sur-mesure ; sinon repli sur la première image de slot disponible.
 */
export default function ProjectMosaicCard({ item }: ProjectMosaicCardProps) {
  const reduce = useReducedMotion();
  const slots = item.mosaicTemplate ? MOSAIC_TEMPLATES[item.mosaicTemplate] : null;
  const coverUrl = item.mosaicSlots?.[0]?.url;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images: LightboxImage[] = (item.mosaicSlots ?? [])
    .filter((s): s is NonNullable<typeof s> => !!s?.url)
    .map((s, i) => ({ url: s.url, alt: `${item.title} — visuel ${i + 1}` }));

  return (
    <>
      <div
        className="group block rounded-2xl bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-cyan-400/30 p-px
        shadow-[0_0_24px_-8px_rgba(99,102,241,0.35)] transition-shadow duration-300
        hover:shadow-[0_0_32px_-6px_rgba(99,102,241,0.5)]"
      >
        <div className="relative rounded-2xl bg-gray-950/90 backdrop-blur-md overflow-hidden">
          {/* Cadre à ratio fixe — garantit une hauteur de carte cohérente entre gabarits */}
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            {slots ? (
              <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3">
                {slots.map((slot, i) => {
                  const image = item.mosaicSlots?.[i];
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => image?.url && setLightboxIndex(images.findIndex(img => img.url === image.url))}
                      whileHover={reduce ? {} : { scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      disabled={!image?.url}
                      className={`max-sm:col-span-2 ${slot.span} ${image?.url ? 'cursor-zoom-in' : 'cursor-default'}`}
                    >
                      {image?.url ? (
                        <MosaicSlotImage image={image} alt={`${item.title} — visuel ${i + 1}`} baseAspect={slot.aspect} />
                      ) : (
                        <div className="relative overflow-hidden rounded-lg w-full h-full">
                          <PlaceholderMesh seed={`${item.id}-${i}`} className="h-full w-full" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ) : coverUrl ? (
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="absolute inset-0 w-full h-full cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </button>
            ) : (
              <PlaceholderMesh seed={item.id} className="h-full w-full" />
            )}
          </div>

          {/* Bandeau bas : nom + catégorie */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              {item.businessCategory && (
                <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-0.5">
                  {item.businessCategory}
                </p>
              )}
              <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && images.length > 0 && (
        <MosaicLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
