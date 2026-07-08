'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronsLeftRight } from 'lucide-react';
import type { MediaItem } from '@/types/showcase';
import PlaceholderMesh from './PlaceholderMesh';

interface BeforeAfterSliderProps {
  before: MediaItem;
  after: MediaItem;
  seed: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/**
 * Slider avant/après. clip-path (compositor-only, pas de reflow) plutôt
 * qu'un width animé — plus fluide sur mobile bas de gamme. Poignée
 * draggable (souris/tactile via Framer Motion) + navigation clavier
 * (flèches) pour l'accessibilité.
 */
export default function BeforeAfterSlider({ before, after, seed }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50); // pourcentage 0-100
  const clipPath = useTransform(x, v => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(x, v => `${v}%`);

  const updateFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    x.set(clamp(pct, 0, 100));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') x.set(clamp(x.get() - 3, 0, 100));
    if (e.key === 'ArrowRight') x.set(clamp(x.get() + 3, 0, 100));
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] max-h-[65svh] w-full mx-auto overflow-hidden rounded-2xl touch-none select-none"
      onPointerDown={e => updateFromClientX(e.clientX)}
    >
      {/* Après — plein cadre, couche du dessous */}
      <div className="absolute inset-0">
        {after.src ? (
          <Image src={after.src} alt={after.alt} fill sizes="100vw" className="object-cover" />
        ) : (
          <PlaceholderMesh seed={`${seed}-after`} className="h-full w-full" label="Après" />
        )}
      </div>

      {/* Avant — clippé par la motion value */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        {before.src ? (
          <Image src={before.src} alt={before.alt} fill sizes="100vw" className="object-cover" />
        ) : (
          <PlaceholderMesh seed={`${seed}-before`} className="h-full w-full" label="Avant" />
        )}
      </motion.div>

      {/* Ligne de séparation */}
      <motion.div
        className="absolute inset-y-0 w-0.5 bg-white/80 pointer-events-none"
        style={{ left }}
      />

      {/* Poignée — 44px, draggable + clavier */}
      <motion.button
        type="button"
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDrag={(_, info) => updateFromClientX(info.point.x)}
        onKeyDown={handleKeyDown}
        style={{ left }}
        aria-label="Faire glisser pour comparer avant et après"
        aria-valuenow={Math.round(x.get())}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center cursor-ew-resize touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <ChevronsLeftRight className="w-5 h-5 text-gray-900" />
      </motion.button>
    </div>
  );
}
