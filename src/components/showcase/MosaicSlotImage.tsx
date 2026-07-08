'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import type { MosaicSlotImage as MosaicSlotImageType } from '@/types/firebase';

interface MosaicSlotImageProps {
  image: MosaicSlotImageType;
  alt: string;
  /** ratio par défaut du gabarit (ex: "16/10"), utilisé tant que l'image n'est pas encore chargée */
  baseAspect: string;
}

/**
 * Affiche l'image d'un slot de mosaïque avec un cadre dynamique : au lieu
 * d'imposer un ratio fixe (qui force soit un recadrage, soit des bandes
 * vides), la cellule adopte l'aspect-ratio réel de la portion d'image
 * visible au niveau de zoom choisi. Zoom=100% ≈ ratio du gabarit (comporte-
 * ment habituel) ; en dessous, le cadre s'élargit/s'allonge progressivement
 * vers le ratio naturel de l'image pour révéler le tout, sans jamais couper
 * ni laisser de vide.
 */
export default function MosaicSlotImage({ image, alt, baseAspect }: MosaicSlotImageProps) {
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
  const zoomValue = image.zoom ?? 100;

  const handleLoad = useCallback((img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    setNaturalRatio(img.naturalWidth / img.naturalHeight);
  }, []);

  // Interpole entre le ratio du gabarit (zoom >= 100) et le ratio naturel de
  // l'image (zoom = 50, dézoom max) — la cellule s'ouvre progressivement.
  const [baseW, baseH] = baseAspect.split('/').map(Number);
  const baseRatio = baseW / baseH;
  const effectiveRatio = (() => {
    if (!naturalRatio || zoomValue >= 100) return baseRatio;
    const t = (100 - zoomValue) / 50; // 0 à zoom=100, 1 à zoom=50
    return baseRatio + (naturalRatio - baseRatio) * t;
  })();

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg transition-[aspect-ratio] duration-300 ease-out"
      style={{ aspectRatio: `${effectiveRatio}` }}
    >
      <Image
        src={image.url}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, 33vw"
        quality={85}
        className="object-cover"
        onLoad={(e) => handleLoad(e.currentTarget)}
        style={{
          objectPosition: `${image.focalPoint?.x ?? 50}% ${image.focalPoint?.y ?? 50}%`,
        }}
      />
    </div>
  );
}
