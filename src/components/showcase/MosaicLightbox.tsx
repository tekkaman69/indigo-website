'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface LightboxImage {
  url: string;
  alt: string;
}

interface MosaicLightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Overlay plein écran pour regarder les visuels d'un projet en grand, avec
 * navigation entre toutes les images de la mosaïque — remplace la
 * redirection vers /portfolio/[id] au clic (la home est le point de contact
 * principal des clients, le portfolio reste accessible via le CTA dédié).
 */
export default function MosaicLightbox({ images, index, onClose, onNavigate }: MosaicLightboxProps) {
  const reduce = useReducedMotion();
  const hasMultiple = images.length > 1;

  const goNext = useCallback(() => {
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasMultiple) goNext();
      if (e.key === 'ArrowLeft' && hasMultiple) goPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev, hasMultiple]);

  const current = images[index];
  if (!current) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={reduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Image précédente"
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Image suivante"
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <motion.div
          key={index}
          initial={reduce ? {} : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt}
            className="max-w-full max-h-[85vh] w-auto h-auto rounded-xl object-contain"
          />
          {hasMultiple && (
            <p className="mt-3 text-center text-sm text-white/40">
              {index + 1} / {images.length}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
