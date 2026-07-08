'use client';

import { X } from 'lucide-react';
import type { MosaicTemplate } from '@/types/firebase';
import { MOSAIC_TEMPLATES, MOSAIC_TEMPLATE_LABELS } from '@/components/showcase/mosaicTemplates';

interface MosaicTemplatePickerProps {
  value: MosaicTemplate | '';
  onChange: (template: MosaicTemplate) => void;
  onClear?: () => void;
  disabled?: boolean;
}

/**
 * Sélecteur de gabarit — chaque miniature est construite à partir des vraies
 * specs MOSAIC_TEMPLATES (mêmes span/aspect que la carte réelle), donc fidèle
 * à la disposition finale plutôt qu'un dessin approximatif.
 */
export default function MosaicTemplatePicker({ value, onChange, onClear, disabled }: MosaicTemplatePickerProps) {
  const templates = Object.keys(MOSAIC_TEMPLATES) as MosaicTemplate[];

  return (
    <div className="space-y-2">
      <div className="flex gap-3 flex-wrap">
        {templates.map(tpl => {
          const isActive = value === tpl;
          return (
            <button
              key={tpl}
              type="button"
              onClick={() => onChange(tpl)}
              disabled={disabled}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_0_1px_rgba(99,102,241,0.4)]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/25'
              }`}
            >
              <div className="grid grid-cols-4 gap-0.5 w-20 h-16">
                {MOSAIC_TEMPLATES[tpl].map((slot, i) => (
                  <div
                    key={i}
                    className={`rounded-sm max-sm:col-span-2 ${slot.span} ${
                      isActive ? 'bg-indigo-400/50' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-indigo-200' : 'text-white/60'}`}>
                {MOSAIC_TEMPLATE_LABELS[tpl]}
              </span>
            </button>
          );
        })}
      </div>

      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-red-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Retirer le gabarit (repli sur l'image de couverture)
        </button>
      )}
    </div>
  );
}
