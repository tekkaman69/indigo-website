'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface FadeCarouselProps<T> {
  items: T[];
  /** Nombre d'éléments visibles simultanément sur la ligne (page). */
  perPage?: number;
  /** Délai d'auto-défilement en ms. */
  intervalMs?: number;
  /** Rendu d'un élément. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Clé stable d'un élément. */
  getKey: (item: T, index: number) => string;
  /** Classe appliquée à la grille des éléments d'une page. */
  gridClassName?: string;
}

/**
 * Carrousel horizontal "timé" SANS translation : les éléments d'une page sont
 * remplacés par ceux de la page suivante en fondu (crossfade), en boucle sur
 * tout le catalogue. Flèches pour avancer manuellement, pause au survol/focus,
 * respect de prefers-reduced-motion (pas d'auto-défilement, navigation manuelle
 * uniquement). Compacte la hauteur tout en montrant successivement tout le contenu.
 */
export default function FadeCarousel<T>({
  items,
  perPage = 2,
  intervalMs = 3000,
  renderItem,
  getKey,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 gap-6',
}: FadeCarouselProps<T>) {
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Découpe en pages de `perPage`.
  const pages = useMemo(() => {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += perPage) {
      out.push(items.slice(i, i + perPage));
    }
    return out;
  }, [items, perPage]);

  const pageCount = pages.length;

  // Si la liste change (ex: filtre), on revient à la première page.
  useEffect(() => {
    setPage(0);
  }, [pageCount]);

  const goTo = useCallback(
    (next: number) => {
      if (pageCount === 0) return;
      setPage(((next % pageCount) + pageCount) % pageCount);
    },
    [pageCount]
  );

  const goNext = useCallback(() => goTo(page + 1), [goTo, page]);
  const goPrev = useCallback(() => goTo(page - 1), [goTo, page]);

  // Auto-défilement timé — désactivé si réduit, en pause, ou s'il n'y a qu'une page.
  useEffect(() => {
    if (reduce || paused || pageCount <= 1) return;
    const id = setInterval(() => {
      setPage(p => (p + 1) % pageCount);
    }, intervalMs);
    return () => clearInterval(id);
  }, [reduce, paused, pageCount, intervalMs]);

  if (pageCount === 0) return null;

  const currentPage = pages[Math.min(page, pageCount - 1)];
  const hasMultiple = pageCount > 1;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Zone d'affichage — crossfade entre pages (aucune translation). */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={gridClassName}
          >
            {currentPage.map((item, i) => (
              <div key={getKey(item, page * perPage + i)}>
                {renderItem(item, page * perPage + i)}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Contrôles — flèches + indicateurs de page */}
      {hasMultiple && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Projets précédents"
            className="p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Points de progression */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Pages">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Aller à la page ${i + 1}`}
                aria-selected={i === page}
                role="tab"
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? 'w-6 bg-indigo-400' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Projets suivants"
            className="p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
