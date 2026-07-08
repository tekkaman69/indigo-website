'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import { getHomeProjectById, updateHomeProject, getPortfolioItems } from '@/lib/firebase/firestore';
import { uploadImage, generateUniqueFileName } from '@/lib/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { HomeProject, MosaicTemplate, PortfolioItem } from '@/types/firebase';
import type { BusinessCategory } from '@/config/business-categories';
import { MOSAIC_TEMPLATES } from '@/components/showcase/mosaicTemplates';
import ProjectMosaicCard from '@/components/showcase/ProjectMosaicCard';
import MosaicTemplatePicker from './MosaicTemplatePicker';
import MosaicSlotUploader from './MosaicSlotUploader';
import MediaLibraryModal, { type LibraryImage } from './MediaLibraryModal';
import HomeProjectMetaFields from './HomeProjectMetaFields';
import { ChevronLeft, Loader2, Save } from 'lucide-react';

export default function MosaicEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [draft, setDraft] = useState<HomeProject | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<Record<number, File>>({});
  const blobUrlsRef = useRef<string[]>([]);
  const [libraryTargetSlot, setLibraryTargetSlot] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getHomeProjectById(id), getPortfolioItems()])
      .then(([item, allPortfolio]) => {
        if (!item) {
          toast({ title: 'Projet introuvable', variant: 'destructive' });
          router.replace('/admin/mosaic');
          return;
        }
        setDraft(item);
        setPortfolioItems(allPortfolio);
      })
      .catch(err => {
        console.error('Error loading project:', err);
        toast({ title: 'Erreur de chargement', variant: 'destructive' });
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Révoque les blob URLs créées à la fermeture de la page (évite les fuites mémoire)
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleTemplateChange = (template: MosaicTemplate) => {
    setDraft(prev => {
      if (!prev) return prev;
      const slotCount = MOSAIC_TEMPLATES[template].length;
      const nextSlots = Array.from({ length: slotCount }, (_, i) => prev.mosaicSlots?.[i] ?? { url: '' });
      return { ...prev, mosaicTemplate: template, mosaicSlots: nextSlots };
    });
    // Les fichiers en attente au-delà du nouveau nombre de slots ne s'appliquent plus
    setPendingFiles(prev => {
      const slotCount = MOSAIC_TEMPLATES[template].length;
      const next: Record<number, File> = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (Number(k) < slotCount) next[Number(k)] = v;
      });
      return next;
    });
  };

  const handleClearTemplate = () => {
    setDraft(prev => (prev ? { ...prev, mosaicTemplate: '' as unknown as MosaicTemplate, mosaicSlots: [] } : prev));
    setPendingFiles({});
  };

  const handleSlotFile = (index: number, file: File) => {
    const blobUrl = URL.createObjectURL(file);
    blobUrlsRef.current.push(blobUrl);
    setPendingFiles(prev => ({ ...prev, [index]: file }));
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...(prev.mosaicSlots ?? [])];
      slots[index] = { url: blobUrl };
      return { ...prev, mosaicSlots: slots };
    });
  };

  const handleFocalPointChange = (index: number, focalPoint: { x: number; y: number }) => {
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...(prev.mosaicSlots ?? [])];
      slots[index] = { ...slots[index], focalPoint };
      return { ...prev, mosaicSlots: slots };
    });
  };

  const handleZoomChange = (index: number, zoom: number) => {
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...(prev.mosaicSlots ?? [])];
      slots[index] = { ...slots[index], zoom };
      return { ...prev, mosaicSlots: slots };
    });
  };

  const handlePickFromLibrary = (image: LibraryImage) => {
    if (libraryTargetSlot === null) return;
    const index = libraryTargetSlot;
    // Image déjà hébergée : URL réelle directe, aucun upload nécessaire.
    setPendingFiles(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...(prev.mosaicSlots ?? [])];
      slots[index] = { url: image.url };
      return { ...prev, mosaicSlots: slots };
    });
    setLibraryTargetSlot(null);
  };

  const handleCategoryChange = (category: string) => {
    setDraft(prev => (prev ? { ...prev, businessCategory: (category || undefined) as BusinessCategory | undefined } : prev));
  };

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    try {
      // Upload des fichiers en attente, remplacement des blob URLs par les vraies URLs Storage
      const finalSlots = [...(draft.mosaicSlots ?? [])];
      for (const [indexStr, file] of Object.entries(pendingFiles)) {
        const index = Number(indexStr);
        const path = `portfolio/${generateUniqueFileName(file.name)}`;
        const url = await uploadImage(file, path);
        finalSlots[index] = { url };
      }

      await updateHomeProject(draft.id, {
        title: draft.title,
        businessCategory: draft.businessCategory,
        mosaicTemplate: (draft.mosaicTemplate || undefined) as MosaicTemplate | undefined,
        mosaicSlots: draft.mosaicTemplate ? finalSlots : undefined,
        linkedPortfolioId: draft.linkedPortfolioId,
        published: draft.published,
      });

      toast({ title: 'Projet enregistré', description: 'Les changements sont visibles sur la home.' });
      router.push('/admin/mosaic');
    } catch (err) {
      console.error('Error saving home project:', err);
      toast({ title: 'Erreur', description: "L'enregistrement a échoué", variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <Template>
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        </Template>
      </AdminGuard>
    );
  }

  if (!draft) return null;

  const slots = draft.mosaicTemplate ? MOSAIC_TEMPLATES[draft.mosaicTemplate] : [];

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-12 text-white">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/mosaic" className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{draft.title || 'Projet home'}</h1>
                <p className="text-sm text-white/40 mt-0.5">
                  Titre, catégorie, gabarit et visuels de la carte affichée sur la home
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Colonne gauche — contrôles */}
              <div className="lg:col-span-5 space-y-6">
                <HomeProjectMetaFields
                  title={draft.title}
                  businessCategory={draft.businessCategory}
                  linkedPortfolioId={draft.linkedPortfolioId}
                  published={draft.published}
                  portfolioItems={portfolioItems}
                  onTitleChange={(title) => setDraft(prev => (prev ? { ...prev, title } : prev))}
                  onCategoryChange={handleCategoryChange}
                  onLinkedPortfolioChange={(linkedId) => setDraft(prev => (prev ? { ...prev, linkedPortfolioId: linkedId || undefined } : prev))}
                  onPublishedChange={(published) => setDraft(prev => (prev ? { ...prev, published } : prev))}
                  disabled={isSaving}
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80">Gabarit de mosaïque</label>
                  <MosaicTemplatePicker
                    value={draft.mosaicTemplate ?? ''}
                    onChange={handleTemplateChange}
                    onClear={handleClearTemplate}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-white/30">
                    Aucun gabarit = la carte affiche simplement l'image de couverture.
                  </p>
                </div>

                {draft.mosaicTemplate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Visuels</label>
                    {slots.map((slot, i) => (
                      <MosaicSlotUploader
                        key={i}
                        index={i}
                        url={draft.mosaicSlots?.[i]?.url ?? ''}
                        aspect={slot.aspect}
                        focalPoint={draft.mosaicSlots?.[i]?.focalPoint}
                        zoom={draft.mosaicSlots?.[i]?.zoom}
                        onFileSelected={(file) => handleSlotFile(i, file)}
                        onPickFromLibrary={() => setLibraryTargetSlot(i)}
                        onFocalPointChange={(fp) => handleFocalPointChange(i, fp)}
                        onZoomChange={(z) => handleZoomChange(i, z)}
                        disabled={isSaving}
                      />
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <Link
                    href="/admin/mosaic"
                    className="px-5 py-2.5 rounded-lg border border-white/15 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-colors"
                  >
                    Annuler
                  </Link>
                </div>
              </div>

              {/* Colonne droite — aperçu live, identique au rendu de production */}
              <div className="lg:col-span-7">
                <div className="sticky top-6">
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">
                    Aperçu en temps réel — identique à la home
                  </p>
                  <div className="max-w-md mx-auto lg:mx-0">
                    <ProjectMosaicCard item={draft} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MediaLibraryModal
          open={libraryTargetSlot !== null}
          onOpenChange={(open) => { if (!open) setLibraryTargetSlot(null); }}
          onSelect={handlePickFromLibrary}
        />
      </Template>
    </AdminGuard>
  );
}
