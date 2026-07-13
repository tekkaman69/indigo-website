'use client';

import { useCallback, useRef, useState } from 'react';
import { Crosshair, ZoomIn } from 'lucide-react';

interface FocalPointPickerProps {
  url: string;
  /** ratio par défaut du gabarit/format (ex: "16/10") */
  aspect: string;
  focalPoint?: { x: number; y: number };
  zoom?: number;
  onChange: (focalPoint: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  disabled?: boolean;
}

/**
 * Clic/drag sur l'aperçu pour définir le point de recadrage, slider pour le
 * zoom d'une image. Le cadre est dynamique : à zoom=100% il adopte le ratio
 * fourni ; en dessous, il s'ajuste progressivement vers le ratio naturel de
 * l'image pour révéler le tout — jamais de recadrage forcé ni de bandes
 * vides. Générique, réutilisé par l'éditeur mosaïque et l'éditeur de feeds.
 */
export default function FocalPointPicker({ url, aspect, focalPoint, zoom, onChange, onZoomChange, disabled }: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
  const x = focalPoint?.x ?? 50;
  const y = focalPoint?.y ?? 50;
  const zoomValue = zoom ?? 100;

  const handleImgLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;
    setNaturalRatio(img.naturalWidth / img.naturalHeight);
  }, []);

  const [baseW, baseH] = aspect.split('/').map(Number);
  const baseRatio = baseW / baseH;
  const effectiveRatio = (() => {
    if (!naturalRatio || zoomValue >= 100) return baseRatio;
    const t = (100 - zoomValue) / 50; // 0 à zoom=100, 1 à zoom=50
    return baseRatio + (naturalRatio - baseRatio) * t;
  })();

  const updateFromEvent = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const ny = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    onChange({ x: Math.round(nx), y: Math.round(ny) });
  }, [onChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromEvent(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.buttons !== 1) return;
    updateFromEvent(e.clientX, e.clientY);
  };

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className={`relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-[aspect-ratio] duration-300 ease-out ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-crosshair'}`}
        style={{ aspectRatio: `${effectiveRatio}` }}
        title="Cliquez pour définir le point de recadrage"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Aperçu du recadrage"
          onLoad={handleImgLoad}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          style={{ objectPosition: `${x}% ${y}%` }}
        />
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cyan-400/40 shadow-md pointer-events-none flex items-center justify-center"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <Crosshair className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ZoomIn className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
        <input
          type="range"
          min={50}
          max={200}
          step={1}
          value={zoomValue}
          disabled={disabled}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="flex-1 h-1.5 accent-cyan-400 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="text-[11px] text-white/40 w-9 text-right flex-shrink-0">{zoomValue}%</span>
      </div>
    </div>
  );
}
