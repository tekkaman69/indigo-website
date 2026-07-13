'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { InstaFeed } from '@/types/firebase';
import { FEED_SLOT_COUNT } from '@/types/firebase';
import PlaceholderMesh from './PlaceholderMesh';
import MosaicLightbox, { type LightboxImage } from './MosaicLightbox';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface InstaFeedCardProps {
  feed: InstaFeed;
}

/**
 * Carte « feed Instagram » de la home : une mosaïque de 9 visuels au format
 * 4:5 disposés en grille 3 colonnes × 3 rangées, mimant l'aperçu d'un profil
 * Instagram. Au clic sur un post, ouvre le MosaicLightbox pour regarder les
 * visuels en grand avec navigation entre les 9 — même interaction que les
 * cartes projet de ProjectShowcase.
 */
export default function InstaFeedCard({ feed }: InstaFeedCardProps) {
  const reduce = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Toujours 9 cellules (grille 3×3), même si des slots sont vides.
  const slots = Array.from({ length: FEED_SLOT_COUNT }, (_, i) => feed.slots?.[i]);

  const images: LightboxImage[] = slots
    .map((s, i) => ({ slot: s, i }))
    .filter((x): x is { slot: NonNullable<typeof x.slot>; i: number } => !!x.slot?.url)
    .map(({ slot, i }) => ({ url: slot.url, alt: `${feed.clientName ?? 'Feed'} — visuel ${i + 1}` }));

  return (
    <>
      <div
        className="group block rounded-2xl bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-cyan-400/30 p-px
        shadow-[0_0_24px_-8px_rgba(99,102,241,0.35)] transition-shadow duration-300
        hover:shadow-[0_0_32px_-6px_rgba(99,102,241,0.5)]"
      >
        <div className="relative rounded-2xl bg-gray-950/90 backdrop-blur-md overflow-hidden">
          {/* Grille feed Instagram — 3 colonnes, cases 4:5, gouttières fines comme un vrai profil */}
          <div className="grid grid-cols-3 gap-1 p-1">
            {slots.map((slot, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => slot?.url && setLightboxIndex(images.findIndex(img => img.url === slot.url))}
                whileHover={reduce || !slot?.url ? {} : { scale: 1.02 }}
                transition={{ duration: 0.3 }}
                disabled={!slot?.url}
                aria-label={slot?.url ? `Agrandir le visuel ${i + 1}` : undefined}
                className={`relative overflow-hidden rounded-md aspect-[4/5] ${slot?.url ? 'cursor-zoom-in' : 'cursor-default'}`}
              >
                {slot?.url ? (
                  <Image
                    src={slot.url}
                    alt={`${feed.clientName ?? 'Feed'} — visuel ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 33vw, 180px"
                    quality={85}
                    className="object-cover"
                    style={{ objectPosition: `${slot.focalPoint?.x ?? 50}% ${slot.focalPoint?.y ?? 50}%` }}
                  />
                ) : (
                  <PlaceholderMesh seed={`${feed.id}-${i}`} className="h-full w-full" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Bandeau bas : nom du client */}
          {feed.clientName && (
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-0.5">Feed Instagram</p>
                <h3 className="text-sm font-semibold text-white truncate">{feed.clientName}</h3>
              </div>
            </div>
          )}
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
