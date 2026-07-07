'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import { db } from '@/lib/firebase/config';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, Timestamp,
} from 'firebase/firestore';
import {
  getPortfolioItems,
  getAllMosaicItems,
  COLLECTIONS,
} from '@/lib/firebase/firestore';
import { getAllAssets, uploadAsset } from '@/lib/firebase/assets';
import { extractProjectImages } from '@/lib/utils/extractProjectImages';
import type { MosaicItem, PortfolioItem } from '@/types/firebase';
import {
  ChevronLeft, Plus, Trash2, Eye, EyeOff, Check, Loader2, ImageIcon, Upload, ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

// ─── Types locaux ────────────────────────────────────────────────────────────

interface AvailableImage {
  /** Identifiant d'asset si l'image vient de la bibliothèque (sinon undefined) */
  assetId?: string;
  url: string;
  alt: string;
  projectId?: string;
  projectTitle?: string;
  industry?: string;
  alreadyAdded: boolean;
}

type Filter = 'all' | 'unused' | 'used';

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function getNextOrder(items: MosaicItem[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map(i => i.order)) + 1;
}

// ─── Tuile disponible ─────────────────────────────────────────────────────────

function AvailableTile({
  image,
  onAdd,
}: {
  image: AvailableImage;
  onAdd: (image: AvailableImage) => void;
}) {
  return (
    <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-white/[0.03]">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image src={image.url} alt={image.alt} fill sizes="150px" className="object-cover" />
        {image.alreadyAdded ? (
          <div className="absolute inset-0 bg-indigo-900/70 flex items-center justify-center">
            <Check className="w-6 h-6 text-indigo-200" />
          </div>
        ) : (
          <button
            onClick={() => onAdd(image)}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            aria-label="Ajouter à la mosaïque"
          >
            <Plus className="w-7 h-7 text-white" />
          </button>
        )}
      </div>
      {image.projectTitle && (
        <div className="px-2 py-1.5">
          <p className="text-[11px] text-white/50 truncate">{image.projectTitle}</p>
        </div>
      )}
    </div>
  );
}

// ─── Tuile sélectionnée ───────────────────────────────────────────────────────

function SelectedTile({
  item,
  onToggle,
  onRemove,
  onMove,
}: {
  item: MosaicItem;
  onToggle: (id: string, active: boolean) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
}) {
  return (
    <div className={`relative group rounded-lg overflow-hidden border ${item.active ? 'border-indigo-500/40' : 'border-white/5 opacity-50'} bg-white/[0.03]`}>
      <div className="relative aspect-square w-full overflow-hidden">
        <Image src={item.url} alt={item.alt} fill sizes="150px" className="object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
          <button
            onClick={() => onToggle(item.id, !item.active)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            aria-label={item.active ? 'Masquer' : 'Afficher'}
          >
            {item.active ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center"
            aria-label="Retirer"
          >
            <Trash2 className="w-4 h-4 text-red-300" />
          </button>
        </div>
        {/* Boutons ordre */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onMove(item.id, 'up')} className="w-5 h-5 rounded bg-black/60 flex items-center justify-center text-white/70 hover:text-white text-[10px]" aria-label="Remonter">↑</button>
          <button onClick={() => onMove(item.id, 'down')} className="w-5 h-5 rounded bg-black/60 flex items-center justify-center text-white/70 hover:text-white text-[10px]" aria-label="Descendre">↓</button>
        </div>
        {!item.active && (
          <div className="absolute top-2 right-2"><EyeOff className="w-4 h-4 text-white/40" /></div>
        )}
      </div>
      <div className="px-2 py-1.5">
        <p className="text-[10px] text-white/25">#{item.order + 1}{item.projectTitle ? ` · ${item.projectTitle}` : ''}</p>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MosaicAdminPage() {
  const { toast } = useToast();

  const [available, setAvailable] = useState<AvailableImage[]>([]);
  const [mosaicItems, setMosaicItems] = useState<MosaicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    // Chaque source est isolée : une qui échoue (règles, index manquant…)
    // ne doit pas vider toute la page.
    const [allAssets, projectList, mosaic] = await Promise.all([
      getAllAssets().catch(err => {
        console.error('[MOSAIC] getAllAssets a échoué:', err);
        return [];
      }),
      getPortfolioItems().then(p => p as PortfolioItem[]).catch(err => {
        console.error('[MOSAIC] getPortfolioItems a échoué:', err);
        return [] as PortfolioItem[];
      }),
      getAllMosaicItems().catch(err => {
        console.error('[MOSAIC] getAllMosaicItems a échoué:', err);
        return [];
      }),
    ]);

    console.log('[MOSAIC] assets:', allAssets.length, '· projets:', projectList.length, '· mosaïque:', mosaic.length);

    const projById = new Map<string, PortfolioItem>();
    projectList.forEach(p => projById.set(p.id, p));

    // Déduplication par URL : une image peut être à la fois un asset
    // ET référencée dans un projet.
    const byUrl = new Map<string, AvailableImage>();

    // 1) Images des assets uploadés (images uniquement)
    for (const a of allAssets) {
      if (a.type !== 'image' || !a.url) continue;
      const pid = a.usedIn?.find(id => projById.has(id));
      const project = pid ? projById.get(pid) : undefined;
      byUrl.set(a.url, {
        assetId: a.id,
        url: a.url,
        alt: a.fileName || project?.title || 'Image',
        projectId: project?.id,
        projectTitle: project?.title,
        industry: project?.industry,
        alreadyAdded: mosaic.some(m => m.url === a.url),
      });
    }

    // 2) Images des projets (covers + sections) — couvre les images
    //    qui ne sont pas (ou plus) dans la collection assets
    for (const project of projectList) {
      for (const img of extractProjectImages(project)) {
        if (!img.src || byUrl.has(img.src)) continue;
        byUrl.set(img.src, {
          url: img.src,
          alt: img.alt,
          projectId: project.id,
          projectTitle: project.title,
          industry: project.industry,
          alreadyAdded: mosaic.some(m => m.url === img.src),
        });
      }
    }

    setAvailable(Array.from(byUrl.values()));
    setMosaicItems(mosaic);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Recalcule "alreadyAdded" quand la sélection change (sans recharger la base)
  const availableImages: AvailableImage[] = available.map(img => ({
    ...img,
    alreadyAdded: mosaicItems.some(m => m.url === img.url),
  }));

  const filteredImages = availableImages.filter(img => {
    if (filter === 'used') return !!img.projectId;
    if (filter === 'unused') return !img.projectId;
    return true;
  });

  const handleAdd = async (image: AvailableImage) => {
    if (image.alreadyAdded) return;
    try {
      // Firestore refuse les champs undefined → on n'inclut que les présents
      const newItem: Omit<MosaicItem, 'id' | 'createdAt'> = {
        url: image.url,
        alt: image.alt,
        ...(image.assetId ? { assetId: image.assetId } : {}),
        ...(image.projectId ? { projectId: image.projectId } : {}),
        ...(image.projectTitle ? { projectTitle: image.projectTitle } : {}),
        ...(image.industry ? { industry: image.industry } : {}),
        order: getNextOrder(mosaicItems),
        active: true,
      };
      const ref = collection(db, COLLECTIONS.MOSAIC_ITEMS);
      const docRef = await addDoc(ref, { ...newItem, createdAt: Timestamp.now() });
      setMosaicItems(prev => [...prev, { id: docRef.id, createdAt: Timestamp.now(), ...newItem }]);
      toast({ title: 'Image ajoutée à la mosaïque' });
    } catch (err) {
      console.error('[MOSAIC] Erreur addDoc mosaic_items:', err);
      const msg = err instanceof Error ? err.message : '';
      toast({
        title: "Erreur lors de l'ajout",
        description: /permission|insufficient/i.test(msg)
          ? 'Règles Firestore : écriture refusée sur mosaic_items.'
          : msg || undefined,
        variant: 'destructive',
      });
    }
  };

  // Upload : envoie les fichiers en base (assets) puis les ajoute à la mosaïque
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    let nextOrder = getNextOrder(mosaicItems);
    const added: MosaicItem[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const { asset } = await uploadAsset(file);

        // Déjà dans la mosaïque ? (déduplication par hash → même url)
        if (mosaicItems.some(m => m.url === asset.url) || added.some(m => m.url === asset.url)) {
          continue;
        }

        const newItem: Omit<MosaicItem, 'id' | 'createdAt'> = {
          url: asset.url,
          alt: asset.fileName || 'Image',
          assetId: asset.id,
          order: nextOrder++,
          active: true,
        };
        const docRef = await addDoc(collection(db, COLLECTIONS.MOSAIC_ITEMS), {
          ...newItem,
          createdAt: Timestamp.now(),
        });
        added.push({ id: docRef.id, createdAt: Timestamp.now(), ...newItem });
      }

      if (added.length > 0) {
        setMosaicItems(prev => [...prev, ...added]);
        // Rafraîchir la liste des images disponibles
        await loadData();
        toast({ title: `${added.length} image${added.length > 1 ? 's' : ''} ajoutée${added.length > 1 ? 's' : ''} à la mosaïque` });
      } else {
        toast({ title: 'Aucune nouvelle image', description: 'Ces images sont déjà dans la mosaïque.' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: "Erreur lors de l'upload", variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.MOSAIC_ITEMS, id), { active });
      setMosaicItems(prev => prev.map(m => (m.id === id ? { ...m, active } : m)));
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MOSAIC_ITEMS, id));
      setMosaicItems(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Image retirée de la mosaïque' });
    } catch {
      toast({ title: 'Erreur lors de la suppression', variant: 'destructive' });
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const idx = mosaicItems.findIndex(m => m.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= mosaicItems.length) return;

    const updated = [...mosaicItems];
    const a = updated[idx];
    const b = updated[swapIdx];
    const orderA = a.order;
    const orderB = b.order;
    updated[idx] = { ...a, order: orderB };
    updated[swapIdx] = { ...b, order: orderA };
    updated.sort((x, y) => x.order - y.order);
    setMosaicItems(updated);

    try {
      await Promise.all([
        updateDoc(doc(db, COLLECTIONS.MOSAIC_ITEMS, a.id), { order: orderB }),
        updateDoc(doc(db, COLLECTIONS.MOSAIC_ITEMS, b.id), { order: orderA }),
      ]);
    } catch {
      toast({ title: 'Erreur lors du réordonnancement', variant: 'destructive' });
    }
  };

  const activeCount = mosaicItems.filter(m => m.active).length;
  const usedCount = availableImages.filter(i => i.projectId).length;

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-12 text-white">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Mosaïque de réalisations</h1>
                <p className="text-sm text-white/40 mt-0.5">
                  {activeCount} image{activeCount !== 1 ? 's' : ''} visible{activeCount !== 1 ? 's' : ''} sur la page d'accueil
                </p>
              </div>

              {/* Actions */}
              <div className="ml-auto flex items-center gap-3">
                <a
                  href="/#realisations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir sur la home
                </a>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? 'Import en cours…' : 'Importer des images'}
                </button>
              </div>
            </div>

            {/* Bandeau : enregistrement automatique */}
            <div className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.07] text-sm text-white/60">
              <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-white/80">Enregistrement automatique.</strong> Chaque image
                ajoutée, masquée ou réordonnée est sauvegardée instantanément — pas besoin de valider.
                La mosaïque de la page d'accueil se met à jour au prochain chargement.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* ── Colonne gauche : toutes les images en base ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-white">Images hébergées</h2>
                    <span className="text-xs text-white/30">{filteredImages.length} affichées</span>
                  </div>

                  {/* Filtres */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {([
                      ['all', `Toutes (${availableImages.length})`],
                      ['used', `Liées à un projet (${usedCount})`],
                      ['unused', `Non liées (${availableImages.length - usedCount})`],
                    ] as [Filter, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === key ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {filteredImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl text-white/30">
                      <ImageIcon className="w-10 h-10 mb-3" />
                      <p className="text-sm">Aucune image hébergée</p>
                      <p className="text-xs mt-1">Importez des images via l'éditeur de portfolio ou la bibliothèque d'assets</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {filteredImages.map(img => (
                        <AvailableTile key={img.url} image={img} onAdd={handleAdd} />
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Colonne droite : sélection mosaïque ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-white">Mosaïque actuelle</h2>
                    <span className="text-xs text-white/30">{mosaicItems.length} sélectionnée{mosaicItems.length !== 1 ? 's' : ''}</span>
                  </div>

                  {mosaicItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl text-white/30">
                      <Plus className="w-10 h-10 mb-3" />
                      <p className="text-sm">Aucune image sélectionnée</p>
                      <p className="text-xs mt-1">Cliquez sur les images à gauche pour les ajouter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {mosaicItems.map(item => (
                        <SelectedTile
                          key={item.id}
                          item={item}
                          onToggle={handleToggle}
                          onRemove={handleRemove}
                          onMove={moveItem}
                        />
                      ))}
                    </div>
                  )}

                  {mosaicItems.length > 0 && (
                    <p className="mt-4 text-xs text-white/25 leading-relaxed">
                      Les images masquées (œil barré) restent en base mais n'apparaissent pas sur le site.
                      Survolez une tuile et utilisez ↑ ↓ pour réordonner.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
