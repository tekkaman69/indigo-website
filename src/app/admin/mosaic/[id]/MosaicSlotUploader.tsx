'use client';

import { ImagePlus, LibraryBig } from 'lucide-react';
import FocalPointPicker from './FocalPointPicker';

interface MosaicSlotUploaderProps {
  index: number;
  url: string;
  aspect: string;
  focalPoint?: { x: number; y: number };
  zoom?: number;
  onFileSelected: (file: File) => void;
  onPickFromLibrary: () => void;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  disabled?: boolean;
}

/** Une ligne de contrôle par slot — libellé "Visuel N" pour se repérer face à l'aperçu. */
export default function MosaicSlotUploader({
  index, url, aspect, focalPoint, zoom, onFileSelected, onPickFromLibrary, onFocalPointChange, onZoomChange, disabled,
}: MosaicSlotUploaderProps) {
  const inputId = `mosaic-slot-${index}`;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 space-y-2.5">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={`Visuel ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <ImagePlus className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <label htmlFor={inputId} className="text-xs font-medium text-white/70 block mb-1">
            Visuel {index + 1}
          </label>
          <div className="flex items-center gap-2">
            <input
              id={inputId}
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelected(file);
              }}
              className="flex-1 min-w-0 text-xs text-white/50 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-md file:border-0 file:bg-indigo-500/20 file:text-indigo-200 file:text-xs hover:file:bg-indigo-500/30 file:cursor-pointer cursor-pointer"
            />
            <button
              type="button"
              onClick={onPickFromLibrary}
              disabled={disabled}
              title="Choisir une image déjà hébergée"
              className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-white/60 hover:text-white text-xs transition-colors"
            >
              <LibraryBig className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {url && (
        <div className="space-y-1">
          <p className="text-[11px] text-white/30">Cliquez sur l'aperçu pour recadrer l'image dans le cadre</p>
          <FocalPointPicker
            url={url}
            aspect={aspect}
            focalPoint={focalPoint}
            zoom={zoom}
            onChange={onFocalPointChange}
            onZoomChange={onZoomChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
