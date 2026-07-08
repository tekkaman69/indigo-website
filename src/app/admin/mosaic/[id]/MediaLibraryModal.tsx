'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getAllAssets } from '@/lib/firebase/assets';
import { getPortfolioItems } from '@/lib/firebase/firestore';
import { extractProjectImages } from '@/lib/utils/extractProjectImages';
import { Loader2, Search, ImageOff } from 'lucide-react';

export interface LibraryImage {
  url: string;
  alt: string;
  sourceLabel: string;
}

interface MediaLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (image: LibraryImage) => void;
}

/**
 * Bibliothèque d'images déjà hébergées : assets uploadés (bibliothèque
 * centralisée) + images déjà utilisées dans les projets portfolio.
 * Dédupliquées par URL, sélection instantanée (pas de re-upload).
 */
export default function MediaLibraryModal({ open, onOpenChange, onSelect }: MediaLibraryModalProps) {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);

    Promise.all([
      getAllAssets().catch(err => {
        console.error('[MediaLibrary] getAllAssets a échoué:', err);
        return [];
      }),
      getPortfolioItems().catch(err => {
        console.error('[MediaLibrary] getPortfolioItems a échoué:', err);
        return [];
      }),
    ]).then(([assets, projects]) => {
      const byUrl = new Map<string, LibraryImage>();

      for (const asset of assets) {
        if (asset.type !== 'image' || !asset.url) continue;
        byUrl.set(asset.url, {
          url: asset.url,
          alt: asset.fileName || 'Image',
          sourceLabel: asset.fileName || 'Bibliothèque',
        });
      }

      for (const project of projects) {
        for (const img of extractProjectImages(project)) {
          if (!img.src || byUrl.has(img.src)) continue;
          byUrl.set(img.src, { url: img.src, alt: img.alt, sourceLabel: img.projectTitle });
        }
      }

      setImages(Array.from(byUrl.values()));
      setIsLoading(false);
    });
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return images;
    const q = search.trim().toLowerCase();
    return images.filter(img => img.sourceLabel.toLowerCase().includes(q) || img.alt.toLowerCase().includes(q));
  }, [images, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-gray-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Choisir une image existante</DialogTitle>
        </DialogHeader>

        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom de fichier ou de projet..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/30">
              <ImageOff className="w-8 h-8 mb-2" />
              <p className="text-sm">Aucune image trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pb-1">
              {filtered.map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  type="button"
                  onClick={() => onSelect(img)}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-indigo-400/60 transition-colors"
                >
                  <Image src={img.url} alt={img.alt} fill sizes="150px" className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <p className="w-full px-1.5 py-1 text-[10px] text-white truncate bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.sourceLabel}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
